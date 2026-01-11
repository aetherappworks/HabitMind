# 💳 State Management - Zustand Stores

Gerenciamento de estado global com Zustand.

---

## 📌 Índice da Seção

**[Criando nova subcategoria]**

- [00_README.md](./00_README.md) - **Você está aqui**
- [01_AUTH_STORE.md](./01_AUTH_STORE.md) - Auth Store
- [02_HABIT_STORE.md](./02_HABIT_STORE.md) - Habit Store
- [03_BEST_PRACTICES.md](./03_BEST_PRACTICES.md) - Melhores práticas

---

## 🎯 O que é Zustand?

Zustand é uma biblioteca leve de state management para React/React Native.

### Vantagens:
- ✅ Muito simples de usar
- ✅ Zero boilerplate
- ✅ Pequeno bundle size (~2kb)
- ✅ TypeScript first
- ✅ Performance otimizada

---

## 📦 Stores do Projeto

### **1. useAuthStore**
Gerencia autenticação, usuário e créditos.

**Localização**: `src/store/authStore.ts`

### **2. useHabitStore**
Gerencia hábitos, check-ins e estatísticas.

**Localização**: `src/store/habitStore.ts`

---

## 🏗️ Anatomia de um Store

```typescript
import { create } from 'zustand';

interface StoreState {
  // State
  data: any;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchData: () => Promise<void>;
  clearError: () => void;
}

export const useStore = create<StoreState>((set, get) => ({
  // Initial state
  data: null,
  isLoading: false,
  error: null,

  // Actions
  fetchData: async () => {
    set({ isLoading: true });
    try {
      const data = await api.getData();
      set({ data, error: null });
    } catch (error) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
```

---

## 🔄 Padrões de Uso

### **1. Selecionar Parte do Estado**

```typescript
// ✅ Recomendado - Seleciona apenas o que precisa
const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

// ❌ Evitar - Re-renderiza em qualquer mudança
const allState = useAuthStore();
```

### **2. Usar Múltiplos Valores**

```typescript
const { user, isLoading, error } = useAuthStore((state) => ({
  user: state.user,
  isLoading: state.isLoading,
  error: state.error,
}));
```

### **3. Chamar Actions**

```typescript
const { login, logout } = useAuthStore((state) => ({
  login: state.login,
  logout: state.logout,
}));

await login(email, password);
```

---

## 🔧 API de Zustand

### **set()**
Atualiza o estado.

```typescript
set({ isLoading: false, user: newUser });

// Com função (baseado no estado anterior)
set((state) => ({
  items: [...state.items, newItem],
}));
```

### **get()**
Acessa o estado atual (dentro de actions).

```typescript
const currentUser = get().user;
```

### **Subscriptions**
Observar mudanças (avançado).

```typescript
const unsubscribe = useAuthStore.subscribe(
  (state) => state.user,
  (user) => console.log('User changed:', user)
);

// Limpar
unsubscribe();
```

---

## 🧹 Limpeza de Estado

### **Logout**

```typescript
logout: async () => {
  // Limpar dados
  await secureStorage.removeItem('accessToken');
  await AsyncStorage.removeItem('user');
  
  // Resetar estado
  set({
    isAuthenticated: false,
    user: null,
    error: null,
  });
}
```

### **Persistência**

```typescript
// Salvar para AsyncStorage
await AsyncStorage.setItem('user', JSON.stringify(user));

// Carregar ao inicializar
const savedUser = await AsyncStorage.getItem('user');
if (savedUser) {
  set({ user: JSON.parse(savedUser) });
}
```

---

## 🔗 Links de Referência

- [Próxima: Auth Store →](./01_AUTH_STORE.md)
- [Voltar ao Índice ↑](../00_INDEX.md)

---

**Última atualização**: Janeiro 2026  
**Status**: ✅ Completo
