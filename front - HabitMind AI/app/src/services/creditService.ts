import { apiClient } from './apiClient';

export interface UserCredits {
  id: string;
  userId: string;
  availableCredits: number;
  totalCredits: number;
  planType: 'free' | 'premium';
  lastCreditRefillAt?: string;
  usedToday: number;
  dailyLimit: number;
  availableToday: number;
}

export interface CreditConfig {
  limit: number;
  strategy: 'daily' | 'hourly' | 'manual';
}

export interface NextReset {
  time: string;
  hoursUntilReset: number;
  minutesUntilReset: number;
}

export interface ReloadInfo {
  user: UserCredits;
  config: CreditConfig;
  nextReset: NextReset;
  history: ReloadHistory[];
}

export interface ReloadHistory {
  id: string;
  reloadType: string;
  amount: number;
  timestamp: string;
  reason?: string;
}

export interface ReloadResponse {
  success: boolean;
  message?: string;
  credits: UserCredits;
  reloadAmount?: number;
  nextReset?: NextReset;
}

class CreditService {
  // Obter informações de créditos
  async getCreditsInfo(): Promise<ReloadInfo> {
    return apiClient.get('/credits/info');
  }

  // Obter créditos do usuário
  async getCredits(): Promise<UserCredits> {
    return apiClient.get('/credits');
  }

  // Recarregar manualmente (comprar créditos)
  async reloadManual(amount: number, reason?: string): Promise<ReloadResponse> {
    return apiClient.post('/credits/reload/manual', {
      amount,
      reason,
    });
  }

  // Forçar recarga antecipada
  async forceReload(): Promise<ReloadResponse> {
    return apiClient.post('/credits/reload/force');
  }

  // Adicionar reward de anúncio
  async addAdReward(
    amount: number,
    adType: string,
    validationToken?: string
  ): Promise<ReloadResponse> {
    return apiClient.post('/credits/reward/ad', {
      amount,
      adType,
      validationToken,
    });
  }

  // Adicionar bônus promocional
  async addPromoBonus(
    amount: number,
    reason: string,
    adminNote?: string
  ): Promise<ReloadResponse> {
    return apiClient.post('/credits/bonus/promo', {
      amount,
      reason,
      adminNote,
    });
  }

  // Obter configuração de créditos
  async getCreditConfig(planType: 'free' | 'premium'): Promise<CreditConfig> {
    return apiClient.get(`/credits/config/${planType}`);
  }

  // Atualizar configuração de créditos (admin)
  async updateCreditConfig(
    planType: 'free' | 'premium',
    dailyLimit: number,
    resetStrategy?: 'daily' | 'hourly' | 'manual'
  ): Promise<any> {
    return apiClient.post('/credits/config', {
      planType,
      dailyLimit,
      resetStrategy,
    });
  }

  // Obter histórico de recargas
  async getReloadHistory(limit: number = 10): Promise<ReloadHistory[]> {
    return apiClient.get('/credits/history', {
      params: { limit },
    });
  }

  // Usar créditos
  async useCredits(amount: number, reason: string): Promise<ReloadResponse> {
    return apiClient.post('/credits/use', {
      amount,
      reason,
    });
  }
}

export const creditService = new CreditService();
export default creditService;
