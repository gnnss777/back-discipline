---
phase: 01-foundation
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - app/package.json
  - app/tsconfig.json
  - app/src/app/page.tsx
  - app/src/app/layout.tsx
  - app/src/app/globals.css
  - lib/content.ts
  - lib/chapters.ts
  - src/lib/content.ts
  - src/lib/chapters.ts
autonomous: true
requirements:
  - AUTH-01
  - AUTH-02
  - ARCH-01
user_setup: []

must_haves:
  truths:
    - "No duplicate Next.js app directories exist"
    - "No duplicate lib folders exist"
    - "All imports resolve to single canonical location"
    - "Build succeeds without errors"
    - "All 5 pages render correctly"
  artifacts:
    - path: "app/src/app/"
      provides: "Single canonical Next.js app router structure"
    - path: "app/src/lib/"
      provides: "Single lib folder with chapters.ts and content.ts"
  key_links:
    - from: "app/src/app/page.tsx"
      to: "app/src/lib/chapters"
      via: "import"
      pattern: "from.*lib/chapters"
---

<objective>
Clean up duplicate folder structure and consolidate the codebase to a single app instance.

Purpose: The project has duplicate Next.js apps (root and app/) and duplicate lib folders. This causes confusion and maintenance burden. Consolidate to a single canonical location.

Output: Single working Next.js application with clean structure
</objective>

<execution_context>
@$HOME/.config/opencode/get-shit-done/workflows/execute-plan.md
@$HOME/.config/opencode/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/ROADMAP.md
@.planning/REQUIREMENTS.md
@.planning/PROJECT.md

## Discovery Context

### Issue: Duplicate Structure
The project has two Next.js app directories:
- Root level: `app/` - contains full Next.js 16 app with src/app/, public/, package.json
- Subdirectory: `app/` inside `app/` - another Next.js instance with its own package.json

Both have `lib/` folders:
- `/lib/chapters.ts` and `/lib/content.ts` (at root)
- `/src/lib/chapters.ts` and `/src/lib/content.ts` (inside app/)

### Decision Required
Which instance should become the canonical app?
- Current thinking: Keep the `app/` directory as it's more complete with built output

### Actions Needed
1. Determine which app instance to keep
2. Move/merge code from discarded instance
3. Ensure imports work after consolidation
4. Update any references in documentation or configs
</context>

<tasks>

<task type="auto">
  <name>Task 1: Analyze and select canonical app structure</name>
  <files>
    - app/package.json
  </files>
  <action>
    Compare the two app instances to determine which is more complete:
    
    1. Check package.json in root-level `app/` for dependencies and scripts
    2. Check if there are unique files in either instance
    3. Check which has more complete page implementations
    4. Select the more complete instance as canonical
    
    Document findings and the selected structure.
  </action>
  <verify>
    <automated>Compare file counts and structure between both app instances</automated>
  </verify>
  <done>Selected canonical app structure with justification</done>
</task>

<task type="auto">
  <name>Task 2: Remove duplicate lib/ folder</name>
  <files>
    - lib/content.ts
    - lib/chapters.ts
  </files>
  <action>
    After selecting canonical app structure:
    
    1. If keeping root-level `app/` with `src/app/` - remove `/lib/` at root since code exists in `src/lib/`
    2. If keeping `app/` subdirectory - remove `src/lib/` in favor of root `/lib/`
    3. Ensure all imports reference the correct path
    
    Verify the remaining lib folder contains the chapters.ts and content.ts files with correct exports.
  </action>
  <verify>
    <automated>Single lib folder exists with chapters.ts and content.ts</automated>
  </verify>
  <done>Duplicate lib folder removed, imports work correctly</done>
</task>

<task type="auto">
  <name>Task 3: Verify clean build and navigation</name>
  <files>
    - app/package.json
    - app/src/app/page.tsx
  </files>
  <action>
    After consolidation:
    
    1. Run build to verify no import errors
    2. Verify all 5 pages still render correctly:
       - Home (/)
       - Programa (/livro)
       - Chapter reader (/livro/[slug])
       - Biblioteca (/biblioteca)
       - Dashboard (/dashboard)
    3. Test navigation between pages works
    
    Fix any broken imports or missing dependencies.
  </action>
  <verify>
    <automated>npm run build in canonical app directory</automated>
  </verify>
  <done>All pages build and render correctly</done>
</task>

</tasks>

<verification>
- [ ] No duplicate app directories exist
- [ ] No duplicate lib folders exist
- [ ] All imports resolve correctly
- [ ] Build succeeds without errors
- [ ] All 5 pages accessible and render content
</verification>

<success_criteria>
- Clean single-app structure
- Build succeeds without errors
- All routes accessible
- No duplicate files
</success_criteria>

<output>
After completion, create `.planning/phases/01-foundation/01-foundation-SUMMARY.md`
</output>