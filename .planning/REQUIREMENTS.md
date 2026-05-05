# Requirements: User Profile & Book Improvements (v1.1)

**Milestone:** v1.1 User Profile & Book Improvements
**Created:** 2026-05-04

---

## 1. User Profile (PROF)

### Active Requirements

- [ ] **PROF-01**: User can see avatar icon in top bar
- [ ] **PROF-02**: User can tap avatar to open profile menu/page
- [ ] **PROF-03**: User can edit display name on profile page
- [ ] **PROF-04**: User can log out from profile page
- [ ] **PROF-05**: Profile data syncs across devices (cloud)

### Future Requirements

- Avatar upload/crop functionality
- Workout stats summary on profile
- Achievement badges
- Privacy controls

### Out of Scope

- Social features (followers, sharing)
- Public profile pages
- Social login (Google, Apple)

---

## 2. Cross-Device Authentication (AUTH)

### Active Requirements

- [ ] **AUTH-01**: Users can register with email/password in cloud database
- [ ] **AUTH-02**: Users can login from any device with same credentials
- [ ] **AUTH-03**: Session persists across browser sessions (httpOnly cookies)
- [ ] **AUTH-04**: Existing localStorage users can migrate to cloud
- [ ] **AUTH-05**: Login/logout works correctly after cloud migration

### Future Requirements

- Remember device functionality
- Session management UI (view/revoke sessions)
- Password reset flow

### Out of Scope

- Social login (Google, Apple)
- Passkeys
- Complex MFA

---

## 3. Book Reading (BOOK)

### Active Requirements

- [ ] **BOOK-01**: User can see reading progress indicator per chapter
- [ ] **BOOK-02**: User can resume at last read chapter (auto-resume)
- [ ] **BOOK-03**: User can navigate between chapters easily
- [ ] **BOOK-04**: Progress saves and syncs to cloud
- [ ] **BOOK-05**: Mobile-optimized reading layout (touch-friendly, adequate text size)
- [ ] **BOOK-06**: Total book progress visible (e.g., "5 of 12 chapters completed")

### Future Requirements

- Reading timer/streaks
- Progress percentage per chapter
- Estimated finish time

### Out of Scope

- Social sharing
- Book catalog/ISBN search
- Quote highlighting

---

## 4. Traceability

| REQ-ID | Phase | Requirement |
|-------|-------|--------------|
| AUTH-01 | Phase 7 | Cloud user registration |
| AUTH-02 | Phase 7 | Cross-device login |
| AUTH-03 | Phase 7 | Cookie session persistence |
| AUTH-04 | Phase 8 | localStorage migration |
| AUTH-05 | Phase 8 | Auth flow validation |
| PROF-01 | Phase 9 | Avatar in top bar |
| PROF-02 | Phase 9 | Profile menu access |
| PROF-03 | Phase 9 | Display name edit |
| PROF-04 | Phase 9 | Logout functionality |
| PROF-05 | Phase 9 | Cloud profile sync |
| BOOK-01 | Phase 10 | Chapter progress indicator |
| BOOK-02 | Phase 10 | Auto-resume |
| BOOK-03 | Phase 10 | Chapter navigation |
| BOOK-04 | Phase 10 | Progress sync |
| BOOK-05 | Phase 10 | Mobile optimization |
| BOOK-06 | Phase 10 | Total progress display |

---

*Requirements defined: 2026-05-04*
*16 Active Requirements | 8 Future | 3 Out of Scope*