import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
  Image,
  Switch,
  Modal
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { SIZES, SPACING } from '../config/theme';
import { useTheme } from '../context/ThemeContext';
import { useLanguage, LANGUAGES } from '../context/LanguageContext';
import { useCurrency, CURRENCIES } from '../context/CurrencyContext';
import Button from '../components/Button';
import StorageService from '../services/StorageService';

/**
 * ProfileScreen - User profile and account settings
 */
const ProfileScreen = ({ navigation }) => {
  const { theme, toggleTheme, isDarkMode } = useTheme();
  const { currentLanguage, changeLanguage, getLabel } = useLanguage();
  const { currentCurrency, changeCurrency, formatPrice } = useCurrency();
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingsCount, setBookingsCount] = useState(0);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);
  const [showFeatureModal, setShowFeatureModal] = useState(false);
  const [featureModalContent, setFeatureModalContent] = useState({
    title: '',
    message: 'This feature is coming soon!'
  });

  // Load user data
  useEffect(() => {
    const loadUserData = async () => {
      try {
        setLoading(true);
        
        // Load user profile
        const userProfile = await StorageService.getUserProfile();
        setUser(userProfile);
        
        // Load bookings count
        const bookings = await StorageService.getBookings() || [];
        setBookingsCount(bookings.length);
        
        // Load favorites count
        const favorites = await StorageService.getFavorites() || [];
        setFavoritesCount(favorites.length);
      } catch (error) {
        console.error('Error loading profile data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();

    // Listen for navigation focus to refresh data
    const unsubscribe = navigation.addListener('focus', loadUserData);
    return unsubscribe;
  }, [navigation]);

  // Handle logout
  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: async () => {
            try {
              // Remove user profile
              await StorageService.removeData('user_profile');
              
              // Navigate to auth
              navigation.reset({
                index: 0,
                routes: [{ name: 'Auth' }],
              });
            } catch (error) {
              console.error('Error logging out:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          }
        }
      ]
    );
  };

  // Handle language change
  const handleLanguageChange = (languageCode) => {
    changeLanguage(languageCode);
    setShowLanguageModal(false);
  };

  // Handle currency change
  const handleCurrencyChange = (currencyCode) => {
    changeCurrency(currencyCode);
    setShowCurrencyModal(false);
  };

  // Get language display name
  const getLanguageDisplayName = (code) => {
    switch(code) {
      case LANGUAGES.ENGLISH: return 'English';
      case LANGUAGES.TAMIL: return 'தமிழ்';
      case LANGUAGES.SINHALA: return 'සිංහල';
      default: return 'English';
    }
  };

  // Get currency display name
  const getCurrencyDisplayName = (code) => {
    switch(code) {
      case CURRENCIES.LKR: return 'Sri Lankan Rupees (LKR)';
      case CURRENCIES.USD: return 'US Dollar (USD)';
      case CURRENCIES.EUR: return 'Euro (EUR)';
      default: return 'Sri Lankan Rupees (LKR)';
    }
  };

  // Handle showing feature placeholder with custom modal
  const showFeaturePlaceholder = (title) => {
    // Check if it's the Edit Profile feature - if so, navigate to the edit screen
    if (title === getLabel('editProfile') || title === 'Edit Profile') {
      navigation.navigate('EditProfile');
      return;
    }
    
    // Check if it's the Notifications feature - if so, navigate to notifications screen
    if (title === getLabel('notifications') || title === 'Notifications') {
      navigation.navigate('Notifications', {
        theme: isDarkMode ? 'dark' : 'light',
        isDarkMode: isDarkMode,
        getLabel: getLabel
      });
      return;
    }
    
    setFeatureModalContent({
      title,
      message: 'This feature is coming soon!'
    });
    setShowFeatureModal(true);
  };

  const handleNotificationSettings = () => {
    navigation.navigate('Notifications', {
      theme: isDarkMode ? 'dark' : 'light',
      isDarkMode: isDarkMode,
      getLabel: getLabel
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={theme.dark ? "light-content" : "dark-content"} backgroundColor={theme.background} />
      
      {/* Profile Header */}
      <View style={[styles.header, { backgroundColor: theme.primary }]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        
        <View style={styles.headerContent}>
          <View style={styles.avatarContainer}>
            <View style={[styles.avatar, { backgroundColor: theme.primary + '20', justifyContent: 'center', alignItems: 'center', ...theme.shadows.medium }]}>
              <Ionicons name="person" size={60} color={theme.primary} />
            </View>
            <TouchableOpacity 
              style={[styles.editAvatarButton, { backgroundColor: theme.background }]}
              onPress={() => Alert.alert('Change Photo', 'This feature will be available soon!')}
            >
              <Ionicons name="camera" size={20} color={theme.primary} />
            </TouchableOpacity>
          </View>
          
          <Text style={[styles.userName, { color: theme.text }]}>{user?.name || 'Saman Perera'}</Text>
          <Text style={[styles.userEmail, { color: theme.card }]}>{user?.email || 'saman@example.com'}</Text>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.card }]}>{bookingsCount || 3}</Text>
              <Text style={[styles.statLabel, { color: theme.card }]}>Bookings</Text>
            </View>
            
            <View style={[styles.statSeparator, { backgroundColor: `${theme.card}40` }]} />
            
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.card }]}>{favoritesCount || 5}</Text>
              <Text style={[styles.statLabel, { color: theme.card }]}>Favorites</Text>
            </View>
          </View>
        </View>
      </View>
      
      <ScrollView style={styles.content}>
        {/* Profile Actions */}
        <View style={[styles.sectionContainer, { backgroundColor: theme.card, ...theme.shadows.small }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Account</Text>
          
          <TouchableOpacity 
            style={[styles.menuItem, { borderBottomColor: theme.border }]}
            onPress={() => showFeaturePlaceholder('Edit Profile')}
          >
            <View style={[styles.menuIconContainer, { backgroundColor: theme.primary + '20' }]}>
              <Ionicons name="person-outline" size={22} color={theme.primary} />
            </View>
            <Text style={[styles.menuLabel, { color: theme.text }]}>Edit Profile</Text>
            <Ionicons name="chevron-forward" size={22} color={theme.textSecondary} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.menuItem, { borderBottomColor: theme.border }]}
            onPress={() => navigation.navigate('Favorites')}
          >
            <View style={[styles.menuIconContainer, { backgroundColor: theme.primary + '20' }]}>
              <Ionicons name="heart-outline" size={22} color={theme.primary} />
            </View>
            <Text style={[styles.menuLabel, { color: theme.text }]}>Favorite Trains</Text>
            <Ionicons name="chevron-forward" size={22} color={theme.textSecondary} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.menuItem, { borderBottomColor: theme.border }]}
            onPress={() => navigation.navigate('BookingsTab')}
          >
            <View style={[styles.menuIconContainer, { backgroundColor: theme.primary + '20' }]}>
              <Ionicons name="document-text-outline" size={22} color={theme.primary} />
            </View>
            <Text style={[styles.menuLabel, { color: theme.text }]}>My Bookings</Text>
            <Ionicons name="chevron-forward" size={22} color={theme.textSecondary} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.menuItem, { borderBottomColor: theme.border }]}
            onPress={() => showFeaturePlaceholder('Payment Methods')}
          >
            <View style={[styles.menuIconContainer, { backgroundColor: theme.primary + '20' }]}>
              <Ionicons name="card-outline" size={22} color={theme.primary} />
            </View>
            <Text style={[styles.menuLabel, { color: theme.text }]}>Payment Methods</Text>
            <Ionicons name="chevron-forward" size={22} color={theme.textSecondary} />
          </TouchableOpacity>
          
        </View>
        
        {/* Preferences */}
        <View style={[styles.sectionContainer, { backgroundColor: theme.card, ...theme.shadows.small }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Preferences</Text>
          
          {/* Language Option */}
          <TouchableOpacity 
            style={[styles.menuItem, { borderBottomColor: theme.border }]}
            onPress={() => setShowLanguageModal(true)}
          >
            <View style={[styles.menuIconContainer, { backgroundColor: theme.primary + '20' }]}>
              <MaterialIcons name="language" size={22} color={theme.primary} />
            </View>
            <View style={styles.menuTextContainer}>
              <Text style={[styles.menuLabel, { color: theme.text }]}>Language</Text>
              <Text style={[styles.menuValue, { color: theme.textSecondary }]}>
                {getLanguageDisplayName(currentLanguage)}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={22} color={theme.textSecondary} />
          </TouchableOpacity>
          
          {/* Currency Option */}
          <TouchableOpacity 
            style={[styles.menuItem, { borderBottomColor: theme.border }]}
            onPress={() => setShowCurrencyModal(true)}
          >
            <View style={[styles.menuIconContainer, { backgroundColor: theme.primary + '20' }]}>
              <Ionicons name="cash-outline" size={22} color={theme.primary} />
            </View>
            <View style={styles.menuTextContainer}>
              <Text style={[styles.menuLabel, { color: theme.text }]}>Currency</Text>
              <Text style={[styles.menuValue, { color: theme.textSecondary }]}>
                {getCurrencyDisplayName(currentCurrency)}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={22} color={theme.textSecondary} />
          </TouchableOpacity>
          
          {/* Dark Mode Toggle */}
          <View style={[styles.menuItem, { borderBottomColor: theme.border }]}>
            <View style={[styles.menuIconContainer, { backgroundColor: theme.primary + '20' }]}>
              <Ionicons 
                name={isDarkMode ? "moon" : "sunny-outline"} 
                size={22} 
                color={theme.primary} 
              />
            </View>
            <Text style={[styles.menuLabel, { color: theme.text }]}>Dark Mode</Text>
            <Switch
              trackColor={{ false: "#767577", true: theme.primary + '70' }}
              thumbColor={isDarkMode ? theme.primary : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleTheme}
              value={isDarkMode}
            />
          </View>
          
          {/* Notifications */}
          <TouchableOpacity 
            style={[styles.menuItem, { borderBottomColor: theme.border }]}
            onPress={() => showFeaturePlaceholder('Notifications')}
          >
            <View style={[styles.menuIconContainer, { backgroundColor: theme.primary + '20' }]}>
              <Ionicons name="notifications-outline" size={22} color={theme.primary} />
            </View>
            <Text style={[styles.menuLabel, { color: theme.text }]}>Notifications</Text>
            <Ionicons name="chevron-forward" size={22} color={theme.textSecondary} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.menuItem, { borderBottomColor: theme.border }]}
            onPress={() => showFeaturePlaceholder('Privacy & Security')}
          >
            <View style={[styles.menuIconContainer, { backgroundColor: theme.primary + '20' }]}>
              <Ionicons name="lock-closed-outline" size={22} color={theme.primary} />
            </View>
            <Text style={[styles.menuLabel, { color: theme.text }]}>Privacy & Security</Text>
            <Ionicons name="chevron-forward" size={22} color={theme.textSecondary} />
          </TouchableOpacity>
        </View>
        
        {/* Support & About */}
        <View style={[styles.sectionContainer, { backgroundColor: theme.card, ...theme.shadows.small }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Support & About</Text>
          
          <TouchableOpacity 
            style={[styles.menuItem, { borderBottomColor: theme.border }]}
            onPress={() => Alert.alert('Help Center', 'This feature is coming soon!')}
          >
            <View style={[styles.menuIconContainer, { backgroundColor: theme.primary + '20' }]}>
              <Ionicons name="help-circle-outline" size={22} color={theme.primary} />
            </View>
            <Text style={[styles.menuLabel, { color: theme.text }]}>Help Center</Text>
            <Ionicons name="chevron-forward" size={22} color={theme.textSecondary} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.menuItem, { borderBottomColor: theme.border }]}
            onPress={() => Alert.alert('About', 'Sri Lanka Railways Schedule Tracker v1.0.0')}
          >
            <View style={[styles.menuIconContainer, { backgroundColor: theme.primary + '20' }]}>
              <Ionicons name="information-circle-outline" size={22} color={theme.primary} />
            </View>
            <Text style={[styles.menuLabel, { color: theme.text }]}>About</Text>
            <Ionicons name="chevron-forward" size={22} color={theme.textSecondary} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.menuItem, { borderBottomColor: theme.border }]}
            onPress={() => Alert.alert('Terms & Conditions', 'This feature is coming soon!')}
          >
            <View style={[styles.menuIconContainer, { backgroundColor: theme.primary + '20' }]}>
              <Ionicons name="document-outline" size={22} color={theme.primary} />
            </View>
            <Text style={[styles.menuLabel, { color: theme.text }]}>Terms & Conditions</Text>
            <Ionicons name="chevron-forward" size={22} color={theme.textSecondary} />
          </TouchableOpacity>
        </View>
        
        {/* Logout */}
        <View style={styles.logoutContainer}>
          <Button
            title="Logout"
            variant="danger"
            style={styles.logoutButton}
            onPress={handleLogout}
          />
        </View>
        
        {/* App Version */}
        <Text style={[styles.versionText, { color: theme.textSecondary }]}>Version 1.0.0</Text>
      </ScrollView>
      
      {/* Language Modal */}
      <Modal
        visible={showLanguageModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowLanguageModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, { backgroundColor: theme.cardBackground }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>Select Language</Text>
              <TouchableOpacity onPress={() => setShowLanguageModal(false)}>
                <Ionicons name="close" size={24} color={theme.text} />
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity 
              style={[styles.modalOption, currentLanguage === LANGUAGES.ENGLISH && styles.selectedOption]}
              onPress={() => handleLanguageChange(LANGUAGES.ENGLISH)}
            >
              <Text style={[styles.modalOptionText, { color: theme.text }]}>English</Text>
              {currentLanguage === LANGUAGES.ENGLISH && (
                <Ionicons name="checkmark" size={24} color={theme.primary} />
              )}
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.modalOption, currentLanguage === LANGUAGES.TAMIL && styles.selectedOption]}
              onPress={() => handleLanguageChange(LANGUAGES.TAMIL)}
            >
              <Text style={[styles.modalOptionText, { color: theme.text }]}>தமிழ்</Text>
              {currentLanguage === LANGUAGES.TAMIL && (
                <Ionicons name="checkmark" size={24} color={theme.primary} />
              )}
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.modalOption, currentLanguage === LANGUAGES.SINHALA && styles.selectedOption]}
              onPress={() => handleLanguageChange(LANGUAGES.SINHALA)}
            >
              <Text style={[styles.modalOptionText, { color: theme.text }]}>සිංහල</Text>
              {currentLanguage === LANGUAGES.SINHALA && (
                <Ionicons name="checkmark" size={24} color={theme.primary} />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      
      {/* Currency Modal */}
      <Modal
        visible={showCurrencyModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowCurrencyModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, { backgroundColor: theme.cardBackground }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>Select Currency</Text>
              <TouchableOpacity onPress={() => setShowCurrencyModal(false)}>
                <Ionicons name="close" size={24} color={theme.text} />
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity 
              style={[styles.modalOption, currentCurrency === CURRENCIES.LKR && styles.selectedOption]}
              onPress={() => handleCurrencyChange(CURRENCIES.LKR)}
            >
              <Text style={[styles.modalOptionText, { color: theme.text }]}>Sri Lankan Rupees (LKR)</Text>
              {currentCurrency === CURRENCIES.LKR && (
                <Ionicons name="checkmark" size={24} color={theme.primary} />
              )}
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.modalOption, currentCurrency === CURRENCIES.USD && styles.selectedOption]}
              onPress={() => handleCurrencyChange(CURRENCIES.USD)}
            >
              <Text style={[styles.modalOptionText, { color: theme.text }]}>US Dollar (USD)</Text>
              {currentCurrency === CURRENCIES.USD && (
                <Ionicons name="checkmark" size={24} color={theme.primary} />
              )}
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.modalOption, currentCurrency === CURRENCIES.EUR && styles.selectedOption]}
              onPress={() => handleCurrencyChange(CURRENCIES.EUR)}
            >
              <Text style={[styles.modalOptionText, { color: theme.text }]}>Euro (EUR)</Text>
              {currentCurrency === CURRENCIES.EUR && (
                <Ionicons name="checkmark" size={24} color={theme.primary} />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      
      {/* Feature Placeholder Modal */}
      <Modal
        visible={showFeatureModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowFeatureModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, { backgroundColor: theme.card }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>{featureModalContent.title}</Text>
            <Text style={[styles.modalMessage, { color: theme.textSecondary }]}>{featureModalContent.message}</Text>
            
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: theme.primary }]}
              onPress={() => setShowFeatureModal(false)}
            >
              <Text style={[styles.modalButtonText, { color: theme.card }]}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: StatusBar.currentHeight + SPACING.l,
    paddingBottom: SPACING.xxl,
    paddingHorizontal: SPACING.xl,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  backButton: {
    position: 'absolute',
    top: StatusBar.currentHeight + SPACING.s,
    left: SPACING.m,
    zIndex: 10,
  },
  headerContent: {
    alignItems: 'center',
    marginTop: SPACING.xl,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: SPACING.m,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: 'white',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: {
    fontSize: SIZES.xlarge,
    fontWeight: 'bold',
    marginBottom: SPACING.xs,
  },
  userEmail: {
    fontSize: SIZES.medium,
    opacity: 0.8,
    marginBottom: SPACING.m,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingVertical: SPACING.s,
    paddingHorizontal: SPACING.xl,
  },
  statItem: {
    alignItems: 'center',
    paddingHorizontal: SPACING.l,
  },
  statValue: {
    fontSize: SIZES.xlarge,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: SIZES.small,
    opacity: 0.8,
  },
  statSeparator: {
    width: 1,
    height: '70%',
    alignSelf: 'center',
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
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.m,
    paddingHorizontal: SPACING.s,
    borderBottomWidth: 1,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.m,
  },
  menuLabel: {
    flex: 1,
    fontSize: SIZES.medium,
  },
  menuTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  menuValue: {
    fontSize: SIZES.small,
    marginTop: 2,
  },
  logoutContainer: {
    marginVertical: SPACING.m,
    paddingHorizontal: SPACING.s,
  },
  logoutButton: {
    marginBottom: SPACING.m,
  },
  versionText: {
    textAlign: 'center',
    fontSize: SIZES.small,
    marginBottom: SPACING.xxl,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    padding: SPACING.l,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.m,
  },
  modalTitle: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
  },
  modalMessage: {
    fontSize: SIZES.medium,
    textAlign: 'center',
    marginBottom: SPACING.l,
  },
  modalButton: {
    paddingVertical: SPACING.s,
    paddingHorizontal: SPACING.l,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: SIZES.medium,
    fontWeight: '600',
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.m,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalOptionText: {
    fontSize: SIZES.medium,
  },
  selectedOption: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
});

export default ProfileScreen;
