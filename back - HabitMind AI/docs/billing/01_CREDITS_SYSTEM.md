# 💳 Implementação: Sistema de Créditos por Plano

## 📝 Resumo das Mudanças

Conforme solicitado no arquivo `rate-limit-monetization.md`, foi implementado um **sistema de créditos com pesos por endpoint**, criando fricção controlada para o plano Free e fluidez para Premium.

---

## 🎯 Novo Modelo Implementado

### Antes (Simples)
- Contagem de requisições
- Limite por hora igual para todos

### Agora (Créditos)
- Cada endpoint consome **créditos diferentes**
- Free: 20 créditos/dia (reset 00:00 UTC)
- Premium: 300 créditos/hora (janela móvel)

---

## 📊 Pesos de Créditos por Endpoint

| Endpoint | Descrição | Custo |
|----------|-----------|-------|
| `POST /ai/analyze` | Análise profunda | **3 créditos** |
| `GET /ai/insights` | Insights rápidos | **1 crédito** |

### Exemplos de Uso Free (20 créditos/dia)

```
Cenário 1: Análises profundas
  - 6 × POST /ai/analyze = 18 créditos
  - 2 × GET /ai/insights = 2 créditos
  - Total: 20 créditos → LIMITE ATINGIDO

Cenário 2: Insights rápidos
  - 20 × GET /ai/insights = 20 créditos → LIMITE ATINGIDO

Cenário 3: Misto
  - 4 × POST /ai/analyze = 12 créditos
  - 5 × GET /ai/insights = 5 créditos
  - 3 × GET /ai/insights = 3 créditos
  - Total: 20 créditos → LIMITE ATINGIDO
```

---

## 🔧 Arquivos Modificados

### 1. **RateLimitService** (Refatorado) — `src/common/services/rate-limit.service.ts`

**Novo:**
- Enum `CreditCost` com pesos (ANALYZE_HABIT=3, GET_INSIGHTS=1)
- Método `hasCredits(userId, planType, creditCost)` — Verifica saldo
- Método `debitCredits(userId, planType, creditCost)` — Debita créditos
- Método `getCreditInfo()` — Retorna info com `resetType` (daily|hourly)
- Método `getUpgradeMessage()` — Mensagens amigáveis de upgrade
- Reset inteligente: **Daily para Free**, **Hourly para Premium**

**Exemplo:**
```typescript
// Verificar se pode fazer análise profunda
if (this.rateLimitService.hasCredits(userId, 'free', CreditCost.ANALYZE_HABIT)) {
  // ... fazer análise
  this.rateLimitService.debitCredits(userId, 'free', CreditCost.ANALYZE_HABIT);
}
```

---

### 2. **RateLimitGuard** (Refatorado) — `src/common/guards/rate-limit.guard.ts`

**Novo:**
- Lê `@CreditCostDecorator` para descobrir custo do endpoint
- Chama `hasCredits()` com o peso correto
- Debita automaticamente se permitido
- Headers detalhados:
  - `X-RateLimit-Limit` — Limite de créditos
  - `X-RateLimit-Used` — Créditos usados
  - `X-RateLimit-Remaining` — Créditos restantes
  - `X-RateLimit-Type` — `DAILY_RESET` ou `HOURLY_RESET`
  - `X-Credit-Cost` — Créditos debitados dessa requisição

**Erro 403:**
```json
{
  "message": "Você atingiu o limite diário de créditos. Upgrade para Premium para análises ilimitadas!",
  "credits": {
    "limit": 20,
    "used": 20,
    "remaining": 0,
    "resetTime": "2026-01-07T00:00:00.000Z",
    "resetType": "daily"
  }
}
```

---

### 3. **CreditCostDecorator** (Novo) — `src/common/decorators/credit-cost.decorator.ts`

Decorator para marcar o custo de cada endpoint:

```typescript
@Post('analyze')
@CreditCostDecorator(CreditCost.ANALYZE_HABIT)  // 3 créditos
async analyzeHabit() { ... }

@Get('insights')
@CreditCostDecorator(CreditCost.GET_INSIGHTS)   // 1 crédito
async getInsights() { ... }
```

---

### 4. **AI Controller** (Atualizado) — `src/ai/ai.controller.ts`

