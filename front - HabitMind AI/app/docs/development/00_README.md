# 🛠️ Development Guide - HabitMind AI

Setup, troubleshooting e guia de desenvolvimento.

---

## 📌 Índice da Seção

- [00_README.md](./00_README.md) - **Você está aqui**
- [00_ANDROID_SETUP.md](./00_ANDROID_SETUP.md) - Setup Android
- [01_BUG_FIXES.md](./01_BUG_FIXES.md) - Bug fixes
- [02_SECURE_STORAGE_FIX.md](./02_SECURE_STORAGE_FIX.md) - Secure Storage
- [03_TEXTINPUT_FIX.md](./03_TEXTINPUT_FIX.md) - TextInput
- [04_USEFOCUSEFFECT_FIX.md](./04_USEFOCUSEFFECT_FIX.md) - useFocusEffect
- [05_PERFORMANCE.md](./05_PERFORMANCE.md) - Performance

---

## 🚀 Quick Start

### 1. Instalação de Dependências

```bash
# Node 18+
node --version

# Instalar dependências
npm install

# Ou yarn
yarn install
```

### 2. Variáveis de Ambiente

Crie `.env` na raiz:

```env
REACT_APP_API_URL=http://localhost:3000
REACT_APP_API_TIMEOUT=30000
```

### 3. Rodar a Aplicação

```bash
# Expo (web + mobile)
npm start

# iOS
npm run ios

# Android
npm run android

# Web
npm run web
```

---

## 📚 O que você encontrará aqui

### Tópicos Cobertos:
- ✅ Setup inicial
- ✅ Android Emulator
- ✅ Bug fixes conhecidos
- ✅ Secure Storage
- ✅ Fixes de componentes
- ✅ Performance
- ✅ Troubleshooting

---

## 🔧 Ferramentas Recomendadas

| Ferramenta | Propósito | Link |
|-----------|----------|------|
| **Expo Go** | Teste mobile | [Baixar](https://expo.dev/go) |
| **Android Studio** | Emulador | [Baixar](https://developer.android.com/studio) |
| **VS Code** | Editor | [Baixar](https://code.visualstudio.com/) |
| **React Native Debugger** | Debug | [Baixar](https://github.com/jhen0409/react-native-debugger) |

---

## 🐛 Problemas Comuns

### **"Cannot find module 'react-native'"**
```bash
# Solução
npm install
```

### **"Localhost não funciona no Android"**
```
Android Emulator usa 10.0.2.2 em vez de localhost
Já configurado em src/services/apiClient.ts
```

### **"Token expirado"**
```
Auto-logout em status 401
Verifique secureStorage.ts
```

---

## 📖 Documentação por Seção

### [Android Setup](./00_ANDROID_SETUP.md)
Configure Android Emulator e debugue.

### [Bug Fixes](./01_BUG_FIXES.md)
Problemas encontrados e soluções.

### [Secure Storage](./02_SECURE_STORAGE_FIX.md)
Armazenamento seguro de tokens.

### [TextInput Fix](./03_TEXTINPUT_FIX.md)
Fixes de componentes de input.

### [useFocusEffect](./04_USEFOCUSEFFECT_FIX.md)
Hook customizado para foco de tela.

### [Performance](./05_PERFORMANCE.md)
Otimizações e métricas.

---

## 📊 Estrutura de Teste

### Testes Recomendados
```bash
# Unit tests
npm run test

# E2E tests (futuro)
npm run test:e2e

# Coverage
npm run test:coverage
```

---

## 🔗 Links de Referência

- [Próxima: Android Setup →](./00_ANDROID_SETUP.md)
- [Voltar ao Índice ↑](../00_INDEX.md)

---

**Última atualização**: Janeiro 2026  
**Status**: ✅ Completo
