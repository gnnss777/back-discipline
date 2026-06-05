import { createSupabaseClient } from '@/app/supabase/client';
import { getUserProgress as getLocalProgress, saveUserProgress as saveLocalProgress } from './storage';
import type { UserProgress } from '@/types';

function cacheLocally(userId: string, data: UserProgress) {
  if (typeof window === 'undefined') return;
  try {
    saveLocalProgress(data);
  } catch {
    // non-critical
  }
}

function getCachedProgress(userId: string): UserProgress | null {
  if (typeof window === 'undefined') return null;
  try {
    return getLocalProgress(userId);
  } catch {
    return null;
  }
}

export async function getProgress(userId: string): Promise<UserProgress | null> {
  let cloudError = false;

  try {
    const supabase = createSupabaseClient();
    if (!supabase) return getCachedProgress(userId);

    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (!error && data) {
      const progress: UserProgress = {
        userId: data.user_id,
        currentWeek: data.current_week,
        currentDay: data.current_day,
        chapters: [],
        workouts: [],
        startedAt: data.started_at,
        programStartedAt: data.program_started_at,
        trainingDays: data.training_days,
        missedDays: [],
        totalDaysTrained: data.total_days_trained,
        weeklyVolume: data.weekly_volume,
        monthlyVolume: data.monthly_volume,
        longestStreak: data.longest_streak,
        lastWorkoutDate: data.last_workout_date,
        totalVolume: data.total_volume,
      };

      // Merge local chapters/workouts since they're stored separately
      const local = getCachedProgress(userId);
      if (local) {
        progress.chapters = local.chapters || [];
        progress.workouts = local.workouts || [];
        progress.missedDays = local.missedDays || [];
      }

      cacheLocally(userId, progress);
      return progress;
    }

    if (error) cloudError = true;
  } catch {
    cloudError = true;
  }

  const local = getCachedProgress(userId);

  // If we are online but cloud returned no data and local has meaningful data, migrate it
  if (!cloudError && local?.programStartedAt) {
    try {
      await saveProgress(userId, local);
    } catch {
      // silent — will sync on next write
    }
  }

  return local;
}

export async function saveProgress(userId: string, progress: UserProgress): Promise<{ success: boolean; error?: string }> {
  cacheLocally(userId, progress);

  try {
    const supabase = createSupabaseClient();
    if (!supabase) return { success: true };

    const { error } = await supabase
      .from('user_progress')
      .upsert(
        {
          user_id: userId,
          program_started_at: progress.programStartedAt,
          training_days: progress.trainingDays,
          current_week: progress.currentWeek,
          current_day: progress.currentDay,
          total_days_trained: progress.totalDaysTrained,
          total_volume: progress.totalVolume,
          weekly_volume: progress.weeklyVolume,
          monthly_volume: progress.monthlyVolume,
          longest_streak: progress.longestStreak,
          last_workout_date: progress.lastWorkoutDate,
          started_at: progress.startedAt,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' }
      );

    if (error) return { success: false, error: error.message };

    return { success: true };
  } catch {
    return { success: true };
  }
}
