# 🏗️ Arquitetura - HabitMind AI

Visão geral da arquitetura, padrões e estrutura técnica do projeto.

---

## 📌 O que você encontrará nesta seção

- [00_README.md](./00_README.md) - **Você está aqui** - Overview da arquitetura
- [01_DESIGN_PATTERNS.md](./01_DESIGN_PATTERNS.md) - Padrões de design utilizados
- [02_DATA_FLOW.md](./02_DATA_FLOW.md) - Fluxo de dados na aplicação
- [03_FOLDER_STRUCTURE.md](./03_FOLDER_STRUCTURE.md) - Estrutura detalhada de pastas

---

## 🎯 Filosofia Arquitetural

O HabitMind AI foi construído seguindo princípios de **clean architecture** com divisão clara de responsabilidades:

```
┌─────────────────────────────────┐
│     Presentation Layer          │  Components, Screens, UI
├─────────────────────────────────┤
│     Business Logic Layer        │  Services, Validations
├─────────────────────────────────┤
│     State Management Layer      │  Zustand Stores
├─────────────────────────────────┤
│     Data Access Layer           │  API Client, Storage
├─────────────────────────────────┤
│     External Services           │  Backend API, Secure Store
└─────────────────────────────────┘
```

---

## 🏢 Estrutura em Alto Nível

```
HabitMind AI App/
│
├── App.tsx                          # Componente raiz
├── src/
│   ├── navigation/                  # Rotas e navegação
│   ├── screens/                     # Telas da aplicação
│   ├── components/                  # Componentes reutilizáveis
│   ├── services/                    # Lógica de negócio
│   ├── store/                       # Estado global (Zustand)
│   ├── styles/                      # Estilos compartilhados
│   └── utils/                       # Utilitários e helpers
│
└── docs/                            # Documentação
```

---

## 🔄 Fluxo de Requisição

```
User Input
    ↓
Screen Component
    ↓
Store (Zustand) - setLoading(true)
    ↓
Service Layer
    ↓
API Client (Axios)
    ↓
Backend API
    ↓
Response
    ↓
Store - setState(data)
    ↓
UI Re-render
```

---

## 📚 Conceitos Principais

### 1. **Separação de Camadas**

```
┌─────────────────────────────────────────┐
│          UI Components                  │  Telas, Cards, Buttons
│ (LoginScreen, DashboardScreen, etc.)   │
└──────────────────┬──────────────────────┘
                   │
                   ↓
┌─────────────────────────────────────────┐
│         State Management                │  useAuthStore, useHabitStore
│         (Zustand Stores)                │
└──────────────────┬──────────────────────┘
                   │
                   ↓
┌─────────────────────────────────────────┐
│         Services Layer                  │  authService, habitService
│    (Lógica de Negócio)                  │
└──────────────────┬──────────────────────┘
                   │
                   ↓
┌─────────────────────────────────────────┐
│         API Client Layer                │  apiClient (Axios)
│      (HTTP Communication)               │
└──────────────────┬──────────────────────┘
                   │
                   ↓
              Backend API
```

### 2. **Responsabilidades por Camada**

| Camada | Responsabilidade | Exemplos |
|--------|-----------------|----------|
| **Screens/Components** | Renderizar UI, capturar input do usuário | LoginScreen, HabitCard |
| **Stores (Zustand)** | Manter estado global, lógica de estado | useAuthStore, useHabitStore |
| **Services** | Lógica de negócio, chamadas de API | authService, habitService |
| **API Client** | Configurar Axios, interceptadores | apiClient |

### 3. **Type Safety**

Todo o projeto é **100% TypeScript** com:
- ✅ Interfaces definidas para todas as respostas de API
- ✅ Types para estado global
- ✅ Generics para componentes reutilizáveis
- ✅ Strict mode ativado no `tsconfig.json`

---

## 🔑 Padrões Utilizados

### **1. Store Pattern (Zustand)**

```typescript
// Criar um store
const useHabitStore = create<HabitState>((set) => ({
  habits: [],
  addHabit: (habit) => set({ habits: [...habits, habit] }),
}));

// Usar em componentes
const habits = useHabitStore((state) => state.habits);
```

### **2. Service Layer Pattern**

```typescript
// Abstrair lógica de API em serviços
class HabitService {
  async getHabits() { /* ... */ }
  async createHabit(data) { /* ... */ }
}

// Usar em stores
const habits = await habitService.getHabits();
```

### **3. Interceptor Pattern**

```typescript
// Adicionar token automaticamente
api.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

---

## 🛡️ Segurança

```
┌─────────────────────────────────────────┐
│        JWT Token (Bearer)               │
│   Armazenado em Secure Store            │
│   (Expo SecureStore)                    │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│   Request Interceptor                   │
│   Adiciona token em header              │
│   Authorization: Bearer <token>         │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│   Response Interceptor                  │
│   Verifica status 401 (expirado)       │
│   Auto-logout se token inválido        │
└─────────────────────────────────────────┘
```

---

## 📦 Dependências Principais

| Dependência | Propósito |
|------------|----------|
| **React Native** | Framework móvel |
| **Expo** | Tooling e abstrações |
| **TypeScript** | Type safety |
| **Axios** | HTTP client |
| **Zustand** | State management |
| **React Navigation** | Navegação |
| **Secure Store** | Token seguro |

---

## 🔗 Links de Referência

- [Próxima: Padrões de Design →](./01_DESIGN_PATTERNS.md)
- [Voltar ao Índice ↑](../00_INDEX.md)

---

**Última atualização**: Janeiro 2026  
**Status**: ✅ Completo
