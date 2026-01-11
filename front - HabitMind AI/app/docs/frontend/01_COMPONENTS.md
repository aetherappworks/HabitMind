# 🧩 Componentes Reutilizáveis - HabitMind AI

Documentação de componentes UI.

---

## 📌 Índice da Seção

- [00_README.md](./00_README.md) - Overview
- [01_COMPONENTS.md](./01_COMPONENTS.md) - **Você está aqui**
- [02_SCREENS.md](./02_SCREENS.md) - Telas
- [03_UI_UX_PATTERNS.md](./03_UI_UX_PATTERNS.md) - Padrões
- [04_FRONTEND_GUIDE.md](./04_FRONTEND_GUIDE.md) - Guia
- [05_DELIVERABLES.md](./05_DELIVERABLES.md) - Funcionalidades

---

## 📦 Button Component

**Arquivo**: `src/components/Button.tsx`

### Props
```typescript
interface ButtonProps {
  label: string;                    // Texto do botão
  onPress: () => void;             // Callback do clique
  loading?: boolean;               // Estado de carregamento
  disabled?: boolean;              // Desabilitado
  variant?: 'primary' | 'secondary' | 'danger'; // Estilo
  size?: 'small' | 'medium' | 'large'; // Tamanho
}
```

### Exemplo
```typescript
<Button
  label="Entrar"
  onPress={handleLogin}
  loading={isLoading}
  variant="primary"
/>
```

### Variantes
- **primary** - Cor indigo (principal)
- **secondary** - Cor purple (secundária)
- **danger** - Cor vermelha (destruir/logout)

---

## ✏️ Input Component

**Arquivo**: `src/components/Input.tsx`

### Props
```typescript
interface InputProps {
  placeholder: string;             // Placeholder
  value: string;                   // Valor atual
  onChangeText: (text: string) => void; // Callback de mudança
  type?: 'email' | 'password' | 'text'; // Tipo
  error?: string;                  // Mensagem de erro
  disabled?: boolean;              // Desabilitado
  multiline?: boolean;             // Múltiplas linhas
}
```

### Exemplo
```typescript
<Input
  placeholder="Email"
  value={email}
  onChangeText={setEmail}
  type="email"
  error={emailError}
/>
```

### Validação Integrada
- Email: Regex `^[^@]+@[^@]+\.[^@]+$`
- Password: Min 6 caracteres
- Text: Sem validação especial

---

## 🎴 HabitCard Component

**Arquivo**: `src/components/HabitCard.tsx`

### Props
```typescript
interface HabitCardProps {
  habit: {
    id: string;
    title: string;
    description?: string;
    category: string;
    streak: number;
    frequency: string;
  };
  onPress?: () => void;            // Clique no card
  onDelete?: () => void;           // Deletar
}
```

### Exemplo
```typescript
<HabitCard
  habit={{
    id: '1',
    title: 'Exercitar',
    category: 'Saúde',
    streak: 15,
    frequency: 'daily'
  }}
  onPress={() => navigate('Detail', habit)}
  onDelete={() => deleteHabit(habit.id)}
/>
```

### Informações Exibidas
- ✅ Título do hábito
- ✅ Sequência (streak)
- ✅ Categoria
- ✅ Frequência
- ✅ Botão de opções

---

## 📋 Modal Component

**Arquivo**: `src/components/HabitModal.tsx`

### Props
```typescript
interface HabitModalProps {
  visible: boolean;                // Visibilidade
  onClose: () => void;            // Fechar modal
  onSubmit: (data: HabitData) => Promise<void>; // Enviar
  initialData?: Habit;            // Para edição
}
```

### Exemplo
```typescript
<HabitModal
  visible={modalVisible}
  onClose={() => setModalVisible(false)}
  onSubmit={async (data) => {
    await createHabit(data);
    setModalVisible(false);
  }}
/>
```

### Campos do Formulário
- Title (obrigatório)
- Description (opcional)
- Category (obrigatório)
- Frequency (obrigatório)
- Preferred Time (time picker)

---

## 🔔 Toast Component

**Arquivo**: `src/components/Toast.tsx`

### Tipos
```typescript
type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  type: ToastType;
  message: string;
  duration?: number;              // Auto-dismiss em ms
}
```

### Exemplo
```typescript
// Global hook
import { useToast } from '../hooks/useToast';

const MyComponent = () => {
  const { showToast } = useToast();
  
  const handleSuccess = () => {
    showToast({
      type: 'success',
      message: 'Hábito criado!'
    });
  };
};
```

### Auto-Dismiss
- Padrão: 3000ms (3 segundos)
- Customizável por toast

---

## 🎯 Padrões de Componentes

### **Presentational (Dumb)**
```typescript
// Apenas renderiza, sem lógica
const Button = ({ label, onPress }: Props) => (
  <TouchableOpacity onPress={onPress}>
    <Text>{label}</Text>
  </TouchableOpacity>
);
```

### **Container (Smart)**
```typescript
// Com lógica e estado
const DashboardScreen = () => {
  const habits = useHabitStore((s) => s.habits);
  
  return (
    <FlatList
      data={habits}
      renderItem={({ item }) => <HabitCard habit={item} />}
    />
  );
};
```

---

## 🔄 Props Comuns

```typescript
// Todos os componentes suportam:
interface CommonProps {
  style?: StyleProp<ViewStyle>;    // Estilos adicionais
  testID?: string;                 // Para testes
  disabled?: boolean;              // Desabilitado
  opacity?: number;                // Opacidade
}
```

---

## ♿ Acessibilidade

Todos os componentes incluem:
- ✅ `accessibilityLabel`
- ✅ `accessibilityHint`
- ✅ Contrast de cores apropriado
- ✅ Tamanho mínimo de toque (44x44pt)

---

## 🔗 Links de Referência

- [Anterior: Overview ←](./00_README.md)
- [Próxima: Telas →](./02_SCREENS.md)
- [Voltar ao Índice ↑](../00_INDEX.md)

---

**Última atualização**: Janeiro 2026  
**Status**: ✅ Completo
