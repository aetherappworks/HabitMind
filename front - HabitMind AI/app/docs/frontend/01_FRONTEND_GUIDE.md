# 🎨 HabitMind AI — Frontend Integration Guide

**Para Desenvolvedores Frontend**

Guia completo para integrar o frontend com a API do HabitMind AI.

---

## 🚀 Configuração Inicial

### 1. Variáveis de Ambiente

Crie um `.env.local` no seu projeto frontend:

```env
# Backend API (JÁ RODANDO)
REACT_APP_API_URL=http://localhost:3000
REACT_APP_API_TIMEOUT=30000

# Backend já está configurado e rodando em http://localhost:3000 ✅
# Nenhuma configuração adicional necessária!
```

### 2. Cliente HTTP

**Opção A: Fetch API (Nativo)**
```typescript
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

const apiCall = async (endpoint: string, options?: RequestInit) => {
  const token = localStorage.getItem('accessToken');
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return response.json();
};
```

**Opção B: Axios (Recomendado)**
```typescript
import axios, { AxiosInstance } from 'axios';

const api: AxiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000',
  timeout: 30000,
});

// Interceptor para adicionar token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para tratar erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado, fazer logout
      localStorage.removeItem('accessToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

---

## 🔐 Autenticação

### Fluxo JWT

```
1. User preenche email/senha
   ↓
2. POST /auth/register ou /auth/login
   ↓
3. Backend retorna accessToken + user
   ↓
4. Salvar token no localStorage
   ↓
5. Usar token em Authorization: Bearer <token>
```

### Implementação

```typescript
// auth.service.ts (ou hook)

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  email: string;
  name: string;
  password: string;
}

interface AuthResponse {
  accessToken: string;
  user: {
    id: string;
    email: string;
    name: string;
    planType: 'free' | 'premium';
  };
}

// Login
const login = async (credentials: LoginRequest): Promise<AuthResponse> => {
  const response = await api.post('/auth/login', credentials);
  const { accessToken, user } = response.data;
  
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('user', JSON.stringify(user));
  
  return response.data;
};

// Register
const register = async (data: RegisterRequest): Promise<AuthResponse> => {
  const response = await api.post('/auth/register', data);
  const { accessToken, user } = response.data;
  
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('user', JSON.stringify(user));
  
  return response.data;
};

// Logout
const logout = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('user');
};

// Restaurar sessão (usar no useEffect ao carregar app)
const restoreSession = () => {
  const token = localStorage.getItem('accessToken');
  const user = localStorage.getItem('user');
  
  if (token && user) {
    return JSON.parse(user);
  }
  return null;
};
```

---

## 📦 Tipos TypeScript

### User

```typescript
interface User {
  id: string;
  email: string;
  name: string;
  planType: 'free' | 'premium';
  createdAt: string; // ISO 8601
  updatedAt: string;
}

interface UpdateUserRequest {
  name?: string;
  email?: string;
}
```

### Habit

```typescript
interface Habit {
  id: string;
  userId: string;
  title: string;
  description?: string;
  frequency: 'daily' | 'weekly' | 'custom';
  preferredTime?: string; // HH:MM
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  habitLogs?: HabitLog[];
}

interface CreateHabitRequest {
  title: string;
  description?: string;
  frequency: 'daily' | 'weekly' | 'custom';
  preferredTime?: string; // "07:00"
}

