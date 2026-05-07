# MVP Launch Plan - Back Discipline App

**Document Created:** 2026-05-07  
**Target Launch:** 3 weeks from blocker resolution  
**Current Milestone:** v1.1 "User Profile & Book Improvements" ✅ Code Complete

---

## Executive Summary

### What is the MVP?

The **Back Discipline App** is a workout companion for back training with the following core value proposition:

> **Users can log workouts, track progress over time, and follow a structured 12-chapter training program with cloud-synced authentication.**

### MVP Definition

For this product, the **Minimum Viable Product** means:

1. **Users can register/login** and access their account from any device (cloud auth)
2. **Users can log workouts** (exercises, sets, reps, weight, RPE, notes)
3. **Users can see progress** via dashboard with charts and history
4. **Users can read the training program** (12 chapters) with progress tracking
5. **Users can access exercise library** with embedded videos

**NOT required for MVP:**
- Stripe payments (can be added post-launch)
- User avatar images (initials-based avatar is sufficient)
- Rest timer feature (nice-to-have)
- Advanced social features

---

## Critical Gaps for MVP Launch

### 🔴 BLOCKERS (Must resolve before launch)

| # | Blocker | Status | Impact | Owner |
|---|---------|--------|--------|-------|
| 1 | **Supabase credentials not configured** | ❌ Not started | Auth completely broken on Vercel | Dev |
| 2 | **Database migrations not run** | ❌ Not started | No users can register/login | Dev |
| 3 | **Vercel environment variables missing** | ❌ Not started | Site returns 500 error on every request | Dev |
| 4 | **No E2E tests** | ❌ Not started | No validation of critical flows | Dev |

### 🟡 CRITICAL FUNCTIONALITY GAPS

| # | Gap | Priority | Effort | Notes |
|---|-----|----------|--------|-------|
| 1 | **Auth flow end-to-end testing** | P0 | 2 days | Must verify: register → login → session persistence → logout |
| 2 | **Reading progress sync** | P0 | 1 day | Verify cloud sync works across devices |
| 3 | **Profile data sync** | P0 | 1 day | Verify display name updates sync |
| 4 | **Error handling for offline** | P1 | 2 days | Graceful degradation when Supabase unreachable |
| 5 | **Production build verification** | P0 | 1 day | Full build + deploy test cycle |

---

## Functionality Classification

### ✅ Must-Have (MVP Core)

These features are **non-negotiable** for launch:

| Feature | Status | Notes |
|---------|--------|-------|
| **Cloud Authentication** | Code complete | Blocked on Supabase config |
| - User registration with email/password | ✅ Ready | Server action + AuthContext |
| - User login with credentials | ✅ Ready | Supabase auth |
| - Session persistence (httpOnly cookies) | ✅ Ready | Proxy refreshes session |
| - Cross-device sync | ✅ Ready | Supabase backend |
| **User Profile** | Code complete | Blocked on Supabase config |
| - Avatar display (initials) | ✅ Ready | UserAvatar component |
| - Display name edit | ✅ Ready | Profile page + server action |
| - Logout functionality | ✅ Ready | AuthContext.signOut() |
| **Workout Logging** | ✅ Complete | From previous milestones |
| - Log exercises with sets/reps/weight | ✅ Complete | Planilha page |
| - Save to cloud | ✅ Complete | Supabase storage |
| **Progress Dashboard** | ✅ Complete | From previous milestones |
| - View workout history | ✅ Complete | Histórico page |
| - Charts and metrics | ✅ Complete | Dashboard page |
| **Book/Program Reading** | Code complete | Blocked on Supabase config |
| - Read 12 chapters | ✅ Complete | Livro pages |
| - Track reading progress | ✅ Ready | Reading progress table |
| - Mobile-optimized layout | ✅ Complete | 18px font, 44px touch targets |
| **Exercise Library** | ✅ Complete | From previous milestones |
| - View exercises with videos | ✅ Complete | Biblioteca page |

### 🟡 Should-Have (Launch with if possible)

| Feature | Status | Notes |
|---------|--------|-------|
| **Error boundaries** | ❌ Not implemented | Graceful error UI for failed Supabase calls |
| **Loading states** | Partial | Need skeleton loaders for async content |
| **Toast notifications** | ✅ Ready | Sonner integrated for auth actions |
| **Basic analytics** | ❌ Not implemented | Track key events (register, login, workout logged) |

### ⚪ Nice-to-Have (Post-Launch v2+)

These can wait until after MVP launch:

| Feature | Rationale for Deferral |
|---------|------------------------|
| **Stripe payments** | No users yet → no need to charge. Add when ready to monetize. |
| **Avatar image upload** | Initials avatar works. Image upload adds complexity. |
| **Rest timer** | Feature from original roadmap, not core to back training. |
| **Social features** | No users yet → no social graph. |
| **Advanced progress metrics** | Basic charts sufficient for MVP. |
| **Email notifications** | No users to notify yet. |
| **PWA/offline support** | Nice-to-have, not critical for first launch. |
| **Multi-language support** | Single language (Portuguese) is fine for MVP. |

