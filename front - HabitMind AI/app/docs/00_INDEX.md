# 📚 HabitMind AI - Documentação Completa

Documentação centralizada para o projeto HabitMind AI React Native.

---

## 📖 Índice Geral

### 🏗️ **[Architecture](./architecture/00_README.md)**
Visão geral da arquitetura, padrões e fluxo de dados.
- [Arquitetura Geral](./architecture/00_README.md)
- [Padrões de Design](./architecture/01_DESIGN_PATTERNS.md)
- [Fluxo de Dados](./architecture/02_DATA_FLOW.md)
- [Estrutura de Pastas](./architecture/03_FOLDER_STRUCTURE.md)

---

### 🔌 **[API](./api/00_README.md)**
Integração com backend, endpoints e cliente HTTP.
- [Overview da API](./api/00_README.md)
- [Referência Completa](./api/API_REFERENCE.md)
- [Autenticação e Segurança](./api/01_AUTHENTICATION.md)
- [Cliente HTTP](./api/02_HTTP_CLIENT.md)

---

### 🎨 **[Frontend](./frontend/00_README.md)**
Componentes, telas e interface do usuário.
- [Overview Frontend](./frontend/00_README.md)
- [Componentes](./frontend/01_COMPONENTS.md)
- [Telas](./frontend/02_SCREENS.md)
- [Padrões UI/UX](./frontend/03_UI_UX_PATTERNS.md)
- [Integração](./frontend/04_FRONTEND_GUIDE.md)
- [Funcionalidades](./frontend/05_DELIVERABLES.md)

---

### 🛠️ **[Development](./development/00_README.md)**
Guia de desenvolvimento, setup e troubleshooting.
- [Setup Inicial](./development/00_README.md)
- [Android Setup](./development/00_ANDROID_SETUP.md)
- [Bug Fixes](./development/01_BUG_FIXES.md)
- [Secure Storage](./development/02_SECURE_STORAGE_FIX.md)
- [TextInput Fix](./development/03_TEXTINPUT_FIX.md)
- [useFocusEffect Fix](./development/04_USEFOCUSEFFECT_FIX.md)
- [Performance](./development/05_PERFORMANCE.md)

---

### 📋 **[State Management](./state-management/00_README.md)**
Zustand stores e gerenciamento de estado global.
- [Overview](./state-management/00_README.md)
- [Auth Store](./state-management/01_AUTH_STORE.md)
- [Habit Store](./state-management/02_HABIT_STORE.md)
- [Best Practices](./state-management/03_BEST_PRACTICES.md)

---

### 🔧 **[Services](./services/00_README.md)**
Serviços, API clients e lógica de negócio.
- [Overview](./services/00_README.md)
- [API Client](./services/01_API_CLIENT.md)
- [Auth Service](./services/02_AUTH_SERVICE.md)
- [Habit Service](./services/03_HABIT_SERVICE.md)

---

### 📱 **[Implementation](./implementation/00_README.md)**
Guias de implementação de features.
- [Checklist](./implementation/00_README.md)
- [Autenticação](./implementation/01_AUTHENTICATION.md)
- [Hábitos CRUD](./implementation/02_HABITS_CRUD.md)
- [Check-ins](./implementation/03_CHECK_INS.md)
- [Sistema de Créditos](./implementation/04_CREDITS_SYSTEM.md)
- [Modal de Hábito](./implementation/05_HABIT_MODAL.md)

---

### 📊 **[Project](./project/00_README.md)**
Informações gerais do projeto.
- [Visão Geral](./project/00_README.md)
- [Funcionalidades](./project/01_FEATURES.md)
- [Tech Stack](./project/02_TECH_STACK.md)
- [Roadmap](./project/03_ROADMAP.md)

---

## 🚀 Quick Links

