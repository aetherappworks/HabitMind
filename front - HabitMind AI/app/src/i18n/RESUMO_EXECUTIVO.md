# 📱 Internacionalização (i18n) Frontend - RESUMO EXECUTIVO

## ✅ O Que Foi Implementado

Implementei um **sistema completo de internacionalização (i18n)** no frontend do HabitMind, espelhando a estrutura do backend NestJS.

### Sistema de Tradução Eficiente

- ✅ **3 idiomas**: Português (pt-br), Inglês (en-us), Espanhol (es-es)
- ✅ **80+ chaves** de tradução organizadas por módulo
- ✅ **Sem dependências externas** (usa apenas JSON imports)
- ✅ **Hook React** (`useI18n`) para fácil integração
- ✅ **Zustand store** para gerenciar idioma global
- ✅ **Persistência segura** em `secureStorage`
- ✅ **Integração automática** no `apiClient`

---

## 📁 O Que Foi Criado

### 1. **Arquivos de Tradução** (`src/i18n/locales/`)
```
pt-br.json    ← Português (Brasil)
en-us.json    ← Inglês
es-es.json    ← Espanhol
```

Cada arquivo contém organizadamente:
- `auth.errors` / `auth.messages` - Autenticação
- `habits.errors` / `habits.messages` - Hábitos
- `users.errors` / `users.messages` - Usuários
- `ai.errors` / `ai.messages` - IA
- `ads.errors` / `ads.messages` - Anúncios
- `common.errors` / `common.messages` - Comuns
- `ui.buttons` / `ui.labels` / `ui.placeholders` - UI

### 2. **Sistema Core**
```
i18n.ts              ← Funções: getTranslation(), getTranslationWithParams()
useI18n.ts           ← Hook React para componentes
validate.ts          ← Script para validar sincronização
```

### 3. **Gerenciamento de Estado**
```
src/store/languageStore.ts  ← Zustand store com:
  - language (idioma atual)
  - setLanguage() (mudar idioma)
  - loadLanguage() (carregar salvo)
  - getAvailableLanguages()
```

### 4. **Componente UI**
```
src/components/LanguageSelector.tsx  ← Seletor visual de idioma
```

### 5. **Integração na API**
```
apiClient.ts foi atualizado para enviar:
  - Header: Accept-Language: pt-br
  - Query param: ?lang=pt-br
```

### 6. **Documentação Completa** (5 arquivos)
```
README.md                ← Guia completo de uso
INTEGRATION_EXAMPLE.md   ← Exemplos práticos
TESTING_GUIDE.md         ← Testes e validação
BACKEND_COMPARISON.md    ← Sincronização com backend
INDEX.md                 ← Índice centralizado
```

---

## 🚀 Como Usar

### Em Componentes React

```typescript
import { useI18n } from '../i18n/useI18n';

export default function LoginScreen() {
  const { t, language } = useI18n();

  return (
    <View>
      <TextInput
        placeholder={t('ui.placeholders.email')}
      />
      <Button title={t('ui.buttons.login')} />
      <Text>Idioma: {language}</Text>
    </View>
  );
}
```

### Mudar Idioma

```typescript
import { useLanguageStore } from '../store/languageStore';

const { setLanguage } = useLanguageStore();

// Mudar para Inglês
await setLanguage('en-us');
```

### Usar Componente Seletor

```typescript
import { LanguageSelector } from '../components/LanguageSelector';

<LanguageSelector 
  onLanguageChange={(lang) => console.log(`Idioma: ${lang}`)}
/>
```

---

## 🔄 Como Funciona

### Fluxo de Idioma na App

```
1. App inicia
   ↓
2. loadLanguage() - Carrega idioma salvo (ou padrão pt-br)
   ↓
3. useLanguageStore hook acessa language
   ↓
4. useI18n() hook usa language do store
   ↓
5. t('chave') traduz usando idioma atual
   ↓
6. apiClient envia language em headers
   ↓
7. Backend responde com erro/sucesso em mesmo idioma
   ↓
8. Frontend traduz mensagem com t(error.message)
```

### Persistência

- Idioma selecionado é salvo em `secureStorage` (criptografado)
- Na próxima abertura da app, idioma anterior é carregado
- Chave: `app_language`

---

## 📊 Estrutura de Chaves

Padrão de **dot notation**:

```
module.context.key

Exemplos:
✅ auth.errors.invalid_credentials
✅ habits.messages.habit_created
✅ ui.buttons.login
❌ auth_errors_invalid (não usar underscore)
❌ AUTH.ERRORS.INVALID (não usar uppercase)
```

---

## ✨ Recursos Especiais

### 1. Validação Automática
```bash
# Verificar se todos os idiomas estão sincronizados
npx ts-node src/i18n/validate.ts
```

Detecta:
- Chaves faltando em algum idioma
- Chaves extras
- Total de chaves

