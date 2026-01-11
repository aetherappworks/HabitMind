import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RateLimitService, CreditCost } from '../services/rate-limit.service';

@Injectable()
export class RateLimitGuard implements CanActivate {
  constructor(
    private rateLimitService: RateLimitService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    // Obter custo de créditos do metadata (padrão: 1 crédito)
    const creditCost =
      this.reflector.get<CreditCost>('creditCost', context.getHandler()) ||
      CreditCost.GET_INSIGHTS;

    const planType = user.planType || 'free';

    // Verificar se usuário tem créditos suficientes (verifica BD)
    const hasEnoughCredits = await this.rateLimitService.hasCredits(
      user.id,
      planType,
      creditCost,
    );

    if (!hasEnoughCredits) {
      const limitInfo = await this.rateLimitService.getCreditInfo(user.id, planType);
      const message = this.rateLimitService.getUpgradeMessage(planType);

      throw new ForbiddenException({
        message,
        credits: {
          limit: limitInfo.limit,
          used: limitInfo.used,
          remaining: limitInfo.remaining,
          resetTime: limitInfo.resetTime,
          resetType: limitInfo.resetType,
        },
      });
    }

    // Não debitar aqui! O ai.service.ts já faz isso
    // Apenas adicionar informações de limite aos headers da resposta
    const response = context.switchToHttp().getResponse();
    const limitInfo = await this.rateLimitService.getCreditInfo(user.id, planType);

    response.setHeader('X-RateLimit-Limit', limitInfo.limit);
    response.setHeader('X-RateLimit-Used', limitInfo.used);
    response.setHeader('X-RateLimit-Remaining', limitInfo.remaining);
    response.setHeader('X-RateLimit-Reset', limitInfo.resetTime.toISOString());
    response.setHeader('X-RateLimit-Type', `${limitInfo.resetType.toUpperCase()}_RESET`);
    response.setHeader('X-Credit-Cost', creditCost);

    return true;
  }
}
