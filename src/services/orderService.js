// src/services/orderService.js
import api from './api';

export const createOrder = async () => {
  try {
    const response = await api.post('/orders');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getBuyerOrders = async () => {
  try {
    const response = await api.get('/orders/buyer');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getSellerOrders = async () => {
  try {
    const response = await api.get('/orders/seller');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const updateOrderStatus = async (orderId, status) => {
  try {
    const response = await api.put(`/orders/${orderId}/status`, { status });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
