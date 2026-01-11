# 📖 Guia Funcional - Frontend React Native

## 🎯 O que faz o Frontend?

O frontend é o aplicativo mobile que os usuários veem e usam. Ele:
- ✅ Permite login e registro
- ✅ Exibe lista de hábitos
- ✅ Permite criar e editar hábitos
- ✅ Registra conclusão de hábitos (check-ins)
- ✅ Mostra estatísticas e análises
- ✅ Gerencia créditos
- ✅ Permite assistir anúncios para ganhar créditos

## 👥 Personas e Jornadas de Usuário

### 1. João - Novo Usuário

**Dia 1: Instalação e Registro**

1. João baixa o app na Play Store
2. Abre e vê tela de "Login" com 2 botões:
   - "Entrar" (azul, destaque)
   - "Criar Conta" (texto)
3. Clica "Criar Conta"
4. Preenche:
   - Nome: "João Silva"
   - Email: "joao@example.com"
   - Senha: "MinhaSenha123!"
5. Toca "Criar Conta"
6. Sistema valida:
   - Email único (não existe)
   - Senha forte (8+ chars, maiúscula, número)
7. App faz POST /auth/register
8. ✅ Sucesso! Recebe token
9. App armazena token de forma segura
10. Navega automaticamente para Dashboard
11. João vê:
    - Sua foto/avatar
    - "Bem-vindo, João!"
    - "Você tem 10 créditos de bônus"
    - Botão "+ Novo Hábito"
    - Aba inferior com abas: Hábitos | Estatísticas | Créditos | Perfil

---

### 2. Criando Primeiro Hábito

**João cria hábito "Beber 2L de Água"**

1. João toca "+ Novo Hábito"
2. Modal abre com formulário:
   - Título (obrigatório): "Beber 2L de Água"
   - Descrição: "Manter hidratação"
   - Frequência: Seleciona "Diário" do dropdown
   - Horário: Seleciona "07:00"
3. Toca "Criar"
4. Validações locais passam
5. App faz POST /habits
6. ✅ Hábito criado!
7. Modal fecha
8. Card novo aparece na lista:
   ```
   🎯 Beber 2L de Água
   Frequência: Diário
   Streak: 0 dias
   Taxa: 0% (novo)
   [Ver] [✓ Completar]
   ```

---

### 3. Registrando Conclusão (Primeira Vez)

**João completa o hábito pela primeira vez**

1. Manhã, 7:15 AM
2. João abre o app
3. Vê card do hábito "Beber 2L de Água"
4. Toca botão "[✓ Completar]"
5. Modal "Completar Hábito" abre:
   - Título: "✓ Completar Hábito"
   - Hábito: "Beber 2L de Água"
   - Campo de notas: "Completado no horário"
   - Botões: [Cancelar] [Confirmar]
6. Toca "Confirmar"
7. App faz POST /habits/:id/checkin
8. ✅ Check-in registrado!
9. Modal fecha
10. Card do hábito muda:
    - Agora mostra "✅ Completado hoje"
    - Streak aumenta para 1 dia
    - Aparece novo botão "[💰 Ver Anúncio]"

---

### 4. Ganhar Créditos com Anúncio

**João assiste anúncio para ganhar 5 créditos**

**Cenário: Após completar hábito**

1. João vê botão "💰 Ganhar 5 créditos - Assistir Anúncio"
2. Toca o botão
3. App faz POST /ads/view
   - Envia: adType="rewarded", adId, adUnitId
   - Recebe: validationToken com TTL de 1 hora
4. ✅ Anúncio começa a reproduzir (Google Mobile Ads SDK)
5. João assiste anúncio completo (5-15 segundos)
6. App detecta fim do anúncio via callback
7. App faz POST /ads/reward-completion
   - Envia: habitId, validationToken, adViewId
   - Backend valida token
   - Backend incrementa user.availableCredits += 5
8. ✅ Recompensa concedida!
9. Toast aparece: "+5 créditos! Seu saldo: 15"
10. Botão desaparece (máx 1 por hábito por dia)

---

### 5. Consultando Estatísticas

**João quer ver seu progresso após 7 dias**

1. João toca na aba "📊 Estatísticas"
2. Vê tela dividida em seções:

**Resumo Geral:**
```
Total de Hábitos: 1
Taxa de Conclusão Média: 85%
Consecutivo Maior: 7 dias
Completações Totais: 6
```

**Hábito: Beber Água**
```
Taxa de Conclusão: 85%
Completado: 6/7 dias
Streak Atual: 6 dias
Melhor Horário: 7:00-7:30 AM
```

3. Toca em "Ver Mais" do hábito
4. Tela de detalhes abre com:
   - Gráfico de barras (últimos 7 dias)
   - Estatísticas detalhadas
   - Botão "[🤖 Ver Análises com IA]"

5. João toca em "Ver Análises"
6. Modal de IA abre mostrando insights:

