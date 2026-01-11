# 💳 Bilhetagem & Monetização

Documentação sobre o sistema de créditos e rate limiting.

## Índice

- **[Sistema de Créditos](01_CREDITS_SYSTEM.md)** - Como funciona o sistema de créditos
- **[Rate Limiting](02_RATE_LIMITING.md)** - Estratégia de rate limiting

## 📊 Modelo de Negócio

### Planos
- **Free** - Limite de requisições por hora
- **Premium** - Mais créditos e menos limitações

### Custos
Cada operação consome uma quantidade de créditos:
- Análise com IA: 10 créditos
- Check-in: 1 crédito
- Leitura de dados: 0.5 crédito

## 🔒 Rate Limiting

Sistema de proteção que:
- Limita requisições por usuário
- Usa créditos como moeda interna
- Oferece planos escalonados

Veja [02_RATE_LIMITING.md](02_RATE_LIMITING.md) para detalhes.
