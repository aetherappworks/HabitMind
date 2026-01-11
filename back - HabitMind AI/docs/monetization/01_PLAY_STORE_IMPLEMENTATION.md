# Implementação de Monetização - Google Play Store

## 📋 Visão Geral

Documento de planejamento para integração de **anúncios** e **assinatura** utilizando os recursos do Google Play Store no HabitMind AI backend.

**Data**: Janeiro 2026  
**Projeto**: HabitMind AI (Backend NestJS)  
**Escopo**: Integração com Google Play Billing e Google AdMob

---

## 🎯 Objetivos

- Implementar sistema de anúncios (Google AdMob)
- Implementar sistema de assinatura (Google Play Billing)
- Gerenciar créditos e acesso premium
- Validar transações no backend
- Implementar proteção contra fraude

---

## 📊 Arquitetura de Monetização

```
┌─────────────────────────────────────────┐
│       App Mobile (Play Store)           │
├─────────────────────────────────────────┤
│  • Google Play Billing SDK              │
│  • Google Mobile Ads SDK                │
│  • Validação de Anúncios                │
└────────────┬──────────────────┬─────────┘
             │                  │
      ┌──────▼──────┐    ┌──────▼──────┐
      │ Google Play  │    │ Google      │
      │ Billing API  │    │ AdMob API   │
      └──────┬──────┘    └──────┬──────┘
             │                  │
      ┌──────▼──────────────────▼──────┐
      │   Backend NestJS (HabitMind)   │
      ├────────────────────────────────┤
      │ • Validação de Compras         │
      │ • Gerencimento de Subscrição   │
      │ • Validação de Anúncios        │
      │ • Controle de Créditos         │
      │ • Proteção contra Fraude       │
      └──────────────────────────────┘
```

---

## 1️⃣ FASE 1: Anúncios (Google AdMob)

### 1.1 Planejamento de Anúncios

#### Tipos de Anúncios
- **Banner Ads**: Topo ou rodapé da app
- **Interstitial Ads**: Entre ações (ex: após completar hábito)
- **Rewarded Ads**: Usuário assiste anúncio para ganhar créditos

#### Estratégia de Implementação

**Backend - Endpoints necessários:**

```typescript
POST /ads/reward-completion
  - Validar conclusão de hábito
  - Registrar visualização de anúncio
  - Conceder créditos ao usuário

GET /ads/config
  - Retornar configuração de anúncios
  - Frequência de exibição
  - Tipos de anúncios ativos

POST /ads/validation/:adId
  - Validar token de anúncio assistido
  - Prevenir fraude
  - Conceder recompensa
```

### 1.2 Schema do Banco de Dados

```sql
-- Tabela de Anúncios Visualizados
CREATE TABLE ad_views (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  ad_type VARCHAR(50),
  ad_id VARCHAR(255),
  viewed_at TIMESTAMP,
  reward_claimed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_ad_views_user_id ON ad_views(user_id);
CREATE INDEX idx_ad_views_viewed_at ON ad_views(viewed_at);
```

### 1.3 Segurança contra Fraude

- **Validação de Token**: Verificar token do anúncio no AdMob
- **Rate Limiting**: Máximo de anúncios por dia (ex: 20 por dia)
- **Timestamp Validation**: Verificar timing realista
- **Device Fingerprinting**: Detectar comportamento anormal

### 1.4 Créditos por Anúncios

| Tipo de Anúncio | Créditos Ganhos | Limite Diário |
|---|---|---|
| Rewarded Ad | 10 créditos | 20 anúncios (200 créditos) |
| Banner View | 1 crédito | 50 views (50 créditos) |
| Interstitial | 5 créditos | 10 ads (50 créditos) |

---

## 2️⃣ FASE 2: Google Play Billing (Assinatura)

### 2.1 Planos de Assinatura

#### Planos Propostos

| Plano | Preço | Créditos/Mês | Benefícios | Renovação |
|---|---|---|---|---|
| **Free** | Grátis | 50 | Anúncios, limitações | - |
| **Basic** | R$ 9,90 | 500 | Sem anúncios, 1 AI advice/dia | Mensal |
| **Pro** | R$ 24,90 | 1500 | Tudo do Basic + 3 AI advice/dia | Mensal |
| **Premium** | R$ 49,90 | 3500 | Tudo do Pro + AI advice ilimitado | Mensal |
| **Annual** | R$ 99,90 | 5000 | Anual com desconto | Anual |

### 2.2 Fluxo de Compra

