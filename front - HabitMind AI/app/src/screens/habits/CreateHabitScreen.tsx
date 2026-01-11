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
import { useI18n } from '../../i18n/useI18n';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { shadows } from '../../styles/shadows';
import { colors } from '../../styles/colors';
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
  const { t } = useI18n();

  const hours = Array.from({ length: 24 }, (_, i) => 
    `${String(i).padStart(2, '0')}:00`
  );

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!title) newErrors.title = t('habits.errors.habit_name_required');

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

      setToastMessage(t('habits.messages.habit_created'));
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
          : t('common.errors.internal_error')
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
              label={t('habits.labels.habit_name')}
              placeholder={t('habits.placeholders.habit_name')}
              value={title}
              onChangeText={setTitle}
              error={errors.title}
              icon="fitness"
            />

            <Input
              label={t('habits.labels.description')}
              placeholder={t('habits.placeholders.description')}
              value={description}
              onChangeText={setDescription}
              multiline
              rows={3}
            />

            <View>
              <Text style={styles.label}>{t('habits.labels.frequency')}</Text>
              <View style={styles.frequencyTabs}>
                {[
                  { value: 'daily', label: 'Diário', icon: '📅' },
                  { value: 'weekly', label: 'Semanal', icon: '📆' },
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
              <Text style={styles.label}>{t('habits.labels.preferred_time')}</Text>
              <TouchableOpacity
                style={styles.timePickerButton}
                onPress={() => setShowTimePicker(true)}
                activeOpacity={0.7}
              >
                <Text style={styles.timePickerButtonText}>
                  {preferredTime ? `${preferredTime}` : t('habits.placeholders.select_time')}
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
                  <Text style={styles.modalTitle}>{t('habits.labels.select_time')}</Text>
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
                  <Text style={styles.modalCloseButtonFullText}>{t('ui.buttons.close')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          <View style={styles.buttons}>
            <Button
              title={t('ui.buttons.cancel')}
              onPress={() => navigation.goBack()}
              variant="secondary"
              size="medium"
            />
            <Button
              title={isLoading ? t('ui.buttons.loading') : t('habits.buttons.create')}
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
    backgroundColor: colors.background.default,
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
    color: colors.text.primary,
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
    borderColor: colors.border.light,
    backgroundColor: colors.background.card,
  },
  frequencyTabActive: {
    borderColor: colors.primary[500],
    backgroundColor: colors.primary[50],
  },
  frequencyTabLabel: {
    fontSize: 24,
    marginBottom: 4,
  },
  frequencyTabText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.text.secondary,
  },
  frequencyTabTextActive: {
    color: colors.primary[500],
    fontWeight: '600',
  },
  timePickerButton: {
    borderWidth: 2,
    borderColor: colors.border.light,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: colors.background.card,
    ...shadows.small,
  },
  timePickerButtonText: {
    fontSize: 14,
    color: colors.text.secondary,
    fontWeight: '500',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background.modal,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.background.card,
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
    borderBottomColor: colors.border.light,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  modalCloseButton: {
    fontSize: 24,
    color: colors.text.tertiary,
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
    borderColor: colors.border.light,
    backgroundColor: colors.background.secondary,
    alignItems: 'center',
  },
  hourButtonActive: {
    borderColor: colors.primary[500],
    backgroundColor: colors.primary[50],
  },
  hourButtonText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.text.secondary,
  },
  hourButtonTextActive: {
    color: colors.primary[500],
    fontWeight: '600',
  },
  modalCloseButtonFull: {
    backgroundColor: colors.primary[500],
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  modalCloseButtonFullText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.inverse,
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
    borderColor: colors.border.light,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: colors.background.card,
  },
  selectValue: {
    fontSize: 14,
    color: colors.text.primary,
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
  },
});
