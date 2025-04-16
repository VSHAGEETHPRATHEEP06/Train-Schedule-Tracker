/**
 * Database Updater Utility
 * This script helps with manually updating the train database
 * with latest fare information from the Sri Lanka Railways
 */

import StorageService from '../services/StorageService';
import TrainService from '../services/TrainService';
import { sriLankaTrains } from '../data/sriLankaTrainData';

/**
 * Updates the train database with the latest fare information
 * @returns {Promise<boolean>} - Success status
 */
export const updateTrainDatabase = async () => {
  try {
    console.log('Starting train database update...');
    
    // Step 1: Reset the database to clear existing data
    const resetSuccess = await StorageService.resetDatabase();
    if (!resetSuccess) {
      throw new Error('Failed to reset database');
    }
    
    // Step 2: Save the updated train data
    await TrainService.saveTrains(sriLankaTrains);
    
    // Step 3: Re-initialize the TrainService to refresh any cached data
    await TrainService.initialize();
    
    console.log('Train database update completed successfully');
    return true;
  } catch (error) {
    console.error('Error updating train database:', error);
    return false;
  }
};

/**
 * Checks if the train database needs updating based on version comparison
 * @returns {Promise<boolean>} - Whether an update is needed
 */
export const checkDatabaseVersion = async () => {
  try {
    // Get the current version information
    const currentVersion = await StorageService.getData('DATABASE_VERSION');
    
    // If no version exists or it's older than the new version, update is needed
    // Using ISO date format for versioning (YYYY-MM-DD)
    const latestVersion = '2024-04-18'; // Update this when fare data changes
    
    if (!currentVersion || currentVersion < latestVersion) {
      console.log(`Database update required. Current: ${currentVersion || 'None'}, Latest: ${latestVersion}`);
      return true;
    }
    
    console.log('Database is up to date');
    return false;
  } catch (error) {
    console.error('Error checking database version:', error);
    return false;
  }
};

/**
 * Updates the database version after a successful update
 * @param {string} version - The version to set
 * @returns {Promise<boolean>} - Success status
 */
export const updateDatabaseVersion = async (version = '2024-04-18') => {
  try {
    await StorageService.storeData('DATABASE_VERSION', version);
    console.log(`Database version updated to ${version}`);
    return true;
  } catch (error) {
    console.error('Error updating database version:', error);
    return false;
  }
};

export default {
  updateTrainDatabase,
  checkDatabaseVersion,
  updateDatabaseVersion
};
