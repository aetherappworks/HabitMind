# 📋 Frontend Deliverables & Feature Planning

**Tudo que o time frontend precisa saber e implementar**

---

## 🎯 Status Geral

| Item | Status | Versão |
|------|--------|--------|
| **Core Backend** | ✅ Completo | v0.1.0 |
| **Monetização (Ads)** | ✅ Completo | v0.2.0 |
| **Google Play Billing** | 🔄 Em desenvolvimento | v0.3.0 |
| **Analytics** | 📋 Planejado | v0.4.0 |

---

## 📚 Documentação para Frontend

### Essenciais (LEIA PRIMEIRO)
1. **[00_README.md](00_README.md)** - Visão geral do projeto (5 min)
2. **[01_FRONTEND_GUIDE.md](01_FRONTEND_GUIDE.md)** - Guia de integração técnica (30 min)
3. **[02_DELIVERABLES.md](02_DELIVERABLES.md)** - Este arquivo - Funcionalidades (15 min)

### Referência
- **Backend API Docs:** http://localhost:3000/api/docs (Swagger interativo)
- **Complete API Reference:** `/docs/api/API_REFERENCE.md`
- **Testing Guide:** `/docs/TESTING_GUIDE_ADS.md`

---

## ✅ Funcionalidades Implementadas (Fase 1)

### 🔐 Autenticação & Usuários

**Endpoints:**
- `POST /auth/register` - Criar conta nova
- `POST /auth/login` - Fazer login
- `GET /users/me` - Obter perfil atual
- `PUT /users/me` - Atualizar perfil
- `GET /users/credits` - Saldo de créditos
- `POST /users/deduct-credits` - Deduzir créditos

**Frontend Components Necessários:**
- [ ] Tela de Login
- [ ] Tela de Registro
- [ ] Tela de Perfil
- [ ] Gerenciador de Sessão (localStorage)

**Fluxo de Autenticação:**
```
1. Usuário preenche email/senha
2. POST /auth/login → recebe accessToken
3. Salvar token em localStorage
4. Usar token em Authorization header para outras requisições
5. Token válido por 24 horas
```

---

### 📅 Sistema de Hábitos

**Endpoints:**
- `POST /habits` - Criar novo hábito
- `GET /habits` - Listar todos os hábitos
- `GET /habits/:id` - Detalhes de um hábito
- `PUT /habits/:id` - Atualizar hábito
- `DELETE /habits/:id` - Deletar hábito

**Frontend Components Necessários:**
- [ ] Dashboard de Hábitos
- [ ] Tela de Criar Hábito
- [ ] Tela de Detalhes do Hábito
- [ ] Tela de Editar Hábito
- [ ] Modal de Confirmação de Delete

**Features:**
- Filtrar por frequência (daily, weekly, custom)
- Mostrar hora preferencial
- Indicador visual de ativo/inativo
- Contador de check-ins

---

### ✅ Sistema de Check-ins

**Endpoints:**
- `POST /habits/:id/checkins` - Registrar conclusão
- `GET /habits/:id/checkins` - Listar check-ins
- `GET /habits/:id/checkins/range?startDate=&endDate=` - Range de datas

**Frontend Components Necessários:**
- [ ] Calendário de Check-ins
- [ ] Botão Marcar Completo/Pulado
- [ ] Lista de Histórico
- [ ] Gráfico de Progresso (semanal/mensal)

**Features:**
- Status: Completed, Pending, Skipped
- Notas opcionais por check-in
- Visualização em calendário
- Taxa de sucesso (%)

---

### 🤖 Análise com IA

**Endpoints:**
- `POST /ai/analyze` - Gerar insight
- `GET /ai/insights` - Listar insights

**Frontend Components Necessários:**
- [ ] Card de Insights
- [ ] Modal com Detalhes do Insight
- [ ] Indicador de Confiança (score)

**Tipos de Insights:**
1. `pattern_analysis` - Padrões detectados
2. `time_suggestion` - Horário melhor
3. `encouragement` - Motivação
4. `adjustment` - Sugestões de melhoria

---

