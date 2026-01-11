# 📋 Sistema de Recarga de Créditos

## 📌 Visão Geral

Sistema completo e estruturado para gerenciar recargas automáticas e manuais de créditos para usuários. O sistema suporta múltiplas estratégias de recarga:

- ✅ **Reset Diário** (Free) - 00:00 UTC
- ✅ **Reset Horário** (Premium) - Janela móvel de 1 hora
- ✅ **Compra Manual** - Usuários podem comprar créditos
- ✅ **Recompensa por Ads** - Ganhar créditos assistindo anúncios
- ✅ **Bônus Promocional** - Admins adicionam bônus a usuários

---

## 🏗️ Arquitetura

### Componentes Principais

```
CreditReloadService (src/billing/credit-reload.service.ts)
├── Resets Automáticos
│   ├── scheduleDailyReset() - Free users
│   └── scheduleHourlyReset() - Premium users
├── Recargas Manuais
│   ├── reloadCreditsManual() - Compra
│   ├── addAdReward() - Ads
│   └── addPromoBonus() - Admin
├── Configurações
│   ├── getCreditConfig() - Get config
│   └── updateCreditConfig() - Update config
└── Histórico
    ├── recordHistory() - Log
    └── getHistoryForUser() - Consulta
```

### Enumerações

```typescript
enum ReloadType {
  DAILY_RESET = 'daily_reset',           // Reset automático diário
  PREMIUM_HOURLY = 'premium_hourly',     // Reset automático horário
  MANUAL_PURCHASE = 'manual_purchase',   // Compra de créditos
  AD_REWARD = 'ad_reward',               // Recompensa por ad
  BONUS_PROMO = 'bonus_promo',           // Bônus promocional
}
```

---

## 📊 Configurações de Créditos

### Plano Free

```json
{
  "planType": "free",
  "dailyLimit": 20,
  "resetStrategy": "daily",
  "resetTime": "00:00 UTC"
}
```

**Exemplo de uso:**
- 6 × Análise profunda (3 créditos) = 18 créditos
- 2 × Insights (1 crédito) = 2 créditos
- **Total: 20 créditos** ✓ Limite atingido

### Plano Premium

```json
{
  "planType": "premium",
  "dailyLimit": 300,
  "hourlyLimit": 300,
  "resetStrategy": "hourly",
  "resetWindow": "1 hora (móvel)"
}
```

**Exemplo de uso:**
- Recarga às 10:00 com 300 créditos
- Usa 150 créditos até 10:45
- Próximo reset: 11:00 (300 créditos novamente)

---

## 🔌 Endpoints da API

### 1️⃣ Obter Informações de Créditos

```http
GET /credits/info
Authorization: Bearer <token>
Accept-Language: pt-br
```

**Resposta:**

```json
{
  "user": {
    "id": "cuid123",
    "planType": "free",
    "availableCredits": 15,
    "totalCredits": 45
  },
  "config": {
    "limit": 20,
    "strategy": "daily"
  },
  "nextReset": {
    "time": "2026-01-12T00:00:00.000Z",
    "hoursUntilReset": 8,
    "minutesUntilReset": 23
  },
  "history": [
    {
      "reloadType": "daily_reset",
      "amount": 20,
      "timestamp": "2026-01-11T00:00:00.000Z"
    }
  ]
}
```

---

### 2️⃣ Recarregar Créditos Manualmente

```http
POST /credits/reload/manual
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 100,
  "reason": "Compra via Google Play"
}
```

**Resposta:**

```json
{
  "success": true,
  "message": "Créditos recarregados com sucesso",
  "credits": {
    "id": "cuid123",
    "availableCredits": 115,
    "totalCredits": 145,
    "planType": "free",
    "lastCreditRefillAt": "2026-01-11T15:30:00.000Z"
  },
  "reloadAmount": 100
}
```

---

### 3️⃣ Forçar Recarga de Créditos

```http
POST /credits/reload/force
Authorization: Bearer <token>
```

**Resposta:**

```json
{
  "success": true,
  "message": "Créditos recarregados com sucesso",
  "credits": {
    "id": "cuid123",
    "availableCredits": 20,
    "totalCredits": 45,
    "planType": "free",
    "lastCreditRefillAt": "2026-01-11T18:45:00.000Z"
  },
  "reloadAmount": 5
}
```

