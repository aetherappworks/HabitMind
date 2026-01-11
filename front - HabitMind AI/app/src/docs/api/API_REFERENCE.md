# 📖 HabitMind AI — API Reference

Referência técnica completa de todos os endpoints da API.

---

## 📍 Base URL

```
Development:  http://localhost:3000
Production:   https://api.habitsmind.com
```

---

## 🔑 Autenticação

### Header Obrigatório

```
Authorization: Bearer <accessToken>
```

### Erros de Autenticação

```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Invalid token"
}
```

---

## 📋 Endpoints

## 🔐 Auth

### POST /auth/register

Registrar novo usuário.

**Request Body:**
```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "password": "password123"
}
```

**Response 201:**
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

**Errors:**
- `400` — Email já registrado ou dados inválidos

---

### POST /auth/login

Fazer login e obter JWT.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response 200:**
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

**Errors:**
- `400` — Credenciais inválidas

---

## 👤 Users

### GET /users/me

Obter perfil do usuário autenticado.

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Response 200:**
```json
{
  "id": "clw7g8h0000001np7b8b8b8b",
  "email": "user@example.com",
  "name": "John Doe",
  "planType": "free",
  "createdAt": "2025-01-06T10:00:00Z",
  "updatedAt": "2025-01-06T10:00:00Z"
}
```

**Errors:**
- `401` — Não autenticado

---

### PUT /users/me

Atualizar perfil do usuário.

**Headers:**
```
Authorization: Bearer <accessToken>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "New Name",
  "email": "newemail@example.com"
}
```

**Response 200:**
```json
{
  "id": "clw7g8h0000001np7b8b8b8b",
  "email": "newemail@example.com",
  "name": "New Name",
  "planType": "free",
  "createdAt": "2025-01-06T10:00:00Z",
  "updatedAt": "2025-01-06T10:05:00Z"
}
```

**Errors:**
- `400` — Email já existe ou dados inválidos
- `401` — Não autenticado

---

## 📅 Habits

### POST /habits

Criar novo hábito.

**Headers:**
```
Authorization: Bearer <accessToken>
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Morning Exercise",
  "description": "30 minutes of exercise",
  "frequency": "daily",
  "preferredTime": "07:00"
}
```

**Fields:**
- `title` (string, required) — Nome do hábito
- `description` (string, optional) — Descrição
- `frequency` (enum, required) — "daily" | "weekly" | "custom"
- `preferredTime` (string, optional) — Formato HH:MM (ex: "07:00")

**Response 201:**
```json
{
  "id": "clw7g8h0000002np7b8b8b8b",
  "userId": "clw7g8h0000001np7b8b8b8b",
  "title": "Morning Exercise",
  "description": "30 minutes of exercise",
  "frequency": "daily",
  "preferredTime": "07:00",
  "isActive": true,
  "createdAt": "2025-01-06T10:00:00Z",
  "updatedAt": "2025-01-06T10:00:00Z"
}
```

**Errors:**
- `400` — Validação falhou
- `401` — Não autenticado

---

### GET /habits

Listar todos os hábitos do usuário.

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Query Parameters:**
- Nenhum

**Response 200:**
```json
[
  {
    "id": "clw7g8h0000002np7b8b8b8b",
    "userId": "clw7g8h0000001np7b8b8b8b",
    "title": "Morning Exercise",
    "description": "30 minutes of exercise",
    "frequency": "daily",
    "preferredTime": "07:00",
    "isActive": true,
    "createdAt": "2025-01-06T10:00:00Z",
    "updatedAt": "2025-01-06T10:00:00Z",
    "habitLogs": []
  }
]
```

**Errors:**
- `401` — Não autenticado

---

### GET /habits/:id

Obter um hábito específico com seus check-ins.

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Path Parameters:**
- `id` (string) — ID do hábito

