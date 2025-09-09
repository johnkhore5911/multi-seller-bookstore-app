// src/screens/buyer/BuyerOrdersScreen.js
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  RefreshControl,
  TouchableOpacity,
  StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { colors } from '../../styles/colors';
import { globalStyles } from '../../styles/globalStyles';
import { OrderCard, LoadingSpinner, EmptyState, Header } from '../../components';
import { getBuyerOrders } from '../../services/orderService';

export default function BuyerOrdersScreen({ navigation }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'pending', 'shipped', 'delivered'

  // Load orders when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadOrders();
    }, [])
  );

  const loadOrders = async (showLoader = true) => {
    if (showLoader) setLoading(true);
    setError(null);
    
    try {
      const data = await getBuyerOrders();
      // Sort orders by id descending (newest first)
      const sortedOrders = data.sort((a, b) => b.id - a.id);
      setOrders(sortedOrders);
    } catch (error) {
      console.error('Error loading orders:', error);
      setError('Failed to load orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await loadOrders(false);
    } finally {
      setRefreshing(false);
    }
  }, []);

  const getFilteredOrders = () => {
    if (filter === 'all') return orders;
    return orders.filter(order => order.status.toLowerCase() === filter);
  };

  const getOrderCounts = () => {
    return {
      all: orders.length,
      pending: orders.filter(o => o.status.toLowerCase() === 'pending').length,
      shipped: orders.filter(o => o.status.toLowerCase() === 'shipped').length,
      delivered: orders.filter(o => o.status.toLowerCase() === 'delivered').length,
    };
  };

  const renderFilterButton = (filterType, label, icon) => {
    const isActive = filter === filterType;
    const counts = getOrderCounts();
    const count = counts[filterType];

    return (
      <TouchableOpacity
        style={[styles.filterButton, isActive && styles.filterButtonActive]}
        onPress={() => setFilter(filterType)}
      >
        <View style={styles.filterButtonContent}>
          <Ionicons
            name={icon}
            size={16}
            color={isActive ? colors.background : colors.textSecondary}
          />
          <Text style={[
            styles.filterButtonText,
            isActive && styles.filterButtonTextActive
          ]}>
            {label}
          </Text>
          {count > 0 && (
            <View style={[styles.countBadge, isActive && styles.countBadgeActive]}>
              <Text style={[
                styles.countBadgeText,
                isActive && styles.countBadgeTextActive
              ]}>
                {count}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderOrderItem = ({ item }) => (
    <OrderCard
      order={item}
      userType="buyer"
      style={styles.orderCard}
    />
  );

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.titleSection}>
        <Text style={styles.pageTitle}>My Orders</Text>
        <Text style={styles.subtitle}>
          Track your book orders and delivery status
        </Text>
      </View>
      
      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        {renderFilterButton('all', 'All', 'list-outline')}
        {renderFilterButton('pending', 'Pending', 'time-outline')}
        {renderFilterButton('shipped', 'Shipped', 'airplane-outline')}
        {renderFilterButton('delivered', 'Delivered', 'checkmark-circle-outline')}
      </View>
    </View>
  );

  const renderEmptyComponent = () => {
    const filteredOrders = getFilteredOrders();
    
    if (orders.length === 0) {
      return (
        <EmptyState
          icon="receipt-outline"
          message="No orders yet"
          subMessage="Start shopping to see your orders here!"
          actionButton="Start Shopping"
          onActionPress={() => navigation.navigate('Storefront')}
        />
      );
    }
    
    if (filteredOrders.length === 0) {
      const filterLabels = {
        pending: 'pending orders',
        shipped: 'shipped orders',
        delivered: 'delivered orders'
      };
      
      return (
        <EmptyState
          icon="filter-outline"
          message={`No ${filterLabels[filter] || 'orders'}`}
          subMessage="Try selecting a different filter or place a new order"
          actionButton="Show All Orders"
          onActionPress={() => setFilter('all')}
        />
      );
    }
    
    return null;
  };

  if (loading) {
    return (
      <SafeAreaView style={globalStyles.container}>
        <Header title="Orders" />
        <LoadingSpinner text="Loading your orders..." />
      </SafeAreaView>
    );
  }

  const filteredOrders = getFilteredOrders();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={colors.primary} barStyle="light-content" />
      <Header title="Orders" />

      <FlatList
        data={filteredOrders}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyComponent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        contentContainerStyle={[
          styles.listContainer,
          filteredOrders.length === 0 && styles.emptyListContainer
        ]}
        showsVerticalScrollIndicator={false}
      />

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => loadOrders()}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerContainer: {
    backgroundColor: colors.background,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  titleSection: {
    marginBottom: 20,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  filterButton: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 8,
    marginHorizontal: 2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterButtonContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
  filterButtonTextActive: {
    color: colors.background,
  },
  countBadge: {
    backgroundColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginTop: 2,
    minWidth: 20,
    alignItems: 'center',
  },
  countBadgeActive: {
    backgroundColor: colors.background,
  },
  countBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.textSecondary,
  },
  countBadgeTextActive: {
    color: colors.primary,
  },
  listContainer: {
    paddingBottom: 16,
  },
  emptyListContainer: {
    flexGrow: 1,
  },
  orderCard: {
    marginHorizontal: 16,
    marginVertical: 6,
  },
  errorContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.error,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  errorText: {
    flex: 1,
    color: colors.background,
    fontSize: 14,
    fontWeight: '500',
  },
  retryButton: {
    backgroundColor: colors.background,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  retryButtonText: {
    color: colors.error,
    fontSize: 14,
    fontWeight: '600',
  },
});
