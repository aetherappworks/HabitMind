# I18n Quick Reference Card

## Translation Key Cheat Sheet

### Authentication Module
```
auth.errors.user_already_exists
auth.errors.invalid_credentials
auth.errors.user_not_found
auth.errors.weak_password
auth.errors.invalid_email
auth.errors.email_required
auth.errors.password_required
auth.messages.registered_successfully
auth.messages.logged_in_successfully
auth.messages.check_email
```

### Habits Module
```
habits.errors.habit_not_found
habits.errors.invalid_habit_data
habits.errors.habit_already_exists
habits.errors.habit_name_required
habits.errors.invalid_frequency

habits.labels.habit_name
habits.labels.description
habits.labels.frequency
habits.labels.preferred_time
habits.labels.delete_habit
habits.labels.select_time

habits.placeholders.habit_name
habits.placeholders.description
habits.placeholders.select_time

habits.messages.habit_created
habits.messages.habit_updated
habits.messages.habit_deleted
habits.messages.checkin_created
habits.messages.no_habits
habits.messages.create_first_habit

habits.buttons.create
habits.buttons.create_first
```

### AI Module
```
ai.errors.analysis_failed
ai.errors.insufficient_data
ai.errors.insufficient_credits

ai.messages.analysis_completed
ai.messages.insights_generated
ai.messages.insights_loaded
ai.messages.habit_suggestions_generated
ai.messages.habit_suggestion_generated
ai.messages.no_habits_yet
```

### Common Module
```
common.errors.unauthorized
common.errors.forbidden
common.errors.internal_error
common.errors.bad_request
common.errors.not_found
common.errors.rate_limit_exceeded
common.errors.invalid_token
common.errors.user_not_found
common.errors.error_loading

common.messages.success
common.messages.created
common.messages.updated
common.messages.deleted
common.messages.confirm_delete
common.messages.confirm_logout
```

### UI Module (Buttons)
```
ui.buttons.login
ui.buttons.register
ui.buttons.logout
ui.buttons.save
ui.buttons.cancel
ui.buttons.delete
ui.buttons.edit
ui.buttons.create
ui.buttons.submit
ui.buttons.back
ui.buttons.next
ui.buttons.previous
ui.buttons.close
ui.buttons.confirm
ui.buttons.loading
ui.buttons.retry
ui.buttons.try_again
```

### UI Module (Labels & Placeholders)
```
ui.labels.email
ui.labels.password
ui.labels.name
ui.labels.habitName
ui.labels.description
ui.labels.frequency
ui.labels.language
ui.labels.credits
ui.labels.settings
ui.labels.profile

ui.placeholders.email
ui.placeholders.password
ui.placeholders.habitName
ui.placeholders.description
```

### UI Module (Notifications)
```
ui.notifications.success
ui.notifications.error
ui.notifications.warning
ui.notifications.info
ui.notifications.logout
```

---

## Usage Examples

### Basic Translation
```typescript
import { useI18n } from '../i18n/useI18n';

export function MyComponent() {
  const { t } = useI18n();
  
  return <Text>{t('habits.labels.habit_name')}</Text>;
}
```

### Dynamic Translation
```typescript
const { t, language } = useI18n();

console.log(language); // 'pt-br', 'en-us', or 'es-es'
```

### Translation with Parameters
```typescript
const { tParams } = useI18n();

// First add to locale file:
// "items_total": "Total: {{count}}"

const result = tParams('habits.messages.items_total', { count: 5 });
// Output: "Total: 5"
```

### Change Language
```typescript
import { useLanguageStore } from '../store/languageStore';

export function LanguageSwitcher() {
  const { setLanguage } = useLanguageStore();
  
  return (
    <>
      <Button onPress={() => setLanguage('pt-br')} title="Português" />
      <Button onPress={() => setLanguage('en-us')} title="English" />
      <Button onPress={() => setLanguage('es-es')} title="Español" />
    </>
  );
}
```

### Get All Available Languages
```typescript
import { useLanguageStore } from '../store/languageStore';

const { getAvailableLanguages } = useLanguageStore();
const languages = getAvailableLanguages(); // ['pt-br', 'en-us', 'es-es']
```

---

## Common Patterns

### Alert/Confirmation Dialog
```typescript
const { t } = useI18n();

Alert.alert(
  t('ui.notifications.confirm'),
  t('common.messages.confirm_delete'),
  [
    { text: t('ui.buttons.cancel'), style: 'cancel' },
    { text: t('ui.buttons.delete'), style: 'destructive' }
  ]
);
```

### Form Validation
```typescript
const { t } = useI18n();
const validateEmail = (email) => {
  if (!email) return t('auth.errors.email_required');
  if (!email.includes('@')) return t('auth.errors.invalid_email');
  return null;
};
```

### Toast Messages
```typescript
const { t } = useI18n();

showToast({
  message: t('habits.messages.habit_created'),
  type: 'success'
});
```

### Loading States
```typescript
const { t } = useI18n();

<Button 
  title={isLoading ? t('ui.buttons.loading') : t('ui.buttons.save')}
  disabled={isLoading}
/>
```

