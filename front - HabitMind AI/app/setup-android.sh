#!/bin/bash
# Script para configurar Android SDK no Windows (Git Bash)

echo "🤖 Configurando Android SDK..."
echo ""

# Detectar plataforma
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" ]]; then
  echo "✅ Detectado Windows"
  
  # Caminho padrão Android
  ANDROID_SDK_PATH="$HOME/AppData/Local/Android/Sdk"
  
  if [ -d "$ANDROID_SDK_PATH" ]; then
    echo "✅ Android SDK encontrado em: $ANDROID_SDK_PATH"
    
    # Configurar variáveis
    export ANDROID_HOME="$ANDROID_SDK_PATH"
    export ANDROID_SDK_ROOT="$ANDROID_SDK_PATH"
    export PATH="$PATH:$ANDROID_SDK_PATH/platform-tools:$ANDROID_SDK_PATH/emulator"
    
    echo ""
    echo "✅ Variáveis configuradas:"
    echo "   ANDROID_HOME=$ANDROID_HOME"
    echo "   ANDROID_SDK_ROOT=$ANDROID_SDK_ROOT"
    echo ""
    
    # Testar adb
    if command -v adb &> /dev/null; then
      echo "✅ adb encontrado:"
      adb version
    else
      echo "⚠️  adb não encontrado no PATH"
      echo "   Certifique-se de ter platform-tools instalado"
    fi
    
  else
    echo "❌ Android SDK não encontrado em: $ANDROID_SDK_PATH"
    echo ""
    echo "📝 Próximas etapas:"
    echo "1. Instale Android Studio: https://developer.android.com/studio"
    echo "2. Durante a instalação, deixe Android SDK marcado"
    echo "3. Após instalar, execute este script novamente"
    exit 1
  fi
  
else
  echo "❌ Sistema operacional não suportado: $OSTYPE"
  echo "   Este script é para Windows"
  exit 1
fi

echo ""
echo "✅ Configuração concluída!"
echo ""
echo "🚀 Agora você pode rodar:"
echo "   npm run android"
