# Requirements: Login Simplification

**Milestone:** Login Simplification & Redirect Flow
**Started:** 2026-04-17

---

## Feature 1: Landing Page

### Description
Replace the current Landing Page (home) to show program structure + login button. This is the only public page for unauthenticated users.

### Requirements

| ID | Requirement | Acceptance Criteria |
|----|------------|------------------|
| LP-1 | Display program structure (6 weeks, 11 chapters) | User can see chapter list with titles and week groupings |
| LP-2 | Show "Entrar" button | Button opens login modal |
| LP-3 | Show "Cadastrar" button | Button opens register modal in same modal container |
| LP-4 | Display program previews (locked) | Chapter items show titles but are non-clickable or show login prompt |
| LP-5 | Responsive mobile design | Works on mobile devices |
| LP-6 | Bottom navigation visible | Shows navigation tabs but restricted functionality |

---

## Feature 2: Login/Register Modal

### Description
Modal component on Landing Page for authentication. Replaces standalone login/register pages.

### Requirements

| ID | Requirement | Acceptance Criteria |
|----|------------|------------------|
| LR-1 | Login form in modal | Email + password fields + "Entrar" button |
| LR-2 | Register form in modal | Name + email + password + confirm password + "Cadastrar" button |
| LR-3 | Switch between login/register | Toggle link to switch forms without closing modal |
| LR-4 | Close modal | X button or click outside to close |
| LR-5 | Error handling | Show validation errors for invalid email/password |
| LR-6 | Loading state | Show loading indicator during authentication |

---

## Feature 3: Session Persistence

### Description
Persist login sessions across browser sessions using localStorage.

### Requirements

| ID | Requirement | Acceptance Criteria |
|----|------------|------------------|
| SP-1 | Store user session in localStorage | User data persisted with key like "bd_user" |
| SP-2 | Check session on page load | Check localStorage on app initialization |
| SP-3 | Session expiration option | Optional: expire after 30 days |
| SP-4 | Logout clears session | Clear localStorage on logout |

---

## Feature 4: Auto-Redirect Logic

### Description
Automatically redirect logged-in users away from Landing Page to Dashboard.

### Requirements

| ID | Requirement | Acceptance Criteria |
|----|------------|------------------|
| AR-1 | Check auth status on Landing Page load | If logged in, redirect to /dashboard |
| AR-2 | Redirect to originally requested page | After login, go to Dashboard (not originally requested) |
| AR-3 | No infinite redirect loops | Handle edge cases correctly |

---

## Feature 5: Dashboard Protection

### Description
Protect Dashboard route from unauthenticated access.

### Requirements

| ID | Requirement | Acceptance Criteria |
|----|------------|------------------|
| DP-1 | Check auth on Dashboard load | If not logged in, redirect to / |
| DP-2 | Show loading while checking auth | Prevent flash of content |
| DP-3 | Preserve return URL | Optional: redirect back after login |

---

## Feature 6: Program Content Protection

### Description
Protect chapter content from unauthenticated access.

### Requirements

| ID | Requirement | Acceptance Criteria |
|----|------------|------------------|
| PC-1 | Check auth on chapter page load | If not logged in, show login prompt/message |
| PC-2 | Show login prompt UI | "Faça login para acessar este conteúdo" message |
| PC-3 | Link to login | Button to open login modal |

---

## Feature 7: Auth Context Updates

### Description
Update AuthContext to support session persistence and checking.

### Requirements

| ID | Requirement | Acceptance Criteria |
|----|------------|------------------|
| AC-1 | persistSession method | Save session to localStorage |
| AC-2 | loadSession method | Load session from localStorage |
| AC-3 | clearSession method | Clear session from localStorage |
| AC-4 | isAuthenticated computed | Boolean based on current session |
| AC-5 | Wrap app in AuthProvider | Ensure auth state available app-wide |

---

## Technical Notes

### localStorage Keys
- `bd_user`: User object (id, email, name, createdAt)
- `bd_session`: Session timestamp

### Routes After Changes
| Route | Access | Description |
|-------|--------|-------------|
| `/` | Public | Landing page with program + login modal |
| `/dashboard` | Protected | Progress dashboard (logged in only) |
| `/livro/[slug]` | Protected | Chapter content (logged in only) |
| `/biblioteca` | Protected | Exercise library (logged in only) |
| `/historico` | Protected | Workout history (logged in only) |

### Components to Create/Modify
- `LoginModal` component (new)
- `RegisterModal` component (new) 
- `AuthGuard` wrapper (new)
- `useAuth` hook updates (modify)
- Landing page updates (modify)
- Dashboard protection (modify)

---

## Out of Scope
- Stripe payment integration (keep existing UI but behind auth)
- Workout logging feature expansion
- Video embedding in exercise library

---

*Requirements created: 2026-04-17*