**Response 200:**
```json
{
  "id": "clw7g8h0000002np7b8b8b8b",
  "userId": "clw7g8h0000001np7b8b8b8b",
  "title": "Morning Exercise",
  "description": "30 minutes of exercise",
  "frequency": "daily",
  "preferredTime": "07:00",
  "isActive": true,
  "createdAt": "2025-01-06T10:00:00Z",
  "updatedAt": "2025-01-06T10:00:00Z",
  "habitLogs": [
    {
      "id": "clw7g8h0000003np7b8b8b8b",
      "habitId": "clw7g8h0000002np7b8b8b8b",
      "date": "2025-01-06",
      "status": "completed",
      "notes": "Great workout!",
      "createdAt": "2025-01-06T10:00:00Z",
      "updatedAt": "2025-01-06T10:00:00Z"
    }
  ]
}
```

**Errors:**
- `401` — Não autenticado
- `404` — Hábito não encontrado

---

### PUT /habits/:id

Atualizar um hábito.

**Headers:**
```
Authorization: Bearer <accessToken>
Content-Type: application/json
```

**Path Parameters:**
- `id` (string) — ID do hábito

**Request Body:**
```json
{
  "title": "Updated Title",
  "preferredTime": "08:00"
}
```

**Response 200:**
```json
{
  "id": "clw7g8h0000002np7b8b8b8b",
  "userId": "clw7g8h0000001np7b8b8b8b",
  "title": "Updated Title",
  "description": "30 minutes of exercise",
  "frequency": "daily",
  "preferredTime": "08:00",
  "isActive": true,
  "createdAt": "2025-01-06T10:00:00Z",
  "updatedAt": "2025-01-06T10:30:00Z"
}
```

**Errors:**
- `400` — Validação falhou
- `401` — Não autenticado
- `404` — Hábito não encontrado

---

### DELETE /habits/:id

Deletar um hábito (soft delete - marca como inativo).

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Path Parameters:**
- `id` (string) — ID do hábito

**Response 200:**
```json
{
  "id": "clw7g8h0000002np7b8b8b8b",
  "userId": "clw7g8h0000001np7b8b8b8b",
  "title": "Morning Exercise",
  "description": "30 minutes of exercise",
  "frequency": "daily",
  "preferredTime": "07:00",
  "isActive": false,
  "createdAt": "2025-01-06T10:00:00Z",
  "updatedAt": "2025-01-06T10:45:00Z"
}
```

**Errors:**
- `401` — Não autenticado
- `404` — Hábito não encontrado

---

## ✅ Check-ins

### POST /habits/:id/checkins

Registrar um check-in (conclusão) de um hábito.

**Headers:**
```
Authorization: Bearer <accessToken>
Content-Type: application/json
```

**Path Parameters:**
- `id` (string) — ID do hábito

**Request Body:**
```json
{
  "date": "2025-01-06",
  "status": "completed",
  "notes": "Great workout!"
}
```

**Fields:**
- `date` (string, required) — Formato YYYY-MM-DD
- `status` (enum, required) — "completed" | "pending" | "skipped"
- `notes` (string, optional) — Notas adicionais

**Response 201:**
```json
{
  "id": "clw7g8h0000003np7b8b8b8b",
  "habitId": "clw7g8h0000002np7b8b8b8b",
  "date": "2025-01-06",
  "status": "completed",
  "notes": "Great workout!",
  "createdAt": "2025-01-06T10:00:00Z",
  "updatedAt": "2025-01-06T10:00:00Z"
}
```

**Errors:**
- `400` — Validação falhou
- `401` — Não autenticado
- `404` — Hábito não encontrado

---

### GET /habits/:id/checkins

Listar todos os check-ins de um hábito.

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Path Parameters:**
- `id` (string) — ID do hábito

**Query Parameters:**
- Nenhum

