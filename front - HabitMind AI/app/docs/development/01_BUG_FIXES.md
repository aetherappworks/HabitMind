# 🐛 Problemas Detectados e Soluções

## Erro 1: TypeError com createNativeStackNavigator

### ❌ Problema
```
Uncaught TypeError: (0 , _stack.createNativeStackNavigator) is not a function
```

### 📍 Localização
`src/navigation/RootNavigator.tsx:17`

### 🔍 Causa
`createNativeStackNavigator` não funciona na web (React Native Web não o suporta). Funciona apenas em iOS/Android.

### ✅ Solução
Trocar para `createStackNavigator` que funciona em todas as plataformas:

```typescript
// ❌ ANTES
import { createNativeStackNavigator } from '@react-navigation/stack';
const Stack = createNativeStackNavigator();

// ✅ DEPOIS
import { createStackNavigator } from '@react-navigation/stack';
const Stack = createStackNavigator();
```

---

## Erro 2: Deprecated Shadow Props

### ⚠️ Aviso
```
"shadow" style props are deprecated. Use "boxShadow".
```

### 📍 Localização
- `src/screens/user/ProfileScreen.tsx`
- `src/screens/user/CreditsScreen.tsx`
- `src/components/HabitCard.tsx`

### 🔍 Causa
React Native Web pedindo para usar `boxShadow` em vez de `shadowColor`, `shadowOffset`, etc.

### ✅ Solução
Criado utilitário `src/styles/shadows.ts` com suporte cross-platform:

```typescript
import { Platform } from 'react-native';
import { shadows } from '../styles/shadows';

// Uso:
<View style={[styles.card, shadows.card]}>
  {/* conteúdo */}
</View>
```

O utilitário detecta a plataforma:
- **Web**: Usa `boxShadow` CSS
- **Mobile** (iOS/Android): Usa `shadowColor`, `shadowOffset`, etc.

---

## ✅ Status Atual

| Problema | Status | Ação |
|----------|--------|------|
| TypeError Stack Navigator | ✅ Corrigido | Trocar para `createStackNavigator` |
| Shadow Props Deprecated | ⚠️ Aviso | Usar novo utilitário `shadows.ts` |

---

## 📊 Resultados

**Antes:**
- ❌ TypeError ao carregar app
- ⚠️ Avisos de shadow deprecados

**Depois:**
- ✅ App compila sem erros críticos
- ✅ Bundle: 816ms (568 módulos)
- ✅ Web rodando em http://localhost:8081

---

## 🚀 Próximos Passos Recomendados

1. **Atualizar componentes** para usar novo utilitário de sombras:
   - `ProfileScreen.tsx`
   - `CreditsScreen.tsx`
   - `HabitCard.tsx`

2. **Testar em Web** - Verificar visual

3. **Testar em Mobile** - Usar Expo Go:
   ```bash
   npm start
   # Escanear QR code com Expo Go
   ```

---

## 📁 Arquivos Modificados

- ✅ `src/navigation/RootNavigator.tsx` - Corrigido import
- ✅ `src/styles/shadows.ts` - Novo utilitário criado

## 📚 Referências

- [React Navigation Stack Navigator](https://reactnavigation.org/docs/native-stack-navigator/)
- [React Native Web Styles](https://necolas.github.io/react-native-web/docs/)
- [Platform specific code](https://reactnative.dev/docs/platform-specific-code)
