import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SIZES, SPACING } from '../config/theme';
import { useTheme } from '../context/ThemeContext';
import { useLanguage, LANGUAGE_LABELS, LANGUAGES } from '../context/LanguageContext';
import StorageService from '../services/StorageService';

/**
 * SettingsScreen - App settings and preferences
 */
const SettingsScreen = () => {
  const { theme, toggleTheme } = useTheme();
  const { currentLanguage, changeLanguage, getLabel, languageLabels } = useLanguage();
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    locationServices: true,
    saveRecentSearches: true,
    appLanguage: LANGUAGE_LABELS[currentLanguage],
    currency: 'LKR (රු)',
  });
  const [loading, setLoading] = useState(false);

  // Load settings on component mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedSettings = await StorageService.getAppSettings();
        if (savedSettings) {
          setSettings(savedSettings);
        }
      } catch (error) {
        console.error('Error loading app settings:', error);
      }
    };

    loadSettings();
  }, []);

  // Update settings
  const updateSettings = async (newSettings) => {
    try {
      setSettings(newSettings);
      await StorageService.saveAppSettings(newSettings);
    } catch (error) {
      console.error('Error saving app settings:', error);
    }
  };

  // Handle toggle switch
  const handleToggle = (key) => {
    const newSettings = { ...settings, [key]: !settings[key] };
    
    // If toggling dark mode, also update the theme context
    if (key === 'darkMode') {
      toggleTheme();
    }
    
    updateSettings(newSettings);
  };

  // Handle option selection
  const handleOptionSelect = (key, options) => {
    Alert.alert(
      key === 'appLanguage' ? getLabel('language') : getLabel(key),
      '',
      [
        ...options.map(option => ({
          text: option,
          onPress: () => {
            if (key === 'appLanguage') {
              // Find the language code for the selected language label
              const selectedLangCode = Object.entries(LANGUAGE_LABELS).find(
                ([code, label]) => label === option
              )?.[0];
              
              if (selectedLangCode) {
                changeLanguage(selectedLangCode);
              }
            }
            updateSettings({ ...settings, [key]: option });
          }
        })),
        { text: getLabel('cancel'), style: 'cancel' }
      ]
    );
  };

  // Render a switch setting
  const renderSwitchSetting = (icon, title, description, key) => (
    <View style={styles.settingItem}>
      <View style={[styles.settingIconContainer, { backgroundColor: theme.background }]}>
        <Ionicons name={icon} size={24} color={theme.primary} />
      </View>
      
      <View style={styles.settingContent}>
        <Text style={[styles.settingTitle, { color: theme.text }]}>{typeof title === 'string' ? getLabel(title) : title}</Text>
        <Text style={[styles.settingDescription, { color: theme.subtext }]}>{typeof description === 'string' ? getLabel(description) : description}</Text>
      </View>
      
      <Switch
        value={settings[key]}
        onValueChange={() => handleToggle(key)}
        trackColor={{ false: theme.border, true: theme.primary + '70' }}
        thumbColor={settings[key] ? theme.primary : theme.subtext}
      />
    </View>
  );

  // Render an option setting
  const renderOptionSetting = (icon, title, description, key, options) => (
    <TouchableOpacity 
      style={styles.settingItem}
      onPress={() => handleOptionSelect(key, options)}
    >
      <View style={[styles.settingIconContainer, { backgroundColor: theme.background }]}>
        <Ionicons name={icon} size={24} color={theme.primary} />
      </View>
      
      <View style={styles.settingContent}>
        <Text style={[styles.settingTitle, { color: theme.text }]}>{typeof title === 'string' ? getLabel(title) : title}</Text>
        <Text style={[styles.settingDescription, { color: theme.subtext }]}>{typeof description === 'string' ? getLabel(description) : description}</Text>
      </View>
      
      <View style={styles.optionValue}>
        <Text style={[styles.optionValueText, { color: theme.text }]}>{settings[key]}</Text>
        <Ionicons name="chevron-forward" size={20} color={theme.subtext} />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={theme.dark ? "light-content" : "dark-content"} backgroundColor={theme.background} />
      
      <ScrollView style={styles.content}>
        {/* App Preferences */}
        <View style={[styles.sectionContainer, { backgroundColor: theme.card, ...theme.shadows.medium }]}>
          <Text style={[styles.sectionTitle, { color: theme.primary }]}>{getLabel('settings')}</Text>
          
          {renderSwitchSetting(
            "notifications-outline",
            'notifications',
            'notificationsDescription',
            "notifications"
          )}
          
          {renderSwitchSetting(
            "moon-outline",
            'darkMode',
            'theme',
            "darkMode"
          )}
          
          {renderSwitchSetting(
            "location-outline",
            'locationServices',
            "locationServicesDescription",
            "locationServices"
          )}
          
          {renderSwitchSetting(
            "search-outline",
            'recentSearches',
            "recentSearchesDescription",
            "saveRecentSearches"
          )}
        </View>
        
        {/* Preferences */}
        <View style={[styles.sectionContainer, { backgroundColor: theme.card, ...theme.shadows.medium }]}>
          <Text style={[styles.sectionTitle, { color: theme.primary }]}>{getLabel('preferences')}</Text>
          
          {renderOptionSetting(
            "language-outline",
            'language',
            "languageDescription",
            "appLanguage",
            Object.values(LANGUAGE_LABELS)
          )}
          
          {renderOptionSetting(
            "cash-outline",
            'currency',
            "currencyDescription",
            "currency",
            ['LKR (රු)', 'USD ($)', 'EUR (€)', 'GBP (£)']
          )}
        </View>
        
        {/* Account Settings */}
        <View style={[styles.sectionContainer, { backgroundColor: theme.card, ...theme.shadows.medium }]}>
          <Text style={[styles.sectionTitle, { color: theme.primary }]}>Account</Text>
          
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => console.log('Navigate to profile screen')}
          >
            <View style={[styles.settingIconContainer, { backgroundColor: theme.background }]}>
              <Ionicons name="person-outline" size={24} color={theme.primary} />
            </View>
            
            <View style={styles.settingContent}>
              <Text style={[styles.settingTitle, { color: theme.text }]}>{getLabel('profile')}</Text>
              <Text style={[styles.settingDescription, { color: theme.subtext }]}>View and edit your profile information</Text>
            </View>
            
            <Ionicons name="chevron-forward" size={20} color={theme.subtext} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => console.log('Navigate to payment methods screen')}
          >
            <View style={[styles.settingIconContainer, { backgroundColor: theme.background }]}>
              <Ionicons name="card-outline" size={24} color={theme.primary} />
            </View>
            
            <View style={styles.settingContent}>
              <Text style={[styles.settingTitle, { color: theme.text }]}>{getLabel('paymentMethod')}</Text>
              <Text style={[styles.settingDescription, { color: theme.subtext }]}>Manage your payment methods</Text>
            </View>
            
            <Ionicons name="chevron-forward" size={20} color={theme.subtext} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => Alert.alert(getLabel('signOut'), 'Are you sure you want to sign out?', [
              {
                text: getLabel('cancel'),
                style: 'cancel'
              },
              {
                text: getLabel('signOut'),
                onPress: () => console.log('Sign out pressed')
              }
            ])}
          >
            <View style={[styles.settingIconContainer, { backgroundColor: theme.background }]}>
              <Ionicons name="log-out-outline" size={24} color={theme.primary} />
            </View>
            
            <View style={styles.settingContent}>
              <Text style={[styles.settingTitle, { color: theme.text }]}>{getLabel('signOut')}</Text>
              <Text style={[styles.settingDescription, { color: theme.subtext }]}>Log out from your account</Text>
            </View>
            
            <Ionicons name="chevron-forward" size={20} color={theme.subtext} />
          </TouchableOpacity>
        </View>
        
        {/* About & Support */}
        <View style={[styles.sectionContainer, { backgroundColor: theme.card, ...theme.shadows.medium }]}>
          <Text style={[styles.sectionTitle, { color: theme.primary }]}>{getLabel('helpSupport')}</Text>
          
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => Alert.alert('Contact Support', 'Email: support@traintracker.com\nPhone: +94 123 456 7890')}
          >
            <View style={[styles.settingIconContainer, { backgroundColor: theme.background }]}>
              <Ionicons name="call-outline" size={24} color={theme.primary} />
            </View>
            
            <View style={styles.settingContent}>
              <Text style={[styles.settingTitle, { color: theme.text }]}>Contact Support</Text>
              <Text style={[styles.settingDescription, { color: theme.subtext }]}>Get help with your issues</Text>
            </View>
            
            <Ionicons name="chevron-forward" size={20} color={theme.subtext} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => Alert.alert('Rate App', 'This would open the App Store/Play Store in a real app')}
          >
            <View style={[styles.settingIconContainer, { backgroundColor: theme.background }]}>
              <Ionicons name="star-outline" size={24} color={theme.primary} />
            </View>
            
            <View style={styles.settingContent}>
              <Text style={[styles.settingTitle, { color: theme.text }]}>Rate the App</Text>
              <Text style={[styles.settingDescription, { color: theme.subtext }]}>Share your feedback with us</Text>
            </View>
            
            <Ionicons name="chevron-forward" size={20} color={theme.subtext} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => Alert.alert(getLabel('aboutUs'), 'Train Schedule Tracker\nVersion 1.0.0\n\nA React Native application for tracking train schedules, booking tickets, and managing your journeys.')}
          >
            <View style={[styles.settingIconContainer, { backgroundColor: theme.background }]}>
              <Ionicons name="information-circle-outline" size={24} color={theme.primary} />
            </View>
            
            <View style={styles.settingContent}>
              <Text style={[styles.settingTitle, { color: theme.text }]}>{getLabel('aboutUs')}</Text>
              <Text style={[styles.settingDescription, { color: theme.subtext }]}>App information and version</Text>
            </View>
            
            <Ionicons name="chevron-forward" size={20} color={theme.subtext} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: SPACING.m,
  },
  sectionContainer: {
    borderRadius: 12,
    padding: SPACING.m,
    marginBottom: SPACING.m,
  },
  sectionTitle: {
    fontSize: SIZES.medium,
    fontWeight: 'bold',
    marginBottom: SPACING.s,
    paddingHorizontal: SPACING.s,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.m,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(150,150,150,0.3)',
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.m,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: SIZES.medium,
    fontWeight: '500',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: SIZES.small,
  },
  optionValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionValueText: {
    fontSize: SIZES.small,
    marginRight: SPACING.xs,
  },
});

export default SettingsScreen;
