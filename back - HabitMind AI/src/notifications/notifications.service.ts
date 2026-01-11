import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { I18nService } from '../i18n/i18n.service';
import axios from 'axios';

interface PushNotification {
  to: string;
  title: string;
  body: string;
  data?: Record<string, string>;
}

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
  private readonly EXPO_PUSH_URL = 'https://exp.host/--/api/v2/push/send';

  constructor(
    private prisma: PrismaService,
    private i18n: I18nService,
  ) {}

  /**
   * Registra o token de notificação do dispositivo do usuário
   */
  async registerDeviceToken(userId: string, deviceToken: string) {
    return await this.prisma.user.update({
      where: { id: userId },
      data: { deviceToken },
      select: {
        id: true,
        deviceToken: true,
      },
    });
  }

  /**
   * Envia notificação push via Expo
   */
  async sendPushNotification(
    deviceToken: string,
    title: string,
    body: string,
    data?: Record<string, string>,
  ): Promise<boolean> {
    if (!deviceToken) {
      this.logger.warn('❌ Tentativa de enviar notificação sem deviceToken');
      return false;
    }

    try {
      const notification: PushNotification = {
        to: deviceToken,
        title,
        body,
        data,
      };

      this.logger.debug(`📤 Enviando notificação: ${title}`);
      
      const response = await axios.post(this.EXPO_PUSH_URL, [notification], {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });

      if (response.data && response.data[0]?.id) {
        this.logger.log(`✅ Notificação enviada com sucesso: ${response.data[0].id}`);
        return true;
      }

      this.logger.error('❌ Erro ao enviar notificação:', response.data);
      return false;
    } catch (error) {
      this.logger.error('❌ Erro ao enviar notificação push:', error.message);
      return false;
    }
  }

  /**
   * Verifica hábitos e envia lembretes 10 minutos antes da hora preferida
   * Executado a cada 5 minutos
   */
  @Cron(CronExpression.EVERY_5_MINUTES)
  async checkAndSendHabitReminders() {
    try {
      const now = new Date();

      // Busca todos os usuários com deviceToken e hábitos ativos
      const users = await this.prisma.user.findMany({
        where: {
          deviceToken: { not: null },
        },
        include: {
          habits: {
            where: { isActive: true },
          },
        },
      });

      for (const user of users) {
        for (const habit of user.habits) {
          if (!habit.preferredTime) continue;

          // Parse da hora preferida (formato HH:MM)
          const [prefHour, prefMinute] = habit.preferredTime.split(':').map(Number);

          // Verifica se é 10 minutos antes da hora preferida
          const reminderTime = new Date(now);
          reminderTime.setHours(prefHour, prefMinute - 10, 0, 0);

          const timeDiff = Math.abs(now.getTime() - reminderTime.getTime());
          const minutesDiff = timeDiff / (1000 * 60);

          // Se está dentro de 5 minutos da hora de lembrete (considerando intervalo de 5 min do cron)
          if (minutesDiff < 5) {
            await this.sendHabitReminder(user, habit);
          }
        }
      }
    } catch (error) {
      this.logger.error('❌ Erro ao verificar lembretes de hábitos:', error.message);
    }
  }

  /**
   * Envia lembrete de hábito
   */
  private async sendHabitReminder(user: any, habit: any) {
    try {
      const title = this.i18n.t('notifications.habit_reminder_title', 'pt-br');
      const body = this.i18n
        .t('notifications.habit_reminder_body', 'pt-br')
        .replace('{{habitName}}', habit.title);

      const sent = await this.sendPushNotification(
        user.deviceToken,
        title,
        body,
        {
          habitId: habit.id,
          type: 'habit_reminder',
        },
      );

      if (sent) {
        // Registra no log de notificações
        await this.prisma.notificationLog.create({
          data: {
            userId: user.id,
            habitId: habit.id,
            type: 'habit_reminder',
            title,
            body,
          },
        });

        this.logger.log(
          `✅ Lembrete enviado para ${user.email} - Hábito: ${habit.title}`,
        );
      }
    } catch (error) {
      this.logger.error('❌ Erro ao enviar lembrete de hábito:', error.message);
    }
  }

  /**
   * Busca histórico de notificações do usuário
   */
  async getNotificationHistory(userId: string, limit: number = 50) {
    return await this.prisma.notificationLog.findMany({
      where: { userId },
      orderBy: { sentAt: 'desc' },
      take: limit,
    });
  }

  /**
   * Marca notificação como visualizada
   */
  async markAsViewed(notificationId: string) {
    return await this.prisma.notificationLog.update({
      where: { id: notificationId },
      data: { viewed: true },
    });
  }
}
