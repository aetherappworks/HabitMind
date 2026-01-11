import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { shadows } from '../styles/shadows';
import { Habit } from '../services/habitService';

interface HabitCardProps {
  habit: Habit;
  onPress: () => void;
  onEdit?: () => void;
  completedToday?: boolean;
  skippedToday?: boolean;
}

export const HabitCard: React.FC<HabitCardProps> = ({
  habit,
  onPress,
  onEdit,
  completedToday = false,
  skippedToday = false,
}) => {
  const getFrequencyLabel = (frequency: string) => {
    const labels: Record<string, string> = {
      daily: 'Diário',
      weekly: 'Semanal',
      custom: 'Personalizado',
    };
    return labels[frequency] || frequency;
  };

  const getStatusColor = () => {
    if (completedToday) return '#10b981'; // Verde para completado
    if (skippedToday) return '#f59e0b'; // Laranja para pulado
    if (!habit.active) return '#ef4444';
    return '#6366f1';
  };

  const getStatusIcon = () => {
    if (completedToday) return 'checkmark-circle';
    if (skippedToday) return 'close-circle';
    if (!habit.active) return 'close-circle';
    return 'circle-outline';
  };

  const getBackgroundColor = () => {
    if (completedToday) return '#f0fdf4'; // Verde claro
    if (skippedToday) return '#fffbeb'; // Amarelo/laranja claro
    return '#ffffff';
  };

  React.useEffect(() => {
    const color = getBackgroundColor();
    const borderColor = getStatusColor();
  }, [completedToday, skippedToday]);

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          borderLeftColor: getStatusColor(),
          backgroundColor: getBackgroundColor(),
        },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{habit.title}</Text>
          {onEdit && (
            <TouchableOpacity onPress={onEdit} style={styles.editButton}>
              <Ionicons name="pencil-outline" size={18} color="#6366f1" />
            </TouchableOpacity>
          )}
        </View>
        {habit.description && (
          <Text style={styles.description}>{habit.description}</Text>
        )}
        <View style={styles.footer}>
          <Text style={styles.frequency}>
            {getFrequencyLabel(habit.frequency)}
          </Text>
        </View>
      </View>
      <View style={styles.status}>
        <Ionicons
          name={getStatusIcon() as any}
          size={28}
          color={getStatusColor()}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderLeftWidth: 4,
    ...shadows.small,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    flex: 1,
  },
  editButton: {
    padding: 8,
    marginRight: -8,
  },
  description: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  frequency: {
    fontSize: 11,
    color: '#9ca3af',
  },
  status: {
    paddingLeft: 16,
    justifyContent: 'center',
  },
});
