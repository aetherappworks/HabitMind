import { IsNumber, IsString, IsOptional, Min, Max, IsEnum } from 'class-validator';

export enum ReloadTypeEnum {
  DAILY_RESET = 'daily_reset',
  PREMIUM_HOURLY = 'premium_hourly',
  MANUAL_PURCHASE = 'manual_purchase',
  AD_REWARD = 'ad_reward',
  BONUS_PROMO = 'bonus_promo',
}

/**
 * DTO para recarga manual de créditos
 */
export class ManualReloadDto {
  @IsNumber()
  @Min(1)
  @Max(10000)
  amount: number;

  @IsString()
  @IsOptional()
  reason?: string;
}

/**
 * DTO para recompensa por anúncio
 */
export class AdRewardDto {
  @IsNumber()
  @Min(1)
  amount: number;

  @IsString()
  adType: string; // 'banner' | 'interstitial' | 'rewarded'

  @IsString()
  @IsOptional()
  validationToken?: string;
}

/**
 * DTO para bônus promocional (admin)
 */
export class PromoBonusDto {
  @IsNumber()
  @Min(1)
  @Max(50000)
  amount: number;

  @IsString()
  reason: string;

  @IsString()
  @IsOptional()
  adminNote?: string;
}

/**
 * DTO de resposta com informações de créditos
 */
export class CreditInfoResponseDto {
  id: string;
  availableCredits: number;
  totalCredits: number;
  planType: string;
  lastCreditRefillAt?: Date;
}

/**
 * DTO de resposta detalhada de recarga
 */
export class ReloadResponseDto {
  success: boolean;
  message?: string;
  credits: CreditInfoResponseDto;
  reloadAmount?: number;
  nextReset?: {
    time: Date;
    hoursUntilReset: number;
    minutesUntilReset: number;
  };
}

/**
 * DTO para obter informações de recarga
 */
export class ReloadInfoResponseDto {
  user: {
    id: string;
    planType: string;
    availableCredits: number;
    totalCredits: number;
  };
  config: {
    limit: number;
    strategy: 'daily' | 'hourly' | 'manual';
  };
  nextReset: {
    time: Date;
    hoursUntilReset: number;
    minutesUntilReset: number;
  };
  history: Array<{
    reloadType: string;
    amount: number;
    timestamp: Date;
  }>;
}

/**
 * DTO para configuração de créditos (admin)
 */
export class CreditConfigDto {
  @IsEnum(['free', 'premium'])
  planType: 'free' | 'premium';

  @IsNumber()
  @Min(1)
  dailyLimit: number;

  @IsNumber()
  @IsOptional()
  @Min(1)
  hourlyLimit?: number;

  @IsEnum(['daily', 'hourly', 'manual'])
  @IsOptional()
  resetStrategy?: 'daily' | 'hourly' | 'manual';
}
