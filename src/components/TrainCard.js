import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SIZES, SPACING } from '../config/theme';
import { useTheme } from '../context/ThemeContext';

/**
 * Train card component for displaying train information
 */
const TrainCard = ({ train, onPress, onFavoritePress, isFavorite = false }) => {
  const { theme } = useTheme();
  
  // Function to determine status color
  const getStatusColor = (status) => {
    if (status.toLowerCase().includes('on time')) {
      return theme.success;
    } else if (status.toLowerCase().includes('delayed')) {
      return theme.warning;
    } else if (status.toLowerCase().includes('cancelled')) {
      return theme.error;
    }
    return theme.primary;
  };

  return (
    <TouchableOpacity 
      style={[
        styles.card, 
        { 
          backgroundColor: theme.card,
          ...theme.shadows.small
        }
      ]} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.trainName, { color: theme.text }]}>{train.name}</Text>
          <Text style={[styles.trainNumber, { color: theme.subtext }]}>#{train.number}</Text>
        </View>
        <TouchableOpacity 
          style={styles.favoriteButton}
          onPress={onFavoritePress}
        >
          <Ionicons 
            name={isFavorite ? 'heart' : 'heart-outline'} 
            size={24} 
            color={isFavorite ? theme.error : theme.subtext} 
          />
        </TouchableOpacity>
      </View>

      {/* Route */}
      <View style={styles.routeContainer}>
        <View style={styles.stationTime}>
          <Text style={[styles.time, { color: theme.text }]}>{train.departureTime}</Text>
          <Text style={[styles.station, { color: theme.subtext }]}>{train.source}</Text>
        </View>
        
        <View style={styles.durationContainer}>
          <View style={[styles.line, { backgroundColor: theme.border }]} />
          <Text style={[styles.duration, { color: theme.primary, backgroundColor: theme.background }]}>{train.duration}</Text>
          <View style={[styles.line, { backgroundColor: theme.border }]} />
        </View>
        
        <View style={styles.stationTime}>
          <Text style={[styles.time, { color: theme.text }]}>{train.arrivalTime}</Text>
          <Text style={[styles.station, { color: theme.subtext }]}>{train.destination}</Text>
        </View>
      </View>

      {/* Footer */}
      <View style={[styles.footer, { borderTopColor: theme.border }]}>
        <View style={styles.priceContainer}>
          <Text style={[styles.priceLabel, { color: theme.subtext }]}>Price</Text>
          <Text style={[styles.price, { color: theme.primary }]}>
            {typeof train.fare === 'object' 
              ? `${train.fare.secondClass} Rs` 
              : train.fare}
          </Text>
        </View>
        
        <View style={styles.amenitiesContainer}>
          {train.amenities.slice(0, 3).map((amenity, index) => (
            <View key={index} style={[styles.amenityBadge, { backgroundColor: theme.background }]}>
              <Text style={[styles.amenityText, { color: theme.text }]}>{amenity}</Text>
            </View>
          ))}
        </View>
        
        <View style={styles.statusContainer}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(train.status) }]}>
            <Text style={styles.statusText}>{train.status}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: SPACING.m,
    marginBottom: SPACING.m,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.m,
  },
  trainName: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
  },
  trainNumber: {
    fontSize: SIZES.small,
    marginTop: 2,
  },
  favoriteButton: {
    padding: 4,
  },
  routeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.m,
  },
  stationTime: {
    alignItems: 'center',
    flex: 1,
  },
  time: {
    fontSize: SIZES.medium,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  station: {
    fontSize: SIZES.small,
    textAlign: 'center',
  },
  durationContainer: {
    alignItems: 'center',
    flex: 1.5,
    flexDirection: 'row',
  },
  line: {
    height: 1,
    flex: 1,
  },
  duration: {
    fontSize: SIZES.small,
    paddingHorizontal: 8,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    paddingTop: SPACING.s,
  },
  priceContainer: {
    flex: 1,
  },
  priceLabel: {
    fontSize: SIZES.small,
  },
  price: {
    fontSize: SIZES.medium,
    fontWeight: 'bold',
  },
  amenitiesContainer: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  amenityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginHorizontal: 4,
  },
  amenityText: {
    fontSize: SIZES.small,
  },
  statusContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: SIZES.small,
    color: 'white',
    fontWeight: '500',
  },
});

export default TrainCard;