## ✅ Funcionalidades Implementadas (Fase 2) - MONETIZAÇÃO

### 📺 Sistema de Anúncios (Google AdMob)

**Endpoints:**
- `POST /ads/view` - Registrar visualização
- `POST /ads/reward-completion` - Registrar conclusão
- `POST /ads/validation/:adId` - Validar anúncio
- `GET /ads/config` - Configuração de anúncios
- `GET /ads/stats` - Estatísticas de ganhos
- `GET /ads/history` - Histórico de visualizações

**Frontend Components Necessários:**
- [ ] Botão "Assistir Anúncio para Ganhar Créditos"
- [ ] Modal de Anúncio Rewarded
- [ ] Seção de Anúncios Banner
- [ ] Seção de Anúncios Interstitial
- [ ] Dashboard de Ganhos
- [ ] Limite Diário Restante

**Tipos de Anúncios:**
1. **Rewarded** - 10 créditos por visualização (limite: 20/dia)
2. **Banner** - 1 crédito por visualização (limite: 50/dia)
3. **Interstitial** - 5 créditos por visualização (limite: 10/dia)

**Integração com Google AdMob:**
```typescript
1. Instalar react-google-mobile-ads
2. Configurar App ID e Ad Unit IDs
3. Mostrar anúncio
4. Ao completar → POST /ads/view
5. Registrar recompensa → POST /ads/reward-completion
6. Atualizar balance de créditos
```

**Proteção Contra Fraude:**
- Validação de token do Google AdMob
- Rate limiting (máximo de requisições por hora)
- Prevenção de duplicatas
- Verificação de propriedade do usuário

---

## 🔄 Funcionalidades em Desenvolvimento (Fase 3)

### 💳 Google Play Billing

**O que será implementado:**
- Planos de assinatura (Basic, Pro, Premium)
- Integração com Google Play Billing Library
- Validação de recibos
- Gerenciamento de planos ativos
- Cancelamento automático

**Endpoints Futuros:**
- `POST /billing/subscribe` - Iniciar assinatura
- `GET /billing/subscription` - Status da assinatura
- `POST /billing/cancel` - Cancelar assinatura
- `POST /billing/validate-receipt` - Validar recibo

**Frontend Components Necessários:**
- [ ] Tela de Planos
- [ ] Fluxo de Compra
- [ ] Gerenciamento de Assinatura
- [ ] Histórico de Pagamentos

---

## 📊 Funcionalidades Planejadas (Fase 4)

### 📈 Dashboard de Analytics

**O que será implementado:**
- Gráficos de progresso de hábitos
- Taxa de sucesso por hábito
- Análise de tendências
- Comparação período a período
- Estatísticas de créditos

**Endpoints Futuros:**
- `GET /analytics/habits` - Estatísticas gerais
- `GET /analytics/habits/:id` - Detalhes por hábito
- `GET /analytics/trends` - Tendências

**Frontend Components Necessários:**
- [ ] Dashboard com múltiplos gráficos
- [ ] Seletor de período
- [ ] Cards de resumo
- [ ] Gráficos de linha/barra

---

## 📂 Estrutura de Pastas Recomendada

```
frontend/
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx
│   │   │   └── RegisterForm.tsx
│   │   ├── habits/
│   │   │   ├── HabitList.tsx
│   │   │   ├── HabitCard.tsx
│   │   │   ├── HabitForm.tsx
│   │   │   └── HabitDetail.tsx
│   │   ├── checkins/
│   │   │   ├── Calendar.tsx
│   │   │   ├── CheckinButton.tsx
│   │   │   └── CheckinHistory.tsx
│   │   ├── ads/
│   │   │   ├── RewardedAdButton.tsx
│   │   │   ├── BannerAd.tsx
│   │   │   ├── AdStats.tsx
│   │   │   └── AdHistory.tsx
│   │   └── insights/
│   │       ├── InsightCard.tsx
│   │       └── InsightModal.tsx
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useHabits.ts
│   │   ├── useCheckins.ts
│   │   ├── useAds.ts
│   │   └── useInsights.ts
│   ├── services/
│   │   ├── api.ts
│   │   └── storage.ts
│   ├── types/
│   │   ├── auth.ts
│   │   ├── habits.ts
│   │   ├── ads.ts
│   │   └── insights.ts
│   ├── context/
│   │   └── AuthContext.tsx
│   ├── screens/
│   │   ├── Dashboard.tsx
│   │   ├── HabitDetail.tsx
│   │   ├── Profile.tsx
│   │   └── Settings.tsx
│   └── App.tsx
├── .env.example
└── package.json
```

