import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useCreditStore } from '../../store/creditStore';
import { useI18n } from '../../i18n/useI18n';
import { shadows } from '../../styles/shadows';
import { Button } from '../../components/Button';
import { Toast } from '../../components/Toast';

export default function CreditsScreen({ navigation }: any) {
  const { t } = useI18n();
  
  // Configure header to go back to Dashboard instead of Profile
  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => {
            // Navigate to HabitsTab first
            navigation.navigate('HabitsTab' as any);
            setTimeout(() => {
              navigation.navigate('Dashboard');
            }, 100);
          }}
          style={{ paddingLeft: 16 }}
        >
          <Ionicons name="chevron-back" size={28} color="#6366f1" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const {
    credits,
    reloadInfo,
    isLoading,
    error,
    getCreditsInfo,
    reloadManual,
    forceReload,
    addAdReward,
    refresh,
  } = useCreditStore();

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [processingAction, setProcessingAction] = useState<string | null>(null);
  const [showReloadOptions, setShowReloadOptions] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    try {
      await getCreditsInfo();
    } catch (err) {
      showErrorToast(
        err instanceof Error ? err.message : 'Erro ao carregar créditos'
      );
    }
  };

  const showSuccessToast = (message: string) => {
    setToastMessage(message);
    setToastType('success');
    setShowToast(true);
  };

  const showErrorToast = (message: string) => {
    setToastMessage(message);
    setToastType('error');
    setShowToast(true);
  };

  const handleForceReload = async () => {
    try {
      setProcessingAction('force');
      await forceReload();
      showSuccessToast('✓ Créditos recargados com sucesso!');
    } catch (err) {
      showErrorToast(
        err instanceof Error ? err.message : 'Erro ao forçar recarga'
      );
    } finally {
      setProcessingAction(null);
    }
  };

  const handleReloadManual = async (amount: number) => {
    try {
      setProcessingAction('manual');
      await reloadManual(amount, 'manual_purchase');
      showSuccessToast(`✓ ${amount} créditos adicionados!`);
      setShowReloadOptions(false);
    } catch (err) {
      showErrorToast(
        err instanceof Error ? err.message : 'Erro ao recarregar créditos'
      );
    } finally {
      setProcessingAction(null);
    }
  };

  const handleAdReward = async () => {
    try {
      setProcessingAction('ad');
      await addAdReward(10, 'rewarded_video');
      showSuccessToast('✓ +10 créditos ganhos assistindo anúncio!');
    } catch (err) {
      showErrorToast(
        err instanceof Error ? err.message : 'Erro ao ganhar reward'
      );
    } finally {
      setProcessingAction(null);
    }
  };


  if (isLoading && !credits) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color="#6366f1" />
          <Text style={styles.loadingText}>Carregando créditos...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error && !credits) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <Text style={styles.errorText}>❌ Erro ao carregar créditos</Text>
          <Text style={styles.errorMessage}>{error}</Text>
          <Button
            title="Tentar Novamente"
            onPress={loadData}
            size="medium"
            style={{ marginTop: 16 }}
          />
        </View>
      </SafeAreaView>
    );
  }

  if (!credits) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <Text style={styles.errorText}>Nenhum dado disponível</Text>
        </View>
      </SafeAreaView>
    );
  }

  const percentageUsed = Math.round(
    (credits.usedToday / credits.dailyLimit) * 100
  );
  const nextReset = reloadInfo?.nextReset;

  return (
    <SafeAreaView style={styles.container}>
      <Toast
        message={toastMessage}
        type={toastType}
        visible={showToast}
        duration={500}
      />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Header with refresh */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>🪙 Meus Créditos</Text>
          <View style={styles.planBadge}>
            <Text style={styles.planBadgeText}>
              {credits.planType === 'free' ? '🆓 Plano Free' : '⭐ Premium'}
            </Text>
          </View>
        </View>

        {/* Total Credits Card */}
        <View style={styles.creditCard}>
          <Text style={styles.creditLabel}>Créditos Disponíveis</Text>
          <Text style={styles.creditAmount}>{credits.availableCredits}</Text>
          <Text style={styles.creditUnit}>de {credits.totalCredits} totais</Text>
        </View>

        {/* Daily Stats */}
        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>📊 Uso Diário</Text>

          <View style={styles.statBox}>
            <View style={styles.statHeader}>
              <Text style={styles.statLabel}>Limite Diário</Text>
              <Text style={styles.statValue}>{credits.dailyLimit}</Text>
            </View>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${Math.min(percentageUsed, 100)}%` },
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              {credits.usedToday} de {credits.dailyLimit} usados ({percentageUsed}%)
            </Text>
          </View>

          <View style={styles.statBox}>
            <View style={styles.statHeader}>
              <Text style={styles.statLabel}>Disponível Hoje</Text>
              <Text
                style={[
                  styles.statValue,
                  {
                    color:
                      credits.availableToday > 0 ? '#10b981' : '#ef4444',
                  },
                ]}
              >
                {credits.availableToday}
              </Text>
            </View>
            <Text style={styles.availableText}>
              {credits.availableToday > 0
                ? 'Você ainda pode usar esses créditos hoje'
                : 'Limite diário atingido. Volte amanhã'}
            </Text>
          </View>

          {nextReset && (
            <View style={styles.statBox}>
              <View style={styles.statHeader}>
                <Text style={styles.statLabel}>⏰ Próximo Reset</Text>
                <Text style={styles.statValue}>
                  {nextReset.hoursUntilReset}h {nextReset.minutesUntilReset}m
                </Text>
              </View>
              <Text style={styles.availableText}>
                Reset diário às 00:00 UTC
              </Text>
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <Button
            title={processingAction === 'force' ? 'Recarregando...' : 'Forçar Recarga'}
            onPress={handleForceReload}
            disabled={
              processingAction !== null ||
              credits.availableCredits === credits.dailyLimit
            }
            variant="secondary"
            size="medium"
          />
          <Button
            title={processingAction === 'ad' ? 'Assistindo...' : 'Assistir Anúncio'}
            onPress={handleAdReward}
            disabled={processingAction !== null}
            variant="secondary"
            size="medium"
          />
          <Button
            title={processingAction === 'manual' ? 'Carregando...' : 'Comprar Créditos'}
            onPress={() => setShowReloadOptions(!showReloadOptions)}
            disabled={processingAction !== null}
            size="medium"
          />
        </View>

        {/* Reload Options */}
        {showReloadOptions && (
          <View style={styles.reloadOptions}>
            <Text style={styles.reloadOptionsTitle}>Escolha a quantidade:</Text>
            <View style={styles.optionsGrid}>
              {[
                { amount: 10, label: '10 créditos' },
                { amount: 25, label: '25 créditos' },
                { amount: 50, label: '50 créditos' },
                { amount: 100, label: '100 créditos' },
              ].map((option) => (
                <TouchableOpacity
                  key={option.amount}
                  style={styles.optionCard}
                  onPress={() => handleReloadManual(option.amount)}
                  disabled={processingAction !== null}
                >
                  <Text style={styles.optionAmount}>{option.amount}</Text>
                  <Text style={styles.optionLabel}>{option.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* How to Earn */}
        <View style={styles.earnSection}>
          <Text style={styles.sectionTitle}>💡 Como Ganhar Créditos</Text>


          <View style={styles.earnCard}>
            <Text style={styles.earnIcon}>📺</Text>
            <View style={styles.earnContent}>
              <Text style={styles.earnTitle}>Assistir Anúncios</Text>
              <Text style={styles.earnDesc}>+10 créditos por vídeo</Text>
            </View>
          </View>

          <View style={styles.earnCard}>
            <Text style={styles.earnIcon}>✨</Text>
            <View style={styles.earnContent}>
              <Text style={styles.earnTitle}>Assinatura Premium</Text>
              <Text style={styles.earnDesc}>Limite diário ilimitado</Text>
            </View>
          </View>

          <View style={styles.earnCard}>
            <Text style={styles.earnIcon}>🎯</Text>
            <View style={styles.earnContent}>
              <Text style={styles.earnTitle}>Completar Hábitos</Text>
              <Text style={styles.earnDesc}>+1 crédito por hábito</Text>
            </View>
          </View>
        </View>

        {/* FAQ Section */}
        <View style={styles.faqSection}>
          <Text style={styles.sectionTitle}>❓ Dúvidas Frequentes</Text>

          <View style={styles.faqCard}>
            <Text style={styles.faqQuestion}>Para que servem créditos?</Text>
            <Text style={styles.faqAnswer}>
              Créditos são usados para acessar análises de IA do HabitMind. Cada análise consome um crédito.
            </Text>
          </View>

          <View style={styles.faqCard}>
            <Text style={styles.faqQuestion}>Como ganho créditos diários?</Text>
            <Text style={styles.faqAnswer}>
              Seu limite diário reseta automaticamente às 00:00 UTC. Planos Free recebem 10 créditos, Premium tem limite ilimitado.
            </Text>
          </View>

          <View style={styles.faqCard}>
            <Text style={styles.faqQuestion}>Posso forçar recarga?</Text>
            <Text style={styles.faqAnswer}>
              Sim! Você pode forçar uma recarga antecipada quando seus créditos acabarem, mas esto só funciona uma vez por dia.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  header: {
    marginBottom: 24,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 8,
  },
  planBadge: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  planBadgeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
  },
  creditCard: {
    backgroundColor: '#6366f1',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    alignItems: 'center',
    ...shadows.medium,
  },
  creditLabel: {
    fontSize: 14,
    color: '#c7d2fe',
    marginBottom: 8,
  },
  creditAmount: {
    fontSize: 48,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  creditUnit: {
    fontSize: 13,
    color: '#c7d2fe',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  statsContainer: {
    marginBottom: 24,
  },
  statBox: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    ...shadows.small,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#6366f1',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#6366f1',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#9ca3af',
  },
  availableText: {
    fontSize: 12,
    color: '#6b7280',
  },
  actionButtons: {
    gap: 12,
    marginBottom: 20,
  },
  reloadOptions: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    ...shadows.small,
  },
  reloadOptionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  optionCard: {
    flex: 1,
    minWidth: '48%',
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    alignItems: 'center',
  },
  optionAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#6366f1',
    marginBottom: 4,
  },
  optionLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  earnSection: {
    marginBottom: 24,
  },
  earnCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    ...shadows.small,
  },
  earnIcon: {
    fontSize: 28,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  earnContent: {
    flex: 1,
  },
  earnTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 2,
  },
  earnDesc: {
    fontSize: 12,
    color: '#9ca3af',
  },
  faqSection: {
    marginBottom: 20,
  },
  faqCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    ...shadows.small,
  },
  faqQuestion: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  faqAnswer: {
    fontSize: 13,
    color: '#6b7280',
    lineHeight: 20,
  },
  errorText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ef4444',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 16,
    textAlign: 'center',
  },
  loadingText: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 12,
  },
});