### Empty States
```typescript
const { t } = useI18n();

{items.length === 0 && (
  <View>
    <Text>{t('habits.messages.no_habits')}</Text>
    <Text>{t('habits.messages.create_first_habit')}</Text>
  </View>
)}
```

---

## File Locations

### Core Files
- `src/i18n/i18n.ts` - Core translation functions
- `src/i18n/useI18n.ts` - React hook
- `src/store/languageStore.ts` - Language state management
- `src/components/LanguageSelector.tsx` - UI component

### Locale Files
- `src/i18n/locales/pt-br.json` - Portuguese (Brazil)
- `src/i18n/locales/en-us.json` - English (US)
- `src/i18n/locales/es-es.json` - Spanish (Spain)

### Documentation
- `I18N_INFRASTRUCTURE_SETUP.md` - Setup guide
- `I18N_INTEGRATION_PHASE2_COMPLETE.md` - Phase 2 status
- `PHASE3_COMPONENT_INTEGRATION_GUIDE.md` - Phase 3 guide
- `I18N_PROGRESS_REPORT.md` - Overall progress
- `SESSION_SUMMARY_PHASE2.md` - Session details

---

## Validation & Testing

### Check All Keys
```bash
npx ts-node src/i18n/validate.ts
```

### Test Language Switch
```typescript
// In any component:
import { useLanguageStore } from '../store/languageStore';

const { setLanguage } = useLanguageStore();

// Manual test:
setLanguage('pt-br');
setLanguage('en-us');
setLanguage('es-es');
```

### Find Missing Translations
```bash
# Search for strings that should use i18n
grep -r "Alert.alert" src/screens | grep -v "t(" | head -20
```

---

## Current Status (Jan 2026)

✅ **Phase 1** - Infrastructure Complete (100%)
- Core i18n system built
- 3 languages supported
- 91+ translation keys active
- Language persistence working
- API integration complete

✅ **Phase 2** - Screen Integration Complete (100%)
- 8 screens fully translated
- All screens using useI18n hook
- No hardcoded strings in major screens
- All locale files synchronized

⏳ **Phase 3** - Components & Services (0%)
- 9+ components ready for integration
- Services ready for error mapping
- Navigation ready for titles
- ~40% of codebase remaining

---

## Quick Troubleshooting

### Missing Translation Key
**Problem:** `[missing: habits.labels.unknown]` appears in UI

**Solution:** Add the key to all 3 locale files:
```json
{
  "habits": {
    "labels": {
      "unknown": "Portuguese translation"
    }
  }
}
```

### Language Not Changing
**Problem:** UI stays in one language even after setLanguage()

**Solution:** Ensure component uses useI18n hook:
```typescript
const { t, language } = useI18n(); // Hook must be called
// language changes will trigger re-render
```

### App Doesn't Remember Language
**Problem:** Language resets on app restart

**Solution:** Ensure languageStore is initialized on app load:
```typescript
// In App.tsx or main screen:
useEffect(() => {
  const { loadLanguage } = useLanguageStore();
  loadLanguage(); // Loads from secureStorage
}, []);
```

### TypeScript Error on t()
**Problem:** TypeScript complains about t() function

**Solution:** Check import path is correct:
```typescript
// Correct
import { useI18n } from '../../i18n/useI18n';

// Wrong paths that will fail
import { useI18n } from '../useI18n'; // Wrong depth
import useI18n from '../useI18n'; // Wrong export (named, not default)
```

---

## Performance Tips

1. **Don't call useI18n in every component** - pass translations via props when possible
2. **Use parameter-based keys** for dynamic content (better than string concat)
3. **Cache language preference** in store (already done)
4. **Lazy load locales** in Phase 3+ (for production)
5. **Validate keys in CI/CD** (use validation script)

---

## Adding New Keys

### Step 1: Add to All 3 Locale Files
```json
// pt-br.json
{ "habits": { "labels": { "new_key": "Portuguese text" } } }

// en-us.json
{ "habits": { "labels": { "new_key": "English text" } } }

// es-es.json
{ "habits": { "labels": { "new_key": "Spanish text" } } }
```

### Step 2: Use in Component
```typescript
const { t } = useI18n();
<Text>{t('habits.labels.new_key')}</Text>
```

### Step 3: Validate
```bash
npx ts-node src/i18n/validate.ts
```

---

## Support & Documentation

| Need | Location |
|------|----------|
| Setup instructions | I18N_INFRASTRUCTURE_SETUP.md |
| Phase 2 status | I18N_INTEGRATION_PHASE2_COMPLETE.md |
| Phase 3 guide | PHASE3_COMPONENT_INTEGRATION_GUIDE.md |
| Overall progress | I18N_PROGRESS_REPORT.md |
| Session details | SESSION_SUMMARY_PHASE2.md |
| Translation keys | This file (Quick Reference) |

---

**Last Updated:** January 2026  
**Current Status:** 60% Complete (Phase 2 Done, Phase 3 Ready to Start)

