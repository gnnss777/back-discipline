import { createSupabaseClient } from '@/app/supabase/client';
import { loadPlanilha as loadLocal, savePlanilha as saveLocal } from '@/utils/planilhaStorage';
import type { PlanilhaData } from '@/types/planilha';

function cacheLocally(userId: string, data: PlanilhaData) {
  if (typeof window === 'undefined') return;
  try {
    saveLocal(userId, data);
  } catch {
    // non-critical
  }
}

function getCachedPlanilha(userId: string): PlanilhaData | null {
  if (typeof window === 'undefined') return null;
  try {
    return loadLocal(userId);
  } catch {
    return null;
  }
}

export async function getPlanilha(userId: string): Promise<PlanilhaData | null> {
  let cloudError = false;

  try {
    const supabase = createSupabaseClient();
    if (!supabase) return getCachedPlanilha(userId);

    const { data, error } = await supabase
      .from('planilha_data')
      .select('data')
      .eq('user_id', userId)
      .single();

    if (!error && data) {
      const planilha = data.data as PlanilhaData;
      cacheLocally(userId, planilha);
      return planilha;
    }

    if (error) cloudError = true;
  } catch {
    cloudError = true;
  }

  const local = getCachedPlanilha(userId);

  // If online but cloud has no data and local exists, migrate it
  if (!cloudError && local) {
    try {
      await savePlanilha(userId, local);
    } catch {
      // silent
    }
  }

  return local;
}

export async function savePlanilha(userId: string, data: PlanilhaData): Promise<{ success: boolean; error?: string }> {
  cacheLocally(userId, data);

  try {
    const supabase = createSupabaseClient();
    if (!supabase) return { success: true };

    const { error } = await supabase
      .from('planilha_data')
      .upsert(
        {
          user_id: userId,
          data,
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
