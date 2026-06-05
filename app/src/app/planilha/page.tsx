'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Dumbbell, BarChart2, Save, AlertTriangle, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { loadPlanilha, savePlanilha, ensureSeed } from '@/utils/planilhaStorage';
import { syncPlanilhaDay, syncAllPlanilhaDays } from '@/utils/planilhaSync';
import { getProgramInfo, localDateStr } from '@/utils/programTracker';
import { ProgramStarter } from '@/components/ProgramStarter';
import { DayHero } from '@/components/DayHero';
import { WeekStrip } from '@/components/WeekStrip';
import { ExerciseLogger } from '@/components/ExerciseLogger';
import { WorkoutHistory } from '@/components/WorkoutHistory';
import type { PlanilhaData, ActualSet, PlannedSet } from '@/types/planilha';
import { getWorkoutsByUser } from '@/lib/storage';
import { useProgress } from '@/context/ProgressContext';

export default function PlanilhaUnificadaPage() {
  const { user, isLoading } = useAuth();
  const [data, setData] = useState<PlanilhaData | null>(null);
  const [saving] = useState(false);
  const [showStarter, setShowStarter] = useState(false);
  const [daySaving, setDaySaving] = useState(false);
  const [dayNotes, setDayNotes] = useState('');
  const [progVersion, setProgVersion] = useState(0);
  const { progress, refresh: refreshProgress } = useProgress();
  const [showHistory, setShowHistory] = useState(false);

  // currentDate drives everything — default to today
  const todayStr = localDateStr(new Date());
  const [currentDate, setCurrentDate] = useState(todayStr);

  useEffect(() => {
    if (!user) return;
    const loaded = loadPlanilha(user.userId);
    setData(loaded ? loaded : ensureSeed(user.userId));
    if (loaded) syncAllPlanilhaDays(user.userId);
  }, [user]);

  // Deep-link from ?day=YYYY-MM-DD
  useEffect(() => {
    if (!user || typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const dayParam = params.get('day');
    if (dayParam) setCurrentDate(dayParam);
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
    if (!user) return;
    const planilha = loadPlanilha(user.userId);
    if (!planilha) return;
    const ex = planilha[weekIdx]?.days[dayIdx]?.exercises[exIdx];
    if (!ex) return;
    if (!ex.actual) {
      ex.actual = ex.planned.map((p): ActualSet => ({
        reps: p.reps,
        weight: p.weight || 0,
        rpe: undefined,
        date: new Date().toISOString(),
      }));
    }
    while (ex.actual.length <= setIdx) {
      ex.actual.push({ reps: undefined, weight: undefined, rpe: undefined, date: new Date().toISOString() });
    }
    (ex.actual[setIdx] as Record<string, unknown>)[field] = value === '' ? undefined : value;
    savePlanilha(user.userId, planilha);
    setData(planilha);
  };

  const progInfo = useMemo(() => user ? getProgramInfo(user.userId) : null, [user, data]);
  const progStarted = progInfo?.started ?? false;

  // Find which week currentDate belongs to
  const currentWeekIdx = useMemo(() => {
    if (!progInfo) return 0;
    return progInfo.weeks.findIndex(w => w.days.some(d => d.date === currentDate));
  }, [progInfo, currentDate]);
  const currentWeek = (progInfo?.weeks ?? [])[currentWeekIdx] ?? null;

  // Find planilha indices for currentDate
  const dayInfo = useMemo(() => {
    if (!data || !user || !currentWeek || !progress) return null;
    const date = new Date(currentDate + 'T12:00:00');
    const dayOfWeek = date.getDay();
    const dayProg = currentWeek.days.find(d => d.date === currentDate);
    if (!dayProg?.isTrainingDay) return null;

    const trainingDays = progress?.trainingDays || [1, 4, 6];
    const planilhaDayIdx = trainingDays.indexOf(dayOfWeek);
    if (planilhaDayIdx < 0 || planilhaDayIdx >= (data[currentWeekIdx]?.days || []).length) return null;

    const day = JSON.parse(JSON.stringify(data[currentWeekIdx].days[planilhaDayIdx])) as {
      name: string; focus: string; exercises: { name: string; planned: PlannedSet[]; actual?: ActualSet[] }[];
    };

    // Pre-fill actual arrays
    day.exercises.forEach((ex) => {
      const hasActualData = ex.actual?.some((a) => a.reps !== undefined || a.weight !== undefined);
      if (!hasActualData) {
        ex.actual = ex.planned.map((p) => ({
          reps: p.reps,
          weight: getLastWeight(ex.name) || p.weight || 0,
          rpe: undefined,
          date: new Date().toISOString(),
        }));
      }
    });

    return { weekIdx: currentWeekIdx, dayIdx: planilhaDayIdx, day, dayProg };
  }, [data, user, progress, currentDate, currentWeek, getLastWeight, currentWeekIdx]);

  // Derive notes from planilha data when day changes
  useEffect(() => {
    if (!dayInfo || !data) return;
    const source = data[dayInfo.weekIdx]?.days[dayInfo.dayIdx];
    if (source && 'notes' in source) {
      setDayNotes((source as { notes?: string }).notes || '');
    }
  }, [currentDate, data, dayInfo]);

  const handleSaveDay = useCallback(() => {
    if (!user || !dayInfo) return;
    setDaySaving(true);
    const { weekIdx, dayIdx } = dayInfo;

    const planilha = loadPlanilha(user.userId);
    if (!planilha) return;
    const day = planilha[weekIdx]?.days[dayIdx];
    if (!day) return;

    day.exercises.forEach((ex) => {
      if (!ex.actual || !ex.actual.some(a => a.reps !== undefined || a.weight !== undefined)) {
        ex.actual = ex.planned.map(p => ({
          reps: p.reps,
          weight: p.weight || 0,
          rpe: undefined,
          date: new Date().toISOString(),
        }));
      } else {
        ex.actual.forEach((a, i) => {
          if (a.reps === undefined && ex.planned[i]) {
            a.reps = ex.planned[i].reps;
          }
        });
      }
    });

    if (dayNotes) {
      day.notes = dayNotes;
    }

    savePlanilha(user.userId, planilha);
    setData(planilha);
    syncPlanilhaDay(user.userId, weekIdx, dayIdx);
    setProgVersion(v => v + 1);
    refreshProgress();
    toast.success('Treino salvo com sucesso!');
    setTimeout(() => setDaySaving(false), 800);
  }, [user, dayInfo, dayNotes, refreshProgress]);

  // Day navigation
  const navigateDay = useCallback((direction: -1 | 1) => {
    const date = new Date(currentDate + 'T12:00:00');
    date.setDate(date.getDate() + direction);
    setCurrentDate(localDateStr(date));
  }, [currentDate]);

  const goToToday = useCallback(() => {
    setCurrentDate(todayStr);
  }, [todayStr]);

  const handleDayClick = useCallback((date: string) => {
    setCurrentDate(date);
  }, []);

  if (isLoading) return null;

  if (!user) {
    return (
      <div className="min-h-screen bg-background text-white pb-24">
        <header className="border-b border-border sticky top-0 bg-background/95 backdrop-blur-sm z-50">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm">
              <ArrowRight className="w-4 h-4 rotate-180" /> Voltar
            </Link>
            <div className="flex items-center gap-2">
              <Dumbbell className="w-4 h-4 text-primary" />
              <span className="text-sm font-bold tracking-[0.15em] text-primary">PLANO DE TREINO</span>
            </div>
            <div className="w-16" />
          </div>
        </header>
        <main className="max-w-6xl mx-auto px-4 py-6">
          <div className="mb-6 p-5 rounded border border-secondary bg-surface text-center">
            <p className="mb-3 text-muted">Faça login para registrar e acompanhar seu progresso.</p>
            <Link href="/login" className="inline-flex items-center gap-2 px-5 py-2 bg-primary text-black rounded font-bold tracking-wider text-sm">
              Entrar
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-white pb-24">
      {showStarter && (
        <ProgramStarter
          userId={user.userId}
          onStart={() => { setShowStarter(false); }}
        />
      )}

      <header className="border-b border-border sticky top-0 bg-background/95 backdrop-blur-sm z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm">
            <ArrowRight className="w-4 h-4 rotate-180" /> Voltar
          </Link>
          <div className="flex items-center gap-2">
            <Dumbbell className="w-4 h-4 text-primary" />
            <span className="text-sm font-bold tracking-[0.15em] text-primary">PLANO DE TREINO</span>
          </div>
          <div className="flex items-center gap-2">
            {saving && <span className="text-xs text-primary">Salvo</span>}
            <Link href="/estatisticas" className="flex items-center gap-1 text-gray-400 hover:text-primary text-xs">
              <BarChart2 className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {data && (
          <div className="space-y-6">
            {/* Program Starter prompt */}
            {!progStarted && (
              <div className="p-5 rounded border border-primary/30 bg-primary/5 text-center">
                <p className="mb-3 text-sm text-gray-300">
                  Inicie o programa para acompanhar seu progresso semana a semana, receber alertas de treinos perdidos e dicas de leitura.
                </p>
                <button
                  type="button"
                  onClick={() => setShowStarter(true)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-black rounded-lg font-bold text-sm hover:bg-primary-dark transition-colors"
                >
                  Iniciar Programa
                </button>
              </div>
            )}

            {/* Alerts */}
            {progInfo?.alerts.filter(a => a.type !== 'program_not_started').map((alert, i) => {
              const classes = `flex items-start gap-3 p-3 rounded border text-sm ${
                alert.severity === 'error'
                  ? 'border-red-900/30 bg-red-900/10 text-red-400'
                  : alert.severity === 'warning'
                    ? 'border-yellow-900/30 bg-yellow-900/10 text-yellow-400'
                    : 'border-green-900/30 bg-green-900/10 text-green-400'
              }${alert.action ? ' cursor-pointer hover:opacity-80 transition-opacity' : ''}`;
              const inner = (
                <>
                  <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                  <span className="flex-1">{alert.message}</span>
                  {alert.action && <ChevronRight className="w-4 h-4 shrink-0 self-center" />}
                </>
              );
              return alert.action ? (
                <Link key={i} href={alert.action.href} className={classes}>
                  {inner}
                </Link>
              ) : (
                <div key={i} className={classes}>{inner}</div>
              );
            })}

            {/* Day Hero */}
            {progInfo && currentWeek && (
              <DayHero
                currentDate={currentDate}
                weekInfo={currentWeek}
                progInfo={progInfo}
                onPrevDay={() => navigateDay(-1)}
                onNextDay={() => navigateDay(1)}
                onGoToday={goToToday}
              />
            )}

            {/* Week Strip */}
            {progInfo && (
              <WeekStrip
                weeks={progInfo.weeks}
                currentDate={currentDate}
                onDayClick={handleDayClick}
              />
            )}

            {/* Training day exercises or rest message */}
            {dayInfo ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-gray-400 tracking-wider">
                    {dayInfo.day.name} — {dayInfo.day.focus}
                  </h3>
                </div>

                {dayInfo.day.exercises.map((ex, exIdx) => (
                  <ExerciseLogger
                    key={`${dayInfo.weekIdx}-${dayInfo.dayIdx}-${exIdx}`}
                    exerciseName={ex.name}
                    planned={ex.planned}
                    actual={ex.actual}
                    lastSavedWeight={getLastWeight(ex.name)}
                    onUpdateActual={(setIdx, field, value) =>
                      updateActual(dayInfo.weekIdx, dayInfo.dayIdx, exIdx, setIdx, field, value)
                    }
                  />
                ))}

                <textarea
                  value={dayNotes}
                  onChange={(e) => setDayNotes(e.target.value)}
                  placeholder="Notas do treino (opcional)..."
                  rows={2}
                  className="w-full bg-card border border-border rounded-lg py-2.5 px-3 text-white text-sm placeholder-gray-500 focus:border-primary focus:outline-none resize-none"
                />

                <button
                  type="button"
                  onClick={handleSaveDay}
                  disabled={daySaving}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-primary hover:bg-primary-dark text-black font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  <Save className="w-4 h-4" />
                  {daySaving ? '✓ Salvo!' : 'Salvar Treino do Dia'}
                </button>
              </div>
            ) : (
              progStarted && (
                <div className="text-center py-8">
                  <Dumbbell className="w-8 h-8 text-gray-600 mx-auto mb-3" />
                  <p className="text-sm text-gray-500">Dia de descanso</p>
                </div>
              )
            )}

            {/* History toggle */}
            {user && (
              <div className="border-t border-border pt-6">
                <button
                  type="button"
                  onClick={() => setShowHistory(!showHistory)}
                  className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary transition-colors"
                >
                  {showHistory ? '—' : '+'} Histórico de treinos
                </button>
                {showHistory && (
                  <div className="mt-4">
                    <WorkoutHistory key={progVersion} userId={user.userId} />
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}