| Documento | Propósito |
|-----------|----------|
| [README.md](../README.md) | Overview geral |
| [ARCHITECTURE.md](../ARCHITECTURE.md) | Arquitetura técnica |
| [DEVELOPMENT.md](../DEVELOPMENT.md) | Guia de desenvolvimento |

---

## 🎯 Como Usar Esta Documentação

1. **Comece por** → [Project Overview](./project/00_README.md)
2. **Entenda a** → [Architecture](./architecture/00_README.md)
3. **Veja os** → [Components](./frontend/01_COMPONENTS.md)
4. **Consulte** → [API Reference](./api/API_REFERENCE.md)
5. **Resolva erros em** → [Development](./development/00_README.md)

---

## 📊 Estatísticas do Projeto

| Métrica | Valor |
|---------|-------|
| **Componentes** | 5 |
| **Telas** | 7 |
| **Serviços** | 3 |
| **Stores** | 2 |
| **Endpoints API** | 20+ |
| **Linhas de Código** | 2000+ |
| **TypeScript** | 100% |

---

## 🔗 Estrutura de Documentação

```
docs/
├── 00_INDEX.md                      # 👈 Você está aqui
│
├── architecture/                    # Arquitetura e design
│   ├── 00_README.md
│   ├── 01_DESIGN_PATTERNS.md
│   ├── 02_DATA_FLOW.md
│   └── 03_FOLDER_STRUCTURE.md
│
├── api/                             # Backend integration
│   ├── 00_README.md
│   ├── API_REFERENCE.md
│   ├── 01_AUTHENTICATION.md
│   └── 02_HTTP_CLIENT.md
│
├── frontend/                        # UI e componentes
│   ├── 00_README.md
│   ├── 01_COMPONENTS.md
│   ├── 02_SCREENS.md
│   ├── 03_UI_UX_PATTERNS.md
│   ├── 04_FRONTEND_GUIDE.md
│   └── 05_DELIVERABLES.md
│
├── development/                     # Setup e troubleshooting
│   ├── 00_README.md
│   ├── 00_ANDROID_SETUP.md
│   ├── 01_BUG_FIXES.md
│   ├── 02_SECURE_STORAGE_FIX.md
│   ├── 03_TEXTINPUT_FIX.md
│   ├── 04_USEFOCUSEFFECT_FIX.md
│   └── 05_PERFORMANCE.md
│
├── state-management/                # Zustand stores
│   ├── 00_README.md
│   ├── 01_AUTH_STORE.md
│   ├── 02_HABIT_STORE.md
│   └── 03_BEST_PRACTICES.md
│
├── services/                        # API services
│   ├── 00_README.md
│   ├── 01_API_CLIENT.md
│   ├── 02_AUTH_SERVICE.md
│   └── 03_HABIT_SERVICE.md
│
├── implementation/                  # Feature guides
│   ├── 00_README.md
│   ├── 01_AUTHENTICATION.md
│   ├── 02_HABITS_CRUD.md
│   ├── 03_CHECK_INS.md
│   ├── 04_CREDITS_SYSTEM.md
│   └── 05_HABIT_MODAL.md
│
└── project/                         # Project info
    ├── 00_README.md
    ├── 01_FEATURES.md
    ├── 02_TECH_STACK.md
    └── 03_ROADMAP.md
```

---

## 💡 Dicas de Navegação

- Use **Ctrl+F** para buscar conteúdo
- Clique nos links para navegar entre documentos
- Cada seção possui links de volta para o índice
- Documentos estão em **português** 🇧🇷

---

## 🤝 Contribuindo

Ao adicionar nova documentação:
1. Crie o arquivo em seu subcapítulo apropriado
2. Adicione link neste índice
3. Mantenha o padrão de numeração: `00_README.md`, `01_FEATURE.md`, etc.
4. Comece cada arquivo com um breve resumo

---

**Última atualização**: Janeiro 2026  
**Status**: ✅ Completo e produção-ready

[⬆️ Voltar ao Topo](#-habitsmind-ai---documentação-completa)
