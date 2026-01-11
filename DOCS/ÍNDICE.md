# 📑 Índice Completo - HabitMind AI

Guia de navegação rápida por toda a documentação.

## 🏠 Página Principal
- [README.md](README.md) - Visão geral do projeto e quick start

---

## 🔐 BACKEND - NestJS

### 01 - Documentação Técnica

#### [Arquitetura Geral](BACKEND/01_TECNICO/00_ARQUITETURA_GERAL.md)
- 📋 Visão Geral
- 🎯 Objetivos Arquiteturais
- 📦 Estrutura de Módulos (src/)
- 🗄️ Modelo de Dados (User, Habit, HabitLog, AIInsight, AdView, AdConfig)
- 🔄 Fluxos de Dados Principais
- 🔐 Segurança
- 📡 Padrões de API
- 🧵 Conceitos-Chave (CUID, Soft Deletes, Rate Limiting, Índices)
- 🚀 Stack Tecnológico
- 📊 Diagrama de Dependências de Módulos
- 🔄 Ciclo de Vida de Request
- 📝 Próximos Passos para Escalabilidade

#### [Módulos Detalhado](BACKEND/01_TECNICO/01_MODULOS_DETALHADO.md)
- 🔐 Auth Module
  - Endpoints: `/auth/register`, `/auth/login`
  - Fluxo de autenticação
  - Tecnologias (JWT, Passport, bcrypt)
  - Segurança
- 👤 Users Module
  - Endpoints: `GET/PUT /users/me`, `PUT /users/me/password`
- 🎯 Habits Module
  - Endpoints: CRUD de hábitos, check-ins, estatísticas
  - Sub-módulos: Habits Service, Checkins Service
- 🤖 AI Module
  - Endpoints: análise por hábito, análise geral
  - Features: Pattern Analysis, Time Suggestion, Encouragement
  - Algoritmo de análise
- 💳 Billing Module
  - Endpoints: créditos, recarga, histórico
  - Tipos de créditos
  - Regras de negócio
- 📺 Ads Module
  - Endpoints: view, reward-completion, config, stats
  - Tipos de anúncios
  - Fluxo de validação
- 🌍 I18n Module
  - Idiomas suportados (pt-br, en)
  - Exemplo de locale
  - Uso em serviços
- 💾 Prisma Module
  - Gerenciamento de BD
  - Uso em serviços
  - Migrations (dev, status, reset)
- 🔧 Common Module
  - Guards, Filters, Pipes, Interceptors, Decorators
- 📊 Relações entre Módulos

### 02 - Documentação Funcional

#### [Guia Funcional](BACKEND/02_FUNCIONAL/00_GUIA_FUNCIONAL.md)
- 🎯 O que é HabitMind AI?
- 👥 Personas e Casos de Uso
  - Novo Usuário (João)
  - Criando Hábito
  - Registrando Check-in
  - Consultando Estatísticas
  - Gerenciando Créditos
  - Análises com IA
- 🔄 Fluxos de Negócio Principais
  - Ganhar Créditos Assistindo Anúncios
  - IA Gerando Insights Automáticos
  - Limite de Créditos Diários
- 💡 Regras de Negócio Importantes
  - Autenticação
  - Hábitos
  - Créditos
  - Anúncios
  - IA & Insights
- 🎓 Exemplos de Casos Reais
  - Caso 1: João com Hábito "Academia"
  - Caso 2: Maria com Múltiplos Hábitos
- 🔮 Fluxos Futuros
  - IAP (In-App Purchases)
  - Background Jobs com Queue
  - Social Features
  - Advanced Analytics

### 03 - Setup e Instalação

#### [Setup Backend](BACKEND/03_SETUP_E_INSTALACAO/00_SETUP.md)
- ⚙️ Pré-requisitos
  - Obrigatório: Node.js, npm, PostgreSQL, Git
  - Verificar instalação
- 📥 Instalação Passo a Passo
  1. Clonar repositório
  2. Instalar dependências
  3. Configurar variáveis de ambiente (.env)
  4. Criar banco de dados PostgreSQL
  5. Executar migrations do Prisma
  6. Gerar Prisma Client
  7. Popular banco com dados de teste
  8. Iniciar servidor (dev, prod, debug)
- ✅ Verificações Pós-Instalação
  - Testar API
  - Acessar Swagger UI
  - Testar autenticação
  - Usar Prisma Studio
