# 📚 Documentação Completa - HabitMind AI

Bem-vindo à documentação completa do projeto **HabitMind AI**, uma plataforma SaaS de rastreamento de hábitos com inteligência artificial e monetização.

## 🎯 O que é HabitMind AI?

HabitMind AI é uma aplicação mobile que ajuda usuários a:
- ✅ Criar e rastrear hábitos diários
- ✅ Registrar conclusão de hábitos
- ✅ Receber análises com IA sobre padrões de comportamento
- ✅ Ganhar créditos completando hábitos
- ✅ Assistir anúncios para ganhar créditos adicionais

## 📦 Estrutura da Documentação

```
DOCS/
├── README.md (você está aqui)
├── ÍNDICE.md (índice completo)
│
├── BACKEND/
│   ├── 01_TECNICO/
│   │   ├── 00_ARQUITETURA_GERAL.md
│   │   └── 01_MODULOS_DETALHADO.md
│   ├── 02_FUNCIONAL/
│   │   └── 00_GUIA_FUNCIONAL.md
│   ├── 03_SETUP_E_INSTALACAO/
│   │   └── 00_SETUP.md
│   └── 04_API_REFERENCE/
│       └── 00_API_COMPLETA.md
│
└── FRONTEND/
    ├── 01_TECNICO/
    │   └── 00_ARQUITETURA_TECNICA.md
    ├── 02_FUNCIONAL/
    │   └── 00_GUIA_FUNCIONAL.md
    ├── 03_SETUP_E_INSTALACAO/
    │   └── 00_SETUP.md
    └── 04_COMPONENTES_E_TELAS/
        └── 00_COMPONENTES_TELAS.md
```

## 🚀 Quick Start

### Para Desenvolvedores Backend

1. **Setup**: Leia [Backend Setup](BACKEND/03_SETUP_E_INSTALACAO/00_SETUP.md)
   - Instalar Node.js, PostgreSQL
   - Clonar e configurar `.env`
   - Rodar migrations

2. **Entender Arquitetura**: Leia [Arquitetura Backend](BACKEND/01_TECNICO/00_ARQUITETURA_GERAL.md)
   - Módulos NestJS
   - Fluxo de dados
   - Stack tecnológico

3. **Consultar API**: Leia [Referência de API](BACKEND/04_API_REFERENCE/00_API_COMPLETA.md)
   - Todos os endpoints
   - Exemplos com curl
   - Status codes

### Para Desenvolvedores Frontend

1. **Setup**: Leia [Frontend Setup](FRONTEND/03_SETUP_E_INSTALACAO/00_SETUP.md)
   - Instalar Node.js, Expo
   - Clonar e configurar `.env`
   - Iniciar com Expo

2. **Entender Arquitetura**: Leia [Arquitetura Frontend](FRONTEND/01_TECNICO/00_ARQUITETURA_TECNICA.md)
   - Estrutura de pastas
   - State management (Zustand)
   - Fluxo de dados

3. **Componentes**: Leia [Componentes e Telas](FRONTEND/04_COMPONENTES_E_TELAS/00_COMPONENTES_TELAS.md)
   - Componentes reutilizáveis
   - Telas principais
   - Padrões de implementação

### Para Product Managers/Designers

1. **Guia Funcional Frontend**: Leia [Guia Funcional Frontend](FRONTEND/02_FUNCIONAL/00_GUIA_FUNCIONAL.md)
   - Jornadas de usuário
   - Casos de uso reais
   - Fluxos de negócio

2. **Guia Funcional Backend**: Leia [Guia Funcional Backend](BACKEND/02_FUNCIONAL/00_GUIA_FUNCIONAL.md)
   - Regras de negócio
   - Limite de créditos
   - Sistema de anúncios

## 📋 Conteúdo Detalhado

### Backend NestJS

#### 1. Documentação Técnica
- **Arquitetura Geral**: Visão geral de módulos, stack, padrões
- **Módulos Detalhados**: Auth, Users, Habits, AI, Billing, Ads, I18n
- **Banco de Dados**: Schema Prisma, relacionamentos, migrations

#### 2. Documentação Funcional
- **Personas**: João (novo usuário), Maria (múltiplos hábitos)
- **Fluxos de Negócio**: Ganhar créditos, IA analisando padrões
- **Regras de Negócio**: Limites diários, validações, autenticação

