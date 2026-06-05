'use client';

import { useState, useRef, useEffect } from 'react';
import { Sparkles, ChevronDown, ChevronUp, Check, Timer, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import type { PlannedSet, ActualSet } from '@/types/planilha';
import { findExerciseByHeadingName } from '@/data/exercises';

const RPE_VALUES = [6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10];

interface ExerciseLoggerProps {
 exerciseName: string;
 planned: PlannedSet[];
 actual?: ActualSet[];
 onUpdateActual: (setIdx: number, field: string, value: number | string) => void;
 lastSavedWeight?: number;
}

export function ExerciseLogger({ exerciseName, planned, actual, onUpdateActual, lastSavedWeight }: ExerciseLoggerProps) {
 const [expanded, setExpanded] = useState(true);
 const [showRpe, setShowRpe] = useState(false);
 const [justCompleted, setJustCompleted] = useState<number | null>(null);
 const autoFilled = useRef(false);

 const lastActualWeight = actual?.length
  ? [...actual].reverse().find(a => a.weight !== undefined)?.weight
  : undefined;

 const allCompleted = actual?.every((a, i) => i < planned.length && a.reps !== undefined && a.reps > 0);
 const hasAnyData = actual?.some(a => a.reps !== undefined);

 const suggestedWeight = allCompleted && lastActualWeight
  ? Math.round((lastActualWeight + 2.5) * 10) / 10
  : lastActualWeight || lastSavedWeight || planned[0]?.weight || 0;

 useEffect(() => {
  if (!autoFilled.current && actual && actual.length > 0) {
   const hasAnyData = actual.some(a => a.weight !== undefined || a.reps !== undefined);
   if (!hasAnyData) {
    planned.forEach((p, idx) => {
     if (lastSavedWeight) onUpdateActual(idx, 'weight', lastSavedWeight);
     if (p.reps) onUpdateActual(idx, 'reps', p.reps);
    });
   }
   autoFilled.current = true;
  }
 }, [actual, planned, lastSavedWeight, onUpdateActual]);

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

 const handleSetComplete = (sIdx: number) => {
  setJustCompleted(sIdx);
  setTimeout(() => setJustCompleted(null), 800);
 };

 const exRef = findExerciseByHeadingName(exerciseName);
 const biblioHref = exRef ? `/biblioteca/${exRef.id}` : `/biblioteca?search=${encodeURIComponent(exerciseName)}`;

 return (
  <div className="border border-border rounded-lg overflow-hidden bg-card">
   {/* Header */}
   <button
    type="button"
    onClick={() => setExpanded(!expanded)}
    className="w-full flex items-center justify-between p-4 hover:bg-card transition-colors"
   >
    <div className="flex items-center gap-3 min-w-0">
     <span className="text-base font-semibold text-foreground truncate">{exerciseName}</span>
     <Link href={biblioHref} onClick={(e) => e.stopPropagation()} className="shrink-0 text-muted-foreground hover:text-primary transition-colors">
      <ExternalLink className="w-3.5 h-3.5" />
     </Link>
     {!expanded && hasAnyData && (
      <span className="text-xs text-muted-foreground shrink-0">
       {actual?.filter(a => a.reps !== undefined).length || 0}/{planned.length}
      </span>
     )}
     {hasAnyData && !allCompleted && (
      <span className="text-xs text-yellow-400 shrink-0">Incompleto</span>
     )}
     {allCompleted && (
      <Check className="w-4 h-4 text-green-500 shrink-0" />
     )}
    </div>
    {expanded ? <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" /> : <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />}
   </button>

   {expanded && (
    <div className="px-4 pb-4 space-y-3 border-t border-border">
     {/* Header row */}
     <div className="flex items-center justify-between pt-3 pb-1">
      <span className="text-xs text-muted-foreground font-medium tracking-wider">SÉRIES</span>
      <div className="flex items-center gap-2">
       <Link href="/timer" className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
        <Timer className="w-3 h-3" />
        Timer
       </Link>
       <button
        type="button"
        onClick={() => setShowRpe(!showRpe)}
        className="text-xs text-muted-foreground hover:text-primary transition-colors"
       >
        {showRpe ? 'Ocultar RPE' : 'RPE'}
       </button>
      </div>
     </div>

     {/* Sets */}
     <div className="space-y-2">
      {planned.map((p, sIdx) => {
       const a = actual?.[sIdx] || { reps: undefined, weight: undefined, rpe: undefined };
       const isAnimating = justCompleted === sIdx;

       return (
        <div
         key={sIdx}
         className={`bg-surface border rounded-lg p-3 transition-all duration-300 ${
          isAnimating ? 'border-green-500/50 bg-green-900/10 scale-[1.01]' : 'border-border'
         }`}
        >
         <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-bold text-primary">Série {sIdx + 1}</span>
          <span className="text-xs text-muted-foreground">
           Planejado: {p.reps} reps{p.weight ? ` @ ${p.weight}kg` : ''}
          </span>
         </div>
         <div className={`grid ${showRpe ? 'grid-cols-4' : 'grid-cols-3'} gap-2`}>
          <div>
           <label className="block text-muted-foreground text-[10px] mb-1 font-medium">Reps</label>
           <input
            type="number"
            min={0}
            max={99}
            value={a.reps ?? p.reps ?? ''}
            onChange={e => onUpdateActual(sIdx, 'reps', parseInt(e.target.value) || 0)}
            onBlur={() => { if (a.reps && a.reps > 0) handleSetComplete(sIdx); }}
            className="w-full bg-card border border-border rounded py-2 px-2 text-white text-center text-sm focus:border-primary focus:outline-none"
            placeholder={String(p.reps)}
           />
          </div>
          <div>
           <label className="block text-muted-foreground text-[10px] mb-1 font-medium">
            Peso <span className="text-muted-foreground">(kg)</span>
           </label>
           <input
            type="number"
            min={0}
            max={500}
            step={0.5}
            value={a.weight ?? lastSavedWeight ?? ''}
            onChange={e => onUpdateActual(sIdx, 'weight', parseFloat(e.target.value) || 0)}
            className="w-full bg-card border border-border rounded py-2 px-2 text-white text-center text-sm focus:border-primary focus:outline-none"
            placeholder={p.weight ? String(p.weight) : '0'}
           />
          </div>
          {showRpe && (
           <div>
            <label className="block text-muted-foreground text-[10px] mb-1 font-medium">RPE</label>
            <select
             value={a.rpe ?? ''}
             onChange={e => onUpdateActual(sIdx, 'rpe', parseFloat(e.target.value) || 0)}
             className="w-full bg-card border border-border rounded py-2 px-1 text-white text-center text-sm focus:border-primary focus:outline-none appearance-none"
            >
             <option value="">-</option>
             {RPE_VALUES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
           </div>
          )}
          <div>
           <label className="block text-muted-foreground text-[10px] mb-1 font-medium">Timer</label>
           <Link
            href="/timer"
            className="flex items-center justify-center w-full bg-card border border-border rounded py-2 text-muted-foreground hover:text-primary hover:border-primary transition-colors"
           >
            <Timer className="w-4 h-4" />
           </Link>
          </div>
         </div>
         {sIdx > 0 && (
          <button
           type="button"
           onClick={() => copyPreviousSet(sIdx)}
           className="mt-2 text-xs text-muted-foreground hover:text-primary transition-colors"
          >
           ← Copiar da série anterior
          </button>
         )}
        </div>
       );
      })}
     </div>

     {/* Suggestion button */}
     {hasAnyData && (
      <button
       type="button"
       onClick={applySuggestion}
       className="w-full flex items-center justify-center gap-2 py-3 bg-card border border-border rounded-lg text-sm text-muted-foreground hover:text-primary hover:border-primary transition-colors"
      >
       <Sparkles className="w-3.5 h-3.5" />
       Aplicar {suggestedWeight}kg em todas as séries
       {allCompleted && <span className="text-green-500 font-bold"> (+2.5kg)</span>}
      </button>
     )}
    </div>
   )}
  </div>
 );
}
