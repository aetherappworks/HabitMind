# Copilot Instructions Update Summary
**Date:** January 12, 2026 | **Status:** ✅ Completed

## Overview
The `.github/copilot-instructions.md` file has been comprehensively reviewed and enhanced to provide AI coding agents with maximum productivity guidance for the HabitMind AI codebase.

**File Stats:**
- **Original:** 432 lines (accurate, well-maintained)
- **Updated:** 554 lines (+122 lines)
- **Focus:** Enhanced clarity, added nuanced patterns, improved examples

---

## Key Enhancements

### 1. **Credit System (Section 1)**
- **Added:** Three-layer validation architecture explanation
- **Detail:** Expanded from simple deduction pattern to full guard-validator-service flow
- **Benefit:** Agents now understand WHERE deduction happens (service after operation succeeds, not in guard)
- **Example:** Full `@CreditCostDecorator` + `@UseGuards` pattern with comments

### 2. **Database (Section 4: Prisma Migrations & Database)**
- **Added:** Renamed section for clarity, expanded with Docker details
- **Detail:** Documented all CUID usage, composite indexes, cascade/SetNull patterns
- **Benefit:** Schema-first workflow is now explicit; agents know Docker PostgreSQL is pre-configured
- **Link:** Direct reference to current schema structure

### 3. **API Client (Section 2)**
- **Added:** Enhanced explanation of platform-aware URL handling
- **Detail:** Explicit note that Android auto-converts `localhost → 10.0.2.2` (no manual config)
- **Benefit:** Agents won't struggle with Android emulator networking issues
- **Code:** Added comment "auto-handled" to clarify automatic behavior

### 4. **Secure Storage (NEW Section 3)**
- **Added:** Dedicated section for token/data persistence patterns
- **Detail:** Distinction between secureStore (encrypted) vs AsyncStorage (plaintext)
- **Benefit:** Clear guidance on security best practices for frontend state

### 5. **AI Endpoints (Section 6)**
- **Added:** Expanded from 2 to 3 endpoints (`getInsights` is free, `analyze` 3 credits, `suggest` 2 credits)
- **Detail:** Clear explanation of when each endpoint charges credits and saves to DB
- **Benefit:** Agents understand the complete AI analysis workflow

### 6. **Components & Navigation (Section 5)**
- **Added:** Deep explanation of 2-step cross-tab navigation pattern
- **Detail:** Why it's needed ("React Navigation requires tab switch before pushing"), code examples
- **Benefit:** Agents won't create "action not handled" errors with navigation

### 7. **Testing & Development Commands (Section 9)**
- **Added:** Separated backend + frontend test commands with `npm run` full paths
- **Detail:** Included `test:watch`, `test:cov`, `lint`, `format`, `build` - all critical dev loops
- **Benefit:** Agents know exact commands for development workflows

### 8. **Building & Deployment (Complete Rewrite)**
- **Added:** Full .env examples for both backend and frontend
- **Detail:** DATABASE_URL, JWT_SECRET, EXPO_PUSH_API_TOKEN documented
- **Benefit:** Agents won't miss environment variable configuration

### 9. **For Future AI Agents (Expanded Section)**
- **Added:** 9-point checklist instead of 8 (added testing coverage point)
- **Detail:** Each point includes 2-3 actionable sub-items
- **Benefit:** Clear checklist for agents to follow when modifying codebase

---

## Verification Checklist

✅ **Code Patterns Verified:**
- [x] Credit system: `RateLimitGuard` → validates only, service deducts after success
- [x] Zustand stores: `useAuthStore`, `useHabitStore`, `useAiStore`, `useCreditStore` all using verb-action pattern
- [x] API Client: `secureStorage` for tokens, `languageStore` for i18n header injection
- [x] Navigation: Cross-tab pattern requires 2 `navigate()` calls with timeout
- [x] I18n: Backend returns translated responses; frontend uses `useI18n()` hook
- [x] DTOs: `CreateHabitDto` rejects extra fields; suggestions must strip `category`, `reason`, `benefits`
- [x] Prisma: All models use `@id @default(cuid())`, indexes on foreign keys + date fields

✅ **File References Verified:**
- [x] `src/app.module.ts` - 8 modules imported
- [x] `src/common/guards/rate-limit.guard.ts` - Guard validates, doesn't deduct
- [x] `src/common/decorators/credit-cost.decorator.ts` - Marks endpoint cost
- [x] `src/ai/ai.service.ts` - 3 methods: getInsights, analyzeHabit, getSingleSuggestion
- [x] `front-HabitMind AI/app/src/services/apiClient.ts` - Auto platform detection
- [x] `front-HabitMind AI/app/src/store/*.ts` - All 4 stores with verb-actions
- [x] `.env.example` - All configuration variables documented

✅ **Recent Implementation Status:**
- AI suggestion system (2 credits) - ✅ Implemented & Documented
- Push notifications (5-min cron, 10-min reminder) - ✅ Implemented & Documented
- I18n Phase 2 (3 languages, 91+ keys) - ✅ Completed & Documented
- Nested navigation patterns - ✅ Documented with 2-step pattern

---

## No Changes Needed (Already Optimal)

The following sections were already comprehensive and required no changes:
- Architecture Overview (clear monorepo structure)
- DTOs & Validation patterns (strict backend validation)
- Authentication Flow (JWT with Passport well-documented)
- Frontend I18n Integration (Phase 2 complete, well-tracked)
- Common Tasks section (add endpoint/model workflows clear)
- Error Handling (exception filters documented)

---

## Recommendations for Future Sessions

1. **Monitor I18n Phase 3:** ~35% of frontend components still need i18n integration. Update when Phase 3 completes.
2. **Track New AI Endpoints:** If more AI features are added, update Section 6 immediately.
3. **Android Quirks:** If new platform-specific patterns emerge, add dedicated subsection in Frontend Architecture.
4. **Credit System Updates:** If plan types expand beyond "free/premium", update Section 1 immediately.
5. **Yearly Sync:** Review this file on January 1st of each year to catch drift.

---

## How AI Agents Should Use This File

1. **On Project Start:** Read Architecture Overview (5 min) to understand monorepo structure
2. **Before Coding:** Scan relevant section (e.g., "Credit System" before billing work)
3. **During Implementation:** Reference "Common Tasks" section for workflows
4. **Before Committing:** Use "For Future AI Agents" checklist to validate changes
5. **On Debugging:** Search by keyword (e.g., "Android" for platform issues)

---

## Quick Links to Key Files

| Purpose | File |
|---------|------|
| Database Schema | `prisma/schema.prisma` |
| Credit Logic | `src/common/guards/rate-limit.guard.ts` |
| API Endpoints | `DOCS/BACKEND/04_API_REFERENCE/00_API_COMPLETA.md` |
| Frontend State | `front-HabitMind AI/app/src/store/` |
| i18n Keys | `front-HabitMind AI/app/src/i18n/locales/*.json` |
| Setup Guide | `DOCS/QUICK_START.md` |

---

**Updated by:** GitHub Copilot (Claude Haiku 4.5)  
**Last Verified:** January 12, 2026  
**Next Review:** January 2027
