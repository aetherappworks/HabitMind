# 🎯 HabitMind AI - Backend NestJS

**Um sistema inteligente de rastreamento de hábitos com IA e monetização**

[![Status](https://img.shields.io/badge/Status-Active-green)](/)
[![Version](https://img.shields.io/badge/Version-v0.2.0-blue)](/)
[![License](https://img.shields.io/badge/License-MIT-green)](/)

---

## 🚀 Início Rápido

### Pré-requisitos
- Node.js 18+
- PostgreSQL 14+
- npm ou yarn

### Instalação
```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env

# Executar migrações
npx prisma migrate dev

# Iniciar em desenvolvimento
npm run start:dev
```

### Acessar Aplicação
- **API**: http://localhost:3000
- **Swagger**: http://localhost:3000/api/docs
- **Prisma Studio**: `npx prisma studio`

---

## 📚 Documentação

Toda a documentação está organizada em **[/docs](docs/)**:

### 🎬 Quick Start
- [ADS_QUICK_START.md](docs/ADS_QUICK_START.md) - Começar em 30 segundos

### 📖 Guias de Implementação
- [Implementação de Monetização por Ads](docs/implementation/05_ADS_MONETIZATION_IMPLEMENTATION.md)
- [Status de Implementação](docs/IMPLEMENTATION_STATUS_ADS.md)
- [Changelog v0.2.0](docs/CHANGELOG_ADS_v0.2.0.md)

### 🧪 Testes
- [Guia Completo de Testes](docs/TESTING_GUIDE_ADS.md)
- [Resumo de Implementação](docs/ADS_IMPLEMENTATION_SUMMARY.md)

### 📋 Referência
- [Organização de Documentação](docs/DOCS_ORGANIZED.md)
- [Documentação Completa](docs/DOCUMENTATION_COMPLETE.md)
- [I18N Implementation](docs/I18N_IMPLEMENTATION_SUMMARY.txt)

### 📁 Estrutura Principal
- [/docs/api](docs/api/) - Referência de API
- [/docs/architecture](docs/architecture/) - Arquitetura do sistema
- [/docs/billing](docs/billing/) - Sistema de créditos e monetização
- [/docs/implementation](docs/implementation/) - Implementações em progresso
- [/docs/planning](docs/planning/) - Planejamento e PRD
- [/docs/setup](docs/setup/) - Setup e instalação

---

## 🏗️ Arquitetura

```
├── src/
│   ├── auth/           # Autenticação JWT
│   ├── users/          # Gerenciamento de usuários
│   ├── habits/         # Hábitos e check-ins
│   ├── ai/             # IA e análises
│   ├── ads/            # 🆕 Sistema de anúncios
│   ├── billing/        # 🔄 Em desenvolvimento
│   ├── i18n/           # Internacionalização
│   ├── common/         # Serviços compartilhados
│   └── prisma/         # ORM Prisma
│
├── prisma/
│   ├── schema.prisma   # Schema do banco
│   └── migrations/     # Histórico de migrações
│
├── docs/               # 📚 Documentação completa
└── test/               # 🧪 Testes
```

---

## 📊 Features Implementadas

### ✅ Core
- [x] Autenticação JWT
- [x] Gerenciamento de Usuários
- [x] Sistema de Hábitos
- [x] Check-ins de Hábitos
- [x] Análise com IA
- [x] Internacionalização (3 idiomas)

### ✅ Monetização
- [x] **Sistema de Anúncios (Google AdMob)**
  - 6 endpoints REST
  - 3 tipos de anúncios (rewarded, banner, interstitial)
  - Limite diário configurável
  - Proteção contra fraude
  
### 🔄 Em Desenvolvimento
- [ ] Google Play Billing (Assinatura)
- [ ] Sistema centralizado de créditos
- [ ] Dashboard de monetização
- [ ] Analytics

---

## 🔌 API Endpoints

### Autenticação
```
POST   /auth/register          Registrar novo usuário
POST   /auth/login             Fazer login
```

### Usuários
```
GET    /users/me               Obter perfil
PUT    /users/me               Atualizar perfil
```

### Hábitos
```
POST   /habits                 Criar hábito
GET    /habits                 Listar hábitos
GET    /habits/:id             Obter hábito específico
PUT    /habits/:id             Atualizar hábito
DELETE /habits/:id             Deletar hábito
```

### Check-ins
```
POST   /habits/:id/checkins                Criar check-in
GET    /habits/:id/checkins                Listar check-ins
GET    /habits/:id/checkins/range          Check-ins por data
```

### IA
```
POST   /ai/analyze             Analisar hábito
GET    /ai/insights            Obter insights
```

### 🆕 Anúncios (Monetização)
```
POST   /ads/view               Registrar visualização
POST   /ads/reward-completion  Recompensa por hábito
POST   /ads/validation/:adId   Validar e reivindicar
GET    /ads/config             Configurações de ads
GET    /ads/stats              Estatísticas do usuário
GET    /ads/history            Histórico paginado
```

---

## 💳 Sistema de Créditos

### Tipos de Anúncios

| Tipo | Créditos | Limite/dia |
|------|----------|-----------|
| 🎬 Rewarded | 10 | 20 ads |
| 📱 Banner | 1 | 50 views |
| 📺 Interstitial | 5 | 10 ads |

**Total máximo/dia: 300 créditos**

---

## 🌍 Internacionalização

Sistema suporta 3 idiomas:
- 🇧🇷 Português (pt-br)
- 🇺🇸 Inglês (en-us)
- 🇪🇸 Espanhol (es-es)

Defina o idioma via query param: `?lang=pt-br`

---

## 🔒 Segurança

- ✅ JWT Authentication em todos endpoints protegidos
- ✅ Validação de entrada com DTOs
- ✅ Rate limiting por dia para ads
- ✅ Proteção contra fraude (5 camadas)
- ✅ SQL Injection prevention (Prisma ORM)
- ✅ CORS configurado

---

## 📦 Stack Tecnológico

- **Framework**: NestJS
- **Banco de Dados**: PostgreSQL + Prisma ORM
- **Autenticação**: JWT
- **Documentação**: Swagger/OpenAPI
- **Validação**: class-validator
- **Internacionalização**: nestjs-i18n
- **TypeScript**: Tipagem completa

---

## 🧪 Testes

### Executar Testes
```bash
# Testes unitários
npm run test

# Testes e2e
npm run test:e2e

# Cobertura
npm run test:cov
```

### Testes de API
Consulte [TESTING_GUIDE_ADS.md](docs/TESTING_GUIDE_ADS.md) para:
- 7 testes funcionais
- 4 testes de erro
- Exemplos cURL e Postman

---

## 📈 Próximas Fases

### FASE 2: Google Play Billing
Integração com Google Play para assinatura premium
- Validação de compras
- Gerenciamento de planos
- Histórico de transações

### FASE 3: Sistema Centralizado de Créditos
- Tabela de ledger de créditos
- Endpoints de saldo e histórico
- Integração com features (AI advice)
- Expiração automática

### FASE 4: Dashboard de Monetização
- Analytics de receita
- Gráficos de retenção
- Cálculos de LTV e ARPU
- Relatórios exportáveis

---

## 🛠️ Desenvolvimento

### Scripts Disponíveis
```bash
npm run start       # Production build
npm run start:dev   # Development com hot reload
npm run build       # Build para produção
npm run test        # Executar testes
npm run lint        # ESLint
npm run format      # Prettier
```

### Estructura de Pasta
```
src/
├── common/         # Guards, filters, decorators, services
├── auth/           # Autenticação
├── users/          # Gerenciamento de usuários
├── habits/         # Hábitos e check-ins
├── ai/             # IA e análises
├── ads/            # Sistema de anúncios
├── i18n/           # Internacionalização
└── prisma/         # ORM Prisma
```

---

## 📝 Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/habitsmind_ai

# JWT
JWT_SECRET=your_super_secret_key
JWT_EXPIRATION=24h

# Rate Limiting
RATE_LIMIT_FREE_CREDITS_DAY=20
RATE_LIMIT_PREMIUM_CREDITS_HOUR=300

# Google Services (Future)
GOOGLE_PLAY_KEY_FILE=path/to/key.json
ADMOB_API_KEY=your_admob_key
```

---

## 🤝 Contribuindo

1. Fork o repositório
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

## 📞 Suporte

Para dúvidas ou problemas:

1. **Documentação**: Consulte a pasta [/docs](docs/)
2. **Testes**: Veja [TESTING_GUIDE_ADS.md](docs/TESTING_GUIDE_ADS.md)
3. **API Docs**: Acesse Swagger em http://localhost:3000/api/docs
4. **Issues**: Abra uma issue no repositório

---

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja [LICENSE](LICENSE) para detalhes.

---

## 👥 Autores

**HabitMind AI Team**

Desenvolvido com ❤️

---

## 🎉 Status

| Componente | Status | Versão |
|-----------|--------|--------|
| Core | ✅ Produção | v0.1.0 |
| Ads | ✅ Produção | v0.2.0 |
| Billing | 🔄 Desenvolvimento | v0.3.0 |
| Analytics | 📋 Planejado | v0.4.0 |

---

**Última atualização**: 09 de Janeiro de 2026

[📚 Ir para Documentação](docs/) | [🚀 Quick Start](docs/ADS_QUICK_START.md) | [🧪 Testes](docs/TESTING_GUIDE_ADS.md)
