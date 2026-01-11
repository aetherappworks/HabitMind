# Phase 3: Component & Service Integration Guide

**Current Status:** Phase 2 Complete (60% integration)  
**Next Step:** Integrate components and services  
**Estimated Work:** 35% of codebase

---

## Components to Integrate (9 files)

### Priority 1: Core UI Components

#### 1. **Button.tsx** (1-2 files)
**Location:** `src/components/Button.tsx`

**Strings to Replace:**
- Loading text states ("Carregando..." currently hardcoded)
- Generic button labels if any

**Integration Pattern:**
```typescript
import { useI18n } from '../i18n/useI18n';

export function Button({ title, isLoading, ...props }: ButtonProps) {
  const { t } = useI18n();
  
  return (
    <Pressable>
      <Text>{isLoading ? t('ui.buttons.loading') : title}</Text>
    </Pressable>
  );
}
```

#### 2. **Input.tsx**
**Location:** `src/components/Input.tsx`

**Strings to Replace:**
- Error message displays
- Placeholder validation messages
- Required field indicators

**Integration Pattern:**
```typescript
import { useI18n } from '../i18n/useI18n';

export function Input({ error, ...props }: InputProps) {
  const { t } = useI18n();
  
  return (
    <>
      <TextInput {...props} />
      {error && <Text>{error}</Text>}
    </>
  );
}
```

#### 3. **Toast.tsx**
**Location:** `src/components/Toast.tsx`

**Strings to Replace:**
- Toast message formatting
- Success/error icon labels (currently hardcoded text)

---

### Priority 2: Modal Components

#### 4. **CheckInModal.tsx**
**Location:** `src/components/CheckInModal.tsx`

**Strings to Replace:**
- "Registrar Check-in"
- "Completado"
- "Pulado"
- Button labels
- Confirmation text

**Expected Keys:**
- `habits.labels.checkin`
- `ui.buttons.complete`
- `ui.buttons.skip`
- `ui.buttons.record`

#### 5. **AIAnalysisModal.tsx**
**Location:** `src/components/AIAnalysisModal.tsx`

**Strings to Replace:**
- Modal title
- Loading state text
- Analysis section headers
- Action buttons

**Expected Keys:**
- `ai.labels.analysis`
- `ai.labels.recommendations`
- `ai.buttons.analyze`
- `ui.buttons.view_more`

#### 6. **HabitSuggestionsModal.tsx**
**Location:** `src/components/HabitSuggestionsModal.tsx`

**Strings to Replace:**
- "Novas Sugestões de Hábitos"
- "Adicionar Hábito"
- Empty state text
- Category labels

**Expected Keys:**
- `ai.labels.habit_suggestions`
- `habits.buttons.add`
- `ai.messages.no_suggestions`

#### 7. **HabitModal.tsx**
**Location:** `src/components/HabitModal.tsx`

**Strings to Replace:**
- "Criar Novo Hábito" title
- "Editar Hábito" title
- Form section headers
- Frequency options (if hardcoded)

---

### Priority 3: Display Components

#### 8. **HabitCard.tsx**
**Location:** `src/components/HabitCard.tsx`

**Strings to Replace:**
- Habit statistics labels
- "Completado hoje" / "Falta completar"
- Action button labels

**Expected Keys:**
- `habits.labels.completed_today`
- `habits.labels.pending`
- `habits.buttons.check_in`

#### 9. **OtherComponents** (if applicable)
- AdsCard.tsx (ad-related labels)
- SettingsCard.tsx (preference labels)
- CreditCard.tsx (credit display text)

---

## Services Integration

### Error Message Mapping
**File:** `src/services/apiClient.ts` (already has i18n setup)

**Task:** Map API error responses to i18n keys

```typescript
// Current pattern (in error handler):
if (error.response?.status === 401) {
  return t('auth.errors.invalid_credentials');
}
if (error.response?.status === 403) {
  return t('common.errors.insufficient_credits');
}
```

**New Keys Needed:**
- Service-level error mappings for each status code
- Business logic error messages
- Validation error messages

---

### Habit Service
**File:** `src/services/habitService.ts`

**Error Messages to Internationalize:**
- "Hábito não encontrado"
- "Erro ao criar hábito"
- "Erro ao atualizar hábito"
- "Erro ao deletar hábito"
- Validation error messages

---

### AI Service
**File:** `src/services/aiService.ts`

