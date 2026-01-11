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
import { useHabitStore } from '../../store/habitStore';
import { habitService, CheckInStats } from '../../services/habitService';
import { shadows } from '../../styles/shadows';
import { colors } from '../../styles/colors';
import { Button } from '../../components/Button';
import { useI18n } from '../../i18n/useI18n';
import dayjs from 'dayjs';

export default function HabitDetailScreen({ route, navigation }: any) {
  const { habitId } = route.params;
  const { selectedHabit, getHabit, createCheckIn, isLoading } =
    useHabitStore();
  const { t } = useI18n();
  const [stats, setStats] = React.useState<CheckInStats | null>(null);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    loadData();
  }, [habitId]);

  const loadData = async () => {
    setLoading(true);
    try {
      await getHabit(habitId);
      const habitStats = await habitService.getCheckInStats(habitId);
      setStats(habitStats);
    } catch (error) {
      Alert.alert(
        t('ui.notifications.error'),
        error instanceof Error
          ? error.message
          : t('common.errors.internal_error')
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async (status: 'completed' | 'skipped') => {
    try {
      await createCheckIn(habitId, { status });
      Alert.alert(t('ui.notifications.success'), `Check-in registrado como ${status}`);
      await loadData();
    } catch (error) {
      Alert.alert(
        'Erro',
        error instanceof Error
          ? error.message
          : 'Erro ao registrar check-in'
      );
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color="#6366f1" />
        </View>
      </SafeAreaView>
    );
  }

  if (!selectedHabit) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <Text style={styles.errorText}>Hábito não encontrado</Text>
          <Button
            title="Voltar"
            onPress={() => navigation.goBack()}
            size="medium"
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{selectedHabit.title}</Text>
          {selectedHabit.description && (
            <Text style={styles.description}>{selectedHabit.description}</Text>
          )}
        </View>

        {/* Status Card */}
        <View style={styles.statusCard}>
          <View style={styles.statusItem}>
            <Text style={styles.statusLabel}>Status</Text>
            <Text style={[styles.statusValue, { color: selectedHabit.active ? colors.success[300] : colors.error[300] }]}>
              {selectedHabit.active ? 'Ativo' : 'Inativo'}
            </Text>
          </View>
          <View style={styles.statusDivider} />
          <View style={styles.statusItem}>
            <Text style={styles.statusLabel}>Frequência</Text>
            <Text style={styles.statusValue}>
              {selectedHabit.frequency === 'daily'
                ? 'Diário'
                : selectedHabit.frequency === 'weekly'
                ? 'Semanal'
                : 'Personalizado'}
            </Text>
          </View>
        </View>

        {/* Stats */}
        {stats && (
          <View style={styles.statsContainer}>
            <Text style={styles.statsTitle}>Estatísticas</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statBox}>
                <Text style={styles.statValue}>{stats.completed}</Text>
                <Text style={styles.statLabel}>Completados</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statValue}>{stats.streak}</Text>
                <Text style={styles.statLabel}>Sequência</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statValue}>{stats.total}</Text>
                <Text style={styles.statLabel}>Total</Text>
              </View>
            </View>
          </View>
        )}

        {/* Info */}
        <View style={styles.infoContainer}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Criado em</Text>
            <Text style={styles.infoValue}>
              {dayjs(selectedHabit.createdAt).format('DD/MM/YYYY')}
            </Text>
          </View>
          {selectedHabit.preferredTime && (
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Hora Preferida</Text>
              <Text style={styles.infoValue}>{selectedHabit.preferredTime}</Text>
            </View>
          )}
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <Button
            title="✓ Completar"
            onPress={() => handleCheckIn('completed')}
            disabled={isLoading}
            size="large"
            icon="checkmark-circle"
          />
          <Button
            title="✕ Pular"
            onPress={() => handleCheckIn('skipped')}
            variant="secondary"
            disabled={isLoading}
            size="large"
          />
          <Button
            title="Editar"
            onPress={() =>
              navigation.navigate('CreateHabit')
            }
            variant="secondary"
            size="medium"
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
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  statusCard: {
    backgroundColor: colors.background.card,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    marginBottom: 24,
    ...shadows.small,
  },
  statusItem: {
    flex: 1,
    alignItems: 'center',
  },
  statusDivider: {
    width: 1,
    backgroundColor: colors.border.light,
  },
  statusLabel: {
    fontSize: 12,
    color: colors.text.tertiary,
    marginBottom: 4,
  },
  statusValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  statsContainer: {
    marginBottom: 24,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statBox: {
    flex: 1,
    backgroundColor: colors.background.card,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    ...shadows.small,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary[500],
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.text.tertiary,
  },
  infoContainer: {
    backgroundColor: colors.background.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    ...shadows.small,
  },
  infoLabel: {
    fontSize: 12,
    color: colors.text.tertiary,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.primary,
  },
  actions: {
    gap: 12,
  },
  errorText: {
    fontSize: 14,
    color: colors.error[300],
  },
});
