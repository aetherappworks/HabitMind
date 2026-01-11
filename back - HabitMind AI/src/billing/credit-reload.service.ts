import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { I18nService } from '../i18n/i18n.service';

/**
 * Tipos de recarga de créditos disponíveis
 */
export enum ReloadType {
  DAILY_RESET = 'daily_reset',           // Reset diário automático
  PREMIUM_HOURLY = 'premium_hourly',     // Reset por hora para premium
  MANUAL_PURCHASE = 'manual_purchase',   // Compra manual de créditos
  AD_REWARD = 'ad_reward',               // Recompensa por assistir ads
  BONUS_PROMO = 'bonus_promo',           // Bônus promocional
}

/**
 * Configuração de créditos por plano
 */
export interface CreditConfig {
  planType: 'free' | 'premium';
  dailyLimit: number;
  hourlyLimit?: number;
  resetStrategy: 'daily' | 'hourly' | 'manual';
}

/**
 * Histórico de recarga de créditos
 */
export interface CreditReloadHistory {
  userId: string;
  reloadType: ReloadType;
  amount: number;
  previousBalance: number;
  newBalance: number;
  metadata?: Record<string, any>;
  timestamp: Date;
}

@Injectable()
export class CreditReloadService {
  private readonly creditConfigs: Map<string, CreditConfig> = new Map([
    ['free', {
      planType: 'free',
      dailyLimit: 20,
      resetStrategy: 'daily',
    }],
    ['premium', {
      planType: 'premium',
      dailyLimit: 300,
      hourlyLimit: 300,
      resetStrategy: 'hourly',
    }],
  ]);

  private readonly reloadHistory: CreditReloadHistory[] = [];

  constructor(
    private prisma: PrismaService,
    private i18n: I18nService,
  ) {
    // Inicializar resets automáticos
    this.initializeAutoResets();
  }

  /**
   * Inicializa os resets automáticos
   * - Daily reset para plano Free (00:00 UTC)
   * - Hourly reset para plano Premium
   */
  private initializeAutoResets(): void {
    // Reset diário para Free
    this.scheduleDailyReset();

    // Reset horário para Premium
    this.scheduleHourlyReset();
  }

  /**
   * Agenda reset diário para usuários Free
   */
  private scheduleDailyReset(): void {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setUTCHours(24, 0, 0, 0);
    const timeUntilReset = tomorrow.getTime() - now.getTime();

    setTimeout(() => {
      this.performDailyReset();
      // Agenda o próximo reset para 24h depois
      setInterval(() => this.performDailyReset(), 24 * 60 * 60 * 1000);
    }, timeUntilReset);
  }

  /**
   * Agenda reset horário para usuários Premium
   */
  private scheduleHourlyReset(): void {
    setInterval(() => this.performHourlyReset(), 60 * 60 * 1000);
  }

  /**
   * Realiza reset diário para todos os usuários Free
   */
  private async performDailyReset(): Promise<void> {
    try {
      const config = this.creditConfigs.get('free');
      if (!config) return;

      const freeUsers = await this.prisma.user.findMany({
        where: { planType: 'free' },
        select: { id: true, availableCredits: true },
      });

      for (const user of freeUsers) {
        const previousBalance = user.availableCredits;
        const newBalance = config.dailyLimit;

        await this.prisma.user.update({
          where: { id: user.id },
          data: {
            availableCredits: newBalance,
            lastCreditRefillAt: new Date(),
          },
        });

        this.recordHistory({
          userId: user.id,
          reloadType: ReloadType.DAILY_RESET,
          amount: newBalance - previousBalance,
          previousBalance,
          newBalance,
          timestamp: new Date(),
        });
      }

      console.log(`[DAILY RESET] ${freeUsers.length} usuários Free receberam reset de créditos`);
    } catch (error) {
      console.error('[DAILY RESET ERROR]', error);
    }
  }

