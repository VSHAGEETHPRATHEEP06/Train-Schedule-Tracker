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
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Animated
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  SIZES, SPACING, SHADOWS
} from '../config/theme';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import Button from '../components/Button';
import StorageService from '../services/StorageService';
import * as ImagePicker from 'expo-image-picker';

/**
 * EditProfileScreen - Edit user profile information
 * Allows users to update their name, email, phone and profile picture
 */
const EditProfileScreen = ({ navigation, route }) => {
  const { theme, isDarkMode } = useTheme();
  const { getLabel } = useLanguage();
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [scaleAnim] = useState(new Animated.Value(1));
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    profileImage: null
  });
  
  // Load user data when screen mounts
  useEffect(() => {
    const loadUserData = async () => {
      try {
        setLoading(true);
        const userProfile = await StorageService.getUserProfile();
        if (userProfile) {
          setUserData({
            name: userProfile.name || '',
            email: userProfile.email || '',
            phone: userProfile.phone || '',
            profileImage: userProfile.profileImage || null
          });
        }
      } catch (error) {
        console.error('Error loading user profile:', error);
        Alert.alert(
          getLabel('error') || 'Error', 
          getLabel('loadProfileError') || 'Failed to load profile data. Please try again.'
        );
      } finally {
        setLoading(false);
      }
    };
    
    loadUserData();
  }, [getLabel]);
  
  // Handle input changes
  const handleChange = (field, value) => {
    setUserData(prevData => ({
      ...prevData,
      [field]: value
    }));
  };
  
  // Handle profile image selection
  const handleSelectProfileImage = async () => {
    try {
      // Animation on press
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 0.95,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
      
      // Request permission
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          getLabel('permissionRequired') || 'Permission Required', 
          getLabel('photoLibraryPermission') || 'Please allow access to your photo library to select a profile image.'
        );
        return;
      }
      
      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        // Update profile image
        setUserData(prevData => ({
          ...prevData,
          profileImage: result.assets[0].uri
        }));
      }
    } catch (error) {
      console.error('Error selecting profile image:', error);
      Alert.alert(
        getLabel('error') || 'Error', 
        getLabel('profileImageError') || 'Failed to select profile image. Please try again.'
      );
    }
  };
  
  // Handle save profile
  const handleSaveProfile = async () => {
    // Validate inputs
    if (!userData.name.trim()) {
      Alert.alert(
        getLabel('invalidInput') || 'Invalid Input', 
        getLabel('nameRequired') || 'Please enter your name.'
      );
      return;
    }
    
    if (!userData.email.trim()) {
      Alert.alert(
        getLabel('invalidInput') || 'Invalid Input', 
        getLabel('emailRequired') || 'Please enter your email address.'
      );
      return;
    }
    
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      Alert.alert(
        getLabel('invalidInput') || 'Invalid Input', 
        getLabel('validEmailRequired') || 'Please enter a valid email address.'
      );
      return;
    }
    
    try {
      setSaving(true);
      
      // Get existing profile
      const existingProfile = await StorageService.getUserProfile() || {};
      
      // Update profile
      const updatedProfile = {
        ...existingProfile,
        name: userData.name.trim(),
        email: userData.email.trim(),
        phone: userData.phone.trim(),
        profileImage: userData.profileImage,
        lastUpdated: new Date().toISOString()
      };
      
      // Save updated profile
      await StorageService.saveUserProfile(updatedProfile);
      
      // Show success message and go back
      Alert.alert(
        getLabel('success') || 'Success',
        getLabel('profileUpdateSuccess') || 'Your profile has been updated successfully.',
        [
          {
            text: getLabel('ok') || 'OK',
            onPress: () => navigation.goBack()
          }
        ]
      );
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert(
        getLabel('error') || 'Error',
        getLabel('profileUpdateError') || 'Failed to update profile. Please try again.'
      );
    } finally {
      setSaving(false);
    }
  };
  
  // Show loading state
  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: isDarkMode ? '#121212' : '#f9f9f9' }]}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={[styles.loadingText, { color: isDarkMode ? '#FFFFFF' : '#212121' }]}>
          {getLabel('loadingProfile') || 'Loading profile...'}
        </Text>
      </View>
    );
  }
  
  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: isDarkMode ? '#121212' : '#f9f9f9' }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor="#007AFF"
      />
      
      {/* Blue Header Area */}
      <View style={[styles.header, { backgroundColor: '#007AFF' }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>
          {getLabel('editProfile') || 'Edit Profile'}
        </Text>
      </View>
      
      <View style={styles.container}>
        {/* Blue Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            <Animated.View style={[
              { transform: [{ scale: scaleAnim }] },
              styles.profileImageWrapper
            ]}>
              {userData.profileImage ? (
                <Image
                  source={{ uri: userData.profileImage }}
                  style={styles.profileImage}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.profileImagePlaceholder}>
                  <Ionicons
                    name="person"
                    size={60}
                    color="#DDDDDD"
                  />
                </View>
              )}
              
              <TouchableOpacity 
                style={styles.editImageButton}
                onPress={handleSelectProfileImage}
                activeOpacity={0.8}
              >
                <Ionicons name="camera" size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </Animated.View>
          </View>
        </View>
        
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            {/* Personal Information */}
            <View style={styles.formSection}>
              <View style={styles.formGroup}>
                <Text style={[styles.inputLabel, { color: isDarkMode ? '#FFFFFF' : '#212121' }]}>
                  {getLabel('name') || 'Name'} *
                </Text>
                <TextInput
                  style={[
                    styles.textInput,
                    { 
                      backgroundColor: isDarkMode ? '#333333' : '#FFFFFF',
                      color: isDarkMode ? '#FFFFFF' : '#212121',
                      borderColor: isDarkMode ? '#555555' : '#E0E0E0'
                    }
                  ]}
                  value={userData.name}
                  onChangeText={(text) => handleChange('name', text)}
                  placeholder={getLabel('enterName') || 'Enter your name'}
                  placeholderTextColor={isDarkMode ? '#AAAAAA' : '#757575'}
                  autoCapitalize="words"
                />
              </View>
              
              <View style={styles.formGroup}>
                <Text style={[styles.inputLabel, { color: isDarkMode ? '#FFFFFF' : '#212121' }]}>
                  {getLabel('email') || 'Email'} *
                </Text>
                <TextInput
                  style={[
                    styles.textInput,
                    { 
                      backgroundColor: isDarkMode ? '#333333' : '#FFFFFF',
                      color: isDarkMode ? '#FFFFFF' : '#212121',
                      borderColor: isDarkMode ? '#555555' : '#E0E0E0'
                    }
                  ]}
                  value={userData.email}
                  onChangeText={(text) => handleChange('email', text)}
                  placeholder={getLabel('enterEmail') || 'Enter your email'}
                  placeholderTextColor={isDarkMode ? '#AAAAAA' : '#757575'}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
              
              <View style={styles.formGroup}>
                <Text style={[styles.inputLabel, { color: isDarkMode ? '#FFFFFF' : '#212121' }]}>
                  {getLabel('phone') || 'Phone Number'}
                </Text>
                <TextInput
                  style={[
                    styles.textInput,
                    { 
                      backgroundColor: isDarkMode ? '#333333' : '#FFFFFF',
                      color: isDarkMode ? '#FFFFFF' : '#212121',
                      borderColor: isDarkMode ? '#555555' : '#E0E0E0'
                    }
                  ]}
                  value={userData.phone}
                  onChangeText={(text) => handleChange('phone', text)}
                  placeholder={getLabel('enterPhone') || 'Enter your phone number'}
                  placeholderTextColor={isDarkMode ? '#AAAAAA' : '#757575'}
                  keyboardType="phone-pad"
                />
              </View>
              
              <Text style={[styles.requiredNote, { color: isDarkMode ? '#AAAAAA' : '#757575' }]}>
                * {getLabel('requiredFields') || 'Required fields'}
              </Text>
            </View>
          </View>
        </ScrollView>
        
        {/* Save Button */}
        <View style={[
          styles.footer, 
          { 
            backgroundColor: isDarkMode ? '#121212' : '#FFFFFF',
            borderTopColor: isDarkMode ? '#333333' : '#E0E0E0' 
          }
        ]}>
          <Button
            title={getLabel('saveChanges') || 'Save Changes'}
            onPress={handleSaveProfile}
            loading={saving}
            containerStyle={styles.saveButton}
            disabled={saving}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
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
    marginTop: SPACING.m,
    fontSize: SIZES.medium,
  },
  header: {
    height: 60 + (StatusBar.currentHeight || 0),
    paddingTop: StatusBar.currentHeight || 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.medium,
  },
  backButton: {
    position: 'absolute',
    left: SPACING.m,
    top: (StatusBar.currentHeight || 0) + 18,
    zIndex: 10,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: SIZES.large,
    fontWeight: 'bold',
  },
  profileSection: {
    backgroundColor: '#007AFF',
    paddingBottom: 30,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: SPACING.l,
  },
  profileImageContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  profileImageWrapper: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    backgroundColor: 'transparent',
    padding: 0,
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  profileImagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  editImageButton: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  formSection: {
    marginTop: 15,
    marginBottom: SPACING.xl,
  },
  formGroup: {
    marginBottom: SPACING.l,
  },
  inputLabel: {
    fontSize: SIZES.small,
    marginBottom: SPACING.xs,
    fontWeight: '600',
  },
  textInput: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: SPACING.m,
    fontSize: SIZES.medium,
    ...SHADOWS.small,
  },
  requiredNote: {
    fontSize: SIZES.small,
    fontStyle: 'italic',
    marginTop: SPACING.s,
  },
  footer: {
    padding: SPACING.m,
    borderTopWidth: 1,
    ...SHADOWS.medium,
  },
  saveButton: {
    height: 50,
    borderRadius: 8,
  },
});

export default EditProfileScreen;
