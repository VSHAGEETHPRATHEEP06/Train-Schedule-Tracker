import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SIZES, SPACING } from '../config/theme';
import { useTheme } from '../context/ThemeContext';
import TrainCard from '../components/TrainCard';
import StorageService from '../services/StorageService';

/**
 * FavoritesScreen - Displays user's favorite trains
 */
const FavoritesScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);

  // Load favorites on component mount
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        setLoading(true);
        const favoritesData = await StorageService.getFavorites() || [];
        setFavorites(favoritesData);
      } catch (error) {
        console.error('Error loading favorites:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();

    // Listen for navigation focus to refresh data
    const unsubscribe = navigation.addListener('focus', loadFavorites);
    return unsubscribe;
  }, [navigation]);

  // Handle removing a train from favorites
  const removeFavorite = async (trainId) => {
    try {
      await StorageService.removeFavorite(trainId);
      setFavorites(favorites.filter(train => train.id !== trainId));
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  // Render empty favorites message
  const renderEmptyFavorites = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="heart-outline" size={80} color={theme.border} />
      <Text style={[styles.emptyTitle, { color: theme.text }]}>No Favorites Yet</Text>
      <Text style={[styles.emptyMessage, { color: theme.subtext }]}>
        Save your favorite trains for quick access. Tap the heart icon on any train to add it to your favorites.
      </Text>
      <TouchableOpacity 
        style={[styles.browseButton, { backgroundColor: theme.primary }]}
        onPress={() => navigation.navigate('HomeTab')}
      >
        <Text style={[styles.browseButtonText, { color: theme.card }]}>Browse Trains</Text>
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
      <StatusBar barStyle={theme.dark ? "light-content" : "dark-content"} backgroundColor={theme.background} />
      
      <FlatList
        data={favorites}
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
            onFavoritePress={() => removeFavorite(item.id)}
            isFavorite={true}
          />
        )}
        contentContainerStyle={styles.listContainer}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={[styles.headerTitle, { color: theme.text }]}>Your Favorite Trains</Text>
            <Text style={[styles.headerSubtitle, { color: theme.subtext }]}>
              {favorites.length} {favorites.length === 1 ? 'Train' : 'Trains'}
            </Text>
          </View>
        }
        ListEmptyComponent={renderEmptyFavorites}
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
  header: {
    padding: SPACING.m,
    marginBottom: SPACING.s,
  },
  headerTitle: {
    fontSize: SIZES.xlarge,
    fontWeight: 'bold',
    marginBottom: SPACING.xs,
  },
  headerSubtitle: {
    fontSize: SIZES.medium,
  },
  listContainer: {
    padding: SPACING.m,
    paddingBottom: SPACING.xxl,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
    marginTop: SPACING.xxl,
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
    marginBottom: SPACING.l,
  },
  browseButton: {
    paddingVertical: SPACING.s,
    paddingHorizontal: SPACING.xl,
    borderRadius: 8,
  },
  browseButtonText: {
    fontSize: SIZES.medium,
    fontWeight: 'bold',
  },
});

export default FavoritesScreen;
