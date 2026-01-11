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
import { colors } from '../styles/colors';
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
    backgroundColor: colors.background.default,
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
    borderBottomColor: colors.border.light,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 24,
    color: colors.text.tertiary,
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
    color: colors.text.tertiary,
    marginTop: 12,
    textAlign: 'center',
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.error[300],
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 14,
    color: colors.text.tertiary,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: colors.primary[500],
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: colors.text.inverse,
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
    borderBottomColor: colors.border.light,
  },
  habitTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
    flex: 1,
  },
  motivationalCard: {
    backgroundColor: colors.warning[50],
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: colors.warning[300],
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
    color: colors.warning[500],
    fontWeight: '500',
    flex: 1,
  },
  impactSection: {
    backgroundColor: colors.warning[50],
    borderLeftWidth: 4,
    borderLeftColor: colors.warning[300],
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  impactTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.warning[500],
    marginBottom: 8,
  },
  impactContent: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.warning[600],
  },
  recommendationItem: {
    flexDirection: 'row',
    marginBottom: 10,
    backgroundColor: colors.success[50],
    borderRadius: 8,
    padding: 12,
  },
  recommendationBullet: {
    color: colors.success[300],
    fontWeight: '700',
    marginRight: 8,
    fontSize: 16,
  },
  recommendationText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: colors.success[500],
  },
  insightItem: {
    flexDirection: 'row',
    marginBottom: 10,
    backgroundColor: colors.primary[50],
    borderRadius: 8,
    padding: 12,
  },
  insightIcon: {
    color: colors.primary[500],
    fontWeight: '700',
    marginRight: 8,
    fontSize: 14,
  },
  insightText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: colors.primary[600],
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 12,
  },
  analysisBox: {
    backgroundColor: colors.background.secondary,
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  analysisText: {
    fontSize: 13,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  listBullet: {
    fontSize: 14,
    color: colors.primary[500],
    marginRight: 8,
    fontWeight: '700',
  },
  listText: {
    fontSize: 13,
    color: colors.text.secondary,
    flex: 1,
    lineHeight: 18,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    backgroundColor: colors.success[50],
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: colors.success[300],
  },
  suggestionNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.success[300],
    color: colors.text.inverse,
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '700',
    fontSize: 12,
    marginRight: 10,
  },
  suggestionText: {
    fontSize: 13,
    color: colors.success[600],
    flex: 1,
    lineHeight: 18,
  },
  recommendationItemEven: {
    backgroundColor: colors.secondary[50],
    borderLeftColor: colors.secondary[300],
  },
  recommendationItemOdd: {
    backgroundColor: colors.tertiary[50],
    borderLeftColor: colors.tertiary[300],
  },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
    backgroundColor: colors.background.secondary,
  },
  closeButtonFull: {
    backgroundColor: colors.primary[500],
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonFullText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.inverse,
  },
  noDataText: {
    fontSize: 14,
    color: colors.neutral[400],
  },
  typeBadge: {
    backgroundColor: colors.tertiary[50],
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: colors.tertiary[300],
  },
  typeBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.tertiary[600],
  },
});
