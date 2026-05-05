export type PlannedSet = { sets: number; reps: number; weight?: number };

export type ActualSet = {
  reps?: number;
  weight?: number;
  rpe?: number;
  date?: string;
};

export type ExerciseSaved = {
  name: string;
  chapterSlug?: string;
  planned: PlannedSet[];
  actual?: ActualSet[];
};

export type DaySaved = {
  name: string;
  focus: string;
  exercises: ExerciseSaved[];
};

export type WeekSaved = {
  weekNumber: number;
  title: string;
  days: DaySaved[];
};

export type PlanilhaData = WeekSaved[];
