// src/components/CartItem.js
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../styles/colors';

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  const total = parseFloat(item.price) * item.quantity;

  const incrementQuantity = () => {
    onUpdateQuantity(item.book_id, item.quantity + 1);
  };

  const decrementQuantity = () => {
    if (item.quantity > 1) {
      onUpdateQuantity(item.book_id, item.quantity - 1);
    }
  };

  const handleRemove = () => {
    onRemove(item.book_id);
  };

  return (
    <View style={styles.container}>
      <Image 
        source={{ uri: item.image_url || 'https://via.placeholder.com/80x100' }} 
        style={styles.bookImage}
        resizeMode="cover"
      />
      <View style={styles.itemInfo}>
        <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.seller}>by {item.seller_name}</Text>
        <Text style={styles.price}>₹{parseFloat(item.price).toFixed(2)}</Text>
        
        <View style={styles.quantityContainer}>
          <TouchableOpacity 
            style={styles.quantityButton}
            onPress={decrementQuantity}
            disabled={item.quantity <= 1}
          >
            <Ionicons name="remove" size={16} color={item.quantity <= 1 ? colors.textSecondary : colors.primary} />
          </TouchableOpacity>
          
          <Text style={styles.quantity}>{item.quantity}</Text>
          
          <TouchableOpacity 
            style={styles.quantityButton}
            onPress={incrementQuantity}
          >
            <Ionicons name="add" size={16} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.rightSection}>
        <TouchableOpacity style={styles.removeButton} onPress={handleRemove}>
          <Ionicons name="trash-outline" size={20} color={colors.error} />
        </TouchableOpacity>
        <Text style={styles.total}>₹{total.toFixed(2)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
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
  bookImage: {
    width: 60,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  seller: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  price: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 8,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  quantity: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginHorizontal: 16,
    minWidth: 24,
    textAlign: 'center',
  },
  rightSection: {
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 12,
  },
  removeButton: {
    padding: 8,
  },
  total: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
});

export default CartItem;
