# Architecture

**Analysis Date:** 2026-04-14

## Pattern Overview

**Overall:** Next.js 16 App Router with Server-Side Rendering (SSR)

This is a **Next.js 16 web application** that serves as an interactive digital book/platform for the "Back Discipline" training program. It follows the Next.js App Router architecture with server components for content rendering.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16.2.3 |
| Language | TypeScript |
| UI Library | React 19.2 |
| Styling | Tailwind CSS 4 |
| Icons | Lucide React 1.8.0 |
| Fonts | Google Fonts (Oswald) |

## Layers

### 1. Page Layer (Routes)

**Location:** `app/src/app/`

**Contains:** Next.js page components and layouts

| Route | File | Purpose |
|-------|------|---------|
| `/` | `page.tsx` | Home/Landing page with hero section |
| `/livro` | `livro/page.tsx` | Program index showing all chapters |
| `/livro/[slug]` | `livro/[slug]/page.tsx` | Individual chapter content reader |
| `/biblioteca` | `biblioteca/page.tsx` | Exercise library with search/filter |
| `/dashboard` | `dashboard/page.tsx` | User progress tracking panel |

**Pattern:** Uses Next.js App Router with file-based routing and dynamic parameters for chapter slugs.

### 2. Data/Library Layer

**Location:** `src/lib/` and `lib/`

**Contains:** Static content data and chapter/utility functions

| File | Purpose |
|------|---------|
| `chapters.ts` | Chapter metadata (12 chapters/levels) with titles, slugs, order |
| `content.ts` | Full markdown content for each chapter stored as strings |

**Key Exports:**
```typescript
// chapters.ts
- chapters: Array of chapter objects with id, title, slug, order, description, part
- getChapterBySlug(slug: string): Chapter | undefined
- getNextChapter(currentSlug: string): Chapter | null
- getPrevChapter(currentSlug: string): Chapter | null

// content.ts
- chapterContents: Record<string, string> - all markdown content
- getChapterContent(slug: string): string | null
```

### 3. Layout Layer

**Location:** `app/src/app/layout.tsx`

**Contains:** Root layout with metadata and font configuration

**Responsibilities:**
- Set global metadata (title, description)
- Load and apply Oswald font via next/font/google
- Wrap all children with global HTML structure
- Apply base CSS classes for dark theme

### 4. Styling Layer

**Location:** `app/src/app/globals.css`

**Contains:** Tailwind CSS 4 base styles and custom CSS variables

**Theme Colors:**
| Token | Value | Usage |
|-------|-------|-------|
| Background | `#0A0A0A` | Primary dark background |
| Surface | `#0F0F0F` | Card/component background |
| Border | `#3A2E22` | Subtle borders |
| Accent | `#B8956A` | Gold/bronze accent color |
| Text Primary | `#E8E0D0` | Main text |
| Text Secondary | `#666` | Muted text |

## Data Flow

### Chapter Reading Flow

```
User visits /livro/[slug]
    ↓
Page component receives slug from params
    ↓
Calls getChapterBySlug(slug) from lib/chapters.ts
    ↓
Calls getChapterContent(slug) from lib/content.ts
    ↓
Chapter content rendered as React components
    ↓
Navigation links to next/prev via getNextChapter/getPrevChapter
```

### Program Index Flow

```
User visits /livro
    ↓
Page imports chapters array
    ↓
Filters by part (Part I = system/practice, Part II = technical)
    ↓
Renders chapter list cards with links to /livro/[slug]
    ↓
Each chapter card links to dynamic route
```

### Exercise Library Flow

```
User visits /biblioteca
    ↓
Page renders static exercises array (16 exercises)
    ↓
Search input filters client-side (not yet functional)
    ↓
Category select filters by exercise type
    ↓
Exercises displayed in grid
```

## Key Abstractions

### 1. Chapter Navigation

**Purpose:** Navigate between sequential chapters

**Pattern:** Uses `order` field to find next/prev chapters

```typescript
// Example: current chapter has order: 3
// getNextChapter finds chapter with order: 4
// getPrevChapter finds chapter with order: 2
```

### 2. Content Rendering

**Purpose:** Render markdown content as React components

**Location:** `app/livro/[slug]/page.tsx`

**Pattern:** String parsing with conditional rendering based on markdown syntax:
- `# ` = H1
- `## ` = H2
- `### ` = H3
- `**bold**` = H4
- `|` = Table
- `-` / `*` = List items

### 3. Progress Tracking (UI Only)

**Purpose:** Display user progress in dashboard

**Location:** `app/dashboard/page.tsx`

**Pattern:** Currently static - shows 0% progress with badge placeholders

**Note:** No actual user authentication or database implemented yet.

## Entry Points

### Primary Entry

**Location:** `/`

**Triggers:** User navigates to root URL

**Responsibilities:**
- Hero section with call-to-action
- Feature cards linking to main sections
- Stats display (6 weeks, 11 chapters, 16+ exercises)
- Footer with branding

### Secondary Entries

| Entry | Route | Purpose |
|-------|-------|---------|
| Program Index | `/livro` | Browse chapters |
| Library | `/biblioteca` | Browse exercises |
| Dashboard | `/dashboard` | View progress |

## Error Handling

**Patterns:**
- Invalid chapter slug → Shows "CAPÍTULO NÃO ENCONTRADO" message
- Chapter not in content map → Shows "Este capítulo está sendo preparado"

**No Error Boundaries:** Not implemented

## Cross-Cutting Concerns

### Styling

**Framework:** Tailwind CSS 4 with custom color tokens
**Approach:** Dark theme with gold accent (#B8956A)

### Typography

**Font:** Oswald (Google Fonts) via next/font/google
**Weights:** 400, 500, 600, 700
**Usage:** Headlines and UI elements with tracking/widest letter-spacing

### SEO

**Metadata:** Set in root layout via Next.js Metadata API
**Title:** "Back Discipline - Método Mountain Dog"
**Description:** "Um guia prático de 6 semanas para construir costas épicas usando o método John Meadows"
**Language:** pt-BR

---

*Architecture analysis: 2026-04-14*