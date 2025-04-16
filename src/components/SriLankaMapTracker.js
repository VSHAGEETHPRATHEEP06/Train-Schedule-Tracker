import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import Svg, { Circle, Line, Rect, Text as SvgText } from 'react-native-svg';
import { useTheme } from '../context/ThemeContext';
import SriLankaMapSvg from './SriLankaMapSvg';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Predefined stations with their locations on the map
const trainStations = {
  'Colombo Fort': { x: 95, y: 205 },
  'Maradana': { x: 102, y: 200 },
  'Ragama': { x: 90, y: 180 },
  'Gampaha': { x: 85, y: 160 },
  'Veyangoda': { x: 95, y: 140 },
  'Polgahawela': { x: 90, y: 120 },
  'Kurunegala': { x: 80, y: 100 },
  'Anuradhapura': { x: 95, y: 70 },
  'Vavuniya': { x: 110, y: 40 },
  'Jaffna': { x: 120, y: 20 },
  'Kandy': { x: 120, y: 130 },
  'Matale': { x: 125, y: 110 },
  'Badulla': { x: 150, y: 140 },
  'Nanu Oya': { x: 135, y: 135 },
  'Hatton': { x: 125, y: 145 },
  'Nanuoya': { x: 135, y: 135 },
  'Haputale': { x: 145, y: 145 },
  'Ella': { x: 150, y: 150 },
  'Demodara': { x: 155, y: 155 },
  'Galle': { x: 110, y: 240 },
  'Matara': { x: 125, y: 250 },
  'Beliatta': { x: 130, y: 255 },
  'Wewurukannala': { x: 135, y: 260 },
  'Hambantota': { x: 150, y: 255 },
  'Batticaloa': { x: 170, y: 120 },
  'Trincomalee': { x: 155, y: 80 }
};

// Define the main train lines
const trainLines = [
  // Main Line (Colombo to Badulla)
  { 
    stations: ['Colombo Fort', 'Maradana', 'Ragama', 'Gampaha', 'Veyangoda', 
               'Polgahawela', 'Kandy', 'Nanu Oya', 'Haputale', 'Ella', 'Demodara', 'Badulla'],
    color: '#ff6b6b' // Red color for main line
  },
  // Northern Line (Colombo to Jaffna)
  { 
    stations: ['Colombo Fort', 'Maradana', 'Ragama', 'Gampaha', 'Veyangoda', 
               'Polgahawela', 'Kurunegala', 'Anuradhapura', 'Vavuniya', 'Jaffna'],
    color: '#4d96ff' // Blue color for northern line
  },
  // Coastal Line (Colombo to Matara)
  { 
    stations: ['Colombo Fort', 'Galle', 'Matara', 'Beliatta', 'Wewurukannala', 'Hambantota'],
    color: '#5eead4' // Teal color for coastal line
  },
  // Eastern Line (Colombo to Batticaloa)
  { 
    stations: ['Colombo Fort', 'Maradana', 'Ragama', 'Gampaha', 'Veyangoda', 
               'Polgahawela', 'Kandy', 'Batticaloa'],
    color: '#ffda6b' // Yellow color for eastern line
  },
  // Trincomalee Line
  { 
    stations: ['Colombo Fort', 'Maradana', 'Ragama', 'Gampaha', 'Veyangoda', 
               'Polgahawela', 'Anuradhapura', 'Trincomalee'],
    color: '#a78bfa' // Purple color for trincomalee line
  }
];

const { width } = Dimensions.get('window');
const mapWidth = width - 40; // Account for some padding
const mapHeight = mapWidth * 1.35; // Maintain aspect ratio

