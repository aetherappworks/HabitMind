import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';

/**
 * Pesos de crédito por tipo de endpoint
 * Análise profunda = 3 créditos
 * Insights rápidos = 1 crédito
 */
export enum CreditCost {
  ANALYZE_HABIT = 3, // POST /ai/analyze - Análise profunda
  GET_INSIGHTS = 1,  // GET /ai/insights - Insights rápidos
}

interface ResetConfig {
  free: 'daily'; // Reset diário (00:00 UTC)
  premium: 'hourly'; // Reset por janela móvel (1 hora)
}

@Injectable()
export class RateLimitService {
  private freeLimits: number;
  private premiumLimits: number;
  private resetConfig: ResetConfig;

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    // Limites de créditos por plano
    this.freeLimits = parseInt(this.configService.get('RATE_LIMIT_FREE_CREDITS_DAY') || '20');
    this.premiumLimits = parseInt(this.configService.get('RATE_LIMIT_PREMIUM_CREDITS_HOUR') || '300');

    // Estratégia de reset por plano
    this.resetConfig = {
      free: 'daily',
      premium: 'hourly',
    };
  }

  /**
   * Verifica se o usuário tem créditos suficientes (verifica BD)
   * @param userId ID do usuário
   * @param planType Tipo de plano (free|premium)
   * @param creditCost Quantidade de créditos a debitar
   * @returns true se tem créditos, false caso contrário
   */
  async hasCredits(
    userId: string,
    planType: 'free' | 'premium',
    creditCost: CreditCost,
  ): Promise<boolean> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { availableCredits: true },
      });

      if (!user) {
        return false;
      }

      return user.availableCredits >= creditCost;
    } catch (error) {
      console.error('Erro ao verificar créditos:', error);
      return false;
    }
  }

  /**
   * Debita créditos da conta do usuário (não faz nada aqui, ai.service já faz)
   * @param userId ID do usuário
   * @param planType Tipo de plano (free|premium)
   * @param creditCost Quantidade de créditos a debitar
   */
  async debitCredits(
    userId: string,
    planType: 'free' | 'premium',
    creditCost: CreditCost,
  ): Promise<void> {
    try {
      // A debitar já é feita no ai.service.ts
      // Este método existe apenas para compatibilidade
      // Não fazer nada aqui pois o ai.service já atualiza o BD
    } catch (error) {
      console.error('Erro ao debitar créditos:', error);
    }
  }

  /**
   * Retorna informações detalhadas sobre créditos (verifica BD)
   */
  async getCreditInfo(
    userId: string,
    planType: 'free' | 'premium',
  ): Promise<{
    limit: number;
    used: number;
    remaining: number;
    resetTime: Date;
    resetType: 'daily' | 'hourly';
  }> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: {
          availableCredits: true,
          totalCredits: true,
          lastCreditRefillAt: true,
        },
      });

      if (!user) {
        return {
          limit: planType === 'free' ? this.freeLimits : this.premiumLimits,
          used: 0,
          remaining: planType === 'free' ? this.freeLimits : this.premiumLimits,
          resetTime: this.getNextResetTime(planType),
          resetType: this.resetConfig[planType],
        };
      }

      const limit = planType === 'free' ? this.freeLimits : this.premiumLimits;
      const used = (user.totalCredits || 0) - (user.availableCredits || 0);

      return {
        limit,
        used: Math.max(0, used),
        remaining: user.availableCredits || 0,
        resetTime: this.getNextResetTime(planType, user.lastCreditRefillAt),
        resetType: this.resetConfig[planType],
      };
    } catch (error) {
      console.error('Erro ao obter info de créditos:', error);
      return {
        limit: planType === 'free' ? this.freeLimits : this.premiumLimits,
        used: 0,
        remaining: planType === 'free' ? this.freeLimits : this.premiumLimits,
        resetTime: this.getNextResetTime(planType),
        resetType: this.resetConfig[planType],
      };
    }
  }

  /**
   * Retorna mensagem amigável de upgrade
   */
  getUpgradeMessage(planType: 'free' | 'premium'): string {
    if (planType === 'free') {
      return 'Você atingiu o limite diário de créditos. Upgrade para Premium para análises ilimitadas!';
    }
    return 'Você atingiu o limite de créditos dessa hora. Tente novamente na próxima.';
  }

  /**
   * Reseta créditos de um usuário manualmente (para testes)
   */
  async reset(userId: string, planType: 'free' | 'premium'): Promise<void> {
    try {
      const limit = planType === 'free' ? this.freeLimits : this.premiumLimits;
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          availableCredits: limit,
          lastCreditRefillAt: new Date(),
        },
      });
    } catch (error) {
      console.error('Erro ao resetar créditos:', error);
    }
  }

  /**
   * Calcula próximo tempo de reset baseado no tipo de plano
   */
  private getNextResetTime(
    planType: 'free' | 'premium',
    lastRefillAt?: Date,
  ): Date {
    const now = new Date();

    if (planType === 'free') {
      // Reset diário a meia-noite UTC
      const tomorrow = new Date(now);
      tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
      tomorrow.setUTCHours(0, 0, 0, 0);
      return tomorrow;
    } else {
      // Reset por janela móvel de 1 hora (baseado em lastRefillAt)
      if (lastRefillAt) {
        const nextReset = new Date(lastRefillAt);
        nextReset.setHours(nextReset.getHours() + 1);
        return nextReset > now ? nextReset : new Date(now.getTime() + 3600000);
      }
      return new Date(now.getTime() + 3600000);
    }
  }
}
