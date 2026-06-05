import type { PlanilhaData } from '@/types/planilha';

export type MuscleGroup = 
  | 'peito'
  | 'costas'
  | 'ombro'
  | 'biceps'
  | 'triceps'
  | 'antebraco'
  | 'core'
  | 'quadriceps'
  | 'posterior'
  | 'gluteos'
  | 'panturrilha';

export interface MuscleData {
  muscle: MuscleGroup;
  intensity: number;
  workoutsThisWeek: number;
}

export const MUSCLE_DISPLAY_NAMES: Record<MuscleGroup, string> = {
  peito: 'Peito',
  costas: 'Costas',
  ombro: 'Ombro',
  biceps: 'Bíceps',
  triceps: 'Tríceps',
  antebraco: 'Antebraço',
  core: 'Core',
  quadriceps: 'Quadríceps',
  posterior: 'Posterior',
  gluteos: 'Glúteos',
  panturrilha: 'Panturrilha',
};

export const EXERCISE_MUSCLES: Record<string, MuscleGroup[]> = {
  'Remada Meadows': ['costas', 'biceps'],
  'Remada Unilateral com Barra': ['costas', 'biceps'],
  'Remada no Smith': ['costas', 'biceps'],
  'Remada Deadstop com Haltere': ['costas', 'biceps'],
  'Remada T-Bar': ['costas', 'biceps'],
  'Puxada na Barra': ['costas', 'biceps'],
  'Puxada no Cabo': ['costas', 'biceps'],
  'Remada Cavalinho': ['costas', 'biceps'],
  'Pullover': ['costas', 'peito'],
  'Supino Reto': ['peito', 'triceps', 'ombro'],
  'Supino Inclinado': ['peito', 'triceps', 'ombro'],
  'Supino Declinado': ['peito', 'triceps'],
  'Crucifix': ['peito'],
  'Pullover (Halteres)': ['peito', 'costas'],
  'Crossover': ['peito'],
  'Voador': ['peito'],
  'Elevação Lateral': ['ombro'],
  'Elevação Frontal': ['ombro'],
  'Desenvolvimento': ['ombro', 'triceps'],
  'Rotação Externa': ['ombro'],
  'Tríceps pulley': ['triceps'],
  'Tríceps testa': ['triceps'],
  'Tríceps corda': ['triceps'],
  'Tríceps máquina': ['triceps'],
  'Rosca direta': ['biceps'],
  'Rosca martelo': ['biceps'],
  'Rosca alternada': ['biceps'],
  'Rosca concentrada': ['biceps'],
  'Agachamento': ['quadriceps', 'gluteos', 'core'],
  'Leg Press': ['quadriceps', 'gluteos'],
  'Cadeira extensora': ['quadriceps'],
  'Hack Squat': ['quadriceps', 'gluteos'],
  'Stiff': ['posterior', 'gluteos'],
  'Cadeira flexora': ['posterior'],
  'Lumbar': ['posterior', 'core'],
  'Panturrilha em pé': ['panturrilha'],
  'Panturrilha sentado': ['panturrilha'],
};

export function getMusclesForExercise(exerciseName: string): MuscleGroup[] {
  return EXERCISE_MUSCLES[exerciseName] || [];
}

export function getWeeklyMuscles(planilha: PlanilhaData): Map<MuscleGroup, MuscleData> {
  const muscleMap = new Map<MuscleGroup, { count: number; workouts: Set<string> }>();

  planilha.forEach((week) => {
    week.days.forEach((day) => {
      const dayKey = day.name;
      
      day.exercises.forEach((exercise) => {
        if (!exercise.actual) return;
        
        const hasWorkout = exercise.actual.some((set) => set.weight !== undefined);
        if (!hasWorkout) return;

        const muscles = getMusclesForExercise(exercise.name);
        
        muscles.forEach((muscle) => {
          const current = muscleMap.get(muscle) || { count: 0, workouts: new Set<string>() };
          current.count++;
          current.workouts.add(dayKey);
          muscleMap.set(muscle, current);
        });
      });
    });
  });

  const result = new Map<MuscleGroup, MuscleData>();
  
  muscleMap.forEach((data, muscle) => {
    result.set(muscle, {
      muscle,
      intensity: Math.min(data.count / 3, 1),
      workoutsThisWeek: data.workouts.size,
    });
  });

  return result;
}

