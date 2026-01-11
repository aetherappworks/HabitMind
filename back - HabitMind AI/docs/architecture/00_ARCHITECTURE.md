# HabitMind AI — Project Structure

## 📂 Estrutura de Diretórios

```
HabitMind AI/
├── src/
│   ├── auth/
│   │   ├── dto/
│   │   │   └── auth.dto.ts          # DTOs: RegisterDto, LoginDto
│   │   ├── auth.controller.ts       # Controllers: register, login
│   │   ├── auth.service.ts          # Services: register, login, validateUser
│   │   ├── jwt.guard.ts             # JWT Auth Guard
│   │   ├── jwt.strategy.ts          # Passport JWT Strategy
│   │   └── auth.module.ts           # Auth Module
│   │
│   ├── users/
│   │   ├── dto/
│   │   │   └── user.dto.ts          # DTOs: UpdateUserDto, UserResponseDto
│   │   ├── users.controller.ts      # Controllers: getProfile, updateProfile
│   │   ├── users.service.ts         # Services: getProfile, updateProfile
│   │   └── users.module.ts          # Users Module
│   │
│   ├── habits/
│   │   ├── dto/
│   │   │   ├── habit.dto.ts         # DTOs: CreateHabitDto, UpdateHabitDto
│   │   │   └── checkin.dto.ts       # DTOs: CreateCheckinDto, HabitLogResponseDto
│   │   ├── habits.controller.ts     # Controllers: CRUD habits + check-ins
│   │   ├── habits.service.ts        # Services: CRUD habits + check-ins
│   │   └── habits.module.ts         # Habits Module
│   │
│   ├── ai/
│   │   ├── dto/
│   │   │   └── ai.dto.ts            # DTOs: AnalyzeHabitDto, AIInsightResponseDto
│   │   ├── ai.controller.ts         # Controllers: analyzeHabit, getInsights
│   │   ├── ai.service.ts            # Services: analyzeHabit, getInsights
│   │   └── ai.module.ts             # AI Module
│   │
│   ├── prisma/
│   │   ├── prisma.service.ts        # Prisma Service (ORM)
│   │   └── prisma.module.ts         # Prisma Module
│   │
│   ├── app.controller.ts            # Health check
│   ├── app.service.ts               # Health check service
│   ├── app.module.ts                # Root module (importa todos os módulos)
│   └── main.ts                      # Entry point (bootstrap)
│
├── prisma/
│   ├── schema.prisma                # Schema do banco de dados
│   └── migrations/                  # Histórico de migrations
│
├── dist/                            # Compilado (gerado)
├── node_modules/                    # Dependências
│
├── package.json                     # Configuração npm
├── tsconfig.json                    # Configuração TypeScript
├── nest-cli.json                    # Configuração NestJS CLI
├── .eslintrc.js                     # Configuração ESLint
├── .prettierrc                      # Configuração Prettier
│
├── Dockerfile                       # Configuração Docker
├── docker-compose.yml               # Orquestração Docker
│
├── .env                            # Variáveis de ambiente (local)
├── .env.example                    # Template de variáveis
├── .gitignore                      # Arquivos ignorados no Git
│
├── PRD.md                          # Product Requirements Document
├── README.md                       # Visão do Produto
├── README_CRONOGRAMA.md            # Cronograma de Desenvolvimento
├── README_BACKEND.md               # Documentação Técnica do Backend
└── QUICK_START.md                  # Guia de Início Rápido
```

---

## 🏗️ Arquitetura de Camadas

```
Controller (HTTP)
    ↓ (Requisição)
    ↓
ValidationPipe (DTO Validation)
    ↓ (Dados validados)
    ↓
Service (Lógica de negócio)
    ↓
Prisma ORM (Acesso a dados)
    ↓
PostgreSQL (Persistência)
    ↑ (Dados)
    ↑
Response
    ↑ (HTTP 200/201/400/401...)
```

---

## 📦 Módulos

### 1. Auth Module
**Responsabilidade:** Autenticação e autorização

```
auth.controller.ts
  ├── POST /auth/register
  └── POST /auth/login

auth.service.ts
  ├── register(registerDto)
  ├── login(loginDto)
  └── validateUser(userId)

jwt.strategy.ts
  └── Valida JWT em requisições

jwt.guard.ts
  └── @UseGuards(JwtAuthGuard) para proteger rotas
```

