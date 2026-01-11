# HabitMind AI - Quick Reference for AI Agents
**Quick lookup for common patterns & commands**

## Critical Commands

### Backend Development
```bash
cd "back - HabitMind AI"
npm run start:dev          # Watch mode (port 3000, Swagger at /api/docs)
npm run prisma:migrate     # Schema changes → migration
npm run prisma:studio      # Inspect database GUI
npm run test:cov           # Coverage report
npm run lint               # Fix linting issues
```

### Frontend Development
```bash
cd "front - HabitMind AI/app"
npm start                  # Expo dev (shows QR code)
npm run android            # Android emulator
npm run web                # Web preview
npx ts-node src/i18n/validate.ts  # Verify i18n keys synced
```

---

## Critical Patterns (Must Know)

### 1️⃣ Credit Deduction (3-Layer)
```
Guard validates → Service deducts after operation succeeds
[BEFORE]           [AFTER]
```
- Guard throws 403 if insufficient
- Service does `availableCredits: { decrement: cost }`
- Response includes `X-RateLimit-*` headers

### 2️⃣ Frontend Navigation (Cross-Tab)
```
navigate('Tab')  →  setTimeout(() => navigate('Screen'), 100)
[Step 1]            [Step 2]
```
Required or "action not handled" error

### 3️⃣ API Client (Platform-Aware)
```
Android: localhost → 10.0.2.2  [AUTO-CONVERTED]
iOS/Device: localhost           [NO CHANGE]
```
No manual config needed

### 4️⃣ DTO Validation (Strict)
```
API Response → Strip extras → sendToBackend()
[Has: category]  [Remove]   [CreateHabitDto only wants: title, description, frequency, preferredTime]
```

### 5️⃣ I18n (Both Sides)
```
Backend:  server-side translate → responses already i18n'd
Frontend: const { t } = useI18n() → t('module.context.key')
```

---

## Key Files Cheat Sheet

| Need | File |
|------|------|
| Add endpoint | `src/{module}/{module}.controller.ts` |
| Add database model | `prisma/schema.prisma` |
| Credit cost | `@CreditCostDecorator(CreditCost.X)` |
| Zustand store | `src/store/{module}Store.ts` |
| Translations | `src/i18n/locales/{lang}.json` |
| API calls | `src/services/apiClient.ts` |
| Navigation | `src/navigation/RootNavigator.tsx` |

---

## Zustand Store Methods (Verb-Actions)

```
authStore → login(), logout(), loadCredits()
habitStore → createHabit(), getHabits(), updateHabit(), createCheckIn()
aiStore → getSingleHabitSuggestion(), getInsights()
creditStore → gainCredits(), loadCredits()
```
**Rule:** Always verbs (createHabit ✅, addHabit ❌)

---

## AI Endpoints (Credit Costs)

| Endpoint | Cost | Saves DB? | Use |
|----------|------|-----------|-----|
| GET /ai/insights | FREE | No | Get all suggestions |
| POST /ai/analyze | 3 credits | Yes (AIInsight) | Deep analysis |
| GET /ai/suggest | 2 credits | No | Random suggestion |

---

## Troubleshooting Quick Links

**Android emulator can't reach backend?**
→ Use `10.0.2.2:3000` (auto-handled by apiClient)

**Credit not deducting?**
→ Check `src/common/guards/rate-limit.guard.ts` + service calls `prisma.user.update({ availableCredits: { decrement } })`

**Translation key missing?**
→ Run `npx ts-node src/i18n/validate.ts` from frontend app folder

**Navigation "action not handled"?**
→ Use 2-step: `navigate('Tab')` → `setTimeout(() => navigate('Screen'), 100)`

**DTO validation error?**
→ Check `src/{module}/dto/*.ts` - backend rejects extra fields

---

## Schema Rules (Prisma)

✅ Use `@default(cuid())` for IDs  
✅ Add `@index()` on userId + date fields  
✅ Use `onDelete: Cascade` for children  
✅ Use `@@map("plural_name")` for table names  

---

## Environment Setup

**Backend (.env):**
```
DATABASE_URL=postgresql://user:password@localhost:5432/habitsmind_dev
JWT_SECRET=your-secret-key
NODE_ENV=development
```

**Frontend (.env):**
```
REACT_APP_API_URL=http://localhost:3000
REACT_APP_API_TIMEOUT=30000
```

---

## Before Committing

- [ ] Run `npm run lint` (backend)
- [ ] Run `npx ts-node src/i18n/validate.ts` (frontend)
- [ ] Test credit deduction: Verify 403 response has `credits: { remaining, limit, resetTime }`
- [ ] Check Zustand action names are verbs
- [ ] Strip DTO fields before creating habits from AI suggestions

---

**Reference Version:** 1.0 (January 12, 2026)  
**Full Guide:** See `.github/copilot-instructions.md` (554 lines, comprehensive)
