'use client';

import { ChevronLeft, ChevronRight, Flame, Dumbbell, Moon } from 'lucide-react';
import { getDayName, localDateStr } from '@/utils/programTracker';
import type { ProgramWeekInfo } from '@/utils/programTracker';

interface ProgramInfoShape {
 started: boolean;
 currentWeek: number;
 totalWeeks: number;
 weeks: ProgramWeekInfo[];
}

function computeStreak(weeks: ProgramWeekInfo[], today: string): number {
 let streak = 0;
 const allDays = weeks.flatMap(w => w.days).sort((a, b) => b.date.localeCompare(a.date));
 for (const day of allDays) {
  if (day.date > today) continue;
  if (day.isTrainingDay && day.isCompleted) {
   streak++;
  } else if (day.isTrainingDay && !day.isCompleted && day.date !== today) {
   break;
  }
 }
 return streak;
}

interface DayHeroProps {
 currentDate: string;
 weekInfo: ProgramWeekInfo;
 progInfo: ProgramInfoShape;
 onPrevDay: () => void;
 onNextDay: () => void;
 onGoToday: () => void;
}

export function DayHero({ currentDate, weekInfo, progInfo, onPrevDay, onNextDay, onGoToday }: DayHeroProps) {
 const date = new Date(currentDate + 'T12:00:00');
 const dayOfWeek = date.getDay();
 const isToday = currentDate === localDateStr(new Date());
 const dayName = getDayName(dayOfWeek, true);
 const dateFormatted = date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });

 // Find the current day info within the week
 const dayInfo = weekInfo.days.find(d => d.date === currentDate);
 const totalInWeek = weekInfo.days.filter(d => d.isTrainingDay).length;
 const completedInWeek = weekInfo.days.filter(d => d.isTrainingDay && d.isCompleted).length;
 const weekPct = totalInWeek > 0 ? Math.round((completedInWeek / totalInWeek) * 100) : 0;

 const streak = computeStreak(progInfo.weeks, currentDate);

 // Find next training day for preview
 const allDays = progInfo.weeks.flatMap(w => w.days).sort((a, b) => a.date.localeCompare(b.date));
 const todayIdx = allDays.findIndex(d => d.date === currentDate);
 const nextTraining = allDays.slice(todayIdx + 1).find(d => d.isTrainingDay && !d.isCompleted);
 const daysUntilNext = nextTraining
  ? Math.round((new Date(nextTraining.date + 'T12:00:00').getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
  : null;

 return (
  <div className="mb-6">
   {/* Day navigation */}
   <div className="flex items-center justify-between mb-3">
    <button onClick={onPrevDay} className="p-2 text-muted-foreground hover:text-white transition-colors">
     <ChevronLeft className="w-5 h-5" />
    </button>
    <div className="text-center flex-1">
     <h2 className="text-xl font-bold text-foreground tracking-wider">{dayName}</h2>
     <p className="text-sm text-muted-foreground">{dateFormatted}</p>
     {/* Training/rest status badge */}
     <div className="flex items-center justify-center gap-1.5 mt-1">
      {dayInfo?.isTrainingDay ? (
       <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
        dayInfo.isCompleted
         ? 'bg-green-900/30 text-green-400 border border-green-700/40'
         : 'bg-primary/15 text-primary border border-primary/30'
       }`}>
        <Dumbbell className="w-3 h-3" />
        {dayInfo.isCompleted ? 'Concluído' : dayInfo.exercisesCompleted > 0 ? 'Em andamento' : 'Treino'}
       </span>
      ) : (
       <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-surface text-muted-foreground border border-border">
        <Moon className="w-3 h-3" />
        Descanso
       </span>
      )}
     </div>
    </div>
    <button onClick={onNextDay} className="p-2 text-muted-foreground hover:text-white transition-colors">
     <ChevronRight className="w-5 h-5" />
    </button>
   </div>

   {!isToday && (
    <div className="text-center mb-3">
     <button onClick={onGoToday} className="text-xs text-primary hover:text-primary-dark underline">
      Voltar para hoje
     </button>
    </div>
   )}

   {/* Week progress + Streak */}
   <div className="flex items-center gap-4 mb-4">
    <div className="flex-1">
     <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
      <span>Semana {weekInfo.weekNumber} de {progInfo.totalWeeks}</span>
      <span>{weekPct}%</span>
     </div>
     <div className="h-1.5 bg-card rounded-full overflow-hidden">
      <div className="h-full bg-primary transition-all duration-500 rounded-full" style={{ width: `${weekPct}%` }} />
     </div>
    </div>
    <div className="flex items-center gap-1.5 shrink-0">
     <Flame className={`w-4 h-4 ${streak > 0 ? 'text-orange-500' : 'text-muted-foreground'}`} />
     <span className={`text-sm font-bold ${streak > 0 ? 'text-orange-500' : 'text-muted-foreground'}`}>{streak}</span>
    </div>
   </div>

   {/* Next training preview */}
   {nextTraining && !dayInfo?.isCompleted && (
    <div className="p-3 bg-surface border border-border rounded">
     <p className="text-xs text-muted-foreground">
      🎯 Próximo treino: <span className="text-muted-foreground font-medium">{getDayName(new Date(nextTraining.date + 'T12:00:00').getDay(), true)}</span>
      {daysUntilNext !== null && ` (${daysUntilNext === 1 ? 'amanhã' : daysUntilNext === 2 ? 'depois de amanhã' : `em ${daysUntilNext} dias`})`}
     </p>
    </div>
   )}
  </div>
 );
}
