# Plan: Phase 11c - Muscle Heatmap e Volume Trends

**Phase:** 11c
**Milestone:** v1.2 Análise Inteligente de Treino
**Goal:** Criar visualizações de músculos trabalhados e evolução de volume

---

## Context

### Why This Phase

Adicionar visualizações de dados que ajudam o usuário a entender seu progresso.

### Dependencies

- Phase 11a (lib/muscleMap.ts, lib/progression.ts)
- Phase 11b (página de stats)

### Key Files

```
app/src/
├── components/
│   ├── MuscleHeatmap.tsx   (NOVO) - Mapa de corpo com músculos
│   └── VolumeTrendsChart.tsx (NOVO) - Gráfico de linha de volume
├── app/
│   └── dashboard/
│       └── page.tsx        (MODIFICAR) - Adicionar heatmap
```

---

## Requirements

### R-01: Component - MuscleHeatmap

**Goal:** SVG do corpo humano com cores indicando músculos trabalhados

**Implementation:**

```tsx
// components/MuscleHeatmap.tsx

'use client';

import { getHeatmapData, getMuscleIntensityColor, MUSCLE_DISPLAY_NAMES, type MuscleData } from '@/lib/muscleMap';

interface Props {
  planilha: PlanilhaData;
}

export function MuscleHeatmap({ planilha }: Props) {
  const heatmapData = getHeatmapData(planilha);
  
  const getMusclePath = (muscle: string): string => {
    const paths: Record<string, string> = {
      peito: 'M 90 85 L 110 85 L 110 105 L 90 105 Z',
      costas: 'M 85 65 L 115 65 L 115 95 L 85 95 Z',
      ombro: 'M 70 65 L 80 65 L 80 75 L 70 75 Z M 120 65 L 130 65 L 130 75 L 120 75 Z',
      biceps: 'M 65 80 L 72 80 L 72 95 L 65 95 Z M 128 80 L 135 80 L 135 95 L 128 95 Z',
      triceps: 'M 60 82 L 67 82 L 67 97 L 60 97 Z M 133 82 L 140 82 L 140 97 L 133 97 Z',
      quadriceps: 'M 80 110 L 95 110 L 95 145 L 80 145 Z M 105 110 L 120 110 L 120 145 L 105 145 Z',
      posterior: 'M 80 110 L 95 110 L 95 140 L 80 140 Z M 105 110 L 120 110 L 120 140 L 105 140 Z',
      gluteos: 'M 80 100 L 120 100 L 120 115 L 80 115 Z',
      panturrilha: 'M 82 145 L 93 145 L 93 165 L 82 165 Z M 107 145 L 118 145 L 118 165 L 107 165 Z',
    };
    return paths[muscle] || '';
  };

  return (
    <div className="p-4 bg-[#111] border border-[#333] rounded-lg">
      <h3 className="text-sm font-bold tracking-wider mb-4">MÚSCULOS DA SEMANA</h3>
      
      {/* SVG Body */}
      <svg viewBox="0 0 200 180" className="w-full max-w-[200px] mx-auto mb-4">
        {/* Body outline */}
        <ellipse cx="100" cy="35" rx="25" ry="12" fill="#222" />
        <rect x="75" y="45" width="50" height="70" rx="5" fill="#222" />
        <rect x="60" y="50" width="15" height="50" rx="5" fill="#222" />
        <rect x="125" y="50" width="15" height="50" rx="5" fill="#222" />
        <rect x="75" y="110" width="22" height="60" rx="5" fill="#222" />
        <rect x="103" y="110" width="22" height="60" rx="5" fill="#222" />
        
        {/* Muscle overlays */}
        {heatmapData.muscles.map((m: MuscleData) => {
          const path = getMusclePath(m.muscle);
          if (!path) return null;
          return (
            <path
              key={m.muscle}
              d={path}
              fill={getMuscleIntensityColor(m.intensity)}
              stroke="#444"
              strokeWidth="0.5"
            />
          );
        })}
      </svg>
      
      {/* Legend */}
      <div className="flex justify-center gap-4 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-[#333333] rounded" />
          <span className="text-[#555]">Não</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-[#B8956A] rounded" />
          <span className="text-[#555]">Leve</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-[#8B7355] rounded" />
          <span className="text-[#555]">Intenso</span>
        </div>
      </div>
      
      {/* Muscle list */}
      <div className="mt-4 grid grid-cols-2 gap-2">
        {heatmapData.muscles
          .filter(m => m.workoutsThisWeek > 0)
          .map(m => (
            <div key={m.muscle} className="flex items-center justify-between text-xs">
              <span className="text-[#777]">{MUSCLE_DISPLAY_NAMES[m.muscle]}</span>
              <span className="text-[#B8956A]">{m.workoutsThisWeek}x</span>
            </div>
          ))}
      </div>
    </div>
  );
}
```

**Validation:**
- SVG do corpo com músculos coloridos
- Legenda de cores
- Lista de músculos trabalhados

---

### R-02: Component - VolumeTrendsChart

**Goal:** Gráfico de linha CSS/SVG puro mostrando evolução de volume

