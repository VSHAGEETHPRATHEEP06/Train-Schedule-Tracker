import { TrainLocation, TrainRoute } from '../models/TrainLocationModel';
import StorageService from './StorageService';
import TrainService from './TrainService';
import { EventRegister } from 'react-native-event-listeners';

/**
 * Service to handle train location tracking
 * Simulates real-time train movement and position updates 
 */
class TrainLocationService {
  constructor() {
    this.activeTrains = new Map(); // Map of trainId -> TrainLocation
    this.routes = new Map(); // Map of routeId -> TrainRoute
    this.updateInterval = null;
    
    // Expose model classes for external use
    this.TrainLocation = TrainLocation;
    this.TrainRoute = TrainRoute;
  }

  /**
   * Initialize the service
   */
  async initialize() {
    // Create initial routes based on train data
    await this.initializeRoutes();
    
    // Start the location update simulation
    this.startLocationUpdates();
    
    return true;
  }

  /**
   * Initialize route data from train data
   */
  async initializeRoutes() {
    const trains = await TrainService.getAllTrains();
    const stations = await TrainService.getAllStations();
    
    // Create routes for each train
    for (const train of trains) {
      // Create a unique route ID based on source and destination
      const routeId = `${train.source}-${train.destination}`;
      
      // Skip if route already exists
      if (this.routes.has(routeId)) continue;
      
      // Create simulated route stations
      // In a real app, this would be fetched from a backend API
      const routeStations = this.generateRouteStations(train, stations);
      
      // Create route object
      const route = new TrainRoute(
        routeId,
        `${train.source} to ${train.destination}`,
        routeStations,
        train.distance,
        this.getDurationInMinutes(train.duration)
      );
      
      this.routes.set(routeId, route);
    }
  }

  /**
   * Start the location update simulation
   */
  startLocationUpdates() {
    // Update every 30 seconds to simulate train movement
    this.updateInterval = setInterval(() => {
      this.updateAllTrainLocations();
    }, 30000);
    
    // Initial update
    this.updateAllTrainLocations();
  }

