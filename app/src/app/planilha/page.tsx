'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Dumbbell, BarChart2, History, Check, AlertTriangle, Save } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { loadPlanilha, savePlanilha, ensureSeed } from '@/utils/planilhaStorage';
import { syncPlanilhaDay, syncAllPlanilhaDays } from '@/utils/planilhaSync';
import { getProgramInfo } from '@/utils/programTracker';
import type { ProgramAlert } from '@/utils/programTracker';
import { ProgramStarter } from '@/components/ProgramStarter';
import { WeekSchedule } from '@/components/WeekSchedule';
import { ExerciseLogger } from '@/components/ExerciseLogger';
import { WorkoutHistory } from '@/components/WorkoutHistory';
import type { PlanilhaData, ActualSet, PlannedSet, ExerciseSaved } from '@/types/planilha';
import { getWorkoutsByUser } from '@/lib/storage';

type Tab = 'semana' | 'historico';

export default function PlanilhaUnificadaPage() {
  const { user, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('semana');
  const [data, setData] = useState<PlanilhaData | null>(null);
  const [saving, setSaving] = useState(false);
  const [weekView, setWeekView] = useState(0);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [showStarter, setShowStarter] = useState(false);
  const [daySaving, setDaySaving] = useState(false);
  const [dayNotes, setDayNotes] = useState('');

  // Load saved notes when changing days
  useEffect(() => {
    if (!selectedDay || !data || !selectedDayInfo) return;
    const source = data[selectedDayInfo.weekIdx]?.days[selectedDayInfo.dayIdx];
    setDayNotes((source as any)?.notes || '');
  }, [selectedDay]);

  useEffect(() => {
    if (!user) return;
    const loaded = loadPlanilha(user.userId);
    if (loaded) {
      setData(loaded);
      syncAllPlanilhaDays(user.userId);
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

  const getLastWeight = useCallback((exerciseName: string): number | undefined => {
    if (!user) return undefined;
    const workouts = getWorkoutsByUser(user.userId);
    const sorted = [...workouts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    for (const w of sorted) {
      const ex = w.exercises.find(e => e.exerciseName === exerciseName);
      if (ex && ex.sets.length > 0) {
        const lastSet = [...ex.sets].reverse().find(s => s.weight > 0);
        if (lastSet) return lastSet.weight;
      }
    }
    return undefined;
  }, [user]);

  const updateActual = (weekIdx: number, dayIdx: number, exIdx: number, setIdx: number, field: string, value: number | string) => {
    if (!data) return;
    const newData = JSON.parse(JSON.stringify(data)) as PlanilhaData;
    const ex = newData[weekIdx].days[dayIdx].exercises[exIdx];
    if (!ex.actual) {
      ex.actual = data[weekIdx].days[dayIdx].exercises[exIdx].planned.map((): ActualSet => ({
        reps: undefined, weight: undefined, rpe: undefined, date: new Date().toISOString(),
      }));
    }
    while (ex.actual.length <= setIdx) {
      ex.actual.push({ reps: undefined, weight: undefined, rpe: undefined, date: undefined });
    }
    (ex.actual[setIdx] as Record<string, unknown>)[field] = value === '' ? undefined : value;
    if (!ex.actual[setIdx]?.date) {
      (ex.actual[setIdx] as Record<string, unknown>).date = new Date().toISOString();
    }
    persist(newData);
    if (user) syncPlanilhaDay(user.userId, weekIdx, dayIdx);
  };

  // Program tracking
  const progInfo = user ? getProgramInfo(user.userId) : null;
  const progStarted = progInfo?.started ?? false;

  // Determine which week index to show
  const currentWeekIdx = progInfo ? Math.min(progInfo.currentWeek - 1, (data?.length || 1) - 1) : 0;
  const displayWeekIdx = Math.min(weekView, (data?.length || 1) - 1);

  // Map selectedDay's weekday to planilha day index
  const getPlanilhaDayIndices = (dateStr: string): { weekIdx: number; dayIdx: number } | null => {
    if (!data || !user) return null;
    const date = new Date(dateStr);
    const dayOfWeek = date.getDay();
    const trainingDays = progInfo?.weeks[displayWeekIdx]?.days.find(d => d.date === dateStr)?.isTrainingDay;
    if (!trainingDays) return null;

    // Map training day order to planilha day order
    const prog = getUserProgressLocal(user.userId);
    const days = prog?.trainingDays || [1, 4, 6];
    const planilhaDayIdx = days.indexOf(dayOfWeek);
    if (planilhaDayIdx < 0 || planilhaDayIdx >= (data[displayWeekIdx]?.days.length || 0)) return null;

    return { weekIdx: displayWeekIdx, dayIdx: planilhaDayIdx };
  };

  const ifLogged = !!user;

  if (isLoading) return null;

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white pb-24">
        <header className="border-b border-[#2A2A2A] sticky top-0 bg-[#0A0A0A]/95 backdrop-blur-sm z-50">
          <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm">
              <ArrowRight className="w-4 h-4 rotate-180" /> Voltar
            </Link>
            <div className="flex items-center gap-2">
              <Dumbbell className="w-4 h-4 text-[#B8956A]" />
            <span className="text-sm font-bold tracking-[0.15em] text-[#B8956A]">PLANO DE TREINO</span>
          </div>
          <div className="w-16" />
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 py-6">
        <div className="mb-6 p-5 rounded border border-[#3A2E22] bg-[#0F0F0F] text-center">
            <p className="mb-3 text-[#999]">Faça login para registrar e acompanhar seu progresso.</p>
            <Link href="/login" className="inline-flex items-center gap-2 px-5 py-2 bg-[#B8956A] text-black rounded-sm font-bold tracking-wider text-sm">
              Entrar
            </Link>
          </div>
        </main>
      </div>
    );
  }

  // Build selected day info with pre-filled actual arrays
  const selectedDayInfo = data && selectedDay
    ? (() => {
        const date = new Date(selectedDay);
        const dayOfWeek = date.getDay();
        const days = progInfo?.weeks[displayWeekIdx]?.days.find(d => d.date === selectedDay);
        if (!days?.isTrainingDay) return null;

    const weekData = data[displayWeekIdx];
    if (!weekData) return null;

    const prog = getUserProgressLocal(user.userId);
    const trainingDays = prog?.trainingDays || [1, 4, 6];
    const planilhaDayIdx = trainingDays.indexOf(dayOfWeek);
    if (planilhaDayIdx < 0 || planilhaDayIdx >= (weekData.days || []).length) return null;

    const day = JSON.parse(JSON.stringify(weekData.days[planilhaDayIdx])) as { name: string; focus: string; exercises: { name: string; planned: PlannedSet[]; actual?: ActualSet[] }[] };

    // Pre-fill actual arrays with planned reps + last weight
    day.exercises.forEach((ex: { planned: PlannedSet[]; actual?: ActualSet[]; name: string }) => {
      const hasActualData = ex.actual?.some((a: ActualSet) => a.reps !== undefined || a.weight !== undefined);
      if (!hasActualData) {
        ex.actual = ex.planned.map((p: PlannedSet) => ({
          reps: p.reps,
          weight: getLastWeight(ex.name) || p.weight || 0,
          rpe: undefined,
          date: new Date().toISOString(),
        }));
      }
    });

    return {
      weekIdx: displayWeekIdx,
      dayIdx: planilhaDayIdx,
      day,
    };
      })()
    : null;

  // Auto-save notes when changing days
  const handleSelectDay = useCallback((date: string) => {
    if (selectedDay && selectedDayInfo && data && dayNotes) {
      const savedNotes = data[selectedDayInfo.weekIdx]?.days[selectedDayInfo.dayIdx]?.notes || '';
      if (dayNotes !== savedNotes) {
        const newData = JSON.parse(JSON.stringify(data));
        newData[selectedDayInfo.weekIdx].days[selectedDayInfo.dayIdx].notes = dayNotes;
        persist(newData);
      }
    }
    setSelectedDay(prev => prev === date ? null : date);
  }, [selectedDay, selectedDayInfo, data, dayNotes, persist]);

  const handleSaveDay = useCallback(() => {
    if (!user || !selectedDayInfo || !data) return;
    setDaySaving(true);
    const { weekIdx, dayIdx } = selectedDayInfo;

    if (dayNotes) {
      const newData = JSON.parse(JSON.stringify(data));
      newData[weekIdx].days[dayIdx].notes = dayNotes;
      persist(newData);
    }

    syncPlanilhaDay(user.userId, weekIdx, dayIdx);
    toast.success('Treino salvo com sucesso!');
    setTimeout(() => {
      setDaySaving(false);
      setSelectedDay(null);
    }, 1200);
  }, [user, selectedDayInfo, data, dayNotes, persist]);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white pb-24">
      {showStarter && (
        <ProgramStarter
          userId={user.userId}
          onStart={() => { setShowStarter(false); }}
        />
      )}

      <header className="border-b border-[#2A2A2A] sticky top-0 bg-[#0A0A0A]/95 backdrop-blur-sm z-50">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm">
            <ArrowRight className="w-4 h-4 rotate-180" /> Voltar
          </Link>
          <div className="flex items-center gap-2">
            <Dumbbell className="w-4 h-4 text-[#B8956A]" />
            <span className="text-sm font-bold tracking-[0.15em] text-[#B8956A]">PLANO DE TREINO</span>
          </div>
          <div className="flex items-center gap-2">
            {saving && <span className="text-xs text-[#B8956A]">Salvo</span>}
            <Link href="/estatisticas" className="flex items-center gap-1 text-gray-400 hover:text-[#B8956A] text-xs">
              <BarChart2 className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Tab bar */}
        <div className="max-w-4xl mx-auto px-4 pb-3">
          <div className="flex bg-[#111] rounded-lg p-1">
            <button
              onClick={() => setActiveTab('semana')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'semana' ? 'bg-[#B8956A] text-black' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Dumbbell className="w-4 h-4" />
              Semana
            </button>
            <button
              onClick={() => setActiveTab('historico')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'historico' ? 'bg-[#B8956A] text-black' : 'text-gray-400 hover:text-white'
              }`}
            >
              <History className="w-4 h-4" />
              Histórico
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* TAB: SEMANA */}
        {activeTab === 'semana' && data && (
          <div className="space-y-6">
            {/* Program Starter prompt */}
            {!progStarted && (
              <div className="p-5 rounded border border-[#B8956A]/30 bg-[#B8956A]/5 text-center">
                <p className="mb-3 text-sm text-gray-300">
                  Inicie o programa para acompanhar seu progresso semana a semana, receber alertas de treinos perdidos e dicas de leitura.
                </p>
                <button
                  type="button"
                  onClick={() => setShowStarter(true)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#B8956A] text-black rounded-lg font-bold text-sm hover:bg-[#c9a67a] transition-colors"
                >
                  <Check className="w-4 h-4" />
                  Iniciar Programa
                </button>
              </div>
            )}

            {/* Alerts */}
            {progInfo?.alerts.filter(a => a.type !== 'program_not_started').map((alert, i) => (
              <div
                key={i}
                className={`flex items-start gap-3 p-3 rounded border text-sm ${
                  alert.severity === 'error'
                    ? 'border-red-900/30 bg-red-900/10 text-red-400'
                    : alert.severity === 'warning'
                      ? 'border-yellow-900/30 bg-yellow-900/10 text-yellow-400'
                      : 'border-green-900/30 bg-green-900/10 text-green-400'
                }`}
              >
                <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{alert.message}</span>
              </div>
            ))}

            {/* Week Schedule */}
            {progInfo && (
              <WeekSchedule
                week={progInfo.weeks[displayWeekIdx]}
                selectedDay={selectedDay}
                onSelectDay={handleSelectDay}
                onPrevWeek={() => setWeekView(Math.max(0, displayWeekIdx - 1))}
                onNextWeek={() => setWeekView(Math.min((data?.length || 1) - 1, displayWeekIdx + 1))}
              />
            )}

            {/* Day logging */}
            {selectedDayInfo && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold">
                    {selectedDayInfo.day.name} — {selectedDayInfo.day.focus}
                  </h3>
                </div>

                {selectedDayInfo.day.exercises.map((ex, exIdx) => (
                  <ExerciseLogger
                    key={`${selectedDayInfo.weekIdx}-${selectedDayInfo.dayIdx}-${exIdx}`}
                    exerciseName={ex.name}
                    planned={ex.planned}
                    actual={ex.actual}
                    lastSavedWeight={getLastWeight(ex.name)}
                    onUpdateActual={(setIdx, field, value) =>
                      updateActual(selectedDayInfo.weekIdx, selectedDayInfo.dayIdx, exIdx, setIdx, field, value)
                    }
                  />
                ))}

                <textarea
                  value={dayNotes}
                  onChange={(e) => setDayNotes(e.target.value)}
                  placeholder="Notas do treino (opcional)..."
                  rows={2}
                  className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg py-2.5 px-3 text-white text-sm placeholder-gray-500 focus:border-[#B8956A] focus:outline-none resize-none"
                />

                <button
                  type="button"
                  onClick={handleSaveDay}
                  disabled={daySaving}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-[#B8956A] hover:bg-[#c9a67a] text-black font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  <Save className="w-4 h-4" />
                  {daySaving ? '✓ Salvo!' : 'Salvar Treino do Dia'}
                </button>
              </div>
            )}

            {/* No day selected */}
            {!selectedDay && progStarted && (
              <div className="text-center py-8">
                <Dumbbell className="w-8 h-8 text-gray-600 mx-auto mb-3" />
                <p className="text-sm text-gray-500">Selecione um dia para registrar seu treino</p>
              </div>
            )}
          </div>
        )}

        {/* TAB: HISTÓRICO */}
        {activeTab === 'historico' && (
          <WorkoutHistory userId={user.userId} />
        )}
      </main>
    </div>
  );
}

// Helper to get UserProgress synchronously (used in render)
function getUserProgressLocal(userId: string) {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(`backdiscipline_progress_${userId}`);
  return raw ? JSON.parse(raw) : null;
}
