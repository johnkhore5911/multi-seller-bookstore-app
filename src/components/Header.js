// src/components/Header.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../styles/colors';

const Header = ({ 
  title, 
  leftButton, 
  rightButton, 
  onLeftPress, 
  onRightPress,
  backgroundColor = colors.primary,
  textColor = colors.background,
  style 
}) => {
  return (
    <>
      <StatusBar backgroundColor={backgroundColor} barStyle="light-content" />
      <View style={[styles.container, { backgroundColor }, style]}>
        <View style={styles.leftSection}>
          {leftButton && (
            <TouchableOpacity style={styles.button} onPress={onLeftPress}>
              <Ionicons name={leftButton} size={24} color={textColor} />
            </TouchableOpacity>
          )}
        </View>
        
        <View style={styles.centerSection}>
          <Text style={[styles.title, { color: textColor }]} numberOfLines={1}>
            {title}
          </Text>
        </View>
        
        <View style={styles.rightSection}>
          {rightButton && (
            <TouchableOpacity style={styles.button} onPress={onRightPress}>
              <Ionicons name={rightButton} size={24} color={textColor} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    elevation: 4,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  leftSection: {
    width: 40,
    alignItems: 'flex-start',
  },
  centerSection: {
    flex: 1,
    alignItems: 'center',
  },
  rightSection: {
    width: 40,
    alignItems: 'flex-end',
  },
  button: {
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Header;
