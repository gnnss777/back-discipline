# Phase 10 Context: Book Progress

**Phase**: 10. Book Progress
**Created**: 2026-05-05

---

## Current State of Codebase

### Book Index Page (`livro/page.tsx`)

Client component with hardcoded progress: `"0 / 11 CAPÍTULOS"` and `width: 0%`. No dynamic progress. Chapter list renders with `ArrowRight` icons for authenticated users, `Lock` icons for unauthenticated. No completion state shown.

### Chapter Reading Page (`livro/[slug]/page.tsx`)

Server component. Has a non-functional `CONCLUIR` button in the header (just a `<button>` with no onClick handler). Content is rendered from `content.ts` plain text split by `\n\n` with basic markdown-like parsing (headings, tables, lists). Navigation (prev/next) exists at the bottom.

### Chapter Auth Guard (`livro/[slug]/ChapterAuthGuard.tsx`)

Client component that checks auth state. Shows `AuthModal` if not logged in. Wraps the chapter page content.

### Progress Context (`context/ProgressContext.tsx`)

Stores `ChapterProgress` in localStorage via `storage.ts`. Has `updateChapterProgress(slug, completed)` method. Currently used by dashboard for workout stats — chapter progress data exists but is not connected to the book UI.

### Storage (`lib/storage.ts`)

All localStorage-based. `updateChapterProgress()` updates `UserProgress.chapters[]` array. `getProgressStats()` calculates `chaptersCompleted`. No cloud sync.

### Chapter Definitions (`lib/chapters.ts`)

12 items total: 1 introduction + 8 Part I chapters + 3 Part II chapters. Each has `id`, `title`, `slug`, `order`, `description`, `part`.

### Types (`types/workout.ts`)

`ChapterProgress`: `{ chapterId, slug, completed, completedAt? }`
`UserProgress`: `{ userId, currentWeek, currentDay, chapters: ChapterProgress[], workouts, ... }`

### Supabase Setup

- `supabase/client.ts` — browser client singleton
- `supabase/server.ts` — server client with cookie handling
- `proxy.ts` — session refresh for Next.js 16
- `actions/auth.ts` — sign up/in/out server actions
- `actions/profile.ts` — updateDisplayName server action
- Auth works end-to-end (register, login, session persistence)
- No `reading_progress` table exists yet

### Auth Context

`AuthContext.tsx` provides `user: UserSession | null` with `userId`, `email`, `name`. Uses Supabase auth. Toast notifications via `sonner`.

### UI Language

All text in Brazilian Portuguese (pt-BR).

---

## Requirements Mapping

| REQ | Requirement | Implementation |
|-----|-------------|----------------|
| BOOK-01 | Chapter progress indicator | CheckCircle icon + gold border on completed chapters in /livro index (D-13) |
| BOOK-02 | Resume at last read chapter | Highlight last-read chapter with gold indicator on /livro index (D-18) |
| BOOK-03 | Chapter navigation | Existing prev/next links already work — ensure they're touch-friendly (D-16) |
| BOOK-04 | Progress saves and syncs to cloud | Create `reading_progress` Supabase table + cloud-primary with localStorage cache (D-14, D-15) |
| BOOK-05 | Mobile-optimized reading layout | Increase font size (16→18px), line spacing (1.8→2.0), 44px touch targets (D-16) |
| BOOK-06 | Total book progress visible | Dynamic "X / 12 CAPÍTULOS" counter + progress bar on /livro index |

---

## Design Decisions

### D-13: Progress Indicator = Checkmark + Color Change

Completed chapters show a gold `CheckCircle` icon (replacing `ArrowRight`) and gold border on the card. Incomplete chapters keep the current `ArrowRight` icon. Binary state (completed/not) — no partial progress.

### D-14: Cloud Storage = Supabase `reading_progress` Table

