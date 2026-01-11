# 📂 Estrutura de Pastas - HabitMind AI

Guia detalhado da estrutura de diretórios.

---

## 📌 Índice da Seção

- [00_README.md](./00_README.md) - Overview
- [01_DESIGN_PATTERNS.md](./01_DESIGN_PATTERNS.md) - Padrões
- [02_DATA_FLOW.md](./02_DATA_FLOW.md) - Fluxo de dados
- [03_FOLDER_STRUCTURE.md](./03_FOLDER_STRUCTURE.md) - **Você está aqui**

---

## 🗂️ Estrutura Completa

```
app/
├── 📄 App.tsx                               # Componente raiz
├── 📄 app.json                              # Configuração Expo
├── 📄 babel.config.js                       # Babel config
├── 📄 tsconfig.json                         # TypeScript config
├── 📄 package.json                          # Dependências
│
├── 🗂️ src/
│   │
│   ├── 🗂️ navigation/
│   │   └── RootNavigator.tsx               # Configuração de rotas
│   │                                        # - Auth Stack
│   │                                        # - App Tabs (Habits/User)
│   │
│   ├── 🗂️ screens/
│   │   │
│   │   ├── auth/
│   │   │   ├── LoginScreen.tsx             # Tela de login
│   │   │   └── RegisterScreen.tsx          # Tela de registro
│   │   │
│   │   ├── habits/
│   │   │   ├── DashboardScreen.tsx         # Lista de hábitos
│   │   │   ├── CreateHabitScreen.tsx       # Criar/editar hábito
│   │   │   └── HabitDetailScreen.tsx       # Detalhes + check-in
│   │   │
│   │   └── user/
│   │       ├── ProfileScreen.tsx           # Perfil do usuário
│   │       └── CreditsScreen.tsx           # Saldo de créditos
│   │
│   ├── 🗂️ components/
│   │   ├── Button.tsx                      # Botão reutilizável
│   │   ├── Input.tsx                       # Input reutilizável
│   │   ├── HabitCard.tsx                   # Card do hábito
│   │   ├── HabitModal.tsx                  # Modal de criação
│   │   └── Toast.tsx                       # Notificações
│   │
│   ├── 🗂️ services/
│   │   ├── apiClient.ts                    # Cliente Axios
│   │   ├── authService.ts                  # Serviço de autenticação
│   │   └── habitService.ts                 # Serviço de hábitos
│   │
│   ├── 🗂️ store/
│   │   ├── authStore.ts                    # Store de autenticação
│   │   └── habitStore.ts                   # Store de hábitos
│   │
│   ├── 🗂️ styles/
│   │   └── shadows.ts                      # Estilos de sombra
│   │
│   ├── 🗂️ utils/
│   │   ├── secureStorage.ts                # Armazenamento seguro
│   │   └── useFocusEffect.ts               # Hook customizado
│   │
│   └── 🗂️ docs/
│       └── [Documentação dentro de src]
│
└── 🗂️ docs/
    └── [Documentação raiz - você está aqui]
```

---

## 📄 Descrição de Cada Pasta

### 🔹 `/src/navigation`

**Propósito**: Gerenciar a navegação da aplicação.

```
RootNavigator.tsx
│
├─► AuthStack
│   ├─ LoginScreen
│   └─ RegisterScreen
│
└─► AppTabs (BottomTabNavigator)
    ├─ HabitsStack
    │   ├─ DashboardScreen
    │   ├─ CreateHabitScreen
    │   └─ HabitDetailScreen
    │
    └─ UserStack
        ├─ ProfileScreen
        └─ CreditsScreen
```

**Arquivos**: `RootNavigator.tsx`  
**Responsabilidade**: Definir estrutura de rotas  
**Imports utilizados**: React Navigation, RN

---

### 🔹 `/src/screens`

**Propósito**: Telas da aplicação.

#### **Auth Stack**
- `LoginScreen.tsx` - Formulário de login
- `RegisterScreen.tsx` - Formulário de registro

#### **Habits Stack**
- `DashboardScreen.tsx` - Listagem de hábitos
- `CreateHabitScreen.tsx` - Criar/editar hábito
- `HabitDetailScreen.tsx` - Detalhes e check-in

#### **User Stack**
- `ProfileScreen.tsx` - Informações do usuário
- `CreditsScreen.tsx` - Sistema de créditos

**Características Comuns**:
- Conectadas aos stores via Zustand
- Chamam services para API
- Utilizam componentes reutilizáveis
- TypeScript 100%

---

### 🔹 `/src/components`

**Propósito**: Componentes reutilizáveis.

