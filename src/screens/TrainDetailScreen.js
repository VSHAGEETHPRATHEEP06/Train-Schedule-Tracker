import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator,
  StatusBar,
  Image,
  Alert,
  Platform
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { SIZES, SPACING } from '../config/theme';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useCurrency } from '../context/CurrencyContext';
import TrainService from '../services/TrainService';
import StorageService from '../services/StorageService';

/**
 * TrainDetailScreen - Shows detailed information about a train
 */
const TrainDetailScreen = ({ route, navigation }) => {
  const { theme } = useTheme();
  const { getLabel } = useLanguage();
  const { formatPrice, currentCurrency } = useCurrency();
  
  const { trainId } = route.params;
  const [loading, setLoading] = useState(true);
  const [train, setTrain] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedClass, setSelectedClass] = useState('1st');  // '1st', '2nd', '3rd' classes
  const [showExtraInfo, setShowExtraInfo] = useState(false);

  // Load train details
  useEffect(() => {
    const loadTrainDetails = async () => {
      try {
        // Load train details
        const trainDetails = await TrainService.getTrainById(trainId);
        setTrain(trainDetails);

        // Check if train is in favorites
        const favorites = await StorageService.getFavorites() || [];
        setIsFavorite(favorites.some(fav => fav.id === trainId));
      } catch (error) {
        console.error('Error loading train details:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTrainDetails();
  }, [trainId]);

  // Handle toggling favorite
  const toggleFavorite = async () => {
    if (!train) return;

    try {
      if (isFavorite) {
        await StorageService.removeFavorite(train.id);
      } else {
        await StorageService.saveFavorite(train);
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  // Handle booking with Sri Lankan payment options
  const handleBookTicket = () => {
    Alert.alert(
      getLabel('selectPaymentMethod'),
      getLabel('choosePaymentMethod'),
      [
        {
          text: getLabel('creditDebitCard'),
          onPress: () => navigation.navigate('Booking', { train, paymentMethod: 'card', class: selectedClass }),
        },
        {
          text: 'LankaPay QR',
          onPress: () => navigation.navigate('Booking', { train, paymentMethod: 'qr', class: selectedClass }),
        },
        {
          text: getLabel('cashOnCollection'),
          onPress: () => navigation.navigate('Booking', { train, paymentMethod: 'cash', class: selectedClass }),
        },
        {
          text: getLabel('cancel'),
          style: 'cancel',
        },
      ]
    );
  };

  // Handle tracking the train
  const handleTrackTrain = () => {
    navigation.navigate('TrainTracking', { trainId: train.id });
  };

  // Function to determine status color using theme colors
  const getStatusColor = (status) => {
    if (status.toLowerCase().includes('on time')) {
      return theme?.success ?? '#28a745';
    } else if (status.toLowerCase().includes('delayed')) {
      return theme?.warning ?? '#ffc107';
    } else if (status.toLowerCase().includes('cancelled')) {
      return theme?.error ?? '#dc3545';
    }
    return theme?.primary ?? '#007bff';
  };

  // Calculate fares based on class
  const getFareByClass = (classType) => {
    if (!train || !train.fare) return 0;
    
    // For iOS style, we expect the fare to be an object with properties
    if (typeof train.fare === 'object') {
      switch(classType) {
        case '1st':
          return train.fare.firstClass || 0;
        case '2nd':
          return train.fare.secondClass || 0;
        case '3rd':
          return train.fare.thirdClass || 0;
        default:
          return train.fare.secondClass || 0;
      }
    } 
    // If fare is still a string (old Android format), convert it to number and apply multipliers
    else {
      const baseFare = Number(String(train.fare).replace(/[^0-9]/g, ''));
      switch(classType) {
        case '1st':
          return baseFare * 1.5;
        case '2nd':
          return baseFare;
        case '3rd':
          return baseFare * 0.8;
        default:
          return baseFare;
      }
    }
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  if (!train) {
    return (
      <View style={[styles.errorContainer]}>
        <Ionicons name="alert-circle-outline" size={80} color="#dc3545" />
        <Text style={[styles.errorTitle]}>{getLabel('trainNotFound')}</Text>
        <Text style={[styles.errorMessage]}>
          {getLabel('trainNotFoundDescription')}
        </Text>
        <TouchableOpacity 
          title={getLabel('back')} 
          onPress={() => navigation.goBack()} 
          style={styles.errorButton}
        >
          <Text style={{ color: '#FFFFFF', fontWeight: 'bold' }}>{getLabel('back')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Calculate the fare based on the selected class
  const baseFare = getFareByClass(selectedClass);
  const serviceFee = 100;
  const tax = 50;
  const totalFare = baseFare + serviceFee + tax;

  // Bottom action buttons for track and book
  const renderActionButtons = () => {
    const isDarkMode = theme.dark;
    
    return (
      <View style={[
        styles.bottomContainer, 
        { 
          backgroundColor: isDarkMode ? '#121212' : '#FFFFFF',
          borderTopColor: isDarkMode ? '#333333' : '#E0E0E0' 
        }
      ]}>
        {/* Compact price section */}
        <View style={styles.priceRowContainer}>
          {/* Price info */}
          <View style={styles.priceMainSection}>
            <View style={styles.priceHeaderRow}>
              <Text style={[styles.priceLabel, { color: isDarkMode ? '#BBBBBB' : '#666666' }]}>
                {getLabel('price')}
              </Text>
              <Text style={[styles.priceClass, { color: isDarkMode ? '#AAAAAA' : '#888888' }]}>
                ({selectedClass})
              </Text>
            </View>
            
            <Text style={[styles.priceValue, { color: isDarkMode ? '#FFFFFF' : '#212121' }]}>
              {formatPrice(totalFare)}
            </Text>
          </View>
        </View>
        
        {/* Super compact fare breakdown in horizontal row */}
        <View style={[
          styles.fareBreakdownRow, 
          { 
            backgroundColor: isDarkMode ? '#1A1A1A' : '#F8F8F8',
            borderColor: isDarkMode ? '#333333' : '#E0E0E0',
          }
        ]}>
          <View style={styles.fareItemCompact}>
            <Text style={[styles.fareSmallLabel, { color: isDarkMode ? '#BBBBBB' : '#666666' }]}>
              {getLabel('baseFare', 'Base')}
            </Text>
            <Text style={[styles.fareSmallValue, { color: isDarkMode ? '#FFFFFF' : '#212121' }]}>
              {formatPrice(baseFare)}
            </Text>
          </View>
          
          <Text style={[styles.fareSeparator, { color: isDarkMode ? '#555' : '#CCC' }]}>+</Text>
          
          <View style={styles.fareItemCompact}>
            <Text style={[styles.fareSmallLabel, { color: isDarkMode ? '#BBBBBB' : '#666666' }]}>
              {getLabel('serviceFee', 'Fee')}
            </Text>
            <Text style={[styles.fareSmallValue, { color: isDarkMode ? '#FFFFFF' : '#212121' }]}>
              {formatPrice(serviceFee)}
            </Text>
          </View>
          
          <Text style={[styles.fareSeparator, { color: isDarkMode ? '#555' : '#CCC' }]}>+</Text>
          
          <View style={styles.fareItemCompact}>
            <Text style={[styles.fareSmallLabel, { color: isDarkMode ? '#BBBBBB' : '#666666' }]}>
              {getLabel('tax', 'Tax')}
            </Text>
            <Text style={[styles.fareSmallValue, { color: isDarkMode ? '#FFFFFF' : '#212121' }]}>
              {formatPrice(tax)}
            </Text>
          </View>
          
          <View style={[styles.totalSeparator, { backgroundColor: isDarkMode ? '#333333' : '#E0E0E0' }]} />
          
          <View style={styles.fareItemCompact}>
            <Text style={[styles.totalSmallLabel, { color: isDarkMode ? '#FFFFFF' : '#212121' }]}>
              {getLabel('total', 'Total')}
            </Text>
            <Text style={[styles.totalSmallValue, { color: isDarkMode ? '#FFFFFF' : '#212121' }]}>
              {formatPrice(totalFare)}
            </Text>
          </View>
        </View>
        
        {/* Action buttons with text */}
        <View style={styles.actionButtonsRow}>
          <TouchableOpacity
            style={[
              styles.actionButton,
              { backgroundColor: isDarkMode ? '#2C2C2C' : '#EEEEEE' }
            ]}
            onPress={handleTrackTrain}
          >
            <View style={styles.buttonContent}>
              <Ionicons 
                name="navigate" 
                size={14} 
                style={styles.buttonIcon}
                color={isDarkMode ? '#FFFFFF' : '#000000'}
              />
              <Text style={[
                styles.buttonText, 
                { color: isDarkMode ? '#FFFFFF' : '#000000' }
              ]}>
                {getLabel('trackTrain', 'Track')}
              </Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.actionButton,
              { backgroundColor: theme.primary || '#007BFF' }
            ]}
            onPress={handleBookTicket}
          >
            <View style={styles.buttonContent}>
              <Ionicons 
                name="ticket" 
                size={14} 
                style={styles.buttonIcon}
                color="#FFFFFF"
              />
              <Text style={[styles.buttonText, { color: "#FFFFFF" }]}>
                {getLabel('bookTicket', 'Book')}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme?.background ?? '#f8f9fa' }]}>
      <StatusBar barStyle={theme?.isDark ? "light-content" : "dark-content"} backgroundColor={theme?.primary ?? '#007bff'} />
      
      {/* Header with cleaner and more modern design */}
      <View style={[styles.header, { backgroundColor: theme?.primary ?? '#007bff' }]}>
        <View style={styles.headerContentWrapper}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          
          <View style={styles.headerContent}>
            <Text style={styles.trainTitle} numberOfLines={1}>
              {train.name}
            </Text>
            <Text style={styles.trainSubtitle}>{train.source} → {train.destination}</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.favoriteButton}
            onPress={toggleFavorite}
          >
            <Ionicons 
              name={isFavorite ? "heart" : "heart-outline"} 
              size={24} 
              color={isFavorite ? "#FF5F5F" : "#FFFFFF"} 
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Journey Card with improved UI */}
        <View style={[
          styles.journeyCard, 
          { 
            backgroundColor: theme?.cardBackground ?? '#f8f9fa', 
            borderColor: theme?.border ?? '#dee2e6',
            ...theme?.shadows?.medium ?? {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3
            }
          }
        ]}>
          <View style={[styles.cardHeader, { borderBottomColor: theme?.border ?? '#dee2e6' }]}>
            <Text style={[styles.cardTitle, { color: theme?.textPrimary ?? '#212529' }]}>{getLabel('journeyDetails')}</Text>
          </View>
          <View style={styles.timelineContainer}>
            {/* Source Station */}
            <View style={styles.timelinePoint}>
              <View style={[styles.timelineDot, { backgroundColor: theme?.primary ?? '#007bff' }]} />
              <View style={styles.timelineStationTime}>
                <Text style={[styles.timeText, { color: theme?.textPrimary ?? '#212529' }]}>{train.departureTime}</Text>
                <Text style={[styles.stationNameLarge, { color: theme?.textPrimary ?? '#212529' }]}>{train.source}</Text>
              </View>
            </View>
            
            {/* Timeline line */}
            <View style={[styles.timelineLine, { backgroundColor: theme?.border ?? '#dee2e6' }]} />
            
            {/* Journey duration */}
            <View style={styles.timelineDuration}>
              <Text style={[styles.durationText, { color: theme?.primary ?? '#007bff' }]}>{train.duration}</Text>
              <Text style={[styles.distanceText, { color: theme?.textSecondary ?? '#6c757d' }]}>
                {typeof train.distance === 'number' ? `${train.distance} km` : train.distance}
              </Text>
            </View>
            
            {/* Timeline line */}
            <View style={[styles.timelineLine, { backgroundColor: theme?.border ?? '#dee2e6' }]} />
            
            {/* Destination Station */}
            <View style={styles.timelinePoint}>
              <View style={[styles.timelineDot, { backgroundColor: theme?.primary ?? '#007bff' }]} />
              <View style={styles.timelineStationTime}>
                <Text style={[styles.timeText, { color: theme?.textPrimary ?? '#212529' }]}>{train.arrivalTime}</Text>
                <Text style={[styles.stationNameLarge, { color: theme?.textPrimary ?? '#212529' }]}>{train.destination}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Train Info Card - Redesigned with better layout */}
        <View style={[
          styles.detailCard, 
          { 
            backgroundColor: theme?.cardBackground ?? '#f8f9fa',
            borderColor: theme?.border ?? '#dee2e6',
            ...theme?.shadows?.medium ?? {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3
            }
          }
        ]}>
          <View style={[styles.cardHeader, { borderBottomColor: theme?.border ?? '#dee2e6' }]}>
            <Text style={[styles.cardTitle, { color: theme?.textPrimary ?? '#212529' }]}>
              {getLabel('trainDetails')}
            </Text>
          </View>
          
          {/* Train details in a grid layout */}
          <View style={styles.infoGrid}>
            {/* Train Number */}
            <View style={[styles.infoGridItem, { 
              borderColor: theme?.border ?? '#dee2e6',
              backgroundColor: theme?.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)' 
            }]}>
              <View style={[styles.infoIconContainer, { backgroundColor: (theme?.primary ?? '#007bff') + '15' }]}>
                <Ionicons name="train-outline" size={22} color={theme?.primary ?? '#007bff'} />
              </View>
              <View style={styles.infoContent}>
                <Text style={[styles.infoLabel, { color: theme?.textSecondary ?? '#6c757d' }]}>{getLabel('trainNumber')}</Text>
                <Text style={[styles.infoValue, { color: theme?.textPrimary ?? '#212529' }]}>{train?.number}</Text>
              </View>
            </View>

            {/* Train Type */}
            <View style={[styles.infoGridItem, { 
              borderColor: theme?.border ?? '#dee2e6',
              backgroundColor: theme?.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)' 
            }]}>
              <View style={[styles.infoIconContainer, { backgroundColor: (theme?.primary ?? '#007bff') + '15' }]}>
                <Ionicons name="options-outline" size={22} color={theme?.primary ?? '#007bff'} />
              </View>
              <View style={styles.infoContent}>
                <Text style={[styles.infoLabel, { color: theme?.textSecondary ?? '#6c757d' }]}>{getLabel('trainType')}</Text>
                <Text style={[styles.infoValue, { color: theme?.textPrimary ?? '#212529' }]}>{train?.type || getLabel('express')}</Text>
              </View>
            </View>

            {/* Frequency */}
            <View style={[styles.infoGridItem, { 
              borderColor: theme?.border ?? '#dee2e6',
              backgroundColor: theme?.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)' 
            }]}>
              <View style={[styles.infoIconContainer, { backgroundColor: (theme?.primary ?? '#007bff') + '15' }]}>
                <Ionicons name="calendar-outline" size={22} color={theme?.primary ?? '#007bff'} />
              </View>
              <View style={styles.infoContent}>
                <Text style={[styles.infoLabel, { color: theme?.textSecondary ?? '#6c757d' }]}>{getLabel('frequency')}</Text>
                <Text style={[styles.infoValue, { color: theme?.textPrimary ?? '#212529' }]}>{train?.frequency || getLabel('daily')}</Text>
              </View>
            </View>

            {/* Status */}
            <View style={[styles.infoGridItem, { 
              borderColor: theme?.border ?? '#dee2e6',
              backgroundColor: theme?.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)' 
            }]}>
              <View style={[styles.infoIconContainer, { backgroundColor: (theme?.success ?? '#28a745') + '15' }]}>
                <Ionicons name="checkmark-circle-outline" size={22} color={getStatusColor(train.status)} />
              </View>
              <View style={styles.infoContent}>
                <Text style={[styles.infoLabel, { color: theme?.textSecondary ?? '#6c757d' }]}>{getLabel('status')}</Text>
                <Text style={[styles.infoValue, { color: getStatusColor(train.status) }]}>
                  {train.status}
                </Text>
              </View>
            </View>
          </View>
        </View>
        
        {/* Fare Details Card - Redesigned with improved styling */}
        <View style={[
          styles.detailCard, 
          { 
            backgroundColor: theme?.cardBackground ?? '#f8f9fa', 
            borderColor: theme?.border ?? '#dee2e6',
            ...theme?.shadows?.medium ?? {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3
            }
          }
        ]}>
          <View style={[styles.cardHeader, { borderBottomColor: theme?.border ?? '#dee2e6' }]}>
            <Text style={[styles.cardTitle, { color: theme?.textPrimary ?? '#212529' }]}>{getLabel('fareDetails')}</Text>
          </View>
          
          {/* Class Selection with improved UI */}
          <View style={styles.classSelection}>
            <Text style={[styles.sectionTitle, { color: theme?.textPrimary ?? '#212529', marginBottom: 10 }]}>
              {getLabel('selectClass')}
            </Text>
            <View style={styles.classOptions}>
              <TouchableOpacity 
                style={[
                  styles.classOption, 
                  selectedClass === '1st' && [styles.selectedClassOption, { borderColor: theme?.primary ?? '#007bff' }],
                  { 
                    backgroundColor: theme?.isDark ? theme?.cardBackground ?? '#343a40' : theme?.background ?? '#f8f9fa',
                    borderColor: theme?.border ?? '#dee2e6' 
                  }
                ]}
                onPress={() => setSelectedClass('1st')}
              >
                <Ionicons 
                  name="star" 
                  size={22} 
                  color={selectedClass === '1st' ? theme?.primary ?? '#007bff' : theme?.textSecondary ?? '#6c757d'} 
                />
                <Text style={[
                  styles.classText, 
                  { color: selectedClass === '1st' ? theme?.primary ?? '#007bff' : theme?.textSecondary ?? '#6c757d' }
                ]}>{getLabel('firstClass', '1st Class')}</Text>
                <Text style={[styles.fareValue, { color: theme?.textPrimary ?? '#212529' }]}>
                  {formatPrice(getFareByClass('1st'))}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.classOption, 
                  selectedClass === '2nd' && [styles.selectedClassOption, { borderColor: theme?.primary ?? '#007bff' }],
                  { 
                    backgroundColor: theme?.isDark ? theme?.cardBackground ?? '#343a40' : theme?.background ?? '#f8f9fa',
                    borderColor: theme?.border ?? '#dee2e6' 
                  }
                ]}
                onPress={() => setSelectedClass('2nd')}
              >
                <Ionicons 
                  name="medal" 
                  size={22} 
                  color={selectedClass === '2nd' ? theme?.primary ?? '#007bff' : theme?.textSecondary ?? '#6c757d'} 
                />
                <Text style={[
                  styles.classText, 
                  { color: selectedClass === '2nd' ? theme?.primary ?? '#007bff' : theme?.textSecondary ?? '#6c757d' }
                ]}>{getLabel('secondClass', '2nd Class')}</Text>
                <Text style={[styles.fareValue, { color: theme?.textPrimary ?? '#212529' }]}>
                  {formatPrice(getFareByClass('2nd'))}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.classOption, 
                  selectedClass === '3rd' && [styles.selectedClassOption, { borderColor: theme?.primary ?? '#007bff' }],
                  { 
                    backgroundColor: theme?.isDark ? theme?.cardBackground ?? '#343a40' : theme?.background ?? '#f8f9fa',
                    borderColor: theme?.border ?? '#dee2e6' 
                  }
                ]}
                onPress={() => setSelectedClass('3rd')}
              >
                <Ionicons 
                  name="people" 
                  size={22} 
                  color={selectedClass === '3rd' ? theme?.primary ?? '#007bff' : theme?.textSecondary ?? '#6c757d'} 
                />
                <Text style={[
                  styles.classText, 
                  { color: selectedClass === '3rd' ? theme?.primary ?? '#007bff' : theme?.textSecondary ?? '#6c757d' }
                ]}>{getLabel('thirdClass', '3rd Class')}</Text>
                <Text style={[styles.fareValue, { color: theme?.textPrimary ?? '#212529' }]}>
                  {formatPrice(getFareByClass('3rd'))}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.fareContainer}>
            <View style={[
              styles.fareInfoCard, 
              { 
                backgroundColor: theme?.isDark ? theme?.cardBackground ?? '#343a40' : theme?.background ?? '#f8f9fa',
                borderColor: theme?.border ?? '#dee2e6' 
              }
            ]}>
              <View style={styles.fareInfo}>
                <View style={styles.fareRow}>
                  <Ionicons name="pricetag-outline" size={18} color={theme?.textSecondary ?? '#6c757d'} />
                  <Text style={[styles.fareLabel, { color: theme?.textSecondary ?? '#6c757d' }]}>{getLabel('baseFare')}</Text>
                </View>
                <Text style={[styles.fareValue, { color: theme?.textPrimary ?? '#212529' }]}>
                  {formatPrice(baseFare)}
                </Text>
              </View>
              <View style={[styles.separator, { backgroundColor: theme?.border ?? '#dee2e6' }]} />
              
              <View style={styles.fareInfo}>
                <View style={styles.fareRow}>
                  <Ionicons name="business-outline" size={18} color={theme?.textSecondary ?? '#6c757d'} />
                  <Text style={[styles.fareLabel, { color: theme?.textSecondary ?? '#6c757d' }]}>{getLabel('serviceFee')}</Text>
                </View>
                <Text style={[styles.fareValue, { color: theme?.textPrimary ?? '#212529' }]}>
                  {formatPrice(serviceFee)}
                </Text>
              </View>
              <View style={[styles.separator, { backgroundColor: theme?.border ?? '#dee2e6' }]} />
              
              <View style={styles.fareInfo}>
                <View style={styles.fareRow}>
                  <Ionicons name="receipt-outline" size={18} color={theme?.textSecondary ?? '#6c757d'} />
                  <Text style={[styles.fareLabel, { color: theme?.textSecondary ?? '#6c757d' }]}>{getLabel('tax')}</Text>
                </View>
                <Text style={[styles.fareValue, { color: theme?.textPrimary ?? '#212529' }]}>
                  {formatPrice(tax)}
                </Text>
              </View>
              
              <View style={[styles.fareTotal, { borderTopColor: theme?.border ?? '#dee2e6' }]}>
                <View style={styles.fareRow}>
                  <Ionicons name="cash-outline" size={20} color={theme?.textPrimary ?? '#212529'} />
                  <Text style={[styles.totalLabel, { color: theme?.textPrimary ?? '#212529' }]}>{getLabel('totalFare')}</Text>
                </View>
                <Text style={[styles.totalValue, { color: theme?.primary ?? '#007bff' }]}>
                  {formatPrice(totalFare)}
                </Text>
              </View>
            </View>
          </View>
        </View>
        
        {/* Amenities Card - Redesigned with improved layout */}
        <View style={[
          styles.detailCard, 
          { 
            backgroundColor: theme?.cardBackground ?? '#f8f9fa', 
            borderColor: theme?.border ?? '#dee2e6',
            ...theme?.shadows?.medium ?? {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3
            }
          }
        ]}>
          <View style={[styles.cardHeader, { borderBottomColor: theme?.border ?? '#dee2e6' }]}>
            <Text style={[styles.cardTitle, { color: theme?.textPrimary ?? '#212529' }]}>{getLabel('amenities')}</Text>
          </View>
          <View style={styles.amenitiesContainer}>
            {train.amenities.map((amenity, index) => (
              <View 
                key={index}
                style={[styles.amenityItem, {
                  backgroundColor: theme?.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                  borderColor: theme?.border ?? '#dee2e6',
                }]}
              >
                <View style={[styles.amenityIconContainer, { backgroundColor: (theme?.primary ?? '#007bff') + '20' }]}>
                  <Ionicons 
                    name={
                      amenity.includes('WiFi') ? 'wifi' : 
                      amenity.includes('Food') ? 'restaurant' :
                      amenity.includes('Air') ? 'snow' :
                      amenity.includes('Charging') ? 'battery-charging' :
                      amenity.includes('Entertainment') ? 'tv' :
                      amenity.includes('Sleeper') ? 'bed' :
                      amenity.includes('Reading') ? 'book' :
                      'checkmark-circle'
                    } 
                    size={24} 
                    color={theme?.primary ?? '#007bff'}
                  />
                </View>
                <Text style={[styles.amenityText, { color: theme?.textPrimary ?? '#212529' }]}>{amenity}</Text>
              </View>
            ))}
          </View>
        </View>
        
        {/* Train Information */}
        <View style={[
          styles.detailCard, 
          { 
            backgroundColor: theme?.cardBackground ?? '#f8f9fa', 
            borderColor: theme?.border ?? '#dee2e6',
            ...theme?.shadows?.medium ?? {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3
            }
          }
        ]}>
          <View style={[styles.cardHeader, { borderBottomColor: theme?.border ?? '#dee2e6' }]}>
            <Text style={[styles.cardTitle, { color: theme?.textPrimary ?? '#212529' }]}>{getLabel('trainInformation')}</Text>
            <TouchableOpacity 
              style={styles.expandButton}
              onPress={() => setShowExtraInfo(!showExtraInfo)}
            >
              <MaterialIcons 
                name={showExtraInfo ? "expand-less" : "expand-more"} 
                size={24} 
                color={theme?.textPrimary ?? '#212529'} 
              />
            </TouchableOpacity>
          </View>
          <View style={styles.infoItem}>
            <Text style={[styles.infoLabel, { color: theme?.textSecondary ?? '#6c757d' }]}>{getLabel('trainNumber')}</Text>
            <Text style={[styles.infoValue, { color: theme?.textPrimary ?? '#212529' }]}>{train.number}</Text>
          </View>
          <View style={[styles.separator, { backgroundColor: theme?.border ?? '#dee2e6' }]} />
          <View style={styles.infoItem}>
            <Text style={[styles.infoLabel, { color: theme?.textSecondary ?? '#6c757d' }]}>{getLabel('trainName')}</Text>
            <Text style={[styles.infoValue, { color: theme?.textPrimary ?? '#212529' }]}>{train.name}</Text>
          </View>
          <View style={[styles.separator, { backgroundColor: theme?.border ?? '#dee2e6' }]} />
          <View style={styles.infoItem}>
            <Text style={[styles.infoLabel, { color: theme?.textSecondary ?? '#6c757d' }]}>{getLabel('distance')}</Text>
            <Text style={[styles.infoValue, { color: theme?.textPrimary ?? '#212529' }]}>
              {typeof train.distance === 'number' ? `${train.distance} km` : train.distance}
            </Text>
          </View>
          <View style={[styles.separator, { backgroundColor: theme?.border ?? '#dee2e6' }]} />
          <View style={styles.infoItem}>
            <Text style={[styles.infoLabel, { color: theme?.textSecondary ?? '#6c757d' }]}>{getLabel('duration')}</Text>
            <Text style={[styles.infoValue, { color: theme?.textPrimary ?? '#212529' }]}>{train.duration}</Text>
          </View>
          <View style={[styles.separator, { backgroundColor: theme?.border ?? '#dee2e6' }]} />
          <View style={styles.infoItem}>
            <Text style={[styles.infoLabel, { color: theme?.textSecondary ?? '#6c757d' }]}>{getLabel('status')}</Text>
            <Text 
              style={[
                styles.infoValue, 
                { color: getStatusColor(train.status) }
              ]}
            >
              {train.status}
            </Text>
          </View>
          {/* Extra information that can be expanded */}
          {showExtraInfo && (
            <>
              <View style={[styles.separator, { backgroundColor: theme?.border ?? '#dee2e6' }]} />
              <View style={styles.infoItem}>
                <Text style={[styles.infoLabel, { color: theme?.textSecondary ?? '#6c757d' }]}>{getLabel('trainType')}</Text>
                <Text style={[styles.infoValue, { color: theme?.textPrimary ?? '#212529' }]}>{train.type || getLabel('express')}</Text>
              </View>
              <View style={[styles.separator, { backgroundColor: theme?.border ?? '#dee2e6' }]} />
              <View style={styles.infoItem}>
                <Text style={[styles.infoLabel, { color: theme?.textSecondary ?? '#6c757d' }]}>{getLabel('frequency')}</Text>
                <Text style={[styles.infoValue, { color: theme?.textPrimary ?? '#212529' }]}>{train.frequency || getLabel('daily')}</Text>
              </View>
            </>
          )}
        </View>
        
        {/* Add some space at the bottom for the fixed button */}
        <View style={{ height: 100 }} />
      </ScrollView>
      
      {renderActionButtons()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa', // Default background
  },
  header: {
    height: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 10,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerContentWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 0,
    padding: 5,
    zIndex: 10,
  },
  favoriteButton: {
    position: 'absolute',
    right: 0,
    zIndex: 10,
    padding: 5,
  },
  headerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  trainTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  trainSubtitle: {
    fontSize: 14,
    opacity: 0.8,
    color: '#FFFFFF',
  },
  contentContainer: {
    padding: 15,
    paddingBottom: 80,
  },
  journeyCard: {
    marginBottom: 15,
    borderRadius: 10,
    borderWidth: 1,
    overflow: 'hidden',
  },
  detailCard: {
    marginBottom: 15,
    borderRadius: 10,
    borderWidth: 1,
    overflow: 'hidden',
  },
  cardHeader: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  timelineContainer: {
    padding: 15,
  },
  timelinePoint: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  timelineStationTime: {
    flex: 1,
  },
  timeText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  stationNameLarge: {
    fontSize: 16,
    marginTop: 2,
  },
  timelineLine: {
    height: 30,
    width: 2,
    marginLeft: 4,
  },
  timelineDuration: {
    marginLeft: 20,
    justifyContent: 'center',
    paddingVertical: 5,
  },
  durationText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  distanceText: {
    fontSize: 14,
    marginTop: 2,
  },
  statusTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 25,
    alignSelf: 'flex-start',
    marginTop: 10,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    marginBottom: 5,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  classSelection: {
    paddingHorizontal: 15,
    paddingTop: 15,
  },
  classOptions: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  classOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
  },
  selectedClassOption: {
    borderWidth: 2,
  },
  classText: {
    fontSize: 16,
    marginLeft: 10,
    flex: 1,
  },
  fareContainer: {
    marginTop: 10,
    paddingHorizontal: 15,
    paddingBottom: 15,
  },
  fareInfoCard: {
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
  },
  fareInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  fareRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fareLabel: {
    fontSize: 14,
  },
  fareValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  fareTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  separator: {
    height: 1,
    width: '100%',
    marginVertical: 8,
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 15,
  },
  amenityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
    marginHorizontal: '1%',
    marginBottom: 10,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
  },
  amenityIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  amenityText: {
    fontSize: 14,
    flex: 1,
    flexWrap: 'wrap',
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 15,
  },
  infoGridItem: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 10,
    marginHorizontal: '1%',
    borderWidth: 1,
  },
  infoIconContainer: {
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  infoContent: {
    flex: 1,
    flexWrap: 'wrap',
  },
  infoLabel: {
    fontSize: 14,
    color: '#6c757d',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#212529',
  },
  bottomContainer: {
    flexDirection: 'column',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 8,
    paddingTop: 6,
    paddingBottom: Platform.OS === 'ios' ? 12 : 8,
    borderTopWidth: 1,
  },
  priceRowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  priceMainSection: {
    flexDirection: 'column',
  },
  priceHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: 11,
    marginRight: 3,
  },
  priceValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  priceClass: {
    fontSize: 10,
  },
  fareBreakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 6,
    borderWidth: 1,
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  fareItemCompact: {
    alignItems: 'center',
  },
  fareSmallLabel: {
    fontSize: 9,
    textAlign: 'center',
  },
  fareSmallValue: {
    fontSize: 10,
    fontWeight: '500',
    textAlign: 'center',
  },
  fareSeparator: {
    fontSize: 10,
    marginHorizontal: 1,
  },
  totalSeparator: {
    width: 1,
    height: '80%',
    marginHorizontal: 4,
  },
  totalSmallLabel: {
    fontSize: 9,
    fontWeight: '600',
    textAlign: 'center',
  },
  totalSmallValue: {
    fontSize: 11,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  actionButtonsRow: {
    flexDirection: 'row',
  },
  actionButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 6,
    marginHorizontal: 3,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    marginRight: 4,
  },
  buttonText: {
    fontSize: 12,
    fontWeight: '600',
  },
});

export default TrainDetailScreen;
