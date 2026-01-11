import { SetMetadata } from '@nestjs/common';
import { CreditCost } from '../services/rate-limit.service';

/**
 * Decorator para indicar o custo de créditos de um endpoint
 * 
 * @example
 * @Post('analyze')
 * @CreditCostDecorator(CreditCost.ANALYZE_HABIT)
 * async analyzeHabit() { ... }
 */
export const CreditCostDecorator = (cost: CreditCost) =>
  SetMetadata('creditCost', cost);
