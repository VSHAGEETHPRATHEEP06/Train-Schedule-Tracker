import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions, TouchableOpacity, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SIZES, SPACING } from '../config/theme';
import { useTheme } from '../context/ThemeContext';
import Button from '../components/Button';

const { width, height } = Dimensions.get('window');

/**
 * Onboarding screen with slides to introduce the app
 */
const OnboardingScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const flatListRef = useRef(null);

  // Onboarding slides data
  const slides = [
    {
      id: '1',
      title: 'Welcome to Train Tracker',
      description: 'The easiest way to find and book train tickets for your journey.',
      icon: 'train-outline',
    },
    {
      id: '2',
      title: 'Find Your Train',
      description: 'Search for trains between stations, check schedules, and compare prices.',
      icon: 'search-outline',
    },
    {
      id: '3',
      title: 'Book with Ease',
      description: 'Hassle-free booking with secure payment options and instant confirmation.',
      icon: 'card-outline',
    },
    {
      id: '4',
      title: 'Track Your Journey',
      description: 'Get real-time updates on train status, delays, and platform changes.',
      icon: 'location-outline',
    },
  ];

  // Handle next slide
  const handleNext = () => {
    if (currentSlideIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentSlideIndex + 1,
        animated: true,
      });
    } else {
      // Last slide, navigate to login
      navigation.navigate('Login');
    }
  };

  // Handle skip to login
  const handleSkip = () => {
    navigation.navigate('Login');
  };

  // Update current slide index on scroll
  const handleOnViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentSlideIndex(viewableItems[0].index);
    }
  }).current;

  // Render indicator dots
  const renderDots = () => {
    return slides.map((_, index) => (
      <View
        key={index}
        style={[
          styles.dot,
          currentSlideIndex === index 
            ? [styles.dotActive, { backgroundColor: theme.primary }]
            : [styles.dotInactive, { backgroundColor: theme.border }],
        ]}
      />
    ));
  };

  // Render slide
  const renderSlide = ({ item }) => {
    return (
      <View style={styles.slide}>
        <View style={[styles.iconContainer, { backgroundColor: theme.background }]}>
          <Ionicons name={item.icon} size={100} color={theme.primary} />
        </View>
        <Text style={[styles.title, { color: theme.text }]}>{item.title}</Text>
        <Text style={[styles.description, { color: theme.subtext }]}>{item.description}</Text>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.background} />
      
      {/* Skip button */}
      {currentSlideIndex < slides.length - 1 && (
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={[styles.skipText, { color: theme.primary }]}>Skip</Text>
        </TouchableOpacity>
      )}
      
      {/* Slides */}
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        onViewableItemsChanged={handleOnViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
      />
      
      {/* Bottom container with indicator dots and buttons */}
      <View style={styles.bottomContainer}>
        <View style={styles.indicatorContainer}>
          {renderDots()}
        </View>
        
        <Button
          title={currentSlideIndex === slides.length - 1 ? "Get Started" : "Next"}
          onPress={handleNext}
          style={styles.button}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  skipButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1,
  },
  skipText: {
    fontSize: SIZES.medium,
    fontWeight: '600',
  },
  slide: {
    width,
    height: height * 0.7,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  iconContainer: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    marginBottom: SPACING.xl,
  },
  title: {
    fontSize: SIZES.xxlarge,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: SPACING.m,
  },
  description: {
    fontSize: SIZES.medium,
    textAlign: 'center',
    lineHeight: 24,
  },
  bottomContainer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.xl,
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: SPACING.l,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  dotActive: {
    width: 20,
  },
  dotInactive: {
  },
  button: {
    width: '100%',
  },
});

export default OnboardingScreen;
