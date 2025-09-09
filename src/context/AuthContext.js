// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login as apiLogin, logout as apiLogout } from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const role = await AsyncStorage.getItem('userRole');
        setUserToken(token);
        setUserRole(role);
      } catch (e) {
        console.error('Failed to load auth state from storage', e);
      } finally {
        setLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

  const authContext = {
    login: async (credentials) => {
      const response = await apiLogin(credentials);
      setUserToken(response.token);
      setUserRole(response.user.role);
      return response;
    },
    logout: async () => {
      await apiLogout();
      setUserToken(null);
      setUserRole(null);
    },
    // ADD THIS: switchRole function
    switchRole: async (newRole) => {
      try {
        // Update AsyncStorage
        await AsyncStorage.setItem('userRole', newRole);
        // Update context state (this triggers AppNavigator to re-render)
        setUserRole(newRole);
      } catch (error) {
        console.error('Failed to switch role:', error);
        throw error;
      }
    },
    userToken,
    userRole,
    loading,
  };

  return (
    <AuthContext.Provider value={authContext}>
      {children}
    </AuthContext.Provider>
  );
};
