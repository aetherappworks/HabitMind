# 📚 HabitMind AI — Documentação Completa

Bem-vindo! Aqui está toda a documentação do projeto HabitMind AI **atualizada** com campos reais, endpoints e status atual.

---

## 🆕 O que há de novo?

✅ Documentação de modelos de dados completa ([03_DATA_MODELS.md](../architecture/03_DATA_MODELS.md))  
✅ Todos os endpoints documentados com exemplos ([API_REFERENCE.md](../api/API_REFERENCE.md))  
✅ DTOs e campos validados conforme código real  
✅ Fluxos de arquitetura detalhados  
✅ Stack técnico atualizado  
✅ Features de i18n documentadas  

---

---

## 📂 Estrutura de Documentação

### 📋 [Planning](../planning/)
**Planejamento e roadmap do projeto**
- [02_PRD.md](../planning/02_PRD.md) — Product Requirements Document
- [04_CRONOGRAMA.md](../planning/04_CRONOGRAMA.md) — Cronograma de fases (0-6)
- [03_MONETIZATION.md](../planning/03_MONETIZATION.md) — Estratégia de monetização
- [01_PHASE_0_CHECKLIST.md](../planning/01_PHASE_0_CHECKLIST.md) — Checklist da Phase 0

### 🚀 [Setup](../setup/)
**Como começar rápido**
- [01_QUICK_START.md](../setup/01_QUICK_START.md) — 5 minutos para rodar a aplicação
- [02_SETUP_COMPLETE.md](../setup/02_SETUP_COMPLETE.md) — Setup detalhado completo

### 🏗️ [Architecture](../architecture/)
**Estrutura técnica e implementação**
- [00_ARCHITECTURE.md](../architecture/00_ARCHITECTURE.md) — Estrutura de módulos, models e fluxos
- **[03_DATA_MODELS.md](../architecture/03_DATA_MODELS.md) — ⭐ Documentação completa de modelos (User, Habit, HabitLog, AIInsight) com todos os campos**
- [02_BACKEND_SETUP.md](../architecture/02_BACKEND_SETUP.md) — Setup técnico do backend
- [01_IMPLEMENTATION.md](../architecture/01_IMPLEMENTATION.md) — Detalhes de implementação

### 🔌 [API](../api/)
**Referência de endpoints**
- **[API_REFERENCE.md](../api/API_REFERENCE.md) — ⭐ Documentação completa de TODOS os endpoints com exemplos, campos e erros**

### 💻 [Frontend](../frontend/)
**Guias para integração do frontend**
- [01_FRONTEND_GUIDE.md](../frontend/01_FRONTEND_GUIDE.md) — Guia completo de integração (tipos, hooks, exemplos)
- [02_DELIVERABLES.md](../frontend/02_DELIVERABLES.md) — O que foi entregue

### 🔧 [Implementation](../implementation/)
**Detalhes de implementação**
- [00_SUMMARY.md](../implementation/00_SUMMARY.md) — Sumário executivo
- [I18N_STATUS.md](../implementation/I18N_STATUS.md) — Status de internacionalização
- [01_I18N_CHECKLIST.md](../implementation/01_I18N_CHECKLIST.md) — Checklist passo-a-passo

### 💳 [Billing](../billing/)
**Sistema de monetização e rate limiting**
- [01_CREDITS_SYSTEM.md](../billing/01_CREDITS_SYSTEM.md) — Sistema de créditos por plano
- [02_RATE_LIMITING.md](../billing/02_RATE_LIMITING.md) — Implementação de rate limit

---

## 🎯 Guias Rápidos por Perfil

### 👨‍💼 Para Product Managers
1. Ler [02_PRD.md](../planning/02_PRD.md) — Entender o produto
2. Ler [04_CRONOGRAMA.md](../planning/04_CRONOGRAMA.md) — Ver roadmap
3. Ler [03_MONETIZATION.md](../planning/03_MONETIZATION.md) — Estratégia de monetização

### 👨‍💻 Para Desenvolvedores Backend
1. Ler [01_QUICK_START.md](../setup/01_QUICK_START.md) — Setup inicial
2. Ler [00_ARCHITECTURE.md](../architecture/00_ARCHITECTURE.md) — Entender estrutura
3. **Ler [03_DATA_MODELS.md](../architecture/03_DATA_MODELS.md) — Modelos de dados com campos**
4. **Ler [API_REFERENCE.md](../api/API_REFERENCE.md) — Endpoints e campos da API**