```
┌─────────────────────────────┐
│  Usuário clica em "Premium"  │
└──────────────┬──────────────┘
               │
┌──────────────▼──────────────┐
│ App abre Play Store Billing │
│ Google Show Purchase Dialog │
└──────────────┬──────────────┘
               │
        ┌──────┴──────┐
        │             │
    ┌───▼──┐     ┌────▼───┐
    │SUCCESS│    │CANCELED │
    └───┬───┘    └────┬────┘
        │             │
┌───────▼──────────────▼──────────┐
│  App envia Purchase Token para  │
│        Backend via API          │
└───────┬──────────────────────────┘
        │
┌───────▼──────────────────────────┐
│ Backend valida token com Google  │
│ Play API + Atualiza BD           │
└───────┬──────────────────────────┘
        │
┌───────▼──────────────────────────┐
│ Backend retorna confirmação      │
│ App atualiza status do usuário   │
└────────────────────────────────┘
```

### 2.3 Schema do Banco de Dados

```sql
-- Tabela de Subscrições
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  product_id VARCHAR(255) NOT NULL,
  purchase_token VARCHAR(500) NOT NULL,
  subscription_state VARCHAR(50), -- 'active', 'paused', 'expired'
  start_date TIMESTAMP NOT NULL,
  expiry_date TIMESTAMP,
  auto_renewal BOOLEAN DEFAULT TRUE,
  price_amount_micros BIGINT,
  currency_code VARCHAR(3),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Tabela de Histórico de Transações
CREATE TABLE transactions (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  subscription_id UUID REFERENCES subscriptions(id),
  transaction_type VARCHAR(50), -- 'subscription_purchase', 'renewal', 'cancellation'
  product_id VARCHAR(255),
  amount DECIMAL(10, 2),
  currency VARCHAR(3),
  status VARCHAR(50), -- 'pending', 'completed', 'failed'
  google_transaction_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de Usuários (adição de campos)
ALTER TABLE users ADD COLUMN subscription_tier VARCHAR(50) DEFAULT 'free';
ALTER TABLE users ADD COLUMN subscription_active BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN subscription_expires_at TIMESTAMP;

-- Índices
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_state ON subscriptions(subscription_state);
CREATE INDEX idx_subscriptions_expiry ON subscriptions(expiry_date);
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
```

### 2.4 Endpoints da API

#### Assinatura

```typescript
// Obter informações de assinatura do usuário
GET /billing/subscription
Response:
{
  "plan": "pro",
  "status": "active",
  "expiresAt": "2026-02-07T10:30:00Z",
  "autoRenewal": true,
  "credits": 1500,
  "creditsUsed": 450,
  "nextBillingDate": "2026-02-07"
}

// Listar planos disponíveis
GET /billing/plans
Response:
[
  {
    "id": "com.habitMind.basic",
    "name": "Basic",
    "price": "9.90",
    "currency": "BRL",
    "credits": 500,
    "benefits": [...]
  }
]

// Validar compra e ativar assinatura
POST /billing/purchase-verification
Body:
{
  "purchaseToken": "google_token_here",
  "productId": "com.habitMind.pro"
}
Response:
{
  "success": true,
  "subscription": {...}
}

// Cancelar assinatura
POST /billing/cancel-subscription
Response:
{
  "success": true,
  "message": "Subscription canceled"
}

// Obter histórico de transações
GET /billing/transactions
Response:
[
  {
    "id": "...",
    "type": "subscription_purchase",
    "plan": "pro",
    "amount": 24.90,
    "date": "2026-01-07T10:30:00Z",
    "status": "completed"
  }
]
```

### 2.5 Validação de Compra no Backend

**Processo:**
1. Receber `purchaseToken` do app
2. Validar com Google Play API
3. Verificar assinatura está ativa
4. Atualizar banco de dados
5. Gerenciar créditos

**Implementação:**

```typescript
// src/billing/billing.service.ts
export class BillingService {
  async verifyPurchase(purchaseToken: string, productId: string) {
    // 1. Chamar Google Play API
    const purchase = await this.googlePlayAPI.verify(purchaseToken, productId);
    
    // 2. Validar resposta
    if (purchase.purchaseState !== 'purchased') {
      throw new BadRequestException('Invalid purchase state');
    }
    
    // 3. Validar time-to-live
    if (Date.now() > purchase.expiryTime) {
      throw new BadRequestException('Purchase expired');
    }
    
    // 4. Atualizar banco de dados
    await this.updateSubscription(userId, productId, purchase);
    
    // 5. Registrar transação
    await this.logTransaction(userId, purchase);
    
    return { success: true, subscription: {...} };
  }
}
```

---

## 3️⃣ FASE 3: Sistema de Créditos

### 3.1 Modelo de Créditos

