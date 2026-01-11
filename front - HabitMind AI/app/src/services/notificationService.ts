import { Platform } from 'react-native';
import { apiClient } from './apiClient';

// Importar apenas em mobile
let Notifications: any = null;
if (Platform.OS !== 'web') {
  Notifications = require('expo-notifications');
}

/**
 * Serviço de gerenciamento de notificações push
 */
export class NotificationService {
  /**
   * Registra o device token no backend
   */
  static async registerDeviceToken(token: string): Promise<void> {
    try {
      console.log('📱 [NotificationService] Registrando device token:', token);
      await apiClient.post('/notifications/register-device', {
        deviceToken: token,
      });
      console.log('✅ [NotificationService] Device token registrado com sucesso');
    } catch (error) {
      console.error('❌ [NotificationService] Erro ao registrar device token:', error);
      throw error;
    }
  }

  /**
   * Verifica se notificações estão disponíveis (não em web)
   */
  private static isNotificationsAvailable(): boolean {
    return Platform.OS !== 'web' && Notifications !== null;
  }

  /**
   * Solicita permissão para enviar notificações
   */
  static async requestPermission(): Promise<boolean> {
    try {
      if (!this.isNotificationsAvailable()) {
        console.warn('⚠️ [NotificationService] Notificações não disponíveis nesta plataforma');
        return false;
      }

      console.log('🔔 [NotificationService] Solicitando permissão de notificações');
      const { status } = await Notifications.requestPermissionsAsync();
      
      if (status === 'granted') {
        console.log('✅ [NotificationService] Permissão concedida');
        return true;
      }
      
      console.warn('⚠️ [NotificationService] Permissão negada ou pendente');
      return false;
    } catch (error) {
      console.error('❌ [NotificationService] Erro ao solicitar permissão:', error);
      return false;
    }
  }

  /**
   * Obtém o token de notificação do dispositivo
   */
  static async getDeviceToken(): Promise<string | null> {
    try {
      if (!this.isNotificationsAvailable()) {
        console.warn('⚠️ [NotificationService] Notificações não disponíveis nesta plataforma');
        return null;
      }

      console.log('🔍 [NotificationService] Obtendo device token');
      
      const permission = await this.requestPermission();
      if (!permission) {
        console.warn('❌ [NotificationService] Permissão não concedida');
        return null;
      }

      const token = await Notifications.getExpoPushTokenAsync();
      
      if (!token.data) {
        console.error('❌ [NotificationService] Falha ao obter token');
        return null;
      }

      console.log('✅ [NotificationService] Token obtido:', token.data);
      return token.data;
    } catch (error) {
      console.error('❌ [NotificationService] Erro ao obter device token:', error);
      return null;
    }
  }

  /**
   * Configura handlers de notificações
   */
  static setupNotificationHandlers(
    onNotificationReceived?: (notification: any) => void,
    onNotificationTapped?: (notification: any) => void,
  ): (() => void)[] {
    if (!this.isNotificationsAvailable()) {
      console.warn('⚠️ [NotificationService] Handlers de notificação não disponíveis nesta plataforma');
      return [];
    }

    const subscriptions: (() => void)[] = [];

    // Configurar comportamento de notificações enquanto app está em foreground
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });

    // Listener para quando notificação é recebida
    if (onNotificationReceived) {
      const receivedSubscription = Notifications.addNotificationReceivedListener(
        (notification: any) => {
          console.log('📬 [NotificationService] Notificação recebida:', notification);
          onNotificationReceived(notification);
        },
      );
      subscriptions.push(() => receivedSubscription.remove());
    }

    // Listener para quando usuário toca na notificação
    if (onNotificationTapped) {
      const responseSubscription = Notifications.addNotificationResponseReceivedListener(
        (response: any) => {
          console.log('👆 [NotificationService] Notificação tocada:', response.notification);
          onNotificationTapped(response.notification);
        },
      );
      subscriptions.push(() => responseSubscription.remove());
    }

    return subscriptions;
  }

  /**
   * Busca histórico de notificações do usuário
   */
  static async getNotificationHistory(limit: number = 50): Promise<any[]> {
    try {
      console.log('📋 [NotificationService] Buscando histórico de notificações');
      const response = await apiClient.get('/notifications/history', {
        params: { limit },
      });
      return response.data;
    } catch (error) {
      console.error('❌ [NotificationService] Erro ao buscar histórico:', error);
      return [];
    }
  }

  /**
   * Marca notificação como visualizada
   */
  static async markAsViewed(notificationId: string): Promise<void> {
    try {
      console.log('✓ [NotificationService] Marcando notificação como visualizada:', notificationId);
      await apiClient.post(`/notifications/mark-viewed/${notificationId}`);
    } catch (error) {
      console.error('❌ [NotificationService] Erro ao marcar como visualizada:', error);
    }
  }
}
