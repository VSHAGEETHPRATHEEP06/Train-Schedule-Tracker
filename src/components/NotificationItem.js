import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { format, isToday, isYesterday } from 'date-fns';
import { SIZES, SPACING } from '../config/theme';
import { NOTIFICATION_TYPES } from '../services/NotificationService';

// Helper function to get notification icon based on type
const getNotificationIcon = (type) => {
  switch (type) {
    case NOTIFICATION_TYPES.BOOKING_CONFIRMATION:
      return 'checkmark-circle';
    case NOTIFICATION_TYPES.DELAY_ALERT:
      return 'time';
    case NOTIFICATION_TYPES.PRICE_CHANGE:
      return 'pricetag';
    case NOTIFICATION_TYPES.TRIP_REMINDER:
      return 'calendar';
    case NOTIFICATION_TYPES.SYSTEM:
      return 'information-circle';
    default:
      return 'notifications';
  }
};

// Helper function to get notification color based on type
const getNotificationColor = (type, isDarkMode) => {
  switch (type) {
    case NOTIFICATION_TYPES.BOOKING_CONFIRMATION:
      return '#4CAF50'; // Green
    case NOTIFICATION_TYPES.DELAY_ALERT:
      return '#FF9800'; // Orange/Warning
    case NOTIFICATION_TYPES.PRICE_CHANGE:
      return '#2196F3'; // Blue
    case NOTIFICATION_TYPES.TRIP_REMINDER:
      return '#9C27B0'; // Purple
    case NOTIFICATION_TYPES.SYSTEM:
      return '#2196F3'; // Blue
    default:
      return isDarkMode ? '#FFFFFF' : '#000000';
  }
};

// Helper function to format timestamp with translation function
const formatTimestamp = (timestamp, getTranslation) => {
  const date = new Date(timestamp);
  
  if (isToday(date)) {
    return `${getTranslation('today', 'Today')}, ${format(date, 'h:mm a')}`;
  } else if (isYesterday(date)) {
    return `${getTranslation('yesterday', 'Yesterday')}, ${format(date, 'h:mm a')}`;
  } else {
    return format(date, 'MMM d, yyyy, h:mm a');
  }
};

// Helper function to get notification type text with translation function
const getNotificationTypeText = (type, getTranslation) => {
  switch (type) {
    case NOTIFICATION_TYPES.BOOKING_CONFIRMATION:
      return getTranslation('bookingConfirmation', 'Booking Confirmed');
    case NOTIFICATION_TYPES.DELAY_ALERT:
      return getTranslation('delayAlert', 'Delay Alert');
    case NOTIFICATION_TYPES.PRICE_CHANGE:
      return getTranslation('priceChange', 'Price Change');
    case NOTIFICATION_TYPES.TRIP_REMINDER:
      return getTranslation('tripReminder', 'Trip Reminder');
    case NOTIFICATION_TYPES.SYSTEM:
      return getTranslation('systemNotification', 'System Notification');
    default:
      return '';
  }
};

/**
 * NotificationItem component
 * @param {Object} notification Notification data
 * @param {Function} onPress Function to call when notification is pressed
 * @param {Function} onDelete Function to call when delete button is pressed
 * @param {String} theme Theme of the app
 * @param {Function} translations Function to get translation strings
 */
const NotificationItem = ({ notification, onPress, onDelete, theme, translations }) => {
  // Use the theme passed as a prop or defaulting to a basic theme
  const isDarkMode = theme === 'dark';
  
  // Create a safe translation getter function
  const getTranslation = (key, fallback) => {
    if (typeof translations === 'function') {
      return translations(key) || fallback;
    }
    return fallback;
  };
  
  // Extract notification properties with defaults
  const { title = '', message = '', timestamp = new Date().toISOString(), read = false, type = '' } = notification || {};
  
  // Get icon based on notification type
  const icon = getNotificationIcon(type);
  
  // Get notification color based on type
  const color = getNotificationColor(type, isDarkMode);
  
  // Format the timestamp
  const formattedTime = formatTimestamp(timestamp, getTranslation);
  
  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF',
          borderLeftColor: color,
          borderLeftWidth: 4,
          opacity: read ? 0.7 : 1,
        },
      ]}
      onPress={() => onPress && onPress(notification)}
      activeOpacity={0.7}
    >
      <View
        style={[
          styles.iconContainer,
          {
            backgroundColor: isDarkMode ? '#333333' : '#F5F5F5',
          },
        ]}
      >
        <Ionicons name={icon} size={24} color={color} />
      </View>
      
      <View style={styles.contentContainer}>
        <View style={styles.headerRow}>
          <Text
            style={[
              styles.title,
              { 
                color: isDarkMode ? '#FFFFFF' : '#212121',
                fontWeight: read ? '500' : '700' 
              },
            ]}
            numberOfLines={1}
          >
            {title}
          </Text>
          <Text style={[styles.time, { color: isDarkMode ? '#AAAAAA' : '#757575' }]}>
            {formattedTime}
          </Text>
        </View>
        
        <Text
          style={[
            styles.message,
            { color: isDarkMode ? '#CCCCCC' : '#424242' },
          ]}
          numberOfLines={2}
        >
          {message}
        </Text>
        
        <Text style={{ color, fontSize: SIZES.small, marginTop: 4 }}>
          {getNotificationTypeText(type, getTranslation)}
        </Text>
      </View>
      
      {onDelete && (
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => onDelete(notification.id)}
          hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
        >
          <Ionicons 
            name="close-circle" 
            size={20} 
            color={isDarkMode ? '#777777' : '#BBBBBB'} 
          />
        </TouchableOpacity>
      )}
      
      {!read && (
        <View style={[styles.unreadIndicator, { backgroundColor: '#007AFF' }]} />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: SPACING.m,
    borderRadius: 10,
    marginBottom: SPACING.s,
    position: 'relative', // For unread indicator
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.m,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: SIZES.medium,
    flex: 1,
    marginRight: SPACING.s,
  },
  time: {
    fontSize: SIZES.small,
  },
  message: {
    fontSize: SIZES.small,
  },
  deleteButton: {
    padding: SPACING.xs,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadIndicator: {
    position: 'absolute',
    top: 8,
    left: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});

export default NotificationItem;
