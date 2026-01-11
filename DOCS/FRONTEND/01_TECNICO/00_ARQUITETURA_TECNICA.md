# 🏗️ Arquitetura Técnica - Frontend React Native

## 📋 Visão Geral

O frontend do HabitMind AI é construído com **React Native** e **Expo**, fornecendo uma experiência mobile nativa para iOS e Android. Utiliza **TypeScript** para tipagem segura, **Zustand** para state management e **Axios** para comunicação com a API.

## 🎯 Objetivos Arquiteturais

- **Cross-Platform**: Funciona nativamente em iOS, Android e Web
- **Type Safety**: TypeScript em todo o projeto
- **State Management**: Zustand para estado global centralizado
- **Performance**: Otimizações de rendering, lazy loading
- **Segurança**: Armazenamento seguro de tokens, validação de entrada
- **UX/UI**: Interface intuitiva e responsiva

## 📦 Estrutura de Pasta

```
app/
├── src/
│   ├── components/               # 🧩 Componentes Reutilizáveis
│   │   ├── Button.tsx            # Botão universal
│   │   ├── Input.tsx             # Input de texto
│   │   ├── HabitCard.tsx          # Card exibindo hábito
│   │   ├── CheckInModal.tsx       # Modal para registrar conclusão
│   │   ├── HabitModal.tsx         # Modal para criar/editar hábito
│   │   ├── AIAnalysisModal.tsx    # Modal com insights de IA
│   │   └── Toast.tsx             # Notificações toast
│   │
│   ├── screens/                  # 📱 Telas Principais
│   │   ├── auth/
│   │   │   ├── LoginScreen.tsx
│   │   │   └── RegisterScreen.tsx
│   │   ├── habits/
│   │   │   ├── DashboardScreen.tsx     # Lista de hábitos
│   │   │   ├── CreateHabitScreen.tsx   # Criar novo hábito
│   │   │   ├── HabitDetailScreen.tsx   # Detalhes do hábito
│   │   │   └── StatisticsScreen.tsx    # Gráficos e análises
│   │   └── user/
│   │       ├── ProfileScreen.tsx
│   │       ├── CreditsScreen.tsx
│   │       └── SettingsScreen.tsx
│   │
│   ├── navigation/               # 🧭 Navegação
│   │   ├── RootNavigator.tsx     # Configuração principal de rotas
│   │   ├── AuthNavigator.tsx     # Pilha de autenticação
│   │   └── AppNavigator.tsx      # Pilha pós-autenticação
│   │
│   ├── services/                 # 🔌 Serviços de API
│   │   ├── apiClient.ts          # Cliente Axios configurado
│   │   ├── authService.ts        # Login, register, logout
│   │   ├── habitService.ts       # CRUD de hábitos
│   │   ├── aiService.ts          # Análises com IA
│   │   ├── creditService.ts      # Gerenciamento de créditos
│   │   └── adService.ts          # Visualização de anúncios
│   │
│   ├── store/                    # 🏪 State Management (Zustand)
│   │   ├── authStore.ts          # Estado de autenticação
│   │   ├── habitStore.ts         # Estado de hábitos
│   │   ├── creditStore.ts        # Estado de créditos
│   │   ├── uiStore.ts            # Estado de UI (modais, toasts)
│   │   └── index.ts              # Exportações centralizadas
│   │
│   ├── styles/                   # 🎨 Estilos e Temas
│   │   ├── colors.ts             # Paleta de cores
│   │   ├── typography.ts         # Fontes e tamanhos
│   │   ├── spacing.ts            # Espaçamentos
│   │   └── theme.ts              # Tema global
│   │
│   ├── utils/                    # 🔧 Funções Utilitárias
│   │   ├── validation.ts         # Validação de email, senha
│   │   ├── formatters.ts         # Formatação de datas, números
│   │   ├── storage.ts            # SecureStore wrapper
│   │   └── errorHandler.ts       # Tratamento de erros
│   │
│   ├── docs/                     # 📚 Documentação interna
│   │   └── api/
│   │   └── frontend/
│   │
│   ├── App.tsx                   # Componente raiz
│   └── index.tsx                 # Entrada do app
│
├── assets/                       # 🖼️ Imagens, ícones
├── .env                          # Variáveis de ambiente
├── .env.example                  # Template de .env
├── app.json                      # Config Expo
├── babel.config.js               # Config Babel
├── tsconfig.json                 # Config TypeScript
└── package.json                  # Dependências
```

## 🔄 Fluxo de Dados

### Architecture Pattern: MVVM + Zustand

```
┌─────────────────────────────────────┐
│     View Layer (Screens/Components) │
│  • DashboardScreen.tsx              │
│  • HabitCard.tsx                    │
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│     State Management (Zustand)      │
│  • useAuthStore()                   │
│  • useHabitStore()                  │
│  • useCreditStore()                 │
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│     Service Layer (API Calls)       │
│  • habitService.getHabits()         │
│  • creditService.getCredits()       │
│  • adService.recordAdView()         │
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│     API Client (Axios)              │
│  • apiClient.get()                  │
│  • apiClient.post()                 │
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│     Backend API                     │
│  • http://localhost:3000/...        │
└─────────────────────────────────────┘
```

