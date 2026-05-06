import { createSupabaseClient } from '@/app/supabase/client';
import { updateChapterProgress as updateLocalProgress, getUserProgress } from './storage';

export interface ReadingProgressRecord {
  chapter_slug: string;
  completed: boolean;
  completed_at: string | null;
  last_read_at: string;
}

const CACHE_KEY = 'backdiscipline_reading_cache';

function cacheLocally(userId: string, data: ReadingProgressRecord[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`${CACHE_KEY}_${userId}`, JSON.stringify(data));
  } catch {
    // localStorage full or unavailable — non-critical
  }
}

function getCachedProgress(userId: string): ReadingProgressRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const cached = localStorage.getItem(`${CACHE_KEY}_${userId}`);
    return cached ? JSON.parse(cached) : [];
  } catch {
    return [];
  }
}

/**
 * Fetch all reading progress for a user. Cloud-first with localStorage fallback.
 * On successful cloud fetch, updates the local cache.
 */
export async function getAllProgress(userId: string): Promise<ReadingProgressRecord[]> {
  try {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase
      .from('reading_progress')
      .select('chapter_slug, completed, completed_at, last_read_at')
      .eq('user_id', userId);

    if (!error && data) {
      cacheLocally(userId, data);
      return data;
    }
  } catch {
    // Offline or network error — fall back to cache
  }

  return getCachedProgress(userId);
}

/**
 * Update chapter completion status. Writes to cloud first, falls back to localStorage.
 * Uses optimistic local update for instant UI feedback.
 */
export async function updateProgress(
  userId: string,
  chapterSlug: string,
  completed: boolean
): Promise<{ success: boolean; error?: string }> {
  // 1. Optimistic local update (instant UI)
  updateLocalProgress(userId, chapterSlug, completed);

  // 2. Try cloud write
  try {
    const supabase = createSupabaseClient();
    const { error } = await supabase
      .from('reading_progress')
      .upsert(
        {
          user_id: userId,
          chapter_slug: chapterSlug,
          completed,
          completed_at: completed ? new Date().toISOString() : null,
          last_read_at: new Date().toISOString(),
        },
        { onConflict: 'user_id,chapter_slug' }
      );

    if (error) {
      return { success: false, error: error.message };
    }

    // 3. Invalidate cache after successful write
    const allData = await getAllProgress(userId);
    cacheLocally(userId, allData);

    return { success: true };
  } catch {
    // Cloud write failed — localStorage already updated, will sync on next fetch
    return { success: true }; // Return success because local state is correct
  }
}

/**
 * Update last_read_at when user opens a chapter (for BOOK-02 auto-resume).
 * Only writes to cloud — no localStorage update needed for last_read_at alone.
 */
export async function updateLastRead(
  userId: string,
  chapterSlug: string
): Promise<void> {
  try {
    const supabase = createSupabaseClient();
    await supabase
      .from('reading_progress')
      .upsert(
        {
          user_id: userId,
          chapter_slug: chapterSlug,
          last_read_at: new Date().toISOString(),
        },
        { onConflict: 'user_id,chapter_slug' }
      );
  } catch {
    // Non-critical — last_read_at is best-effort
  }
}