interface UpdateHabitRequest {
  title?: string;
  description?: string;
  frequency?: 'daily' | 'weekly' | 'custom';
  preferredTime?: string;
}
```

### HabitLog (Check-in)

```typescript
interface HabitLog {
  id: string;
  habitId: string;
  date: string; // YYYY-MM-DD
  status: 'completed' | 'pending' | 'skipped';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface CreateCheckInRequest {
  date: string; // "2025-01-06"
  status: 'completed' | 'pending' | 'skipped';
  notes?: string;
}
```

### AI Insight

```typescript
interface AIInsight {
  id: string;
  userId: string;
  habitId?: string;
  type: 'pattern_analysis' | 'time_suggestion' | 'encouragement' | 'adjustment';
  content: string;
  confidenceScore: number; // 0.0 to 1.0
  createdAt: string;
  updatedAt: string;
}

interface AnalyzeHabitRequest {
  habitId: string;
  type: 'pattern_analysis' | 'time_suggestion' | 'encouragement' | 'adjustment';
  context?: string;
}
```

### Advertisement (Ads)

```typescript
interface AdView {
  id: string;
  userId: string;
  adType: 'rewarded' | 'banner' | 'interstitial';
  viewedAt: string;
  rewardClaimed: boolean;
  rewardAmount: number;
  validationToken: string;
}

interface AdConfig {
  id: string;
  adType: 'rewarded' | 'banner' | 'interstitial';
  rewardAmount: number;
  dailyLimit: number;
}

interface RecordAdViewRequest {
  adType: 'rewarded' | 'banner' | 'interstitial';
  adUnitId: string;
  validationToken: string;
}

interface AdViewResponse {
  success: boolean;
  message: string;
  creditsEarned?: number;
}

interface RewardCompletionRequest {
  adId: string;
  rewardAmount: number;
}

interface AdStatsResponse {
  totalViews: number;
  totalCreditsEarned: number;
  viewsByType: {
    rewarded: number;
    banner: number;
    interstitial: number;
  };
  creditsEarnedByType: {
    rewarded: number;
    banner: number;
    interstitial: number;
  };
  dailyLimitRemaining: {
    rewarded: number;
    banner: number;
    interstitial: number;
  };
}
```

### Error Response

```typescript
interface ErrorResponse {
  statusCode: number;
  message: string;
  error?: string;
}
```

---

## 🎯 Endpoints com Exemplos

### 🔐 Auth

#### Register
```typescript
// POST /auth/register
const response = await api.post('/auth/register', {
  email: 'user@example.com',
  name: 'John Doe',
  password: 'password123'
});
// Response: { accessToken: string, user: User }
```

#### Login
```typescript
// POST /auth/login
const response = await api.post('/auth/login', {
  email: 'user@example.com',
  password: 'password123'
});
// Response: { accessToken: string, user: User }
```

---

#### Get Credits
```typescript
// GET /users/credits (requer auth)
const response = await api.get('/users/credits');
// Response: { credits: number }
```

#### Deduct Credits
```typescript
// POST /users/deduct-credits (requer auth)
const response = await api.post('/users/deduct-credits', {
  amount: 10,
  reason: 'premium_feature'
});
// Response: { credits: number, remaining: number }
```

### 👤 Users

#### Get Profile
```typescript
// GET /users/me (requer auth)
const response = await api.get('/users/me');
// Response: User
```

#### Update Profile
```typescript
// PUT /users/me (requer auth)
const response = await api.put('/users/me', {
  name: 'New Name',
  email: 'new@example.com'
});
// Response: User
```

---

### 📅 Habits

#### Create Habit
```typescript
// POST /habits (requer auth)
const response = await api.post('/habits', {
  title: 'Morning Exercise',
  description: '30 minutes of exercise',
  frequency: 'daily',
  preferredTime: '07:00'
});
// Response: Habit
```

#### Get All Habits
```typescript
// GET /habits (requer auth)
const response = await api.get('/habits');
// Response: Habit[]
```

#### Get Specific Habit
```typescript
// GET /habits/:id (requer auth)
const response = await api.get('/habits/habit-id-123');
// Response: Habit (com habitLogs inclusos)
```

#### Update Habit
```typescript
// PUT /habits/:id (requer auth)
const response = await api.put('/habits/habit-id-123', {
  title: 'Updated Title',
  preferredTime: '08:00'
});
// Response: Habit
```

#### Delete Habit
```typescript
// DELETE /habits/:id (requer auth)
const response = await api.delete('/habits/habit-id-123');
// Response: { message: 'Habit deleted' }
```

---

### ✅ Check-ins

#### Create Check-in
```typescript
// POST /habits/:id/checkins (requer auth)
const response = await api.post('/habits/habit-id-123/checkins', {
  date: '2025-01-06',
  status: 'completed',
  notes: 'Great workout today!'
});
// Response: HabitLog
```

#### Get Check-ins
```typescript
// GET /habits/:id/checkins (requer auth)
const response = await api.get('/habits/habit-id-123/checkins');
// Response: HabitLog[]
```

#### Get Check-ins by Date Range
```typescript
// GET /habits/:id/checkins/range?startDate=2025-01-01&endDate=2025-01-31
const response = await api.get('/habits/habit-id-123/checkins/range', {
  params: {
    startDate: '2025-01-01',
    endDate: '2025-01-31'
  }
});
// Response: HabitLog[]
```

---

### 🤖 AI

#### Analyze Habit
```typescript
// POST /ai/analyze (requer auth)
const response = await api.post('/ai/analyze', {
  habitId: 'habit-id-123',
  type: 'pattern_analysis',
  context: 'User has been missing weekends'
});
// Response: AIInsight
```

#### Get Insights
```typescript
// GET /ai/insights (requer auth)
const response = await api.get('/ai/insights');
// Response: AIInsight[]
```

#### Get Insights for Specific Habit
```typescript
// GET /ai/insights?habitId=habit-id-123 (requer auth)
const response = await api.get('/ai/insights', {
  params: { habitId: 'habit-id-123' }
});
// Response: AIInsight[]
```

---

### 📺 Advertisements (Google AdMob Integration)

#### Record Ad View
```typescript
// POST /ads/view (requer auth)
const response = await api.post('/ads/view', {
  adType: 'rewarded', // 'rewarded' | 'banner' | 'interstitial'
  adUnitId: 'ca-app-pub-xxxxxxxxxxxxxxxx/yyyyyyyyyyyyyy',
  validationToken: 'token-from-google-admob'
});
// Response: {
//   success: boolean,
//   message: string,
//   creditsEarned?: number
// }
```

#### Complete Reward Ad
```typescript
// POST /ads/reward-completion (requer auth)
const response = await api.post('/ads/reward-completion', {
  adId: 'ad-view-id-123',
  rewardAmount: 10
});
// Response: {
//   success: boolean,
//   message: string,
//   creditsAdded: number
// }
```

#### Validate Ad
```typescript
// POST /ads/validation/:adId (requer auth)
const response = await api.post('/ads/validation/ad-view-id-123', {
  token: 'verification-token-from-admob'
});
// Response: {
//   isValid: boolean,
//   message: string,
//   creditAmount?: number
// }
```

#### Get Ad Configuration
```typescript
// GET /ads/config (requer auth)
const response = await api.get('/ads/config');
// Response: AdConfig[] = [
//   {
//     adType: 'rewarded',
//     rewardAmount: 10,
//     dailyLimit: 20
//   },
//   {
//     adType: 'banner',
//     rewardAmount: 1,
//     dailyLimit: 50
//   },
//   {
//     adType: 'interstitial',
//     rewardAmount: 5,
//     dailyLimit: 10
//   }
// ]
```

#### Get Ad Statistics
```typescript
// GET /ads/stats (requer auth)
const response = await api.get('/ads/stats');
// Response: {
//   totalViews: number,
//   totalCreditsEarned: number,
//   viewsByType: {
//     rewarded: number,
//     banner: number,
//     interstitial: number
//   },
//   creditsEarnedByType: {
//     rewarded: number,
//     banner: number,
//     interstitial: number
//   },
//   dailyLimitRemaining: {
//     rewarded: number,
//     banner: number,
//     interstitial: number
//   }
// }
```

#### Get Ad History
```typescript
// GET /ads/history?limit=20&offset=0 (requer auth)
const response = await api.get('/ads/history', {
  params: {
    limit: 20,
    offset: 0
  }
});
// Response: AdView[] = [
//   {
//     id: string,
//     adType: 'rewarded',
//     viewedAt: '2026-01-09T10:30:00Z',
//     rewardClaimed: true,
//     rewardAmount: 10
//   }
// ]
```

---

### 🏥 Health

#### Health Check
```typescript
// GET /health (sem autenticação)
const response = await api.get('/health');
// Response: { status: 'ok', timestamp: string, message: string }
```

---

## 🛠️ Hooks React Úteis

### useAuth Hook

```typescript
// hooks/useAuth.ts
import { useState, useCallback } from 'react';
import api from '../api/client';

interface User {
  id: string;
  email: string;
  name: string;
  planType: 'free' | 'premium';
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/auth/login', { email, password });
      const { accessToken, user } = response.data;
      localStorage.setItem('accessToken', accessToken);
      setUser(user);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login falhou');
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('accessToken');
    setUser(null);
  }, []);

  const restoreSession = useCallback(async () => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        const response = await api.get('/users/me');
        setUser(response.data);
      } catch {
        localStorage.removeItem('accessToken');
      }
    }
  }, []);

  return { user, loading, error, login, logout, restoreSession };
};
```

### useHabits Hook

```typescript
// hooks/useHabits.ts
import { useState, useEffect, useCallback } from 'react';
import api from '../api/client';

