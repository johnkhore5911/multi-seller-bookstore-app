// src/services/authService.js
import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const register = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const login = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    const { token, user } = response.data;
    
    // Store token and user data
    await AsyncStorage.multiSet([
      ['userToken', token],
      ['userRole', user.role],
      ['userData', JSON.stringify(user)],
    ]);
    
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const logout = async () => {
  try {
    await AsyncStorage.multiRemove(['userToken', 'userRole', 'userData']);
  } catch (error) {
    console.error('Error during logout:', error);
  }
};

export const getCurrentUser = async () => {
  try {
    const userData = await AsyncStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};
