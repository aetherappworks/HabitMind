# 📡 Referência Completa da API - Backend

## 🌐 Base URL

```
http://localhost:3000
https://api.habitsmind.com (produção)
```

## 🔐 Autenticação

Todos os endpoints protegidos requerem:

```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

Obter token:
```bash
POST /auth/login
```

## 📋 Índice de Endpoints

- [Auth](#auth) - Autenticação
- [Users](#users) - Gerenciamento de usuários
- [Habits](#habits) - Hábitos e check-ins
- [AI](#ai) - Análises com IA
- [Billing](#billing) - Gerenciamento de créditos
- [Ads](#ads) - Sistema de anúncios

---

## 🔐 Auth

### POST `/auth/register`
Registrar novo usuário.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "name": "João Silva"
}
```

**Response (201):**
```json
{
  "id": "cuj1234567890abcdef",
  "email": "user@example.com",
  "name": "João Silva",
  "planType": "free",
  "availableCredits": 10,
  "totalCredits": 10,
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImN1ajEyMzQ1Njc4OTBhYmNkZWYiLCJpYXQiOjE3MDQxMDU4MzUsImV4cCI6MTcwNDE5MjIzNX0.x_Signature_x",
  "createdAt": "2024-01-10T10:30:35Z",
  "updatedAt": "2024-01-10T10:30:35Z"
}
```

**Validações:**
- Email: Deve ser válido e único
- Password: Mínimo 8 caracteres
- Name: Obrigatório

**Erros Possíveis:**
- `400`: Email já existe
- `400`: Formato de email inválido
- `400`: Senha fraca

---

### POST `/auth/login`
Fazer login com credenciais.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Response (200):**
```json
{
  "id": "cuj1234567890abcdef",
  "email": "user@example.com",
  "name": "João Silva",
  "planType": "free",
  "availableCredits": 10,
  "totalCredits": 10,
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "createdAt": "2024-01-10T10:30:35Z",
  "updatedAt": "2024-01-10T10:30:35Z"
}
```

**Erros Possíveis:**
- `401`: Email ou senha inválidos
- `404`: Usuário não encontrado

---

## 👤 Users

### GET `/users/me`
Obter dados do usuário autenticado.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "id": "cuj1234567890abcdef",
  "email": "user@example.com",
  "name": "João Silva",
  "planType": "free",
  "availableCredits": 10,
  "totalCredits": 10,
  "createdAt": "2024-01-10T10:30:35Z",
  "updatedAt": "2024-01-10T10:30:35Z"
}
```

**Erros Possíveis:**
- `401`: Token inválido/expirado
- `404`: Usuário não encontrado

---

### PUT `/users/me`
Atualizar dados do usuário.

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "name": "João Silva Novo",
  "email": "newemail@example.com"
}
```

**Response (200):**
```json
{
  "id": "cuj1234567890abcdef",
  "email": "newemail@example.com",
  "name": "João Silva Novo",
  "planType": "free",
  "availableCredits": 10,
  "totalCredits": 10,
  "updatedAt": "2024-01-10T11:00:00Z"
}
```

---

### PUT `/users/me/password`
Atualizar senha do usuário.

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "currentPassword": "OldPassword123!",
  "newPassword": "NewPassword456!",
  "confirmPassword": "NewPassword456!"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Senha atualizada com sucesso"
}
```

**Erros Possíveis:**
- `400`: Senha atual incorreta
- `400`: Senhas novas não conferem
- `400`: Nova senha fraca

---

## 🎯 Habits

### POST `/habits`
Criar novo hábito.

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "title": "Beber 2L de água",
  "description": "Manter hidratação durante o dia",
  "frequency": "daily",
  "preferredTime": "07:00"
}
```

**Campos:**
- `title` (string, obrigatório): Nome do hábito
- `description` (string, opcional): Descrição
- `frequency` (string): "daily", "weekly", ou "custom"
- `preferredTime` (string, opcional): Formato "HH:mm"

**Response (201):**
```json
{
  "id": "cuj2345678901234567",
  "userId": "cuj1234567890abcdef",
  "title": "Beber 2L de água",
  "description": "Manter hidratação durante o dia",
  "frequency": "daily",
  "preferredTime": "07:00",
  "isActive": true,
  "createdAt": "2024-01-10T15:30:00Z",
  "updatedAt": "2024-01-10T15:30:00Z"
}
```

---