```
📊 ANÁLISE DE PADRÕES (Confiança: 92%)
"Você completa esse hábito 85% das vezes.
Melhor desempenho entre 7-8 AM."

⏰ SUGESTÃO DE HORÁRIO (Confiança: 88%)
"Recomendamos mover para 7 AM, onde você
tem 90% de taxa de conclusão."

🎉 ENCORAJAMENTO (Confiança: 95%)
"Parabéns! Você manteve essa sequência por
7 dias seguidos. Continue assim!"
```

---

### 6. Gerenciando Créditos

**João quer ver seu saldo e histórico**

1. Toca na aba "💰 Créditos"
2. Vê grande número no topo: "Créditos: 25"
3. Debaixo, dois cards:
   - "Ganhos Hoje: 5"
   - "Ganhos Esta Semana: 20"
4. Seção "Histórico de Transações":

```
+5 créditos - Anúncio: "Beber Água"
10/01/2024 às 19:45

+5 créditos - Anúncio: "Meditação"
10/01/2024 às 14:30

+10 créditos - Bônus de Novo Usuário
10/01/2024 às 10:00
```

5. Botão "Comprar Créditos" (futuro)

---

### 7. Perfil do Usuário

**João acessa suas configurações**

1. Toca na aba "👤 Perfil"
2. Vê seção com foto/avatar
3. Nome: "João Silva"
4. Email: "joao@example.com"
5. Plano: "Free (Atualizar para Premium em breve)"
6. Opções:
   - [Editar Perfil]
   - [Trocar Senha]
   - [Preferências]
   - [Sobre]
   - [Logout]
7. Toca "Logout"
8. ⚠️ Confirmação: "Deseja sair?"
   - [Cancelar] [Sim, Sair]
9. Token é apagado do armazenamento seguro
10. App navega para LoginScreen

---

## 🔄 Fluxos de Dados Principais

### Fluxo 1: Autenticação Completa

```
┌─────────────────────────────────────────┐
│ USER INTERFACE (REACT NATIVE)           │
└─────────────────────────────────────────┘
              ↓
[LoginScreen - Usuário preenche email/senha]
              ↓
[Input validation local]
              ↓
[useAuthStore.login(email, password)]
              ↓
┌─────────────────────────────────────────┐
│ STATE MANAGEMENT (ZUSTAND)              │
│ authStore.ts                            │
└─────────────────────────────────────────┘
              ↓
[authStore.setLoading(true)]
              ↓
[authService.login(email, password)]
              ↓
┌─────────────────────────────────────────┐
│ API CLIENT (AXIOS)                      │
│ apiClient.ts                            │
└─────────────────────────────────────────┘
              ↓
[POST /auth/login]
              ↓
┌─────────────────────────────────────────┐
│ BACKEND API (NESTJS)                    │
└─────────────────────────────────────────┘
              ↓
[Backend valida credenciais]
              ↓
[Gera JWT token]
              ↓
[Retorna user + token]
              ↓
┌─────────────────────────────────────────┐
│ RESPONSE HANDLING                       │
└─────────────────────────────────────────┘
              ↓
[authStore.setToken(token)]
              ↓
[storage.setToken(token) - SecureStore]
              ↓
[authStore.setUser(user)]
              ↓
[authStore.setLoading(false)]
              ↓
[Zustand notifica subscribers]
              ↓
[RootNavigator vê token != null]
              ↓
[Navega para AppNavigator (Dashboard)]
              ↓
[Dashboard carrega com sucesso]
```

### Fluxo 2: Criar e Completar Hábito

```
[Usuário toca "+ Novo Hábito"]
         ↓
[HabitModal abre (mode='create')]
         ↓
[Usuário preenche formulário]
         ↓
[Toca "Criar"]
         ↓
[Validação local passa]
         ↓
[habitStore.createHabit(data)]
         ↓
[habitService.createHabit(data)]
         ↓
[POST /habits]
         ↓
[Backend cria Habit em DB]
         ↓
[Retorna habit criado]
         ↓
[habitStore.addHabit(newHabit)]
         ↓
[Modal fecha]
         ↓
[Toast: "Hábito criado com sucesso!"]
         ↓
[Novo card aparece na lista]
         ↓
[--- Dias depois ---]
         ↓
[Usuário completa hábito]
         ↓
[Toca "[✓ Completar]"]
         ↓
[CheckInModal abre]
         ↓
[Preenche notas opcionais]
         ↓
[Toca "Confirmar"]
         ↓
[habitStore.checkin(habitId, status)]
         ↓
[POST /habits/:id/checkin]
         ↓
[Backend cria HabitLog]
         ↓
[Incrementa streak]
         ↓
[Retorna logId + confirmação]
         ↓
[habitStore atualiza habit.stats]
         ↓
[Card visual muda: ✅ Completado hoje]
         ↓
[Streak aumenta]
         ↓
[Botão aparece: "💰 Ganhar Créditos"]
```

