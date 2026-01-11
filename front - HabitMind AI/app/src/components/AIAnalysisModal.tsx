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
  } = useAIStore();

  useEffect(() => {
    if (visible && !currentAnalysis) {
      performAnalysis();
    }
  }, [visible]);

  const performAnalysis = async () => {
    try {
      console.log('🔍 [AIAnalysisModal] Iniciando análise...', { habitId, habitTitle });
      clearError();
      
      const payload = {
        habitId,
        type: 'pattern_analysis',
        context: habitTitle,
      };
      console.log('📤 [AIAnalysisModal] Payload enviado:', payload);
      
      await analyzeHabit(payload);
      
      console.log('✅ [AIAnalysisModal] Análise concluída com sucesso');
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
        duration={1500}
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
                <View style={styles.scoreContainer}>
                  <Text style={styles.scoreLabel}>Confiança</Text>
                  <Text style={styles.scoreValue}>
                    {Math.round(currentAnalysis.confidenceScore * 100)}%
                  </Text>
                </View>
              </View>

              {/* Analysis Section */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>📊 Análise de Padrões</Text>
                <View style={styles.analysisBox}>
                  <Text style={styles.analysisText}>
                    {currentAnalysis.content}
                  </Text>
                </View>
              </View>

              {/* Type Badge */}
              <View style={styles.section}>
                <View style={styles.typeBadge}>
                  <Text style={styles.typeBadgeText}>
                    Tipo: {currentAnalysis.type.replace('_', ' ').toUpperCase()}
                  </Text>
                </View>
              </View>

              {/* Credits Info */}
              <View style={styles.creditsInfo}>
                <Text style={styles.creditsLabel}>💳 Créditos Restantes:</Text>
                <Text style={styles.creditsValue}>{creditsRemaining}</Text>
              </View>
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
  scoreContainer: {
    backgroundColor: '#dbeafe',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  scoreLabel: {
    fontSize: 11,
    color: '#0369a1',
    fontWeight: '600',
  },
  scoreValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0369a1',
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
  creditsInfo: {
    backgroundColor: '#f3f4f6',
    borderRadius: 10,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  creditsLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6b7280',
  },
  creditsValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#6366f1',
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