  /**
   * Realiza reset horário para usuários Premium com janela móvel
   */
  private async performHourlyReset(): Promise<void> {
    try {
      const config = this.creditConfigs.get('premium');
      if (!config) return;

      // Encontrar usuários premium cuja última refill foi há mais de 1 hora
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

      const premiumUsers = await this.prisma.user.findMany({
        where: {
          planType: 'premium',
          OR: [
            { lastCreditRefillAt: null },
            { lastCreditRefillAt: { lt: oneHourAgo } },
          ],
        },
        select: { id: true, availableCredits: true, lastCreditRefillAt: true },
      });

      for (const user of premiumUsers) {
        const previousBalance = user.availableCredits;
        const newBalance = config.dailyLimit;

        await this.prisma.user.update({
          where: { id: user.id },
          data: {
            availableCredits: newBalance,
            lastCreditRefillAt: new Date(),
          },
        });

        const reloadAmount = newBalance - previousBalance;
        if (reloadAmount > 0) {
          this.recordHistory({
            userId: user.id,
            reloadType: ReloadType.PREMIUM_HOURLY,
            amount: reloadAmount,
            previousBalance,
            newBalance,
            timestamp: new Date(),
          });
        }
      }

      if (premiumUsers.length > 0) {
        console.log(`[HOURLY RESET] ${premiumUsers.length} usuários Premium receberam reset de créditos`);
      }
    } catch (error) {
      console.error('[HOURLY RESET ERROR]', error);
    }
  }

