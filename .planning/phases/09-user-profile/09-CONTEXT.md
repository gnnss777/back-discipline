# Phase 9 Context: User Profile

**Phase**: 9. User Profile
**Created**: 2026-05-04

---

## Current State of Codebase

### Header Component (`components/Layout.tsx`)

The `Header` component is **minimal** — it shows:
- Left: "JJ" logo square + "BACK DISCIPLINE" brand text (links to `/`)
- Right: Page title text (e.g., "PROGRESSO")

**No user avatar, no profile link, no user menu exists.** This is the primary insertion point for PROF-01.

### Dashboard Header (inline, `dashboard/page.tsx`)

The dashboard has its own **inline header** (not using the shared `Header` component):
- Left: "INÍCIO" back link
- Center: "JJ" logo + "PROGRESSO" title
- Right: "SAIR" logout button

This needs to be updated to show avatar instead of just "SAIR" text.

### Auth State (`context/AuthContext.tsx`)

`UserSession` type has: `userId`, `email`, `name` (optional, from `user_metadata.display_name`), `paymentStatus`, `loggedInAt`.

**No `avatarUrl` field exists.** Supabase `user.user_metadata.avatar_url` could store it, but we decided avatar upload is out of scope (future). For now, use initials-based avatar.

### AuthModal (`components/AuthModal.tsx`)

Already working — register captures optional `name` → stored as `display_name` in Supabase `user_metadata`. No changes needed here.

### No Toast Library

No toast/notification library is installed. D-08 says "toast notifications for auth errors" — need to add one. `sonner` is the standard for Next.js (lightweight, zero config, works with App Router).

### No Profile Route

No `/perfil` or `/profile` route exists. Need to create one.

### Supabase Schema

No `profiles` table or SQL migrations exist yet. Need to decide:
- **Option A**: Store profile data in `auth.users.user_metadata` (simpler, no extra table)
- **Option B**: Create a `public.profiles` table (more scalable, RLS policies, joinable)

Since display_name is already in `user_metadata`, and we're not doing avatar uploads yet, **Option A** is sufficient for PROF-03/PROF-05. A `profiles` table can be added later when needed.

### UI Language: Portuguese (pt-BR)

All UI text must be in Brazilian Portuguese.

---

## Requirements Mapping

| REQ | Requirement | Implementation |
|-----|-------------|----------------|
| PROF-01 | Avatar icon in top bar | Add user initials circle to `Header` component + dashboard header |
| PROF-02 | Tap avatar → profile menu/page | Avatar click opens dropdown menu or navigates to `/perfil` |
| PROF-03 | Edit display name | Form on `/perfil` page, updates `user_metadata.display_name` via Supabase |
| PROF-04 | Logout from profile | Logout button on `/perfil` page, calls `signOut` |
| PROF-05 | Profile syncs across devices | Already works — `user_metadata` is stored in Supabase auth, accessible from any device |

---

## Design Decisions

### D-09: Avatar = Initials Circle (No Image Upload)

Since avatar upload is out of scope, the avatar will be a circle with the user's initials (first letter of name, or first letter of email if no name). Gold accent (#B8956A) background, dark text.

### D-10: Profile Page vs Dropdown Menu

**Profile page** (`/perfil`) — cleaner on mobile, consistent with the app's page-based navigation. A dropdown menu is hard to use on mobile with the bottom nav pattern. The avatar in the header links to `/perfil`.

### D-11: Profile Data in user_metadata (No profiles Table)

Use `auth.users.user_metadata` for display_name. This avoids needing a SQL migration, RLS policies, and a separate table. When avatar upload is added later, a `profiles` table can be introduced.

### D-12: Toast Library = sonner

Install `sonner` for toast notifications. It's the standard for Next.js, lightweight, supports dark theme out of the box.

---

## Files to Create/Modify

### New Files
1. `app/src/app/perfil/page.tsx` — Profile page
2. `app/src/app/actions/profile.ts` — Server Action for updating display_name

### Modified Files
3. `app/src/components/Layout.tsx` — Add avatar to `Header`, make it link to `/perfil`
4. `app/src/app/dashboard/page.tsx` — Update inline header to use avatar + link to `/perfil`
5. `app/src/context/AuthContext.tsx` — Add `updateProfile` method
6. `app/src/app/providers.tsx` — Wrap with `<Toaster />` from sonner
7. `app/package.json` — Add `sonner` dependency

---

## Questions / Risks

- **Q: Should the bottom nav include a profile tab?** No — the 5-tab bottom nav is already full (Início, Programa, Planilha, Treino, Biblioteca). Avatar in header is sufficient.
- **R: Updating user_metadata requires `supabase.auth.updateUser()`** — this is a client-side call, no server action needed for profile updates. But we'll provide a server action too for revalidation.
- **R: Dashboard header is inline (not shared component)** — after this phase, both headers show avatar. Consider refactoring to shared component later.
