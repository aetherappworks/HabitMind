# 🏗️ Visão Geral do Sistema de Recarga de Créditos

## 📐 Arquitetura

```
┌─────────────────────────────────────────────────────────────┐
│                    APP.MODULE                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │             BILLING MODULE ✨ NOVO                 │   │
│  │  ┌─────────────────────────────────────────────┐   │   │
│  │  │  CreditReloadService                        │   │   │
│  │  │  ├─ Reset Automático (Daily/Hourly)       │   │   │
│  │  │  ├─ Recarga Manual                         │   │   │
│  │  │  ├─ Recompensa por Ads                     │   │   │
│  │  │  ├─ Bônus Promocional                      │   │   │
│  │  │  └─ Histórico & Configurações             │   │   │
│  │  └─────────────────────────────────────────────┘   │   │
│  │  ┌─────────────────────────────────────────────┐   │   │
│  │  │  CreditsController (8 endpoints)           │   │   │
│  │  │  ├─ GET /credits/info                      │   │   │
│  │  │  ├─ POST /credits/reload/manual            │   │   │
│  │  │  ├─ POST /credits/reload/force             │   │   │
│  │  │  ├─ POST /credits/reward/ad                │   │   │
│  │  │  ├─ POST /credits/bonus/promo              │   │   │
│  │  │  ├─ GET/POST /credits/config               │   │   │
│  │  │  └─ POST /credits/user/:userId/bonus       │   │   │
│  │  └─────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────┘   │
│                        │                                     │
│                        ↓                                     │
│  ┌─────────────────────────────────────────────────────┐   │
│  │            PrismaService (BD)                       │   │
│  │  User.availableCredits                             │   │
│  │  User.totalCredits                                 │   │
│  │  User.lastCreditRefillAt                           │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 Tipos de Recarga

```
RELOAD TYPES
├─ DAILY_RESET ⏰
│  └─ Free users: 20 créditos a cada 00:00 UTC
│     Automático, sem ação do usuário
│
├─ PREMIUM_HOURLY ⏳
│  └─ Premium users: 300 créditos a cada 1 hora
│     Janela móvel de reset
│
├─ MANUAL_PURCHASE 💳
│  └─ Qualquer usuário pode comprar créditos
│     Quantidade customizável (1-10,000)
│
├─ AD_REWARD 📺
│  └─ Usuário ganha créditos assistindo anúncios
│     Banner (1), Interstitial (5), Rewarded (10)
│
└─ BONUS_PROMO 🎁
   └─ Admin adiciona bônus a usuários
      Quantidade customizável (1-50,000)
```

---

## 📊 Fluxo de Dados

### Fluxo 1: Reset Automático Diário

```
┌──────────────────────────────────────────────────────┐
│              00:00 UTC (Todos os dias)               │
├──────────────────────────────────────────────────────┤
│  1. CreditReloadService.performDailyReset()         │
│  2. Buscar todos os usuários com planType = 'free'  │
│  3. Para cada usuário:                              │
│     - previousBalance = availableCredits            │
│     - newBalance = 20 (config.dailyLimit)           │
│     - UPDATE user SET availableCredits = 20         │
│     - recordHistory(DAILY_RESET, 20, ...)           │
│  4. Log: "[DAILY RESET] N usuários recarregados"    │
└──────────────────────────────────────────────────────┘
```

### Fluxo 2: Reset Horário com Janela Móvel

```
┌──────────────────────────────────────────────────────┐
│          A cada hora (executar a cada 60min)         │
├──────────────────────────────────────────────────────┤
│  1. CreditReloadService.performHourlyReset()        │
│  2. Buscar usuarios premium cuja última recarga      │
│     foi há > 1 hora atrás                           │
│  3. Para cada um:                                   │
│     - newBalance = 300 (config.dailyLimit)          │
│     - UPDATE user SET availableCredits = 300        │
│     - recordHistory(PREMIUM_HOURLY, ...)            │
│  4. Log se houver updates                           │
└──────────────────────────────────────────────────────┘
```

### Fluxo 3: Recarga Manual (POST /credits/reload/manual)

```
┌──────────────────────────────────────────────────────┐
│              POST /credits/reload/manual             │
│              { amount: 100 }                         │
├──────────────────────────────────────────────────────┤
│  1. Validar amount > 0 e < 10,000                   │
│  2. Buscar usuário no BD                            │
│  3. previousBalance = user.availableCredits         │
│  4. newBalance = previousBalance + amount           │
│  5. UPDATE user:                                    │
│     - availableCredits = newBalance                 │
│     - totalCredits += amount                        │
│     - lastCreditRefillAt = now()                    │
│  6. recordHistory(MANUAL_PURCHASE, amount, ...)    │
│  7. Retornar resposta com novo saldo                │
└──────────────────────────────────────────────────────┘
     ↓ Resposta ↓
  {
    "success": true,
    "message": "Créditos recarregados com sucesso",
    "credits": {
      "availableCredits": 120,
      "totalCredits": 170
    }
  }