```sql
CREATE TABLE credits (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  amount INT NOT NULL,
  credit_type VARCHAR(50), -- 'subscription', 'ad_reward', 'promotional'
  reason VARCHAR(255),
  source_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP
);

CREATE TABLE credit_usage (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  amount INT NOT NULL,
  feature_used VARCHAR(100), -- 'ai_advice', 'habit_analysis', etc
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 3.2 Endpoints de Créditos

```typescript
// Obter saldo de créditos
GET /credits/balance
Response:
{
  "total": 1500,
  "available": 1200,
  "used": 300,
  "expiringToday": 0,
  "breakdown": {
    "subscription": 1500,
    "adRewards": 200,
    "promotional": 0
  }
}

// Histórico de créditos
GET /credits/history
Response:
{
  "transactions": [
    {
      "id": "...",
      "amount": 500,
      "type": "subscription",
      "reason": "Monthly subscription renewal",
      "date": "2026-01-07"
    }
  ]
}

// Usar créditos (interno)
POST /credits/deduct
Body:
{
  "amount": 10,
  "feature": "ai_advice"
}
```

---

## 4️⃣ FASE 4: Proteção contra Fraude

### 4.1 Mecanismos de Segurança

| Mecanismo | Implementação |
|---|---|
| **Token Validation** | Verificar com Google API |
| **Time-based TTL** | Tokens expiram em 1 hora |
| **Device Fingerprinting** | Correlacionar IP, User-Agent, Device ID |
| **Behavior Analysis** | Detectar padrões anormais |
| **Rate Limiting** | Máximo de requisições por minuto |
| **Signature Verification** | Validar assinatura digital do Google |

### 4.2 Implementação

```typescript
// src/billing/fraud-detection.service.ts
export class FraudDetectionService {
  async validatePurchase(userId: string, purchase: Purchase) {
    // 1. Validar assinatura Google
    const isValid = await this.verifyGoogleSignature(purchase);
    
    // 2. Verificar comportamento do usuário
    const recentPurchases = await this.getRecentPurchases(userId);
    if (recentPurchases.length > 3) {
      throw new FraudDetectedException('Too many recent purchases');
    }
    
    // 3. Análise de IP/Device
    const userProfile = await this.getUserProfile(userId);
    if (!this.isDeviceRecognized(userProfile)) {
      // Pode requerer verificação adicional
      await this.notifyFraudTeam(userId);
    }
    
    // 4. Validar timing
    if (!this.isRealisticTiming(purchase)) {
      throw new FraudDetectedException('Unrealistic timing detected');
    }
    
    return isValid;
  }
}
```

---

## 5️⃣ FASE 5: Integração Google Play API

### 5.1 Configuração

**Dependências NPM:**
```bash
npm install google-auth-library googleapis
```

**Service Account Setup:**
1. Ir para Google Cloud Console
2. Criar Service Account
3. Baixar chave JSON
4. Armazenar em variáveis de ambiente

**Variáveis de Ambiente:**
```env
GOOGLE_PLAY_PACKAGE_NAME=com.habitMind.app
GOOGLE_PLAY_SERVICE_ACCOUNT_EMAIL=...@iam.gserviceaccount.com
GOOGLE_PLAY_PRIVATE_KEY=...
GOOGLE_PLAY_PROJECT_ID=...
```

### 5.2 Implementação do Cliente Google Play

```typescript
// src/billing/google-play.service.ts
import { google } from 'googleapis';

export class GooglePlayService {
  private androidPublisherApi;

  constructor() {
    this.initializeAPI();
  }

  private async initializeAPI() {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_PLAY_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PLAY_PRIVATE_KEY,
        project_id: process.env.GOOGLE_PLAY_PROJECT_ID,
      },
      scopes: ['https://www.googleapis.com/auth/androidpublisher'],
    });

    this.androidPublisherApi = google.androidpublisher({
      version: 'v3',
      auth,
    });
  }

  async verifySubscription(packageName: string, subscriptionId: string, token: string) {
    return this.androidPublisherApi.monetization.subscriptions.userSubscriptions.get({
      packageName,
      subscriptionId,
      token,
    });
  }

  async verifyInAppPurchase(packageName: string, productId: string, token: string) {
    return this.androidPublisherApi.monetization.purchases.products.get({
      packageName,
      productId,
      token,
    });
  }
}
```

---

## 6️⃣ FASE 6: Webhooks e Notificações em Tempo Real

### 6.1 Google Play Billing Notifications

**Tipos de eventos:**
- `SUBSCRIPTION_RECOVERED` - Assinatura recuperada após falha
- `SUBSCRIPTION_RENEWED` - Renovação de assinatura
- `SUBSCRIPTION_CANCELED` - Cancelamento por usuário
- `SUBSCRIPTION_PAUSED` - Assinatura pausada
- `SUBSCRIPTION_IN_GRACE_PERIOD` - Período de graça
- `SUBSCRIPTION_RESTARTED` - Assinatura reiniciada

### 6.2 Implementação de Webhook

```typescript
// src/billing/google-play.controller.ts
@Controller('billing')
export class BillingController {
  @Post('webhook/google-play')
  async handleGooglePlayNotification(@Body() notification: any) {
    const message = JSON.parse(
      Buffer.from(notification.message.data, 'base64').toString()
    );

    const { packageName, subscriptionNotification } = message;
    
    switch (subscriptionNotification.notificationType) {
      case 1: // SUBSCRIPTION_RECOVERED
        await this.handleSubscriptionRecovered(subscriptionNotification);
        break;
      case 2: // SUBSCRIPTION_RENEWED
        await this.handleSubscriptionRenewed(subscriptionNotification);
        break;
      case 3: // SUBSCRIPTION_CANCELED
        await this.handleSubscriptionCanceled(subscriptionNotification);
        break;
      // ... outros casos
    }

    return { success: true };
  }
}
```

---

## 7️⃣ FASE 7: Dashboard e Relatórios

### 7.1 Endpoints de Analytics

```typescript
GET /billing/analytics/revenue
  - Receita total, por período
  - Receita por plano
  - Tendências

