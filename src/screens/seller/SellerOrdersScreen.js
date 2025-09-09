// src/screens/seller/SellerOrdersScreen.js
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  RefreshControl,
  StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { colors } from '../../styles/colors';
import { globalStyles } from '../../styles/globalStyles';
import { OrderCard, LoadingSpinner, EmptyState, Header } from '../../components';
import { getSellerOrders, updateOrderStatus } from '../../services/orderService';

export default function SellerOrdersScreen({ navigation }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  useFocusEffect(
    useCallback(() => {
      loadOrders();
    }, [])
  );

  const loadOrders = async (showLoader = true) => {
    if (showLoader) setLoading(true);
    setError(null);
    try {
      const data = await getSellerOrders();
      setOrders(data.sort((a, b) => b.id - a.id));
    } catch (e) {
      setError('Failed to load your orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadOrders(false);
    setRefreshing(false);
  }, []);

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      loadOrders(false);
      Alert.alert('Success', `Order #${orderId} has been marked as ${newStatus}.`);
    } catch (err) {
      Alert.alert('Error', 'Failed to update order status.');
    }
  };

  const getFilteredOrders = () => {
    if (filter === 'all') return orders;
    return orders.filter(order => order.status.toLowerCase() === filter);
  };

  const renderFilterButton = (filterType, label, icon) => {
    const isActive = filter === filterType;
    const count = orders.filter(o => filterType === 'all' || o.status.toLowerCase() === filterType).length;
    
    return (
      <TouchableOpacity
        style={[styles.filterButton, isActive && styles.filterButtonActive]}
        onPress={() => setFilter(filterType)}
      >
        <Ionicons name={icon} size={22} color={isActive ? colors.background : colors.text} />
        <View>
          <Text style={[styles.filterButtonLabel, isActive && styles.filterButtonTextActive]}>
            {label}
          </Text>
          <Text style={[styles.filterButtonCount, isActive && styles.filterButtonTextActive]}>
            {count} Orders
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderOrderItem = ({ item }) => (
    <OrderCard
      order={item}
      userType="seller"
      onStatusUpdate={handleStatusUpdate}
    />
  );
  
  const renderHeader = () => (
    <View style={styles.headerSection}>
      <Text style={styles.pageTitle}>Manage Orders</Text>
      <Text style={styles.subtitle}>View and update the status of your customer orders.</Text>
      
      {/* --- IMPROVED 2x2 GRID --- */}
      <View style={styles.filterGrid}>
        {renderFilterButton('all', 'All Orders', 'list-outline')}
        {renderFilterButton('pending', 'Pending', 'time-outline')}
        {renderFilterButton('shipped', 'Shipped', 'airplane-outline')}
        {renderFilterButton('delivered', 'Delivered', 'checkmark-done-outline')}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={globalStyles.container}>
      <Header title="Customer Orders" />
      
      {loading ? (
        <LoadingSpinner text="Loading your orders..." />
      ) : error ? (
        <EmptyState
          icon="alert-circle-outline"
          message={error}
          actionButton="Try Again"
          onActionPress={() => loadOrders()}
        />
      ) : (
        <FlatList
          data={getFilteredOrders()}
          renderItem={renderOrderItem}
          keyExtractor={(item) => item.id.toString()}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={
             <EmptyState
                icon="receipt-outline"
                message={orders.length === 0 ? "No orders yet" : `No ${filter} orders`}
                subMessage={orders.length === 0 ? "Your customer orders will appear here." : "Try a different filter."}
              />
          }
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.primary]}
            />
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    paddingBottom: 20,
  },
  headerSection: {
    padding: 16,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 20,
  },
  // --- NEW GRID STYLES ---
  filterGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  filterButton: {
    width: '48%', // Two buttons per row with space
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterButtonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginLeft: 12,
  },
  filterButtonCount: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 12,
    marginTop: 2,
  },
  filterButtonTextActive: {
    color: colors.background,
  },
});
