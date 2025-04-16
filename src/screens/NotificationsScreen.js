import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  FlatList,
  ActivityIndicator,
  Alert,
  SafeAreaView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SIZES, SPACING, SHADOWS } from '../config/theme';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import NotificationService from '../services/NotificationService';
import NotificationItem from '../components/NotificationItem';

/**
 * NotificationsScreen - Display and manage user notifications
 */
const NotificationsScreen = ({ navigation }) => {
  const { theme, isDarkMode } = useTheme();
  const { getLabel } = useLanguage();
  
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  
  // Load notifications
  const loadNotifications = async () => {
    try {
      setLoading(true);
      
      // Check if we have any notifications
      const existingNotifications = await NotificationService.getNotifications();
      
      // If no notifications exist, add sample notifications (for demo)
      if (existingNotifications.length === 0) {
        await NotificationService.addSampleNotifications();
      }
      
      // Get notifications
      const notifs = await NotificationService.getNotifications();
      setNotifications(notifs);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  // Initial load
  useEffect(() => {
    loadNotifications();
    
    // Add listener for when screen comes into focus
    const unsubscribe = navigation.addListener('focus', loadNotifications);
    return unsubscribe;
  }, [navigation]);
  
  // Handle refresh
  const handleRefresh = () => {
    setRefreshing(true);
    loadNotifications();
  };
  
  // Handle notification press
  const handleNotificationPress = async (notification) => {
    // If not already read, mark as read
    if (!notification.read) {
      await NotificationService.markAsRead(notification.id);
      
      // Update notifications list
      const updatedNotifications = notifications.map(n => 
        n.id === notification.id ? { ...n, read: true } : n
      );
      setNotifications(updatedNotifications);
    }
    
    // Handle different notification types and navigate accordingly
    switch (notification.type) {
      case 'booking_confirmation':
        // Navigation would go here in a real app
        Alert.alert(getLabel('bookingDetails'), `${getLabel('bookingId')}: ${notification.data.bookingId}\n${getLabel('train')}: ${notification.data.trainName}\n${getLabel('route')}: ${notification.data.from} to ${notification.data.to}`);
        break;
      case 'trip_reminder':
        Alert.alert(getLabel('tripDetails'), `${getLabel('yourTripFrom')}: ${notification.data.from} to ${notification.data.to} ${getLabel('isScheduledFor')}: ${notification.data.departureDate} at ${notification.data.departureTime}`);
        break;
      case 'delay_alert':
        Alert.alert(getLabel('delayAlert'), `${notification.data.trainName} ${getLabel('isDelayedBy')}: ${notification.data.delayMinutes} ${getLabel('minutes')}.`);
        break;
      default:
        // Just show the message for other types
        Alert.alert(notification.title, notification.message);
    }
  };
  
  // Handle notification delete
  const handleNotificationDelete = (notificationId) => {
    Alert.alert(
      getLabel('deleteNotification'),
      getLabel('deleteNotificationConfirm'),
      [
        {
          text: getLabel('cancel'),
          style: 'cancel'
        },
        {
          text: getLabel('delete'),
          style: 'destructive',
          onPress: async () => {
            try {
              await NotificationService.deleteNotification(notificationId);
              
              // Update notifications list
              const updatedNotifications = notifications.filter(n => n.id !== notificationId);
              setNotifications(updatedNotifications);
            } catch (error) {
              console.error('Error deleting notification:', error);
            }
          }
        }
      ]
    );
  };
  
  // Handle clear all
  const handleClearAll = () => {
    if (notifications.length === 0) return;
    
    Alert.alert(
      getLabel('clearAllNotifications'),
      getLabel('clearAllNotificationsConfirm'),
      [
        {
          text: getLabel('cancel'),
          style: 'cancel'
        },
        {
          text: getLabel('clearAll'),
          style: 'destructive',
          onPress: async () => {
            try {
              await NotificationService.clearAllNotifications();
              setNotifications([]);
            } catch (error) {
              console.error('Error clearing notifications:', error);
            }
          }
        }
      ]
    );
  };
  
  // Handle mark all as read
  const handleMarkAllAsRead = async () => {
    // Check if there are any unread notifications
    const hasUnread = notifications.some(n => !n.read);
    if (!hasUnread) return;
    
    try {
      await NotificationService.markAllAsRead();
      
      // Update notifications list
      const updatedNotifications = notifications.map(n => ({ ...n, read: true }));
      setNotifications(updatedNotifications);
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };
  
  // Navigate to notification settings
  const goToSettings = () => {
    navigation.navigate('NotificationSettings');
  };
  
  return (
    <SafeAreaView 
      style={[styles.container, { backgroundColor: isDarkMode ? '#121212' : '#f9f9f9' }]}
    >
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={isDarkMode ? '#121212' : '#FFFFFF'}
      />
      
      {/* Header */}
      <View style={[styles.header, { backgroundColor: isDarkMode ? '#121212' : '#FFFFFF' }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons 
            name="arrow-back" 
            size={24} 
            color={isDarkMode ? '#FFFFFF' : '#000000'} 
          />
        </TouchableOpacity>
        
        <Text style={[styles.headerTitle, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>
          {getLabel('notifications')}
        </Text>
        
        <View style={styles.headerButtons}>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={goToSettings}
            hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
          >
            <Ionicons 
              name="settings-outline" 
              size={24} 
              color={isDarkMode ? '#FFFFFF' : '#000000'} 
            />
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Action buttons */}
      {notifications.length > 0 && (
        <View style={[
          styles.actionButtons, 
          { backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF' }
        ]}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handleMarkAllAsRead}
          >
            <Ionicons 
              name="checkmark-done-outline" 
              size={18} 
              color={isDarkMode ? '#DDDDDD' : '#555555'} 
            />
            <Text style={[
              styles.actionButtonText, 
              { color: isDarkMode ? '#DDDDDD' : '#555555' }
            ]}>
              {getLabel('markAllRead')}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handleClearAll}
          >
            <Ionicons 
              name="trash-outline" 
              size={18} 
              color={isDarkMode ? '#DDDDDD' : '#555555'} 
            />
            <Text style={[
              styles.actionButtonText, 
              { color: isDarkMode ? '#DDDDDD' : '#555555' }
            ]}>
              {getLabel('clearAll')}
            </Text>
          </TouchableOpacity>
        </View>
      )}
      
      {/* Notifications list */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={[
            styles.loadingText, 
            { color: isDarkMode ? '#FFFFFF' : '#212121' }
          ]}>
            {getLabel('loadingNotifications')}
          </Text>
        </View>
      ) : notifications.length > 0 ? (
        <FlatList
          data={notifications}
          renderItem={({ item }) => (
            <NotificationItem
              notification={item}
              onPress={handleNotificationPress}
              onDelete={handleNotificationDelete}
              theme={isDarkMode ? 'dark' : 'light'}
              translations={getLabel}
            />
          )}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.notificationsList}
          showsVerticalScrollIndicator={false}
          onRefresh={handleRefresh}
          refreshing={refreshing}
        />
      ) : (
        <View style={styles.emptyStateContainer}>
          <Ionicons 
            name="notifications-off-outline" 
            size={60} 
            color={isDarkMode ? '#555555' : '#CCCCCC'} 
          />
          <Text style={[
            styles.emptyStateText, 
            { color: isDarkMode ? '#AAAAAA' : '#888888' }
          ]}>
            {getLabel('noNotifications')}
          </Text>
          <Text style={[
            styles.emptyStateSubtext, 
            { color: isDarkMode ? '#777777' : '#999999' }
          ]}>
            {getLabel('checkLater')}
          </Text>
          
          <TouchableOpacity
            style={[styles.refreshButton, { backgroundColor: '#007AFF' }]}
            onPress={loadNotifications}
          >
            <Text style={styles.refreshButtonText}>
              {getLabel('addSampleNotifications')}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.small,
  },
  backButton: {
    position: 'absolute',
    left: SPACING.m,
    zIndex: 10,
  },
  headerTitle: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
  },
  headerButtons: {
    position: 'absolute',
    right: SPACING.m,
    flexDirection: 'row',
  },
  headerButton: {
    marginLeft: SPACING.s,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: SPACING.m,
    marginBottom: SPACING.s,
    ...SHADOWS.small,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButtonText: {
    marginLeft: 4,
    fontSize: SIZES.small,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: SPACING.m,
    fontSize: SIZES.medium,
  },
  notificationsList: {
    padding: SPACING.m,
    paddingTop: SPACING.s,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  emptyStateText: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    marginTop: SPACING.l,
  },
  emptyStateSubtext: {
    fontSize: SIZES.medium,
    textAlign: 'center',
    marginTop: SPACING.m,
  },
  refreshButton: {
    marginTop: SPACING.xl,
    paddingVertical: SPACING.s,
    paddingHorizontal: SPACING.l,
    borderRadius: 8,
  },
  refreshButtonText: {
    color: 'white',
    fontSize: SIZES.medium,
    fontWeight: '600',
  }
});

export default NotificationsScreen;
