# Rate Limit - Validação de Monetização

## 📋 Implementação do Limite de Requisições por Plano

A partir da implementação atual, **o plano free possui limite de requisições** para APIs de IA e análise, enquanto **o plano premium tem limites mais altos**.

---

## 🎯 Limites Implementados

### Plano Free
- **50 requisições/hora** para endpoints de IA
- Endpoints afetados:
  - `POST /ai/analyze` — Análise de hábitos
  - `GET /ai/insights` — Obtenção de insights

### Plano Premium
- **500 requisições/hora** para endpoints de IA
- Acesso total sem restrições de quantidade

---

## 🔧 Arquivos Criados

### 1. **RateLimitService** — `src/common/services/rate-limit.service.ts`

Serviço que gerencia os contadores de requisições em memória:

```typescript
// Exemplo de uso:
const isAllowed = this.rateLimitService.isAllowed(userId, 'free');

// Informações de limite:
const info = this.rateLimitService.getLimitInfo(userId, 'free');
// Retorna: { limit: 50, used: 25, remaining: 25, resetTime: Date }
```

**Funcionalidades:**
- `isAllowed(userId, planType)` — Valida se usuário pode fazer requisição
- `getLimitInfo(userId, planType)` — Retorna informações de limite
- `reset(userId)` — Reseta limite manualmente
- Limpeza automática de trackers expirados

---

### 2. **RateLimitGuard** — `src/common/guards/rate-limit.guard.ts`

Guard do NestJS que protege endpoints:

```typescript
// Adicionar ao controller:
@UseGuards(JwtAuthGuard, RateLimitGuard)
@Post('analyze')
async analyzeHabit(@Request() req) {
  // Requisição é automaticamente validada
}
```

**O que faz:**
- Verifica se usuário excedeu limite
- Retorna `403 Forbidden` com mensagem clara
- Adiciona headers na resposta:
  - `X-RateLimit-Limit` — Limite total
  - `X-RateLimit-Used` — Requisições usadas
  - `X-RateLimit-Remaining` — Requisições restantes
  - `X-RateLimit-Reset` — Data de reset

---

### 3. **CommonModule** — `src/common/common.module.ts`

Módulo que exporta `RateLimitService`:

```typescript
@Module({
  imports: [ConfigModule],
  providers: [RateLimitService],
  exports: [RateLimitService],
})
export class CommonModule {}
```

---

## ⚙️ Configuração (`.env`)

```env
# Janela de tempo em ms (padrão: 1 hora = 3600000)
RATE_LIMIT_WINDOW_MS=3600000

# Limite de requisições para plano free (padrão: 50/hora)
RATE_LIMIT_FREE_REQUESTS=50

# Limite de requisições para plano premium (padrão: 500/hora)
RATE_LIMIT_PREMIUM_REQUESTS=500
```

---

## 🧪 Exemplo de Resposta

### ✅ Requisição Permitida

```bash
curl -X POST http://localhost:3000/ai/analyze \
  -H "Authorization: Bearer JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"habitId":"123","metrics":"completion_rate"}'
```

**Response:**
```json
{
  "id": "insight-123",
  "habitId": "123",
  "insight": "Você tem 85% mais chance de concluir às 7h15.",
  "type": "pattern_analysis",
  "confidence": 0.85
}
```

**Headers:**
```
X-RateLimit-Limit: 50
X-RateLimit-Used: 1
X-RateLimit-Remaining: 49
X-RateLimit-Reset: 2026-01-06T14:00:00.000Z
```

### ❌ Limite Excedido

```json
{
  "statusCode": 403,
  "message": "Rate limit exceeded. Limit: 50 requests/hour. Resets at: 2026-01-06T14:00:00.000Z",
  "error": "Forbidden"
}
```

---

## 📊 Aplicação nos Controllers

### AI Controller

Já aplicado em `src/ai/ai.controller.ts`:

```typescript
@UseGuards(JwtAuthGuard, RateLimitGuard)
@Controller('ai')
export class AiController {
  @Post('analyze')
  @UseGuards(JwtAuthGuard, RateLimitGuard)
  async analyzeHabit(@Request() req, @Body() dto: AnalyzeHabitDto) {
    // Limite é automaticamente validado
  }
}
```

---

## 🚀 Próximos Passos

- [ ] Aplicar RateLimitGuard em outros endpoints (habits, check-ins)
- [ ] Integrar com banco de dados para persistência entre reinicializações
- [ ] Criar endpoint de upgrade de plano
- [ ] Adicionar métricas de uso por usuário
- [ ] Implementar notificações quando próximo do limite

---

## 📝 Resumo

| Aspecto | Free | Premium |
|--------|------|---------|
| **Limite de IA/hora** | 50 | 500 |
| **Reset** | A cada hora | A cada hora |
| **Headers de Info** | ✅ Sim | ✅ Sim |
| **Erro 403** | ✅ Sim | ❌ Raramente |

