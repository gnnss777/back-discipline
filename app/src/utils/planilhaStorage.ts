import seed from '@/data/planilhaSeed';
import type { PlanilhaData } from '@/types/planilha';

const storageKey = (userId: string) => `planilha_user_${userId}`;

export function loadPlanilha(userId: string): PlanilhaData | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(storageKey(userId));
  if (!raw) return null;
  try { return JSON.parse(raw) as PlanilhaData; } catch {
    return null;
  }
}

export function savePlanilha(userId: string, data: PlanilhaData): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(storageKey(userId), JSON.stringify(data));
}

export function ensureSeed(userId: string): PlanilhaData {
  const existing = loadPlanilha(userId);
  if (existing) return existing;
  return seed as PlanilhaData;
}

export type { PlanilhaData, WeekSaved, DaySaved, ExerciseSaved } from '../types/planilha';
