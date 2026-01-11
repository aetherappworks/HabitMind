# 📱 Telas da Aplicação - HabitMind AI

Documentação de todas as 7 telas.

---

## 📌 Índice da Seção

- [00_README.md](./00_README.md) - Overview
- [01_COMPONENTS.md](./01_COMPONENTS.md) - Componentes
- [02_SCREENS.md](./02_SCREENS.md) - **Você está aqui**
- [03_UI_UX_PATTERNS.md](./03_UI_UX_PATTERNS.md) - Padrões
- [04_FRONTEND_GUIDE.md](./04_FRONTEND_GUIDE.md) - Guia
- [05_DELIVERABLES.md](./05_DELIVERABLES.md) - Funcionalidades

---

## 🗺️ Mapa de Navegação

```
App
│
├─► Not Authenticated
│   ├─ LoginScreen ◄─►─┐
│   └─ RegisterScreen──┘
│
└─► Authenticated (Bottom Tabs)
    │
    ├─ Habits Stack
    │   ├─ DashboardScreen (home)
    │   ├─ CreateHabitScreen
    │   └─ HabitDetailScreen
    │
    └─ User Stack
        ├─ ProfileScreen (profile)
        └─ CreditsScreen
```

---

## 🔐 Auth Stack (2 telas)

### **1. LoginScreen**

**Arquivo**: `src/screens/auth/LoginScreen.tsx`

**Propósito**: Permitir usuário fazer login.

**Componentes**:
- Header com logo
- Input de email (validado)
- Input de senha (tipo password)
- Botão Login (com loading)
- Link "Não tem conta? Registrar"
- Tratamento de erros

**Fluxo**:
```
1. Usuário preenche email/senha
2. Validação local
3. Clica "Entrar"
4. Chama useAuthStore.login()
5. Se sucesso: navega para Dashboard
6. Se erro: mostra toast de erro
```

**Estado**:
```typescript
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const { login, isLoading, error } = useAuthStore();
```

---

### **2. RegisterScreen**

**Arquivo**: `src/screens/auth/RegisterScreen.tsx`

**Propósito**: Registrar novo usuário.

**Componentes**:
- Header com backbutton
- Input de nome
- Input de email (validado)
- Input de senha (validado)
- Input de confirmação de senha
- Botão Register (com loading)
- Validação de senhas iguais
- Link "Já tem conta? Entrar"

**Validações**:
```
- Nome: Não vazio, min 2 caracteres
- Email: Formato válido
- Senha: Min 6 caracteres
- Confirmação: Igual à senha
```

**Fluxo**:
```
1. Usuário preenche formulário
2. Validação completa
3. Clica "Registrar"
4. Chama useAuthStore.register()
5. Se sucesso: auto-login + navega Dashboard
6. Se erro: mostra mensagem específica
```

---

## 📝 Habits Stack (3 telas)

### **3. DashboardScreen**

**Arquivo**: `src/screens/habits/DashboardScreen.tsx`

**Propósito**: Listar hábitos do usuário.

**Componentes**:
- Header com "Meus Hábitos"
- Search/Filter (opcional)
- FlatList de hábitos
- Botão "+" para criar
- Pull to refresh
- Empty state
- Delete com confirmação

**Funcionalidades**:
- ✅ Listar hábitos
- ✅ Ordenar por sequência/nome
- ✅ Pull to refresh
- ✅ Deletar hábito
- ✅ Navegar para detalhes
- ✅ Criar novo hábito

**Fluxo de Dados**:
```
DashboardScreen
├─ useHabitStore.habits (FlatList)
├─ useHabitStore.deleteHabit()
├─ useHabitStore.getHabits() (refresh)
└─ navigate('CreateHabit') ou navigate('Detail', habit)
```

---

### **4. CreateHabitScreen**

**Arquivo**: `src/screens/habits/CreateHabitScreen.tsx`

**Propósito**: Criar novo ou editar hábito existente.

**Formulário**:
- Title (obrigatório)
- Description (opcional)
- Category (picker)
- Frequency (picker: daily, weekly, custom)
- Preferred Time (time picker)

**Validações**:
```
- Title: não vazio, max 50 chars
- Category: obrigatório
- Frequency: obrigatório
```

**Ações**:
- Criar hábito novo
- Editar hábito existente
- Cancelar (volta para Dashboard)

**Fluxo**:
```
1. Usuário preenche campos
2. Clica "Criar"
3. Validação local
4. Chama useHabitStore.createHabit()
5. Se sucesso: volta Dashboard
6. Se erro: mostra erro
```

---

### **5. HabitDetailScreen**

**Arquivo**: `src/screens/habits/HabitDetailScreen.tsx`

**Propósito**: Visualizar detalhes e fazer check-in.

**Seções**:
1. **Header**
   - Título do hábito
   - Ícone da categoria

2. **Estatísticas**
   - Sequência atual (streak)
   - Melhor sequência
   - Últimos 7 dias

3. **Ações**
   - Botão "Completar"
   - Botão "Pular"
   - Botão "Editar"
   - Botão "Deletar"

4. **Histórico**
   - Últimos 10 check-ins
   - Datas e status

**Fluxo de Check-in**:
```
1. Usuário toca "Completar"
2. Confirmação
3. Chama useHabitStore.checkIn()
4. Atualiza sequência
5. Deduz créditos
6. Mostra toast de sucesso
```

---

## 👤 User Stack (2 telas)

### **6. ProfileScreen**

**Arquivo**: `src/screens/user/ProfileScreen.tsx`

**Propósito**: Mostrar e editar perfil do usuário.

**Informações**:
- Avatar com inicial do nome
- Nome do usuário
- Email
- Tipo de plano (free/premium)
- Data de criação da conta

**Ações**:
- Ver créditos disponíveis
- Editar perfil
- Logout (com confirmação)

**Fluxo**:
```
1. Tela carrega dados do store
2. Mostra informações
3. Se logout: logout() + volta para LoginScreen
```

---

### **7. CreditsScreen**

**Arquivo**: `src/screens/user/CreditsScreen.tsx`

**Propósito**: Gerenciar e visualizar créditos.

**Informações**:
1. **Card Principal**
   - Créditos totais
   - Créditos disponíveis hoje

2. **Progressbar**
   - Uso do dia (%)
   - Limite diário

3. **Como Ganhar**
   - Completar hábitos
   - Assistir anúncios
   - Streak rewards

4. **Histórico**
   - Últimas transações de créditos

**Fluxo**:
```
1. Tela carrega dados
2. Mostra saldo e uso
3. Mostra histórico
4. Se clica em "Como ganhar": tooltip explicativo
```

---

## 📊 Tabela de Telas

| Tela | Stack | Autenticado | Funcionalidade |
|------|-------|------------|-----------------|
| **LoginScreen** | Auth | ❌ | Login |
| **RegisterScreen** | Auth | ❌ | Registro |
| **DashboardScreen** | Habits | ✅ | Listar hábitos |
| **CreateHabitScreen** | Habits | ✅ | CRUD hábitos |
| **HabitDetailScreen** | Habits | ✅ | Check-in + stats |
| **ProfileScreen** | User | ✅ | Perfil |
| **CreditsScreen** | User | ✅ | Créditos |

---

## 🔗 Links de Referência

- [Anterior: Componentes ←](./01_COMPONENTS.md)
- [Próxima: Padrões UI/UX →](./03_UI_UX_PATTERNS.md)
- [Voltar ao Índice ↑](../00_INDEX.md)

---

**Última atualização**: Janeiro 2026  
**Status**: ✅ Completo
