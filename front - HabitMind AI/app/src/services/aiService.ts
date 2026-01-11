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
    try {
      const response = await apiClient.post('/ai/analyze', request);
      return response;
    } catch (error) {
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
    try {
      const response = await apiClient.get('/ai/insights');
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Obter uma única sugestão de hábito (custa 2 créditos)
  async getSingleHabitSuggestion(): Promise<SuggestionsResponse> {
    try {
      const response = await apiClient.get('/ai/suggest');
      return response;
    } catch (error) {
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
