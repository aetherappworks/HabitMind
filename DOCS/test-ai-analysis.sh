#!/bin/bash

# 🤖 HabitMind AI - Script de Teste de Análise Profunda
# Data: 11 de Janeiro de 2026
# Uso: bash test-ai-analysis.sh

API_URL="http://localhost:3000"
TOKEN="seu_token_jwt_aqui"  # Substituir com token válido
HABIT_ID="seu_habit_id_aqui"  # Substituir com ID válido

echo "🚀 Testando nova análise de IA profunda..."
echo ""

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}1️⃣  Recuperando informações do hábito...${NC}"
curl -X GET "$API_URL/habits/$HABIT_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" | jq '.'

echo ""
echo -e "${BLUE}2️⃣  Obtendo estatísticas do check-in...${NC}"
curl -X GET "$API_URL/habits/$HABIT_ID/stats" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" | jq '.'

echo ""
echo -e "${YELLOW}3️⃣  Solicitando análise profunda (padrão)...${NC}"
ANALYSIS_RESPONSE=$(curl -X POST "$API_URL/ai/analyze" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"habitId\": \"$HABIT_ID\",
    \"type\": \"pattern_analysis\",
    \"context\": \"Morning Exercise\"
  }")

echo "$ANALYSIS_RESPONSE" | jq '.'
ANALYSIS_ID=$(echo "$ANALYSIS_RESPONSE" | jq -r '.id')

echo ""
echo -e "${GREEN}✅ Análise criada com ID: $ANALYSIS_ID${NC}"

echo ""
echo -e "${BLUE}4️⃣  Recuperando análise completa...${NC}"
curl -X GET "$API_URL/ai/insights?habitId=$HABIT_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" | jq '.[0] | {
    type,
    content,
    impact,
    recommendations,
    insights,
    confidenceScore
  }'

echo ""
echo -e "${YELLOW}5️⃣  Testando outros tipos de análise...${NC}"

echo ""
echo -e "${BLUE}  → Análise de Sugestão de Horário${NC}"
curl -X POST "$API_URL/ai/analyze" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"habitId\": \"$HABIT_ID\",
    \"type\": \"time_suggestion\"
  }" | jq '.recommendations'

echo ""
echo -e "${BLUE}  → Análise de Motivação${NC}"
curl -X POST "$API_URL/ai/analyze" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"habitId\": \"$HABIT_ID\",
    \"type\": \"encouragement\"
  }" | jq '.content'

echo ""
echo -e "${BLUE}  → Análise de Ajuste${NC}"
curl -X POST "$API_URL/ai/analyze" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"habitId\": \"$HABIT_ID\",
    \"type\": \"adjustment\"
  }" | jq '.recommendations'

echo ""
echo -e "${GREEN}✅ Testes concluídos!${NC}"
echo ""
echo "📊 Estrutura esperada de resposta:"
echo ""
jq -n '{
  id: "cuid123...",
  userId: "user...",
  habitId: "habit...",
  type: "pattern_analysis",
  content: "Análise detalhada com métricas e padrões...",
  impact: "Impacto na vida do usuário...",
  recommendations: ["Recomendação 1", "Recomendação 2", "..."],
  insights: ["Descoberta 1", "Descoberta 2", "..."],
  confidenceScore: 0.95,
  createdAt: "2026-01-11T10:30:00Z"
}' -c

echo ""
echo "🎯 Campos novos em v1.1:"
echo "  • impact: Descreve impacto real na vida"
echo "  • recommendations: Array de ações recomendadas"
echo "  • insights: Array de descobertas interessantes"
echo "  • confidenceScore: Confiança da análise 0-1"
echo ""
echo "💳 Custo: 3 créditos por análise"
echo ""
