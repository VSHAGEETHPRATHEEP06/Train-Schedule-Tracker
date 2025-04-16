import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator, 
  SafeAreaView, 
  RefreshControl,
  StatusBar,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import TrainTrackMap from '../components/TrainTrackMap';
import SriLankaMapTracker from '../components/SriLankaMapTracker';
import TrainService from '../services/TrainService';
import { TrainLocation, TrainRoute } from '../models/TrainLocationModel';

const TrainTrackingScreen = ({ navigation, route }) => {
  const { theme } = useTheme();
  const { getLabel } = useLanguage();
  const { trainId } = route.params || {};
  
  const [selectedTrain, setSelectedTrain] = useState(null);
  const [trainLocation, setTrainLocation] = useState(null);
  const [routeStations, setRouteStations] = useState([]);
  const [trainData, setTrainData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [useMapView, setUseMapView] = useState(true);
  
  // Load train data on mount
  useEffect(() => {
    loadTrainData();
  }, []);

  // Load train data
  const loadTrainData = async () => {
    setLoading(true);
    try {
      // Get all trains
      const trains = await TrainService.getAllTrains();
      setTrainData(trains.slice(0, 5)); // Show first 5 trains for demo
      
      // Select the requested train or the first one
      let trainToSelect = null;
      if (trainId) {
        trainToSelect = trains.find(t => t.id === trainId);
      }
      
      if (!trainToSelect && trains.length > 0) {
        trainToSelect = trains[0];
      }
      
      if (trainToSelect) {
        selectTrain(trainToSelect);
      }
    } catch (error) {
      console.error('Error loading trains:', error);
    } finally {
      setLoading(false);
    }
  };

  // Select a train to track
  const selectTrain = (train) => {
    setSelectedTrain(train);
    
    // Create a mock route for demonstration
    const demoStations = createDemoRouteStations(train);
    setRouteStations(demoStations);
    
    // Create a mock location at a random position
    const progress = Math.floor(Math.random() * 80) + 10; // Between 10% and 90%
    
    // Determine which stations the train is between
    const totalStations = demoStations.length;
    const stationsPerPercent = totalStations / 100;
    const stationIndex = Math.floor(progress * stationsPerPercent);
    const lastStationIndex = Math.min(Math.max(0, stationIndex), totalStations - 2);
    const nextStationIndex = lastStationIndex + 1;
    
    // Create a mock train location
    const mockLocation = {
      trainId: train.id,
      trainNumber: train.number,
      lastStation: demoStations[lastStationIndex].name,
      nextStation: demoStations[nextStationIndex].name,
      lastStationTime: demoStations[lastStationIndex].departureTime,
      nextStationTime: demoStations[nextStationIndex].arrivalTime,
      currentPosition: progress,
      status: train.status,
      routeStations: demoStations.map(station => station.name),
      
      // Add methods needed by the UI
      getTimeToNextStation: () => {
        return "10 min";  // Simplified for demo
      },
      
      hasArrived: () => {
        return false;  // Always show as not arrived for demo
      }
    };
    
    setTrainLocation(mockLocation);
  };

  // Create demo route stations
  const createDemoRouteStations = (train) => {
    const { source, destination, departureTime, arrivalTime } = train;
    
    // Define stations based on train route
    let intermediateStations = [];
    
    // Use specific stations for Colombo-Negombo route
    if (source === 'Colombo Fort' && destination === 'Negombo') {
      intermediateStations = [
        'Kudahakapola',
        'Alawathupitya',
        'Seeduwa',
        'Liyanagemulla',
        'Katunayake',
        'Kumarakanda',
      ];
    } 
    // Use specific stations for Colombo-Galle route
    else if (source === 'Colombo Fort' && destination === 'Galle') {
      intermediateStations = [
        'Bambalapitiya',
        'Mount Lavinia',
        'Moratuwa',
        'Panadura',
        'Kalutara',
        'Beruwala',
        'Aluthgama',
        'Bentota',
        'Induruwa',
        'Kosgoda',
        'Balapitiya',
        'Ambalangoda',
        'Hikkaduwa',
      ];
    }
    // Use specific stations for Colombo-Kandy route
    else if (source === 'Colombo Fort' && destination === 'Kandy') {
      intermediateStations = [
        'Maradana',
        'Ragama',
        'Gampaha',
        'Veyangoda',
        'Mirigama',
        'Polgahawela',
        'Rambukkana',
        'Kadugannawa',
        'Peradeniya',
      ];
    }
    // Use specific stations for Colombo-Badulla route
    else if (source === 'Colombo Fort' && destination === 'Badulla') {
      intermediateStations = [
        'Maradana',
        'Ragama',
        'Gampaha',
        'Veyangoda',
        'Mirigama',
        'Polgahawela',
        'Rambukkana',
        'Kadugannawa',
        'Peradeniya',
        'Kandy',
        'Hatton',
        'Nanu Oya',
        'Haputale',
        'Ella',
        'Demodara',
      ];
    }
    // Use specific stations for Colombo-Batticaloa route
    else if (source === 'Colombo Fort' && destination === 'Batticaloa') {
      intermediateStations = [
        'Maradana',
        'Ragama',
        'Gampaha',
        'Veyangoda',
        'Mirigama',
        'Kurunegala',
        'Maho',
        'Galgamuwa',
        'Anuradhapura',
        'Kekirawa',
        'Habarana',
        'Polonnaruwa',
        'Valaichchenai',
      ];
    }
    // Use specific stations for Colombo-Jaffna route
    else if (source === 'Colombo Fort' && destination === 'Jaffna') {
      intermediateStations = [
        'Maradana',
        'Ragama',
        'Gampaha',
        'Veyangoda',
        'Mirigama',
        'Kurunegala',
        'Maho',
        'Galgamuwa',
        'Anuradhapura',
        'Medawachchiya',
        'Vavuniya',
        'Omanthai',
        'Kilinochchi',
        'Kodikamam',
        'Chavakachcheri',
      ];
    }
    // Default to a simple generic route if no specific route found
    else {
      intermediateStations = [
        'Intermediate Station 1',
        'Intermediate Station 2',
        'Intermediate Station 3',
      ];
    }
    
    // Create station objects with times
    const stations = [];
    const [depHour, depMinute] = departureTime.split(':').map(num => parseInt(num, 10));
    const [arrHour, arrMinute] = arrivalTime.split(':').map(num => parseInt(num, 10));
    
    // Calculate total duration in minutes
    let totalDuration = (arrHour * 60 + arrMinute) - (depHour * 60 + depMinute);
    if (totalDuration < 0) totalDuration += 24 * 60; // Handle overnight trains
    
    // Calculate time per station
    const totalStations = intermediateStations.length + 2; // Source, intermediates, and destination
    const minutesPerStation = totalDuration / (totalStations - 1);
    
    // Add source station
    stations.push({
      name: source,
      code: source.substring(0, 3).toUpperCase(),
      arrivalTime: departureTime,
      departureTime: departureTime,
      position: { latitude: 6.9271, longitude: 79.8612 } // Example position
    });
    
    // Add intermediate stations
    let currentMinutes = depHour * 60 + depMinute;
    
    for (let i = 0; i < intermediateStations.length; i++) {
      currentMinutes += minutesPerStation;
      
      const stationHour = Math.floor(currentMinutes / 60) % 24;
      const stationMinute = Math.floor(currentMinutes % 60);
      
      const timeString = `${stationHour.toString().padStart(2, '0')}:${stationMinute.toString().padStart(2, '0')}`;
      
      stations.push({
        name: intermediateStations[i],
        code: intermediateStations[i].substring(0, 3).toUpperCase(),
        arrivalTime: timeString,
        departureTime: timeString,
        position: { latitude: 6.9271, longitude: 79.8612 } // Example position
      });
    }
    
    // Add destination station
    stations.push({
      name: destination,
      code: destination.substring(0, 3).toUpperCase(),
      arrivalTime: arrivalTime,
      departureTime: arrivalTime,
      position: { latitude: 6.9271, longitude: 79.8612 } // Example position
    });
    
    return stations;
  };

  // Handle refresh
  const onRefresh = () => {
    setRefreshing(true);
    loadTrainData().then(() => setRefreshing(false));
  };

  // Get color based on train status
  const getStatusColor = (status) => {
    if (!status) return theme?.info ?? '#17a2b8';
    
    if (status.toLowerCase().includes('on time')) {
      return theme?.success ?? '#28a745';
    } else if (status.toLowerCase().includes('delay')) {
      return theme?.warning ?? '#ffc107';
    } else if (status.toLowerCase().includes('cancel')) {
      return theme?.error ?? '#dc3545';
    }
    return theme?.info ?? '#17a2b8';
  };

  // Render train card
  const renderTrainCard = useCallback(({ item }) => {
    const isSelected = selectedTrain && selectedTrain.id === item.id;
    const statusColor = getStatusColor(item.status);
    
    return (
      <TouchableOpacity
        style={[
          styles.trainCard,
          {
            backgroundColor: isSelected 
              ? (theme?.dark ? '#333333' : '#e6f2ff') 
              : (theme?.dark ? '#222222' : '#f8f9fa'),
            borderColor: isSelected 
              ? (theme?.dark ? '#4d94ff' : '#b3d7ff') 
              : (theme?.dark ? '#333333' : '#dee2e6'),
          }
        ]}
        onPress={() => selectTrain(item)}
      >
        <View style={styles.trainIconContainer}>
          <View style={[
            styles.trainIcon,
            { backgroundColor: theme?.dark ? '#333333' : '#e9ecef' }
          ]}>
            <Ionicons 
              name="train-outline" 
              size={24} 
              color={statusColor} 
            />
          </View>
        </View>
        
        <View style={styles.trainInfo}>
          <Text style={[
            styles.trainName, 
            { color: theme?.dark ? '#FFFFFF' : '#212529' }
          ]}>
            {item.name}
          </Text>
          <Text style={[
            styles.trainNumber, 
            { color: theme?.dark ? '#BBBBBB' : '#6c757d' }
          ]}>
            {item.number}
          </Text>
          
          <View style={styles.routeInfo}>
            <Text style={[
              styles.stationText, 
              { color: theme?.dark ? '#FFFFFF' : '#212529' }
            ]}>
              {item.source}
            </Text>
            <Ionicons 
              name="arrow-forward" 
              size={12} 
              style={styles.arrowIcon} 
              color={theme?.dark ? '#BBBBBB' : '#6c757d'} 
            />
            <Text style={[
              styles.stationText, 
              { color: theme?.dark ? '#FFFFFF' : '#212529' }
            ]}>
              {item.destination}
            </Text>
          </View>
        </View>
        
        <View style={styles.statusContainer}>
          <Text style={[
            styles.arrivalTime, 
            { color: theme?.dark ? '#FFFFFF' : '#212529' }
          ]}>
            {item.arrivalTime}
          </Text>
          <View style={styles.statusIndicator}>
            <View style={[
              styles.statusDot, 
              { backgroundColor: statusColor }
            ]} />
            <Text style={[
              styles.statusText,
              { color: statusColor, marginLeft: 4, fontSize: 12, fontWeight: '600' }
            ]}>
              {item.status}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }, [selectedTrain, theme]);

  // Components to render above and below the train list
  const renderHeader = useCallback(() => {
    // If selected train, show the map or schematic view
    if (selectedTrain) {
      // Map the route stations to include proper position data for the map
      const routeData = routeStations.map((station, index) => {
        // Use the station name to get the position from trainStations object in SriLankaMapTracker
        return {
          name: station.name,
          position: { x: 95 + (index * 5) % 60, y: 120 + (index * 10) % 150 }
        };
      });
      
      // Find current station based on progress
      const progress = selectedTrain.progress || 50; // Default to middle if no progress
      const stationIndex = Math.floor((routeStations.length - 1) * (progress / 100));
      const currentStation = routeStations[stationIndex]?.name || '';
      
      // Find next station
      const nextStation = routeStations[Math.min(stationIndex + 1, routeStations.length - 1)]?.name || '';
      
      // Calculate arrival time (simplified for demo)
      const arrivalTime = selectedTrain.arrivalTime || '10 min';
      
      return (
        <View style={styles.mapContainer}>
          {useMapView ? (
            <SriLankaMapTracker 
              trainData={{
                trainNumber: selectedTrain.number,
                route: routeData,
                currentStation: currentStation,
                nextStation: nextStation,
                arrivalTime: arrivalTime
              }}
              getLabel={getLabel}
            />
          ) : (
            <TrainTrackMap 
              train={selectedTrain}
              route={routeStations}
              location={trainLocation}
              theme={theme}
            />
          )}
        </View>
      );
    }
    
    // No selected train, show empty state
    return (
      <View style={[
        styles.emptyMapArea,
        { backgroundColor: theme?.dark ? '#222222' : '#f8f9fa',
          borderColor: theme?.dark ? '#333333' : '#dee2e6' }
      ]}>
        <Text style={[
          styles.emptyMapText,
          { color: theme?.dark ? '#FFFFFF' : '#212529' }
        ]}>
          {getLabel('selectTrain') ?? 'Select a train to view tracking information'}
        </Text>
      </View>
    );
  }, [selectedTrain, theme, useMapView, routeStations, trainLocation]);

  const renderEmptyList = useCallback(() => {
    return (
      <View style={[
        styles.emptyList,
        { 
          backgroundColor: theme?.dark ? '#222222' : '#f8f9fa',
          borderColor: theme?.dark ? '#333333' : '#dee2e6'
        }
      ]}>
        <Text style={[
          styles.emptyListText,
          { color: theme?.dark ? '#FFFFFF' : '#212529' }
        ]}>
          {getLabel('noActiveTrains') ?? 'No active trains available'}
        </Text>
        <TouchableOpacity
          style={[
            styles.refreshButtonEmpty,
            { backgroundColor: theme?.dark ? '#333333' : theme?.primary ?? '#007bff' }
          ]}
          onPress={onRefresh}
        >
          <Text style={[
            styles.refreshButtonText,
            { color: theme?.dark ? '#FFFFFF' : '#FFFFFF' }
          ]}>
            {getLabel('refresh') ?? 'Refresh'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }, [theme, getLabel, onRefresh]);

  // Toggle between map view and schematic view
  const toggleViewType = () => {
    setUseMapView(!useMapView);
  };

  if (loading) {
    return (
      <SafeAreaView style={[
        styles.safeArea, 
        { backgroundColor: theme?.dark ? theme?.background ?? '#000000' : theme?.background ?? '#FFFFFF' }
      ]}>
        {Platform.OS === 'ios' ? (
          <StatusBar
            barStyle={theme?.dark ? 'light-content' : 'dark-content'}
          />
        ) : (
          <StatusBar
            barStyle={theme?.dark ? 'light-content' : 'dark-content'}
            backgroundColor={theme?.dark ? theme?.background ?? '#000000' : theme?.background ?? '#FFFFFF'}
          />
        )}
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme?.primary ?? '#007bff'} />
          <Text style={[
            styles.loadingText, 
            { color: theme?.dark ? theme?.text ?? '#FFFFFF' : theme?.text ?? '#212121' }
          ]}>
            {getLabel('loading') ?? 'Loading train data...'}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[
      styles.safeArea, 
      { backgroundColor: theme?.dark ? theme?.background ?? '#000000' : theme?.background ?? '#FFFFFF' }
    ]}>
      {Platform.OS === 'ios' ? (
        <StatusBar
          barStyle={theme?.dark ? 'light-content' : 'dark-content'}
        />
      ) : (
        <StatusBar
          barStyle={theme?.dark ? 'light-content' : 'dark-content'}
          backgroundColor={theme?.dark ? theme?.background ?? '#000000' : theme?.background ?? '#FFFFFF'}
        />
      )}
      <View style={[styles.header, { 
        backgroundColor: "#007bff",
        paddingTop: Platform.OS === 'ios' ? StatusBar.currentHeight + 10 : 15
      }]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons 
            name="arrow-back" 
            size={24} 
            color="#ffffff"
          />
        </TouchableOpacity>
        <Text style={[
          styles.headerTitle, 
          { color: "#ffffff" }
        ]}>
          {getLabel('liveTrainTracking') ?? 'Live Train Tracking'}
        </Text>
        <TouchableOpacity
          style={styles.viewToggle}
          onPress={toggleViewType}
        >
          <Ionicons 
            name={useMapView ? "list" : "map"} 
            size={24} 
            color="#ffffff"
          />
        </TouchableOpacity>
      </View>

      {renderHeader()}
      
      <FlatList
        data={trainData}
        renderItem={renderTrainCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme?.primary ?? '#007bff']}
            tintColor={theme?.primary ?? '#007bff'}
          />
        }
        ListEmptyComponent={renderEmptyList}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 120, // Extra padding at bottom for better scrolling
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  viewToggle: {
    padding: 8,
  },
  sectionHeaderContainer: {
    marginTop: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 10,
  },
  trainCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  trainIconContainer: {
    marginRight: 16,
    justifyContent: 'center',
  },
  trainIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trainInfo: {
    flex: 1,
  },
  trainName: {
    fontSize: 16,
    fontWeight: '600',
  },
  trainNumber: {
    fontSize: 14,
    marginBottom: 4,
  },
  routeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stationText: {
    fontSize: 14,
  },
  arrowIcon: {
    marginHorizontal: 4,
  },
  statusContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  arrivalTime: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  emptyList: {
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginTop: 16,
  },
  emptyListText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  refreshButtonEmpty: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  refreshButtonText: {
    fontWeight: 'bold',
  },
  mapContainer: {
    width: '100%',
    aspectRatio: 1.2,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#dee2e6',
    backgroundColor: '#f8f9fa'
  },
  emptyMapArea: {
    width: '100%',
    aspectRatio: 1.2,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  emptyMapText: {
    textAlign: 'center',
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  routeInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    marginTop: 16,
  },
  routeColumn: {
    alignItems: 'center',
  },
  routeLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  routeStation: {
    fontSize: 16,
    fontWeight: '600',
  },
  routeSeparator: {
    marginHorizontal: 12,
  },
  routeSeparatorDot: {
    fontSize: 24,
  },
});

export default TrainTrackingScreen;
