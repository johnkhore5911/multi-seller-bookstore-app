// src/screens/seller/SalesDashboardScreen.js
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { colors } from '../../styles/colors';
import { globalStyles } from '../../styles/globalStyles';
import { OrderCard, LoadingSpinner, EmptyState, Header } from '../../components';
import { getSellerOrders } from '../../services/orderService';

const { width } = Dimensions.get('window');

export default function SalesDashboardScreen({ navigation }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  useFocusEffect(
    useCallback(() => {
      loadSalesData();
    }, [])
  );

  const loadSalesData = async (showLoader = true) => {
    if (showLoader) setLoading(true);
    setError(null);
    try {
      const data = await getSellerOrders();
      setOrders(data);
    } catch (e) {
      setError('Failed to load sales data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadSalesData(false);
    setRefreshing(false);
  }, []);

  const calculateMetrics = () => {
    const totalRevenue = orders.reduce((sum, order) => sum + (parseFloat(order.price) * order.quantity), 0);
    const totalSales = orders.length;
    const pendingOrders = orders.filter(o => o.status === 'Pending').length;
    const itemsSold = orders.reduce((sum, order) => sum + order.quantity, 0);

    return { totalRevenue, totalSales, pendingOrders, itemsSold };
  };

  const { totalRevenue, totalSales, pendingOrders, itemsSold } = calculateMetrics();
  const recentOrders = orders.slice(0, 5); // Show the 5 most recent orders

  const renderMetricCard = (icon, label, value, color) => (
    <View style={styles.metricCard}>
      <View style={[styles.metricIcon, { backgroundColor: `${color}20` }]}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <View>
        <Text style={styles.metricValue}>{value}</Text>
        <Text style={styles.metricLabel}>{label}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={globalStyles.container}>
      <Header title="Sales Dashboard" />

      {loading ? (
        <LoadingSpinner text="Loading your dashboard..." />
      ) : error ? (
        <EmptyState
          icon="alert-circle-outline"
          message={error}
          actionButton="Try Again"
          onActionPress={() => loadSalesData()}
        />
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.primary]}
            />
          }
        >
          <Text style={styles.sectionTitle}>Performance Overview</Text>
          <View style={styles.metricsGrid}>
            {renderMetricCard('cash-outline', 'Total Revenue', `₹${totalRevenue.toFixed(2)}`, colors.success)}
            {renderMetricCard('cart-outline', 'Items Sold', itemsSold.toString(), colors.secondary)}
            {renderMetricCard('receipt-outline', 'Total Sales', totalSales.toString(), colors.primary)}
            {renderMetricCard('time-outline', 'Pending Orders', pendingOrders.toString(), colors.warning)}
          </View>

          <View style={styles.recentOrdersSection}>
            <View style={styles.recentOrdersHeader}>
              <Text style={styles.sectionTitle}>Recent Orders</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Orders')}>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>

            {recentOrders.length > 0 ? (
              recentOrders.map(order => (
                <OrderCard
                  key={order.id}
                  order={order}
                  userType="seller"
                  onPress={() => navigation.navigate('OrderDetails', { orderId: order.id })}
                />
              ))
            ) : (
              <EmptyState
                icon="receipt-outline"
                message="No orders yet"
                subMessage="Your recent sales will appear here once you make a sale."
              />
            )}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  metricCard: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    width: (width - 48) / 2, // 2 cards per row with padding
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  metricIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  metricLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  recentOrdersSection: {
    marginTop: 16,
  },
  recentOrdersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
});