  /**
   * Recarrega créditos manualmente para um usuário (compra)
   */
  async reloadCreditsManual(
    userId: string,
    amount: number,
    lang: string = 'pt-br',
  ): Promise<any> {
    if (amount <= 0) {
      throw new BadRequestException(
        this.i18n.t('credits.errors.invalid_amount', lang) || 'Quantidade deve ser maior que 0',
      );
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, availableCredits: true, totalCredits: true, planType: true },
    });

    if (!user) {
      throw new NotFoundException(
        this.i18n.t('users.errors.user_not_found', lang),
      );
    }

    const previousBalance = user.availableCredits;
    const newBalance = previousBalance + amount;

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        availableCredits: newBalance,
        totalCredits: user.totalCredits + amount,
        lastCreditRefillAt: new Date(),
      },
      select: {
        id: true,
        availableCredits: true,
        totalCredits: true,
        planType: true,
        lastCreditRefillAt: true,
      },
    });

    this.recordHistory({
      userId,
      reloadType: ReloadType.MANUAL_PURCHASE,
      amount,
      previousBalance,
      newBalance,
      metadata: { planType: user.planType },
      timestamp: new Date(),
    });

    return {
      success: true,
      message: this.i18n.t('credits.success.manual_reload', lang) || 'Créditos recarregados com sucesso',
      credits: updatedUser,
    };
  }

  /**
   * Adiciona recompensa por visualização de anúncio
   */
  async addAdReward(
    userId: string,
    amount: number,
    adType: string,
    lang: string = 'pt-br',
  ): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, availableCredits: true, totalCredits: true },
    });

    if (!user) {
      throw new NotFoundException(
        this.i18n.t('users.errors.user_not_found', lang),
      );
    }

    const previousBalance = user.availableCredits;
    const newBalance = previousBalance + amount;

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        availableCredits: newBalance,
        totalCredits: user.totalCredits + amount,
      },
      select: {
        id: true,
        availableCredits: true,
        totalCredits: true,
      },
    });

    this.recordHistory({
      userId,
      reloadType: ReloadType.AD_REWARD,
      amount,
      previousBalance,
      newBalance,
      metadata: { adType },
      timestamp: new Date(),
    });

    return {
      success: true,
      credits: updatedUser,
    };
  }

  /**
   * Adiciona bônus promocional (admin only)
   */
  async addPromoBonus(
    userId: string,
    amount: number,
    reason: string,
    lang: string = 'pt-br',
  ): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, availableCredits: true, totalCredits: true },
    });

    if (!user) {
      throw new NotFoundException(
        this.i18n.t('users.errors.user_not_found', lang),
      );
    }

    const previousBalance = user.availableCredits;
    const newBalance = previousBalance + amount;

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        availableCredits: newBalance,
        totalCredits: user.totalCredits + amount,
        lastCreditRefillAt: new Date(),
      },
      select: {
        id: true,
        availableCredits: true,
        totalCredits: true,
      },
    });

    this.recordHistory({
      userId,
      reloadType: ReloadType.BONUS_PROMO,
      amount,
      previousBalance,
      newBalance,
      metadata: { reason },
      timestamp: new Date(),
    });

    return {
      success: true,
      message: this.i18n.t('credits.success.bonus_added', lang) || 'Bônus adicionado com sucesso',
      credits: updatedUser,
    };
  }

  /**
   * Obtém informações de recarga para um usuário
   */
  async getReloadInfo(
    userId: string,
    lang: string = 'pt-br',
  ): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        availableCredits: true,
        totalCredits: true,
        planType: true,
        lastCreditRefillAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException(
        this.i18n.t('users.errors.user_not_found', lang),
      );
    }

    const config = this.creditConfigs.get(user.planType);
    const nextReset = this.calculateNextReset(user.planType, user.lastCreditRefillAt);
    const timeUntilReset = nextReset.getTime() - Date.now();

    return {
      user: {
        id: user.id,
        planType: user.planType,
        availableCredits: user.availableCredits,
        totalCredits: user.totalCredits,
      },
      config: {
        limit: config?.dailyLimit || 0,
        strategy: config?.resetStrategy || 'manual',
      },
      nextReset: {
        time: nextReset,
        hoursUntilReset: Math.floor(timeUntilReset / (1000 * 60 * 60)),
        minutesUntilReset: Math.floor((timeUntilReset % (1000 * 60 * 60)) / (1000 * 60)),
      },
      history: this.getHistoryForUser(userId).slice(-10), // Últimas 10 recargas
    };
  }

  /**
   * Força uma recarga de créditos manual (para testes/admin)
   */
  async forceReload(
    userId: string,
    lang: string = 'pt-br',
  ): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, availableCredits: true, planType: true, lastCreditRefillAt: true },
    });

    if (!user) {
      throw new NotFoundException(
        this.i18n.t('users.errors.user_not_found', lang),
      );
    }

    const config = this.creditConfigs.get(user.planType);
    if (!config) {
      throw new BadRequestException('Configuração de plano inválida');
    }

    // Verificar se já foi recarregado recentemente
    if (user.lastCreditRefillAt) {
      const hoursSinceLastReload = (Date.now() - user.lastCreditRefillAt.getTime()) / (1000 * 60 * 60);
      if (user.planType === 'free' && hoursSinceLastReload < 24) {
        throw new ForbiddenException(
          `Você já recarregou créditos hoje. Próxima recarga em ${Math.ceil(24 - hoursSinceLastReload)}h`,
        );
      }
      if (user.planType === 'premium' && hoursSinceLastReload < 1) {
        throw new ForbiddenException(
          `Você já recarregou créditos. Próxima recarga em ${Math.ceil(60 - (hoursSinceLastReload * 60))}min`,
        );
      }
    }

    const previousBalance = user.availableCredits;
    const newBalance = config.dailyLimit;
    const reloadAmount = newBalance - previousBalance;

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        availableCredits: newBalance,
        lastCreditRefillAt: new Date(),
      },
      select: {
        id: true,
        availableCredits: true,
        totalCredits: true,
        lastCreditRefillAt: true,
      },
    });

    this.recordHistory({
      userId,
      reloadType: user.planType === 'free' ? ReloadType.DAILY_RESET : ReloadType.PREMIUM_HOURLY,
      amount: reloadAmount,
      previousBalance,
      newBalance,
      timestamp: new Date(),
    });

    return {
      success: true,
      message: this.i18n.t('credits.success.force_reload', lang) || 'Créditos recarregados com sucesso',
      credits: updatedUser,
      reloadAmount,
    };
  }

  /**
   * Calcula próximo tempo de reset
   */
  private calculateNextReset(planType: string, lastRefillAt: Date | null): Date {
    const now = new Date();

    if (planType === 'free') {
      // Próximo reset às 00:00 UTC
      const tomorrow = new Date(now);
      tomorrow.setUTCHours(24, 0, 0, 0);
      return tomorrow;
    } else {
      // Próximo reset em 1 hora desde a última recarga
      if (lastRefillAt) {
        const nextHour = new Date(lastRefillAt.getTime() + 60 * 60 * 1000);
        if (nextHour > now) return nextHour;
      }
      // Se nunca foi recarregado ou passou do tempo, próximo reset é agora + 1h
      return new Date(now.getTime() + 60 * 60 * 1000);
    }
  }

  /**
   * Registra histórico de recarga
   */
  private recordHistory(history: CreditReloadHistory): void {
    this.reloadHistory.push(history);
    // Manter apenas os últimos 1000 registros em memória
    if (this.reloadHistory.length > 1000) {
      this.reloadHistory.shift();
    }
  }

  /**
   * Obtém histórico para um usuário
   */
  private getHistoryForUser(userId: string): CreditReloadHistory[] {
    return this.reloadHistory.filter(h => h.userId === userId);
  }

  /**
   * Obtém configuração de créditos de um plano
   */
  getCreditConfig(planType: 'free' | 'premium'): CreditConfig | undefined {
    return this.creditConfigs.get(planType);
  }

  /**
   * Atualiza configuração de créditos (admin)
   */
  updateCreditConfig(planType: 'free' | 'premium', config: Partial<CreditConfig>): void {
    const existing = this.creditConfigs.get(planType);
    if (existing) {
      this.creditConfigs.set(planType, { ...existing, ...config });
    }
  }
}
