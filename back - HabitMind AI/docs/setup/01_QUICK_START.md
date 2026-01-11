# 🚀 HabitMind AI — Quick Start Guide

Bem-vindo ao HabitMind AI! Este guia vai te ajudar a começar rapidamente.

## 📋 Pré-requisitos

- Node.js 18+
- npm ou yarn
- PostgreSQL 16+ (ou use Docker)

## ⚡ Início Rápido (5 minutos)

### Opção 1: Local (Com PostgreSQL instalado)

```bash
# 1. Instalar dependências
npm install

# 2. Configurar banco de dados
# Crie um arquivo .env na raiz do projeto:
# DATABASE_URL=postgresql://user:password@localhost:5432/habitsmind_ai

# 3. Executar migrations
npm run prisma:migrate

# 4. Iniciar servidor em development
npm run start:dev

# 5. Acessar
# API: http://localhost:3000
# Docs: http://localhost:3000/api/docs
# Health: http://localhost:3000/health
```

### Opção 2: Docker Compose (Recomendado)

```bash
# 1. Instalar dependências locais
npm install

# 2. Iniciar tudo com Docker
docker-compose up -d

# 3. Aguardar a inicialização (30 segundos)
# Verificar status:
docker-compose logs -f

# 4. Acessar
# API: http://localhost:3000
# Docs: http://localhost:3000/api/docs
# Database Studio: npm run prisma:studio
```

---

## 🧪 Testando a API

### 1. Registrar um novo usuário

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "name": "John Doe",
    "password": "password123"
  }'
```

**Resposta:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "clw7g8h0000001np7b8b8b8b",
    "email": "user@example.com",
    "name": "John Doe",
    "planType": "free"
  }
}
```

### 2. Fazer login

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### 3. Criar um hábito (requer token)

```bash
TOKEN="seu_token_aqui"

curl -X POST http://localhost:3000/habits \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Morning Exercise",
    "description": "30 minutes of exercise",
    "frequency": "daily",
    "preferredTime": "07:00"
  }'
```

### 4. Listar seus hábitos

```bash
curl -X GET http://localhost:3000/habits \
  -H "Authorization: Bearer $TOKEN"
```

### 5. Registrar um check-in

```bash
HABIT_ID="seu_habit_id"

curl -X POST http://localhost:3000/habits/$HABIT_ID/checkins \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2025-01-06",
    "status": "completed",
    "notes": "Great workout!"
  }'
```

### 6. Gerar insights com IA

```bash
curl -X POST http://localhost:3000/ai/analyze \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "habitId": "seu_habit_id",
    "type": "pattern_analysis"
  }'
```

---

## 📚 Documentação Completa

Acesse a documentação interativa em:
- **Swagger UI**: http://localhost:3000/api/docs

---

## 🛠️ Comandos Úteis

```bash
# Desenvolvimento
npm run start:dev       # Iniciar em watch mode
npm run build          # Compilar TypeScript

# Testes
npm run test           # Rodar testes
npm run test:watch     # Testes com watch

# Banco de Dados
npm run prisma:migrate # Criar migrations
npm run prisma:studio  # Abrir GUI do banco

# Qualidade
npm run lint           # Verificar código
npm run format         # Formatar código
```

---

## 📁 Estrutura do Projeto

```
src/
├── auth/       # Autenticação (JWT + Passport)
├── users/      # Gestão de usuários
├── habits/     # CRUD de hábitos e check-ins
├── ai/         # Análise com IA
├── prisma/     # Configuração do banco
└── main.ts     # Entry point
```

---

## 🗄️ Variáveis de Ambiente

### Obrigatórias
```env
DATABASE_URL=postgresql://user:password@host:5432/dbname
JWT_SECRET=sua-chave-secreta
```

### Opcionais
```env
NODE_ENV=development
PORT=3000
JWT_EXPIRATION=7d
OPENAI_API_KEY=seu-api-key
```

---

## 🐛 Troubleshooting

### "Cannot find module '@prisma/client'"
```bash
npm run prisma:generate
```

### Erro de conexão com PostgreSQL
```bash
# Verificar variáveis no .env
cat .env

# Testar conexão
psql $DATABASE_URL
```

### Porta 3000 já em uso
```bash
PORT=3001 npm run start:dev
```

---

## 🚢 Deploy para Produção

1. **Build da aplicação**
   ```bash
   npm run build
   ```

2. **Configurar variáveis de produção**
   ```bash
   export DATABASE_URL=postgresql://prod...
   export JWT_SECRET=algo-super-secreto
   export NODE_ENV=production
   ```

3. **Rodar migrations**
   ```bash
   npm run prisma:migrate
   ```

4. **Iniciar server**
   ```bash
   npm run start:prod
   ```

---

## 📖 Próximas Etapas

1. ✅ Setup inicial concluído
2. 🔨 Explore a API via Swagger
3. 📝 Crie hábitos e registre check-ins
4. 🤖 Teste a geração de insights com IA
5. 📊 Implemente um frontend para consumir a API

---

## 📧 Suporte

Para dúvidas ou problemas, abra uma issue no repositório.

---

**Enjoy tracking your habits! 🎯**
