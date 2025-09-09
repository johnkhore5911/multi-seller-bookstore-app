// src/components/RoleSwitcher.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../styles/colors';

const RoleSwitcher = ({ currentRole, onRoleSwitch, style }) => {
  const isBuyer = currentRole === 'buyer';

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.label}>Switch Mode</Text>
      <TouchableOpacity style={styles.switcher} onPress={onRoleSwitch}>
        <View style={[styles.option, isBuyer && styles.activeOption]}>
          <Ionicons 
            name="storefront-outline" 
            size={20} 
            color={isBuyer ? colors.background : colors.textSecondary} 
          />
          <Text style={[styles.optionText, isBuyer && styles.activeOptionText]}>
            Buyer
          </Text>
        </View>
        
        <View style={[styles.option, !isBuyer && styles.activeOption]}>
          <Ionicons 
            name="business-outline" 
            size={20} 
            color={!isBuyer ? colors.background : colors.textSecondary} 
          />
          <Text style={[styles.optionText, !isBuyer && styles.activeOptionText]}>
            Seller
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  switcher: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 25,
    padding: 4,
  },
  option: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 21,
  },
  activeOption: {
    backgroundColor: colors.primary,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginLeft: 6,
  },
  activeOptionText: {
    color: colors.background,
  },
});

export default RoleSwitcher;
