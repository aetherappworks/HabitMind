# Sistema de Notificações Push - Guia de Implementação

## ✅ O que foi implementado

### Backend (NestJS)
1. **Módulo Notifications** (`src/notifications/`)
   - `notifications.service.ts` - Lógica de envio e agendamento
   - `notifications.controller.ts` - Endpoints HTTP
   - `notifications.module.ts` - Módulo NestJS
   - CRON job que roda a cada 5 minutos verificando hábitos

2. **Prisma Schema Updates**
   - Campo `deviceToken` adicionado ao modelo `User`
   - Novo modelo `NotificationLog` para histórico de notificações
   - Migração criada: `20260111164627_add_notification_system`

3. **Endpoints API**
   - `POST /notifications/register-device` - Registra token de notificação
   - `GET /notifications/history` - Busca histórico de notificações
   - `POST /notifications/mark-viewed/:id` - Marca como visualizada

4. **Internacionalização**
   - Adicionadas chaves em `pt-br.json` e `en-us.json`
   - Títulos e corpos de notificações personalizáveis

### Frontend (React Native)
1. **Serviço de Notificações** (`src/services/notificationService.ts`)
   - Solicitação de permissões
   - Obtenção de device token
   - Registro com backend
   - Handlers de notificação
   - Busca de histórico

2. **Hooks Customizados**
   - `useNotifications()` - Inicializa sistema de notificações
   - `useNotificationNavigation()` - Navega para detalhes do hábito quando tocado

3. **Integração em App.tsx**
   - Notificações ativadas automaticamente no login

## 🧪 Como Testar as Notificações

### 1. Setup Inicial

**Backend:**
```bash
cd "back - HabitMind AI"
npm install axios  # Se não estiver instalado (para requests HTTP)
npm run start:dev
```

**Frontend:**
```bash
cd "front - HabitMind AI/app"
npm start
# Escanear QR code com Expo Go ou rodar em emulador
npm run android  # Para emulador Android
```

### 2. Teste Manual no Android Emulator

1. **Executar app no Android:**
   ```bash
   npm run android
   ```

2. **Fazer login:**
   - Usar credenciais válidas
   - Permitir notificações quando solicitado

3. **Criar hábito com hora preferida:**
   - Ir para "+ Novo Hábito"
   - Preencher com título, frequência "daily"
   - **Importante:** Definir "Horário Preferido" para um horário próximo (ex: 10 min depois da hora atual)
   - Exemplo: se é 14:30, definir preferredTime como "14:40"

4. **Aguardar notificação:**
   - Sistema envia notificação 10 min antes do horário
   - Notificação deve aparecer quando estiver próximo do horário (ex: 14:30 se agendado para 14:40)

5. **Verificar no histórico:**
   - Backend deve ter registrado em `NotificationLog`
   - Frontend pode mostrar em uma tela de "Notificações" se implementada

### 3. Teste de Agendamento (CRON)

O CRON roda a cada 5 minutos. Para testar:

1. **Crie 3 hábitos com horários diferentes:**
   - Hábito 1: `14:35` (5 min depois)
   - Hábito 2: `14:40` (10 min depois)
   - Hábito 3: `14:50` (20 min depois)

2. **Monitore logs do backend:**
   ```bash
   # Terminal do backend mostrará:
   # ✅ Lembrete enviado para user@email.com - Hábito: Meditação
   # 📬 Notificação recebida: ...
   ```

3. **Verifique DB:**
   ```bash
   npx prisma studio
   # Ir para NotificationLog e verificar registros criados
   ```

### 4. Debug em Desenvolvimento

**Console Logs importantes:**

```typescript
// No backend (service):
this.logger.log(`✅ Lembrete enviado para ${user.email} - Hábito: ${habit.title}`);

// No frontend (service):
console.log('📱 [NotificationService] Registrando device token:', token);
console.log('📬 [NotificationService] Notificação recebida:', notification);

// Nos hooks:
console.log('✅ [useNotifications] Sistema de notificações inicializado');
console.log('📍 [useNotificationNavigation] Navegando para hábito:', data.habitId);
```

### 5. Verificar Token de Notificação

**No Android Emulator:**

1. Abrir Chrome Dev Tools (F12 enquanto app está em dev server)
2. Procurar por mensagens console:
   ```
   📱 [NotificationService] Registrando device token: ExponentPushToken[...]
   ```

3. Verificar BD backend:
   ```bash
   # No Prisma Studio: http://localhost:5555
   # Ir para User → verificar campo deviceToken preenchido
   ```

## ⚠️ Troubleshooting

### Notificações não chegam

1. **Verificar se deviceToken foi registrado:**
   ```bash
   npx prisma studio
   # User.deviceToken deve estar preenchido
   ```

2. **Verificar permissões no Android:**
   - Settings → Apps → App Name → Permissions → Notifications → Allow

3. **Verificar CRON está rodando:**
   - Backend logs devem mostrar execução a cada 5 min
   - Procure por: `🔄 Verificando lembretes de hábitos`

4. **Testar manualmente:**
   ```bash
   # Fazer request direto para testar endpoint
   curl -X POST http://localhost:3000/notifications/register-device \
     -H "Authorization: Bearer <token>" \
     -H "Content-Type: application/json" \
     -d '{"deviceToken": "ExponentPushToken[...]"}'
   ```

### Erro "property X should not exist"

- Verificar que está enviando apenas campos esperados em DTOs
- O serviço de notificação só aceita `deviceToken`

### Notificação tapa mas não navega

- Verificar `useNotificationNavigation()` está integrado em `App.tsx`
- Verificar que `habitId` está sendo enviado no campo `data` da notificação
- Verificar que `HabitDetail` screen existe e aceita parâmetro `habitId`

## 📱 Estrutura de Dados

### NotificationLog (Backend)
```prisma
model NotificationLog {
  id         String    @id @default(cuid())
  userId     String
  habitId    String
  type       String    // "habit_reminder" | "achievement" | "encouragement"
  title      String
  body       String
  sentAt     DateTime  @default(now())
  viewed     Boolean   @default(false)
}
```

### Push Notification (Expo Format)
```json
{
  "to": "ExponentPushToken[...]",
  "title": "⏰ Lembrete de Hábito",
  "body": "Hora de fazer seu hábito: Meditação. Você tem 10 minutos!",
  "data": {
    "habitId": "cuid123...",
    "type": "habit_reminder"
  }
}
```

## 🚀 Próximos Passos (Opcional)

1. **Adicionar mais tipos de notificação:**
   - Conquistas (7 dias seguidos)
   - Motivação quando há dias de intervalo
   - Relatórios semanais

2. **Interface de Histórico:**
   - Tela "Minhas Notificações"
   - Mostrar histórico com `GET /notifications/history`
   - Marcar como lida

3. **Configurações de Notificação:**
   - Usuário pode desabilitar para hábitos específicos
   - Definir janela de horário para receber notificações

4. **Analytics:**
   - Track se usuário tapa na notificação
   - Correlacionar com adesão ao hábito

## 📚 Referências

- **Expo Notifications:** https://docs.expo.dev/guides/push-notifications/
- **NestJS Schedule:** https://docs.nestjs.com/techniques/task-scheduling
- **Prisma Migration:** https://www.prisma.io/docs/concepts/components/prisma-migrate
