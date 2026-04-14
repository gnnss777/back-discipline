# Requirements: Back Discipline MVP

**Milestone:** UI/UX Redesign MVP
**Created:** 2026-04-14

## 1. Authentication

### User Registration
- [ ] Email/password registration form
- [ ] Password validation (min 6 chars)
- [ ] Email format validation
- [ ] Store user in localStorage
- [ ] Account creation flow

### User Login
- [ ] Email/password login
- [ ] Authenticate against stored users
- [ ] Session management (localStorage)
- [ ] Logout functionality
- [ ] Protected routes

### Stripe Integration
- [ ] Stripe payment setup
- [ ] Payment form in register flow
- [ ] Store payment status
- [ ] Access control based on payment

## 2. Progress Tracking

### Dashboard (Main Page)
- [ ] Current week/day display
- [ ] Program progress bar (chapters read)
- [ ] Days trained this week
- [ ] Weekly volume overview
- [ ] Quick log button
- [ ] Recent workouts list

### Workout Logging
- [ ] Exercise selector from library
- [ ] Sets × Reps input
- [ ] Weight input (kg/lbs)
- [ ] RPE selector (1-10)
- [ ] Notes per set
- [ ] Save workout
- [ ] Date/time stamp

### Progress Metrics
- [ ] Volume calculation (sets × reps × weight)
- [ ] Weekly volume chart
- [ ] Training frequency (days/week)
- [ ] Exercise progression (weight over time)
- [ ] Chapter completion tracking
- [ ] Visual charts/graphs

### Program Tracking
- [ ] Current week tracking (Week 1-6)
- [ ] Day counter per week
- [ ] Auto-advance week
- [ ] Completion badges

## 3. Exercise Library

### Video Integration
- [ ] Video embeds per exercise
- [ ] Video player component
- [ ] Placeholder for missing videos
- [ ] Video loading states

### Exercise Data
- [ ] Enhanced exercise cards
- [ ] Muscle group display
- [ ] Difficulty indicator
- [ ] Technique tips
- [ ] Search and filter

## 4. Rest Timer

### Timer Features
- [ ] Preset times (30s, 60s, 90s, 120s)
- [ ] Custom time input
- [ ] Audio notification
- [ ] Visual countdown
- [ ] Pause/Resume
- [ ] Works in background

## 5. Offline Support

### Data Persistence
- [ ] LocalStorage for all user data
- [ ] Workout history stored locally
- [ ] Settings stored locally
- [ ] Works without internet

### Sync (Future)
- [ ] Sync when online
- [ ] Conflict resolution

## 6. Codebase Cleanup

### Architecture
- [ ] Remove duplicate src/app/
- [ ] Consolidate lib/ folders
- [ ] Component organization
- [ ] Shared UI components

## 7. UI/UX Improvements

### Visual Design
- [ ] Consistent component library
- [ ] Better spacing/typography
- [ ] Mobile responsiveness
- [ ] Loading states
- [ ] Error states

### Navigation
- [ ] Improved header/nav
- [ ] Mobile menu
- [ ] Breadcrumb navigation

---

*Requirements: 2026-04-14*