  /**
   * Stop location updates
   */
  stopLocationUpdates() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }

  /**
   * Update locations for all active trains
   */
  async updateAllTrainLocations() {
    const trains = await TrainService.getAllTrains();
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    
    // Format current time as HH:MM
    const currentTime = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
    
    for (const train of trains) {
      // Create a unique route ID based on source and destination
      const routeId = `${train.source}-${train.destination}`;
      const route = this.routes.get(routeId);
      
      if (!route) continue;
      
      // Check if train should be active based on departure and arrival times
      const [depHour, depMinute] = train.departureTime.split(':').map(num => parseInt(num, 10));
      const [arrHour, arrMinute] = train.arrivalTime.split(':').map(num => parseInt(num, 10));
      
      const depTime = new Date();
      depTime.setHours(depHour, depMinute, 0, 0);
      
      const arrTime = new Date();
      arrTime.setHours(arrHour, arrMinute, 0, 0);
      
      // Handle overnight trains
      if (arrTime < depTime) {
        arrTime.setDate(arrTime.getDate() + 1);
      }
      
      // Determine if train is currently active
      const isActive = now >= depTime && now <= arrTime;
      
      // If train is not active and not already tracked, skip it
      if (!isActive && !this.activeTrains.has(train.id)) continue;
      
      // If train journey is complete, remove from active trains
      if (now > arrTime) {
        if (this.activeTrains.has(train.id)) {
          this.activeTrains.delete(train.id);
        }
        continue;
      }
      
      // Calculate train position as a percentage of the journey
      const journeyDuration = arrTime - depTime;
      const elapsedTime = now - depTime;
      const journeyPercentage = Math.min(100, Math.max(0, (elapsedTime / journeyDuration) * 100));
      
      // Find current position between stations
      const { lastStation, nextStation, lastTime, nextTime } = this.getStationPositionInfo(route, journeyPercentage);
      
      // Create or update train location
      const trainLocation = new TrainLocation(
        train.id,
        train.number,
        lastStation,
        nextStation,
        lastTime,
        nextTime,
        journeyPercentage,
        train.status,
        route.getStationNames(),
        new Date().toISOString()
      );
      
      this.activeTrains.set(train.id, trainLocation);
    }
    
    // Notify listeners that locations have been updated
    this.notifyLocationUpdate();
  }

  /**
   * Get station position info based on journey percentage
   */
  getStationPositionInfo(route, journeyPercentage) {
    const stations = route.stations;
    
    // For 0%, use first station
    if (journeyPercentage === 0) {
      return {
        lastStation: stations[0].name,
        nextStation: stations[1]?.name || stations[0].name,
        lastTime: stations[0].departureTime,
        nextTime: stations[1]?.arrivalTime || stations[0].departureTime
      };
    }
    
    // For 100%, use last station
    if (journeyPercentage === 100) {
      const lastIndex = stations.length - 1;
      return {
        lastStation: stations[lastIndex - 1]?.name || stations[lastIndex].name,
        nextStation: stations[lastIndex].name,
        lastTime: stations[lastIndex - 1]?.departureTime || stations[lastIndex].arrivalTime,
        nextTime: stations[lastIndex].arrivalTime
      };
    }
    
    // Calculate which segment the train is in
    const stationCount = stations.length;
    const segmentPercentage = 100 / (stationCount - 1);
    const segmentIndex = Math.floor(journeyPercentage / segmentPercentage);
    
    // Ensure index is within bounds
    const safeIndex = Math.min(segmentIndex, stationCount - 2);
    
    return {
      lastStation: stations[safeIndex].name,
      nextStation: stations[safeIndex + 1].name,
      lastTime: stations[safeIndex].departureTime,
      nextTime: stations[safeIndex + 1].arrivalTime
    };
  }

  /**
   * Get all active train locations
   */
  getActiveTrainLocations() {
    return Array.from(this.activeTrains.values());
  }

  /**
   * Get train location by ID
   */
  getTrainLocationById(trainId) {
    return this.activeTrains.get(trainId) || null;
  }

  /**
   * Get route by ID
   */
  getRouteById(routeId) {
    return this.routes.get(routeId) || null;
  }

  /**
   * Get route for a train
   */
  getRouteForTrain(trainId) {
    const train = this.activeTrains.get(trainId);
    if (!train) return null;
    
    const trains = TrainService.getAllTrains();
    const trainData = trains.find(t => t.id === trainId);
    if (!trainData) return null;
    
    const routeId = `${trainData.source}-${trainData.destination}`;
    return this.routes.get(routeId) || null;
  }

  /**
   * Notify listeners that train locations have been updated
   */
  notifyLocationUpdate() {
    // Use React Native EventRegister instead of DOM events
    EventRegister.emit('trainLocationsUpdated', { 
      locations: this.getActiveTrainLocations() 
    });
  }

  /**
   * Generate simulated route stations from train data
   */
  generateRouteStations(train, allStations) {
    // Find source and destination stations
    const sourceStation = allStations.find(s => s.name === train.source);
    const destStation = allStations.find(s => s.name === train.destination);
    
    if (!sourceStation || !destStation) {
      return [];
    }

    // Parse train duration to calculate time between stations
    const durationMinutes = this.getDurationInMinutes(train.duration);
    
    // Generate route with intermediate stations
    // For a real app, this would be fetched from a backend API with real data
    
    // Create a list of stations between source and destination
    // Based on the train's route name, pick appropriate intermediate stations
    let intermediateStations = [];
    
    // Colombo-Negombo route (from the example image)
    if (train.source === 'Colombo Fort' && train.destination === 'Negombo') {
      intermediateStations = [
        'Kudahakapola',
        'Alawathupitya',
        'Seeduwa',
        'Liyanagemulla',
        'Katunayake',
        'Katunayake',
        'Kumarakanda',
        'Kurane',
        'Ragama',
        'Ja-Ela',
        'Thudalla',
        'Kudahakapola',
        'Alawathupitiya',
        'Ederamu Ia'
      ];
    }
    // Colombo-Kandy route
    else if (train.source === 'Colombo Fort' && train.destination === 'Kandy') {
      intermediateStations = [
        'Maradana',
        'Ragama',
        'Ganemulla',
        'Gampaha',
        'Veyangoda',
        'Mirigama',
        'Ambepussa',
        'Polgahawela',
        'Rambukkana',
        'Kadigamuwa',
        'Balana',
        'Pilimatalawa',
        'Peradeniya'
      ];
    }
    // Default case - generate generic stations
    else {
      // Generate a reasonable number of intermediate stations based on distance
      const stationCount = Math.max(5, Math.floor(train.distance / 30));
      
      for (let i = 1; i <= stationCount; i++) {
        intermediateStations.push(`Station ${i}`);
      }
    }
    
    // Calculate times for each station
    const avgTimePerStation = durationMinutes / (intermediateStations.length + 1);
    const stations = [];
    
    // Add source station
    const [depHour, depMinute] = train.departureTime.split(':').map(num => parseInt(num, 10));
    stations.push({
      name: sourceStation.name,
      code: sourceStation.code,
      arrivalTime: train.departureTime, // Arrival and departure are the same for the first station
      departureTime: train.departureTime
    });
    
    // Add intermediate stations with calculated times
    let currentMinutes = depHour * 60 + depMinute;
    
    for (let i = 0; i < intermediateStations.length; i++) {
      currentMinutes += avgTimePerStation;
      
      const stationHour = Math.floor(currentMinutes / 60) % 24;
      const stationMinute = Math.floor(currentMinutes % 60);
      
      const timeString = `${stationHour.toString().padStart(2, '0')}:${stationMinute.toString().padStart(2, '0')}`;
      
      // For intermediate stations, arrival is 2 minutes before departure
      const arrivalTime = this.adjustTime(timeString, -2);
      
      stations.push({
        name: intermediateStations[i],
        code: intermediateStations[i].substring(0, 3).toUpperCase(),
        arrivalTime: arrivalTime,
        departureTime: timeString
      });
    }
    
    // Add destination station
    stations.push({
      name: destStation.name,
      code: destStation.code,
      arrivalTime: train.arrivalTime,
      departureTime: train.arrivalTime // Arrival and departure are the same for the last station
    });
    
    return stations;
  }

  /**
   * Convert duration string (e.g., "2h 30m") to minutes
   */
  getDurationInMinutes(durationStr) {
    const hours = durationStr.match(/(\d+)h/);
    const minutes = durationStr.match(/(\d+)m/);
    
    let totalMinutes = 0;
    if (hours) totalMinutes += parseInt(hours[1], 10) * 60;
    if (minutes) totalMinutes += parseInt(minutes[1], 10);
    
    return totalMinutes;
  }

  /**
   * Adjust time by given minutes
   */
  adjustTime(timeString, minutesToAdd) {
    const [hours, minutes] = timeString.split(':').map(num => parseInt(num, 10));
    
    let newMinutes = hours * 60 + minutes + minutesToAdd;
    if (newMinutes < 0) newMinutes += 24 * 60;
    
    const newHours = Math.floor(newMinutes / 60) % 24;
    const newMins = newMinutes % 60;
    
    return `${newHours.toString().padStart(2, '0')}:${newMins.toString().padStart(2, '0')}`;
  }
}

export default new TrainLocationService();