- 🐳 Docker Setup (Opcional)
- 🧪 Rodando Testes
- 📊 Comandos Úteis
  - Prisma: status, migrate, reset, studio, validate
  - Desenvolvimento: format, lint, build
- 🔧 Troubleshooting
  - Module not found
  - ECONNREFUSED (BD não conecta)
  - EADDRINUSE (porta em uso)
  - JSON parsing error
  - JWT malformed
- 📚 Próximas Etapas
- 📞 Suporte

### 04 - Referência de API

#### [API Completa](BACKEND/04_API_REFERENCE/00_API_COMPLETA.md)
- 🌐 Base URL
- 🔐 Autenticação (Bearer Token)
- 📋 Índice de Endpoints
- 🔐 Auth Endpoints
  - POST `/auth/register` - Registrar
  - POST `/auth/login` - Logar
- 👤 Users Endpoints
  - GET `/users/me` - Dados atuais
  - PUT `/users/me` - Atualizar dados
  - PUT `/users/me/password` - Atualizar senha
- 🎯 Habits Endpoints
  - POST `/habits` - Criar
  - GET `/habits` - Listar
  - GET `/habits/:id` - Detalhes
  - PUT `/habits/:id` - Editar
  - DELETE `/habits/:id` - Deletar
  - POST `/habits/:id/checkin` - Registrar conclusão
  - GET `/habits/:id/stats` - Estatísticas
  - GET `/habits/:id/logs` - Histórico
- 🤖 AI Endpoints
  - GET `/ai/analysis/:habitId` - Análise por hábito
  - GET `/ai/analysis` - Análise geral
- 💳 Billing Endpoints
  - GET `/billing/credits` - Saldo
  - GET `/billing/history` - Histórico
  - POST `/billing/credits/reload` - Recarregar
- 📺 Ads Endpoints
  - POST `/ads/view` - Registrar visualização
  - POST `/ads/reward-completion` - Validar recompensa
  - GET `/ads/stats` - Estatísticas
  - GET `/ads/config` - Configuração
- 📊 Status Codes
- 🌍 Query Parameters Comuns
- 🔄 Exemplos com cURL
- 📖 Links Úteis

---

## 📱 FRONTEND - React Native

### 01 - Documentação Técnica

#### [Arquitetura Técnica](FRONTEND/01_TECNICO/00_ARQUITETURA_TECNICA.md)
- 📋 Visão Geral
- 🎯 Objetivos Arquiteturais
- 📦 Estrutura de Pasta
  - Componentes, Screens, Navigation
  - Services, Store, Styles, Utils
- 🔄 Fluxo de Dados (MVVM + Zustand)
- 📱 Tech Stack (React Native, Expo, TypeScript, etc)
- 🧩 Componentes Principais
  - Button, Input, HabitCard, CheckInModal, AIAnalysisModal
- 🏪 State Management (Zustand)
  - authStore, habitStore, creditStore
- 🔌 Services (API Layer)
  - apiClient (Axios), habitService, authService, etc
- 🧭 Navegação (React Navigation)
  - RootNavigator, AppNavigator, AuthNavigator
- 🎨 Sistema de Estilos
  - colors.ts, typography.ts, spacing.ts, theme.ts
- 🔐 Autenticação e Segurança
  - SecureStore, JWT handling
- 📊 Ciclo de Vida de Componente
- 🚀 Performance
  - Lazy loading, memoization, FlatList optimization
- 🧪 Estrutura de Testes
- 📊 Padrões de Dados (Models)
- 🔄 Fluxos de Dados Principais
- 🎬 Animações (Reanimated)

### 02 - Documentação Funcional

#### [Guia Funcional Frontend](FRONTEND/02_FUNCIONAL/00_GUIA_FUNCIONAL.md)
- 🎯 O que faz o Frontend?
- 👥 Personas e Jornadas
  - João (Novo Usuário)
  - Criando Hábito
  - Registrando Conclusão
  - Ganhar Créditos com Anúncio
  - Consultando Estatísticas
  - Gerenciando Créditos
  - Perfil do Usuário
- 🔄 Fluxos de Dados Principais
  - Autenticação Completa
  - Criar e Completar Hábito
  - Ganhar Créditos por Anúncio
