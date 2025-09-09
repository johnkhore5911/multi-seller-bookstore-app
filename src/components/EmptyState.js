// src/components/EmptyState.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../styles/colors';

const EmptyState = ({ 
  icon = 'library-outline', 
  message = 'No items found', 
  subMessage,
  actionButton,
  onActionPress,
  style 
}) => {
  return (
    <View style={[styles.container, style]}>
      <Ionicons name={icon} size={80} color={colors.textSecondary} />
      <Text style={styles.message}>{message}</Text>
      {subMessage && <Text style={styles.subMessage}>{subMessage}</Text>}
      
      {actionButton && onActionPress && (
        <TouchableOpacity style={styles.actionButton} onPress={onActionPress}>
          <Text style={styles.actionButtonText}>{actionButton}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: 32,
  },
  message: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  subMessage: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  actionButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  actionButtonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default EmptyState;
