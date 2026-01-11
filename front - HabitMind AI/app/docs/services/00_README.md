# 🔧 Services - Lógica de Negócio

Documentação dos serviços de API e lógica.

---

## 📌 Índice da Seção

**[Criando nova subcategoria]**

- [00_README.md](./00_README.md) - **Você está aqui**
- [01_API_CLIENT.md](./01_API_CLIENT.md) - API Client
- [02_AUTH_SERVICE.md](./02_AUTH_SERVICE.md) - Auth Service
- [03_HABIT_SERVICE.md](./03_HABIT_SERVICE.md) - Habit Service

---

## 🎯 O que são Services?

Services encapsulam a lógica de chamadas à API, abstraindo os detalhes HTTP dos stores e componentes.

### Vantagens:
- ✅ Separação de responsabilidades
- ✅ Fácil de testar
- ✅ Reutilizável
- ✅ Tipagem completa

---

## 📦 Serviços do Projeto

### **1. apiClient**
Cliente HTTP configurado (Axios).

**Localização**: `src/services/apiClient.ts`

### **2. authService**
Autenticação e perfil de usuário.

**Localização**: `src/services/authService.ts`

### **3. habitService**
CRUD de hábitos e check-ins.

**Localização**: `src/services/habitService.ts`

---

## 🏗️ Padrão de Service

```typescript
class MyService {
  // Methods públicos
  async getItem(id: string): Promise<Item> {
    return apiClient.get(`/items/${id}`);
  }

  async createItem(data: CreateItemDTO): Promise<Item> {
    return apiClient.post('/items', data);
  }

  async updateItem(id: string, data: UpdateItemDTO): Promise<Item> {
    return apiClient.put(`/items/${id}`, data);
  }

  async deleteItem(id: string): Promise<void> {
    return apiClient.delete(`/items/${id}`);
  }
}

// Exportar singleton
export const myService = new MyService();
```

---

## 🔄 Fluxo: Component → Store → Service → API

```
DashboardScreen
    ↓
useHabitStore.getHabits()
    ↓
habitService.getHabits()
    ↓
apiClient.get('/habits')
    ↓
Backend API
```

---

## 📋 Tipos Comuns

### **DTOs (Data Transfer Objects)**

```typescript
// Request
interface CreateHabitDTO {
  title: string;
  description?: string;
  category: string;
  frequency: string;
  preferredTime?: string;
}

// Response
interface Habit {
  id: string;
  title: string;
  // ... mais campos
}
```

---

## ✨ Boas Práticas

- ✅ Type-safe: Todos os parâmetros e retornos tipados
- ✅ Single Responsibility: Um serviço, uma responsabilidade
- ✅ Error Handling: Erros propagados apropriadamente
- ✅ Reuse: Métodos não duplicados

---

## 🔗 Links de Referência

- [Próxima: API Client →](./01_API_CLIENT.md)
- [Voltar ao Índice ↑](../00_INDEX.md)

---

**Última atualização**: Janeiro 2026  
**Status**: ✅ Completo
