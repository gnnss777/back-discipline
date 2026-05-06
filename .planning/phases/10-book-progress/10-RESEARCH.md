# Phase 10: Book Progress - Research

**Researched:** 2026-05-05
**Domain:** Reading progress tracking with Supabase cloud sync + mobile-optimized chapter navigation
**Confidence:** HIGH

## Summary

Phase 10 transforms the static book reading experience into a tracked, cloud-synced progress system. The current codebase has all the building blocks in place: `chapters.ts` defines 12 chapters, `storage.ts` has localStorage-based chapter progress CRUD, `ProgressContext.tsx` provides a context for progress state, and Supabase auth is fully operational with `client.ts`, `server.ts`, and `proxy.ts`. The gap is a `reading_progress` table in Supabase and cloud-primary storage logic that replaces the current localStorage-only approach.

The key architectural challenge is the chapter page (`livro/[slug]/page.tsx`) which is currently a server component but needs an interactive CONCLUIR button. The solution is already scaffolded: `ChapterAuthGuard.tsx` wraps the page as a client boundary. A new client component for the interactive parts (CONCLUIR toggle, progress state) must be extracted inside this boundary.

The Supabase `upsert` method with `onConflict` is the correct approach for saving progress — it handles the insert-or-update pattern cleanly against the `(user_id, chapter_slug)` unique constraint. RLS policies ensure users only access their own data. The cloud-primary + localStorage cache pattern is straightforward since chapter completion is binary (completed/not) and idempotent, minimizing sync conflict complexity.

**Primary recommendation:** Create a `reading-progress` server action module using `createSupabaseServerClient` for auth-validated writes, wrap progress reads in a client-side `reading-storage.ts` layer that caches to localStorage, and extract the CONCLUIR button into a `ChapterHeader` client component.

<user_constraints>

## User Constraints (from CONTEXT.md)

### Locked Decisions
- D-13: Progress indicator = Checkmark + gold color change (CheckCircle icon replaces ArrowRight, gold border on card)
- D-14: Cloud storage = Supabase `reading_progress` table with specific schema (id, user_id, chapter_slug, completed, completed_at, last_read_at, created_at; unique constraint on user_id+chapter_slug; RLS policies)
- D-15: Cloud-primary with localStorage cache (save to Supabase when online, fallback to localStorage, cloud wins on conflict via completed_at timestamp)
- D-16: Mobile optimization = font sizing + touch targets (base 16→18px, line-height 1.8→2.0, min 44px touch targets; no swipe gestures or immersive mode)
- D-17: Mark-as-read = toggle CONCLUIR button (tap once marks complete + gold, tap again unmarks; calls updateChapterProgress)
- D-18: Auto-resume = highlight last-read chapter on index (gold left-border + "CONTINUAR LEITURA" text; does NOT auto-redirect)

### Agent's Discretion
- Whether to throttle `last_read_at` updates (currently: update on every visit; alternative: throttle to >5min since last)
- Server action vs direct client-side Supabase calls for progress reads
- Exact component extraction boundary for the chapter page interactive parts

### Deferred Ideas (OUT OF SCOPE)
- Partial chapter progress (percentage read)
- Reading streaks / timers
- Bookmark/highlight features
- Social sharing of progress
- Swipe gestures for chapter navigation
- Immersive/zen reading mode

</user_constraints>

<phase_requirements>

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| BOOK-01 | Chapter progress indicator | D-13 decision: CheckCircle icon + gold border on completed chapters; current `livro/page.tsx` renders ArrowRight/Lock icons — swap to CheckCircle for completed chapters |
| BOOK-02 | Resume at last read chapter | D-18 decision: `last_read_at` field in `reading_progress` table; query for max `last_read_at` to find last-read chapter; gold left-border highlight on `/livro` index |
| BOOK-03 | Chapter navigation | Existing prev/next links in `livro/[slug]/page.tsx` (lines 140-170) already work; D-16 ensures 44px min touch targets on nav buttons |
| BOOK-04 | Progress saves and syncs to cloud | D-14/D-15 decisions: Supabase `reading_progress` table with RLS; `upsert` with `onConflict: 'user_id,chapter_slug'`; localStorage cache for offline |
| BOOK-05 | Mobile-optimized reading layout | D-16 decision: CSS changes only — font-size 18px, leading-[2.0], min-h-[44px] on nav buttons |
| BOOK-06 | Total book progress visible | Dynamic "X / 12 CAPÍTULOS" counter + progress bar width; current hardcoded `"0 / 11 CAPÍTULOS"` on `livro/page.tsx` line 93 |

