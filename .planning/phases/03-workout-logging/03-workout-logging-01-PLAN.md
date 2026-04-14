---
phase: 03-workout-logging
plan: "01"
type: execute
wave: 1
depends_on: []
files_modified:
  - app/src/components/ExerciseSelector.tsx
  - app/src/components/SetInput.tsx
  - app/src/components/WorkoutLogForm.tsx
autonomous: true
requirements:
  - "3.1"
  - "3.2"
  - "3.3"
  - "3.4"
  - "3.5"
must_haves:
  truths:
    - "User can select an exercise from a searchable list"
    - "User can input reps, weight, and RPE for each set"
    - "User can add multiple sets per exercise"
    - "User can add notes to the workout"
    - "User can view a form to log their workout"
  artifacts:
    - path: "app/src/components/ExerciseSelector.tsx"
      provides: "Searchable exercise dropdown"
      min_lines: 40
    - path: "app/src/components/SetInput.tsx"
      provides: "Set input with reps, weight, RPE"
      min_lines: 35
    - path: "app/src/components/WorkoutLogForm.tsx"
      provides: "Main workout logging form"
      min_lines: 80
  key_links:
    - from: "ExerciseSelector.tsx"
      to: "lib/content.ts"
      via: "exercise list import"
      pattern: "import.*chapters"
    - from: "SetInput.tsx"
      to: "types/workout.ts"
      via: "WorkoutSet type"
      pattern: "WorkoutSet"
---

<objective>
Create workout logging form components for Phase 3.
</objective>

<execution_context>
@$HOME/.config/opencode/get-shit-done/workflows/execute-plan.md
@$HOME/.config/opencode/get-shit-done/templates/summary.md
</execution_context>

<context>
@app/src/types/workout.ts
@app/src/lib/storage.ts

## Existing patterns (Phase 1-2):
- Components in `app/src/components/`
- Types defined in `app/src/types/workout.ts`
- LocalStorage via `app/src/lib/storage.ts`

## Exercise data source:
- Exercises are defined in `lib/content.ts` and `lib/chapters.ts`
- Chapter workouts contain exercise names (Smith Machine Row, Meadows Row, etc.)
</context>

<tasks>

<task type="auto">
  <name>Task 1: Create ExerciseSelector component</name>
  <files>app/src/components/ExerciseSelector.tsx</files>
  <action>
Create ExerciseSelector component that:
- Accepts selectedExercise: string, onSelect: (exercise: string) => void
- Renders a searchable dropdown with exercise list
- Exercises to include: "Remada Unilateral com Barra", "Smith Machine Row", "Remada com Halteres", "Levantamento Terra", "Pulldown Supinado", "Pulldown Unilateral", "Hammer Strength High Row", "Pull-over com Banda", "Chin-ups", "Low Cable Row", "Kettlebell Row", "Rope Straight Arm Pulldown", "Face Pulls", "Meadows Row", "E-Z Bar Cable Row", "Deadstop Dumbbell Row", "T-Bar Row", "Rack Pull", "One Arm Barbell Row", "Seated Cable Row"
- Uses standard Tailwind styling matching existing components
- Search filter: case-insensitive matching on exercise name
- Include "add new exercise" option for custom exercises
  </action>
  <verify>
<automated>npx tsc --noEmit --project app/tsconfig.json 2>&1 | head -20</automated>
  </verify>
  <done>ExerciseSelector renders with searchable list, selection updates state</done>
</task>

<task type="auto">
  <name>Task 2: Create SetInput component</name>
  <files>app/src/components/SetInput.tsx</files>
  <action>
Create SetInput component that:
- Accepts set: WorkoutSet, onChange: (set: WorkoutSet) => void
- Inputs: reps (number, 1-50), weight (number, 0-500), RPE (number 1-10)
- RPE selector: buttons for values 6-10 (matching RPE system in content.ts), plus "add reps" option
- Checkbox for completed: boolean
- Optional notes field
- Layout: horizontal row with inputs, RPE buttons as a group
  </action>
  <verify>
<automated>npx tsc --noEmit --project app/tsconfig.json 2>&1 | head -20</automated>
  </verify>
  <done>SetInput renders with all fields, values update on change</done>
</task>

<task type="auto">
  <name>Task 3: Create WorkoutLogForm component</name>
  <files>app/src/components/WorkoutLogForm.tsx</files>
  <action>
Create WorkoutLogForm component that:
- Accepts onSave: (workout: Workout) => void, onCancel?: () => void
- Manages state: exercises[] (array of WorkoutExercise), date, notes
- "Add Exercise" button adds new exercise entry (uses ExerciseSelector)
- Each exercise entry has: ExerciseSelector + SetInput list
- "Add Set" button adds new set to current exercise
- Remove set button per set
- Remove exercise button per exercise
- Notes textarea at bottom (optional)
- "Save Workout" button calls onSave with full Workout object
- Date defaults to today, editable
- Generate UUID for workout id
- Use existing storage.ts saveWorkout function for persistence
  </action>
  <verify>
<automated>npx tsc --noEmit --project app/tsconfig.json 2>&1 | head -20</automated>
  </verify>
  <done>WorkoutLogForm renders, allows adding exercises/sets, save creates workout</done>
</task>

</tasks>

<verification>
- [x] TypeScript compiles without errors
- [x] All 3 components exist and render
- [x] ExerciseSelector shows searchable list
- [x] SetInput accepts reps/weight/RPE
- [x] WorkoutLogForm manages multiple exercises and sets
</verification>

<success_criteria>
Form with exercise selector, set inputs (reps/weight/RPE), and add/set buttons renders.
User can build a workout with multiple exercises and sets.
Notes field available.
</success_criteria>

<output>
After completion, create `.planning/phases/03-workout-logging/03-workout-logging-01-SUMMARY.md`
</output>