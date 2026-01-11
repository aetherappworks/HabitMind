# 📦 Módulos do Backend - Documentação Técnica

## 📑 Índice de Módulos

1. [Auth Module](#auth-module)
2. [Users Module](#users-module)
3. [Habits Module](#habits-module)
4. [AI Module](#ai-module)
5. [Billing Module](#billing-module)
6. [Ads Module](#ads-module)
7. [I18n Module](#i18n-module)
8. [Prisma Module](#prisma-module)
9. [Common Module](#common-module)

---

## 🔐 Auth Module

### Responsabilidade
Gerencia autenticação de usuários, geração de JWT tokens e validação de credenciais.

### Arquivo Principal
```
src/auth/
├── auth.controller.ts      # Endpoints de login/register
├── auth.service.ts         # Lógica de autenticação
├── auth.module.ts          # Configuração do módulo
├── jwt.strategy.ts         # Estratégia Passport JWT
├── jwt.guard.ts            # Guard para proteger rotas
└── dto/
    └── auth.dto.ts         # Data Transfer Objects
```

### Endpoints

#### POST `/auth/register`
```typescript
Request:
{
  "email": "user@example.com",
  "password": "SecurePassword123",
  "name": "João Silva"
}

Response (201):
{
  "id": "cuid123",
  "email": "user@example.com",
  "name": "João Silva",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "availableCredits": 10,
  "totalCredits": 10
}
```

#### POST `/auth/login`
```typescript
Request:
{
  "email": "user@example.com",
  "password": "SecurePassword123"
}

Response (200):
{
  "id": "cuid123",
  "email": "user@example.com",
  "name": "João Silva",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "availableCredits": 10,
  "totalCredits": 10
}
```

### Fluxo de Autenticação

```
1. Usuário faz POST /auth/login
   ↓
2. AuthService.login() valida email/senha
   ↓
3. Bcrypt compara password com passwordHash
   ↓
4. Se válido, JwtService gera token
   ↓
5. Token enviado ao cliente
   ↓
6. Cliente armazena token em secure storage
   ↓
7. Em próximas requisições, envia: Authorization: Bearer <token>
   ↓
8. JwtAuthGuard intercepta request
   ↓
9. JwtStrategy desserializa token
   ↓
10. request.user preenchido com dados do usuário
```

### Tecnologias Utilizadas

- **@nestjs/jwt**: Geração e validação de JWT
- **@nestjs/passport**: Integração com Passport
- **passport-jwt**: Estratégia JWT
- **bcrypt**: Hash seguro de senhas

### Segurança

- Senhas nunca são retornadas em responses
- Hashes bcrypt com 10 rounds (default)
- JWT com expiração (padrão: 24h)
- Token armazenado em Secure Storage no frontend

---

## 👤 Users Module

### Responsabilidade
Gerencia dados de usuários, perfil e configurações.

### Endpoints

#### GET `/users/me`
Obter dados do usuário autenticado.

```typescript
Headers: {
  "Authorization": "Bearer <token>"
}

Response (200):
{
  "id": "cuid123",
  "email": "user@example.com",
  "name": "João Silva",
  "planType": "free",
  "availableCredits": 10,
  "totalCredits": 10,
  "createdAt": "2024-01-10T10:30:00Z",
  "updatedAt": "2024-01-10T10:30:00Z"
}
```

#### PUT `/users/me`
Atualizar dados do usuário.

```typescript
Request:
{
  "name": "João Silva Novo",
  "email": "newemail@example.com"
}

Response (200):
{ ...dados atualizados... }
```

#### PUT `/users/me/password`
Atualizar senha do usuário.

```typescript
Request:
{
  "currentPassword": "OldPassword123",
  "newPassword": "NewPassword456",
  "confirmPassword": "NewPassword456"
}

Response (200):
{
  "success": true,
  "message": "Password updated successfully"
}
```

---

## 🎯 Habits Module

### Responsabilidade
Gerencia criação, edição, listagem e exclusão de hábitos. Também registra check-ins (completamento de hábitos).

### Sub-módulos

#### 1. Habits Service
Operações CRUD em hábitos:
- `createHabit()`: Criar novo hábito
- `getHabits()`: Listar hábitos do usuário
- `getHabit()`: Obter detalhes de um hábito
- `updateHabit()`: Editar hábito
- `deleteHabit()`: Deletar hábito

#### 2. Checkins Service
Operações com check-ins (registros diários):
- `createCheckin()`: Registrar completion de hábito
- `getCheckins()`: Listar check-ins de um hábito
- `getStreaks()`: Calcular sequências de dias consecutivos
- `getStatistics()`: Calcular taxa de conclusão

### Endpoints

#### POST `/habits`
Criar novo hábito.

```typescript
Request:
{
  "title": "Beber 2L de água",
  "description": "Manter hidratação durante o dia",
  "frequency": "daily",
  "preferredTime": "07:00"
}

Response (201):
{
  "id": "cuid456",
  "userId": "cuid123",
  "title": "Beber 2L de água",
  "description": "Manter hidratação durante o dia",
  "frequency": "daily",
  "preferredTime": "07:00",
  "isActive": true,
  "createdAt": "2024-01-10T15:30:00Z",
  "updatedAt": "2024-01-10T15:30:00Z"
}
```

#### GET `/habits`
Listar todos os hábitos do usuário.

```typescript
Response (200):
[
  {
    "id": "cuid456",
    "title": "Beber 2L de água",
    "frequency": "daily",
    "isActive": true,
    "completionToday": true,
    "streak": 7,
    "completionRate": 0.85
  },
  ...
]
```

#### GET `/habits/:id`
Obter detalhes completos de um hábito.

```typescript
Response (200):
{
  "id": "cuid456",
  "title": "Beber 2L de água",
  "description": "...",
  "frequency": "daily",
  "preferredTime": "07:00",
  "isActive": true,
  "createdAt": "2024-01-10T15:30:00Z",
  "stats": {
    "totalCompletions": 42,
    "currentStreak": 7,
    "completionRate": 0.85,
    "longestStreak": 12
  }
}
```

#### PUT `/habits/:id`
Editar hábito existente.

```typescript
Request:
{
  "title": "Beber 2.5L de água",
  "preferredTime": "08:00"
}

Response (200):
{ ...hábito atualizado... }
```

#### DELETE `/habits/:id`
Deletar hábito.

```typescript
Response (200):
{
  "success": true,
  "message": "Habit deleted successfully"
}
```

#### POST `/habits/:id/checkin`
Registrar conclusão de hábito hoje.

```typescript
Request:
{
  "status": "completed",
  "notes": "Completado no horário"
}

Response (201):
{
  "id": "logcuid789",
  "habitId": "cuid456",
  "date": "2024-01-10",
  "status": "completed",
  "notes": "Completado no horário",
  "createdAt": "2024-01-10T20:30:00Z"
}
```

#### GET `/habits/:id/stats`
Obter estatísticas do hábito.

```typescript
Response (200):
{
  "habitId": "cuid456",
  "totalDays": 50,
  "completedDays": 42,
  "completionRate": 0.84,
  "currentStreak": 7,
  "longestStreak": 12,
  "averageCompletionTime": "07:15",
  "lastCompletion": "2024-01-10T19:45:00Z"
}
```

---

## 🤖 AI Module

### Responsabilidade
Análise de padrões de hábitos, geração de insights e recomendações personalizadas.

### Features

1. **Pattern Analysis**: Detecta padrões de sucesso/falha
2. **Time Suggestion**: Recomenda melhores horários
3. **Encouragement**: Mensagens motivacionais personalizadas
4. **Adjustment**: Sugestões para ajustar hábitos

### Endpoints

#### GET `/ai/analysis/:habitId`
Análise de um hábito específico.

```typescript
Response (200):
{
  "habitId": "cuid456",
  "insights": [
    {
      "type": "pattern_analysis",
      "content": "Você completa esse hábito 85% das vezes. Melhor desempenho entre 7-8 AM.",
      "confidenceScore": 0.92,
      "createdAt": "2024-01-10T10:00:00Z"
    },
    {
      "type": "time_suggestion",
      "content": "Recomendamos mover o hábito para 7 AM, quando você tem 90% de taxa de conclusão.",
      "confidenceScore": 0.88,
      "createdAt": "2024-01-10T10:00:00Z"
    },
    {
      "type": "encouragement",
      "content": "Parabéns! Você manteve essa sequência por 7 dias seguidos. Continue assim!",
      "confidenceScore": 0.95,
      "createdAt": "2024-01-10T10:00:00Z"
    }
  ]
}
```

#### GET `/ai/analysis`
Análise de todos os hábitos do usuário (overview).

```typescript
Response (200):
{
  "overallScore": 0.82,
  "habitCount": 5,
  "avgCompletionRate": 0.82,
  "insights": [
    ...insights gerais...
  ]
}
```

### Algoritmo de Análise

```typescript
Para cada hábito:
  1. Coleta últimos 30 dias de HabitLogs
  2. Calcula estatísticas (taxa, streak, horários)
  3. Detecta padrões (dia da semana, horário, etc)
  4. Gera insights baseado em regras de negócio
  5. Atribui confidence score (0.0-1.0)
  6. Armazena em AIInsight table
  7. Retorna ao usuário
```

---

## 💳 Billing Module

### Responsabilidade
Gerenciar créditos do usuário, recarga de créditos e histórico de transações.

### Tipos de Créditos

1. **Créditos Ganhos**: Completando hábitos com anúncios
2. **Créditos Comprados**: Via play store (future)
3. **Créditos Promocionais**: Bonus no registro

### Endpoints

#### GET `/billing/credits`
Obter saldo atual de créditos.

```typescript
Response (200):
{
  "availableCredits": 25,
  "totalCredits": 50,
  "earnings": {
    "today": 5,
    "thisWeek": 20,
    "thisMonth": 50
  }
}
```

#### POST `/billing/credits/reload`
Recarregar créditos (via IAP ou outros métodos).

```typescript
Request:
{
  "packageId": "credits_100",
  "transactionId": "com.android.123.456"
}

Response (201):
{
  "success": true,
  "creditsAdded": 100,
  "newTotal": 150,
  "transactionId": "com.android.123.456"
}
```

#### GET `/billing/history`
Obter histórico de transações de créditos.

```typescript
Response (200):
{
  "transactions": [
    {
      "id": "trans123",
      "type": "earned",
      "amount": 10,
      "reason": "Completed habit: Beber água",
      "timestamp": "2024-01-10T19:45:00Z"
    },
    {
      "id": "trans124",
      "type": "purchased",
      "amount": 100,
      "reason": "IAP Package: credits_100",
      "timestamp": "2024-01-10T15:30:00Z"
    }
  ],
  "total": 110
}
```

### Regras de Negócio

- Novo usuário recebe 10 créditos de bônus
- Máximo 5 créditos por dia completando hábitos
- Máximo 3 anúncios recompensados por dia
- Créditos não expiram

---

## 📺 Ads Module

### Responsabilidade
Gerenciar visualizações de anúncios, validação de tokens e concessão de recompensas.

### Tipos de Anúncios

1. **Banner**: Anúncios em banner (sem recompensa imediata)
2. **Interstitial**: Tela inteira entre ações (sem recompensa)
3. **Rewarded**: Anúncio com recompensa em créditos

### Endpoints

#### POST `/ads/view`
Registrar visualização de anúncio.

```typescript
Request:
{
  "adType": "rewarded",
  "adId": "google_ad_123",
  "adUnitId": "/6499/example/banner"
}

Response (201):
{
  "id": "adview789",
  "adType": "rewarded",
  "adId": "google_ad_123",
  "validationToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "rewardAmount": 5,
  "expiresAt": "2024-01-10T22:30:00Z"
}
```

#### POST `/ads/reward-completion`
Validar visualização e conceder recompensa.

```typescript
Request:
{
  "habitId": "cuid456",
  "validationToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "adViewId": "adview789"
}

Response (200):
{
  "success": true,
  "creditsGranted": 5,
  "newBalance": 30,
  "message": "Reward granted successfully"
}
```

#### GET `/ads/config`
Obter configuração de anúncios disponíveis.

```typescript
Response (200):
{
  "configs": [
    {
      "adType": "rewarded",
      "isEnabled": true,
      "rewardAmount": 5,
      "dailyLimit": 3
    },
    {
      "adType": "interstitial",
      "isEnabled": true,
      "rewardAmount": 0,
      "dailyLimit": -1
    }
  ]
}
```

#### GET `/ads/stats`
Obter estatísticas de anúncios visualizados.

```typescript
Response (200):
{
  "totalAdsViewed": 45,
  "totalRewardsEarned": 180,
  "thisMonth": {
    "adsViewed": 12,
    "rewardsEarned": 45
  },
  "today": {
    "adsViewed": 2,
    "rewardsEarned": 10
  }
}
```

### Fluxo de Validação de Anúncios

```
1. Cliente toca em "Watch Ad" no app
   ↓
2. Cliente exibe anúncio usando Google Mobile Ads SDK
   ↓
3. Usuário assiste anúncio completamente
   ↓
4. Anúncio chama callback de recompensa
   ↓
5. Cliente faz POST /ads/view
   ↓
6. Backend registra AdView e gera validationToken
   ↓
7. Cliente recebe validationToken com TTL
   ↓
8. Cliente faz POST /ads/reward-completion com token
   ↓
9. Backend valida token (não expirado, não duplicado)
   ↓
10. Backend incrementa créditos do usuário
   ↓
11. Backend retorna novo saldo
```

---

## 🌍 I18n Module

### Responsabilidade
Gerenciar internacionalização de mensagens de erro, sucesso e outros textos.

### Idiomas Suportados

- **pt-br**: Português Brasileiro
- **en**: English

### Estrutura de Locales

```
src/i18n/locales/
├── pt-br.json
└── en.json
```

### Exemplo de Locale

```json
{
  "auth": {
    "invalid_credentials": "Email ou senha inválidos",
    "user_already_exists": "Usuário com este email já existe",
    "password_too_weak": "Senha deve ter pelo menos 8 caracteres"
  },
  "habits": {
    "habit_created": "Hábito criado com sucesso",
    "habit_not_found": "Hábito não encontrado"
  },
  "credits": {
    "insufficient_credits": "Créditos insuficientes",
    "credit_limit_reached": "Limite diário de créditos atingido"
  }
}
```

### Uso em Serviços

```typescript
// Em um service
async login(loginDto: LoginDto, lang: string) {
  const user = await this.prisma.user.findUnique({
    where: { email: loginDto.email }
  });
  
  if (!user) {
    throw new BadRequestException(
      this.i18nService.t('auth.invalid_credentials', { lang })
    );
  }
}
```

---

## 💾 Prisma Module

### Responsabilidade
Gerenciar conexão com banco de dados e instância do Prisma Client.

### Configuração

```typescript
// prisma.service.ts
import { Injectable, OnModuleInit, INestApplication } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
}
```

### Uso

```typescript
// Injetar PrismaService em um service
constructor(private prisma: PrismaService) {}

async getUser(id: string) {
  return this.prisma.user.findUnique({
    where: { id }
  });
}
```

### Migrations

```bash
# Criar nova migration (após alterar schema.prisma)
npx prisma migrate dev --name nome_da_migration

# Ver status das migrations
npx prisma migrate status

# Resetar banco (desenvolvimento apenas)
npx prisma migrate reset
```

---

## 🔧 Common Module

### Responsabilidade
Utilitários, decoradores, Guards, Filters e Pipes compartilhados entre módulos.

### Componentes

1. **Guards**:
   - `JwtAuthGuard`: Validar autenticação JWT
   - (Futuros: Role-based, Rate limiting)

2. **Filters**:
   - `AllExceptionsFilter`: Tratamento global de exceções

3. **Pipes**:
   - `ValidationPipe`: Validar DTOs

4. **Interceptors**:
   - (Futuros: Logging, Transformation)

5. **Decorators**:
   - `@CurrentUser()`: Extrair usuário do request

---

## 📊 Relações entre Módulos

```
┌─────────────────────────────────────────┐
│         AppModule (Raiz)                │
└─────────────────────────────────────────┘
            ↓
┌─────────────────────────────────────────┐
│  PrismaModule (Gerenciar DB)            │
└─────────────────────────────────────────┘
            ↓
┌─────────────────────────────────────────┐
│  I18nModule, CommonModule               │
└─────────────────────────────────────────┘
            ↓
┌──────────┬─────────────┬──────────┬─────┐
│ AuthMod. │ UsersMod.   │ HabitsMod│ AIMod│
└──────────┴─────────────┴──────────┴─────┘
            ↓
      ┌─────────────┬─────────────┐
      │ BillingMod. │ AdsModule   │
      └─────────────┴─────────────┘
```

---

**Última atualização**: Janeiro 2026