</phase_requirements>

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| @supabase/supabase-js | 2.105.3 | Supabase client (browser + server) | Already installed, used for auth; extends to reading_progress table |
| @supabase/ssr | 0.10.2 | Server-side Supabase client with cookie handling | Already installed; used in `server.ts` and `proxy.ts` |
| next | 16.2.3 | App Router framework | Project runtime; server actions for progress writes |
| react | 19.2.4 | UI library | Supports `useOptimistic` for instant UI updates |
| lucide-react | 1.8.0 | Icon library | Already used; `CheckCircle` icon already imported in chapter page |
| sonner | 2.0.7 | Toast notifications | Already used in AuthContext for user feedback |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| tailwindcss | 4.x | CSS utility framework | All styling — font sizing, touch targets, progress bar |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Server Actions for writes | Direct client-side Supabase calls | Server Actions provide auth validation on server + `revalidatePath`; client calls need manual auth check but are simpler for reads — use Server Actions for writes, client calls for reads |
| Supabase Realtime for sync | Polling on mount | Realtime adds complexity; for this phase, just fetch on mount + write-through cache is sufficient |
| `useOptimistic` for CONCLUIR | `useState` + server action await | `useOptimistic` gives instant UI feedback but adds complexity; simple `useState` with server action call is adequate for a toggle button |

**Installation:** No new packages needed. All dependencies already installed.

**Version verification:**
```
@supabase/supabase-js: 2.105.3 (verified via npm view + npm list)
@supabase/ssr: 0.10.2 (verified via npm view + npm list)
next: 16.2.3 (from package.json)
react: 19.2.4 (from package.json)
```

## Architecture Patterns

### Recommended Project Structure

```
app/src/
├── app/
│   ├── actions/
│   │   ├── auth.ts           # Existing - sign up/in/out
│   │   ├── profile.ts        # Existing - update display name
│   │   └── reading-progress.ts  # NEW - upsert/delete chapter progress + get all
│   ├── livro/
│   │   ├── page.tsx           # MODIFY - dynamic progress, checkmarks, last-read
│   │   └── [slug]/
│   │       ├── page.tsx       # MODIFY - extract interactive parts to client component
│   │       ├── ChapterAuthGuard.tsx  # KEEP - already works
│   │       └── ChapterHeader.tsx     # NEW - client component with CONCLUIR toggle
│   └── supabase/
│       ├── client.ts          # KEEP - browser client singleton
│       └── server.ts          # KEEP - server client with cookies
├── context/
│   ├── AuthContext.tsx        # KEEP - provides user object
│   └── ProgressContext.tsx    # MODIFY - use cloud-primary reading storage
├── lib/
│   ├── chapters.ts           # KEEP - 12 chapter definitions
│   ├── content.ts            # KEEP - chapter content
│   ├── storage.ts            # KEEP - localStorage layer (reading-storage wraps it)
│   └── reading-storage.ts    # NEW - cloud-primary storage with localStorage cache
├── types/
│   ├── workout.ts            # MODIFY - add lastReadAt to ChapterProgress
│   └── index.ts              # KEEP - re-exports
app/
└── supabase/
    └── migrations/
        └── 001_reading_progress.sql  # NEW - SQL migration
```

### Pattern 1: Server Action for Authenticated Writes

**What:** Use `'use server'` actions with `createSupabaseServerClient()` for all progress mutations. Server actions validate auth on the server side, preventing unauthorized writes.

**When to use:** Every write to `reading_progress` table (mark complete, unmark, update last_read_at).

**Example:**
```typescript
// Source: project pattern from actions/auth.ts + actions/profile.ts
'use server'

import { revalidatePath } from 'next/cache'
import { createSupabaseServerClient } from '@/app/supabase/server'

export async function upsertChapterProgress(formData: FormData) {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  const chapterSlug = formData.get('chapterSlug') as string
  const completed = formData.get('completed') === 'true'

  const { error } = await supabase
    .from('reading_progress')
    .upsert({
      user_id: user.id,
      chapter_slug: chapterSlug,
      completed,
      completed_at: completed ? new Date().toISOString() : null,
      last_read_at: new Date().toISOString(),
    }, {
      onConflict: 'user_id,chapter_slug',
    })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/livro')
  revalidatePath(`/livro/${chapterSlug}`)
  return { success: true }
}
```

