import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  StatusBar,
  TextInput,
  ActivityIndicator,
  FlatList,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SIZES, SPACING } from '../config/theme';
import { useTheme } from '../context/ThemeContext';
import { useCurrency } from '../context/CurrencyContext';
import { useLanguage } from '../context/LanguageContext';
import TrainCard from '../components/TrainCard';
import Button from '../components/Button';
import TrainService from '../services/TrainService';
import StorageService from '../services/StorageService';
import { resetTrainData } from '../utils/DataCleanupUtil';

/**
 * HomeScreen - Main screen after login
 */
const HomeScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { formatPrice } = useCurrency();
  const { getLabel } = useLanguage();
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [popularTrains, setPopularTrains] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [searchForm, setSearchForm] = useState({
    source: '',
    destination: '',
    date: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
  });
  const [sourceOptions, setSourceOptions] = useState([]);
  const [destinationOptions, setDestinationOptions] = useState([]);
  const [showSourceOptions, setShowSourceOptions] = useState(false);
  const [showDestinationOptions, setShowDestinationOptions] = useState(false);
  const [favorites, setFavorites] = useState([]);

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Reset train data to ensure only Sri Lankan railways are displayed
        await resetTrainData();
        
        // Load user profile
        const userProfile = await StorageService.getUserProfile();
        if (userProfile && userProfile.name) {
          setUser(userProfile);
        } else {
          // If no profile exists or name is empty, fetch username from authentication service
          const authUser = await StorageService.getAuthUser();
          if (authUser && authUser.username) {
            setUser({ name: authUser.username });
            // Save this to user profile for future use
            await StorageService.saveUserProfile({ name: authUser.username });
          }
        }

        // Load popular trains from fresh Sri Lankan data
        const allTrains = await TrainService.getAllTrains();
        
        // Filter to ensure only Sri Lankan trains 
        const sriLankanTrains = allTrains.filter(train => 
          !train.name.includes('Indian') && 
          (train.name.includes('Menike') || 
           train.name.includes('Devi') || 
           train.name.includes('Kumari') ||
           train.name.includes('Express') ||
           train.name.includes('Mail'))
        );
        
        setPopularTrains(sriLankanTrains.slice(0, 5)); // Just take first 5 for demo

        // Load recent searches
        const searches = await StorageService.getRecentSearches() || [];
        setRecentSearches(searches);

        // Load favorite trains
        const favs = await StorageService.getFavorites() || [];
        setFavorites(favs);

        // Load stations for autocomplete
        const stations = await TrainService.getAllStations();
        setSourceOptions(stations.map(station => station.name));
        setDestinationOptions(stations.map(station => station.name));
      } catch (error) {
        console.error('Error loading home screen data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Handle search trains
  const handleSearch = () => {
    if (searchForm.source && searchForm.destination) {
      navigation.navigate('Search', searchForm);
    }
  };

  // Handle toggling a train as favorite
  const toggleFavorite = async (train) => {
    const isFavorite = favorites.some(fav => fav.id === train.id);
    
    if (isFavorite) {
      // Remove from favorites
      await StorageService.removeFavorite(train.id);
      setFavorites(favorites.filter(fav => fav.id !== train.id));
    } else {
      // Add to favorites
      await StorageService.saveFavorite(train);
      setFavorites([...favorites, train]);
    }
  };

  // Check if a train is in favorites
  const isTrainFavorite = (trainId) => {
    return favorites.some(fav => fav.id === trainId);
  };

  // Handle recent search selection
  const handleRecentSearchClick = (search) => {
    setSearchForm({
      source: search.source,
      destination: search.destination,
      date: search.date,
    });
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle="light-content" backgroundColor={theme.background} />
      
      {/* Header with greeting */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.greeting, { color: theme?.text ?? '#212529' }]}>
            {getLabel('hello')}, {user?.name || getLabel('traveler')}!
          </Text>
          <Text style={[styles.headerSubtitle, { color: theme?.textSecondary ?? '#6c757d' }]}>
            {getLabel('whereToGo')}
          </Text>
        </View>
        <TouchableOpacity 
          style={[styles.profileButton, { backgroundColor: theme?.cardBackground ?? '#f8f9fa' }]}
          onPress={() => navigation.navigate('ProfileTab')}
        >
          <Ionicons name="person-circle" size={36} color={theme?.primary ?? '#007bff'} />
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome Banner */}
        <View 
          style={[
            styles.welcomeBanner, 
            { backgroundColor: theme.primary }
          ]}
        >
          <View style={styles.bannerContent}>
            <Text style={[styles.bannerTitle, { color: theme.white }]}>
              Welcome to Sri Lankan Railways
            </Text>
            <Text style={[styles.bannerSubtitle, { color: theme.white }]}>
              Book your train tickets easily and explore beautiful Sri Lanka by train
            </Text>
            <TouchableOpacity 
              style={[styles.exploreButton, { backgroundColor: theme.white }]} 
              onPress={() => navigation.navigate('Search')}
            >
              <Text style={[styles.exploreButtonText, { color: theme.primary }]}>
                Book Now
              </Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.bannerImageContainer, { backgroundColor: theme.primaryLight }]}>
            <Ionicons name="train-outline" size={60} color={theme.white} />
            <Text style={[styles.bannerText, { color: theme.white }]}>
              Ride with Us
            </Text>
          </View>
        </View>
        
        {/* Search Form */}
        <View style={[styles.searchCard, { backgroundColor: theme.cardBackground, ...theme.shadows.large }]}>
          <Text style={[styles.searchTitle, { color: theme.text }]}>Find Your Train</Text>
          
          {/* Source station */}
          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>From</Text>
            <View style={styles.autocompleteContainer}>
              <TextInput
                style={[
                  styles.input, 
                  { 
                    backgroundColor: theme.background,
                    borderColor: theme.border,
                    color: theme.text 
                  }
                ]}
                placeholder="Enter source station"
                placeholderTextColor={theme.placeholder}
                value={searchForm.source}
                onChangeText={(text) => {
                  setSearchForm({ ...searchForm, source: text });
                  setShowSourceOptions(text.length > 0);
                }}
                onFocus={() => setShowSourceOptions(searchForm.source.length > 0)}
              />
              {showSourceOptions && (
                <ScrollView 
                  style={[
                    styles.optionsContainer, 
                    { 
                      backgroundColor: theme.background,
                      borderColor: theme.border 
                    }
                  ]}
                  keyboardShouldPersistTaps="always"
                  nestedScrollEnabled
                >
                  {sourceOptions
                    .filter(option => 
                      option.toLowerCase().includes(searchForm.source.toLowerCase())
                    )
                    .slice(0, 5)
                    .map((option, index) => (
                      <TouchableOpacity
                        key={index}
                        style={[
                          styles.optionItem, 
                          { 
                            borderBottomColor: theme.border,
                            backgroundColor: index % 2 === 0 ? theme.background : theme.cardBackground 
                          }
                        ]}
                        onPress={() => {
                          setSearchForm({ ...searchForm, source: option });
                          setShowSourceOptions(false);
                        }}
                      >
                        <Text style={{ color: theme.text }}>{option}</Text>
                      </TouchableOpacity>
                    ))
                  }
                </ScrollView>
              )}
            </View>
          </View>
          
          {/* Destination station */}
          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>To</Text>
            <View style={styles.autocompleteContainer}>
              <TextInput
                style={[
                  styles.input, 
                  { 
                    backgroundColor: theme.background,
                    borderColor: theme.border,
                    color: theme.text 
                  }
                ]}
                placeholder="Enter destination station"
                placeholderTextColor={theme.placeholder}
                value={searchForm.destination}
                onChangeText={(text) => {
                  setSearchForm({ ...searchForm, destination: text });
                  setShowDestinationOptions(text.length > 0);
                }}
                onFocus={() => setShowDestinationOptions(searchForm.destination.length > 0)}
              />
              {showDestinationOptions && (
                <ScrollView 
                  style={[
                    styles.optionsContainer, 
                    { 
                      backgroundColor: theme.background,
                      borderColor: theme.border 
                    }
                  ]}
                  keyboardShouldPersistTaps="always"
                  nestedScrollEnabled
                >
                  {destinationOptions
                    .filter(option => 
                      option.toLowerCase().includes(searchForm.destination.toLowerCase())
                    )
                    .slice(0, 5)
                    .map((option, index) => (
                      <TouchableOpacity
                        key={index}
                        style={[
                          styles.optionItem, 
                          { 
                            borderBottomColor: theme.border,
                            backgroundColor: index % 2 === 0 ? theme.background : theme.cardBackground 
                          }
                        ]}
                        onPress={() => {
                          setSearchForm({ ...searchForm, destination: option });
                          setShowDestinationOptions(false);
                        }}
                      >
                        <Text style={{ color: theme.text }}>{option}</Text>
                      </TouchableOpacity>
                    ))
                  }
                </ScrollView>
              )}
            </View>
          </View>
          
          {/* Date Picker (simplified for demo) */}
          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Date</Text>
            <TextInput
              style={[styles.input, { color: theme.text, backgroundColor: theme.inputBackground }]}
              placeholder="Select date"
              placeholderTextColor={theme.textSecondary}
              value={searchForm.date}
              onChangeText={(text) => setSearchForm({ ...searchForm, date: text })}
            />
          </View>
          
          {/* Search Button */}
          <Button
            title="Search Trains"
            onPress={handleSearch}
            style={styles.searchButton}
            variant="primary"
          />
        </View>
        
        {/* Recent Searches */}
        {recentSearches.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Recent Searches</Text>
              <TouchableOpacity>
                <Text style={[styles.seeAllText, { color: theme.primary }]}>See All</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.recentSearchesContainer}
            >
              {recentSearches.map((search, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={[styles.recentSearchItem, { backgroundColor: theme.cardBackground }]}
                  onPress={() => handleRecentSearchClick(search)}
                >
                  <View style={styles.recentSearchContent}>
                    <Ionicons name="time-outline" size={20} color={theme.primary} />
                    <View style={styles.recentSearchText}>
                      <Text style={[styles.recentSearchRoute, { color: theme.text }]}>
                        {search.source} to {search.destination}
                      </Text>
                      <Text style={[styles.recentSearchDate, { color: theme.textSecondary }]}>{search.date}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
        
        {/* Popular Trains */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Popular Sri Lankan Trains</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Search')}>
              <Text style={[styles.seeAllText, { color: theme.primary }]}>See All</Text>
            </TouchableOpacity>
          </View>
          
          {popularTrains.map((train) => (
            <TrainCard
              key={train.id}
              train={train}
              onPress={() => 
                navigation.navigate('TrainDetail', { 
                  trainId: train.id,
                  trainName: train.name
                })
              }
              onFavoritePress={() => toggleFavorite(train)}
              isFavorite={isTrainFavorite(train.id)}
              theme={theme}
              formatPrice={formatPrice}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingTop: StatusBar.currentHeight + 10,
    paddingBottom: 20,
    paddingHorizontal: SPACING.xl,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: SIZES.xlarge,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: SIZES.medium,
    opacity: 0.8,
  },
  profileButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  welcomeBanner: {
    borderRadius: 16,
    flexDirection: 'row',
    marginBottom: SPACING.m,
    overflow: 'hidden',
    height: 150,
  },
  bannerContent: {
    flex: 1,
    padding: SPACING.l,
    justifyContent: 'center',
  },
  bannerTitle: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    marginBottom: SPACING.xs,
  },
  bannerSubtitle: {
    fontSize: SIZES.small,
    opacity: 0.8,
    marginBottom: SPACING.m,
  },
  bannerImageContainer: {
    width: 120,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    padding: SPACING.s,
  },
  bannerText: {
    fontSize: SIZES.small,
    fontWeight: 'bold',
    marginTop: SPACING.xs,
    textAlign: 'center',
  },
  exploreButton: {
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.s,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  exploreButtonText: {
    fontSize: SIZES.small,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: SPACING.m,
  },
  searchCard: {
    borderRadius: 12,
    padding: SPACING.l,
    marginBottom: SPACING.m,
  },
  searchTitle: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    marginBottom: SPACING.m,
  },
  inputContainer: {
    marginBottom: SPACING.m,
  },
  inputLabel: {
    fontSize: SIZES.small,
    fontWeight: '500',
    marginBottom: SPACING.xs,
  },
  autocompleteContainer: {
    position: 'relative',
    zIndex: 1,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: SPACING.m,
    fontSize: SIZES.medium,
  },
  optionsContainer: {
    position: 'absolute',
    top: 48,
    left: 0,
    right: 0,
    borderWidth: 1,
    borderRadius: 8,
    maxHeight: 120,
    zIndex: 2,
  },
  optionItem: {
    padding: SPACING.m,
    borderBottomWidth: 1,
  },
  searchButton: {
    marginTop: SPACING.s,
    height: 50,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.s,
    paddingHorizontal: SPACING.xs,
  },
  sectionTitle: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
  },
  seeAllText: {
    fontSize: SIZES.small,
    fontWeight: '600',
  },
  recentSearchesContainer: {
    flexDirection: 'row',
    marginBottom: SPACING.m,
  },
  recentSearchItem: {
    borderRadius: 12,
    padding: SPACING.m,
    marginRight: SPACING.m,
    minWidth: 180,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recentSearchContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recentSearchText: {
    marginLeft: SPACING.s,
  },
  recentSearchRoute: {
    fontSize: SIZES.medium,
    fontWeight: '500',
  },
  recentSearchDate: {
    fontSize: SIZES.small,
    marginTop: 2,
  },
});

export default HomeScreen;
