import React, { createContext, useState, useEffect, useContext, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Supported languages
export const LANGUAGES = {
  ENGLISH: 'en',
  TAMIL: 'ta',
  SINHALA: 'si'
};

// Language labels
export const LANGUAGE_LABELS = {
  [LANGUAGES.ENGLISH]: 'English',
  [LANGUAGES.TAMIL]: 'தமிழ்',
  [LANGUAGES.SINHALA]: 'සිංහල'
};

// Translations for different languages
const TRANSLATIONS = {
  [LANGUAGES.ENGLISH]: {
    // Home Screen
    hello: 'Hello',
    traveler: 'Traveler',
    whereToGo: 'Where would you like to go today?',
    findYourTrain: 'Find Your Train',
    from: 'From',
    to: 'To',
    date: 'Date',
    search: 'Search',
    popularTrains: 'Popular Trains',
    seeAll: 'See All',
    recentSearches: 'Recent Searches',
    welcomeToSriLankanRailways: 'Welcome to Sri Lankan Railways',
    bookTrainTickets: 'Book your train tickets easily and explore beautiful Sri Lanka by train',
    bookNow: 'Book Now',
    rideWithUs: 'Ride with Us',
    popularSriLankanTrains: 'Popular Sri Lankan Trains',
    
    // Train Details
    trainDetails: 'Train Details',
    trainNumber: 'Train Number',
    trainName: 'Train Name',
    trainType: 'Train Type',
    trainInformation: 'Train Information',
    frequency: 'Frequency',
    daily: 'Daily',
    status: 'Status',
    express: 'Express',
    journeyDetails: 'Journey Details',
    duration: 'Duration',
    distance: 'Distance',
    departureTime: 'Departure',
    arrivalTime: 'Arrival',
    amenities: 'Amenities',
    airConditioning: 'Air Conditioning',
    foodService: 'Food Service',
    wifi: 'WiFi',
    sleeper: 'Sleeper Berths',
    fareDetails: 'Fare Details',
    totalPrice: 'Total Price',
    trackTrain: 'Track Train',
    price: 'Price',
    perPerson: 'per person',
    class: 'Class',
    
    // Train Tracking
    liveTrainTracking: 'Live Train Tracking',
    selectTrainToTrack: 'Select a train to see its location',
    activeTrains: 'Active Trains',
    noActiveTrains: 'No active trains at the moment',
    refresh: 'Refresh',
    loading: 'Loading train data...',
    arrival: 'Arrival in',
    arrived: 'Arrived',
    noTrackingData: 'No tracking data available',
    
    // Booking Screen
    bookTicket: 'Book Ticket',
    passengerDetails: 'Passenger Details',
    addPassenger: 'Add Passenger',
    passengerName: 'Passenger Name',
    passengerAge: 'Age',
    gender: 'Gender',
    male: 'Male',
    female: 'Female',
    other: 'Other',
    contactDetails: 'Contact Details',
    contactName: 'Contact Name',
    contactPhone: 'Contact Phone',
    contactEmail: 'Contact Email',
    classSelection: 'Select Class',
    firstClass: '1st Class',
    secondClass: '2nd Class',
    thirdClass: '3rd Class',
    baseFare: 'Base Fare',
    serviceFee: 'Service Fee',
    tax: 'Tax',
    totalFare: 'Total Fare',
    paymentMethod: 'Payment Method',
    selectPaymentMethod: 'Select Payment Method',
    choosePaymentMethod: 'How would you like to pay?',
    creditDebitCard: 'Credit/Debit Card',
    visaMastercard: 'Visa, Mastercard, Amex',
    mobileWallet: 'Mobile Wallet',
    payViaMobileWallet: 'Pay via mobile wallet',
    netBanking: 'Net Banking',
    payViaNetBanking: 'Pay via internet banking',
    cashOnCollection: 'Cash on Collection',
    cardNumber: 'Card Number',
    expiryDate: 'Expiry Date',
    cvv: 'CVV',
    nameOnCard: 'Name on Card',
    enterNameOnCard: 'Enter name as on card',
    mobileNumber: 'Mobile Number',
    walletProvider: 'Wallet Provider',
    bankName: 'Bank Name',
    accountNumber: 'Account Number',
    proceedToPay: 'Proceed to Pay',
    bookingConfirmed: 'Booking Confirmed',
    
    // Settings
    settings: 'Settings',
    preferences: 'Preferences',
    profile: 'Profile',
    language: 'Language',
    languageDescription: 'Set your preferred language for the app',
    currency: 'Currency',
    currencyDescription: 'Set your preferred currency for fares',
    theme: 'Theme',
    darkMode: 'Dark Mode',
    notifications: 'Notifications',
    notificationsDescription: 'Receive updates about your bookings, promotions, and more',
    helpSupport: 'Help & Support',
    aboutUs: 'About Us',
    signOut: 'Sign Out',
    locationServices: 'Location Services',
    locationServicesDescription: 'Allow app to access your location for better service',
    recentSearchesDescription: 'Remember your recent train searches',
    
    // Errors
    trainNotFound: 'Train Not Found',
    trainNotFoundDescription: 'The requested train information could not be loaded. Please try again later.',
    
    // Other common terms
    cancel: 'Cancel',
    confirm: 'Confirm',
    back: 'Back',
    save: 'Save',
    edit: 'Edit',
    delete: 'Delete',
    success: 'Success',
    error: 'Error',
    loading: 'Loading',
    
    // Profile
    myProfile: 'My Profile',
    editProfile: 'Edit Profile',
    editProfilePicture: 'Edit Profile Picture',
    changePhoto: 'Change Photo',
    personalInformation: 'Personal Information',
    name: 'Name',
    email: 'Email',
    phone: 'Phone Number',
    enterName: 'Enter your name',
    enterEmail: 'Enter your email',
    enterPhone: 'Enter your phone number',
    saveChanges: 'Save Changes',
    profileUpdateSuccess: 'Your profile has been updated successfully',
    profileUpdateError: 'Failed to update profile. Please try again.',
    loadingProfile: 'Loading profile...',
    requiredFields: 'Required fields',
    
    // Notifications
    notifications: 'Notifications',
    noNotifications: 'No notifications yet',
    checkLater: 'Check back later for updates',
    markAllRead: 'Mark all as read',
    clearAll: 'Clear all',
    loadingNotifications: 'Loading notifications...',
    addSampleNotifications: 'Add Sample Notifications',
    deleteNotification: 'Delete Notification',
    deleteNotificationConfirm: 'Are you sure you want to delete this notification?',
    clearAllNotifications: 'Clear All Notifications',
    clearAllNotificationsConfirm: 'Are you sure you want to clear all notifications?',
    
    // Notification Settings
    notificationSettings: 'Notification Settings',
    enableNotifications: 'Enable Notifications',
    enableNotificationsDesc: 'Receive alerts about your trips and train updates',
    alertTypes: 'Alert Types',
    bookingAlerts: 'Booking Alerts',
    delayAlerts: 'Delay Alerts',
    priceAlerts: 'Price Alerts',
    systemAlerts: 'System Alerts',
    vibrate: 'Vibrate',
    sound: 'Sound',
    loadingSettings: 'Loading settings...',
    
    // Notification Types
    bookingConfirmation: 'Booking Confirmed',
    tripReminder: 'Trip Reminder',
    delayAlert: 'Delay Alert',
    priceChange: 'Price Change',
    
    // Common Terms that might be missing
    yes: 'Yes',
    no: 'No',
    ok: 'OK',
    done: 'Done',
    continue: 'Continue',
    tryAgain: 'Try Again',
    selectAll: 'Select All',
    deselectAll: 'Deselect All',
    apply: 'Apply',
    reset: 'Reset',
  },
  
  [LANGUAGES.TAMIL]: {
    // Home Screen
    hello: 'வணக்கம்',
    traveler: 'பயணி',
    whereToGo: 'இன்று எங்கே செல்ல விரும்புகிறீர்கள்?',
    findYourTrain: 'உங்கள் ரயிலைக் கண்டறியுங்கள்',
    from: 'இருந்து',
    to: 'வரை',
    date: 'தேதி',
    search: 'தேடல்',
    popularTrains: 'பிரபலமான ரயில்கள்',
    seeAll: 'அனைத்தையும் பார்க்க',
    recentSearches: 'சமீபத்திய தேடல்கள்',
    welcomeToSriLankanRailways: 'இலங்கை ரயில்வேக்கு வரவேற்கிறோம்',
    bookTrainTickets: 'எளிதாக ரயில் டிக்கெட்டுகளை முன்பதிவு செய்து, அழகான இலங்கையை ரயில் மூலம் சுற்றி பாருங்கள்',
    bookNow: 'இப்போதே முன்பதிவு செய்யுங்கள்',
    rideWithUs: 'எங்களுடன் பயணியுங்கள்',
    popularSriLankanTrains: 'பிரபலமான இலங்கை ரயில்கள்',
    
    // Train Details
    trainDetails: 'ரயில் விவரங்கள்',
    trainNumber: 'ரயில் எண்',
    trainName: 'ரயில் பெயர்',
    trainType: 'ரயில் வகை',
    trainInformation: 'ரயில் தகவல்',
    frequency: 'அதிர்வெண்',
    daily: 'தினசரி',
    status: 'நிலை',
    express: 'விரைவு',
    journeyDetails: 'பயண விவரங்கள்',
    duration: 'கால அளவு',
    distance: 'தூரம்',
    departureTime: 'புறப்படும் நேரம்',
    arrivalTime: 'வந்தடையும் நேரம்',
    amenities: 'வசதிகள்',
    airConditioning: 'குளிர்சாதனம்',
    foodService: 'உணவு சேவை',
    wifi: 'வைஃபை',
    sleeper: 'படுக்கை வசதி',
    fareDetails: 'கட்டண விவரங்கள்',
    totalPrice: 'மொத்த விலை',
    trackTrain: 'ரயில் கண்காணிப்பு',
    price: 'விலை',
    perPerson: 'ஒரு நபருக்கு',
    class: 'வகுப்பு',
    
    // Train Tracking
    liveTrainTracking: 'நேரலை ரயில் கண்காணிப்பு',
    selectTrainToTrack: 'அதன் இருப்பிடத்தைக் காண ஒரு ரயிலைத் தேர்ந்தெடுக்கவும்',
    activeTrains: 'செயலில் உள்ள ரயில்கள்',
    noActiveTrains: 'தற்போது செயலில் உள்ள ரயில்கள் இல்லை',
    refresh: 'புதுப்பி',
    loading: 'ரயில் தரவு ஏற்றப்படுகிறது...',
    arrival: 'வருகை',
    arrived: 'வந்துவிட்டது',
    noTrackingData: 'கண்காணிப்பு தரவு எதுவும் இல்லை',
    
    // Booking Screen
    bookTicket: 'டிக்கெட் முன்பதிவு செய்ய',
    passengerDetails: 'பயணிகள் விவரங்கள்',
    addPassenger: 'பயணியை சேர்க்க',
    passengerName: 'பயணி பெயர்',
    passengerAge: 'வயது',
    gender: 'பாலினம்',
    male: 'ஆண்',
    female: 'பெண்',
    other: 'மற்றவை',
    contactDetails: 'தொடர்பு விவரங்கள்',
    contactName: 'தொடர்பு பெயர்',
    contactPhone: 'தொடர்பு எண்',
    contactEmail: 'மின்னஞ்சல்',
    classSelection: 'வகுப்பைத் தேர்ந்தெடுக்கவும்',
    firstClass: 'முதல் வகுப்பு',
    secondClass: 'இரண்டாம் வகுப்பு', 
    thirdClass: 'மூன்றாம் வகுப்பு',
    baseFare: 'அடிப்படை கட்டணம்',
    serviceFee: 'சேவை கட்டணம்',
    tax: 'வரி',
    totalFare: 'மொத்த கட்டணம்',
    paymentMethod: 'கட்டண முறை',
    selectPaymentMethod: 'கட்டண முறையைத் தேர்ந்தெடுக்கவும்',
    choosePaymentMethod: 'எப்படி பணம் செலுத்த விரும்புகிறீர்கள்?',
    creditDebitCard: 'கிரெடிட்/டெபிட் கார்டு',
    visaMastercard: 'விசா, மாஸ்டர்கார்டு, அமெக்ஸ்',
    mobileWallet: 'மொபைல் வாலட்',
    payViaMobileWallet: 'மொபைல் வாலட் மூலம் கட்டணம் செலுத்துங்கள்',
    netBanking: 'நெட் பேங்கிங்',
    payViaNetBanking: 'இணைய வங்கி மூலம் கட்டணம் செலுத்துங்கள்',
    cashOnCollection: 'சேகரிப்பில் பணம்',
    cardNumber: 'கார்டு எண்',
    expiryDate: 'காலாவதி தேதி',
    cvv: 'CVV',
    nameOnCard: 'கார்டில் உள்ள பெயர்',
    enterNameOnCard: 'கார்டில் உள்ளபடி பெயரை உள்ளிடவும்',
    mobileNumber: 'மொபைல் எண்',
    walletProvider: 'வாலட் வழங்குநர்',
    bankName: 'வங்கி பெயர்',
    accountNumber: 'கணக்கு எண்',
    proceedToPay: 'கட்டணம் செலுத்த தொடரவும்',
    bookingConfirmed: 'முன்பதிவு உறுதி செய்யப்பட்டது',
    
    // Settings
    settings: 'அமைப்புகள்',
    preferences: 'விருப்பத்தேர்வுகள்',
    profile: 'சுயவிவரம்',
    language: 'மொழி',
    languageDescription: 'பயன்பாட்டிற்கான உங்கள் விருப்பமான மொழியை அமைக்கவும்',
    currency: 'நாணயம்',
    currencyDescription: 'கட்டணங்களுக்கான உங்கள் விருப்பமான நாணயத்தை அமைக்கவும்',
    theme: 'தீம்',
    darkMode: 'இருண்ட பயன்முறை',
    notifications: 'அறிவிப்புகள்',
    notificationsDescription: 'உங்கள் பதிவுகள், ஊக்கத்தூண்டுதல்கள் மற்றும் மேலும் பற்றிய தகவல்களைப் பெறுங்கள்',
    helpSupport: 'உதவி & ஆதரவு',
    aboutUs: 'எங்களை பற்றி',
    signOut: 'வெளியேறு',
    locationServices: 'இட சேவைகள்',
    locationServicesDescription: 'மேம்பட்ட சேவைக்காக பயன்பாட்டிற்கு உங்கள் இடத்தை அணுக அனுமதிக்கவும்',
    recentSearchesDescription: 'சமீபத்திய ரயில் தேடல்களை நினைவில் கொள்ளுங்கள்',
    
    // Errors
    trainNotFound: 'ரயில் கிடைக்கவில்லை',
    trainNotFoundDescription: 'கோரிய ரயில் தகவல்களை ஏற்ற முடியவில்லை. பின்னர் மீண்டும் முயற்சிக்கவும்.',
    
    // Other common terms
    cancel: 'ரத்து செய்',
    confirm: 'உறுதிப்படுத்து',
    back: 'பின்னால்',
    save: 'சேமி',
    edit: 'திருத்து',
    delete: 'நீக்கு',
    success: 'வெற்றி',
    error: 'பிழை',
    loading: 'ஏற்றுகிறது',
    
    // Profile
    myProfile: 'எனது சுயவிவரம்',
    editProfile: 'சுயவிவரத்தைத் திருத்து',
    editProfilePicture: 'சுயவிவர படத்தைத் திருத்து',
    changePhoto: 'புகைப்படத்தை மாற்று',
    personalInformation: 'தனிப்பட்ட தகவல்',
    name: 'பெயர்',
    email: 'மின்னஞ்சல்',
    phone: 'தொலைபேசி எண்',
    enterName: 'உங்கள் பெயரை உள்ளிடவும்',
    enterEmail: 'உங்கள் மின்னஞ்சலை உள்ளிடவும்',
    enterPhone: 'உங்கள் தொலைபேசி எண்ணை உள்ளிடவும்',
    saveChanges: 'மாற்றங்களைச் சேமி',
    profileUpdateSuccess: 'உங்கள் சுயவிவரம் வெற்றிகரமாக புதுப்பிக்கப்பட்டது',
    profileUpdateError: 'சுயவிவரத்தைப் புதுப்பிக்க முடியவில்லை. மீண்டும் முயற்சிக்கவும்.',
    loadingProfile: 'சுயவிவரம் ஏற்றப்படுகிறது...',
    requiredFields: 'தேவையான புலங்கள்',
    
    // Notifications
    notifications: 'அறிவிப்புகள்',
    noNotifications: 'இன்னும் அறிவிப்புகள் இல்லை',
    checkLater: 'புதுப்பிப்புகளுக்கு பின்னர் சரிபார்க்கவும்',
    markAllRead: 'அனைத்தையும் படித்ததாகக் குறி',
    clearAll: 'அனைத்தையும் அழி',
    loadingNotifications: 'அறிவிப்புகள் ஏற்றப்படுகின்றன...',
    addSampleNotifications: 'மாதிரி அறிவிப்புகளைச் சேர்க்கவும்',
    deleteNotification: 'அறிவிப்பை நீக்கு',
    deleteNotificationConfirm: 'இந்த அறிவிப்பை நிச்சயமாக நீக்க விரும்புகிறீர்களா?',
    clearAllNotifications: 'அனைத்து அறிவிப்புகளையும் அழி',
    clearAllNotificationsConfirm: 'அனைத்து அறிவிப்புகளையும் நிச்சயமாக அழிக்க விரும்புகிறீர்களா?',
    
    // Notification Settings
    notificationSettings: 'அறிவிப்பு அமைப்புகள்',
    enableNotifications: 'அறிவிப்புகளை இயக்கு',
    enableNotificationsDesc: 'உங்கள் பயணங்கள் மற்றும் ரயில் புதுப்பிப்புகள் பற்றிய எச்சரிக்கைகளைப் பெறுங்கள்',
    alertTypes: 'எச்சரிக்கை வகைகள்',
    bookingAlerts: 'முன்பதிவு எச்சரிக்கைகள்',
    delayAlerts: 'தாமத எச்சரிக்கைகள்',
    priceAlerts: 'விலை எச்சரிக்கைகள்',
    systemAlerts: 'அமைப்பு எச்சரிக்கைகள்',
    vibrate: 'அதிர்வு',
    sound: 'ஒலி',
    loadingSettings: 'அமைப்புகள் ஏற்றப்படுகின்றன...',
    
    // Notification Types
    bookingConfirmation: 'முன்பதிவு உறுதி செய்யப்பட்டது',
    tripReminder: 'பயண நினைவூட்டல்',
    delayAlert: 'தாமத எச்சரிக்கை',
    priceChange: 'விலை மாற்றம்',
    
    // Common Terms that might be missing
    yes: 'ஆம்',
    no: 'இல்லை',
    ok: 'சரி',
    done: 'முடிந்தது',
    continue: 'தொடர்க',
    tryAgain: 'மீண்டும் முயற்சி',
    selectAll: 'அனைத்தையும் தேர்ந்தெடு',
    deselectAll: 'தேர்வுநீக்கு',
    apply: 'பயன்படுத்து',
    reset: 'மீட்டமை',
  },
  
  [LANGUAGES.SINHALA]: {
    // Home Screen
    hello: 'ආයුබෝවන්',
    traveler: 'මගියා',
    whereToGo: 'අද ඔබට කොහේ යන්න අවශ්‍යද?',
    findYourTrain: 'ඔබේ දුම්රිය සොයන්න',
    from: 'සිට',
    to: 'දක්වා',
    date: 'දිනය',
    search: 'සොයන්න',
    popularTrains: 'ජනප්‍රිය දුම්රිය',
    seeAll: 'සියල්ල බලන්න',
    recentSearches: 'මෑත සෙවීම්',
    welcomeToSriLankanRailways: 'ශ්‍රී ලංකා දුම්රිය වෙත සාදරයෙන් පිළිගනිමු',
    bookTrainTickets: 'පහසුවෙන් දුම්රිය ටිකට්පත් වෙන්කරගෙන ලංකාවේ අලංකාර දර්ශන දුම්රියෙන් නරඹන්න',
    bookNow: 'දැන් වෙන්කරන්න',
    rideWithUs: 'අප සමඟ ගමන් කරන්න',
    popularSriLankanTrains: 'ජනප්‍රිය ශ්‍රී ලංකා දුම්රිය',
    
    // Train Details
    trainDetails: 'දුම්රිය විස්තර',
    trainNumber: 'දුම්රිය අංකය',
    trainName: 'දුම්රිය නම',
    trainType: 'දුම්රිය වර්ගය',
    trainInformation: 'දුම්රිය තොරතුරු',
    frequency: 'සංඛ්‍යාතය',
    daily: 'දෛනික',
    status: 'තත්වය',
    express: 'ඇක්ස්ප්‍රස්',
    journeyDetails: 'ගමන් විස්තර',
    duration: 'කාලය',
    distance: 'දුර',
    departureTime: 'පිටත්වීමේ වේලාව',
    arrivalTime: 'පැමිණෙන වේලාව',
    amenities: 'පහසුකම්',
    airConditioning: 'වායු සමීකරණය',
    foodService: 'ආහාර සේවාව',
    wifi: 'වයි-ෆයි',
    sleeper: 'නිදන පහසුකම්',
    fareDetails: 'ගාස්තු විස්තර',
    totalPrice: 'මුළු මිල',
    trackTrain: 'දුම්රිය ලුහුබැඳීම',
    price: 'මිල',
    perPerson: 'පුද්ගලයෙකුට',
    class: 'පන්තිය',
    
    // Train Tracking
    liveTrainTracking: 'සජීවී දුම්රිය ලුහුබැඳීම',
    selectTrainToTrack: 'එහි ස්ථානය බැලීමට දුම්රියක් තෝරන්න',
    activeTrains: 'ක්‍රියාකාරී දුම්රිය',
    noActiveTrains: 'මේ මොහොතේ ක්‍රියාකාරී දුම්රිය නැත',
    refresh: 'යළි පූරණය කරන්න',
    loading: 'දුම්රිය දත්ත පූරණය වෙමින්...',
    arrival: 'පැමිණීම',
    arrived: 'පැමිණ ඇත',
    noTrackingData: 'ලුහුබැඳීමේ දත්ත නොමැත',
    
    // Booking Screen
    bookTicket: 'ටිකට්පත වෙන් කරන්න',
    passengerDetails: 'මගී විස්තර',
    addPassenger: 'මගියා එක් කරන්න',
    passengerName: 'මගියාගේ නම',
    passengerAge: 'වයස',
    gender: 'ස්ත්‍රී පුරුෂ භාවය',
    male: 'පිරිමි',
    female: 'ගැහැණු',
    other: 'වෙනත්',
    contactDetails: 'සම්බන්ධ කරගැනීමේ විස්තර',
    contactName: 'සම්බන්ධ වන නම',
    contactPhone: 'දුරකථන අංකය',
    contactEmail: 'විද්‍යුත් තැපෑල',
    classSelection: 'පන්තිය තෝරන්න',
    firstClass: '1 වන පන්තිය',
    secondClass: '2 වන පන්තිය',
    thirdClass: '3 වන පන්තිය',
    baseFare: 'මූලික ගාස්තුව',
    serviceFee: 'සේවා ගාස්තුව',
    tax: 'බදු',
    totalFare: 'මුළු ගාස්තුව',
    paymentMethod: 'ගෙවීම් ක්‍රමය',
    selectPaymentMethod: 'ගෙවීම් ක්‍රමය තෝරන්න',
    choosePaymentMethod: 'ඔබ කෙසේ ගෙවීමට කැමතිද?',
    creditDebitCard: 'ක්‍රෙඩිට්/ඩෙබිට් කාඩ්',
    visaMastercard: 'විසා, මාස්ටර්කාඩ්, ඇමෙක්ස්',
    mobileWallet: 'ජංගම මුදල් පසුම්බිය',
    payViaMobileWallet: 'ජංගම මුදල් පසුම්බිය හරහා ගෙවන්න',
    netBanking: 'අන්තර්ජාල බැංකුකරණය',
    payViaNetBanking: 'අන්තර්ජාල බැංකුකරණය හරහා ගෙවන්න',
    cashOnCollection: 'එකතු කිරීමේදී මුදල්',
    cardNumber: 'කාඩ් අංකය',
    expiryDate: 'කල් ඉකුත් වන දිනය',
    cvv: 'CVV',
    nameOnCard: 'කාඩ් පතේ ඇති නම',
    enterNameOnCard: 'කාඩ් පතේ ඇති පරිදි නම ඇතුලත් කරන්න',
    mobileNumber: 'ජංගම දුරකථන අංකය',
    walletProvider: 'මුදල් පසුම්බි සපයන්නා',
    bankName: 'බැංකුවේ නම',
    accountNumber: 'ගිණුම් අංකය',
    proceedToPay: 'ගෙවීම සඳහා ඉදිරියට යන්න',
    bookingConfirmed: 'වෙන්කිරීම තහවුරු කර ඇත',
    
    // Settings
    settings: 'සැකසුම්',
    preferences: 'අභිරුචි',
    profile: 'පැතිකඩ',
    language: 'භාෂාව',
    languageDescription: 'යෙදුම සඳහා ඔබේ ප්‍රියතම භාෂාව සැකසීම',
    currency: 'මුදල්',
    currencyDescription: 'ගාස්තු සඳහා ඔබේ ප්‍රියතම මුදල් සැකසීම',
    theme: 'තේමාව',
    darkMode: 'අඳුරු මාදිලිය',
    notifications: 'දැනුම්දීම්',
    notificationsDescription: 'ඔබේ පත්වීම්, පොඩු ප්‍රචාරණ සහ තව බොහෝ දේ පිළිබඳ යාවත්කාලීන තොරතුරු ලබන්න',
    helpSupport: 'සහාය සහ උදව්',
    aboutUs: 'අප ගැන',
    signOut: 'පිටවීම',
    locationServices: 'ස්ථාන සේවා',
    locationServicesDescription: 'හොඳ සේවා සඳහා යෙදුමට ඔබේ ස්ථානය ප්‍රවේශ වීමට අවසර දෙන්න',
    recentSearchesDescription: 'සමීප දුම්රිය සෙවීම් මතක තබා ගන්න',
    
    // Errors
    trainNotFound: 'දුම්රිය හමු නොවීය',
    trainNotFoundDescription: 'ඉල්ලූ දුම්රිය තොරතුරු පූරණය කළ නොහැක. පසුව නැවත උත්සාහ කරන්න.',
    
    // Other common terms
    cancel: 'අවලංගු කරන්න',
    confirm: 'තහවුරු කරන්න',
    back: 'ආපසු',
    save: 'සුරකින්න',
    edit: 'සංස්කරණය කරන්න',
    delete: 'මකන්න',
    success: 'සාර්ථකයි',
    error: 'දෝෂය',
    loading: 'පූරණය වෙමින්',
    
    // Profile
    myProfile: 'මගේ පැතිකඩ',
    editProfile: 'පැතිකඩ සංස්කරණය කරන්න',
    editProfilePicture: 'පැතිකඩ පින්තූරය සංස්කරණය කරන්න',
    changePhoto: 'ඡායාරූපය වෙනස් කරන්න',
    personalInformation: 'පෞද්ගලික තොරතුරු',
    name: 'නම',
    email: 'ඊමේල්',
    phone: 'දුරකථන අංකය',
    enterName: 'ඔබේ නම ඇතුළත් කරන්න',
    enterEmail: 'ඔබේ ඊමේල් ඇතුළත් කරන්න',
    enterPhone: 'ඔබේ දුරකථන අංකය ඇතුළත් කරන්න',
    saveChanges: 'වෙනස්කම් සුරකින්න',
    profileUpdateSuccess: 'ඔබේ පැතිකඩ සාර්ථකව යාවත්කාලීන කර ඇත',
    profileUpdateError: 'පැතිකඩ යාවත්කාලීන කිරීමට අපොහොසත් විය. කරුණාකර නැවත උත්සාහ කරන්න.',
    loadingProfile: 'පැතිකඩ පූරණය වෙමින්...',
    requiredFields: 'අවශ්‍ය ක්ෂේත්‍ර',
    
    // Notifications
    notifications: 'දැනුම්දීම්',
    noNotifications: 'තවම දැනුම්දීම් නැත',
    checkLater: 'යාවත්කාලීන සඳහා පසුව පරීක්ෂා කරන්න',
    markAllRead: 'සියල්ල කියවූ ලෙස සලකුණු කරන්න',
    clearAll: 'සියල්ල හිස් කරන්න',
    loadingNotifications: 'දැනුම්දීම් පූරණය වෙමින්...',
    addSampleNotifications: 'සාම්පල දැනුම්දීම් එකතු කරන්න',
    deleteNotification: 'දැනුම්දීම මකන්න',
    deleteNotificationConfirm: 'ඔබට මෙම දැනුම්දීම මැකීමට අවශ්‍ය බව විශ්වාසද?',
    clearAllNotifications: 'සියලු දැනුම්දීම් හිස් කරන්න',
    clearAllNotificationsConfirm: 'සියලු දැනුම්දීම් නිශ්චිතව හිස් කිරීමට ඔබට අවශ්‍ය බව විශ්වාසද?',
    
    // Notification Settings
    notificationSettings: 'දැනුම්දීම් සැකසුම්',
    enableNotifications: 'දැනුම්දීම් සක්‍රීය කරන්න',
    enableNotificationsDesc: 'ඔබේ ගමන් ගැන සහ දුම්රිය යාවත්කාලීන කිරීම් පිළිබඳ ඇඟවීම් ලබා ගන්න',
    alertTypes: 'ඇඟවීම් වර්ග',
    bookingAlerts: 'වෙන්කිරීම් ඇඟවීම්',
    delayAlerts: 'ප්‍රමාද ඇඟවීම්',
    priceAlerts: 'මිල ඇඟවීම්',
    systemAlerts: 'පද්ධති ඇඟවීම්',
    vibrate: 'කම්පනය',
    sound: 'ශබ්දය',
    loadingSettings: 'සැකසුම් පූරණය වෙමින්...',
    
    // Notification Types
    bookingConfirmation: 'වෙන්කිරීම තහවුරු කරන ලදී',
    tripReminder: 'ගමන් සිහි කැඳවීම',
    delayAlert: 'ප්‍රමාද ඇඟවීම',
    priceChange: 'මිල වෙනස',
    
    // Common Terms that might be missing
    yes: 'ඔව්',
    no: 'නැත',
    ok: 'හරි',
    done: 'කළා',
    continue: 'ඉදිරියට',
    tryAgain: 'නැවත උත්සාහ කරන්න',
    selectAll: 'සියල්ල තෝරන්න',
    deselectAll: 'සියල්ල නොතෝරන්න',
    apply: 'යොදන්න',
    reset: 'යළි පිහිටුවන්න',
  }
};

// Default language
const DEFAULT_LANGUAGE = LANGUAGES.ENGLISH;

// Create language context
const LanguageContext = createContext();

// Language provider component
export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState(DEFAULT_LANGUAGE);
  const [isLoading, setIsLoading] = useState(true);

  // Load language preference from storage on mount
  useEffect(() => {
    const loadLanguagePreference = async () => {
      try {
        const storedLanguage = await AsyncStorage.getItem('language_preference');
        if (storedLanguage !== null && Object.values(LANGUAGES).includes(storedLanguage)) {
          setCurrentLanguage(storedLanguage);
        }
      } catch (error) {
        console.error('Error loading language preference:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadLanguagePreference();
  }, []);

  // Save language preference to storage
  const saveLanguagePreference = async (language) => {
    try {
      await AsyncStorage.setItem('language_preference', language);
    } catch (error) {
      console.error('Error saving language preference:', error);
    }
  };

  // Change language function
  const changeLanguage = (language) => {
    if (Object.values(LANGUAGES).includes(language)) {
      setCurrentLanguage(language);
      saveLanguagePreference(language);
    }
  };

  // Get translated label for a key
  const getLabel = (key, fallback) => {
    try {
      const translations = TRANSLATIONS[currentLanguage] || TRANSLATIONS[DEFAULT_LANGUAGE];
      return translations[key] || fallback || key;
    } catch (error) {
      console.warn(`Translation error for key: ${key}`, error);
      return fallback || key;
    }
  };

  // Create a stable context value using useMemo
  const contextValue = useMemo(() => ({
    currentLanguage,
    changeLanguage,
    isLoading,
    supportedLanguages: LANGUAGES,
    languageLabels: LANGUAGE_LABELS,
    getLabel
  }), [currentLanguage, isLoading]);

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use language
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageContext;