### Pattern 2: Client-Side Supabase for Reads

**What:** Use `createSupabaseClient()` (browser singleton) for reading progress data on the client side. This avoids server round-trips for reads and works well with the existing `useAuth` hook.

**When to use:** Loading all progress for the current user on the `/livro` index page and the chapter reading page.

**Example:**
```typescript
// Source: project pattern from AuthContext.tsx
import { createSupabaseClient } from '@/app/supabase/client'

export async function getReadingProgress(userId: string) {
  const supabase = createSupabaseClient()
  const { data, error } = await supabase
    .from('reading_progress')
    .select('*')
    .eq('user_id', userId)

  if (error) {
    console.error('Error fetching reading progress:', error)
    return []
  }

  return data
}
```

### Pattern 3: Cloud-Primary Storage with localStorage Cache

**What:** A `reading-storage.ts` module that tries Supabase first, falls back to localStorage, and syncs on reconnect. Chapter completion is binary and idempotent, so conflict resolution is simple: cloud `completed_at` timestamp wins.

**When to use:** All progress reads/writes from client components.

**Example:**
```typescript
// reading-storage.ts
import { createSupabaseClient } from '@/app/supabase/client'
import { getUserProgress, saveUserProgress, updateChapterProgress as updateLocal } from './storage'

const CACHE_KEY = 'backdiscipline_reading_cache'

export async function getAllProgress(userId: string) {
  try {
    const supabase = createSupabaseClient()
    const { data, error } = await supabase
      .from('reading_progress')
      .select('*')
      .eq('user_id', userId)

    if (!error && data) {
      // Update localStorage cache with cloud data
      cacheLocally(userId, data)
      return data
    }
  } catch {
    // Offline or error — fall back to cache
  }

  return getCachedProgress(userId)
}

export async function updateProgress(userId: string, chapterSlug: string, completed: boolean) {
  // 1. Optimistic local update
  updateLocal(userId, chapterSlug, completed)

  // 2. Try cloud write
  try {
    const supabase = createSupabaseClient()
    await supabase
      .from('reading_progress')
      .upsert({
        user_id: userId,
        chapter_slug: chapterSlug,
        completed,
        completed_at: completed ? new Date().toISOString() : null,
        last_read_at: new Date().toISOString(),
      }, { onConflict: 'user_id,chapter_slug' })
  } catch {
    // Will sync on next online fetch
  }
}
```

### Pattern 4: Server Component → Client Component Extraction

**What:** The chapter page (`livro/[slug]/page.tsx`) is a server component that fetches chapter data. Interactive parts (CONCLUIR button, progress state) must be extracted into a client component. The existing `ChapterAuthGuard` already creates a client boundary.

**When to use:** Adding interactivity to a server component page.

**Example:**
```typescript
// ChapterHeader.tsx — new client component
'use client'

import { useState } from 'react'
import { CheckCircle } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useReadingProgress } from '@/lib/reading-storage'

export function ChapterHeader({ slug, isCompleted }: { slug: string; isCompleted: boolean }) {
  const [completed, setCompleted] = useState(isCompleted)
  const { user } = useAuth()

  const handleToggle = async () => {
    const newCompleted = !completed
    setCompleted(newCompleted) // Optimistic update
    await updateProgress(user!.userId, slug, newCompleted)
  }

  return (
    <button
      onClick={handleToggle}
      className={`flex items-center gap-2 text-sm font-medium tracking-wider min-h-[44px] px-3 ${
        completed ? 'text-[#B8956A]' : 'text-[#B8956A] hover:text-[#9A7A50]'
      }`}
    >
      <CheckCircle className={`w-4 h-4 ${completed ? 'fill-[#B8956A]' : ''}`} />
      {completed ? 'CONCLUÍDO' : 'CONCLUIR'}
    </button>
  )
}
```

### Anti-Patterns to Avoid

