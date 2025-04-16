import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

/**
 * Component to display the train's route with stations and current position
 */
const TrainTrackMap = ({ train, route, location, theme: propTheme }) => {
  const { theme: contextTheme } = useTheme();
  const { getLabel } = useLanguage();
  
  // Use either passed theme prop or context theme
  const theme = propTheme || contextTheme;
  
  if (!route || route.length === 0) {
    return (
      <View style={[
        styles.container, 
        { 
          backgroundColor: theme?.dark ? '#121212' : '#f8f9fa',
          borderColor: theme?.dark ? '#333333' : '#dee2e6'
        }
      ]}>
        <Text style={{ 
          color: theme?.dark ? '#FFFFFF' : '#212529',
          fontSize: 16,
          fontWeight: '600',
          padding: 20,
        }}>
          {getLabel('noTrackingData') ?? 'No tracking data available'}
        </Text>
      </View>
    );
  }

  // For demo purposes, use a fixed position if not provided
  const trainLocation = location || {
    lastStation: route[0]?.name,
    nextStation: route[1]?.name,
    currentPosition: 30,
    status: train?.status || 'On Time'
  };
  
  // Find current position indices
  const lastStationIndex = route.findIndex(station => station.name === trainLocation.lastStation);
  const nextStationIndex = route.findIndex(station => station.name === trainLocation.nextStation);
  
  // Default to sensible values if indices not found
  const safeLastIndex = lastStationIndex >= 0 ? lastStationIndex : 0;
  const safeNextIndex = nextStationIndex >= 0 ? nextStationIndex : 1;
  
  // Calculate progress between stations
  const stationSegmentPercentage = trainLocation.currentPosition % (100 / (route.length - 1));
  const normalizedStationProgress = stationSegmentPercentage / (100 / (route.length - 1)) * 100;
  
  // Train status color
  const getStatusColor = (status) => {
    if (!status) return theme?.dark ? '#17a2b8' : '#17a2b8';
    
    if (status.toLowerCase().includes('on time')) {
      return theme?.dark ? '#28a745' : '#28a745';
    } else if (status.toLowerCase().includes('delay')) {
      return theme?.dark ? '#ffc107' : '#ffc107';
    } else if (status.toLowerCase().includes('cancel')) {
      return theme?.dark ? '#dc3545' : '#dc3545';
    }
    return theme?.dark ? '#17a2b8' : '#17a2b8';
  };

  return (
    <View style={[
      styles.container, 
      { 
        backgroundColor: theme?.dark ? '#121212' : '#f8f9fa',
        borderColor: theme?.dark ? '#333333' : '#dee2e6'
      }
    ]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.trackContainer}>
          {/* Route label at top */}
          <View style={styles.routeLabelContainer}>
            <Text style={[styles.routeLabel, { 
              color: theme?.dark ? '#FFFFFF' : '#212529',
              backgroundColor: theme?.dark ? '#333333' : '#e9ecef',
              paddingVertical: 8,
              paddingHorizontal: 15,
              borderRadius: 8,
            }]}>
              {train?.name || 'Train Route'}
            </Text>
          </View>
        
          {/* Main vertical track line */}
          <View style={[
            styles.trackLine, 
            { backgroundColor: theme?.dark ? '#454545' : '#adb5bd' }
          ]} />
          
          {/* Render stations */}
          {route.map((station, index) => {
            const isPassed = index <= safeLastIndex;
            const isCurrent = index === safeNextIndex;
            const isLast = index === route.length - 1;
            
            // Determine station color based on status
            let stationColor = theme?.dark ? '#bbbbbb' : '#6c757d';
            let stationBgColor = 'transparent';
            
            if (isPassed) {
              stationColor = theme?.dark ? '#FFFFFF' : '#212529';
            }
            if (isCurrent) {
              stationColor = theme?.dark ? '#90caf9' : '#007bff';
              stationBgColor = theme?.dark ? 'rgba(25, 118, 210, 0.15)' : 'rgba(0, 123, 255, 0.08)';
            }
            
            // Show train position only between last and next station
            const showTrainPosition = index === safeLastIndex && !isLast;
            
            return (
              <View key={`station-${index}`} style={[
                styles.stationContainer,
                isCurrent && { backgroundColor: stationBgColor, borderRadius: 8, marginLeft: -5, paddingLeft: 5 }
              ]}>
                {/* Station dot */}
                <View style={[
                  styles.stationDot, 
                  { 
                    backgroundColor: isCurrent ? (theme?.dark ? '#90caf9' : '#007bff') : stationColor,
                    borderColor: theme?.dark ? '#121212' : '#ffffff',
                    width: isCurrent ? 16 : (isLast || index === 0 ? 12 : 8),
                    height: isCurrent ? 16 : (isLast || index === 0 ? 12 : 8),
                  }
                ]}>
                  {isCurrent && (
                    <View style={[styles.currentStationRing, { 
                      borderColor: theme?.dark ? '#90caf9' : '#007bff',
                      width: 24,
                      height: 24,
                      borderRadius: 12,
                    }]} />
                  )}
                </View>
                
                {/* Station details */}
                <View style={styles.stationDetails}>
                  {/* Station name */}
                  <Text style={[
                    styles.stationName, 
                    { 
                      color: stationColor,
                      fontSize: isCurrent ? 17 : 15,
                      fontWeight: isCurrent ? '700' : (isPassed ? '600' : '500')
                    }
                  ]}>
                    {station.name}
                  </Text>
                  
                  {/* Station time */}
                  <Text style={[
                    styles.stationTime,
                    { 
                      color: isCurrent ? (theme?.dark ? '#90caf9' : '#007bff') : (theme?.dark ? '#bbbbbb' : '#6c757d'),
                      fontSize: 13,
                      fontWeight: isCurrent ? '600' : '400'
                    }
                  ]}>
                    {station.arrivalTime}
                  </Text>
                </View>
                
                {/* Show train position */}
                {showTrainPosition && (
                  <View style={[
                    styles.trainPositionContainer,
                    { top: `${normalizedStationProgress}%` }
                  ]}>
                    <View style={[
                      styles.trainPositionLine,
                      { backgroundColor: getStatusColor(trainLocation.status) }
                    ]} />
                    
                    <View style={[
                      styles.trainIcon,
                      { 
                        backgroundColor: getStatusColor(trainLocation.status),
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.3,
                        shadowRadius: 3,
                        elevation: 5,
                      }
                    ]}>
                      <Ionicons 
                        name="train-outline" 
                        size={14} 
                        color={theme?.dark ? '#000000' : '#ffffff'} 
                      />
                    </View>
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>
      
      {/* Train status bar at bottom */}
      <View style={[
        styles.statusContainer,
        { 
          backgroundColor: theme?.dark ? '#1e1e1e' : '#ffffff',
          borderTopColor: theme?.dark ? '#333333' : '#dee2e6' 
        }
      ]}>
        <View style={styles.statusRow}>
          <View style={styles.statusItem}>
            <Text style={[styles.statusLabel, { 
              color: theme?.dark ? '#bbbbbb' : '#6c757d',
              fontSize: 14,
            }]}>
              {getLabel('from') ?? 'From'}
            </Text>
            <Text style={[styles.statusValue, { 
              color: theme?.dark ? '#FFFFFF' : '#212529',
              fontSize: 16,
              fontWeight: '600',
            }]}>
              {route[0]?.name || ''}
            </Text>
          </View>
          <View style={styles.statusDivider}>
            <Text style={{ color: theme?.dark ? '#666666' : '#adb5bd' }}>•</Text>
            <Text style={{ color: theme?.dark ? '#666666' : '#adb5bd' }}>•</Text>
            <Text style={{ color: theme?.dark ? '#666666' : '#adb5bd' }}>•</Text>
          </View>
          <View style={styles.statusItem}>
            <Text style={[styles.statusLabel, { 
              color: theme?.dark ? '#bbbbbb' : '#6c757d',
              fontSize: 14,
            }]}>
              {getLabel('to') ?? 'To'}
            </Text>
            <Text style={[styles.statusValue, { 
              color: theme?.dark ? '#FFFFFF' : '#212529',
              fontSize: 16,
              fontWeight: '600',
            }]}>
              {route[route.length - 1]?.name || ''}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  scrollContent: {
    flexGrow: 1,
  },
  trackContainer: {
    padding: 20,
    paddingTop: 20,
    paddingBottom: 30,
    position: 'relative',
  },
  routeLabelContainer: {
    alignItems: 'center',
    marginBottom: 25,
  },
  routeLabel: {
    fontSize: 18,
    fontWeight: '600',
  },
  trackLine: {
    position: 'absolute',
    left: 22,
    top: 60,
    bottom: 0,
    width: 3,
    borderRadius: 3,
    zIndex: 1,
  },
  stationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 22,
    paddingVertical: 8,
    position: 'relative',
  },
  stationDot: {
    width: 10,
    height: 10,
    borderRadius: 8,
    borderWidth: 2,
    marginRight: 15,
    zIndex: 2,
  },
  currentStationRing: {
    position: 'absolute',
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    top: -6,
    left: -6,
  },
  stationDetails: {
    flex: 1,
    paddingRight: 10,
  },
  stationName: {
    fontSize: 16,
    marginBottom: 4,
  },
  stationTime: {
    fontSize: 14,
  },
  trainPositionContainer: {
    position: 'absolute',
    left: 22,
    width: 40,
    height: 20,
    zIndex: 3,
  },
  trainPositionLine: {
    position: 'absolute',
    left: 1.5,
    top: 0,
    bottom: 0,
    width: 3,
    transform: [{ translateX: -1.5 }],
  },
  trainIcon: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusContainer: {
    padding: 15,
    paddingVertical: 18,
    borderTopWidth: 1,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusItem: {
    flex: 1,
  },
  statusLabel: {
    fontSize: 14,
    marginBottom: 5,
  },
  statusValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  statusDivider: {
    width: 30,
    flexDirection: 'column',
    alignItems: 'center',
  },
});

export default TrainTrackMap;
