'use client';

import { useState } from 'react';
import { Sparkles, ChevronDown, ChevronUp, Plus, Check } from 'lucide-react';
import type { PlannedSet, ActualSet } from '@/types/planilha';

const RPE_VALUES = [6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10];

interface ExerciseLoggerProps {
  exerciseName: string;
  planned: PlannedSet[];
  actual?: ActualSet[];
  onUpdateActual: (setIdx: number, field: string, value: number | string) => void;
}

export function ExerciseLogger({ exerciseName, planned, actual, onUpdateActual }: ExerciseLoggerProps) {
  const [expanded, setExpanded] = useState(true);

  const lastActualWeight = actual?.length
    ? [...actual].reverse().find(a => a.weight !== undefined)?.weight
    : undefined;

  const allCompleted = actual?.every((a, i) => i < planned.length && a.reps !== undefined && a.reps > 0);
  const hasAnyData = actual?.some(a => a.reps !== undefined);

  const suggestedWeight = allCompleted && lastActualWeight
    ? Math.round((lastActualWeight + 2.5) * 10) / 10
    : lastActualWeight || planned[0]?.weight || 0;

  const applySuggestion = () => {
    planned.forEach((_, idx) => {
      onUpdateActual(idx, 'weight', suggestedWeight);
    });
  };

  const copyPreviousSet = (setIdx: number) => {
    if (setIdx === 0) return;
    const prev = actual?.[setIdx - 1];
    if (prev) {
      if (prev.reps !== undefined) onUpdateActual(setIdx, 'reps', prev.reps);
      if (prev.weight !== undefined) onUpdateActual(setIdx, 'weight', prev.weight);
      if (prev.rpe !== undefined) onUpdateActual(setIdx, 'rpe', prev.rpe);
    }
  };

  return (
    <div className="border border-[#2A2A2A] rounded-lg overflow-hidden bg-[#111]">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-3 hover:bg-[#1A1A1A] transition-colors"
      >
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-sm font-medium truncate">{exerciseName}</span>
          {hasAnyData && !allCompleted && (
            <span className="text-xs text-yellow-400 shrink-0">Incompleto</span>
          )}
          {allCompleted && (
            <Check className="w-3.5 h-3.5 text-green-500 shrink-0" />
          )}
        </div>
        {expanded ? <ChevronUp className="w-4 h-4 text-gray-500 shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-500 shrink-0" />}
      </button>

      {expanded && (
        <div className="px-3 pb-3 space-y-2 border-t border-[#2A2A2A]">
          <div className="pt-2 grid grid-cols-[1fr_auto] gap-1">
            {planned.map((p, sIdx) => {
              const a = actual?.[sIdx] || { reps: undefined, weight: undefined, rpe: undefined };
              const isLast = sIdx === planned.length - 1;
              const hasPrev = sIdx > 0;

              return (
                <div key={sIdx} className={`col-span-2 bg-[#0F0F0F] border border-[#2A2A2A] rounded p-2 ${isLast ? 'mb-1' : ''}`}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[#B8956A] text-[11px] font-bold">Série {sIdx + 1}</span>
                    <span className="text-[#444] text-[10px]">
                      Meta: {p.reps} reps{p.weight ? ` @${p.weight}kg` : ''}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5">
                    <div>
                      <label className="block text-[#555] text-[9px] mb-0.5">Reps</label>
                      <input
                        type="number"
                        min={0}
                        max={99}
                        value={a.reps ?? ''}
                        onChange={e => onUpdateActual(sIdx, 'reps', parseInt(e.target.value) || 0)}
                        className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded py-1.5 px-2 text-white text-center text-xs focus:border-[#B8956A] focus:outline-none"
                        placeholder={String(p.reps)}
                      />
                    </div>
                    <div>
                      <label className="block text-[#555] text-[9px] mb-0.5">Peso</label>
                      <input
                        type="number"
                        min={0}
                        max={500}
                        step={0.5}
                        value={a.weight ?? ''}
                        onChange={e => onUpdateActual(sIdx, 'weight', parseFloat(e.target.value) || 0)}
                        className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded py-1.5 px-2 text-white text-center text-xs focus:border-[#B8956A] focus:outline-none"
                        placeholder={p.weight ? String(p.weight) : '0'}
                      />
                    </div>
                    <div className="relative">
                      <label className="block text-[#555] text-[9px] mb-0.5">RPE</label>
                      <select
                        value={a.rpe ?? ''}
                        onChange={e => onUpdateActual(sIdx, 'rpe', parseFloat(e.target.value) || 0)}
                        className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded py-1.5 px-1 text-white text-center text-xs focus:border-[#B8956A] focus:outline-none appearance-none"
                      >
                        <option value="">-</option>
                        {RPE_VALUES.map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </div>
                  </div>
                  {hasPrev && (
                    <button
                      type="button"
                      onClick={() => copyPreviousSet(sIdx)}
                      className="mt-1 text-[10px] text-gray-500 hover:text-[#B8956A] transition-colors"
                    >
                      Copiar da anterior
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {hasAnyData && (
            <button
              type="button"
              onClick={applySuggestion}
              className="w-full flex items-center justify-center gap-1.5 py-2 bg-[#1A1A1A] border border-[#2A2A2A] rounded text-xs text-gray-400 hover:text-[#B8956A] hover:border-[#B8956A] transition-colors"
            >
              <Sparkles className="w-3 h-3" />
              Aplicar {suggestedWeight}kg em todas as séries
              {allCompleted && <span className="text-green-500 font-bold"> (+2.5kg)</span>}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