```
Button.tsx
├─ Props: label, onPress, loading, disabled
├─ Styling: cores customizadas
└─ Padrão: PresentationalComponent

Input.tsx
├─ Props: placeholder, value, onChangeText
├─ Validação: regex patterns
└─ Padrão: PresentationalComponent

HabitCard.tsx
├─ Props: habit, onPress, onDelete
├─ Exibe: título, sequência, categoria
└─ Padrão: PresentationalComponent

HabitModal.tsx
├─ Props: visible, onClose, onSubmit
├─ Formulário: título, descrição, etc
└─ Padrão: Container com formulário

Toast.tsx
├─ Notificações: sucesso, erro, info
├─ Auto-dismiss: 3s
└─ Padrão: Global notification
```

---

### 🔹 `/src/services`

**Propósito**: Lógica de negócio e integração com API.

```
apiClient.ts
├─ Cria: Instância Axios
├─ Configura: timeout, baseURL
└─ Interceptadores:
   ├─ Request: Adiciona token JWT
   └─ Response: Trata erros 401, etc

authService.ts
├─ login(email, password)
├─ register(email, name, password)
├─ getProfile()
├─ getCredits()
└─ updateProfile()

habitService.ts
├─ getHabits()
├─ createHabit(data)
├─ updateHabit(id, data)
├─ deleteHabit(id)
├─ checkIn(habitId, date)
└─ getStats(habitId)
```

**Pattern**: Service Layer  
**Responsabilidade**: Abstrair chamadas de API

---

### 🔹 `/src/store`

**Propósito**: Gerenciamento de estado global com Zustand.

```
authStore.ts (useAuthStore)
├─ State:
│  ├─ isAuthenticated: boolean
│  ├─ isLoading: boolean
│  ├─ user: User | null
│  ├─ credits: UserCredits | null
│  └─ error: string | null
│
└─ Actions:
   ├─ login(email, password)
   ├─ register(email, name, password)
   ├─ logout()
   ├─ checkAuthStatus()
   ├─ loadCredits()
   └─ clearError()

habitStore.ts (useHabitStore)
├─ State:
│  ├─ habits: Habit[]
│  ├─ currentHabit: Habit | null
│  ├─ isLoading: boolean
│  ├─ error: string | null
│  └─ stats: Stats | null
│
└─ Actions:
   ├─ getHabits()
   ├─ getHabit(id)
   ├─ createHabit(data)
   ├─ updateHabit(id, data)
   ├─ deleteHabit(id)
   ├─ checkIn(habitId, date)
   ├─ getStats(habitId)
   └─ clearError()
```

**Pattern**: Observer + Zustand  
**Responsabilidade**: Estado global, reatividade

---

### 🔹 `/src/styles`

**Propósito**: Estilos compartilhados.

```
shadows.ts
├─ Estilos de sombra cross-platform
├─ Web: boxShadow
└─ Mobile: shadowColor, shadowOffset, etc
```

**Uso**:
```typescript
import { shadows } from '../styles/shadows';

<View style={[styles.card, shadows.card]} />
```

---

### 🔹 `/src/utils`

**Propósito**: Funções utilitárias e helpers.

```
secureStorage.ts
├─ getItem(key)
├─ setItem(key, value)
├─ removeItem(key)
└─ Usa: Expo SecureStore

useFocusEffect.ts
├─ Hook customizado
├─ Executa ao focar tela
└─ Limpa ao desfocar
```

---

## 📊 Estatísticas por Pasta

| Pasta | Arquivos | Responsabilidade | Pattern |
|-------|----------|------------------|---------|
| **navigation** | 1 | Rotas | Router |
| **screens** | 7 | Telas/Containers | Container Component |
| **components** | 5 | UI reutilizável | Presentational Component |
| **services** | 3 | Lógica de negócio | Service Layer |
| **store** | 2 | Estado global | Observer |
| **styles** | 1 | Estilos | Utils |
| **utils** | 2 | Helpers | Utils |

---

## 🔄 Fluxo de Imports

```
Screen Component
    ↓
    ├─► import { useHabitStore } from '../store/habitStore'
    ├─► import HabitCard from '../components/HabitCard'
    └─► import { shadows } from '../styles/shadows'

Store
    ↓
    └─► import { habitService } from '../services/habitService'

Service
    ↓
    └─► import { apiClient } from './apiClient'

API Client
    ↓
    └─► import { secureStorage } from '../utils/secureStorage'
```

---

## ✅ Convenções de Nomeação

| Tipo | Convenção | Exemplo |
|------|-----------|---------|
| **Pastas** | lowercase | `src/screens/auth/` |
| **Componentes** | PascalCase | `HabitCard.tsx` |
| **Screens** | PascalCase + Screen | `DashboardScreen.tsx` |
| **Services** | camelCase + Service | `authService.ts` |
| **Stores** | camelCase + Store | `habitStore.ts` |
| **Hooks** | camelCase + use | `useFocusEffect.ts` |
| **Utils** | camelCase | `secureStorage.ts` |

---

## 🔗 Links de Referência

- [Anterior: Fluxo de Dados ←](./02_DATA_FLOW.md)
- [Voltar ao Índice ↑](../00_INDEX.md)

---

**Última atualização**: Janeiro 2026  
**Status**: ✅ Completo
