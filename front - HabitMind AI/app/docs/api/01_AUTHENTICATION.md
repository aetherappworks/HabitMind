# 🔐 Autenticação e Segurança - HabitMind AI

JWT, tokens, e segurança na aplicação.

---

## 📌 Índice da Seção

- [00_README.md](./00_README.md) - Overview
- [API_REFERENCE.md](./API_REFERENCE.md) - Referência completa
- [01_AUTHENTICATION.md](./01_AUTHENTICATION.md) - **Você está aqui**
- [02_HTTP_CLIENT.md](./02_HTTP_CLIENT.md) - Cliente HTTP

---

## 🔐 Fluxo JWT

### 1. **Obter Token**

```typescript
// POST /auth/login
const response = await apiClient.post('/auth/login', {
  email: 'user@example.com',
  password: 'password123'
});

// Response:
{
  accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  user: {
    id: "clw7g8h...",
    email: "user@example.com",
    name: "John Doe",
    planType: "free"
  }
}
```

### 2. **Armazenar Token (Secure)**

```typescript
import { secureStorage } from '../utils/secureStorage';

// Salvar token no Secure Store
await secureStorage.setItem('accessToken', token);

// Salvar user no AsyncStorage
await AsyncStorage.setItem('user', JSON.stringify(user));
```

### 3. **Usar Token em Requisições**

```typescript
// Request Interceptor adiciona automaticamente
const config = {
  headers: {
    Authorization: `Bearer ${token}`
  }
};

// Exemplo de requisição autenticada
const habitsResponse = await apiClient.get('/habits');
// Header é adicionado automaticamente pelo interceptador
```

### 4. **Validar Token**

```typescript
// O backend valida o token JWT
// Se válido: continua processamento
// Se inválido/expirado (401): auto-logout
```

---

## 🛡️ Implementação Segura

### **Secure Storage**

Tokens devem SEMPRE estar em Secure Store, nunca em AsyncStorage:

```typescript
// ✅ CORRETO - Secure Store
await secureStorage.setItem('accessToken', token);

// ❌ ERRADO - AsyncStorage (inseguro)
// await AsyncStorage.setItem('accessToken', token);
```

**Por quê?**
- Secure Store: Usa o Keychain (iOS) ou Keystore (Android)
- AsyncStorage: Armazenamento local simples (inseguro)

### **Request Interceptor**

```typescript
private setupInterceptors(): void {
  this.client.interceptors.request.use(
    async (config) => {
      try {
        // Recuperar token seguro
        const token = await secureStorage.getItem('accessToken');
        if (token) {
          // Adicionar ao header
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error('Error retrieving token:', error);
      }
      return config;
    }
  );
}
```

### **Response Interceptor**

```typescript
private setupInterceptors(): void {
  this.client.interceptors.response.use(
    (response) => response,
    async (error) => {
      // Verificar erro 401 (token expirado)
      if (error.response?.status === 401) {
        console.warn('Token expired, logging out');
        
        // Limpar dados
        await secureStorage.removeItem('accessToken');
        await AsyncStorage.removeItem('user');
        
        // Atualizar store
        useAuthStore.getState().logout();
        
        // Redirecionar para login
        navigation.navigate('Login');
      }
      
      return Promise.reject(error);
    }
  );
}
```

---

## 📋 Estados de Autenticação

```
┌─────────────────────┐
│   NOT AUTHENTICATED │  Usuário não logado
│   isAuthenticated:  │  - Mostra LoginScreen
│   false             │
└─────────────────────┘
          │
          │ login()
          ↓
┌─────────────────────┐
│   LOADING STATE     │  Autenticando
│   isLoading: true   │  - Mostra spinner
└─────────────────────┘
          │
     ┌────┴────┐
     │          │
  ✅ Sucesso  ❌ Erro
     │          │
     ▼          ▼
┌──────────┐  ┌──────────┐
│  AUTH    │  │  ERROR   │
│ENTICATED │  │  STATE   │
│ Dashboard│  │ Toast    │
│ Screen   │  │ voltar   │
└──────────┘  └──────────┘
```

---

## 🚀 Implementação em Store

```typescript
// authStore.ts
export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  isLoading: true,
  user: null,
  error: null,

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    
    try {
      // Chamar serviço
      const response = await authService.login({ email, password });
      
      // Salvar token
      await secureStorage.setItem('accessToken', response.accessToken);
      await AsyncStorage.setItem('user', JSON.stringify(response.user));
      
      // Atualizar estado
      set({
        isAuthenticated: true,
        user: response.user,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Login failed',
        isLoading: false,
      });
      throw error;
    }
  },

  logout: async () => {
    // Limpar dados
    await secureStorage.removeItem('accessToken');
    await AsyncStorage.removeItem('user');
    
    // Resetar estado
    set({
      isAuthenticated: false,
      user: null,
      error: null,
    });
  },

  checkAuthStatus: async () => {
    try {
      const token = await secureStorage.getItem('accessToken');
      const userJson = await AsyncStorage.getItem('user');
      
      if (token && userJson) {
        set({
          isAuthenticated: true,
          user: JSON.parse(userJson),
        });
      }
    } catch (error) {
      console.error('Error checking auth:', error);
    } finally {
      set({ isLoading: false });
    }
  },
}));
```

---

## 🔒 Proteção de Rotas

```typescript
// RootNavigator.tsx
const RootNavigator = () => {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? (
        // Rotas autenticadas
        <AppTabs />
      ) : (
        // Rotas de autenticação
        <AuthStack />
      )}
    </NavigationContainer>
  );
};
```

---

## 📊 Matriz de Segurança

| Aspecto | Implementação | Status |
|---------|--------------|--------|
| **Token Storage** | Expo Secure Store | ✅ Seguro |
| **Token Transmission** | HTTPS + Bearer | ✅ Seguro |
| **Token Expiration** | 24 horas | ✅ Implementado |
| **Auto-logout** | 401 Interceptor | ✅ Implementado |
| **HTTPS** | Backend enforça | ✅ Production ready |
| **CORS** | Backend configurado | ✅ Habilitado |
| **XSS Protection** | React Native nativo | ✅ Protegido |

---

## ⚠️ Boas Práticas

### ✅ DO's
- ✅ Armazenar tokens no Secure Store
- ✅ Usar HTTPS em produção
- ✅ Validar tokens no backend
- ✅ Fazer auto-logout em 401
- ✅ Limpar dados ao logout
- ✅ Usar Bearer token scheme

### ❌ DON'Ts
- ❌ Nunca armazenar tokens em AsyncStorage
- ❌ Nunca enviar tokens em URL
- ❌ Nunca hardcodear credentials
- ❌ Nunca ignorar erros de autenticação
- ❌ Nunca usar HTTP em produção

---

## 🔗 Links de Referência

- [Anterior: Overview ←](./00_README.md)
- [Próxima: HTTP Client →](./02_HTTP_CLIENT.md)
- [Voltar ao Índice ↑](../00_INDEX.md)

---

**Última atualização**: Janeiro 2026  
**Status**: ✅ Completo
