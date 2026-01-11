# ✅ Implementation Checklist - HabitMind AI

Guia de implementação de novas features.

---

## 📌 Índice da Seção

**[Criando nova subcategoria]**

- [00_README.md](./00_README.md) - **Você está aqui**
- [01_AUTHENTICATION.md](./01_AUTHENTICATION.md) - Autenticação
- [02_HABITS_CRUD.md](./02_HABITS_CRUD.md) - CRUD de Hábitos
- [03_CHECK_INS.md](./03_CHECK_INS.md) - Check-ins
- [04_CREDITS_SYSTEM.md](./04_CREDITS_SYSTEM.md) - Sistema de Créditos
- [05_HABIT_MODAL.md](./05_HABIT_MODAL.md) - Modal de Hábito

---

## 🎯 Como Usar Este Guia

Ao implementar uma nova feature, siga:

1. **Design** - Definir estrutura
2. **Backend** - Criar endpoints (se necessário)
3. **Types** - Definir interfaces TypeScript
4. **Service** - Criar service layer
5. **Store** - Implementar no Zustand
6. **Component** - Criar componentes
7. **Integration** - Integrar tudo junto
8. **Testing** - Testar completamente

---

## 📋 Checklist de Feature

### **1. Backend Readiness**

- [ ] Endpoint criado e testado
- [ ] Autenticação funciona
- [ ] Resposta no formato correto
- [ ] Erros tratados

### **2. Types & Interfaces**

- [ ] DTOs criados
- [ ] Response types definidos
- [ ] Enums se necessário
- [ ] Type safety 100%

### **3. Service Layer**

- [ ] Methods criados
- [ ] Erros tratados
- [ ] Tipos corretos

### **4. State Management**

- [ ] Store actions criadas
- [ ] Loading states
- [ ] Error handling
- [ ] Estado inicial correto

### **5. UI/Components**

- [ ] Componentes criados
- [ ] Props tipadas
- [ ] Validação (se input)
- [ ] Acessibilidade OK

### **6. Screen Integration**

- [ ] Tela criada
- [ ] Conectada ao store
- [ ] Loading states
- [ ] Error handling
- [ ] Happy path funciona

### **7. Navigation**

- [ ] Rotas configuradas
- [ ] Deep linking (se necessário)
- [ ] Back button funciona

### **8. Testing**

- [ ] Unit tests
- [ ] Integration tests
- [ ] Manual testing
- [ ] Edge cases

### **9. Documentation**

- [ ] Documentação escrita
- [ ] Exemplos adicionados
- [ ] README atualizado

### **10. Code Review**

- [ ] Linted (sem erros)
- [ ] TypeScript strict
- [ ] Best practices
- [ ] Sem console.logs

---

## 📝 Template de Feature

```markdown
## Feature: [Nome da Feature]

### Requisitos
- [ ] Backend endpoint pronto
- [ ] Design aprovado
- [ ] Dependências OK

### Implementação
- [ ] Types definidos
- [ ] Service criado
- [ ] Store atualizado
- [ ] Components implementados
- [ ] Tela integrada
- [ ] Navigation ajustada

### Testing
- [ ] Testes unitários
- [ ] Testes de integração
- [ ] Manual QA
- [ ] Cross-platform

### Documentation
- [ ] Docs adicionadas
- [ ] Exemplos inclusos
- [ ] READMEs atualizados

### Deployment
- [ ] Code review aprovado
- [ ] Build limpo
- [ ] Sem warnings
- [ ] Pronto para produção
```

---

## 🔗 Documentos de Features

Cada feature tem seu documento específico:

- [Autenticação](./01_AUTHENTICATION.md) - Login/Register
- [Hábitos CRUD](./02_HABITS_CRUD.md) - Create/Read/Update/Delete
- [Check-ins](./03_CHECK_INS.md) - Rastreamento
- [Créditos](./04_CREDITS_SYSTEM.md) - Sistema de recompensas
- [Modal](./05_HABIT_MODAL.md) - Interface de criação

---

## 💡 Exemplo: Implementando Nova Feature

### Cenário: "Adicionar comentários em hábitos"

#### 1. Backend
```
POST /habits/:id/comments
GET /habits/:id/comments
DELETE /comments/:id
```

#### 2. Types
```typescript
interface Comment {
  id: string;
  habitId: string;
  text: string;
  createdAt: string;
}

interface CreateCommentDTO {
  text: string;
}
```

#### 3. Service
```typescript
class HabitService {
  async addComment(habitId: string, text: string) {
    return apiClient.post(`/habits/${habitId}/comments`, { text });
  }
  
  async getComments(habitId: string) {
    return apiClient.get(`/habits/${habitId}/comments`);
  }
}
```

#### 4. Store Action
```typescript
addComment: async (habitId: string, text: string) => {
  const comment = await habitService.addComment(habitId, text);
  set((state) => ({
    comments: [...state.comments, comment],
  }));
}
```

#### 5. Component
```typescript
const CommentInput = ({ habitId, onSubmit }: Props) => {
  const [text, setText] = useState('');
  const { addComment } = useHabitStore();
  
  const handle = async () => {
    await addComment(habitId, text);
    setText('');
  };
  
  return (
    <>
      <TextInput value={text} onChangeText={setText} />
      <Button label="Comentar" onPress={handle} />
    </>
  );
};
```

#### 6. Integração na Tela
```typescript
const HabitDetailScreen = ({ route }) => {
  const { habitId } = route.params;
  const { comments } = useHabitStore();
  
  return (
    <ScrollView>
      <CommentInput habitId={habitId} />
      <FlatList data={comments} renderItem={...} />
    </ScrollView>
  );
};
```

---

## ✅ Checklist Final

- [ ] Código escrito
- [ ] Tests passando
- [ ] Lint OK
- [ ] TypeScript OK
- [ ] Documentação OK
- [ ] Code review OK
- [ ] Pronto para merge

---

## 🔗 Links de Referência

- [Próxima: Autenticação →](./01_AUTHENTICATION.md)
- [Voltar ao Índice ↑](../00_INDEX.md)

---

**Última atualização**: Janeiro 2026  
**Status**: ✅ Completo