- **Calling Server Actions from useEffect for reads:** Server actions are for mutations. Use direct Supabase client calls for reads to avoid unnecessary server round-trips and hydration issues.
- **Putting progress state in global context for chapter page:** The chapter page only needs its own completion state. Fetching ALL progress in a global context on every chapter visit is wasteful. Use local state + targeted reads instead.
- **Forgetting RLS on new table:** Without RLS, any authenticated user could read/modify any other user's progress. The CONTEXT.md schema includes RLS policies — they MUST be applied.
- **Using `useOptimistic` with server action forms:** The CONCLUIR button is a toggle, not a form submission. Using `useActionState`/`useOptimistic` with `<form action>` adds unnecessary complexity for a simple onClick handler. Just use `useState` + direct Supabase client call.
- **Updating `last_read_at` without throttling:** Every chapter page visit triggers a write. This is acceptable for Phase 10 scope but could be throttled later (e.g., only update if >5min since last).

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Upsert with conflict resolution | Custom insert-then-update logic | Supabase `.upsert()` with `onConflict` | Handles race conditions, unique constraint violations, and atomicity |
| Auth validation in server actions | Manual cookie parsing / JWT verification | `createSupabaseServerClient()` + `supabase.auth.getUser()` | Already established pattern; handles token refresh automatically |
| Offline detection / sync queue | Custom IndexedDB sync engine | Simple localStorage cache + cloud-wins-on-reconnect | Binary completion state is idempotent; no complex conflict resolution needed |
| Progress calculation | Custom counting logic in components | Supabase `select('*')` + client-side filter on `completed: true` | Simple enough for 12 chapters; no need for server-side aggregation |

**Key insight:** The binary nature of chapter completion (completed/not) makes this domain significantly simpler than typical sync scenarios. Two devices both marking a chapter as "completed" is not a conflict. The only edge case is un-completing on one device while completing on another — and the cloud timestamp wins per D-15.

## Common Pitfalls

### Pitfall 1: Server Component Can't Have onClick Handlers

**What goes wrong:** Adding `onClick={handleToggle}` to the CONCLUIR button in the current server component `page.tsx` will fail because server components can't have event handlers.

**Why it happens:** The chapter page is currently `export default async function ChapterPage` (server component). Interactive handlers require `'use client'`.

**How to avoid:** Extract the CONCLUIR button and progress state into a new `ChapterHeader.tsx` client component. Pass `slug` and `isCompleted` as props from the server component.

**Warning signs:** "Functions cannot be passed to Client Components" error, or button doesn't respond to clicks.

### Pitfall 2: `onConflict` Column List Must Match Unique Constraint

**What goes wrong:** Using `onConflict: 'chapter_slug'` instead of `onConflict: 'user_id,chapter_slug'` will fail because the unique constraint is on the composite key, not `chapter_slug` alone.

**Why it happens:** The unique constraint is `UNIQUE(user_id, chapter_slug)` — both columns must be specified in `onConflict`.

**How to avoid:** Always use `onConflict: 'user_id,chapter_slug'` in upsert calls. This matches the SQL schema's unique constraint.

**Warning signs:** PostgreSQL error "there is no unique constraint matching the given list of columns".

### Pitfall 3: RLS Blocks Server Action Writes If Auth Not Checked

**What goes wrong:** Server action calls `supabase.from('reading_progress').upsert(...)` but RLS policy requires `auth.uid() = user_id`. If `getUser()` isn't called first, the server client has no authenticated context and the write fails silently (returns empty data, not an error).

**Why it happens:** The Supabase server client needs `getUser()` to establish auth context for RLS. The existing `server.ts` `setAll` catches errors silently in server components.

**How to avoid:** Always call `const { data: { user } } = await supabase.auth.getUser()` at the start of each server action. Return error if `!user`. This is also documented in the Next.js forms guide: "Always verify authentication and authorization inside each Server Action."

**Warning signs:** Writes return `{ data: null, error: null }` — data is null because RLS filtered it out.

### Pitfall 4: `revalidatePath` Doesn't Immediately Update Client State

**What goes wrong:** After a server action completes, calling `revalidatePath('/livro')` revalidates the server cache but doesn't re-render client components that hold their own state. The `/livro` index page is a client component — it won't automatically refetch.

**Why it happens:** Client components manage their own state. `revalidatePath` affects server component cache, not client-side React state.

**How to avoid:** For the `/livro` index page (client component), after toggling completion, call `router.refresh()` or manually refetch progress data. For the chapter page, use optimistic local state updates.

**Warning signs:** Progress bar doesn't update after completing a chapter; requires manual page refresh.

### Pitfall 5: Chapter Count Mismatch — 11 vs 12

**What goes wrong:** The current hardcoded text says "0 / 11 CAPÍTULOS" but `chapters.ts` has 12 entries (1 introduction + 11 chapter entries). The introduction (`isChapter: false`) should not count.

