# Plan: Phase 11d - Progressão Automática e Detecção de Platô

**Phase:** 11d
**Milestone:** v1.2 Análise Inteligente de Treino
**Goal:** Adicionar sugestão automática de peso e alertas de platô

---

## Context

### Why This Phase

Última fase do milestone - adicionar inteligência ao app que sugere cargas e detecta estagnação.

### Dependencies

- Phase 11a (lib/progression.ts, lib/plateauDetection.ts)
- Phase 11b (página de stats)
- Phase 11c (dashboard components)

### Key Files

```
app/src/
├── components/
│   ├── ProgressSuggestion.tsx   (NOVO) - Sugestão de peso na planilha
│   └── PlateauAlert.tsx         (NOVO) - Alerta de platô no dashboard
├── app/
│   ├── planilha-progresso/
│   │   └── page.tsx        (MODIFICAR) - Adicionar sugestões
│   └── dashboard/
│       └── page.tsx        (MODIFICAR) - Adicionar alertas
```

---

## Requirements

### R-01: Component - ProgressSuggestion

**Goal:** Mostrar sugestão de peso automaticamente quando usuário abre exercício

**Implementation:**

```tsx
// components/ProgressSuggestion.tsx

import { calculateSuggestedWeight, type ProgressSuggestion } from '@/lib/progression';

interface Props {
  exerciseName: string;
  planilha: PlanilhaData;
}

export function ProgressSuggestion({ exerciseName, planilha }: Props) {
  const suggestion = calculateSuggestedWeight(planilha, exerciseName);
  
  if (!suggestion) return null;
  
  return (
    <div className={`mt-2 p-2 rounded text-xs ${
      suggestion.completedAllSets 
        ? 'bg-green-900/30 border border-green-800' 
        : 'bg-[#222] border border-[#333]'
    }`}>
      <div className="flex items-center justify-between">
        <span className="text-[#555]">Sugestão:</span>
        <span className="font-bold text-[#B8956A]">{suggestion.suggestedWeight}kg</span>
      </div>
      {suggestion.completedAllSets && (
        <span className="text-green-400 text-[10px]">
          +{suggestion.increment}kg baseado no último treino
        </span>
      )}
    </div>
  );
}
```

**Validation:**
- Aparece quando usuário abre exercício na planilha
- Mostra peso sugerido com destaque
- Indica se baseado em progresso ou manutenção

---

### R-02: Component - PlateauAlert

**Goal:** Alerta visual quando usuário está em platô

**Implementation:**

```tsx
// components/PlateauAlert.tsx

import { AlertTriangle, Lightbulb } from 'lucide-react';
import { detectAllPlateaus } from '@/lib/plateauDetection';

interface Props {
  planilha: PlanilhaData | null;
}

export function PlateauAlert({ planilha }: Props) {
  if (!planilha) return null;
  
  const plateaus = detectAllPlateaus(planilha);
  
  if (plateaus.length === 0) return null;
  
  return (
    <div className="p-4 bg-[#111] border border-yellow-800 rounded-lg mb-4">
      <div className="flex items-center gap-2 mb-2">
        <AlertTriangle className="w-4 h-4 text-yellow-500" />
        <span className="text-sm font-bold text-yellow-500 tracking-wider">
          PLATÔ DETECTADO
        </span>
      </div>
      <p className="text-xs text-[#777] mb-2">
        Você está em platô em {plateaus.length} exercício(s):
      </p>
      <ul className="text-xs text-[#555] space-y-1 mb-3">
        {plateaus.map(p => (
          <li key={p.exerciseName} className="flex items-center justify-between">
            <span>{p.exerciseName}</span>
            <span className="text-yellow-600">{p.suggestion}</span>
          </li>
        ))}
      </ul>
      <div className="flex items-center gap-1 text-[10px] text-[#555]">
        <Lightbulb className="w-3 h-3" />
        <span>Dica: Varie o exercício ou aumente as repetições</span>
      </div>
    </div>
  );
}
```

**Validation:**
- Aparece apenas se detectar platô
- Lista exercícios em platô
- Mostra sugestão personalizada

---

### R-03: Planilha Integration - Sugestão de Peso

**Goal:** Adicionar sugestão de peso no input quando exercício é aberto

**Modification in** `planilha-progresso/page.tsx`:

Adicionar componente `ProgressSuggestion` no formulário de edição de exercício.

```tsx
// No campo de peso, adicionar:
// <ProgressSuggestion exerciseName={ex.name} planilha={data} />
```

**Validation:**
- Sugestão aparece abaixo do input de peso
- Usuário pode aceitar ou alterar
- Não força a sugestão

---

### R-04: Dashboard Integration - Alerta de Platô

**Goal:** Adicionar alerta de platô no dashboard

**Modification in** `dashboard/page.tsx`:

Adicionar componente `PlateauAlert` após "Sua Jornada" e antes dos cards de ação.

```tsx
// <PlateauAlert planilha={planilhaData} />
```

**Validation:**
- Alerta visível no dashboard
- Aparece apenas quando há platô
- Lista exercícios afetados

---

## UI Design

**Alinhado com UI atual:**
- Background: `#0A0A0A`
- Cards: `#111` com borda `#333`
- Accent: `#B8956A` (dourado)
- Alerta platô: borda e texto amarelo

---

## Success Criteria

- [ ] ProgressSuggestion mostra peso sugerido na planilha
- [ ] Sugestão aparece quando exercício é editado
- [ ] PlateauAlert detecta platô corretamente
- [ ] Alerta mostra sugestões de melhoria
- [ ] Ambos integrados na UI
- [ ] Design alinhado com UI existente

---

## Files to Create

```
app/src/components/ProgressSuggestion.tsx  (NOVO)
app/src/components/PlateauAlert.tsx        (NOVO)
```

---

## Files to Modify

```
app/src/app/planilha-progresso/page.tsx  (adicionar ProgressSuggestion)
app/src/app/dashboard/page.tsx           (adicionar PlateauAlert)
```

---

*Plan created: 2026-05-07*
*Est. 2-3 hours*