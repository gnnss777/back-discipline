'use client';

import { useMemo } from 'react';
import type { PlanilhaData } from '@/types/planilha';
import { getHeatmapData, getMuscleIntensityColor, MUSCLE_DISPLAY_NAMES, type MuscleData } from '@/lib/muscleMap';

interface MuscleHeatmapProps {
  planilha: PlanilhaData | null;
}

export function MuscleHeatmap({ planilha }: MuscleHeatmapProps) {
  const heatmapData = useMemo(() => {
    if (!planilha) return null;
    return getHeatmapData(planilha);
  }, [planilha]);

  const getMusclePath = (muscle: string): string => {
    const paths: Record<string, string> = {
      peito: 'M 90 78 L 110 78 L 110 98 L 90 98 Z',
      costas: 'M 85 58 L 115 58 L 115 88 L 85 88 Z',
      ombro: 'M 68 58 L 78 58 L 78 72 L 68 72 Z M 122 58 L 132 58 L 132 72 L 122 72 Z',
      biceps: 'M 62 72 L 70 72 L 70 90 L 62 90 Z M 130 72 L 138 72 L 138 90 L 130 90 Z',
      triceps: 'M 56 75 L 63 75 L 63 92 L 56 92 Z M 137 75 L 144 75 L 144 92 L 137 92 Z',
      quadriceps: 'M 78 105 L 93 105 L 93 145 L 78 145 Z M 107 105 L 122 105 L 122 145 L 107 145 Z',
      posterior: 'M 78 105 L 93 105 L 93 138 L 78 138 Z M 107 105 L 122 105 L 122 138 L 107 138 Z',
      gluteos: 'M 78 95 L 122 95 L 122 108 L 78 108 Z',
      panturrilha: 'M 80 145 L 91 145 L 91 165 L 80 165 Z M 109 145 L 120 145 L 120 165 L 109 165 Z',
    };
    return paths[muscle] || '';
  };

  if (!heatmapData || heatmapData.totalWorkouts === 0) {
    return (
      <div className="p-4 bg-[#111] border border-[#333] rounded-lg">
        <h3 className="text-sm font-bold tracking-wider mb-4 text-[#B8956A]">MÚSCULOS DA SEMANA</h3>
        <div className="flex items-center justify-center h-24">
          <p className="text-xs text-[#555] text-center">
            Registre seus treinos para ver<br />quais músculos foram trabalhados
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-[#111] border border-[#333] rounded-lg">
      <h3 className="text-sm font-bold tracking-wider mb-4 text-[#B8956A]">MÚSCULOS DA SEMANA</h3>
      
      {/* SVG Body */}
      <svg viewBox="0 0 200 180" className="w-full max-w-[160px] mx-auto mb-4">
        {/* Body outline */}
        <ellipse cx="100" cy="30" rx="28" ry="14" fill="#1a1a1a" />
        <rect x="72" y="42" width="56" height="65" rx="6" fill="#1a1a1a" />
        <rect x="55" y="48" width="16" height="55" rx="6" fill="#1a1a1a" />
        <rect x="129" y="48" width="16" height="55" rx="6" fill="#1a1a1a" />
        <rect x="75" y="102" width="23" height="58" rx="5" fill="#1a1a1a" />
        <rect x="102" y="102" width="23" height="58" rx="5" fill="#1a1a1a" />
        
        {/* Muscle overlays */}
        {heatmapData.muscles.map((m: MuscleData) => {
          const path = getMusclePath(m.muscle);
          if (!path) return null;
          return (
            <path
              key={m.muscle}
              d={path}
              fill={getMuscleIntensityColor(m.intensity)}
              stroke="#333"
              strokeWidth="0.5"
              className="transition-colors duration-300"
            />
          );
        })}
      </svg>
      
      {/* Legend */}
      <div className="flex justify-center gap-3 text-[10px] mb-3">
        <div className="flex items-center gap-1">
          <div className="w-2.5 h-2.5 rounded-sm bg-[#333333]" />
          <span className="text-[#555]">Não</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2.5 h-2.5 rounded-sm bg-[#B8956A]" />
          <span className="text-[#555]">Leve</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2.5 h-2.5 rounded-sm bg-[#8B7355]" />
          <span className="text-[#555]">Intenso</span>
        </div>
      </div>
      
      {/* Muscle list */}
      <div className="grid grid-cols-2 gap-1.5 text-[10px]">
        {heatmapData.muscles
          .filter(m => m.workoutsThisWeek > 0)
          .sort((a, b) => b.workoutsThisWeek - a.workoutsThisWeek)
          .slice(0, 6)
          .map(m => (
            <div key={m.muscle} className="flex items-center justify-between px-2 py-1 bg-[#0A0A0A] rounded">
              <span className="text-[#777]">{MUSCLE_DISPLAY_NAMES[m.muscle]}</span>
              <span className="text-[#B8956A] font-bold">{m.workoutsThisWeek}x</span>
            </div>
          ))}
      </div>
    </div>
  );
}