### 2. Users Module
**Responsabilidade:** Gerenciamento de perfil de usuário e créditos

```
users.controller.ts
  ├── GET /users/me
  ├── PUT /users/me
  └── GET /users/credits          (novo)

users.service.ts
  ├── getProfile(userId)
  ├── updateProfile(userId, updateUserDto)
  └── getCredits(userId)           (novo)
```

### 3. Habits Module
**Responsabilidade:** CRUD de hábitos e check-ins

```
habits.controller.ts
  ├── POST   /habits              (criar)
  ├── GET    /habits              (listar)
  ├── GET    /habits/:id          (obter um)
  ├── PUT    /habits/:id          (atualizar)
  ├── DELETE /habits/:id          (deletar)
  │
  ├── POST   /habits/:id/checkins         (criar check-in)
  ├── GET    /habits/:id/checkins        (listar check-ins)
  └── GET    /habits/:id/checkins/range  (por período)

habits.service.ts
  ├── createHabit(userId, createHabitDto)
  ├── getHabits(userId)
  ├── getHabit(habitId, userId)
  ├── updateHabit(habitId, userId, updateHabitDto)
  ├── deleteHabit(habitId, userId)
  │
  ├── createCheckin(habitId, userId, createCheckinDto)
  ├── getCheckins(habitId, userId)
  └── getCheckinsByDateRange(habitId, userId, startDate, endDate)
```

### 4. AI Module
**Responsabilidade:** Análise com IA e insights

```
ai.controller.ts
  ├── POST /ai/analyze            (gerar insights)
  └── GET  /ai/insights           (listar insights)

ai.service.ts
  ├── analyzeHabit(userId, analyzeHabitDto)
  ├── getInsights(userId, habitId?)
  └── generateInsight(habit, logs, type) [privado]
```

### 5. Prisma Module
**Responsabilidade:** Acesso ao banco de dados

```
prisma.service.ts
  ├── Estende PrismaClient
  ├── onModuleInit()      → $connect()
  └── onModuleDestroy()   → $disconnect()

prisma.module.ts
  └── Exporta PrismaService para usar em outros módulos
```

---

## 🔐 Fluxo de Autenticação

```
1. POST /auth/register
   ↓
   auth.service.register()
   ├── Hash password com bcrypt
   ├── Criar usuário no DB (plano "free" por padrão)
   └── Gerar JWT token
   ↓
   Retorna: { accessToken, user }

2. POST /auth/login
   ↓
   auth.service.login()
   ├── Verificar email existe
   ├── Validar password com bcrypt
   └── Gerar JWT token
   ↓
   Retorna: { accessToken, user }

3. GET /users/me (com JWT)
   ↓
   JwtAuthGuard valida token
   ├── Extrai userId do payload
   └── Passa para controller
   ↓
   Retorna: UserResponseDto (perfil completo)
```

---

## 🔄 Fluxo de Hábitos

```
1. POST /habits (criar hábito)
   ↓
   HabitsService.createHabit()
   ├── Validar dados com DTO
   ├── Criar record no Prisma
   └── Retornar HabitResponseDto
   
2. GET /habits (listar)
   ↓
   HabitsService.getHabits()
   ├── Buscar todos do userId
   └── Retornar [HabitResponseDto]
   
3. POST /habits/:id/checkins (registrar conclusão)
   ↓
   HabitsService.createCheckin()
   ├── Validar habitId pertence a user
   ├── Criar HabitLog no DB
   └── Retornar HabitLogResponseDto
   
4. GET /habits/:id/checkins/range (buscar por período)
   ↓
   HabitsService.getCheckinsByDateRange()
   ├── Validar startDate e endDate
   ├── Buscar logs entre datas
   └── Retornar [HabitLogResponseDto]
```

---

## 🤖 Fluxo de Análise com IA

```
1. POST /ai/analyze (gerar insight)
   ↓
   AiService.analyzeHabit()
   ├── Validar habitId pertence a user
   ├── Buscar últimos 30 logs do hábito
   ├── Gerar insight baseado em padrões
   ├── Salvar AIInsight no DB
   └── Retornar AIInsightResponseDto
   
2. GET /ai/insights (listar insights)
   ↓
   AiService.getInsights()
   ├── Se habitId fornecido, filtrar por hábito
   ├── Ordenar por data (mais recente primeiro)
   └── Retornar [AIInsightResponseDto]
```

