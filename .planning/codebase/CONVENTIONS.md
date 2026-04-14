# Coding Conventions

**Analysis Date:** 2026-04-14

## Naming Patterns

**Files:**
- `kebab-case` for all source files: `content.ts`, `chapters.ts`, `page.tsx`
- Page components use descriptive names: `page.tsx`, `[slug]/page.tsx`
- TypeScript files use `.ts` extension
- React components use `.tsx` extension

**Functions:**
- `camelCase` for all functions: `getChapterContent()`, `getChapterBySlug()`, `getNextChapter()`
- Action-oriented names with "get", "fetch", "calculate" prefixes
- Descriptive names indicating return type: `getChapterBySlug` returns a chapter object

**Variables:**
- `camelCase` for variables: `chapter`, `content`, `nextChapter`, `prevChapter`
- Use semantic names describing data type
- Avoid single-letter variables except in map callbacks

**Types/Interfaces:**
- PascalCase for interfaces: `PageProps`, `Chapter`, `Exercise`
- Inline interfaces in component files for local types
- Explicit typing for function parameters and returns

**Constants:**
- Uppercase with underscores for magic values: not currently used
- Array exports use descriptive plural names: `chapters`, `chapterContents`

## Code Style

**Formatting:**
- 2 spaces for indentation (configured in editor defaults)
- No semicolons at end of statements (ESLint configured for modern JS)
- Trailing commas in multiline objects/arrays
- Single quotes for strings

**Linting:**
- Tool: ESLint with `eslint-config-next` (core-web-vitals + typescript)
- Config file: `eslint.config.mjs` - flat config format
- Runs via: `npm run lint`
- Strict mode enabled in TypeScript (`tsconfig.json`: `"strict": true`)

**Structure:**
```typescript
// 1. Imports
import Link from "next/link";
import { BookOpen, Dumbbell } from "lucide-react";

// 2. Types/Interfaces
interface PageProps {
  params: Promise<{ slug: string }>;
}

// 3. Exported constants/data
export const chapters = [...];

// 4. Helper functions
export function getChapterBySlug(slug: string) {...}

// 5. Page components (default export)
export default function ChapterPage({ params }: PageProps) {...}
```

## Import Organization

**Order:**
1. Next.js imports: `next/link`, `next/image`
2. React imports: `react`, `react-dom`
3. Third-party libraries: `lucide-react`
4. Internal modules: `../../../lib/chapters`
5. Type imports (when needed)

**Path Aliases:**
- Configured in `tsconfig.json`:
  ```json
  "paths": {
    "@/*": ["./src/*"]
  }
  ```
- Use `@/` for imports from `src/` directory

**Style:**
```typescript
// Named imports for utilities
import { getChapterBySlug, getNextChapter, getPrevChapter, chapters } from "../../../lib/chapters";

// Named import for content
import { getChapterContent } from "../../../lib/content";

// Named import - default export component
import Link from "next/link";

// Named imports - icons
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle } from "lucide-react";
```

## TypeScript Usage

**Type Annotation:**
- Explicit return types on exported functions:
  ```typescript
  export function getChapterContent(slug: string): string | null {...}
  export function getChapterBySlug(slug: string) {...}
  ```
- Interface definitions for component props:
  ```typescript
  interface PageProps {
    params: Promise<{ slug: string }>;
  }
  ```

**Type Inference:**
- TypeScript infers array and object types from initialization
- Constants: `export const chapters = [...]` - type inferred
- Variables in function scope inferred from usage

**Strict Mode:**
- Enabled in `tsconfig.json`: `"strict": true`
- No implicit any allowed
- Null checks enforced

**Current Type Definitions:**
```typescript
// chapters.ts - inferred from array of objects
export const chapters = [
  {
    id: "00-introducao",
    title: "Introdução",
    slug: "introducao",
    order: 0,
    description: "Boas-vindas e visão geral do programa",
    isChapter: false
  },
  // ...more items
];

// content.ts - explicit Record type
export const chapterContents: Record<string, string> = {...};
```

## Error Handling

**Not Currently Implemented:**
- No try/catch blocks in codebase
- No error boundaries defined
- No explicit error types or error handling utilities

**Observed Patterns:**
- Null checks with conditional rendering:
  ```typescript
  const content = chapter ? getChapterContent(chapter.slug) : null;
  
  if (!chapter) {
    return (
      <div>CAPÍTULO NÃO ENCONTRADO</div>
    );
  }
  ```
- Nullish coalescing: not used
- Optional chaining: not used

**Recommendations:**
- Add error boundary components for route segments
- Create error type definitions
- Add try/catch in async data fetching
- Implement user-facing error pages (`error.tsx`)

## Logging

**Current State:**
- No console.log statements in production code
- No logging framework integrated
- No error tracking service (Sentry, etc.)

**Development:**
- No dev-specific logging
- Build warnings appear in dev mode only

## Comments

**Usage:**
- Minimal inline comments
- Section comments for file organization:
  ```typescript
  // Conteúdo dos capítulos do livro
  // Cada capítulo é armazenado como uma string para renderização
  ```
- Portuguese language for comments in content data

**JSDoc/TSDoc:**
- Not used in this codebase
- Types documented via TypeScript interfaces

**When to Comment:**
- Complex data transformations
- Non-obvious logic
- API response structure explanations

## Function Design

**Size:**
- Most functions are small and single-purpose
- `getChapterBySlug()` - simple find operation
- `getNextChapter()` / `getPrevChapter()` - navigation helpers

**Parameters:**
- Single parameter patterns: `getChapterBySlug(slug: string)`
- Destructured props in components: `({ params }: PageProps)`

**Return Values:**
- Explicit return types when return type is complex
- Inferred from function body in simple cases

## Component Design

**Page Components:**
- Default exports: `export default function PageName()`
- Async support in App Router: `export default async function PageName()`
- Server components by default (no "use client")

**Props:**
- Interface-defined props types
- Use `Promise<params>` for dynamic routes in Next.js 15+

**Structure:**
```typescript
interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {...}

export default async function ChapterPage({ params }: PageProps) {
  // Data fetching
  // Conditional rendering
  // JSX return
}
```

## Module Design

**Exports:**
- Named exports for data: `export const chapters = [...]`
- Named exports for functions: `export function getChapterBySlug(...)`
- Default export for page components

**Barrel Files:**
- Not used - no `index.ts` barrel files
- Direct imports from module files

**File Organization:**
- Page routes: `src/app/[route]/page.tsx`
- Shared code: `src/lib/*.ts`
- Components inline in page files (no separate components directory)

---

*Convention analysis: 2026-04-14*