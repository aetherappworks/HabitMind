import { useEffect } from 'react';
import { Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// Importar apenas em mobile
let Notifications: any = null;
if (Platform.OS !== 'web') {
  Notifications = require('expo-notifications');
}

/**
 * Hook para navegar para detalhes de hábito quando usuário toca notificação
 */
export function useNotificationNavigation() {
  const navigation = useNavigation<any>();

  const handleNotificationTapped = (notification: any) => {
    try {
      console.log('📍 [useNotificationNavigation] Processando notificação:', notification);
      
      const { data } = notification.request.content;
      
      // Se a notificação tem habitId, navegar para detalhes do hábito
      if (data?.habitId) {
        console.log('📍 [useNotificationNavigation] Navegando para hábito:', data.habitId);
        
        // Primeiro, navegar para a aba de hábitos
        navigation.navigate('HabitsTab' as any);
        
        // Depois navegar para detalhes do hábito
        setTimeout(() => {
          navigation.navigate('HabitDetail', { habitId: data.habitId });
        }, 100);
      }
    } catch (error) {
      console.error('❌ [useNotificationNavigation] Erro ao processar notificação:', error);
    }
  };

  return {
    handleNotificationTapped,
  };
}
