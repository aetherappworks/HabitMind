# 📖 Exemplos de Uso - HabitMind AI

## 🔐 Autenticação

### Exemplo 1: Login

```typescript
import { useAuthStore } from '@store/authStore';

export default function LoginExample() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error } = useAuthStore();

  const handleLogin = async () => {
    try {
      await login(email, password);
      // Automaticamente navega para dashboard
    } catch (error) {
      Alert.alert('Erro', error.message);
    }
  };

  return (
    <View>
      <Input
        placeholder="seu@email.com"
        value={email}
        onChangeText={setEmail}
      />
      <Input
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button
        title={isLoading ? 'Entrando...' : 'Entrar'}
        onPress={handleLogin}
        disabled={isLoading}
      />
    </View>
  );
}
```

### Exemplo 2: Registro

```typescript
import { useAuthStore } from '@store/authStore';

export default function RegisterExample() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const { register, isLoading } = useAuthStore();

  const handleRegister = async () => {
    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Erro', 'As senhas não coincidem');
      return;
    }

    try {
      await register(
        formData.email,
        formData.name,
        formData.password
      );
      // Cadastro e login automáticos
    } catch (error) {
      Alert.alert('Erro', error.message);
    }
  };

  return (
    <View>
      <Input
        label="Nome"
        placeholder="Seu nome"
        value={formData.name}
        onChangeText={(name) => setFormData({...formData, name})}
      />
      <Input
        label="Email"
        placeholder="seu@email.com"
        value={formData.email}
        onChangeText={(email) => setFormData({...formData, email})}
      />
      <Input
        label="Senha"
        placeholder="Senha"
        value={formData.password}
        onChangeText={(password) => setFormData({...formData, password})}
        secureTextEntry
      />
      <Input
        label="Confirmar Senha"
        placeholder="Confirmar senha"
        value={formData.confirmPassword}
        onChangeText={(confirmPassword) => setFormData({...formData, confirmPassword})}
        secureTextEntry
      />
      <Button
        title={isLoading ? 'Criando...' : 'Criar Conta'}
        onPress={handleRegister}
        disabled={isLoading}
      />
    </View>
  );
}
```

### Exemplo 3: Checar Autenticação

```typescript
import { useAuthStore } from '@store/authStore';
import { useEffect } from 'react';

export default function AuthCheckExample() {
  const { user, isAuthenticated, checkAuthStatus } = useAuthStore();

  useEffect(() => {
    checkAuthStatus(); // Verifica ao carregar
  }, []);

  if (isAuthenticated && user) {
    return <Text>Bem-vindo, {user.name}!</Text>;
  }

  return <Text>Não autenticado</Text>;
}
```

## 📋 Gerenciamento de Hábitos

### Exemplo 1: Listar Hábitos

```typescript
import { useHabitStore } from '@store/habitStore';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

export default function HabitsListExample() {
  const { habits, isLoading, getHabits } = useHabitStore();

  useFocusEffect(
    useCallback(() => {
      getHabits();
    }, [])
  );

  return (
    <FlatList
      data={habits}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <HabitCard habit={item} />
      )}
      onRefresh={getHabits}
      refreshing={isLoading}
    />
  );
}
```

### Exemplo 2: Criar Hábito

```typescript
import { useHabitStore } from '@store/habitStore';
import { useState } from 'react';

export default function CreateHabitExample() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'Saúde',
    frequency: 'daily',
    preferredTime: '08:00'
  });
  
  const { createHabit, isLoading } = useHabitStore();

  const handleCreate = async () => {
    if (!form.title || !form.category) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios');
      return;
    }

    try {
      await createHabit(form);
      Alert.alert('Sucesso', 'Hábito criado!');
      // Limpar formulário
      setForm({
        title: '',
        description: '',
        category: 'Saúde',
        frequency: 'daily',
        preferredTime: '08:00'
      });
    } catch (error) {
      Alert.alert('Erro', error.message);
    }
  };

  return (
    <ScrollView>
      <Input
        label="Título"
        placeholder="Ex: Fazer exercício"
        value={form.title}
        onChangeText={(title) => setForm({...form, title})}
        icon="fitness"
      />
      
      <Input
        label="Descrição"
        placeholder="Ex: 30 minutos de corrida"
        value={form.description}
        onChangeText={(description) => setForm({...form, description})}
        multiline
      />
      
      <Input
        label="Categoria"
        placeholder="Ex: Saúde, Produtividade"
        value={form.category}
        onChangeText={(category) => setForm({...form, category})}
        icon="tag"
      />
      
      <View>
        <Text style={styles.label}>Frequência</Text>
        <Picker
          selectedValue={form.frequency}
          onValueChange={(frequency) => setForm({...form, frequency})}
        >
          <Picker.Item label="Diário" value="daily" />
          <Picker.Item label="Semanal" value="weekly" />
          <Picker.Item label="Personalizado" value="custom" />
        </Picker>
      </View>
      
      <Input
        label="Hora Preferida"
        placeholder="08:00"
        value={form.preferredTime}
        onChangeText={(preferredTime) => setForm({...form, preferredTime})}
      />
      
      <Button
        title={isLoading ? 'Criando...' : 'Criar Hábito'}
        onPress={handleCreate}
        disabled={isLoading}
        size="large"
      />
    </ScrollView>
  );
}
```

