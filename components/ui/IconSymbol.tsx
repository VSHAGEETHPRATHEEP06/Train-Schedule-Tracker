// This file provides consistent icon handling across platforms

import { MaterialIcons } from '@expo/vector-icons';
import { Platform } from 'react-native';

interface IconSymbolProps {
  /**
   * The name of the icon. On iOS, this should be an SF Symbol name.
   * On other platforms, this should be a MaterialIcons name.
   */
  name: string;
  /**
   * The size of the icon.
   */
  size?: number;
  /**
   * The color of the icon.
   */
  color?: string;
  /**
   * The weight of the icon (iOS only).
   */
  weight?: 'ultraLight' | 'thin' | 'light' | 'regular' | 'medium' | 'semibold' | 'bold' | 'heavy' | 'black';
  /**
   * Style to apply to the icon.
   */
  style?: any;
}

/**
 * An icon component that uses native SFSymbols on iOS, and MaterialIcons on Android and web. This ensures a consistent look across platforms, and optimal resource usage.
 */
export function IconSymbol({
  name,
  size = 24,
  color = 'black',
  weight = 'regular',
  style,
}: IconSymbolProps) {
  // Map of SF Symbol names to Material Icons names for visual consistency
  const iconMap: Record<string, string> = {
    'house': 'home',
    'house.fill': 'home',
    'magnifyingglass': 'search',
    'heart': 'favorite',
    'heart.fill': 'favorite',
    'person': 'person',
    'person.fill': 'person',
    'gear': 'settings',
    'map': 'map',
    'train.side.front.car': 'train',
    'calendar': 'calendar-today',
    'creditcard': 'credit-card',
    'clock': 'access-time',
    'ticket': 'confirmation-number',
    'qrcode': 'qr-code',
    'wifi': 'wifi',
    'restaurant': 'restaurant',
    'bed.double': 'hotel',
    'tv': 'tv',
    'bell': 'notifications',
    'bell.fill': 'notifications',
    'star': 'star',
    'star.fill': 'star',
    'flame': 'local-fire-department',
    'terminal': 'computer',
    'checkmark.circle': 'check-circle',
    'xmark.circle': 'cancel',
    'chevron.right': 'chevron-right',
    'chevron.left': 'chevron-left',
    'trash': 'delete',
    'paperplane': 'send',
    'location': 'location-on',
    'link': 'link',
    'doc': 'description',
    'envelope': 'email',
    'phone': 'phone',
    'pin': 'push-pin',
    'lock': 'lock',
    'lock.open': 'lock-open',
    'arrow.left': 'arrow-back',
    'arrow.right': 'arrow-forward',
    'plus': 'add',
    'minus': 'remove',
    // Add more mappings as needed for train-specific icons
    'train': 'train',
    'bus': 'directions-bus',
    'airplane': 'flight',
    'building': 'business',
    'car': 'directions-car',
    'ticket.fill': 'confirmation-number',
    'bag': 'shopping-bag',
    'bag.fill': 'shopping-bag',
    'hourglass': 'hourglass-empty',
    'info.circle': 'info',
    'info.circle.fill': 'info',
  };

  // For Android and web, use Material Icons with our mapping
  // If the icon name doesn't exist in our map, just use the name directly
  // This ensures we fall back gracefully
  const materialIconName = iconMap[name] || name;
  
  // Using as any to bypass TypeScript strict checking for icon names
  // This allows us to use dynamic icon names
  return (
    <MaterialIcons
      name={materialIconName as any}
      size={size}
      color={color}
      style={style}
    />
  );
}
