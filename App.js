import React from 'react';
import { StatusBar, LogBox, useColorScheme } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import { COLORS } from './src/config/theme';
import { ThemeProvider } from './src/context/ThemeContext';
import { LanguageProvider } from './src/context/LanguageContext';
import { CurrencyProvider } from './src/context/CurrencyContext';
import NotificationsScreen from './src/screens/NotificationsScreen';

// Ignore specific harmless warnings
LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

export default function App() {
  return (
    <LanguageProvider>
      <CurrencyProvider>
        <ThemeProvider>
          <AppContent />
        </ThemeProvider>
      </CurrencyProvider>
    </LanguageProvider>
  );
}

// App content with theme support
function AppContent() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  return (
    <>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={isDarkMode ? COLORS.dark.background : COLORS.light.background}
      />
      <AppNavigator />
    </>
  );
}
