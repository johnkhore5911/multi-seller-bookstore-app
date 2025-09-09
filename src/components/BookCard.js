// src/components/BookCard.js
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../styles/colors';

const BookCard = ({ book, onPress, showSellerName = true, style }) => {
  const handlePress = () => {
    if (onPress) {
      onPress(book);
    }
  };

  return (
    <TouchableOpacity style={[styles.card, style]} onPress={handlePress}>
      <Image 
        source={{ uri: book.image_url || 'https://via.placeholder.com/150x200' }} 
        style={styles.bookImage}
        resizeMode="cover"
      />
      <View style={styles.bookInfo}>
        <Text style={styles.title} numberOfLines={2}>{book.title}</Text>
        <Text style={styles.price}>₹{parseFloat(book.price).toFixed(2)}</Text>
        {showSellerName && book.seller_name && (
          <Text style={styles.seller}>by {book.seller_name}</Text>
        )}
        {book.stock !== undefined && (
          <Text style={[styles.stock, book.stock > 0 ? styles.inStock : styles.outOfStock]}>
            {book.stock > 0 ? `${book.stock} in stock` : 'Out of stock'}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 12,
    margin: 8,
    elevation: 3,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    width: '45%',
  },
  bookImage: {
    width: '100%',
    height: 180,
    borderRadius: 8,
    marginBottom: 8,
  },
  bookInfo: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
    lineHeight: 18,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 4,
  },
  seller: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  stock: {
    fontSize: 11,
    fontWeight: '500',
  },
  inStock: {
    color: colors.success,
  },
  outOfStock: {
    color: colors.error,
  },
});

export default BookCard;
