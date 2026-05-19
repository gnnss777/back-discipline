"use client";

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, BookOpen, ChevronDown, ChevronUp, Dumbbell, X, Check, BarChart2, Sparkles } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { loadPlanilha, savePlanilha, ensureSeed } from '@/utils/planilhaStorage';
import type { PlanilhaData, ExerciseSaved, WeekSaved, DaySaved, PlannedSet, ActualSet } from '@/types/planilha';
import planilhaSeed from './planilhaSeed';

const RPE_VALUES = [6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10];

export default function PlanilhaProgressoPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [expandedWeek, setExpandedWeek] = useState<number | null>(null);
  const [expandedDay, setExpandedDay] = useState<string | null>(null);
  const [editingExercise, setEditingExercise] = useState<string | null>(null);
  const [data, setData] = useState<PlanilhaData | null>(null);
  const [saving, setSaving] = useState(false);

  const isLogged = !!user;

  useEffect(() => {
    if (!user) return;
    const loaded = loadPlanilha(user.userId);
    if (loaded) {
      setData(loaded);
    } else {
      setData(ensureSeed(user.userId));
    }
  }, [user]);

  const persist = useCallback((newData: PlanilhaData) => {
    if (!user) return;
    setData(newData);
    setSaving(true);
    savePlanilha(user.userId, newData);
    setTimeout(() => setSaving(false), 800);
  }, [user]);

  const updateActual = (weekIdx: number, dayIdx: number, exIdx: number, setIdx: number, field: string, value: number | string) => {
    if (!data) return;
    const newData = JSON.parse(JSON.stringify(data)) as PlanilhaData;
    const ex = newData[weekIdx].days[dayIdx].exercises[exIdx];
    if (!ex.actual) {
      ex.actual = data[weekIdx].days[dayIdx].exercises[exIdx].planned.map((): ActualSet => ({
        reps: undefined, weight: undefined, rpe: undefined, date: undefined,
      }));
    }
    while (ex.actual.length <= setIdx) {
      ex.actual.push({ reps: undefined, weight: undefined, rpe: undefined, date: undefined });
    }
    (ex.actual[setIdx] as Record<string, unknown>)[field] = value === '' ? undefined : value;
    persist(newData);
  };

  const exerciseKey = (w: number, d: number, e: number) => `${w}-${d}-${e}`;
  const dayKey = (w: number, d: number) => `${w}-${d}`;

  const getVolumeDelta = (ex: ExerciseSaved): { planned: number; actual: number; pct: number } => {
    const plannedVol = ex.planned.reduce((s: number, p: PlannedSet) => s + (p.sets * p.reps * (p.weight || 0)), 0);
    const actualVol = (ex.actual || []).reduce((s: number, a: ActualSet) => s + ((a.reps || 0) * (a.weight || 0)), 0);
    const pct = plannedVol > 0 ? Math.round((actualVol / plannedVol) * 100) : 0;
    return { planned: plannedVol, actual: actualVol, pct };
  };

  const openChapter = (slug?: string) => {
    if (!slug) return;
    router.push(`/livro/${slug}`);
  };

  const getSuggestionForExercise = (ex: ExerciseSaved): { weight: number; increment: number; completed: boolean } | null => {
    if (!data || !ex.actual || ex.actual.length === 0) return null;
    const lastSets = ex.actual.filter(s => s.weight !== undefined);
    if (lastSets.length === 0) return null;
    const lastWeight = lastSets[lastSets.length - 1].weight || 0;
    const allCompleted = ex.actual.every(s => s.reps !== undefined && s.reps > 0);
    const plannedWeight = ex.planned[0]?.weight || 0;
    if (allCompleted) {
      return { weight: Math.round((lastWeight + 2.5) * 10) / 10, increment: 2.5, completed: true };
    }
    return { weight: lastWeight, increment: 0, completed: false };
  };

  if (isLoading) return null;

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white pb-24">
      <header className="border-b border-[#2A2A2A] sticky top-0 bg-[#0A0A0A]/95 backdrop-blur-sm z-50">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm">
            <ArrowRight className="w-4 h-4 rotate-180" /> Voltar
          </Link>
          <div className="flex items-center gap-2">
            <Dumbbell className="w-4 h-4 text-[#B8956A]" />
            <span className="text-sm font-bold tracking-[0.15em] text-[#B8956A]">PLANILHA</span>
          </div>
          <div className="flex items-center gap-2">
            {saving && <span className="text-xs text-[#B8956A]">Salvo</span>}
            <Link href="/estatisticas" className="flex items-center gap-1 text-gray-400 hover:text-[#B8956A] text-xs">
              <BarChart2 className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {!isLogged && (
          <div className="mb-6 p-5 rounded border border-[#3A2E22] bg-[#0F0F0F] text-center">
            <p className="mb-3 text-[#999]">Faça login para registrar e acompanhar seu progresso.</p>
            <Link href="/login" className="inline-flex items-center gap-2 px-5 py-2 bg-[#B8956A] text-black rounded-sm font-bold tracking-wider text-sm">
              Entrar
            </Link>
          </div>
        )}

        {isLogged && data && (
          <section className="space-y-3">
            {data.map((w: WeekSaved, wIdx: number) => {
              const isWeekOpen = expandedWeek === w.weekNumber;
              const weekCompleted = w.days.every((d: DaySaved) =>
                d.exercises.every((ex: ExerciseSaved) => ex.actual && ex.actual.some((a: ActualSet) => a.reps !== undefined))
              );

              return (
                <div key={w.weekNumber} className={`border rounded-md overflow-hidden ${weekCompleted ? 'border-[#B8956A]/40' : 'border-[#2A2A2A]'}`}>
                  <button
                    className="w-full flex items-center justify-between p-3 bg-[#0A0A0A] border-b border-[#2A2A2A] text-left"
                    onClick={() => setExpandedWeek(isWeekOpen ? null : w.weekNumber)}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm ${weekCompleted ? 'bg-[#B8956A] text-black' : 'bg-[#1a1a1a] text-[#666]'}`}>
                        {w.weekNumber}
                      </span>
                      <div>
                        <strong className="text-sm tracking-wider">{w.title}</strong>
                        <span className="text-xs text-[#555] ml-2">{w.days.length} dias</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {weekCompleted && <Check className="w-4 h-4 text-[#B8956A]" />}
                      {isWeekOpen ? <ChevronUp className="w-4 h-4 text-[#666]" /> : <ChevronDown className="w-4 h-4 text-[#666]" />}
                    </div>
                  </button>

                  {isWeekOpen && (
                    <div className="bg-[#0F0F0F] p-3 space-y-2">
                      {w.days.map((d: DaySaved, dIdx: number) => {
                        const dk = dayKey(wIdx, dIdx);
                        const isDayOpen = expandedDay === dk;
                        const dayExercisesDone = d.exercises.filter((ex: ExerciseSaved) => ex.actual && ex.actual.some((a: ActualSet) => a.reps !== undefined)).length;

                        return (
                          <div key={dk} className="border border-[#2A2A2A] rounded overflow-hidden">
                            <button
                              className="w-full flex items-center justify-between p-3 bg-[#111] text-left"
                              onClick={() => setExpandedDay(isDayOpen ? null : dk)}
                            >
                              <div>
                                <span className="font-semibold text-sm">{d.name}</span>
                                <span className="text-xs text-[#555] ml-2">{d.focus}</span>
                              </div>
                              <div className="flex items-center gap-2 text-xs">
                                <span className={dayExercisesDone === d.exercises.length && d.exercises.length > 0 ? 'text-[#B8956A]' : 'text-[#444]'}>
                                  {dayExercisesDone}/{d.exercises.length}
                                </span>
                                {isDayOpen ? <ChevronUp className="w-3 h-3 text-[#666]" /> : <ChevronDown className="w-3 h-3 text-[#666]" />}
                              </div>
                            </button>

                            {isDayOpen && (
                              <div className="p-2 space-y-2 bg-[#0A0A0A]">
                                {d.exercises.map((ex: ExerciseSaved, exIdx: number) => {
                                  const ek = exerciseKey(wIdx, dIdx, exIdx);
                                  const isEditing = editingExercise === ek;
                                  const delta = getVolumeDelta(ex);
                                  const hasActual = ex.actual && ex.actual.some((a: ActualSet) => a.reps !== undefined);
                                  const isExComplete = ex.actual && ex.actual.every((a: ActualSet, i: number) => i < ex.planned.length && a.reps !== undefined);

                                  return (
                                    <div key={ek} className={`border rounded p-2 ${isExComplete ? 'border-[#B8956A]/30 bg-[#B8956A]/5' : 'border-[#2A2A2A] bg-[#111]'}`}>
                                      <div className="flex items-center justify-between gap-2 mb-2">
                                        <div className="flex-1 min-w-0">
                                          <span className="text-sm font-medium block truncate">{ex.name}</span>
                                          <span className="text-xs text-[#555]">
                                            Planejado: {ex.planned.map((p: PlannedSet) => `${p.sets}x${p.reps}${p.weight ? ` @${p.weight}kg` : ''}`).join(' | ')}
                                          </span>
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                          {hasActual && (
                                            <span className={`text-xs font-bold ${delta.pct >= 100 ? 'text-green-400' : delta.pct >= 70 ? 'text-yellow-400' : 'text-red-400'}`}>
                                              {delta.pct}%
                                            </span>
                                          )}
                                          <button
                                            className="p-1.5 text-xs bg-[#1a1a1a] rounded hover:bg-[#2a2a2a]"
                                            onClick={() => openChapter(ex.chapterSlug)}
                                            title="Ver no livro"
                                          >
                                            <BookOpen className="w-3.5 h-3.5" />
                                          </button>
                                          <button
                                            className={`p-1.5 text-xs rounded ${isEditing ? 'bg-[#B8956A] text-black' : 'bg-[#1a1a1a] hover:bg-[#2a2a2a]'}`}
                                            onClick={() => setEditingExercise(isEditing ? null : ek)}
                                          >
                                            {isEditing ? <X className="w-3.5 h-3.5" /> : <Dumbbell className="w-3.5 h-3.5" />}
                                          </button>
                                        </div>
                                      </div>

                                      {isEditing && (
                                        <div className="mt-2 space-y-2 border-t border-[#2A2A2A] pt-2">
                                          {ex.planned.map((p: PlannedSet, sIdx: number) => {
                                            const actual = ex.actual?.[sIdx];
                                            return (
                                              <div key={sIdx} className="bg-[#0F0F0F] border border-[#2A2A2A] rounded p-2">
                                                <div className="flex items-center justify-between mb-2">
                                                  <span className="text-[#B8956A] text-xs font-bold">Série {sIdx + 1}</span>
                                                  <span className="text-[#444] text-xs">Meta: {p.sets}x{p.reps}{p.weight ? ` @${p.weight}kg` : ''}</span>
                                                </div>
                                                <div className="grid grid-cols-3 gap-2">
                                                  <div>
                                                    <label className="block text-[#555] text-[10px] mb-0.5">Reps</label>
                                                    <input
                                                      type="number"
                                                      min={0}
                                                      max={50}
                                                      value={actual?.reps ?? ''}
                                                      onChange={(e) => updateActual(wIdx, dIdx, exIdx, sIdx, 'reps', parseInt(e.target.value) || 0)}
                                                      className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded py-1.5 px-2 text-white text-center text-sm focus:border-[#B8956A] focus:outline-none"
                                                      placeholder={String(p.reps)}
                                                    />
                                                  </div>
                                                  <div>
                                                    <label className="block text-[#555] text-[10px] mb-0.5">Peso (kg)</label>
                                                    <input
                                                      type="number"
                                                      min={0}
                                                      max={500}
                                                      step={0.5}
                                                      value={actual?.weight ?? ''}
                                                      onChange={(e) => updateActual(wIdx, dIdx, exIdx, sIdx, 'weight', parseFloat(e.target.value) || 0)}
                                                      className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded py-1.5 px-2 text-white text-center text-sm focus:border-[#B8956A] focus:outline-none"
                                                      placeholder={p.weight ? String(p.weight) : '0'}
                                                    />
                                                  </div>
                                                  <div>
                                                    <label className="block text-[#555] text-[10px] mb-0.5">RPE</label>
                                                    <select
                                                      value={actual?.rpe ?? ''}
                                                      onChange={(e) => updateActual(wIdx, dIdx, exIdx, sIdx, 'rpe', parseFloat(e.target.value) || 0)}
                                                      className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded py-1.5 px-2 text-white text-center text-sm focus:border-[#B8956A] focus:outline-none"
                                                    >
                                                      <option value="">-</option>
                                                      {RPE_VALUES.map((r: number) => <option key={r} value={r}>{r}</option>)}
                                                    </select>
                                                  </div>
                                                </div>
                                              </div>
                                            );
                                          })}
                                          <div className="mt-2 pt-2 border-t border-[#2A2A2A]">
                                            {(() => {
                                                const sugg = getSuggestionForExercise(ex);
                                                if (!sugg) return null;
                                                return (
                                                  <div className={`text-[10px] p-1.5 rounded flex items-center justify-between ${sugg.completed ? 'bg-green-900/20 text-green-400' : 'bg-[#222] text-[#555]'}`}>
                                                    <span className="flex items-center gap-1">
                                                      <Sparkles className="w-3 h-3" />
                                                      Próximo treino: <span className="font-bold">{sugg.weight}kg</span>
                                                    </span>
                                                    {sugg.completed && <span className="text-green-500">+{sugg.increment}kg</span>}
                                                  </div>
                                                );
                                              })()}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </section>
        )}
      </main>

    </div>
  );
}
