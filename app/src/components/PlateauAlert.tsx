'use client';

import { AlertTriangle, Lightbulb } from 'lucide-react';
import type { PlanilhaData } from '@/types/planilha';
import { detectAllPlateaus } from '@/lib/plateauDetection';

interface PlateauAlertProps {
 planilha: PlanilhaData | null;
}

export function PlateauAlert({ planilha }: PlateauAlertProps) {
 if (!planilha) return null;
 
 const plateaus = detectAllPlateaus(planilha);
 
 if (plateaus.length === 0) return null;
 
 return (
  <div className="p-4 bg-card border border-yellow-800/50 rounded-lg mb-6">
   <div className="flex items-center gap-2 mb-3">
    <AlertTriangle className="w-4 h-4 text-yellow-500" />
    <span className="text-sm font-bold text-yellow-500 tracking-wider">
     PLATÔ DETECTADO
    </span>
   </div>
   <p className="text-xs text-muted-foreground mb-3">
    Você está em platô em {plateaus.length} exercício{plateaus.length > 1 ? 's' : ''}:
   </p>
   <ul className="text-xs space-y-2 mb-3">
    {plateaus.slice(0, 3).map((p) => (
     <li key={p.exerciseName} className="bg-background p-2 rounded">
      <div className="flex items-center justify-between mb-1">
       <span className="text-muted-foreground font-medium">{p.exerciseName}</span>
       <span className="text-primary text-[10px]">
        {p.previousAvg}kg → {p.currentAvg}kg
       </span>
      </div>
      <span className="text-yellow-600/80">{p.suggestion}</span>
     </li>
    ))}
    {plateaus.length > 3 && (
     <li className="text-muted-foreground text-center py-1">
      +{plateaus.length - 3} mais
     </li>
    )}
   </ul>
   <div className="flex items-center gap-1 text-[10px] text-muted-foreground pt-2 border-t border-yellow-900/30">
    <Lightbulb className="w-3 h-3 text-yellow-500" />
    <span>Dica: Varie o exercício ou aumente as repetições</span>
   </div>
  </div>
 );
}