- 💡 Regras de Negócio
  - Validações (Email, Senha, Hábito)
  - Limites (Anúncios/dia, Créditos/dia)
  - Comportamentos (Pull-to-refresh, Swipe, etc)
- 🎓 Exemplos de Casos Reais
  - Maria com 3 hábitos
  - Pedro gerenciando limite de anúncios
- 🔮 Fluxos Futuros
  - Notificações Push
  - Compartilhamento
  - Social/Competições
  - IAP

### 03 - Setup e Instalação

#### [Setup Frontend](FRONTEND/03_SETUP_E_INSTALACAO/00_SETUP.md)
- ⚙️ Pré-requisitos
  - Node.js, npm, Expo CLI, Git
  - Por plataforma: iOS, Android, Web
- 📥 Instalação Passo a Passo
  1. Verificar pré-requisitos
  2. Instalar Expo CLI
  3. Clonar repositório
  4. Instalar dependências
  5. Configurar .env
  6. Configurar backend
  7. Iniciar app (4 opções)
- ✅ Verificações Pós-Instalação
  - Testar carregamento
  - Testar autenticação
  - Testar criar hábito
  - Verificar logs
- 🔧 Troubleshooting
  - Network request failed
  - Port already in use
  - Module not found
  - Emulador não abre
  - Native module errors
  - Image not loading
- 📱 Testar em Dispositivo Físico
  - iOS
  - Android
- 🧪 Rodando Testes
- 📊 Comandos Úteis
  - Expo, npm, desenvolvimento
- 🌐 Acessar API Localmente
- 📚 Próximas Etapas
- 🐛 Debug Mode
  - React Native Debugger
  - Browser DevTools
  - Logs em tempo real
- 📞 Suporte

### 04 - Componentes e Telas

#### [Componentes e Telas](FRONTEND/04_COMPONENTES_E_TELAS/00_COMPONENTES_TELAS.md)
- 📑 Índice
- 🧩 Componentes Reutilizáveis
  - Button (primário, secundário, danger, outline)
  - Input (email, senha, multiline)
  - HabitCard (com streak, taxa de conclusão)
  - CheckInModal (registrar conclusão)
  - HabitModal (criar/editar hábito)
  - AIAnalysisModal (insights com IA)
  - Toast (notificações)
- 📱 Telas Principais
  - LoginScreen (autenticação)
  - RegisterScreen (criação de conta)
  - DashboardScreen (lista de hábitos)
  - HabitDetailScreen (detalhes do hábito)
  - StatisticsScreen (dashboard geral)
  - ProfileScreen (dados do usuário)
  - CreditsScreen (gerenciamento de créditos)
- 🔄 Padrões de Implementação
  - Usando Zustand Store
  - Tratamento de Erros
  - Validação de Formulário
  - Navegação Condicional
  - Otimização com useFocusEffect

---

## 🗺️ Mapa Rápido de Localização

### Por Tópico

