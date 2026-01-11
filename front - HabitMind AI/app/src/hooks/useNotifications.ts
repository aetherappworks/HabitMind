import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { NotificationService } from '../services/notificationService';
import { useAuthStore } from '../store/authStore';

interface NotificationHandlers {
  onNotificationReceived?: (notification: Notifications.Notification) => void;
  onNotificationTapped?: (notification: Notifications.Notification) => void;
}

/**
 * Hook para gerenciar notificações push do app
 * Deve ser chamado uma única vez no componente raiz (App.tsx ou similar)
 */
export function useNotifications(handlers?: NotificationHandlers) {
  const { user } = useAuthStore();

  useEffect(() => {
    const initializeNotifications = async () => {
      try {
        console.log('🔧 [useNotifications] Inicializando sistema de notificações');

        // Se usuário não está autenticado, não fazer nada
        if (!user) {
          console.log('⚠️ [useNotifications] Usuário não autenticado, pulando inicialização');
          return;
        }

        // 1. Obter device token
        const deviceToken = await NotificationService.getDeviceToken();
        if (!deviceToken) {
          console.warn('⚠️ [useNotifications] Falha ao obter device token');
          return;
        }

        // 2. Registrar token no backend
        try {
          await NotificationService.registerDeviceToken(deviceToken);
        } catch (error) {
          console.error('❌ [useNotifications] Erro ao registrar token:', error);
          // Não falhar, continuar mesmo se o registro falhar
        }

        // 3. Configurar handlers de notificações
        const subscriptions = NotificationService.setupNotificationHandlers(
          handlers?.onNotificationReceived,
          handlers?.onNotificationTapped,
        );

        console.log('✅ [useNotifications] Sistema de notificações inicializado');

        // Cleanup
        return () => {
          subscriptions.forEach((unsubscribe) => unsubscribe());
        };
      } catch (error) {
        console.error('❌ [useNotifications] Erro ao inicializar notificações:', error);
      }
    };

    initializeNotifications();
  }, [user, handlers]);
}
