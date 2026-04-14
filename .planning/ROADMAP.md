# Roadmap: Back Discipline MVP

**Created:** 2026-04-14

## Phase 1: Foundation

**Objective:** Set up authentication, project structure, and core infrastructure

### Tasks:
- [ ] 1.1 - Set up project structure (remove duplicate src/app/)
- [ ] 1.2 - Consolidate lib/ folders and shared utilities
- [ ] 1.3 - Create user types and interfaces
- [ ] 1.4 - Create local storage utilities
- [ ] 1.5 - Set up authentication context/hooks

**Plans:**
- [x] 01-foundation-01-PLAN.md — Consolidate duplicate folders
- [x] 01-foundation-02-PLAN.md — Types, storage, and auth context

**Deliverables:**
- Clean codebase structure
- User types defined
- Auth system ready

---

## Phase 2: Authentication & Stripe

**Objective:** User registration, login, and payment integration

### Tasks:
- [x] 2.1 - Create login page
- [x] 2.2 - Create register page
- [x] 2.3 - Implement auth logic (localStorage)
- [x] 2.4 - Create protected route wrapper
- [x] 2.5 - Integrate Stripe payment form
- [x] 2.6 - Payment status tracking
- [ ] 2.7 - User session management (part of AuthContext)

**Plans:**
- [x] 02-authentication-stripe-01-PLAN.md — Login/register pages and protected routes
- [x] 02-authentication-stripe-02-PLAN.md — Stripe payment integration

---

## Phase 3: Workout Logging

**Objective:** Core workout logging functionality

### Tasks:
- [ ] 3.1 - Create workout log form component
- [ ] 3.2 - Exercise selector with search
- [ ] 3.3 - Set/rep/weight inputs
- [ ] 3.4 - RPE selector (1-10)
- [ ] 3.5 - Notes input
- [ ] 3.6 - Save workout function
- [ ] 3.7 - Workout history list

**Plans:**
- [ ] 03-workout-logging-01-PLAN.md — Workout log form components
- [ ] 03-workout-logging-02-PLAN.md — Workout history view

**Deliverables:**
- Login/Register pages
- Stripe payment integration
- Protected routes

---

## Phase 3: Workout Logging

**Objective:** Core workout logging functionality

### Tasks:
- [ ] 3.1 - Create workout log form component
- [ ] 3.2 - Exercise selector with search
- [ ] 3.3 - Set/rep/weight inputs
- [ ] 3.4 - RPE selector (1-10)
- [ ] 3.5 - Notes input
- [ ] 3.6 - Save workout function
- [ ] 3.7 - Workout history list

**Deliverables:**
- Working workout logger
- Workout history view

---

## Phase 4: Progress Tracking & Dashboard

**Objective:** Dashboard with progress visualization

### Tasks:
- [x] 4.1 - Create dashboard layout (existing)
- [x] 4.2 - Current week/day display (on dashboard)
- [x] 4.3 - Program progress bar (existing)
- [x] 4.4 - Days trained counter (Plan 02)
- [x] 4.5 - Weekly volume calculation (Plan 01)
- [ ] 4.6 - Volume chart component
- [ ] 4.7 - Training frequency tracker
- [ ] 4.8 - Exercise progression view
- [x] 4.9 - Chapter completion tracking (Plan 01)

**Plans:**
- [x] 04-progress-tracking-01-PLAN.md — Progress tracking infrastructure
- [ ] 04-progress-tracking-02-PLAN.md — Dashboard with real data

**Deliverables:**
- Complete dashboard with all progress metrics

---

## Phase 5: Exercise Library Videos

**Objective:** Add video embeds to exercise library

### Tasks:
- [ ] 5.1 - Enhance exercise data structure
- [ ] 5.2 - Add video field to exercises
- [ ] 5.3 - Create video player component
- [ ] 5.4 - Update exercise cards with video
- [ ] 5.5 - Search and filter enhancements

**Plans:**
- [ ] 05-01-PLAN.md — Video infrastructure (types, VideoPlayer, data)
- [ ] 05-02-PLAN.md — Update biblioteca page with video modal and filtering

**Deliverables:**
- Exercise library with embedded videos

---

## Phase 6: Rest Timer

**Objective:** Configurable rest timer with audio

### Tasks:
- [ ] 6.1 - Create timer component
- [ ] 6.2 - Preset time buttons
- [ ] 6.3 - Custom time input
- [ ] 6.4 - Audio notification
- [ ] 6.5 - Visual countdown
- [ ] 6.6 - Background timer support

**Deliverables:**
- Working rest timer

---

## Phase 7: UI/UX Polish & Cleanup

**Objective:** Final polish and mobile optimization

### Tasks:
- [ ] 7.1 - Component library review
- [ ] 7.2 - Mobile responsiveness fixes
- [ ] 7.3 - Loading states
- [ ] 7.4 - Error handling
- [ ] 7.5 - Navigation improvements
- [ ] 7.6 - Final testing

**Deliverables:**
- Production-ready MVP

---

**Phase Dependencies:**
- Phase 1 → Phase 2 → Phase 3 → Phase 4 → Phase 5 → Phase 6 → Phase 7
- Phase 5 can start after Phase 3 (exercise data ready)
- Phase 6 is independent

---

*Roadmap: 2026-04-14*