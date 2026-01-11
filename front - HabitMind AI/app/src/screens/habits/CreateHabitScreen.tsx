import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { useHabitStore } from '../../store/habitStore';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { shadows } from '../../styles/shadows';
import { Toast } from '../../components/Toast';

export default function CreateHabitScreen({ navigation }: any) {
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [frequency, setFrequency] = React.useState('daily');
  const [preferredTime, setPreferredTime] = React.useState('');
  const [showTimePicker, setShowTimePicker] = React.useState(false);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [showToast, setShowToast] = React.useState(false);
  const [toastMessage, setToastMessage] = React.useState('');
  const [toastType, setToastType] = React.useState<'success' | 'error'>('success');
  const { createHabit, isLoading } = useHabitStore();

  const hours = Array.from({ length: 24 }, (_, i) => 
    `${String(i).padStart(2, '0')}:00`
  );

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!title) newErrors.title = 'Título é obrigatório';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreate = async () => {
    if (!validateForm()) return;

    try {
      await createHabit({
        title,
        description: description || undefined,
        frequency,
        preferredTime: preferredTime || undefined,
      });

      setToastMessage('✓ Hábito criado com sucesso!');
      setToastType('success');
      setShowToast(true);

      // Redireciona para home após 2 segundos
      setTimeout(() => {
        navigation.navigate('Dashboard');
      }, 2000);
    } catch (error) {
      setToastMessage(
        error instanceof Error
          ? error.message
          : 'Erro ao criar hábito'
      );
      setToastType('error');
      setShowToast(true);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Toast
        message={toastMessage}
        type={toastType}
        visible={showToast}
        duration={2000}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.form}>
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

            {/* Hora Preferida */}
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
          </View>

          {/* Time Picker Modal */}
          <Modal
            visible={showTimePicker}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setShowTimePicker(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Selecione o horário</Text>
                  <TouchableOpacity onPress={() => setShowTimePicker(false)}>
                    <Text style={styles.modalCloseButton}>✕</Text>
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
                  style={styles.modalCloseButtonFull}
                  onPress={() => setShowTimePicker(false)}
                >
                  <Text style={styles.modalCloseButtonFullText}>Fechar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          <View style={styles.buttons}>
            <Button
              title="Cancelar"
              onPress={() => navigation.goBack()}
              variant="secondary"
              size="medium"
            />
            <Button
              title={isLoading ? 'Criando...' : 'Criar Hábito'}
              onPress={handleCreate}
              disabled={isLoading}
              size="medium"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  flex: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  form: {
    gap: 16,
    marginBottom: 32,
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
    ...shadows.small,
  },
  timePickerButtonText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '80%',
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  modalCloseButton: {
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
  modalCloseButtonFull: {
    backgroundColor: '#6366f1',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  modalCloseButtonFullText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  column: {
    flex: 1,
  },
  selectWrapper: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
  },
  selectValue: {
    fontSize: 14,
    color: '#1f2937',
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
  },
});
