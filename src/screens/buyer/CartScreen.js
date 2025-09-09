// src/screens/buyer/CartScreen.js
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
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
import { CartItem, LoadingSpinner, EmptyState, Header, CustomButton } from '../../components';
import { getCart, updateCartItem, removeFromCart, clearCart } from '../../services/cartService';
import { createOrder } from '../../services/orderService';

export default function CartScreen({ navigation }) {
  const [cartData, setCartData] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [updatingItem, setUpdatingItem] = useState(null);
  const [placingOrder, setPlacingOrder] = useState(false);

  // Load cart when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadCart();
    }, [])
  );

  const loadCart = async (showLoader = true) => {
    if (showLoader) setLoading(true);
    try {
      const data = await getCart();
      setCartData(data);
    } catch (error) {
      console.error('Error loading cart:', error);
      Alert.alert('Error', 'Failed to load cart. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await loadCart(false);
    } finally {
      setRefreshing(false);
    }
  }, []);

  const handleUpdateQuantity = async (bookId, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveItem(bookId);
      return;
    }

    setUpdatingItem(bookId);
    try {
      await updateCartItem(bookId, newQuantity);
      await loadCart(false);
    } catch (error) {
      console.error('Error updating quantity:', error);
      Alert.alert('Error', 'Failed to update quantity. Please try again.');
    } finally {
      setUpdatingItem(null);
    }
  };

  const handleRemoveItem = async (bookId) => {
    Alert.alert(
      'Remove Item',
      'Are you sure you want to remove this item from your cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            setUpdatingItem(bookId);
            try {
              await removeFromCart(bookId);
              await loadCart(false);
            } catch (error) {
              console.error('Error removing item:', error);
              Alert.alert('Error', 'Failed to remove item. Please try again.');
            } finally {
              setUpdatingItem(null);
            }
          }
        }
      ]
    );
  };

  const handleClearCart = () => {
    Alert.alert(
      'Clear Cart',
      'Are you sure you want to remove all items from your cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              await clearCart();
              await loadCart(false);
            } catch (error) {
              console.error('Error clearing cart:', error);
              Alert.alert('Error', 'Failed to clear cart. Please try again.');
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  const handlePlaceOrder = async () => {
    if (cartData.items.length === 0) {
      Alert.alert('Empty Cart', 'Please add items to your cart before placing an order.');
      return;
    }

    Alert.alert(
      'Place Order',
      `Are you sure you want to place this order for ₹${cartData.total.toFixed(2)}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Place Order',
          onPress: async () => {
            setPlacingOrder(true);
            try {
              await createOrder();
              
              Alert.alert(
                'Order Placed!',
                'Your order has been placed successfully. You can track it in the Orders tab.',
                [
                  {
                    text: 'View Orders',
                    onPress: () => navigation.navigate('Orders')
                  },
                  {
                    text: 'Continue Shopping',
                    onPress: () => navigation.navigate('Storefront')
                  }
                ]
              );
              
              // Reload cart (should be empty now)
              await loadCart(false);
              
            } catch (error) {
              console.error('Error placing order:', error);
              Alert.alert(
                'Order Failed',
                error.message || 'Failed to place order. Please try again.'
              );
            } finally {
              setPlacingOrder(false);
            }
          }
        }
      ]
    );
  };

  const renderCartItem = ({ item }) => (
    <CartItem
      item={item}
      onUpdateQuantity={handleUpdateQuantity}
      onRemove={handleRemoveItem}
      updating={updatingItem === item.book_id}
    />
  );

  const renderEmptyCart = () => (
    <EmptyState
      icon="cart-outline"
      message="Your cart is empty"
      subMessage="Add some books to your cart to get started!"
      actionButton="Continue Shopping"
      onActionPress={() => navigation.navigate('Storefront')}
    />
  );

  const renderHeader = () => (
    <View style={styles.headerSection}>
      <View style={styles.cartHeader}>
        <Text style={styles.cartTitle}>Shopping Cart</Text>
        {cartData.items.length > 0 && (
          <TouchableOpacity onPress={handleClearCart} style={styles.clearButton}>
            <Text style={styles.clearButtonText}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>
      
      {cartData.items.length > 0 && (
        <Text style={styles.itemCount}>
          {cartData.items.length} item{cartData.items.length !== 1 ? 's' : ''} in your cart
        </Text>
      )}
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={globalStyles.container}>
        <Header title="Cart" />
        <LoadingSpinner text="Loading your cart..." />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* <StatusBar backgroundColor={colors.primary} barStyle="light-content" /> */}
      <Header title="Cart" />

      <View style={styles.content}>
        <FlatList
          data={cartData.items}
          renderItem={renderCartItem}
          keyExtractor={(item) => item.book_id.toString()}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={renderEmptyCart}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.listContainer,
            cartData.items.length === 0 && styles.emptyListContainer
          ]}
        />

        {/* Bottom Summary Section */}
        {cartData.items.length > 0 && (
          <View style={styles.summarySection}>
            {/* Order Summary */}
            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Order Summary</Text>
              
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>
                  Subtotal ({cartData.items.reduce((sum, item) => sum + item.quantity, 0)} items)
                </Text>
                <Text style={styles.summaryValue}>₹{cartData.total.toFixed(2)}</Text>
              </View>
              
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Delivery</Text>
                <Text style={[styles.summaryValue, { color: colors.success }]}>Free</Text>
              </View>
              
              <View style={styles.divider} />
              
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>₹{cartData.total.toFixed(2)}</Text>
              </View>
            </View>

            {/* Place Order Button */}
            <CustomButton
              title={placingOrder ? 'Placing Order...' : 'Place Order'}
              onPress={handlePlaceOrder}
              loading={placingOrder}
              disabled={placingOrder}
              style={styles.placeOrderButton}
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
  },
  headerSection: {
    padding: 16,
    backgroundColor: colors.background,
  },
  cartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cartTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  clearButtonText: {
    fontSize: 14,
    color: colors.error,
    fontWeight: '600',
  },
  itemCount: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  listContainer: {
    paddingBottom: 16,
  },
  emptyListContainer: {
    flexGrow: 1,
  },
  summarySection: {
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    elevation: 8,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  summaryCard: {
    margin: 16,
    padding: 16,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 12,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  totalValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
  },
  placeOrderButton: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
});
