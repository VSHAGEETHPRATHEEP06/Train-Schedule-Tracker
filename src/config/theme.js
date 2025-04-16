// Theme configuration for the Sri Lankan Train Schedule Tracker app
export const COLORS = {
  // Light theme
  light: {
    primary: '#007AFF',     // Blue for primary actions
    secondary: '#FF6B6B',   // Red accent
    tertiary: '#FFD166',    // Yellow accent
    background: '#F9F9F9',  // Light background
    cardBackground: '#F9F9F9',  // Alias for background
    card: '#FFFFFF',        // White card background
    text: '#212121',        // Dark text
    textPrimary: '#212121', // Alias for text
    textSecondary: '#757575', // Alias for subtext
    subtext: '#757575',     // Gray text
    border: '#E0E0E0',      // Light border
    notification: '#FF6B6B',// Red notification
    success: '#4CAF50',     // Green success
    error: '#F44336',       // Red error
    warning: '#FFC107',     // Yellow warning
    info: '#2196F3',        // Blue info
    inputBackground: '#E0E0E0', // Light gray input background
    buttonBackground: '#E0E0E0', // Light gray button background
    buttonAlt: '#0056b3',     // Alternative button color
    dark: false             // Theme identifier
  },
  // Dark theme
  dark: {
    primary: '#007AFF',     // Blue for primary actions
    secondary: '#FF6B6B',   // Red accent
    tertiary: '#FFD166',    // Yellow accent
    background: '#000000',  // Black background
    cardBackground: '#000000',  // Alias for background
    card: '#121212',        // Dark card background
    text: '#FFFFFF',        // White text
    textPrimary: '#FFFFFF', // Alias for text
    textSecondary: '#AAAAAA', // Alias for subtext
    subtext: '#AAAAAA',     // Light gray text
    border: '#333333',      // Dark border
    notification: '#FF6B6B',// Red notification
    success: '#4CAF50',     // Green success
    error: '#F44336',       // Red error
    warning: '#FFC107',     // Yellow warning
    info: '#2196F3',        // Blue info
    inputBackground: '#333333', // Dark gray input background
    buttonBackground: '#333333', // Dark gray button background
    buttonAlt: '#2196F3',     // Alternative button color
    dark: true              // Theme identifier
  },
  // Common colors that don't change between themes
  primary: '#007AFF',
};

export const SIZES = {
  base: 8,
  small: 12,
  font: 14,
  medium: 16,
  large: 18,
  xlarge: 24,
  xxlarge: 32,
};

export const FONTS = {
  regular: 'System',
  medium: 'System',
  bold: 'System',
};

export const SPACING = {
  xs: 4,
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
  xxl: 40,
};

export const SHADOWS = {
  small: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 12,
  },
};

export default {
  COLORS,
  SIZES,
  FONTS,
  SPACING,
  SHADOWS,
};
