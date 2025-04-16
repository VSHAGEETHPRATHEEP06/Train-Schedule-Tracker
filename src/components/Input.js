import React from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import { SIZES, SPACING } from '../config/theme';
import { useTheme } from '../context/ThemeContext';

/**
 * Custom input component with error handling
 */
const Input = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  error,
  touched,
  keyboardType = 'default',
  autoCapitalize = 'none',
  multiline = false,
  style,
  disabled = false,
  leftIcon,
  rightIcon,
  ...props
}) => {
  const { theme } = useTheme();
  return (
    <View style={[styles.container, style]}>
      {label && <Text style={[styles.label, { color: theme.text }]}>{label}</Text>}
      <View style={[
        styles.inputContainer, 
        { 
          borderColor: theme.border,
          backgroundColor: theme.inputBackground 
        },
        error && touched && [styles.inputError, { borderColor: theme.error }],
        disabled && [styles.inputDisabled, { backgroundColor: theme.border }]
      ]}>
        {leftIcon && <View style={styles.iconContainer}>{leftIcon}</View>}
        <TextInput
          style={[
            styles.input,
            { color: theme.text },
            multiline && styles.multiline,
            leftIcon && styles.inputWithLeftIcon,
            rightIcon && styles.inputWithRightIcon,
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.subtext}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          multiline={multiline}
          editable={!disabled}
          {...props}
        />
        {rightIcon && <View style={styles.iconContainer}>{rightIcon}</View>}
      </View>
      {error && touched && <Text style={[styles.errorText, { color: theme.error }]}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.m,
    width: '100%',
  },
  label: {
    fontSize: SIZES.small,
    marginBottom: SPACING.xs,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 8,
    alignItems: 'center',
    height: 50,
  },
  input: {
    flex: 1,
    height: 48,
    paddingHorizontal: SPACING.m,
    fontSize: SIZES.medium,
  },
  inputWithLeftIcon: {
    paddingLeft: SPACING.xs,
  },
  inputWithRightIcon: {
    paddingRight: SPACING.xs,
  },
  multiline: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: SPACING.m,
  },
  iconContainer: {
    padding: SPACING.s,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputError: {
    borderWidth: 1,
  },
  inputDisabled: {
    opacity: 0.7,
  },
  errorText: {
    fontSize: SIZES.small,
    marginTop: SPACING.xs,
  },
});

export default Input;
