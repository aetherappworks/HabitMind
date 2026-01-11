# 🔄 Fluxo de Dados - HabitMind AI

Como os dados fluem através da aplicação.

---

## 📌 Índice da Seção

- [00_README.md](./00_README.md) - Overview
- [01_DESIGN_PATTERNS.md](./01_DESIGN_PATTERNS.md) - Padrões
- [02_DATA_FLOW.md](./02_DATA_FLOW.md) - **Você está aqui**
- [03_FOLDER_STRUCTURE.md](./03_FOLDER_STRUCTURE.md) - Estrutura de pastas

---

## 🔀 Fluxo Geral de Dados

```
┌──────────────────────────────────────────────┐
│  User interacts with Screen                  │
│  (toca botão, preenche form, etc)            │
└────────────────┬─────────────────────────────┘
                 │
┌────────────────▼─────────────────────────────┐
│  Screen calls Store action                   │
│  Ex: useAuthStore.login(email, password)    │
└────────────────┬─────────────────────────────┘
                 │
┌────────────────▼─────────────────────────────┐
│  Store sets isLoading = true                 │
│  (UI mostra loading state)                   │
└────────────────┬─────────────────────────────┘
                 │
┌────────────────▼─────────────────────────────┐
│  Store calls Service method                  │
│  Ex: authService.login(credentials)          │
└────────────────┬─────────────────────────────┘
                 │
┌────────────────▼─────────────────────────────┐
│  Service calls API Client                    │
│  Ex: apiClient.post('/auth/login', data)     │
└────────────────┬─────────────────────────────┘
                 │
┌────────────────▼─────────────────────────────┐
│  Request Interceptor adds token              │
│  Authorization: Bearer <token>               │
└────────────────┬─────────────────────────────┘
                 │
┌────────────────▼─────────────────────────────┐
│  HTTP POST to Backend API                    │
│  POST /auth/login                            │
└────────────────┬─────────────────────────────┘
                 │
         Backend Processing
                 │
┌────────────────▼─────────────────────────────┐
│  Backend returns 200 + accessToken           │
└────────────────┬─────────────────────────────┘
                 │
┌────────────────▼─────────────────────────────┐
│  Response Interceptor checks status          │
│  if 401: auto-logout                         │
│  else: continue                              │
└────────────────┬─────────────────────────────┘
                 │
┌────────────────▼─────────────────────────────┐
│  Service returns response                    │
└────────────────┬─────────────────────────────┘
                 │
┌────────────────▼─────────────────────────────┐
│  Store updates state:                        │
│  - isAuthenticated = true                    │
│  - user = response.user                      │
│  - isLoading = false                         │
│  - error = null                              │
└────────────────┬─────────────────────────────┘
                 │
┌────────────────▼─────────────────────────────┐
│  Secure Store saves token                    │
│  AsyncStorage saves user                     │
└────────────────┬─────────────────────────────┘
                 │
┌────────────────▼─────────────────────────────┐
│  Component re-renders (observa mudanças)     │
│  - Mostra novo estado                        │
│  - navega para próxima tela se necessário     │
└──────────────────────────────────────────────┘
```

---

## 🔐 Fluxo de Autenticação

```
LoginScreen
    │
    ├─► input: email, password
    │
    ▼
┌──────────────────────────┐
│ useAuthStore.login()     │
│ - setLoading(true)       │
│ - clearError()           │
└──────────────┬───────────┘
               │
┌──────────────▼───────────┐
│ authService.login()      │
│ - calls API              │
└──────────────┬───────────┘
               │
┌──────────────▼───────────┐
│ apiClient.post()         │
│ - adds interceptor       │
│ - HTTP request           │
└──────────────┬───────────┘
               │
         Backend API
               │
┌──────────────▼───────────┐
│ Success Response         │
│ {                        │
│   accessToken: string    │
│   user: { ... }          │
│ }                        │
└──────────────┬───────────┘
               │
┌──────────────▼───────────────────┐
│ Store saves & updates:           │
│ - secureStorage.setItem(token)  │
│ - asyncStorage.setItem(user)    │
│ - isAuthenticated = true         │
│ - user = data.user              │
│ - isLoading = false             │
└──────────────┬───────────────────┘
               │
               ▼
         Navigation →
        DashboardScreen
```

---

## 📱 Fluxo de Criação de Hábito

