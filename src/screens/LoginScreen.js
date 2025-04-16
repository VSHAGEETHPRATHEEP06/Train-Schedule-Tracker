import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, Image, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
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
 * Login screen for user authentication
 */
const LoginScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { theme } = useTheme();

  // Validation schema for login form
  const LoginSchema = Yup.object().shape({
    email: Yup.string()
      .email('Please enter a valid email')
      .required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
  });

  // Handle login submission
  const handleLogin = async (values) => {
    setLoading(true);
    setErrorMessage('');
    
    try {
      // Simulate API call for login
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, always succeed with mock user data
      const user = new User(
        'u1',
        'User Demo',
        values.email,
        '9876543210',
        []
      );
      
      // Save user profile to local storage
      await StorageService.saveUserProfile(user);
      
      // Navigate to main app
      navigation.replace('Main');
    } catch (error) {
      setErrorMessage('Login failed. Please check your credentials and try again.');
      console.error('Login error:', error);
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
            <Text style={[styles.title, { color: theme.text }]}>Login</Text>
          </View>
          
          {/* Login form */}
          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={LoginSchema}
            onSubmit={handleLogin}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
              <View style={styles.formContainer}>
                {errorMessage ? (
                  <View style={styles.errorContainer}>
                    <Text style={[styles.errorText, { color: theme.error }]}>{errorMessage}</Text>
                  </View>
                ) : null}
                
                <Input
                  placeholder="User name"
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
                
                <TouchableOpacity style={styles.forgotPasswordContainer}>
                  <Text style={[styles.forgotPasswordText, { color: theme.primary }]}>Forgot Password</Text>
                </TouchableOpacity>
                
                <Button
                  title="Login"
                  onPress={handleSubmit}
                  loading={loading}
                  style={styles.loginButton}
                />
              </View>
            )}
          </Formik>
          
          {/* Sign up link */}
          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: theme.text }]}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={[styles.signUpText, { color: theme.primary }]}>Sign up</Text>
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
    marginBottom: SPACING.xxl,
  },
  title: {
    fontSize: SIZES.xxlarge,
    fontWeight: 'bold',
    marginTop: SPACING.xl,
    marginBottom: SPACING.l,
  },
  formContainer: {
    marginTop: SPACING.l,
    width: '100%',
  },
  inputField: {
    marginBottom: SPACING.m,
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
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: SPACING.l,
    marginTop: SPACING.xs,
  },
  forgotPasswordText: {
    fontSize: SIZES.small,
  },
  loginButton: {
    marginTop: SPACING.xl,
    height: 50,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SPACING.xxl,
    position: 'absolute',
    bottom: SPACING.xxl,
    alignSelf: 'center',
  },
  footerText: {
    fontSize: SIZES.small,
  },
  signUpText: {
    fontSize: SIZES.small,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
