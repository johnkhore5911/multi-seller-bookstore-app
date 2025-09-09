// src/services/api.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Replace with your backend URL
// const API_BASE_URL = 'http://192.168.18.15:3000/api'; // Use your local IP 
// const API_BASE_URL = 'http://172.20.10.2:3000/api'; // Use your local IP 
const API_BASE_URL = 'https://multi-seller-bookstore.vercel.app/api'; // Use production IP 

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to headers if exists
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors globally
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired, logout user
      await AsyncStorage.multiRemove(['userToken', 'userRole', 'userData']);
      // Navigate to login (you might need to set up navigation ref)
    }
    return Promise.reject(error);
  }
);

export default api;
