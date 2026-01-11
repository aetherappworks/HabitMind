import React from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  ViewStyle,
  TextInputProps,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../styles/colors';

interface InputProps extends TextInputProps {
  label?: string;
  placeholder: string;
  error?: string;
  icon?: string;
  containerStyle?: ViewStyle;
  multiline?: boolean;
  rows?: number;
}

export const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  error,
  icon,
  containerStyle,
  multiline = false,
  rows = 1,
  ...props
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View
        style={[
          styles.inputWrapper,
          error && styles.inputError,
        ]}
      >
        {icon && (
          <Ionicons
            name={icon as any}
            size={20}
            color={colors.text.tertiary}
            style={styles.icon}
          />
        )}
        <TextInput
          style={[
            styles.input,
            icon && styles.inputWithIcon,
            multiline && styles.multilineInput,
          ]}
          placeholder={placeholder}
          placeholderTextColor={colors.text.tertiary}
          multiline={multiline}
          numberOfLines={rows}
          {...props}
        />
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.primary,
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: 8,
    backgroundColor: colors.background.secondary,
    paddingHorizontal: 12,
  },
  inputError: {
    borderColor: colors.error[300],
    backgroundColor: colors.error[50],
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
    color: colors.text.primary,
  },
  inputWithIcon: {
    paddingLeft: 0,
  },
  multilineInput: {
    textAlignVertical: 'top',
    paddingVertical: 12,
  },
  icon: {
    marginRight: 8,
  },
  errorText: {
    marginTop: 4,
    fontSize: 12,
    color: colors.error[300],
  },
});
