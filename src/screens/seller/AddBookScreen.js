import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { colors } from '../../styles/colors';
import { globalStyles } from '../../styles/globalStyles';
import { CustomInput, CustomButton, ImagePicker } from '../../components';
import { addBookWithImage } from '../../services/bookService';

export default function AddBookScreen({ navigation }) {
  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      title: '',
      description: '',
      price: '',
      stock: '',
      imageAsset: null,
    }
  });

  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      console.log('Submitting data:', data); // Debug log
      
      const result = await addBookWithImage({
        title: data.title,
        description: data.description,
        price: parseFloat(data.price),
        stock: parseInt(data.stock, 10),
        imageAsset: data.imageAsset,
      });
      
      console.log('Upload result:', result); // Debug log
      
      Alert.alert(
        'Success',
        'Your book has been added successfully!',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      console.error('Add book error:', error);
      Alert.alert('Error', error.message || 'Failed to add the book. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <SafeAreaView style={globalStyles.container}>
      <Header title="Add New Book" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.sectionTitle}>Book Details</Text>
          
          <Controller
            control={control}
            name="imageAsset"
            render={({ field: { onChange, value } }) => (
              <ImagePicker
                onImageSelect={(imageObj) => {
                  console.log('Image selected:', imageObj); // Debug log
                  onChange(imageObj);
                }}
                currentImage={value}
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
                placeholder="e.g., The Great Gatsby"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.title?.message}
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
                placeholder="A short summary of the book..."
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                multiline
                numberOfLines={4}
                error={errors.description?.message}
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
                  placeholder="e.g., 299.99"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  keyboardType="numeric"
                  error={errors.price?.message}
                  style={{ flex: 1, marginRight: 8 }}
                />
              )}
            />
            <Controller
              control={control}
              name="stock"
              rules={{ 
                required: 'Stock is required',
                pattern: {
                  value: /^[1-9]\d*$/,
                  message: 'Invalid stock number'
                }
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <CustomInput
                  label="Stock"
                  placeholder="e.g., 10"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  keyboardType="number-pad"
                  error={errors.stock?.message}
                  style={{ flex: 1, marginLeft: 8 }}
                />
              )}
            />
          </View>
          
          <CustomButton
            title={loading ? 'Adding Book...' : 'Add Book to Store'}
            onPress={handleSubmit(onSubmit)}
            loading={loading}
            style={{ marginTop: 24 }}
          />

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// Simple Header for this screen
const Header = ({ title }) => (
  <View style={styles.header}>
    <Text style={styles.headerTitle}>{title}</Text>
  </View>
);

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 24,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.background,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
  },
});
