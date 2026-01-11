# 🌐 Cliente HTTP - HabitMind AI

Configuração do Axios e padrões de requisição.

---

## 📌 Índice da Seção

- [00_README.md](./00_README.md) - Overview
- [API_REFERENCE.md](./API_REFERENCE.md) - Referência completa
- [01_AUTHENTICATION.md](./01_AUTHENTICATION.md) - Autenticação
- [02_HTTP_CLIENT.md](./02_HTTP_CLIENT.md) - **Você está aqui**

---

## 🚀 Configuração do Axios

### **Arquivo**: `src/services/apiClient.ts`

```typescript
import axios, { AxiosInstance, AxiosError, AxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { secureStorage } from '../utils/secureStorage';
import { Platform } from 'react-native';

// Configuração de URL base
const getApiBaseUrl = (): string => {
  const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000';
  
  // Android Emulator: localhost → 10.0.2.2
  if (Platform.OS === 'android' && baseUrl.includes('localhost')) {
    return baseUrl.replace('localhost', '10.0.2.2');
  }
  
  return baseUrl;
};

const API_BASE_URL = getApiBaseUrl();
const API_TIMEOUT = parseInt(process.env.REACT_APP_API_TIMEOUT || '30000', 10);
```

---

## ⚙️ Interceptadores

### **Request Interceptor**

Executado ANTES de enviar a requisição:

```typescript
private setupInterceptors(): void {
  this.client.interceptors.request.use(
    async (config) => {
      try {
        // 1. Recuperar token seguro
        const token = await secureStorage.getItem('accessToken');
        
        // 2. Adicionar ao header
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        
        // 3. Log (opcional)
        console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
        
        return config;
      } catch (error) {
        console.error('Error in request interceptor:', error);
        return config;
      }
    },
    (error) => {
      return Promise.reject(error);
    }
  );
}
```

### **Response Interceptor**

Executado DEPOIS de receber a resposta:

```typescript
this.client.interceptors.response.use(
  // ✅ Sucesso (2xx)
  (response) => {
    console.log(`[API] Response ${response.status} from ${response.config.url}`);
    return response;
  },
  
  // ❌ Erro
  async (error) => {
    const { response } = error;
    
    // Erro 401 - Token expirado
    if (response?.status === 401) {
      console.warn('[API] Unauthorized (401) - Token expired');
      
      // Limpar dados
      await secureStorage.removeItem('accessToken');
      await AsyncStorage.removeItem('user');
      
      // Fazer logout
      useAuthStore.getState().logout();
      
      // Redirecionar
      // navigation.navigate('Login');
    }
    
    // Erro 4xx (cliente)
    if (response?.status && response.status >= 400 && response.status < 500) {
      console.error(`[API] Client error ${response.status}:`, response.data);
    }
    
    // Erro 5xx (servidor)
    if (response?.status && response.status >= 500) {
      console.error(`[API] Server error ${response.status}:`, response.data);
    }
    
    // Timeout
    if (error.code === 'ECONNABORTED') {
      console.error('[API] Request timeout');
    }
    
    return Promise.reject(error);
  }
);
```

---

## 📤 Métodos HTTP

### **GET - Recuperar dados**

```typescript
// Fetch de hábitos
const habits = await apiClient.get('/habits');

// Com query params
const habits = await apiClient.get('/habits', {
  params: {
    skip: 0,
    take: 10,
    sortBy: 'createdAt'
  }
});
```

### **POST - Criar dados**

```typescript
// Criar hábito
const habit = await apiClient.post('/habits', {
  title: 'Exercitar',
  description: '30 minutos',
  category: 'Saúde',
  frequency: 'daily',
  preferredTime: '07:00'
});
```

### **PUT - Atualizar dados**

```typescript
// Atualizar hábito
const habit = await apiClient.put('/habits/123', {
  title: 'Exercitar 1h',
  description: '1 hora'
});
```

### **DELETE - Deletar dados**

