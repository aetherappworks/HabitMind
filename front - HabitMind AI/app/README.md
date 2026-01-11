# HabitMind AI - React Native App

Aplicação mobile para rastreamento de hábitos com inteligência artificial, construída com React Native e Expo.

## 🎯 Características

- ✅ **Autenticação JWT** - Login e registro seguro
- ✅ **Gerenciamento de Hábitos** - Criar, editar, deletar hábitos
- ✅ **Sistema de Check-ins** - Registrar conclusão de hábitos
- ✅ **Estatísticas** - Acompanhar progresso e sequências
- ✅ **Sistema de Créditos** - Ganhar créditos completando hábitos
- ✅ **Perfil de Usuário** - Gerenciar informações pessoais
- ✅ **Design Responsivo** - Interface intuitiva e moderna

## 📱 Tech Stack

- **React Native** - Framework mobile
- **Expo** - Ferramenta de desenvolvimento
- **TypeScript** - Tipagem estática
- **Axios** - Cliente HTTP
- **Zustand** - State management
- **React Navigation** - Navegação
- **Day.js** - Manipulação de datas
- **Secure Store** - Armazenamento seguro de tokens

## 🚀 Instalação

### Pré-requisitos

- Node.js 18+
- npm ou yarn
- Expo CLI: `npm install -g expo-cli`

### Setup

```bash
# 1. Instalar dependências
npm install

# 2. Configurar variáveis de ambiente
# Crie um arquivo .env com:
# REACT_APP_API_URL=http://localhost:3000
# REACT_APP_API_TIMEOUT=30000

# 3. Iniciar o app
npm start

# Para iOS
npm run ios

# Para Android
npm run android

# Para Web
npm run web
```

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── Button.tsx
│   ├── Input.tsx
│   └── HabitCard.tsx
├── screens/             # Telas da aplicação
│   ├── auth/
│   │   ├── LoginScreen.tsx
│   │   └── RegisterScreen.tsx
│   ├── habits/
│   │   ├── DashboardScreen.tsx
│   │   ├── CreateHabitScreen.tsx
│   │   └── HabitDetailScreen.tsx
│   └── user/
│       ├── ProfileScreen.tsx
│       └── CreditsScreen.tsx
├── services/            # API e serviços
│   ├── apiClient.ts     # Cliente Axios configurado
│   ├── authService.ts   # Serviço de autenticação
│   └── habitService.ts  # Serviço de hábitos
├── store/               # Estado global (Zustand)
│   ├── authStore.ts
│   └── habitStore.ts
└── navigation/          # Configuração de rotas
    └── RootNavigator.tsx

App.tsx                 # Componente raiz
```

## 🔑 Conceitos-Chave

### Autenticação

Fluxo JWT com token armazenado seguramente:

```
1. Login/Register → POST /auth/login
2. Recebe accessToken
3. Armazena em Secure Store
4. Usa em Authorization header
5. Token válido por 24 horas
```

### API Client (Axios)

Configurado com interceptadores para:
- Adicionar token automaticamente a cada requisição
- Tratar erros 401 (logout automático)
- Timeout padronizado

```typescript
// Exemplo de uso
import { apiClient } from '@services/apiClient';

const response = await apiClient.post('/auth/login', {
  email: 'user@example.com',
  password: 'password123'
});
```

### State Management

Usando Zustand para estado global:

```typescript
// Usar store
const { habits, getHabits, isLoading } = useHabitStore();

// Componente automaticamente rerenderiza quando estado muda
useEffect(() => {
  getHabits();
}, []);
```

### Hábitos

Cada hábito tem:
- `title` - Nome do hábito
- `description` - Descrição opcional
- `category` - Categoria (Saúde, Produtividade, etc)
- `frequency` - daily, weekly ou custom
- `preferredTime` - Hora preferida (opcional)
- `active` - Status ativo/inativo

### Check-ins

Registro de quando um hábito foi completado:
- `status` - completed, pending, skipped
- `date` - Data do check-in
- `notes` - Notas opcionais

## 🔌 Integração com API

A API backend está em `http://localhost:3000`

### Endpoints Principais

**Autenticação**
- `POST /auth/register` - Criar conta
- `POST /auth/login` - Fazer login
- `GET /users/me` - Perfil atual

**Hábitos**
- `GET /habits` - Listar hábitos
- `POST /habits` - Criar hábito
- `GET /habits/:id` - Detalhes
- `PUT /habits/:id` - Atualizar
- `DELETE /habits/:id` - Deletar

**Check-ins**
- `POST /habits/:id/checkins` - Registrar check-in
- `GET /habits/:id/checkins` - Listar check-ins
- `GET /habits/:id/checkins/range` - Check-ins em período

**Créditos**
- `GET /users/credits` - Saldo de créditos
- `POST /users/deduct-credits` - Deduzir créditos

## 🎨 Design System

Cores principais:
- **Primária**: `#6366f1` (Indigo)
- **Sucesso**: `#10b981` (Verde)
- **Perigo**: `#ef4444` (Vermelho)
- **Neutro**: `#1f2937` (Cinza escuro)

## 📝 Scripts Úteis

```bash
# Iniciar Expo
npm start

# Abrir no iOS
npm run ios

# Abrir no Android
npm run android

# Abrir no Web
npm run web

# Rodar testes
npm test

# Limpar cache
expo start --clear
```

## 🔒 Segurança

- Tokens armazenados em Secure Store (não localStorage)
- Interceptadores automáticos de autenticação
- Logout automático em erros 401
- Validação de formulários
- Tipagem TypeScript completa

## 🤝 Contribuindo

1. Crie uma branch: `git checkout -b feature/NovaFeature`
2. Commit suas mudanças: `git commit -m 'Add Nova Feature'`
3. Push para a branch: `git push origin feature/NovaFeature`
4. Abra um Pull Request

## 📄 Licença

MIT

## 📞 Suporte

Para dúvidas ou problemas:
- Consulte a [documentação da API](../docs/api/API_REFERENCE.md)
- Veja o [guia de integração frontend](../docs/frontend/01_FRONTEND_GUIDE.md)
