# Feature Landscape: User Profile, Cross-Device Auth & Book Progress

**Domain:** Fitness app with training program book
**Researched:** 2026-05-04
**Focus:** New features only — profile, auth sync, book progress

---

## 1. User Profile

### Table Stakes (Expected)

| Feature | Why Expected | Complexity |
|---------|---------------|-------------|
| Avatar display | Visual identity in top bar | Low |
| Avatar upload/crop | Users want personalized profile | Medium |
| Display name editing | Basic profile management | Low |
| Logout button | Essential session control | Low |
| Profile accessible from top bar | Standard navigation pattern | Low |

### Differentiators

| Feature | Value Proposition | Complexity |
|---------|-------------------|------------|
| Workout stats summary | Show progress at a glance | Medium |
| Achievement badges | Gamify consistency | Medium |
| Reading streak (book) | Motivate program completion | Low |
| Privacy controls | Let users control data visibility | Low |

### Anti-Features

| Avoid | Why |
|-------|-----|
| Social features (followers, sharing) | Not relevant for solo training app |
| Complex profile completion prompts | Friction without value |
| Public profile pages | No social aspect needed |

### Expected UX

- **Top bar icon**: 32-48px avatar, tap opens profile menu/page
- **Profile page**: Avatar + name prominent, logout easily accessible
- **Edit mode**: Inline or modal editing, not separate page
- **Mobile**: Full-width buttons for actions, stack vertically

### Dependencies

- Requires user database (not localStorage)
- Needs backend for avatar storage
- Session management must persist across devices

---

## 2. Cross-Device Authentication

### Table Stakes (Expected)

| Feature | Why Expected | Complexity |
|---------|---------------|-------------|
| Cloud user database | Users expect to login from any device | High |
| Email/password auth | Standard authentication | Medium |
| Session persistence | Don't re-login on every visit | Low |
| Logout from all devices | Security control | Medium |

### Differentiators

| Feature | Value Proposition | Complexity |
|---------|-------------------|------------|
| Remember device | Skip MFA on trusted devices | Low |
| Session management UI | See active sessions, revoke | Medium |
| Password reset flow | Standard recovery | Medium |

### Anti-Features

| Avoid | Why |
|-------|-----|
| Social login (Google, Apple) | Adds complexity, reduces control |
| Passkeys | Overkill for this app size |
| Complex MFA | Friction without significant threat model |

### Expected Behavior

- User registers with email/password → stored in cloud DB
- Login from any device → validates against same DB
- Session stored as token (JWT or session ID)
- Refresh token allows long sessions without re-login
- Logout clears session locally (or globally if needed)

### Current Gap

The app currently uses localStorage only. Users cannot login from a different device with the same credentials. The fix requires:

1. Backend user database (Supabase, Firebase, or custom)
2. Authentication API (register, login, logout, password reset)
3. Token-based session management
4. Sync existing local users to cloud (migration path)

### Dependencies

- Backend infrastructure required
- Database for users + optional profile data
- API endpoints for auth operations

---

## 3. Book Reading Progress

### Table Stakes (Expected)

| Feature | Why Expected | Complexity |
|---------|---------------|-------------|
| Progress indicator | Show how far in chapter/book | Low |
| Resume where left off | Don't make user find their spot | Low |
| Chapter navigation | Jump between chapters | Low |
| Progress saved | Persist across sessions | Low |

### Differentiators

| Feature | Value Proposition | Complexity |
|---------|-------------------|------------|
| Reading timer | Track time spent reading | Medium |
| Reading streaks | Motivate daily reading | Medium |
| Progress percentage per chapter | Fine-grained tracking | Low |
| Estimated finish time | Goal-oriented motivation | Low |

### Anti-Features

| Avoid | Why |
|-------|-----|
| Social sharing | Not relevant |
| Book catalog/ISBN search | Program book is fixed |
| Quote highlighting | Scope beyond MVP |
| Notes/reflections | Beyond basic progress |

### Mobile Optimization Requirements

- **Touch-friendly navigation**: Large tap targets for chapter list
- **Reading view**: Comfortable text size, adequate line height, dark mode
- **Progress always visible**: Header or footer indicator
- **Quick update**: Tap to increment progress, no complex input
- **Vertical scroll**: Natural mobile reading flow

### Expected UX

- When opening book, auto-resume at last position
- Progress shown as percentage or chapter indicator
- Simple tap to mark chapter complete or page progress
- Sync progress to cloud so it's available on any device
- Show total book progress in profile

### Dependencies

- Book progress stored in user data (cloud)
- Requires auth sync to work across devices
- Chapter structure in app (existing: 12 chapters)

---

## MVP Recommendation

### Prioritize

1. **Cross-device auth** — Foundation for all other features. Users cannot have profile sync or progress sync without cloud auth.

2. **User profile top bar** — Low complexity, high visibility. Add avatar icon in header → profile page with name edit + logout.

3. **Book progress tracking** — Simple: save last chapter/page read, show progress indicator, auto-resume.

### Defer

- **Reading timer/streaks**: Adds complexity, nice-to-have
- **Workout stats on profile**: Existing dashboard handles this
- **Avatar upload**: Start with initials fallback, add upload later

### Feature Dependencies

```
Cross-Device Auth
    └── User Profile (requires cloud user)
    └── Book Progress Sync (requires cloud user data)
```

The auth fix unlocks both profile and progress features — build auth first.

---

## Sources

- UX Patterns: User Profile (uxpatterns.dev)
- Cross-device auth patterns (Transmit Security, FIDO Alliance)
- Reading tracker apps: ReadBrew, Bookmory, Leaf, Bookie, Pick Up
- Mobile profile design best practices (IxDF, LogRocket)
- Modern auth 2026 (Akousa blog)