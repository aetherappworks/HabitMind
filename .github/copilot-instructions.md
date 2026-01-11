# HabitMind AI - Copilot Instructions

**Project:** Full-stack habit tracking SaaS with AI insights and credit-based monetization  
**Updated:** January 12, 2026 | **Stack:** NestJS (Backend), React Native/Expo (Frontend)  
**Last Session:** Verified comprehensive instruction set; all core patterns (credit system, i18n, AI analysis, push notifications) fully implemented and tested

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
availableCredits: Int  // Current balance (decremented on API calls)
totalCredits: Int      // Lifetime earned (incremented on reward ads, daily refill)
lastCreditRefillAt: DateTime?  // Tracks daily refill window
planType: String  // "free" (10 credits daily) | "premium" (unlimited)
```

**Deduction Flow (Three-Layer Validation):**
```typescript
// Layer 1: Guard checks credits BEFORE execution
@UseGuards(JwtAuthGuard, RateLimitGuard)
@Get('/analyze')
@CreditCostDecorator(CreditCost.ANALYZE_HABIT)  // Marks cost: 3 credits
async analyzeHabit(@Request() req) { ... }

// Layer 2: RateLimitGuard validates User.availableCredits >= creditCost
// - Throws 403 ForbiddenException if insufficient, includes { credits: { remaining, limit, resetTime } }

