# 📈 Rate Limit & Pesos de Uso — Estratégia de Monetização

Este documento define os **novos limites e pesos de uso** dos endpoints de IA, com foco em:
- Validar monetização no MVP
- Criar fricção controlada no plano Free
- Evidenciar valor real no plano Premium

---

## 🎯 Objetivo

O plano **Free deve permitir experimentar o valor**, mas **não sustentar uso contínuo intensivo**.  
O plano **Premium remove fricções e libera análises profundas**.

---

## 🧩 Modelo de Créditos por Endpoint

Cada requisição consome **créditos**, em vez de contar apenas volume bruto.

### Pesos por Tipo de Endpoint

| Endpoint | Descrição | Peso (créditos) |
|--------|----------|----------------|
| `POST /ai/analyze` | Análise profunda de hábitos | **3 créditos** |
| `GET /ai/insights` | Insights rápidos / resumo | **1 crédito** |

> 💡 Endpoints de análise profunda são intencionalmente mais caros para reforçar valor Premium.

---

## 🆓 Plano Free — Limites Propostos

### Limite Diário (recomendado)
- **20 créditos por dia**
- Reset diário (00:00 UTC)

### Exemplo de Uso no Free
- 6 análises profundas (`6 x 3 = 18`)
- 2 insights rápidos (`2 x 1 = 2`)
- **Total: 20 créditos → limite atingido**

### Comportamento ao Exceder
- Bloqueio com `403 Forbidden`
- Mensagem orientada a upgrade
- Headers de rate limit continuam sendo enviados

---

## 💎 Plano Premium — Limites Propostos

### Limite Horário
- **300 a 500 créditos por hora**
- Reset por janela móvel (rolling window)

### Benefícios
- Uso praticamente ilimitado para usuários humanos
- Suporte a automações e uso frequente
- Sem fricção perceptível

---

## 🔍 Comparativo Free vs Premium

| Aspecto | Free | Premium |
|------|------|---------|
| Modelo | Créditos | Créditos |
| Limite | 20 / dia | 300–500 / hora |
| Análise profunda | Limitada | Ilimitada |
| Insight rápido | Limitado | Ilimitado |
| Reset | Diário | Horário |
| Bloqueio | Sim | Raro |
| UX de upgrade | Alta fricção | Nenhuma |

---

## 🧠 Estratégia de Monetização

- O usuário Free **aprende rapidamente o limite**
- O bloqueio ocorre **no momento de maior valor percebido**
- O Premium não vende “mais requisições”, mas:
  - Continuidade
  - Profundidade
  - Fluidez

---

## 🧪 Métricas a Monitorar

Antes de validar pricing final, acompanhar:
- % de usuários que atingem o limite Free
- Tempo médio até o primeiro bloqueio
- Endpoint mais consumido
- Taxa de conversão após bloqueio

---

## 🚀 Próximos Passos Técnicos

- [ ] Adaptar `RateLimitService` para créditos por endpoint
- [ ] Configurar limites por plano via `.env`
- [ ] Ajustar mensagens de erro para foco em valor
- [ ] Expor consumo de créditos no frontend
- [ ] Criar endpoint `/billing/upgrade`

---

## 📌 Conclusão

Este modelo cria **fricção saudável no Free** e torna o **Premium uma escolha lógica**, não forçada.  
Ideal para validação de monetização em MVP SaaS com IA.
