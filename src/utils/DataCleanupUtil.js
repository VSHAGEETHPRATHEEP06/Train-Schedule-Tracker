/**
 * Data Cleanup Utility
 * 
 * This utility helps clean up and reset the train data to ensure
 * only the latest Sri Lankan Railways information is displayed.
 */

import StorageService from '../services/StorageService';
import TrainService from '../services/TrainService';
import { sriLankaTrains } from '../data/sriLankaTrainData';

/**
 * Clears existing train data and repopulates with the latest
 * Sri Lankan Railways information
 */
export const resetTrainData = async () => {
  try {
    console.log('Purging all existing train data...');
    // Use the comprehensive purging method to ensure all data is reset
    await StorageService.purgeAllData();
    
    console.log('Storing fresh Sri Lankan train data...');
    // Save the updated Sri Lankan train data
    await StorageService.saveTrains(TrainService.getMockTrains());
    
    // Save station data
    await StorageService.saveStations(TrainService.getMockStations());
    
    return true;
  } catch (error) {
    console.error('Error resetting train data:', error);
    return false;
  }
};

export default {
  resetTrainData
};
