# 📖 Guia Funcional - Backend HabitMind AI

## 🎯 O que é HabitMind AI?

HabitMind AI é uma plataforma SaaS de rastreamento de hábitos que ajuda usuários a:
- ✅ Criar e monitorar hábitos diários
- ✅ Registrar completamentos (check-ins)
- ✅ Receber análises com IA sobre padrões
- ✅ Ganhar créditos completando hábitos
- ✅ Assistir anúncios para ganhar mais créditos

## 👥 Personas e Casos de Uso

### 1. Novo Usuário

**Jornada**:
1. Baixa app
2. Toca em "Criar Conta"
3. Entra com email e cria senha
4. Sistema cria conta com 10 créditos de bônus
5. Recebe boas-vindas e tutorial

**Interações Backend**:
```
POST /auth/register
  → Valida email único
  → Hash bcrypt da senha
  → Cria User com 10 créditos iniciais
  → Gera JWT token
  → Retorna dados + token
```

### 2. Usuário Criando Primeiro Hábito

**Jornada**:
1. Acessa dashboard
2. Toca em "Novo Hábito"
3. Preenche: título, descrição, frequência, horário preferido
4. Confirma criação
5. Sistema mostra confirmação

**Interações Backend**:
```
POST /habits
  → JwtAuthGuard valida token
  → Valida dados de entrada (título obrigatório, etc)
  → Cria Habit no banco
  → Retorna hábito criado com ID
```

### 3. Usuário Registrando Check-in

**Jornada**:
1. Usuário completa o hábito no dia
2. Abre app e vai para o hábito
3. Toca em "Completado Hoje"
4. Opcionalmente adiciona nota
5. Sistema confirma e oferece anúncio para ganhar créditos

**Interações Backend**:
```
POST /habits/:id/checkin
  → Valida que é o primeiro check-in do dia
  → Cria HabitLog com status "completed"
  → Incrementa estatísticas (streak, etc)
  → Retorna log criado

POST /ads/view (opcional)
  → Registra visualização de anúncio
  → Gera validationToken
  → Retorna token e rewardAmount

POST /ads/reward-completion
  → Valida token (não expirado, não usado)
  → Marca AdView como rewardClaimed
  → Incrementa availableCredits do user
  → Retorna novo saldo
```

### 4. Usuário Consultando Estatísticas

**Jornada**:
1. Abre aba de Estatísticas
2. Vê resumo de todos os hábitos
3. Toca em um hábito específico
4. Vê gráficos de performance
5. Recebe insights/recomendações com IA

**Interações Backend**:
```
GET /habits
  → Retorna todos os hábitos do usuário
  → Inclui: streak atual, taxa de conclusão, etc

GET /habits/:id/stats
  → Calcula estatísticas: taxa, streaks, melhor horário
  → Retorna dados formatados

GET /ai/analysis/:habitId
  → Coleta últimos 30 dias de HabitLogs
  → Detecta padrões de sucesso
  → Gera 3-5 insights
  → Retorna com confidence scores
```

### 5. Usuário Gerenciando Créditos

**Jornada**:
1. Toca em ícone de Créditos
2. Vê saldo atual e histórico
3. Pode comprar mais créditos (futura integração Play Store)
4. Vê ranking ou achievements (futura feature)

**Interações Backend**:
```
GET /billing/credits
  → Retorna availableCredits e estatísticas de ganho

GET /billing/history
  → Retorna últimas 30 transações de créditos

POST /billing/credits/reload (futuro)
  → Valida transactionId do IAP
  → Incrementa totalCredits
  → Retorna novo saldo
```

## 🔄 Fluxos de Negócio Principais

### Fluxo 1: Ganhar Créditos Assistindo Anúncios

