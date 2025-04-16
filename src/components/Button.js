import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { SPACING, SIZES } from '../config/theme';
import { useTheme } from '../context/ThemeContext';

/**
 * Custom button component with multiple variants
 */
const Button = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  style,
  textStyle,
}) => {
  const { theme } = useTheme();
  const getVariantStyle = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: disabled ? theme.border : theme.primary,
          borderColor: theme.primary,
        };
      case 'secondary':
        return {
          backgroundColor: 'transparent',
          borderColor: theme.primary,
          borderWidth: 1,
        };
      case 'text':
        return {
          backgroundColor: 'transparent',
          borderColor: 'transparent',
        };
      case 'danger':
        return {
          backgroundColor: disabled ? '#ffcdd2' : theme.error,
          borderColor: theme.error,
        };
      case 'success':
        return {
          backgroundColor: disabled ? '#c8e6c9' : theme.success,
          borderColor: theme.success,
        };
      default:
        return {
          backgroundColor: disabled ? theme.border : theme.primary,
          borderColor: theme.primary,
        };
    }
  };

  const getSizeStyle = () => {
    switch (size) {
      case 'small':
        return {
          paddingVertical: SPACING.xs,
          paddingHorizontal: SPACING.s,
          height: 32,
        };
      case 'medium':
        return {
          paddingVertical: SPACING.s,
          paddingHorizontal: SPACING.m,
          height: 44,
        };
      case 'large':
        return {
          paddingVertical: SPACING.m,
          paddingHorizontal: SPACING.l,
          height: 54,
        };
      default:
        return {
          paddingVertical: SPACING.s,
          paddingHorizontal: SPACING.m,
          height: 44,
        };
    }
  };

  const getTextStyle = () => {
    let color;
    switch (variant) {
      case 'secondary':
      case 'text':
        color = disabled ? theme.subtext : theme.primary;
        break;
      default:
        color = variant === 'primary' || variant === 'danger' || variant === 'success' ? 'white' : theme.text;
    }

    return {
      color,
      fontSize: size === 'small' ? SIZES.small : size === 'large' ? SIZES.large : SIZES.medium,
      fontWeight: '500',
    };
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        getVariantStyle(),
        getSizeStyle(),
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator size="small" color={variant === 'primary' ? 'white' : theme.primary} />
      ) : (
        <>
          {icon && icon}
          <Text style={[styles.buttonText, getTextStyle(), textStyle]}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    margin: 4,
  },
  buttonText: {
    fontWeight: '600',
    textAlign: 'center',
  },
  disabled: {
    opacity: 0.6,
  },
});

export default Button;
