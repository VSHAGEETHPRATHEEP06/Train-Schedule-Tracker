import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SIZES, SPACING } from '../config/theme';
import { useTheme } from '../context/ThemeContext';
import { useCurrency } from '../context/CurrencyContext';
import StorageService from '../services/StorageService';
import TrainService from '../services/TrainService';

/**
 * MyBookingsScreen - Displays all bookings made by the user
 */
const MyBookingsScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { formatPrice } = useCurrency();
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [trainsMap, setTrainsMap] = useState({});
  const [activeTab, setActiveTab] = useState('upcoming'); // upcoming, completed, cancelled

  // Load bookings and associated train data
  useEffect(() => {
    const loadBookings = async () => {
      try {
        setLoading(true);
        
        // Load all bookings from storage
        const userBookings = await StorageService.getBookings() || [];
        setBookings(userBookings);
        
        // Load all trains to map train details to bookings
        const allTrains = await TrainService.getAllTrains();
        const trainsMapping = {};
        allTrains.forEach(train => {
          trainsMapping[train.id] = train;
        });
        setTrainsMap(trainsMapping);

        // Apply initial filter (upcoming bookings)
        filterBookings('upcoming', userBookings);
      } catch (error) {
        console.error('Error loading bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, []);

  // Filter bookings based on tab
  const filterBookings = (filter, bookingsToFilter = bookings) => {
    const currentDate = new Date();
    let filtered = [];

    switch (filter) {
      case 'upcoming':
        filtered = bookingsToFilter.filter(booking => {
          const journeyDate = new Date(booking.journeyDate);
          return journeyDate >= currentDate && booking.status !== 'Cancelled';
        });
        break;
      case 'completed':
        filtered = bookingsToFilter.filter(booking => {
          const journeyDate = new Date(booking.journeyDate);
          return journeyDate < currentDate && booking.status !== 'Cancelled';
        });
        break;
      case 'cancelled':
        filtered = bookingsToFilter.filter(booking => 
          booking.status === 'Cancelled'
        );
        break;
      default:
        filtered = bookingsToFilter;
    }

    setFilteredBookings(filtered);
    setActiveTab(filter);
  };

  // Format date to more readable form
  const formatDate = (dateString) => {
    const options = { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Render booking item card
  const renderBookingItem = ({ item }) => {
    const train = trainsMap[item.trainId];
    if (!train) return null;

    return (
      <TouchableOpacity 
        style={[styles.bookingCard, { backgroundColor: theme.card, ...theme.shadows.medium }]}
        onPress={() => 
          navigation.navigate('BookingDetail', { 
            trainId: train.id,
            bookingId: item.id
          })
        }
        activeOpacity={0.7}
      >
        <View style={styles.cardHeader}>
          <View>
            <Text style={[styles.trainName, { color: theme.text }]}>{train.name}</Text>
            <Text style={[styles.bookingReference, { color: theme.subtext }]}>#{item.id.substring(0, 8)}</Text>
          </View>
          
          <View style={[
            styles.statusBadge,
            {
              backgroundColor: 
                item.status === 'Confirmed' ? theme.success + '20' :
                item.status === 'Cancelled' ? theme.error + '20' :
                theme.warning + '20'
            }
          ]}>
            <Text style={[
              styles.statusText,
              {
                color: 
                  item.status === 'Confirmed' ? theme.success :
                  item.status === 'Cancelled' ? theme.error :
                  theme.warning
              }
            ]}>
              {item.status}
            </Text>
          </View>
        </View>
        
        <View style={styles.routeInfo}>
          <View style={styles.stationTime}>
            <Text style={[styles.timeText, { color: theme.text }]}>{train.departureTime}</Text>
            <Text style={[styles.stationText, { color: theme.subtext }]}>{train.source}</Text>
          </View>
          
          <View style={styles.durationContainer}>
            <View style={[styles.line, { backgroundColor: theme.border }]} />
            <Text style={[styles.durationText, { color: theme.primary }]}>{train.duration}</Text>
            <View style={[styles.line, { backgroundColor: theme.border }]} />
          </View>
          
          <View style={styles.stationTime}>
            <Text style={[styles.timeText, { color: theme.text }]}>{train.arrivalTime}</Text>
            <Text style={[styles.stationText, { color: theme.subtext }]}>{train.destination}</Text>
          </View>
        </View>
        
        <View style={[styles.bookingFooter, { borderTopColor: theme.border }]}>
          <View style={styles.dateContainer}>
            <Ionicons name="calendar-outline" size={16} color={theme.primary} />
            <Text style={[styles.dateText, { color: theme.text }]}>{
              formatDate(item.journeyDate)
            }</Text>
          </View>
          
          <View style={styles.passengerContainer}>
            <Ionicons name="people-outline" size={16} color={theme.primary} />
            <Text style={[styles.passengerText, { color: theme.text }]}>
              {item.passengers.length} {item.passengers.length === 1 ? 'Passenger' : 'Passengers'}
            </Text>
          </View>
          
          <Text style={[styles.fareText, { color: theme.text }]}>{
            typeof item.totalFare === 'number' 
              ? formatPrice(item.totalFare) 
              : item.totalFare
          }</Text>
        </View>
        
        <TouchableOpacity 
          style={[styles.viewButton, { borderColor: theme.border, backgroundColor: theme.primary + '10' }]}
          onPress={() => 
            navigation.navigate('BookingDetail', { 
              trainId: train.id,
              bookingId: item.id
            })
          }
        >
          <Text style={[styles.viewButtonText, { color: theme.primary }]}>View Details</Text>
          <Ionicons name="chevron-forward" size={16} color={theme.primary} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  // Render empty bookings message
  const renderEmptyBookings = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="document-text-outline" size={80} color={theme.border} />
      <Text style={[styles.emptyTitle, { color: theme.text }]}>No Bookings Found</Text>
      <Text style={[styles.emptyMessage, { color: theme.subtext }]}>
        {activeTab === 'upcoming' 
          ? "You don't have any upcoming bookings. Book a train to get started!"
          : activeTab === 'completed'
          ? "You don't have any completed journeys yet."
          : "You don't have any cancelled bookings."}
      </Text>
      {activeTab === 'upcoming' && (
        <TouchableOpacity 
          style={[styles.bookNowButton, { backgroundColor: theme.primary }]}
          onPress={() => navigation.navigate('HomeTab')}
        >
          <Text style={[styles.bookNowText, { color: theme.card }]}>Book Now</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={theme.dark ? "light-content" : "dark-content"} backgroundColor={theme.card} />
      
      {/* Booking tabs */}
      <View style={[styles.tabsContainer, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
        <TouchableOpacity 
          style={[
            styles.tabButton,
            activeTab === 'upcoming' && [styles.activeTabButton, { borderBottomColor: theme.primary }]
          ]}
          onPress={() => filterBookings('upcoming')}
        >
          <Text style={[
            styles.tabButtonText,
            { color: theme.subtext },
            activeTab === 'upcoming' && [styles.activeTabButtonText, { color: theme.primary }]
          ]}>
            Upcoming
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.tabButton,
            activeTab === 'completed' && [styles.activeTabButton, { borderBottomColor: theme.primary }]
          ]}
          onPress={() => filterBookings('completed')}
        >
          <Text style={[
            styles.tabButtonText,
            { color: theme.subtext },
            activeTab === 'completed' && [styles.activeTabButtonText, { color: theme.primary }]
          ]}>
            Completed
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.tabButton,
            activeTab === 'cancelled' && [styles.activeTabButton, { borderBottomColor: theme.primary }]
          ]}
          onPress={() => filterBookings('cancelled')}
        >
          <Text style={[
            styles.tabButtonText,
            { color: theme.subtext },
            activeTab === 'cancelled' && [styles.activeTabButtonText, { color: theme.primary }]
          ]}>
            Cancelled
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* Bookings list */}
      <FlatList
        data={filteredBookings}
        keyExtractor={(item) => item.id}
        renderItem={renderBookingItem}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={renderEmptyBookings}
        showsVerticalScrollIndicator={false}
      />
    </View>
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
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.s,
    borderBottomWidth: 1,
  },
  tabButton: {
    flex: 1,
    paddingVertical: SPACING.s,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTabButton: {
    borderBottomWidth: 2,
  },
  tabButtonText: {
    fontSize: SIZES.medium,
  },
  activeTabButtonText: {
    fontWeight: 'bold',
  },
  listContainer: {
    padding: SPACING.m,
    paddingBottom: SPACING.xxl,
  },
  bookingCard: {
    borderRadius: 12,
    padding: SPACING.m,
    marginBottom: SPACING.m,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.s,
  },
  trainName: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
  },
  bookingReference: {
    fontSize: SIZES.small,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: SPACING.s,
    paddingVertical: SPACING.xs,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusText: {
    fontSize: SIZES.small,
    fontWeight: 'bold',
  },
  routeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: SPACING.s,
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
  bookingFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: SPACING.s,
    borderTopWidth: 1,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: SIZES.small,
    marginLeft: 4,
  },
  passengerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  passengerText: {
    fontSize: SIZES.small,
    marginLeft: 4,
  },
  fareText: {
    fontSize: SIZES.medium,
    fontWeight: 'bold',
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.s,
    paddingHorizontal: SPACING.m,
    borderRadius: 8,
    marginTop: SPACING.s,
  },
  viewButtonText: {
    fontSize: SIZES.small,
    fontWeight: '600',
    marginRight: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
    marginTop: SPACING.xl,
  },
  emptyTitle: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    marginTop: SPACING.m,
    marginBottom: SPACING.s,
  },
  emptyMessage: {
    fontSize: SIZES.medium,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: SPACING.l,
  },
  bookNowButton: {
    paddingVertical: SPACING.s,
    paddingHorizontal: SPACING.xl,
    borderRadius: 8,
  },
  bookNowText: {
    fontSize: SIZES.medium,
    fontWeight: 'bold',
  },
});

export default MyBookingsScreen;
