# 🚀 Guia de Implementação - Sistema de Recarga de Créditos

## 📋 Checklist de Implementação

- [x] **Serviço de Recarga** (`credit-reload.service.ts`)
  - Lógica de reset automático diário (Free)
  - Lógica de reset automático horário (Premium)
  - Recargas manuais
  - Recompensas por ads
  - Bônus promocional
  - Histórico de recargas
  - Configurações personalizáveis

- [x] **DTOs** (`credit-reload.dto.ts`)
  - ManualReloadDto
  - AdRewardDto
  - PromoBonusDto
  - CreditConfigDto
  - Response DTOs

- [x] **Controller** (`credits.controller.ts`)
  - GET /credits/info
  - POST /credits/reload/manual
  - POST /credits/reload/force
  - POST /credits/reward/ad
  - POST /credits/bonus/promo
  - GET/POST /credits/config
  - POST /credits/user/:userId/bonus

- [x] **Módulo** (`billing.module.ts`)
  - Registrado no AppModule

- [x] **Documentação Completa**
  - Sistema overview
  - Arquitetura
  - Endpoints
  - Fluxos
  - Segurança
  - Exemplos práticos
  - Integração com frontend

---

## 📦 Estrutura de Arquivos

```
src/
├── billing/
│   ├── billing.module.ts                    ✅ NOVO
│   ├── credit-reload.service.ts             ✅ NOVO
│   ├── credits.controller.ts                ✅ NOVO
│   └── dto/
│       └── credit-reload.dto.ts             ✅ NOVO
│
├── app.module.ts                            ✅ ATUALIZADO (BillingModule adicionado)
│
└── ... (outros módulos)

docs/
├── billing/
│   ├── 01_CREDITS_SYSTEM.md                 ✅ EXISTENTE
│   ├── 02_RATE_LIMITING.md                  ✅ EXISTENTE
│   ├── 03_CREDIT_RELOAD_SYSTEM.md           ✅ NOVO
│   └── 04_CREDIT_RELOAD_EXAMPLES.md         ✅ NOVO
```

---

## 🔧 Passos de Implementação

### 1. Verificar Banco de Dados

Certifique-se que o schema Prisma tem os campos necessários:

```prisma
model User {
  id                 String     @id @default(cuid())
  email              String     @unique
  name               String
  passwordHash       String
  planType           String     @default("free")
  availableCredits   Int        @default(10)        ✅ NECESSÁRIO
  totalCredits       Int        @default(10)        ✅ NECESSÁRIO
  lastCreditRefillAt DateTime?                      ✅ NECESSÁRIO
  createdAt          DateTime   @default(now())
  updatedAt          DateTime   @updatedAt

  // ... relações
}
```

Se faltam campos, adicione a migração:

```bash
# Terminal
npx prisma migrate dev --name add_credit_fields
```

### 2. Registrar o Módulo

✅ **Já feito!** O `BillingModule` foi adicionado ao `AppModule`.

Verifique em [src/app.module.ts](../../src/app.module.ts):

```typescript
import { BillingModule } from './billing/billing.module';

@Module({
  imports: [
    // ... outros módulos
    BillingModule,  // ✅ Adicionado
  ],
})
export class AppModule {}
```

### 3. Importar Módulo em Serviços (Opcional)

Se outros serviços precisam usar o `CreditReloadService`:

```typescript
import { CreditReloadService } from './billing/credit-reload.service';

@Module({
  imports: [BillingModule], // Adicione se precisar usar
})
export class MyModule {}

@Injectable()
export class MyService {
  constructor(
    private creditReloadService: CreditReloadService,
  ) {}

  async myMethod() {
    await this.creditReloadService.addAdReward(userId, 10, 'rewarded');
  }
}
```

### 4. Usar em Ads Service (Integração)

No `src/ads/ads.service.ts`, integre com recompensas:

```typescript
import { CreditReloadService } from '../billing/credit-reload.service';

@Injectable()
export class AdService {
  constructor(
    private creditReloadService: CreditReloadService,
    // ... outros
  ) {}

  async recordAdView(userId: string, createAdViewDto: CreateAdViewDto) {
    // ... lógica existente

    // NOVO: Adicionar recompensa de créditos
    if (createAdViewDto.rewardClaimed) {
      const adConfig = await this.prisma.adConfig.findUnique({
        where: { adType: createAdViewDto.adType },
      });

      await this.creditReloadService.addAdReward(
        userId,
        adConfig.rewardAmount,
        createAdViewDto.adType,
      );
    }

    return adView;
  }
}
```

