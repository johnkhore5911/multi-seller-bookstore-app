// src/navigation/AuthNavigator.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from '../screens/auth/WelcomeScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

const Stack = createNativeStackNavigator();

export default function AuthNavigator() {
  return (
    <Stack.Navigator initialRouteName="Welcome">
      <Stack.Screen 
        name="Welcome" 
        component={WelcomeScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="Login" 
        component={LoginScreen} 
        options={{ 
          title: 'Login',
          headerStyle: { backgroundColor: '#FF6B35' },
          headerTintColor: 'white',
          headerTitleStyle: { fontWeight: 'bold' },
          headerShown: false
        }} 
      />
      <Stack.Screen 
        name="Register" 
        component={RegisterScreen} 
        options={{ 
          title: 'Register',
          headerStyle: { backgroundColor: '#FF6B35' },
          headerTintColor: 'white',
          headerTitleStyle: { fontWeight: 'bold' },
          headerShown: false
        }} 
      />
    </Stack.Navigator>
  );
}