export function getMuscleIntensityColor(intensity: number): string {
  if (intensity === 0) return '#1E1E1E';
  if (intensity < 0.33) return '#C9A86C';
  if (intensity < 0.66) return '#B0884A';
  return '#C9A86C';
}

export function getMuscleIntensityLabel(intensity: number): string {
  if (intensity === 0) return 'Não trabalhado';
  if (intensity < 0.33) return 'Leve';
  if (intensity < 0.66) return 'Moderado';
  return 'Intenso';
}

export const BODY_SVG_PATHS: Record<MuscleGroup, string> = {
  peito: 'M 85 95 Q 95 90 105 95 L 105 115 Q 95 120 85 115 Z',
  costas: 'M 70 70 L 120 70 L 115 130 L 75 130 Z',
  ombro: 'M 65 70 Q 70 65 75 70 L 75 85 Q 70 90 65 85 Z M 115 70 Q 120 65 125 70 L 125 85 Q 120 90 115 85 Z',
  biceps: 'M 60 90 Q 65 85 70 90 L 70 110 Q 65 115 60 110 Z M 120 90 Q 125 85 130 90 L 130 110 Q 125 115 120 110 Z',
  triceps: 'M 55 95 Q 60 90 65 95 L 65 115 Q 60 120 55 115 Z M 125 95 Q 130 90 135 95 L 135 115 Q 130 120 125 115 Z',
  antebraco: 'M 50 115 L 70 115 L 68 140 L 52 140 Z M 120 115 L 140 115 L 138 140 L 122 140 Z',
  core: 'M 75 115 L 115 115 L 115 145 L 75 145 Z',
  quadriceps: 'M 75 145 L 95 145 L 93 195 L 77 195 Z M 95 145 L 115 145 L 113 195 L 97 195 Z',
  posterior: 'M 75 145 L 95 145 L 93 190 L 77 190 Z M 95 145 L 115 145 L 113 190 L 97 190 Z',
  gluteos: 'M 75 130 L 115 130 L 115 150 L 75 150 Z',
  panturrilha: 'M 77 195 L 93 195 L 92 230 L 78 230 Z M 93 195 L 113 195 L 112 230 L 98 230 Z',
};

export interface HeatmapData {
  muscles: MuscleData[];
  totalWorkouts: number;
  mostWorked: MuscleGroup | null;
  leastWorked: MuscleGroup | null;
}

export function getHeatmapData(planilha: PlanilhaData): HeatmapData {
  const weeklyMuscles = getWeeklyMuscles(planilha);
  
  const muscles: MuscleData[] = [];
  let mostWorked: MuscleGroup | null = null;
  let leastWorked: MuscleGroup | null = null;
  let maxWorkouts = 0;
  let minWorkouts = Infinity;

  weeklyMuscles.forEach((data) => {
    muscles.push(data);
    
    if (data.workoutsThisWeek > maxWorkouts) {
      maxWorkouts = data.workoutsThisWeek;
      mostWorked = data.muscle;
    }
    
    if (data.workoutsThisWeek > 0 && data.workoutsThisWeek < minWorkouts) {
      minWorkouts = data.workoutsThisWeek;
      leastWorked = data.muscle;
    }
  });

  const totalWorkouts = muscles.reduce((sum, m) => sum + m.workoutsThisWeek, 0);

  return {
    muscles,
    totalWorkouts,
    mostWorked,
    leastWorked,
  };
}