const SriLankaMapTracker = ({ trainData, getLabel }) => {
  const { theme } = useTheme();
  const isDarkMode = theme?.dark;
  const [currentPosition, setCurrentPosition] = useState(null);
  const [route, setRoute] = useState([]);
  
  useEffect(() => {
    if (trainData && trainData.route) {
      const stations = trainData.route
        .filter(station => trainStations[station.name])
        .map(station => ({
          name: station.name,
          position: trainStations[station.name]
        }));
      
      setRoute(stations);
      
      // Find the current station in the route
      const currentStationIndex = trainData.route.findIndex(
        station => station.name === trainData.currentStation
      );
      
      if (currentStationIndex !== -1 && trainStations[trainData.currentStation]) {
        setCurrentPosition(trainStations[trainData.currentStation]);
      } else {
        setCurrentPosition(null);
      }
    } else {
      setRoute([]);
      setCurrentPosition(null);
    }
  }, [trainData]);
  
  // Get the source and destination stations
  const sourceStation = trainData?.route?.[0]?.name || '';
  const destinationStation = trainData?.route?.[trainData?.route.length - 1]?.name || '';
  
  // Determine the train's route color based on the train number
  const getTrainLineColor = () => {
    if (!trainData) return '#ff6b6b'; // Default to main line color
    
    const trainNumber = trainData.trainNumber || '';
    
    // Determine color based on train number prefix
    // This is a simplified example
    if (trainNumber.startsWith('E')) {
      return '#ffda6b'; // Eastern Line
    } else if (trainNumber.startsWith('N')) {
      return '#4d96ff'; // Northern Line
    } else if (trainNumber.startsWith('C')) {
      return '#5eead4'; // Coastal Line
    } else if (trainNumber.startsWith('T')) {
      return '#a78bfa'; // Trincomalee Line
    } else {
      return '#ff6b6b'; // Main Line
    }
  };
  
  const trainColor = getTrainLineColor();
  
  return (
    <View style={styles.container}>
      {/* Map Background */}
      <View style={[
        styles.mapBackground, 
        { 
          backgroundColor: isDarkMode ? '#1e1e1e' : '#e9ecef',
          borderColor: isDarkMode ? '#333333' : '#ced4da'
        }
      ]}>
        {/* Island shape */}
        <SriLankaMapSvg
          width={mapWidth}
          height={mapHeight}
          fill={isDarkMode ? '#333333' : '#dde1e4'}
          stroke={isDarkMode ? '#555555' : '#ced4da'}
          strokeWidth={1}
        />
        
        {/* Route Lines */}
        <Svg 
          width={mapWidth} 
          height={mapHeight} 
          style={styles.routeOverlay}
        >
          {/* Show all main train lines with lower opacity */}
          {trainLines.map((line, lineIndex) => {
            return line.stations.map((station, index) => {
              if (index < line.stations.length - 1) {
                const start = trainStations[station];
                const end = trainStations[line.stations[index + 1]];
                
                if (start && end) {
                  return (
                    <Line
                      key={`${lineIndex}-${index}`}
                      x1={start.x}
                      y1={start.y}
                      x2={end.x}
                      y2={end.y}
                      stroke={line.color}
                      strokeWidth={2}
                      opacity={0.3}
                    />
                  );
                }
              }
              return null;
            });
          })}
          
          {/* Show the active route with full opacity */}
          {route.map((station, index) => {
            if (index < route.length - 1) {
              const nextStation = route[index + 1];
              return (
                <Line
                  key={`route-${index}`}
                  x1={station.position.x}
                  y1={station.position.y}
                  x2={nextStation.position.x}
                  y2={nextStation.position.y}
                  stroke={trainColor}
                  strokeWidth={4}
                />
              );
            }
            return null;
          })}
          
          {/* Draw all stations */}
          {route.map((station, index) => {
            // Only show station names for start, end, and some key intermediate stations
            const isKeyStation = index === 0 || index === route.length - 1 || 
              index % Math.max(1, Math.floor(route.length / 5)) === 0;
            
            // Calculate text position and background
            const stationX = station.position.x;
            const stationY = station.position.y;
            
            // Alternate text positions to avoid overlapping
            const textOffsetX = index % 2 === 0 ? 10 : -30;
            const textOffsetY = index % 3 === 0 ? -10 : 14;
            
            return (
              <React.Fragment key={`station-group-${index}`}>
                {/* Station circle */}
                <Circle
                  cx={stationX}
                  cy={stationY}
                  r={index === 0 || index === route.length - 1 ? 6 : 4}
                  fill={index === 0 || index === route.length - 1 ? trainColor : (isDarkMode ? '#ffffff' : '#212529')}
                  strokeWidth={index === 0 || index === route.length - 1 ? 2 : 0}
                  stroke={isDarkMode ? '#ffffff' : '#000000'}
                />
                
                {/* Only show text for key stations to avoid cluttering */}
                {isKeyStation && (
                  <>
                    {/* Text background for better readability */}
                    <Rect
                      x={stationX + textOffsetX - 4}
                      y={stationY + textOffsetY - 10}
                      width={station.name.length * 5.5 + 8}
                      height={14}
                      fill={isDarkMode ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.8)'}
                      rx={4}
                      ry={4}
                    />
                    
                    {/* Station name */}
                    <SvgText
                      x={stationX + textOffsetX}
                      y={stationY + textOffsetY}
                      fill={isDarkMode ? '#ffffff' : '#000000'}
                      fontSize="11"
                      fontWeight="bold"
                    >
                      {station.name}
                    </SvgText>
                  </>
                )}
              </React.Fragment>
            );
          })}
          
          {/* Draw current position */}
          {currentPosition && (
            <Circle
              cx={currentPosition.x}
              cy={currentPosition.y}
              r={8}
              fill={trainColor}
              stroke={isDarkMode ? '#ffffff' : '#ffffff'}
              strokeWidth={2}
            />
          )}
        </Svg>
      </View>
      
      {/* Route Information */}
      <View style={[
        styles.routeInfoContainer,
        { backgroundColor: isDarkMode ? '#212529' : '#f8f9fa' }
      ]}>
        <View style={styles.routeColumn}>
          <Text style={[
            styles.routeLabel,
            { color: isDarkMode ? '#BBBBBB' : '#6c757d' }
          ]}>
            {getLabel ? getLabel('from') : 'From'}
          </Text>
          <Text style={[
            styles.routeStation,
            { color: isDarkMode ? '#FFFFFF' : '#212529' }
          ]}>
            {sourceStation}
          </Text>
        </View>
        
        <View style={styles.routeSeparator}>
          <Text style={[
            styles.routeSeparatorDot,
            { color: isDarkMode ? '#AAAAAA' : '#6c757d' }
          ]}>•</Text>
        </View>
        
        <View style={styles.routeColumn}>
          <Text style={[
            styles.routeLabel,
            { color: isDarkMode ? '#BBBBBB' : '#6c757d' }
          ]}>
            {getLabel ? getLabel('to') : 'To'}
          </Text>
          <Text style={[
            styles.routeStation,
            { color: isDarkMode ? '#FFFFFF' : '#212529' }
          ]}>
            {destinationStation}
          </Text>
        </View>
      </View>
      
      {/* Current location and arrival information */}
      {currentPosition && (
        <View style={[
          styles.locationInfoContainer,
          { 
            backgroundColor: isDarkMode ? '#1e1e1e' : '#f8f9fa',
            borderColor: isDarkMode ? '#333333' : '#dee2e6'
          }
        ]}>
          <View style={styles.locationInfoRow}>
            <View style={styles.locationInfoColumn}>
              <Text style={[
                styles.locationLabel,
                { color: isDarkMode ? '#BBBBBB' : '#6c757d' }
              ]}>
                {getLabel ? getLabel('currentLocation') : 'Current Location'}
              </Text>
              <View style={styles.stationDisplay}>
                <Text style={[
                  styles.stationName,
                  { color: isDarkMode ? '#FFFFFF' : '#212529' }
                ]}>
                  {trainData.currentStation || sourceStation} 
                  <Ionicons 
                    name="arrow-forward" 
                    size={12} 
                    color={isDarkMode ? '#FFFFFF' : '#212529'} 
                  /> 
                  {trainData.nextStation || destinationStation}
                </Text>
              </View>
            </View>
            
            <View style={styles.locationInfoColumn}>
              <Text style={[
                styles.locationLabel,
                { color: isDarkMode ? '#BBBBBB' : '#6c757d' }
              ]}>
                {getLabel ? getLabel('nextArrival') : 'Next Arrival'}
              </Text>
              <Text style={[
                styles.arrivalTime,
                { color: '#28a745' }
              ]}>
                {trainData.arrivalTime || '10 min'}
              </Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    width: '100%'
  },
  mapBackground: {
    width: mapWidth,
    height: mapHeight,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    padding: 10,
    overflow: 'hidden'
  },
  routeOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  routeInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 15,
    paddingHorizontal: 10,
    marginTop: 10,
    borderRadius: 8
  },
  routeColumn: {
    alignItems: 'center',
  },
  routeLabel: {
    fontSize: 14,
    marginBottom: 5,
  },
  routeStation: {
    fontSize: 16,
    fontWeight: '600',
  },
  routeSeparator: {
    marginHorizontal: 20,
  },
  routeSeparatorDot: {
    fontSize: 24,
  },
  locationInfoContainer: {
    width: '100%',
    borderRadius: 8,
    padding: 15,
    marginTop: 10,
    borderWidth: 1
  },
  locationInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationInfoColumn: {
    alignItems: 'flex-start',
  },
  locationLabel: {
    fontSize: 14,
    marginBottom: 5,
  },
  stationDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stationName: {
    fontSize: 16,
    fontWeight: '600',
  },
  arrivalTime: {
    fontSize: 16,
    fontWeight: '600',
  }
});

export default SriLankaMapTracker;
