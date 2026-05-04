# Research Summary: User Profile, Cross-Device Auth & Book Progress

**Project:** Back Discipline v1.1  
**Synthesized:** 2026-05-04  
**Confidence:** MEDIUM-HIGH

---

## Executive Summary

This research addresses adding three connected features to the Back Discipline app: user profile management, cross-device cloud authentication, and mobile-optimized book reading with progress tracking. The core architectural shift moves from localStorage-based persistence to server-side cloud storage with httpOnly cookie session management.

The recommended approach integrates Supabase (auth + PostgreSQL) as the backend, replacing the existing localStorage-only auth system. This enables cross-device login, user profile sync, and reading progress persistence. React Hook Form + Zod handles profile forms, while the existing UI stack (Next.js 16, Tailwind CSS 4, Lucide) remains unchanged.

Key risks include security vulnerabilities from improper token storage, data migration failures from localStorage to cloud, and progress sync issues due to file hash mismatches. These are preventable with proper implementation patterns identified in this research.

---

## Key Findings

### 1. Stack Additions Needed

| Technology | Purpose | Rationale |
|------------|---------|-----------|
| **Supabase** | Auth + database + user profiles | Official Next.js 16 support via @supabase/ssr. Cookie-based sessions enable cross-device login. Free tier covers 50K MAU. |
| **@supabase/ssr** | Server-side auth | Manages httpOnly cookies, works in middleware and Server Components. Required for Next.js 16. |
| **@supabase/supabase-js** | Browser client | Client-side queries only. Server Components use createServerClient instead. |
| **react-hook-form** | Form state | Uncontrolled inputs = minimal re-renders. Industry standard. |
| **zod** | Validation | TypeScript-first, single source of truth for form rules. Reuse on server (Server Actions). |
| **@hookform/resolvers** | Zod bridge | Translates Zod validation to form errors. |

**What NOT to add:** Firebase (overkill), Auth.js (requires external DB anyway), Clerk (pricing at scale), Prisma (adds ORM complexity), Redux/Zustand (not needed).

---

### 2. Feature Table Stakes

| Feature Area | Table Stakes (Expected) | Differentiators |
|--------------|-------------------------|-----------------|
| **User Profile** | Avatar display, display name editing, logout, profile accessible from top bar | Workout stats summary, achievement badges, reading streak |
| **Cross-Device Auth** | Cloud user database, email/password auth, session persistence | Remember device, session management UI, password reset |
| **Book Progress** | Progress indicator, resume where left off, chapter navigation, progress saved | Reading timer, streaks, estimated finish time |

**MVP Priority:** (1) Cross-device auth → (2) Profile top bar → (3) Book progress. Auth is the foundation that unlocks profile and progress features.

**Anti-Features to Avoid:** Social features, public profiles, passkeys, complex MFA, social login (Google/Apple).

---

### 3. Architecture Integration Points

**Primary integration:** Replace AuthContext (`context/AuthContext.tsx`) localStorage auth with Supabase session management via httpOnly cookies.

**Data persistence changes:**
- `bd_users` localStorage → `profiles` table (Supabase)
- `bd_workouts` → `workouts` table with user_id foreign key
- `bd_progress` → `progress` table
- NEW: `reading_progress` table for book progress

**Files to modify:**
- `.env.local` — Add Supabase URL + anon key
- `app/supabase/server.ts` — New server client
- `app/supabase/client.ts` — New browser client
- `middleware.ts` — Add session refresh
- `app/actions/auth.ts` — Server Actions for auth
- `app/components/UserMenu.tsx` — User icon + profile
- `app/profile/page.tsx` — Profile editing (new)
- `app/livro/page.tsx` — Add reading progress

**Data flow shift:** Client-driven localStorage reads/writes → server-side API calls with real-time subscriptions.

**Build order:** Phase 1 (Foundation) → Phase 2 (Auth Integration) → Phase 3 (Profile UI) → Phase 4 (Book Progress) → Phase 5 (Migration Cleanup).

