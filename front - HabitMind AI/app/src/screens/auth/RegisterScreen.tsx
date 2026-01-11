import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
  TextInput,
} from 'react-native';
import { colors } from '../../styles/colors';
import { useAuthStore } from '../../store/authStore';
import { useI18n } from '../../i18n/useI18n';
import { useNavigation } from '@react-navigation/native';
import { Button } from '../../components/Button';

export default function RegisterScreen() {
  const [email, setEmail] = React.useState('');
  const [name, setName] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const { register, isLoading } = useAuthStore();
  const { t } = useI18n();
  const navigation = useNavigation<any>();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!email) newErrors.email = t('auth.errors.email_required');
    if (!name) newErrors.name = t('ui.labels.name');
    if (!password) newErrors.password = t('auth.errors.password_required');
    if (!confirmPassword)
      newErrors.confirmPassword = t('auth.errors.password_required');
    if (password !== confirmPassword)
      newErrors.confirmPassword = t('common.errors.bad_request');

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    try {
      await register(email, name, password);
    } catch (error) {
      Alert.alert(
        t('ui.notifications.error'),
        error instanceof Error
          ? error.message
          : t('common.errors.internal_error')
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Button
            title={t('ui.buttons.back')}
            onPress={() => navigation.goBack()}
            variant="secondary"
            size="small"
          />
          <Text style={styles.title}>{t('ui.buttons.register')}</Text>
        </View>

        <View style={styles.form}>
          {/* Name Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('ui.labels.name')}</Text>
            <TextInput
              style={[
                styles.input,
                errors.name && styles.inputError,
              ]}
              placeholder={t('ui.placeholders.email')}
              placeholderTextColor="#d1d5db"
              value={name}
              onChangeText={setName}
              editable={!isLoading}
            />
            {errors.name && (
              <Text style={styles.errorText}>{errors.name}</Text>
            )}
          </View>

          {/* Email Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('ui.labels.email')}</Text>
            <TextInput
              style={[
                styles.input,
                errors.email && styles.inputError,
              ]}
              placeholder={t('ui.placeholders.email')}
              placeholderTextColor="#d1d5db"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              editable={!isLoading}
            />
            {errors.email && (
              <Text style={styles.errorText}>{errors.email}</Text>
            )}
          </View>

          {/* Password Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('ui.labels.password')}</Text>
            <TextInput
              style={[
                styles.input,
                errors.password && styles.inputError,
              ]}
              placeholder={t('ui.placeholders.password')}
              placeholderTextColor="#d1d5db"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              editable={!isLoading}
            />
            {errors.password && (
              <Text style={styles.errorText}>{errors.password}</Text>
            )}
          </View>

          {/* Confirm Password Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('ui.labels.password')}</Text>
            <TextInput
              style={[
                styles.input,
                errors.confirmPassword && styles.inputError,
              ]}
              placeholder={t('ui.placeholders.password')}
              placeholderTextColor="#d1d5db"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              editable={!isLoading}
            />
            {errors.confirmPassword && (
              <Text style={styles.errorText}>{errors.confirmPassword}</Text>
            )}
          </View>

          {/* Register Button */}
          <Button
            title={isLoading ? t('ui.buttons.loading') : t('ui.buttons.register')}
            onPress={handleRegister}
            disabled={isLoading}
            size="large"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  content: {
    flexGrow: 1,
    padding: 24,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text.primary,
    marginTop: 16,
  },
  form: {
    gap: 16,
  },
  inputGroup: {
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.secondary,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: colors.background.secondary,
    fontSize: 14,
    color: colors.text.primary,
  },
  inputError: {
    borderColor: colors.error[300],
    backgroundColor: colors.error[50],
  },
  errorText: {
    fontSize: 12,
    color: colors.error[300],
    marginTop: 4,
  },
});
