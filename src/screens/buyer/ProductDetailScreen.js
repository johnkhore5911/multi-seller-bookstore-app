// src/screens/buyer/ProductDetailScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  Dimensions,
  StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../styles/colors';
import { globalStyles } from '../../styles/globalStyles';
import { LoadingSpinner, CustomButton } from '../../components';
import { fetchBookById } from '../../services/bookService';
import { addToCart } from '../../services/cartService';

const { width, height } = Dimensions.get('window');

export default function ProductDetailScreen({ route, navigation }) {
  const { book } = route.params; // Book object passed from StorefrontScreen
  const [bookDetails, setBookDetails] = useState(book || null);
  const [loading, setLoading] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!bookDetails || !bookDetails.description) {
      loadBookDetails();
    }
  }, []);

  const loadBookDetails = async () => {
    if (!book?.id) return;

    setLoading(true);
    try {
      const details = await fetchBookById(book.id);
      setBookDetails(details);
    } catch (error) {
      console.error('Error loading book details:', error);
      Alert.alert('Error', 'Failed to load book details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    setAddingToCart(true);
    try {
      await addToCart(bookDetails.id, quantity);
      
      Alert.alert(
        'Added to Cart!',
        `${bookDetails.title} has been added to your cart.`,
        [
          { text: 'Continue Shopping', style: 'cancel' },
          { 
            text: 'View Cart', 
            onPress: () => navigation.navigate('Cart') 
          }
        ]
      );
    } catch (error) {
      console.error('Error adding to cart:', error);
      Alert.alert(
        'Error',
        error.message || 'Failed to add book to cart. Please try again.'
      );
    } finally {
      setAddingToCart(false);
    }
  };

  const increaseQuantity = () => {
    if (quantity < bookDetails.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  if (loading && !bookDetails) {
    return (
      <SafeAreaView style={globalStyles.container}>
        <LoadingSpinner text="Loading book details..." />
      </SafeAreaView>
    );
  }

  if (!bookDetails) {
    return (
      <SafeAreaView style={globalStyles.container}>
        <View style={globalStyles.centerContainer}>
          <Text style={styles.errorText}>Book not found</Text>
          <TouchableOpacity
            style={globalStyles.button}
            onPress={() => navigation.goBack()}
          >
            <Text style={globalStyles.buttonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={colors.primary} barStyle="light-content" />
      
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Book Image Section */}
        <View style={styles.imageContainer}>
          <Image
            source={{ 
              uri: bookDetails.image_url || 'https://via.placeholder.com/300x400?text=Book+Cover'
            }}
            style={styles.bookImage}
            resizeMode="cover"
          />
          
          {/* Stock Badge */}
          {bookDetails.stock <= 5 && (
            <View style={[styles.stockBadge, bookDetails.stock === 0 && styles.outOfStockBadge]}>
              <Text style={[styles.stockBadgeText, bookDetails.stock === 0 && styles.outOfStockText]}>
                {bookDetails.stock === 0 ? 'Out of Stock' : `Only ${bookDetails.stock} left`}
              </Text>
            </View>
          )}
        </View>

        {/* Book Details Section */}
        <View style={styles.contentContainer}>
          {/* Title and Price */}
          <View style={styles.titleSection}>
            <Text style={styles.bookTitle}>{bookDetails.title}</Text>
            <Text style={styles.bookPrice}>₹{parseFloat(bookDetails.price).toFixed(2)}</Text>
          </View>

          {/* Seller Information */}
          <View style={styles.sellerSection}>
            <Ionicons name="storefront-outline" size={16} color={colors.textSecondary} />
            <Text style={styles.sellerText}>Sold by {bookDetails.seller_name}</Text>
          </View>

          {/* Description */}
          <View style={styles.descriptionSection}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.descriptionText}>
              {bookDetails.description || 'No description available for this book.'}
            </Text>
          </View>

          {/* Book Details */}
          <View style={styles.detailsSection}>
            <Text style={styles.sectionTitle}>Book Details</Text>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Stock Available:</Text>
              <Text style={[
                styles.detailValue,
                { color: bookDetails.stock > 0 ? colors.success : colors.error }
              ]}>
                {bookDetails.stock} copies
              </Text>
            </View>
          </View>

          {/* Quantity Selector */}
          {bookDetails.stock > 0 && (
            <View style={styles.quantitySection}>
              <Text style={styles.sectionTitle}>Quantity</Text>
              <View style={styles.quantityContainer}>
                <TouchableOpacity
                  style={[styles.quantityButton, quantity <= 1 && styles.quantityButtonDisabled]}
                  onPress={decreaseQuantity}
                  disabled={quantity <= 1}
                >
                  <Ionicons name="remove" size={20} color={quantity <= 1 ? colors.textSecondary : colors.primary} />
                </TouchableOpacity>
                
                <Text style={styles.quantityText}>{quantity}</Text>
                
                <TouchableOpacity
                  style={[styles.quantityButton, quantity >= bookDetails.stock && styles.quantityButtonDisabled]}
                  onPress={increaseQuantity}
                  disabled={quantity >= bookDetails.stock}
                >
                  <Ionicons name="add" size={20} color={quantity >= bookDetails.stock ? colors.textSecondary : colors.primary} />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Fixed Bottom Section - Add to Cart */}
      <View style={styles.bottomSection}>
        <View style={styles.priceContainer}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalPrice}>
            ₹{(parseFloat(bookDetails.price) * quantity).toFixed(2)}
          </Text>
        </View>
        
        <CustomButton
          title={addingToCart ? 'Adding to Cart...' : 'Add to Cart'}
          onPress={handleAddToCart}
          loading={addingToCart}
          disabled={addingToCart || bookDetails.stock === 0}
          style={[
            styles.addToCartButton,
            bookDetails.stock === 0 && styles.disabledButton
          ]}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContainer: {
    flex: 1,
  },
  imageContainer: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingVertical: 24,
    position: 'relative',
  },
  bookImage: {
    width: width * 0.6,
    height: width * 0.8,
    borderRadius: 12,
    elevation: 4,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  stockBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: colors.warning,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  outOfStockBadge: {
    backgroundColor: colors.error,
  },
  stockBadgeText: {
    color: colors.background,
    fontSize: 12,
    fontWeight: '600',
  },
  outOfStockText: {
    color: colors.background,
  },
  contentContainer: {
    padding: 20,
  },
  titleSection: {
    marginBottom: 16,
  },
  bookTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
    lineHeight: 32,
  },
  bookPrice: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
  },
  sellerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: colors.surface,
    borderRadius: 8,
  },
  sellerText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 8,
    fontWeight: '500',
  },
  descriptionSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
  },
  detailsSection: {
    marginBottom: 24,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  detailLabel: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  quantitySection: {
    marginBottom: 20,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  quantityButtonDisabled: {
    opacity: 0.5,
  },
  quantityText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginHorizontal: 20,
    minWidth: 30,
    textAlign: 'center',
  },
  bottomSection: {
    backgroundColor: colors.background,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    elevation: 4,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 18,
    color: colors.textSecondary,
  },
  totalPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
  },
  addToCartButton: {
    marginBottom: 0,
  },
  disabledButton: {
    opacity: 0.5,
  },
  errorText: {
    fontSize: 16,
    color: colors.error,
    textAlign: 'center',
    marginBottom: 20,
  },
});
