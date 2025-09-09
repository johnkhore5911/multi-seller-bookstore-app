// src/screens/seller/EditBookScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useForm, Controller } from 'react-hook-form';
import { colors } from '../../styles/colors';
import { globalStyles } from '../../styles/globalStyles';
import { 
  CustomInput, 
  CustomButton, 
  ImagePicker, 
  LoadingSpinner,
  ErrorMessage 
} from '../../components';
import { fetchBookById, updateBook, deleteBook } from '../../services/bookService';

export default function EditBookScreen({ route, navigation }) {
  const { bookId } = route.params;
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookData, setBookData] = useState(null);

  const { control, handleSubmit, reset, formState: { errors, isDirty } } = useForm({
    defaultValues: {
      title: '',
      description: '',
      price: '',
      stock: '',
      imageAsset: null,
    }
  });

  // Fetch book data on mount
  useEffect(() => {
    fetchBookData();
  }, []);

  const fetchBookData = async () => {
    try {
      setFetchLoading(true);
      setError(null);
      const book = await fetchBookById(bookId);
      setBookData(book);
      
      // Reset form with fetched data
      reset({
        title: book.title || '',
        description: book.description || '',
        price: book.price?.toString() || '',
        stock: book.stock?.toString() || '',
        imageAsset: book.image_url ? { uri: book.image_url } : null,
      });
    } catch (err) {
      setError(err.message || 'Failed to load book details');
      console.error('Fetch book error:', err);
    } finally {
      setFetchLoading(false);
    }
  };

  // const onSubmit = async (data) => {
  //   setLoading(true);
  //   try {
  //     // For simplicity, we'll send JSON data (you can extend this to handle image uploads)
  //     const updateData = {
  //       title: data.title,
  //       description: data.description,
  //       price: parseFloat(data.price),
  //       stock: parseInt(data.stock, 10),
  //       // If there's a new image, handle it properly (extend as needed)
  //       image_url: typeof data.imageAsset?.uri === 'string' ? data.imageAsset.uri : bookData?.image_url,
  //     };

  //     await updateBook(bookId, updateData);
      
  //     Alert.alert(
  //       'Success',
  //       'Book updated successfully!',
  //       [{ 
  //         text: 'OK', 
  //         onPress: () => navigation.goBack() 
  //       }]
  //     );
  //   } catch (err) {
  //     console.error('Update book error:', err);
  //     Alert.alert('Error', err.message || 'Failed to update the book. Please try again.');
  //   } finally {
  //     setLoading(false);
  //   }
  // };


  const onSubmit = async (data) => {
  setLoading(true);
  try {
    // Check if user selected a new image
    const hasNewImage = data.imageAsset && 
                       data.imageAsset.uri && 
                       !data.imageAsset.uri.startsWith('http');
    
    const updateData = {
      title: data.title,
      description: data.description,
      price: parseFloat(data.price),
      stock: parseInt(data.stock, 10),
    };

    if (hasNewImage) {
      // New image selected
      updateData.imageAsset = data.imageAsset;
    } else {
      // Keep existing image
      updateData.image_url = bookData?.image_url;
    }

    await updateBook(bookId, updateData);
    
    Alert.alert(
      'Success',
      'Book updated successfully!',
      [{ 
        text: 'OK', 
        onPress: () => navigation.goBack() 
      }]
    );
  } catch (err) {
    console.error('Update book error:', err);
    Alert.alert('Error', err.message || 'Failed to update the book. Please try again.');
  } finally {
    setLoading(false);
  }
};


  const handleDelete = () => {
    Alert.alert(
      'Delete Book',
      'Are you sure you want to delete this book? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: confirmDelete 
        },
      ]
    );
  };

  const confirmDelete = async () => {
    try {
      setLoading(true);
      await deleteBook(bookId);
      Alert.alert(
        'Deleted',
        'Book deleted successfully!',
        [{ 
          text: 'OK', 
          onPress: () => navigation.goBack() 
        }]
      );
    } catch (err) {
      console.error('Delete book error:', err);
      Alert.alert('Error', err.message || 'Failed to delete the book.');
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <SafeAreaView style={globalStyles.container}>
        <Header 
          title="Edit Book" 
          onBack={() => navigation.goBack()} 
        />
        <LoadingSpinner />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={globalStyles.container}>
        <Header 
          title="Edit Book" 
          onBack={() => navigation.goBack()} 
        />
        <ErrorMessage 
          message={error} 
          onRetry={fetchBookData}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={globalStyles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Book Preview Card */}
          <View style={styles.previewCard}>
            <Text style={styles.sectionTitle}>Book Preview</Text>
            <View style={styles.previewContent}>
              {bookData?.image_url && (
                <Image 
                  source={{ uri: bookData.image_url }} 
                  style={styles.previewImage}
                />
              )}
              <View style={styles.previewInfo}>
                <Text style={styles.previewTitle} numberOfLines={2}>
                  {bookData?.title || 'Book Title'}
                </Text>
                <Text style={styles.previewPrice}>
                  ₹{bookData?.price || '0.00'}
                </Text>
                <Text style={styles.previewStock}>
                  Stock: {bookData?.stock || 0} copies
                </Text>
              </View>
            </View>
          </View>

          {/* Edit Form */}
          <View style={styles.formCard}>
            <Text style={styles.sectionTitle}>Edit Details</Text>
            
            <Controller
              control={control}
              name="imageAsset"
              render={({ field: { onChange, value } }) => (
                <ImagePicker
                  onImageSelect={onChange}
                  currentImage={value}
                  style={styles.imagePicker}
                />
              )}
            />

            <Controller
              control={control}
              name="title"
              rules={{ required: 'Title is required' }}
              render={({ field: { onChange, onBlur, value } }) => (
                <CustomInput
                  label="Book Title"
                  placeholder="Enter book title"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={errors.title?.message}
                  containerStyle={styles.inputContainer}
                />
              )}
            />

            <Controller
              control={control}
              name="description"
              rules={{ required: 'Description is required' }}
              render={({ field: { onChange, onBlur, value } }) => (
                <CustomInput
                  label="Description"
                  placeholder="Enter book description"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  multiline
                  numberOfLines={3}
                  error={errors.description?.message}
                  containerStyle={styles.inputContainer}
                />
              )}
            />

            <View style={styles.row}>
              <Controller
                control={control}
                name="price"
                rules={{ 
                  required: 'Price is required',
                  pattern: {
                    value: /^\d+(\.\d{1,2})?$/,
                    message: 'Invalid price format'
                  }
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <CustomInput
                    label="Price (₹)"
                    placeholder="0.00"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    keyboardType="numeric"
                    error={errors.price?.message}
                    containerStyle={[styles.inputContainer, styles.halfWidth]}
                  />
                )}
              />

              <Controller
                control={control}
                name="stock"
                rules={{ 
                  required: 'Stock is required',
                  pattern: {
                    value: /^[0-9]\d*$/,
                    message: 'Invalid stock number'
                  }
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <CustomInput
                    label="Stock"
                    placeholder="0"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    keyboardType="number-pad"
                    error={errors.stock?.message}
                    containerStyle={[styles.inputContainer, styles.halfWidth]}
                  />
                )}
              />
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <CustomButton
              title={loading ? 'Updating...' : 'Update Book'}
              onPress={handleSubmit(onSubmit)}
              loading={loading}
              disabled={!isDirty}
              style={[
                styles.updateButton,
                !isDirty && styles.disabledButton
              ]}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// Custom Header Component
const Header = ({ title, onBack, rightComponent }) => (
  <View style={styles.header}>
    <TouchableOpacity onPress={onBack} style={styles.backButton}>
      <Ionicons name="arrow-back" size={24} color={colors.text} />
    </TouchableOpacity>
    <Text style={styles.headerTitle}>{title}</Text>
    <View style={styles.rightContainer}>
      {rightComponent}
    </View>
  </View>
);

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.background,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 12,
  },
  rightContainer: {
    width: 40,
    alignItems: 'flex-end',
  },
  deleteButton: {
    padding: 8,
  },
  
  // Preview Card
  previewCard: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  previewContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  previewImage: {
    width: 80,
    height: 100,
    borderRadius: 8,
    backgroundColor: colors.surface,
    marginRight: 12,
  },
  previewInfo: {
    flex: 1,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  previewPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 4,
  },
  previewStock: {
    fontSize: 14,
    color: colors.textSecondary,
  },

  // Form Card
  formCard: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  imagePicker: {
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },

  // Buttons
  buttonContainer: {
    marginTop: 8,
  },
  updateButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 14,
  },
  disabledButton: {
    backgroundColor: colors.textSecondary,
    opacity: 0.6,
  },
});