## 📱 Tech Stack

| Tecnologia | Versão | Propósito |
|-----------|--------|----------|
| React Native | 0.73.2 | Framework mobile |
| Expo | ~51.0.0 | Ferramenta desenvolvimento |
| TypeScript | ~5.3.0 | Tipagem estática |
| React Navigation | ^6.5.11 | Navegação |
| Zustand | ^4.4.1 | State management |
| Axios | ^1.6.2 | Cliente HTTP |
| Async Storage | 1.21.0 | Storage local |
| Secure Store | ~12.3.1 | Storage seguro (tokens) |
| Day.js | ^1.11.10 | Manipulação de datas |

## 🧩 Componentes Principais

### 1. Button.tsx
```typescript
// Props
interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  loading?: boolean;
  disabled?: boolean;
}

// Uso
<Button 
  label="Completar" 
  onPress={handleComplete} 
  variant="primary"
/>
```

### 2. Input.tsx
```typescript
// Props
interface InputProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  error?: string;
}

// Uso
<Input
  placeholder="Email"
  value={email}
  onChangeText={setEmail}
  error={emailError}
/>
```

### 3. HabitCard.tsx
```typescript
// Exibe resumo de um hábito
interface HabitCardProps {
  habit: Habit;
  onPress: () => void;
  onComplete: () => void;
}

// Features:
// - Status hoje (completado/pendente)
// - Streak atual
// - Taxa de conclusão
```

### 4. CheckInModal.tsx
```typescript
// Modal para registrar conclusão de hábito
// - Campo de notas (opcional)
// - Botões: Completar / Cancelar
// - Feedback visual ao confirmar
```

### 5. AIAnalysisModal.tsx
```typescript
// Exibe insights gerados pela IA
// - Título e descrição do insight
// - Confidence score visual
// - Scroll para múltiplos insights
```

## 🏪 State Management com Zustand

### authStore.ts
```typescript
interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
}

// Uso em componentes
const { user, token, login, logout } = useAuthStore();
```

### habitStore.ts
```typescript
interface HabitState {
  habits: Habit[];
  selectedHabit: Habit | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  getHabits: () => Promise<void>;
  createHabit: (data: CreateHabitDto) => Promise<void>;
  updateHabit: (id: string, data: UpdateHabitDto) => Promise<void>;
  deleteHabit: (id: string) => Promise<void>;
  checkin: (habitId: string, status: string) => Promise<void>;
  setSelectedHabit: (habit: Habit) => void;
}

// Uso
const { habits, getHabits } = useHabitStore();

useEffect(() => {
  getHabits();
}, []);
```

### creditStore.ts
```typescript
interface CreditState {
  availableCredits: number;
  totalCredits: number;
  isLoading: boolean;
  
  // Actions
  getCredits: () => Promise<void>;
  recordAdView: (adType: string, adId: string) => Promise<string>;
  claimReward: (adViewId: string, validationToken: string) => Promise<void>;
  getHistory: () => Promise<void>;
}
```

## 🔌 Services (API Layer)

### apiClient.ts
```typescript
// Cliente Axios pré-configurado com:
// - Base URL do backend
// - Timeout configurável
// - Headers com token de autenticação
// - Interceptadores para erros
// - Refresh de token automático

const client = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 30000,
});

// Interceptador de request
client.interceptors.request.use((config) => {
  const token = storage.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptador de response
client.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Refresh token ou redirecionar para login
    }
    return Promise.reject(error);
  }
);
```

### habitService.ts
```typescript
export const habitService = {
  async getHabits(): Promise<Habit[]> {
    const { data } = await apiClient.get('/habits');
    return data;
  },
  
  async createHabit(dto: CreateHabitDto): Promise<Habit> {
    const { data } = await apiClient.post('/habits', dto);
    return data;
  },
  
  async checkin(habitId: string, status: string): Promise<HabitLog> {
    const { data } = await apiClient.post(
      `/habits/${habitId}/checkin`,
      { status }
    );
    return data;
  },
};
```

## 🧭 Navegação com React Navigation

### RootNavigator.tsx
```typescript
// Estrutura principal de navegação

<NavigationContainer>
  {isSignedIn ? (
    <AppNavigator />      // Telas autenticadas
  ) : (
    <AuthNavigator />     // Telas de login/register
  )}
</NavigationContainer>
```

