# HabitMind AI — Backend API (NestJS)

**HabitMind AI** é uma plataforma SaaS de gestão de hábitos com Inteligência Artificial. Este é o backend construído com **NestJS**, **PostgreSQL** e **Prisma**.

---

## 🎯 Objetivo

Fornecer uma API robusta, escalável e bem documentada para gerenciar hábitos de usuários, com suporte a insights inteligentes gerados por IA.

---

## 🏗️ Arquitetura

### Stack Tecnológico

- **Framework:** NestJS 10+
- **Banco de Dados:** PostgreSQL 16
- **ORM:** Prisma
- **Autenticação:** JWT + Passport
- **Validação:** class-validator, class-transformer
- **Documentação:** Swagger/OpenAPI
- **Containerização:** Docker & Docker Compose

### Estrutura de Módulos

```
src/
├── auth/              # Autenticação (JWT, Passport)
├── users/             # Gerenciamento de usuários
├── habits/            # CRUD de hábitos e check-ins
├── ai/                # Análise com IA
├── prisma/            # Integração com banco de dados
├── app.module.ts      # Módulo raiz
├── app.controller.ts
├── app.service.ts
└── main.ts            # Entry point
```

---

## 📋 Modelo de Dados

### User
- `id` (PK)
- `email` (unique)
- `name`
- `passwordHash`
- `planType` (free | premium)
- `createdAt`, `updatedAt`

### Habit
- `id` (PK)
- `userId` (FK)
- `title`
- `description`
- `frequency` (daily | weekly | custom)
- `preferredTime` (HH:MM)
- `isActive`
- `createdAt`, `updatedAt`

### HabitLog (Check-in)
- `id` (PK)
- `habitId` (FK)
- `date`
- `status` (completed | pending | skipped)
- `notes`
- `createdAt`, `updatedAt`

### AIInsight
- `id` (PK)
- `userId` (FK)
- `habitId` (FK, nullable)
- `type` (pattern_analysis | time_suggestion | encouragement | adjustment)
- `content`
- `confidenceScore`
- `createdAt`, `updatedAt`

---

## 🚀 Quick Start

### Pré-requisitos

- Node.js 18+
- npm ou yarn
- Docker & Docker Compose (opcional)
- PostgreSQL 16+ (se não usar Docker)

### Instalação Local

1. **Clonar repositório**
   ```bash
   git clone <repository-url>
   cd HabitMind\ AI
   ```

2. **Instalar dependências**
   ```bash
   npm install
   ```

3. **Configurar variáveis de ambiente**
   ```bash
   cp .env.example .env
   # Editar .env com suas configurações
   ```

4. **Configurar banco de dados PostgreSQL**
   - Criar banco de dados `habitsmind_ai`
   - Atualizar `DATABASE_URL` no `.env`

5. **Executar migrations do Prisma**
   ```bash
   npm run prisma:migrate
   ```

6. **Iniciar servidor em desenvolvimento**
   ```bash
   npm run start:dev
   ```

7. **Acessar aplicação**
   - API: `http://localhost:3000`
   - Swagger: `http://localhost:3000/api/docs`
   - Health: `http://localhost:3000/health`

### Com Docker Compose

```bash
# Build e inicie os serviços
docker-compose up -d

# Executar migrations
docker-compose exec app npm run prisma:migrate

# Ver logs
docker-compose logs -f

# Parar serviços
docker-compose down
```

---

## 📚 API Endpoints

### 🔐 Auth
- `POST /auth/register` — Registrar novo usuário
- `POST /auth/login` — Login e obter JWT

### 👤 Users
- `GET /users/me` — Obter perfil do usuário (requer auth)
- `PUT /users/me` — Atualizar perfil (requer auth)
- `GET /users/credits` — Obter créditos disponíveis (requer auth)

### 📅 Habits
- `POST /habits` — Criar novo hábito (requer auth)
- `GET /habits` — Listar todos os hábitos do usuário (requer auth)
- `GET /habits/:id` — Obter detalhes de um hábito (requer auth)
- `PUT /habits/:id` — Atualizar hábito (requer auth)
- `DELETE /habits/:id` — Deletar hábito (requer auth)

### ✅ Check-ins
- `POST /habits/:id/checkins` — Registrar check-in (requer auth)
- `GET /habits/:id/checkins` — Listar check-ins de um hábito (requer auth)
- `GET /habits/:id/checkins/range?startDate=&endDate=` — Check-ins por período (requer auth)

### 🤖 AI
- `POST /ai/analyze` — Analisar hábito e gerar insights (requer auth)
- `GET /ai/insights` — Listar insights do usuário (requer auth)
- `GET /ai/insights?habitId=` — Insights de um hábito específico (requer auth)

