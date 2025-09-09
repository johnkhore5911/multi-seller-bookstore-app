// src/navigation/SellerTabNavigator.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BookListingScreen from '../screens/seller/BookListingScreen';
import AddBookScreen from '../screens/seller/AddBookScreen';
import EditBookScreen from '../screens/seller/EditBookScreen';
import SalesDashboardScreen from '../screens/seller/SalesDashboardScreen';
import SellerOrdersScreen from '../screens/seller/SellerOrdersScreen';
import ProfileScreen from '../screens/shared/ProfileScreen';
import Ionicons from '@expo/vector-icons/Ionicons';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Stack for Book Management (includes Add/Edit screens)
function BookStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="BookListingMain" 
        component={BookListingScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="AddBook" 
        component={AddBookScreen}
        options={{ 
          title: 'Add New Book',
          headerStyle: { backgroundColor: '#FF6B35' },
          headerTintColor: 'white',
        }}
      />
      <Stack.Screen 
        name="EditBook" 
        component={EditBookScreen}
        options={{ 
          title: 'Edit Book',
          headerStyle: { backgroundColor: '#FF6B35' },
          headerTintColor: 'white',
        }}
      />
    </Stack.Navigator>
  );
}

export default function SellerTabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="BookListing"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          switch (route.name) {
            case 'BookListing':
              iconName = focused ? 'book' : 'book-outline';
              break;
            case 'Dashboard':
              iconName = focused ? 'stats-chart' : 'stats-chart-outline';
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
      <Tab.Screen 
        name="BookListing" 
        component={BookStack} 
        options={{ title: 'My Books' }} 
      />
      <Tab.Screen name="Dashboard" component={SalesDashboardScreen} />
      <Tab.Screen name="Orders" component={SellerOrdersScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