### AppNavigator.tsx (Após autenticação)
```typescript
// Bottom Tab Navigation

<Tab.Navigator>
  <Tab.Screen 
    name="Habits" 
    component={HabitsStack}
    options={{ tabBarIcon: HabitIcon }}
  />
  <Tab.Screen 
    name="Statistics" 
    component={StatisticsStack}
    options={{ tabBarIcon: ChartIcon }}
  />
  <Tab.Screen 
    name="Credits" 
    component={CreditsStack}
    options={{ tabBarIcon: CoinIcon }}
  />
  <Tab.Screen 
    name="Profile" 
    component={ProfileStack}
    options={{ tabBarIcon: UserIcon }}
  />
</Tab.Navigator>
```

## 🎨 Sistema de Estilos

### colors.ts
```typescript
export const colors = {
  primary: '#6366F1',      // Indigo
  secondary: '#EC4899',    // Rosa
  success: '#10B981',      // Verde
  warning: '#F59E0B',      // Laranja
  danger: '#EF4444',       // Vermelho
  background: '#FFFFFF',
  surface: '#F3F4F6',
  text: {
    primary: '#111827',
    secondary: '#6B7280',
    disabled: '#D1D5DB',
  },
};
```

### typography.ts
```typescript
export const typography = {
  size: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
  },
  weight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
};
```

## 🔐 Autenticação e Segurança

### Armazenamento Seguro de Token

```typescript
// storage.ts
import * as SecureStore from 'expo-secure-store';

export const storage = {
  async setToken(token: string) {
    await SecureStore.setItemAsync('auth_token', token);
  },
  
  async getToken(): Promise<string | null> {
    return await SecureStore.getItemAsync('auth_token');
  },
  
  async removeToken() {
    await SecureStore.deleteItemAsync('auth_token');
  },
};
```

### Fluxo de Login

```
1. Usuário preenche email/senha
   ↓
2. Validação local (email, força de senha)
   ↓
3. POST /auth/login com credenciais
   ↓
4. Backend retorna user + token
   ↓
5. Armazenar token em SecureStore
   ↓
6. Atualizar authStore
   ↓
7. Redirecionar para Dashboard
```

## 📊 Ciclo de Vida de Componente

```typescript
// Exemplo: HabitCard.tsx

const HabitCard = ({ habit }) => {
  const [loading, setLoading] = useState(false);
  
  // Efeitos (análogo ao componentDidMount)
  useEffect(() => {
    // Carregado ao montar
    loadHabitStats();
  }, [habit.id]);
  
  useFocusEffect(
    useCallback(() => {
      // Carregado ao voltar à tela
      refreshStats();
    }, [])
  );
  
  return (
    <View>
      {/* Renderização */}
    </View>
  );
};
```

## 🚀 Performance

### Otimizações Implementadas

1. **Lazy Loading**: Componentes pesados carregam sob demanda
2. **Memoization**: React.memo para componentes puros
3. **List Optimization**: FlatList com keyExtractor
4. **Image Caching**: Expo Image com caching
5. **Code Splitting**: Importações dinâmicas

### Exemplo: FlatList Otimizada

```typescript
<FlatList
  data={habits}
  renderItem={({ item }) => <HabitCard habit={item} />}
  keyExtractor={(item) => item.id}
  removeClippedSubviews={true}
  maxToRenderPerBatch={10}
  updateCellsBatchingPeriod={50}
/>
```

## 🧪 Estrutura de Testes

```typescript
// __tests__/services/habitService.test.ts

describe('habitService', () => {
  it('should fetch habits', async () => {
    const habits = await habitService.getHabits();
    expect(habits).toBeArray();
  });
  
  it('should create habit', async () => {
    const habit = await habitService.createHabit({
      title: 'Test',
      frequency: 'daily'
    });
    expect(habit.id).toBeDefined();
  });
});
```

## 📊 Padrões de Dados

### Habit Model
```typescript
interface Habit {
  id: string;
  title: string;
  description?: string;
  frequency: 'daily' | 'weekly' | 'custom';
  preferredTime?: string;
  isActive: boolean;
  stats?: {
    streak: number;
    completionRate: number;
    lastCompletion?: string;
  };
  createdAt: string;
  updatedAt: string;
}
```

### User Model
```typescript
interface User {
  id: string;
  email: string;
  name: string;
  planType: 'free' | 'premium';
  availableCredits: number;
  totalCredits: number;
  createdAt: string;
}
```

## 🔄 Fluxos de Dados Principais

### Fluxo: Criar Hábito

```
1. Usuario preenche formulário
2. onPress "Criar"
3. Validação local (title, frequency)
4. Loading spinner ativado
5. habitService.createHabit() chamado
6. POST /habits enviado ao backend
7. Se sucesso:
   - habitStore atualizado
   - Modal fechado
   - Toast de confirmação
8. Se erro:
   - Mensagem de erro exibida
   - retry possível
```

## 🎬 Animações e Transições

```typescript
// Usar Reanimated para animações suaves
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';

<Animated.View entering={FadeIn} exiting={SlideInDown}>
  <HabitCard habit={habit} />
</Animated.View>
```

---

**Última atualização**: Janeiro 2026