#### 3. Setup e Instalação
- **Pré-requisitos**: Node.js, PostgreSQL, npm
- **Passo a Passo**: Instalação, configuração, migrations
- **Troubleshooting**: Problemas comuns e soluções

#### 4. Referência de API
- **Todos os Endpoints**: Auth, Users, Habits, AI, Billing, Ads
- **Estrutura de Requests/Responses**: Com exemplos JSON
- **Status Codes**: Significado e uso
- **Exemplos com cURL**: Para testar na linha de comando

### Frontend React Native

#### 1. Documentação Técnica
- **Arquitetura**: MVVM + Zustand, fluxo de dados
- **Estrutura de Pastas**: Componentes, screens, services, store
- **Tech Stack**: React Native, Expo, TypeScript, Zustand, Axios
- **Performance**: Otimizações, lazy loading

#### 2. Documentação Funcional
- **Personas**: João (novo), Maria (múltiplos hábitos), Pedro (limite de anúncios)
- **Jornadas Detalhadas**: Registro, criação de hábito, check-in, análises
- **Casos de Uso Reais**: Exemplos passo-a-passo

#### 3. Setup e Instalação
- **Pré-requisitos**: Node.js, Expo CLI, emulador
- **Instalação**: Passo-a-passo para Android, iOS e Web
- **Troubleshooting**: Problemas comuns

#### 4. Componentes e Telas
- **Componentes Reutilizáveis**: Button, Input, HabitCard, Modal
- **Telas Principais**: Login, Dashboard, Detalhes, Estatísticas
- **Padrões**: Como usar Zustand, tratamento de erros, validação

## 🔄 Fluxos Principais do Sistema

### 1. Autenticação
```
Usuário → App (tela de login) → API (/auth/login)
→ Backend valida credenciais → Gera JWT token
→ App armazena token seguro → Navega para Dashboard
```

### 2. Criar e Completar Hábito
```
Usuário cria hábito → Formulário validado → POST /habits
→ Backend cria registro → Retorna hábito criado
→ Dias depois: Usuário completa → POST /habits/:id/checkin
→ Backend cria HabitLog → Incrementa streak
```

### 3. Ganhar Créditos com Anúncio
```
Usuário completa hábito → POST /ads/view
→ Backend registra e gera token → App exibe anúncio
→ Usuário assiste completo → POST /ads/reward-completion
→ Backend valida token → Incrementa créditos
→ App mostra "+5 créditos!"
```

### 4. IA Analisando Padrões
```
Usuário abre tela de análises → GET /ai/analysis/:habitId
→ Backend coleta últimos 30 dias de dados
→ Detecta padrões (melhor hora, taxa, etc)
→ Gera insights com IA
→ Retorna insights com confidence score
```

## 🛠️ Stack Tecnológico Completo

### Backend
- **Framework**: NestJS 10.2.10
- **Language**: TypeScript 5.3.3
- **Database**: PostgreSQL 14+
- **ORM**: Prisma 5.7.0
- **Auth**: JWT (11.0.1) + Passport
- **API Docs**: Swagger 7.1.13
- **Testing**: Jest 29.7.0

### Frontend
- **Framework**: React Native 0.73.2
- **Build**: Expo 51.0.0
- **Language**: TypeScript 5.3.0
- **State**: Zustand 4.4.1
- **HTTP**: Axios 1.6.2
- **Navigation**: React Navigation 6.5.11
- **Storage**: Secure Store 12.3.1

## 📊 Modelo de Dados

### Entidades Principais

**User**: Dados de usuário, plano, créditos
**Habit**: Hábito do usuário com frequência e horário
**HabitLog**: Check-in diário de um hábito
**AIInsight**: Análise gerada pela IA
**AdView**: Visualização de anúncio
**AdConfig**: Configuração de tipo de anúncio

Diagrama ER:
```
User ←→ Habit ←→ HabitLog
 ├→ AIInsight
 └→ AdView
 
AdConfig (independente)
```

## 🔐 Segurança

### Backend
- ✅ Bcrypt para hash de senhas (10 rounds)
- ✅ JWT com expiração 24h
- ✅ CORS configurável
- ✅ Validação de entrada com class-validator
- ✅ Proteção SQL injection (Prisma)