---

## 📦 Tipos de Insights de IA

| Tipo | Descrição | Calculus |
|------|-----------|---------|
| `pattern_analysis` | Análise de padrões de conclusão | Taxa de conclusão nos últimos 30 dias |
| `time_suggestion` | Sugestão de melhor horário | Baseado em horários de sucesso |
| `encouragement` | Mensagem motivacional | Aleatório com base em progresso |
| `adjustment` | Sugestão de ajuste | Baseado em quedas de performance |

---

## 🗄️ Índices e Performance

### Índices Criados
```prisma
Habit:
  @@index([userId])      # Busca rápida de hábitos por usuário

HabitLog:
  @@index([habitId])     # Busca rápida de logs por hábito
  @@index([date])        # Busca rápida de logs por período

AIInsight:
  @@index([userId])      # Busca rápida de insights por usuário
  @@index([habitId])     # Busca rápida de insights por hábito
```

### Queries Otimizadas
- Listagem de hábitos: O(1) com índice em userId
- Busca por período: O(log n) com índice em date
- Relacionamentos: Inclusos apenas quando necessário

---

## 🔄 Fluxo de Dados Completo

```
Frontend (React/Vue)
    ↓
    ↓ HTTP Request (com JWT)
    ↓
  API Gateway / Load Balancer
    ↓
    ↓ Request
    ↓
NestJS Controller
    ├─ JwtAuthGuard (valida token)
    ├─ ValidationPipe (DTO validation)
    └─ Request Handler
    ↓
NestJS Service
    ├─ Lógica de negócio
    ├─ Regras de validação
    └─ Orquestração
    ↓
Prisma ORM
    ├─ Query building
    ├─ Type safety
    └─ Relationship management
    ↓
PostgreSQL Database
    ├─ ACID transactions
    ├─ Índices
    └─ Persistência
    ↑
    ↑ Response
    ↑
NestJS Service (retorna DTO)
    ↑
NestJS Controller (retorna HTTP)
    ↑
Frontend (renderiza resultado)
```

---

## 🧪 Middleware Stack

```
1. Logger Middleware
   └─ Registra todas as requisições

2. JwtAuthGuard (seletivo)
   └─ Valida JWT nos endpoints protegidos

3. ValidationPipe (global)
   └─ Valida DTOs automaticamente

4. ExceptionFilter (global)
   └─ Padroniza respostas de erro
```

---

## 📋 Status Atual da Implementação

| Componente | Status | Notas |
|-----------|--------|-------|
| **Auth** | ✅ Completo | Register, Login, JWT |
| **Users** | ✅ Completo | CRUD de perfil |
| **Habits** | ✅ Completo | CRUD + check-ins |
| **AI** | ⏳ MVP | Insights simulados (sem OpenAI) |
| **I18N** | ✅ Completo | Suporte a PT-BR, EN-US, ES-ES |
| **Database** | ✅ Completo | PostgreSQL + Prisma |
| **API Docs** | ✅ Swagger | `/api/docs` |
| **Rate Limiting** | ⏳ Planejado | Phase 6 |
| **Testes** | ⏳ Planejado | Phase 1 |

---

## 🚀 Próximas Fases

### Phase 1: Testes
- Unit tests (Services)
- Integration tests (Controllers)
- E2E tests (Endpoints completos)
- Target: 80%+ coverage

### Phase 2: IA Avançada
- Integração com OpenAI
- Análises contextuais reais
- Recomendações personalizadas

### Phase 3: Arquitetura Profissional
- Eventos (Event Driven)
- Cache layer (Redis)
- Message queue (RabbitMQ)

### Phase 4-6: Qualidade, DevOps e Escala
- CI/CD pipeline
- Cloud deployment
- Monetização e rate limiting

2. Requisição com Bearer Token
   ↓
   jwt.guard.ts valida o token
   ├── Extrai token do header
   ├── Verifica assinatura
   └── Chama validate() do jwt.strategy.ts
   ↓
   Se válido: @Request() req.user = user
   Se inválido: 401 Unauthorized
