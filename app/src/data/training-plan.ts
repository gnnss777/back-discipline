export interface PlanExercise {
  order: number;
  trainingDay: string; // A, B, C, D, E
  exercise: string;
  series: string; // ex: "4x12-10-8-8-6"
  reps: string;
  specification: string;
  rest: string; // ex: "2' a 3'"
  weekRange: string; // ex: "1-4", "5-8"
}

export interface WeekPlan {
  week: number;
  days: {
    day: string; // A, B, C, D, E
    focus: string;
    exercises: PlanExercise[];
  }[];
}

// Dados baseados nos PDFs modelo (Death Training / Nightmare)
export const trainingPlan: PlanExercise[] = [
  // SEMANAS 1-4 - TREINO A (Pernas)
  { order: 1, trainingDay: 'A', exercise: 'Mobilidade', series: '-', reps: '-', specification: '10 minutos antes do aquecimento', rest: '-', weekRange: '1-4' },
  { order: 2, trainingDay: 'A', exercise: 'Ostra com Mini Bands', series: '3x15+30″+15+45″', reps: '3x20', specification: '15 reps + 30″ isometria + 15 reps + 45″ em isometria', rest: '1″', weekRange: '1-4' },
  { order: 3, trainingDay: 'A', exercise: 'Cadeira abdutora + Cadeira adutora', series: '4x15+15', reps: '-', specification: 'Ativação* / bi-set', rest: '1″', weekRange: '1-4' },
  { order: 4, trainingDay: 'A', exercise: 'Agachamento Livre', series: '1x15/1x12/1x10/2x6', reps: '-', specification: '2′ a 5′', rest: '2′ a 5′', weekRange: '1-4' },
  { order: 5, trainingDay: 'A', exercise: 'Mesa flexora', series: '1x15/3x12-10-8-8-6', reps: '-', specification: '2′ a 3′', rest: '2′ a 3′', weekRange: '1-4' },
  { order: 6, trainingDay: 'A', exercise: 'Sumô com Halteres', series: '4x12', reps: '-', specification: '2′ a 3′', rest: '2′ a 3′', weekRange: '1-4' },
  { order: 7, trainingDay: 'A', exercise: 'Elevação Pélvica', series: '2x10/2x5', reps: '-', specification: 'Fazer livre ou no smith / controlando fase negativa', rest: '2′ a 4′', weekRange: '1-4' },
  { order: 8, trainingDay: 'A', exercise: 'Cadeira flexora', series: '4x12', reps: '-', specification: '2′', rest: '2′', weekRange: '1-4' },
  { order: 9, trainingDay: 'A', exercise: 'Afundo Andando', series: '4x20 passos', reps: '-', specification: '20 passos c/ cada perna', rest: '2′', weekRange: '1-4' },

  // SEMANAS 1-4 - TREINO B (Peito)
  { order: 1, trainingDay: 'B', exercise: 'Mobilidade', series: '-', reps: '-', specification: '10 minutos antes do aquecimento', rest: '-', weekRange: '1-4' },
  { order: 2, trainingDay: 'B', exercise: 'Manguito rotador', series: '3x15', reps: '-', specification: 'No cabo', rest: '1″', weekRange: '1-4' },
  { order: 3, trainingDay: 'B', exercise: 'Supino inclinado barra livre', series: '2x15/2x10/1x8', reps: '-', specification: '2′ a 4′', rest: '2′ a 4′', weekRange: '1-4' },
  { order: 4, trainingDay: 'B', exercise: 'Supino reto máquina', series: '1x12/2x10/1x10-8-8-6', reps: '-', specification: '2′ a 4′', rest: '2′ a 4′', weekRange: '1-4' },
  { order: 5, trainingDay: 'B', exercise: 'Crucifixo máquina', series: '4x12 a 15', reps: '-', specification: '2′', rest: '2′', weekRange: '1-4' },
  { order: 6, trainingDay: 'B', exercise: 'Supino declinado', series: '2x12/2x10', reps: '-', specification: '2′ a 3′', rest: '2′ a 3′', weekRange: '1-4' },
  { order: 7, trainingDay: 'B', exercise: 'Cross Over', series: '2x15/2x12', reps: '-', specification: 'Pegada neutra / saindo do zero em todas repetições', rest: '2′', weekRange: '1-4' },
  { order: 8, trainingDay: 'B', exercise: 'Supino reto com Halteres', series: '2x10', reps: '-', specification: '2′', rest: '2′', weekRange: '1-4' },

  // SEMANAS 1-4 - TREINO C (Costas)
  { order: 1, trainingDay: 'C', exercise: 'Mobilidade', series: '-', reps: '-', specification: '10 minutos antes do aquecimento', rest: '-', weekRange: '1-4' },
  { order: 2, trainingDay: 'C', exercise: 'Puxador frente', series: '4x12 a 15', reps: '-', specification: 'Pegada pronada', rest: '2′ a 3′', weekRange: '1-4' },
  { order: 3, trainingDay: 'C', exercise: 'Puxador frente com triângulo', series: '1x15/3x10', reps: '-', specification: '2′ a 3′', rest: '2′ a 3′', weekRange: '1-4' },
  { order: 4, trainingDay: 'C', exercise: 'Remada cavalinho', series: '1x15/1x12/2x10/1x6', reps: '-', specification: '2′ a 5′', rest: '2′ a 5′', weekRange: '1-4' },
  { order: 5, trainingDay: 'C', exercise: 'Remada unilateral com Halteres', series: '3x12', reps: '-', specification: '2′ a 3′', rest: '2′ a 3′', weekRange: '1-4' },
  { order: 6, trainingDay: 'C', exercise: 'Levantamento Terra', series: '1x15/1x10/1x5/2x3', reps: '-', specification: '3′ a 5′', rest: '3′ a 5′', weekRange: '1-4' },
  { order: 7, trainingDay: 'C', exercise: 'Pull Down', series: '3x12', reps: '-', specification: 'Focar na execução', rest: '2′', weekRange: '1-4' },
  { order: 8, trainingDay: 'C', exercise: 'Prancha lateral', series: '4x1′', reps: '-', specification: '4x1′', rest: '1″', weekRange: '1-4' },

  // SEMANAS 1-4 - TREINO D (Ombros)
  { order: 1, trainingDay: 'D', exercise: 'Mobilidade', series: '-', reps: '-', specification: '10 minutos antes do aquecimento', rest: '-', weekRange: '1-4' },
  { order: 2, trainingDay: 'D', exercise: 'Desenvolvimento máquina', series: '2x15/1x10/2x8', reps: '-', specification: 'Se não tiver opção de máquina fazer com Halteres', rest: '2′ a 4′', weekRange: '1-4' },
  { order: 3, trainingDay: 'D', exercise: 'Elevação frontal com Halteres', series: '4x12', reps: '-', specification: 'Pegada neutra / unilateral', rest: '1′ a 2′', weekRange: '1-4' },
  { order: 4, trainingDay: 'D', exercise: 'Elevação lateral com Halteres', series: '2x15/2x12', reps: '-', specification: '2′', rest: '2′', weekRange: '1-4' },
  { order: 5, trainingDay: 'D', exercise: 'Elevação unilateral no cabo', series: '4x12', reps: '-', specification: '1′ a 2′', rest: '1′ a 2′', weekRange: '1-4' },
  { order: 6, trainingDay: 'D', exercise: 'Crucifixo inverso no cabo', series: '4x12 a 15', reps: '-', specification: '2′', rest: '2′', weekRange: '1-4' },
  { order: 7, trainingDay: 'D', exercise: 'Remada alta com barra', series: '3x12', reps: '-', specification: 'Polia pouco mais alta que os ombros', rest: '2′', weekRange: '1-4' },
  { order: 8, trainingDay: 'D', exercise: 'Encolhimento + Farmer Walk', series: '4x15 a 20 + 1′', reps: '-', specification: 'Em pé', rest: '1′ a 2′', weekRange: '1-4' },

  // SEMANAS 1-4 - TREINO E (Braços)
  { order: 1, trainingDay: 'E', exercise: 'Mobilidade', series: '-', reps: '-', specification: '10 minutos antes do aquecimento', rest: '-', weekRange: '1-4' },
  { order: 2, trainingDay: 'E', exercise: 'Rosca no banco 45°', series: '1x15/1x12/3x10', reps: '4x20', specification: 'Com Halteres e sentado no banco', rest: '2′', weekRange: '1-4' },
  { order: 3, trainingDay: 'E', exercise: 'Rosca direta no banco inclinado', series: '2x15/3x10', reps: '-', specification: 'Com barra W / peito no banco', rest: '2′', weekRange: '1-4' },
  { order: 4, trainingDay: 'E', exercise: 'Rosca Scott máquina', series: '4x10-8-8-6', reps: '-', specification: '2′', rest: '2′', weekRange: '1-4' },
  { order: 5, trainingDay: 'E', exercise: 'Tríceps corda', series: '2x15/3x10-8-8-6', reps: '-', specification: '2′', rest: '2′', weekRange: '1-4' },
  { order: 6, trainingDay: 'E', exercise: 'Tríceps testa com Halteres', series: '1x15/2x12/2x10', reps: '-', specification: 'Esperar os halteres tocarem nos ombros', rest: '2′', weekRange: '1-4' },
  { order: 7, trainingDay: 'E', exercise: 'Tríceps coice no cabo', series: '1x15/4x12', reps: '-', specification: 'Com corda / drop set', rest: '2′', weekRange: '1-4' },
  { order: 8, trainingDay: 'E', exercise: 'Gêmeos sentado', series: '4x20', reps: '-', specification: '1′', rest: '1′', weekRange: '1-4' },
  { order: 9, trainingDay: 'E', exercise: 'Gêmeos em pé', series: '4x20', reps: '-', specification: '1′', rest: '1′', weekRange: '1-4' },

  // SEMANAS 5-8 - TREINO A (Pernas)
  { order: 1, trainingDay: 'A', exercise: 'Mobilidade', series: '-', reps: '-', specification: '10 minutos antes do aquecimento', rest: '-', weekRange: '5-8' },
  { order: 2, trainingDay: 'A', exercise: 'Ostra com Mini Bands', series: '3x15+30″+15+45″', reps: '3x12 a 15', specification: '15 reps + 30″ isometria + 15 reps + 45″ em isometria', rest: '1″', weekRange: '5-8' },
  { order: 3, trainingDay: 'A', exercise: 'Cadeira abdutora + Cadeira adutora', series: '4x15+15', reps: '-', specification: 'Ativação* / bi-set', rest: '1″', weekRange: '5-8' },
  { order: 4, trainingDay: 'A', exercise: 'Agachamento Frontal', series: '2x15/3x10', reps: '-', specification: '2′ a 5′', rest: '2′ a 5′', weekRange: '5-8' },
  { order: 5, trainingDay: 'A', exercise: 'Mesa flexora', series: '1x15/3x12', reps: '-', specification: '2′ a 3′', rest: '2′ a 3′', weekRange: '5-8' },
  { order: 6, trainingDay: 'A', exercise: 'Leg Press 45°', series: '3x20 (5-5-5-5)', reps: '-', specification: '2′ a 4′', rest: '2′ a 4′', weekRange: '5-8' },
  { order: 7, trainingDay: 'A', exercise: 'Elevação Pélvica', series: '2x10/2x8', reps: '-', specification: 'Fazer livre ou no smith / drop set', rest: '2′ a 3′', weekRange: '5-8' },
  { order: 8, trainingDay: 'A', exercise: 'Cadeira extensora', series: '3x12-10-8-8-6', reps: '-', specification: '2′', rest: '2′', weekRange: '5-8' },
  { order: 9, trainingDay: 'A', exercise: 'Bom Dia', series: '3x12', reps: '-', specification: '2′', rest: '2′', weekRange: '5-8' },

  // SEMANAS 5-8 - TREINO B (Peito)
  { order: 1, trainingDay: 'B', exercise: 'Mobilidade', series: '-', reps: '-', specification: '10 minutos antes do aquecimento', rest: '-', weekRange: '5-8' },
  { order: 2, trainingDay: 'B', exercise: 'Manguito rotador', series: '3x15', reps: '-', specification: 'No cabo', rest: '1″', weekRange: '5-8' },
  { order: 3, trainingDay: 'B', exercise: 'Supino levemente declinado com Halteres', series: '2x15/3x10', reps: '-', specification: '2′ a 3′', rest: '2′ a 3′', weekRange: '5-8' },
  { order: 4, trainingDay: 'B', exercise: 'Supino inclinado com Halteres', series: '1x12/2x10/1x8', reps: '-', specification: '2′ a 4′', rest: '2′ a 4′', weekRange: '5-8' },
  { order: 5, trainingDay: 'B', exercise: 'Supino inclinado no Smith', series: '1x10/2x8', reps: '-', specification: '2′ a 4′', rest: '2′ a 4′', weekRange: '5-8' },
  { order: 6, trainingDay: 'B', exercise: 'Crucifixo inclinado com Halteres', series: '4x12', reps: '-', specification: '2′', rest: '2′', weekRange: '5-8' },
  { order: 7, trainingDay: 'B', exercise: 'Cross Over sentado', series: '4x12', reps: '-', specification: 'Com banco / polia na altura dos ombros', rest: '2′', weekRange: '5-8' },
  { order: 8, trainingDay: 'B', exercise: 'Gêmeos em pé', series: '4x20', reps: '-', specification: '1′', rest: '1′', weekRange: '5-8' },

  // SEMANAS 5-8 - TREINO C (Costas)
  { order: 1, trainingDay: 'C', exercise: 'Mobilidade', series: '-', reps: '-', specification: '10 minutos antes do aquecimento', rest: '-', weekRange: '5-8' },
  { order: 2, trainingDay: 'C', exercise: 'Barra fixa', series: '4x12 a 15', reps: '-', specification: 'Parceiro ajudar nos pés', rest: '2′', weekRange: '5-8' },
  { order: 3, trainingDay: 'C', exercise: 'Puxador frente', series: '1x15/3x12', reps: '-', specification: 'Pegada supinada', rest: '2′', weekRange: '5-8' },
  { order: 4, trainingDay: 'C', exercise: 'Remada Chinesa', series: '1x12/3x10', reps: '-', specification: '2′ a 4′', rest: '2′ a 4′', weekRange: '5-8' },
  { order: 5, trainingDay: 'C', exercise: 'Remada baixa com triângulo', series: '1x12/2x10', reps: '-', specification: '2′ a 3′', rest: '2′ a 3′', weekRange: '5-8' },
  { order: 6, trainingDay: 'C', exercise: 'Levantamento Terra', series: '1x15/1x12/1x8/2x5', reps: '-', specification: '3′ a 5′', rest: '3′ a 5′', weekRange: '5-8' },
  { order: 7, trainingDay: 'C', exercise: 'Extensão Lombar', series: '3x10', reps: '-', specification: 'Fazer no banco romano ou GHD', rest: '1″', weekRange: '5-8' },
  { order: 8, trainingDay: 'C', exercise: 'Prancha ventral', series: '4x1′', reps: '-', specification: '4x1′', rest: '1″', weekRange: '5-8' },

  // SEMANAS 5-8 - TREINO D (Ombros)
  { order: 1, trainingDay: 'D', exercise: 'Mobilidade', series: '-', reps: '-', specification: '10 minutos antes do aquecimento', rest: '-', weekRange: '5-8' },
  { order: 2, trainingDay: 'D', exercise: 'Desenvolvimento máquina', series: '2x15/3x12', reps: '-', specification: 'Se não tiver opção de máquina fazer com Halteres', rest: '2′ a 4′', weekRange: '5-8' },
  { order: 3, trainingDay: 'D', exercise: 'Elevação frontal com corda', series: '4x12', reps: '-', specification: 'Pegada neutra', rest: '1′ a 2′', weekRange: '5-8' },
  { order: 4, trainingDay: 'D', exercise: 'Elevação lateral com Halteres', series: '4x12-10-8-6', reps: '-', specification: '2′', rest: '2′', weekRange: '5-8' },
  { order: 5, trainingDay: 'D', exercise: 'Elevação lateral no cabo com banco', series: '4x12', reps: '-', specification: '2′', rest: '2′', weekRange: '5-8' },
  { order: 6, trainingDay: 'D', exercise: 'Crucifixo inverso máquina', series: '4x12 a 15', reps: '-', specification: '2′', rest: '2′', weekRange: '5-8' },
  { order: 7, trainingDay: 'D', exercise: 'Rotação externa de ombros no cabo', series: '3x12 a 15', reps: '-', specification: 'Pegada supinada / sentado', rest: '1′', weekRange: '5-8' },
  { order: 8, trainingDay: 'D', exercise: 'Encolhimento + Farmer Walk', series: '4x15 a 20 + 1′', reps: '-', specification: 'Em pé', rest: '1′ a 2′', weekRange: '5-8' },

  // SEMANAS 5-8 - TREINO E (Braços)
  { order: 1, trainingDay: 'E', exercise: 'Mobilidade', series: '-', reps: '-', specification: '10 minutos antes do aquecimento', rest: '-', weekRange: '5-8' },
  { order: 2, trainingDay: 'E', exercise: 'Rosca superman unilateral no cabo', series: '2x15/3x12', reps: '4x20', specification: '2′', rest: '2′', weekRange: '5-8' },
  { order: 3, trainingDay: 'E', exercise: 'Rosca direta no banco inclinado', series: '2x15/3x10', reps: '-', specification: 'Com barra W', rest: '2′ a 3′', weekRange: '5-8' },
  { order: 4, trainingDay: 'E', exercise: 'Rosca alternada com Halteres', series: '2x15/3x12', reps: '-', specification: '2′', rest: '2′', weekRange: '5-8' },
  { order: 5, trainingDay: 'E', exercise: 'Tríceps francês no cabo', series: '2x15/3x12', reps: '-', specification: 'Com corda', rest: '2′', weekRange: '5-8' },
  { order: 6, trainingDay: 'E', exercise: 'Tríceps testa com barra W', series: '1x15/2x12/2x10', reps: '-', specification: '2′ a 3′', rest: '2′ a 3′', weekRange: '5-8' },
  { order: 7, trainingDay: 'E', exercise: 'Extensão de Tríceps', series: '1x15/4x12-10-8-8', reps: '-', specification: 'Drop set / pegada pronada', rest: '2′', weekRange: '5-8' },
  { order: 8, trainingDay: 'E', exercise: 'Gêmeos sentado', series: '4x20', reps: '-', specification: '1′', rest: '1′', weekRange: '5-8' },
  { order: 9, trainingDay: 'E', exercise: 'Gêmeos em pé', series: '4x20', reps: '-', specification: '1′', rest: '1′', weekRange: '5-8' },
];

// Função para filtrar por semana
export function getPlanByWeek(week: number): PlanExercise[] {
  return trainingPlan.filter(ex => {
    const [start, end] = ex.weekRange.split('-').map(w => parseInt(w));
    return week >= start && week <= end;
  });
}

// Função para filtrar por treino
export function getPlanByTrainingDay(week: number, day: string): PlanExercise[] {
  return trainingPlan.filter(ex => {
    const [start, end] = ex.weekRange.split('-').map(w => parseInt(w));
    return week >= start && week <= end && ex.trainingDay === day;
  });
}

// Configuração da divisão da semana
export const weekStructure = {
  days: [
    { day: 'Segunda', trainingDay: 'A', focus: 'Pernas' },
    { day: 'Terça', trainingDay: 'B', focus: 'Peito/Ombros/Tríceps' },
    { day: 'Quarta', trainingDay: 'C', focus: 'Costas' },
    { day: 'Quinta', trainingDay: 'D', focus: 'Ombros' },
    { day: 'Sexta', trainingDay: 'E', focus: 'Braços' },
    { day: 'Sábado', trainingDay: 'OFF', focus: 'Descanso' },
    { day: 'Domingo', trainingDay: 'OFF', focus: 'Descanso' },
  ]
};