---

### 4. Key Pitfalls to Avoid (Watch Out For)

| # | Pitfall | Prevention |
|---|---------|------------|
| 1 | **XSS via localStorage tokens** | Store tokens in httpOnly, Secure, SameSite cookies (NOT localStorage). Supabase handles this automatically. |
| 2 | **Big-bang data migration** | Batch sync with chunks, use upsert, track last_synced_at, implement retry logic for failed batches. |
| 3 | **File hash mismatch breaking progress sync** | Multiple sync matching strategies (content hash, filename, ISBN), add manual "force sync" option, warn on hash mismatch. |
| 4 | **Cross-device cookie misconfiguration** | Set SameSite:'lax', include leading dot for subdomains, Secure:true in production, test across browsers/devices. |
| 5 | **Middleware-only auth bypass** | Implement auth at every boundary (middleware, Server Components, Route Handlers, Server Actions). Defense-in-depth, not single-point. |
| 6 | **Race conditions in profile creation** | Use upsert pattern, implement loading states, create DB record at registration (not via webhook). |
| 7 | **Progress offset inconsistencies** | Use CFI for position tracking, normalize on sync (< 0.01% diff = no conflict), allow manual force-sync. |
| 8 | **Token refresh failures silently** | Proper error handling for refresh failures, fallback mechanisms (re-auth prompt), clear error messages. |

---

## Implications for Roadmap

### Suggested Phase Structure

| Phase | Duration | Focus | Deliverables |
|-------|----------|-------|--------------|
| **Phase 1:** Foundation | Week 1 | Supabase setup + auth layer | Supabase project, DB schema (profiles, workouts, progress, reading_progress), RLS policies, middleware |
| **Phase 2:** Auth Integration | Week 2 | Replace localStorage auth | AuthContext refactor, login/register updates, session persistence, migration logic |
| **Phase 3:** Profile UI | Week 3 | User profile features | UserMenu component, profile page, avatar, logout |
| **Phase 4:** Book Progress | Week 4 | Reading progress + mobile | Progress tracking module, chapter indicators, mobile optimization |
| **Phase 5:** Migration Cleanup | Week 5 | Testing + deployment | Full testing, localStorage removal, staging → production |

### Research Flags

- **Phase 2 (Auth Integration):** Needs deeper research on localStorage migration edge cases — test batch sync thoroughly.
- **Phase 4 (Book Progress):** Watch for file hash mismatch issues — implement fallback matching strategies early.
- **All phases:** Monitor CVE-2025-29927 for Next.js middleware vulnerabilities — ensure updated to patched versions.

### Gaps to Address

1. **Offline capability:** Not covered in research. Does the app need offline reading support? If yes, requires sync strategy.
2. **Subscription status:** How does existing subscription state integrate with Supabase?
3. **Data migration scope:** Migration strategy needs testing to ensure all data types transfer correctly.

---

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack (Supabase + forms) | HIGH | Official Next.js 16 packages, industry-standard form validation |
| Features | HIGH | Clear table stakes vs differentiators, MVP path validated |
| Architecture | MEDIUM-HIGH | Standard Supabase integration patterns, build order reasonable |
| Pitfalls | HIGH | Multiple sources with high confidence, security issues well-documented |

---

## Sources

- Supabase Auth with Next.js — Official Guide (2026-05-01)
- Supabase SSR for Next.js App Router (2026-04-03)
- React Hook Form + Zod Patterns (2026-04-20)
- OWASP Authentication Cheat Sheet
- NVD CVE-2025-29927 (Next.js middleware bypass)
- KOReader/Readest Issues — Progress sync pitfalls
- Clerk Documentation — Session management
- GetNextKit Blog — Next.js auth mistakes (2025-11-17)

---

*Research complete. Ready for requirements definition and roadmap planning.*