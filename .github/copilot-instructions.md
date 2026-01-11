# HabitMind AI - Copilot Instructions

**Project:** Full-stack habit tracking SaaS with AI insights and credit-based monetization  
**Updated:** January 11, 2026 | **Stack:** NestJS (Backend), React Native/Expo (Frontend)  
**Last Session:** Implemented habit suggestions system (AI-powered recommendations with 2-credit cost), fixed nested navigation patterns, optimized modal animations

---

## Architecture Overview

### Monorepo Structure
```
├── back - HabitMind AI/  → NestJS backend (Node 18+, PostgreSQL, Prisma)
├── front - HabitMind AI/ → React Native app (Expo 51, Zustand, React Navigation)
├── DOCS/                 → Comprehensive documentation (6,961+ lines)
└── .github/copilot-instructions.md
```

### Backend Architecture (NestJS)
**Modular Design** with 8 interconnected modules:
- **Auth** (JWT + Passport) → Issues tokens, password hashing with bcrypt
- **Users** → Profile management, credit tracking
- **Habits** → CRUD habits, check-ins (HabitLog), frequency tracking
- **AI** → Pattern analysis, insights (uses rate-limit guard + credit deduction)
- **Ads** → Ad views, reward completion, credit gains
- **Billing** → Credit system, plan types (free/premium)
- **I18n** (i18next) → Portuguese (pt-br) and English (en) support
- **Prisma** → ORM layer, database abstraction

**Data Flow:**
```
User → Auth (JWT) → Request with user payload
    ↓
Protected Route (JwtAuthGuard)
    ↓
RateLimitGuard (checks credits + plan)
    ↓
@CreditCostDecorator (marks endpoint cost)
    ↓
Service deducts credits from User.availableCredits
```

### Frontend Architecture (React Native)
**MVVM Pattern** with Zustand state management:
- **Stores** → Centralized state (authStore, habitStore, creditStore, aiStore)
- **Services** → API calls via Axios + token management (secureStorage)
- **Screens** → UI containers (LoginScreen, DashboardScreen, etc.)
- **Components** → Reusable UI (Button, Input, HabitCard, Modals)
- **Android Quirk** → Uses `10.0.2.2` instead of `localhost` for emulator networking

---

## Critical Patterns & Conventions

### 1. Credit System (Core Monetization)
**User Model:**
```typescript
availableCredits: Int  // Current balance
totalCredits: Int      // Lifetime earned
lastCreditRefillAt: DateTime  // For daily limits
planType: String  // "free" | "premium"
```

**Deduction Pattern:**
```typescript
// 1. Guard validates: User.availableCredits >= creditCost
// 2. Endpoint decorated: @CreditCostDecorator(CreditCost.ANALYZE_HABIT)
// 3. Service deducts: await prisma.user.update({ availableCredits: { decrement: cost } })
// 4. Response includes: X-RateLimit-Limit, X-RateLimit-Used headers
```
**Critical:** Deduction happens **after** successful operation (at service level, not guard).

### 2. Authentication Flow
**JWT Strategy (Passport):**
- Token issued on register/login with `{ sub: userId, email }`
- JwtAuthGuard extracts token from `Authorization: Bearer <token>`
- User payload attached to `request.user` for decorators
- Expired tokens: Frontend clears storage, RateLimitGuard catches 401 in interceptors

### 3. DTOs & Validation (class-validator)
**Every endpoint requires DTOs with decorators:**
```typescript
@IsString() @MinLength(3) title: string
@IsEmail() email: string
@ApiProperty() // Swagger docs auto-generated
```
**Pattern:** Define DTOs in `module/dto/` folder, use in controller parameters, reuse in responses.

**Backend DTO Files to Check:**
- `src/habits/dto/habit.dto.ts` → CreateHabitDto has: title, description?, frequency, preferredTime?
- `src/ai/dto/ai.dto.ts` → AnalyzeHabitDto, HabitSuggestionsResponseDto
- `src/users/dto/user.dto.ts` → User response formats

**Critical When Creating from API Response:**
- Backend validates strictly - any extra fields throw "property X should not exist" error
- Always strip unused fields from suggestions before calling habitService.createHabit()
- Example: HabitSuggestion has `category`, `reason`, `benefits` but CreateHabitDto only accepts `title`, `description`, `frequency`, `preferredTime`

### 4. Prisma Migrations
**Workflow:**
```bash
# After schema.prisma changes:
npm run prisma:migrate  # Creates migration with timestamp
npm run prisma:generate # Regenerates client types
npx prisma studio      # View data in browser UI
```
**Schema Rules:**
- Use `@id @default(cuid())` for IDs (not UUIDs)
- Always add `@index()` on foreign keys and frequently queried fields
- Cascade deletes for child tables (e.g., HabitLog deletes when Habit deletes)
- `@@map()` for pluralized table names