### 🏥 Health
- `GET /health` — Health check

**Documentação completa:** Acesse `http://localhost:3000/api/docs`

---

## 🔒 Autenticação

A API usa **JWT (JSON Web Tokens)** para autenticação.

### Fluxo

1. Usuário faz `POST /auth/register` ou `POST /auth/login`
2. Servidor retorna `accessToken`
3. Cliente envia token em todas as requisições com header:
   ```
   Authorization: Bearer <accessToken>
   ```

### Variáveis de Ambiente
- `JWT_SECRET` — Chave secreta para assinar tokens
- `JWT_EXPIRATION` — Tempo de expiração (ex: "7d")

---

## 📝 Scripts Disponíveis

```bash
# Desenvolvimento
npm run start         # Iniciar em modo produção
npm run start:dev     # Iniciar em modo development (watch)
npm run start:debug   # Iniciar com debug

# Build
npm run build         # Compilar TypeScript
npm run prebuild      # Limpar dist/

# Testes
npm run test          # Executar testes unitários
npm run test:watch    # Testes com watch
npm run test:cov      # Cobertura de testes
npm run test:e2e      # Testes E2E

# Qualidade de Código
npm run lint          # Executar ESLint
npm run format        # Formatar com Prettier

# Prisma
npm run prisma:generate  # Gerar Prisma Client
npm run prisma:migrate   # Executar migrations
npm run prisma:studio    # Abrir Prisma Studio (GUI do BD)
```

---

## 🗄️ Banco de Dados

### Executar Migrations

```bash
npm run prisma:migrate
# Seguir as instruções para criar nova migration
```

### Visualizar/Gerenciar Dados

```bash
npm run prisma:studio
# Abre interface web em http://localhost:5555
```

### Reset do Banco (⚠️ Cuidado em desenvolvimento)

```bash
npx prisma migrate reset
```

---

## 🧪 Testes

### Rodar Todos os Testes

```bash
npm run test
```

### Testes com Watch Mode

```bash
npm run test:watch
```

### Cobertura de Testes

```bash
npm run test:cov
```

---

## 🌍 Variáveis de Ambiente

### Obrigatórias

```env
DATABASE_URL=postgresql://user:password@host:5432/dbname
JWT_SECRET=sua-chave-secreta-aqui
```

### Opcionais

```env
NODE_ENV=development          # development | production
PORT=3000                     # Porta da aplicação
JWT_EXPIRATION=7d            # Expiração do JWT
OPENAI_API_KEY=             # Para futuro uso de IA
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

---

## 📦 Deployment

### Preparar para Produção

1. **Definir variáveis de ambiente seguras**
   ```bash
   export DATABASE_URL=postgresql://prod_user:prod_pass@prod_host:5432/prod_db
   export JWT_SECRET=chave-secreta-forte-e-aleatoria
   export NODE_ENV=production
   ```

2. **Build da aplicação**
   ```bash
   npm run build
   ```

3. **Rodar migrations**
   ```bash
   npm run prisma:migrate
   ```

4. **Iniciar servidor**
   ```bash
   npm run start:prod
   ```

### Com Docker

```bash
docker build -t habitsmind-ai:latest .
docker run -p 3000:3000 \
  -e DATABASE_URL=postgresql://... \
  -e JWT_SECRET=... \
  habitsmind-ai:latest
```

---

## 🐛 Troubleshooting

### "Cannot find module '@prisma/client'"
```bash
npm run prisma:generate
```

### Erro de conexão com PostgreSQL
- Verificar se PostgreSQL está rodando
- Confirmar `DATABASE_URL` no `.env`
- Testar conexão: `psql <DATABASE_URL>`

### Porta 3000 já está em uso
```bash
# Usar porta diferente
PORT=3001 npm run start:dev

# Ou liberar a porta
lsof -i :3000
kill -9 <PID>
```

---

## 📖 Referências

- [NestJS Docs](https://docs.nestjs.com)
- [Prisma Docs](https://www.prisma.io/docs)
- [Passport.js](https://www.passportjs.org)
- [Swagger/OpenAPI](https://swagger.io)
- [PostgreSQL](https://www.postgresql.org/docs)

---

## 📅 Cronograma de Desenvolvimento

Veja [README_CRONOGRAMA.md](README_CRONOGRAMA.md) para as fases de desenvolvimento.

---

## 📝 Licença

MIT

---

## 🤝 Contribuindo

1. Fork do repositório
2. Criar branch (`git checkout -b feature/sua-feature`)
3. Commit suas mudanças (`git commit -am 'Add nova feature'`)
4. Push para a branch (`git push origin feature/sua-feature`)
5. Abrir Pull Request

---

## 📧 Contato

Para dúvidas ou sugestões, abra uma issue no repositório.
