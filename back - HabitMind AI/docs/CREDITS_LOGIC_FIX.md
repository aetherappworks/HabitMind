# 🔧 Correção da Lógica de Desconto de Créditos

**Data:** 10 de Janeiro de 2026  
**Status:** ✅ Implementado e validado

---

## 🐛 Problema Identificado

O novo campo `availableCredits` foi adicionado ao banco de dados mas **não estava sendo atualizado** nos seguintes casos:

1. ❌ Quando usuário recebia créditos de anúncios
2. ❌ Quando usuário gastava créditos com análise de IA

---

## ✅ Solução Implementada

### 1. **ads.service.ts** - Incrementar créditos

#### Método: `validateAndRewardAd()`
```typescript
// Após validar e marcar reward como claimed:
await this.prisma.user.update({
  where: { id: userId },
  data: {
    availableCredits: {
      increment: adConfig.rewardAmount,  // ✅ Incrementa
    },
    totalCredits: {
      increment: adConfig.rewardAmount,  // ✅ Incrementa
    },
  },
});
```

#### Método: `handleRewardCompletion()`
```typescript
// Após criar ad view com reward:
await this.prisma.user.update({
  where: { id: userId },
  data: {
    availableCredits: {
      increment: adConfig.rewardAmount,  // ✅ Incrementa
    },
    totalCredits: {
      increment: adConfig.rewardAmount,  // ✅ Incrementa
    },
  },
});
```

---

### 2. **ai.service.ts** - Decrementar créditos

#### Novo:
```typescript
export class AiService {
  private readonly CREDIT_COST_ANALYSIS = 3; // 3 créditos por análise
  
  async analyzeHabit(...) {
    // 1. Verificar se usuário tem créditos suficientes
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { availableCredits: true },
    });

    if (user.availableCredits < this.CREDIT_COST_ANALYSIS) {
      throw new BadRequestException(
        this.i18n.t('ai.errors.insufficient_credits', lang),
      );
    }

    // 2. Criar insight
    const savedInsight = await this.prisma.aIInsight.create({...});

    // 3. Descontar créditos ✅
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        availableCredits: {
          decrement: this.CREDIT_COST_ANALYSIS,  // ✅ Decrementa
        },
      },
    });

    return savedInsight;
  }
}
```

---

### 3. **Internacionalização (i18n)**

Adicionada mensagem de erro em 3 idiomas:

#### pt-br.json
```json
"ai": {
  "errors": {
    "insufficient_credits": "Créditos insuficientes para análise. Assista anúncios ou faça upgrade"
  }
}
```

#### en-us.json
```json
"ai": {
  "errors": {
    "insufficient_credits": "Insufficient credits for analysis. Watch ads or upgrade"
  }
}
```

#### es-es.json
```json
"ai": {
  "errors": {
    "insufficient_credits": "Créditos insuficientes para análisis. Mire anuncios o actualice"
  }
}
```

---

## 📊 Fluxo de Créditos Agora Funcionando

```
┌─────────────────────────────────────────────────────────┐
│           FLUXO COMPLETO DE CRÉDITOS                    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  1. USUÁRIO ASSISTE ANÚNCIO                             │
│     ↓                                                   │
│  2. POST /ads/reward/:adViewId                          │
│     ↓                                                   │
│  3. validateAndRewardAd()                               │
│     ↓                                                   │
│  4. ✅ availableCredits += rewardAmount                 │
│     ✅ totalCredits += rewardAmount                     │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  5. USUÁRIO SOLICITA ANÁLISE IA                         │
│     ↓                                                   │
│  6. POST /ai/analyze                                    │
│     ↓                                                   │
│  7. analyzeHabit()                                      │
│     ↓                                                   │
│  8. Verifica: availableCredits >= 3?                    │
│     ✓ SIM: Continua                                     │
│     ✗ NÃO: Erro 400 "insufficient_credits"             │
│     ↓                                                   │
│  9. ✅ availableCredits -= 3                            │
│     (totalCredits não muda - só disponíveis)            │
│                                                         │
│  10. GET /users/credits                                 │
│      ↓                                                  │
│      Retorna: {                                         │
│        availableCredits: 7,                             │
│        totalCredits: 15,                                │
│        planType: "free"                                 │
│      }                                                  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 🧪 Como Testar

### Teste 1: Anúncio → Créditos
```bash
# 1. Gravar vista de anúncio
POST /ads/record
{
  "adType": "rewarded",
  "adId": "ad_123",
  "validationToken": "token_123"
}

# 2. Reivindicar reward
POST /ads/reward/:adViewId
{
  "validationToken": "token_123"
}

# 3. Verificar créditos
GET /users/credits

# ✅ Deve retornar: availableCredits > anterior
```

### Teste 2: Análise IA com Crédito
```bash
# 1. Tentar análise com créditos
POST /ai/analyze
{
  "habitId": "habit_123",
  "type": "pattern_analysis"
}

# ✅ Deve retornar: 200 OK + insight

# 2. Verificar créditos decrementados
GET /users/credits

# ✅ Deve retornar: availableCredits -= 3
```

### Teste 3: Análise IA sem Crédito
```bash
# 1. Gastar todos os créditos (múltiplas análises)
# 2. Tentar análise sem créditos
POST /ai/analyze
{
  "habitId": "habit_123",
  "type": "pattern_analysis"
}

# ❌ Deve retornar: 400 Bad Request
# {
#   "statusCode": 400,
#   "message": "Créditos insuficientes para análise. Assista anúncios ou faça upgrade"
# }
```

---

## 📈 Campos do Usuário

Agora o usuário tem:

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `availableCredits` | Int | Créditos disponíveis para usar |
| `totalCredits` | Int | Total de créditos acumulados (histórico) |
| `lastCreditRefillAt` | DateTime | Último refill de créditos |

---

## 🔄 Arquivos Modificados

```
✏️ src/ads/ads.service.ts                (+20 linhas)
   - validateAndRewardAd()
   - handleRewardCompletion()

✏️ src/ai/ai.service.ts                  (+30 linhas)
   - analyzeHabit()
   - Adicionado CREDIT_COST_ANALYSIS

✏️ src/i18n/locales/pt-br.json           (+1 linha)
✏️ src/i18n/locales/en-us.json           (+1 linha)
✏️ src/i18n/locales/es-es.json           (+1 linha)
```

---

## ✨ Resultado

✅ **Créditos agora funcionam corretamente!**

- Anúncios incrementam créditos
- Análise IA desconta créditos
- Validação de créditos insuficientes
- Mensagens multilíngues

---

**Status:** Production Ready 🚀
