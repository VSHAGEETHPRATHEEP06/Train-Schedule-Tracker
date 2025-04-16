import React, { createContext, useState, useEffect, useContext, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Supported currencies
export const CURRENCIES = {
  LKR: 'LKR', // Sri Lankan Rupee (default)
  USD: 'USD', // US Dollar
  EUR: 'EUR', // Euro
  GBP: 'GBP', // British Pound
  INR: 'INR'  // Indian Rupee
};

// Currency symbols
export const CURRENCY_SYMBOLS = {
  [CURRENCIES.LKR]: 'Rs',
  [CURRENCIES.USD]: '$',
  [CURRENCIES.EUR]: '€',
  [CURRENCIES.GBP]: '£',
  [CURRENCIES.INR]: '₹'
};

// Currency labels
export const CURRENCY_LABELS = {
  [CURRENCIES.LKR]: 'Sri Lankan Rupee',
  [CURRENCIES.USD]: 'US Dollar',
  [CURRENCIES.EUR]: 'Euro',
  [CURRENCIES.GBP]: 'British Pound',
  [CURRENCIES.INR]: 'Indian Rupee'
};

// Default currency
const DEFAULT_CURRENCY = CURRENCIES.LKR;

// Approximate exchange rates (as of April 2025)
const EXCHANGE_RATES = {
  [CURRENCIES.LKR]: 1,          // Base currency
  [CURRENCIES.USD]: 0.0033,     // 1 LKR ≈ 0.0033 USD
  [CURRENCIES.EUR]: 0.0030,     // 1 LKR ≈ 0.0030 EUR
  [CURRENCIES.GBP]: 0.0026,     // 1 LKR ≈ 0.0026 GBP
  [CURRENCIES.INR]: 0.27        // 1 LKR ≈ 0.27 INR
};

// Create currency context
const CurrencyContext = createContext();

// Currency provider component
export const CurrencyProvider = ({ children }) => {
  const [currentCurrency, setCurrentCurrency] = useState(DEFAULT_CURRENCY);
  const [isLoading, setIsLoading] = useState(true);

  // Load currency preference from storage on mount
  useEffect(() => {
    const loadCurrencyPreference = async () => {
      try {
        const storedCurrency = await AsyncStorage.getItem('currency_preference');
        if (storedCurrency !== null && Object.values(CURRENCIES).includes(storedCurrency)) {
          setCurrentCurrency(storedCurrency);
        }
      } catch (error) {
        console.error('Error loading currency preference:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCurrencyPreference();
  }, []);

  // Save currency preference to storage
  const saveCurrencyPreference = async (currency) => {
    try {
      await AsyncStorage.setItem('currency_preference', currency);
    } catch (error) {
      console.error('Error saving currency preference:', error);
    }
  };

  // Change currency function
  const changeCurrency = (currency) => {
    if (Object.values(CURRENCIES).includes(currency)) {
      setCurrentCurrency(currency);
      saveCurrencyPreference(currency);
    }
  };

  // Format price function with proper error handling
  const formatPrice = (amount, currency = currentCurrency) => {
    try {
      // Ensure amount is a number
      let numericAmount = 0;
      
      // Handle different input types (string, number, object)
      if (typeof amount === 'number') {
        numericAmount = amount;
      } else if (typeof amount === 'string') {
        // Remove non-numeric characters except decimal point
        numericAmount = Number(amount.replace(/[^0-9.]/g, ''));
      } else if (amount && typeof amount === 'object') {
        // If amount is an object with firstClass, secondClass, thirdClass properties
        // Default to secondClass fare
        numericAmount = amount.secondClass || 0;
      }
      
      // Handle invalid inputs
      if (isNaN(numericAmount)) {
        return `${CURRENCY_SYMBOLS[currency]}0.00`;
      }
      
      // Convert amount to requested currency
      const baseAmount = numericAmount; // Assuming amount is in LKR
      const targetRate = EXCHANGE_RATES[currency] || EXCHANGE_RATES[DEFAULT_CURRENCY];
      const convertedAmount = currency === CURRENCIES.LKR ? baseAmount : baseAmount * targetRate;
      
      // Use Intl.NumberFormat for consistent formatting across platforms
      const formatter = new Intl.NumberFormat(
        currency === CURRENCIES.USD ? 'en-US' :
        currency === CURRENCIES.EUR ? 'de-DE' : 
        currency === CURRENCIES.GBP ? 'en-GB' :
        currency === CURRENCIES.INR ? 'en-IN' : 'si-LK', 
        { 
          style: 'currency',
          currency: currency,
          currencyDisplay: 'symbol',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2 
        }
      );
      
      // Format using Intl if available and on iOS (better locale support)
      if (typeof Intl !== 'undefined' && Platform.OS === 'ios') {
        return formatter.format(convertedAmount);
      }
      
      // Fallback formatting for Android or if Intl is not available
      const formattedAmount = (Math.round(convertedAmount * 100) / 100).toFixed(2);
      const symbol = CURRENCY_SYMBOLS[currency] || CURRENCY_SYMBOLS[DEFAULT_CURRENCY];
      
      if (currency === CURRENCIES.LKR || currency === CURRENCIES.INR) {
        // For LKR and INR, show Symbol after the number (e.g., "1000 Rs")
        return `${formattedAmount} ${symbol}`;
      } else {
        // For other currencies, show Symbol before the number (e.g., "$10.00")
        return `${symbol}${formattedAmount}`;
      }
    } catch (error) {
      console.error('Error formatting price:', error);
      return `${CURRENCY_SYMBOLS[DEFAULT_CURRENCY]}0.00`;
    }
  };

  // Create a stable context value using useMemo
  const contextValue = useMemo(() => ({
    currentCurrency,
    changeCurrency,
    formatPrice,
    isLoading,
    supportedCurrencies: CURRENCIES,
    currencySymbols: CURRENCY_SYMBOLS,
    currencyLabels: CURRENCY_LABELS
  }), [currentCurrency, isLoading]);

  return (
    <CurrencyContext.Provider value={contextValue}>
      {children}
    </CurrencyContext.Provider>
  );
};

// Custom hook to use currency
export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};

export default CurrencyContext;
