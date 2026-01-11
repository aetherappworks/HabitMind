import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { shadows } from '../styles/shadows';
import { Toast } from './Toast';
import dayjs from 'dayjs';

interface CheckInModalProps {
  visible: boolean;
  habitId: string;
  habitTitle: string;
  onComplete: () => Promise<void>;
  onSkip: () => Promise<void>;
  onAnalyze?: () => void;
  onClose: () => void;
  isLoading?: boolean;
  completedToday?: boolean;
  skippedToday?: boolean;
}

export const CheckInModal: React.FC<CheckInModalProps> = ({
  visible,
  habitId,
  habitTitle,
  onComplete,
  onSkip,
  onAnalyze,
  onClose,
  isLoading = false,
  completedToday = false,
  skippedToday = false,
}) => {
  const [loading, setLoading] = React.useState(false);
  const [showToast, setShowToast] = React.useState(false);
  const [toastMessage, setToastMessage] = React.useState('');
  const [toastType, setToastType] = React.useState<'success' | 'error'>('success');

  React.useEffect(() => {
    if (visible) {
      // Modal aberto
    }
  }, [visible, completedToday, skippedToday]);

  const handleComplete = async () => {
    if (completedToday) {
      setToastMessage('Este hábito já foi completado hoje! 🎉');
      setToastType('error');
      setShowToast(true);
      return;
    }

    setLoading(true);
    try {
      await onComplete();
      setToastMessage('✓ Hábito completado com sucesso!');
      setToastType('success');
      setShowToast(true);
      setTimeout(() => {
        onClose();
      }, 500);
    } catch (error) {
      setToastMessage(
        error instanceof Error ? error.message : 'Erro ao completar hábito'
      );
      setToastType('error');
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = async () => {
    if (skippedToday) {
      setToastMessage('Este hábito já foi pulado hoje! ⏭️');
      setToastType('error');
      setShowToast(true);
      return;
    }

    setLoading(true);
    try {
      await onSkip();
      setToastMessage('⏭️ Hábito pulado com sucesso!');
      setToastType('success');
      setShowToast(true);
      setTimeout(() => {
        onClose();
      }, 500);
    } catch (error) {
      setToastMessage(
        error instanceof Error ? error.message : 'Erro ao pular hábito'
      );
      setToastType('error');
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <Toast
        message={toastMessage}
        type={toastType}
        visible={showToast}
        duration={500}
      />
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Close Button */}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
            disabled={loading}
          >
            <Ionicons name="close" size={24} color="#9ca3af" />
          </TouchableOpacity>

          {/* Content */}
          <View style={styles.content}>
            <View style={styles.iconContainer}>
              <Ionicons name="checkmark-circle" size={56} color="#6366f1" />
            </View>

            <Text style={styles.title}>Check-in: {habitTitle}</Text>
            <Text style={styles.description}>
              O que você gostaria de fazer com este hábito hoje?
            </Text>

            {/* Buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[
                  styles.button,
                  styles.completeButton,
                  (loading || completedToday) && styles.buttonDisabled,
                ]}
                onPress={handleComplete}
                disabled={loading || completedToday}
                activeOpacity={0.8}
              >
                {loading ? (
                  <ActivityIndicator color="#ffffff" size="small" />
                ) : (
                  <>
                    <Ionicons name="checkmark" size={20} color="#ffffff" />
                    <Text style={styles.buttonText}>
                      {completedToday ? 'Completado hoje' : 'Completar'}
                    </Text>
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.button,
                  styles.skipButton,
                  (loading || skippedToday) && styles.buttonDisabled,
                ]}
                onPress={handleSkip}
                disabled={loading || skippedToday}
                activeOpacity={0.8}
              >
                {loading ? (
                  <ActivityIndicator color="#6b7280" size="small" />
                ) : (
                  <>
                    <Ionicons name="close" size={20} color="#6b7280" />
                    <Text style={[styles.skipButtonText, skippedToday && { color: '#d1d5db' }]}>
                      {skippedToday ? 'Pulado hoje' : 'Pular'}
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>

            {/* AI Analysis Button */}
            {onAnalyze && completedToday && (
              <TouchableOpacity
                style={styles.analyzeButton}
                onPress={onAnalyze}
                disabled={loading}
                activeOpacity={0.8}
              >
                <Ionicons name="sparkles" size={18} color="#6366f1" />
                <Text style={styles.analyzeButtonText}>
                  Analisar com IA
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    width: '85%',
    maxWidth: 400,
    ...shadows.large,
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    padding: 8,
    zIndex: 10,
  },
  content: {
    alignItems: 'center',
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#eef2ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 24,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    gap: 8,
  },
  completeButton: {
    backgroundColor: '#10b981',
  },
  skipButton: {
    backgroundColor: '#f3f4f6',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
  },
  skipButtonText: {
    color: '#6b7280',
    fontSize: 15,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  analyzeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#6366f1',
    backgroundColor: '#f0f9ff',
  },
  analyzeButtonText: {
    color: '#6366f1',
    fontSize: 14,
    fontWeight: '600',
  },
});
