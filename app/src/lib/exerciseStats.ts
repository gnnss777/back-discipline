import type { PlanilhaData, ExerciseSaved, PlannedSet, ActualSet } from '@/types/planilha';

export interface ExerciseStats {
  exerciseName: string;
  personalRecord: number;
  totalVolume: number;
  bestSet: { weight: number; reps: number };
  totalWorkouts: number;
  lastPerformed: string | null;
  averageWeight: number;
  averageReps: number;
}

export interface AllExercisesStats {
  exercises: ExerciseStats[];
  totalPRs: number;
  totalVolume: number;
}

export function calculateExerciseStats(planilha: PlanilhaData, exerciseName: string): ExerciseStats {
  let personalRecord = 0;
  let totalVolume = 0;
  let bestSet = { weight: 0, reps: 0 };
  let workoutCount = 0;
  let lastPerformed: string | null = null;
  let totalWeight = 0;
  let totalReps = 0;
  let validSets = 0;

  planilha.forEach((week) => {
    week.days.forEach((day) => {
      const dayHasExercise = day.exercises.some((ex) => ex.name === exerciseName && ex.actual);
      
      if (dayHasExercise) {
        workoutCount++;
      }

      day.exercises.forEach((exercise) => {
        if (exercise.name !== exerciseName || !exercise.actual) return;

        exercise.actual.forEach((set) => {
          if (set.weight !== undefined && set.reps !== undefined && set.weight > 0 && set.reps > 0) {
            const setVolume = set.weight * set.reps;
            totalVolume += setVolume;

            if (set.weight > personalRecord) {
              personalRecord = set.weight;
            }

            const combo = set.weight * set.reps;
            const bestCombo = bestSet.weight * bestSet.reps;
            if (combo > bestCombo) {
              bestSet = { weight: set.weight, reps: set.reps };
            }

            if (set.date && (!lastPerformed || set.date > lastPerformed)) {
              lastPerformed = set.date;
            }

            totalWeight += set.weight;
            totalReps += set.reps;
            validSets++;
          }
        });
      });
    });
  });

  return {
    exerciseName,
    personalRecord: personalRecord > 0 ? personalRecord : 0,
    totalVolume: Math.round(totalVolume),
    bestSet,
    totalWorkouts: workoutCount,
    lastPerformed,
    averageWeight: validSets > 0 ? Math.round((totalWeight / validSets) * 10) / 10 : 0,
    averageReps: validSets > 0 ? Math.round(totalReps / validSets * 10) / 10 : 0,
  };
}

export function calculateAllStats(planilha: PlanilhaData): AllExercisesStats {
  const exerciseNames = new Set<string>();
  
  planilha.forEach((week) => {
    week.days.forEach((day) => {
      day.exercises.forEach((exercise) => {
        if (exercise.actual && exercise.actual.some((s) => s.weight !== undefined)) {
          exerciseNames.add(exercise.name);
        }
      });
    });
  });

  const exercises: ExerciseStats[] = [];
  
  exerciseNames.forEach((name) => {
    const stats = calculateExerciseStats(planilha, name);
    if (stats.totalWorkouts > 0) {
      exercises.push(stats);
    }
  });

  exercises.sort((a, b) => b.personalRecord - a.personalRecord);

  const totalPRs = exercises.filter((ex) => ex.personalRecord > 0).length;
  const totalVolume = exercises.reduce((sum, ex) => sum + ex.totalVolume, 0);

  return {
    exercises,
    totalPRs,
    totalVolume,
  };
}

export function getExercisePR(planilha: PlanilhaData, exerciseName: string): number {
  const stats = calculateExerciseStats(planilha, exerciseName);
  return stats.personalRecord;
}

export function getAllPRs(planilha: PlanilhaData): Map<string, number> {
  const prMap = new Map<string, number>();
  
  planilha.forEach((week) => {
    week.days.forEach((day) => {
      day.exercises.forEach((exercise) => {
        if (!prMap.has(exercise.name)) {
          const stats = calculateExerciseStats(planilha, exercise.name);
          if (stats.personalRecord > 0) {
            prMap.set(exercise.name, stats.personalRecord);
          }
        }
      });
    });
  });

  return prMap;
}

export function getTopPRs(planilha: PlanilhaData, limit: number = 5): ExerciseStats[] {
  const allStats = calculateAllStats(planilha);
  return allStats.exercises
    .filter((ex) => ex.personalRecord > 0)
    .sort((a, b) => b.personalRecord - a.personalRecord)
    .slice(0, limit);
}

export function formatVolume(volume: number): string {
  if (volume >= 1000000) {
    return `${(volume / 1000000).toFixed(1)}M`;
  }
  if (volume >= 1000) {
    return `${(volume / 1000).toFixed(1)}K`;
  }
  return volume.toString();
}