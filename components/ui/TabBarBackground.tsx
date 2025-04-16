// This is a shim for web and Android where the tab bar is generally opaque.
// However, we're updating Android to match iOS styling with a more modern appearance

import { View } from 'react-native';
import { Platform } from 'react-native';
import Animated from 'react-native-reanimated';

export function TabBarBackground({ style, ...props }: React.ComponentProps<typeof View>) {
  // Now we're using a semi-transparent background for Android to match iOS
  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: Platform.OS === 'android' 
            ? 'rgba(255, 255, 255, 0.8)' 
            : 'rgba(255, 255, 255, 0.95)',
          borderTopWidth: Platform.OS === 'android' ? 0 : 0.5,
          borderColor: '#E0E0E0',
        },
        style,
      ]}
      {...props}
    />
  );
}

export function useBottomTabOverflow() {
  return 0;
}