// Layer 3: Service deducts AFTER successful operation
await this.prisma.user.update({ 
  where: { id: userId }, 
  data: { availableCredits: { decrement: cost } }
})
```
**Critical Rules:**
- Deduction happens **AFTER** operation succeeds (not in guard)
- Guard only validates; service performs deduction
- Response includes credit headers: `X-RateLimit-Remaining`, `X-RateLimit-Limit`
- Free plan gets daily 10-credit refill; premium gets unlimited or higher daily cap

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

### 4. Prisma Migrations & Database
**Workflow:**
```bash
# After schema.prisma changes:
cd "back - HabitMind AI"
npm run prisma:migrate  # Creates migration with timestamp + auto-applies
npm run prisma:generate # Regenerates client types (auto-run by migrate)
npm run prisma:studio   # Open browser UI to inspect/edit data
```
**Schema Rules:**
- Use `@id @default(cuid())` for IDs (not UUIDs) - consistent across all models
- Always add `@index([fieldName])` on foreign keys and frequently queried fields
- Use `onDelete: Cascade` for child models (e.g., HabitLog → Habit), `SetNull` for optional relations
- `@@map("table_name")` for pluralized table names; `@@index([userId, date])` for composite indexes
- Current Schema: User → Habit → HabitLog (with date index), AIInsight (user + habit relation), AdView, NotificationLog
- **Docker PostgreSQL:** `docker-compose up -d` in project root creates `habitsmind_postgres` container (auto-initialized)

### 5. I18n (Internationalization)

#### Backend (NestJS)
**Location:** `src/i18n/locales/` → `{en,pt-br}.json` with nested keys
```typescript
// Usage in service:
this.i18n.t('auth.errors.invalid_credentials', lang)
// Lang passed from request header or defaulted to 'pt-br'
```

#### Frontend (React Native) - **NEW Phase 2 Complete**
**Infrastructure:** `front-HabitMind AI/app/src/i18n/` with 3 supported languages (pt-br, en-us, es-es)
- `i18n.ts` → Core translation functions: `getTranslation()`, `getTranslationWithParams()`
- `useI18n.ts` → React hook returns `{ t, tParams, language }` for components
- `store/languageStore.ts` → Zustand store manages language state + persistence (secureStorage)
- `locales/*.json` → 91+ translation keys across 7 modules (auth, habits, ai, common, ui, users, ads)

**Frontend Usage Pattern:**
```typescript
import { useI18n } from '../i18n/useI18n';
hree AI Endpoints:**

1. **GET /ai/insights** (FREE - No deduction)
   - Returns all possible AI-generated habit suggestions for user
   - No database write; purely computational
   - Returns array of suggestions with scores but no deduction
   - **File:** `src/ai/ai.service.ts` → `getInsights()`

2. **POST /ai/analyze** (3 credits - Deep habit analysis)
   - Analyzes single habit: completion rate, streaks, trends, patterns
   - Returns: `content`, `impact`, `recommendations`, `insights`, `confidenceScore`
   - **Saves to DB:** Creates AIInsight record for historical tracking
   - **File:** `src/ai/ai.service.ts` → `analyzeHabit()`
   - Frontend: `aiStore.analyzeHabit(habitId)` - shows loading + result modal

3. **GET /ai/suggest** (2 credits - Single habit suggestion)
   - Generates one random AI-recommended habit from category-based pool
   - **Returns:** `title`, `reason`, `category`, `priority`, `relatedHabit`, `completionRate`, `confidence`, `benefits`, `difficulty`
   - **File:** `src/ai/ai.service.ts` → `getSingleSuggestion()`
   - Frontend: `aiStore.getSingleHabitSuggestion()` - displays suggestion card with "🔄 Generate New (2 credits)" button

**Critical Integration Details:**
- All AI responses already i18n-formatted from backend (no frontend translation needed for AI content)
- Error handling: 403 responses include credit deficit info
- DTO Validation: Frontend must strip `category`, `reason`, `benefits` before sending to `createHabit()` - only `title`, `description`, `frequency`, `preferredTime` accepted
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
& Development Commands
**Backend Testing:**
```bash
cd "back - HabitMind AI"
npm run test              # Run all Jest tests
npm run test:watch       # Watch mode (re-run on file change)
npm run test:cov         # Coverage report
npm run test:e2e         # Integration tests (full DB setup)
npm run lint             # ESLint + fix
npm run format           # Prettier format
npm run build            # Compile + copy i18n locales to /dist
```

**Development Servers:**
```bash
# Backend (NestJS) - Watch mode with hot-reload
cd "back - HabitMind AI"
npm run start:dev        # Port 3000, includes Swagger at /api/docs

# Frontend (Expo)
cd "front - HabitMind AI/app"
npm start                # Shows QR code for Expo Go app
npm run android          # Android Emulator (via Android Studio)
npm run ios              # iOS Simulator (macOS only)
npm run web              # Web preview (limited React Native support)checks habits with `preferredTime`, sends notification 10 min before
- Database: `User.deviceToken` stores Expo push token, `NotificationLog` table logs all sent notifications
- **CRON Expression:** `EVERY_5_MINUTES` - checks all habits with scheduled times

**Frontend (React Native):**
- Service: `src/services/notificationService.ts` → Request permissions, get device token, register with backend
- Hooks: `useNotifications()` (setup), `useNotificationNavigation()` (handle tap)
- **Flow:**
  1. User logs in → `useNotifications()` gets device token
  2. Token sent to `POST /notifications/register-device`
  3. Every 5 min backend checks if 10 min before habit time
  4. Notification sent via Expo Push API
  5. User taps → navigates to habit details
- **Integration:** Already in `App.tsx` via `useNotifications()`

### 9. Testing Commands
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
})); & State Persistence
**Token Persistence:** `expo-secure-store` (encrypted) + AsyncStorage (user profile only)
```typescript
// Secure tokens (encrypted on device)
import { secureStorage } from '../utils/secureStorage'
await secureStorage.setItem('accessToken', token)
const token = await secureStorage.getItem('accessToken')

// Non-sensitive data only (JSON stringified)
import AsyncStorage from '@react-native-async-storage/async-storage'
await AsyncStorage.setItem('user', JSON.stringify(userData))

// Language preference (persisted in secureStorage via languageStore)
```
**Key Pattern:** Never store passwords, tokens in AsyncStorage. Use secureStorage for all auth data; AsyncStorage for UI preferences.creditStore` → `gainCredits()`, `loadCredits()`
- `aiStore` → `getSingleHabitSuggestion()`, `getInsights()`, `getSuggestedHabits()`

**Critical:** Action names are verbs (createHabit, NOT addHabit). Always desestruture correct names or TypeScript will error.

### 2. API Client (Axios)
**LAuto-injects Accept-Language header from languageStore
// Throws typed errors: { response: { status, data: { message, code } } }
```
**Environment:**
```
REACT_APP_API_URL=http://localhost:3000  (or http://10.0.2.2:3000 on Android - auto-handled)
REACT_APP_API_TIMEOUT=30000
```
**Key Pattern:** Platform-aware URL handling - Android emulator uses `10.0.2.2` to reach host machine; iOS/device use `localhost`. Client auto-converts `localhost → 10.0.2.2` on Android. No manual config needed.
REACT_APP_API_URL=http://localhost:3000  (or http://10.0.2.2:3000 on Android)
REACT_APP_API_TIMEOUT=30000
```

### 3. Secure Storage; no `any` types allowed
- Zustand hooks for state lifting (avoid prop drilling 3+ levels)
- All modals have 500ms animation timeout before closing:
  ```tsx
  const handleClose = () => {
    setShowModal(false);
    setTimeout(() => callback(), 500);  // Allow animation to complete
  };
  ```
- **Modal Pattern:** Accept `visible` + `onClose` props, include `isLoading` + `error` states

**Nested Navigation (Critical for Multi-Tab Apps):**
```tsx
// Navigation tree: RootNavigator → AppTabs
// AppTabs → HabitsTab/UserTab → HabitsStack/UserStack

// Cross-tab navigation requires TWO async steps:
const handleNavigateToCredits = () => {
  navigation.navigate('UserTab' as any);                    // Step 1: Switch tab
  setTimeout(() => navigation.navigate('Credits'), 100);   // Step 2: Push screen
};

// Single-tab navigation works directly:
navigation.navigate('HabitDetail', { habitId: '123' });
```
**Why Two Steps?** React Navigation requires tab switch before pushing to nested stack. Omitting Step 1 → "action not handled" error.
const { t, language } = useI18n();

// Step 3: All user-facing strings use i18n
<Text>{t('habits.labels.habit_name')}</Text>
<TextInput placeholder={t('habits.placeholders.habit_name')} />
<Button title={t('ui.buttons.save')} />
```

**Screens Fully Integrated (100%):** LoginScreen, RegisterScreen, CreateHabitScreen, HabitDetailScreen, DashboardScreen, ProfileScreen, InsightsScreen

**Phase 3 Ready:** 9+ components + services + navigation titles (Estimated 5-7 hours to complete)

**Validation:** Run `npx ts-node src/i18n/validate.ts` to ensure all keys synchronized across languages

### 5. Atomic Design & Component Pattern
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
cd "back - HabitMind AI"
npm run build          # Compiles TypeScript to /dist + copies src/i18n/locales
npm run start:prod     # Runs dist/main.js (uses .env for DATABASE_URL, etc)
npm run lint           # Checks code style + fixes
npm run test:cov       # Code coverage
# Docker: docker-compose up -d  (PostgreSQL 14 + NestJS in container)
```

### Frontend
```bash
cd "front - HabitMind AI/app"
npm start              # Expo dev server (shows QR code)
npm run android        # Launches Android Emulator (requires Android Studio)
npm run ios            # iOS Simulator (macOS only)
npm run web            # Web preview (limited; some React Native APIs unsupported)
# EAS Build: eas build --platform android (requires Expo account + credentials)
```

### Environment Files
**Backend** (`back - HabitMind AI/.env`):
```
DATABASE_URL=postgresql://user:password@localhost:5432/habitsmind_dev
JWT_SECRET=your-secret-key
JWT_EXPIRATION=7d
NODE_ENV=development
EXPO_PUSH_API_TOKEN=ExponentPushToken[...]  # For notifications
```

**Frontend** (`front - HabitMind AI/app/.env` or via `.env.local`):
```
REACT_APP_API_URL=http://localhost:3000
REACT_APP_API_TIMEOUT=30000
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

### Add String to Frontend (i18n)
1. **Add key to all 3 locale files:**
   ```json
   {
     "module": {
       "context": {
         "new_key": "Portuguese text"
       }
     }
   }
   ```
2. **Add same key to `en-us.json` and `es-es.json`**
3. **Use in component:**
   ```typescript
   const { t } = useI18n();
   <Text>{t('module.context.new_key')}</Text>
   ```
4. **Validate:** Run `npx ts-node src/i18n/validate.ts` from frontend

### Debug Mobile App
- **Android Emulator:** Run `npx expo start --android`; press 'a' in Expo CLI
- **Network Issues:** Check if API URL uses `10.0.2.2` (for emulator) or `localhost` (for device)
- **Token Expired:** Check `expo-secure-store` hasn't cleared token unexpectedly
- **State Not Updating:** Ensure Zustand hook is called in component
- **Language Not Changing:** Verify component uses `useI18n()` hook and not just imported constants

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

1. **Always check `DOCS/` first** (13 files, 6,961+ lines)
   - `DOCS/QUICK_START.md` → Full setup guide (15 min)
   - `DOCS/BACKEND/04_API_REFERENCE/00_API_COMPLETA.md` → All 25+ endpoints
   - `DOCS/AI_ANALYSIS_IMPROVEMENTS_v1.1.md` → AI system deep-dive

2. **Architecture Understanding**
   - Backend: 8 modular services + Prisma ORM + JWT auth + i18n middleware
   - Frontend: Zustand stores → Services → Components → Screens (MVVM)
   - Data flow: User → Auth Guard → RateLimitGuard → @CreditCostDecorator → Service

3. **Database-First Workflow**
   - Always modify `prisma/schema.prisma` BEFORE coding
   - Run `npm run prisma:migrate` immediately after schema changes
   - Test with `prisma studio` to verify data integrity
   - Never hardcode migrations or skip generation

4. **Credit System Must Be Tested**
   - Every API call affecting `availableCredits` needs guard + deduction test
   - Verify 403 ForbiddenException returns `credits: { remaining, limit, resetTime }`
   - Test free vs premium plan behavior (10-credit daily refill vs unlimited)
   - Deduction must happen AFTER operation succeeds

5. **Frontend i18n on All Strings**
   - Backend: i18n happens server-side; responses already translated
   - Frontend: ALL user-facing strings must use `const { t } = useI18n()`
   - Add keys to all 3 locales: `pt-br.json`, `en-us.json`, `es-es.json`
   - Run `npx ts-node src/i18n/validate.ts` before committing

6. **Zustand Stores Are Truth Source**
   - Check `front-HabitMind AI/app/src/store/*.ts` before creating new API calls
   - Action names must be verbs: `createHabit` (not `addHabit`), `loadCredits`
   - Use `useXStore()` in components only; pass data via props to preserve testability

7. **Navigation Multi-Step Pattern**
   - Cross-tab: `navigate('Tab')` → `setTimeout(() => navigate('Screen'), 100)`
   - Single-tab: `navigate('Screen', { params })`
   - Root: RootNavigator → AppTabs → (HabitsTab|UserTab) → (HabitsStack|UserStack)

8. **DTO Validation Strictness**
   - Backend rejects extra fields: "property X should not exist"
   - Frontend must strip suggestion fields before `createHabit()`
   - Example: AI suggestion has `category`, `reason` but CreateHabitDto doesn't

9. **Testing Coverage for Critical Paths**
   - Credit deduction endpoints (POST /ai/analyze, GET /ai/suggest)
   - Authentication refresh logic (JwtAuthGuard + interceptors)
   - Push notification registration (NotificationsController)
   - i18n fallback behavior (missing keys, unsupported languages)