### Frontend
- ✅ Token armazenado em SecureStore (nativo)
- ✅ Validação local de entrada
- ✅ HTTPS em produção
- ✅ Sem credenciais em código

## 📈 Escalabilidade Futura

### Backend
- Cache com Redis
- Queue com Bull para jobs assíncronos
- Logging estruturado com Winston
- Monitoring com Prometheus
- Rate limiting por IP
- Soft deletes para auditoria

### Frontend
- Sincronização offline
- Push notifications
- Social features
- In-App Purchases (IAP)
- Biometric authentication

## 🤝 Contribuindo

### Para adicionar feature

1. Criar branch: `git checkout -b feature/nome-da-feature`
2. Fazer changes no backend e/ou frontend
3. Atualizar documentação correspondente
4. Testar localmente
5. Submeter PR com descrição

### Convenções

- **Commits**: `feat:`, `fix:`, `docs:`, `style:`, `refactor:`
- **Branches**: lowercase com hífens
- **PRs**: Descrição clara do que foi feito

## 📞 Contato e Suporte

### Issues
Abra uma issue no GitHub com:
- Descrição clara do problema
- Steps para reproduzir
- Versões (Node, npm, Expo, etc)
- Logs de erro completos

### Documentação
Não encontrou o que procura?
- Verificar [Índice Completo](./ÍNDICE.md)
- Consultar [NestJS Docs](https://docs.nestjs.com/)
- Consultar [React Native Docs](https://reactnative.dev/)
- Consultar [Expo Docs](https://docs.expo.dev/)

## 📚 Recursos Adicionais

### Relacionados ao Backend
- [Prisma Documentation](https://www.prisma.io/docs/)
- [NestJS Guards](https://docs.nestjs.com/guards)
- [JWT Best Practices](https://tools.ietf.org/html/rfc7519)

### Relacionados ao Frontend
- [React Native Navigation](https://reactnavigation.org/)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [Expo Secure Store](https://docs.expo.dev/modules/expo-secure-store/)

## 🗺️ Mapa de Navegação

```
Você quer...                          Leia...

Fazer setup e rodar o projeto
├─ Backend?                           → Backend Setup (03_SETUP)
└─ Frontend?                          → Frontend Setup (03_SETUP)

Entender como funciona
├─ Backend?                           → Arquitetura Backend (01_TECNICO)
└─ Frontend?                          → Arquitetura Frontend (01_TECNICO)

Conhecer os endpoints da API?         → Referência de API (04_API_REFERENCE)

Entender os casos de uso
├─ Backend?                           → Guia Funcional Backend (02_FUNCIONAL)
└─ Frontend?                          → Guia Funcional Frontend (02_FUNCIONAL)

Implementar um componente
├─ Novo endpoint?                     → Módulos Backend (01_TECNICO)
└─ Nova tela?                         → Componentes e Telas (04_COMPONENTES)

Encontrar o código de um recurso?
├─ Usuários?                          → Backend/Users Module
├─ Hábitos?                           → Backend/Habits Module
├─ Login?                             → Frontend/AuthStore
└─ Dashboard?                         → Frontend/DashboardScreen
```

## 📝 Versionamento

- **v0.1.0** (Atual): MVP com autenticação, hábitos, check-ins
- **v0.2.0**: Sistema de ads e monetização
- **v1.0.0**: Production ready
- **v1.1.0**: Social features (sharing, competições)
- **v2.0.0**: Advanced analytics, machine learning

## 📅 Timeline de Desenvolvimento

```
Q1 2024: MVP inicial
Q2 2024: Monetização com ads
Q3 2024: Beta testing
Q4 2024: Lançamento v1.0
Q1 2025: Social features
```

## 📋 Checklist de Desenvolvimento

- [x] Backend setup com NestJS
- [x] Frontend setup com React Native
- [x] Autenticação (JWT)
- [x] Módulo de Hábitos
- [x] Sistema de Créditos
- [x] Sistema de Anúncios
- [x] IA e Análises
- [ ] Testes automatizados
- [ ] Documentação de API completa
- [ ] Deploy em staging
- [ ] Deploy em produção

---

**Última atualização**: Janeiro 2026  
**Status**: Ativo e em desenvolvimento  
**Licença**: MIT
