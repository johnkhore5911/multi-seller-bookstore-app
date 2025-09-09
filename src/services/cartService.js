// src/services/cartService.js
import api from './api';

export const getCart = async () => {
  try {
    const response = await api.get('/cart');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const addToCart = async (bookId, quantity = 1) => {
  try {
    const response = await api.post('/cart', { book_id: bookId, quantity });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const updateCartItem = async (bookId, quantity) => {
  try {
    const response = await api.put(`/cart/${bookId}`, { quantity });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const removeFromCart = async (bookId) => {
  try {
    const response = await api.delete(`/cart/${bookId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const clearCart = async () => {
  try {
    const response = await api.delete('/cart');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
