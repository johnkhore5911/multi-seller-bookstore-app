// src/navigation/BuyerTabNavigator.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import StorefrontScreen from '../screens/buyer/StorefrontScreen';
import ProductDetailScreen from '../screens/buyer/ProductDetailScreen';
import CartScreen from '../screens/buyer/CartScreen';
import BuyerOrdersScreen from '../screens/buyer/BuyerOrdersScreen';
import ProfileScreen from '../screens/shared/ProfileScreen';
import Ionicons from '@expo/vector-icons/Ionicons';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Stack for Storefront (includes ProductDetail)
function StorefrontStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="StorefrontMain" 
        component={StorefrontScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="ProductDetail" 
        component={ProductDetailScreen}
        options={{ 
          title: 'Book Details',
          headerStyle: { backgroundColor: '#FF6B35' },
          headerTintColor: 'white',
        }}
      />
    </Stack.Navigator>
  );
}

export default function BuyerTabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Storefront"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          switch (route.name) {
            case 'Storefront':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Cart':
              iconName = focused ? 'cart' : 'cart-outline';
              break;
            case 'Orders':
              iconName = focused ? 'receipt' : 'receipt-outline';
              break;
            case 'Profile':
              iconName = focused ? 'person' : 'person-outline';
              break;
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#FF6B35',
        tabBarInactiveTintColor: '#6C757D',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#DEE2E6',
          borderTopWidth: 1,
        },
      })}
    >
      <Tab.Screen name="Storefront" component={StorefrontStack} />
      <Tab.Screen name="Cart" component={CartScreen} />
      <Tab.Screen name="Orders" component={BuyerOrdersScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