---

## 🎬 Sequência de Implementação Recomendada

### Semana 1: Core
1. [ ] Setup do projeto
2. [ ] Configurar cliente HTTP (Axios)
3. [ ] Implementar autenticação
4. [ ] Tela de login/registro

### Semana 2: Hábitos
1. [ ] CRUD de hábitos
2. [ ] Dashboard de hábitos
3. [ ] Detalhes do hábito
4. [ ] Sistema de check-ins

### Semana 3: IA & Analytics
1. [ ] Mostrar insights
2. [ ] Calendário de progresso
3. [ ] Gráficos básicos
4. [ ] Perfil do usuário

### Semana 4: Monetização
1. [ ] Integração Google AdMob
2. [ ] Botão de assistir anúncio
3. [ ] Dashboard de ganhos
4. [ ] Histórico de anúncios

### Semana 5: Polish
1. [ ] UI/UX refinement
2. [ ] Tratamento de erros
3. [ ] Testes
4. [ ] Deploy

---

## 📋 Checklist de Implementação

### Autenticação
- [ ] Tela de Login
- [ ] Tela de Registro
- [ ] Validação de email/senha
- [ ] Persistência de token
- [ ] Auto-logout em 401
- [ ] Restauração de sessão

### Hábitos
- [ ] Listar hábitos
- [ ] Criar hábito
- [ ] Editar hábito
- [ ] Deletar hábito
- [ ] Detalhes do hábito
- [ ] Filtros

### Check-ins
- [ ] Visualizar check-ins
- [ ] Marcar completo
- [ ] Marcar pulado
- [ ] Adicionar notas
- [ ] Ver calendário
- [ ] Range de datas

### Insights IA
- [ ] Buscar insights
- [ ] Mostrar insights
- [ ] Botão para gerar novo
- [ ] Indicador de confiança
- [ ] Histórico

### Anúncios
- [ ] Setup Google AdMob
- [ ] Mostrar rewarded ads
- [ ] Mostrar banner ads
- [ ] Mostrar interstitial ads
- [ ] Registrar visualizações
- [ ] Dashboard de ganhos
- [ ] Limite diário

### Geral
- [ ] Tratamento de erros
- [ ] Loading states
- [ ] Validação de input
- [ ] Mensagens de sucesso
- [ ] Responsividade mobile
- [ ] Suporte a idiomas (pt-br, en-us, es-es)

---

## 🌍 Suporte a Idiomas

**O backend já suporta 3 idiomas!** ✅

Use o query parameter `?lang=pt-br` em qualquer endpoint:

```typescript
// Exemplos:
POST /auth/register?lang=pt-br
GET /habits?lang=en-us
POST /ai/analyze?lang=es-es
```

**Idiomas Suportados:**
- `pt-br` - Português (Padrão)
- `en-us` - Inglês
- `es-es` - Espanhol

**Frontend deve:**
- [ ] Implementar seletor de idioma
- [ ] Salvar preferência no localStorage
- [ ] Enviar `?lang=<language>` em todos os requests
- [ ] Traduzir apenas a UI (backend já retorna em múltiplos idiomas)

---

## 🔄 Fluxos Principais

### Fluxo 1: Login & Dashboard
```
1. Usuário abre app
2. Verifica se tem token em localStorage
3. Se sim → restaura sessão → Dashboard
4. Se não → Tela de Login
5. Usuário faz login
6. Salva token
7. Redireciona para Dashboard
8. Carrega hábitos e insights
```

