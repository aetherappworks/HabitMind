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
import { useHabitStore } from '../store/habitStore';
import { Toast } from './Toast';
import { shadows } from '../styles/shadows';

interface HabitSuggestionsModalProps {
  visible: boolean;
  onClose: () => void;
}

export const HabitSuggestionsModal: React.FC<HabitSuggestionsModalProps> = ({
  visible,
  onClose,
}) => {
  const [showToast, setShowToast] = React.useState(false);
  const [toastMessage, setToastMessage] = React.useState('');
  const [toastType, setToastType] = React.useState<'success' | 'error'>('success');

  const {
    suggestedHabits,
    isLoadingSuggestions,
    error,
    getSingleHabitSuggestion,
    clearError,
  } = useAIStore();

  const { loadCredits, user } = useAuthStore();
  const { createHabit } = useHabitStore();

  useEffect(() => {
    if (visible) {
      loadSuggestion();
    }
  }, [visible]);

  const loadSuggestion = async () => {
    try {
      console.log('🔄 [HabitSuggestionsModal] Gerando sugestão...');
      clearError();
      await getSingleHabitSuggestion();
      console.log('✅ [HabitSuggestionsModal] Sugestão gerada com sucesso');
    } catch (err) {
      console.error('❌ [HabitSuggestionsModal] Erro ao gerar sugestão:', err);
      const message = err instanceof Error ? err.message : 'Erro ao gerar sugestão';
      setToastMessage(`❌ ${message}`);
      setToastType('error');
      setShowToast(true);
    }
  };

  const handleCreateHabit = async (suggestion: any) => {
    try {
      await createHabit({
        title: suggestion.title,
        description: suggestion.reason,
        frequency: 'daily',
        preferredTime: '09:00',
      });

      // Atualizar créditos
      try {
        await loadCredits();
        console.log('💳 [HabitSuggestionsModal] Créditos atualizados');
      } catch (err) {
        console.warn('⚠️ [HabitSuggestionsModal] Erro ao atualizar créditos:', err);
      }

      setToastMessage(`✓ Hábito "${suggestion.title}" criado com sucesso!`);
      setToastType('success');
      setShowToast(true);

      setTimeout(() => {
        onClose();
      }, 500);
    } catch (err) {
      console.error('❌ Erro ao criar hábito:', err);
      setToastMessage('❌ Erro ao criar hábito');
      setToastType('error');
      setShowToast(true);
    }
  };

  const handleGenerateNew = () => {
    loadSuggestion();
  };

  const handleClose = () => {
    clearError();
    onClose();
  };

  const suggestion = suggestedHabits && suggestedHabits.length > 0 ? suggestedHabits[0] : null;

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
            <Text style={styles.headerTitle}>💡 Sugestão de Hábito</Text>
            <View style={{ width: 40 }} />
          </View>

          {/* Content */}
          {isLoadingSuggestions ? (
            <View style={styles.centerContent}>
              <ActivityIndicator size="large" color="#6366f1" />
              <Text style={styles.loadingText}>Gerando sugestão...</Text>
            </View>
          ) : error ? (
            <View style={styles.centerContent}>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity
                style={styles.retryButton}
                onPress={handleGenerateNew}
              >
                <Text style={styles.retryButtonText}>Tentar Novamente</Text>
              </TouchableOpacity>
            </View>
          ) : !suggestion ? (
            <View style={styles.centerContent}>
              <Text style={styles.emptyText}>
                Comece a rastrear hábitos para receber sugestões personalizadas!
              </Text>
            </View>
          ) : (
            <ScrollView
              contentContainerStyle={styles.content}
              showsVerticalScrollIndicator={false}
            >
              {/* Suggestion Card */}
              <View style={styles.suggestionCard}>
                {/* Header */}
                <View style={styles.cardHeader}>
                  <View style={styles.titleContainer}>
                    <Text style={styles.habitTitle}>{suggestion.title}</Text>
                    <View
                      style={[
                        styles.difficultyBadge,
                        {
                          backgroundColor:
                            suggestion.difficulty === 'easy'
                              ? '#d1fae5'
                              : suggestion.difficulty === 'medium'
                              ? '#fef3c7'
                              : '#fee2e2',
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.difficultyText,
                          {
                            color:
                              suggestion.difficulty === 'easy'
                                ? '#059669'
                                : suggestion.difficulty === 'medium'
                                ? '#d97706'
                                : '#dc2626',
                          },
                        ]}
                      >
                        {suggestion.difficulty === 'easy'
                          ? 'Fácil'
                          : suggestion.difficulty === 'medium'
                          ? 'Médio'
                          : 'Difícil'}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.confidenceBadge}>
                    <Text style={styles.confidenceText}>
                      {Math.round(suggestion.confidence * 100)}%
                    </Text>
                  </View>
                </View>

                {/* Related Habit */}
                <Text style={styles.relatedHabit}>
                  Relacionado a:{' '}
                  <Text style={styles.relatedHabitValue}>{suggestion.relatedHabit}</Text>
                </Text>

                {/* Reason */}
                <View style={styles.reasonSection}>
                  <Text style={styles.reasonLabel}>Por quê?</Text>
                  <Text style={styles.reasonText}>{suggestion.reason}</Text>
                </View>

                {/* Benefits */}
                <View style={styles.benefitsSection}>
                  <Text style={styles.benefitsLabel}>Benefícios:</Text>
                  {suggestion.benefits.map((benefit: string, index: number) => (
                    <View key={index} style={styles.benefitItem}>
                      <Text style={styles.benefitDot}>•</Text>
                      <Text style={styles.benefitText}>{benefit}</Text>
                    </View>
                  ))}
                </View>

                {/* Credits Info */}
                {user && (
                  <View style={styles.creditsInfo}>
                    <Text style={styles.creditsLabel}>
                      Créditos disponíveis: <Text style={styles.creditsValue}>{user.availableCredits}</Text>
                    </Text>
                  </View>
                )}
              </View>

              <View style={{ height: 20 }} />
            </ScrollView>
          )}

          {/* Action Buttons */}
          {!isLoadingSuggestions && suggestion && (
            <View style={styles.footerSection}>
              <TouchableOpacity
                style={styles.generateButton}
                onPress={handleGenerateNew}
              >
                <Text style={styles.generateButtonText}>🔄 Gerar Nova (2 créditos)</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.createButton}
                onPress={() => handleCreateHabit(suggestion)}
              >
                <Text style={styles.createButtonText}>+ Adicionar Hábito</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Close Button */}
          {!isLoadingSuggestions && !error && !suggestion && (
            <View style={styles.footerSection}>
              <TouchableOpacity
                style={styles.closeFullButton}
                onPress={handleClose}
              >
                <Text style={styles.closeFullButtonText}>Fechar</Text>
              </TouchableOpacity>
            </View>
          )}
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
    backgroundColor: '#ffffff',
    marginTop: 40,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 20,
    color: '#6b7280',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6b7280',
  },
  emptyText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  subtitle: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 16,
    lineHeight: 18,
  },
  suggestionCard: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    ...shadows.small,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleContainer: {
    flex: 1,
    marginRight: 12,
  },
  habitTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 8,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  difficultyText: {
    fontSize: 11,
    fontWeight: '600',
  },
  confidenceBadge: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  confidenceText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
  },
  relatedHabit: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 12,
  },
  relatedHabitValue: {
    fontWeight: '600',
    color: '#6366f1',
  },
  reasonSection: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  reasonLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 4,
  },
  reasonText: {
    fontSize: 13,
    color: '#374151',
    lineHeight: 18,
  },
  benefitsSection: {
    marginBottom: 12,
  },
  benefitsLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 8,
  },
  benefitItem: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  benefitDot: {
    fontSize: 14,
    color: '#6366f1',
    marginRight: 8,
    fontWeight: '600',
  },
  benefitText: {
    fontSize: 12,
    color: '#374151',
    flex: 1,
    lineHeight: 16,
  },
  creditsInfo: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    backgroundColor: '#f9fafb',
    padding: 10,
    borderRadius: 8,
  },
  creditsLabel: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  creditsValue: {
    fontWeight: '700',
    color: '#6366f1',
    fontSize: 14,
  },
  createButton: {
    backgroundColor: '#6366f1',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  createButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#ffffff',
  },
  generateButton: {
    backgroundColor: '#f59e0b',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    flex: 1,
  },
  generateButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#ffffff',
  },
  retryButton: {
    backgroundColor: '#6366f1',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginTop: 16,
  },
  retryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  errorText: {
    fontSize: 14,
    color: '#ef4444',
    textAlign: 'center',
  },
  footerSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    flexDirection: 'row',
    gap: 8,
  },
  closeFullButton: {
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeFullButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
});
