import { Train, Station } from '../models/TrainModel';
import StorageService from './StorageService';
import { sriLankaTrains, sriLankaStations, sriLankaTrainSchedules } from '../data/sriLankaTrainData';

/**
 * Service to handle train data operations
 * This is a mock service that simulates API calls
 */
class TrainService {
  /**
   * Initialize the service with mock data
   */
  async initialize() {
    // First initialize the StorageService to handle data migration
    await StorageService.initialize();
    
    const existingTrains = await StorageService.getTrains();
    const existingStations = await StorageService.getStations();

    // Always reload with fresh Sri Lankan train data
    await StorageService.saveTrains(this.getMockTrains());
    await StorageService.saveStations(this.getMockStations());
  }

  /**
   * Get all available trains
   */
  async getAllTrains() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return StorageService.getTrains();
  }

  /**
   * Search for trains between source and destination
   */
  async searchTrains(source, destination, date) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const trains = await StorageService.getTrains();
    
    // Save the search to recent searches
    await StorageService.saveRecentSearch({
      source,
      destination,
      date,
      timestamp: new Date().toISOString()
    });

    // Filter trains based on source and destination
    return trains.filter(
      train => 
        train.source.toLowerCase() === source.toLowerCase() && 
        train.destination.toLowerCase() === destination.toLowerCase()
    );
  }

  /**
   * Get train details by ID
   */
  async getTrainById(id) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const trains = await StorageService.getTrains();
    return trains.find(train => train.id === id);
  }

  /**
   * Get all stations
   */
  async getAllStations() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return StorageService.getStations();
  }

  /**
   * Book a train ticket
   */
  async bookTicket(bookingDetails) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Generate a booking ID
    const booking = {
      ...bookingDetails,
      id: 'BK' + Date.now(),
      bookingDate: new Date().toISOString(),
      status: 'Confirmed'
    };
    
    // Save the booking
    await StorageService.saveBooking(booking);
    return booking;
  }

  /**
   * Create mock train data
   */
  getMockTrains() {
    // Use Sri Lankan train data instead of mock data
    return sriLankaTrains.map(train => {
      return new Train(
        train.id,
        train.name,
        train.number,
        train.source,
        train.destination,
        train.departureTime,
        train.arrivalTime,
        train.duration,
        train.distance,
        train.fare, // Now passing the entire fare object with all classes
        train.amenities,
        train.status,
        train.type, // Add type
        train.frequency // Add frequency
      );
    });
  }
  
  /**
   * Create mock station data
   */
  getMockStations() {
    return sriLankaStations.map(station => {
      return new Station(
        station.id,
        station.name,
        station.code,
        station.city,
        station.state,
        station.address
      );
    });
  }
}

export default new TrainService();