### 5. I18n (Internationalization)
**Location:** `src/i18n/locales/` → `{en,pt-br}.json` with nested keys
```typescript
// Usage in service:
this.i18n.t('auth.errors.invalid_credentials', lang)
// Lang passed from request header or defaulted to 'pt-br'
```
**Key Format:** `module.context.key` (e.g., `auth.errors.user_already_exists`)

### 6. AI Analysis & Suggestions Pattern
**Two AI Endpoints:**

1. **POST /ai/analyze** (3 credits - Deep habit analysis)
   - Analyzes single habit with completion rate, streaks, trends
   - Returns: `content`, `impact`, `recommendations`, `insights`, `confidenceScore`
   - Saves AIInsight to database for historical tracking
   - **File:** `src/ai/ai.service.ts` → `analyzeHabit()`

2. **GET /ai/suggest** (2 credits - Single habit suggestion) **NEW**
   - Generates one random AI-recommended habit based on user's existing habits
   - Picks from category-based suggestions (complementary habits)
   - Response includes confidence score, difficulty, benefits, related habit
   - **File:** `src/ai/ai.service.ts` → `getSingleSuggestion()`
   - Frontend: Call `getSingleHabitSuggestion()` from aiStore, button "🔄 Gerar Nova (2 créditos)"

**Key Implementation Detail:**
- `getInsights()` (free) returns all possible suggestions
- `getSingleSuggestion()` picks one randomly and deducts 2 credits immediately
- Suggestion includes: `title`, `reason`, `category`, `priority`, `relatedHabit`, `completionRate`, `confidence`, `benefits`, `difficulty`

### 7. Error Handling
**NestJS Exception Filters:**
- Throw `BadRequestException`, `NotFoundException`, `ForbiddenException`
- Include i18n message + context object for debugging
- RateLimitGuard returns 403 with credit info in JSON body (not just message)

### 7. Testing Commands
```bash
npm run test              # Run all tests
npm run test:watch       # Watch mode
npm run test:cov         # Coverage report
npm run test:e2e         # Integration tests
```

---

## Frontend-Specific Conventions

### 1. Zustand Store Pattern  
**Location:** `src/store/{module}Store.ts`
```typescript
export const use{Module}Store = create<{Module}State>((set) => ({
  state: initialValue,
  // Action methods that use set() to update state
  createItem: async (data) => { ... },
}));
// Usage: const { state, createItem } = use{Module}Store()
```
**Key Stores & Their Methods:**
- `authStore` → `login()`, `logout()`, `loadCredits()`, `refreshToken()`
- `habitStore` → `createHabit()`, `getHabits()`, `deleteHabit()`, `updateHabit()`, `createCheckIn()`
- `creditStore` → `gainCredits()`, `loadCredits()`
- `aiStore` → `getSingleHabitSuggestion()`, `getInsights()`, `getSuggestedHabits()`

**Critical:** Action names are verbs (createHabit, NOT addHabit). Always desestruture correct names or TypeScript will error.

### 2. API Client (Axios)
**Location:** `src/services/apiClient.ts`
```typescript
// Auto-injects Authorization header + handles 401 refresh
// Throws typed errors: { response: { status, data } }
```
**Environment:**
```
REACT_APP_API_URL=http://localhost:3000  (or http://10.0.2.2:3000 on Android)
REACT_APP_API_TIMEOUT=30000
```

### 3. Secure Storage
**Token Persistence:** Uses `expo-secure-store` (not AsyncStorage)
```typescript
import { secureStorage } from '../utils/secureStorage'
await secureStorage.getItem('accessToken')
await secureStorage.remove & Modal Pattern
**Atomic Design:** Button → HabitCard → HabitList → Screen
- Props typed with TypeScript interfaces
- Zustand hooks for state lifting (avoid prop drilling)
- All modals have 500ms animation timeout (setTimeout on close)
- **Modal Pattern:** Accept `visible` + `onClose` props, use `isLoading` + `error` states

**Nested Navigation (Critical):**
```tsx
// Cross-tab navigation requires TWO steps:
1. navigate('TabName')  // Switch to destination tab
2. setTimeout(() => navigate('ScreenName'), 100)  // Then navigate within that tab's stack

