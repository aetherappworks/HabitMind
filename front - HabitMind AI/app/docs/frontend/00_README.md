# 🎨 HabitMind AI - Frontend Development Guide

**Guia Completo para Desenvolver o App Frontend**

---

## 🎯 O que é HabitMind AI?

Um aplicativo mobile inteligente para rastreamento de hábitos com análise por IA e monetização.

### Características Principais
- ✅ **Rastreamento de Hábitos** - Registre seus hábitos diários e veja o progresso
- ✅ **Check-ins** - Marque quando completou cada hábito
- ✅ **Análise com IA** - Receba insights e sugestões personalizadas
- ✅ **Sistema de Créditos** - Ganhe créditos com anúncios e assinatura
- ✅ **Internacionalização** - Suporte a 3 idiomas (PT-BR, EN-US, ES-ES)
- ✅ **Autenticação** - Login seguro com JWT

---

## 📚 Documentação

Escolha o que você precisa:

### 🚀 Para Começar (Recomendado)
1. **[01_FRONTEND_GUIDE.md](01_FRONTEND_GUIDE.md)** - Guia de integração
2. **[02_DELIVERABLES.md](02_DELIVERABLES.md)** - Funcionalidades a implementar

### 📖 Para Referência
- **Backend API**: http://localhost:3000/api/docs (Swagger)
- **API Completa**: `/docs/api/API_REFERENCE.md`
- **Exemplos de Testes**: `/docs/TESTING_GUIDE_ADS.md`

---

## 🏗️ Arquitetura

```
Frontend (React Native / Web)
    ↓
HTTP / REST API
    ↓
Backend NestJS (localhost:3000)
    ↓
PostgreSQL Database
```

### Stack do Backend (Já Implementado)
- **NestJS** - Framework Node.js
- **PostgreSQL** - Banco de dados
- **JWT** - Autenticação
- **Prisma** - ORM
- **OpenAPI/Swagger** - Documentação automática

---

## 🔑 Conceitos-Chave

### Autenticação
- Login com email/senha
- Token JWT retornado
- Token válido por 24 horas
- Renovar após expiração

### Usuários
- Profile com nome, email, plano (free/premium)
- Plano free: limite diário de créditos
- Plano premium: limite horário maior

### Hábitos
- Cada usuário pode ter múltiplos hábitos
- Cada hábito tem check-ins (registros diários)
- Check-ins têm status: pending, completed, skipped

### Créditos & Monetização
- Ganhar créditos visualizando anúncios
- Cada tipo de anúncio dá diferente valor
- Limite diário por tipo
- Plano premium: mais créditos/hora

### IA & Insights
- Análise de padrões de hábitos
- Sugestões de melhorias
- Previsões de sucesso

---

## 🚀 Quick Start

### 2. Backend Já Está Rodando! ✅

**Backend está configurado e rodando em:** http://localhost:3000

- **API Swagger:** http://localhost:3000/api/docs
- **Base URL:** http://localhost:3000
- **Autenticação:** JWT Bearer Token
- **Status:** ✅ Pronto para integração

*Nenhuma configuração adicional necessária!*

### 2. Primeiros Passos
```bash
# 1. Registrar usuário
POST /auth/register
  email: "user@example.com"
  name: "John Doe"
  password: "Password123!"

# 2. Login
POST /auth/login
  email: "user@example.com"
  password: "Password123!"

# 3. Criar hábito
POST /habits
  Authorization: Bearer <token>
  title: "Exercitar"
  frequency: "daily"
```

### 3. Ver Swagger Live
Acesse http://localhost:3000/api/docs e teste todos os endpoints!

---

## 📊 Funcionalidades Implementadas

### ✅ Fase 1: Core (Completo v0.1.0)
- [x] Autenticação JWT
- [x] Gerenciamento de usuários
- [x] Sistema de hábitos
- [x] Check-ins
- [x] Análise com IA

### ✅ Fase 2: Monetização por Ads (Completo v0.2.0)
- [x] 3 tipos de anúncios (rewarded, banner, interstitial)
- [x] Sistema de créditos
- [x] Limite diário
- [x] Proteção contra fraude
- [x] 6 endpoints de ads

### 🔄 Fase 3: Google Play Billing (Em Desenvolvimento)
- [ ] Integração com Google Play
- [ ] Planos de assinatura
- [ ] Validação de compras
- [ ] Gerenciamento de licença

### 📋 Fase 4: Analytics (Planejado)
- [ ] Dashboard de estatísticas
- [ ] Gráficos de progresso
- [ ] Relatórios de uso

---

## 🔌 API Base URL

| Ambiente | URL |
|----------|-----|
| **Desenvolvimento** | `http://localhost:3000` |
| **Staging** | `https://staging-api.habitsmind.com` |
| **Produção** | `https://api.habitsmind.com` |

---

## 🎬 Próximos Passos

### Para Frontend Dev Começar
1. Leia [01_FRONTEND_GUIDE.md](01_FRONTEND_GUIDE.md) (20 min)
2. Veja [02_DELIVERABLES.md](02_DELIVERABLES.md) (10 min)
3. Comece a implementar!

### Para QA Testar
1. Suba o backend: `npm run start:dev`
2. Acesse Swagger: http://localhost:3000/api/docs
3. Use [../TESTING_GUIDE_ADS.md](../TESTING_GUIDE_ADS.md) para exemplos

### Para Arquiteto/Tech Lead
1. Consulte [../architecture/](../architecture/)
2. Revise [../CHANGELOG_ADS_v0.2.0.md](../CHANGELOG_ADS_v0.2.0.md)

---

## 📞 Suporte

**Dúvidas sobre:**
- **Setup**: Veja `npm run start:dev`
- **Endpoints**: Veja Swagger em http://localhost:3000/api/docs
- **Tipos TypeScript**: Veja [01_FRONTEND_GUIDE.md](01_FRONTEND_GUIDE.md)
- **Testes**: Veja [../TESTING_GUIDE_ADS.md](../TESTING_GUIDE_ADS.md)

---

**Versão**: v0.2.0 (Janeiro 2026)  
[📚 Ver Toda Documentação](../) | [🔌 Guia de Integração →](01_FRONTEND_GUIDE.md)
