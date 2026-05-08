# Plan: Phase 11b - Stats e PRs por Exercício

**Phase:** 11b
**Milestone:** v1.2 Análise Inteligente de Treino
**Goal:** Criar página de estatísticas com PRs, volume total e melhor série por exercício

---

## Context

### Why This Phase

Phase 11a criou as funções base. Agora vamos expô-las na UI com uma página de estatísticas.

### Dependencies

- Phase 11a (lib/exerciseStats.ts)

### Key Files

```
app/src/
├── app/
│   └── estatisticas/
│       └── page.tsx        (NOVO) - Página de estatísticas
├── components/
│   ├── ExerciseStatsCard.tsx  (NOVO) - Card de stats de exercício
│   ├── PRBadge.tsx           (NOVO) - Badge de troféu para PR
│   └── StatsGrid.tsx         (NOVO) - Grid de estatísticas
```

---

## Requirements

### R-01: Page - /estatisticas

**Goal:** Página principal que lista todos os exercícios com seus stats

**Implementation:**

```tsx
// app/estatisticas/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { loadPlanilha } from '@/utils/planilhaStorage';
import { calculateAllStats } from '@/lib/exerciseStats';
import { useAuth } from '@/hooks/useAuth';
import { Trophy, TrendingUp, Activity } from 'lucide-react';

export default function EstatisticasPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<AllExercisesStats | null>(null);

  useEffect(() => {
    if (!user) return;
    const planilha = loadPlanilha(user.userId);
    if (planilha) {
      setStats(calculateAllStats(planilha));
    }
  }, [user]);

  if (!stats) return null;

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Header */}
      <header className="border-b border-[#333] sticky top-0 bg-[#0A0A0A]/95">
        {/* ... same as other pages */}
      </header>

      {/* Stats Overview */}
      <div className="grid md:grid-cols-3 gap-4 p-4">
        <div className="p-4 bg-[#111] border border-[#333] rounded-lg">
          <Trophy className="w-6 h-6 text-[#B8956A] mb-2" />
          <div className="text-2xl font-bold">{stats.totalPRs}</div>
          <div className="text-sm text-[#555]">PRs</div>
        </div>
        <div className="p-4 bg-[#111] border border-[#333] rounded-lg">
          <Activity className="w-6 h-6 text-[#B8956A] mb-2" />
          <div className="text-2xl font-bold">{formatVolume(stats.totalVolume)}</div>
          <div className="text-sm text-[#555]">Volume Total</div>
        </div>
        <div className="p-4 bg-[#111] border border-[#333] rounded-lg">
          <TrendingUp className="w-6 h-6 text-[#B8956A] mb-2" />
          <div className="text-2xl font-bold">{stats.exercises.length}</div>
          <div className="text-sm text-[#555]">Exercícios</div>
        </div>
      </div>

      {/* Exercise List */}
      <div className="space-y-3 p-4">
        {stats.exercises.map((exercise) => (
          <ExerciseStatsCard key={exercise.exerciseName} stats={exercise} />
        ))}
      </div>
    </div>
  );
}
```

**Validation:**
- Página acessível via `/estatisticas`
- Lista todos os exercícios com stats
- Ordenada por PR (maior primeiro)

---

### R-02: Component - ExerciseStatsCard

**Goal:** Card individual mostrando stats de um exercício

**Implementation:**

```tsx
// components/ExerciseStatsCard.tsx

interface Props {
  stats: ExerciseStats;
}

export function ExerciseStatsCard({ stats }: Props) {
  return (
    <div className="p-4 bg-[#111] border border-[#333] rounded-lg">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold tracking-wider">{stats.exerciseName}</h3>
        {stats.personalRecord > 0 && <PRBadge weight={stats.personalRecord} />}
      </div>
      
      <div className="grid grid-cols-4 gap-4 text-center">
        <div>
          <div className="text-lg font-bold">{stats.personalRecord}kg</div>
          <div className="text-xs text-[#555]">PR</div>
        </div>
        <div>
          <div className="text-lg font-bold">{formatVolume(stats.totalVolume)}</div>
          <div className="text-xs text-[#555]">Volume</div>
        </div>
        <div>
          <div className="text-lg font-bold">{stats.bestSet.weight}x{stats.bestSet.reps}</div>
          <div className="text-xs text-[#555]">Melhor</div>
        </div>
        <div>
          <div className="text-lg font-bold">{stats.totalWorkouts}</div>
          <div className="text-xs text-[#555]">Treinos</div>
        </div>
      </div>
    </div>
  );
}
```

**Validation:**
- Mostra PR com badge de troféu
- Mostra volume total formatado
- Mostra melhor série
- Mostra quantidade de treinos

---

### R-03: Component - PRBadge

**Goal:** Badge visual para exercícios com PR

**Implementation:**

```tsx
// components/PRBadge.tsx

import { Trophy } from 'lucide-react';

interface Props {
  weight: number;
}

export function PRBadge({ weight }: Props) {
  return (
    <div className="flex items-center gap-1 px-2 py-1 bg-[#B8956A]/20 border border-[#B8956A]/40 rounded">
      <Trophy className="w-3 h-3 text-[#B8956A]" />
      <span className="text-xs font-bold text-[#B8956A]">{weight}kg</span>
    </div>
  );
}
```

**Validation:**
- Ícone de troféu
- Cor dourada (#B8956A)
- Mostra peso do PR

---

### R-04: Navigation - Link na Planilha

**Goal:** Adicionar link para estatísticas na página de planilha

**Implementation:**

Na `planilha-progresso/page.tsx`, adicionar botão/link no header:

```tsx
<Link href="/estatisticas" className="flex items-center gap-2 text-gray-400 hover:text-white">
  <BarChart2 className="w-4 h-4" />
  <span className="text-sm">Stats</span>
</Link>
```

**Validation:**
- Link visível no header da planilha
- Navega para /estatisticas

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

- [ ] Página `/estatisticas` criada e acessível
- [ ] Lista todos os exercícios com stats
- [ ] PRs exibidos com badge de troféu
- [ ] Volume formatado (K, M)
- [ ] Link para stats na planilha
- [ ] Page carrega dados do localStorage

---

## Files to Create

```
app/src/app/estatisticas/page.tsx  (NOVO)
app/src/components/ExerciseStatsCard.tsx (NOVO)
app/src/components/PRBadge.tsx (NOVO)
app/src/components/StatsGrid.tsx (NOVO - opcional)
```

---

## Files to Modify

```
app/src/app/planilha-progresso/page.tsx  (adicionar link)
```

---

*Plan created: 2026-05-07*
*Est. 2-3 hours*