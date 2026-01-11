# 🎨 Padrões de Design - HabitMind AI

Padrões de design utilizados no projeto.

---

## 📌 Índice da Seção

- [00_README.md](./00_README.md) - Overview
- [01_DESIGN_PATTERNS.md](./01_DESIGN_PATTERNS.md) - **Você está aqui**
- [02_DATA_FLOW.md](./02_DATA_FLOW.md) - Fluxo de dados
- [03_FOLDER_STRUCTURE.md](./03_FOLDER_STRUCTURE.md) - Estrutura de pastas

---

## 🏛️ Padrões Implementados

### 1️⃣ **MVC (Model-View-Controller)**

Estrutura básica separando dados (Model), apresentação (View) e lógica (Controller).

```
┌─────────────┐
│   Model     │  Store (Zustand) → authStore, habitStore
├─────────────┤
│   View      │  Components/Screens → DashboardScreen, HabitCard
├─────────────┤
│ Controller  │  Services → authService, habitService
└─────────────┘
```

**Exemplo:**
```typescript
// Model (Store)
const useAuthStore = create<AuthState>((set) => ({
  user: null,
  login: async (email, password) => { /* ... */ },
}));

// View (Screen)
const LoginScreen = () => {
  const { login } = useAuthStore();
  return <Button onPress={() => login(email, password)} />;
};

// Controller (Service)
class AuthService {
  async login(credentials) { /* ... */ }
}
```

---

### 2️⃣ **Factory Pattern**

Criar instâncias de objetos complexos de forma centralizada.

```typescript
// API Client Factory
class ApiClientFactory {
  static create(): AxiosInstance {
    const instance = axios.create({
      baseURL: API_BASE_URL,
      timeout: API_TIMEOUT,
    });
    
    instance.interceptors.request.use(/* ... */);
    instance.interceptors.response.use(/* ... */);
    
    return instance;
  }
}

const apiClient = ApiClientFactory.create();
```

---

### 3️⃣ **Singleton Pattern**

Garantir que apenas uma instância de um objeto exista.

```typescript
// API Client - Singleton
class ApiClient {
  private static instance: ApiClient;

  static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }
}

// Uso
const api = ApiClient.getInstance();
```

---

### 4️⃣ **Observer Pattern**

Observar mudanças de estado e reagir automaticamente.

```typescript
// Zustand já implementa Observer Pattern internamente
const useAuthStore = create<AuthState>((set) => ({
  user: null,
  // ...
}));

// Componente observa mudanças
const LoginScreen = () => {
  const user = useAuthStore((state) => state.user); // Observer
  const login = useAuthStore((state) => state.login);
  
  // Quando user muda, componente re-renderiza
  useEffect(() => {
    if (user) {
      navigation.navigate('Dashboard');
    }
  }, [user]);
};
```

---

### 5️⃣ **Strategy Pattern**

Encapsular diferentes estratégias de autenticação.

```typescript
// Diferentes estratégias de auth
interface AuthStrategy {
  authenticate(credentials: any): Promise<AuthResponse>;
}

class EmailPasswordStrategy implements AuthStrategy {
  async authenticate(credentials: LoginCredentials): Promise<AuthResponse> {
    return apiClient.post('/auth/login', credentials);
  }
}

class GoogleStrategy implements AuthStrategy {
  async authenticate(token: string): Promise<AuthResponse> {
    return apiClient.post('/auth/google', { token });
  }
}

// Usar
const strategy: AuthStrategy = new EmailPasswordStrategy();
const response = await strategy.authenticate(credentials);
```

---

### 6️⃣ **Decorator Pattern**

Adicionar funcionalidades a objetos dinamicamente.

```typescript
// Decorator para logging
function withLogging(target: any, propertyKey: string, descriptor: any) {
  const originalMethod = descriptor.value;
  
  descriptor.value = function(...args: any[]) {
    console.log(`Calling ${propertyKey}...`);
    return originalMethod.apply(this, args);
  };
  
  return descriptor;
}

// Usar
class AuthService {
  @withLogging
  async login(credentials) {
    // ...
  }
}
```

---

### 7️⃣ **Middleware Pattern**

Interceptadores que processam requisições/respostas.

```typescript
// Request Middleware
api.interceptors.request.use(
  (config) => {
    // Adicionar token
    config.headers.Authorization = `Bearer ${token}`;
    // Log
    console.log('Request:', config.url);
    return config;
  }
);

// Response Middleware
api.interceptors.response.use(
  (response) => {
    console.log('Response:', response.status);
    return response;
  },
  (error) => {
    // Handle 401
    if (error.response?.status === 401) {
      // Auto-logout
    }
    return Promise.reject(error);
  }
);
```

---

### 8️⃣ **Container Pattern**

Centralizar containers de estado e lógica.

```
components/
├── Button.tsx              # Presentational Component
├── Input.tsx               # Presentational Component
└── HabitCard.tsx           # Presentational Component

screens/
├── DashboardScreen.tsx     # Container Component
└── HabitDetailScreen.tsx   # Container Component
```

**Presentational vs Container:**
```typescript
// Presentational (reusável, sem estado)
const HabitCard = ({ habit, onPress }: Props) => (
  <TouchableOpacity onPress={onPress}>
    <Text>{habit.name}</Text>
  </TouchableOpacity>
);

// Container (com estado e lógica)
const DashboardScreen = () => {
  const habits = useHabitStore((s) => s.habits);
  
  return (
    <FlatList
      data={habits}
      renderItem={({ item }) => (
        <HabitCard habit={item} onPress={() => navigate('Detail', item)} />
      )}
    />
  );
};
```

---

## 📋 Matriz de Padrões

| Padrão | Localização | Propósito | Status |
|--------|------------|----------|--------|
| **MVC** | Toda a aplicação | Separação de responsabilidades | ✅ Implementado |
| **Factory** | apiClient.ts | Criar instâncias | ✅ Implementado |
| **Singleton** | apiClient.ts | Uma única instância | ✅ Implementado |
| **Observer** | Zustand stores | Reatividade | ✅ Implementado |
| **Strategy** | authService.ts | Múltiplos métodos auth | ⏳ Futuro |
| **Decorator** | Services | Logging e tracing | ⏳ Futuro |
| **Middleware** | apiClient.ts | Interceptadores | ✅ Implementado |
| **Container** | Screens | Separação componentes | ✅ Implementado |

---

## 🎯 Boas Práticas

### ✅ DO's

- ✅ Use **Services** para lógica de API
- ✅ Use **Stores** para estado global
- ✅ Use **Presentational Components** quando possível
- ✅ Tipifique tudo com **TypeScript**
- ✅ Use **Interceptadores** para comportamentos globais

### ❌ DON'Ts

- ❌ Não coloque lógica de API nos componentes
- ❌ Não use estado local quando deve ser global
- ❌ Não abandone TypeScript
- ❌ Não faça chamadas HTTP diretamente (sem Axios)
- ❌ Não misture responsabilidades em um arquivo

---

## 🔗 Links de Referência

- [Anterior: Overview ←](./00_README.md)
- [Próxima: Fluxo de Dados →](./02_DATA_FLOW.md)
- [Voltar ao Índice ↑](../00_INDEX.md)

---

**Última atualização**: Janeiro 2026  
**Status**: ✅ Completo