```

---

## 🗄️ Modelo de Dados

### User
```typescript
{
  id: string (cuid)              // Primary Key
  email: string (unique)
  name: string
  passwordHash: string
  planType: "free" | "premium"
  createdAt: datetime
  updatedAt: datetime
  
  // Relations
  habits: Habit[]
  aiInsights: AIInsight[]
}
```

### Habit
```typescript
{
  id: string (cuid)              // Primary Key
  userId: string (FK)            // Foreign Key → User.id
  title: string
  description: string?
  frequency: "daily" | "weekly" | "custom"
  preferredTime: string? (HH:MM)
  isActive: boolean (default: true)
  createdAt: datetime
  updatedAt: datetime
  
  // Relations
  habitLogs: HabitLog[]
  aiInsights: AIInsight[]
}
```

### HabitLog (Check-in)
```typescript
{
  id: string (cuid)              // Primary Key
  habitId: string (FK)           // Foreign Key → Habit.id
  date: date
  status: "completed" | "pending" | "skipped"
  notes: string?
  createdAt: datetime
  updatedAt: datetime
}
```

### AIInsight
```typescript
{
  id: string (cuid)              // Primary Key
  userId: string (FK)            // Foreign Key → User.id
  habitId: string? (FK)          // Foreign Key → Habit.id (nullable)
  type: "pattern_analysis" | "time_suggestion" | "encouragement" | "adjustment"
  content: string (Text)
  confidenceScore: float (0.0 - 1.0)
  createdAt: datetime
  updatedAt: datetime
}
```

---

## 🔄 Fluxo de Requisição

### Exemplo: POST /habits (criar hábito)

```
1. HTTP Request chega ao Controller
   ├── URL: POST /habits
   ├── Header: Authorization: Bearer <token>
   └── Body: { title, description, frequency, preferredTime }

2. JwtAuthGuard valida o token
   ├── Extrai token do header
   └── @Request() req.user.id = userId

3. ValidationPipe valida o DTO
   ├── title: required, string
   ├── description: optional, string
   ├── frequency: required, enum
   └── preferredTime: optional, formato HH:MM

4. habits.controller.createHabit()
   └── Chama habits.service.createHabit(userId, dto)

5. habits.service.createHabit()
   ├── Valida dados de negócio
   └── Chama prisma.habit.create()

6. Prisma ORM
   ├── Prepara INSERT SQL
   └── Executa no PostgreSQL

7. Resposta retorna
   ├── Status: 201 Created
   ├── Header: Content-Type: application/json
   └── Body: { id, userId, title, ... }
```

---

## 🔗 Relacionamentos

### User → Habits (1:N)
```
Um usuário tem muitos hábitos
Um hábito pertence a um usuário
```

### Habit → HabitLogs (1:N)
```
Um hábito tem muitos check-ins
Um check-in pertence a um hábito
```

### User → AIInsights (1:N)
```
Um usuário tem muitos insights
Um insight pertence a um usuário
```

### Habit → AIInsights (1:N, opcional)
```
Um hábito pode ter muitos insights
Um insight pode pertencer a um hábito (ou ser genérico para o usuário)
```

---

## 📊 Índices no Banco

Para otimizar queries:

```
users:
  ├── email (unique)
  
habits:
  ├── userId (index)
  └── isActive (index)
  
habit_logs:
  ├── habitId (index)
  └── date (index)
  
ai_insights:
  ├── userId (index)
  └── habitId (index)
```

---

## 🚀 Deployment (Fases Futuras)

- **Fase 5:** Docker + CI/CD
- **Fase 6:** Cloud (AWS, GCP, Vercel)
- **Fase 6:** Rate Limiting, Caching
- **Fase 6:** Monitoring e Logs

---

## 📝 Convenções

### Nomenclatura
- **Controllers:** `*.controller.ts`
- **Services:** `*.service.ts`
- **DTOs:** `*.dto.ts`
- **Modules:** `*.module.ts`
- **Guards:** `*.guard.ts`
- **Strategies:** `*.strategy.ts`

### Estrutura de Pasta por Módulo
```
feature/
├── dto/
│   └── *.dto.ts
├── feature.controller.ts
├── feature.service.ts
└── feature.module.ts
```

---

## 🔍 Debugging

### Console Logs
```typescript
// auth.service.ts
console.log('User registered:', user.email);
```

### Prisma Studio (GUI do BD)
```bash
npm run prisma:studio
# Abre http://localhost:5555
```

### Network Tab (Browser DevTools)
- Inspecionar requisições HTTP
- Ver headers e body
- Verificar erros 4xx/5xx

---

Última atualização: **Janeiro 2026**
