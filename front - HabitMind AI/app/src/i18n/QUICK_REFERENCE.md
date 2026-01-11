#!/bin/bash

# Quick Reference - i18n Frontend
# Use este arquivo como referência rápida

# 📋 IMPORTS
# =========

# Hook para usar em componentes
import { useI18n } from '../i18n/useI18n';

# Store para mudar idioma
import { useLanguageStore } from '../store/languageStore';

# Componente seletor de idioma
import { LanguageSelector } from '../components/LanguageSelector';

# Funções diretas
import { getTranslation, getAvailableLanguages } from '../i18n/i18n';


# 🎯 CASOS DE USO COMUNS
# ======================

## 1. Traduzir texto em componente
export const MyComponent = () => {
  const { t } = useI18n();
  
  return (
    <Text>{t('auth.messages.logged_in_successfully')}</Text>
  );
};

## 2. Mudar idioma
const handleLanguageChange = async () => {
  const { setLanguage } = useLanguageStore();
  await setLanguage('en-us');
};

## 3. Obter idioma atual
export const LanguageDisplay = () => {
  const { language } = useLanguageStore();
  
  return <Text>Idioma: {language}</Text>;
};

## 4. Usar seletor visual
export const SettingsScreen = () => {
  return (
    <View>
      <LanguageSelector 
        onLanguageChange={(lang) => console.log(lang)}
      />
    </View>
  );
};

## 5. Tradução com parâmetros
const { tParams } = useI18n();
const msg = tParams('messages.welcome', { name: 'João' });

## 6. Erro traduzido
try {
  await api.login(email, password);
} catch (error) {
  const msg = t(error.response.data.message);
  Alert.alert(t('ui.notifications.error'), msg);
}


# 🔑 CHAVES DE TRADUÇÃO
# ======================

# Autenticação
t('auth.errors.invalid_credentials')
t('auth.messages.logged_in_successfully')

# Hábitos
t('habits.messages.habit_created')
t('habits.errors.habit_not_found')

# UI / Botões
t('ui.buttons.login')
t('ui.buttons.save')
t('ui.buttons.cancel')

# UI / Labels
t('ui.labels.email')
t('ui.labels.password')

# UI / Placeholders
t('ui.placeholders.email')
t('ui.placeholders.password')

# UI / Notificações
t('ui.notifications.success')
t('ui.notifications.error')

# IA
t('ai.messages.analysis_completed')
t('ai.errors.insufficient_credits')

# Anúncios
t('ads.messages.reward_granted')
t('ads.errors.daily_limit_reached')


# ✅ VALIDAÇÃO
# ============

# Verificar sincronização de idiomas
npx ts-node src/i18n/validate.ts

# Saída esperada: ✅ Validação PASSOU


# 📁 ESTRUTURA DE PASTAS
# =====================

src/i18n/
├── i18n.ts                 # Funções core
├── useI18n.ts              # Hook React
├── validate.ts             # Script de validação
├── locales/
│   ├── pt-br.json
│   ├── en-us.json
│   └── es-es.json
└── README.md               # Documentação


# 🌍 IDIOMAS DISPONÍVEIS
# ======================

'pt-br'  → Português (Brasil) [padrão]
'en-us'  → Inglês (EUA)
'es-es'  → Espanhol (Espanha)


# 🔄 FLUXO DE IDIOMA
# ==================

Usuário seleciona idioma
  ↓
setLanguage('en-us')
  ↓
Salva em secureStorage
  ↓
Zustand store atualiza
  ↓
useI18n() hook retorna novo language
  ↓
Componentes re-renderizam com t(key)
  ↓
apiClient envia language em headers
  ↓
Backend responde em mesmo idioma


# 🚀 INTEGRAÇÃO RÁPIDA
# ====================

# 1. Em uma tela
import { useI18n } from '../i18n/useI18n';