interface Habit {
  id: string;
  title: string;
  frequency: string;
  isActive: boolean;
}

export const useHabits = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHabits = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/habits');
      setHabits(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Falha ao carregar hábitos');
    } finally {
      setLoading(false);
    }
  }, []);

  const createHabit = useCallback(async (habitData: any) => {
    try {
      const response = await api.post('/habits', habitData);
      setHabits([...habits, response.data]);
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Falha ao criar hábito');
      throw err;
    }
  }, [habits]);

  const deleteHabit = useCallback(async (habitId: string) => {
    try {
      await api.delete(`/habits/${habitId}`);
      setHabits(habits.filter(h => h.id !== habitId));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Falha ao deletar hábito');
      throw err;
    }
  }, [habits]);

  useEffect(() => {
    fetchHabits();
  }, [fetchHabits]);

  return { habits, loading, error, fetchHabits, createHabit, deleteHabit };
};
```

### useAds Hook

```typescript
// hooks/useAds.ts
import { useState, useCallback } from 'react';
import api from '../api/client';

interface AdStats {
  totalViews: number;
  totalCreditsEarned: number;
  viewsByType: { rewarded: number; banner: number; interstitial: number };
  creditsEarnedByType: { rewarded: number; banner: number; interstitial: number };
  dailyLimitRemaining: { rewarded: number; banner: number; interstitial: number };
}

