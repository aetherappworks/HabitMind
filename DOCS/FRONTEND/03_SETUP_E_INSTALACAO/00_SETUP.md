# 🚀 Setup e Instalação - Frontend

## ⚙️ Pré-requisitos

### Obrigatório

- **Node.js**: v18+ ([Download](https://nodejs.org/))
- **npm**: v9+ (incluído com Node.js)
- **Expo CLI**: Instalado globalmente
- **Git**: ([Download](https://git-scm.com/))

### Por Plataforma

**iOS** (apenas macOS):
- **Xcode**: 14+ com Xcode Command Line Tools
- **Cocoapods**: Gerenciador de dependências
- **Simulador iOS**: Incluído no Xcode

**Android**:
- **Android Studio**: Ou Android SDK Standalone
- **JDK**: 11 ou 17
- **Emulador Android**: Ou dispositivo físico
- **Variáveis de ambiente**:
  - `ANDROID_HOME`: Caminho da SDK
  - `JAVA_HOME`: Caminho do JDK

**Web**:
- Apenas Node.js necessário

## 📥 Instalação Passo a Passo

### 1️⃣ Verificar Pré-requisitos

```bash
# Node.js
node --version
# Esperado: v18.x.x ou superior

# npm
npm --version
# Esperado: v9.x.x ou superior

# Git
git --version
```

### 2️⃣ Instalar Expo CLI (Global)

```bash
# Instalar globalmente
npm install -g expo-cli

# Verificar instalação
expo --version
# Esperado: versão 51.x.x ou similar

# Login no Expo (opcional mas recomendado)
expo login
# Será pedido email e senha
```

### 3️⃣ Clonar Repositório

```bash
# Clonar
git clone https://github.com/seu-usuario/habitsmind-ai.git

# Entrar na pasta do frontend
cd "front - HabitMind AI"
cd app

# Verificar estrutura
ls -la
```

### 4️⃣ Instalar Dependências

```bash
# Instalar todas as dependências
npm install

# Isso vai:
# - Baixar ~700MB de pacotes
# - Levar 3-5 minutos
# - Criar pasta node_modules/

# Verificar instalação
npm list --depth=0

# Esperado: Lista de dependências principais sem erros
```

### 5️⃣ Configurar Variáveis de Ambiente

```bash
# Copiar arquivo de exemplo
cp .env.example .env

# Abrir .env em seu editor
code .env  # VSCode
# ou
nano .env  # Terminal
```

**Arquivo `.env` - Configuração necessária:**

```bash
# API Backend
REACT_APP_API_URL="http://localhost:3000"
REACT_APP_API_TIMEOUT="30000"

# Expo
EXPO_PUBLIC_API_URL="http://localhost:3000"

# Ambiente
NODE_ENV="development"

# Google Mobile Ads (opcional para testar)
GOOGLE_MOBILE_ADS_APP_ID="ca-app-pub-xxxxxxxxxxxxxxxx"

# Splashscreen (branding)
SPLASH_IMAGE_URL="./assets/splash.png"
```

**Valores Importantes:**

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `REACT_APP_API_URL` | URL da API backend | `http://localhost:3000` ou IP local |
| `NODE_ENV` | Ambiente | `development` |
| `EXPO_PUBLIC_*` | Variáveis públicas do Expo | Prefixo necessário |

### 6️⃣ Configurar Backend Local (Se aplicável)

**Certifique-se que o backend está rodando:**

```bash
# Em outro terminal, na pasta do backend
cd "back - HabitMind AI"
npm run start:dev

# Esperado:
# [Nest] 12345 - 01/10/2024 10:30:15 LOG [NestFactory] Starting Nest application...
# ... application successfully started on port 3000
```

**Encontrar IP Local da Máquina:**

```bash
# macOS/Linux
ifconfig | grep "inet " | grep -v 127.0.0.1

# Windows
ipconfig

# Esperado: algo como 192.168.1.100
```

**Atualizar `.env` se necessário (Emulador/Dispositivo):**

```bash
# Se estiver em emulador/dispositivo físico, usar IP local:
REACT_APP_API_URL="http://192.168.1.100:3000"
# Em vez de localhost:3000
```

### 7️⃣ Iniciar o App

#### Opção A: Expo Go (Recomendado para Teste Rápido)

```bash
# Terminal
npm start

# Ou
expo start

# Esperado: Menu Expo
# Press 'w' to open web
# Press 'a' to open Android
# Press 'i' to open iOS

# Primeira vez, você verá QR code
# Use Expo Go app no seu telefone
# Escaneie o QR code
# App abre no seu telefone
```

#### Opção B: Emulador Android

```bash
# Certifique-se que Android Studio está aberto com emulador rodando

# Terminal
npm start

# Então pressione 'a'
# Expo vai:
# - Buildar o app
# - Instalar no emulador
# - Abrir automaticamente

# Esperado:
# "Waiting for the emulator to boot...
#  app connected to Metro Bundler
#  [app-name] is now connected..."
```

#### Opção C: Emulador iOS (macOS apenas)

```bash
# Xcode deve estar instalado

# Terminal
npm start

# Então pressione 'i'
# Expo vai buildar e abrir no simulador

# Esperado:
# Simulador iOS abre com o app
```

#### Opção D: Web (Para teste rápido em desktop)

```bash
npm start

# Pressione 'w'

# Esperado:
# Navegador abre em http://localhost:19006/
```

#### Opção E: Build Standalone (Produção)

```bash
# Buildando para Android
eas build --platform android

# Ou iOS
eas build --platform ios

# Nota: Requer configuração de credenciais Expo
```

## ✅ Verificações Pós-Instalação

### 1. Testar Carregamento

Na tela inicial do app, você deve ver:
- Logo do HabitMind AI
- Tela de Login/Registro
- Campos de input funcionando

### 2. Testar Autenticação

```bash
# 1. Toca em "Criar Conta"
# 2. Preenche formulário:
#    - Nome: "Teste"
#    - Email: "teste@example.com"
#    - Senha: "TestPass123!"
# 3. Toca "Criar Conta"
# 4. Esperado: vai para Dashboard após 2-3 segundos
# 5. Se erro de rede: certifique-se que backend está rodando
```

### 3. Testar Criar Hábito

```bash
# 1. Na Dashboard, toca "+ Novo Hábito"
# 2. Preenche:
#    - Título: "Teste"
#    - Frequência: "Diário"
#    - Horário: "07:00"
# 3. Toca "Criar"
# 4. Esperado: Modal fecha e card aparece na lista
```

### 4. Verificar Logs

```bash
# Terminal onde expo está rodando
# Mostra logs em tempo real:
# [expo] Connected to Metro Bundler
# [...] Request to POST /auth/register
# [console.log] resposta da API

# Se houver erro:
# [expo] Error: Network request failed
# → Verificar se backend está rodando
```

## 🔧 Troubleshooting

### Problema: "Network request failed"

```bash
# Causa: Backend não está rodando ou URL incorreta

# Soluções:
# 1. Verificar se backend está rodando
#    Em outro terminal: npm run start:dev (na pasta backend)

# 2. Verificar URL em .env
#    localhost:3000 (se no mesmo computador)
#    192.168.1.100:3000 (se em emulador/dispositivo)

# 3. Verificar firewall
#    Permitir porta 3000

# 4. Testar com curl
curl http://localhost:3000/api/docs
# Se sucesso, aparece documentação Swagger
```

### Problema: "Port 19000 already in use"

```bash
# Causa: Outro processo Expo rodando

# Solução: Usar porta diferente
expo start --port 19001

# Ou encontrar e parar o processo:
# macOS/Linux:
lsof -i :19000
kill -9 <PID>

# Windows:
netstat -ano | findstr :19000
taskkill /PID <PID> /F
```

### Problema: "Module not found"

```bash
# Causa: Dependências não instaladas

# Solução:
rm -rf node_modules package-lock.json
npm install
npm start
```

### Problema: "Emulador não abre"

```bash
# Para Android:
# 1. Abrir Android Studio
# 2. Tools → Device Manager
# 3. Criar/Iniciar um emulador
# 4. Depois rodar: npm start → pressione 'a'

# Para iOS:
# 1. Xcode → Preferences → Components
# 2. Baixar um Simulator
# 3. Depois rodar: npm start → pressione 'i'
```

### Problema: "Cannot find native module @react-native-async-storage/async-storage"

```bash
# Solução: Reinstalar dependências nativas
# Com Expo Go, isso geralmente não acontece
# Se acontecer:

npm install expo@latest
npm install
npm start
```

### Problema: "Image not loading"

```bash
# Causa: Path incorreto ou arquivo não existe

# Verificar:
# 1. Arquivo existe em assets/
# 2. Path está correto em import
# 3. Para web, usar require()

// Correto
const image = require('../assets/logo.png');
<Image source={image} />

// Em React Native
import splashImage from '../assets/splash.png';
```

## 📱 Testar em Dispositivo Físico

### iOS (Físico)

```bash
# 1. Conectar iPhone
# 2. Confiar no computador no iPhone
# 3. Terminal:
npm start

# 4. Pressione 'i' para dispositivo
# 5. Expo Go app abre no iPhone
# 6. Escaneie QR code no terminal
```

### Android (Físico)

```bash
# 1. Ativar Developer Mode no Android
#    Settings → About Phone → Build Number (7x) → Back

# 2. Ativar USB Debugging
#    Settings → Developer options → USB Debugging (on)

# 3. Conectar via USB

# 4. Aceitar autorização no telefone

# 5. Terminal:
adb devices
# Esperado: seu dispositivo listado

npm start

# 6. Pressione 'a' para Android físico
```

## 🧪 Rodando Testes

```bash
# Unit tests
npm test

# Watch mode
npm test -- --watch

# Com cobertura
npm test -- --coverage
```

## 📊 Comandos Úteis

### Expo

```bash
# Iniciar desenvolvimento
npm start
expo start

# Build local para iOS (Xcode project)
eas build --platform ios --local

# Build local para Android (APK)
eas build --platform android --local

# Limpar cache
expo start --clear

# Debug no Chrome
exp://localhost:19000
# Abra no navegador Chrome
```

### npm

```bash
# Limpar cache npm
npm cache clean --force

# Instalar versão específica
npm install expo@51.0.0

# Atualizar tudo
npm update

# Verificar pacotes desatualizados
npm outdated

# Reinstalar do zero
rm -rf node_modules package-lock.json
npm install
```

### Desenvolvimento

```bash
# Lint TypeScript
npm run lint

# Format código (Prettier)
npm run format

# Tipo check
npx tsc --noEmit
```

## 🌐 Acessar API Localmente

### Swagger (Documentação)

```
http://localhost:3000/api/docs
```

Você verá:
- Todos os endpoints
- Parâmetros necessários
- Botão "Try it out"
- Exemplos de request/response

### Testar Endpoint Específico

```bash
# Registrar
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@example.com",
    "password": "TestPass123!",
    "name": "Teste"
  }'
```

## 📚 Próximas Etapas

1. ✅ Frontend instalado
2. ✅ Backend rodando
3. → Ler [Guia Funcional do Frontend](../02_FUNCIONAL/00_GUIA_FUNCIONAL.md)
4. → Ler [Guia Funcional do Backend](../../BACKEND/02_FUNCIONAL/00_GUIA_FUNCIONAL.md)
5. → Consultar [API Reference](../../BACKEND/04_API_REFERENCE/00_API_COMPLETA.md)

## 🐛 Debug Mode

### React Native Debugger

```bash
# Instalar globalmente
npm install -g react-native-debugger

# Abrir
react-native-debugger

# No app, pressione Ctrl+M (Android) ou Cmd+D (iOS)
# Selecione "Debug with localhost"
```

### Browser DevTools

```bash
# No terminal Expo, pressione 'j'
# Abre Chrome DevTools

# Você pode ver:
# - Console logs
# - Network requests
# - Performance
# - Errors
```

### Logs em Tempo Real

```bash
# Android
adb logcat

# iOS (em desenvolvimento)
# Xcode → Console
```

## 📞 Suporte

Se encontrar problemas:

1. Verificar logs: Veja a tela do terminal Expo
2. Consultar [Expo Docs](https://docs.expo.dev/)
3. Consultar [React Native Docs](https://reactnative.dev/)
4. Abrir issue no GitHub

---

**Última atualização**: Janeiro 2026
