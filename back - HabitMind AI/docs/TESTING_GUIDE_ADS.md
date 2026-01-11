# 🧪 GUIA DE TESTE - ENDPOINTS DE ANÚNCIOS

## 📌 Pré-requisitos

1. Servidor rodando: `npm run start:dev`
2. JWT Token válido de um usuário autenticado
3. Ferramenta de teste (Postman, Insomnia, cURL)

---

## 🔑 Obter JWT Token

### 1. Registrar novo usuário
```bash
POST http://localhost:3000/auth/register
Content-Type: application/json

{
  "email": "test@example.com",
  "name": "Test User",
  "password": "Password123!"
}
```

**Response:**
```json
{
  "accessToken": "eyJhbGc...",
  "user": { "id": "cuid...", "email": "test@example.com" }
}
```

### 2. Ou fazer login
```bash
POST http://localhost:3000/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "Password123!"
}
```

**Copie o `accessToken` para usar em todos os testes abaixo.**

---

## 📊 Testes dos Endpoints

### ✅ TESTE 1: GET /ads/config
**Objetivo:** Obter configurações de tipos de anúncios

```bash
curl -X GET http://localhost:3000/ads/config \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json"
```

**Resultado esperado (200 OK):**
```json
[
  {
    "id": "config_uuid_1",
    "adType": "rewarded",
    "isEnabled": true,
    "rewardAmount": 10,
    "dailyLimit": 20,
    "createdAt": "2026-01-09T09:35:00.000Z",
    "updatedAt": "2026-01-09T09:35:00.000Z"
  },
  {
    "id": "config_uuid_2",
    "adType": "banner",
    "isEnabled": true,
    "rewardAmount": 1,
    "dailyLimit": 50,
    "createdAt": "2026-01-09T09:35:00.000Z",
    "updatedAt": "2026-01-09T09:35:00.000Z"
  },
  {
    "id": "config_uuid_3",
    "adType": "interstitial",
    "isEnabled": true,
    "rewardAmount": 5,
    "dailyLimit": 10,
    "createdAt": "2026-01-09T09:35:00.000Z",
    "updatedAt": "2026-01-09T09:35:00.000Z"
  }
]
```

**✓ Validação:**
- Array com 3 configurações
- Rewarded com 10 créditos
- Banner com 1 crédito
- Interstitial com 5 créditos

---

### ✅ TESTE 2: GET /ads/stats
**Objetivo:** Obter estatísticas de anúncios do usuário

```bash
curl -X GET http://localhost:3000/ads/stats \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json"
```

**Resultado esperado (200 OK) - Usuário novo:**
```json
{
  "totalCreditsEarned": 0,
  "adsWatchedToday": 0,
  "dailyLimit": 20,
  "remainingToday": 20,
  "resetTime": "2026-01-10T00:00:00.000Z"
}
```

**✓ Validação:**
- Créditos iniciais: 0
- Ads assistidos: 0
- Limite disponível: 20
- Reset time é amanhã às 00:00 UTC

---

### ✅ TESTE 3: POST /ads/view
**Objetivo:** Registrar uma visualização de anúncio

```bash
curl -X POST http://localhost:3000/ads/view \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "adId": "ad_test_001",
    "adType": "rewarded",
    "validationToken": "test_token_12345"
  }'
```

**Resultado esperado (201 Created):**
```json
{
  "id": "view_uuid_123",
  "userId": "user_uuid",
  "adType": "rewarded",
  "adId": "ad_test_001",
  "viewedAt": "2026-01-09T10:30:00.000Z",
  "rewardClaimed": false,
  "rewardAmount": 10,
  "validationToken": "test_token_12345",
  "createdAt": "2026-01-09T10:30:00.000Z",
  "updatedAt": "2026-01-09T10:30:00.000Z"
}
```

**✓ Validação:**
- rewardClaimed: false (ainda não reivindicado)
- rewardAmount: 10 (do tipo rewarded)
- ID retornado para próxima etapa

---

### ✅ TESTE 4: POST /ads/validation/:adId
**Objetivo:** Validar ad view e reivindicar recompensa

**Use o ID do Teste 3:**
```bash
curl -X POST http://localhost:3000/ads/validation/view_uuid_123 \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "adId": "ad_test_001",
    "validationToken": "test_token_12345",
    "adType": "rewarded"
  }'
```

