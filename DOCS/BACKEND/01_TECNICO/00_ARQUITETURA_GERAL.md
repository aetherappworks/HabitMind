# 🏗️ Arquitetura Geral - Backend HabitMind AI

## 📋 Visão Geral

O backend do HabitMind AI é construído com **NestJS**, um framework TypeScript robusto e escalável, usando **PostgreSQL** com **Prisma** como ORM, JWT para autenticação e implementa um sistema completo de monetização com créditos e anúncios.

## 🎯 Objetivos Arquiteturais

- **Modularidade**: Cada funcionalidade é um módulo independente
- **Reusabilidade**: Serviços compartilhados e Guards reutilizáveis
- **Segurança**: Autenticação JWT, validação de entrada, proteção de endpoints
- **Performance**: Índices no banco, queries otimizadas, paginação
- **Internacionalização**: Suporte multi-idioma em mensagens de erro/sucesso

## 📦 Estrutura de Módulos

```
src/
├── auth/                  # 🔐 Autenticação e Autorização
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── auth.module.ts
│   ├── jwt.strategy.ts
│   ├── jwt.guard.ts
│   └── dto/
│       └── auth.dto.ts
│
├── users/                 # 👤 Gerenciamento de Usuários
│   ├── users.controller.ts
│   ├── users.service.ts
│   ├── users.module.ts
│   └── dto/
│
├── habits/                # 🎯 Hábitos e Check-ins
│   ├── habits.controller.ts
│   ├── habits.service.ts
│   ├── habits.module.ts
│   └── dto/
│       ├── habit.dto.ts
│       └── checkin.dto.ts
│
├── ai/                    # 🤖 Análises e Insights com IA
│   ├── ai.controller.ts
│   ├── ai.service.ts
│   ├── ai.module.ts
│   └── dto/
│
├── billing/               # 💳 Sistema de Créditos
│   ├── credits.controller.ts
│   ├── credit-reload.service.ts
│   ├── billing.module.ts
│   └── dto/
│
├── ads/                   # 📺 Sistema de Monetização por Anúncios
│   ├── ads.controller.ts
│   ├── ads.service.ts
│   ├── ads.module.ts
│   └── dto/
│
├── i18n/                  # 🌍 Internacionalização
│   ├── i18n.module.ts
│   ├── i18n.service.ts
│   └── locales/
│       ├── pt-br.json
│       └── en.json
│
├── common/                # 🔧 Utilitários e Filtros
│   ├── exceptions/
│   ├── guards/
│   └── filters/
│
├── prisma/                # 💾 ORM e Banco de Dados
│   ├── prisma.service.ts
│   └── prisma.module.ts
│
├── app.module.ts          # Módulo raiz
├── app.controller.ts      # Controller raiz
├── app.service.ts         # Service raiz
└── main.ts                # Ponto de entrada
```

## 🗄️ Modelo de Dados

### Entidades Principais

```
User (Usuário)
├── id: CUID
├── email: unique
├── name: string
├── passwordHash: string (bcrypt)
├── planType: "free" | "premium"
├── availableCredits: int
├── totalCredits: int
├── createdAt: datetime
└── updatedAt: datetime

Habit (Hábito)
├── id: CUID
├── userId: FK → User
├── title: string
├── description?: string
├── frequency: "daily" | "weekly" | "custom"
├── preferredTime?: "HH:mm"
├── isActive: boolean
├── createdAt: datetime
└── updatedAt: datetime

HabitLog (Check-in)
├── id: CUID
├── habitId: FK → Habit
├── date: date
├── status: "completed" | "pending" | "skipped"
├── notes?: string
├── createdAt: datetime
└── updatedAt: datetime

AIInsight (Análise com IA)
├── id: CUID
├── userId: FK → User
├── habitId?: FK → Habit
├── type: "pattern_analysis" | "time_suggestion" | "encouragement" | "adjustment"
├── content: text
├── confidenceScore: float (0.0-1.0)
├── createdAt: datetime
└── updatedAt: datetime

AdView (Visualização de Anúncios)
├── id: CUID
├── userId: FK → User
├── adType: "banner" | "interstitial" | "rewarded"
├── adId: string
├── viewedAt: datetime
├── rewardClaimed: boolean
├── rewardAmount: int
├── validationToken?: string
├── createdAt: datetime
└── updatedAt: datetime

AdConfig (Configuração de Anúncios)
├── id: CUID
├── adType: unique ("banner" | "interstitial" | "rewarded")
├── isEnabled: boolean
├── rewardAmount: int
├── dailyLimit: int
├── createdAt: datetime
└── updatedAt: datetime
```

## 🔄 Fluxos de Dados Principais

### 1. Autenticação
```
Cliente
    ↓
POST /auth/login
    ↓
AuthService.login()
    ↓
Validar credenciais com bcrypt
    ↓
Gerar JWT token
    ↓
Retornar token + dados do usuário
    ↓
Cliente armazena token
```

### 2. Criar Hábito
```
Cliente (autenticado com JWT)
    ↓
POST /habits
    ↓
JwtAuthGuard valida token
    ↓
HabitsService.createHabit()
    ↓
Prisma cria registro em DB
    ↓
Retornar hábito criado
```

