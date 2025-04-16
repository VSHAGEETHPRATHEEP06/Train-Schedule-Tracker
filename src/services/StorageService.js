import AsyncStorage from '@react-native-async-storage/async-storage';

// Keys for storing different data types
const STORAGE_KEYS = {
  TRAINS: 'trains_data',
  STATIONS: 'stations_data',
  USER_PROFILE: 'user_profile',
  FAVORITES: 'user_favorites',
  BOOKINGS: 'user_bookings',
  RECENT_SEARCHES: 'recent_searches',
  APP_SETTINGS: 'app_settings',
};

/**
 * Service to handle data persistence using AsyncStorage
 */
class StorageService {
  /**
   * Store data in AsyncStorage
   * @param {string} key - Storage key
   * @param {any} value - Data to store
   * @returns {Promise<void>}
   */
  async storeData(key, value) {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
      return true;
    } catch (error) {
      console.error('Error storing data:', error);
      return false;
    }
  }

  /**
   * Retrieve data from AsyncStorage
   * @param {string} key - Storage key
   * @returns {Promise<any>} - Retrieved data
   */
  async getData(key) {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error('Error retrieving data:', error);
      return null;
    }
  }

  /**
   * Remove data from AsyncStorage
   * @param {string} key - Storage key
   * @returns {Promise<boolean>} - Success status
   */
  async removeData(key) {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error removing data:', error);
      return false;
    }
  }

  /**
   * Clear all data in AsyncStorage
   * @returns {Promise<boolean>} - Success status
   */
  async clearAll() {
    try {
      await AsyncStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing all data:', error);
      return false;
    }
  }

  // Specialized methods for train data
  async getTrains() {
    return this.getData(STORAGE_KEYS.TRAINS);
  }

  async saveTrains(trains) {
    return this.storeData(STORAGE_KEYS.TRAINS, trains);
  }

  // Specialized methods for station data
  async getStations() {
    return this.getData(STORAGE_KEYS.STATIONS);
  }

  async saveStations(stations) {
    return this.storeData(STORAGE_KEYS.STATIONS, stations);
  }

  // Specialized methods for user profile
  async getUserProfile() {
    return this.getData(STORAGE_KEYS.USER_PROFILE);
  }

  async saveUserProfile(userProfile) {
    return this.storeData(STORAGE_KEYS.USER_PROFILE, userProfile);
  }

  // Specialized methods for user favorites
  async getFavorites() {
    return this.getData(STORAGE_KEYS.FAVORITES);
  }

  async saveFavorite(train) {
    const favorites = await this.getFavorites() || [];
    // Check if already exists
    if (!favorites.some(fav => fav.id === train.id)) {
      favorites.push(train);
      return this.storeData(STORAGE_KEYS.FAVORITES, favorites);
    }
    return true;
  }

  async removeFavorite(trainId) {
    const favorites = await this.getFavorites() || [];
    const updatedFavorites = favorites.filter(fav => fav.id !== trainId);
    return this.storeData(STORAGE_KEYS.FAVORITES, updatedFavorites);
  }

  // Specialized methods for bookings
  async getBookings() {
    return this.getData(STORAGE_KEYS.BOOKINGS);
  }

  async saveBooking(booking) {
    const bookings = await this.getBookings() || [];
    bookings.push(booking);
    return this.storeData(STORAGE_KEYS.BOOKINGS, bookings);
  }

  async updateBooking(bookingId, updatedBooking) {
    const bookings = await this.getBookings() || [];
    const index = bookings.findIndex(booking => booking.id === bookingId);
    if (index !== -1) {
      bookings[index] = { ...bookings[index], ...updatedBooking };
      return this.storeData(STORAGE_KEYS.BOOKINGS, bookings);
    }
    return false;
  }

  // Recent searches methods
  async getRecentSearches() {
    return this.getData(STORAGE_KEYS.RECENT_SEARCHES);
  }

  async saveRecentSearch(search) {
    const searches = await this.getRecentSearches() || [];
    // Remove duplicate if exists
    const filteredSearches = searches.filter(
      s => !(s.source === search.source && s.destination === search.destination)
    );
    // Add new search at beginning (most recent)
    filteredSearches.unshift(search);
    // Keep only last 5 searches
    const recentSearches = filteredSearches.slice(0, 5);
    return this.storeData(STORAGE_KEYS.RECENT_SEARCHES, recentSearches);
  }

  // App settings methods
  async getAppSettings() {
    return this.getData(STORAGE_KEYS.APP_SETTINGS);
  }

  async saveAppSettings(settings) {
    return this.storeData(STORAGE_KEYS.APP_SETTINGS, settings);
  }

  /**
   * Migrate legacy data to new format
   * This ensures backward compatibility when updating from older versions
   * @returns {Promise<boolean>} - Success status
   */
  async migrateData() {
    try {
      // Migrate train data if needed
      const trains = await this.getTrains();
      if (trains) {
        const needsMigration = trains.some(train => 
          typeof train.fare === 'string' || 
          (typeof train.fare === 'number' && !train.type && !train.frequency)
        );
        
        if (needsMigration) {
          console.log('Migrating train data to new format...');
          const migratedTrains = trains.map(train => {
            // If fare is a string or number, convert to object format
            if (typeof train.fare === 'string' || typeof train.fare === 'number') {
              const baseFare = typeof train.fare === 'string' 
                ? parseInt(train.fare.replace(/[^\d]/g, '')) || 0
                : train.fare;
                
              return {
                ...train,
                fare: {
                  firstClass: Math.round(baseFare * 1.5),
                  secondClass: baseFare,
                  thirdClass: Math.round(baseFare * 0.8)
                },
                type: train.type || 'Express',
                frequency: train.frequency || 'Daily',
                distance: typeof train.distance === 'string' && train.distance.includes('km')
                  ? parseInt(train.distance.replace(/[^\d]/g, '')) || 0
                  : train.distance
              };
            }
            return train;
          });
          
          await this.saveTrains(migratedTrains);
        }
      }
      
      return true;
    } catch (error) {
      console.error('Error migrating data:', error);
      return false;
    }
  }
  
  // Initialize storage with migration check
  async initialize() {
    try {
      // Check if migration is needed and perform it
      await this.migrateData();
      return true;
    } catch (error) {
      console.error('Error initializing storage:', error);
      return false;
    }
  }

  /**
   * Reset database and load fresh data
   * This is primarily used when we need to completely refresh our data
   * @returns {Promise<boolean>} - Success status
   */
  async resetDatabase() {
    try {
      console.log('Resetting database...');
      
      // Clear trains, stations, favorites, and bookings
      await this.removeData(STORAGE_KEYS.TRAINS);
      await this.removeData(STORAGE_KEYS.STATIONS);
      await this.removeData(STORAGE_KEYS.FAVORITES);
      await this.removeData(STORAGE_KEYS.BOOKINGS);
      
      console.log('Database reset complete');
      return true;
    } catch (error) {
      console.error('Error resetting database:', error);
      return false;
    }
  }

  /**
   * Purge all train-related data
   * This is useful when we want to completely reset the app data
   */
  async purgeAllData() {
    try {
      // Remove all key train data
      await this.removeData(STORAGE_KEYS.TRAINS);
      await this.removeData(STORAGE_KEYS.STATIONS);
      await this.removeData(STORAGE_KEYS.FAVORITES);
      await this.removeData(STORAGE_KEYS.RECENT_SEARCHES);
      
      // We don't remove bookings to preserve user history
      
      console.log('All train data purged successfully');
      return true;
    } catch (error) {
      console.error('Error purging train data:', error);
      return false;
    }
  }
}

export default new StorageService();
export { STORAGE_KEYS };
