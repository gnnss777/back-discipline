# Technology Stack — User Profile & Book Improvements

**Project:** Back Discipline
**Focus:** New features: user profile, cross-device login, book reading progress
**Researched:** 2026-05-04

---

## Recommended Stack Additions

### 1. Authentication & Cloud Database

| Technology | Version | Purpose | Why |
|-----------|---------|---------|-----|
| **Supabase** | Latest (2026) | Auth + PostgreSQL database + user profiles | **@supabase/ssr** is the official Next.js 16 package for cookie-based auth. Replaces localStorage-only auth with cloud sync. Enables cross-device login out of the box. Free tier covers up to 50K monthly active users. |

| Package | Version | Purpose | Why |
|---------|---------|---------|-----|
| @supabase/ssr | ^0.6.0 | Cookie-based auth for App Router | Manages sessions via HTTP-only cookies (not localStorage). Works in middleware, Server Components, and Client Components. Required for Next.js 16. |
| @supabase/supabase-js | ^2.48.0 | Browser client for client-side queries | Use only in Client Components. Server Components use createServerClient from @supabase/ssr. |

**Why Supabase (not Firebase/Auth.js):**
- Native Next.js 16 support via @supabase/ssr with cookie sessions
- PostgreSQL database included (profiles, reading progress)
- Row Level Security (RLS) protects user data at database level
- Middleware token refresh built-in
- Less complexity than Firebase for this use case

**Why NOT Firebase:**
- Requires managing separate auth + database services
- Custom middleware setup needed (next-firebase-auth-edge)
- No native PostgreSQL (Firestore instead)
- More migration complexity if outgrowing

**Why NOT Auth.js:**
- Requires external database anyway
- Supabase provides auth + database in one service
- More opinionated for this specific use case (auth + user data)

---

### 2. User Profile Forms

| Package | Version | Purpose | Why |
|---------|---------|---------|-----|
| react-hook-form | ^7.54.0 | Form state management | Uncontrolled inputs = minimal re-renders. Works with any UI. Standard in React ecosystem. |
| zod | ^3.24.0 | Schema validation | TypeScript-first. Single source of truth for form rules. Reuse schemas on server (Server Actions). |
| @hookform/resolvers | ^3.9.0 | Bridge Zod to React Hook Form | Translates Zod validation errors to form errors. |

**Why this combo:**
- Same Zod schema validates on client + server (no duplication)
- React Hook Form is faster than controlled inputs (no global re-renders)
- Clear error messages guide users
- Scales to complex forms if needed later

---

### 3. Reading Progress Tracking

No new packages needed. Create a `reading_progress` table in Supabase:

```sql
create table reading_progress (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  chapter_id text not null,
  exercise_id text,
  progress_percent integer default 0,
  completed_at timestamp with time zone,
  updated_at timestamp with time zone default now(),
  unique(user_id, chapter_id, exercise_id)
);
```

Store in Supabase, read on book page load.

---

## Integration with Existing Stack

### Existing Stack (Keep)

| Layer | Technology | Status |
|-------|------------|--------|
| Framework | Next.js 16.2.3 | Keep |
| Language | TypeScript | Keep |
| UI | React 19.2 | Keep |
| Styling | Tailwind CSS 4 | Keep |
| Icons | Lucide React | Keep |
| Deployment | Vercel | Keep |

### Files to Modify

| File | Changes |
|------|---------|
| `.env.local` | Add Supabase URL + publishable key |
| `app/supabase/server.ts` | Create Supabase server client (new) |
| `app/supabase/client.ts` | Create Supabase browser client (new) |
| `middleware.ts` | Add session refresh (update) |
| `app/actions/auth.ts` | Create Server Actions for login/register (new) |
| `app/components/UserMenu.tsx` | User icon + profile (new) |
| `app/profile/page.tsx` | Profile editing page (new) |
| `app/livro/page.tsx` | Add reading progress (update) |

### Supabase Setup

```bash
# 1. Create Supabase project (supabase.com)
# 2. Get URL and publishable key from Project Settings
# 3. Add to .env.local:

NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_xxxxx...

# 4. Create profiles table in Supabase SQL Editor:
create table profiles (
  id uuid references auth.users not null primary key,
  email text,
  display_name text,
  avatar_url text,
  updated_at timestamp with time zone
);

-- Enable RLS
alter table profiles enable row level security;

-- Policy: users can only edit their own profile
create policy "Users can update own profile" on profiles
  for update using (auth.uid() = id);
```

---

## What NOT to Add

| Avoid | Why |
|-------|-----|
| **Firebase** | Overkill for this project. Supabase is simpler (auth + DB in one). |
| **Auth.js (NextAuth)** | Requires external database anyway. Supabase provides both. |
| **Clerk** | More expensive at scale. Supabase free tier is generous. |
| **Prisma** | Adds ORM layer complexity. Direct Supabase SQL is fine for this scope. |
| **tRPC** | Overengineering for this project. Server Actions suffice. |
| **Redux/Zustand** | Not needed. React Hook Form + Supabase manage state. |
| **Additional UI libraries** | Existing Tailwind + Lucide is sufficient. |

---

## Minimal Implementation Path

### Phase 1: Auth + Cloud Sync
1. Create Supabase project
2. Install @supabase/ssr
3. Create server + browser clients
4. Add Supabase auth to middleware
5. Migrate existing localStorage users (export → import to Supabase)

### Phase 2: User Profile
1. Create profiles table in Supabase
2. Add profile editing page
3. Wire to Supabase (create/update profile)
4. Add user icon to top bar

### Phase 3: Reading Progress
1. Create reading_progress table
2. Track chapter/exercise progress
3. Sync to Supabase on completion
4. Load progress on book page

---

## Confidence Assessment

| Area | Confidence | Reason |
|------|------------|--------|
| Auth (Supabase) | HIGH | @supabase/ssr is the official Next.js 16 solution. Web search confirms current best practice. |
| Forms (RHF + Zod) | HIGH | Industry standard combo in 2026. Web search confirms current best practice. |
| Reading Progress | HIGH | Standard Supabase table pattern. No complex libraries needed. |

## Sources

- [Supabase Auth with Next.js — Official Guide](https://supabase.com/docs/guides/auth/quickstarts/nextjs) (2026-05-01)
- [Supabase SSR for Next.js App Router](https://supabase.io/docs/guides/with-nextjs) (2026-04-03)
- [React Hook Form + Zod Patterns](https://samioda.com/en/blog/react-forms-at-scale-react-hook-form-zod) (2026-04-20)
- [TheCodeForge — Supabase Auth Next.js 16 Guide](https://thecodeforge.io/javascript/supabase-auth-next-js-complete-guide/) (2026-04-12)