**Response 200:**
```json
[
  {
    "id": "clw7g8h0000003np7b8b8b8b",
    "habitId": "clw7g8h0000002np7b8b8b8b",
    "date": "2025-01-06",
    "status": "completed",
    "notes": "Great workout!",
    "createdAt": "2025-01-06T10:00:00Z",
    "updatedAt": "2025-01-06T10:00:00Z"
  },
  {
    "id": "clw7g8h0000004np7b8b8b8b",
    "habitId": "clw7g8h0000002np7b8b8b8b",
    "date": "2025-01-05",
    "status": "skipped",
    "notes": null,
    "createdAt": "2025-01-05T10:00:00Z",
    "updatedAt": "2025-01-05T10:00:00Z"
  }
]
```

**Errors:**
- `401` — Não autenticado
- `404` — Hábito não encontrado

---

### GET /habits/:id/checkins/range

Listar check-ins em um período específico.

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Path Parameters:**
- `id` (string) — ID do hábito

**Query Parameters:**
- `startDate` (string, required) — Formato YYYY-MM-DD
- `endDate` (string, required) — Formato YYYY-MM-DD

**Example:**
```
GET /habits/clw7g8h0000002np7b8b8b8b/checkins/range?startDate=2025-01-01&endDate=2025-01-31
```

**Response 200:**
```json
[
  {
    "id": "clw7g8h0000003np7b8b8b8b",
    "habitId": "clw7g8h0000002np7b8b8b8b",
    "date": "2025-01-06",
    "status": "completed",
    "notes": "Great workout!",
    "createdAt": "2025-01-06T10:00:00Z",
    "updatedAt": "2025-01-06T10:00:00Z"
  }
]
```

**Errors:**
- `400` — Datas inválidas
- `401` — Não autenticado
- `404` — Hábito não encontrado

---

## 🤖 AI

### POST /ai/analyze

Gerar insights de IA sobre um hábito.

**Headers:**
```
Authorization: Bearer <accessToken>
Content-Type: application/json
```

**Request Body:**
```json
{
  "habitId": "clw7g8h0000002np7b8b8b8b",
  "type": "pattern_analysis",
  "context": "User has been missing weekends"
}
```

**Fields:**
- `habitId` (string, required) — ID do hábito a analisar
- `type` (enum, required) — "pattern_analysis" | "time_suggestion" | "encouragement" | "adjustment"
- `context` (string, optional) — Contexto adicional para a IA

**Response 201:**
```json
{
  "id": "clw7g8h0000005np7b8b8b8b",
  "userId": "clw7g8h0000001np7b8b8b8b",
  "habitId": "clw7g8h0000002np7b8b8b8b",
  "type": "pattern_analysis",
  "content": "Your habit \"Morning Exercise\" has a 85.7% completion rate over the last 30 days. Keep up the great work!",
  "confidenceScore": 0.92,
  "createdAt": "2025-01-06T10:00:00Z",
  "updatedAt": "2025-01-06T10:00:00Z"
}
```

**Insight Types:**
- `pattern_analysis` — Análise de padrões de comportamento
- `time_suggestion` — Sugestão de melhor horário
- `encouragement` — Mensagem de encorajamento
- `adjustment` — Sugestão de ajuste

**Errors:**
- `400` — Validação falhou
- `401` — Não autenticado
- `404` — Hábito não encontrado

---

### GET /ai/insights

Listar todos os insights do usuário.

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Query Parameters:**
- `habitId` (string, optional) — Filtrar por hábito específico

**Response 200:**
```json
[
  {
    "id": "clw7g8h0000005np7b8b8b8b",
    "userId": "clw7g8h0000001np7b8b8b8b",
    "habitId": "clw7g8h0000002np7b8b8b8b",
    "type": "pattern_analysis",
    "content": "Your habit \"Morning Exercise\" has a 85.7% completion rate over the last 30 days. Keep up the great work!",
    "confidenceScore": 0.92,
    "createdAt": "2025-01-06T10:00:00Z",
    "updatedAt": "2025-01-06T10:00:00Z"
  },
  {
    "id": "clw7g8h0000006np7b8b8b8b",
    "userId": "clw7g8h0000001np7b8b8b8b",
    "habitId": "clw7g8h0000002np7b8b8b8b",
    "type": "time_suggestion",
    "content": "Based on your completion patterns, you might have better success if you try this habit at 7:15 AM.",
    "confidenceScore": 0.78,
    "createdAt": "2025-01-06T10:30:00Z",
    "updatedAt": "2025-01-06T10:30:00Z"
  }
]
```

