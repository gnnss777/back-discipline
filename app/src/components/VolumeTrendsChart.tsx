'use client';

import { useMemo } from 'react';
import type { PlanilhaData } from '@/types/planilha';
import { getWeeklyData } from '@/lib/plateauDetection';

interface VolumeTrendsChartProps {
  planilha: PlanilhaData | null;
}

export function VolumeTrendsChart({ planilha }: VolumeTrendsChartProps) {
  const chartData = useMemo(() => {
    if (!planilha) return null;
    
    const weeklyData = getWeeklyData(planilha);
    const weeks = Array.from(weeklyData.values())
      .filter(w => w.totalVolume > 0)
      .sort((a, b) => a.weekNumber - b.weekNumber)
      .slice(-8);

    if (weeks.length < 2) return null;

    const maxVolume = Math.max(...weeks.map(w => w.totalVolume));
    const minVolume = Math.min(...weeks.map(w => w.totalVolume));
    const range = maxVolume - minVolume || 1;
    
    const points = weeks.map((week, i) => {
      const x = (i / (Math.max(weeks.length - 1, 1))) * 100;
      const y = 100 - ((week.totalVolume - minVolume) / range) * 80;
      return { x, y, week };
    });

    const firstVolume = weeks[0].totalVolume;
    const lastVolume = weeks[weeks.length - 1].totalVolume;
    const trend = lastVolume > firstVolume * 1.1 ? 'up' : lastVolume < firstVolume * 0.9 ? 'down' : 'stable';
    const trendPercent = firstVolume > 0 ? Math.round(((lastVolume - firstVolume) / firstVolume) * 100) : 0;

    return { points, trend, trendPercent, weeks };
  }, [planilha]);

  const formatVolume = (v: number): string => {
    if (v >= 1000000) return `${(v / 1000000).toFixed(1)}M`;
    if (v >= 1000) return `${(v / 1000).toFixed(0)}K`;
    return v.toString();
  };

  if (!chartData || chartData.weeks.length < 2) {
    return (
      <div className="p-4 bg-card border border-border rounded-lg">
        <h3 className="text-sm font-bold tracking-wider mb-4 text-primary">TENDÊNCIA DE VOLUME</h3>
        <div className="flex items-center justify-center h-24">
          <p className="text-xs text-muted text-center">
            Registre mais semanas para<br />ver a tendência de volume
          </p>
        </div>
      </div>
    );
  }

  const { points, trend, trendPercent } = chartData;
  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  return (
    <div className="p-4 bg-card border border-border rounded-lg">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold tracking-wider text-primary">TENDÊNCIA DE VOLUME</h3>
        <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
          trend === 'up' ? 'bg-green-900/50 text-green-400' :
          trend === 'down' ? 'bg-red-900/50 text-red-400' :
          'bg-yellow-900/50 text-yellow-400'
        }`}>
          {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} {Math.abs(trendPercent)}%
        </span>
      </div>
      
      {/* Chart */}
      <div className="relative h-28 mb-2">
        <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
          {/* Grid lines */}
<line x1="0" y1="25" x2="100" y2="25" stroke="#1E1E1E" strokeWidth="0.5" />
<line x1="0" y1="50" x2="100" y2="50" stroke="#1E1E1E" strokeWidth="0.5" />
<line x1="0" y1="75" x2="100" y2="75" stroke="#1E1E1E" strokeWidth="0.5" />
          
          {/* Line */}
          <path
            d={pathD}
            fill="none"
            stroke="#C9A86C"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Points */}
          {points.map((p, i) => (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r="2.5"
              fill="#C9A86C"
              stroke="#080808"
              strokeWidth="0.5"
            />
          ))}
        </svg>
      </div>
      
      {/* X-axis labels */}
      <div className="flex justify-between text-[10px] text-muted">
        <span>Sem {chartData.weeks[0]?.weekNumber}</span>
        <span>Sem {chartData.weeks[chartData.weeks.length - 1]?.weekNumber}</span>
      </div>
      
      {/* Current value */}
      <div className="mt-2 pt-2 border-t border-border flex justify-between text-[10px]">
        <span className="text-muted">Volume atual</span>
        <span className="text-primary font-bold">
          {formatVolume(chartData.weeks[chartData.weeks.length - 1]?.totalVolume || 0)}
        </span>
      </div>
    </div>
  );
}