**Error Messages to Internationalize:**
- "Análise indisponível" (Analysis unavailable)
- "Sugestões não disponíveis" (No suggestions available)
- Credit warning messages
- Analysis loading states

---

## Navigation Integration

### Screen Header Titles

**File:** Navigation configuration (typically in `navigation/` folder)

```typescript
// Before
screenOptions={{ title: 'Meus Hábitos' }}

// After - Use useI18n in a custom header component
const { t } = useI18n();
screenOptions={{ title: t('screens.dashboard.title') }}
```

**New Keys Needed:**
```json
{
  "screens": {
    "auth": {
      "login": "Login",
      "register": "Register"
    },
    "habits": {
      "dashboard": "My Habits",
      "create": "Create Habit",
      "detail": "Habit Details"
    },
    "user": {
      "profile": "Profile",
      "credits": "Credits",
      "insights": "Insights"
    }
  }
}
```

---

## Implementation Checklist for Phase 3

### Components (9 files)
- [ ] Button.tsx - Loading text
- [ ] Input.tsx - Error messages
- [ ] Toast.tsx - Notification text
- [ ] CheckInModal.tsx - Modal strings
- [ ] AIAnalysisModal.tsx - Analysis text
- [ ] HabitSuggestionsModal.tsx - Suggestions text
- [ ] HabitModal.tsx - Form labels
- [ ] HabitCard.tsx - Card labels
- [ ] Other components (AdsCard, SettingsCard, etc.)

### Services (3 files)
- [ ] apiClient.ts - Error mappings
- [ ] habitService.ts - Error messages
- [ ] aiService.ts - Status messages

### Navigation
- [ ] Screen titles
- [ ] Tab labels
- [ ] Bottom sheet headers

### Locale Updates
- [ ] Add ~30-50 new keys per language
- [ ] Validate all 3 language files are synchronized
- [ ] Run validation script

---

## Quick Reference: New Key Categories Needed

### By Priority

**High Priority (Blocking UI):**
- `screens.*` - Screen titles (10 keys)
- `modals.*` - Modal headers and buttons (15 keys)
- `services.*` - API error mappings (20 keys)

**Medium Priority (Better UX):**
- `habits.labels.*` - Card and form labels (10 keys)
- `ai.labels.*` - Analysis section headers (8 keys)
- `ui.notifications.*` - Toast and alert text (6 keys)

**Low Priority (Edge cases):**
- Frequency option descriptions
- Empty state messages for various screens
- Loading state variations

---

## Testing Phase 3 Integration

```bash
# 1. After implementing each component:
npm run test

# 2. Language validation:
npx ts-node src/i18n/validate.ts

# 3. Manual testing:
# - Switch languages in LanguageSelector
# - Verify all modal text updates
# - Check error messages appear in selected language
# - Confirm language persists across app restart

# 4. Missing key detection:
# - Search for console warnings about missing translation keys
# - Any key not found will show as: [missing: key.path]
```

---

## Notes for Phase 3 Developer

1. **Component Props:** Pass i18n keys through props when possible to avoid multiple `useI18n()` calls per component hierarchy

2. **Modal Strings:** Modals often have multiple text elements; create dedicated translation keys for each section:
   ```json
   {
     "modals": {
       "checkin": {
         "title": "Register Check-in",
         "completed_button": "Mark as Completed",
         "skipped_button": "Mark as Skipped"
       }
     }
   }
   ```

3. **Error Mapping:** Create a service-level error translator:
   ```typescript
   const errorMap: Record<number, string> = {
     400: t('common.errors.bad_request'),
     401: t('auth.errors.invalid_credentials'),
     403: t('common.errors.insufficient_credits'),
     // etc.
   };
   ```

4. **Loading States:** Reuse `ui.buttons.loading` key for all loading states instead of hardcoding "Carregando..."

5. **Avoid String Concatenation:** Instead of:
   ```typescript
   `${t('habits.labels.completed')} (${count})`
   ```
   Use a parameter-based key:
   ```typescript
   t('habits.messages.items_completed', { count })
   ```

---

## Estimated Timeline

- **Components (9 files):** 2-3 hours
- **Services (3 files):** 1-2 hours  
- **Navigation:** 30 mins - 1 hour
- **Testing & Validation:** 1 hour
- **Total Phase 3:** ~5-7 hours

**Grand Total (All Phases):** ~10-12 hours for full i18n coverage