### Exemplo 3: Visualizar Detalhes e Estatísticas

```typescript
import { useHabitStore } from '@store/habitStore';
import { habitService } from '@services/habitService';
import { useState, useEffect } from 'react';

export default function HabitDetailExample({ habitId }) {
  const { selectedHabit, getHabit } = useHabitStore();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    loadData();
  }, [habitId]);

  const loadData = async () => {
    await getHabit(habitId);
    const habitStats = await habitService.getCheckInStats(habitId);
    setStats(habitStats);
  };

  return (
    <ScrollView>
      {selectedHabit && (
        <>
          <Text style={styles.title}>{selectedHabit.title}</Text>
          <Text style={styles.description}>{selectedHabit.description}</Text>
          
          {stats && (
            <View style={styles.statsGrid}>
              <View style={styles.statBox}>
                <Text style={styles.statValue}>{stats.completed}</Text>
                <Text style={styles.statLabel}>Completados</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statValue}>{stats.streak}</Text>
                <Text style={styles.statLabel}>Sequência</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statValue}>{stats.total}</Text>
                <Text style={styles.statLabel}>Total</Text>
              </View>
            </View>
          )}
        </>
      )}
    </ScrollView>
  );
}
```

## ✅ Check-ins

### Exemplo 1: Registrar Check-in

```typescript
import { useHabitStore } from '@store/habitStore';
import { useState } from 'react';

export default function CheckInExample({ habitId }) {
  const { createCheckIn, isLoading } = useHabitStore();
  const [notes, setNotes] = useState('');

  const handleCheckIn = async (status) => {
    try {
      await createCheckIn(habitId, {
        status,
        notes: notes || undefined
      });
      
      Alert.alert(
        'Sucesso',
        `Hábito marcado como ${status}!`
      );
      
      setNotes('');
    } catch (error) {
      Alert.alert('Erro', error.message);
    }
  };

  return (
    <View>
      <Input
        label="Notas (opcional)"
        placeholder="Como se sentiu?"
        value={notes}
        onChangeText={setNotes}
        multiline
      />
      
      <View style={styles.buttonGroup}>
        <Button
          title="✓ Completar"
          onPress={() => handleCheckIn('completed')}
          disabled={isLoading}
          icon="checkmark-circle"
        />
        <Button
          title="✕ Pular"
          onPress={() => handleCheckIn('skipped')}
          variant="secondary"
          disabled={isLoading}
        />
      </View>
    </View>
  );
}
```

### Exemplo 2: Ver Histórico de Check-ins

```typescript
import { useHabitStore } from '@store/habitStore';
import { useState, useEffect } from 'react';
import dayjs from 'dayjs';

export default function CheckInHistoryExample({ habitId }) {
  const { getCheckIns } = useHabitStore();
  const [checkIns, setCheckIns] = useState([]);

  useEffect(() => {
    const fetchCheckIns = async () => {
      const data = await getCheckIns(habitId);
      setCheckIns(data);
    };
    fetchCheckIns();
  }, [habitId]);

  return (
    <FlatList
      data={checkIns}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.checkInItem}>
          <Text style={styles.date}>
            {dayjs(item.date).format('DD/MM/YYYY')}
          </Text>
          <Text style={[
            styles.status,
            { color: item.status === 'completed' ? '#10b981' : '#ef4444' }
          ]}>
            {item.status === 'completed' ? '✓ Completado' : '✕ Pulado'}
          </Text>
          {item.notes && (
            <Text style={styles.notes}>{item.notes}</Text>
          )}
        </View>
      )}
    />
  );
}
```