```
┌─────────────────────────────────────────────────────────┐
│ CLIENTE (APP)                                           │
└─────────────────────────────────────────────────────────┘
         ↓
    [Usuário marca hábito como completo]
         ↓
    POST /habits/:id/checkin
         ↓
    ┌─────────────────────────────────────────────────────┐
    │ BACKEND                                             │
    │ • Cria HabitLog                                     │
    │ • Incrementa streak                                │
    │ Retorna: logId + confirmação                        │
    └─────────────────────────────────────────────────────┘
         ↓
    [Sistema oferece: "Quer ganhar créditos? Veja um anúncio"]
         ↓
    [Usuário aceita]
         ↓
    POST /ads/view { adType, adId, adUnitId }
         ↓
    ┌─────────────────────────────────────────────────────┐
    │ BACKEND                                             │
    │ • Cria AdView                                       │
    │ • Gera validationToken (JWT com TTL de 1 hora)     │
    │ Retorna: token + rewardAmount (5 créditos)         │
    └─────────────────────────────────────────────────────┘
         ↓
    [APP mostra anúncio usando Google Mobile Ads SDK]
         ↓
    [Usuário assiste completo]
         ↓
    [Google Mobile Ads SDK chama callback de recompensa]
         ↓
    POST /ads/reward-completion { habitId, validationToken, adViewId }
         ↓
    ┌─────────────────────────────────────────────────────┐
    │ BACKEND                                             │
    │ • Valida token (assinatura, TTL, não duplicado)    │
    │ • Verifica limite diário (máx 3 ads/dia)           │
    │ • Incrementa user.availableCredits += 5            │
    │ • Marca adView.rewardClaimed = true                │
    │ Retorna: success + newBalance                       │
    └─────────────────────────────────────────────────────┘
         ↓
    [APP mostra: "+5 créditos! Novo saldo: 15"]
         ↓
└─────────────────────────────────────────────────────────┘
```

### Fluxo 2: IA Gerando Insights Automáticos

```
Triggers:
1. Usuário solicita GET /ai/analysis/:habitId
2. Agendamento futuro (background job)

┌─────────────────────────────────────────────────────────┐
│ AIService.analyzeHabit(habitId, userId)                │
└─────────────────────────────────────────────────────────┘
         ↓
    [Coleta dados dos últimos 30 dias]
         ↓
    habitLogs = await prisma.habitLog.findMany({
      habitId,
      date: { gte: 30DaysAgo }
    })
         ↓
    [Calcula estatísticas]
    ├─ totalDays: 30
    ├─ completedDays: 25
    ├─ completionRate: 0.83
    ├─ currentStreak: 7
    ├─ longestStreak: 15
    ├─ completionsByTime: { "7-8am": 8, "12-1pm": 5, ...}
    └─ failureReasons: { "forgot": 2, "busy": 3 }
         ↓
    [Detecta padrões]
    ├─ Pattern 1: Melhor performance em dias úteis
    ├─ Pattern 2: Horário 7-8am tem 90% sucesso
    ├─ Pattern 3: Falhas aumentam à noite
    └─ Pattern 4: Streak aumentou 2x desde última semana
         ↓
    [Gera insights baseado em regras]
    
    IF completionRate > 0.80 THEN
      insight = "Pattern Analysis: Você tem desempenho excelente!"
      confidenceScore = 0.95
    
    IF bestTime is detected THEN
      insight = "Time Suggestion: Você tem 90% sucesso às 7-8am"
      confidenceScore = 0.92
    
    IF currentStreak > 5 THEN
      insight = "Encouragement: " + randomMotivationalPhrase()
      confidenceScore = 0.88
         ↓
    [Armazena insights]
    
    const insights = await prisma.aIInsight.createMany({
      data: generatedInsights
    })
         ↓
    [Retorna ao cliente]
    
    Response:
    {
      habitId,
      insights: [
        {
          type: "pattern_analysis",
          content: "...",
          confidenceScore: 0.95
        },
        ...
      ]
    }
         ↓
└─────────────────────────────────────────────────────────┘
```

### Fluxo 3: Limite de Créditos Diários

```
Regra: Máximo 5 créditos por dia completando hábitos

Verificação antes de conceder reward:

GET /billing/credits
  → Retorna earning.today

POST /ads/reward-completion:
  ├─ adViewsToday = COUNT(AdView) WHERE date = TODAY
  ├─ creditsEarned = adViewsToday * rewardAmount
  ├─ IF creditsEarned >= 15 THEN
  │    throw BadRequestException("Limite diário de créditos atingido")
  │    reason: "Máximo 3 anúncios de 5 créditos = 15 por dia"
  └─ ELSE
      incrementa credits
```

## 💡 Regras de Negócio Importantes

### Autenticação
- ✅ Login obrigatório para acessar qualquer recurso
- ✅ JWT token válido por 24 horas
- ✅ Senhas mínimo 8 caracteres
- ✅ Email deve ser único

