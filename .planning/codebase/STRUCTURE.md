# Codebase Structure

**Analysis Date:** 2026-04-14

## Directory Layout

```
E:\BACK TRAINING/
├── .planning/              # Planning output (generated)
│   └── codebase/
├── .next/                # Next.js build output (generated)
├── app/                  # Next.js app source (root app router)
│   ├── public/           # Static assets
│   ├── src/              # Nested source (rare pattern)
│   │   └── app/         # Alternative app router location
│   ├── page.tsx          # Root page
│   ├── layout.tsx        # Root layout
│   ├── globals.css       # Global styles
│   ├── livro/           # Book chapter routes
│   │   ├── page.tsx    # Chapter list
│   │   └── [slug]/     # Dynamic chapter
│   ├── biblioteca/       # Exercise library
│   ├── dashboard/       # User progress
│   └── favicon.ico
├── public/               # Static assets
│   └── *.svg           # Example SVGs
├── src/                 # Library code
│   └── lib/
│       ├── content.ts   # Chapter content
│       └── chapters.ts  # Chapter metadata
├── lib/                 # Library code (root level)
│   ├── content.ts
│   └── chapters.ts
├── node_modules/         # Dependencies
├── .gitignore
├── AGENTS.md            # Agent instructions
├── CLAUDE.md            # Claude config
├── eslint.config.mjs      # ESLint config
├── next.config.ts       # Next.js config
├── package-lock.json
├── package.json
├── postcss.config.mjs    # PostCSS config
├── README.md
└── tsconfig.json
```

## Directory Purposes

### `app/` (Root Next.js App Router)

**Purpose:** Next.js 16 App Router structure using root-level app directory

**Contains:** All route pages and layouts for the application

**Key Files:**
- `page.tsx` - Landing/hero page
- `layout.tsx` - Root HTML layout with metadata
- `globals.css` - Global Tailwind styles

**Note:** Also has nested `src/app/` in `app/` - appears to be alternative or legacy structure. The root `app/` is the active one.

### `src/lib/` and `lib/`

**Purpose:** Shared library code for content and utilities

**Contains:** 
- Chapter metadata and content data
- Navigation helper functions

**Files Identical:** Both `src/lib/` and `lib/` contain the same files (content.ts, chapters.ts). May be duplication or intentional.

**Key Files in `lib/`:**
- `chapters.ts` - Export chapter array and navigation functions
- `content.ts` - Export chapter content strings

### `public/`

**Purpose:** Static assets served directly

**Contains:** SVG icons (vercel.svg, globe.svg, window.svg, file.svg, next.svg)

## Key File Locations

### Entry Points

| Path | Purpose |
|------|---------|
| `app/page.tsx` | Landing page - main entry |
| `app/layout.tsx` | Root layout - wraps all pages |
| `app/livro/page.tsx` | Program index |
| `app/livro/[slug]/page.tsx` | Dynamic chapter reader |
| `app/biblioteca/page.tsx` | Exercise library |
| `app/dashboard/page.tsx` | Progress tracking |

### Configuration

| Path | Purpose |
|------|---------|
| `package.json` | Dependencies and scripts |
| `tsconfig.json` | TypeScript config |
| `next.config.ts` | Next.js config |
| `postcss.config.mjs` | PostCSS/Tailwind config |
| `eslint.config.mjs` | ESLint config |

### Core Logic

| Path | Purpose |
|------|---------|
| `lib/chapters.ts` | Chapter definitions (12 chapters) |
| `lib/content.ts` | Chapter content (full markdown text) |

### Styling

| Path | Purpose |
|------|---------|
| `app/globals.css` | Global Tailwind styles |

## Where to Add New Code

### New Feature/Page

**Primary code:** `app/[feature-name]/page.tsx`

Example: To add a new `/perfil` profile page:
- Create `app/perfil/page.tsx`
- Follow existing page patterns from `app/dashboard/page.tsx`

### New Chapter Content

**Implementation:** Add to `lib/content.ts`

```typescript
// Add new chapter content:
export const chapterContents: Record<string, string> = {
  // ...existing chapters
  "new-chapter-slug": `
# New Chapter Title

Content here...
`
};

// Add chapter metadata to lib/chapters.ts:
{
  id: "12-new-chapter",
  title: "Título",
  slug: "new-chapter-slug",
  order: 12,
  description: "Description",
  part: "II" // or "III" if adding new part
}
```

### New Exercise

**Implementation:** Add to `app/biblioteca/page.tsx`

```typescript
// Add exercise to exercises array:
{
  id: "new-exercise",
  name: "Exercise Name",
  category: "Category",
  muscles: ["Muscle 1", "Muscle 2"],
  difficulty: "Difficulty",
  description: "Description"
}
```

### New Component (UI)

**Implementation:** Co-locate with page or create `app/components/`

Given current structure: Add directly to page files or create new component files in same directory.

### Utilities/Helpers

**Implementation:** Add to `lib/` directory

Current pattern: All utilities in `lib/` (chapters.ts, content.ts)

## Naming Conventions

### Files

| Pattern | Example | Description |
|---------|---------|------------|
| Page | `page.tsx` | Next.js page component |
| Dynamic Route | `[slug]/page.tsx` | Dynamic parameter route |
| Layout | `layout.tsx` | Next.js layout |
| Styles | `globals.css` | Global CSS |
| Config | `next.config.ts` | TypeScript config |

### Directories

| Pattern | Example | Description |
|---------|---------|------------|
| Route | `livro/` | Book/chapter section |
| Dynamic Route | `livro/[slug]/` | Dynamic chapter |
| Data | `lib/` | Shared library |

### Pages/Components

| Pattern | Example | Description |
|---------|---------|------------|
| Page export | `export default function Page() {...}` | Default export |
| Named component | `ChapterPage` | Page component name |
| Props interface | `PageProps` | Component props |

## Data Structures

### Chapter Object

```typescript
interface Chapter {
  id: string;           // "01-mentalidade"
  title: string;        // "Capítulo 1: Mentalidade..."
  slug: string;        // "mentalidade-back-discipline"
  order: number;       // 1
  description: string;  // "Description text"
  part: string;       // "I" or "II"
  isChapter?: boolean;// For intro (false)
}
```

### Exercise Object

```typescript
interface Exercise {
  id: string;           // "meadows-row"
  name: string;         // "Meadows Row"
  category: string;     // "Remadas"
  muscles: string[];    // ["Latíssimo", "Rombóides"]
  difficulty: string;   // "Avançado"
  description: string; // Description text
}
```

## Special Directories

### `.next/`

**Purpose:** Build output directory
**Generated:** Yes (by `next build`)
**Committed:** No (in .gitignore)

### `node_modules/`

**Purpose:** Installed dependencies
**Generated:** Yes (by `npm install`)
**Committed:** No (in .gitignore)

### `.planning/`

**Purpose:** Planning output from GSD agents
**Generated:** Yes (by this agent)
**Committed:** Likely (for future reference)

## Routing Structure

```
/                           → app/page.tsx
/livro                     → app/livro/page.tsx
/livro/[slug]             → app/livro/[slug]/page.tsx
/biblioteca               → app/biblioteca/page.tsx
/dashboard                → app/dashboard/page.tsx
```

Note: The duplicate `app/src/app/` structure appears to be an alternative/legacy location. The active routing is from root `app/`.

---

*Structure analysis: 2026-04-14*