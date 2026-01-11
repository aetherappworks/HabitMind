# 🚀 Guia Rápido de Desenvolvimento

## Getting Started

### 1. Instalação

```bash
cd app
npm install
```

### 2. Configurar Variáveis de Ambiente

Copie `.env.example` para `.env.local`:

```bash
cp .env.example .env.local
```

Edite `.env.local`:

```
REACT_APP_API_URL=http://localhost:3000
REACT_APP_API_TIMEOUT=30000
```

### 3. Iniciar o Servidor de Desenvolvimento

```bash
npm start
```

Escolha a plataforma:
- Pressione `i` para iOS
- Pressione `a` para Android
- Pressione `w` para Web

## 📱 Estrutura da App

### Fluxo de Autenticação

```
┌─────────────────────┐
│   LoginScreen       │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  authService.login()│◄──────────────┐
└──────────┬──────────┘               │
           │                          │
           ▼                          │
┌─────────────────────┐        ┌──────┴─────────┐
│  apiClient.post()   │        │  SecureStore   │
│  /auth/login        │        │  (Token)       │
└──────────┬──────────┘        └────────────────┘
           │
           ▼
┌─────────────────────┐
│  useAuthStore       │
│  (Zustand)          │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  App Tabs           │
│  (Autenticado)      │
└─────────────────────┘
```

### Fluxo de Hábitos

```
Dashboard
├── Listar Hábitos (GET /habits)
├── Criar Hábito (POST /habits)
└── Detalhe do Hábito
    ├── Visualizar (GET /habits/:id)
    ├── Registrar Check-in (POST /habits/:id/checkins)
    ├── Listar Check-ins (GET /habits/:id/checkins)
    └── Estatísticas (calculateStreak)
```

## 🔧 Adicionando Novas Features

### Exemplo: Adicionar novo endpoint

#### 1. Criar serviço

```typescript
// src/services/myService.ts
import { apiClient } from './apiClient';

export interface MyData {
  id: string;
  // ... seus campos
}

class MyService {
  async getData(): Promise<MyData[]> {
    return apiClient.get('/my-endpoint');
  }
}

export const myService = new MyService();
```

#### 2. Criar store Zustand

```typescript
// src/store/myStore.ts
import { create } from 'zustand';
import { myService } from '../services/myService';

interface MyState {
  data: MyData[];
  isLoading: boolean;
  error: string | null;
  getData: () => Promise<void>;
}

export const useMyStore = create<MyState>((set) => ({
  data: [],
  isLoading: false,
  error: null,
  
  getData: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await myService.getData();
      set({ data, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },
}));
```

#### 3. Usar em componente

```typescript
import { useMyStore } from '../../store/myStore';

export default function MyScreen() {
  const { data, getData, isLoading } = useMyStore();

  useEffect(() => {
    getData();
  }, []);

  return (
    // ... UI aqui
  );
}
```

## 🎨 Componentes Disponíveis

### Button

```typescript
<Button
  title="Clique aqui"
  onPress={() => console.log('Clicado')}
  variant="primary" // primary | secondary | danger
  size="large"      // small | medium | large
  icon="checkmark"  // ícone Ionicons
  loading={false}
  disabled={false}
/>
```

### Input

```typescript
<Input
  label="Email"
  placeholder="seu@email.com"
  value={email}
  onChangeText={setEmail}
  error={errors.email}
  icon="mail"
  multiline={false}
/>
```

### HabitCard

```typescript
<HabitCard
  habit={habitData}
  onPress={() => navigateToDetail()}
  onDelete={() => deleteHabit()}
  completedToday={true}
/>
```

## 🧪 Testando a API

### Login

```typescript
import { authService } from './services/authService';

// No terminal ou em um componente de teste
const response = await authService.login({
  email: 'user@example.com',
  password: 'password123'
});
console.log(response); // { accessToken, user }
```

### Criar Hábito

```typescript
import { habitService } from './services/habitService';

const habit = await habitService.createHabit({
  title: 'Fazer exercício',
  category: 'Saúde',
  frequency: 'daily',
});
console.log(habit); // Novo hábito criado
```

### Registrar Check-in

```typescript
const checkIn = await habitService.createCheckIn(habitId, {
  status: 'completed',
  notes: 'Fiz 30 minutos de corrida'
});
console.log(checkIn);
```

## 🐛 Debugging

### Habilitar logs de API

Edite `src/services/apiClient.ts`:

```typescript
this.client.interceptors.response.use(
  (response) => {
    console.log('API Response:', response);
    return response;
  }
);
```

### React Native Debugger

```bash
# Instalar (se não tiver)
brew install react-native-debugger

# Abrir
open "rndebugger://set-debugger-loc?host=localhost&port=8081"

# Na app, pressione Cmd+D (iOS) ou Cmd+M (Android)
# Selecione "Debug JS Remotely"
```

### Logs com Console

```typescript
console.log('Debug:', variable);
console.warn('Warning:', error);
console.error('Error:', error);

// React Navigation Debug
import { useNavigationState } from '@react-navigation/native';
const state = useNavigationState(state => state);
console.log('Navigation State:', state);
```

## 📊 Monitorar Estado

### Devtools Zustand

Instale:
```bash
npm install zustand-devtools
```

Use em dev:
```typescript
import { devtools } from 'zustand/middleware';

export const useAuthStore = create(
  devtools((set) => ({ ... }))
);
```

## 🚨 Problemas Comuns

### "Cannot find module axios"

```bash
npm install axios
```

### Token expirado

O app faz logout automaticamente. Veja `apiClient.ts` interceptador de resposta.

### API retorna 401

Verifique:
1. Token está sendo salvo: `await SecureStore.getItemAsync('accessToken')`
2. Header de autenticação está correto
3. Token não expirou (24h)

### Componente não rerenderiza após estado mudar

Certifique-se de usar o hook do store:

```typescript
// ✅ Correto
const { data } = useMyStore();

// ❌ Errado
const store = useMyStore;
const data = store.data; // Não reactivo
```

## 📚 Referências Úteis

- [React Native Docs](https://reactnative.dev/)
- [Expo Docs](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [Zustand Docs](https://github.com/pmndrs/zustand)
- [Axios Docs](https://axios-http.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 📞 Contato

Para dúvidas, consulte:
- API Docs: http://localhost:3000/api/docs
- Frontend Guide: ../docs/frontend/01_FRONTEND_GUIDE.md
- Deliverables: ../docs/frontend/02_DELIVERABLES.md