### Fluxo 2: Criar Hábito & Registrar Check-in
```
1. Clica "Criar Hábito"
2. Preenche form (título, frequência, hora)
3. POST /habits
4. Sucesso → volta para lista
5. Usuário clica em hábito
6. Vê check-ins anteriores
7. Clica "Marcar Completo"
8. POST /habits/:id/checkins
9. Atualiza visual
```

### Fluxo 3: Ganhar Créditos com Anúncio
```
1. Usuário vai em "Ganhar Créditos"
2. Clica "Assistir Anúncio"
3. Frontend carrega Ad da Google
4. Usuário assiste anúncio
5. Ad completa → POST /ads/view
6. POST /ads/reward-completion
7. Créditos adicionados
8. UI atualiza com novos créditos
```

---

## ⚠️ Validações Necessárias

### Frontend Validations
- [ ] Email válido
- [ ] Senha com força mínima
- [ ] Títulos de hábitos não vazios
- [ ] Datas válidas
- [ ] Horários válidos (HH:MM)

### Backend Validations (Já Implementado)
- ✅ Email único
- ✅ Senha hash
- ✅ JWT tokens
- ✅ Rate limiting
- ✅ Validação de créditos

---

## 🚀 Quick Start para Frontend Dev

**Backend já está configurado e rodando em http://localhost:3000 ✅**

```bash
# 1. Acesse Swagger (API Documentation)
open http://localhost:3000/api/docs

# 2. Teste um endpoint
POST /auth/register
{
  "email": "test@example.com",
  "name": "Test User",
  "password": "Password123!"
}

# 3. Copie o token de resposta
# 4. Use em Authorization: Bearer <token> para próximas requisições

# 5. Leia documentação
cat docs/frontend/01_FRONTEND_GUIDE.md
```

---

## 🎓 Exemplo de Integração

```typescript
// App.tsx
import { useAuth } from './hooks/useAuth';
import { useHabits } from './hooks/useHabits';
import Dashboard from './screens/Dashboard';
import Login from './screens/Login';

function App() {
  const { user, login, logout, restoreSession } = useAuth();
  const { habits } = useHabits();

  useEffect(() => {
    restoreSession(); // Restaurar sessão ao carregar
  }, []);

  if (!user) {
    return <Login onLogin={login} />;
  }

  return (
    <Dashboard 
      user={user}
      habits={habits}
      onLogout={logout}
    />
  );
}
```

---

## 📞 Suporte & Dúvidas

### Se o frontend tiver dúvidas:
1. **Sobre tipos:** Ver `01_FRONTEND_GUIDE.md` → Tipos TypeScript
2. **Sobre endpoints:** Acessar `http://localhost:3000/api/docs` (Swagger)
3. **Sobre exemplos:** Ver `01_FRONTEND_GUIDE.md` → Fluxos Comuns
4. **Sobre erros:** Ver `01_FRONTEND_GUIDE.md` → Tratamento de Erros

### Se precisar testar:
- Swagger: http://localhost:3000/api/docs
- cURL Examples: Ver `01_FRONTEND_GUIDE.md`
- Postman Collection: Será criado se necessário

---

## 📈 Status de Progresso

**Conforme implementar, marque como feito:**

Frontend Dev Checklist:
- [ ] Setup inicial (Axios, tipos, hooks)
- [ ] Autenticação (login, register, sessão)
- [ ] CRUD de hábitos (create, read, update, delete)
- [ ] Sistema de check-ins (calendário, registro)
- [ ] Insights com IA (mostrar recomendações)
- [ ] Monetização por ads (Google AdMob integrado)
- [ ] Dashboard (visão geral de hábitos)
- [ ] Perfil (editar informações)
- [ ] Suporte a idiomas
- [ ] Testes
- [ ] Deploy

---

**Status:** ✅ Pronto para Desenvolvimento  
**Versão:** v0.2.0 (Janeiro 2026)  
**Próxima Revisão:** Quando Fase 3 (Google Play Billing) estiver pronta

[← Voltar ao README](00_README.md) | [Guia de Integração →](01_FRONTEND_GUIDE.md)
