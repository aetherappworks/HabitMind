# 📊 Data Models — HabitMind AI

Documentação completa de todos os modelos de dados da aplicação.

---

## 🗄️ Modelos Prisma

### 1. **User**
Representa um usuário da plataforma.

```prisma
model User {
  id        String     @id @default(cuid())
  email     String     @unique
  name      String
  passwordHash String
  planType  String     @default("free")
  availableCredits Int @default(10)
  totalCredits     Int @default(10)
  lastCreditRefillAt DateTime?
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt

  // Relations
  habits    Habit[]
  aiInsights AIInsight[]
  adViews   AdView[]
}
```

**📋 Formato de IDs:**
> Todos os IDs utilizam **CUID** (Collision-resistant ID) em lugar de UUID. Formato: 24+ caracteres alfanuméricos (ex: `clw7g8h0000001np7b8b8b8b`)

**Campos:**
| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | String (CUID) | Identificador único (formato CUID) |
| `email` | String | Email único do usuário |
| `name` | String | Nome completo |
| `passwordHash` | String | Senha hash (bcrypt) |
| `planType` | String | Tipo de plano: `"free"` ou `"premium"` |
| `availableCredits` | Integer | Créditos disponíveis para usar (padrão: 10) |
| `totalCredits` | Integer | Total de créditos acumulados (histórico) |
| `lastCreditRefillAt` | DateTime? | Última data de reabastecimento de créditos |
| `createdAt` | DateTime | Data de criação |
| `updatedAt` | DateTime | Última atualização |

**Relações:**
- `habits` → Múltiplos hábitos do usuário
- `aiInsights` → Múltiplos insights gerados
- `adViews` → Múltiplas visualizações de anúncios

**💳 Sistema de Créditos:**
| Ação | Custo/Ganho | Limite |
|------|-------------|--------|
| Análise IA | -3 créditos | Por análise |
| Rewarded Video | +10 créditos | 20/dia (Free) |
| Interstitial Ad | +5 créditos | 10/dia (Free) |
| Banner Ad | +1 crédito | 50/dia (Free) |

---

### 2. **Habit**
Representa um hábito rastreável do usuário.

```prisma
model Habit {
  id            String     @id @default(cuid())
  userId        String
  user          User       @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  title         String
  description   String?
  frequency     String     // "daily" | "weekly" | "custom"
  preferredTime String?    // "07:00" format
  isActive      Boolean    @default(true)
  
  createdAt     DateTime   @default(now())
  updatedAt     DateTime   @updatedAt

  // Relations
  habitLogs     HabitLog[]
  aiInsights    AIInsight[]
}
```

**Campos:**
| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | String (CUID) | Identificador único |
| `userId` | String | FK para User |
| `title` | String | Nome do hábito (ex: "Morning Exercise") |
| `description` | String? | Descrição detalhada |
| `frequency` | String | Frequência: `"daily"`, `"weekly"` ou `"custom"` |
| `preferredTime` | String? | Hora preferida no formato HH:MM (ex: "07:00") |
| `isActive` | Boolean | Se o hábito está ativo |
| `createdAt` | DateTime | Data de criação |
| `updatedAt` | DateTime | Última atualização |

**Relações:**
- `user` → Usuário proprietário (obrigatório)
- `habitLogs` → Múltiplos registros de check-in
- `aiInsights` → Múltiplos insights relacionados

---

### 3. **HabitLog**
Representa um registro de check-in/conclusão de um hábito em uma data específica.

```prisma
model HabitLog {
  id        String     @id @default(cuid())
  habitId   String
  habit     Habit      @relation(fields: [habitId], references: [id], onDelete: Cascade)
  
  date      DateTime   @db.Date
  status    String     @default("pending")
  notes     String?
  
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt
}
```

**Campos:**
| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | String (CUID) | Identificador único |
| `habitId` | String | FK para Habit |
| `date` | DateTime | Data do check-in (YYYY-MM-DD) |
| `status` | String | Status: `"completed"`, `"pending"` ou `"skipped"` |
| `notes` | String? | Anotações do usuário |
| `createdAt` | DateTime | Data de criação do registro |
| `updatedAt` | DateTime | Última atualização |

**Relações:**
- `habit` → Hábito relacionado (obrigatório)

---

### 4. **AIInsight**
Representa um insight/análise gerada pela IA sobre um hábito ou usuário.

```prisma
model AIInsight {
  id              String     @id @default(cuid())
  userId          String
  user            User       @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  habitId         String?
  habit           Habit?     @relation(fields: [habitId], references: [id], onDelete: SetNull)
  
  type            String
  content         String     @db.Text
  confidenceScore Float      @default(0.8)
  
  createdAt       DateTime   @default(now())
  updatedAt       DateTime   @updatedAt
}
```

**Campos:**
| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | String (CUID) | Identificador único |
| `userId` | String | FK para User (obrigatório) |
| `habitId` | String? | FK para Habit (opcional) |
| `type` | String | Tipo de insight: `"pattern_analysis"`, `"time_suggestion"`, `"encouragement"` ou `"adjustment"` |
| `content` | String | Conteúdo do insight em texto |
| `confidenceScore` | Float | Confiança da análise (0.0 a 1.0) |
| `createdAt` | DateTime | Data de geração |
| `updatedAt` | DateTime | Última atualização |

