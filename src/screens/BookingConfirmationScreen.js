import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Share
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SIZES, SPACING } from '../config/theme';
import { useTheme } from '../context/ThemeContext';
import { useCurrency } from '../context/CurrencyContext';
import Button from '../components/Button';

/**
 * BookingConfirmationScreen - Displays booking confirmation details
 */
const BookingConfirmationScreen = ({ route, navigation }) => {
  const { theme } = useTheme();
  const { formatPrice } = useCurrency();
  const { booking, train } = route.params;
  const scrollViewRef = useRef(null);

  // Generate a booking reference number
  const bookingReference = `${train.number.substring(0, 2)}${booking.id.substring(2, 8)}`;

  // Format fare - use the app's currency context
  const formatFare = (fare) => {
    return typeof fare === 'number' 
      ? formatPrice(fare)
      : fare;
  };

  // Get payment method display name
  const getPaymentMethodDetails = () => {
    const method = booking.paymentMethod || 'card';
    
    switch(method) {
      case 'card':
        return {
          name: 'Credit/Debit Card',
          icon: 'card-outline',
          status: 'Paid',
          details: booking.paymentDetails?.last4 ? `**** **** **** ${booking.paymentDetails.last4}` : 'Card payment processed'
        };
      case 'qr':
        return {
          name: 'LankaPay QR',
          icon: 'qr-code-outline',
          status: 'Paid',
          details: 'QR payment completed'
        };
      case 'cash':
        return {
          name: 'Cash on Collection',
          icon: 'cash-outline',
          status: 'Pending',
          details: 'Pay at station before journey'
        };
      default:
        return {
          name: 'Unknown Method',
          icon: 'help-circle-outline',
          status: 'Unknown',
          details: ''
        };
    }
  };

  const paymentInfo = getPaymentMethodDetails();

  // Handle share booking
  const handleShareBooking = async () => {
    try {
      const result = await Share.share({
        message: 
          `Booking Confirmed!\n\n` +
          `Reference: ${bookingReference}\n` +
          `Train: ${train.name} (${train.number})\n` +
          `Journey: ${train.source} to ${train.destination}\n` +
          `Date: ${booking.journeyDate}\n` +
          `Departure: ${train.departureTime}\n` +
          `Passengers: ${booking.passengers.length}\n` +
          `Total Fare: ${formatFare(booking.totalFare)}`
      });
    } catch (error) {
      console.error('Error sharing booking:', error);
    }
  };

  // Handle view tickets in MyBookings
  const handleViewMyBookings = () => {
    navigation.navigate('BookingsTab');
  };

  // Handle return to home
  const handleReturnHome = () => {
    navigation.navigate('HomeTab');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle="light-content" backgroundColor={theme.success} />
      
      {/* Success header */}
      <View style={[styles.header, { backgroundColor: theme.success }]}>
        <View style={[styles.successIcon, { backgroundColor: theme.success }]}>
          <Ionicons name="checkmark" size={50} color={theme.card} />
        </View>
        <Text style={[styles.headerTitle, { color: theme.card }]}>Booking Confirmed!</Text>
        <Text style={[styles.headerSubtitle, { color: theme.card }]}>Your tickets have been booked successfully</Text>
      </View>
      
      <ScrollView 
        ref={scrollViewRef}
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Booking reference */}
        <View style={styles.referenceContainer}>
          <Text style={[styles.referenceLabel, { color: theme.subtext }]}>Booking Reference</Text>
          <Text style={[styles.referenceNumber, { color: theme.text }]}>{bookingReference}</Text>
          <Text style={[styles.saveText, { color: theme.primary }]}>Save this for your reference</Text>
        </View>
        
        {/* Ticket Summary Card */}
        <View style={[styles.ticketCard, { backgroundColor: theme.card, ...theme.shadows.medium }]}>
          <View style={styles.ticketHeader}>
            <Text style={[styles.cardTitle, { color: theme.text }]}>Ticket Summary</Text>
            <TouchableOpacity 
              style={styles.shareButton}
              onPress={handleShareBooking}
            >
              <Ionicons name="share-social-outline" size={24} color={theme.primary} />
            </TouchableOpacity>
          </View>
          
          {/* Train Info */}
          <View style={[styles.trainInfoSection, { borderBottomColor: theme.border }]}>
            <Text style={[styles.trainName, { color: theme.text }]}>{train.name}</Text>
            <Text style={[styles.trainNumber, { color: theme.subtext }]}>#{train.number}</Text>
            
            <View style={styles.journeySummary}>
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
          </View>
          
          {/* Journey Details */}
          <View style={[styles.detailsSection, { borderBottomColor: theme.border }]}>
            <View style={styles.detailItem}>
              <Text style={[styles.detailLabel, { color: theme.subtext }]}>Journey Date</Text>
              <Text style={[styles.detailValue, { color: theme.text }]}>{booking.journeyDate}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={[styles.detailLabel, { color: theme.subtext }]}>Booking Date</Text>
              <Text style={[styles.detailValue, { color: theme.text }]}>
                {new Date().toISOString().split('T')[0]}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={[styles.detailLabel, { color: theme.subtext }]}>Status</Text>
              <Text style={[styles.detailValue, styles.statusText, { color: theme.success }]}>Confirmed</Text>
            </View>
          </View>
          
          {/* Passenger Details */}
          <View style={[styles.passengersSection, { borderBottomColor: theme.border }]}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Passenger Details</Text>
            
            {booking.passengers.map((passenger, index) => (
              <View key={passenger.id} style={[styles.passengerItem, { borderBottomColor: theme.border + '50' }]}>
                <View style={styles.passengerLeftSection}>
                  <Text style={[styles.passengerName, { color: theme.text }]}>{passenger.name}</Text>
                  <Text style={[styles.passengerDetails, { color: theme.subtext }]}>
                    {passenger.age} yrs, {passenger.gender}
                  </Text>
                </View>
                <View style={styles.passengerRightSection}>
                  <Text style={[styles.seatLabel, { color: theme.subtext }]}>Coach & Seat</Text>
                  <Text style={[styles.seatNumber, { color: theme.primary }]}>B3-{10 + index}</Text>
                </View>
              </View>
            ))}
          </View>
          
          {/* Payment Information */}
          <View style={[styles.paymentSection, { borderBottomColor: theme.border }]}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Payment Information</Text>
            
            {/* Payment Method */}
            <View style={[styles.paymentMethodItem, { backgroundColor: theme.background, borderColor: theme.border }]}>
              <View style={styles.paymentMethodIcon}>
                <Ionicons name={paymentInfo.icon} size={24} color={theme.primary} />
              </View>
              <View style={styles.paymentMethodDetails}>
                <Text style={[styles.paymentMethodName, { color: theme.text }]}>{paymentInfo.name}</Text>
                <Text style={[styles.paymentMethodInfo, { color: theme.subtext }]}>{paymentInfo.details}</Text>
              </View>
              <View style={[
                styles.paymentStatusBadge, 
                { backgroundColor: paymentInfo.status === 'Paid' ? theme.success + '20' : theme.warning + '20' }
              ]}>
                <Text style={[
                  styles.paymentStatusText, 
                  { color: paymentInfo.status === 'Paid' ? theme.success : theme.warning }
                ]}>{paymentInfo.status}</Text>
              </View>
            </View>
            
            <View style={styles.fareItems}>
              <View style={styles.fareItem}>
                <Text style={[styles.fareLabel, { color: theme.subtext }]}>Ticket Fare ({booking.passengers.length} {booking.passengers.length > 1 ? 'Passengers' : 'Passenger'})</Text>
                <Text style={[styles.fareValue, { color: theme.text }]}>{formatFare(booking.totalFare - 150)}</Text>
              </View>
              <View style={styles.fareItem}>
                <Text style={[styles.fareLabel, { color: theme.subtext }]}>Service Fees</Text>
                <Text style={[styles.fareValue, { color: theme.text }]}>{formatFare(100)}</Text>
              </View>
              <View style={styles.fareItem}>
                <Text style={[styles.fareLabel, { color: theme.subtext }]}>Tax</Text>
                <Text style={[styles.fareValue, { color: theme.text }]}>{formatFare(50)}</Text>
              </View>
              <View style={[styles.fareTotal, { borderTopColor: theme.border }]}>
                <Text style={[styles.totalLabel, { color: theme.text }]}>Total Amount</Text>
                <Text style={[styles.totalValue, { color: theme.primary }]}>{formatFare(booking.totalFare)}</Text>
              </View>
            </View>
          </View>
          
          {/* Contact Details */}
          <View style={styles.contactSection}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Contact Information</Text>
            
            <View style={styles.contactItem}>
              <Ionicons name="person-outline" size={20} color={theme.primary} />
              <Text style={[styles.contactText, { color: theme.text }]}>
                {booking.contactInfo?.name || 'Not provided'}
              </Text>
            </View>
            <View style={styles.contactItem}>
              <Ionicons name="call-outline" size={20} color={theme.primary} />
              <Text style={[styles.contactText, { color: theme.text }]}>
                {booking.contactInfo?.phone || 'Not provided'}
              </Text>
            </View>
            <View style={styles.contactItem}>
              <Ionicons name="mail-outline" size={20} color={theme.primary} />
              <Text style={[styles.contactText, { color: theme.text }]}>
                {booking.contactInfo?.email || 'Not provided'}
              </Text>
            </View>
          </View>
        </View>
        
        {/* Important Information */}
        <View style={[styles.infoCard, { backgroundColor: theme.primary + '10' }]}>
          <View style={styles.infoHeader}>
            <Ionicons name="information-circle" size={24} color={theme.primary} />
            <Text style={[styles.infoTitle, { color: theme.primary }]}>Important Information</Text>
          </View>
          
          <Text style={[styles.infoText, { color: theme.text }]}>
            • Please arrive at the station at least 30 minutes before departure.
          </Text>
          <Text style={[styles.infoText, { color: theme.text }]}>
            • Carry a valid ID proof for all passengers during the journey.
          </Text>
          <Text style={[styles.infoText, { color: theme.text }]}>
            • Check the PNR status before starting your journey for any updates.
          </Text>
        </View>
        
        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <Button
            title="View My Bookings"
            onPress={handleViewMyBookings}
            variant="secondary"
            style={styles.actionButton}
          />
          <Button
            title="Return to Home"
            onPress={handleReturnHome}
            style={styles.actionButton}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: SPACING.xl,
    alignItems: 'center',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    marginBottom: SPACING.m,
  },
  headerTitle: {
    fontSize: SIZES.xlarge,
    fontWeight: 'bold',
    marginBottom: SPACING.xs,
  },
  headerSubtitle: {
    fontSize: SIZES.medium,
    opacity: 0.8,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.m,
  },
  referenceContainer: {
    alignItems: 'center',
    marginVertical: SPACING.m,
  },
  referenceLabel: {
    fontSize: SIZES.small,
    marginBottom: SPACING.xs,
  },
  referenceNumber: {
    fontSize: SIZES.xlarge,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  saveText: {
    fontSize: SIZES.small,
    marginTop: SPACING.xs,
  },
  ticketCard: {
    borderRadius: 12,
    padding: SPACING.l,
    marginBottom: SPACING.m,
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.m,
  },
  cardTitle: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
  },
  shareButton: {
    padding: SPACING.xs,
  },
  trainInfoSection: {
    marginBottom: SPACING.m,
    borderBottomWidth: 1,
    paddingBottom: SPACING.m,
  },
  trainName: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
  },
  trainNumber: {
    fontSize: SIZES.small,
    marginBottom: SPACING.s,
  },
  journeySummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.s,
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
  detailsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginBottom: SPACING.m,
    borderBottomWidth: 1,
    paddingBottom: SPACING.m,
  },
  detailItem: {
    marginBottom: SPACING.s,
    width: '45%',
  },
  detailLabel: {
    fontSize: SIZES.small,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: SIZES.medium,
    fontWeight: '500',
  },
  statusText: {
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: SIZES.medium,
    fontWeight: 'bold',
    marginBottom: SPACING.s,
  },
  passengersSection: {
    marginBottom: SPACING.m,
    borderBottomWidth: 1,
    paddingBottom: SPACING.m,
  },
  passengerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.s,
    borderBottomWidth: 1,
  },
  passengerLeftSection: {
    flex: 1,
  },
  passengerName: {
    fontSize: SIZES.medium,
    fontWeight: '500',
  },
  passengerDetails: {
    fontSize: SIZES.small,
    marginTop: 2,
  },
  passengerRightSection: {
    alignItems: 'flex-end',
  },
  seatLabel: {
    fontSize: SIZES.small,
  },
  seatNumber: {
    fontSize: SIZES.medium,
    fontWeight: 'bold',
  },
  paymentSection: {
    marginBottom: SPACING.m,
    borderBottomWidth: 1,
    paddingBottom: SPACING.m,
  },
  paymentMethodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    padding: SPACING.m,
    marginBottom: SPACING.m,
  },
  paymentMethodIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paymentMethodDetails: {
    flex: 1,
    marginLeft: SPACING.m,
  },
  paymentMethodName: {
    fontSize: SIZES.medium,
    fontWeight: '600',
  },
  paymentMethodInfo: {
    fontSize: SIZES.small,
    marginTop: 2,
  },
  paymentStatusBadge: {
    paddingHorizontal: SPACING.s,
    paddingVertical: SPACING.xs / 2,
    borderRadius: 4,
  },
  paymentStatusText: {
    fontSize: SIZES.small,
    fontWeight: '600',
  },
  fareItems: {
    marginTop: SPACING.xs,
  },
  fareItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.xs,
  },
  fareLabel: {
    fontSize: SIZES.medium,
  },
  fareValue: {
    fontSize: SIZES.medium,
  },
  fareTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.s,
    marginTop: SPACING.s,
    borderTopWidth: 1,
  },
  totalLabel: {
    fontSize: SIZES.medium,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
  },
  contactSection: {
    marginBottom: SPACING.s,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.s,
  },
  contactText: {
    fontSize: SIZES.medium,
    marginLeft: SPACING.s,
  },
  infoCard: {
    borderRadius: 12,
    padding: SPACING.m,
    marginBottom: SPACING.m,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.s,
  },
  infoTitle: {
    fontSize: SIZES.medium,
    fontWeight: 'bold',
    marginLeft: SPACING.xs,
  },
  infoText: {
    fontSize: SIZES.small,
    marginBottom: SPACING.xs,
    lineHeight: 20,
  },
  actionButtons: {
    marginTop: SPACING.m,
    marginBottom: SPACING.xl,
  },
  actionButton: {
    marginBottom: SPACING.s,
  },
});

export default BookingConfirmationScreen;