export const useAds = () => {
  const [stats, setStats] = useState<AdStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/ads/stats');
      setStats(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Falha ao carregar estatísticas');
    } finally {
      setLoading(false);
    }
  }, []);

  const recordAdView = useCallback(
    async (adType: string, adUnitId: string, validationToken: string) => {
      try {
        const response = await api.post('/ads/view', {
          adType,
          adUnitId,
          validationToken
        });
        // Atualizar stats após visualização
        await fetchStats();
        return response.data;
      } catch (err: any) {
        setError(err.response?.data?.message || 'Falha ao registrar anúncio');
        throw err;
      }
    },
    [fetchStats]
  );

  const completeReward = useCallback(
    async (adId: string, rewardAmount: number) => {
      try {
        const response = await api.post('/ads/reward-completion', {
          adId,
          rewardAmount
        });
        await fetchStats();
        return response.data;
      } catch (err: any) {
        setError(err.response?.data?.message || 'Falha ao completar recompensa');
        throw err;
      }
    },
    [fetchStats]
  );

  const validateAd = useCallback(
    async (adId: string, token: string) => {
      try {
        const response = await api.post(`/ads/validation/${adId}`, { token });
        return response.data;
      } catch (err: any) {
        setError(err.response?.data?.message || 'Validação falhou');
        throw err;
      }
    },
    []
  );

  return { stats, loading, error, fetchStats, recordAdView, completeReward, validateAd };
};
```

### useCheckins Hook

```typescript
// hooks/useCheckins.ts
import { useState, useCallback } from 'react';
import api from '../api/client';

interface CheckIn {
  id: string;
  habitId: string;
  date: string;
  status: 'completed' | 'pending' | 'skipped';
  notes?: string;
}

