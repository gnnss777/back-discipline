import { createSupabaseClient } from '@/app/supabase/client';
import type { Workout } from '@/types';

interface WorkoutRow {
  workout_id: string;
  date: string;
  exercises: Workout['exercises'];
  notes: string | null;
  duration: number | null;
}

const CACHE_KEY = 'backdiscipline_workouts_cache';

function cacheLocally(userId: string, workouts: Workout[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`${CACHE_KEY}_${userId}`, JSON.stringify(workouts));
  } catch {
    // non-critical
  }
}

function getCachedWorkouts(userId: string): Workout[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(`${CACHE_KEY}_${userId}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function getWorkouts(userId: string): Promise<Workout[]> {
  try {
    const supabase = createSupabaseClient();
    if (!supabase) return getCachedWorkouts(userId);

    const { data, error } = await supabase
      .from('workouts')
      .select('*')
      .eq('user_id', userId);

    if (!error && data) {
      const workouts: Workout[] = (data as unknown as WorkoutRow[]).map(row => ({
        id: row.workout_id,
        date: row.date,
        exercises: row.exercises,
        notes: row.notes || undefined,
        duration: row.duration || undefined,
      }));
      cacheLocally(userId, workouts);
      return workouts;
    }
  } catch {
    // offline
  }

  return getCachedWorkouts(userId);
}

export async function getWorkoutsByUser(userId: string): Promise<Workout[]> {
  const all = await getWorkouts(userId);
  return all.filter(w => w.id.startsWith(userId));
}

export async function upsertWorkout(userId: string, workout: Workout): Promise<{ success: boolean; error?: string }> {
  // Update local cache immediately
  const cached = getCachedWorkouts(userId);
  const idx = cached.findIndex(w => w.id === workout.id);
  if (idx >= 0) {
    cached[idx] = workout;
  } else {
    cached.push(workout);
  }
  cacheLocally(userId, cached);

  // Also write to legacy storage for backward compatibility
  try {
    const { upsertWorkout: legacyUpsert } = await import('./storage');
    legacyUpsert(workout);
  } catch {
    // ignore
  }

  try {
    const supabase = createSupabaseClient();
    if (!supabase) return { success: true };

    const { error } = await supabase
      .from('workouts')
      .upsert(
        {
          user_id: userId,
          workout_id: workout.id,
          date: workout.date,
          exercises: workout.exercises as unknown as Record<string, unknown>[],
          notes: workout.notes || null,
          duration: workout.duration || null,
        },
        { onConflict: 'user_id,workout_id' }
      );

    if (error) return { success: false, error: error.message };

    return { success: true };
  } catch {
    return { success: true };
  }
}

export async function upsertWorkouts(userId: string, workouts: Workout[]): Promise<void> {
  for (const workout of workouts) {
    await upsertWorkout(userId, workout);
  }
}
