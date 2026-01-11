import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '../../utils/useFocusEffect';
import { useAIStore } from '../../store/aiStore';
import { shadows } from '../../styles/shadows';
import { Button } from '../../components/Button';
import { Toast } from '../../components/Toast';

interface InsightsModalProps {
  visible: boolean;
  onClose: () => void;
}

export const InsightsScreen: React.FC<InsightsModalProps> = ({ visible, onClose }) => {
  const {
    currentInsights,
    isLoadingInsights,
    error,
    creditsRemaining,
    getInsights,
    clearError,
  } = useAIStore();

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [insightType, setInsightType] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  useFocusEffect(() => {
    if (visible && !currentInsights) {
      loadInsights('daily');
    }
  });

  const loadInsights = async (type: 'daily' | 'weekly' | 'monthly') => {
    try {
      clearError();
      setInsightType(type);
      await getInsights(type);
      setToastMessage('✓ Insights carregados com sucesso!');
      setToastType('success');
      setShowToast(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao carregar insights';
      setToastMessage(`❌ ${message}`);
      setToastType('error');
      setShowToast(true);
    }
  };

  if (!visible) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Toast
        message={toastMessage}
        type={toastType}
        visible={showToast}
        duration={500}
      />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>💡 Insights de IA</Text>
            <Text style={styles.headerSubtitle}>Análise inteligente dos seus hábitos</Text>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#6b7280" />
          </TouchableOpacity>
        </View>

        {/* Type Selector */}
        <View style={styles.typeSelector}>
          {(['daily', 'weekly', 'monthly'] as const).map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.typeButton,
                insightType === type && styles.typeButtonActive,
              ]}
              onPress={() => loadInsights(type)}
              disabled={isLoadingInsights}
            >
              <Text
                style={[
                  styles.typeButtonText,
                  insightType === type && styles.typeButtonTextActive,
                ]}
              >
                {type === 'daily' ? 'Diário' : type === 'weekly' ? 'Semanal' : 'Mensal'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {isLoadingInsights ? (
          <View style={styles.centerContent}>
            <ActivityIndicator size="large" color="#6366f1" />
            <Text style={styles.loadingText}>Gerando insights...</Text>
          </View>
        ) : error ? (
          <View style={styles.centerContent}>
            <Text style={styles.errorTitle}>❌ Erro ao carregar insights</Text>
            <Text style={styles.errorMessage}>{error}</Text>
            <Button
              title="Tentar Novamente"
              onPress={() => loadInsights(insightType)}
              size="medium"
            />
          </View>
        ) : currentInsights ? (
          <>
            {/* Content */}
            <View style={styles.contentCard}>
              <Text style={styles.contentTitle}>📊 Seu {insightType}</Text>
              <Text style={styles.contentText}>{currentInsights.content}</Text>
            </View>

            {/* Habits Summary */}
            {currentInsights.habits.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Resumo dos Hábitos</Text>
                {currentInsights.habits.map((habit, index) => (
                  <View key={index} style={styles.habitSummary}>
                    <View style={styles.habitHeader}>
                      <Text style={styles.habitName}>{habit.habitTitle}</Text>
                      <View style={styles.completionBadge}>
                        <Text style={styles.completionText}>
                          {Math.round(habit.completionRate)}%
                        </Text>
                      </View>
                    </View>
                    <View style={styles.progressBar}>
                      <View
                        style={[
                          styles.progressFill,
                          { width: `${habit.completionRate}%` },
                        ]}
                      />
                    </View>
                  </View>
                ))}
              </View>
            )}

            {/* Trends */}
            {currentInsights.trends.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>📈 Tendências</Text>
                {currentInsights.trends.map((trend, index) => (
                  <View key={index} style={styles.trendItem}>
                    <Text style={styles.trendBullet}>✓</Text>
                    <Text style={styles.trendText}>{trend}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Next Steps */}
            {currentInsights.nextSteps.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>🎯 Próximos Passos</Text>
                {currentInsights.nextSteps.map((step, index) => (
                  <View
                    key={index}
                    style={[
                      styles.stepItem,
                      index % 2 === 0 ? styles.stepItemEven : styles.stepItemOdd,
                    ]}
                  >
                    <Text style={styles.stepNumber}>{index + 1}</Text>
                    <Text style={styles.stepText}>{step}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Credits Info */}
            <View style={styles.creditsInfo}>
              <Ionicons name="flash" size={16} color="#6366f1" />
              <Text style={styles.creditsLabel}>Créditos restantes: </Text>
              <Text style={styles.creditsValue}>{creditsRemaining}</Text>
            </View>
          </>
        ) : (
          <View style={styles.centerContent}>
            <Text style={styles.noDataText}>Nenhum insight disponível</Text>
          </View>
        )}

        {/* Action Button */}
        <View style={{ marginTop: 16 }}>
          <Button
            title="Fechar"
            onPress={onClose}
            variant="secondary"
            size="large"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#6b7280',
  },
  closeButton: {
    padding: 8,
  },
  typeSelector: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    backgroundColor: '#ffffff',
  },
  typeButtonActive: {
    borderColor: '#6366f1',
    backgroundColor: '#eef2ff',
  },
  typeButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6b7280',
    textAlign: 'center',
  },
  typeButtonTextActive: {
    color: '#6366f1',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 12,
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ef4444',
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 13,
    color: '#6b7280',
    textAlign: 'center',
  },
  contentCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    ...shadows.small,
  },
  contentTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 10,
  },
  contentText: {
    fontSize: 13,
    color: '#4b5563',
    lineHeight: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 12,
  },
  habitSummary: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    ...shadows.small,
  },
  habitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  habitName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1f2937',
    flex: 1,
  },
  completionBadge: {
    backgroundColor: '#dbeafe',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  completionText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0369a1',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#e5e7eb',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#6366f1',
  },
  trendItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
    backgroundColor: '#f0fdf4',
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#10b981',
  },
  trendBullet: {
    fontSize: 14,
    color: '#10b981',
    marginRight: 10,
    fontWeight: '700',
  },
  trendText: {
    fontSize: 13,
    color: '#047857',
    flex: 1,
    lineHeight: 18,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 3,
  },
  stepItemEven: {
    backgroundColor: '#ede9fe',
    borderLeftColor: '#7c3aed',
  },
  stepItemOdd: {
    backgroundColor: '#dbeafe',
    borderLeftColor: '#0284c7',
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'transparent',
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '700',
    fontSize: 12,
    marginRight: 10,
    color: '#1f2937',
  },
  stepText: {
    fontSize: 13,
    color: '#1f2937',
    flex: 1,
    lineHeight: 18,
  },
  creditsInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
  },
  creditsLabel: {
    fontSize: 13,
    color: '#6b7280',
    fontWeight: '500',
    marginLeft: 8,
  },
  creditsValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6366f1',
  },
  noDataText: {
    fontSize: 14,
    color: '#9ca3af',
  },
});
