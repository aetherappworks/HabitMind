import React, { useCallback, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useHabitStore } from '../../store/habitStore';
import { useFocusEffect } from '../../utils/useFocusEffect';
import { HabitCard } from '../../components/HabitCard';
import { HabitModal } from '../../components/HabitModal';
import { CheckInModal } from '../../components/CheckInModal';
import { AIAnalysisModal } from '../../components/AIAnalysisModal';
import { HabitSuggestionsModal } from '../../components/HabitSuggestionsModal';
import { Button } from '../../components/Button';
import { useI18n } from '../../i18n/useI18n';
import { authService, UserCredits } from '../../services/authService';
import { habitService, CheckIn } from '../../services/habitService';
import { shadows } from '../../styles/shadows';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

export default function DashboardScreen({ navigation }: any) {
  const {
    habits,
    isLoading,
    getHabits,
    createCheckIn,
  } = useHabitStore((state) => ({
    habits: state.habits,
    isLoading: state.isLoading,
    getHabits: state.getHabits,
    createCheckIn: state.createCheckIn,
  }));
  const { t } = useI18n();
  const [refreshing, setRefreshing] = React.useState(false);
  const [credits, setCredits] = React.useState<UserCredits | null>(null);
  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const [showEditModal, setShowEditModal] = React.useState(false);
  const [showCheckInModal, setShowCheckInModal] = React.useState(false);
  const [showAnalysisModal, setShowAnalysisModal] = React.useState(false);
  const [showSuggestionsModal, setShowSuggestionsModal] = React.useState(false);
  const [editingHabitId, setEditingHabitId] = React.useState<string | undefined>();
  const [checkInHabitId, setCheckInHabitId] = React.useState<string | undefined>();
  const [checkInHabitTitle, setCheckInHabitTitle] = React.useState<string>('');
  const [habitCheckIns, setHabitCheckIns] = React.useState<Record<string, CheckIn[]>>({});
  const [completedToday, setCompletedToday] = React.useState<string>('');
  const [skippedToday, setSkippedToday] = React.useState<string>('');
  const loadedRef = useRef(false);

  useFocusEffect(
    useCallback(() => {
      if (!loadedRef.current) {
        getHabits();
        loadCredits();
        loadedRef.current = true;
      }
    }, [])
  );

  // Load check-ins for all habits
  React.useEffect(() => {
    const loadCheckIns = async () => {
      const checkInsMap: Record<string, CheckIn[]> = {};
      for (const habit of habits) {
        try {
          const checkIns = await habitService.getCheckIns(habit.id);
          checkInsMap[habit.id] = checkIns;
        } catch (error) {
          console.warn(`✗ Erro ao carregar check-ins para ${habit.id}:`, error);
          checkInsMap[habit.id] = [];
        }
      }
      setHabitCheckIns(checkInsMap);
    };

    if (habits.length > 0) {
      loadCheckIns();
    }
  }, [habits]);

  const loadCredits = async () => {
    try {
      const data = await authService.getCredits();
      setCredits(data);
    } catch (error) {
      console.warn('Erro ao carregar créditos:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([getHabits(), loadCredits()]);
    // Recarregar check-ins de todos os hábitos
    const checkInsMap: Record<string, CheckIn[]> = {};
    for (const habit of habits) {
      try {
        const checkIns = await habitService.getCheckIns(habit.id);
        checkInsMap[habit.id] = checkIns;
      } catch (error) {
        console.warn(`Erro ao carregar check-ins para ${habit.id}:`, error);
      }
    }
    setHabitCheckIns(checkInsMap);
    setRefreshing(false);
  };

  const handleDelete = (habitId: string, habitTitle: string) => {
    console.log('🗑️ [handleDelete] Iniciando deleção:', { habitId, habitTitle });
    Alert.alert(
      t('habits.labels.delete_habit'),
      `${t('common.messages.confirm_delete')} "${habitTitle}"?`,
      [
        { text: t('ui.buttons.cancel'), onPress: () => {}, style: 'cancel' },
        {
          text: t('ui.buttons.delete'),
          onPress: async () => {
            try {
              console.log('🗑️ [handleDelete] Confirmado, chamando deleteHabit:', habitId);
              const result = await deleteHabit(habitId);
              console.log('✅ [handleDelete] deleteHabit sucesso:', result);
              
              console.log('🔄 [handleDelete] Recarregando hábitos...');
              await loadHabits();
              console.log('✅ [handleDelete] Hábitos recarregados');
              
              Alert.alert(t('ui.notifications.success'), t('habits.messages.habit_deleted'));
            } catch (error) {
              console.error('❌ [handleDelete] Erro ao deletar:', error);
              Alert.alert(
                t('ui.notifications.error'),
                error instanceof Error
                  ? error.message
                  : t('common.errors.internal_error')
              );
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  const handleCheckInPress = (habitId: string, habitTitle: string) => {
    const today = dayjs.utc().format('YYYY-MM-DD');
    
    const habitCheckInsList = habitCheckIns[habitId] || [];
    
    const todayCheckins = habitCheckInsList.filter((c) => {
      const checkInDate = dayjs.utc(c.date).format('YYYY-MM-DD');
      return checkInDate === today;
    });

    const completed = todayCheckins.some((c) => c.status === 'completed');
    const skipped = todayCheckins.some((c) => c.status === 'skipped');

    setCheckInHabitId(habitId);
    setCheckInHabitTitle(habitTitle);
    setCompletedToday(completed ? habitId : '');
    setSkippedToday(skipped ? habitId : '');
    setShowCheckInModal(true);
  };

  const handleCheckIn = async (status: 'completed' | 'skipped') => {
    if (!checkInHabitId) return;
    
    try {
      await createCheckIn(checkInHabitId, { status });
      
      // Recarregar check-ins do hábito
      const updatedCheckIns = await habitService.getCheckIns(checkInHabitId);
      
      setHabitCheckIns((prev) => {
        const newState = {
          ...prev,
          [checkInHabitId]: updatedCheckIns,
        };
        return newState;
      });
    } catch (error) {
      console.error('✗ Erro ao criar check-in:', error);
      throw error;
    }
  };

  const handleEditHabit = (habitId: string) => {
    console.log('✏️ [DashboardScreen] handleEditHabit chamado:', habitId);
    setEditingHabitId(habitId);
    setShowEditModal(true);
    console.log('✏️ [DashboardScreen] Modal de edição aberto com habitId:', habitId);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingHabitId(undefined);
  };

  if (isLoading && habits.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color="#6366f1" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Modals */}
      <HabitModal
        visible={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={() => {
          loadedRef.current = false;
          getHabits();
        }}
      />
      <HabitModal
        visible={showEditModal}
        habitId={editingHabitId}
        onClose={handleCloseEditModal}
        onSuccess={() => {
          loadedRef.current = false;
          getHabits();
        }}
      />
      <CheckInModal
        visible={showCheckInModal}
        habitId={checkInHabitId || ''}
        habitTitle={checkInHabitTitle}
        onComplete={() => handleCheckIn('completed')}
        onSkip={() => handleCheckIn('skipped')}
        onAnalyze={() => {
          setShowCheckInModal(false);
          setShowAnalysisModal(true);
        }}
        onClose={() => {
          setShowCheckInModal(false);
          setCheckInHabitId(undefined);
          setCheckInHabitTitle('');
          setCompletedToday('');
          setSkippedToday('');
        }}
        completedToday={completedToday === checkInHabitId}
        skippedToday={skippedToday === checkInHabitId}
      />
      <AIAnalysisModal
        visible={showAnalysisModal}
        habitId={checkInHabitId || ''}
        habitTitle={checkInHabitTitle}
        onClose={() => {
          setShowAnalysisModal(false);
          setCheckInHabitId(undefined);
          setCheckInHabitTitle('');
        }}
      />
      <HabitSuggestionsModal
        visible={showSuggestionsModal}
        onClose={() => setShowSuggestionsModal(false)}
      />

      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Meus Hábitos</Text>
          <Text style={styles.subGreeting}>
            {habits.length} hábito{habits.length !== 1 ? 's' : ''}
          </Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.suggestionsButton}
            onPress={() => setShowSuggestionsModal(true)}
            activeOpacity={0.8}
          >
            <Text style={styles.suggestionsButtonText}>💡</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.fabButton}
            onPress={() => setShowCreateModal(true)}
            activeOpacity={0.8}
          >
            <Text style={styles.fabButtonText}>+ Novo</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Credits Card */}
      {credits && (
        <TouchableOpacity
          style={styles.creditsCard}
          onPress={() => {
            // Navigate to UserTab, then to Credits screen
            navigation.navigate('UserTab' as any);
            setTimeout(() => {
              navigation.navigate('Credits');
            }, 100);
          }}
        >
          <View style={styles.creditsContent}>
            <Text style={styles.creditsLabel}>Créditos Disponíveis</Text>
            <Text style={styles.creditsAmount}>{credits.availableCredits}</Text>
          </View>
          <View style={styles.creditsInfo}>
            <Text style={styles.creditsTotal}>{credits.totalCredits} total</Text>
            <Text style={styles.creditsPlan}>{credits.planType}</Text>
          </View>
        </TouchableOpacity>
      )}

      {habits.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateIcon}>📝</Text>
          <Text style={styles.emptyStateTitle}>{t('habits.messages.no_habits')}</Text>
          <Text style={styles.emptyStateSubtitle}>
            {t('habits.messages.create_first_habit')}
          </Text>
          <Button
            title={t('habits.buttons.create_first')}
            onPress={() => setShowCreateModal(true)}
            size="large"
          />
        </View>
      ) : (
        <FlatList
          data={habits}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const today = dayjs.utc().format('YYYY-MM-DD');
            const habitCheckInsList = habitCheckIns[item.id] || [];
            
            const todayCheckins = habitCheckInsList.filter((c) => {
              const checkInDate = dayjs.utc(c.date).format('YYYY-MM-DD');
              const matches = checkInDate === today;
              return matches;
            });
            
            const completedToday = todayCheckins.some(
              (c) => c.status === 'completed'
            );
            const skippedToday = todayCheckins.some(
              (c) => c.status === 'skipped'
            );

            return (
              <HabitCard
                habit={item}
                onPress={() => handleCheckInPress(item.id, item.title)}
                onEdit={() => handleEditHabit(item.id)}
                completedToday={completedToday}
                skippedToday={skippedToday}
              />
            );
          }}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
  },
  subGreeting: {
    fontSize: 12,
    color: '#9ca3af',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  suggestionsButton: {
    backgroundColor: '#fef3c7',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.small,
  },
  suggestionsButtonText: {
    fontSize: 16,
  },
  fabButton: {
    backgroundColor: '#6366f1',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    ...shadows.medium,
  },
  fabButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#ffffff',
  },
  creditsCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#f3f4f6',
    borderLeftWidth: 4,
    borderLeftColor: '#6366f1',
    borderRadius: 8,
    ...shadows.small,
  },
  creditsContent: {
    flex: 1,
  },
  creditsLabel: {
    fontSize: 11,
    color: '#9ca3af',
    marginBottom: 2,
    fontWeight: '500',
  },
  creditsAmount: {
    fontSize: 20,
    fontWeight: '700',
    color: '#6366f1',
  },
  creditsInfo: {
    alignItems: 'flex-end',
  },
  creditsTotal: {
    fontSize: 11,
    color: '#9ca3af',
    marginBottom: 1,
  },
  creditsPlan: {
    fontSize: 10,
    color: '#d1d5db',
    fontWeight: '500',
  },
  listContent: {
    padding: 16,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
  },
});
