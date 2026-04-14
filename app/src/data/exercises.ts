import type { Exercise, ExerciseCategory } from '../types/exercise';

export const categories: (ExerciseCategory | 'Todas')[] = [
  'Todas',
  'Remadas',
  'Puxadas',
  'Levantamento',
  'Isolamento',
  'Funcional',
];

export const exercises: Exercise[] = [
  {
    id: 'meadows-row',
    name: 'Meadows Row',
    category: 'Remadas',
    muscles: ['Latíssimo', 'Rombóides', 'Trapézio Médio'],
    difficulty: 'Avançado',
    description: 'Remada unilateral com landmine para desenvolvimento de espessura e ângulos variados.',
    tips: ['Mantenha o core engaged', 'Controle a eccentricidade', 'Sinta a contração no lat'],
  },
  {
    id: 'one-arm-barbell-row',
    name: 'Remada Unilateral com Barra',
    category: 'Remadas',
    muscles: ['Latíssimo', 'Rombóides', 'Deltoide Posterior'],
    difficulty: 'Intermediário',
    description: 'Remada unilateral para focar cada lado individualmente e corrigir desequilíbrios.',
    tips: ['Mantenha a coluna neutra', 'Puxe com o cotovelo', 'Evite rotacionar o quadril'],
  },
  {
    id: 'smith-machine-row',
    name: 'Smith Machine Row',
    category: 'Remadas',
    muscles: ['Latíssimo', 'Rombóides', 'Eretores'],
    difficulty: 'Iniciante',
    description: 'Remada na Smith Machine com movimento controlado e descanso no fundo.',
    tips: ['Controle o peso', 'Mantenha os ombros para baixo', 'Pause no fundo'],
  },
  {
    id: 'deadstop-dumbbell-row',
    name: 'Deadstop Dumbbell Row',
    category: 'Remadas',
    muscles: ['Latíssimo', 'Rombóides'],
    difficulty: 'Intermediário',
    description: 'Remada com haltere onde cada repetição começa do zero para eliminar momentum.',
    tips: ['Toque o haltere no chão', 'Exploda na subida', 'Mantenha o tronco estável'],
  },
  {
    id: 't-bar-row',
    name: 'T-Bar Row',
    category: 'Remadas',
    muscles: ['Latíssimo', 'Trapézio Médio', 'Rombóides'],
    difficulty: 'Intermediário',
    description: 'Remada estilo old school para criar espessura nas costas.',
    tips: ['Mantenha o peito erguido', 'Puxe para o abdômen', 'Controle a descida'],
  },
  {
    id: 'rack-pull',
    name: 'Rack Pull',
    category: 'Levantamento',
    muscles: ['Eretores', 'Latíssimo', 'Trapézio'],
    difficulty: 'Avançado',
    description: 'Variação do deadlift com a barra iniciando na altura dos joelhos.',
    tips: ['Barra na altura dos joelhos', 'Engaje o posterior', 'Mantenha a barra próxima'],
  },
  {
    id: 'deficit-deadlift',
    name: 'Deficit Deadlift',
    category: 'Levantamento',
    muscles: ['Eretores', 'Latíssimo', 'Cadeia Posterior'],
    difficulty: 'Avançado',
    description: 'Deadlift com os pés elevados para aumentar a amplitude de movimento.',
    tips: ['Comece com déficit pequeno', 'Quebre a barra no chão', 'Mantenha a posição'],
  },
  {
    id: 'chin-up',
    name: 'Chin-Up (Puxada na Barra)',
    category: 'Puxadas',
    muscles: ['Latíssimo', 'Rombóides', 'Bíceps'],
    difficulty: 'Intermediário',
    description: 'Puxada com pegada supinada para desenvolvimento do lat.',
    tips: ['Pegada supinada', 'Puxe o peito à barra', 'Controle a descida'],
  },
  {
    id: 'lat-pulldown',
    name: 'Lat Pulldown',
    category: 'Puxadas',
    muscles: ['Latíssimo'],
    difficulty: 'Iniciante',
    description: 'Puxada na máquina para trabalhar o lat com foco na conexão mente-músculo.',
    tips: ['Puxe para o peito', 'Cotovelos para baixo', 'Sinta o lat trabalhar'],
  },
  {
    id: 'underhand-pulldown',
    name: 'Underhand Pulldown',
    category: 'Puxadas',
    muscles: ['Latíssimo', 'Bíceps'],
    difficulty: 'Iniciante',
    description: 'Pulldown com pegada supinada para ênfase no lat inferior.',
    tips: ['Pegada mais estreita', 'Puxe em arco', 'Segure a contração'],
  },
  {
    id: 'trx-horizontal-chin',
    name: 'TRX Horizontal Chin',
    category: 'Puxadas',
    muscles: ['Latíssimo', 'Rombóides'],
    difficulty: 'Iniciante',
    description: 'Puxada horizontal no TRX para trabalho profundo do lat.',
    tips: ['Corpo inclinado', 'Puxe com os cotovelos', 'Mantenha o corpo rígido'],
  },
  {
    id: 'face-pull',
    name: 'Face Pull',
    category: 'Isolamento',
    muscles: ['Trapézio Médio', 'Rombóides', 'Deltoide Posterior'],
    difficulty: 'Iniciante',
    description: 'Exercício para saúde do ombro e desenvolvimento do trapézio médio.',
    tips: ['Puxe para o rosto', 'Roto o ombro externamente', 'Cotovelos altos'],
  },
  {
    id: 'banded-pullover',
    name: 'Banded Pullover',
    category: 'Isolamento',
    muscles: ['Latíssimo'],
    difficulty: 'Iniciante',
    description: 'Pullover com banda para trabalho na posição alongada.',
    tips: ['Alongue o lat', 'Resistência constante', 'Controle o retorno'],
  },
  {
    id: 'dumbbell-pullover',
    name: 'Dumbbell Pullover',
    category: 'Isolamento',
    muscles: ['Latíssimo'],
    difficulty: 'Iniciante',
    description: 'Pullover com haltere para trabalho de alongamento do lat.',
    tips: ['Apóie as escápulas', 'Mantenha os braços estendidos', 'Sinta o alongamento'],
  },
  {
    id: 'hyperextension-bands',
    name: 'Hiperextensão com Bandas',
    category: 'Isolamento',
    muscles: ['Eretores', 'Glúteos'],
    difficulty: 'Iniciante',
    description: 'Hiperextensão com resistência progressiva de bandas.',
    tips: ['Movimento controlado', 'Contração nos glúteos', 'Não hiperextenda'],
  },
  {
    id: 'farmers-walk',
    name: "Farmer's Walk",
    category: 'Funcional',
    muscles: ['Trapézio Superior', 'Eretores', 'Core'],
    difficulty: 'Intermediário',
    description: 'Carregamento de peso para desenvolvimento de força de preensão e estabilidade.',
    tips: ['Ombros para trás', 'Core engaged', 'Olhar à frente'],
  },
];

export function getExercisesByCategory(category: ExerciseCategory | 'Todas'): Exercise[] {
  if (category === 'Todas') return exercises;
  return exercises.filter(ex => ex.category === category);
}

export function searchExercises(query: string): Exercise[] {
  const lower = query.toLowerCase();
  return exercises.filter(ex =>
    ex.name.toLowerCase().includes(lower) ||
    ex.muscles.some(m => m.toLowerCase().includes(lower)) ||
    ex.description.toLowerCase().includes(lower)
  );
}