### Hábitos
- ✅ Cada usuário pode ter múltiplos hábitos
- ✅ Frequências: daily, weekly, custom
- ✅ Check-ins: máx 1 por dia por hábito
- ✅ Hábitos podem ser arquivados (soft delete futuro)

### Créditos
- ✅ Novo usuário: 10 créditos iniciais
- ✅ Ganho por anúncio: 5 créditos
- ✅ Limite: máximo 3 anúncios/dia = 15 créditos/dia
- ✅ Créditos não expiram

### Anúncios
- ✅ 3 tipos: banner, interstitial, rewarded
- ✅ Apenas rewarded concede créditos
- ✅ Validação por JWT token (TTL 1 hora)
- ✅ Prevenção de duplicação: cada adViewId pode ser recompensado 1x

### IA & Insights
- ✅ Gerados sob demanda (GET /ai/analysis)
- ✅ Basado em últimos 30 dias
- ✅ Confidence score de 0.0 a 1.0
- ✅ Armazenados para histórico

## 🎓 Exemplos de Casos Reais

### Caso 1: João quer rastrear "Academia"

1. João faz POST /auth/register
   - Recebe 10 créditos iniciais
   - Recebe token JWT

2. João faz POST /habits
   ```json
   {
     "title": "Academia",
     "description": "40 minutos de musculação",
     "frequency": "daily",
     "preferredTime": "18:00"
   }
   ```

3. Segunda-feira, João vai à academia
   - POST /habits/:id/checkin { "status": "completed" }
   - HabitLog criado
   - Streak: 1 dia

4. João aceita anúncio
   - POST /ads/view { "adType": "rewarded", ... }
   - Recebe validationToken
   - Assiste anúncio completo
   - POST /ads/reward-completion { validationToken }
   - ✅ +5 créditos (now: 15)

5. Terça-feira, João pula (ocupado)
   - POST /habits/:id/checkin { "status": "skipped" }
   - HabitLog com status "skipped"
   - Streak reseta: 0

6. Quarta e quinta, volta à academia
   - 2 check-ins "completed"
   - 2 anúncios assistidos
   - +10 créditos
   - Streak: 2

7. João quer ver análise
   - GET /ai/analysis/:habitId
   - Backend retorna:
     ```
     {
       insights: [
         "Pattern: 60% de conclusão, melhor em dias úteis",
         "Time: Melhor hora é 18-19h (100% sucesso)",
         "Encouragement: Voltou forte! Continue firme"
       ]
     }
     ```

### Caso 2: Maria gerenciando múltiplos hábitos

Hábitos:
1. Meditação (diário, 7:00)
2. Leitura (diário, 21:00)
3. Exercício (5x/semana, variável)

Estatísticas após 30 dias:
- Meditação: 28/30 (93%)
- Leitura: 24/30 (80%)
- Exercício: 18/25 (72%)

Maria acessa GET /ai/analysis (análise geral):
```json
{
  "overallScore": 0.82,
  "insights": [
    {
      "type": "pattern_analysis",
      "content": "Você é muito consistente! Meditação é seu melhor hábito (93%)."
    },
    {
      "type": "time_suggestion",
      "content": "Suas falhas em leitura vêm de 21h-22h. Tente 20h?"
    },
    {
      "type": "adjustment",
      "content": "Exercício é o que mais falta. Considere adicionar ao alarme."
    }
  ]
}
```

Maria ganhou:
- 36 créditos em 30 dias (limite de 3 ads/dia × 5 créditos × 24 dias)
- Saldo atual: 46 créditos

## 🔮 Fluxos Futuros

### 1. Sistema de IAP (In-App Purchases)
```
Cliente compra "100 créditos por R$9,99"
  ↓
POST /billing/credits/reload {
  packageId: "credits_100",
  transactionId: "com.google.play...." // Validado no Play Store
}
  ↓
Backend valida transactionId com Google Play
  ↓
Incrementa totalCredits += 100
  ↓
Retorna novo saldo
```

### 2. Background Jobs com Queue
```
Tarefas agendadas:
- Gerar insights automaticamente às 8am
- Enviar notificações de reminder
- Processar relatórios semanais
- Limpar tokens expirados
```

### 3. Social Features
```
- Compartilhar streaks
- Competições com amigos
- Badges/Achievements
- Leaderboards
```

### 4. Advanced Analytics
```
- Dashboard de Admin
- Relatórios de engagement
- Cohort analysis
- Churn prediction
```

---

**Última atualização**: Janeiro 2026