### 👨‍💻 Para Desenvolvedores Frontend
1. Ler [01_QUICK_START.md](../setup/01_QUICK_START.md) — Setup inicial
2. Ler [01_FRONTEND_GUIDE.md](../frontend/01_FRONTEND_GUIDE.md) — Integração completa
3. **Ler [API_REFERENCE.md](../api/API_REFERENCE.md) — Endpoints com exemplos e tipos**
4. **Ler [03_DATA_MODELS.md](../architecture/03_DATA_MODELS.md) — Estrutura de dados**

### 🚀 Para DevOps/Cloud
1. Ler [02_SETUP_COMPLETE.md](../setup/02_SETUP_COMPLETE.md) — Setup completo
2. Ler [00_ARCHITECTURE.md](../architecture/00_ARCHITECTURE.md) — Arquitetura
3. Buscar Dockerfile e docker-compose.yml no root

---

## 📊 Status do Projeto

| Phase | Status | Descrição |
|-------|--------|-----------|
| **Phase 0** | ✅ Completo | Backend MVP: Auth, CRUD de hábitos, Check-ins, IA (MVP), i18n |
| **Phase 1** | ⏳ Pendente | Testes (unit, integration, E2E) - Target 80% coverage |
| **Phase 2** | ⏳ Pendente | IA Avançada (OpenAI integration + análises reais) |
| **Phase 3** | ⏳ Pendente | Arquitetura Profissional (Events, Cache, Queue) |
| **Phase 4** | ⏳ Pendente | Qualidade & Testes (80%+ coverage garantido) |
| **Phase 5** | ⏳ Pendente | Cloud & DevOps (CI/CD) |
| **Phase 6** | ⏳ Pendente | Escala & Monetização (Rate limiting, Planos) |

---

## 🔑 Features Implementadas

### ✅ Autenticação
- ✅ Registro de usuários (`POST /auth/register`)
- ✅ Login com JWT (`POST /auth/login`)
- ✅ Proteção de rotas (`JwtAuthGuard`)
- ✅ Hash de senhas com bcrypt
- ✅ Renovação de tokens

### ✅ Gerenciamento de Usuários
- ✅ Obter perfil (`GET /users/me`)
- ✅ Atualizar perfil (`PUT /users/me`)
- ✅ Obter créditos (`GET /users/credits`) 💳
- ✅ Tipos de plano (free, premium)
- ✅ Sistema de créditos para análise IA

### ✅ Gerenciamento de Hábitos
- ✅ Criar hábito (`POST /habits`) - com título, descrição, frequência, horário
- ✅ Listar hábitos (`GET /habits`)
- ✅ Obter um hábito (`GET /habits/:id`)
- ✅ Atualizar hábito (`PUT /habits/:id`)
- ✅ Deletar hábito (`DELETE /habits/:id`) - soft delete
- ✅ Frequências: daily, weekly, custom

### ✅ Check-ins (Rastreamento)
- ✅ Registrar check-in (`POST /habits/:id/checkins`)
- ✅ Status: completed, pending, skipped
- ✅ Anotações por check-in
- ✅ Listar check-ins (`GET /habits/:id/checkins`)
- ✅ Buscar por período (`GET /habits/:id/checkins/range`)
- ✅ Histórico completo com índices

### ✅ IA (MVP)
- ✅ Análise de padrões de conclusão
- ✅ Sugestão de horário
- ✅ Mensagens de encorajamento
- ✅ Sugestões de ajuste
- ✅ Confidence score por insight
- ✅ Gerar insights (`POST /ai/analyze`)
- ✅ Listar insights (`GET /ai/insights`)

### ✅ Internacionalização (i18n)
- ✅ Suporte a PT-BR (padrão)
- ✅ Suporte a EN-US
- ✅ Suporte a ES-ES
- ✅ Query param `lang` em todos endpoints
- ✅ Mensagens traduzidas

### ✅ Documentação
- ✅ Swagger API Docs (`/api/docs`)
- ✅ Documentação de modelos
- ✅ Guias de integração
- ✅ Exemplos de código
- ✅ Referência de endpoints

---

## 📈 Stack Técnico

| Camada | Tecnologia |
|--------|-----------|
| **Runtime** | Node.js 18+ |
| **Framework** | NestJS 10+ |
| **Linguagem** | TypeScript |
| **ORM** | Prisma 5+ |
| **Banco** | PostgreSQL 14+ |
| **Auth** | JWT + Passport.js |
| **Validação** | class-validator + class-transformer |
| **Docs** | Swagger/OpenAPI 3.0 |
| **Container** | Docker + docker-compose |
| **SCM** | Git |

