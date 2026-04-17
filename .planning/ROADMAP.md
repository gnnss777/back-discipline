# Roadmap: Login Simplification

**Milestone:** Login Simplification & Redirect Flow
**Started:** 2026-04-17

---

## Phase 1: Landing Page Redesign

**Objective:** Transform home page to show program structure + login button

### Tasks:
- [ ] 1.1 - Update landing page to show program structure (chapters list)
- [ ] 1.2 - Add "Entrar" button that opens login modal
- [ ] 1.3 - Add "Cadastrar" button that opens register modal  
- [ ] 1.4 - Make chapter items non-clickable or show login prompt
- [ ] 1.5 - Ensure mobile responsive design
- [ ] 1.6 - Test landing page displays correctly

**Deliverables:**
- Landing page with program list + login buttons

---

## Phase 2: Login/Register Modal

**Objective:** Create modal component for authentication

### Tasks:
- [ ] 2.1 - Create LoginModal component
- [ ] 2.2 - Create RegisterModal component
- [ ] 2.3 - Add toggle between login/register in modal
- [ ] 2.4 - Add close modal functionality
- [ ] 2.5 - Add error handling and validation
- [ ] 2.6 - Add loading states during auth
- [ ] 2.7 - Integrate with existing auth context

**Deliverables:**
- Working login/register modal on landing page

---

## Phase 3: Session Persistence

**Objective:** Persist login sessions in localStorage

### Tasks:
- [ ] 3.1 - Update useAuth hook to save session to localStorage
- [ ] 3.2 - Update useAuth hook to load session from localStorage on init
- [ ] 3.3 - Add clearSession method
- [ ] 3.4 - Add session expiration (optional)
- [ ] 3.5 - Test persistence across browser refresh

**Deliverables:**
- Login sessions persist across browser sessions

---

## Phase 4: Auto-Redirect Logic

**Objective:** Redirect logged-in users automatically to Dashboard

### Tasks:
- [ ] 4.1 - Check auth status on landing page load
- [ ] 4.2 - Redirect to /dashboard if already logged in
- [ ] 4.3 - Handle edge cases (no infinite loops)
- [ ] 4.4 - Test auto-redirect works correctly

**Deliverables:**
- Logged-in users redirected to Dashboard automatically

---

## Phase 5: Route Protection

**Objective:** Protect Dashboard and content routes

### Tasks:
- [ ] 5.1 - Create AuthGuard component
- [ ] 5.2 - Add auth check to Dashboard page
- [ ] 5.3 - Add auth check to /livro/[slug] pages
- [ ] 5.4 - Add auth check to /biblioteca
- [ ] 5.5 - Add auth check to /historico
- [ ] 5.6 - Show login prompt for protected routes

**Deliverables:**
- All non-landing routes protected

---

## Phase 6: Cleanup & Testing

**Objective:** Final cleanup and comprehensive testing

### Tasks:
- [ ] 6.1 - Remove standalone login page (or redirect to landing)
- [ ] 6.2 - Remove standalone register page (or redirect to landing)
- [ ] 6.3 - Test full user flow (register -> login -> dashboard)
- [ ] 6.4 - Test logout flow
- [ ] 6.5 - Test mobile responsiveness
- [ ] 6.6 - Build and deploy to Vercel

**Deliverables:**
- Clean 2-page flow working correctly

---

## Phase Dependencies

- Phase 1 → Phase 2 (modal needs landing page context)
- Phase 2 → Phase 3 (modal needs auth context updates)
- Phase 3 → Phase 4 (auto-redirect uses persisted session)
- Phase 4 → Phase 5 (protection uses auth state)
- Phase 5 → Phase 6 (cleanup after all features)

---

*Roadmap created: 2026-04-17*