#!/bin/bash

# 🧪 Script de Testes para Internacionalização (i18n)
# Executa testes manuais dos endpoints com diferentes idiomas

BASE_URL="http://localhost:3000/api"
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

echo "════════════════════════════════════════════════════════════════"
echo "🧪 TESTES DE INTERNACIONALIZAÇÃO - HabitMind AI"
echo "════════════════════════════════════════════════════════════════"
echo ""
echo "⏰ Hora: $TIMESTAMP"
echo "📍 Base URL: $BASE_URL"
echo ""

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# ============ TESTE 1: Registro em Português ============
echo -e "${BLUE}════ TESTE 1: Registro em Português ════${NC}"
echo ""
echo "🔵 Criando novo usuário em pt-br..."
RESPONSE=$(curl -s -X POST "$BASE_URL/auth/register?lang=pt-br" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test.pt.'$(date +%s)'@user.com",
    "name": "Usuário Teste PT",
    "password": "senha123456"
  }')

echo "📤 Resposta:"
echo "$RESPONSE" | jq '.' 2>/dev/null || echo "$RESPONSE"
echo ""

# ============ TESTE 2: Erro de Usuário Duplicado em Inglês ============
echo -e "${BLUE}════ TESTE 2: Erro Duplicado em Inglês ════${NC}"
echo ""
echo "🔵 Tentando registrar usuário duplicado em en-us..."
RESPONSE=$(curl -s -X POST "$BASE_URL/auth/register?lang=en-us" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test.pt.'$(date +%s)'@user.com",
    "name": "Usuário Teste PT",
    "password": "senha123456"
  }')

echo "📤 Resposta:"
echo "$RESPONSE" | jq '.' 2>/dev/null || echo "$RESPONSE"
echo ""

# ============ TESTE 3: Login com Credencial Inválida em Espanhol ============
echo -e "${BLUE}════ TESTE 3: Login Inválido em Espanhol ════${NC}"
echo ""
echo "🔵 Tentando login com credencial inválida em es-es..."
RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login?lang=es-es" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "invalido@user.com",
    "password": "weakpass"
  }')

echo "📤 Resposta:"
echo "$RESPONSE" | jq '.' 2>/dev/null || echo "$RESPONSE"
echo ""

# ============ TESTE 4: Fallback para Português (padrão) ============
echo -e "${BLUE}════ TESTE 4: Fallback para Português (sem lang) ════${NC}"
echo ""
echo "🔵 Tentando login sem especificar idioma..."
RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "invalido@user.com",
    "password": "weakpass"
  }')

echo "📤 Resposta:"
echo "$RESPONSE" | jq '.' 2>/dev/null || echo "$RESPONSE"
echo ""

# ============ TESTE 5: Cookie de Idioma ============
echo -e "${BLUE}════ TESTE 5: Detecção via Cookie ════${NC}"
echo ""
echo "🔵 Tentando login com Cookie lang=en-us..."
RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -b "lang=en-us" \
  -d '{
    "email": "invalido@user.com",
    "password": "weakpass"
  }')

echo "📤 Resposta:"
echo "$RESPONSE" | jq '.' 2>/dev/null || echo "$RESPONSE"
echo ""

# ============ RESUMO ============
echo -e "${GREEN}════════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ TESTES CONCLUÍDOS${NC}"
echo -e "${GREEN}════════════════════════════════════════════════════════════════${NC}"
echo ""
echo "📋 O que foi testado:"
echo "  ✅ Registro em português (pt-br)"
echo "  ✅ Erro duplicado em inglês (en-us)"
echo "  ✅ Erro de login em espanhol (es-es)"
echo "  ✅ Fallback para português (padrão)"
echo "  ✅ Detecção via cookie"
echo ""
echo "💡 Próximos testes:"
echo "  - Detecção via header Accept-Language"
echo "  - CRUD de hábitos com diferentes idiomas"
echo "  - Endpoints de IA com i18n"
echo "  - Testes de perfil de usuário"
echo ""
echo "🚀 Para iniciar o servidor:"
echo "  npm run start:dev"
echo ""
