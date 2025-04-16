import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SIZES, SPACING } from '../config/theme';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

/**
 * NotificationSettingsScreen Component
 * Allows users to configure their notification preferences
 */
const NotificationSettingsScreen = ({ navigation, route }) => {
  // Use the app's theme context instead of route params
  const { theme, isDarkMode } = useTheme();
  const { getLabel } = useLanguage();
  
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({
    enableNotifications: true,
    bookingAlerts: true,
    delayAlerts: true,
    priceAlerts: false,
    systemAlerts: true,
    vibration: true,
    sound: true
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const savedSettings = await AsyncStorage.getItem('notificationSettings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } catch (error) {
      console.error('Error loading notification settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async (newSettings) => {
    try {
      await AsyncStorage.setItem('notificationSettings', JSON.stringify(newSettings));
    } catch (error) {
      console.error('Error saving notification settings:', error);
    }
  };

  const handleToggle = (key) => {
    const newSettings = { ...settings, [key]: !settings[key] };
    
    // If main notifications toggle is turned off, disable all other notification settings
    if (key === 'enableNotifications' && !newSettings.enableNotifications) {
      newSettings.bookingAlerts = false;
      newSettings.delayAlerts = false;
      newSettings.priceAlerts = false;
      newSettings.systemAlerts = false;
    }
    
    // If main notifications toggle is turned on, reset to default values
    if (key === 'enableNotifications' && newSettings.enableNotifications) {
      newSettings.bookingAlerts = true;
      newSettings.delayAlerts = true;
      newSettings.priceAlerts = false;
      newSettings.systemAlerts = true;
    }
    
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  if (loading) {
    return (
      <View
        style={[
          styles.loadingContainer,
          { backgroundColor: isDarkMode ? '#121212' : '#F9F9F9' },
        ]}
      >
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={[styles.loadingText, { color: isDarkMode ? '#FFFFFF' : '#212121' }]}>
          {getLabel('loadingSettings', 'Loading settings...')}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: isDarkMode ? '#121212' : '#F9F9F9' }]}
    >
      {/* Main toggle for all notifications */}
      <View style={[styles.section, { borderBottomColor: isDarkMode ? '#333333' : '#E0E0E0', borderBottomWidth: 1 }]}>
        <View style={styles.settingHeader}>
          <View style={styles.settingHeaderLeft}>
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: '#007AFF' },
              ]}
            >
              <Ionicons name="notifications" size={24} color="white" />
            </View>
            <View style={styles.settingTextContainer}>
              <Text style={[styles.settingTitle, { color: isDarkMode ? '#FFFFFF' : '#212121' }]}>
                {getLabel('enableNotifications', 'Enable Notifications')}
              </Text>
              <Text style={[styles.settingDescription, { color: isDarkMode ? '#AAAAAA' : '#757575' }]}>
                {getLabel('enableNotificationsDesc', 'Receive alerts about your trips and train updates')}
              </Text>
            </View>
          </View>
          <Switch
            value={settings.enableNotifications}
            onValueChange={() => handleToggle('enableNotifications')}
            trackColor={{ false: '#767577', true: '#007AFF' }}
            thumbColor={'#f4f3f4'}
          />
        </View>
      </View>

      {/* Alert Types Section */}
      <View style={[styles.section, { borderBottomColor: isDarkMode ? '#333333' : '#E0E0E0', borderBottomWidth: 1 }]}>
        <Text style={[styles.sectionTitle, { color: isDarkMode ? '#FFFFFF' : '#212121' }]}>
          {getLabel('alertTypes', 'Alert Types')}
        </Text>

        {/* Booking Alerts */}
        <View style={styles.setting}>
          <View style={styles.settingTextContainer}>
            <Text style={[styles.settingTitle, { color: isDarkMode ? '#FFFFFF' : '#212121' }]}>
              {getLabel('bookingAlerts', 'Booking Alerts')}
            </Text>
          </View>
          <Switch
            value={settings.bookingAlerts}
            onValueChange={() => handleToggle('bookingAlerts')}
            trackColor={{ false: '#767577', true: '#007AFF' }}
            thumbColor={'#f4f3f4'}
            disabled={!settings.enableNotifications}
          />
        </View>

        {/* Delay Alerts */}
        <View style={styles.setting}>
          <View style={styles.settingTextContainer}>
            <Text style={[styles.settingTitle, { color: isDarkMode ? '#FFFFFF' : '#212121' }]}>
              {getLabel('delayAlerts', 'Delay Alerts')}
            </Text>
          </View>
          <Switch
            value={settings.delayAlerts}
            onValueChange={() => handleToggle('delayAlerts')}
            trackColor={{ false: '#767577', true: '#007AFF' }}
            thumbColor={'#f4f3f4'}
            disabled={!settings.enableNotifications}
          />
        </View>

        {/* Price Alerts */}
        <View style={styles.setting}>
          <View style={styles.settingTextContainer}>
            <Text style={[styles.settingTitle, { color: isDarkMode ? '#FFFFFF' : '#212121' }]}>
              {getLabel('priceAlerts', 'Price Alerts')}
            </Text>
          </View>
          <Switch
            value={settings.priceAlerts}
            onValueChange={() => handleToggle('priceAlerts')}
            trackColor={{ false: '#767577', true: '#007AFF' }}
            thumbColor={'#f4f3f4'}
            disabled={!settings.enableNotifications}
          />
        </View>

        {/* System Alerts */}
        <View style={styles.setting}>
          <View style={styles.settingTextContainer}>
            <Text style={[styles.settingTitle, { color: isDarkMode ? '#FFFFFF' : '#212121' }]}>
              {getLabel('systemAlerts', 'System Alerts')}
            </Text>
          </View>
          <Switch
            value={settings.systemAlerts}
            onValueChange={() => handleToggle('systemAlerts')}
            trackColor={{ false: '#767577', true: '#007AFF' }}
            thumbColor={'#f4f3f4'}
            disabled={!settings.enableNotifications}
          />
        </View>
      </View>

      {/* Notification Preferences Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: isDarkMode ? '#FFFFFF' : '#212121' }]}>
          {getLabel('preferences', 'Preferences')}
        </Text>

        {/* Vibration */}
        <View style={styles.setting}>
          <View style={styles.settingTextContainer}>
            <Text style={[styles.settingTitle, { color: isDarkMode ? '#FFFFFF' : '#212121' }]}>
              {getLabel('vibrate', 'Vibrate')}
            </Text>
          </View>
          <Switch
            value={settings.vibration}
            onValueChange={() => handleToggle('vibration')}
            trackColor={{ false: '#767577', true: '#007AFF' }}
            thumbColor={'#f4f3f4'}
            disabled={!settings.enableNotifications}
          />
        </View>

        {/* Sound */}
        <View style={styles.setting}>
          <View style={styles.settingTextContainer}>
            <Text style={[styles.settingTitle, { color: isDarkMode ? '#FFFFFF' : '#212121' }]}>
              {getLabel('sound', 'Sound')}
            </Text>
          </View>
          <Switch
            value={settings.sound}
            onValueChange={() => handleToggle('sound')}
            trackColor={{ false: '#767577', true: '#007AFF' }}
            thumbColor={'#f4f3f4'}
            disabled={!settings.enableNotifications}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  section: {
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  settingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  settingDescription: {
    fontSize: 14,
    marginTop: 4,
  },
  setting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
});

export default NotificationSettingsScreen;