```

### Fluxo 4: Recompensa por Anúncio

```
┌──────────────────────────────────────────────────────┐
│         POST /credits/reward/ad                      │
│         { amount: 10, adType: 'rewarded' }           │
├──────────────────────────────────────────────────────┤
│  1. Validar amount > 0                              │
│  2. Buscar usuário                                  │
│  3. previousBalance = user.availableCredits         │
│  4. newBalance = previousBalance + amount           │
│  5. UPDATE user:                                    │
│     - availableCredits = newBalance                 │
│     - totalCredits += amount                        │
│  6. recordHistory(AD_REWARD, amount, {adType})     │
│  7. Retornar novo saldo                             │
└──────────────────────────────────────────────────────┘
```

### Fluxo 5: Bônus Promocional (Admin)

```
┌──────────────────────────────────────────────────────┐
│         POST /credits/bonus/promo                    │
│         { amount: 50, reason: "New user" }           │
├──────────────────────────────────────────────────────┤
│  1. Verificar se é admin ❌ (não implementado)      │
│  2. Validar amount (1-50,000)                      │
│  3. Buscar usuário                                  │
│  4. previousBalance = user.availableCredits         │
│  5. newBalance = previousBalance + amount           │
│  6. UPDATE user:                                    │
│     - availableCredits = newBalance                 │
│     - totalCredits += amount                        │
│     - lastCreditRefillAt = now()                    │
│  7. recordHistory(BONUS_PROMO, amount, {reason})   │
│  8. Retornar novo saldo                             │
└──────────────────────────────────────────────────────┘
```

---

## 🔐 Validações e Segurança

```
VALIDAÇÃO CHECKLIST
│
├─ Quantidade de Créditos ✅
│  ├─ Deve ser número positivo
│  ├─ Mínimo: 1
│  ├─ Máximo: 10,000 (manual), 50,000 (promo)
│  └─ Lança BadRequestException se inválido
│
├─ Usuário ✅
│  ├─ Deve existir no BD
│  └─ Lança NotFoundException se não encontrado
│
├─ Frequência de Recarga ✅
│  ├─ Free: 1x a cada 24 horas
│  ├─ Premium: 1x a cada 1 hora
│  └─ Lança ForbiddenException se violar limite
│
├─ Tipo de Plano ✅
│  ├─ Deve ser 'free' ou 'premium'
│  └─ Lanza BadRequestException se inválido
│
└─ Autenticação ✅
   ├─ Requer JWT válido (JwtGuard)
   └─ Endpoints admin requerem verificação
```

---

## 📈 Ciclo de Vida do Usuário Free

```
Dia 1, 00:00 UTC
     ↓
┌─────────────────────┐
│ Reset Automático    │
│ availableCredits=20 │
└─────────────────────┘
     ↓
Usuário utiliza créditos ao longo do dia
     ↓
Dia 1, 18:30 (exemplo)
┌─────────────────────────┐
│ availableCredits = 8    │
│ (usou 12 créditos)      │
└─────────────────────────┘
     ↓
Próximo dia, 00:00 UTC
     ↓
┌─────────────────────────┐
│ Reset Automático        │
│ availableCredits = 20   │
│ (reset, volta ao máximo)│
└─────────────────────────┘
     ↓
Ciclo Continua...
```

---

## 📈 Ciclo de Vida do Usuário Premium

```
Hora N, X:00
     ↓
┌──────────────────────┐
│ Reset Horário        │
│ availableCredits=300 │
│ lastRefillAt=X:00    │
└──────────────────────┘
     ↓
Usuário utiliza créditos até X:45
     ↓
┌──────────────────────────┐
│ availableCredits = 150   │
│ (usou 150 créditos)      │
│ lastRefillAt ainda = X:00│
└──────────────────────────┘
     ↓