**Restrições:**
- Free: Máximo 1x a cada 24 horas
- Premium: Máximo 1x a cada 1 hora

---

### 4️⃣ Adicionar Recompensa por Anúncio

```http
POST /credits/reward/ad
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 10,
  "adType": "rewarded",
  "validationToken": "abc123xyz"
}
```

**Tipos de Anúncios:**
- `banner` - 1 crédito
- `interstitial` - 5 créditos
- `rewarded` - 10 créditos

**Resposta:**

```json
{
  "success": true,
  "credits": {
    "id": "cuid123",
    "availableCredits": 25,
    "totalCredits": 55,
    "planType": "free"
  }
}
```

---

### 5️⃣ Adicionar Bônus Promocional (Admin)

```http
POST /credits/bonus/promo
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "amount": 50,
  "reason": "Bônus de boas-vindas",
  "adminNote": "Novo usuário no referral"
}
```

**Resposta:**

```json
{
  "success": true,
  "message": "Bônus adicionado com sucesso",
  "credits": {
    "id": "cuid123",
    "availableCredits": 70,
    "totalCredits": 100,
    "planType": "free"
  }
}
```

---

### 6️⃣ Obter Configuração de Créditos

```http
GET /credits/config/free
Authorization: Bearer <token>
```

**Resposta:**

```json
{
  "planType": "free",
  "dailyLimit": 20,
  "resetStrategy": "daily"
}
```

---

### 7️⃣ Atualizar Configuração de Créditos (Admin)

```http
POST /credits/config
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "planType": "free",
  "dailyLimit": 30,
  "resetStrategy": "daily"
}
```

**Resposta:**

```json
{
  "success": true,
  "message": "Configuração atualizada com sucesso",
  "config": {
    "planType": "free",
    "dailyLimit": 30,
    "resetStrategy": "daily"
  }
}
```

---

### 8️⃣ Adicionar Bônus a Usuário Específico (Admin)

```http
POST /credits/user/:userId/bonus
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "amount": 100,
  "reason": "Compensação por bug",
  "adminNote": "Relatório #123"
}
```

---

## 🔄 Fluxos de Recarga

### Fluxo 1: Reset Diário (Free)

```
┌─────────────────────────────────────┐
│ 00:00 UTC - Reset Diário            │
│ ────────────────────────────────    │
│ Usuário Free recebe 20 créditos     │
│ availableCredits = 20               │
│ lastCreditRefillAt = now()          │
└─────────────────────────────────────┘
         ↓ 24 horas depois ↓
┌─────────────────────────────────────┐
│ 00:00 UTC (próximo dia)             │
│ Reset automático executado          │
│ availableCredits = 20 (reset)       │
└─────────────────────────────────────┘
```

### Fluxo 2: Reset Horário (Premium)

```
┌─────────────────────────────────────┐
│ 10:00 - Premium Reset               │
│ ────────────────────────────────    │
│ availableCredits = 300              │
│ lastCreditRefillAt = 10:00          │
└─────────────────────────────────────┘
         ↓ 60 minutos depois ↓
┌─────────────────────────────────────┐
│ 11:00 - Próximo Reset               │
│ (se lastCreditRefillAt < now - 1h)  │
│ availableCredits = 300 (reset)      │
└─────────────────────────────────────┘
```

### Fluxo 3: Compra Manual

```
┌─────────────────────────────────────┐
│ POST /credits/reload/manual         │
│ body: { amount: 100 }               │
│ ────────────────────────────────    │
│ availableCredits += 100             │
│ totalCredits += 100                 │
│ reloadType = MANUAL_PURCHASE        │
└─────────────────────────────────────┘
```

### Fluxo 4: Recompensa por Ad

```
┌─────────────────────────────────────┐
│ Ad Visualizado                      │
│ adType: rewarded                    │
│ ────────────────────────────────    │
│ availableCredits += 10              │
│ totalCredits += 10                  │
│ reloadType = AD_REWARD              │
└─────────────────────────────────────┘
```

---