Create a `public.reading_progress` table with RLS policies:
- `id` (uuid, PK)
- `user_id` (uuid, FK to auth.users)
- `chapter_slug` (text)
- `completed` (boolean)
- `completed_at` (timestamptz, nullable)
- `last_read_at` (timestamptz) — updated each time user opens chapter (for BOOK-02 auto-resume)
- Unique constraint on `(user_id, chapter_slug)`

This supports queries, RLS, and is more scalable than user_metadata. A SQL migration file will be provided.

### D-15: Cloud-Primary with localStorage Cache

Save to Supabase when online. Fall back to localStorage cache when offline. On reconnect, sync: cloud wins on conflict (last-write-wins by `completed_at` timestamp). This ensures progress is never lost and syncs across devices.

### D-16: Mobile Optimization = Font Sizing + Touch Targets

- Base reading font: 16px → 18px
- Line height: 1.8 → 2.0
- Navigation buttons: min 44px touch targets
- No swipe gestures or immersive mode (too complex for this phase)

### D-17: Mark-as-Read = Toggle CONCLUIR Button

The existing `CONCLUIR` button in the chapter header becomes functional:
- Tap once → marks chapter complete, button turns gold with filled CheckCircle
- Tap again → unmarks, reverts to outline style
- Calls `updateChapterProgress(slug, !completed)` which saves to cloud + localStorage cache

### D-18: Auto-Resume = Highlight Last-Read Chapter on Index

On `/livro`, the last chapter the user opened (tracked by `last_read_at` in the DB) gets a subtle gold left-border or highlight indicator with "CONTINUAR LEITURA" text. Does NOT auto-redirect — user stays on index and can choose any chapter.

---

## Supabase Schema

### `reading_progress` table

```sql
CREATE TABLE public.reading_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  chapter_slug TEXT NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMPTZ,
  last_read_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, chapter_slug)
);

-- RLS
ALTER TABLE public.reading_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own progress"
  ON public.reading_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
  ON public.reading_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON public.reading_progress FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own progress"
  ON public.reading_progress FOR DELETE
  USING (auth.uid() = user_id);
```

---

## Files to Create/Modify

### New Files
1. `app/src/app/actions/reading-progress.ts` — Server Actions for upsert/delete chapter progress + get all progress for user
2. `app/src/lib/reading-storage.ts` — Cloud-primary storage layer with localStorage cache + sync logic
3. `app/supabase/migrations/001_reading_progress.sql` — SQL migration for `reading_progress` table

### Modified Files
4. `app/src/app/livro/page.tsx` — Dynamic progress bar, checkmark icons, last-read highlight
5. `app/src/app/livro/[slug]/page.tsx` — Extract to client component for CONCLUIR toggle, mobile font sizing
6. `app/src/app/livro/[slug]/ChapterAuthGuard.tsx` — No changes needed (already works)
7. `app/src/context/ProgressContext.tsx` — Refactor to use cloud-primary reading storage
8. `app/src/lib/storage.ts` — Keep localStorage as cache layer (reading-storage.ts wraps it)

---

## Questions / Risks

- **R: Server vs Client component for chapter page** — Currently a server component. To make CONCLUIR interactive, need a client component wrapper. The `ChapterAuthGuard` already wraps it as a client boundary. Extract the interactive parts (CONCLUIR button, progress state) into a client component inside the chapter page.
- **R: Offline sync race conditions** — If user completes a chapter offline, then completes it on another device, both will show completed. No real conflict since completion is idempotent (both set `completed = true`). Un-completing is the only edge case — cloud timestamp wins.
- **R: `reading_progress` table needs to be created by the user** — Provide SQL migration file. User must run it in Supabase dashboard or via CLI.
- **R: `last_read_at` updates on every chapter open** — This is a write on every page visit. Could be throttled client-side (update only if >5min since last) to reduce writes. Simple approach: update on every visit for now.

---

## Out of Scope

- Partial chapter progress (percentage read)
- Reading streaks / timers
- Bookmark/highlight features
- Social sharing of progress
- Swipe gestures for chapter navigation
- Immersive/zen reading mode
