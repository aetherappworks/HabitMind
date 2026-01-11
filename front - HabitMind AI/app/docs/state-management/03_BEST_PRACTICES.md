# 🎯 Melhores Práticas - Zustand

Padrões e boas práticas com Zustand.

---

## 📌 Índice da Seção

- [00_README.md](./00_README.md) - Overview
- [01_AUTH_STORE.md](./01_AUTH_STORE.md) - Auth Store
- [02_HABIT_STORE.md](./02_HABIT_STORE.md) - Habit Store
- [03_BEST_PRACTICES.md](./03_BEST_PRACTICES.md) - **Você está aqui**

---

## ✅ DO's

### **1. Selecione apenas o que precisa**

```typescript
// ✅ BOM - Apenas isLoading
const isLoading = useHabitStore((state) => state.isLoading);

// ❌ RUIM - Pega tudo (re-renderiza em qualquer mudança)
const store = useHabitStore();
```

### **2. Use Memoização para Seletores Complexos**

```typescript
import { useMemo } from 'react';

const sortedHabits = useMemo(
  () => useHabitStore((state) =>
    [...state.habits].sort((a, b) => b.streak - a.streak)
  ),
  [habits]
);
```

### **3. Separe State em Múltiplos Stores**

```typescript
// ✅ BOM
const { user } = useAuthStore();
const { habits } = useHabitStore();

// ❌ RUIM
const { user, habits, posts, comments } = useMegaStore();
```

### **4. Trate Erros Apropriadamente**

```typescript
try {
  await login(email, password);
} catch (error) {
  // Erro já está em store
  console.error(store.error);
}
```

### **5. Use useCallback para Actions**

```typescript
const { createHabit } = useHabitStore();

const memoizedCreateHabit = useCallback(
  (data) => createHabit(data),
  []
);
```

---

## ❌ DON'Ts

### **1. Não atualize estado fora de actions**

```typescript
// ❌ ERRADO
const store = useHabitStore.getState();
store.habits.push(newHabit);

// ✅ CORRETO
const { createHabit } = useHabitStore();
await createHabit(data);
```

### **2. Não passe store como prop**

```typescript
// ❌ ERRADO
<MyComponent store={useHabitStore()} />

// ✅ CORRETO
// Cada componente pega do store independentemente
const MyComponent = () => {
  const habits = useHabitStore((s) => s.habits);
};
```

### **3. Não modifique estado diretamente**

```typescript
// ❌ ERRADO
set((state) => {
  state.habits[0].title = 'Novo título';
  return state;
});

// ✅ CORRETO - Criar novo array
set((state) => ({
  habits: state.habits.map((h) =>
    h.id === '1' ? { ...h, title: 'Novo título' } : h
  ),
}));
```

### **4. Não crie novo store para cada feature**

```typescript
// ❌ ERRADO
const useUserStore = create(...);
const useHabitsStore = create(...);
const useNotificationsStore = create(...);
// ... 20 stores

// ✅ CORRETO - Agrupar logicamente
const useAuthStore = create(...);    // user + auth
const useHabitStore = create(...);   // habits + checkins
```

### **5. Não misture sincronização e assincronia**

```typescript
// ❌ ERRADO - Misturado
set((state) => {
  fetchData().then(data => set({ data })); // ❌ Async no set
  return { loading: true };
});

// ✅ CORRETO - Separado
const fetchData = async () => {
  set({ loading: true });
  const data = await apiClient.get('/data');
  set({ data, loading: false });
};
```

---

## 🎯 Padrões de Performance

### **1. Seletores Memorizados**

```typescript
// Para listas grandes
const selectSortedHabits = (state) =>
  [...state.habits].sort((a, b) => b.streak - a.streak);

const sortedHabits = useHabitStore(selectSortedHabits);
```

### **2. Lazy Loading**

```typescript
const loadHabitsByPage = async (page: number) => {
  set({ isLoading: true });
  const habits = await habitService.getHabits({ page, limit: 10 });
  set((state) => ({
    habits: [...state.habits, ...habits],
    isLoading: false,
  }));
};
```

### **3. Devtools (Debug)**

```typescript
import { devtools } from 'zustand/middleware';

export const useHabitStore = create<HabitState>(
  devtools((set) => ({
    // ... store
  }), { name: 'HabitStore' })
);
```

---

## 🔄 Padrões Comuns

### **Atualizar Item em Array**

```typescript
set((state) => ({
  habits: state.habits.map((habit) =>
    habit.id === habitId
      ? { ...habit, ...updates }
      : habit
  ),
}));
```

### **Deletar Item de Array**

```typescript
set((state) => ({
  habits: state.habits.filter((h) => h.id !== habitId),
}));
```

### **Adicionar Item em Array**

```typescript
set((state) => ({
  habits: [...state.habits, newHabit],
}));
```

### **Resetar Store**

```typescript
reset: () => set({
  habits: [],
  currentHabit: null,
  isLoading: false,
  error: null,
  stats: null,
}),
```

---

## 🔒 Segurança

### **Não salve dados sensíveis em store global**

```typescript
// ❌ ERRADO - Visível em devtools
set({ password: userPassword });

// ✅ CORRETO - Apenas em Secure Store
await secureStorage.setItem('token', token);
```

---

## 📊 Comparação: Zustand vs Redux vs Context

| Feature | Zustand | Redux | Context |
|---------|---------|-------|---------|
| **Setup** | Fácil | Complexo | Médio |
| **Bundle** | 2kb | 40kb | 0kb |
| **DevTools** | ✅ | ✅ | ❌ |
| **Middleware** | ✅ | ✅ | ❌ |
| **TypeScript** | ✅ | ✅ | ✅ |
| **Performance** | Ótima | Boa | Ruim |

---

## 🔗 Links de Referência

- [Anterior: Habit Store ←](./02_HABIT_STORE.md)
- [Voltar ao Índice ↑](../00_INDEX.md)

---

**Última atualização**: Janeiro 2026  
**Status**: ✅ Completo
