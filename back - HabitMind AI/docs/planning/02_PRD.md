# HabitMind AI — PRD Técnico (NestJS)

Este documento descreve o **PRD técnico** do HabitMind AI, com foco em **arquitetura SaaS, modelo de dados e API REST**, utilizando **NestJS**.

---

## 1. Visão do Produto

HabitMind AI é um SaaS de gestão de hábitos com IA aplicada para sugerir micro-ajustes personalizados.

---

## 2. Arquitetura

- Monolito modular (NestJS)
- API-first
- Stateless
- Multi-tenant lógico (por usuário)

Camadas:
- Controllers
- Services
- Domain Rules
- Infrastructure (Prisma, IA)

---

## 3. Modelo de Domínio

### User
- id
- name
- email
- passwordHash
- planType
- createdAt

### Habit
- id
- userId
- title
- description
- frequency
- preferredTime
- isActive

### HabitLog
- id
- habitId
- date
- status

### AIInsight
- id
- userId
- habitId?
- type
- content
- confidenceScore

---

## 4. Regras de Negócio

- Usuário free possui limites
- IA sob demanda
- IA não fornece orientação médica

---

## 5. Endpoints (MVP)

### Auth
POST /auth/register
POST /auth/login

### User
GET /users/me
PUT /users/me

### Habits
POST /habits
GET /habits
PUT /habits/:id
DELETE /habits/:id

### Check-ins
POST /habits/:id/checkins
GET /habits/:id/checkins

### IA
POST /ai/analyze
GET /ai/insights


---

## 6. Métricas

- Retenção
- Engajamento
- Conversão Free → Premium

---

## 7. Status

📌 Documento vivo