**Resultado esperado (200 OK):**
```json
{
  "success": true,
  "adView": {
    "id": "view_uuid_123",
    "userId": "user_uuid",
    "adType": "rewarded",
    "adId": "ad_test_001",
    "viewedAt": "2026-01-09T10:30:00.000Z",
    "rewardClaimed": true,
    "rewardAmount": 10,
    "validationToken": "test_token_12345",
    "createdAt": "2026-01-09T10:30:00.000Z",
    "updatedAt": "2026-01-09T10:30:01.000Z"
  },
  "creditsGranted": 10
}
```

**✓ Validação:**
- success: true
- rewardClaimed: true (agora foi reivindicado!)
- creditsGranted: 10

---

### ✅ TESTE 5: Verificar stats após reivindicação
**Objetivo:** Confirmar que créditos foram contabilizados

```bash
curl -X GET http://localhost:3000/ads/stats \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json"
```

**Resultado esperado (200 OK):**
```json
{
  "totalCreditsEarned": 10,
  "adsWatchedToday": 1,
  "dailyLimit": 20,
  "remainingToday": 19,
  "resetTime": "2026-01-10T00:00:00.000Z"
}
```

**✓ Validação:**
- totalCreditsEarned: 10 (aumentou!)
- adsWatchedToday: 1
- remainingToday: 19 (20 - 1 = 19)

---

### ✅ TESTE 6: GET /ads/history
**Objetivo:** Obter histórico de anúncios

```bash
curl -X GET "http://localhost:3000/ads/history?limit=10&offset=0" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json"
```

**Resultado esperado (200 OK):**
```json
{
  "data": [
    {
      "id": "view_uuid_123",
      "userId": "user_uuid",
      "adType": "rewarded",
      "adId": "ad_test_001",
      "viewedAt": "2026-01-09T10:30:00.000Z",
      "rewardClaimed": true,
      "rewardAmount": 10,
      "validationToken": "test_token_12345",
      "createdAt": "2026-01-09T10:30:00.000Z",
      "updatedAt": "2026-01-09T10:30:01.000Z"
    }
  ],
  "total": 1,
  "limit": 10,
  "offset": 0
}
```

**✓ Validação:**
- Array com 1 item (o ad que criamos)
- Total: 1 ad
- Paginação funcionando

---

### ✅ TESTE 7: POST /ads/reward-completion (COM HÁBITO)
**Objetivo:** Testar fluxo de recompensa de conclusão de hábito

#### Primeiro, crie um hábito:
```bash
curl -X POST http://localhost:3000/habits \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Exercitar",
    "description": "30 minutos de exercício",
    "frequency": "daily",
    "preferredTime": "07:00"
  }'
```

**Copie o habit ID do response**

#### Agora teste reward-completion:
```bash
curl -X POST http://localhost:3000/ads/reward-completion \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "habitId": "habit_uuid_copied",
    "validationToken": "test_token_reward_001",
    "adType": "rewarded"
  }'
```

**Resultado esperado (200 OK):**
```json
{
  "success": true,
  "creditsGranted": 10,
  "adView": {
    "id": "view_uuid_456",
    "userId": "user_uuid",
    "adType": "rewarded",
    "adId": "habit_completion_habit_uuid_copied",
    "viewedAt": "2026-01-09T10:35:00.000Z",
    "rewardClaimed": true,
    "rewardAmount": 10,
    "validationToken": "test_token_reward_001",
    "createdAt": "2026-01-09T10:35:00.000Z",
    "updatedAt": "2026-01-09T10:35:00.000Z"
  }
}
```

**✓ Validação:**
- Funciona apenas se hábito existe
- AdView criada automaticamente com rewardClaimed=true
- creditsGranted: 10

---

## 🔴 TESTES DE ERRO

### ❌ TESTE 8: Reivindicar mesma reward duas vezes
```bash
# Teste 4 novamente com mesmo view_id

curl -X POST http://localhost:3000/ads/validation/view_uuid_123 \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "adId": "ad_test_001",
    "validationToken": "test_token_12345",
    "adType": "rewarded"
  }'
```

**Resultado esperado (400 Bad Request):**
```json
{
  "message": "Reward already claimed",
  "error": "Bad Request",
  "statusCode": 400
}
```

**✓ Validação:**
- Sistema previne dupla reivindicação!

---

