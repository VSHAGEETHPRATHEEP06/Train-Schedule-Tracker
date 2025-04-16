import React, { createContext, useState, useEffect, useContext, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, SHADOWS } from '../config/theme';

// Default theme values to ensure theme is always defined
const DEFAULT_LIGHT_THEME = {
  ...COLORS.light,
  shadows: SHADOWS,
};

const DEFAULT_DARK_THEME = {
  ...COLORS.dark,
  shadows: SHADOWS,
};

// Create theme context with default values to prevent undefined errors
const ThemeContext = createContext({
  isDarkMode: false,
  toggleTheme: () => {},
  setTheme: () => {},
  theme: DEFAULT_LIGHT_THEME,
  isLoading: true,
});

// Theme provider component
export const ThemeProvider = ({ children }) => {
  const deviceTheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(deviceTheme === 'dark');
  const [isLoading, setIsLoading] = useState(true);

  // Load theme preference from storage on mount
  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem('theme_preference');
        if (storedTheme !== null) {
          setIsDarkMode(storedTheme === 'dark');
        } else {
          // If no preference is stored, use device theme
          setIsDarkMode(deviceTheme === 'dark');
        }
      } catch (error) {
        console.error('Error loading theme preference:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadThemePreference();
  }, [deviceTheme]);

  // Save theme preference to storage
  const saveThemePreference = async (isDark) => {
    try {
      await AsyncStorage.setItem('theme_preference', isDark ? 'dark' : 'light');
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };

  // Toggle theme function
  const toggleTheme = () => {
    setIsDarkMode(prevMode => {
      const newMode = !prevMode;
      saveThemePreference(newMode);
      return newMode;
    });
  };

  // Set specific theme
  const setTheme = (isDark) => {
    setIsDarkMode(isDark);
    saveThemePreference(isDark);
  };

  // Get current theme colors with useMemo to optimize performance
  const theme = useMemo(() => {
    return isDarkMode ? DEFAULT_DARK_THEME : DEFAULT_LIGHT_THEME;
  }, [isDarkMode]);

  // Create a stable context value
  const contextValue = useMemo(() => ({
    isDarkMode,
    toggleTheme,
    setTheme,
    theme,
    isLoading
  }), [isDarkMode, theme, isLoading]);

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use theme with safety fallbacks
export const useTheme = () => {
  const context = useContext(ThemeContext);
  
  // Even if context is somehow undefined, provide default values
  if (context === undefined) {
    console.warn('useTheme was used outside of ThemeProvider, using fallback values');
    return {
      isDarkMode: false,
      toggleTheme: () => {},
      setTheme: () => {},
      theme: DEFAULT_LIGHT_THEME,
      isLoading: false
    };
  }
  
  return context;
};

export default ThemeContext;
