# i18n Frontend vs Backend - Comparativo

## 📊 Visão Geral

Ambas as camadas (frontend e backend) implementam internacionalização de forma consistente e compatível.

## 🏗️ Arquitetura

### Backend (NestJS)

```
back - HabitMind AI/src/i18n/
├── i18n.service.ts      # Serviço com métodos t() e tParams()
├── i18n.module.ts       # Módulo NestJS configurado com nestjs-i18n
└── locales/
    ├── pt-br.json
    ├── en-us.json
    └── es-es.json
```

**Características**:
- Usa biblioteca `nestjs-i18n`
- Carrega arquivos JSON em tempo de build
- Resolves idioma via: Accept-Language header, query param `lang`, cookie
- Global Module (acessível em todo backend)

### Frontend (React Native)

```
front - HabitMind AI/app/src/i18n/
├── i18n.ts              # Funções utilitárias (getTranslation, etc)
├── useI18n.ts           # Hook React
├── locales/
│   ├── pt-br.json
│   ├── en-us.json
│   └── es-es.json
└── validate.ts          # Script de validação

src/store/
└── languageStore.ts     # Zustand store para gerenciar idioma

src/components/
└── LanguageSelector.tsx # Componente UI

src/services/
└── apiClient.ts         # Integração com i18n
```

**Características**:
- Sem dependências externas (apenas JSON imports)
- Hook React para usar em componentes
- Zustand store para persistência e estado global
- Envia idioma em requests (header + query param)

## 🔄 Fluxo de Dados

### Backend

```
Request com Accept-Language
    ↓
nestjs-i18n resolver detecta idioma
    ↓
I18nService.t(key, language)
    ↓
Busca em translations map (carregado em constructor)
    ↓
Retorna string traduzida ou key como fallback
    ↓
Response (geralmente embedda em mensagens de erro/sucesso)
```

### Frontend

```
useLanguageStore.setLanguage() 
    ↓
Salva em secureStorage
    ↓
Zustand store atualiza
    ↓
useI18n() hook retorna language atualizada
    ↓
Componentes re-renderizam com t(key)
    ↓
apiClient detecta language do store
    ↓
Envia em request (header + query param)
```

## 📝 Formatos de Chave

Ambos usam **dot notation** idêntica:

```
module.context.key

✅ Válido:
- auth.errors.invalid_credentials
- habits.messages.habit_created
- ui.buttons.login
- ai.errors.insufficient_credits

❌ Inválido:
- auth_errors_invalid_credentials (usar ponto, não underscore)
- AUTH.ERRORS.INVALID_CREDENTIALS (lowercase)
- auth.invalidCredentials (camelCase)
```

## 🔀 Sincronização Entre Camadas

### Como o Frontend Recebe Traduções

#### Cenário 1: Mensagem de Erro do Backend

```
Backend retorna:
{
  "statusCode": 400,
  "message": "auth.errors.invalid_credentials"
}

Frontend faz:
const localizedMessage = t(error.response.data.message);
// Resultado: "Email ou senha inválido"
```

#### Cenário 2: Mensagem de Sucesso do Backend

```
Backend retorna:
{
  "statusCode": 201,
  "data": { ... },
  "message": "habits.messages.habit_created"
}

Frontend faz:
Alert.alert(
  t('ui.notifications.success'),
  t(response.data.message)
);
```

#### Cenário 3: UI Renderizada pelo Frontend

```
Frontend renderiza diretamente:
<Button title={t('ui.buttons.login')} />
```

## 🌍 Idiomas Suportados

Ambos suportam exatamente os mesmos 3 idiomas:

| Código   | Nome Completo      | Status |
|----------|-------------------|--------|
| `pt-br`  | Português (Brasil) | ✅     |
| `en-us`  | English            | ✅     |
| `es-es`  | Español            | ✅     |

**Idioma padrão**: `pt-br` em ambos

## 📚 Estrutura de Chaves Compartilhadas

