import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useAIStore } from '../store/aiStore';
import { useAuthStore } from '../store/authStore';
import { Toast } from './Toast';

interface AIAnalysisModalProps {
  visible: boolean;
  habitId: string;
  habitTitle: string;
  onClose: () => void;
}

export const AIAnalysisModal: React.FC<AIAnalysisModalProps> = ({
  visible,
  habitId,
  habitTitle,
  onClose,
}) => {
  const [showToast, setShowToast] = React.useState(false);
  const [toastMessage, setToastMessage] = React.useState('');
  const [toastType, setToastType] = React.useState<'success' | 'error'>('success');

  const {
    currentAnalysis,
    isAnalyzing,
    error,
    creditsRemaining,
    analyzeHabit,
    clearError,
    reset,
  } = useAIStore();

  const { loadCredits } = useAuthStore();

  useEffect(() => {
    if (visible) {
      performAnalysis();
    } else {
      reset();
    }
  }, [visible, habitId]);

  const performAnalysis = async () => {
    try {
      clearError();
      
      const payload = {
        habitId,
        type: 'pattern_analysis',
        context: habitTitle,
      };
      
      await analyzeHabit(payload);
      
      // Atualizar créditos imediatamente após análise
      try {
        await loadCredits();
      } catch (err) {
        // Erro silencioso ao atualizar créditos
      }
      
      setToastMessage('✓ Análise de IA realizada com sucesso!');
      setToastType('success');
      setShowToast(true);
    } catch (err) {
      console.error('❌ [AIAnalysisModal] Erro na análise:', err);
      const message = err instanceof Error ? err.message : 'Erro ao analisar hábito';
      setToastMessage(`❌ ${message}`);
      setToastType('error');
      setShowToast(true);
    }
  };

  const handleClose = () => {
    clearError();
    onClose();
  };

  if (!visible) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={handleClose}
    >
      <Toast
        message={toastMessage}
        type={toastType}
        visible={showToast}
        duration={500}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>🤖 Análise de IA</Text>
            <View style={{ width: 40 }} />
          </View>

          {/* Content */}
          {isAnalyzing ? (
            <View style={styles.centerContent}>
              <ActivityIndicator size="large" color="#6366f1" />
              <Text style={styles.analyzingText}>
                Analisando seu hábito "{habitTitle}"...
              </Text>
            </View>
          ) : error ? (
            <View style={styles.centerContent}>
              <Text style={styles.errorTitle}>❌ Erro na análise</Text>
              <Text style={styles.errorMessage}>{error}</Text>
              <TouchableOpacity
                style={styles.retryButton}
                onPress={performAnalysis}
              >
                <Text style={styles.retryButtonText}>Tentar Novamente</Text>
              </TouchableOpacity>
            </View>
          ) : currentAnalysis ? (
            <ScrollView
              style={styles.content}
              contentContainerStyle={styles.contentContainer}
              keyboardShouldPersistTaps="handled"
            >
              {/* Habit Title */}
              <View style={styles.habitHeader}>
                <Text style={styles.habitTitle}>{habitTitle}</Text>
              </View>

              {/* Analysis Section */}
              <View style={styles.section}>
                <View style={styles.blockHeader}>
                  <Text style={styles.blockIcon}>📊</Text>
                  <Text style={styles.sectionTitle}>Análise de Padrões</Text>
                </View>
                <View style={styles.analysisBox}>
                  <Text style={styles.analysisText}>
                    {currentAnalysis.content}
                  </Text>
                </View>
              </View>

              {/* Impact Section */}
              {currentAnalysis.impact && (
                <View style={styles.impactSection}>
                  <Text style={styles.impactTitle}>💡 Impacto na Sua Vida</Text>
                  <Text style={styles.impactContent}>
                    {currentAnalysis.impact}
                  </Text>
                </View>
              )}

              {/* Recommendations */}
              {currentAnalysis.recommendations && currentAnalysis.recommendations.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>🎯 Recomendações</Text>
                  {currentAnalysis.recommendations.map((rec: string, idx: number) => (
                    <View key={idx} style={styles.recommendationItem}>
                      <Text style={styles.recommendationBullet}>•</Text>
                      <Text style={styles.recommendationText}>{rec}</Text>
                    </View>
                  ))}
                </View>
              )}

              {/* Insights */}
              {currentAnalysis.insights && currentAnalysis.insights.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>🔍 Descobertas</Text>
                  {currentAnalysis.insights.map((insight: string, idx: number) => (
                    <View key={idx} style={styles.insightItem}>
                      <Text style={styles.insightIcon}>→</Text>
                      <Text style={styles.insightText}>{insight}</Text>
                    </View>
                  ))}
                </View>
              )}
            </ScrollView>
          ) : (
            <View style={styles.centerContent}>
              <Text style={styles.noDataText}>Nenhuma análise disponível</Text>
            </View>
          )}

          {/* Footer Button */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.closeButtonFull}
              onPress={handleClose}
            >
              <Text style={styles.closeButtonFullText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#f9fafb',
    marginTop: Platform.OS === 'web' ? 40 : 60,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flexDirection: 'column',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 24,
    color: '#9ca3af',
    fontWeight: '300',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  analyzingText: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 12,
    textAlign: 'center',
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ef4444',
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
  habitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  habitTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    flex: 1,
  },
  motivationalCard: {
    backgroundColor: '#fef3c7',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
    flexDirection: 'row',
    alignItems: 'center',
  },
  blockHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  blockIcon: {
    fontSize: 24,
    marginRight: 8,
  },
  motivationalEmoji: {
    fontSize: 28,
    marginRight: 12,
  },
  motivationalText: {
    fontSize: 14,
    color: '#92400e',
    fontWeight: '500',
    flex: 1,
  },
  impactSection: {
    backgroundColor: '#fef3c7',
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  impactTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#92400e',
    marginBottom: 8,
  },
  impactContent: {
    fontSize: 14,
    lineHeight: 20,
    color: '#78350f',
  },
  recommendationItem: {
    flexDirection: 'row',
    marginBottom: 10,
    backgroundColor: '#f0fdf4',
    borderRadius: 8,
    padding: 12,
  },
  recommendationBullet: {
    color: '#10b981',
    fontWeight: '700',
    marginRight: 8,
    fontSize: 16,
  },
  recommendationText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: '#047857',
  },
  insightItem: {
    flexDirection: 'row',
    marginBottom: 10,
    backgroundColor: '#eef2ff',
    borderRadius: 8,
    padding: 12,
  },
  insightIcon: {
    color: '#6366f1',
    fontWeight: '700',
    marginRight: 8,
    fontSize: 14,
  },
  insightText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: '#4338ca',
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
  analysisBox: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  analysisText: {
    fontSize: 13,
    color: '#4b5563',
    lineHeight: 20,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  listBullet: {
    fontSize: 14,
    color: '#6366f1',
    marginRight: 8,
    fontWeight: '700',
  },
  listText: {
    fontSize: 13,
    color: '#4b5563',
    flex: 1,
    lineHeight: 18,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    backgroundColor: '#f0fdf4',
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#10b981',
  },
  suggestionNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#10b981',
    color: '#ffffff',
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '700',
    fontSize: 12,
    marginRight: 10,
  },
  suggestionText: {
    fontSize: 13,
    color: '#047857',
    flex: 1,
    lineHeight: 18,
  },
  recommendationItem: {
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    borderLeftWidth: 3,
  },
  recommendationItemEven: {
    backgroundColor: '#ede9fe',
    borderLeftColor: '#7c3aed',
  },
  recommendationItemOdd: {
    backgroundColor: '#dbeafe',
    borderLeftColor: '#0284c7',
  },
  recommendationText: {
    fontSize: 13,
    color: '#1f2937',
    lineHeight: 18,
  },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    backgroundColor: '#ffffff',
  },
  closeButtonFull: {
    backgroundColor: '#6366f1',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonFullText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  noDataText: {
    fontSize: 14,
    color: '#9ca3af',
  },
  typeBadge: {
    backgroundColor: '#dbeafe',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
  },
  typeBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1e40af',
  },
});
