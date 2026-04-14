# Codebase Concerns

**Analysis Date:** 2026-04-14

## Tech Debt

### Hardcoded Chapter Content

**Issue:** All chapter content is stored directly in source code as a large TypeScript object.

**Files:** `app/src/lib/content.ts`

**Impact:** 
- Any content updates require code changes and rebuilds
- Version control shows large diffs for minor content edits
- No content management system for non-technical updates
- File is 447 lines with embedded markdown strings

**Fix approach:** Move content to external data files (JSON/MD files in `content/` directory) or a headless CMS.

### Duplicate Source Files

**Issue:** Two identical source directory structures exist.

**Files:** 
- `app/src/lib/content.ts` (has content)
- `src/lib/content.ts` (empty wrapper)
- `lib/chapters.ts` (both locations)

**Impact:** Confusion about which files to edit. The `src/` version is the working one, but `lib/` appears in glob results.

**Fix approach:** Remove redundant `lib/` directory or consolidate to single location.

## Code Quality Issues

### Unused Import Warnings

**Issue:** ESLint reports 8 unused import warnings across multiple components.

**Files:**
- `app/src/app/biblioteca/page.tsx` - `Dumbbell` imported but unused
- `app/src/app/livro/[slug]/page.tsx` - `BookOpen` imported but unused  
- `app/src/app/livro/page.tsx` - `BookOpen`, `CheckCircle` imported but unused

**Impact:** Cluttered imports, minor maintenance issue. No runtime errors but indicates incomplete refactoring.

**Fix approach:** Remove unused imports from import statements.

## Missing Functionality

### Progress Tracking Not Implemented

**Issue:** Dashboard shows hardcoded `completedChapters = 0` with no actual tracking.

**Files:** `app/src/app/dashboard/page.tsx` (line 7)

```typescript
const completedChapters = 0;
```

**Impact:** Users cannot track reading progress. All badge logic checks `earned: false`.

**Fix approach:** Implement localStorage persistence or user authentication with backend.

### Authentication Stubbed Out

**Issue:** Login/signup buttons exist in dashboard but have no functionality.

**Files:** `app/src/app/dashboard/page.tsx` (lines 163-168)

**Impact:** Link to `/perfil` in header goes to non-existent page. Users see non-functional auth UI.

**Fix approach:** Implement auth system (NextAuth.js, Clerk, or custom) or remove stub buttons.

### Library Search/Filter Non-Functional

**Issue:** Search input and category filter in biblioteca have no state management.

**Files:** `app/src/app/biblioteca/page.tsx` (lines 167-180)

```typescript
<input type="text" placeholder="BUSCAR EXERCÍCIO..." />
<select>...</select>
```

**Impact:** TypeScript/React renders static HTML. No filtering occurs. Users see broken UI interaction.

**Fix approach:** Add React state and filter logic, or disable inputs until implemented.

### Profile Page Does Not Exist

**Issue:** Header navigation links to `/perfil` but no route is defined.

**Files:** `app/src/app/dashboard/page.tsx` (line 32)

**Impact:** Clicking "PERFIL" results in 404 page.

**Fix approach:** Create profile page or remove navigation link.

### Video Content Placeholder

**Issue:** Biblioteca shows "VíDEOS EM BREVE" with no actual video content system.

**Files:** `app/src/app/biblioteca/page.tsx` (lines 221-225)

**Impact:** Promised video content not available. Exercise demonstrations missing.

**Fix approach:** Integrate video hosting (YouTube embed, Mux, or cloud storage) or remove placeholder.

## Dependencies at Risk

### Next.js 16.2.3 (Cutting Edge)

**Issue:** Using Next.js version released April 2025 - extremely new with limited production usage.

**Files:** `app/package.json` (line 13)

**Impact:** 
- Potential for undiscovered bugs
- Fewer community resources for troubleshooting
- Breaking changes possible between minor versions
- Edge features may be unstable