**Why it happens:** The introduction chapter has `isChapter: false` (or no `part` property), but the filter logic may or may not account for this.

**How to avoid:** Use `chapters.filter(c => c.part).length` for the total count (11 actual chapters, matching existing dashboard pattern on line 66). Or use `chapters.filter(c => c.isChapter !== false).length` depending on preferred semantics. CONTEXT.md says "12 CAPÍTULOS" in the requirement but the actual chapter count with `part` filter is 11. Follow the dashboard's existing logic.

**Warning signs:** Progress shows "X / 12" when there are only 11 trackable chapters, or vice versa.

### Pitfall 6: localStorage Cache Stale After Cloud-Only Operations

**What goes wrong:** User completes chapter on device A (cloud + local cache updated). On device B, the localStorage cache still shows the old state. When device B loads, it reads from cache first and shows stale data.

**Why it happens:** If the reading-storage module returns cached data before the cloud fetch completes, the UI renders with stale progress.

**How to avoid:** Always fetch from cloud first on mount, then update cache. Show loading state during fetch. Only fall back to cache if the cloud fetch fails (network error). The pattern: `try { cloud → cache → return } catch { cache → return }`.

**Warning signs:** Progress appears incorrect on second device; requires hard refresh to update.

## Code Examples

Verified patterns from project source code and Supabase API docs:

### Supabase Upsert with onConflict (for reading_progress)

```typescript
// Source: @supabase/postgrest-js/dist/index.d.cts lines 3018-3113
const { data, error } = await supabase
  .from('reading_progress')
  .upsert({
    user_id: userId,
    chapter_slug: chapterSlug,
    completed: true,
    completed_at: new Date().toISOString(),
    last_read_at: new Date().toISOString(),
  }, {
    onConflict: 'user_id,chapter_slug',
  })
  .select()
```

### Server Action Pattern (matches existing auth.ts/profile.ts)

```typescript
// Source: app/src/app/actions/profile.ts pattern
'use server'

import { revalidatePath } from 'next/cache'
import { createSupabaseServerClient } from '@/app/supabase/server'

export async function upsertReadingProgress(formData: FormData) {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Não autorizado' }
  }

  const chapterSlug = formData.get('chapterSlug') as string
  const completed = formData.get('completed') === 'true'

  const { error } = await supabase
    .from('reading_progress')
    .upsert({
      user_id: user.id,
      chapter_slug: chapterSlug,
      completed,
      completed_at: completed ? new Date().toISOString() : null,
      last_read_at: new Date().toISOString(),
    }, {
      onConflict: 'user_id,chapter_slug',
    })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/livro')
  revalidatePath(`/livro/${chapterSlug}`)
  return { success: true }
}
```

### Fetching All Progress for a User (client-side)

```typescript
// Source: AuthContext.tsx pattern using createSupabaseClient
import { createSupabaseClient } from '@/app/supabase/client'

export async function fetchAllProgress(userId: string) {
  const supabase = createSupabaseClient()
  const { data, error } = await supabase
    .from('reading_progress')
    .select('chapter_slug, completed, completed_at, last_read_at')
    .eq('user_id', userId)
    .order('last_read_at', { ascending: false })

  if (error) {
    console.error('Error fetching reading progress:', error)
    return []
  }

  return data || []
}
```

### Finding Last-Read Chapter (for BOOK-02 auto-resume)

```typescript
// Query: get the chapter with the most recent last_read_at
const lastReadChapter = progressData
  .filter(p => p.last_read_at)
  .sort((a, b) => new Date(b.last_read_at).getTime() - new Date(a.last_read_at).getTime())[0]
```

### Updating last_read_at on Chapter Visit

```typescript
// Called when user opens a chapter page
const supabase = createSupabaseClient()
await supabase
  .from('reading_progress')
  .upsert({
    user_id: userId,
    chapter_slug: slug,
    last_read_at: new Date().toISOString(),
  }, {
    onConflict: 'user_id,chapter_slug',
  })
// Note: This preserves existing completed/completed_at values via upsert merge
```

### Progress Bar Calculation (for BOOK-06)

```typescript
// Source: dashboard/page.tsx line 66-68 pattern
const totalChapters = chapters.filter(c => c.part).length // 11
const completedChapters = progressData.filter(p => p.completed).length
const progressPercent = Math.round((completedChapters / totalChapters) * 100)
```

