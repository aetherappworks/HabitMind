# 📋 Habit Store - Zustand

Documentação do store de hábitos.

---

## 📌 Índice da Seção

- [00_README.md](./00_README.md) - Overview
- [01_AUTH_STORE.md](./01_AUTH_STORE.md) - Auth Store
- [02_HABIT_STORE.md](./02_HABIT_STORE.md) - **Você está aqui**
- [03_BEST_PRACTICES.md](./03_BEST_PRACTICES.md) - Melhores práticas

---

## 📂 Arquivo

**Localização**: `src/store/habitStore.ts`

---

## 🏗️ Estrutura do Habit Store

### **State**

```typescript
interface HabitState {
  // Estado
  habits: Habit[];                    // Lista de hábitos
  currentHabit: Habit | null;         // Hábito selecionado
  isLoading: boolean;                 // Carregando?
  error: string | null;               // Erro
  stats: HabitStats | null;           // Estatísticas
  
  // Actions
  getHabits: () => Promise<void>;
  getHabit: (id: string) => Promise<void>;
  createHabit: (data: CreateHabitDTO) => Promise<void>;
  updateHabit: (id: string, data: UpdateHabitDTO) => Promise<void>;
  deleteHabit: (id: string) => Promise<void>;
  checkIn: (habitId: string, date: string) => Promise<void>;
  getStats: (habitId: string) => Promise<void>;
  clearError: () => void;
}
```

---

## 🔄 Actions Disponíveis

### **getHabits()**

Busca lista completa de hábitos.

```typescript
const { getHabits, habits } = useHabitStore();

useEffect(() => {
  getHabits();
}, []);

// habits = [{ id, title, category, streak, ... }, ...]
```

---

### **getHabit(habitId)**

Busca detalhes de um hábito específico.

```typescript
const { getHabit, currentHabit } = useHabitStore();

await getHabit('habit-123');
// currentHabit = { id, title, description, stats, ... }
```

---

### **createHabit(data)**

Cria novo hábito.

```typescript
const { createHabit } = useHabitStore();

await createHabit({
  title: 'Exercitar',
  description: '30 minutos cardio',
  category: 'Saúde',
  frequency: 'daily',
  preferredTime: '07:00',
});

// Novo hábito adicionado à lista
```

---

### **updateHabit(habitId, data)**

Atualiza hábito existente.

```typescript
const { updateHabit } = useHabitStore();

await updateHabit('habit-123', {
  title: 'Exercitar 1h',
  preferredTime: '06:00',
});
```

---

### **deleteHabit(habitId)**

Deleta um hábito.

```typescript
const { deleteHabit } = useHabitStore();

await deleteHabit('habit-123');
// Hábito removido da lista
```

---

### **checkIn(habitId, date)**

Registra conclusão de um hábito.

```typescript
const { checkIn } = useHabitStore();

await checkIn('habit-123', '2025-01-10');

// Atualiza:
// - streak (sequência)
// - checkins list
// - créditos (deduz)
```

---

### **getStats(habitId)**

Busca estatísticas de um hábito.

```typescript
const { getStats, stats } = useHabitStore();

await getStats('habit-123');

// stats = {
//   currentStreak: 15,
//   bestStreak: 25,
//   completionRate: 0.85,
//   lastSevenDays: [1, 1, 0, 1, 1, 1, 0],
//   ...
// }
```

---

## 📊 Tipos de Dados

### **Habit**

```typescript
interface Habit {
  id: string;
  userId: string;
  title: string;
  description?: string;
  category: string;
  frequency: 'daily' | 'weekly' | 'custom';
  preferredTime?: string;
  streak: number;
  bestStreak: number;
  lastCheckinDate?: string;
  createdAt: string;
  updatedAt: string;
}
```

### **CreateHabitDTO**

```typescript
interface CreateHabitDTO {
  title: string;
  description?: string;
  category: string;
  frequency: 'daily' | 'weekly' | 'custom';
  preferredTime?: string;
}
```

### **HabitStats**

```typescript
interface HabitStats {
  currentStreak: number;
  bestStreak: number;
  completionRate: number;
  lastSevenDays: number[];
  totalCompletions: number;
  missedDays: number;
}
```

---

## 🔄 Exemplo de Uso

### **DashboardScreen**

```typescript
const DashboardScreen = () => {
  const { habits, getHabits, isLoading, deleteHabit } = useHabitStore();
  
  useEffect(() => {
    getHabits();
  }, []);
  
  const handleRefresh = () => {
    getHabits();
  };
  
  const handleDelete = async (habitId) => {
    await deleteHabit(habitId);
  };
  
  return (
    <FlatList
      data={habits}
      refreshing={isLoading}
      onRefresh={handleRefresh}
      renderItem={({ item }) => (
        <HabitCard
          habit={item}
          onPress={() => navigate('Detail', item)}
          onDelete={() => handleDelete(item.id)}
        />
      )}
    />
  );
};
```

### **HabitDetailScreen**

```typescript
const HabitDetailScreen = ({ route }) => {
  const { habitId } = route.params;
  const { currentHabit, stats, getHabit, getStats, checkIn } = 
    useHabitStore();
  
  useEffect(() => {
    getHabit(habitId);
    getStats(habitId);
  }, [habitId]);
  
  const handleCheckIn = async () => {
    const today = dayjs().format('YYYY-MM-DD');
    await checkIn(habitId, today);
  };
  
  return (
    <View>
      <Text>{currentHabit?.title}</Text>
      <Text>Sequência: {stats?.currentStreak}</Text>
      <Button label="Completar" onPress={handleCheckIn} />
    </View>
  );
};
```

---

## 🎯 Padrões Comuns

### **Refresh on Focus**

```typescript
import { useFocusEffect } from '../utils/useFocusEffect';

const DashboardScreen = () => {
  const { getHabits } = useHabitStore();
  
  useFocusEffect(() => {
    getHabits();
  });
};
```

### **Filtrar Hábitos**

```typescript
const filteredHabits = useHabitStore(
  (state) => state.habits.filter((h) => h.category === 'Saúde')
);
```

### **Ordenar por Sequência**

```typescript
const sortedHabits = useHabitStore(
  (state) => [...state.habits].sort((a, b) => b.streak - a.streak)
);
```

---

## ⚙️ Estados de Loading

```
false       → Dados carregados
true        → Carregando dados/ação
error       → Mensagem se erro
```

---

## 🔗 Links de Referência

- [Anterior: Auth Store ←](./01_AUTH_STORE.md)
- [Próxima: Best Practices →](./03_BEST_PRACTICES.md)
- [Voltar ao Índice ↑](../00_INDEX.md)

---

**Última atualização**: Janeiro 2026  
**Status**: ✅ Completo