## 🔐 Segurança e Validações

### Validações Implementadas

✅ **Quantidade de Créditos**
- Mínimo: 1
- Máximo: 10.000 (manual), 50.000 (promo)
- Deve ser número positivo

✅ **Frequência de Recarga**
- Free: 1x a cada 24 horas
- Premium: 1x a cada 1 hora
- Lança erro `ForbiddenException` se não respeitar

✅ **Usuário Válido**
- Verifica se usuário existe
- Lança `NotFoundException` se não encontrado

✅ **Tipo de Plano**
- Valida `free` ou `premium`
- Retorna erro se inválido

---

## 📝 Exemplo de Integração

### 1. Registrar o módulo no App

```typescript
// src/app.module.ts
import { BillingModule } from './billing/billing.module';

@Module({
  imports: [
    // ... outros módulos
    BillingModule,
  ],
})
export class AppModule {}
```

### 2. Usar o Serviço em Outro Lugar

```typescript
import { CreditReloadService } from './billing/credit-reload.service';

@Injectable()
export class MyService {
  constructor(private creditReload: CreditReloadService) {}

  async processAdView(userId: string, adType: string) {
    // Adiciona recompensa por anúncio
    await this.creditReload.addAdReward(userId, 10, adType);
  }

  async grantPromoBonus(userId: string) {
    // Adiciona bônus de boas-vindas
    await this.creditReload.addPromoBonus(
      userId,
      50,
      'Bônus de boas-vindas',
    );
  }
}
```

### 3. Usar em Guards/Decorators

```typescript
import { CreditReloadService } from './billing/credit-reload.service';

@Injectable()
export class CreditCheckGuard implements CanActivate {
  constructor(private creditReload: CreditReloadService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    const info = this.creditReload.getReloadInfo(user.id);
    
    if (info.user.availableCredits <= 0) {
      throw new ForbiddenException('Créditos insuficientes');
    }

    return true;
  }
}
```

---

## 🧪 Testes

### Teste 1: Reset Diário

```bash
# Criar usuário Free
POST /auth/register
{ "email": "test@example.com", "password": "123456", "planType": "free" }

# Verificar créditos iniciais
GET /credits/info

# Aguardar 00:00 UTC ou forçar reset
POST /credits/reload/force

# Verificar novo saldo
GET /credits/info
# esperado: availableCredits = 20
```

### Teste 2: Compra Manual

```bash
# Recarregar créditos manualmente
POST /credits/reload/manual
{ "amount": 100 }

# Verificar novo saldo
GET /credits/info
# esperado: availableCredits = 20 (daily) + 100 = 120
```

### Teste 3: Recompensa por Ad

```bash
# Registrar visualização de anúncio
POST /credits/reward/ad
{ "amount": 10, "adType": "rewarded" }

# Verificar novo saldo
GET /credits/info
# esperado: availableCredits += 10
```

---

## 🚀 Melhorias Futuras

- [ ] Integração com payment gateway (Stripe, Google Play)
- [ ] Sistema de referral com bônus
- [ ] Operações em lote (bulk reload)
- [ ] Dashboard de histórico detalhado
- [ ] Alertas de créditos baixos
- [ ] Estatísticas de uso
- [ ] Expiring credits (créditos com validade)
- [ ] Gifting de créditos entre usuários

---

## ❓ FAQ

**P: Como o reset diário funciona?**
R: Um agendador (scheduler) roda a cada dia às 00:00 UTC e recarrega todos os usuários Free com 20 créditos.

**P: E se o servidor cair durante o reset?**
R: Na próxima inicialização, o agendador recomeça e o reset é feito normalmente.

**P: Um usuário pode forçar múltiplos resets?**
R: Não, há validação de tempo. Free só permite 1x a cada 24h, Premium 1x a cada 1h.

**P: Os créditos expiram?**
R: Não (atual), mas há plano futuro para adicionar validade de créditos.

**P: Como adiciono bônus promocional?**
R: POST /credits/bonus/promo com { amount, reason }. Requer permissão admin.

---

## 📞 Suporte

Para dúvidas ou issues:
1. Consulte a documentação acima
2. Verifique os testes
3. Abra uma issue no repositório