### GET `/habits`
Listar todos os hábitos do usuário.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
```
?skip=0&take=10  (paginação)
?isActive=true   (filtrar apenas ativos)
```

**Response (200):**
```json
[
  {
    "id": "cuj2345678901234567",
    "title": "Beber 2L de água",
    "frequency": "daily",
    "isActive": true,
    "preferredTime": "07:00",
    "stats": {
      "completionToday": true,
      "streak": 7,
      "completionRate": 0.85
    },
    "createdAt": "2024-01-10T15:30:00Z"
  }
]
```

---

### GET `/habits/:id`
Obter detalhes completos de um hábito.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "id": "cuj2345678901234567",
  "title": "Beber 2L de água",
  "description": "Manter hidratação durante o dia",
  "frequency": "daily",
  "preferredTime": "07:00",
  "isActive": true,
  "stats": {
    "totalCompletions": 42,
    "totalDays": 50,
    "currentStreak": 7,
    "longestStreak": 15,
    "completionRate": 0.84,
    "lastCompletion": "2024-01-10T19:45:00Z"
  },
  "recentLogs": [
    {
      "id": "cuj3456789012345678",
      "date": "2024-01-10",
      "status": "completed",
      "notes": "Completado no horário"
    }
  ],
  "createdAt": "2024-01-10T15:30:00Z"
}
```

---

### PUT `/habits/:id`
Editar hábito.

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "title": "Beber 2.5L de água",
  "description": "Aumentar hidratação",
  "preferredTime": "08:00",
  "isActive": true
}
```

**Response (200):**
```json
{
  "id": "cuj2345678901234567",
  "title": "Beber 2.5L de água",
  "description": "Aumentar hidratação",
  "preferredTime": "08:00",
  "isActive": true,
  "updatedAt": "2024-01-10T16:00:00Z"
}
```

---

### DELETE `/habits/:id`
Deletar hábito.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Hábito deletado com sucesso"
}
```

---

### POST `/habits/:id/checkin`
Registrar conclusão de hábito (check-in).

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "status": "completed",
  "notes": "Completado no horário"
}
```

**Valores de Status:**
- `"completed"`: Hábito completado
- `"pending"`: Ainda não feito
- `"skipped"`: Pulado propositalmente

**Response (201):**
```json
{
  "id": "cuj3456789012345678",
  "habitId": "cuj2345678901234567",
  "date": "2024-01-10",
  "status": "completed",
  "notes": "Completado no horário",
  "createdAt": "2024-01-10T20:30:00Z"
}
```

---

### GET `/habits/:id/stats`
Obter estatísticas detalhadas do hábito.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
```
?days=30        (últimos 30 dias, padrão)
?days=7         (última semana)
?days=90        (últimos 3 meses)
```

**Response (200):**
```json
{
  "habitId": "cuj2345678901234567",
  "period": 30,
  "stats": {
    "totalDays": 50,
    "completedDays": 42,
    "skippedDays": 5,
    "pendingDays": 3,
    "completionRate": 0.84,
    "currentStreak": 7,
    "longestStreak": 15,
    "averageCompletionTime": "07:15"
  },
  "timeline": [
    {
      "date": "2024-01-10",
      "status": "completed",
      "completedAt": "2024-01-10T07:15:00Z"
    },
    {
      "date": "2024-01-09",
      "status": "completed",
      "completedAt": "2024-01-09T07:30:00Z"
    }
  ]
}
```

---

### GET `/habits/:id/logs`
Obter histórico de check-ins.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
```
?skip=0&take=20 (paginação)
?from=2024-01-01&to=2024-01-31 (filtro de data)
```

**Response (200):**
```json
{
  "logs": [
    {
      "id": "cuj3456789012345678",
      "date": "2024-01-10",
      "status": "completed",
      "notes": "Completado no horário",
      "createdAt": "2024-01-10T20:30:00Z"
    }
  ],
  "total": 42
}
```

---

## 🤖 AI