---

## 3-Week Launch Roadmap

### Week 1: Unblock & Infrastructure (May 7 - May 13)

**Goal:** Resolve all blockers, establish working dev → prod pipeline

| Day | Task | Success Criteria | Owner |
|-----|------|------------------|-------|
| **Day 1** | Create Supabase project | Project created at supabase.com | Dev |
| | Enable Email provider | Email auth enabled in Supabase dashboard | Dev |
| | Run database migrations | `profiles` and `reading_progress` tables exist | Dev |
| | Update `.env.local` | Real Supabase URL and anon key | Dev |
| **Day 2** | Test auth locally | Can register → login → see profile | Dev |
| | Verify session persistence | Refresh page → still logged in | Dev |
| | Test cross-device | Login on device A, verify on device B | Dev |
| **Day 3** | Configure Vercel env vars | Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to Vercel | Dev |
| | Deploy to Vercel | Build succeeds | Dev |
| | Test live site | Site loads without 500 error | Dev |
| **Day 4** | Test auth on Vercel | Can register/login on deployed site | Dev |
| | Verify proxy works | Session refreshes on page reload | Dev |
| **Day 5** | Buffer / catch-up | All Week 1 tasks complete | Dev |

**Week 1 Exit Criteria:**
- [ ] Supabase project configured with migrations run
- [ ] Auth works end-to-end on local and Vercel
- [ ] Vercel deployment successful with no 500 errors
- [ ] Session persistence verified

---

### Week 2: Validation & Polish (May 14 - May 20)

**Goal:** Validate all MVP features work, fix critical bugs

| Day | Task | Success Criteria | Owner |
|-----|------|------------------|-------|
| **Day 1** | E2E test: Auth flow | Register → login → profile → logout works | Dev |
| | E2E test: Workout logging | Log workout → see in history | Dev |
| | E2E test: Reading progress | Mark chapter complete → see progress update | Dev |
| **Day 2** | Fix critical bugs | All P0 bugs resolved | Dev |
| | Add error boundaries | Graceful error UI for failed calls | Dev |
| **Day 3** | Add loading states | Skeleton loaders on async content | Dev |
| | Performance audit | Lighthouse score >80 on mobile | Dev |
| **Day 4** | Security review | No exposed secrets, proper auth guards | Dev |
| | Accessibility check | Basic WCAG 2.1 AA compliance | Dev |
| **Day 5** | Buffer / catch-up | All Week 2 tasks complete | Dev |

**Week 2 Exit Criteria:**
- [ ] All MVP features validated via E2E testing
- [ ] No P0 or P1 bugs open
- [ ] Error handling in place
- [ ] Performance acceptable (Lighthouse >80)

---

### Week 3: Launch Prep (May 21 - May 27)

**Goal:** Prepare for public launch, documentation, monitoring

| Day | Task | Success Criteria | Owner |
|-----|------|------------------|-------|
| **Day 1** | Update README | Deploy instructions, local setup documented | Dev |
| | Create launch checklist | Pre-flight checklist for launch day | Dev |
| **Day 2** | Set up monitoring | Error tracking (e.g., Sentry) | Dev |
| | Set up logging | Log critical errors and auth events | Dev |
| **Day 3** | Final QA pass | All features work on production | Dev |
| | Backup database | Export Supabase data | Dev |
| **Day 4** | Soft launch | Invite 1-2 beta testers | Dev |
| | Monitor for errors | No critical errors in first 24h | Dev |
| **Day 5** | **LAUNCH** | Public announcement | Dev |

**Week 3 Exit Criteria:**
- [ ] README updated with setup instructions
- [ ] Monitoring and logging configured
- [ ] Launch checklist complete
- [ ] Soft launch successful
- [ ] **MVP v1.1 publicly launched**

---

## Pre-Launch Checklist

### Infrastructure
- [ ] Supabase project created and configured
- [ ] Email provider enabled in Supabase
- [ ] Database migrations run (`profiles`, `reading_progress` tables exist)
- [ ] Vercel project connected to GitHub repo
- [ ] Environment variables set in Vercel:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Deployment successful with no 500 errors

### Authentication
- [ ] User registration works (local + Vercel)
- [ ] User login works (local + Vercel)
- [ ] Session persists across page refresh
- [ ] Session persists across browser restarts
- [ ] Cross-device login works (same credentials on different device)
- [ ] Logout terminates session correctly

### Core Features
- [ ] Workout logging functional
- [ ] Progress dashboard displays data
- [ ] Exercise library accessible
- [ ] Book chapters readable
- [ ] Reading progress tracked
- [ ] User profile editable

### Quality
- [ ] No P0 or P1 bugs open
- [ ] Error boundaries catch failures gracefully
- [ ] Loading states present for async content
- [ ] Lighthouse score >80 on mobile
- [ ] Basic accessibility checks pass

### Documentation
- [ ] README updated with setup instructions
- [ ] Environment variables documented
- [ ] Deployment process documented
- [ ] Known issues documented