GET /billing/analytics/subscriptions
  - Total de assinantes
  - Churn rate
  - Taxa de conversão

GET /billing/analytics/ads
  - Impressões de anúncios
  - Cliques
  - Taxa de preenchimento
  - Receita estimada
```

### 7.2 Relatórios

- **Revenue Report**: Receita diária/mensal/anual
- **Churn Analysis**: Análise de cancelamentos
- **Conversion Funnel**: Funil de conversão free → paid
- **User Retention**: Taxa de retenção por coorte
- **LTV**: Lifetime value por usuário

---

## 📅 Cronograma de Implementação

### Sprint 1-2: Setup e Anúncios (2-3 semanas)
- [ ] Configurar Google AdMob
- [ ] Criar endpoints de validação de anúncios
- [ ] Implementar rate limiting de anúncios
- [ ] Criar schema de anúncios no BD
- [ ] Testes unitários

### Sprint 3-4: Google Play Billing (2-3 semanas)
- [ ] Setup Google Play API
- [ ] Implementar endpoints de assinatura
- [ ] Criar schema de subscrição
- [ ] Validação de compras
- [ ] Proteção contra fraude

### Sprint 5: Sistema de Créditos (1-2 semanas)
- [ ] Endpoints de créditos
- [ ] Lógica de debitação
- [ ] Histórico de créditos
- [ ] Expiração de créditos

### Sprint 6: Webhooks e Real-time (1 semana)
- [ ] Implementar webhook de Google Play
- [ ] Atualização de status em tempo real
- [ ] Notificações ao usuário

### Sprint 7: Dashboard (1-2 semanas)
- [ ] Analytics
- [ ] Relatórios
- [ ] Testes de carga

### Sprint 8: QA e Produção (1-2 semanas)
- [ ] Testes E2E
- [ ] Testes de segurança
- [ ] Documentação
- [ ] Deploy

---

## 🔐 Checklist de Segurança

- [ ] Validação de token com Google API
- [ ] Proteção CSRF
- [ ] Rate limiting implementado
- [ ] Verificação de assinatura digital
- [ ] Logging de transações
- [ ] Detecção de fraude ativa
- [ ] Variáveis de ambiente protegidas
- [ ] HTTPS obrigatório
- [ ] Auditoria de créditos
- [ ] Testes de penetração

---

## 📚 Recursos Necessários

### Documentação
- [Google Play Billing Library](https://developer.android.com/google/play/billing)
- [Google Play API Reference](https://developers.google.com/android-publisher)
- [Google AdMob Documentation](https://admob.google.com/home)

### Ferramentas
- Google Cloud Console
- Firebase Console
- Android Studio para testes

### Contas
- Google Play Developer Console
- Google AdMob
- Google Cloud Project

---

## 💡 Considerações Adicionais

### Testes com Google Play API
```bash
# Setup de teste
1. Usar conta de teste do Google Play
2. Instalar app em dispositivo de teste
3. Usar credenciais de teste
4. Validar fluxos sem gastar dinheiro real
```

### Fallback Strategies
- Sistema local de créditos se API Google cair
- Retry automático com backoff exponencial
- Cache de validações com TTL

### Compliance
- Estar atento aos termos do Google Play Store
- Implementar política de privacidade clara
- GDPR e LGPD compliance
- Reembolsos automáticos após expiração

---

## 📞 Contato e Suporte

Para dúvidas sobre implementação, consultar:
- Documentação do Google Play Developer
- Stack Overflow: tags `google-play-billing`
- Firebase Support

---

**Última atualização**: Janeiro 7, 2026  
**Status**: Planejamento Inicial
