// src/navigation/AppNavigator.js
import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { AuthContext } from '../context/AuthContext'; // Import context
import AuthNavigator from './AuthNavigator';
import BuyerTabNavigator from './BuyerTabNavigator';
import SellerTabNavigator from './SellerTabNavigator';

export default function AppNavigator() {
  const { userToken, userRole, loading } = useContext(AuthContext); // Use context

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#FF6B35" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {!userToken ? (
        <AuthNavigator />
      ) : userRole === 'seller' ? (
        <SellerTabNavigator />
      ) : (
        <BuyerTabNavigator />
      )}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
});