**Implementation:**

```tsx
// components/VolumeTrendsChart.tsx

'use client';

import { getWeeklyData, type WeeklyData } from '@/lib/plateauDetection';

interface Props {
  planilha: PlanilhaData;
}

export function VolumeTrendsChart({ planilha }: Props) {
  const weeklyData = getWeeklyData(planilha);
  const weeks = Array.from(weeklyData.values())
    .sort((a, b) => a.weekNumber - b.weekNumber)
    .slice(-8);

  if (weeks.length < 2) {
    return (
      <div className="p-4 bg-[#111] border border-[#333] rounded-lg">
        <h3 className="text-sm font-bold tracking-wider mb-4">TENDÊNCIA DE VOLUME</h3>
        <p className="text-xs text-[#555] text-center py-4">
          Registre mais semanas para ver a tendência
        </p>
      </div>
    );
  }

  const maxVolume = Math.max(...weeks.map(w => w.totalVolume));
  const minVolume = Math.min(...weeks.map(w => w.totalVolume));
  const range = maxVolume - minVolume || 1;
  
  const points = weeks.map((week, i) => {
    const x = (i / (weeks.length - 1)) * 100;
    const y = 100 - ((week.totalVolume - minVolume) / range) * 80;
    return `${x},${y}`;
  }).join(' ');

  const firstVolume = weeks[0].totalVolume;
  const lastVolume = weeks[weeks.length - 1].totalVolume;
  const trend = lastVolume > firstVolume * 1.1 ? 'up' : lastVolume < firstVolume * 0.9 ? 'down' : 'stable';
  const trendPercent = firstVolume > 0 ? Math.round(((lastVolume - firstVolume) / firstVolume) * 100) : 0;

  return (
    <div className="p-4 bg-[#111] border border-[#333] rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold tracking-wider">TENDÊNCIA DE VOLUME</h3>
        <span className={`text-xs px-2 py-1 rounded ${
          trend === 'up' ? 'bg-green-900 text-green-400' :
          trend === 'down' ? 'bg-red-900 text-red-400' :
          'bg-yellow-900 text-yellow-400'
        }`}>
          {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} {Math.abs(trendPercent)}%
        </span>
      </div>
      
      {/* Chart */}
      <div className="relative h-32 mb-2">
        <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
          {/* Grid lines */}
          <line x1="0" y1="25" x2="100" y2="25" stroke="#222" strokeWidth="0.5" />
          <line x1="0" y1="50" x2="100" y2="50" stroke="#222" strokeWidth="0.5" />
          <line x1="0" y1="75" x2="100" y2="75" stroke="#222" strokeWidth="0.5" />
          
          {/* Line */}
          <polyline
            points={points}
            fill="none"
            stroke="#B8956A"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Points */}
          {weeks.map((week, i) => {
            const x = (i / (weeks.length - 1)) * 100;
            const y = 100 - ((week.totalVolume - minVolume) / range) * 80;
            return (
              <circle
                key={week.weekNumber}
                cx={x}
                cy={y}
                r="2"
                fill="#B8956A"
              />
            );
          })}
        </svg>
      </div>
      
      {/* X-axis labels */}
      <div className="flex justify-between text-xs text-[#555]">
        <span>Sem {weeks[0]?.weekNumber}</span>
        <span>Sem {weeks[weeks.length - 1]?.weekNumber}</span>
      </div>
    </div>
  );
}
```

**Validation:**
- Gráfico de linha SVG puro
- Indicador de tendência (up/down/stable)
- Percentual de mudança

---

### R-03: Dashboard Integration

**Goal:** Adicionar heatmap e gráfico de volume no dashboard

**Modification in** `dashboard/page.tsx`:

```tsx
import { MuscleHeatmap } from '@/components/MuscleHeatmap';
import { VolumeTrendsChart } from '@/components/VolumeTrendsChart';

// Adicionar após "Sua Jornada" section:
// <div className="grid md:grid-cols-2 gap-4 mb-8">
//   <MuscleHeatmap planilha={planilhaData} />
//   <VolumeTrendsChart planilha={planilhaData} />
// </div>
```

**Validation:**
- Componentes visíveis no dashboard
- Dados carregados do localStorage

---

## UI Design

**Alinhado com UI atual:**
- Background: `#0A0A0A`
- Cards: `#111` com borda `#333`
- Accent: `#B8956A` (dourado)
- Tipografia: `tracking-wider`
- Layout: `max-w-4xl`

---

## Success Criteria

- [ ] MuscleHeatmap exibe corpo com cores
- [ ] Legenda de cores funciona
- [ ] VolumeTrendsChart mostra linha de tendência
- [ ] Indicador de tendência (up/down/stable)
- [ ] Ambos integrados no dashboard
- [ ] Design alinhado com UI existente

---

## Files to Create

```
app/src/components/MuscleHeatmap.tsx   (NOVO)
app/src/components/VolumeTrendsChart.tsx (NOVO)
```

---

## Files to Modify

```
app/src/app/dashboard/page.tsx  (adicionar componentes)
```

---

*Plan created: 2026-05-07*
*Est. 2-3 hours*