### 2. Tradução com Parâmetros
```typescript
const { tParams } = useI18n();

// Tradução: "Bem-vindo, :name!"
const msg = tParams('messages.welcome', { name: 'João' });
// Resultado: "Bem-vindo, João!"
```

### 3. Sincronização Backend-Frontend
Backend envia chave de tradução, frontend traduz localmente:

```typescript
// Erro do backend
{ message: "auth.errors.invalid_credentials" }

// Frontend traduz
t(error.message) // "Email ou senha inválido"
```

---

## 🎯 Próximos Passos para Seu Time

### 1. **Integrar em Telas Existentes**
Procure por strings hardcoded como:
- "Conectar" → `t('ui.buttons.login')`
- "Email é obrigatório" → `t('auth.errors.email_required')`
- "Hábito criado com sucesso" → `t('habits.messages.habit_created')`

### 2. **Adicionar Seletor em Settings**
```typescript
import { LanguageSelector } from '../components/LanguageSelector';

// Em SettingsScreen
<LanguageSelector onLanguageChange={(lang) => {
  console.log(`Idioma alterado para: ${lang}`);
}} />
```

### 3. **Testar Todos os Idiomas**
1. Mudar para cada idioma nas settings
2. Verificar que UI inteira muda
3. Fazer uma requisição (ex: login)
4. Fechar e reabrir app - deve manter idioma

### 4. **Validar Sincronização**
```bash
npm install typescript ts-node  # se não tiver
npx ts-node src/i18n/validate.ts
```

---

## 📚 Documentação por Papel

| Papel | Comece em |
|-------|-----------|
| **Frontend Dev** | [README.md](./README.md) - Seção "Como Usar" |
| **QA/Tester** | [TESTING_GUIDE.md](./TESTING_GUIDE.md) |
| **Backend Dev** | [BACKEND_COMPARISON.md](./BACKEND_COMPARISON.md) |
| **Tech Lead** | [INDEX.md](./INDEX.md) |

---

## 🔐 Segurança

- ✅ Idioma salvo em `secureStorage` (criptografado)
- ✅ Token ainda usar `secureStorage`
- ✅ Nenhum dado sensível nas chaves de tradução
- ✅ Validação de chaves antes de usar

---

## 📊 Exemplos de Uso

### Login Screen
```typescript
const { t } = useI18n();

return (
  <View>
    <Text>{t('auth.messages.logged_in_successfully')}</Text>
    <TextInput placeholder={t('ui.placeholders.email')} />
    <Button title={t('ui.buttons.login')} />
  </View>
);
```

### Erro da API
```typescript
try {
  await api.createHabit(data);
} catch (error) {
  const message = t(error.response.data.message);
  Alert.alert(t('ui.notifications.error'), message);
}
```

### Settings com Seletor
```typescript
return (
  <ScrollView>
    <Text>{t('ui.labels.settings')}</Text>
    <LanguageSelector />
  </ScrollView>
);
```

---

## ✅ Checklist de Implementação

- [x] Estrutura criada
- [x] 3 idiomas traduzidos
- [x] Hook React implementado
- [x] Zustand store criado
- [x] Componente LanguageSelector feito
- [x] API integrada com idioma
- [x] Documentação completa
- [x] Exemplos fornecidos
- [x] Script de validação criado
- [ ] Integrado em todas as telas (seu time faz)
- [ ] Testes em CI/CD (futuro)

---

## 🚀 Próximas Melhorias

- Suporte a novo idioma (francês, alemão)
- Sincronizar idioma com preferências do usuário no servidor
- Testes automatizados para chaves faltando
- Suporte a plurais (one/other)
- Localização de datas e números

---

## 📞 Dúvidas Comuns

**P: Como adicionar nova chave?**
A: Adicione em pt-br.json, en-us.json e es-es.json com EXATAMENTE o mesmo texto traduzido.

**P: Posso usar template strings?**
A: Use dot notation: `t('auth.errors.invalid_credentials')`. Para variáveis, use tParams.

**P: O idioma não está salvando?**
A: Verifique permissões do app e se secureStorage está funcionando.

**P: Preciso suportar novo idioma?**
A: Crie novo JSON, adicione em AVAILABLE_LANGUAGES em i18n.ts.

---

## 🎓 Recursos

- [Código i18n](./i18n.ts) - Funções core
- [Hook useI18n](./useI18n.ts) - Para componentes
- [Store languageStore](../store/languageStore.ts) - Gerenciador
- [Componente LanguageSelector](../components/LanguageSelector.tsx) - UI
- [Exemplos completos](./INTEGRATION_EXAMPLE.md) - Como integrar

---

**Status**: ✅ **Pronto para Produção**  
**Data**: 11/01/2026  
**Responsável**: Frontend Team  
**Próxima revisão**: Quando adicionar novo idioma
