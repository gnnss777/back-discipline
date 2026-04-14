---
phase: 04-progress-tracking
plan: 02
type: execute
wave: 2
depends_on: [04-progress-tracking-01]
files_modified:
  - app/dashboard/page.tsx
  - app/src/components/DashboardStats.tsx
autonomous: true
requirements:
  - PT-04: Connect dashboard to real progress data
  - PT-05: Show current week/day display
  - PT-06: Display program progress bar
  - PT-07: Show days trained counter
  - PT-08: Calculate and display weekly volume
  - PT-09: Volume chart component
---

<objective>
Integrate dashboard with progress tracking infrastructure to display real user data - chapters completed, days trained, weekly volume, and progress visualization.

Purpose: Replace hardcoded zeros with actual progress data from ProgressContext, display meaningful stats to users.
Output: Updated dashboard with live data, DashboardStats component.
</objective>

<context>
@.planning/phases/04-progress-tracking/04-progress-tracking-01-SUMMARY.md
@app/dashboard/page.tsx

# Phase 1 Summary: ProgressContext created with useProgress() hook
</context>

<tasks>

<task type="auto">
  <name>Task 1: Create DashboardStats component</name>
  <files>app/src/components/DashboardStats.tsx</files>
  <action>
Create reusable stats card component:
- Props: title, value, subtitle, icon (Lucide icon component)
- Display value with formatting (e.g., "120kg" for volume, "3" for days)
- Use existing card styles from dashboard (bg-[#111], border-[#333])

Export component for use in dashboard page.
  </action>
  <verify>
    <automated>npm run build 2>&1 | head -20</automated>
  </verify>
  <done>DashboardStats component created with type-safe props</done>
</task>

<task type="auto">
  <name>Task 2: Integrate ProgressContext into dashboard</name>
  <files>app/dashboard/page.tsx</files>
  <action>
Modify dashboard/page.tsx:
1. Import and wrap with ProgressProvider (add to providers.tsx if needed)
2. Use useProgress() to get stats
3. Replace hardcoded values:
   - completedChapters: from progress.chapters.filter(c => c.completed).length
   - totalDaysTrained: from progress.totalDaysTrained
   - weeklyVolume: from progress.weeklyVolume
   - currentWeek: calculate from progress.startedAt (Math.ceil days/7)
4. Update progress bar to show chapters completed / total chapters (11)
5. Show "TIME" as hours spent (totalDaysTrained * 1.5 estimated)
6. Enable/disable badges based on actual completion

Keep existing UI structure and styling - just wire real data.
  </action>
  <verify>
    <automated>npm run build 2>&1 | head -20</automated>
  </verify>
  <done>Dashboard displays real progress data from storage</done>
</task>

<task type="checkpoint:human-verify" gate="blocking">
  <what-built>Dashboard with live progress data</what-built>
  <how-to-verify>
1. Run dev server: npm run dev
2. Visit http://localhost:3000/dashboard
3. Log in with a test user (or create account)
4. Verify stats show correct values (0 for new user)
5. Navigate to /livro and complete a chapter
6. Return to dashboard - chapter count should increase
7. Log a workout via /historico
8. Return to dashboard - days trained should increment
  </how-to-verify>
  <resume-signal>Type "approved" or describe issues</resume-signal>
</task>

</tasks>

<verification>
- [x] DashboardStats component created
- [x] Dashboard uses ProgressContext for real data
- [x] Chapter completion reflected in progress bar
- [x] Days trained counter updates on workout
- [x] Weekly volume calculated from recent workouts
</verification>

<success_criteria>
- Dashboard shows user's actual chapter completion progress
- Days trained counter increments with each workout logged
- Weekly volume displays calculated from last 7 days
- Progress bar accurately reflects chapters completed / 11 total
- User can verify by completing a chapter and checking dashboard
</success_criteria>

<output>
After completion, create `.planning/phases/04-progress-tracking/04-progress-tracking-02-SUMMARY.md`
</output>