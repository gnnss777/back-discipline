import { getUserProgress, getWorkoutsByUser, saveUserProgress } from '@/lib/storage';
import { loadPlanilha } from './planilhaStorage';

const DAY_NAMES = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const DAY_NAMES_FULL = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

export function getDayName(dayIndex: number, full = false): string {
  return full ? DAY_NAMES_FULL[dayIndex] : DAY_NAMES[dayIndex];
}

/** Return YYYY-MM-DD in local timezone */
export function localDateStr(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export interface ProgramWeekInfo {
  weekNumber: number;
  weekStart: string;
  weekEnd: string;
  days: ProgramDayInfo[];
  isCurrent: boolean;
}

export interface ProgramDayInfo {
  dayIndex: number;
  date: string;
  dayName: string;
  isTrainingDay: boolean;
  isPast: boolean;
  isToday: boolean;
  isCompleted: boolean;
  hasActualData: boolean;
  exercisesCompleted: number;
  totalExercises: number;
  volume: number;
}

export interface ProgramAlert {
  type: 'missed_training' | 'missed_reading' | 'program_not_started' | 'week_complete';
  message: string;
  severity: 'info' | 'warning' | 'error';
  action?: { label: string; href: string };
}

export function getProgramInfo(userId: string): {
  started: boolean;
  currentWeek: number;
  totalWeeks: number;
  alerts: ProgramAlert[];
  weeks: ProgramWeekInfo[];
} {
  const progress = getUserProgress(userId);
  const planilha = loadPlanilha(userId);
  const totalWeeks = planilha?.length || 6;
  const started = !!progress?.programStartedAt;

  if (!started || !progress) {
    return {
      started: false,
      currentWeek: 1,
      totalWeeks,
      alerts: [{ type: 'program_not_started', message: 'Clique em "Iniciar Programa" para começar.', severity: 'info' }],
      weeks: buildEmptyWeeks(totalWeeks),
    };
  }

  const trainingDays = progress.trainingDays;
  const startDate = new Date(progress.programStartedAt!);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const msPerDay = 24 * 60 * 60 * 1000;
  const daysSinceStart = Math.floor((today.getTime() - startDate.getTime()) / msPerDay);
  const currentWeek = Math.min(Math.floor(daysSinceStart / 7) + 1, totalWeeks);
  const workouts = getWorkoutsByUser(userId);

  // Build weeks info
  const weeks: ProgramWeekInfo[] = [];
  for (let w = 1; w <= totalWeeks; w++) {
    const weekStartDate = new Date(startDate);
    weekStartDate.setDate(startDate.getDate() + (w - 1) * 7);
    const weekEndDate = new Date(weekStartDate);
    weekEndDate.setDate(weekStartDate.getDate() + 6);

    const days: ProgramDayInfo[] = [];
    for (let d = 0; d < 7; d++) {
      const date = new Date(weekStartDate);
      date.setDate(weekStartDate.getDate() + d);
      const dateStr = localDateStr(date);
      const dayIdx = date.getDay();
      const isTrainingDay = trainingDays.includes(dayIdx);

      // For each day, compute completed/volume from planilha data
      const dayWorkouts = workouts.filter(w => w.date?.startsWith(dateStr));
      let exercisesCompleted = 0;
      let totalExercises = 0;
      let hasActualData = dayWorkouts.length > 0;
      const volume = dayWorkouts.reduce((sum, wo) =>
        sum + (wo.exercises || []).reduce((s, ex) =>
          s + (ex.sets || []).reduce((s2, set) => s2 + (set.reps || 0) * (set.weight || 0), 0), 0), 0);
      if (planilha && w <= planilha.length) {
        const planilhaWeek = planilha[w - 1];
        if (planilhaWeek) {
          const planilhaDayIdx = trainingDays.indexOf(dayIdx);
          if (planilhaDayIdx >= 0 && planilhaDayIdx < (planilhaWeek.days || []).length) {
            const day = planilhaWeek.days[planilhaDayIdx];
            totalExercises = (day.exercises || []).length;
            hasActualData = (day.exercises || []).some(ex => ex.actual?.some(a => a.reps !== undefined));
            exercisesCompleted = (day.exercises || [])
              .filter(ex => ex.actual?.some(a => a.reps !== undefined)).length;
          }
        }
      }

      days.push({
        dayIndex: dayIdx,
        date: dateStr,
        dayName: getDayName(dayIdx),
        isTrainingDay,
        isPast: date < today,
        isToday: date.getTime() === today.getTime(),
        isCompleted: hasActualData && isTrainingDay,
        hasActualData,
        exercisesCompleted,
        totalExercises,
        volume,
      });
    }

    weeks.push({
      weekNumber: w,
      weekStart: localDateStr(weekStartDate),
      weekEnd: localDateStr(weekEndDate),
      days,
      isCurrent: w === currentWeek,
    });
  }

  const workoutDates = new Set(workouts.map(w => w.date.split('T')[0]));
  const programStartStr = localDateStr(startDate);

  const alerts: ProgramAlert[] = [];

  // Check missed training days in current calendar week
  const currentWeekStart = new Date(today);
  const dayOfWeek = today.getDay();
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  currentWeekStart.setDate(today.getDate() + mondayOffset);

  const missedDays: string[] = [];
  for (let d = 0; d < 7; d++) {
    const date = new Date(currentWeekStart);
    date.setDate(currentWeekStart.getDate() + d);
    const dateStr = localDateStr(date);

    if (trainingDays.includes(date.getDay()) && date < today && dateStr >= programStartStr) {
      if (!workoutDates.has(dateStr)) {
        missedDays.push(dateStr);
      }
    }
  }

  if (missedDays.length > 0) {
    // Find which planilha week this missed day belongs to
    const targetWeekIdx = weeks.findIndex(w => w.days.some(d => d.date === missedDays[0]));
    const href = targetWeekIdx >= 0
      ? `/planilha?week=${targetWeekIdx}&day=${missedDays[0]}`
      : '/planilha';
    alerts.push({
      type: 'missed_training',
      message: `${missedDays.length} treino${missedDays.length > 1 ? 's' : ''} perdido${missedDays.length > 1 ? 's' : ''} n${missedDays.length > 1 ? 'est' : 'a'} semana.`,
      severity: 'warning',
      action: { label: 'Recuperar', href },
    });
  }

  // Check reading progress
  if (planilha && currentWeek <= planilha.length) {
    const week = planilha[currentWeek - 1];
    if (week) {
      const unreadChapters = (week.days || [])
        .flatMap(d => (d.exercises || []).map(e => e.chapterSlug))
        .filter((slug, i, arr) => slug && arr.indexOf(slug) === i)
        .filter(slug => !progress.chapters.find(c => c.slug === slug)?.completed);

      if (unreadChapters.length > 0) {
        alerts.push({
          type: 'missed_reading',
          message: `${unreadChapters.length} capítulo${unreadChapters.length > 1 ? 's' : ''} não lido${unreadChapters.length > 1 ? 's' : ''} para esta semana.`,
          severity: 'warning',
          action: { label: 'Ler', href: `/livro/${unreadChapters[0]}` },
        });
      }
    }
  }

  return { started, currentWeek, totalWeeks, alerts, weeks };
}

function buildEmptyWeeks(totalWeeks: number): ProgramWeekInfo[] {
  const weeks: ProgramWeekInfo[] = [];
  for (let w = 1; w <= totalWeeks; w++) {
    weeks.push({
      weekNumber: w,
      weekStart: '',
      weekEnd: '',
      days: [],
      isCurrent: w === 1,
    });
  }
  return weeks;
}

export function startProgram(userId: string, trainingDays: number[]): void {
  let progress = getUserProgress(userId);
  const now = new Date().toISOString();
  if (!progress) {
    progress = {
      userId,
      currentWeek: 1,
      currentDay: 1,
      chapters: [],
      workouts: [],
      startedAt: now,
      programStartedAt: now,
      trainingDays,
      missedDays: [],
      totalDaysTrained: 0,
      weeklyVolume: 0,
      monthlyVolume: 0,
      longestStreak: 0,
      lastWorkoutDate: null,
      totalVolume: 0,
    };
  } else {
    progress.programStartedAt = now;
    progress.trainingDays = trainingDays;
  }
  saveUserProgress(progress);
}
