// src/utils/storage.js
import AsyncStorage from '@react-native-async-storage/async-storage';

export const StorageKeys = {
  USER_TOKEN: 'userToken',
  USER_ROLE: 'userRole',
  USER_DATA: 'userData',
};

export const setItem = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error storing data:', error);
  }
};

export const getItem = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error('Error retrieving data:', error);
    return null;
  }
};

export const removeItem = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing data:', error);
  }
};

export const clearAll = async () => {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.error('Error clearing storage:', error);
  }
};
