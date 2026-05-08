import type { PlanilhaData, ExerciseSaved, ActualSet } from '@/types/planilha';

export interface ExerciseHistoryEntry {
  exerciseName: string;
  weight: number;
  reps: number;
  sets: number;
  date: string;
}

export interface ProgressSuggestion {
  exerciseName: string;
  suggestedWeight: number;
  previousWeight: number;
  increment: number;
  completedAllSets: boolean;
}

export function didCompleteAllSets(actual: ActualSet[] | undefined): boolean {
  if (!actual || actual.length === 0) return false;
  return actual.every((set) => set.reps !== undefined && set.reps > 0);
}

export function getExerciseHistory(planilha: PlanilhaData): Map<string, ExerciseHistoryEntry[]> {
  const historyMap = new Map<string, ExerciseHistoryEntry[]>();

  planilha.forEach((week) => {
    week.days.forEach((day) => {
      day.exercises.forEach((exercise) => {
        if (!exercise.actual) return;

        const entries: ExerciseHistoryEntry[] = exercise.actual
          .filter((set) => set.weight !== undefined && set.reps !== undefined)
          .map((set) => ({
            exerciseName: exercise.name,
            weight: set.weight!,
            reps: set.reps!,
            sets: exercise.planned.length,
            date: set.date || new Date().toISOString(),
          }));

        const existing = historyMap.get(exercise.name) || [];
        historyMap.set(exercise.name, [...existing, ...entries]);
      });
    });
  });

  return historyMap;
}

export function getRecentHistory(
  historyMap: Map<string, ExerciseHistoryEntry[]>,
  exerciseName: string,
  count: number = 3
): ExerciseHistoryEntry[] {
  const history = historyMap.get(exerciseName) || [];
  return history.slice(-count);
}

export function calculateSuggestedWeight(
  planilha: PlanilhaData,
  exerciseName: string,
  incrementKg: number = 2.5
): ProgressSuggestion | null {
  const historyMap = getExerciseHistory(planilha);
  const recentHistory = getRecentHistory(historyMap, exerciseName, 3);

  if (recentHistory.length === 0) {
    return null;
  }

  const lastEntry = recentHistory[recentHistory.length - 1];
  const previousWeight = lastEntry.weight;

  const completedAllSets = recentHistory.every((entry) => entry.sets > 0 && entry.reps > 0);

  const suggestedWeight = completedAllSets
    ? Math.round((previousWeight + incrementKg) * 10) / 10
    : previousWeight;

  return {
    exerciseName,
    suggestedWeight,
    previousWeight,
    increment: suggestedWeight - previousWeight,
    completedAllSets,
  };
}

export function getExerciseProgression(
  planilha: PlanilhaData,
  exerciseName: string
): { trend: 'improving' | 'declining' | 'stable'; percentage: number } | null {
  const historyMap = getExerciseHistory(planilha);
  const recentHistory = getRecentHistory(historyMap, exerciseName, 6);

  if (recentHistory.length < 2) {
    return null;
  }

  const firstHalf = recentHistory.slice(0, Math.floor(recentHistory.length / 2));
  const secondHalf = recentHistory.slice(Math.floor(recentHistory.length / 2));

  const firstAvg = firstHalf.reduce((sum, e) => sum + e.weight, 0) / firstHalf.length;
  const secondAvg = secondHalf.reduce((sum, e) => sum + e.weight, 0) / secondHalf.length;

  const percentage = ((secondAvg - firstAvg) / firstAvg) * 100;

  let trend: 'improving' | 'declining' | 'stable';
  if (percentage > 2.5) {
    trend = 'improving';
  } else if (percentage < -2.5) {
    trend = 'declining';
  } else {
    trend = 'stable';
  }

  return { trend, percentage: Math.round(percentage * 10) / 10 };
}