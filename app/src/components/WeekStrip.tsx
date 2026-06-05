'use client';

import { Check, AlertCircle, Dumbbell, Moon, BedDouble } from 'lucide-react';
import { getDayName } from '@/utils/programTracker';
import type { ProgramWeekInfo } from '@/utils/programTracker';

interface WeekStripProps {
 weeks: ProgramWeekInfo[];
 currentDate: string;
 onDayClick: (date: string) => void;
}

function TrainingIcon({ isCompleted, isMissed, isTrainingDay }: { isCompleted: boolean; isMissed: boolean; isTrainingDay: boolean }) {
 if (isCompleted) return <Check className="w-3.5 h-3.5 text-green-500" />;
 if (isMissed) return <AlertCircle className="w-3.5 h-3.5 text-red-400" />;
 if (isTrainingDay) return <Dumbbell className="w-3 h-3 text-primary" />;
 return <Moon className="w-3 h-3 text-muted-foreground" />;
}

export function WeekStrip({ weeks, currentDate, onDayClick }: WeekStripProps) {
 const currentWeek = weeks.find(w => w.days.some(d => d.date === currentDate));
 if (!currentWeek) return null;

 const days = currentWeek.days;

 return (
  <div className="mb-4">
   <div className="flex items-center gap-1 justify-center">
    {days.map((day) => {
     const isSelected = day.date === currentDate;
     const isMissed = day.isPast && day.isTrainingDay && !day.isCompleted;

     let bgColor = 'bg-card';
     let borderColor = 'border-border';
     let textColor = 'text-muted-foreground';

     if (isSelected) {
      bgColor = 'bg-primary/20';
      borderColor = 'border-primary';
      textColor = 'text-primary';
     } else if (day.isCompleted) {
      bgColor = 'bg-green-900/20';
      borderColor = 'border-green-900/40';
      textColor = 'text-green-500';
     } else if (isMissed) {
      bgColor = 'bg-red-900/10';
      borderColor = 'border-red-900/30';
      textColor = 'text-red-400';
     } else if (day.isToday) {
      bgColor = 'bg-primary/10';
      borderColor = 'border-primary/30';
      textColor = 'text-primary';
     } else if (day.isTrainingDay) {
      textColor = 'text-muted-foreground';
     }

     const label = day.isTrainingDay
      ? day.isCompleted ? 'Treino concluído' : isMissed ? 'Treino perdido' : 'Dia de treino'
      : 'Dia de descanso';

     return (
      <button
       key={day.date}
       onClick={() => onDayClick(day.date)}
       title={`${getDayName(day.dayIndex, true)} - ${day.date} — ${label}`}
       className={`group relative flex flex-col items-center gap-1 py-2 px-2.5 rounded-lg border transition-all ${bgColor} ${borderColor} min-w-0 flex-1 ${day.isTrainingDay ? 'cursor-pointer hover:opacity-80' : 'opacity-40 cursor-default'}`}
      >
       <span className={`text-[10px] font-medium uppercase tracking-wider ${textColor}`}>
        {getDayName(day.dayIndex).substring(0, 3)}
       </span>
       <span className="text-[11px]">
        <TrainingIcon isCompleted={day.isCompleted} isMissed={isMissed} isTrainingDay={day.isTrainingDay} />
       </span>
      </button>
     );
    })}
   </div>
  </div>
 );
}
