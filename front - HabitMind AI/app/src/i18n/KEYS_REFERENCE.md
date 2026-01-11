# 📚 Referência Completa de Chaves de Tradução

## Como Usar Este Documento

Este é um índice completo de **todas as chaves de tradução** disponíveis no sistema i18n.

Para usar em seu código:
```typescript
import { useI18n } from '../i18n/useI18n';

const { t } = useI18n();
const message = t('auth.messages.logged_in_successfully');
```

---

## 🔐 Auth (Autenticação)

### Erros
- `auth.errors.user_already_exists` - Usuário já existe
- `auth.errors.invalid_credentials` - Email ou senha inválido
- `auth.errors.user_not_found` - Usuário não encontrado
- `auth.errors.weak_password` - Senha muito fraca
- `auth.errors.invalid_email` - Email inválido
- `auth.errors.email_required` - Email é obrigatório
- `auth.errors.password_required` - Senha é obrigatória

### Mensagens
- `auth.messages.registered_successfully` - Registrado com sucesso
- `auth.messages.logged_in_successfully` - Conectado com sucesso
- `auth.messages.check_email` - Verifique seu email

---

## 📅 Hábitos (Habits)

### Erros
- `habits.errors.habit_not_found` - Hábito não encontrado
- `habits.errors.invalid_habit_data` - Dados do hábito inválidos
- `habits.errors.habit_already_exists` - Este hábito já existe
- `habits.errors.habit_name_required` - Nome do hábito é obrigatório
- `habits.errors.invalid_frequency` - Frequência inválida

### Mensagens
- `habits.messages.habit_created` - Hábito criado com sucesso
- `habits.messages.habit_updated` - Hábito atualizado com sucesso
- `habits.messages.habit_deleted` - Hábito deletado com sucesso
- `habits.messages.checkin_created` - Check-in registrado com sucesso

---

## 👤 Usuários (Users)

### Erros
- `users.errors.user_not_found` - Usuário não encontrado
- `users.errors.invalid_user_data` - Dados do usuário inválidos
- `users.errors.profile_update_failed` - Falha ao atualizar perfil

### Mensagens
- `users.messages.profile_updated` - Perfil atualizado com sucesso
- `users.messages.preferences_updated` - Preferências atualizadas com sucesso

---

## 🤖 IA (Artificial Intelligence)

### Erros
- `ai.errors.analysis_failed` - Falha ao analisar hábito
- `ai.errors.insufficient_data` - Dados insuficientes para análise
- `ai.errors.insufficient_credits` - Créditos insuficientes para análise

### Mensagens
- `ai.messages.analysis_completed` - Análise completada com sucesso
- `ai.messages.insights_generated` - Insights gerados com sucesso
- `ai.messages.habit_suggestions_generated` - Sugestões de novos hábitos geradas
- `ai.messages.habit_suggestion_generated` - Sugestão de novo hábito gerada
- `ai.messages.no_habits_yet` - Comece a rastrear hábitos

---

## 📢 Anúncios (Ads)

### Erros
- `ads.errors.ad_type_not_enabled` - Este tipo de anúncio não está disponível
- `ads.errors.daily_limit_reached` - Limite de anúncios diário atingido
- `ads.errors.ad_view_not_found` - Visualização de anúncio não encontrada
- `ads.errors.unauthorized_ad_claim` - Não autorizado para reivindicar este anúncio
- `ads.errors.reward_already_claimed` - Recompensa já foi reivindicada
- `ads.errors.invalid_token` - Token de anúncio inválido
- `ads.errors.ad_config_not_found` - Configuração de anúncio não encontrada

### Mensagens
- `ads.messages.ad_view_recorded` - Anúncio registrado com sucesso
- `ads.messages.reward_granted` - Recompensa concedida com sucesso
- `ads.messages.reward_validation_failed` - Falha ao validar recompensa

---

## 🛡️ Comuns (Common)

### Erros
- `common.errors.unauthorized` - Não autorizado
- `common.errors.forbidden` - Acesso proibido
- `common.errors.internal_error` - Erro interno do servidor
- `common.errors.bad_request` - Requisição inválida
- `common.errors.not_found` - Recurso não encontrado
- `common.errors.rate_limit_exceeded` - Limite de requisições excedido
- `common.errors.invalid_token` - Token inválido ou expirado

### Mensagens
- `common.messages.success` - Operação realizada com sucesso
- `common.messages.created` - Criado com sucesso
- `common.messages.updated` - Atualizado com sucesso
- `common.messages.deleted` - Deletado com sucesso

---

## 🎨 Interface (UI)

### Botões
- `ui.buttons.login` - Conectar / Login
- `ui.buttons.register` - Registrar / Register
- `ui.buttons.logout` - Desconectar / Logout
- `ui.buttons.save` - Salvar / Save
- `ui.buttons.cancel` - Cancelar / Cancel
- `ui.buttons.delete` - Deletar / Delete
- `ui.buttons.edit` - Editar / Edit
- `ui.buttons.create` - Criar / Create
- `ui.buttons.submit` - Enviar / Submit
- `ui.buttons.back` - Voltar / Back
- `ui.buttons.next` - Próximo / Next
- `ui.buttons.previous` - Anterior / Previous
- `ui.buttons.close` - Fechar / Close
- `ui.buttons.confirm` - Confirmar / Confirm
- `ui.buttons.loading` - Carregando / Loading...
- `ui.buttons.retry` - Tentar novamente / Retry