```
DashboardScreen
    │
    ├─► botão "+" 
    │
    ▼
CreateHabitScreen
    │
    ├─► preenchimento do form
    │   - title
    │   - description
    │   - category
    │   - frequency
    │   - preferredTime
    │
    ├─► validação
    │
    ▼
useHabitStore.createHabit(data)
    │
    ├─► setLoading(true)
    ├─► clearError()
    │
    ▼
habitService.createHabit(data)
    │
    ├─► apiClient.post('/habits', data)
    ├─► Interceptor adiciona token
    │
    ▼
Backend API
    │
    ├─► validação
    ├─► save no BD
    │
    ▼
Response {
  id: string,
  title: string,
  ...
}
    │
    ▼
Store atualiza:
    │
    ├─► habits.push(newHabit)
    ├─► isLoading = false
    ├─► refresh lista
    │
    ▼
DashboardScreen re-renderiza
    │
    ├─► novo hábito aparece na lista
    │
    ▼
Navigation volta para Dashboard
```

---

## 🔄 Fluxo de Check-in (Completar Hábito)

```
HabitDetailScreen
    │
    ├─► usuário toca "Completar"
    │
    ▼
useHabitStore.checkIn(habitId, date)
    │
    ├─► habitService.checkIn(habitId, date)
    │
    ▼
apiClient.post('/habits/:id/checkins', data)
    │
    ├─► Interceptor adiciona token
    │
    ▼
Backend API
    │
    ├─► registra check-in
    ├─► atualiza streak
    ├─► deduz créditos
    │
    ▼
Response {
  checkin: {...},
  newStreak: number,
  creditsUsed: number,
  ...
}
    │
    ▼
Store atualiza:
    │
    ├─► currentHabit.streak = newStreak
    ├─► userCredits -= creditsUsed
    ├─► checkins.push(newCheckin)
    │
    ▼
UI mostra:
    │
    ├─► Toast de sucesso
    ├─► novo streak
    ├─► créditos atualizados
```

---

## 🔒 Fluxo de Segurança (Token Refresh)

```
Screen faz request
    │
    ▼
Request Interceptor
    │
    ├─► get token do secureStorage
    ├─► add Authorization header
    │
    ▼
Request enviado
    │
    ▼
Response
    │
    ├─ if status === 200 ✅
    │  └─► retorna response
    │
    ├─ if status === 401 ❌
    │  └─► Response Interceptor
    │      │
    │      ├─► token expirado
    │      ├─► chama store.logout()
    │      │   - remove token
    │      │   - remove user
    │      │   - isAuthenticated = false
    │      │
    │      └─► Navigation → LoginScreen
    │
    └─ if status === 5xx
       └─► mostra error toast
```

---

## 📊 Estado Global (Zustand Store)

### **Auth Store**
```
┌─────────────────────────────────┐
│  useAuthStore                   │
├─────────────────────────────────┤
│ State:                          │
│ ├─ isAuthenticated: boolean     │
│ ├─ isLoading: boolean           │
│ ├─ user: User | null            │
│ ├─ credits: Credits | null      │
│ └─ error: string | null         │
│                                 │
│ Actions:                        │
│ ├─ login()                      │
│ ├─ register()                   │
│ ├─ logout()                     │
│ ├─ checkAuthStatus()            │
│ ├─ loadCredits()                │
│ └─ clearError()                 │
└─────────────────────────────────┘
```

### **Habit Store**
```
┌─────────────────────────────────┐
│  useHabitStore                  │
├─────────────────────────────────┤
│ State:                          │
│ ├─ habits: Habit[]              │
│ ├─ currentHabit: Habit | null   │
│ ├─ isLoading: boolean           │
│ ├─ error: string | null         │
│ └─ stats: Stats | null          │
│                                 │
│ Actions:                        │
│ ├─ getHabits()                  │
│ ├─ createHabit()                │
│ ├─ updateHabit()                │
│ ├─ deleteHabit()                │
│ ├─ checkIn()                    │
│ ├─ getStats()                   │
│ └─ clearError()                 │
└─────────────────────────────────┘
```

---

## 🎯 Exemplo Prático: Login

```typescript
// 1. Screen
<Button onPress={() => login(email, password)} />

// 2. Store
const login = async (email, password) => {
  set({ isLoading: true, error: null });
  
  try {
    // 3. Service
    const response = await authService.login({ email, password });
    
    // 4. Persist
    await secureStorage.setItem('accessToken', response.accessToken);
    await AsyncStorage.setItem('user', JSON.stringify(response.user));
    
    // 5. Update state
    set({
      isAuthenticated: true,
      user: response.user,
      isLoading: false,
    });
    
    // 6. Navigate (triggered by component watching state)
    // useEffect(() => {
    //   if (isAuthenticated) navigate('Dashboard');
    // }, [isAuthenticated])
  } catch (error) {
    set({
      error: error.message,
      isLoading: false,
    });
  }
};
```

---

## 🔗 Links de Referência

- [Anterior: Padrões ←](./01_DESIGN_PATTERNS.md)
- [Próxima: Estrutura de Pastas →](./03_FOLDER_STRUCTURE.md)
- [Voltar ao Índice ↑](../00_INDEX.md)

---

**Última atualização**: Janeiro 2026  
**Status**: ✅ Completo
