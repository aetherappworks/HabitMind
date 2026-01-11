# Internacionalização (i18n) - HabitMind Frontend

## Visão Geral

O sistema de internacionalização do HabitMind permite que o aplicativo suporte múltiplos idiomas de forma consistente e fácil de manter.

### Idiomas Suportados

- **Português (Brasil)** - `pt-br` (padrão)
- **Inglês** - `en-us`
- **Espanhol** - `es-es`

## Estrutura de Arquivos

```
src/i18n/
├── locales/
│   ├── pt-br.json      # Traduções em português
│   ├── en-us.json      # Traduções em inglês
│   └── es-es.json      # Traduções em espanhol
├── i18n.ts             # Funções utilitárias de tradução
└── useI18n.ts          # Hook React para usar i18n em componentes

src/store/
└── languageStore.ts    # Zustand store para gerenciar idioma atual

src/components/
└── LanguageSelector.tsx # Componente UI para selecionar idioma
```

## Formato das Chaves de Tradução

As chaves de tradução seguem o padrão **dot notation** com hierarquia:

```
module.context.key

Exemplos:
- auth.errors.invalid_credentials
- habits.messages.habit_created
- ui.buttons.save
- common.errors.unauthorized
```

## Como Usar

### 1. Em Componentes React

Use o hook `useI18n()` para acessar funções de tradução:

```typescript
import { useI18n } from '../i18n/useI18n';

const MyComponent = () => {
  const { t, tParams, language } = useI18n();

  return (
    <View>
      {/* Tradução simples */}
      <Text>{t('auth.messages.logged_in_successfully')}</Text>

      {/* Tradução com parâmetros */}
      <Text>{tParams('common.messages.created', { count: 5 })}</Text>

      {/* Idioma atual */}
      <Text>Idioma: {language}</Text>
    </View>
  );
};
```

### 2. Fora de Componentes

Use as funções diretas do módulo `i18n.ts`:

```typescript
import { getTranslation, getAvailableLanguages } from '../i18n/i18n';

// Tradução simples
const message = getTranslation('habits.errors.habit_not_found', 'pt-br');

// Listar idiomas disponíveis
const languages = getAvailableLanguages(); // ['pt-br', 'en-us', 'es-es']
```

### 3. Gerenciar Idioma

Use o store `languageStore` para mudar o idioma:

```typescript
import { useLanguageStore } from '../store/languageStore';

const SettingsScreen = () => {
  const { language, setLanguage, getAvailableLanguages } = useLanguageStore();

  const handleLanguageChange = async (newLanguage) => {
    await setLanguage(newLanguage);
    // Idioma será persistido no secure storage
  };

  return (
    <View>
      <Text>Idioma atual: {language}</Text>
      {/* ... */}
    </View>
  );
};
```

### 4. Usar o Componente LanguageSelector

```typescript
import { LanguageSelector } from '../components/LanguageSelector';

const SettingsScreen = () => {
  return (
    <View>
      <LanguageSelector
        onLanguageChange={(language) => {
          console.log('Idioma alterado para:', language);
        }}
      />
    </View>
  );
};
```

## Integração com API

O idioma é **automaticamente enviado** em todas as requisições:

1. **Header `Accept-Language`**: `pt-br`, `en-us` ou `es-es`
2. **Query Parameter `lang`**: Compatibilidade com backend

Exemplo de requisição:

```
GET /api/habits?lang=pt-br
Accept-Language: pt-br
```

Isso é feito automaticamente pelo `apiClient` através do interceptor.

## Adicionando Novas Traduções

### 1. Adicione a chave em todos os arquivos JSON:

**pt-br.json:**
```json
{
  "habits": {
    "messages": {
      "habit_created": "Hábito criado com sucesso",
      "my_new_key": "Meu texto em português"
    }
  }
}
```

**en-us.json:**
```json
{
  "habits": {
    "messages": {
      "habit_created": "Habit created successfully",
      "my_new_key": "My text in English"
    }
  }
}
```

**es-es.json:**
```json
{
  "habits": {
    "messages": {
      "habit_created": "Hábito creado exitosamente",
      "my_new_key": "Mi texto en español"
    }
  }
}
```

### 2. Use no componente:

```typescript
const message = t('habits.messages.my_new_key');
```

## Tratamento de Erros da API

A API retorna mensagens de erro em português por padrão. O frontend recebe e exibe em função do idioma do cliente:

```typescript
try {
  await habitService.createHabit(data);
} catch (error) {
  // Erro retornado da API
  const errorKey = error.response?.data?.message;
  
  // Traduzir dinamicamente
  const localizedError = t(errorKey);
  console.error(localizedError);
}
```

## Persistência de Idioma

O idioma selecionado é armazenado em `secure storage` (não em `AsyncStorage`) para maior segurança.

- **Chave de armazenamento**: `app_language`
- **Local**: Encrypted Secure Storage (nativo do device)
- **Persistência**: Entre sessões do app

### Carregamento Automático

Na inicialização da app, o idioma é carregado automaticamente:

```typescript
// No App.tsx ou na tela de splash
useEffect(() => {
  useLanguageStore.getState().loadLanguage();
}, []);
```

## Boas Práticas

✅ **Recomendado:**
- Usar chaves com estrutura clara: `module.context.key`
- Manter traduções sincronizadas entre os 3 idiomas
- Usar `useI18n()` em componentes React
- Adicionar traduções para todas as strings de UI

❌ **Não fazer:**
- Strings hardcoded em componentes
- Usar apenas 1 ou 2 idiomas (manter os 3 em sync)
- Modificar arquivos JSON sem atualizar todos os idiomas
- Usar caracteres especiais em chaves

## Debugging

### Ver todas as traduções de um idioma

```typescript
import * as ptBR from './locales/pt-br.json';
console.log(JSON.stringify(ptBR, null, 2));
```

### Verificar idioma atual

```typescript
const { language } = useLanguageStore();
console.log('Idioma atual:', language);
```

### Testar tradução específica

```typescript
import { getTranslation } from './i18n';
const result = getTranslation('auth.errors.invalid_credentials', 'en-us');
console.log(result); // "Invalid email or password"
```

## Sincronização com Backend

O backend suporta os mesmos 3 idiomas e usa a mesma estrutura de chaves JSON.

**Endpoints relacionados:**
- GET `/api/users/preferences` - Obtém preferências do usuário (inclui idioma)
- PUT `/api/users/preferences` - Atualiza preferências (inclui idioma)

Exemplo:
```typescript
await apiClient.put('/users/preferences', {
  language: 'en-us',
  // ... outras preferências
});
```

## Roadmap Futuro

- [ ] Carregar idioma do servidor na autenticação
- [ ] Suporte a mais idiomas (francês, alemão, etc)
- [ ] Fallback automático para idioma similar se não disponível
- [ ] Tradução de erros em tempo real via IA
