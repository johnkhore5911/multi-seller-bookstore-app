import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

// const API_BASE_URL = 'http://192.168.18.15:3000/api';
const API_BASE_URL = 'https://multi-seller-bookstore.vercel.app/api';

export const fetchAllBooks = async () => {
  try {
    const response = await api.get('/books');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const fetchBookById = async (id) => {
  try {
    const response = await api.get(`/books/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Fixed FormData upload function
export const addBookWithImage = async (bookData) => {
  try {
    const token = await AsyncStorage.getItem('userToken'); // Note: should match your storage key
    
    const formData = new FormData();
    formData.append('title', bookData.title);
    formData.append('description', bookData.description || '');
    formData.append('price', bookData.price.toString());
    formData.append('stock', bookData.stock.toString());
    
    // Handle image if present
    if (bookData.imageAsset && bookData.imageAsset.uri) {
      formData.append('image', {
        uri: bookData.imageAsset.uri,
        type: bookData.imageAsset.type || 'image/jpeg',
        name: bookData.imageAsset.fileName || `book-${Date.now()}.jpg`,
      });
    }

    // Use direct fetch instead of axios for FormData
    const response = await fetch(`${API_BASE_URL}/books`, { // Fixed URL - no double /api
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        // Don't set Content-Type for FormData - let fetch handle it
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to add book');
    }

    return await response.json();
  } catch (error) {
    console.error('Add book service error:', error);
    throw error;
  }
};

export const fetchSellerBooks = async () => {
  try {
    const response = await api.get('/books/seller/my-books');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// export const updateBook = async (id, bookData) => {
//   try {
//     const response = await api.put(`/books/${id}`, bookData);
//     return response.data;
//   } catch (error) {
//     throw error.response?.data || error;
//   }
// };

export const updateBook = async (id, bookData) => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    
    // If there's an image asset, use FormData
    if (bookData.imageAsset && bookData.imageAsset.uri && !bookData.imageAsset.uri.startsWith('http')) {
      const formData = new FormData();
      formData.append('title', bookData.title);
      formData.append('description', bookData.description || '');
      formData.append('price', bookData.price.toString());
      formData.append('stock', bookData.stock.toString());
      
      // Append new image
      formData.append('image', {
        uri: bookData.imageAsset.uri,
        type: bookData.imageAsset.type || 'image/jpeg',
        name: bookData.imageAsset.fileName || `book-update-${Date.now()}.jpg`,
      });

      const response = await fetch(`${API_BASE_URL}/books/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update book');
      }

      return await response.json();
    } else {
      // No new image, use regular JSON
      const response = await api.put(`/books/${id}`, {
        title: bookData.title,
        description: bookData.description,
        price: bookData.price,
        stock: bookData.stock,
        image_url: bookData.image_url
      });
      return response.data;
    }
  } catch (error) {
    throw error.response?.data || error;
  }
};


export const deleteBook = async (id) => {
  try {
    const response = await api.delete(`/books/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