export const useCheckins = (habitId: string) => {
  const [checkins, setCheckins] = useState<CheckIn[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCheckins = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get(`/habits/${habitId}/checkins`);
      setCheckins(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Falha ao carregar check-ins');
    } finally {
      setLoading(false);
    }
  }, [habitId]);

  const fetchCheckinsByRange = useCallback(
    async (startDate: string, endDate: string) => {
      setLoading(true);
      try {
        const response = await api.get(
          `/habits/${habitId}/checkins/range`,
          { params: { startDate, endDate } }
        );
        setCheckins(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Falha ao carregar range');
      } finally {
        setLoading(false);
      }
    },
    [habitId]
  );

  const createCheckin = useCallback(
    async (date: string, status: string, notes?: string) => {
      try {
        const response = await api.post(`/habits/${habitId}/checkins`, {
          date,
          status,
          notes
        });
        setCheckins([...checkins, response.data]);
        return response.data;
      } catch (err: any) {
        setError(err.response?.data?.message || 'Falha ao criar check-in');
        throw err;
      }
    },
    [habitId, checkins]
  );

  return {
    checkins,
    loading,
    error,
    fetchCheckins,
    fetchCheckinsByRange,
    createCheckin
  };
};
```

---

## � Integração com Google AdMob

### Passo 1: Setup do AdMob
1. Registrar no [Google AdMob](https://admob.google.com)
2. Criar App e Ad Units
3. Obter App ID e Ad Unit IDs

### Passo 2: Instalar Google Mobile Ads SDK
**Para React Native:**
```bash
npm install react-google-mobile-ads
```

**Para Web (usando Google Ad Manager):**
```bash
npm install @google/ads
```

### Passo 3: Configurar e Inicializar
**React Native com Expo:**
```typescript
// App.tsx
import { mobileAds } from 'react-google-mobile-ads';

mobileAds()
  .initialize()
  .then(() => console.log('AdMob initialized'));
```

### Passo 4: Implementar Rewarded Ad
```typescript
// components/RewardedAdComponent.tsx
import { RewardedAd, RewardedAdEventType } from 'react-google-mobile-ads';
import { useAds } from '../hooks/useAds';

