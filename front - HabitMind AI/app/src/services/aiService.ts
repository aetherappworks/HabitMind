import { apiClient } from './apiClient';

export interface HabitAnalysis {
  id: string;
  habitId: string;
  userId: string;
  type: string;
  content: string;
  confidenceScore: number;
  createdAt: string;
  updatedAt: string;
}

export interface InsightData {
  id: string;
  userId: string;
  type: 'daily' | 'weekly' | 'monthly';
  content: string;
  habits: Array<{
    habitId: string;
    habitTitle: string;
    completionRate: number;
  }>;
  trends: string[];
  nextSteps: string[];
  createdAt: string;
}

export interface AnalyzeHabitRequest {
  habitId: string;
  type: string;
  context?: string;
}

export interface AnalyzeResponse {
  success: boolean;
  data: HabitAnalysis;
  creditsUsed: number;
  creditsRemaining: number;
}

export interface InsightsResponse {
  success: boolean;
  data: InsightData;
  creditsUsed: number;
  creditsRemaining: number;
}

export interface HabitSuggestion {
  title: string;
  reason: string;
  category: string;
  priority: number;
  relatedHabit: string;
  completionRate: number;
  confidence: number;
  benefits: string[];
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface SuggestionsResponse {
  suggestedHabits: HabitSuggestion[];
  totalCurrentHabits: number;
  message: string;
}

class AIService {
  // Analisar um hábito específico (3 créditos)
  async analyzeHabit(request: AnalyzeHabitRequest): Promise<AnalyzeResponse> {
    console.log('🚀 [aiService] analyzeHabit - Enviando requisição:', request);
    try {
      const response = await apiClient.post('/ai/analyze', request);
      console.log('📨 [aiService] analyzeHabit - Resposta recebida:', response);
      return response;
    } catch (error) {
      console.error('❌ [aiService] analyzeHabit - Erro na requisição:', error);
      throw error;
    }
  }

  // Obter insights gerais (1 crédito)
  async getInsights(type: 'daily' | 'weekly' | 'monthly' = 'daily'): Promise<InsightsResponse> {
    return apiClient.get('/ai/insights', {
      params: { type },
    });
  }

  // Obter sugestões de novos hábitos baseadas nos hábitos atuais
  async getSuggestedHabits(): Promise<SuggestionsResponse> {
    console.log('🚀 [aiService] getSuggestedHabits - Buscando sugestões');
    try {
      const response = await apiClient.get('/ai/insights');
      console.log('📨 [aiService] getSuggestedHabits - Sugestões recebidas:', response);
      return response;
    } catch (error) {
      console.error('❌ [aiService] getSuggestedHabits - Erro:', error);
      throw error;
    }
  }

  // Obter uma única sugestão de hábito (custa 2 créditos)
  async getSingleHabitSuggestion(): Promise<SuggestionsResponse> {
    console.log('🚀 [aiService] getSingleHabitSuggestion - Gerando sugestão');
    try {
      const response = await apiClient.get('/ai/suggest');
      console.log('📨 [aiService] getSingleHabitSuggestion - Sugestão recebida:', response);
      return response;
    } catch (error) {
      console.error('❌ [aiService] getSingleHabitSuggestion - Erro:', error);
      throw error;
    }
  }

  // Obter histórico de análises
  async getAnalysisHistory(limit: number = 10): Promise<HabitAnalysis[]> {
    return apiClient.get('/ai/analysis-history', {
      params: { limit },
    });
  }

  // Obter análise anterior de um hábito
  async getHabitAnalysis(habitId: string): Promise<HabitAnalysis | null> {
    try {
      return await apiClient.get(`/ai/habit/${habitId}/analysis`);
    } catch (error) {
      // Retorna null se não houver análise anterior
      return null;
    }
  }

  // Favoritar análise
  async favoriteAnalysis(analysisId: string): Promise<HabitAnalysis> {
    return apiClient.post(`/ai/analysis/${analysisId}/favorite`);
  }

  // Obter análises favoritadas
  async getFavoriteAnalyses(): Promise<HabitAnalysis[]> {
    return apiClient.get('/ai/favorites');
  }

  // Gerar plano de ação baseado em insights
  async generateActionPlan(habitId: string): Promise<{
    steps: string[];
    timeline: string;
    milestones: string[];
  }> {
    return apiClient.post('/ai/action-plan', { habitId });
  }
}

export const aiService = new AIService();
export default aiService;
