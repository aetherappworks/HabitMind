# 🎨 Padrões UI/UX - HabitMind AI

Padrões e guias de design.

---

## 📌 Índice da Seção

- [00_README.md](./00_README.md) - Overview
- [01_COMPONENTS.md](./01_COMPONENTS.md) - Componentes
- [02_SCREENS.md](./02_SCREENS.md) - Telas
- [03_UI_UX_PATTERNS.md](./03_UI_UX_PATTERNS.md) - **Você está aqui**
- [04_FRONTEND_GUIDE.md](./04_FRONTEND_GUIDE.md) - Guia
- [05_DELIVERABLES.md](./05_DELIVERABLES.md) - Funcionalidades

---

## 🎨 Design System

### **Paleta de Cores**

```typescript
export const Colors = {
  // Brand
  primary: '#6366f1',        // Indigo
  primaryLight: '#818cf8',   // Indigo Light
  primaryDark: '#4f46e5',    // Indigo Dark
  
  // Status
  success: '#10b981',        // Green
  warning: '#f59e0b',        // Amber
  error: '#ef4444',          // Red
  info: '#3b82f6',           // Blue
  
  // Neutral
  dark: '#1f2937',           // Gray-900
  darkMed: '#374151',        // Gray-700
  medium: '#6b7280',         // Gray-500
  light: '#e5e7eb',          // Gray-200
  lighter: '#f3f4f6',        // Gray-100
  white: '#ffffff',
  
  // Backgrounds
  bg: '#f9fafb',             // Gray-50
  bgSecondary: '#ffffff',    // White
};
```

### **Tipografia**

```typescript
export const Typography = {
  // Tamanhos
  heading1: { fontSize: 28, fontWeight: 'bold' },
  heading2: { fontSize: 24, fontWeight: 'bold' },
  heading3: { fontSize: 20, fontWeight: '600' },
  body: { fontSize: 16, fontWeight: '400' },
  bodySmall: { fontSize: 14, fontWeight: '400' },
  caption: { fontSize: 12, fontWeight: '500' },
  
  // Line heights
  lineHeightTight: 1.2,
  lineHeightNormal: 1.5,
  lineHeightRelaxed: 1.75,
};
```

### **Espaçamento**

```typescript
export const Spacing = {
  xs: 4,      // Micro spacing
  sm: 8,      // Small
  md: 12,     // Medium (padrão)
  lg: 16,     // Large
  xl: 20,     // Extra large
  '2xl': 24,  // 2x Extra large
  '3xl': 32,  // 3x Extra large
};
```

---

## 📐 Layout Patterns

### **1. Card Pattern**

```typescript
// Padrão para cards
const cardStyle = {
  backgroundColor: Colors.white,
  borderRadius: 12,
  padding: Spacing.lg,
  marginHorizontal: Spacing.md,
  marginVertical: Spacing.sm,
  ...shadows.card,  // Sombra
};
```

### **2. Button Pattern**

```typescript
// Estados de botão
const buttonState = {
  default: { opacity: 1 },
  pressed: { opacity: 0.7 },
  disabled: { opacity: 0.5 },
  loading: { opacity: 0.7 },
};
```

### **3. Input Pattern**

```typescript
// Estados de input
const inputState = {
  default: { borderColor: Colors.light },
  focused: { borderColor: Colors.primary },
  error: { borderColor: Colors.error },
  disabled: { backgroundColor: Colors.lighter },
};
```

---

## 🎯 Padrões de Interação

### **Loading State**
```
Botão → Loading ⟳ → Sucesso ✓ ou Erro ✕
```

### **Form Validation**
```
Input → onChange → Validação → Erro ou OK
                                   ↓
                            Estado do Button
```

### **Modal Pattern**
```
Tela → Botão → Modal Overlay → Form → Submit
          ↓                       ↓
        Background      Sucesso/Erro
        dimmed                    ↓
                            Fechar Modal
```

---

## ✨ Micro-interactions

### **Button Press**
- Feedback tátil (haptic)
- Mudança de opacidade
- Cor de feedback visual

### **List Item**
- Highlight ao tocar
- Feedback tátil opcional
- Animação suave

### **Form Validation**
- Feedback visual em tempo real
- Mensagem de erro clara
- Estado visual do campo

---

## ♿ Acessibilidade

### **Tamanhos Mínimos**
- Botões: 44x44 pt (iOS), 48x48 dp (Android)
- Espaçamento: 8pt mínimo

### **Contrast**
- Texto: 4.5:1 (normal)
- Large text: 3:1 (mínimo)

### **Labels**
```typescript
<TouchableOpacity
  accessibilityLabel="Criar hábito"
  accessibilityHint="Duplo clique para abrir formulário"
>
  {/* ... */}
</TouchableOpacity>
```

---

## 🌙 Dark Mode (Futuro)

Estrutura preparada para dark mode:

```typescript
// Colors adaptam-se ao tema
const getColors = (isDarkMode: boolean) => ({
  bg: isDarkMode ? '#1f2937' : '#f9fafb',
  text: isDarkMode ? '#ffffff' : '#1f2937',
  // ...
});
```

---

## 📱 Responsividade

### **Breakpoints**
```typescript
const Breakpoints = {
  small: 320,    // iPhone SE
  medium: 375,   // iPhone X
  large: 414,    // iPhone Plus
  extraLarge: 480, // Tablets
};
```

### **Adaptive Layout**
```typescript
const isSmallScreen = width < Breakpoints.medium;

<View style={{
  paddingHorizontal: isSmallScreen ? Spacing.sm : Spacing.lg,
}}>
```

---

## 🎬 Animações

### **Transições de Tela**
```
Fade In: 200ms
Slide: 300ms
Bounce: 400ms
```

### **Componentes Animados**
```typescript
import { Animated } from 'react-native';

const fadeAnim = useRef(new Animated.Value(0)).current;

Animated.timing(fadeAnim, {
  toValue: 1,
  duration: 300,
  useNativeDriver: true,
}).start();
```

---

## ✅ Checklist de Design

- ✅ Consistência de cores
- ✅ Tipografia legível
- ✅ Espaçamento adequado
- ✅ Acessibilidade OK
- ✅ Responsivo
- ✅ Feedback visual
- ✅ Tratamento de erros
- ✅ Loading states

---

## 🔗 Links de Referência

- [Anterior: Telas ←](./02_SCREENS.md)
- [Próxima: Frontend Guide →](./04_FRONTEND_GUIDE.md)
- [Voltar ao Índice ↑](../00_INDEX.md)

---

**Última atualização**: Janeiro 2026  
**Status**: ✅ Completo
