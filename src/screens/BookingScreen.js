import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput, // Make sure TextInput is imported
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image
} from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { SIZES, SPACING } from '../config/theme';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useCurrency } from '../context/CurrencyContext';
import Input from '../components/Input';
import Button from '../components/Button';
import TrainService from '../services/TrainService';
import StorageService from '../services/StorageService';
import { Passenger, Booking } from '../models/TrainModel';

/**
 * BookingScreen - Allows users to book train tickets
 */
const BookingScreen = ({ route, navigation }) => {
  const { theme } = useTheme();
  const { getLabel } = useLanguage();
  const { formatPrice } = useCurrency();

  const { train, paymentMethod = 'card', class: selectedClass = '2nd' } = route.params;
  const [loading, setLoading] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(paymentMethod);
  const [passengers, setPassengers] = useState([
    { id: '1', name: '', age: '', gender: 'Male' },
  ]);

  // Validation schema for booking form
  const BookingSchema = Yup.object().shape({
    journeyDate: Yup.string()
      .matches(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)')
      .required('Journey date is required'),
    contactName: Yup.string()
      .min(2, 'Name must be at least 2 characters')
      .required('Contact name is required'),
    contactPhone: Yup.string()
      .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits')
      .required('Contact phone is required'),
    contactEmail: Yup.string()
      .email('Please enter a valid email')
      .required('Contact email is required'),
    cardNumber: Yup.string()
      .when('selectedPaymentMethod', {
        is: 'card',
        then: Yup.string().required('Card number is required'),
      }),
    cardExpiry: Yup.string()
      .when('selectedPaymentMethod', {
        is: 'card',
        then: Yup.string().required('Card expiry is required'),
      }),
    cardCvv: Yup.string()
      .when('selectedPaymentMethod', {
        is: 'card',
        then: Yup.string().required('Card CVV is required'),
      }),
    cardName: Yup.string()
      .when('selectedPaymentMethod', {
        is: 'card',
        then: Yup.string().required('Name on card is required'),
      }),
    walletMobile: Yup.string()
      .when('selectedPaymentMethod', {
        is: 'wallet',
        then: Yup.string().required('Mobile number is required'),
      }),
    walletProvider: Yup.string()
      .when('selectedPaymentMethod', {
        is: 'wallet',
        then: Yup.string().required('Wallet provider is required'),
      }),
    bankName: Yup.string()
      .when('selectedPaymentMethod', {
        is: 'netbanking',
        then: Yup.string().required('Bank name is required'),
      }),
    accountNumber: Yup.string()
      .when('selectedPaymentMethod', {
        is: 'netbanking',
        then: Yup.string().required('Account number is required'),
      }),
  });

  // Handle adding a passenger
  const handleAddPassenger = () => {
    if (passengers.length < 5) {
      setPassengers([
        ...passengers,
        { id: Date.now().toString(), name: '', age: '', gender: 'Male' },
      ]);
    } else {
      Alert.alert('Maximum Reached', 'You can add up to 5 passengers only.');
    }
  };

  // Handle removing a passenger
  const handleRemovePassenger = (id) => {
    if (passengers.length > 1) {
      setPassengers(passengers.filter((passenger) => passenger.id !== id));
    } else {
      Alert.alert('Minimum Required', 'At least one passenger is required.');
    }
  };

  // Handle passenger data change
  const handlePassengerChange = (id, field, value) => {
    setPassengers(
      passengers.map((passenger) =>
        passenger.id === id ? { ...passenger, [field]: value } : passenger
      )
    );
  };

  // Helper function to safely get the base fare
  const getBaseFare = () => {
    // Check if fare is an object with fare class properties (iOS style)
    if (train.fare && typeof train.fare === 'object') {
      if (selectedClass === '1st' && train.fare.firstClass) {
        return train.fare.firstClass;
      } else if (selectedClass === '2nd' && train.fare.secondClass) {
        return train.fare.secondClass;
      } else if (selectedClass === '3rd' && train.fare.thirdClass) {
        return train.fare.thirdClass;
      }
      // Default to secondClass
      return train.fare.secondClass || 0;
    } 
    // Legacy support for string fare format (old Android style)
    else if (typeof train.fare === 'string') {
      return parseInt(train.fare.replace(/[^\d]/g, '')) || 0;
    } 
    // Direct number fare
    else if (typeof train.fare === 'number') {
      return train.fare;
    }
    return 0;
  };

  // Calculate total fare based on class and passengers
  const calculateTotalFare = () => {
    // Get base fare based on selected class
    let baseFare = getBaseFare();
    
    // For legacy compatibility if using the old fare format
    if (typeof train.fare !== 'object') {
      // Apply class multiplier
      if (selectedClass === '1st') {
        baseFare = baseFare * 1.5;
      } else if (selectedClass === '3rd') {
        baseFare = baseFare * 0.8;
      }
    }
    
    // Add service fee and tax
    const serviceFee = 100;
    const taxFee = 50;
    
    // Calculate total per passenger
    return (baseFare + serviceFee + taxFee) * passengers.length;
  };

  // Handle booking submission
  const handleBooking = async (values) => {
    // Validate passengers
    const passengersValid = passengers.every(
      (passenger) => passenger.name && passenger.age
    );

    if (!passengersValid) {
      Alert.alert(
        'Incomplete Information',
        'Please provide name and age for all passengers.'
      );
      return;
    }

    setLoading(true);

    try {
      // Process payment based on selected method
      const paymentProcessed = await processPayment(selectedPaymentMethod, calculateTotalFare());
      
      if (!paymentProcessed.success) {
        Alert.alert('Payment Failed', paymentProcessed.message || 'There was an error processing your payment. Please try again.');
        setLoading(false);
        return;
      }

      const userId = 'u1'; // In a real app, get this from user context/state
      
      // Format passengers for the booking
      const formattedPassengers = passengers.map((passenger) => new Passenger(
        passenger.id,
        passenger.name,
        passenger.age,
        passenger.gender
      ));

      // Create booking
      const bookingDetails = {
        trainId: train.id,
        userId,
        journeyDate: values.journeyDate,
        passengers: formattedPassengers,
        totalFare: calculateTotalFare(),
        contactInfo: {
          name: values.contactName,
          phone: values.contactPhone,
          email: values.contactEmail,
        },
        paymentMethod: selectedPaymentMethod,
        paymentDetails: paymentProcessed.details
      };

      // Submit booking
      const booking = await TrainService.bookTicket(bookingDetails);
      
      // Navigate to confirmation screen
      navigation.navigate('BookingConfirmation', { 
        booking,
        train,
      });
    } catch (error) {
      console.error('Error booking tickets:', error);
      Alert.alert(
        'Booking Failed',
        'There was an error processing your booking. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Process payment (mock implementation)
  const processPayment = async (method, amount) => {
    // Simulate API call with a delay
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock responses for different payment methods
        switch (method) {
          case 'card':
            resolve({
              success: true,
              details: {
                id: 'pmt_' + Math.random().toString(36).substring(2, 15),
                method: 'Credit/Debit Card',
                last4: '4242',
                amount,
                timestamp: new Date().toISOString()
              },
              message: 'Card payment successful'
            });
            break;
          case 'wallet':
            resolve({
              success: true,
              details: {
                id: 'wl_' + Math.random().toString(36).substring(2, 15),
                method: 'Mobile Wallet',
                amount,
                timestamp: new Date().toISOString()
              },
              message: 'Wallet payment successful'
            });
            break;
          case 'netbanking':
            resolve({
              success: true,
              details: {
                id: 'nb_' + Math.random().toString(36).substring(2, 15),
                method: 'Net Banking',
                amount,
                timestamp: new Date().toISOString()
              },
              message: 'Net banking payment successful'
            });
            break;
          default:
            resolve({
              success: false,
              message: 'Invalid payment method'
            });
        }
      }, 1500); // Simulate a delay
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <StatusBar barStyle={theme.isDark ? "light-content" : "dark-content"} backgroundColor={theme.background} />
      
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.primary }]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.card }]}>{getLabel('bookTrainTickets')}</Text>
        <View style={styles.headerRight} />
      </View>
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        style={{ backgroundColor: theme.background }}
      >
        {/* Train Information Summary */}
        <View style={[styles.trainSummaryCard, { backgroundColor: theme.cardBackground, borderColor: theme.border, ...theme.shadows.small }]}>
          <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>{getLabel('journeyDetails')}</Text>
          
          <View style={styles.classInfo}>
            <Text style={[styles.classLabel, { color: theme.textSecondary }]}>{getLabel('selectedClass')}</Text>
            <Text style={[styles.classValue, { color: theme.primary }]}>{selectedClass} Class</Text>
          </View>
          
          <View style={styles.trainInfo}>
            <Text style={[styles.trainName, { color: theme.textPrimary }]}>{train.name}</Text>
            <Text style={[styles.trainNumber, { color: theme.textSecondary }]}>#{train.number}</Text>
          </View>
          
          <View style={styles.journeySummary}>
            <View style={styles.stationTime}>
              <Text style={[styles.timeText, { color: theme.textPrimary }]}>{train.departureTime}</Text>
              <Text style={[styles.stationText, { color: theme.textSecondary }]}>{train.source}</Text>
            </View>
            
            <View style={styles.durationContainer}>
              <View style={[styles.line, { backgroundColor: theme.border }]} />
              <Text style={[styles.durationText, { color: theme.primary }]}>{train.duration}</Text>
              <View style={[styles.line, { backgroundColor: theme.border }]} />
            </View>
            
            <View style={styles.stationTime}>
              <Text style={[styles.timeText, { color: theme.textPrimary }]}>{train.arrivalTime}</Text>
              <Text style={[styles.stationText, { color: theme.textSecondary }]}>{train.destination}</Text>
            </View>
          </View>

          <View style={styles.paymentMethodContainer}>
            <Text style={[styles.paymentLabel, { color: theme.textSecondary }]}>{getLabel('paymentMethod')}</Text>
            <View style={[styles.paymentMethod, { backgroundColor: theme.isDark ? theme.cardBackground : theme.background }]}>
              {paymentMethod === 'card' && (
                <MaterialCommunityIcons name="credit-card" size={20} color={theme.primary} />
              )}
              {paymentMethod === 'qr' && (
                <MaterialCommunityIcons name="qrcode" size={20} color={theme.primary} />
              )}
              {paymentMethod === 'cash' && (
                <MaterialCommunityIcons name="cash" size={20} color={theme.primary} />
              )}
              <Text style={[styles.paymentText, { color: theme.textPrimary }]}>
                {paymentMethod === 'card' ? getLabel('creditDebitCard') : 
                 paymentMethod === 'qr' ? getLabel('lankaPayQR') : 
                 getLabel('cashOnCollection')}
              </Text>
            </View>
          </View>
        </View>
        
        {/* Passenger Information */}
        <View style={[styles.passengerCard, { backgroundColor: theme.cardBackground, borderColor: theme.border, ...theme.shadows.small }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>{getLabel('passengerInformation')}</Text>
            <TouchableOpacity 
              style={[styles.addButton, { backgroundColor: theme.primary }]}
              onPress={handleAddPassenger}
            >
              <Ionicons name="add" size={20} color="white" />
              <Text style={[styles.addButtonText, { color: theme.card }]}>{getLabel('add')}</Text>
            </TouchableOpacity>
          </View>
          
          {passengers.map((passenger, index) => (
            <View key={passenger.id} style={[styles.passengerSection, { borderColor: theme.border }]}>
              <View style={styles.passengerHeader}>
                <Text style={[styles.passengerTitle, { color: theme.textPrimary }]}>
                  {getLabel('passenger')} {index + 1}
                </Text>
                {passengers.length > 1 && (
                  <TouchableOpacity
                    onPress={() => handleRemovePassenger(passenger.id)}
                  >
                    <Ionicons name="trash-outline" size={20} color={theme.error} />
                  </TouchableOpacity>
                )}
              </View>
              
              <Input
                label="Name"
                placeholder="Enter full name"
                value={passenger.name}
                onChangeText={(value) => handlePassengerChange(passenger.id, 'name', value)}
                autoCapitalize="words"
              />
              
              <Input
                label="Age"
                placeholder="Enter age"
                value={passenger.age}
                onChangeText={(value) => handlePassengerChange(passenger.id, 'age', value)}
                keyboardType="number-pad"
              />
              
              <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>{getLabel('gender')}</Text>
              <View style={styles.genderContainer}>
                <TouchableOpacity
                  style={[
                    styles.genderOption,
                    { borderColor: theme.border, backgroundColor: theme.isDark ? theme.cardBackground : theme.background },
                    passenger.gender === 'Male' && [styles.selectedGender, { borderColor: theme.primary, backgroundColor: theme.primary + '10' }],
                  ]}
                  onPress={() => handlePassengerChange(passenger.id, 'gender', 'Male')}
                >
                  <Text
                    style={[
                      styles.genderText,
                      { color: theme.textSecondary },
                      passenger.gender === 'Male' && [styles.selectedGenderText, { color: theme.primary }],
                    ]}
                  >
                    {getLabel('male')}
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.genderOption,
                    { borderColor: theme.border, backgroundColor: theme.isDark ? theme.cardBackground : theme.background },
                    passenger.gender === 'Female' && [styles.selectedGender, { borderColor: theme.primary, backgroundColor: theme.primary + '10' }],
                  ]}
                  onPress={() => handlePassengerChange(passenger.id, 'gender', 'Female')}
                >
                  <Text
                    style={[
                      styles.genderText,
                      { color: theme.textSecondary },
                      passenger.gender === 'Female' && [styles.selectedGenderText, { color: theme.primary }],
                    ]}
                  >
                    {getLabel('female')}
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.genderOption,
                    { borderColor: theme.border, backgroundColor: theme.isDark ? theme.cardBackground : theme.background },
                    passenger.gender === 'Other' && [styles.selectedGender, { borderColor: theme.primary, backgroundColor: theme.primary + '10' }],
                  ]}
                  onPress={() => handlePassengerChange(passenger.id, 'gender', 'Other')}
                >
                  <Text
                    style={[
                      styles.genderText,
                      { color: theme.textSecondary },
                      passenger.gender === 'Other' && [styles.selectedGenderText, { color: theme.primary }],
                    ]}
                  >
                    {getLabel('other')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Payment Method Selection */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme?.textPrimary ?? '#212529' }]}>
            {getLabel('selectPaymentMethod')}
          </Text>
          <View style={styles.paymentMethods}>
            <TouchableOpacity
              style={[
                styles.paymentMethod,
                selectedPaymentMethod === 'card' && [
                  styles.selectedPaymentMethod,
                  { borderColor: theme?.primary ?? '#007bff' }
                ],
                { 
                  backgroundColor: theme?.cardBackground ?? '#FFFFFF',
                  borderColor: theme?.border ?? '#E0E0E0'
                }
              ]}
              onPress={() => setSelectedPaymentMethod('card')}
            >
              <Ionicons 
                name="card" 
                size={24} 
                color={
                  selectedPaymentMethod === 'card' 
                    ? theme?.primary ?? '#007bff' 
                    : theme?.textSecondary ?? '#6c757d'
                } 
              />
              <Text
                style={[
                  styles.paymentMethodText,
                  {
                    color: selectedPaymentMethod === 'card'
                      ? theme?.primary ?? '#007bff'
                      : theme?.textPrimary ?? '#212529'
                  }
                ]}
              >
                {getLabel('creditDebitCard')}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.paymentMethod,
                selectedPaymentMethod === 'cash' && [
                  styles.selectedPaymentMethod,
                  { borderColor: theme?.primary ?? '#007bff' }
                ],
                { 
                  backgroundColor: theme?.cardBackground ?? '#FFFFFF',
                  borderColor: theme?.border ?? '#E0E0E0'
                }
              ]}
              onPress={() => setSelectedPaymentMethod('cash')}
            >
              <Ionicons 
                name="cash" 
                size={24} 
                color={
                  selectedPaymentMethod === 'cash' 
                    ? theme?.primary ?? '#007bff' 
                    : theme?.textSecondary ?? '#6c757d'
                } 
              />
              <Text
                style={[
                  styles.paymentMethodText,
                  {
                    color: selectedPaymentMethod === 'cash'
                      ? theme?.primary ?? '#007bff'
                      : theme?.textPrimary ?? '#212529'
                  }
                ]}
              >
                {getLabel('cashOnCollection')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Contact Information */}
        <Formik
          initialValues={{
            journeyDate: new Date().toISOString().split('T')[0], // Today's date
            contactName: '',
            contactPhone: '',
            contactEmail: '',
            cardNumber: '',
            cardExpiry: '',
            cardCvv: '',
            cardName: '',
            walletMobile: '',
            walletProvider: '',
            bankName: '',
            accountNumber: '',
          }}
          validationSchema={BookingSchema}
          onSubmit={handleBooking}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
          }) => (
            <>
              <View style={[styles.contactCard, { backgroundColor: theme.cardBackground, borderColor: theme.border, ...theme.shadows.small }]}>
                <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>{getLabel('contactAndJourneyDetails')}</Text>
                
                <Input
                  label="Journey Date (YYYY-MM-DD)"
                  placeholder="Enter journey date"
                  value={values.journeyDate}
                  onChangeText={handleChange('journeyDate')}
                  onBlur={handleBlur('journeyDate')}
                />
                
                <Input
                  label="Contact Name"
                  placeholder="Enter contact person name"
                  value={values.contactName}
                  onChangeText={handleChange('contactName')}
                  onBlur={handleBlur('contactName')}
                  autoCapitalize="words"
                />
                
                <Input
                  label="Phone Number"
                  placeholder="Enter phone number"
                  value={values.contactPhone}
                  onChangeText={handleChange('contactPhone')}
                  onBlur={handleBlur('contactPhone')}
                  keyboardType="phone-pad"
                />
                
                <Input
                  label="Email"
                  placeholder="Enter email address"
                  value={values.contactEmail}
                  onChangeText={handleChange('contactEmail')}
                  onBlur={handleBlur('contactEmail')}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
              
              {/* Credit/Debit Card Input Fields */}
              {selectedPaymentMethod === 'card' && (
                <View style={[styles.paymentInputContainer, { backgroundColor: theme?.cardBackground ?? '#FFFFFF', borderColor: theme?.border ?? '#E0E0E0' }]}>
                  <View style={styles.inputContainer}>
                    <Text style={[styles.inputLabel, { color: theme?.textPrimary ?? '#212529' }]}>
                      {getLabel('cardNumber')}
                    </Text>
                    <TextInput
                      style={[
                        styles.input,
                        { 
                          color: theme?.textPrimary ?? '#212529',
                          borderColor: theme?.border ?? '#dee2e6'
                        }
                      ]}
                      placeholder={getLabel('enterCardNumber')}
                      placeholderTextColor={theme?.textSecondary ?? '#6c757d'}
                      keyboardType="number-pad"
                      maxLength={19}
                      value={values?.cardNumber || ""}
                      onChangeText={handleChange('cardNumber')}
                    />
                  </View>
                  
                  <View style={styles.cardDetailsRow}>
                    <View style={styles.cardDetailColumn}>
                      <Text style={[styles.inputLabel, { color: theme?.textPrimary ?? '#212529' }]}>
                        {getLabel('expiryDate')}
                      </Text>
                      <TextInput
                        style={[
                          styles.input,
                          { 
                            color: theme?.textPrimary ?? '#212529',
                            borderColor: theme?.border ?? '#dee2e6' 
                          }
                        ]}
                        placeholder="MM/YY"
                        placeholderTextColor={theme?.textSecondary ?? '#6c757d'}
                        keyboardType="number-pad"
                        maxLength={5}
                        value={values?.cardExpiry || ""}
                        onChangeText={handleChange('cardExpiry')}
                      />
                    </View>
                    
                    <View style={styles.cardDetailColumn}>
                      <Text style={[styles.inputLabel, { color: theme?.textPrimary ?? '#212529' }]}>
                        {getLabel('cvv')}
                      </Text>
                      <TextInput
                        style={[
                          styles.input,
                          { 
                            color: theme?.textPrimary ?? '#212529',
                            borderColor: theme?.border ?? '#dee2e6' 
                          }
                        ]}
                        placeholder="CVV"
                        placeholderTextColor={theme?.textSecondary ?? '#6c757d'}
                        keyboardType="number-pad"
                        maxLength={4}
                        value={values?.cardCvv || ""}
                        onChangeText={handleChange('cardCvv')}
                        secureTextEntry
                      />
                    </View>
                  </View>
                  
                  <View style={styles.inputContainer}>
                    <Text style={[styles.inputLabel, { color: theme?.textPrimary ?? '#212529' }]}>
                      {getLabel('nameOnCard')}
                    </Text>
                    <TextInput
                      style={[
                        styles.input,
                        { 
                          color: theme?.textPrimary ?? '#212529',
                          borderColor: theme?.border ?? '#dee2e6' 
                        }
                      ]}
                      placeholder={getLabel('enterNameOnCard')}
                      placeholderTextColor={theme?.textSecondary ?? '#6c757d'}
                      value={values?.cardName || ""}
                      onChangeText={handleChange('cardName')}
                    />
                  </View>
                </View>
              )}
              
              {/* Fare Summary */}
              <View style={[styles.fareCard, { backgroundColor: theme.cardBackground, borderColor: theme.border, ...theme.shadows.small }]}>
                <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>{getLabel('fareSummary')}</Text>
                
                <View style={styles.fareSummary}>
                  <View style={styles.fareItem}>
                    <Text style={[styles.fareLabel, { color: theme.textSecondary }]}>
                      {getLabel('baseFare')} ({selectedClass} {getLabel('class')}) x {passengers.length}
                    </Text>
                    <Text style={[styles.fareValue, { color: theme.textPrimary }]}>
                      {formatPrice(
                        selectedClass === '1st' ? getBaseFare() * 1.5 : 
                        selectedClass === '3rd' ? getBaseFare() * 0.8 : 
                        getBaseFare()
                      )}
                    </Text>
                  </View>
                  
                  <View style={[styles.separator, { backgroundColor: theme.border }]} />
                  
                  <View style={styles.fareItem}>
                    <Text style={[styles.fareLabel, { color: theme.textSecondary }]}>{getLabel('tax')} (5%)</Text>
                    <Text style={[styles.fareValue, { color: theme.textPrimary }]}>{formatPrice(50 * passengers.length)}</Text>
                  </View>
                  
                  <View style={[styles.separator, { backgroundColor: theme.border }]} />
                  
                  <View style={styles.fareItem}>
                    <Text style={[styles.fareLabel, { color: theme.textSecondary }]}>{getLabel('serviceFee')}</Text>
                    <Text style={[styles.fareValue, { color: theme.textPrimary }]}>{formatPrice(100 * passengers.length)}</Text>
                  </View>
                  
                  <View style={styles.totalFare}>
                    <Text style={[styles.totalLabel, { color: theme.textPrimary }]}>{getLabel('totalAmount')}</Text>
                    <Text style={[styles.totalValue, { color: theme.primary }]}>
                      {formatPrice(calculateTotalFare())}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.termsContainer}>
                  <Ionicons name="information-circle-outline" size={20} color={theme.primary} />
                  <Text style={[styles.termsText, { color: theme.textSecondary }]}>
                    {getLabel('termsAgreement')}
                  </Text>
                </View>
                
                <Button
                  title={`${getLabel('pay')} ${formatPrice(calculateTotalFare())}`}
                  onPress={handleSubmit}
                  loading={loading}
                  style={styles.payButton}
                  theme={theme}
                />
              </View>
            </>
          )}
        </Formik>
        
        {/* Add space at the bottom for better scrolling experience */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: StatusBar.currentHeight || 44,
    paddingBottom: SPACING.m,
    paddingHorizontal: SPACING.m,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  headerTitle: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
  },
  headerRight: {
    width: 40,
  },
  trainSummaryCard: {
    marginHorizontal: SPACING.m,
    marginTop: SPACING.m,
    borderRadius: 12,
    padding: SPACING.l,
    borderWidth: 1,
  },
  cardTitle: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    marginBottom: SPACING.m,
  },
  classInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.m,
  },
  classLabel: {
    fontSize: SIZES.medium,
  },
  classValue: {
    fontSize: SIZES.medium,
    fontWeight: 'bold',
  },
  paymentMethodContainer: {
    marginTop: SPACING.m,
  },
  paymentLabel: {
    fontSize: SIZES.small,
    marginBottom: SPACING.xs,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.s,
    borderRadius: 8,
    marginTop: SPACING.xs,
  },
  paymentText: {
    fontSize: SIZES.medium,
    marginLeft: SPACING.s,
  },
  trainInfo: {
    marginBottom: SPACING.s,
  },
  trainName: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
  },
  trainNumber: {
    fontSize: SIZES.small,
    marginTop: 2,
  },
  journeySummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: SPACING.m,
    paddingTop: SPACING.s,
  },
  stationTime: {
    alignItems: 'center',
    width: 100,
  },
  timeText: {
    fontSize: SIZES.medium,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  stationText: {
    fontSize: SIZES.small,
    textAlign: 'center',
  },
  durationContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  line: {
    height: 1,
    flex: 1,
  },
  durationText: {
    fontSize: SIZES.small,
    marginHorizontal: SPACING.xs,
    fontWeight: '500',
  },
  passengerCard: {
    marginHorizontal: SPACING.m,
    marginTop: SPACING.m,
    borderRadius: 12,
    padding: SPACING.l,
    borderWidth: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.s,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.xs,
    borderRadius: 20,
  },
  addButtonText: {
    fontSize: SIZES.small,
    fontWeight: '600',
    marginLeft: 4,
  },
  passengerSection: {
    marginBottom: SPACING.m,
    paddingBottom: SPACING.m,
    borderBottomWidth: 1,
  },
  passengerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.s,
  },
  passengerTitle: {
    fontSize: SIZES.medium,
    fontWeight: '600',
  },
  inputLabel: {
    fontSize: SIZES.small,
    fontWeight: '500',
    marginBottom: SPACING.xs,
  },
  genderContainer: {
    flexDirection: 'row',
    marginBottom: SPACING.m,
  },
  genderOption: {
    flex: 1,
    borderWidth: 1,
    paddingVertical: SPACING.s,
    alignItems: 'center',
    marginRight: SPACING.xs,
    borderRadius: 8,
  },
  selectedGender: {
    borderWidth: 2,
  },
  genderText: {
    fontSize: SIZES.small,
  },
  selectedGenderText: {
    fontWeight: '600',
  },
  contactCard: {
    marginHorizontal: SPACING.m,
    marginTop: SPACING.m,
    borderRadius: 12,
    padding: SPACING.l,
    borderWidth: 1,
  },
  fareCard: {
    marginHorizontal: SPACING.m,
    marginTop: SPACING.m,
    borderRadius: 12,
    padding: SPACING.l,
    borderWidth: 1,
  },
  fareSummary: {
    marginBottom: SPACING.m,
  },
  fareItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.s,
  },
  fareLabel: {
    fontSize: SIZES.medium,
  },
  fareValue: {
    fontSize: SIZES.medium,
    fontWeight: '500',
  },
  totalFare: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.m,
    marginTop: SPACING.s,
    borderTopWidth: 1,
  },
  totalLabel: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
  },
  termsContainer: {
    flexDirection: 'row',
    marginBottom: SPACING.m,
    padding: SPACING.s,
    borderRadius: 8,
    alignItems: 'center',
  },
  termsText: {
    fontSize: SIZES.small,
    marginLeft: SPACING.xs,
    flex: 1,
  },
  payButton: {
    marginTop: SPACING.s,
  },
  paymentMethods: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.m,
  },
  paymentMethod: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.m,
    borderRadius: 12,
    borderWidth: 1,
    marginRight: SPACING.m,
  },
  selectedPaymentMethod: {
    borderColor: '#007bff',
  },
  paymentMethodText: {
    fontSize: SIZES.medium,
    marginLeft: SPACING.s,
  },
  paymentInputContainer: {
    marginHorizontal: SPACING.m,
    marginTop: SPACING.m,
    borderRadius: 12,
    padding: SPACING.l,
    borderWidth: 1,
  },
  inputContainer: {
    marginBottom: SPACING.m,
  },
  input: {
    height: 40,
    borderColor: '#dee2e6',
    borderWidth: 1,
    paddingHorizontal: SPACING.s,
    paddingVertical: SPACING.xs,
    borderRadius: 8,
  },
  cardDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.m,
  },
  cardDetailColumn: {
    flex: 1,
    marginRight: SPACING.m,
  },
});

export default BookingScreen;