### GET `/ai/analysis/:habitId`
Análise de um hábito específico.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "habitId": "cuj2345678901234567",
  "generatedAt": "2024-01-10T10:00:00Z",
  "insights": [
    {
      "id": "cuj4567890123456789",
      "type": "pattern_analysis",
      "content": "Você completa esse hábito 85% das vezes. Melhor desempenho entre 7-8 AM.",
      "confidenceScore": 0.92,
      "createdAt": "2024-01-10T10:00:00Z"
    },
    {
      "id": "cuj5678901234567890",
      "type": "time_suggestion",
      "content": "Recomendamos mover o hábito para 7 AM, quando você tem 90% de taxa de conclusão.",
      "confidenceScore": 0.88,
      "createdAt": "2024-01-10T10:00:00Z"
    },
    {
      "id": "cuj6789012345678901",
      "type": "encouragement",
      "content": "Parabéns! Você manteve essa sequência por 7 dias seguidos. Continue assim!",
      "confidenceScore": 0.95,
      "createdAt": "2024-01-10T10:00:00Z"
    }
  ]
}
```

---

### GET `/ai/analysis`
Análise geral de todos os hábitos (overview).

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "userId": "cuj1234567890abcdef",
  "generatedAt": "2024-01-10T10:00:00Z",
  "overallScore": 0.82,
  "statistics": {
    "totalHabits": 5,
    "activeHabits": 4,
    "averageCompletionRate": 0.82,
    "totalDaysTracked": 150,
    "totalCompletions": 123
  },
  "insights": [
    {
      "type": "pattern_analysis",
      "content": "Você tem excelente consistência! Taxa geral de 82% em todos os hábitos.",
      "confidenceScore": 0.94
    },
    {
      "type": "adjustment",
      "content": "O hábito 'Exercício' tem a menor taxa (65%). Considere ajustá-lo.",
      "confidenceScore": 0.87
    }
  ]
}
```

---

## 💳 Billing

### GET `/billing/credits`
Obter saldo atual de créditos.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "userId": "cuj1234567890abcdef",
  "availableCredits": 25,
  "totalCredits": 50,
  "earnings": {
    "today": 5,
    "thisWeek": 20,
    "thisMonth": 50
  },
  "limits": {
    "dailyAdLimit": 3,
    "adsCompletedToday": 2,
    "creditsEarnedToday": 10
  }
}
```

---

### GET `/billing/history`
Obter histórico de transações de créditos.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
```
?skip=0&take=50 (paginação)
?type=earned    (filtrar por tipo: earned, purchased)
?from=2024-01-01&to=2024-01-31 (filtro de data)
```

**Response (200):**
```json
{
  "transactions": [
    {
      "id": "trans001",
      "type": "earned",
      "amount": 5,
      "reason": "Ad view: Rewarded Ad",
      "habitId": "cuj2345678901234567",
      "timestamp": "2024-01-10T19:45:00Z"
    },
    {
      "id": "trans002",
      "type": "earned",
      "amount": 5,
      "reason": "Ad view: Rewarded Ad",
      "habitId": "cuj2345678901234567",
      "timestamp": "2024-01-09T15:30:00Z"
    },
    {
      "id": "trans003",
      "type": "earned",
      "amount": 10,
      "reason": "Bonus: New user promotion",
      "timestamp": "2024-01-01T10:00:00Z"
    }
  ],
  "total": 20,
  "summary": {
    "totalEarned": 20,
    "totalSpent": 0
  }
}
```

---

### POST `/billing/credits/reload`
Recarregar créditos (via IAP).

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "packageId": "credits_100",
  "transactionId": "GPA.3456-7890-1234-56789"
}
```

**Response (201):**
```json
{
  "success": true,
  "creditsAdded": 100,
  "newTotal": 150,
  "transactionId": "GPA.3456-7890-1234-56789",
  "timestamp": "2024-01-10T12:00:00Z"
}
```

**Erros Possíveis:**
- `400`: Transaction inválida
- `400`: Pacote não existe
- `409`: Transaction já foi usada

---

## 📺 Ads