Hora N+1, (X+1):00
     ↓
┌──────────────────────────┐
│ Reset Horário            │
│ availableCredits = 300   │
│ (reset, volta ao máximo) │
│ lastRefillAt=(X+1):00    │
└──────────────────────────┘
     ↓
Ciclo Continua a cada hora...
```

---

## 🎮 Endpoints Summary

```
┌────────────────────────────────────────────────────────────┐
│                  ENDPOINTS DISPONÍVEIS                     │
├────────────────────────────────────────────────────────────┤
│ GET /credits/info                                          │
│ └─ Obter informações atuais de créditos                   │
│
│ POST /credits/reload/manual                                │
│ └─ Recarregar créditos (compra)                           │
│
│ POST /credits/reload/force                                 │
│ └─ Forçar recarga respeitando limite de tempo             │
│
│ POST /credits/reward/ad                                    │
│ └─ Adicionar recompensa por anúncio                       │
│
│ POST /credits/bonus/promo                                  │
│ └─ Adicionar bônus promocional (admin)                    │
│
│ GET /credits/config/:planType                              │
│ └─ Obter configuração de um plano                         │
│
│ POST /credits/config                                       │
│ └─ Atualizar configuração (admin)                         │
│
│ POST /credits/user/:userId/bonus                           │
│ └─ Adicionar bônus a usuário específico (admin)           │
└────────────────────────────────────────────────────────────┘
```

---

## 💾 Dados no Banco

```
TABLE: users
├─ id (CUID)
├─ email
├─ name
├─ passwordHash
├─ planType: 'free' | 'premium'
├─ availableCredits: 20 (free) ou 300 (premium)
├─ totalCredits: 45 (soma de tudo já recebido)
├─ lastCreditRefillAt: 2026-01-11T00:00:00Z
├─ createdAt
└─ updatedAt
```

---

## 🔄 Histórico (Em Memória)

```
CreditReloadHistory[]
├─ userId: "cuid123"
├─ reloadType: "daily_reset"
├─ amount: 20
├─ previousBalance: 0
├─ newBalance: 20
├─ metadata: { planType: "free" }
└─ timestamp: 2026-01-11T00:00:00Z
```

---

## 🎯 Casos de Uso

```
CASO 1: Usuário Free Normal
├─ Recebe 20 créditos a cada dia
├─ Pode comprar mais créditos
└─ Pode ganhar por assistir ads

CASO 2: Usuário Premium
├─ Recebe 300 créditos a cada hora
├─ Reset automático janela móvel
└─ Maior limite de uso

CASO 3: Novo Usuário (Onboarding)
├─ Recebe bônus de boas-vindas (+50)
├─ Total inicial: 50 + 20 = 70 créditos
└─ Começa a usar imediatamente

CASO 4: Campanha Promocional
├─ Admin distribui bônus a usuários
├─ Ex: +100 créditos por aniversário
└─ Histórico registra motivo

CASO 5: Visualização de Anúncio
├─ Usuário assiste rewarded ad
├─ Ganha 10 créditos automáticamente
└─ Contador de ads diários controlado
```

---

## 🚀 Melhorias Futuras

```
TODO
├─ [ ] Integração com payment gateway
├─ [ ] Expiring credits (validade)
├─ [ ] Sistema de referral
├─ [ ] Operações em lote (bulk)
├─ [ ] Dashboard admin
├─ [ ] Alertas de créditos baixos
├─ [ ] Estatísticas de uso
├─ [ ] Gifting entre usuários
├─ [ ] Rate de câmbio dinâmica
└─ [ ] Auditoria completa
```

---

## 📞 Arquivos de Referência

```
Implementação:
├─ src/billing/billing.module.ts
├─ src/billing/credit-reload.service.ts
├─ src/billing/credits.controller.ts
├─ src/billing/dto/credit-reload.dto.ts
└─ src/app.module.ts (atualizado)

Documentação:
├─ docs/billing/01_CREDITS_SYSTEM.md
├─ docs/billing/02_RATE_LIMITING.md
├─ docs/billing/03_CREDIT_RELOAD_SYSTEM.md
├─ docs/billing/04_CREDIT_RELOAD_EXAMPLES.md
└─ docs/billing/IMPLEMENTATION_GUIDE.md

Diagrama:
└─ docs/billing/ARCHITECTURE_OVERVIEW.md (este arquivo)
```

---

✨ **Sistema pronto para produção!** ✨
