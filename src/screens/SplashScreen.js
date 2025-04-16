import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, StatusBar } from 'react-native';
import { SIZES } from '../config/theme';
import { useTheme } from '../context/ThemeContext';
import TrainService from '../services/TrainService';
import StorageService from '../services/StorageService';

/**
 * Splash screen displayed when the app starts
 */
const SplashScreen = ({ navigation }) => {
  const { theme } = useTheme();
  useEffect(() => {
    // Initialize the app
    const initializeApp = async () => {
      try {
        // Initialize train service with mock data
        await TrainService.initialize();
        
        // Check if user is already logged in
        const userProfile = await StorageService.getUserProfile();
        
        // Navigate to appropriate screen after 2 seconds
        setTimeout(() => {
          if (userProfile) {
            // User is logged in, go to main app
            navigation.replace('Main');
          } else {
            // User is not logged in, go to onboarding
            navigation.replace('Auth');
          }
        }, 2000);
      } catch (error) {
        console.error('Error initializing app:', error);
        // Navigate to onboarding on error
        setTimeout(() => {
          navigation.replace('Auth');
        }, 2000);
      }
    };

    initializeApp();
  }, [navigation]);

  return (
    <View style={[styles.container, { backgroundColor: theme.primary }]}>
      <StatusBar barStyle="light-content" backgroundColor={theme.primary} />
      <View style={styles.logoContainer}>
        <Image
          source={require('../assets/train_logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={[styles.title, { color: theme.card }]}>Train Schedule Tracker</Text>
      </View>
      <Text style={[styles.subtitle, { color: theme.card }]}>Your journey starts here</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  title: {
    fontSize: SIZES.xxlarge,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: SIZES.medium,
    marginTop: 16,
    opacity: 0.8,
  },
});

export default SplashScreen;
