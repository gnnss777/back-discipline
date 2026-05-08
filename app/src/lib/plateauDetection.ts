import type { PlanilhaData } from '@/types/planilha';
import { getExerciseHistory } from './progression';

export interface WeeklyData {
  weekNumber: number;
  avgWeight: number;
  totalVolume: number;
  workoutCount: number;
}

export interface PlateauResult {
  exerciseName: string;
  isPlateau: boolean;
  difference: number;
  currentAvg: number;
  previousAvg: number;
  weeksAtPlateau: number;
  suggestion: string;
}

export function getWeeklyData(planilha: PlanilhaData): Map<number, WeeklyData> {
  const weeklyMap = new Map<number, WeeklyData>();

  planilha.forEach((week) => {
    let totalWeight = 0;
    let totalVolume = 0;
    let workoutCount = 0;

    week.days.forEach((day) => {
      const hasWorkout = day.exercises.some(
        (ex) => ex.actual && ex.actual.some((set) => set.weight !== undefined)
      );
      if (hasWorkout) {
        workoutCount++;
      }

      day.exercises.forEach((exercise) => {
        if (exercise.actual) {
          exercise.actual.forEach((set) => {
            if (set.weight !== undefined && set.reps !== undefined) {
              totalWeight += set.weight;
              totalVolume += set.weight * set.reps;
            }
          });
        }
      });
    });

    const daysWithWorkouts = week.days.filter((d) =>
      d.exercises.some((ex) => ex.actual && ex.actual.some((s) => s.weight !== undefined))
    ).length;

    weeklyMap.set(week.weekNumber, {
      weekNumber: week.weekNumber,
      avgWeight: workoutCount > 0 ? totalWeight / workoutCount : 0,
      totalVolume,
      workoutCount: daysWithWorkouts,
    });
  });

  return weeklyMap;
}

export function detectPlateau(
  planilha: PlanilhaData,
  exerciseName: string,
  thresholdKg: number = 2.5
): PlateauResult | null {
  const historyMap = getExerciseHistory(planilha);
  const exerciseHistory = historyMap.get(exerciseName);

  if (!exerciseHistory || exerciseHistory.length < 6) {
    return null;
  }

  const last3Weeks = exerciseHistory.slice(-6);
  const firstHalf = last3Weeks.slice(0, 3);
  const secondHalf = last3Weeks.slice(3);

  if (firstHalf.length === 0 || secondHalf.length === 0) {
    return null;
  }

  const firstAvg = firstHalf.reduce((sum, e) => sum + e.weight, 0) / firstHalf.length;
  const secondAvg = secondHalf.reduce((sum, e) => sum + e.weight, 0) / secondHalf.length;

  const difference = secondAvg - firstAvg;
  const isPlateau = Math.abs(difference) < thresholdKg;

  const suggestion = getSuggestion(difference, isPlateau);

  return {
    exerciseName,
    isPlateau,
    difference: Math.round(difference * 10) / 10,
    currentAvg: Math.round(secondAvg * 10) / 10,
    previousAvg: Math.round(firstAvg * 10) / 10,
    weeksAtPlateau: isPlateau ? 3 : 0,
    suggestion,
  };
}

function getSuggestion(difference: number, isPlateau: boolean): string {
  if (!isPlateau) {
    if (difference > 0) {
      return 'Continue assim! Você está progredindo bem.';
    } else {
      return 'Considere reduzir carga e focar na técnica.';
    }
  }

  const suggestions = [
    'Aumente as repetições em 1-2 por série.',
    'Troque o exercício por uma variação similar.',
    'Descanse mais entre as séries (2-3 min).',
    'Varie o tipo de treino (força vs hipertrofia).',
    'Faça uma semana de deload (reduza 50% da carga).',
  ];

  const randomIndex = Math.floor(Math.random() * suggestions.length);
  return suggestions[randomIndex];
}

export function detectAllPlateaus(
  planilha: PlanilhaData,
  thresholdKg: number = 2.5
): PlateauResult[] {
  const historyMap = getExerciseHistory(planilha);
  const results: PlateauResult[] = [];

  historyMap.forEach((history, exerciseName) => {
    if (history.length >= 6) {
      const result = detectPlateau(planilha, exerciseName, thresholdKg);
      if (result && result.isPlateau) {
        results.push(result);
      }
    }
  });

  return results;
}

export function getOverallPlateauStatus(
  planilha: PlanilhaData
): { hasAnyPlateau: boolean; plateauExercises: number; totalTracked: number } {
  const historyMap = getExerciseHistory(planilha);
  let plateauCount = 0;
  let trackedCount = 0;

  historyMap.forEach((history, exerciseName) => {
    if (history.length >= 6) {
      trackedCount++;
      const result = detectPlateau(planilha, exerciseName);
      if (result && result.isPlateau) {
        plateauCount++;
      }
    }
  });

  return {
    hasAnyPlateau: plateauCount > 0,
    plateauExercises: plateauCount,
    totalTracked: trackedCount,
  };
}