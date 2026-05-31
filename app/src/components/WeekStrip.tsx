'use client';

import { Check, AlertCircle } from 'lucide-react';
import { getDayName } from '@/utils/programTracker';
import type { ProgramWeekInfo } from '@/utils/programTracker';

interface WeekStripProps {
  weeks: ProgramWeekInfo[];
  currentDate: string;
  onDayClick: (date: string) => void;
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

          let bgColor = 'bg-[#1A1A1A]';
          let borderColor = 'border-[#2A2A2A]';
          let textColor = 'text-gray-600';

          if (isSelected) {
            bgColor = 'bg-[#B8956A]/20';
            borderColor = 'border-[#B8956A]';
            textColor = 'text-[#B8956A]';
          } else if (day.isCompleted) {
            bgColor = 'bg-green-900/20';
            borderColor = 'border-green-900/40';
            textColor = 'text-green-500';
          } else if (day.isPast && day.isTrainingDay) {
            bgColor = 'bg-red-900/10';
            borderColor = 'border-red-900/30';
            textColor = 'text-red-400';
          } else if (day.isToday) {
            bgColor = 'bg-[#B8956A]/10';
            borderColor = 'border-[#B8956A]/30';
            textColor = 'text-[#B8956A]';
          } else if (day.isTrainingDay) {
            textColor = 'text-gray-400';
          }

          return (
            <button
              key={day.date}
              onClick={() => onDayClick(day.date)}
              className={`flex flex-col items-center gap-1 py-2 px-2.5 rounded-lg border transition-all ${bgColor} ${borderColor} min-w-0 flex-1 ${day.isTrainingDay ? 'cursor-pointer hover:opacity-80' : 'opacity-40 cursor-default'}`}
            >
              <span className={`text-[10px] font-medium uppercase tracking-wider ${textColor}`}>
                {getDayName(day.dayIndex).substring(0, 3)}
              </span>
              <span className="text-[11px]">
                {day.isCompleted ? (
                  <Check className="w-3 h-3 text-green-500" />
                ) : day.isPast && day.isTrainingDay ? (
                  <AlertCircle className="w-3 h-3 text-red-400" />
                ) : isSelected ? (
                  <span className="text-[10px] font-bold text-[#B8956A]">◉</span>
                ) : day.isToday ? (
                  <span className="text-[10px] font-bold text-[#B8956A]">●</span>
                ) : day.isTrainingDay ? (
                  <span className="text-[8px] text-gray-600">○</span>
                ) : (
                  <span className="text-[8px] text-gray-700">—</span>
                )}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