---

## 📝 Estrutura de Campos por Entidade

### User
| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | String (CUID) | Identificador único |
| `email` | String | Email único |
| `name` | String | Nome do usuário |
| `passwordHash` | String | Hash bcrypt da senha |
| `planType` | String | "free" ou "premium" |
| `createdAt` | DateTime | Data de criação |
| `updatedAt` | DateTime | Última atualização |

### Habit
| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | String (CUID) | Identificador único |
| `userId` | String | Proprietário (FK) |
| `title` | String | Nome do hábito |
| `description` | String | Descrição (opcional) |
| `frequency` | String | "daily", "weekly" ou "custom" |
| `preferredTime` | String | Horário HH:MM (opcional) |
| `isActive` | Boolean | Se está ativo |
| `createdAt` | DateTime | Data de criação |
| `updatedAt` | DateTime | Última atualização |

### HabitLog (Check-in)
| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | String (CUID) | Identificador único |
| `habitId` | String | Qual hábito (FK) |
| `date` | DateTime | Data YYYY-MM-DD |
| `status` | String | "completed", "pending" ou "skipped" |
| `notes` | String | Anotações (opcional) |
| `createdAt` | DateTime | Data de criação |
| `updatedAt` | DateTime | Última atualização |

### AIInsight
| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | String (CUID) | Identificador único |
| `userId` | String | Proprietário (FK) |
| `habitId` | String | Hábito analisado (FK, opcional) |
| `type` | String | pattern_analysis, time_suggestion, encouragement, adjustment |
| `content` | String | Texto do insight |
| `confidenceScore` | Float | 0.0 a 1.0 |
| `createdAt` | DateTime | Data de geração |
| `updatedAt` | DateTime | Última atualização |

---

## ��� Começando

### Instalação Rápida
```bash
# 1. Clone o repositório
git clone <repo-url>
cd "HabitMind AI"

# 2. Instale as dependências
npm install

# 3. Configure banco de dados
cp .env.example .env
# Edite .env com suas credenciais PostgreSQL

# 4. Rode migrations
npx prisma migrate dev

# 5. Inicie o servidor
npm run start:dev
```

### Testes da API
```bash
# Health check
curl http://localhost:3000/health

# Swagger UI (documentação interativa)
open http://localhost:3000/api/docs

# Registrar novo usuário
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Test User","password":"password123"}'
```

---

## ��� Principais Endpoints

| Método | Endpoint | Autenticação |
|--------|----------|--------------|
| `POST` | `/auth/register` | Não |
| `POST` | `/auth/login` | Não |
| `GET` | `/users/me` | JWT |
| `PUT` | `/users/me` | JWT |
| `POST` | `/habits` | JWT |
| `GET` | `/habits` | JWT |
| `GET` | `/habits/:id` | JWT |
| `PUT` | `/habits/:id` | JWT |
| `DELETE` | `/habits/:id` | JWT |
| `POST` | `/habits/:id/checkins` | JWT |
| `GET` | `/habits/:id/checkins` | JWT |
| `GET` | `/habits/:id/checkins/range` | JWT |
| `POST` | `/ai/analyze` | JWT |
| `GET` | `/ai/insights` | JWT |

**➡️ Veja [API_REFERENCE.md](../api/API_REFERENCE.md) para documentação completa com exemplos.**

---

## ��� FAQ

**P: Por onde começo?**  
R: Leia [01_QUICK_START.md](../setup/01_QUICK_START.md) — setup de 5 minutos.

**P: Como integro o frontend?**  
R: Siga [01_FRONTEND_GUIDE.md](../frontend/01_FRONTEND_GUIDE.md).

**P: Onde estão os campos/dados?**  
R: [03_DATA_MODELS.md](../architecture/03_DATA_MODELS.md) para modelos e [API_REFERENCE.md](../api/API_REFERENCE.md) para exemplos.

**P: Qual banco de dados?**  
R: PostgreSQL com Prisma ORM. Modelos em [03_DATA_MODELS.md](../architecture/03_DATA_MODELS.md).

**P: Como testar?**  
R: Swagger em `http://localhost:3000/api/docs`.

---

**Última Atualização:** 7 de Janeiro de 2026  
**Versão:** 1.0.0 | **Status:** ✅ Production Ready
