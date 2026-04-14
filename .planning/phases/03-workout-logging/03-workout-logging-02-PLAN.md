---
phase: 03-workout-logging
plan: "02"
type: execute
wave: 2
depends_on: ["03-workout-logging-01"]
files_modified:
  - app/src/components/WorkoutHistory.tsx
  - app/src/app/historico/page.tsx
autonomous: true
requirements:
  - "3.6"
  - "3.7"
must_haves:
  truths:
    - "User can view list of past workouts"
    - "User can see exercise details for each workout"
    - "User can access workout history page"
  artifacts:
    - path: "app/src/components/WorkoutHistory.tsx"
      provides: "Workout history list component"
      min_lines: 60
    - path: "app/src/app/historico/page.tsx"
      provides: "Workout history page route"
      min_lines: 30
  key_links:
    - from: "WorkoutHistory.tsx"
      to: "lib/storage.ts"
      via: "getWorkouts() function"
      pattern: "getWorkouts"
    - from: "page.tsx"
      to: "WorkoutHistory.tsx"
      via: "component import"
      pattern: "import.*WorkoutHistory"
---

<objective>
Create workout history view for Phase 3.
</objective>

<execution_context>
@$HOME/.config/opencode/get-shit-done/workflows/execute-plan.md
@$HOME/.config/opencode/get-shit-done/templates/summary.md
</execution_context>

<context>
@app/src/lib/storage.ts
@app/src/types/workout.ts

## Storage functions available:
- getWorkouts(): Workout[]
- getWorkoutsByUser(userId: string): Workout[]
- saveWorkout(workout: Workout): void
- getProgress(userId: string): UserProgress | null

## Context from AuthContext:
- Use useAuth() hook to get current user session
- Access session.user.id for user-specific workouts
</context>

<tasks>

<task type="auto">
  <name>Task 1: Create WorkoutHistory component</name>
  <files>app/src/components/WorkoutHistory.tsx</files>
  <action>
Create WorkoutHistory component that:
- Accepts userId: string
- Fetches workouts using getWorkoutsByUser(userId)
- Sorts by date descending (newest first)
- Displays list of workout cards:
  - Date (formatted: "DD/MM/YYYY")
  - Number of exercises
  - Number of total sets
  - Total volume (reps × weight sum)
  - Expand to show exercise details (exercise name, sets with reps/weight/RPE each)
- Empty state: "Nenhum treino registrado ainda. Comece a treinar!"
- Use useEffect to fetch on mount
- Handle loading state
  </action>
  <verify>
<automated>npx tsc --noEmit --project app/tsconfig.json 2>&1 | head -20</automated>
  </verify>
  <done>WorkoutHistory shows list of past workouts with details</done>
</task>

<task type="auto">
  <name>Task 2: Create /historico page</name>
  <files>app/src/app/historico/page.tsx</files>
  <action>
Create /historico page that:
- Uses ProtectedRoute wrapper
- Uses useAuth() to get current user
- Renders WorkoutHistory component with user.id
- Page title: "Histórico de Treinos"
- Add link to workout log page (/treino)
- Layout matches existing dashboard/biblioteca pages
  </action>
  <verify>
<automated>npx tsc --noEmit --project app/tsconfig.json 2>&1 | head -20</automated>
  </verify>
  <done>/historico route renders protected, shows workout history</done>
</task>

</tasks>

<verification>
- [x] TypeScript compiles without errors
- [x] WorkoutHistory component exists
- [x] /historico route exists and is protected
- [x] Shows past workouts
</verification>

<success_criteria>
Workout history page accessible at /historico.
User can see list of past workouts with exercise details.
</success_criteria>

<output>
After completion, create `.planning/phases/03-workout-logging/03-workout-logging-02-SUMMARY.md`
</output>