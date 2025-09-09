// src/components/StatusBadge.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../styles/colors';

const StatusBadge = ({ status, size = 'medium', style }) => {
  const getStatusConfig = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return { color: colors.warning, backgroundColor: colors.warning + '20' };
      case 'shipped':
        return { color: colors.secondary, backgroundColor: colors.secondary + '20' };
      case 'delivered':
        return { color: colors.success, backgroundColor: colors.success + '20' };
      default:
        return { color: colors.textSecondary, backgroundColor: colors.surface };
    }
  };

  const statusConfig = getStatusConfig(status);
  const isSmall = size === 'small';

  return (
    <View 
      style={[
        styles.badge, 
        { backgroundColor: statusConfig.backgroundColor },
        isSmall && styles.smallBadge,
        style
      ]}
    >
      <Text 
        style={[
          styles.badgeText, 
          { color: statusConfig.color },
          isSmall && styles.smallBadgeText
        ]}
      >
        {status}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  smallBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  smallBadgeText: {
    fontSize: 10,
  },
});

export default StatusBadge;