### Monitoring
- [ ] Error tracking configured (e.g., Sentry, LogRocket)
- [ ] Basic analytics set up (optional)
- [ ] Alert on critical errors (optional)

---

## Risks & Mitigation

### 🔴 High Risk

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| **Supabase configuration issues** | Medium | Critical | Follow Supabase docs exactly, test locally first, have backup auth plan (localStorage fallback) |
| **Data loss during migration** | Low | Critical | No existing users → trivial migration. Run migrations on fresh Supabase project. |
| **Vercel deployment continues to fail** | Medium | High | Debug with Vercel function logs, check proxy.ts error handling, consider temporary localhost demo |

### 🟡 Medium Risk

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| **Session persistence breaks in production** | Low | High | Test thoroughly in Week 1, have localStorage fallback ready |
| **Reading progress doesn't sync** | Low | Medium | Test with multiple devices, verify Supabase row-level security |
| **Performance issues on mobile** | Medium | Medium | Audit in Week 2, optimize images and bundle size |

### 🟢 Low Risk

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| **UI bugs on certain devices** | Medium | Low | Test on common devices, fix critical ones only |
| **Missing translations** | Low | Low | Single language (Portuguese) for MVP |
| **Stripe integration issues** | N/A | N/A | Deferred to v2+ — not in MVP scope |

---

## Success Metrics for MVP Launch

### Technical Metrics
- [ ] Site uptime >99% (Vercel + Supabase SLA)
- [ ] Page load time <3s on 3G
- [ ] No critical errors in first week
- [ ] Lighthouse score >80

### Business Metrics (Post-Launch)
- [ ] User registration successful (at least 1 test user)
- [ ] User can complete core loop: register → log workout → see progress
- [ ] No data loss incidents
- [ ] User feedback collected (even if just 1-2 beta testers)

---

## Post-Launch (v2.0) Candidate Features

These features are **out of scope for MVP** but valuable for future versions:

1. **Monetization**
   - Stripe payment integration
   - Subscription tiers
   - Payment history

2. **Enhanced User Experience**
   - Avatar image upload
   - Rest timer with notifications
   - Workout templates
   - Export data (CSV, PDF)

3. **Social Features**
   - Share workouts
   - Follow other users
   - Leaderboards

4. **Advanced Features**
   - AI-powered workout recommendations
   - Integration with wearables (Apple Watch, Fitbit)
   - Advanced analytics and insights

---

## Appendix: Current Blockers Detail

### Blocker 1: Supabase Credentials Not Configured

**Problem:** `.env.local` contains placeholder values:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**Required Action:**
1. Visit https://supabase.com/dashboard
2. Create new project (or select existing)
3. Go to Project Settings → API
4. Copy "Project URL" and "anon public" key
5. Update `.env.local` with real values
6. **Also add to Vercel:** Settings → Environment Variables

**Verification:** Run `npm run dev`, visit site, attempt registration

---

### Blocker 2: Database Migrations Not Run

**Problem:** Supabase tables (`profiles`, `reading_progress`) don't exist

**Required Action:**
1. In Supabase Dashboard, go to SQL Editor
2. Run migration SQL (from `app/supabase/migrations/`)
3. Verify tables exist in Table Editor

**Verification:** Attempt user registration — should create row in `auth.users` and `public.profiles`

---

### Blocker 3: Vercel Environment Variables Missing

**Problem:** Vercel deployment has no access to Supabase credentials

**Required Action:**
1. Go to Vercel Dashboard → Project → Settings → Environment Variables
2. Add `NEXT_PUBLIC_SUPABASE_URL` with production value
3. Add `NEXT_PUBLIC_SUPABASE_ANON_KEY` with production value
4. Redeploy

**Verification:** Visit deployed URL, site should load without 500 error

---

### Blocker 4: No E2E Tests

**Problem:** No automated validation of critical user flows

**Required Action:** (Can be deferred for MVP, but recommended)
1. Set up Playwright or Cypress
2. Write tests for:
   - Register → login → logout flow
   - Workout logging flow
   - Reading progress flow
3. Run tests before each deployment

**Verification:** Tests pass on CI/CD pipeline

---

## Conclusion

**Current State:** Code-complete for MVP (v1.1), blocked on Supabase configuration

**Path to Launch:** 3 weeks from blocker resolution
- Week 1: Unblock infrastructure (Supabase + Vercel config)
- Week 2: Validate and polish (E2E testing, bug fixes)
- Week 3: Launch prep (monitoring, documentation, soft launch)

**Key Decision:** The MVP is **feature-complete in code** but **infrastructure-incomplete** (no Supabase project, no env vars). Once Supabase is configured and migrations are run, the app should be launch-ready within 1-2 weeks of validation.

**Recommendation:** Prioritize Week 1 tasks immediately. The code is ready — only configuration blocks launch.

---

*Document created: 2026-05-07*  
*Next review: After Supabase configuration (Day 1-2)*
