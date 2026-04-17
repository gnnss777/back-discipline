# Project: Back Discipline - UI/UX Redesign MVP

**Created:** 2026-04-14
**Status:** Planning

---

## Milestone: Login Simplification & Redirect Flow

**Started:** 2026-04-17

### Overview

Simplify the login experience to 2 pages: Landing Page and Dashboard. Pre-login users can see the program structure but can't access content. Post-login, redirect directly to Dashboard. Persist sessions.

### Goals

1. Landing Page: Show program (chapters) + login modal
2. Dashboard: Only accessible after login
3. Program content accessible only after login
4. Persist login sessions (localStorage)
5. Auto-redirect logged-in users to Dashboard

---

## Previous Milestone (Completed: 2026-04-14)

Comprehensive UI/UX redesign and feature expansion for the Back Discipline training app, transforming it into a complete workout companion for back training with progress tracking, workout logging, and user authentication.

### Goals Completed

1. Redesign UI/UX to MVP level with complete progress tracking
2. Add simple authentication with email/password + Stripe payments
3. Implement workout logging (sets, reps, weight, RPE, notes)
4. Add progress visualization (charts, volume tracking, frequency)
5. Embed videos in exercise library
6. Add configurable rest timer
7. Offline-first architecture with local storage
8. Cleaner codebase (remove duplicate structure)

---

## Current State

- Next.js 16 App Router app deployed to Vercel
- Dark theme (#0A0A0A background, #B8956A gold accent)
- 6 pages: Home, livro (program), biblioteca (exercises), dashboard, historico, login/register
- Static content: 12 chapters, 16 exercises
- Tailwind CSS 4, Oswald font, Lucide icons

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16.2.3 |
| Language | TypeScript |
| UI Library | React 19.2 |
| Styling | Tailwind CSS 4 |
| Icons | Lucide React |
| Auth | Custom (localStorage) |
| Payments | Stripe |
| Storage | LocalStorage |

## Success Criteria

- [ ] Landing page shows program structure + login button
- [ ] Login modal on landing page works
- [ ] Program content shows login wall for unauthenticated users
- [ ] Dashboard only accessible for logged-in users
- [ ] Login sessions persist across browser sessions
- [ ] Auto-redirect logged-in users from Landing to Dashboard
- [ ] Clean 2-page flow works correctly

---

*Planning initiated: 2026-04-14*
*Milestone updated: 2026-04-17*