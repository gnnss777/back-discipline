# Plan: Phase 11a - Base de Dados e Funções Utilitárias

**Phase:** 11a
**Milestone:** v1.2 Análise Inteligente de Treino
**Goal:** Criar biblioteca de funções utilitárias para cálculos de progressão, detecção de platô e stats

---

## Context

### Why This Phase

Antes de implementar as 5 funcionalidades (progressão, heatmap, volume, stats, platô), precisamos criar a base de funções utilitárias que serão usadas por todas elas.

### Dependencies

- Nenhuma dependência externa (primeira fase do milestone)
- Baseado em dados existentes em `planilhaStorage` e tipos em `types/planilha.ts`

### Key Files

```
app/src/
├── lib/
│   ├── progression.ts       (NOVO) - Funções de progressão automática
│   ├── plateauDetection.ts (NOVO) - Funções de detecção de platô
│   ├── exerciseStats.ts     (NOVO) - Funções de cálculo de stats
│   └── muscleMap.ts         (NOVO) - Mapeamento de músculos do corpo
└── types/
    └── planilha.ts          (EXISTE) - Tipos de dados da planilha
```

---

## Requirements

### R-01: Library - progression.ts

**Goal:** Criar funções para calcular progressão automática de peso

**Implementation:**

```typescript
// lib/progression.ts

interface ExerciseHistory {
  exerciseName: string;
  actual: Array<{
    reps: number | undefined;
    weight: number | undefined;
    date: string;
  }>;
}

/**
 * Calcula o peso sugerido para próximo treino
 * Baseado nos últimos 2-3 registros do exercício
 */
export function calculateSuggestedWeight(
  history: ExerciseHistory[],
  exerciseName: string,
  incrementKg: number = 2.5
): number | null {
  // 1. Filtrar histórico do exercício
  // 2. Pegar últimos 2-3 registros
  // 3. Verificar se completou todas as séries
  // 4. Calcular próxima sugestão
}

/**
 * Determina se usuário completou todas as séries
 */
export function didCompleteAllSets(actual: ExerciseHistory['actual']): boolean {
  // Retorna true se todas as séries têm reps > 0
}

/**
 * Calcula média de peso do exercício
 */
export function getAverageWeight(history: ExerciseHistory[]): number {
  // Média ponderada dos últimos registros
}
```

**Validation:**

- Função retorna null se não houver histórico
- Retorna número com 1 casa decimal
- Incremento padrão: 2.5kg

---

### R-02: Library - plateauDetection.ts

**Goal:** Criar funções para detectar platô de treino

**Implementation:**

```typescript
// lib/plateauDetection.ts

interface WeeklyData {
  weekNumber: number;
  avgWeight: number;
  totalVolume: number;
}

/**
 * Detecta se usuário está em platô
 * Compara média das últimas 3 semanas com 3 semanas anteriores
 */
export function detectPlateau(
  weeklyData: WeeklyData[],
  thresholdKg: number = 2.5
): { isPlateau: boolean; difference: number } {
  // 1. Separar últimas 3 semanas vs 3 anteriores
  // 2. Calcular médias
  // 3. Comparar com threshold
  // 4. Retornar resultado
}

/**
 * Gera sugestão baseada no tipo de platô
 */
export function getPlateauSuggestion(plateauType: 'strength' | 'volume' | 'frequency'): string {
  // Retorna sugestão contextualizada
}
```

**Validation:**

- Threshold padrão: 2.5kg
- Retorna boolean + diferença numérica
- Sugestões em português

---

### R-03: Library - exerciseStats.ts

**Goal:** Criar funções para calcular stats por exercício

**Implementation:**

```typescript
// lib/exerciseStats.ts

interface ExerciseData {
  name: string;
  planned: PlannedSet[];
  actual?: ActualSet[];
}

interface ExerciseStats {
  exerciseName: string;
  personalRecord: number;      // Maior peso
  totalVolume: number;         // Soma de reps × peso
  bestSet: { weight: number; reps: number }; // Melhor combo
  totalWorkouts: number;        // Quantas vezes feito
  lastPerformed: string;       // Data do último treino
}

/**
 * Calcula stats completos para um exercício
 */
export function calculateExerciseStats(
  data: ExerciseData[]
): ExerciseStats {
  // 1.遍历 todos os registros
  // 2. Encontrar PR (maior peso)
  // 3. Calcular volume total
  // 4. Encontrar melhor série
  // 5. Contar ocorrências
}

/**
 * Calcula PR de todos os exercícios
 */
export function calculateAllPRs(planilha: PlanilhaData): Map<string, number> {
  // Retorna Map de exercício → PR
}
```

**Validation:**

- PR retorna maior peso já lifting
- Volume = reps × peso × sets
- Melhor série = maior peso × reps

---

### R-04: Library - muscleMap.ts

**Goal:** Mapeamento de músculos do corpo para heatmap

**Implementation:**

```typescript
// lib/muscleMap.ts

export type MuscleGroup = 
  | 'peito' | 'costas' | 'ombro' | 'biceps' | 'triceps' 
  | 'antebraco' | 'core' | 'quadriceps' | 'posterior' | 'gluteos' 
  | 'panturrilha';

export interface MuscleDefinition {
  id: MuscleGroup;
  name: string;
  svgPath: string; // Path do SVG do corpo
}

// Mapeamento de músculos da biblioteca de exercícios
export const EXERCISE_MUSCLES: Record<string, MuscleGroup[]> = {
  'Meadows Row': ['costas', 'biceps'],
  'Supino Reto': ['peito', 'triceps', 'ombro'],
  // ... mapeado dos exercícios existentes
};

/**
 * Retorna músculos trabalhados em um exercício
 */
export function getMusclesForExercise(exerciseName: string): MuscleGroup[] {
  return EXERCISE_MUSCLES[exerciseName] || [];
}
```

**Validation:**

- Covers all muscles from existing exercise library
- SVG paths for body diagram
- Case-insensitive matching

---

## Implementation Order

1. **progression.ts** - Funções de progressão
2. **plateauDetection.ts** - Detecção de platô
3. **exerciseStats.ts** - Cálculo de stats
4. **muscleMap.ts** - Mapeamento de músculos
5. **Testes unitários** - Validar cada função

---

## UI Changes

**Nenhuma mudança na UI nesta fase**

Esta é uma fase de base de dados. As mudanças de UI virão nas fases subsequentes (11b, 11c, 11d).

---

## Success Criteria

- [ ] Todas as 4 funções em `lib/` implementadas
- [ ] Funções retornam tipos corretos conforme especificado
- [ ] Funções tratam edge cases (sem histórico, dados vazios)
- [ ] TypeScript compila sem erros

---

## Files to Create

```
app/src/lib/
├── progression.ts       (NOVO)
├── plateauDetection.ts  (NOVO)
├── exerciseStats.ts     (NOVO)
└── muscleMap.ts        (NOVO)
```

---

## Files to Modify

Nenhum arquivo existente será modificado nesta fase.

---

*Plan created: 2026-05-07*
*Est. 3-4 hours*