```json
{
  "auth": {
    "errors": { ... },      // Backend + Frontend
    "messages": { ... }     // Backend + Frontend
  },
  "habits": {
    "errors": { ... },      // Backend + Frontend
    "messages": { ... }     // Backend + Frontend
  },
  "users": {
    "errors": { ... },      // Backend + Frontend
    "messages": { ... }     // Backend + Frontend
  },
  "ai": {
    "errors": { ... },      // Backend + Frontend
    "messages": { ... }     // Backend + Frontend
  },
  "ads": {
    "errors": { ... },      // Backend + Frontend
    "messages": { ... }     // Backend + Frontend
  },
  "common": {
    "errors": { ... },      // Backend + Frontend
    "messages": { ... }     // Backend + Frontend
  },
  "ui": {
    "buttons": { ... },     // FRONTEND ONLY
    "labels": { ... },      // FRONTEND ONLY
    "placeholders": { ... } // FRONTEND ONLY
  }
}
```

## 📡 Headers e Query Params

### Frontend envia:

```
GET /api/habits
Accept-Language: pt-br
Lang: pt-br (query param fallback)
Authorization: Bearer <token>
```

### Backend recebe e usa para:

1. Retornar mensagens de erro no idioma correto
2. Validação de DTOs em mensagens customizadas
3. Logs com idioma apropriado

## ✅ Checklist de Manutenção

Quando adicionar **NOVA chave** de tradução:

- [ ] Adicionar em `pt-br.json` (backend)
- [ ] Adicionar em `en-us.json` (backend)
- [ ] Adicionar em `es-es.json` (backend)
- [ ] Adicionar em `pt-br.json` (frontend) - EXATAMENTE IGUAL
- [ ] Adicionar em `en-us.json` (frontend) - EXATAMENTE IGUAL
- [ ] Adicionar em `es-es.json` (frontend) - EXATAMENTE IGUAL
- [ ] Usar em backend (service/controller)
- [ ] Usar em frontend (componente/screen)
- [ ] Executar `npm run validate-i18n` em ambos
- [ ] Testar em todos os 3 idiomas

### Comando para Backend (se implementado):

```bash
npm run i18n:validate
```

### Comando para Frontend:

```bash
# Na pasta front-HabitMind AI/app/
npm run i18n:validate
# ou
npx ts-node src/i18n/validate.ts
```

## 🔄 Sincronização Automática

Considere futuras implementações:

1. **Script de CI/CD**: Validar sincronização em PRs
2. **Teste automático**: Fail build se chaves faltarem
3. **Hot reload**: Recarregar traduções sem rebuild
4. **Namespace compartilhado**: Usar mesmo arquivo JSON em ambas as camadas

## 🚀 Best Practices

### Para Adicionar Novas Strings

**Backend (NestJS)**:
```typescript
// Em um service
throw new BadRequestException(
  this.i18n.t('auth.errors.invalid_email', req.lang)
);
```

**Frontend (React Native)**:
```typescript
// Em um componente
const { t } = useI18n();
Alert.alert('Erro', t('auth.errors.invalid_email'));
```

### Para Mensagens Dinâmicas

**Backend**:
```typescript
this.i18n.tParams('messages.welcome', { name: 'João' }, 'pt-br')
// Tradução: "Bem-vindo, :name!"
// Resultado: "Bem-vindo, João!"
```

**Frontend**:
```typescript
const { tParams } = useI18n();
tParams('messages.welcome', { name: 'João' })
```

## 📊 Comparação de Recursos

| Recurso | Backend | Frontend |
|---------|---------|----------|
| Carregar JSON | ✅ Em build | ✅ Em import |
| Cache em memória | ✅ | ✅ |
| Persist idioma | ❌ (server) | ✅ (secureStorage) |
| Detectar por header | ✅ | ❌ (envia) |
| Hook React | ❌ | ✅ |
| Zustand store | ❌ | ✅ |
| Validar sincronização | ❓ (pode adicionar) | ✅ (validate.ts) |

## 🎯 Próximos Passos

1. **Implementar** seletor de idioma em Settings
2. **Testar** sincronização de chaves em CI/CD
3. **Documentar** como adicionar novos idiomas
4. **Monitorar** chaves não traduzidas em produção
5. **Planejar** suporte a mais idiomas (francês, alemão, etc)

---

**Última atualização**: 11/01/2026
**Responsabilidade de Sincronização**: AMBAS as equipes (Backend + Frontend)
