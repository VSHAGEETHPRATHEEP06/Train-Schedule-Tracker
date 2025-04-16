import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from './StorageService';

// Add notification storage key
STORAGE_KEYS.NOTIFICATIONS = 'user_notifications';
STORAGE_KEYS.NOTIFICATION_SETTINGS = 'notification_settings';

// Sample notification types
export const NOTIFICATION_TYPES = {
  BOOKING_CONFIRMATION: 'booking_confirmation',
  TRIP_REMINDER: 'trip_reminder',
  DELAY_ALERT: 'delay_alert',
  PRICE_CHANGE: 'price_change',
  SYSTEM: 'system'
};

/**
 * Service to handle notifications 
 */
class NotificationService {
  /**
   * Get all user notifications
   * @returns {Promise<Array>} Array of notifications
   */
  async getNotifications() {
    try {
      const notificationsJSON = await AsyncStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      return notificationsJSON ? JSON.parse(notificationsJSON) : [];
    } catch (error) {
      console.error('Error getting notifications:', error);
      return [];
    }
  }

  /**
   * Save a new notification
   * @param {Object} notification Notification object
   * @returns {Promise<boolean>} Success status
   */
  async addNotification(notification) {
    try {
      // Get existing notifications
      const notifications = await this.getNotifications();
      
      // Add new notification with unique ID and timestamp
      const newNotification = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        read: false,
        ...notification
      };
      
      // Add to beginning of array (newest first)
      notifications.unshift(newNotification);
      
      // Save to storage
      await AsyncStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
      return true;
    } catch (error) {
      console.error('Error adding notification:', error);
      return false;
    }
  }

  /**
   * Mark a notification as read
   * @param {string} notificationId ID of notification to mark as read
   * @returns {Promise<boolean>} Success status
   */
  async markAsRead(notificationId) {
    try {
      // Get existing notifications
      const notifications = await this.getNotifications();
      
      // Find notification by ID
      const updatedNotifications = notifications.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true } 
          : notification
      );
      
      // Save to storage
      await AsyncStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updatedNotifications));
      return true;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return false;
    }
  }

  /**
   * Mark all notifications as read
   * @returns {Promise<boolean>} Success status
   */
  async markAllAsRead() {
    try {
      // Get existing notifications
      const notifications = await this.getNotifications();
      
      // Mark all as read
      const updatedNotifications = notifications.map(notification => ({
        ...notification,
        read: true
      }));
      
      // Save to storage
      await AsyncStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updatedNotifications));
      return true;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      return false;
    }
  }

  /**
   * Delete a notification
   * @param {string} notificationId ID of notification to delete
   * @returns {Promise<boolean>} Success status
   */
  async deleteNotification(notificationId) {
    try {
      // Get existing notifications
      const notifications = await this.getNotifications();
      
      // Remove notification by ID
      const updatedNotifications = notifications.filter(
        notification => notification.id !== notificationId
      );
      
      // Save to storage
      await AsyncStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updatedNotifications));
      return true;
    } catch (error) {
      console.error('Error deleting notification:', error);
      return false;
    }
  }

  /**
   * Clear all notifications
   * @returns {Promise<boolean>} Success status
   */
  async clearAllNotifications() {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify([]));
      return true;
    } catch (error) {
      console.error('Error clearing notifications:', error);
      return false;
    }
  }

  /**
   * Get notification settings
   * @returns {Promise<Object>} Notification settings
   */
  async getNotificationSettings() {
    try {
      const settingsJSON = await AsyncStorage.getItem(STORAGE_KEYS.NOTIFICATION_SETTINGS);
      
      // Default settings if none exist
      const defaultSettings = {
        enabled: true,
        bookingAlerts: true,
        delayAlerts: true,
        priceAlerts: true,
        systemAlerts: true,
        vibrate: true,
        sound: true
      };
      
      return settingsJSON ? JSON.parse(settingsJSON) : defaultSettings;
    } catch (error) {
      console.error('Error getting notification settings:', error);
      return {
        enabled: true,
        bookingAlerts: true,
        delayAlerts: true,
        priceAlerts: true,
        systemAlerts: true,
        vibrate: true,
        sound: true
      };
    }
  }

  /**
   * Save notification settings
   * @param {Object} settings Notification settings
   * @returns {Promise<boolean>} Success status
   */
  async saveNotificationSettings(settings) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.NOTIFICATION_SETTINGS, JSON.stringify(settings));
      return true;
    } catch (error) {
      console.error('Error saving notification settings:', error);
      return false;
    }
  }

  /**
   * Get unread notifications count
   * @returns {Promise<number>} Number of unread notifications
   */
  async getUnreadCount() {
    try {
      const notifications = await this.getNotifications();
      return notifications.filter(notification => !notification.read).length;
    } catch (error) {
      console.error('Error getting unread count:', error);
      return 0;
    }
  }

  /**
   * Add sample notifications for testing
   * @returns {Promise<boolean>} Success status
   */
  async addSampleNotifications() {
    try {
      const sampleNotifications = [
        {
          title: 'Booking Confirmed',
          message: 'Your booking #BK12345 for Colombo to Kandy has been confirmed.',
          type: NOTIFICATION_TYPES.BOOKING_CONFIRMATION,
          read: false,
          timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
          data: {
            bookingId: 'BK12345',
            trainName: 'Express 1001',
            from: 'Colombo',
            to: 'Kandy'
          }
        },
        {
          title: 'Trip Reminder',
          message: 'Your trip from Colombo to Galle is tomorrow at 10:30 AM.',
          type: NOTIFICATION_TYPES.TRIP_REMINDER,
          read: true,
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
          data: {
            bookingId: 'BK12344',
            trainName: 'Express 1005',
            from: 'Colombo',
            to: 'Galle',
            departureTime: '10:30 AM',
            departureDate: 'tomorrow'
          }
        },
        {
          title: 'Delay Alert',
          message: 'Train Express 1003 is delayed by 20 minutes.',
          type: NOTIFICATION_TYPES.DELAY_ALERT,
          read: false,
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
          data: {
            trainName: 'Express 1003',
            delayMinutes: 20
          }
        },
        {
          title: 'New Fare Prices',
          message: 'Fare prices for the Colombo-Jaffna route have been updated.',
          type: NOTIFICATION_TYPES.PRICE_CHANGE,
          read: false,
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
          data: {
            route: 'Colombo-Jaffna'
          }
        },
        {
          title: 'Welcome to Train Tracker',
          message: 'Thank you for using Sri Lanka Train Schedule Tracker!',
          type: NOTIFICATION_TYPES.SYSTEM,
          read: true,
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(), // 7 days ago
          data: {}
        }
      ];

      // Clear existing notifications
      await this.clearAllNotifications();
      
      // Add each sample notification with a unique ID
      for (const notification of sampleNotifications) {
        await this.addNotification(notification);
      }
      
      return true;
    } catch (error) {
      console.error('Error adding sample notifications:', error);
      return false;
    }
  }
}

export default new NotificationService();