**Autenticação**
- Backend: [Auth Module](BACKEND/01_TECNICO/01_MODULOS_DETALHADO.md#-auth-module)
- Frontend: [LoginScreen](FRONTEND/04_COMPONENTES_E_TELAS/00_COMPONENTES_TELAS.md#loginscreentsx)
- API: [Auth Endpoints](BACKEND/04_API_REFERENCE/00_API_COMPLETA.md#-auth)

**Hábitos**
- Backend: [Habits Module](BACKEND/01_TECNICO/01_MODULOS_DETALHADO.md#-habits-module)
- Frontend: [HabitCard, DashboardScreen](FRONTEND/04_COMPONENTES_E_TELAS/00_COMPONENTES_TELAS.md#habitcardtsx)
- API: [Habits Endpoints](BACKEND/04_API_REFERENCE/00_API_COMPLETA.md#-habits)

**Créditos**
- Backend: [Billing Module](BACKEND/01_TECNICO/01_MODULOS_DETALHADO.md#-billing-module)
- Frontend: [CreditsScreen](FRONTEND/04_COMPONENTES_E_TELAS/00_COMPONENTES_TELAS.md#creditsscreentsx)
- API: [Billing Endpoints](BACKEND/04_API_REFERENCE/00_API_COMPLETA.md#-billing)

**Anúncios**
- Backend: [Ads Module](BACKEND/01_TECNICO/01_MODULOS_DETALHADO.md#-ads-module)
- API: [Ads Endpoints](BACKEND/04_API_REFERENCE/00_API_COMPLETA.md#-ads)
- Fluxo: [Ganhar Créditos](BACKEND/02_FUNCIONAL/00_GUIA_FUNCIONAL.md#fluxo-1-ganhar-créditos-assistindo-anúncios)

**IA e Análises**
- Backend: [AI Module](BACKEND/01_TECNICO/01_MODULOS_DETALHADO.md#-ai-module)
- Frontend: [AIAnalysisModal](FRONTEND/04_COMPONENTES_E_TELAS/00_COMPONENTES_TELAS.md#aianalysismodaltsx)
- API: [AI Endpoints](BACKEND/04_API_REFERENCE/00_API_COMPLETA.md#-ai)

### Por Atividade

**Implementar novo endpoint**
1. Escolha o módulo: [Backend Modules](BACKEND/01_TECNICO/01_MODULOS_DETALHADO.md)
2. Adicione controller method
3. Adicione service logic
4. Documente em [API Reference](BACKEND/04_API_REFERENCE/00_API_COMPLETA.md)

**Criar nova tela**
1. Estude [Architecture Frontend](FRONTEND/01_TECNICO/00_ARQUITETURA_TECNICA.md)
2. Crie screen em `src/screens/`
3. Use [Padrões de Implementação](FRONTEND/04_COMPONENTES_E_TELAS/00_COMPONENTES_TELAS.md#-padrões-de-implementação)
4. Integre em [Navigation](FRONTEND/01_TECNICO/00_ARQUITETURA_TECNICA.md#-navegação-com-react-navigation)

**Debugar erro**
1. Verifique logs do backend: [Backend Setup > Verificações](BACKEND/03_SETUP_E_INSTALACAO/00_SETUP.md#-verificações-pós-instalação)
2. Verifique logs do frontend: [Frontend Setup > Debug Mode](FRONTEND/03_SETUP_E_INSTALACAO/00_SETUP.md#-debug-mode)
3. Consulte [API Reference](BACKEND/04_API_REFERENCE/00_API_COMPLETA.md) para status codes

**Entender um fluxo**
1. Frontend: [Guia Funcional Frontend](FRONTEND/02_FUNCIONAL/00_GUIA_FUNCIONAL.md)
2. Backend: [Guia Funcional Backend](BACKEND/02_FUNCIONAL/00_GUIA_FUNCIONAL.md)

---

## 🔍 Busca Rápida por Palavra-chave

| Palavra-chave | Localização |
|---------------|-----------|
| JWT | [Auth Module](BACKEND/01_TECNICO/01_MODULOS_DETALHADO.md#-auth-module) |
| Zustand | [Architecture Frontend](FRONTEND/01_TECNICO/00_ARQUITETURA_TECNICA.md#-state-management-com-zustand) |
| Prisma | [Prisma Module](BACKEND/01_TECNICO/01_MODULOS_DETALHADO.md#-prisma-module) |
| Validation | [Frontend Setup](FRONTEND/02_FUNCIONAL/00_GUIA_FUNCIONAL.md#-validações) |
| Rate Limit | [Ads Module](BACKEND/01_TECNICO/01_MODULOS_DETALHADO.md#-ads-module) |
| I18n | [I18n Module](BACKEND/01_TECNICO/01_MODULOS_DETALHADO.md#-i18n-module) |
| SecureStore | [Frontend Architecture](FRONTEND/01_TECNICO/00_ARQUITETURA_TECNICA.md#-autenticação-e-segurança) |
| FlatList | [Frontend Architecture](FRONTEND/01_TECNICO/00_ARQUITETURA_TECNICA.md#-performance) |
| Modal | [Componentes e Telas](FRONTEND/04_COMPONENTES_E_TELAS/00_COMPONENTES_TELAS.md#checkinmodaltsx) |
| Testing | [Backend Setup](BACKEND/03_SETUP_E_INSTALACAO/00_SETUP.md#-rodando-testes) |

---

## 📚 Documentação Externa

- [NestJS Docs](https://docs.nestjs.com/)
- [Prisma Docs](https://www.prisma.io/docs/)
- [React Native Docs](https://reactnative.dev/)
- [Expo Docs](https://docs.expo.dev/)
- [Zustand GitHub](https://github.com/pmndrs/zustand)
- [React Navigation Docs](https://reactnavigation.org/)

---

**Última atualização**: Janeiro 2026
