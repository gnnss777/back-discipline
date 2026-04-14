export interface WorkoutSet {
  reps: number;
  weight: number;
  rpe: number;
  notes?: string;
  completed: boolean;
}

export interface WorkoutExercise {
  exerciseId: string;
  exerciseName: string;
  sets: WorkoutSet[];
}

export interface Workout {
  id: string;
  date: string;
  exercises: WorkoutExercise[];
  notes?: string;
  duration?: number;
}

export interface ChapterProgress {
  chapterId: string;
  slug: string;
  completed: boolean;
  completedAt?: string;
}

export interface UserProgress {
  userId: string;
  currentWeek: number;
  currentDay: number;
  chapters: ChapterProgress[];
  workouts: Workout[];
  startedAt: string;
  totalDaysTrained: number;
  weeklyVolume: number;
  monthlyVolume: number;
  longestStreak: number;
  lastWorkoutDate: string | null;
  totalVolume: number;
}