const RewardedAdComponent = () => {
  const { recordAdView, completeReward, stats } = useAds();
  const [loading, setLoading] = useState(false);

  const showRewardedAd = async () => {
    try {
      setLoading(true);

      // 1. Mostrar anúncio
      const rewardedAd = RewardedAd.createForAdRequest(
        'ca-app-pub-xxxxxxxxxxxxxxxx/yyyyyyyyyyyyyy'
      );

      // 2. Listener para quando usuário completa anúncio
      const unsubscribe = rewardedAd.onAdEvent((type, error) => {
        if (type === RewardedAdEventType.EARNED_REWARD) {
          // 3. Registrar visualização no backend
          recordAdView('rewarded', 'ad-unit-id', 'token-from-admob')
            .then(() => {
              // 4. Registrar conclusão
              return completeReward('ad-id', 10);
            })
            .then(() => {
              console.log('Recompensa adicionada!');
              // Atualizar UI com novos créditos
            })
            .catch(err => console.error('Erro:', err));
        }
      });

      // Mostrar anúncio
      rewardedAd.show();
    } catch (error) {
      console.error('Erro ao mostrar anúncio:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={showRewardedAd} disabled={loading}>
      {loading ? 'Carregando...' : `Assistir Anúncio (Ganhe 10 créditos)`}
    </button>
  );
};

export default RewardedAdComponent;
```

### Passo 5: Mostrar Estatísticas
```typescript
// components/AdStats.tsx
import { useAds } from '../hooks/useAds';
import { useEffect } from 'react';

const AdStats = () => {
  const { stats, fetchStats } = useAds();

  useEffect(() => {
    fetchStats();
  }, []);

  if (!stats) return <div>Carregando...</div>;

  return (
    <div>
      <h3>Seus Ganhos com Anúncios</h3>
      <p>Total de Visualizações: {stats.totalViews}</p>
      <p>Créditos Ganhos: {stats.totalCreditsEarned}</p>

      <h4>Limite Restante Hoje:</h4>
      <ul>
        <li>Rewarded: {stats.dailyLimitRemaining.rewarded}</li>
        <li>Banner: {stats.dailyLimitRemaining.banner}</li>
        <li>Interstitial: {stats.dailyLimitRemaining.interstitial}</li>
      </ul>
    </div>
  );
};

export default AdStats;
```

---

## �📋 Tratamento de Erros

### Códigos HTTP Comuns

```typescript
const handleError = (error: any) => {
  if (error.response) {
    const status = error.response.status;
    const data = error.response.data;

    switch (status) {
      case 400:
        console.error('Erro de validação:', data.message);
        break;
      case 401:
        console.error('Não autenticado. Fazer login novamente.');
        break;
      case 403:
        console.error('Acesso negado.');
        break;
      case 404:
        console.error('Recurso não encontrado.');
        break;
      case 500:
        console.error('Erro interno do servidor.');
        break;
      default:
        console.error('Erro desconhecido:', data.message);
    }
  } else if (error.request) {
    console.error('Sem resposta do servidor.');
  } else {
    console.error('Erro:', error.message);
  }
};
```

---

## 🔄 Fluxos Comuns

### Fluxo: Criar Hábito e Registrar Check-in

```typescript
const createHabitAndCheckIn = async () => {
  try {
    // 1. Criar hábito
    const habitResponse = await api.post('/habits', {
      title: 'Morning Run',
      frequency: 'daily',
      preferredTime: '06:00'
    });
    const habitId = habitResponse.data.id;

    // 2. Registrar check-in para hoje
    const today = new Date().toISOString().split('T')[0];
    await api.post(`/habits/${habitId}/checkins`, {
      date: today,
      status: 'completed',
      notes: 'Completed 5km run'
    });

    // 3. Gerar insights
    const insightResponse = await api.post('/ai/analyze', {
      habitId,
      type: 'pattern_analysis'
    });

    console.log('Hábito criado:', habitId);
    console.log('Insight:', insightResponse.data);
  } catch (error) {
    handleError(error);
  }
};
```

### Fluxo: Dashboard - Carregar Tudo

```typescript
const loadDashboard = async () => {
  try {
    // Parallelizar requisições
    const [habitsRes, insightsRes] = await Promise.all([
      api.get('/habits'),
      api.get('/ai/insights')
    ]);

    const habits = habitsRes.data;
    const insights = insightsRes.data;

    // Adicionar insights aos hábitos
    const habitsWithInsights = habits.map((habit: any) => ({
      ...habit,
      insights: insights.filter((i: any) => i.habitId === habit.id)
    }));

    return habitsWithInsights;
  } catch (error) {
    handleError(error);
  }
};
```

---

## 🌍 CORS & Desenvolvimiento Local

### Frontend rodando em porta diferente

Se seu frontend roda em `http://localhost:3001` e backend em `http://localhost:3000`, certifique-se de configurar a variável de ambiente:

```env
REACT_APP_API_URL=http://localhost:3000
```

---

## 📊 Exemplo Completo: React + TypeScript

```typescript
// App.tsx
import React, { useEffect, useState } from 'react';
import api from './api/client';
import { useAuth } from './hooks/useAuth';

interface Habit {
  id: string;
  title: string;
  frequency: string;
}

function App() {
  const { user, login, logout, restoreSession } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Restaurar sessão ao carregar
  useEffect(() => {
    restoreSession();
  }, []);

  // Carregar hábitos se autenticado
  useEffect(() => {
    if (user) {
      loadHabits();
    }
  }, [user]);

  const loadHabits = async () => {
    try {
      const response = await api.get('/habits');
      setHabits(response.data);
    } catch (error) {
      console.error('Erro ao carregar hábitos:', error);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
    setEmail('');
    setPassword('');
  };

  if (!user) {
    return (
      <form onSubmit={handleLogin}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button type="submit">Login</button>
      </form>
    );
  }

  return (
    <div>
      <h1>Bem-vindo, {user.name}!</h1>
      <button onClick={logout}>Logout</button>
      
      <div>
        <h2>Meus Hábitos</h2>
        <ul>
          {habits.map((habit) => (
            <li key={habit.id}>{habit.title}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
```

---

## 📚 Recursos Adicionais

- **API Docs Interativo:** http://localhost:3000/api/docs (após rodar o backend)
- **Backend Setup:** [QUICK_START.md](QUICK_START.md)
- **Referência Completa:** [API_REFERENCE.md](API_REFERENCE.md)

---

## 🤝 Suporte

Para dúvidas sobre a API, consulte a documentação Swagger ou abra uma issue no repositório.

---

**Último Update:** 6 de Janeiro de 2026  
**Status:** Pronto para Integração 🚀
