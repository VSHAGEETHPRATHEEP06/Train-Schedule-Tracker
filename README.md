# Train Schedule Tracker App

A React Native mobile application for tracking train schedules, booking tickets, and managing your journey.

## Features

This application includes the following key features:

- **User Authentication**: Login and registration system with form validation
- **Train Search**: Search for trains between stations with filtering and sorting options
- **Train Details**: View comprehensive information about trains including schedules, fares, and amenities
- **Booking System**: Book train tickets with passenger information and payment (simulated)
- **Booking Management**: View, manage, and track your bookings
- **Favorites**: Save your favorite trains for quick access
- **User Profile**: Manage your profile information and preferences
- **Settings**: Configure app preferences, notifications, and more

## Technical Implementation

The application is built using the following technologies and implementations:

- **React Native & Expo**: For cross-platform mobile development
- **React Navigation**: For screen navigation with stack and tab navigators
- **Formik & Yup**: For form handling and validation
- **AsyncStorage**: For local data persistence
- **Custom Components**: Reusable UI components with proper styling
- **MVC Architecture**: Organized code structure with Models, Views, and Controllers
- **Memory Management**: Efficient data handling and storage with AsyncStorage
- **Responsive Design**: UI that adapts to different screen sizes

## Project Structure

The project follows an organized folder structure:

```
src/
├── assets/        # Images, fonts, and other static resources
├── components/    # Reusable UI components
├── config/        # Configuration files (themes, constants)
├── context/       # React Context providers
├── hooks/         # Custom React hooks
├── models/        # Data models and types
├── navigation/    # Navigation configuration
├── screens/       # Application screens/views
├── services/      # API and data services
├── styles/        # Global styles
└── utils/         # Utility functions
```

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npx expo start
   ```
4. Open the app on your device using Expo Go or run on a simulator/emulator:
   - Press `i` for iOS Simulator
   - Press `a` for Android Emulator

## Screen Navigation

The app includes the following main screens:

1. Splash Screen: Initial loading screen
2. Onboarding Screens: Introduction to the app features
3. Login/Register Screens: User authentication
4. Home Screen: Main dashboard with search functionality
5. Search Results Screen: Train search results
6. Train Detail Screen: Detailed information about a selected train
7. Booking Screen: Ticket booking form
8. Booking Confirmation Screen: Confirmation after successful booking
9. My Bookings Screen: List of all user bookings
10. Profile Screen: User profile and settings
11. Favorites Screen: User's favorite trains
12. Settings Screen: App configuration options

## Data Persistence

The app uses AsyncStorage for data persistence with the following key data entities:

- User profile information
- Train bookings
- Favorite trains
- Recent searches
- App settings

## Acknowledgements

This project was developed as part of a mobile application development assignment, focusing on implementing essential React Native concepts, navigation patterns, form handling, and data persistence techniques.
