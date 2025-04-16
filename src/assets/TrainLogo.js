import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

/**
 * Sri Lankan Train Logo component
 * This matches the design in the provided mockups
 */
const TrainLogo = ({ size = 80, style }) => {
  const { theme, isDarkMode } = useTheme();
  
  return (
    <View style={[styles.container, { width: size, height: size }, style]}>
      <View style={[styles.logoContainer, { backgroundColor: theme.primary + '20' }]}>
        <Ionicons name="train-outline" size={size * 0.6} color={theme.primary} />
        <Text style={[styles.logoText, { color: theme.primary, fontSize: size * 0.15 }]}>
          Sri Lanka Railways
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
  },
  logoText: {
    fontWeight: 'bold',
    marginTop: 4,
    textAlign: 'center',
  },
});

export default TrainLogo;