### Mobile-Optimized Typography (for BOOK-05)

```tsx
{/* Source: D-16 decision — applied to article content in chapter page */}
<article className="max-w-none">
  <div className="space-y-6 text-[#bbb] text-lg leading-[2.0] font-light">
    {/* Content rendered here */}
  </div>
</article>

{/* Navigation touch targets — min 44px height */}
<Link
  href={`/livro/${nextChapter.slug}`}
  className="flex items-center gap-2 min-h-[44px] px-4 py-3 bg-[#B8956A] text-[#0A0A0A] font-bold tracking-wider rounded-sm hover:bg-[#9A7A50] transition-colors text-sm"
>
  <span>PRÓXIMO</span>
  <ArrowRight className="w-4 h-4" />
</Link>
```

### Completed Chapter Card on Index (for BOOK-01)

```tsx
{/* Source: D-13 decision — replace ArrowRight with CheckCircle for completed chapters */}
<div className={`w-10 h-10 flex items-center justify-center rounded-sm ${
  isCompleted
    ? 'bg-[#B8956A]/20 text-[#B8956A]'
    : user
      ? 'bg-[#1a1a1a] text-[#444] group-hover:bg-[#B8956A]/20 group-hover:text-[#B8956A] transition-colors'
      : 'bg-[#1a1a1a] text-[#333]'
}`}>
  {isCompleted ? <CheckCircle className="w-5 h-5" /> : user ? <ArrowRight className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
</div>
```

### Last-Read Chapter Highlight (for BOOK-02)