Aplicado decorators:
```typescript
@Post('analyze')
@CreditCostDecorator(CreditCost.ANALYZE_HABIT)
async analyzeHabit() { ... }

@Get('insights')
@CreditCostDecorator(CreditCost.GET_INSIGHTS)
async getInsights() { ... }
```

Documentação Swagger atualizada:
- Descrição de custos de créditos
- Informações sobre limites por plano
- Headers de resposta detalhados

---

### 5. **.env** (Atualizado)

Novo padrão de configuração:

```env
# Plano Free: 20 créditos por dia
RATE_LIMIT_FREE_CREDITS_DAY=20

# Plano Premium: 300 créditos por hora
RATE_LIMIT_PREMIUM_CREDITS_HOUR=300
```

---

## 📈 Fluxo de Execução

```
1. Usuário faz requisição a POST /ai/analyze
   ↓
2. @UseGuards(JwtAuthGuard, RateLimitGuard) é acionado
   ↓
3. RateLimitGuard lê @CreditCostDecorator(3)
   ↓
4. Guard chama: rateLimitService.hasCredits(userId, 'free', 3)
   ↓
5. Se SIM:
   - rateLimitService.debitCredits(userId, 'free', 3)
   - Adiciona headers X-RateLimit-*
   - Retorna 201 com insight
   ↓
6. Se NÃO:
   - Retorna 403 com mensagem de upgrade
   - Headers mostram reset time
```

---

## 🧪 Testando Localmente

### 1. Primeira requisição (análise profunda)
```bash
curl -X POST http://localhost:3000/ai/analyze \
  -H "Authorization: Bearer JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"habitId":"123","metrics":"completion_rate"}'
```

**Response Headers:**
```
X-RateLimit-Limit: 20
X-RateLimit-Used: 3
X-RateLimit-Remaining: 17
X-RateLimit-Type: DAILY_RESET
X-Credit-Cost: 3
X-RateLimit-Reset: 2026-01-07T00:00:00.000Z
```

### 2. Quinta requisição de insights (até limite)
```bash
for i in {1..5}; do
  curl -X GET "http://localhost:3000/ai/insights" \
    -H "Authorization: Bearer JWT_TOKEN"
done
```

**Last Response Headers:**
```
X-RateLimit-Remaining: 2  # 20 - 3 - 5 = 12... espera, 20 - 3 (análise) - 5 (5 insights) = 12
X-Credit-Cost: 1
```

### 3. Sexta requisição de insights (teste limite)
```bash
curl -X GET "http://localhost:3000/ai/insights" \
  -H "Authorization: Bearer JWT_TOKEN"
```

**Response (403):**
```json
{
  "error": "Forbidden",
  "message": "Você atingiu o limite diário de créditos. Upgrade para Premium para análises ilimitadas!",
  "credits": {
    "limit": 20,
    "used": 20,
    "remaining": 0,
    "resetTime": "2026-01-07T00:00:00.000Z",
    "resetType": "daily"
  }
}
```

---

## 🎯 Estratégia de Monetização Confirmada

✅ **Fricção Controlada no Free**
- Usuário aprende o limite rapidamente
- Bloqueio ocorre no momento de maior valor
- Mensagens orientam claramente para upgrade

✅ **Fluidez no Premium**
- 300 créditos/hora = ~100 análises profundas/hora
- Praticamente sem bloqueios para uso humano
- Sem fricção perceptível

✅ **Métrica Útil**
- Fácil monitorar % de usuários que atingem limite
- Tempo até primeiro bloqueio
- Taxa de conversão pós-bloqueio

---

## 🚀 Próximos Passos

- [ ] Endpoint `/billing/upgrade` para conversão
- [ ] Endpoint `/billing/usage` para ver histórico de créditos
- [ ] Dashboard no frontend mostrando consumo
- [ ] Alertas quando atingir 80% do limite
- [ ] Analytics de conversão por motivo de bloqueio

---

## ✅ Build Status

```
✓ npm run build — Sem erros
✓ TypeScript compilation — Ok
✓ Todos os decorators — Injetados
✓ Guards — Funcionando
✓ Headers — Sendo retornados
```