**Errors:**
- `401` — Não autenticado

---

### GET /ai/insights?habitId=:id

Listar insights de um hábito específico.

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Query Parameters:**
- `habitId` (string, required) — ID do hábito

**Example:**
```
GET /ai/insights?habitId=clw7g8h0000002np7b8b8b8b
```

**Response 200:**
```json
[
  {
    "id": "clw7g8h0000005np7b8b8b8b",
    "userId": "clw7g8h0000001np7b8b8b8b",
    "habitId": "clw7g8h0000002np7b8b8b8b",
    "type": "pattern_analysis",
    "content": "Your habit \"Morning Exercise\" has a 85.7% completion rate over the last 30 days. Keep up the great work!",
    "confidenceScore": 0.92,
    "createdAt": "2025-01-06T10:00:00Z",
    "updatedAt": "2025-01-06T10:00:00Z"
  }
]
```

**Errors:**
- `401` — Não autenticado
- `404` — Hábito não encontrado

---

## 🏥 Health

### GET /health

Verificar saúde da API.

**Response 200:**
```json
{
  "status": "ok",
  "timestamp": "2025-01-06T10:00:00Z",
  "message": "HabitMind AI API is running"
}
```

---

## 📊 Status Codes

| Code | Meaning | Description |
|------|---------|-------------|
| 200 | OK | Requisição bem-sucedida |
| 201 | Created | Recurso criado |
| 400 | Bad Request | Dados inválidos |
| 401 | Unauthorized | Não autenticado ou token inválido |
| 403 | Forbidden | Acesso negado |
| 404 | Not Found | Recurso não encontrado |
| 500 | Server Error | Erro interno |

---

## ⏱️ Rate Limiting

Atualmente sem limites. Será implementado na Phase 6.

---

## 🔒 Segurança

- ✅ Todas as rotas (exceto /auth e /health) requerem autenticação
- ✅ Tokens JWT com expiração de 7 dias
- ✅ Passwords hasheadas com bcrypt
- ✅ Soft delete (dados não são permanentemente removidos)

---

## 📝 Convenções

### Datas
- Formato: ISO 8601 (`YYYY-MM-DDTHH:MM:SSZ`)
- Check-in dates: `YYYY-MM-DD`

### IDs
- Tipo: CUID (Collision Unique IDentifier)
- Exemplo: `clw7g8h0000001np7b8b8b8b`

### Erro Response
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "details about the error"
}
```

---

## 🧪 Testar Endpoints

### Com Swagger UI
```
http://localhost:3000/api/docs
```

### Com cURL
```bash
# Health check
curl http://localhost:3000/health

# Register
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","name":"John","password":"pass123"}'

# Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"pass123"}'

# Get profile (com token)
curl -X GET http://localhost:3000/users/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Com Axios (JavaScript/TypeScript)
```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000'
});

// Login
const loginResponse = await api.post('/auth/login', {
  email: 'user@example.com',
  password: 'password123'
});

const token = loginResponse.data.accessToken;

// Get profile
const profileResponse = await api.get('/users/me', {
  headers: { Authorization: `Bearer ${token}` }
});
```

---

## 🔗 Links

- **Frontend Guide:** [FRONTEND_GUIDE.md](FRONTEND_GUIDE.md)
- **Backend Setup:** [QUICK_START.md](QUICK_START.md)
- **Architecture:** [ARCHITECTURE.md](ARCHITECTURE.md)

---

**Última Atualização:** 6 de Janeiro de 2026  
**Versão:** 1.0.0  
**Status:** Production Ready ✅