### 5. Testar Endpoints

#### Teste 1: Obter Informações

```bash
curl -X GET http://localhost:3000/credits/info \
  -H "Authorization: Bearer TOKEN_JWT"
```

#### Teste 2: Recarregar Manual

```bash
curl -X POST http://localhost:3000/credits/reload/manual \
  -H "Authorization: Bearer TOKEN_JWT" \
  -H "Content-Type: application/json" \
  -d '{"amount": 50}'
```

#### Teste 3: Forçar Recarga

```bash
curl -X POST http://localhost:3000/credits/reload/force \
  -H "Authorization: Bearer TOKEN_JWT"
```

---

## 🔄 Próximas Etapas (Opcional)

### 1. Adicionar Suporte a Admins

Implemente verificação de role em endpoints admin:

```typescript
// No controller
@Post('bonus/promo')
@UseGuards(JwtGuard, AdminGuard) // ✅ Adicionar AdminGuard
async addPromoBonus(
  @Request() req: any,
  @Body() promoBonusDto: PromoBonusDto,
) {
  // ...
}
```

### 2. Integração com Sistema de Pagamento

Conecte com Stripe/Google Play:

```typescript
@Injectable()
export class PaymentService {
  constructor(
    private creditReloadService: CreditReloadService,
    private stripe: StripeService,
  ) {}

  async handlePaymentSuccess(userId: string, amount: number) {
    await this.creditReloadService.reloadCreditsManual(
      userId,
      amount,
      'Compra via Stripe',
    );
  }
}
```

### 3. Dashboard de Admin

Criar endpoints para dashboard:

```typescript
// GET /admin/credits/stats
// GET /admin/credits/users/:userId/history
// POST /admin/credits/reset-all
// POST /admin/credits/configuration
```

### 4. Notificações de Créditos Baixos

Enviar email/push quando créditos acabam:

```typescript
// No guard ou service
if (user.availableCredits === 0) {
  await this.notificationService.sendLowCreditsAlert(userId);
}
```

### 5. Sistema de Expiring Credits

Adicionar validade:

```typescript
interface CreditReloadHistory {
  // ...
  expiresAt?: Date; // Data de expiração
}
```

---

## 🐛 Troubleshooting

### Erro: "Cannot find module './billing/billing.module'"

**Solução:** Certifique-se que os arquivos foram criados:
- `src/billing/billing.module.ts`
- `src/billing/credit-reload.service.ts`
- `src/billing/credits.controller.ts`
- `src/billing/dto/credit-reload.dto.ts`

### Erro: "PrismaService not found"

**Solução:** Importe `PrismaModule` no `BillingModule`:

```typescript
@Module({
  imports: [PrismaModule, I18nModule], // ✅ Necessário
  providers: [CreditReloadService],
  controllers: [CreditsController],
  exports: [CreditReloadService],
})
export class BillingModule {}
```

### Reset Não Executando

**Solução:** Verifique:
1. Servidor está rodando continuamente
2. Console mostra: `[DAILY RESET]` ou `[HOURLY RESET]`
3. Último `lastCreditRefillAt` foi atualizado

### Créditos Não Aparecem no Frontend

**Solução:**
1. Token JWT válido
2. User ID correto
3. Header `Accept-Language` configurado
4. Response status 200

---

## 📊 Métricas para Monitorar

- Total de recarga diária
- Distribuição por tipo (manual, ad, promo, reset)
- Taxa de conversão (users que compraram)
- Tempo médio para reset
- Erros de validação

---

## 🎯 Sucesso!

Quando você vê isso no console, o sistema está funcionando:

```
[DAILY RESET] 42 usuários Free receberam reset de créditos
[HOURLY RESET] 8 usuários Premium receberam reset de créditos
```

---

## 📞 Referências

- Documentação: [03_CREDIT_RELOAD_SYSTEM.md](./03_CREDIT_RELOAD_SYSTEM.md)
- Exemplos: [04_CREDIT_RELOAD_EXAMPLES.md](./04_CREDIT_RELOAD_EXAMPLES.md)
- API Reference: [../api/API_REFERENCE.md](../api/API_REFERENCE.md)
- Credits System: [01_CREDITS_SYSTEM.md](./01_CREDITS_SYSTEM.md)