### POST `/ads/view`
Registrar visualização de anúncio.

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "adType": "rewarded",
  "adId": "google_ad_123",
  "adUnitId": "/6499/example/banner"
}
```

**Tipos de Anúncios:**
- `"banner"`: Anúncio em banner
- `"interstitial"`: Tela inteira entre ações
- `"rewarded"`: Anúncio com recompensa

**Response (201):**
```json
{
  "id": "adview001",
  "userId": "cuj1234567890abcdef",
  "adType": "rewarded",
  "adId": "google_ad_123",
  "validationToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "rewardAmount": 5,
  "viewedAt": "2024-01-10T19:45:00Z",
  "expiresAt": "2024-01-10T20:45:00Z"
}
```

---

### POST `/ads/reward-completion`
Validar visualização e conceder recompensa.

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "habitId": "cuj2345678901234567",
  "adViewId": "adview001",
  "validationToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200):**
```json
{
  "success": true,
  "creditsGranted": 5,
  "newBalance": 30,
  "message": "Recompensa concedida com sucesso"
}
```

**Erros Possíveis:**
- `400`: Token inválido
- `401`: Token expirado
- `409`: Recompensa já foi reclamada
- `429`: Limite diário atingido

---

### GET `/ads/stats`
Obter estatísticas de anúncios visualizados.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "userId": "cuj1234567890abcdef",
  "statistics": {
    "totalAdsViewed": 45,
    "totalRewardsEarned": 180,
    "averageRewardPerAd": 4.0,
    "thisMonth": {
      "adsViewed": 12,
      "rewardsEarned": 45
    },
    "thisWeek": {
      "adsViewed": 5,
      "rewardsEarned": 20
    },
    "today": {
      "adsViewed": 2,
      "rewardsEarned": 10,
      "adsRemaining": 1
    }
  },
  "breakdown": {
    "rewarded": {
      "viewed": 45,
      "earned": 180
    },
    "interstitial": {
      "viewed": 120,
      "earned": 0
    }
  }
}
```

---

### GET `/ads/config`
Obter configuração de anúncios disponíveis.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "configs": [
    {
      "adType": "rewarded",
      "isEnabled": true,
      "rewardAmount": 5,
      "dailyLimit": 3,
      "description": "Watch a video ad and earn 5 credits"
    },
    {
      "adType": "interstitial",
      "isEnabled": true,
      "rewardAmount": 0,
      "dailyLimit": -1,
      "description": "Full screen ad between actions"
    },
    {
      "adType": "banner",
      "isEnabled": true,
      "rewardAmount": 0,
      "dailyLimit": -1,
      "description": "Banner ad at the bottom of the screen"
    }
  ]
}
```

---

## 📊 Status Codes

| Código | Significado | Uso |
|--------|-------------|-----|
| 200 | OK | Sucesso em GET/PUT |
| 201 | Created | Sucesso em POST |
| 204 | No Content | Sucesso em DELETE |
| 400 | Bad Request | Dados inválidos |
| 401 | Unauthorized | Token inválido/faltando |
| 403 | Forbidden | Sem permissão |
| 404 | Not Found | Recurso não existe |
| 409 | Conflict | Conflito (ex: duplicação) |
| 429 | Too Many Requests | Rate limit atingido |
| 500 | Server Error | Erro no servidor |

---

## 🌍 Query Parameters Comuns

### Paginação
```
?skip=0         (número de registros a pular)
?take=10        (quantidade de registros)
```

### Filtros de Data
```
?from=2024-01-01        (data de início)
?to=2024-01-31          (data de fim)
```

### Idioma
```
?lang=pt-br             (português)
?lang=en                (inglês)
```

---

## 🔄 Exemplos Completos com cURL

### Registrar e Logar

```bash
# Registrar
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@example.com",
    "password": "Password123!",
    "name": "João Teste"
  }'

# Copiar o accessToken da resposta
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Usar token em próximas requisições
```

### Criar e Completar Hábito

```bash
# Criar hábito
curl -X POST http://localhost:3000/habits \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Meditação",
    "frequency": "daily",
    "preferredTime": "07:00"
  }'

# Registrar check-in
curl -X POST http://localhost:3000/habits/cuj2345678901234567/checkin \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "status": "completed",
    "notes": "Completado"
  }'
```

### Ganhar Créditos com Anúncio

```bash
# Visualizar anúncio
curl -X POST http://localhost:3000/ads/view \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "adType": "rewarded",
    "adId": "google_123"
  }'

# Copiar validationToken da resposta
VALIDATION_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Reivindicar recompensa
curl -X POST http://localhost:3000/ads/reward-completion \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "habitId": "cuj2345678901234567",
    "adViewId": "adview001",
    "validationToken": "'$VALIDATION_TOKEN'"
  }'
```

---

## 📖 Links Úteis

- [Swagger UI](http://localhost:3000/api/docs) - Documentação interativa
- [Prisma Studio](http://localhost:5555) - Visualizador de banco
- [NestJS Docs](https://docs.nestjs.com/) - Documentação do framework
- [JWT.io](https://jwt.io/) - Decodificar tokens

---

**Última atualização**: Janeiro 2026
