# 🔑 Auth Store - Zustand

Documentação do store de autenticação.

---

## 📌 Índice da Seção

- [00_README.md](./00_README.md) - Overview
- [01_AUTH_STORE.md](./01_AUTH_STORE.md) - **Você está aqui**
- [02_HABIT_STORE.md](./02_HABIT_STORE.md) - Habit Store
- [03_BEST_PRACTICES.md](./03_BEST_PRACTICES.md) - Melhores práticas

---

## 📂 Arquivo

**Localização**: `src/store/authStore.ts`

**Tamanho**: ~127 linhas

---

## 🏗️ Estrutura do Auth Store

### **State**

```typescript
interface AuthState {
  // Estado
  isAuthenticated: boolean;      // Usuário logado?
  isLoading: boolean;            // Carregando?
  user: User | null;             // Dados do usuário
  credits: UserCredits | null;   // Créditos
  error: string | null;          // Mensagem de erro
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, name: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
  loadCredits: () => Promise<void>;
  clearError: () => void;
}
```

---

## 🔐 Actions Disponíveis

### **login(email, password)**

Fazer login com email e senha.

```typescript
// Uso
const { login } = useAuthStore();

try {
  await login('user@example.com', 'password123');
  // Se sucesso: isAuthenticated = true
} catch (error) {
  // Se erro: error = mensagem
}
```

**Fluxo**:
1. Set loading = true, error = null
2. Chama authService.login()
3. Salva token em secureStorage
4. Salva user em asyncStorage
5. Set isAuthenticated = true
6. Limpa loading

---

### **register(email, name, password)**

Registrar novo usuário.

```typescript
const { register } = useAuthStore();

await register('user@example.com', 'John Doe', 'password123');
```

**Fluxo**:
1. Validação básica
2. Chama authService.register()
3. Auto-login com credentials
4. Similar ao login

---

### **logout()**

Fazer logout e limpar dados.

```typescript
const { logout } = useAuthStore();

await logout();
// Limpa token, user, resetsa auth state
```

**Fluxo**:
1. Remove token de secureStorage
2. Remove user de asyncStorage
3. Reset estado (isAuthenticated = false)
4. Navega para LoginScreen

---

### **checkAuthStatus()**

Verificar se usuário já está autenticado.

```typescript
// Chamado no App.tsx ao inicializar
const { checkAuthStatus } = useAuthStore();

await checkAuthStatus();

// Se tinha token salvo: isAuthenticated = true
// Se não: isAuthenticated = false
```

**Fluxo**:
1. Tenta recuperar token de secureStorage
2. Tenta recuperar user de asyncStorage
3. Se ambos existem: isAuthenticated = true
4. Set loading = false

---

### **loadCredits()**

Carrega saldo de créditos do usuário.

```typescript
const { loadCredits } = useAuthStore();

await loadCredits();
// credits = { availableCredits, totalCredits, ... }
```

---

### **clearError()**

Limpa mensagem de erro.

```typescript
const { clearError } = useAuthStore();

clearError();
// error = null
```

---

## 📊 State Initial

```typescript
{
  isAuthenticated: false,
  isLoading: true,        // true no init (verificando session)
  user: null,
  credits: null,
  error: null,
}
```

---

## 🔄 Exemplo de Uso Completo

### **No Component**

```typescript
const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Pega do store
  const { login, isLoading, error } = useAuthStore((state) => ({
    login: state.login,
    isLoading: state.isLoading,
    error: state.error,
  }));
  
  const handleLogin = async () => {
    try {
      await login(email, password);
      // Se sucesso, hook observa isAuthenticated
      // e navega automaticamente
    } catch (error) {
      // Erro já está em store.error
    }
  };
  
  return (
    <View>
      <Input value={email} onChangeText={setEmail} />
      <Input value={password} onChangeText={setPassword} secureTextEntry />
      <Button 
        label="Entrar" 
        onPress={handleLogin}
        loading={isLoading}
      />
      {error && <Text>{error}</Text>}
    </View>
  );
};
```

### **useEffect para Navigation**

```typescript
useEffect(() => {
  const { isAuthenticated, isLoading } = useAuthStore.getState();
  
  if (!isLoading) {
    if (isAuthenticated) {
      navigation.navigate('Dashboard');
    } else {
      navigation.navigate('Login');
    }
  }
}, [isAuthenticated, isLoading]);
```

---

## 🔒 Segurança

### Token Storage
- ✅ Armazenado em **Secure Store** (criptografado)
- ✅ Recuperado automaticamente em cada request
- ✅ Auto-logout em 401

### Session Persistence
- ✅ Verifica token ao inicializar app
- ✅ Se válido: mantém logado
- ✅ Se inválido: faz logout

---

## 🐛 Troubleshooting

### "Não consegue fazer login"
1. Verificar se REACT_APP_API_URL está correto
2. Ver console logs do error
3. Verificar backend está rodando

### "Token expirado"
1. Fazer logout (store.logout())
2. Fazer login novamente
3. Novo token será obtido

### "Créditos não atualizam"
1. Chamar store.loadCredits()
2. Verificar resposta do backend
3. Check se user está logado

---

## 🔗 Links de Referência

- [Anterior: Overview ←](./00_README.md)
- [Próxima: Habit Store →](./02_HABIT_STORE.md)
- [Voltar ao Índice ↑](../00_INDEX.md)

---

**Última atualização**: Janeiro 2026  
**Status**: ✅ Completo
