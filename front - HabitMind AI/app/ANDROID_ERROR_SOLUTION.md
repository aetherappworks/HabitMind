# 📋 Soluções Rápidas - Erro Android SDK

## 🔴 Seu Erro

```
Failed to resolve the Android SDK path. Default install location not found: 
C:\Users\lmfre\AppData\Local\Android\Sdk
```

---

## ⚡ Solução Rápida (Sem Android Instalado)

Se quer testar **agora mesmo sem instalar Android**:

### Use Expo Go (Recomendado para desenvolvimento)

```bash
npm start
```

Depois:
1. Pressione `s` para Expo Go
2. Escanear o QR code com o app **Expo Go** (disponível na Play Store)
3. App rodará no seu dispositivo Android físico

**Vantagens:**
- ✅ Sem instalar Android SDK
- ✅ Sem emulador pesado
- ✅ Funciona com qualquer Android 7+
- ✅ Hot reload automático

**Desvantagens:**
- Precisa de um dispositivo Android físico

---

### Alternativa: Use Web

```bash
npm run web
```

Abre no navegador automaticamente (sem precisar de Android)

---

## ✅ Solução Completa (Com Android)

Se quer rodar em emulador Android:

### 1. Instalar Android Studio

Baixe: https://developer.android.com/studio

Durante a instalação:
- ✅ Deixe "Android SDK" marcado
- ✅ Deixe "Android Emulator" marcado

### 2. Abrir Android Studio → SDK Manager

Instale:
- Android SDK Platform 33 (ou superior)
- Android SDK Build-Tools 33 (ou superior)
- Android Emulator

### 3. Criar Emulador Virtual

Android Studio → Device Manager → Create Virtual Device
- Escolha: Pixel 6 ou similar
- Android 13+ (API 33+)
- Finish

### 4. Configurar Variáveis de Ambiente

**Windows PowerShell (como Admin):**

```powershell
# Adicionar permanentemente
[Environment]::SetEnvironmentVariable("ANDROID_HOME", "$env:USERPROFILE\AppData\Local\Android\Sdk", "User")
[Environment]::SetEnvironmentVariable("ANDROID_SDK_ROOT", "$env:USERPROFILE\AppData\Local\Android\Sdk", "User")

# Reabrir terminal para aplicar
```

**Git Bash:**

```bash
export ANDROID_HOME="$HOME/AppData/Local/Android/Sdk"
export PATH="$PATH:$ANDROID_HOME/emulator:$ANDROID_HOME/platform-tools"
```

### 5. Rodar App

```bash
# Terminal 1: Iniciar emulador
emulator -avd Pixel_6_API_33

# Terminal 2: Rodar app
npm run android
```

---

## 🔍 Verificar Configuração

```bash
# Ver se ANDROID_HOME está configurado
echo $ANDROID_HOME

# Testar adb
adb version

# Listar emuladores
emulator -list-avds

# Listar dispositivos conectados
adb devices
```

---

## 💡 Resumo das 3 Opções

| Opção | Vantagem | Desvantagem |
|-------|----------|------------|
| **Expo Go** | Rápido, sem instalação | Precisa dispositivo físico |
| **Web** | Não precisa de Android | Interface web (não mobile) |
| **Android SDK** | Emulador completo | Instalação complexa |

**Recomendação:** Comece com **Expo Go** para testar rápido!

---

## 📁 Arquivo de Configuração

Veja também: [docs/development/00_ANDROID_SETUP.md](./docs/development/00_ANDROID_SETUP.md)

---

## 🆘 Ainda com Erro?

```bash
# Limpar cache e reconstruir
npm run android -- --clear-cache

# Ou reinstalar tudo
rm -rf node_modules
npm install --legacy-peer-deps
npm run android
```

Se persistir, use **Expo Go** ou **Web** enquanto resolve a configuração do Android.