**Relações:**
- `user` → Usuário proprietário (obrigatório)
- `habit` → Hábito relacionado (opcional)

---

## 📋 DTOs (Data Transfer Objects)

### Auth

#### RegisterDto
```typescript
{
  email: string;      // Email único
  name: string;       // Nome (mínimo 2 caracteres)
  password: string;   // Senha (mínimo 6 caracteres)
}
```

#### LoginDto
```typescript
{
  email: string;      // Email do usuário
  password: string;   // Senha
}
```

#### AuthResponseDto
```typescript
{
  accessToken: string;  // JWT token
  user: {
    id: string;
    email: string;
    name: string;
    planType: string;
  };
}
```

### Users

#### UpdateUserDto
```typescript
{
  name?: string;      // Novo nome (opcional)
  email?: string;     // Novo email (opcional)
}
```

#### UserResponseDto
```typescript
{
  id: string;
  email: string;
  name: string;
  planType: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Habits

#### CreateHabitDto
```typescript
{
  title: string;              // Nome do hábito (obrigatório)
  description?: string;       // Descrição (opcional)
  frequency: string;          // "daily" | "weekly" | "custom" (obrigatório)
  preferredTime?: string;     // "HH:MM" formato (opcional)
}
```

#### UpdateHabitDto
```typescript
{
  title?: string;
  description?: string;
  frequency?: string;
  preferredTime?: string;
}
```

#### HabitResponseDto
```typescript
{
  id: string;
  userId: string;
  title: string;
  description?: string;
  frequency: string;
  preferredTime?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### Check-ins

#### CreateCheckinDto
```typescript
{
  date: string;           // "YYYY-MM-DD" (obrigatório)
  status: string;         // "completed" | "pending" | "skipped" (obrigatório)
  notes?: string;         // Anotações (opcional)
}
```

#### HabitLogResponseDto
```typescript
{
  id: string;
  habitId: string;
  date: string;
  status: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### AI

#### AnalyzeHabitDto
```typescript
{
  habitId: string;          // UUID do hábito (obrigatório)
  type: string;             // Tipo de análise (obrigatório)
  context?: string;         // Contexto adicional (opcional)
}
```

Tipos válidos:
- `"pattern_analysis"` — Análise de padrões de conclusão
- `"time_suggestion"` — Sugestão de melhor horário
- `"encouragement"` — Mensagem de motivação
- `"adjustment"` — Sugestão de ajuste

#### AIInsightResponseDto
```typescript
{
  id: string;
  userId: string;
  habitId?: string;
  type: string;
  content: string;
  confidenceScore: number;  // 0.0 a 1.0
  createdAt: Date;
}
```

---

## 🔄 Relacionamentos

```
User (1) ──────→ (N) Habit
  │                   │
  ├─────────────┬─────┘
  │             │
  │          HabitLog
  │             │
  └─────────┬───┘
            │
        AIInsight
```

**Detalhes:**
- Um usuário pode ter múltiplos hábitos
- Um hábito tem múltiplos logs (check-ins)
- Um hábito pode ter múltiplos insights da IA
- Um usuário pode ter múltiplos insights gerais
- Ao deletar um usuário, todos seus hábitos e insights são deletados (CASCADE)
- Ao deletar um hábito, seus logs são deletados, mas insights ficam orfãos (SET NULL)

---

## 🔍 Índices

```
Habit:
  @@index([userId])    → Busca rápida de hábitos por usuário

HabitLog:
  @@index([habitId])   → Busca rápida de logs por hábito
  @@index([date])      → Busca rápida de logs por data

AIInsight:
  @@index([userId])    → Busca rápida de insights por usuário
  @@index([habitId])   → Busca rápida de insights por hábito
```

---

## 📝 Exemplos de Queries

### Criar um hábito
```javascript
const habit = await prisma.habit.create({
  data: {
    title: "Morning Exercise",
    description: "30 minutes of exercise",
    frequency: "daily",
    preferredTime: "07:00",
    userId: "user-id-123"
  }
});
```

### Listar hábitos de um usuário
```javascript
const habits = await prisma.habit.findMany({
  where: { userId: "user-id-123" },
  include: { habitLogs: true }
});
```

### Registrar um check-in
```javascript
const checkin = await prisma.habitLog.create({
  data: {
    habitId: "habit-id-123",
    date: new Date("2025-01-06"),
    status: "completed",
    notes: "Great workout!"
  }
});
```

### Gerar um insight
```javascript
const insight = await prisma.aIInsight.create({
  data: {
    userId: "user-id-123",
    habitId: "habit-id-123",
    type: "pattern_analysis",
    content: "Your completion rate is 85%",
    confidenceScore: 0.95
  }
});
```

---

## 🔐 Segurança

- **Passwords:** Hash com bcrypt (min 6 caracteres)
- **IDs:** Gerados com CUID (seguro)
- **Emails:** Únicos e validados
- **Cascade Delete:** Usuários deletados limpam dados relacionados
- **Timestamps:** Auditoria com createdAt e updatedAt
