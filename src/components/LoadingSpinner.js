// src/components/LoadingSpinner.js
import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { colors } from '../styles/colors';

const LoadingSpinner = ({ size = 'large', color = colors.primary, text = 'Loading...', style }) => {
  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator size={size} color={color} />
      {text && <Text style={styles.text}>{text}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  text: {
    marginTop: 12,
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});

export default LoadingSpinner;
