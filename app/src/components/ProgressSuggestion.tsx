'use client';

import { Sparkles } from 'lucide-react';
import type { PlanilhaData } from '@/types/planilha';
import { calculateSuggestedWeight } from '@/lib/progression';

interface ProgressSuggestionProps {
  exerciseName: string;
  planilha: PlanilhaData | null;
  currentWeight?: number;
  onApply?: (weight: number) => void;
}

export function ProgressSuggestion({ exerciseName, planilha, currentWeight, onApply }: ProgressSuggestionProps) {
  if (!planilha) return null;
  
  const suggestion = calculateSuggestedWeight(planilha, exerciseName);
  
  if (!suggestion) return null;
  
  const isBetter = suggestion.completedAllSets && suggestion.suggestedWeight > (currentWeight || 0);
  
  return (
    <div className={`mt-2 p-2 rounded text-xs ${
      suggestion.completedAllSets 
        ? 'bg-green-900/20 border border-green-800/40' 
        : 'bg-[#1a1a1a] border border-[#333]'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Sparkles className={`w-3 h-3 ${suggestion.completedAllSets ? 'text-green-400' : 'text-[#555]'}`} />
          <span className="text-[#555]">Sugestão:</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`font-bold ${suggestion.completedAllSets ? 'text-green-400' : 'text-[#B8956A]'}`}>
            {suggestion.suggestedWeight}kg
          </span>
          {onApply && suggestion.suggestedWeight !== currentWeight && (
            <button
              onClick={() => onApply(suggestion.suggestedWeight)}
              className="text-[10px] px-1.5 py-0.5 bg-[#B8956A] text-black rounded hover:bg-[#8B7355] transition-colors font-bold"
            >
              Usar
            </button>
          )}
        </div>
      </div>
      {suggestion.completedAllSets ? (
        <span className="text-green-500/80 text-[10px]">
          +{suggestion.increment}kg baseado no último treino completo
        </span>
      ) : (
        <span className="text-[#555] text-[10px]">
          Mantendo peso (treino anterior incompleto)
        </span>
      )}
    </div>
  );
}