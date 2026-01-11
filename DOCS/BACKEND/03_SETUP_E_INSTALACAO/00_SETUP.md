# 🚀 Setup e Instalação - Backend

## ⚙️ Pré-requisitos

Antes de começar, você precisa ter instalado:

### Obrigatório
- **Node.js**: v18+ ([Download](https://nodejs.org/))
- **npm**: v9+ (incluído com Node.js)
- **PostgreSQL**: v14+ ([Download](https://www.postgresql.org/download/))
- **Git**: ([Download](https://git-scm.com/))

### Verificar Instalação

```bash
# Verificar Node.js
node --version
# Esperado: v18.x.x ou superior

# Verificar npm
npm --version
# Esperado: v9.x.x ou superior

# Verificar PostgreSQL
psql --version
# Esperado: PostgreSQL 14.x ou superior

# Verificar Git
git --version
# Esperado: git version 2.x.x
```

## 📥 Instalação Passo a Passo

### 1️⃣ Clonar o Repositório

```bash
# Clonar repositório
git clone https://github.com/seu-usuario/habitsmind-ai.git

# Entrar na pasta do backend
cd "back - HabitMind AI"

# Verificar estrutura
ls -la
```

### 2️⃣ Instalar Dependências

```bash
# Instalar todas as dependências
npm install

# Verificar instalação
npm list

# Esperado: Deve listar todas as dependências sem erros
```

### 3️⃣ Configurar Variáveis de Ambiente

```bash
# Copiar arquivo de exemplo
cp .env.example .env

# Abrir .env em seu editor
# (VSCode: code .env | Nano: nano .env | Vim: vim .env)
```

**Arquivo `.env` - Configuração necessária:**

```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/habitsmind_dev"

# JWT
JWT_SECRET="sua-chave-secreta-super-segura-min-32-chars"
JWT_EXPIRATION_HOURS="24"

# API
API_PORT=3000
NODE_ENV="development"

# CORS (Frontend URL)
FRONTEND_URL="http://localhost:8081"

# Email (optional, para notificações futuras)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="seu-email@gmail.com"
SMTP_PASS="sua-senha-app"

# Google Mobile Ads (para validação de anúncios)
GOOGLE_PLAY_PACKAGE_NAME="com.habitsmind.app"

# i18n
I18N_DEFAULT_LANGUAGE="pt-br"
```

**Valores Importantes:**

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `DATABASE_URL` | Connection string PostgreSQL | `postgresql://user:pass@localhost:5432/db` |
| `JWT_SECRET` | Chave secreta (mín 32 chars) | `SuperSecretKey12345678901234567890` |
| `API_PORT` | Porta da API | `3000` |
| `NODE_ENV` | Ambiente | `development` ou `production` |
| `FRONTEND_URL` | URL do frontend para CORS | `http://localhost:8081` |

### 4️⃣ Criar Banco de Dados PostgreSQL

**Opção A: Usando psql (Recomendado)**

```bash
# Acessar PostgreSQL
psql -U postgres

# Dentro do psql, criar banco
CREATE DATABASE habitsmind_dev;

# Criar usuário
CREATE USER habitsmind_user WITH PASSWORD 'sua-senha-forte';

# Dar permissões
ALTER ROLE habitsmind_user WITH CREATEDB;
GRANT ALL PRIVILEGES ON DATABASE habitsmind_dev TO habitsmind_user;

# Sair
\q
```

**Opção B: Usando Docker (Se tiver Docker instalado)**

```bash
# Criar container PostgreSQL
docker run -d \
  --name habitsmind-postgres \
  -e POSTGRES_DB=habitsmind_dev \
  -e POSTGRES_USER=habitsmind_user \
  -e POSTGRES_PASSWORD=sua-senha-forte \
  -p 5432:5432 \
  postgres:14-alpine

# Verificar se está rodando
docker ps | grep habitsmind-postgres
```

**Atualizar `.env` com credenciais:**

```bash
DATABASE_URL="postgresql://habitsmind_user:sua-senha-forte@localhost:5432/habitsmind_dev"
```

### 5️⃣ Executar Migrations do Prisma

```bash
# Executar todas as migrations pendentes
npx prisma migrate dev

# Será perguntado o nome da migration (se for a primeira)
# Se não tiver pendentes, ele só sincroniza

# Verificar status
npx prisma migrate status

# Esperado: All migrations have been successfully applied.
```

### 6️⃣ Gerar Prisma Client

```bash
# Gerar tipos TypeScript do schema
npx prisma generate

# Esse comando é executado automaticamente durante npm install,
# mas pode ser necessário executar manualmente se houver mudanças no schema.prisma
```

### 7️⃣ (Opcional) Popular Banco com Dados de Teste

```bash
# Se tiver um arquivo seed.ts
npx prisma db seed

# Ou criar um script personalizado
npm run seed:dev
```

### 8️⃣ Iniciar o Servidor

**Modo Desenvolvimento (Com Hot Reload)**

```bash
npm run start:dev

# Esperado:
# [Nest] 12345 - 01/10/2024 10:30:15     LOG [NestFactory] Starting Nest application...
# [Nest] 12345 - 01/10/2024 10:30:15     LOG [InstanceLoader] PrismaModule dependencies initialized
# [Nest] 12345 - 01/10/2024 10:30:15     LOG [InstanceLoader] AuthModule dependencies initialized
# [Nest] 12345 - 01/10/2024 10:30:15     LOG [NestApplication] Nest application successfully started on port 3000
```

**Modo Produção**

```bash
# Build
npm run build

# Start produção
npm run start:prod
```

**Modo Debug**

```bash
npm run start:debug

# Abrirá debugger na porta 9229
# Conecte seu VSCode: Debug → Chrome → localhost:9229
```

## ✅ Verificações Pós-Instalação

### 1. Testar API

```bash
# Verificar se servidor está respondendo
curl http://localhost:3000

# Esperado: Error 404 (normal, não existe rota /)

# Acessar documentação Swagger
curl http://localhost:3000/api/docs

# Esperado: HTML do Swagger UI
```

### 2. Acessar Swagger UI (Documentação Interativa)

Abrir no navegador:
```
http://localhost:3000/api/docs
```

Você verá:
- Todos os endpoints disponíveis
- Parâmetros de cada endpoint
- Schemas de request/response
- Botão "Try it out" para testar

### 3. Testar Autenticação

```bash
# Registrar novo usuário
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@example.com",
    "password": "Password123!",
    "name": "João Teste"
  }'

# Esperado: Retorna user + token

# Fazer login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@example.com",
    "password": "Password123!"
  }'

# Esperado: Retorna user + token
```

### 4. Usar Prisma Studio (GUI para o Banco)

```bash
# Abrir Prisma Studio no navegador
npx prisma studio

# Abrirá em http://localhost:5555
# Aqui pode:
# - Ver todos os registros de cada tabela
# - Criar/editar/deletar registros
# - Visualizar relações
```

## 🐳 Docker Setup (Opcional)

Se preferir containerizar o backend:

**Dockerfile já existe no projeto:**

```bash
# Buildar imagem
docker build -t habitsmind-api:latest .

# Rodar container
docker run -p 3000:3000 \
  --env-file .env \
  --name habitsmind-api \
  habitsmind-api:latest

# Verificar logs
docker logs habitsmind-api

# Parar container
docker stop habitsmind-api
```

**Docker Compose (Se quiser banco + API juntos):**

```bash
# Usar docker-compose.yml existente
docker-compose up -d

# Verificar status
docker-compose ps

# Ver logs
docker-compose logs -f api

# Parar tudo
docker-compose down
```

## 🧪 Rodando Testes

### Unit Tests

```bash
# Rodar testes uma vez
npm test

# Rodar em modo watch (reexecuta ao salvar)
npm run test:watch

# Rodar com cobertura
npm run test:cov

# Esperado: Relatório de cobertura em coverage/
```

### E2E Tests

```bash
# Rodar testes E2E
npm run test:e2e

# Nota: Requer banco de testes separado
```

## 📊 Comandos Úteis

### Prisma

```bash
# Ver status das migrations
npx prisma migrate status

# Criar nova migration (após alterar schema.prisma)
npx prisma migrate dev --name nome_descritivo

# Resetar banco (CUIDADO: deleta tudo!)
npx prisma migrate reset

# Abrir Prisma Studio
npx prisma studio

# Gerar tipos TypeScript
npx prisma generate

# Validar schema
npx prisma validate
```

### Desenvolvimento

```bash
# Formatar código (Prettier)
npm run format

# Lint TypeScript (ESLint)
npm run lint

# Build TypeScript
npm run build

# Limpar pasta dist
npx rimraf dist
```

## 🔧 Troubleshooting

### Problema: "Cannot find module '@nestjs/common'"

```bash
# Solução: Reinstalar dependências
rm -rf node_modules package-lock.json
npm install
```

### Problema: "ECONNREFUSED 127.0.0.1:5432" (Banco não conecta)

```bash
# Verificar se PostgreSQL está rodando
psql -U postgres

# Se erro, iniciar PostgreSQL:
# Linux: sudo systemctl start postgresql
# macOS: brew services start postgresql
# Windows: Services → PostgreSQL → Start

# Ou com Docker: docker start habitsmind-postgres
```

### Problema: "EADDRINUSE :::3000" (Porta 3000 em uso)

```bash
# Encontrar processo na porta 3000
# Linux/macOS:
lsof -i :3000
kill -9 <PID>

# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Ou usar porta diferente em .env
API_PORT=3001
```

### Problema: "Unexpected token in JSON at position 0"

```bash
# Verificar se .env está com valores corretos
# Verificar se DATABASE_URL tem aspas duplas
# Exemplo correto:
DATABASE_URL="postgresql://user:pass@localhost:5432/db"
```

### Problema: "JWT malformed" (Erro de token)

```bash
# Verificar JWT_SECRET em .env (mínimo 32 caracteres)
# Regenerar JWT_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Copiar saída para JWT_SECRET no .env
```

## 📚 Próximas Etapas

1. ✅ Backend instalado e rodando
2. → Ler [Guia Funcional](../02_FUNCIONAL/00_GUIA_FUNCIONAL.md)
3. → Consultar [API Reference](../04_API_REFERENCE/)
4. → Setup do [Frontend](../../FRONTEND/03_SETUP_E_INSTALACAO/)

## 📞 Suporte

Se encontrar problemas:

1. Verificar os logs: `npm run start:dev` mostra erros em tempo real
2. Consultar [Prisma Docs](https://www.prisma.io/docs/)
3. Consultar [NestJS Docs](https://docs.nestjs.com/)
4. Abrir issue no GitHub com:
   - Node/npm/PostgreSQL versions
   - Mensagem de erro completa
   - Passos para reproduzir

---

**Última atualização**: Janeiro 2026
