# 🤖 Configuração do Android SDK

## ❌ Erro Detectado

```
Failed to resolve the Android SDK path. Default install location not found: 
C:\Users\lmfre\AppData\Local\Android\Sdk

Use ANDROID_HOME to set the Android SDK location.
Error: `adb` não foi reconhecido como um comando interno
```

---

## ✅ Solução

### Opção 1: Instalar Android Studio (Recomendado)

**Android Studio** vem com SDK pré-configurado.

1. Baixe em: https://developer.android.com/studio
2. Instale normalmente
3. Durante a instalação, deixe a opção de instalar Android SDK marcada
4. Abra Android Studio e vá para **Settings** → **SDK Manager**
5. Instale:
   - Android SDK Platform 33+
   - Android SDK Build-Tools 33+
   - Android Emulator

### Opção 2: Configurar Variáveis de Ambiente Manualmente

Se já tem Android SDK instalado em outro local:

#### Windows (PowerShell como Admin):

```powershell
# Encontre onde está o Sdk
$env:ANDROID_HOME = "C:\caminho\para\seu\Android\Sdk"
$env:ANDROID_SDK_ROOT = "C:\caminho\para\seu\Android\Sdk"

# Adicione permanentemente (substitua o caminho)
[Environment]::SetEnvironmentVariable("ANDROID_HOME", "C:\Users\lmfre\Android\Sdk", "User")
[Environment]::SetEnvironmentVariable("ANDROID_SDK_ROOT", "C:\Users\lmfre\Android\Sdk", "User")
```

#### Windows (Git Bash):

```bash
export ANDROID_HOME="$HOME/AppData/Local/Android/Sdk"
export ANDROID_SDK_ROOT="$HOME/AppData/Local/Android/Sdk"
export PATH="$PATH:$ANDROID_HOME/emulator:$ANDROID_HOME/platform-tools"

# Fazer permanente (adicione ao ~/.bashrc)
echo 'export ANDROID_HOME="$HOME/AppData/Local/Android/Sdk"' >> ~/.bashrc
echo 'export PATH="$PATH:$ANDROID_HOME/emulator:$ANDROID_HOME/platform-tools"' >> ~/.bashrc
source ~/.bashrc
```

---

## 🔍 Verificar Instalação

```bash
# Verificar ANDROID_HOME
echo $ANDROID_HOME

# Verificar adb
adb version

# Listar emuladores
emulator -list-avds

# Listar dispositivos conectados
adb devices
```

---

## 📱 Alternativas

Se não quiser instalar Android localmente:

### 1. Usar Expo Go (Mais Fácil)
```bash
npm start
# Pressione 's' para Expo Go
# Escanear QR code no app Expo Go (Android)
```

### 2. Usar Emulador Online
- [Android Emulator Online](https://appetize.io/)
- [Genymotion](https://www.genymotion.com/)
- [BlueStacks](https://www.bluestacks.com/)

### 3. Usar Dispositivo Físico
```bash
# Conecte USB e ative Developer Mode
adb devices  # Verificar conexão
npm run android
```

---

## 🚀 Depois de Configurado

```bash
# Listar emuladores disponíveis
emulator -list-avds

# Iniciar emulador (substitua o nome)
emulator -avd Pixel_6_API_33

# Em outro terminal, rodar app
npm run android
```

---

## 📚 Referências

- [React Native: Android Setup](https://reactnative.dev/docs/environment-setup?guide=native)
- [Expo: Development Client](https://docs.expo.dev/development/getting-started/)
- [Android Studio](https://developer.android.com/studio)

---

## 💡 Recomendação Rápida

Para desenvolver **sem Android instalado localmente**, use:

```bash
# Opção 1: Expo Go (Mais rápido)
npm start
# Escanear QR code no dispositivo

# Opção 2: Web (Sem precisar de Android)
npm run web
```

Isso evita a complexidade de configurar Android SDK agora!
