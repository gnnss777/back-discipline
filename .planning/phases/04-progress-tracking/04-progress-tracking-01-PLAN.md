---
phase: 04-progress-tracking
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - app/src/lib/storage.ts
  - app/src/types/workout.ts
  - app/src/context/ProgressContext.tsx
autonomous: true
requirements:
  - PT-01: Create progress tracking infrastructure
  - PT-02: Add chapter completion tracking
  - PT-03: Implement days trained counter
---

<objective>
Create progress tracking infrastructure - storage functions, types, and progress context for tracking user advancement through chapters and workout history.

Purpose: Enable persistent tracking of user progress including chapter completion, days trained, and workout history to power the dashboard with real data.
Output: ProgressContext, storage functions for UserProgress, updated types.
</objective>

<context>
@app/src/context/AuthContext.tsx
@app/src/lib/storage.ts
@app/src/types/workout.ts
@app/src/types/user.ts

# Existing patterns from codebase:
# - Storage uses localStorage with key prefixes (backdiscipline_*)
# - AuthContext uses getSession/setSession pattern
# - UserProgress exists in workout.ts but needs full implementation
</context>

<tasks>

<task type="auto" tdd="true">
  <name>Task 1: Expand UserProgress type and add progress storage functions</name>
  <files>app/src/types/workout.ts, app/src/lib/storage.ts</files>
  <behavior>
    - Test 1: saveProgress saves UserProgress with all fields
    - Test 2: getProgress retrieves user's progress by userId
    - Test 3: getChapterProgress returns chapter completion status
    - Test 4: updateChapterProgress marks chapter as complete
    - Test 5: calculateDaysTrained returns correct count from workouts
  </behavior>
  <action>
Add extended fields to UserProgress interface in workout.ts:
- totalDaysTrained: number
- weeklyVolume: number (calculated from last 7 days)
- longestStreak: number
- lastWorkoutDate: string | null

Add storage functions to storage.ts:
- getProgress(userId: string): UserProgress | null
- saveProgress(progress: UserProgress): void
- getChapterProgress(userId: string, chapterSlug: string): ChapterProgress | null
- updateChapterProgress(userId: string, chapterSlug: string, completed: boolean): void
- incrementDaysTrained(userId: string): void

Reference existing storage pattern with STORAGE_KEYS prefix.
  </action>
  <verify>
    <automated>npm run build 2>&1 | head -20</automated>
  </verify>
  <done>Type definitions updated, storage functions added, TypeScript compiles without errors</done>
</task>

<task type="auto">
  <name>Task 2: Create ProgressContext for state management</name>
  <files>app/src/context/ProgressContext.tsx</files>
  <action>
Create ProgressContext following AuthContext pattern:
- Load user progress on mount (requires userId from AuthContext)
- Provide updateChapterProgress(slug, completed) function
- Provide getStats() returning { daysTrained, weeklyVolume, chaptersCompleted, currentWeek }
- Auto-increment daysTrained when new workout is logged

Use useAuth() to get userId, show loading state while fetching progress.
  </action>
  <verify>
    <automated>npm run build 2>&1 | head -20</automated>
  </verify>
  <done>ProgressContext exported with useProgress() hook, integrates with AuthContext</done>
</task>

</tasks>

<verification>
- [x] Types updated in workout.ts
- [x] Storage functions added to storage.ts
- [x] ProgressContext exports useProgress hook
- [x] Build passes without TypeScript errors
</verification>

<success_criteria>
- UserProgress type includes all required fields
- Storage functions persist progress to localStorage
- ProgressContext loads and manages progress state
- Chapter completion can be tracked and retrieved
</success_criteria>

<output>
After completion, create `.planning/phases/04-progress-tracking/04-progress-tracking-01-SUMMARY.md`
</output>