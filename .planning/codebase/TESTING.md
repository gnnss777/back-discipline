# Testing Patterns

**Analysis Date:** 2026-04-14

## Test Framework

**Runner:**
- **Not configured** - No test runner installed
- No Jest, Vitest, or other testing framework in dependencies
- Checked: `package.json` - no test dependencies
- Checked: no `jest.config.*`, `vitest.config.*` files

**Assertion Library:**
- Not applicable

**Run Commands:**
- Not applicable - no tests exist

**Current State:** No tests in the codebase.

## Test File Organization

**Location:**
- No test files found
- No `__tests__` directories
- No co-located tests
- No test patterns in file naming

**Naming:**
- No test files detected in the project

**Structure:**
- Not applicable

## Test Structure

**Suite Organization:**
- Not applicable

**Patterns:**
- Not applicable

## Mocking

**Framework:** Not configured

**Patterns:**
- Not applicable

**What to Mock:**
- Data fetching layer (content.ts functions)
- Chapter navigation logic
- UI interactions in future

**What NOT to Mock:**
- Currently nothing - no tests exist

## Fixtures and Factories

**Test Data:**
- No test fixtures in codebase

**Location:**
- No fixtures directory

**Recommendation:** Create fixtures for:
- Chapter data (`chapters.ts` exports)
- Content data (`content.ts` exports)
- Mock exercise data (from `biblioteca/page.tsx`)

## Coverage

**Requirements:** None enforced

**View Coverage:**
- Not applicable - no tests to measure

## Test Types

**Unit Tests:**
- Not implemented - no unit tests exist
- Priority candidates:
  - `chapters.ts` - navigation functions
  - `content.ts` - content retrieval
  - Utility functions when added

**Integration Tests:**
- Not implemented
- Priority candidates:
  - Page rendering tests
  - Route parameter handling
  - Static params generation

**E2E Tests:**
- Not implemented
- No Playwright or Cypress configured

## Common Patterns

**Async Testing:**
- Pattern not used - all functions sync
- Future consideration for API routes

**Error Testing:**
- No error paths tested
- Recommendation: test null handling, invalid slugs

## Recommended Test Files

Based on codebase analysis, the following tests should be created:

### Priority 1 - Unit Tests for `chapters.ts`

```typescript
// tests/chapters.test.ts
import { chapters, getChapterBySlug, getNextChapter, getPrevChapter } from '@/lib/chapters';

describe('chapters', () => {
  describe('getChapterBySlug', () => {
    it('should return chapter for valid slug', () => {
      const chapter = getChapterBySlug('introducao');
      expect(chapter).toBeDefined();
      expect(chapter?.slug).toBe('introducao');
    });

    it('should return undefined for invalid slug', () => {
      const chapter = getChapterBySlug('invalid-chapter');
      expect(chapter).toBeUndefined();
    });
  });

  describe('getNextChapter', () => {
    it('should return next chapter in sequence', () => {
      const next = getNextChapter('introducao');
      expect(next?.slug).toBe('mentalidade-back-discipline');
    });

    it('should return null for last chapter', () => {
      const next = getNextChapter('saude-ombro');
      expect(next).toBeNull();
    });
  });

  describe('getPrevChapter', () => {
    it('should return previous chapter in sequence', () => {
      const prev = getPrevChapter('mentalidade-back-discipline');
      expect(prev?.slug).toBe('introducao');
    });

    it('should return null for first chapter', () => {
      const prev = getPrevChapter('introducao');
      expect(prev).toBeNull();
    });
  });
});
```

### Priority 2 - Unit Tests for `content.ts`

```typescript
// tests/content.test.ts
import { chapterContents, getChapterContent } from '@/lib/content';

describe('content', () => {
  const knownChapter = 'introducao';

  describe('getChapterContent', () => {
    it('should return content for valid slug', () => {
      const content = getChapterContent(knownChapter);
      expect(content).not.toBeNull();
      expect(typeof content).toBe('string');
    });

    it('should return null for unknown slug', () => {
      const content = getChapterContent('unknown-chapter');
      expect(content).toBeNull();
    });

    it('should return content containing expected text', () => {
      const content = getChapterContent(knownChapter);
      expect(content).toContain('BACK DISCIPLINE');
    });
  });

  describe('chapterContents', () => {
    it('should have content for all chapters', () => {
      chapters.forEach(chapter => {
        const content = getChapterContent(chapter.slug);
        if (chapter.isChapter) {
          expect(content).not.toBeNull();
        }
      });
    });
  });
});
```

### Priority 3 - Component Tests

```typescript
// tests/chapter-page.test.tsx
import { render, screen } from '@testing-library/react';
import ChapterPage from '@/app/livro/[slug]/page';

describe('ChapterPage', () => {
  it('should render chapter title', () => {
    // Test with mock params
  });

  it('should render not found for invalid slug', () => {
    // Test 404 case
  });

  it('should render navigation links', () => {
    // Test prev/next chapter links
  });
});
```

## Test Infrastructure Setup

To implement testing, add the following to `package.json`:

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  },
  "devDependencies": {
    "jest": "^29",
    "jest-environment-jsdom": "^29",
    "@testing-library/react": "^14",
    "@testing-library/jest-dom": "^6"
  }
}
```

Create `jest.config.ts`:

```typescript
import type { Config } from 'jest';
import nextJest from 'next/jest';

const createJestConfig = nextJest({
  dir: './',
});

const config: Config = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};

export default createJestConfig(config);
```

Create `jest.setup.ts`:

```typescript
import '@testing-library/jest-dom';
```

## Current Testing Gaps

| Area | Status | Priority |
|------|--------|-----------|
| Unit tests for chapters.ts | Not implemented | High |
| Unit tests for content.ts | Not implemented | High |
| Component tests | Not implemented | Medium |
| Integration tests | Not implemented | Low |
| E2E tests | Not implemented | Low |

## Testing Philosophy Recommendations

Based on this codebase:

1. **Start with unit tests** - Pure functions in `chapters.ts` and `content.ts` are ideal test subjects
2. **Co-locate tests** - Place `.test.ts` files next to source files
3. **Test behavior, not implementation** - Focus on what functions do, not how
4. **Mock external dependencies** - When database/API added, use MSW or similar
5. **Snapshot for content rendering** - Markdown rendering can use snapshot tests

---

*Testing analysis: 2026-04-14*