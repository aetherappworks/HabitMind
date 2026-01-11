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

export default function LoginScreen() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const { login, isLoading } = useAuthStore();
  const { t } = useI18n();
  const navigation = useNavigation<any>();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!email) newErrors.email = t('auth.errors.email_required');
    if (!password) newErrors.password = t('auth.errors.password_required');

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    try {
      await login(email, password);
    } catch (error) {
      Alert.alert(
        t('ui.notifications.error'),
        error instanceof Error ? error.message : t('auth.errors.invalid_credentials')
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.logo}>HabitMind AI</Text>
          <Text style={styles.subtitle}>
            {t('auth.messages.check_email')}
          </Text>
        </View>

        <View style={styles.form}>
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

          {/* Login Button */}
          <Button
            title={isLoading ? t('ui.buttons.loading') : t('ui.buttons.login')}
            onPress={handleLogin}
            disabled={isLoading}
            size="large"
          />

          {/* Register Link */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>{t('auth.messages.registered_successfully')} </Text>
            <Button
              title={t('ui.buttons.register')}
              onPress={() => navigation.navigate('Register')}
              variant="secondary"
              size="small"
            />
          </View>
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
    justifyContent: 'center',
  },
  header: {
    marginBottom: 48,
    alignItems: 'center',
  },
  logo: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.primary[500],
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text.tertiary,
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
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  footerText: {
    fontSize: 14,
    color: colors.text.tertiary,
  },
});
