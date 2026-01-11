import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useHabitStore } from '../store/habitStore';
import { Input } from './Input';
import { Button } from './Button';
import { Toast } from './Toast';

interface HabitModalProps {
  visible: boolean;
  habitId?: string;
  onClose: () => void;
  onSuccess?: () => void;
}

export const HabitModal: React.FC<HabitModalProps> = ({
  visible,
  habitId,
  onClose,
  onSuccess,
}) => {
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [frequency, setFrequency] = React.useState('daily');
  const [preferredTime, setPreferredTime] = React.useState('');
  const [showTimePicker, setShowTimePicker] = React.useState(false);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [showToast, setShowToast] = React.useState(false);
  const [toastMessage, setToastMessage] = React.useState('');
  const [toastType, setToastType] = React.useState<'success' | 'error'>('success');
  const [isLoadingHabit, setIsLoadingHabit] = React.useState(false);
  const { createHabit, updateHabit, deleteHabit, isLoading, habits } = useHabitStore();

  const isEditing = !!habitId;
  const modalTitle = isEditing ? 'Editar Hábito' : 'Criar Novo Hábito';

  // Load habit data when modal opens in edit mode
  React.useEffect(() => {
    if (visible && isEditing && habitId) {
      setIsLoadingHabit(true);
      const habit = habits.find((h) => h.id === habitId);
      if (habit) {
        setTitle(habit.title);
        setDescription(habit.description || '');
        setFrequency(habit.frequency || 'daily');
        setPreferredTime(habit.preferredTime || '');
      }
      setIsLoadingHabit(false);
    }
  }, [visible, isEditing, habitId, habits]);

  const hours = Array.from({ length: 24 }, (_, i) => 
    `${String(i).padStart(2, '0')}:00`
  );

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setFrequency('daily');
    setPreferredTime('');
    setErrors({});
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!title) newErrors.title = 'Título é obrigatório';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      if (isEditing && habitId) {
        await updateHabit(habitId, {
          title,
          description: description || undefined,
          frequency,
          preferredTime: preferredTime || undefined,
        });
        setToastMessage('✓ Hábito atualizado com sucesso!');
      } else {
        await createHabit({
          title,
          description: description || undefined,
          frequency,
          preferredTime: preferredTime || undefined,
        });
        setToastMessage('✓ Hábito criado com sucesso!');
      }

      setToastType('success');
      setShowToast(true);

      setTimeout(() => {
        resetForm();
        onClose();
        onSuccess?.();
      }, 500);
    } catch (error) {
      setToastMessage(
        error instanceof Error ? error.message : 'Erro ao salvar hábito'
      );
      setToastType('error');
      setShowToast(true);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleDelete = () => {
    Alert.alert(
      'Deletar Hábito',
      `Tem certeza que deseja deletar o hábito "${title}"? Esta ação não pode ser desfeita.`,
      [
        {
          text: 'Cancelar',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Deletar',
          onPress: async () => {
            try {
              if (habitId) {
                await deleteHabit(habitId);
                setToastMessage('✓ Hábito deletado com sucesso!');
                setToastType('success');
                setShowToast(true);

                setTimeout(() => {
                  resetForm();
                  onClose();
                  onSuccess?.();
                }, 500);
              }
            } catch (error) {
              setToastMessage(
                error instanceof Error ? error.message : 'Erro ao deletar hábito'
              );
              setToastType('error');
              setShowToast(true);
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

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
            <Text style={styles.headerTitle}>{modalTitle}</Text>
            <View style={{ width: 40 }} />
          </View>

          {/* Content */}
          <ScrollView
            style={styles.content}
            contentContainerStyle={styles.contentContainer}
            keyboardShouldPersistTaps="handled"
          >
            <Input
              label="Título do Hábito"
              placeholder="Ex: Fazer exercício"
              value={title}
              onChangeText={setTitle}
              error={errors.title}
              icon="fitness"
            />

            <Input
              label="Descrição (opcional)"
              placeholder="Ex: 30 minutos de corrida"
              value={description}
              onChangeText={setDescription}
              multiline
              rows={3}
            />

            <View>
              <Text style={styles.label}>Frequência do Hábito</Text>
              <View style={styles.frequencyTabs}>
                {[
                  { value: 'daily', label: 'Diário', icon: '📅' },
                  { value: 'weekly', label: 'Semanal', icon: '📆' },
                  { value: 'custom', label: 'Customizado', icon: '⚙️' },
                ].map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.frequencyTab,
                      frequency === option.value && styles.frequencyTabActive,
                    ]}
                    onPress={() => setFrequency(option.value)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.frequencyTabLabel}>{option.icon}</Text>
                    <Text
                      style={[
                        styles.frequencyTabText,
                        frequency === option.value && styles.frequencyTabTextActive,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View>
              <Text style={styles.label}>Hora Preferida (opcional)</Text>
              <TouchableOpacity
                style={styles.timePickerButton}
                onPress={() => setShowTimePicker(true)}
                activeOpacity={0.7}
              >
                <Text style={styles.timePickerButtonText}>
                  {preferredTime ? `${preferredTime}` : '⏰ Selecionar horário'}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>

          {/* Time Picker Modal */}
          <Modal
            visible={showTimePicker}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setShowTimePicker(false)}
          >
            <View style={styles.timeModalContainer}>
              <View style={styles.timeModalContent}>
                <View style={styles.timeModalHeader}>
                  <Text style={styles.timeModalTitle}>Selecione o horário</Text>
                  <TouchableOpacity onPress={() => setShowTimePicker(false)}>
                    <Text style={styles.timeModalCloseButton}>✕</Text>
                  </TouchableOpacity>
                </View>

                <ScrollView style={styles.timeGrid} scrollEventThrottle={16}>
                  <View style={styles.hoursGrid}>
                    {hours.map((hour) => (
                      <TouchableOpacity
                        key={hour}
                        style={[
                          styles.hourButton,
                          preferredTime === hour && styles.hourButtonActive,
                        ]}
                        onPress={() => {
                          setPreferredTime(hour);
                          setShowTimePicker(false);
                        }}
                        activeOpacity={0.7}
                      >
                        <Text
                          style={[
                            styles.hourButtonText,
                            preferredTime === hour && styles.hourButtonTextActive,
                          ]}
                        >
                          {hour}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>

                <TouchableOpacity
                  style={styles.timeModalCloseButtonFull}
                  onPress={() => setShowTimePicker(false)}
                >
                  <Text style={styles.timeModalCloseButtonFullText}>Fechar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          {/* Buttons */}
          <View style={styles.buttons}>
            {isEditing && (
              <Button
                title="Deletar"
                onPress={handleDelete}
                variant="danger"
                size="medium"
              />
            )}
            <View style={styles.actionButtons}>
              <Button
                title="Cancelar"
                onPress={handleClose}
                variant="secondary"
                size="medium"
              />
              <Button
                title={isLoading ? 'Salvando...' : (isEditing ? 'Atualizar' : 'Criar')}
                onPress={handleSave}
                disabled={isLoading}
                size="medium"
              />
            </View>
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
    padding: 8,
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
    padding: 16,
    gap: 16,
    paddingBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  frequencyTabs: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'space-between',
  },
  frequencyTab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    backgroundColor: '#ffffff',
  },
  frequencyTabActive: {
    borderColor: '#6366f1',
    backgroundColor: '#eef2ff',
  },
  frequencyTabLabel: {
    fontSize: 24,
    marginBottom: 4,
  },
  frequencyTabText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6b7280',
  },
  frequencyTabTextActive: {
    color: '#6366f1',
    fontWeight: '600',
  },
  timePickerButton: {
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
  },
  timePickerButtonText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  timeModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  timeModalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '80%',
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  timeModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  timeModalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  timeModalCloseButton: {
    fontSize: 24,
    color: '#9ca3af',
    fontWeight: '300',
  },
  timeGrid: {
    maxHeight: '60%',
    marginVertical: 16,
  },
  hoursGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'space-between',
  },
  hourButton: {
    width: '23%',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    backgroundColor: '#f9fafb',
    alignItems: 'center',
  },
  hourButtonActive: {
    borderColor: '#6366f1',
    backgroundColor: '#eef2ff',
  },
  hourButtonText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6b7280',
  },
  hourButtonTextActive: {
    color: '#6366f1',
    fontWeight: '600',
  },
  timeModalCloseButtonFull: {
    backgroundColor: '#6366f1',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  timeModalCloseButtonFullText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    backgroundColor: '#ffffff',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
});
