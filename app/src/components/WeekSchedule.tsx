'use client';

import { ChevronLeft, ChevronRight, Check, AlertCircle } from 'lucide-react';
import { getDayName } from '@/utils/programTracker';
import type { ProgramWeekInfo, ProgramDayInfo } from '@/utils/programTracker';

interface WeekScheduleProps {
  week: ProgramWeekInfo;
  selectedDay: string | null;
  onSelectDay: (date: string) => void;
  onPrevWeek: () => void;
  onNextWeek: () => void;
}

function DayCard({ day, isSelected, onSelect }: { day: ProgramDayInfo; isSelected: boolean; onSelect: () => void }) {
  if (!day.isTrainingDay) {
    return (
      <div className="flex flex-col items-center gap-1 p-2 rounded-lg opacity-30 min-w-[52px]">
        <span className="text-[10px] text-gray-600 font-medium">{day.dayName.substring(0, 3)}</span>
        <span className="text-[9px] text-gray-700">—</span>
      </div>
    );
  }

  const pct = day.totalExercises > 0 ? Math.round((day.exercisesCompleted / day.totalExercises) * 100) : 0;

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all min-w-[52px] ${
        isSelected
          ? 'bg-[#B8956A]/15 border border-[#B8956A]/40'
          : day.isCompleted
            ? 'bg-green-900/10 border border-green-900/30'
            : day.isPast
              ? 'bg-red-900/5 border border-red-900/20'
              : day.isToday
                ? 'bg-[#B8956A]/10 border border-[#B8956A]/30'
                : 'bg-[#1A1A1A] border border-[#2A2A2A] hover:border-[#B8956A]/50'
      }`}
    >
      <span className={`text-[10px] font-medium ${
        isSelected ? 'text-[#B8956A]' :
        day.isCompleted ? 'text-green-400' :
        day.isPast ? 'text-red-400' :
        day.isToday ? 'text-[#B8956A]' : 'text-gray-400'
      }`}>
        {day.dayName.substring(0, 3)}
      </span>
      {day.isCompleted ? (
        <Check className="w-3.5 h-3.5 text-green-500" />
      ) : day.isPast ? (
        <AlertCircle className="w-3 h-3 text-red-500" />
      ) : (
        <span className={`text-[10px] ${day.isToday ? 'text-[#B8956A]' : 'text-gray-500'}`}>
          {day.exercisesCompleted}/{day.totalExercises}
        </span>
      )}
      {day.volume > 0 && (
        <span className="text-[8px] text-gray-500">
          {(day.volume / 1000).toFixed(1)}k
        </span>
      )}
    </button>
  );
}

export function WeekSchedule({ week, selectedDay, onSelectDay, onPrevWeek, onNextWeek }: WeekScheduleProps) {
  const weekLabel = week.weekStart && week.weekEnd
    ? `${new Date(week.weekStart).toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })} - ${new Date(week.weekEnd).toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })}`
    : '';

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <button
          type="button"
          onClick={onPrevWeek}
          className="p-1 text-gray-500 hover:text-white transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div className="text-center">
          <span className="text-sm font-bold">Semana {week.weekNumber}</span>
          {weekLabel && <span className="text-[11px] text-gray-500 ml-2">{weekLabel}</span>}
        </div>
        <button
          type="button"
          onClick={onNextWeek}
          className="p-1 text-gray-500 hover:text-white transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="flex overflow-x-auto gap-1.5 pb-1 scrollbar-thin lg:grid lg:grid-cols-7">
        {week.days.map((day) => (
          <DayCard
            key={day.date}
            day={day}
            isSelected={selectedDay === day.date}
            onSelect={() => onSelectDay(day.date)}
          />
        ))}
      </div>
    </div>
  );
}
