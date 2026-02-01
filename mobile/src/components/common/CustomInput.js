import React from 'react';
import { View, TextInput, StyleSheet, Text } from 'react-native';
import { COLORS, SPACING } from '../../config/theme';

const CustomInput = ({ 
  value, 
  onChangeText, 
  placeholder, 
  secureTextEntry, 
  error 
}) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={[styles.input, error && styles.inputError]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={COLORS.textSub}
        secureTextEntry={secureTextEntry}
        autoCapitalize="none"
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
  },
  input: {
    backgroundColor: COLORS.surface,
    color: COLORS.text,
    padding: SPACING.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  inputError: {
    borderColor: COLORS.error,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 12,
    marginTop: 4,
  },
});

export default CustomInput;