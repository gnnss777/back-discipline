# State: User Profile & Book Improvements (v1.1)

**Milestone:** User Profile & Book Improvements (v1.1)
**Started:** 2026-05-04
**Status:** Planning

---

## Current Position

Phase: Planning (creating roadmap)
Plan: Defining phases and success criteria
Status: Defining roadmap
Last activity: 2026-05-04 — Created roadmap for v1.1

---

## Previous Milestone (Completed: 2026-04-17)

### ALL PHASES COMPLETE ✓

- [x] Phase 1: Landing Page Redesign
- [x] Phase 2: Login/Register Modal
- [x] Phase 3: Session Persistence
- [x] Phase 4: Auto-Redirect Logic
- [x] Phase 5: Route Protection
- [x] Phase 6: Cleanup & Testing

---

## Current Milestone (v1.1)

### Phase Status

| Phase | Goal | Status |
|-------|------|--------|
| 7. Cloud Authentication | Users can register/login with cloud | Not started |
| 8. Auth Migration | Migrate localStorage users to cloud | Not started |
| 9. User Profile | Avatar, profile page, display name edit | Not started |
| 10. Book Progress | Reading progress + mobile optimization | Not started |

---

## Key Decisions

- Using Supabase for cloud auth (replacing localStorage)
- httpOnly cookies for session persistence
- Profile data syncs across devices
- Reading progress stored in cloud (new table)

---

## Accumulated Context

### Technical Notes

- AuthContext.tsx will be refactored to use Supabase
- New files: app/supabase/server.ts, app/supabase/client.ts
- New tables: profiles, reading_progress
- Existing localStorage data will be migrated

### Research Insights

- Phase 2 (Auth Integration): Watch for localStorage migration edge cases
- Phase 4 (Book Progress): Watch for file hash mismatch issues
- Monitor CVE-2025-29927 for Next.js middleware vulnerabilities

---

## Routes (Complete)

| Route | Access | Description |
|-------|--------|-------------|
| `/` | Public | Landing page with program + login modal |
| `/dashboard` | Protected | Progress dashboard |
| `/livro` | Public+Auth | Chapter list (shows auth modal) |
| `/livro/[slug]` | Protected | Chapter content (auth guard) |
| `/biblioteca` | Public+Auth | Exercise library (shows auth modal) |
| `/historico` | Protected | Workout history |
| `/login` | → / or /dashboard | Redirects |
| `/register` | → / or /dashboard | Redirects |

---

*Milestone v1.1: 2026-05-04*