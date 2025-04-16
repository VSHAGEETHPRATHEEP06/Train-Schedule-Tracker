import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

/**
 * A simple test component to verify theme context is working correctly
 */
const ThemeTest = () => {
  const { theme, isDarkMode } = useTheme();
  
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.text, { color: theme.text }]}>
        Theme mode: {isDarkMode ? 'Dark' : 'Light'}
      </Text>
      <Text style={[styles.text, { color: theme.primary }]}>
        Primary color
      </Text>
      <Text style={[styles.text, { color: theme.textSecondary }]}>
        Secondary text
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    margin: 10,
    borderRadius: 8,
  },
  text: {
    fontSize: 16,
    marginBottom: 8,
  }
});

export default ThemeTest;
