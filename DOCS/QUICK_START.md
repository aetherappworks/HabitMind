# 🚀 Quick Start - HabitMind AI

**Comece a desenvolver em 15 minutos!**

## 🎯 Para Iniciantes: Primeiro Setup

### Passo 1: Clonar Repositório
```bash
git clone https://github.com/seu-usuario/habitsmind-ai.git
cd habitsmind-ai
```

### Passo 2: Configurar Backend

```bash
cd \"back - HabitMind AI\"

# Instalar dependências
npm install

# Copiar variáveis de ambiente
cp .env.example .env

# Criar banco de dados PostgreSQL (Linux/macOS)
createdb habitsmind_dev

# Ou use Docker
docker run -d \
  --name habitsmind-postgres \
  -e POSTGRES_DB=habitsmind_dev \
  -e POSTGRES_PASSWORD=senha123 \
  -p 5432:5432 \
  postgres:14-alpine

# Executar migrations
npx prisma migrate dev

# Iniciar backend
npm run start:dev
```

Esperado: `Nest application successfully started on port 3000`

### Passo 3: Configurar Frontend

```bash
cd ../\"front - HabitMind AI\"/app

# Instalar dependências
npm install

# Copiar variáveis de ambiente
cp .env.example .env

# Iniciar app
npm start
```

Esperado: Menu Expo com opções (a/i/w)

### Passo 4: Testar

**Terminal 1** (Backend):
```bash
npm run start:dev
```

**Terminal 2** (Frontend):
```bash
npm start
```

Pressione **w** para Web ou **a** para Android ou **i** para iOS

---

## 📱 Testando Funcionalidades

### 1. Registrar Novo Usuário

1. App abre em http://localhost:19006 (web)
2. Toca em "Criar Conta"
3. Preenche:
   - Nome: "Teste"
   - Email: "teste@example.com"
   - Senha: "TestPass123!"
4. Toca "Criar Conta"
5. ✅ Vai para Dashboard

### 2. Criar Hábito

1. Toca "+ Novo Hábito"
2. Preenche:
   - Título: "Beber Água"
   - Frequência: "Diário"
   - Horário: "07:00"
3. Toca "Criar"
4. ✅ Card aparece na lista

### 3. Registrar Conclusão

1. Toca "[✓ Completar]"
2. Modal abre
3. Toca "Confirmar"
4. ✅ Hábito marcado como completo

### 4. Ver Anúncio (Simulado)

1. Após completar, vê botão "💰 Ganhar 5 Créditos"
2. Toca botão
3. App faz POST /ads/view
4. ✅ Creditos incrementam

---

## 🔍 Consultando a API

### Swagger UI (Documentação Interativa)

Abra no navegador:
```
http://localhost:3000/api/docs
```

Aqui pode:
- Ver todos os endpoints
- Clicar em "Try it out"
- Testar requisições
- Ver exemplos de response

### Prisma Studio (Visualizar Banco)

```bash
cd \"back - HabitMind AI\"
npx prisma studio
```

Abre em `http://localhost:5555`

Veja:
- Todos os registros do banco
- Criar/editar/deletar
- Verificar relacionamentos

---

## 🐛 Problemas Comuns

### Backend não conecta com Frontend

**Problema**: `Network request failed`

**Solução 1**: Verificar URL em .env
```bash
# Em \"front - HabitMind AI\"/app/.env
REACT_APP_API_URL=\"http://localhost:3000\"
```

**Solução 2**: Se em emulador/dispositivo, usar IP local
```bash
# Descobrir IP
ifconfig | grep \"inet \"

# Usar em .env
REACT_APP_API_URL=\"http://192.168.1.100:3000\"
```

### Porta 3000 em uso

```bash
# Encontrar processo
lsof -i :3000

# Matar
kill -9 <PID>

# Ou usar porta diferente em .env
API_PORT=3001
```

### Dependências não instalam

```bash
# Limpar tudo
rm -rf node_modules package-lock.json

# Reinstalar
npm install

# Verificar
npm list
```

---

## 📚 Documentação Completa

Após fazer o setup básico, explore:

**Backend**:
1. [Setup Completo](BACKEND/03_SETUP_E_INSTALACAO/00_SETUP.md)
2. [Arquitetura](BACKEND/01_TECNICO/00_ARQUITETURA_GERAL.md)
3. [Módulos](BACKEND/01_TECNICO/01_MODULOS_DETALHADO.md)
4. [API Reference](BACKEND/04_API_REFERENCE/00_API_COMPLETA.md)