### 3. Completar Hábito com Anúncio
```
Cliente completa hábito
    ↓
POST /habits/:id/checkin
    ↓
Registra HabitLog como "completed"
    ↓
Cliente assiste anúncio
    ↓
POST /ads/view + adId
    ↓
Registra AdView
    ↓
POST /ads/reward-completion (com token de validação)
    ↓
AdService valida token
    ↓
Incrementa availableCredits do usuário
    ↓
Retorna créditos ganhos
```

### 4. Análise com IA
```
Usuario completa vários hábitos
    ↓
GET /ai/analysis/:habitId ou /ai/analysis
    ↓
AIService coleta dados (HabitLogs)
    ↓
Processa padrões e estatísticas
    ↓
Gera insights (se padrões detectados)
    ↓
Armazena AIInsight em DB
    ↓
Retorna análise ao cliente
```

## 🔐 Segurança

### Camadas de Autenticação

1. **JWT Bearer Token**: Todos os endpoints protegidos exigem `Authorization: Bearer <token>`
2. **JwtAuthGuard**: Guard NestJS que valida e extrai dados do token
3. **JwtStrategy**: Estratégia Passport que desserializa o token
4. **Bcrypt**: Hash seguro de senhas (rounds = 10)

### Validação

- DTOs com class-validator decorators
- Mensagens de erro seguem i18n
- Proteção contra SQL injection (Prisma)
- CORS configurável

## 📡 Padrões de API

### Convenções

- **Método HTTP**: GET, POST, PUT, DELETE
- **Base URL**: `/api` (configurável)
- **Versionamento**: Não implementado, consider para v2
- **Status Codes**:
  - `200`: OK
  - `201`: Created
  - `400`: Bad Request
  - `401`: Unauthorized
  - `403`: Forbidden
  - `404`: Not Found
  - `500`: Server Error

### Exemplo de Response

```json
{
  "success": true,
  "data": {
    "id": "cuid123",
    "email": "user@example.com",
    "name": "João Silva"
  },
  "message": "Success message or localized message"
}
```

## 🧵 Conceitos-Chave

### 1. CUID (Collision-resistant IDs)
- ID único composto de timestamp + hash aleatório
- Vantagens: Sortable, collision-resistant, sem dependência de banco
- Alternativa ao UUID v4

### 2. Soft Deletes vs Hard Deletes
- Atualmente: Hard deletes com `onDelete: Cascade`
- Considerar implementar soft deletes para auditoria
- Adicionar campo `deletedAt?: DateTime`

### 3. Rate Limiting
- Sistema de créditos implementa limite de uso
- Limite diário de anúncios por tipo
- Rate limiting por IP pode ser adicionado

### 4. Índices de Performance
- `@@index([userId])`: Queries rápidas por usuário
- `@@index([habitId])`: Queries rápidas por hábito
- `@@index([viewedAt])`: Queries por data de visualização
- `@@index([adType])`: Queries por tipo de anúncio

## 🚀 Stack Tecnológico

| Tecnologia | Versão | Propósito |
|------------|--------|----------|
| Node.js | 18+ | Runtime JavaScript |
| NestJS | ^10.2.10 | Framework backend |
| TypeScript | ^5.3.3 | Tipagem estática |
| PostgreSQL | 14+ | Banco de dados |
| Prisma | ^5.7.0 | ORM |
| JWT | ^11.0.1 | Autenticação |
| Passport | ^0.7.0 | Estratégia de autenticação |
| Bcrypt | ^5.1.1 | Hash de senhas |
| Axios | ^3.0.0 | Cliente HTTP (integrações futuras) |
| Swagger | ^7.1.13 | Documentação de API |

## 📊 Diagrama de Dependências de Módulos

```
AppModule
├── AuthModule (dependente: PrismaModule)
├── UsersModule (dependente: PrismaModule, i18nModule)
├── HabitsModule (dependente: PrismaModule, i18nModule, AuthModule)
├── AIModule (dependente: PrismaModule, HabitsModule)
├── BillingModule (dependente: PrismaModule, i18nModule, UsersModule)
├── AdsModule (dependente: PrismaModule, BillingModule, i18nModule, UsersModule)
├── I18nModule
└── PrismaModule
```

## 🔄 Ciclo de Vida de Request

```
1. Middleware de parsing (JSON, CORS, etc)
2. Pipes de transformação (ValidationPipe)
3. Guards (JwtAuthGuard)
4. Interceptadores
5. Controller method
6. Service (lógica de negócio)
7. Prisma (acesso a dados)
8. Response formatação
9. Serialização
```

## 📝 Próximos Passos para Escalabilidade

1. **Caching**: Redis para sesões e dados frequentes
2. **Queue**: Bull para processos assíncronos (notificações, análises IA)
3. **Logging**: Winston para logs estruturados
4. **Monitoring**: Prometheus + Grafana
5. **Testing**: Cobertura completa com Jest
6. **CI/CD**: GitHub Actions ou similar
7. **Containerização**: Docker otimizado
8. **Versionamento de API**: Estratégia v1, v2, etc.

---

**Última atualização**: Janeiro 2026