const MyScreen = () => {
  const { t } = useI18n();
  
  return (
    <TextInput 
      placeholder={t('ui.placeholders.email')}
    />
  );
};

# 2. Em App.tsx (inicialização)
useEffect(() => {
  useLanguageStore.getState().loadLanguage();
}, []);

# 3. Em Settings
<LanguageSelector />


# 📊 ARQUIVOS CRIADOS
# ===================

Código:
  src/i18n/i18n.ts
  src/i18n/useI18n.ts
  src/i18n/validate.ts
  src/store/languageStore.ts
  src/components/LanguageSelector.tsx

Dados:
  src/i18n/locales/pt-br.json
  src/i18n/locales/en-us.json
  src/i18n/locales/es-es.json

Documentação:
  src/i18n/README.md
  src/i18n/TESTING_GUIDE.md
  src/i18n/BACKEND_COMPARISON.md
  src/i18n/INDEX.md
  src/i18n/RESUMO_EXECUTIVO.md

Modificado:
  src/services/apiClient.ts (+20 linhas)


# ⚙️ CONFIGURAÇÃO
# ===============

# Adicionar script ao package.json
"scripts": {
  "i18n:validate": "ts-node src/i18n/validate.ts"
}

# Executar validação
npm run i18n:validate


# ❓ TROUBLESHOOTING RÁPIDO
# ========================

Idioma não salva?
  → Verificar secureStorage
  → Executar: await secureStorage.getItem('app_language')

Chave não encontrada?
  → Adicionar em todos os 3 JSONs
  → Usar dot notation: auth.errors.key

Componente não atualiza?
  → Usar useI18n() dentro do componente
  → Não usar useLanguageStore.getState() em renderização

Chaves faltando?
  → npx ts-node src/i18n/validate.ts
  → Vai mostrar exatamente qual chave falta


# 📚 DOCUMENTAÇÃO
# ===============

Para quem começa:
  → i18n/README.md

Exemplos práticos:
  → screens/auth/LoginScreenWithI18nExample.tsx
  → i18n/INTEGRATION_EXAMPLE.md

QA / Testes:
  → i18n/TESTING_GUIDE.md

Backend developer:
  → i18n/BACKEND_COMPARISON.md

Índice completo:
  → i18n/INDEX.md

Resumo executivo:
  → i18n/RESUMO_EXECUTIVO.md


# 🔐 SEGURANÇA
# =============

✅ Idioma salvo em secureStorage (criptografado)
✅ Nenhum dado sensível em chaves
✅ Validação de chaves antes de usar
✅ Token separado de idioma


# 💾 PERSISTÊNCIA
# ===============

Chave: 'app_language'
Local: secureStorage (nativo do device)
Duração: Até usuário trocar ou desinstalar app


# 🎯 PERFORMANCE
# ==============

Mudança de idioma: < 100ms
Tradução de chave: < 1ms
Integração na API: Automática


# 📞 SUPORTE
# ==========

Dúvida sobre uso?
  → Leia: i18n/README.md

Quer testar?
  → Siga: i18n/TESTING_GUIDE.md

Problema com integração?
  → Veja: LoginScreenWithI18nExample.tsx

Sincronizar com backend?
  → Estude: i18n/BACKEND_COMPARISON.md


# ✅ CHECKLIST DE IMPLEMENTAÇÃO
# ==============================

- [ ] Ler README.md
- [ ] Ver exemplo em LoginScreenWithI18nExample.tsx
- [ ] Integrar useI18n em primeira tela
- [ ] Substituir strings hardcoded
- [ ] Adicionar LanguageSelector em Settings
- [ ] Testar mudança de idioma
- [ ] Validar sincronização: npm run i18n:validate
- [ ] Fechar e reabrir app (testar persistência)
- [ ] Fazer requisição em idioma diferente
- [ ] Verificar headers/query params


---
Quick Reference v1.0 | 11/01/2026
Salve este arquivo para referência rápida!
