import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useAuthStore } from '../../store/authStore';
import { useI18n } from '../../i18n/useI18n';
import { authService, UserCredits } from '../../services/authService';
import { shadows } from '../../styles/shadows';
import { colors } from '../../styles/colors';
import { Button } from '../../components/Button';

export default function ProfileScreen({ navigation }: any) {
  const { user, logout } = useAuthStore();
  const { t } = useI18n();
  const [loading, setLoading] = React.useState(false);

  const handleLogout = () => {
    Alert.alert(
      t('ui.notifications.logout'),
      t('common.messages.confirm_logout'),
      [
        { text: t('ui.buttons.cancel'), onPress: () => {}, style: 'cancel' },
        {
          text: t('ui.buttons.logout'),
          onPress: async () => {
            await logout();
          },
          style: 'destructive',
        },
      ]
    );
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <Text style={styles.errorText}>{t('common.errors.user_not_found')}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* User Card */}
        <View style={styles.userCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user.name.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
            <View style={styles.planBadge}>
              <Text style={styles.planText}>
                Plano {user.planType === 'premium' ? 'Premium' : 'Gratuito'}
              </Text>
            </View>
          </View>
        </View>

        {/* Account Info */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Informações da Conta</Text>
          <View style={styles.infoBox}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Email:</Text>
              <Text style={styles.infoValue}>{user.email}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Plano:</Text>
              <Text style={styles.infoValue}>
                {user.planType === 'premium' ? 'Premium' : 'Gratuito'}
              </Text>
            </View>
          </View>
        </View>

        {/* Logout Button */}
        <View style={styles.dangerSection}>
          <Button
            title="Sair da Conta"
            onPress={handleLogout}
            variant="danger"
            size="large"
            icon="log-out"
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
    padding: 16,
    paddingBottom: 32,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userCard: {
    backgroundColor: colors.background.card,
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    ...shadows.small,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text.inverse,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 12,
    color: colors.text.tertiary,
    marginBottom: 8,
  },
  planBadge: {
    backgroundColor: colors.primary[100],
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  planText: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.primary[500],
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 12,
  },
  infoSection: {
    marginBottom: 24,
  },
  infoBox: {
    backgroundColor: colors.background.card,
    borderRadius: 12,
    padding: 16,
    ...shadows.small,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.text.tertiary,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
  },
  dangerSection: {
    marginTop: 8,
  },
  errorText: {
    fontSize: 14,
    color: colors.error[300],
  },
});
