// src/components/SearchBar.js
import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../styles/colors';

const SearchBar = ({ 
  value, 
  onChangeText, 
  placeholder = 'Search books...', 
  onClear,
  style 
}) => {
  return (
    <View style={[styles.container, style]}>
      <Ionicons name="search-outline" size={20} color={colors.textSecondary} style={styles.searchIcon} />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        returnKeyType="search"
      />
      {value ? (
        <TouchableOpacity onPress={onClear} style={styles.clearButton}>
          <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginHorizontal: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    paddingVertical: 0,
  },
  clearButton: {
    marginLeft: 8,
  },
});

export default SearchBar;
