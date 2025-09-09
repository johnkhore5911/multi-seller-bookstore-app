// src/components/OrderCard.js
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../styles/colors';
import StatusBadge from './StatusBadge';

const OrderCard = ({ order, userType, onStatusUpdate, style }) => {
  const total = parseFloat(order.price) * order.quantity;

  const handleStatusUpdate = (newStatus) => {
    if (onStatusUpdate) {
      onStatusUpdate(order.id, newStatus);
    }
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <Text style={styles.orderId}>Order #{order.id}</Text>
        <StatusBadge status={order.status} />
      </View>
      
      <View style={styles.content}>
        <Image 
          source={{ uri: order.image_url || 'https://via.placeholder.com/60x80' }} 
          style={styles.bookImage}
          resizeMode="cover"
        />
        
        <View style={styles.orderInfo}>
          <Text style={styles.title} numberOfLines={2}>{order.title}</Text>
          <Text style={styles.customerInfo}>
            {userType === 'seller' ? `Buyer: ${order.buyer_name}` : `Seller: ${order.seller_name}`}
          </Text>
          <Text style={styles.quantity}>Quantity: {order.quantity}</Text>
          <Text style={styles.total}>Total: ₹{total.toFixed(2)}</Text>
        </View>
      </View>
      
      {userType === 'seller' && order.status === 'Pending' && (
        <View style={styles.actions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleStatusUpdate('Shipped')}
          >
            <Text style={styles.actionButtonText}>Mark as Shipped</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    elevation: 2,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderId: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  content: {
    flexDirection: 'row',
  },
  bookImage: {
    width: 60,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  orderInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  customerInfo: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  quantity: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 4,
  },
  total: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
  actions: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  actionButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: 'flex-start',
  },
  actionButtonText: {
    color: colors.background,
    fontSize: 14,
    fontWeight: '600',
  },
});

export default OrderCard;