### Labels (Rótulos)
- `ui.labels.email` - Email
- `ui.labels.password` - Senha / Password
- `ui.labels.name` - Nome / Name
- `ui.labels.habitName` - Nome do Hábito / Habit Name
- `ui.labels.description` - Descrição / Description
- `ui.labels.frequency` - Frequência / Frequency
- `ui.labels.language` - Idioma / Language
- `ui.labels.credits` - Créditos / Credits
- `ui.labels.settings` - Configurações / Settings
- `ui.labels.profile` - Perfil / Profile

### Placeholders (Dicas)
- `ui.placeholders.email` - Digite seu email / Enter your email
- `ui.placeholders.password` - Digite sua senha / Enter your password
- `ui.placeholders.habitName` - Ex: Exercício matinal / Ex: Morning exercise
- `ui.placeholders.description` - Descreva seu hábito / Describe your habit

### Notificações
- `ui.notifications.success` - Sucesso / Success!
- `ui.notifications.error` - Erro / Error!
- `ui.notifications.warning` - Aviso / Warning
- `ui.notifications.info` - Informação / Information

---

## 📊 Resumo

| Módulo | Erros | Mensagens | Total |
|--------|-------|-----------|-------|
| auth | 7 | 3 | 10 |
| habits | 5 | 4 | 9 |
| users | 3 | 2 | 5 |
| ai | 3 | 5 | 8 |
| ads | 7 | 3 | 10 |
| common | 7 | 4 | 11 |
| ui | - | 28 | 28 |
| **TOTAL** | **32** | **49** | **81** |

---

## 🔍 Procurando por Algo?

### Por Tipo de Mensagem

**Erros de Autenticação:**
- `auth.errors.*`

**Mensagens de Sucesso:**
- `*.messages.created`
- `*.messages.updated`
- `*.messages.deleted`
- `*.messages.*_successfully`

**Labels de Formulário:**
- `ui.labels.*`

**Botões:**
- `ui.buttons.*`

**Erros Genéricos:**
- `common.errors.*`

---

## 💡 Exemplos de Uso

### Mostrar Erro
```typescript
const { t } = useI18n();
Alert.alert(
  t('ui.notifications.error'),
  t('auth.errors.invalid_credentials')
);
```

### Mostrar Sucesso
```typescript
Alert.alert(
  t('ui.notifications.success'),
  t('habits.messages.habit_created')
);
```

### Placeholder em Input
```typescript
<TextInput
  placeholder={t('ui.placeholders.email')}
/>
```

### Label em Formulário
```typescript
<Text>{t('ui.labels.email')}</Text>
```

### Botão
```typescript
<Button
  title={t('ui.buttons.login')}
  onPress={handleLogin}
/>
```

---

## ✅ Checklists por Tipo de Tela

### Login Screen
- [ ] `ui.labels.email`
- [ ] `ui.labels.password`
- [ ] `ui.placeholders.email`
- [ ] `ui.placeholders.password`
- [ ] `ui.buttons.login`
- [ ] `auth.messages.logged_in_successfully`
- [ ] `auth.errors.invalid_credentials`

### Register Screen
- [ ] `ui.labels.email`
- [ ] `ui.labels.password`
- [ ] `ui.labels.name`
- [ ] `ui.buttons.register`
- [ ] `auth.messages.registered_successfully`
- [ ] `auth.errors.user_already_exists`

### Habit List Screen
- [ ] `ui.buttons.create`
- [ ] `habits.messages.habit_created`
- [ ] `habits.errors.habit_not_found`
- [ ] `ui.buttons.delete`
- [ ] `habits.messages.habit_deleted`

### Settings Screen
- [ ] `ui.labels.language`
- [ ] `ui.labels.profile`
- [ ] `ui.buttons.logout`

---

## 🌍 Adicionar Nova Chave

Quando adicionar nova chave:

1. **Escolha o módulo** (auth, habits, users, ai, ads, common, ui)
2. **Escolha a categoria** (errors, messages, buttons, labels, etc)
3. **Use snake_case**: `my_new_key`
4. **Estrutura**: `module.category.key`
5. **Exemplo**: `habits.messages.habit_archived`

Adicione em **TODOS os 3 JSONs**:
- pt-br.json
- en-us.json
- es-es.json

---

## 🔄 Variações de Tradução

### Paramétrica
```typescript
const { tParams } = useI18n();
const msg = tParams('ai.messages.habit_streak', { days: 30 });
```

**Tradução**: "Parabéns! Você completou :days dias consecutivos"  
**Resultado**: "Parabéns! Você completou 30 dias consecutivos"

---

## 📝 Notas

- Todas as chaves seguem formato: `module.context.key`
- Todas as chaves existem em todos os 3 idiomas
- Use `t()` para simples, `tParams()` para com variáveis
- Chaves são case-sensitive
- Sem espaços em chaves

---

**Referência v1.0 | 11/01/2026**  
**Total de chaves**: 81  
**Idiomas**: 3 (pt-br, en-us, es-es)
