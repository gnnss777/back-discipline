import { loadPlanilha } from './planilhaStorage';
import { upsertWorkout } from '@/lib/storage';
import { exercises } from '@/data/exercises';
import type { PlanilhaData, ExerciseSaved, ActualSet } from '@/types/planilha';
import type { Workout, WorkoutExercise, WorkoutSet } from '@/types';

const exerciseNameToId = new Map<string, string>(
  exercises.map(ex => [ex.name.toLowerCase(), ex.id])
);

const DAY_NOTES: Record<string, string> = {
  'Back Attack': 'Back Attack - Mountain Dog',
  'Dorsal Dominance': 'Dorsal Dominance - Mountain Dog',
  'Pump & Stretch': 'Pump & Stretch - Mountain Dog',
  'Width & Thickness': 'Width & Thickness - Mountain Dog',
  'Strength Focus': 'Strength Focus - Mountain Dog',
};

function getExerciseId(name: string): string {
  return exerciseNameToId.get(name.toLowerCase())
    || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function dayHasActualData(day: PlanilhaData[number]['days'][number]): boolean {
  return day.exercises.some(ex => ex.actual?.some(a => a.reps !== undefined));
}

function buildWorkoutForDay(
  userId: string,
  weekIdx: number,
  dayIdx: number,
  week: PlanilhaData[number],
  day: PlanilhaData[number]['days'][number]
): Workout | null {
  if (!dayHasActualData(day)) return null;

  const firstDate = day.exercises
    .flatMap(e => e.actual || [])
    .find(a => a.date)?.date;

  const exercises: WorkoutExercise[] = day.exercises
    .filter(ex => ex.actual?.some(a => a.reps !== undefined))
    .map(ex => ({
      exerciseId: getExerciseId(ex.name),
      exerciseName: ex.name,
      sets: ex.actual!.filter(a => a.reps !== undefined).map(a => ({
        reps: a.reps || 0,
        weight: a.weight || 0,
        rpe: a.rpe || 0,
        completed: true,
      })),
    }));

  if (exercises.length === 0) return null;

  return {
    id: `${userId}_planilha_w${weekIdx}_d${dayIdx}`,
    date: firstDate || new Date().toISOString(),
    exercises,
    notes: DAY_NOTES[day.name] || `Semana ${weekIdx + 1} - ${day.name}`,
  };
}

export function syncPlanilhaDay(userId: string, weekIdx: number, dayIdx: number): void {
  const planilha = loadPlanilha(userId);
  if (!planilha) return;
  const week = planilha[weekIdx];
  if (!week) return;
  const day = week.days[dayIdx];
  if (!day) return;

  const workout = buildWorkoutForDay(userId, weekIdx, dayIdx, week, day);
  if (workout) upsertWorkout(workout);
}

export function syncAllPlanilhaDays(userId: string): void {
  const planilha = loadPlanilha(userId);
  if (!planilha) return;

  planilha.forEach((week, weekIdx) => {
    week.days.forEach((_, dayIdx) => {
      syncPlanilhaDay(userId, weekIdx, dayIdx);
    });
  });
}
