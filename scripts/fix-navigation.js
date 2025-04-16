/**
 * Script to fix navigation issues and convert from Expo Router to React Navigation
 */
const fs = require('fs');
const path = require('path');

// Create necessary directories if they don't exist
const mkdirIfNotExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Created directory: ${dirPath}`);
  }
};

// Copy train logo from app assets to src assets
try {
  mkdirIfNotExists(path.join(__dirname, '../src/assets'));
  
  // Copy icon to train_logo.png in src/assets
  fs.copyFileSync(
    path.join(__dirname, '../assets/images/icon.png'),
    path.join(__dirname, '../src/assets/train_logo.png')
  );
  console.log('Copied train logo to src/assets');
} catch (error) {
  console.error('Error copying train logo:', error);
}

console.log('Navigation fix completed successfully!');
