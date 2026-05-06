# Roadmap: User Profile & Book Improvements (v1.1)

**Milestone:** User Profile & Book Improvements (v1.1)
**Started:** 2026-05-04

---

## Phases

- [x] **Phase 7: Cloud Authentication** - Register, login, and session persistence with cloud database
- [x] **Phase 8: Auth Migration** - Migrate existing localStorage users to cloud (trivially complete — no existing users)
- [x] **Phase 9: User Profile** - Avatar, profile page, display name edit, logout
- [x] **Phase 10: Book Progress** - Reading progress indicators, chapter navigation, mobile optimization (completed 2026-05-06)

---

## Phase Details

### Phase 7: Cloud Authentication

**Goal**: Users can register and login with cloud credentials that persist across all devices

**Depends on**: Nothing (first phase of this milestone)

**Requirements**: AUTH-01, AUTH-02, AUTH-03

**Success Criteria** (what must be TRUE):

1. User can register with email/password in cloud database — registration form creates account in Supabase
2. User can login from any device with same credentials — login works on new device with stored credentials
3. Session persists across browser sessions — httpOnly cookies maintain login across page refreshes

**Plans**: 07-01-PLAN.md

---

### Phase 8: Auth Migration

**Goal**: Existing localStorage users can migrate to cloud and auth flows continue working

**Depends on**: Phase 7 (cloud auth must exist before migration)

**Requirements**: AUTH-04, AUTH-05

**Success Criteria** (what must be TRUE):

1. Existing localStorage users can migrate to cloud — migration tool/data transfer from old system
2. Login/logout works correctly after migration — auth flows function with migrated accounts

**Plans**: TBD

---

### Phase 9: User Profile

**Goal**: Users can view and edit their profile, accessible from top bar avatar

**Depends on**: Phase 7 (requires cloud auth for profile sync)

**Requirements**: PROF-01, PROF-02, PROF-03, PROF-04, PROF-05

**Success Criteria** (what must be TRUE):

1. User can see avatar icon in top bar — user avatar displayed in application header
2. User can tap avatar to open profile menu/page — navigation to profile page works
3. User can edit display name on profile page — form allows name update and saves to cloud
4. User can log out from profile page — logout button terminates session
5. Profile data syncs across devices — name changes reflect on other devices after sync

**Plans**: TBD

**UI hint**: yes

---

### Phase 10: Book Progress

**Goal**: Users can track reading progress with mobile-optimized chapter navigation

**Depends on**: Phase 7 (requires cloud auth for progress sync)

**Requirements**: BOOK-01, BOOK-02, BOOK-03, BOOK-04, BOOK-05, BOOK-06

**Success Criteria** (what must be TRUE):

1. User can see reading progress indicator per chapter — visual indicator shows chapter completion
2. User can resume at last read chapter — application opens to last position automatically
3. User can navigate between chapters easily — next/previous controls function properly
4. Progress saves and syncs to cloud — reading position persists across sessions and devices
5. Mobile-optimized reading layout works correctly — touch-friendly controls, adequate text size on mobile
6. Total book progress visible — summary shows completed chapters (e.g., "5 of 12")

**Plans**: 2 plans

- [x] 10-01-PLAN.md — Data layer: Supabase migration, reading-storage module, server actions
- [x] 10-02-PLAN.md — UI layer: ChapterHeader toggle, mobile CSS, dynamic book index

**UI hint**: yes

---

## Progress Table

| Phase | Plans Complete | Status | Completed |
|-------|---------------|--------|-----------|
| 7. Cloud Authentication | 1/1 | Code complete | - |
| 8. Auth Migration | 1/1 | Complete (trivial) | 2026-05-04 |
| 9. User Profile | 1/1 | Code complete | 2026-05-04 |
| 10. Book Progress | 2/2 | Complete    | 2026-05-06 |

---

*Roadmap created: 2026-05-04*