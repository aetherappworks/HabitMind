# 🧩 Componentes e Telas - Frontend

## 📑 Índice

- [Componentes Reutilizáveis](#componentes-reutilizáveis)
- [Telas Principais](#telas-principais)
- [Modais](#modais)
- [Padrões de Implementação](#padrões-de-implementação)

---

## 🧩 Componentes Reutilizáveis

### Button.tsx

**Propósito**: Botão universal para toda a aplicação

```typescript
interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}
```

**Variantes**:
- `primary`: Cor principal (Indigo), fundo sólido
- `secondary`: Cor secundária (Rosa), fundo sólido
- `danger`: Vermelho para ações destrutivas
- `outline`: Apenas borda, sem fundo

**Exemplos**:
```typescript
// Primário
<Button 
  label="Completar" 
  onPress={handleComplete}
  variant="primary"
/>

// Com ícone e carregamento
<Button
  label="Salvando..."
  onPress={handleSave}
  loading={isLoading}
  icon={<SaveIcon />}
/>

// Full width (tela inteira)
<Button
  label="Login"
  onPress={handleLogin}
  fullWidth
/>

// Outline
<Button
  label="Cancelar"
  onPress={handleCancel}
  variant="outline"
/>
```

---

### Input.tsx

**Propósito**: Campo de entrada unificado (email, texto, senha)

```typescript
interface InputProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric';
  error?: string;
  icon?: React.ReactNode;
  label?: string;
  disabled?: boolean;
  multiline?: boolean;
}
```

**Exemplos**:
```typescript
// Email
<Input
  label="Email"
  placeholder="seu@email.com"
  value={email}
  onChangeText={setEmail}
  keyboardType="email-address"
  error={emailError}
  icon={<EmailIcon />}
/>

// Senha
<Input
  label="Senha"
  placeholder="Mínimo 8 caracteres"
  value={password}
  onChangeText={setPassword}
  secureTextEntry
  error={passwordError}
/>

// Descrição (multiline)
<Input
  placeholder="Descrever seu hábito..."
  value={description}
  onChangeText={setDescription}
  multiline
  error={descriptionError}
/>
```

---

### HabitCard.tsx

**Propósito**: Card exibindo informações de um hábito

```typescript
interface HabitCardProps {
  habit: Habit;
  onPress: () => void;
  onComplete?: () => void;
  showStreak?: boolean;
  showCompletionRate?: boolean;
}
```

**Estrutura Visual**:
```
┌──────────────────────────────┐
│ 🎯 Beber 2L de Água          │
│ ────────────────────────────│
│ Frequência: Diário           │
│ Horário: 07:00               │
│ ────────────────────────────│
│ 📊 Streak: 7 dias ✅ Hoje   │
│ Taxa de conclusão: 85%       │
│ ────────────────────────────│
│  [Detalhes]    [Completar]  │
└──────────────────────────────┘
```

**Comportamentos**:
- Toque no card: Abre tela de detalhes
- Botão "Completar": Abre modal de check-in
- Visual: Muda cor se completado hoje

**Exemplo**:
```typescript
const HabitsScreen = () => {
  const { habits } = useHabitStore();
  
  return (
    <FlatList
      data={habits}
      renderItem={({ item }) => (
        <HabitCard
          habit={item}
          onPress={() => navigateToDetail(item.id)}
          onComplete={() => showCheckInModal(item.id)}
          showStreak
          showCompletionRate
        />
      )}
      keyExtractor={(item) => item.id}
    />
  );
};
```

---

### CheckInModal.tsx

**Propósito**: Modal para registrar conclusão de hábito

```typescript
interface CheckInModalProps {
  visible: boolean;
  habitId: string;
  habitTitle: string;
  onClose: () => void;
  onSubmit: (notes: string) => void;
  loading?: boolean;
}
```

**Estrutura**:
```
┌────────────────────────────────┐
│ ✓ Completar Hábito             │
├────────────────────────────────┤
│                                │
│ 📝 Beber 2L de Água           │
│                                │
│ Notas (opcional):              │
│ ┌──────────────────────────┐   │
│ │ Completado no horário... │   │
│ └──────────────────────────┘   │
│                                │
│ [Cancelar]  [Confirmar]       │
└────────────────────────────────┘
```

**Funcionalidades**:
- Campo de notas opcional
- Validação de horário
- Opção para ver ou assistir anúncio depois
- Animação de entrada/saída

**Exemplo**:
```typescript
const [checkInVisible, setCheckInVisible] = useState(false);
const [notes, setNotes] = useState('');

const handleCheckIn = async (habitId: string) => {
  await habitService.checkin(habitId, 'completed', notes);
  setCheckInVisible(false);
  showToast('Hábito completado!');
};

return (
  <>
    <HabitCard onComplete={() => setCheckInVisible(true)} />
    <CheckInModal
      visible={checkInVisible}
      habitId={selectedHabitId}
      onClose={() => setCheckInVisible(false)}
      onSubmit={handleCheckIn}
    />
  </>
);
```

---

### HabitModal.tsx

**Propósito**: Modal para criar ou editar hábito

```typescript
interface HabitModalProps {
  visible: boolean;
  mode: 'create' | 'edit';
  initialData?: Habit;
  onClose: () => void;
  onSubmit: (data: CreateHabitDto | UpdateHabitDto) => void;
}
```

**Estrutura**:
```
┌────────────────────────────────┐
│ + Criar Novo Hábito            │
├────────────────────────────────┤
│ Título *                       │
│ [__________________________]    │
│                                │
│ Descrição (opcional)           │
│ [__________________________]    │
│                                │
│ Frequência *                   │
│ [▼ Diário        ▼]            │
│   Diário                       │
│   Semanal                      │
│   Customizado                  │
│                                │
│ Horário Preferido              │
│ [HH:MM]                        │
│                                │
│ [Cancelar]  [Criar]           │
└────────────────────────────────┘
```

**Validações**:
- Título obrigatório (3+ caracteres)
- Frequência obrigatória
- Horário válido (HH:MM)

---

### AIAnalysisModal.tsx

**Propósito**: Exibir insights gerados pela IA

```typescript
interface AIAnalysisModalProps {
  visible: boolean;
  habitId: string;
  insights: AIInsight[];
  loading?: boolean;
  onClose: () => void;
}
```

**Estrutura**:
```
┌────────────────────────────────┐
│ 🤖 Análise com IA              │
├────────────────────────────────┤
│                                │
│ 📊 Análise de Padrões         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│ "Você completa esse hábito     │
│  85% das vezes. Melhor         │
│  desempenho entre 7-8 AM"      │
│ Confiança: ■■■■■□ 92%        │
│                                │
│ ⏰ Sugestão de Horário        │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│ "Mude para 7 AM para melhor    │
│  desempenho (90% sucesso)"     │
│ Confiança: ■■■■□□ 88%        │
│                                │
│ 🎉 Encorajamento              │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│ "Parabéns! 7 dias seguidos!"   │
│ Confiança: ■■■■■■ 95%        │
│                                │
│ [Fechar]                       │
└────────────────────────────────┘
```

**Funcionalidades**:
- Scroll para múltiplos insights
- Confidence score visual (barra)
- Ícone por tipo de insight
- Pull-to-refresh

---

### Toast.tsx

**Propósito**: Notificações não-bloqueantes

```typescript
interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
  onClose?: () => void;
}
```

**Exemplos**:
```typescript
// Sucesso
showToast('Hábito criado com sucesso!', 'success');

// Erro
showToast('Erro ao salvar hábito', 'error');

// Info
showToast('Carregando dados...', 'info');

// Warning
showToast('Limite de créditos atingido', 'warning');
```

---

## 📱 Telas Principais

### AuthNavigator

#### LoginScreen.tsx

**Responsabilidade**: Autenticar usuário existente

**Fluxo**:
1. Usuário preenche email e senha
2. Toca em "Entrar"
3. Validação local
4. Chamada para API
5. Se sucesso: armazena token e vai para Dashboard
6. Se erro: mostra mensagem e permite retry

**Elementos da Tela**:
```
┌──────────────────────────────────┐
│                                  │
│        HabitMind AI Logo         │
│                                  │
│      Bem-vindo de volta!         │
│                                  │
│  Email:                          │
│  [________________]              │
│                                  │
│  Senha:                          │
│  [________________]              │
│                                  │
│  [ ] Lembrar-me                  │
│                                  │
│     [Entrar]                     │
│                                  │
│  Não tem conta? Criar conta →    │
│  Esqueceu a senha?               │
│                                  │
└──────────────────────────────────┘
```

**Exemplo**:
```typescript
const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();
  
  const handleLogin = async () => {
    setLoading(true);
    try {
      await login(email, password);
      // Navegação automática via authStore
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <View style={styles.content}>
        <Logo />
        <Input
          label="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <Input
          label="Senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <Button
          label={loading ? "Entrando..." : "Entrar"}
          onPress={handleLogin}
          loading={loading}
          fullWidth
        />
        <TouchableOpacity onPress={() => navigate('Register')}>
          <Text>Não tem conta? Criar conta</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};
```

---

#### RegisterScreen.tsx

**Responsabilidade**: Criar nova conta

**Fluxo**:
1. Usuário preenche formulário
2. Validações locais
3. Toca "Criar Conta"
4. Registra na API
5. Efetua login automático
6. Vai para Dashboard

**Validações**:
- Email válido e não existente
- Senha forte (8+ chars, maiúscula, número, símbolo)
- Senhas conferem
- Nome obrigatório

---

### HabitsNavigator

#### DashboardScreen.tsx

**Responsabilidade**: Listar e gerenciar hábitos do usuário

**Estrutura Visual**:
```
┌────────────────────────────────┐
│ 🎯 Meus Hábitos    👤ⓘ        │ (Header)
├────────────────────────────────┤
│ Créditos: 25 💰 [ⓘ]           │ (Card de status)
│                                │
│ 📝 Hábitos Ativos (3):         │ (Seção)
│ ┌────────────────────────────┐ │
│ │ 🎯 Beber Água - Diário     │ │ (HabitCard)
│ │ Streak: 7 ✅ Taxa: 85%     │ │
│ │ [Ver] [✓ Completar]        │ │
│ └────────────────────────────┘ │
│ ┌────────────────────────────┐ │
│ │ 🏃 Exercício - 5x/semana   │ │
│ │ Streak: 3 ✅ Taxa: 72%     │ │
│ └────────────────────────────┘ │
│                                │
│ ┌────────────────────────────┐ │
│ │ [+ Novo Hábito]            │ │
│ └────────────────────────────┘ │
│                                │
│                                │
│              [+ Novo Hábito]   │ (FAB - Floating Action Button)
└────────────────────────────────┘
```

**Funcionalidades**:
- Pull-to-refresh para atualizar
- Swipe para deletar hábito
- Badge de notificação se hábito pendente
- Rápido acesso a criar novo

**Exemplo**:
```typescript
const DashboardScreen = () => {
  const { habits, getHabits } = useHabitStore();
  const [refreshing, setRefreshing] = useState(false);
  
  useFocusEffect(
    useCallback(() => {
      getHabits();
    }, [])
  );
  
  const handleRefresh = async () => {
    setRefreshing(true);
    await getHabits();
    setRefreshing(false);
  };
  
  return (
    <View style={styles.container}>
      <Header title="Meus Hábitos" />
      <CreditsBanner />
      <FlatList
        data={habits}
        renderItem={({ item }) => (
          <HabitCard
            habit={item}
            onPress={() => navigateToDetail(item.id)}
            onComplete={() => showCheckInModal(item.id)}
          />
        )}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing}
            onRefresh={handleRefresh}
          />
        }
      />
      <FAB
        icon="plus"
        label="Novo Hábito"
        onPress={() => showHabitModal('create')}
      />
    </View>
  );
};
```

---

#### HabitDetailScreen.tsx

**Responsabilidade**: Exibir detalhes completos de um hábito

**Estrutura Visual**:
```
┌────────────────────────────────┐
│ ← 🎯 Beber 2L de Água    ⋮     │ (Header com menu)
├────────────────────────────────┤
│                                │
│ Manter hidratação durante o    │ (Descrição)
│ dia                            │
│                                │
│ ┌────────────────────────────┐ │
│ │ Frequência: Diário         │ │ (Info)
│ │ Horário: 07:00             │ │
│ │ Status: Ativo              │ │
│ │ Criado: 10/01/2024         │ │
│ └────────────────────────────┘ │
│                                │
│ 📊 Estatísticas (30 dias):    │ (Seção)
│ ┌────────────────────────────┐ │
│ │ Conclusões: 25/30          │ │
│ │ Taxa: 83%                  │ │
│ │ Streak Atual: 7 dias       │ │
│ │ Maior Streak: 15 dias      │ │
│ └────────────────────────────┘ │
│                                │
│ 📈 Gráfico de Conclusões      │ (Gráfico)
│ [Gráfico aqui]                 │
│                                │
│ 🤖 Insights com IA            │ (Botão)
│ [Ver Análises]                 │
│                                │
│ [Editar]  [Deletar]           │ (Ações)
└────────────────────────────────┘
```

**Funcionalidades**:
- Mostrar gráfico de completamentos
- Carregar análises com IA
- Editar hábito
- Deletar com confirmação
- Ver histórico de check-ins

---

#### StatisticsScreen.tsx

**Responsabilidade**: Dashboard geral de estatísticas

**Estrutura Visual**:
```
┌────────────────────────────────┐
│ 📊 Estatísticas       Período: 📅│
├────────────────────────────────┤
│                                │
│ Resumo Geral:                  │
│ ┌────────────────────────────┐ │
│ │ Total de Hábitos: 5        │ │
│ │ Taxa Média: 82%            │ │
│ │ Dias Rastreados: 87        │ │
│ │ Completações Totais: 145   │ │
│ └────────────────────────────┘ │
│                                │
│ Melhores Hábitos:              │
│ 1. Meditação - 95%             │
│ 2. Leitura - 88%               │
│ 3. Água - 85%                  │
│                                │
│ Hábitos com Dificuldade:       │
│ 1. Exercício - 65%             │
│ 2. Dessert - 60%               │
│                                │
│ 📈 Gráfico de Tendência:       │
│ [Gráfico aqui]                 │
│                                │
│ [Exportar]  [Compartilhar]     │
└────────────────────────────────┘
```

---

### UserNavigator

#### ProfileScreen.tsx

**Responsabilidade**: Dados e configurações do usuário

**Elementos**:
- Avatar do usuário
- Nome e email
- Plano (Free/Premium)
- Opções: Editar perfil, trocar senha
- Logout

---

#### CreditsScreen.tsx

**Responsabilidade**: Gerenciar créditos

**Estrutura**:
```
┌────────────────────────────────┐
│ 💰 Meus Créditos               │
├────────────────────────────────┤
│                                │
│ Saldo Atual: 25 créditos       │ (Grande)
│ Total Ganho: 50 créditos       │
│                                │
│ Ganhos Este Mês:               │
│ ┌────────────────────────────┐ │
│ │ Hoje: 5                    │ │
│ │ Esta Semana: 20            │ │
│ │ Este Mês: 50               │ │
│ └────────────────────────────┘ │
│                                │
│ [Comprar Créditos]             │ (IAP - futuro)
│                                │
│ Histórico de Transações:       │
│ ┌────────────────────────────┐ │
│ │ +5 créditos - Ad View      │ │
│ │ 10/01/2024 19:45           │ │
│ └────────────────────────────┘ │
│ ┌────────────────────────────┐ │
│ │ +10 créditos - Novo Usuário│ │
│ │ 10/01/2024 10:00           │ │
│ └────────────────────────────┘ │
│                                │
└────────────────────────────────┘
```

---

## 🔄 Padrões de Implementação

### 1. Usando Zustand Store

```typescript
// In a screen/component
const MyComponent = () => {
  // Obter estado
  const { habits, loading, error } = useHabitStore();
  
  // Obter ações
  const { getHabits, createHabit } = useHabitStore();
  
  // Usar em efeito
  useEffect(() => {
    getHabits();
  }, []);
  
  return (
    <View>
      {loading ? (
        <ActivityIndicator />
      ) : (
        <FlatList data={habits} ... />
      )}
    </View>
  );
};
```

### 2. Tratamento de Erros

```typescript
const handleAction = async () => {
  try {
    setLoading(true);
    await performAction();
    showToast('Sucesso!', 'success');
  } catch (error) {
    showToast(
      error.response?.data?.message || 'Erro desconhecido',
      'error'
    );
  } finally {
    setLoading(false);
  }
};
```

### 3. Validação de Formulário

```typescript
const validateEmail = (email: string): string | null => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email) ? null : 'Email inválido';
};

const validatePassword = (password: string): string | null => {
  if (password.length < 8) return 'Mínimo 8 caracteres';
  if (!/[A-Z]/.test(password)) return 'Deve ter maiúscula';
  if (!/[0-9]/.test(password)) return 'Deve ter número';
  return null;
};

// Usar
const [emailError, setEmailError] = useState<string | null>(null);
const handleEmailChange = (email: string) => {
  setEmail(email);
  setEmailError(validateEmail(email));
};
```

### 4. Navegação Condicional

```typescript
const RootNavigator = () => {
  const { user, token } = useAuthStore();
  
  return (
    <NavigationContainer>
      {token ? (
        <AppNavigator />        // Usuário autenticado
      ) : (
        <AuthNavigator />       // Login/Register
      )}
    </NavigationContainer>
  );
};
```

### 5. Otimização com useFocusEffect

```typescript
// Recarregar dados ao voltar à tela
useFocusEffect(
  useCallback(() => {
    refreshData();
  }, [])
);
```

---

**Última atualização**: Janeiro 2026