// Example (DashboardScreen → CreditsScreen):
navigation.navigate('UserTab' as any);
setTimeout(() => navigation.navigate('Credits'), 100);
```
- Root has AppTabs → HabitsTab/UserTab → HabitsStack/UserStack
- Prevents "action not handled" errors

---

## Building & Deployment

### Backend
```bash
npm run build          # Compiles to /dist + copies i18n locales
npm run start:prod     # Runs dist/main.js
# Docker: docker-compose up -d  (PostgreSQL + NestJS)
```

### Frontend
```bash
npm start              # Expo dev server (QR code)
npm run android        # Android emulator
npm run ios            # iOS simulator
npm run web            # Web preview (experimental)
# Build: eas build --platform android (requires Expo account)
```

---

## Key Files Reference

| File | Purpose |
|------|---------|
| `src/app.module.ts` | Module graph (all 8 modules imported here) |
| `prisma/schema.prisma` | Single source of truth for data models |
| `src/common/guards/rate-limit.guard.ts` | Credit validation (applied globally or per-endpoint) |
| `src/common/decorators/credit-cost.decorator.ts` | Marks endpoint cost |
| `src/i18n/i18n.service.ts` | Translation lookup |
| `.env.example` | Defines all config vars (copy to `.env`) |
| `DOCS/QUICK_START.md` | 15-minute setup (both backend + frontend) |
| `DOCS/BACKEND/04_API_REFERENCE/00_API_COMPLETA.md` | 25+ endpoints with examples |
| `DOCS/AI_ANALYSIS_IMPROVEMENTS_v1.1.md` | Deep AI analysis changelog (New) |
| `DOCS/AI_VISUAL_GUIDE.md` | UI/UX visual comparison (New) |
| `front-HabitMind AI/app/src/store/` | All Zustand stores (truth source for UI state) |
| `front-HabitMind AI/app/src/services/apiClient.ts` | HTTP client (interceptors, retries) |

---

## Common Tasks

### Add New Endpoint
1. Define DTO in `module/dto/endpoint.dto.ts` with validators
2. Add endpoint in `module.controller.ts` with `@Get/@Post/@Put/@Delete`
3. Implement logic in `module.service.ts` (inject Prisma + i18n)
4. If credit-requiring: use `@CreditCostDecorator(CreditCost.X)` + `@UseGuards(RateLimitGuard)`
5. Update docs in `DOCS/BACKEND/04_API_REFERENCE/`

### Add New Model
1. Add model to `prisma/schema.prisma` with relations + indexes
2. Run `npm run prisma:migrate "add ModelName"`
3. Update related services + controllers
4. Add response DTO in module/dto/

### Debug Mobile App
- **Android Emulator:** Run `npx expo start --android`; press 'a' in Expo CLI
- **Network Issues:** Check if API URL uses `10.0.2.2` (for emulator) or `localhost` (for device)
- **Token Expired:** Check `expo-secure-store` hasn't cleared token unexpectedly
- **State Not Updating:** Ensure Zustand hook is called in component

### Common Frontend Patterns & Fixes
**Zustand Store Pattern (TypeScript):**
```typescript
// Always name actions with verb: createHabit (not addHabit)
export const useHabitStore = create<HabitState>((set) => ({
  habits: [],
  createHabit: async (data) => {
    try {
      const newHabit = await habitService.createHabit(data);
      set((state) => ({ habits: [...state.habits, newHabit] }));
    } catch (error) {
      throw error;  // Throw to propagate to component
    }
  },
}));

// Usage in component: const { createHabit } = useHabitStore();
```
**Modal DTO Creation:** Only send fields that match backend DTO validators
- `CreateHabitDto` accepts: `title`, `description`, `frequency`, `preferredTime` (NOT `category`)
- Always check `src/habits/dto/habit.dto.ts` before creating habits from suggestions
- Remove extra fields that aren't in the DTO validators

---

## Codebase Health Tips

- **Type Everything:** Avoid `any` type; use strict NestJS/TypeScript settings
- **Reuse DTOs:** Create shared response types in `common/dto/` if used across modules
- **Test Credit Flow:** Ensure all credit-deducting endpoints have tests (RateLimitGuard + deduction)
- **Prisma Studio:** Use `npx prisma studio` to inspect real database state (better than logs)
- **Swagger Docs:** All endpoints auto-documented via `@ApiProperty` + `@Api*` decorators
- **Env Validation:** Add missing vars to `.env` before running backend/frontend

---

## External Dependencies Worth Knowing

**Backend:**
- Prisma (ORM) → Handles all DB queries + migrations
- JWT + Passport → Authentication layer
- class-validator → DTO validation
- i18next → Translation service
- Swagger → Auto-generates OpenAPI docs

**Frontend:**
- Zustand → State management (simpler Redux alternative)
- Axios → HTTP client (better error handling than fetch)
- Expo Secure Store → Encrypts sensitive data (tokens)
- React Navigation → Tab + Stack navigation patterns
- Day.js → Date manipulation (immutable, lighter than Moment.js)

---

## For Future AI Agents

When extending this codebase:
1. **Always check `DOCS/` first** → 13 files with architecture, use cases, setup guides
2. **Run Quick Start** → `DOCS/QUICK_START.md` ensures both backend + frontend are runnable
3. **Prisma Before Coding** → Schema changes require migrations first
4. **Test Credit Deduction** → Changes to billing/AI/ads endpoints need rate-limit testing
5. **i18n on Strings** → All user-facing messages must be translatable (add keys to locales/)
6. **Frontend State:** Check Zustand stores before creating new API calls (might exist already)