**Fix approach:** Consider downgrading to Next.js 15.x LTS for stability, or establish thorough QA process if staying on 16.x.

### React 19.2.4 Pairing

**Issue:** Next.js 16 requires React 19, which is also relatively new.

**Dependencies:**
- `next`: 16.2.3
- `react`: 19.2.4
- `react-dom`: 19.2.4

**Impact:** Combined cutting-edge stack increases risk surface. Less battle-tested than React 18 ecosystem.

**Fix approach:** Monitor React 19 stability, ensure thorough test coverage.

### TypeScript Exact Version

**Issue:** `"typescript": "^5"` allows any TypeScript 5.x, which could introduce breaking changes.

**Files:** `app/package.json` (line 25)

**Impact:** Automatic minor version upgrades could break type checking on CI.

**Fix approach:** Pin exact version: `"typescript": "5.7.3"` or similar.

## Security Considerations

### No Environment Configuration Template

**Issue:** No `.env.example` file present to guide environment setup.

**Impact:** Developers don't know what environment variables are required.

**Fix approach:** Create `.env.example` with placeholder values for any required config.

### No Authentication System

**Issue:** No auth implementation despite user-facing auth buttons.

**Files:** `app/src/app/dashboard/page.tsx`

**Impact:** 
- User progress cannot be saved persistently
- Badges and achievements have no persistence
- Cannot integrate with external services requiring auth

**Fix approach:** Add NextAuth.js, Clerk, or custom auth before adding sensitive features.

## Fragile Areas

### Markdown Parsing in Content Renderer

**Issue:** Basic custom parser for chapter content with limited edge case handling.

**Files:** `app/src/app/livro/[slug]/page.tsx` (lines 72-116)

**Impact:** 
- Code blocks not handled
- Links not parsed
- Images not supported
- Tables have basic support only

**Risk:** Content updates with complex formatting may render incorrectly.

**Fix approach:** Use established markdown parser (react-markdown, marked) if content complexity increases.

### Chapter Data Stored Twice

**Issue:** Both `chapters.ts` (metadata) and `content.ts` (body) must stay synchronized.

**Files:** 
- `app/src/lib/chapters.ts`
- `app/src/lib/content.ts`

**Risk:** Adding a chapter requires updates in two files. Easy to desync.

**Fix approach:** Combine into single content definition object, or generate metadata from content files.

## Test Coverage Gaps

### No Test Files Present

**Issue:** No test files found (`*.test.ts`, `*.spec.ts`, `__tests__/`).

**Impact:** 
- No regression protection
- Refactoring risk is high
- Bugs can go unnoticed

**Risk:** High for production deployment.

**Fix approach:** Add Vitest or Jest with tests for:
- Chapter navigation logic
- Content retrieval functions
- Component rendering

## Performance Concerns

### Large Content Object

**Issue:** `chapterContents` object is loaded entirely on each page request.

**Files:** `app/src/lib/content.ts`

**Current:** 11 chapters with ~400 lines of content each

**Risk:** As content grows, initial bundle size increases significantly.

**Fix approach:** Consider lazy-loading content per chapter or static generation.

### Library All Exercises Rendered

**Issue:** Biblioteca renders all 16 exercises simultaneously with no pagination.

**Files:** `app/src/app/biblioteca/page.tsx`

**Risk:** With more exercises, page load time increases linearly.

**Fix approach:** Add pagination or virtual scrolling for larger exercise libraries.

## Recommendations Summary

| Priority | Area | Action |
|----------|------|--------|
| High | Auth System | Implement user authentication or remove stub UI |
| High | Progress Tracking | Add persistence or localStorage |
| High | Test Coverage | Add Vitest/Jest with unit tests |
| Medium | Dependencies | Consider Next.js 15.x LTS |
| Medium | Content Management | Move to external files |
| Medium | Library Features | Implement search/filter or disable |
| Low | ESLint Warnings | Remove unused imports |
| Low | Duplicate Files | Remove redundant `lib/` |

---

*Concerns audit: 2026-04-14*