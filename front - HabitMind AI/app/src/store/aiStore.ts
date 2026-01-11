import { create } from 'zustand';
import { aiService, HabitAnalysis, InsightData, AnalyzeHabitRequest, HabitSuggestion, SuggestionsResponse } from '../services/aiService';

interface AIState {
  // Analysis state
  currentAnalysis: HabitAnalysis | null;
  analysisHistory: HabitAnalysis[];
  favoriteAnalyses: HabitAnalysis[];
  
  // Insights state
  currentInsights: InsightData | null;
  
  // Suggestions state
  suggestedHabits: HabitSuggestion[];
  
  // Loading states
  isLoading: boolean;
  isAnalyzing: boolean;
  isLoadingInsights: boolean;
  isLoadingSuggestions: boolean;
  
  // Error state
  error: string | null;
  
  // Credit info
  creditsUsed: number;
  creditsRemaining: number;
  
  // Actions
  analyzeHabit: (request: AnalyzeHabitRequest) => Promise<void>;
  getInsights: (type?: 'daily' | 'weekly' | 'monthly') => Promise<void>;
  getSuggestedHabits: () => Promise<void>;
  getSingleHabitSuggestion: () => Promise<void>;
  getAnalysisHistory: (limit?: number) => Promise<void>;
  getHabitAnalysis: (habitId: string) => Promise<void>;
  favoriteAnalysis: (analysisId: string) => Promise<void>;
  getFavoriteAnalyses: () => Promise<void>;
  generateActionPlan: (habitId: string) => Promise<{
    steps: string[];
    timeline: string;
    milestones: string[];
  }>;
  clearError: () => void;
  reset: () => void;
}

export const useAIStore = create<AIState>((set, get) => ({
  currentAnalysis: null,
  analysisHistory: [],
  favoriteAnalyses: [],
  currentInsights: null,
  suggestedHabits: [],
  isLoading: false,
  isAnalyzing: false,
  isLoadingInsights: false,
  isLoadingSuggestions: false,
  error: null,
  creditsUsed: 0,
  creditsRemaining: 0,

  analyzeHabit: async (request: AnalyzeHabitRequest) => {
    set({ isAnalyzing: true, error: null });
    try {
      const response = await aiService.analyzeHabit(request);
      
      // A resposta vem diretamente, não em response.data
      const analysisData = response.data || response;
      
      set({
        currentAnalysis: analysisData,
        creditsUsed: response.creditsUsed || 3,
        creditsRemaining: response.creditsRemaining || 0,
        isAnalyzing: false,
      });
    } catch (error) {
      console.error('❌ [aiStore] Erro ao analisar hábito:', error);
      const message = error instanceof Error ? error.message : 'Erro ao analisar hábito';
      set({ error: message, isAnalyzing: false });
      throw error;
    }
  },

  getInsights: async (type = 'daily') => {
    set({ isLoadingInsights: true, error: null });
    try {
      const response = await aiService.getInsights(type);
      set({
        currentInsights: response.data,
        creditsUsed: response.creditsUsed,
        creditsRemaining: response.creditsRemaining,
        isLoadingInsights: false,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao carregar insights';
      set({ error: message, isLoadingInsights: false });
      throw error;
    }
  },

  getSuggestedHabits: async () => {
    set({ isLoadingSuggestions: true, error: null });
    try {
      const response = await aiService.getSuggestedHabits();
      
      set({
        suggestedHabits: response.suggestedHabits,
        isLoadingSuggestions: false,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao carregar sugestões';
      set({ error: message, isLoadingSuggestions: false });
      throw error;
    }
  },

  getSingleHabitSuggestion: async () => {
    set({ isLoadingSuggestions: true, error: null });
    try {
      const response = await aiService.getSingleHabitSuggestion();
      
      set({
        suggestedHabits: response.suggestedHabits,
        isLoadingSuggestions: false,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao gerar sugestão';
      set({ error: message, isLoadingSuggestions: false });
      throw error;
    }
  },

  getAnalysisHistory: async (limit = 10) => {
    set({ isLoading: true, error: null });
    try {
      const history = await aiService.getAnalysisHistory(limit);
      set({
        analysisHistory: history,
        isLoading: false,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao carregar histórico';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  getHabitAnalysis: async (habitId: string) => {
    set({ isLoading: true, error: null });
    try {
      const analysis = await aiService.getHabitAnalysis(habitId);
      set({
        currentAnalysis: analysis,
        isLoading: false,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao carregar análise anterior';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  favoriteAnalysis: async (analysisId: string) => {
    try {
      const analysis = await aiService.favoriteAnalysis(analysisId);
      set((state) => ({
        favoriteAnalyses: [
          ...state.favoriteAnalyses.filter((a) => a.id !== analysisId),
          analysis,
        ],
        currentAnalysis:
          state.currentAnalysis?.id === analysisId
            ? analysis
            : state.currentAnalysis,
      }));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao favoritar';
      set({ error: message });
      throw error;
    }
  },

  getFavoriteAnalyses: async () => {
    set({ isLoading: true, error: null });
    try {
      const favorites = await aiService.getFavoriteAnalyses();
      set({
        favoriteAnalyses: favorites,
        isLoading: false,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao carregar favoritos';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  generateActionPlan: async (habitId: string) => {
    set({ isLoading: true, error: null });
    try {
      const actionPlan = await aiService.generateActionPlan(habitId);
      set({ isLoading: false });
      return actionPlan;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao gerar plano de ação';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  clearError: () => {
    set({ error: null });
  },

  reset: () => {
    set({
      currentAnalysis: null,
      analysisHistory: [],
      favoriteAnalyses: [],
      currentInsights: null,
      suggestedHabits: [],
      isLoading: false,
      isAnalyzing: false,
      isLoadingInsights: false,
      isLoadingSuggestions: false,
      error: null,
      creditsUsed: 0,
      creditsRemaining: 0,
    });
  },
}));

export default useAIStore;