## 💰 Créditos

### Exemplo: Visualizar e Usar Créditos

```typescript
import { authService } from '@services/authService';
import { useState, useEffect } from 'react';

export default function CreditsExample() {
  const [credits, setCredits] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCredits();
  }, []);

  const loadCredits = async () => {
    try {
      const data = await authService.getCredits();
      setCredits(data);
    } catch (error) {
      Alert.alert('Erro', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeductCredits = async (amount, reason) => {
    try {
      const updated = await authService.deductCredits(amount, reason);
      setCredits(updated);
      Alert.alert('Sucesso', `${amount} créditos deduzidos`);
    } catch (error) {
      Alert.alert('Erro', error.message);
    }
  };

  return (
    <>
      {loading ? (
        <ActivityIndicator />
      ) : credits ? (
        <View>
          <Text style={styles.totalCredits}>
            {credits.totalCredits} créditos
          </Text>
          
          <View style={styles.daily}>
            <Text>Usado hoje: {credits.usedToday}/{credits.dailyLimit}</Text>
            <View style={styles.progressBar}>
              <View
                style={{
                  width: `${(credits.usedToday / credits.dailyLimit) * 100}%`,
                  backgroundColor: '#6366f1',
                  height: '100%'
                }}
              />
            </View>
          </View>
          
          <Button
            title={`Usar 5 créditos (${credits.availableToday} disponível)`}
            onPress={() => handleDeductCredits(5, 'watch_ad')}
            disabled={credits.availableToday < 5}
          />
        </View>
      ) : null}
    </>
  );
}
```

## 🔌 Cliente Axios Direto

### Exemplo: Chamada Customizada

```typescript
import { apiClient } from '@services/apiClient';

// GET
const users = await apiClient.get('/users');

// POST
const newHabit = await apiClient.post('/habits', {
  title: 'Novo Hábito',
  category: 'Saúde'
});

// PUT
const updated = await apiClient.put('/habits/123', {
  title: 'Hábito Atualizado'
});

// DELETE
await apiClient.delete('/habits/123');

// Com configuração customizada
const data = await apiClient.get('/habits', {
  params: {
    limit: 10,
    offset: 0
  }
});
```

## 🎨 Componentes Customizados

### Exemplo: Usar Button

```typescript
<Button
  title="Clique aqui"
  onPress={() => console.log('Clicado')}
  variant="primary"       // primary | secondary | danger
  size="large"            // small | medium | large
  icon="checkmark"        // ícone Ionicons
  loading={false}
  disabled={false}
/>
```

### Exemplo: Usar Input

```typescript
<Input
  label="Email"
  placeholder="seu@email.com"
  value={email}
  onChangeText={setEmail}
  error={errors.email}
  icon="mail"
  multiline={false}
  rows={1}
/>
```

### Exemplo: Usar HabitCard

```typescript
<HabitCard
  habit={habitData}
  onPress={() => navigation.navigate('Detail', { id: habitData.id })}
  onDelete={() => deleteHabit(habitData.id)}
  completedToday={true}
/>
```

## 🚨 Tratamento de Erros

```typescript
import { useHabitStore } from '@store/habitStore';

export default function ErrorHandlingExample() {
  const { createHabit, error, clearError } = useHabitStore();

  useEffect(() => {
    if (error) {
      Alert.alert('Erro', error, [
        { text: 'OK', onPress: () => clearError() }
      ]);
    }
  }, [error]);

  return (
    <View>
      {error && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
      {/* Resto do componente */}
    </View>
  );
}
```

## 📚 Padrões Recomendados

### 1. Sempre use try/catch
```typescript
try {
  await habitService.createHabit(data);
} catch (error) {
  const message = error instanceof Error ? error.message : 'Erro desconhecido';
  Alert.alert('Erro', message);
}
```

### 2. Use useFocusEffect para recarregar dados
```typescript
useFocusEffect(
  useCallback(() => {
    loadData();
  }, [])
);
```

### 3. Sempre valide formulários
```typescript
const errors = {};
if (!form.title) errors.title = 'Campo obrigatório';
if (!form.email) errors.email = 'Email inválido';
setErrors(errors);
if (Object.keys(errors).length > 0) return;
```

### 4. Mostre loading state
```typescript
<Button
  title={isLoading ? 'Carregando...' : 'Enviar'}
  disabled={isLoading}
/>
```

---

**Pronto para usar!** Copie e adapte os exemplos conforme necessário. 🚀