```tsx
{/* Source: D-18 decision — gold left-border + CONTINUAR LEITURA */}
<Link
  key={chapter.slug}
  href={`/livro/${chapter.slug}`}
  className={`block p-5 border transition-all group rounded-sm ${
    isLastRead
      ? 'bg-[#0F0F0F] border-l-2 border-l-[#B8956A] border-[#3A2E22]'
      : isCompleted
        ? 'bg-[#0F0F0F] border-[#B8956A]/30'
        : 'bg-[#0F0F0F] border-[#3A2E22]'
  }`}
>
  {/* ... chapter card content ... */}
  {isLastRead && (
    <span className="text-xs text-[#B8956A] font-medium tracking-wider">CONTINUAR LEITURA</span>
  )}
</Link>
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Next.js `middleware.ts` | `proxy.ts` | Next.js v16.0.0 | File renamed; function export renamed from `middleware` to `proxy`. Already migrated in this project. |
| `useFormState` | `useActionState` | React 19 | Renamed hook for server action state management. Available in React 19.2.4 which this project uses. |
| Supabase `auth.session()` | `auth.getSession()` + `auth.getUser()` | supabase-js v2 | Must call `getUser()` server-side to validate (getSession only checks cookies locally). Already handled in project. |
| Tailwind CSS v3 config | Tailwind CSS v4 `@tailwindcss/postcss` | Tailwind v4 | No `tailwind.config.js` needed; CSS-first configuration. Already in project. |

**Deprecated/outdated:**
- `middleware.ts`: Replaced by `proxy.ts` in Next.js 16. Already migrated.
- `useFormState`: Replaced by `useActionState` in React 19. Not used in project yet.

## Open Questions

1. **Chapter count for progress display (11 vs 12)**
   - What we know: `chapters.ts` has 12 entries. The introduction has `isChapter: false` (or no `part`). The dashboard already uses `chapters.filter(c => c.part).length` which returns 11. The hardcoded text says "11 CAPÍTULOS".
   - What's unclear: CONTEXT.md says "12 CAPÍTULOS" for BOOK-06 requirement, but the actual trackable chapters (those with `part`) are 11. The introduction chapter is readable but arguably shouldn't count as a "completed chapter" since it's just a welcome.
   - Recommendation: Use 11 as the total (matching dashboard + existing hardcoded text). The introduction can still be marked as read, but the "X / 11 CAPÍTULOS" counter reflects substantive chapters only.

2. **Should `last_read_at` be throttled?**
   - What we know: Each chapter visit triggers a Supabase write to update `last_read_at`. CONTEXT.md notes this as a risk.
   - What's unclear: Whether the write volume matters for a small-scale app.
   - Recommendation: Don't throttle in Phase 10. The write volume (1 per page visit) is negligible. If needed later, add a client-side debounce (e.g., only update if >5min since last).

3. **Server action vs client-side Supabase call for CONCLUIR toggle**
   - What we know: Both approaches work. Server actions validate auth server-side and can `revalidatePath`. Client-side calls are simpler and avoid the form data pattern.
   - What's unclear: Which pattern is cleaner for a toggle button (not a form submission).
   - Recommendation: Use client-side `createSupabaseClient()` for the CONCLUIR toggle write. It's simpler for a click handler (no FormData needed), and the RLS policy already protects against unauthorized writes. Use server actions only for operations that need `revalidatePath`.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Build/runtime | ✓ | — | — |
| npm | Package management | ✓ | — | — |
| Next.js 16 | App Router | ✓ | 16.2.3 | — |
| @supabase/supabase-js | Client DB access | ✓ | 2.105.3 | — |
| @supabase/ssr | Server DB access | ✓ | 0.10.2 | — |
| Supabase instance | Cloud database | ⚠ | — | Needs `reading_progress` table created manually |

**Missing dependencies with no fallback:**
- `reading_progress` table must be created in Supabase dashboard via the SQL migration before any progress features work. The migration file will be provided at `app/supabase/migrations/001_reading_progress.sql`. User must run this manually.

**Missing dependencies with fallback:**
- None — all other dependencies are installed.

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | None detected — needs setup |
| Config file | None |
| Quick run command | N/A — Wave 0 needed |
| Full suite command | N/A — Wave 0 needed |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| BOOK-01 | Completed chapters show CheckCircle + gold border | unit | ❌ Wave 0 | ❌ |
| BOOK-02 | Last-read chapter highlighted with "CONTINUAR LEITURA" | unit | ❌ Wave 0 | ❌ |
| BOOK-03 | Prev/next navigation links work with 44px touch targets | manual | N/A | ❌ |
| BOOK-04 | Progress saves to Supabase + localStorage cache | integration | ❌ Wave 0 | ❌ |
| BOOK-05 | Font size 18px, line-height 2.0, 44px touch targets | manual | N/A | ❌ |
| BOOK-06 | Dynamic "X / 11 CAPÍTULOS" counter + progress bar | unit | ❌ Wave 0 | ❌ |

### Sampling Rate
- **Per task commit:** No automated tests available
- **Per wave merge:** Manual verification only
- **Phase gate:** Manual verification of all 6 BOOK requirements

### Wave 0 Gaps
- [ ] No test framework installed — consider Vitest for unit testing React components
- [ ] No test files exist for any feature
- [ ] Integration tests for Supabase require a test Supabase instance (may be infeasible for Phase 10)
- [ ] BOOK-03 and BOOK-05 are CSS/layout changes — best verified manually on mobile viewport

**Recommendation:** For Phase 10, manual verification is pragmatic. The features are primarily UI-driven (icons, styling, progress bar) and Supabase integration (which requires a running instance). Automated tests can be added in a future phase if the test framework is set up.

## Sources

### Primary (HIGH confidence)
- Project source code: `livro/page.tsx`, `livro/[slug]/page.tsx`, `ChapterAuthGuard.tsx`, `ProgressContext.tsx`, `storage.ts`, `chapters.ts`, `types/workout.ts`, `AuthContext.tsx`, `supabase/client.ts`, `supabase/server.ts`, `actions/auth.ts`, `actions/profile.ts`, `proxy.ts` — all read and analyzed
- @supabase/postgrest-js type definitions: `upsert` API with `onConflict` parameter verified in `node_modules/@supabase/postgrest-js/dist/index.d.cts`
- Next.js 16 local docs: `node_modules/next/dist/docs/01-app/02-guides/forms.md` — server action patterns, `useActionState`, auth verification
- Next.js 16 local docs: `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md` — proxy.ts convention (middleware renamed)

### Secondary (MEDIUM confidence)
- Supabase official docs (web): upsert API, local development migration workflow — verified general patterns

### Tertiary (LOW confidence)
- None — all findings verified from installed source code or official docs

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all packages already installed, versions verified via npm
- Architecture: HIGH — patterns derived from existing project code (auth.ts, profile.ts, AuthContext.tsx)
- Pitfalls: HIGH — identified from concrete code analysis (server component constraint, onConflict schema, RLS auth context)
- Supabase API: HIGH — verified from installed type definitions

**Research date:** 2026-05-05
**Valid until:** 2026-06-05 (stable — all dependencies locked, no fast-moving APIs involved)
