// src/components/CustomInput.js
import React from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import { colors } from '../styles/colors';

const CustomInput = ({ 
  label, 
  value, 
  onChangeText, 
  placeholder, 
  error, 
  secureTextEntry = false,
  keyboardType = 'default',
  multiline = false,
  numberOfLines = 1,
  style,
  editable = true
}) => {
  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[
          styles.input, 
          multiline && styles.multilineInput,
          error && styles.inputError,
          !editable && styles.inputDisabled
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        multiline={multiline}
        numberOfLines={numberOfLines}
        editable={editable}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: colors.background,
    color: colors.text,
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: colors.error,
  },
  inputDisabled: {
    backgroundColor: colors.surface,
    color: colors.textSecondary,
  },
  errorText: {
    fontSize: 14,
    color: colors.error,
    marginTop: 4,
  },
});

export default CustomInput;
