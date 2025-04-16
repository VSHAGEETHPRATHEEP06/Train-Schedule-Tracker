import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  StatusBar
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { SIZES, SPACING } from '../config/theme';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useCurrency } from '../context/CurrencyContext';
import TrainCard from '../components/TrainCard';
import TrainService from '../services/TrainService';
import StorageService from '../services/StorageService';

/**
 * SearchScreen - Display search results for trains
 */
const SearchScreen = ({ route, navigation }) => {
  const { theme } = useTheme();
  const { getLabel } = useLanguage();
  const { formatPrice } = useCurrency();
  
  const [loading, setLoading] = useState(true);
  const [trains, setTrains] = useState([]);
  const [filteredTrains, setFilteredTrains] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [sortBy, setSortBy] = useState('departureTime'); // Options: departureTime, duration, price
  const [filterApplied, setFilterApplied] = useState(false);
  const [searchParams, setSearchParams] = useState({
    source: route.params?.source || '',
    destination: route.params?.destination || '',
    date: route.params?.date || new Date().toISOString().split('T')[0],
  });
  const [searchText, setSearchText] = useState('');

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load favorites
        const favs = await StorageService.getFavorites() || [];
        setFavorites(favs);

        // Search for trains
        if (searchParams.source && searchParams.destination) {
          const searchResults = await TrainService.searchTrains(
            searchParams.source,
            searchParams.destination,
            searchParams.date
          );
          setTrains(searchResults);
          setFilteredTrains(searchResults);
        } else {
          // If no search params, just load all trains
          const allTrains = await TrainService.getAllTrains();
          setTrains(allTrains);
          setFilteredTrains(allTrains);
        }
      } catch (error) {
        console.error('Error loading search data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [searchParams]);

  // Handle sorting trains
  const handleSort = (sortType) => {
    let sorted = [...filteredTrains];

    switch (sortType) {
      case 'departureTime':
        sorted.sort((a, b) => {
          const timeA = parseInt(a.departureTime.replace(':', ''));
          const timeB = parseInt(b.departureTime.replace(':', ''));
          return timeA - timeB;
        });
        break;
      case 'duration':
        sorted.sort((a, b) => {
          const durationA = parseInt(a.duration.match(/\d+/)[0]);
          const durationB = parseInt(b.duration.match(/\d+/)[0]);
          return durationA - durationB;
        });
        break;
      case 'price':
        sorted.sort((a, b) => {
          const priceA = parseInt(a.fare.replace(/[^\d]/g, ''));
          const priceB = parseInt(b.fare.replace(/[^\d]/g, ''));
          return priceA - priceB;
        });
        break;
      default:
        break;
    }

    setFilteredTrains(sorted);
    setSortBy(sortType);
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

  // Handle filter by train status
  const handleFilterByStatus = (status) => {
    if (!status) {
      setFilteredTrains(trains);
      setFilterApplied(false);
      return;
    }

    const filtered = trains.filter(train => 
      train.status.toLowerCase().includes(status.toLowerCase())
    );
    setFilteredTrains(filtered);
    setFilterApplied(true);
  };

  // Filter trains based on search text
  const filterTrainsByText = (text) => {
    setSearchText(text);
    if (!text) {
      setFilteredTrains(trains);
      return;
    }
    
    const filtered = trains.filter(train => {
      const searchTextLower = text.toLowerCase();
      const trainName = train.name || '';
      const trainNumber = train.trainNumber || '';
      
      return trainName.toLowerCase().includes(searchTextLower) || 
             trainNumber.toLowerCase().includes(searchTextLower);
    });
    setFilteredTrains(filtered);
  };

  // Render header with search info and filter options
  const renderHeader = () => (
    <View style={[styles.headerContainer, { backgroundColor: theme.cardBackground }]}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color={theme.text} />
      </TouchableOpacity>
      
      <View style={styles.searchSummary}>
        <Text style={[styles.routeText, { color: theme.text }]}>
          {searchParams.source} → {searchParams.destination}
        </Text>
        <Text style={[styles.dateText, { color: theme.textSecondary }]}>{searchParams.date}</Text>
      </View>
      
      {/* Search Input */}
      <View style={[styles.searchInputContainer, { backgroundColor: theme.inputBackground }]}>
        <Ionicons name="search" size={20} color={theme.textSecondary} />
        <TextInput
          style={[styles.searchInput, { color: theme.text }]}
          placeholder="Search by train name or number"
          placeholderTextColor={theme.textSecondary}
          value={searchText}
          onChangeText={filterTrainsByText}
        />
        {searchText ? (
          <TouchableOpacity onPress={() => filterTrainsByText('')}>
            <Ionicons name="close-circle" size={20} color={theme.textSecondary} />
          </TouchableOpacity>
        ) : null}
      </View>
      
      <Text style={[styles.resultsText, { color: theme.textSecondary }]}>
        {filteredTrains.length} {filteredTrains.length === 1 ? 'train' : 'trains'} found
      </Text>
      
      <View style={styles.filtersContainer}>
        <TouchableOpacity 
          style={[
            styles.filterButton,
            { borderColor: theme.border },
            sortBy === 'departureTime' && [styles.activeFilterButton, { backgroundColor: theme.primary + '30' }]
          ]}
          onPress={() => handleSort('departureTime')}
        >
          <Text style={[
            styles.filterButtonText,
            { color: theme.text },
            sortBy === 'departureTime' && [styles.activeFilterText, { color: theme.primary }]
          ]}>
            Departure
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.filterButton,
            { borderColor: theme.border },
            sortBy === 'duration' && [styles.activeFilterButton, { backgroundColor: theme.primary + '30' }]
          ]}
          onPress={() => handleSort('duration')}
        >
          <Text style={[
            styles.filterButtonText,
            { color: theme.text },
            sortBy === 'duration' && [styles.activeFilterText, { color: theme.primary }]
          ]}>
            Duration
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.filterButton,
            { borderColor: theme.border },
            sortBy === 'price' && [styles.activeFilterButton, { backgroundColor: theme.primary + '30' }]
          ]}
          onPress={() => handleSort('price')}
        >
          <Text style={[
            styles.filterButtonText,
            { color: theme.text },
            sortBy === 'price' && [styles.activeFilterText, { color: theme.primary }]
          ]}>
            Price
          </Text>
        </TouchableOpacity>
        
        <View style={styles.statusFilterContainer}>
          <TouchableOpacity 
            style={[
              styles.statusButton,
              { borderColor: theme.border },
              filterApplied && sortBy === 'on-time' && [styles.activeFilterButton, { backgroundColor: theme.success + '30' }]
            ]}
            onPress={() => {
              if (filterApplied && sortBy === 'on-time') {
                handleFilterByStatus('');
                setSortBy('departureTime');
              } else {
                handleFilterByStatus('On Time');
                setSortBy('on-time');
              }
            }}
          >
            <View style={styles.statusDot}>
              <View style={[styles.dot, { backgroundColor: theme.success }]} />
            </View>
            <Text style={[
              styles.statusText,
              { color: theme.text },
              filterApplied && sortBy === 'on-time' && { color: theme.success }
            ]}>
              On Time
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.statusButton,
              { borderColor: theme.border },
              filterApplied && sortBy === 'delayed' && [styles.activeFilterButton, { backgroundColor: theme.warning + '30' }]
            ]}
            onPress={() => {
              if (filterApplied && sortBy === 'delayed') {
                handleFilterByStatus('');
                setSortBy('departureTime');
              } else {
                handleFilterByStatus('Delayed');
                setSortBy('delayed');
              }
            }}
          >
            <View style={styles.statusDot}>
              <View style={[styles.dot, { backgroundColor: theme.warning }]} />
            </View>
            <Text style={[
              styles.statusText,
              { color: theme.text },
              filterApplied && sortBy === 'delayed' && { color: theme.warning }
            ]}>
              Delayed
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.statusButton,
              { borderColor: theme.border },
              filterApplied && sortBy === 'cancelled' && [styles.activeFilterButton, { backgroundColor: theme.error + '30' }]
            ]}
            onPress={() => {
              if (filterApplied && sortBy === 'cancelled') {
                handleFilterByStatus('');
                setSortBy('departureTime');
              } else {
                handleFilterByStatus('Cancelled');
                setSortBy('cancelled');
              }
            }}
          >
            <View style={styles.statusDot}>
              <View style={[styles.dot, { backgroundColor: theme.error }]} />
            </View>
            <Text style={[
              styles.statusText,
              { color: theme.text },
              filterApplied && sortBy === 'cancelled' && { color: theme.error }
            ]}>
              Cancelled
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  // Render empty results message
  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Text style={[styles.emptyText, { color: theme.textSecondary }]}>No trains found for this search</Text>
      <Text style={[styles.emptySubText, { color: theme.textSecondary }]}>Try adjusting your search criteria</Text>
      <TouchableOpacity 
        style={[styles.resetButton, { backgroundColor: theme.primary }]}
        onPress={() => {
          setFilteredTrains(trains);
          setFilterApplied(false);
          setSortBy('departureTime');
          setSearchText('');
        }}
      >
        <Text style={styles.resetButtonText}>Reset Filters</Text>
      </TouchableOpacity>
    </View>
  );

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
      {renderHeader()}
      
      <FlatList
        data={filteredTrains}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TrainCard
            train={item}
            onPress={() => 
              navigation.navigate('TrainDetail', { 
                trainId: item.id,
                trainName: item.name
              })
            }
            onFavoritePress={() => toggleFavorite(item)}
            isFavorite={isTrainFavorite(item.id)}
            theme={theme}
            formatPrice={formatPrice}
          />
        )}
        contentContainerStyle={[styles.listContainer, { paddingBottom: 100 }]}
        ListEmptyComponent={renderEmptyList}
        showsVerticalScrollIndicator={false}
      />
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
  backButton: {
    position: 'absolute',
    top: SPACING.s,
    left: SPACING.s,
    padding: SPACING.xs,
    zIndex: 10,
  },
  headerContainer: {
    padding: SPACING.m,
    borderBottomWidth: 1,
    borderRadius: 0,
  },
  searchSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.m,
    marginTop: SPACING.m,
  },
  routeText: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
  },
  dateText: {
    fontSize: SIZES.medium,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: SPACING.s,
    paddingVertical: SPACING.xs,
    marginBottom: SPACING.m,
  },
  searchInput: {
    flex: 1,
    height: 40,
    marginHorizontal: SPACING.xs,
    fontSize: SIZES.medium,
  },
  resultsText: {
    fontSize: SIZES.small,
    marginBottom: SPACING.m,
  },
  filtersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginBottom: SPACING.m,
  },
  filterButton: {
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.s,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: SPACING.xs,
  },
  activeFilterButton: {
    borderWidth: 1,
  },
  filterButtonText: {
    fontSize: SIZES.small,
  },
  statusFilterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.s,
    width: '100%',
  },
  statusButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.s,
    borderRadius: 16,
    borderWidth: 1,
  },
  statusDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.xs,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: SIZES.small,
    fontWeight: '500',
  },
  listContainer: {
    padding: SPACING.m,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
    marginTop: SPACING.xxl,
  },
  emptyText: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: SPACING.m,
  },
  emptySubText: {
    fontSize: SIZES.medium,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  resetButton: {
    paddingVertical: SPACING.s,
    paddingHorizontal: SPACING.l,
    borderRadius: 8,
    marginTop: SPACING.m,
  },
  resetButtonText: {
    color: 'white',
    fontSize: SIZES.medium,
    fontWeight: 'bold',
  },
  emptyTitle: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    marginTop: SPACING.m,
    marginBottom: SPACING.s,
  },
  emptyMessage: {
    fontSize: SIZES.medium,
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default SearchScreen;