```typescript
// Deletar hábito
await apiClient.delete('/habits/123');
```

---

## 🔄 Exemplo Completo: Fluxo de Requisição

```typescript
// 1. Component dispara ação
const handleLogin = async () => {
  setLoading(true);
  
  try {
    // 2. Chamar método do store
    await useAuthStore.getState().login(email, password);
    
    // 3. Se sucesso, navegar
    navigation.navigate('Dashboard');
  } catch (error) {
    // 4. Se erro, mostrar toast
    showError(error.message);
  } finally {
    setLoading(false);
  }
};

// ⬇️ No Store ⬇️
login: async (email, password) => {
  set({ isLoading: true, error: null });
  
  try {
    // 5. Chamar serviço
    const response = await authService.login({ email, password });
    
    // 6. Salvar token
    await secureStorage.setItem('accessToken', response.accessToken);
    
    // 7. Atualizar estado
    set({
      isAuthenticated: true,
      user: response.user,
      isLoading: false,
    });
  } catch (error) {
    set({ error: error.message, isLoading: false });
    throw error;
  }
};

// ⬇️ No Service ⬇️
async login(credentials: LoginCredentials): Promise<AuthResponse> {
  // 8. Chamar API via Axios
  return apiClient.post('/auth/login', credentials);
  // ⬇️ Request Interceptor adiciona token aqui
  // ⬇️ Resposta processada pelo Response Interceptor
}
```

---

## 📊 Tratamento de Erros

### **Tipos de Erro**

```typescript
// Estrutura de erro
interface ApiError {
  statusCode: number;
  message: string;
  error?: string;
  details?: any;
}

// Exemplo
{
  "statusCode": 400,
  "message": "Email already registered",
  "error": "BadRequest"
}
```

### **Handlers de Erro**

```typescript
// Extrair mensagem de erro
const getErrorMessage = (error: AxiosError<ApiError>): string => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  
  if (error.message) {
    return error.message;
  }
  
  return 'An error occurred. Please try again.';
};

// Uso
try {
  await apiClient.post('/habits', data);
} catch (error) {
  const message = getErrorMessage(error as AxiosError<ApiError>);
  console.error(message);
}
```

---

## ⏱️ Timeouts

Padrão: **30 segundos**

```typescript
// Em .env
REACT_APP_API_TIMEOUT=30000

// Customizar por requisição
await apiClient.get('/habits', {
  timeout: 60000 // 1 minuto
});
```

---

## 🔗 Headers Customizados

```typescript
// Adicionar header global
apiClient.defaults.headers.common['X-API-Key'] = 'your-key';

// Adicionar por requisição
await apiClient.get('/habits', {
  headers: {
    'X-Custom-Header': 'value'
  }
});

// Content-Type é adicionado automaticamente
```

---

## 📋 Matriz de Métodos

| Método | URL | Dados | Seguro |
|--------|-----|-------|--------|
| **GET** | ✅ | ❌ | ✅ Idempotente |
| **POST** | ✅ | ✅ | ⚠️ Novo recurso |
| **PUT** | ✅ | ✅ | ⚠️ Atualiza completo |
| **DELETE** | ✅ | ❌ | ❌ Irreversível |

---

## 🎯 Best Practices

### ✅ DO's
- ✅ Use métodos HTTP corretos
- ✅ Sempre tratar erros
- ✅ Usar interceptadores
- ✅ Adicionar timeout
- ✅ Logar requisições

### ❌ DON'Ts
- ❌ Não fazer requisições em componentes (sem hooks)
- ❌ Não ignorar erros de rede
- ❌ Não hardcodear URLs
- ❌ Não misturar Axios com Fetch

---

## 🔗 Links de Referência

- [Anterior: Autenticação ←](./01_AUTHENTICATION.md)
- [API Reference →](./API_REFERENCE.md)
- [Voltar ao Índice ↑](../00_INDEX.md)

---

**Última atualização**: Janeiro 2026  
**Status**: ✅ Completo
