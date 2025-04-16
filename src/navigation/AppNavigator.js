import React, { useMemo } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';

// Import screens
import SplashScreen from '../screens/SplashScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import TrainDetailScreen from '../screens/TrainDetailScreen';
import BookingScreen from '../screens/BookingScreen';
import BookingConfirmationScreen from '../screens/BookingConfirmationScreen';
import MyBookingsScreen from '../screens/MyBookingsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import NotificationSettingsScreen from '../screens/NotificationSettingsScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import SettingsScreen from '../screens/SettingsScreen';
import TrainTrackingScreen from '../screens/TrainTrackingScreen';

import { useTheme } from '../context/ThemeContext';

// Create stack navigators
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Auth Navigator
const AuthNavigator = () => {
  const { theme } = useTheme();
  
  const screenOptions = useMemo(() => ({
    headerShown: false,
    cardStyle: { backgroundColor: theme?.background ?? '#F9F9F9' }
  }), [theme]);
  
  return (
    <Stack.Navigator 
      screenOptions={screenOptions}
    >
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
};

// Home Stack Navigator
const HomeStackNavigator = () => {
  const { theme } = useTheme();
  
  const screenOptions = useMemo(() => ({
    headerStyle: {
      backgroundColor: theme?.primary ?? '#007AFF',
    },
    headerTintColor: theme?.card ?? '#FFFFFF',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  }), [theme]);
  
  return (
    <Stack.Navigator
      screenOptions={screenOptions}
    >
      <Stack.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ title: 'Train Schedule Tracker' }}
      />
      <Stack.Screen 
        name="Search" 
        component={SearchScreen}
        options={{ title: 'Search Trains' }}
      />
      <Stack.Screen 
        name="TrainDetail" 
        component={TrainDetailScreen}
        options={({ route }) => ({ title: route.params?.trainName || 'Train Details' })}
      />
      <Stack.Screen 
        name="TrainTracking" 
        component={TrainTrackingScreen}
        options={{ title: 'Live Train Tracking' }}
      />
      <Stack.Screen 
        name="Booking" 
        component={BookingScreen}
        options={{ title: 'Book Tickets' }}
      />
      <Stack.Screen 
        name="BookingConfirmation" 
        component={BookingConfirmationScreen}
        options={{ 
          title: 'Booking Confirmation',
          headerLeft: () => null, // Disable back button
        }}
      />
    </Stack.Navigator>
  );
};

// My Bookings Stack Navigator
const BookingsStackNavigator = () => {
  const { theme } = useTheme();
  
  const screenOptions = useMemo(() => ({
    headerStyle: {
      backgroundColor: theme?.primary ?? '#007AFF',
    },
    headerTintColor: theme?.card ?? '#FFFFFF',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  }), [theme]);
  
  return (
    <Stack.Navigator
      screenOptions={screenOptions}
    >
    <Stack.Screen 
      name="MyBookings" 
      component={MyBookingsScreen}
      options={{ title: 'My Bookings' }}
    />
    <Stack.Screen 
      name="BookingDetail" 
      component={TrainDetailScreen}
      options={{ title: 'Booking Details' }}
    />
    </Stack.Navigator>
  );
};

// Profile Stack Navigator
const ProfileStackNavigator = () => {
  const { theme } = useTheme();
  
  const screenOptions = useMemo(() => ({
    headerStyle: {
      backgroundColor: theme?.primary ?? '#007AFF',
    },
    headerTintColor: theme?.card ?? '#FFFFFF',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  }), [theme]);
  
  const notificationSettingsOptions = ({ route, navigation }) => {
    const { theme, isDarkMode, getLabel: routeGetLabel } = route.params || {};
    // Create a safe getLabel function that won't throw errors
    const getLabel = typeof routeGetLabel === 'function' 
      ? routeGetLabel 
      : (key, fallback) => fallback;
    
    return {
      title: getLabel('notificationSettings', 'Notification Settings'),
      headerStyle: {
        backgroundColor: isDarkMode ? '#121212' : '#FFFFFF',
      },
      headerTintColor: isDarkMode ? '#FFFFFF' : '#000000',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
      headerLeft: () => (
        <TouchableOpacity
          style={{ marginLeft: 16 }}
          onPress={() => navigation.goBack()}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color={isDarkMode ? '#FFFFFF' : '#000000'}
          />
        </TouchableOpacity>
      ),
    };
  };

  return (
    <Stack.Navigator
      screenOptions={screenOptions}
    >
    <Stack.Screen 
      name="Profile" 
      component={ProfileScreen}
      options={{ title: 'My Profile' }}
    />
    <Stack.Screen 
      name="EditProfile" 
      component={EditProfileScreen}
      options={{ title: 'Edit Profile' }}
    />
    <Stack.Screen 
      name="Notifications" 
      component={NotificationsScreen}
      options={{ title: 'Notifications' }}
    />
    <Stack.Screen 
      name="NotificationSettings" 
      component={NotificationSettingsScreen}
      options={notificationSettingsOptions}
    />
    <Stack.Screen 
      name="Favorites" 
      component={FavoritesScreen}
      options={{ title: 'Favorite Trains' }}
    />
    <Stack.Screen 
      name="Settings" 
      component={SettingsScreen}
      options={{ title: 'App Settings' }}
    />
    </Stack.Navigator>
  );
};

// Main Tab Navigator
const MainTabNavigator = () => {
  const { theme } = useTheme();
  // Use useMemo to prevent unnecessary re-renders and ensure screenOptions are stable
  const screenOptions = useMemo(() => {
    return ({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === 'HomeTab') {
          iconName = focused ? 'home' : 'home-outline';
        } else if (route.name === 'BookingsTab') {
          iconName = focused ? 'document-text' : 'document-text-outline';
        } else if (route.name === 'ProfileTab') {
          iconName = focused ? 'person' : 'person-outline';
        }

        // You can return any component here
        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: theme?.primary ?? '#007AFF', // Provide fallback values
      tabBarInactiveTintColor: theme?.subtext ?? '#757575',
      headerShown: false,
    });
  }, [theme]);
  
  return (
    <Tab.Navigator
      screenOptions={screenOptions}
    >
    <Tab.Screen 
      name="HomeTab" 
      component={HomeStackNavigator}
      options={{ title: 'Home' }}
    />
    <Tab.Screen 
      name="BookingsTab" 
      component={BookingsStackNavigator}
      options={{ title: 'My Bookings' }}
    />
    <Tab.Screen 
      name="ProfileTab" 
      component={ProfileStackNavigator}
      options={{ title: 'Profile' }}
    />
    </Tab.Navigator>
  );
};

// Main App Navigator
const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Splash"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Auth" component={AuthNavigator} />
        <Stack.Screen name="Main" component={MainTabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
