import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { COLORS, SPACING } from '../../config/theme';

const CustomButton = ({ onPress, title, variant = 'primary', loading = false }) => {
  const isOutline = variant === 'outline';
  
  return (
    <TouchableOpacity 
      style={[
        styles.button, 
        isOutline ? styles.buttonOutline : styles.buttonPrimary
      ]} 
      onPress={onPress}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator color={isOutline ? COLORS.primary : '#FFF'} />
      ) : (
        <Text style={[styles.text, isOutline && styles.textOutline]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: SPACING.md,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: SPACING.xs,
  },
  buttonPrimary: {
    backgroundColor: COLORS.primary,
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  text: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  textOutline: {
    color: COLORS.primary,
  },
});

export default CustomButton;