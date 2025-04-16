import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { SIZES, SPACING } from '../config/theme';
import { useTheme } from '../context/ThemeContext';
import TrainLogo from '../assets/TrainLogo';
import Input from '../components/Input';
import Button from '../components/Button';
import StorageService from '../services/StorageService';
import { User } from '../models/TrainModel';

/**
 * Registration screen for new user sign up
 */
const RegisterScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { theme } = useTheme();

  // Validation schema for registration form
  const RegisterSchema = Yup.object().shape({
    name: Yup.string()
      .min(2, 'Name must be at least 2 characters')
      .required('Name is required'),
    email: Yup.string()
      .email('Please enter a valid email')
      .required('Email is required'),
    phone: Yup.string()
      .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits')
      .required('Phone number is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm password is required'),
  });

  // Handle registration submission
  const handleRegister = async (values) => {
    setLoading(true);
    setErrorMessage('');
    
    try {
      // Simulate API call for registration
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create new user
      const user = new User(
        'u' + Date.now(), // Generate a unique ID
        values.name,
        values.email,
        values.phone,
        [] // Empty favorites list
      );
      
      // Save user profile to local storage
      await StorageService.saveUserProfile(user);
      
      // Navigate to main app
      navigation.replace('Main');
    } catch (error) {
      setErrorMessage('Registration failed. Please try again.');
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1, backgroundColor: theme.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={[styles.scrollContainer, { backgroundColor: theme.background }]}
        showsVerticalScrollIndicator={false}
      >
        <StatusBar barStyle="light-content" backgroundColor={theme.background} />
        
        <View style={[styles.container, { backgroundColor: theme.background }]}>
          {/* Back button */}
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()}
          >
            <Text style={[styles.backButtonText, { color: theme.primary }]}>←</Text>
          </TouchableOpacity>

          {/* Logo and header */}
          <View style={styles.header}>
            <TrainLogo size={100} />
            <Text style={[styles.title, { color: theme.text }]}>Register</Text>
          </View>
          
          {/* Registration form */}
          <Formik
            initialValues={{ 
              name: '', 
              email: '', 
              phone: '', 
              password: '', 
              confirmPassword: '' 
            }}
            validationSchema={RegisterSchema}
            onSubmit={handleRegister}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
              <View style={styles.formContainer}>
                {errorMessage ? (
                  <View style={styles.errorContainer}>
                    <Text style={[styles.errorText, { color: theme.error }]}>{errorMessage}</Text>
                  </View>
                ) : null}
                
                <Input
                  placeholder="Name"
                  value={values.name}
                  onChangeText={handleChange('name')}
                  onBlur={handleBlur('name')}
                  error={errors.name}
                  touched={touched.name}
                  autoCapitalize="words"
                  style={styles.inputField}
                />
                
                <Input
                  placeholder="Phone Number"
                  value={values.phone}
                  onChangeText={handleChange('phone')}
                  onBlur={handleBlur('phone')}
                  error={errors.phone}
                  touched={touched.phone}
                  keyboardType="phone-pad"
                  style={styles.inputField}
                />
                
                <Input
                  placeholder="NIC Number"
                  value={values.nic || ''}
                  onChangeText={handleChange('nic')}
                  onBlur={handleBlur('nic')}
                  error={errors.nic}
                  touched={touched.nic}
                  style={styles.inputField}
                />
                
                <Input
                  placeholder="Email"
                  value={values.email}
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  error={errors.email}
                  touched={touched.email}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={styles.inputField}
                />
                
                <Input
                  placeholder="Password"
                  value={values.password}
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  error={errors.password}
                  touched={touched.password}
                  secureTextEntry
                  style={styles.inputField}
                />
                
                <Input
                  placeholder="Confirm Password"
                  value={values.confirmPassword}
                  onChangeText={handleChange('confirmPassword')}
                  onBlur={handleBlur('confirmPassword')}
                  error={errors.confirmPassword}
                  touched={touched.confirmPassword}
                  secureTextEntry
                  style={styles.inputField}
                />
                
                <Button
                  title="Create Account"
                  onPress={handleSubmit}
                  loading={loading}
                  style={styles.registerButton}
                />
              </View>
            )}
          </Formik>
          
          {/* Sign in link */}
          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: theme.text }]}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={[styles.signInText, { color: theme.primary }]}>Sign in</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: SPACING.xl,
  },
  backButton: {
    position: 'absolute',
    top: SPACING.l,
    left: SPACING.m,
    zIndex: 10,
  },
  backButtonText: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  header: {
    alignItems: 'center',
    marginTop: SPACING.xxl * 1.5,
    marginBottom: SPACING.l,
  },
  title: {
    fontSize: SIZES.xxlarge,
    fontWeight: 'bold',
    marginTop: SPACING.xl,
    marginBottom: SPACING.l,
  },
  inputField: {
    marginBottom: SPACING.m,
  },
  formContainer: {
    marginTop: SPACING.m,
    width: '100%',
  },
  errorContainer: {
    padding: SPACING.m,
    borderRadius: 8,
    marginBottom: SPACING.m,
  },
  errorText: {
    fontSize: SIZES.small,
    textAlign: 'center',
  },
  registerButton: {
    marginTop: SPACING.xl,
    height: 50,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    bottom: SPACING.xxl,
    alignSelf: 'center',
  },
  footerText: {
    fontSize: SIZES.small,
  },
  signInText: {
    fontSize: SIZES.small,
    fontWeight: 'bold',
  },
});

export default RegisterScreen;
