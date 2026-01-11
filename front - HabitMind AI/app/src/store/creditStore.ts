import { create } from 'zustand';
import { creditService, UserCredits, ReloadInfo, ReloadResponse } from '../services/creditService';

interface CreditState {
  credits: UserCredits | null;
  reloadInfo: ReloadInfo | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  getCredits: () => Promise<void>;
  getCreditsInfo: () => Promise<void>;
  reloadManual: (amount: number, reason?: string) => Promise<void>;
  forceReload: () => Promise<void>;
  addAdReward: (amount: number, adType: string) => Promise<void>;
  addPromoBonus: (amount: number, reason: string) => Promise<void>;
  useCredits: (amount: number, reason: string) => Promise<void>;
  refresh: () => Promise<void>;
  clearError: () => void;
  reset: () => void;
}

export const useCreditStore = create<CreditState>((set, get) => ({
  credits: null,
  reloadInfo: null,
  isLoading: false,
  error: null,

  getCredits: async () => {
    set({ isLoading: true, error: null });
    try {
      const credits = await creditService.getCredits();
      set({ credits, isLoading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao carregar créditos';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  getCreditsInfo: async () => {
    set({ isLoading: true, error: null });
    try {
      const reloadInfo = await creditService.getCreditsInfo();
      set({
        reloadInfo,
        credits: reloadInfo.user,
        isLoading: false,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao carregar informações de créditos';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  reloadManual: async (amount: number, reason?: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await creditService.reloadManual(amount, reason);
      set((state) => ({
        credits: response.credits,
        reloadInfo: state.reloadInfo
          ? {
              ...state.reloadInfo,
              user: response.credits,
              nextReset: response.nextReset || state.reloadInfo.nextReset,
            }
          : null,
        isLoading: false,
      }));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao recarregar créditos';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  forceReload: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await creditService.forceReload();
      set((state) => ({
        credits: response.credits,
        reloadInfo: state.reloadInfo
          ? {
              ...state.reloadInfo,
              user: response.credits,
              nextReset: response.nextReset || state.reloadInfo.nextReset,
            }
          : null,
        isLoading: false,
      }));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao forçar recarga';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  addAdReward: async (amount: number, adType: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await creditService.addAdReward(amount, adType);
      set((state) => ({
        credits: response.credits,
        reloadInfo: state.reloadInfo
          ? {
              ...state.reloadInfo,
              user: response.credits,
            }
          : null,
        isLoading: false,
      }));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao adicionar reward';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  addPromoBonus: async (amount: number, reason: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await creditService.addPromoBonus(amount, reason);
      set((state) => ({
        credits: response.credits,
        reloadInfo: state.reloadInfo
          ? {
              ...state.reloadInfo,
              user: response.credits,
            }
          : null,
        isLoading: false,
      }));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao adicionar bônus';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  useCredits: async (amount: number, reason: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await creditService.useCredits(amount, reason);
      set((state) => ({
        credits: response.credits,
        reloadInfo: state.reloadInfo
          ? {
              ...state.reloadInfo,
              user: response.credits,
            }
          : null,
        isLoading: false,
      }));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao usar créditos';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  refresh: async () => {
    const { getCreditsInfo } = get();
    await getCreditsInfo();
  },

  clearError: () => {
    set({ error: null });
  },

  reset: () => {
    set({
      credits: null,
      reloadInfo: null,
      isLoading: false,
      error: null,
    });
  },
}));

export default useCreditStore;