### Fluxo 3: Ganhar Créditos por Anúncio

```
[Completou hábito]
         ↓
[Vê botão "💰 Ganhar 5 Créditos"]
         ↓
[Toca botão]
         ↓
[creditService.recordAdView(adType, adId)]
         ↓
[POST /ads/view]
         ↓
[Backend cria AdView]
         ↓
[Gera validationToken (JWT com TTL)]
         ↓
[Retorna token + rewardAmount]
         ↓
[Google Mobile Ads SDK exibe anúncio]
         ↓
[Usuário assiste anúncio completo]
         ↓
[Google Mobile Ads chama callback onRewarded]
         ↓
[creditService.claimReward(adViewId, token)]
         ↓
[POST /ads/reward-completion]
         ↓
[Backend valida token]
         ↓
[Backend verifica limite diário (máx 3)]
         ↓
[Backend incrementa user.availableCredits += 5]
         ↓
[Retorna success + newBalance]
         ↓
[creditStore.updateBalance(newBalance)]
         ↓
[Toast: "+5 créditos! Saldo: 15"]
         ↓
[Botão desaparece da tela]
```

---

## 💡 Regras de Negócio (Frontend)

### Validações

1. **Email**:
   - Formato válido (regex)
   - Não vazio

2. **Senha**:
   - Mínimo 8 caracteres
   - Deve ter maiúscula
   - Deve ter número
   - Deve ter símbolo (opcional mas recomendado)

3. **Hábito**:
   - Título obrigatório (3+ caracteres)
   - Frequência obrigatória
   - Horário válido se fornecido

### Limites

1. **Anúncios por Dia**: Máx 3 por dia
   - App mostra "Limite atingido"
   - Botão desativado após 3

2. **Créditos**:
   - Máx 15 créditos/dia (3 × 5)
   - Exibido no toast

3. **Requisições Simultâneas**: Uma por vez
   - Botões desabilitados durante carregamento

### Comportamentos

1. **Pull-to-Refresh**: Recarrega dados
2. **Swipe**: Ações contextuais (deletar hábito)
3. **Timeout**: 30 segundos para requisições
4. **Offline**: Mostrar mensagem quando sem internet

---

## 🎓 Exemplos de Casos Reais

### Caso 1: Maria Rastreando 3 Hábitos

**Dia 1 (Segunda)**:
- Maria cria 3 hábitos: Meditação, Leitura, Exercício
- Completa Meditação → Vê anúncio → +5 créditos
- Completa Leitura → Sem anúncio (falta a noite)
- Saldo: 15 créditos (10 + 5)

**Dia 2 (Terça)**:
- Completa Meditação → Vê anúncio → +5 créditos
- Pula Leitura (ocupada)
- Completa Exercício → Vê anúncio → +5 créditos
- Saldo: 25 créditos (15 + 10)

**Dia 8 (Segunda próxima)**:
- Abre app
- Toca "📊 Estatísticas"
- Vê:
  - Meditação: 7/7 (100%)
  - Leitura: 5/7 (71%)
  - Exercício: 6/7 (86%)
- Toca em "Ver Análises de Meditação"
- Modal mostra insights com IA

### Caso 2: Pedro Gerenciando Limite de Anúncios

**10/01/2024, 19:00**
- Pedro completa Hábito A → Vê anúncio → +5 créditos (1/3)
- Pedro completa Hábito B → Vê anúncio → +5 créditos (2/3)
- Pedro completa Hábito C → Vê anúncio → +5 créditos (3/3)
- Pedro completa Hábito D

**Tela de check-in do Hábito D**:
```
✓ Completar Hábito
🏃 Exercício

Notas (opcional):
[________________]

[Cancelar]  [Confirmar]

ℹ️ Você já assistiu 3 anúncios hoje.
   Limite será resetado às 00:00.
   Saldo atual: 25 créditos
```

---

## 🔮 Fluxos Futuros

### 1. Notificações Push
```
8:00 AM - "Hora de Meditação! 🧘"
Usuário toca → Abre app em aba de Hábitos
```

### 2. Compartilhamento
```
Usuário toca em "Compartilhar"
   ↓
Sistema gera link ou imagem
   ↓
Share nativa abre (WhatsApp, Instagram, etc)
   ↓
"Estou com 7 dias de meditação! 🔥"
```

### 3. Social/Competições
```
- Ver streaks de amigos
- Desafios semanais
- Leaderboards
```

### 4. IAP (In-App Purchases)
```
[Comprar Créditos]
   ↓
Abre modal com opções:
- 100 créditos por R$9,99
- 250 créditos por R$19,99 (10% desc)
- 500 créditos por R$39,99 (20% desc)
   ↓
Usuário toca "Comprar"
   ↓
Google Play Store abre
   ↓
Após sucesso, backend incrementa créditos
```

---

**Última atualização**: Janeiro 2026