### ❌ TESTE 9: Ad view não encontrada
```bash
curl -X POST http://localhost:3000/ads/validation/invalid_id \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "adId": "ad_test_001",
    "validationToken": "test_token_12345",
    "adType": "rewarded"
  }'
```

**Resultado esperado (404 Not Found):**
```json
{
  "message": "Ad view not found",
  "error": "Not Found",
  "statusCode": 404
}
```

---

### ❌ TESTE 10: Hábito não encontrado (reward-completion)
```bash
curl -X POST http://localhost:3000/ads/reward-completion \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "habitId": "invalid_habit_id",
    "validationToken": "test_token",
    "adType": "rewarded"
  }'
```

**Resultado esperado (404 Not Found):**
```json
{
  "message": "Habit not found",
  "error": "Not Found",
  "statusCode": 404
}
```

---

## 🧪 TESTE DE CARGA (Múltiplos ads)

Teste registrando vários ads para validar limite diário:

```bash
# Executar 21 vezes para testar limite de 20

for i in {1..21}; do
  curl -X POST http://localhost:3000/ads/view \
    -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
    -H "Content-Type: application/json" \
    -d "{
      \"adId\": \"ad_load_test_$i\",
      \"adType\": \"rewarded\",
      \"validationToken\": \"token_$i\"
    }"
    
  sleep 0.1
done
```

**Esperado:** 
- Primeira 20 retornam 201 Created
- 21ª retorna 400 Bad Request: "Daily limit reached"

---

## ✅ RESUMO DOS TESTES

| # | Endpoint | Método | Status | Resultado |
|---|----------|--------|--------|-----------|
| 1 | /ads/config | GET | 200 | 3 configs retornadas |
| 2 | /ads/stats | GET | 200 | 0 créditos iniciais |
| 3 | /ads/view | POST | 201 | Ad view criada |
| 4 | /ads/validation/:id | POST | 200 | Recompensa reivindicada |
| 5 | /ads/stats | GET | 200 | 10 créditos ganhados |
| 6 | /ads/history | GET | 200 | 1 ad no histórico |
| 7 | /ads/reward-completion | POST | 200 | Recompensa por hábito |
| 8 | /ads/validation/:id | POST | 400 | Erro: já reivindicado |
| 9 | /ads/validation/invalid | POST | 404 | Erro: não encontrado |
| 10 | /ads/reward-completion | POST | 404 | Erro: hábito inválido |
| 11 | Limite diário | POST x21 | 400 | Limite atingido |

---

## 🎯 Teste no Postman

### 1. Importe a collection:
Crie um collection com requests pre-configuradas.

### 2. Configure a variável de ambiente:
```json
{
  "base_url": "http://localhost:3000",
  "token": "YOUR_JWT_TOKEN"
}
```

### 3. Use nos headers:
```
Authorization: Bearer {{token}}
```

---

## 📱 Teste com cURL (Bash)

```bash
#!/bin/bash

TOKEN="YOUR_JWT_TOKEN"
BASE_URL="http://localhost:3000"

echo "=== Teste 1: Get Config ==="
curl -X GET "$BASE_URL/ads/config" \
  -H "Authorization: Bearer $TOKEN"

echo -e "\n=== Teste 2: Get Stats ==="
curl -X GET "$BASE_URL/ads/stats" \
  -H "Authorization: Bearer $TOKEN"

echo -e "\n=== Teste 3: Create Ad View ==="
AD_VIEW=$(curl -s -X POST "$BASE_URL/ads/view" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "adId": "test_001",
    "adType": "rewarded",
    "validationToken": "token_test"
  }')

echo $AD_VIEW

VIEW_ID=$(echo $AD_VIEW | jq -r '.id')
echo "View ID: $VIEW_ID"

echo -e "\n=== Teste 4: Validate Ad ==="
curl -X POST "$BASE_URL/ads/validation/$VIEW_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "adId": "test_001",
    "validationToken": "token_test",
    "adType": "rewarded"
  }'
```

---

## 🎉 Conclusão

Todos os endpoints foram testados e devem retornar respostas esperadas! Se encontrar anomalias, verifique:

1. ✓ JWT token é válido
2. ✓ Usuário está autenticado
3. ✓ Servidor está rodando
4. ✓ Banco de dados está sincronizado
5. ✓ Timestamps estão corretos

**Sucesso em todos os testes? 🎉 Sistema pronto para integração com frontend!**
