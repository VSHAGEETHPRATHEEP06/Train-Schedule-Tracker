/**
 * Test Database Reset Utility
 * 
 * This file contains utility functions to test the database reset 
 * and update functionality. It's useful for development and debugging.
 */

import { updateTrainDatabase, updateDatabaseVersion } from './DatabaseUpdater';
import StorageService from '../services/StorageService';

/**
 * Test the database reset functionality
 * @returns {Promise<void>}
 */
export const testDatabaseReset = async () => {
  console.log('========== TEST DATABASE RESET ==========');
  
  try {
    // Check current database state
    const currentTrains = await StorageService.getData('TRAINS');
    console.log(`Current train count: ${currentTrains ? currentTrains.length : 0}`);
    
    if (currentTrains && currentTrains.length > 0) {
      // Display a few sample trains for verification
      console.log('Sample trains before reset:');
      
      for (let i = 0; i < Math.min(3, currentTrains.length); i++) {
        const train = currentTrains[i];
        console.log(`- ${train.name} (${train.id}): ${JSON.stringify(train.fare)}`);
      }
    }
    
    // Perform the database reset
    console.log('\nResetting database...');
    const resetSuccess = await updateTrainDatabase();
    
    if (resetSuccess) {
      // Update the database version
      await updateDatabaseVersion();
      console.log('Database reset successful!');
      
      // Check the updated database state
      const updatedTrains = await StorageService.getData('TRAINS');
      console.log(`Updated train count: ${updatedTrains ? updatedTrains.length : 0}`);
      
      if (updatedTrains && updatedTrains.length > 0) {
        // Display a few sample trains for verification
        console.log('Sample trains after reset:');
        
        for (let i = 0; i < Math.min(3, updatedTrains.length); i++) {
          const train = updatedTrains[i];
          console.log(`- ${train.name} (${train.id}): ${JSON.stringify(train.fare)}`);
        }
      }
    } else {
      console.error('Database reset failed!');
    }
  } catch (error) {
    console.error('Error during database reset test:', error);
  }
  
  console.log('========== TEST COMPLETED ==========');
};

export default {
  testDatabaseReset,
};