**Frontend**:
1. [Setup Completo](FRONTEND/03_SETUP_E_INSTALACAO/00_SETUP.md)
2. [Arquitetura](FRONTEND/01_TECNICO/00_ARQUITETURA_TECNICA.md)
3. [Componentes](FRONTEND/04_COMPONENTES_E_TELAS/00_COMPONENTES_TELAS.md)

**Geral**:
1. [Índice Completo](ÍNDICE.md) - Mapa de navegação
2. [README](README.md) - Visão geral do projeto

---

## 💡 Próximos Passos

### Para Backend Devs
```bash
# Criar novo módulo
nest g mo novo-modulo

# Criar controller
nest g co novo-modulo

# Criar service
nest g s novo-modulo

# Rodar testes
npm test
```

### Para Frontend Devs
```bash
# Estrutura para nova tela
src/screens/nova-tela/
├── index.tsx
├── styles.ts
└── components/
    └── SubComponent.tsx

# Estrutura para novo componente
src/components/NovoComponente.tsx
```

### Para Full Stack
```bash
# 1. Criar endpoint no backend
# 2. Criar serviço no frontend
# 3. Chamar serviço em componente
# 4. Testar fluxo completo
# 5. Atualizar documentação
```

---

## 🎓 Exemplo Completo: Criar Feature \"Favoritos\"

### 1. Backend (NestJS)

**a) Update Prisma Schema**
```prisma
model Habit {
  // ... existing fields
  isFavorite Boolean @default(false)
}
```

**b) Run Migration**
```bash
npx prisma migrate dev --name add_favorite_to_habits
```

**c) Add Endpoint**
```typescript
// habits.controller.ts
@Put(':id/favorite')
toggleFavorite(@Param('id') habitId: string) {
  return this.habitsService.toggleFavorite(habitId);
}
```

**d) Implement Service**
```typescript
// habits.service.ts
toggleFavorite(habitId: string) {
  return this.prisma.habit.update({
    where: { id: habitId },
    data: { isFavorite: { not: true } }
  });
}
```

### 2. Frontend (React Native)

**a) Update Store**
```typescript
// habitStore.ts
toggleFavorite: async (habitId: string) => {
  const updated = await habitService.toggleFavorite(habitId);
  // Atualizar estado
}
```

**b) Add Service**
```typescript
// habitService.ts
toggleFavorite(habitId: string) {
  return apiClient.put(`/habits/${habitId}/favorite`);
}
```

**c) Update UI**
```typescript
// HabitCard.tsx
<Button
  icon={isFavorite ? '★' : '☆'}
  onPress={() => toggleFavorite(habitId)}
/>
```

### 3. Teste

```bash
# 1. Backend ainda rodando: npm run start:dev
# 2. Frontend rodando: npm start
# 3. Toca no ícone de favorito
# 4. Ícone muda (cheio/vazio)
# 5. Dados salvos no banco
```

---

## ✅ Checklist de Setup

- [ ] Node.js 18+ instalado
- [ ] PostgreSQL rodando
- [ ] Backend clonado e npm install feito
- [ ] Backend .env configurado
- [ ] Backend migrations executadas
- [ ] Backend npm run start:dev funcionando
- [ ] Frontend clonado e npm install feito
- [ ] Frontend .env configurado
- [ ] Frontend npm start funcionando
- [ ] Pode registrar novo usuário no app
- [ ] Pode criar hábito
- [ ] Pode marcar como completo

---

## 🎉 Parabéns!

Você tem um ambiente de desenvolvimento totalmente funcional para HabitMind AI!

**Próximos passos**:
1. Explore o código
2. Leia a documentação completa
3. Comece a contribuir
4. Abra PRs com novas features

---

**Dúvidas?** Consulte:
- [Troubleshooting Backend](BACKEND/03_SETUP_E_INSTALACAO/00_SETUP.md#-troubleshooting)
- [Troubleshooting Frontend](FRONTEND/03_SETUP_E_INSTALACAO/00_SETUP.md#-troubleshooting)
- [Índice Completo](ÍNDICE.md)

**Feliz coding!** 🚀
