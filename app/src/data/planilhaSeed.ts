// Seed data for Planilha (local MVP)
type Part = {
  weekNumber: number;
  title: string;
  days: {
    name: string;
    focus: string;
    exercises: {
      name: string;
      chapterSlug?: string;
      planned: { sets: number; reps: number; weight?: number }[];
    }[];
  }[];
}[];

const seed: Part = [
  {
    weekNumber: 1,
    title: 'Semana 1',
    days: [
      {
        name: 'Segunda',
        focus: 'Remadas + Levantamento Terra',
        exercises: [
          { name: 'Remada com Barra', chapterSlug: 'semana-1-ativacao', planned: [{ sets: 3, reps: 10, weight: 60 }] },
          { name: 'Levantamento Terra com Correntes', chapterSlug: 'semana-1-ativacao', planned: [{ sets: 3, reps: 8, weight: 120 }] },
        ],
      },
      {
        name: 'Quinta',
        focus: 'Puxadas + Pulldowns',
        exercises: [
          { name: 'Puxador Supinado', chapterSlug: 'semana-1-ativacao', planned: [{ sets: 3, reps: 10, weight: 40 }] },
          { name: 'Pulldown com Alongamento', chapterSlug: 'semana-1-ativacao', planned: [{ sets: 3, reps: 12, weight: 45 }] },
        ],
      },
      {
        name: 'S├íbado',
        focus: 'Giant Sets (Volume)',
        exercises: [
          { name: 'Pulldown Corda (Straight Arm Pulldown)', chapterSlug: 'semana-1-ativacao', planned: [{ sets: 4, reps: 12, weight: 0 }] },
          { name: 'Barra Fixa Supinada (Chin-Up)', chapterSlug: 'semana-1-ativacao', planned: [{ sets: 4, reps: 8, weight: 0 }] },
        ],
      }
    ],
  },
  {
    weekNumber: 2,
    title: 'Semana 2',
    days: [
      {
        name: 'Segunda',
        focus: 'Volume + Remadas',
        exercises: [
          { name: 'Remada com Halteres', chapterSlug: 'semana-2-progressao', planned: [{ sets: 4, reps: 8, weight: 50 }] },
          { name: 'Rack Pull', chapterSlug: 'semana-2-progressao', planned: [{ sets: 3, reps: 6, weight: 110 }] },
        ],
      },
      {
        name: 'Quinta',
        focus: 'Puxadas Variadas',
        exercises: [
          { name: 'Pulldown Corda (Straight Arm Pulldown)', chapterSlug: 'semana-2-progressao', planned: [{ sets: 3, reps: 12, weight: 40 }] },
          { name: 'Face Pull', chapterSlug: 'semana-2-progressao', planned: [{ sets: 3, reps: 15, weight: 0 }] },
        ],
      },
      {
        name: 'S├íbado',
        focus: 'Giant Sets',
        exercises: [
          { name: 'Remada Baixa (Seated Cable Row)', chapterSlug: 'semana-2-progressao', planned: [{ sets: 4, reps: 10, weight: 40 }] },
          { name: 'Remada com Kettlebell', chapterSlug: 'semana-2-progressao', planned: [{ sets: 4, reps: 8, weight: 16 }] },
        ],
      }
    ],
  },
  {
    weekNumber: 3,
    title: 'Semana 3',
    days: [
      { name: 'Segunda', focus: 'Pico de Contra├º├úo', exercises: [ { name: 'Remada Meadows', chapterSlug: 'semana-3-pico', planned: [{ sets: 4, reps: 8, weight: 40 }] } ] },
      { name: 'Quinta', focus: 'Drop Sets', exercises: [ { name: 'Puxador Supinado', chapterSlug: 'semana-3-pico', planned: [{ sets: 3, reps: 12, weight: 40 }] } ] },
      { name: 'S├íbado', focus: 'Giant Sets', exercises: [ { name: 'Pulldown Corda (Straight Arm Pulldown)', chapterSlug: 'semana-3-pico', planned: [{ sets: 4, reps: 12, weight: 0 }] } ] },
    ],
  },
  {
    weekNumber: 4,
    title: 'Semana 4',
    days: [
      { name: 'Segunda', focus: 'Desafio + Volume', exercises: [ { name: 'Desafio Remada', chapterSlug: 'semana-4-desafio', planned: [{ sets: 3, reps: 12, weight: 60 }] } ] },
      { name: 'Quinta', focus: 'Superset + ISO', exercises: [ { name: 'Pulldown com ISO Hold', chapterSlug: 'semana-4-desafio', planned: [{ sets: 3, reps: 12, weight: 40 }] } ] },
      { name: 'S├íbado', focus: 'Trisets', exercises: [ { name: 'Triset Lat', chapterSlug: 'semana-4-desafio', planned: [{ sets: 3, reps: 10, weight: 40 }] } ] },
    ],
  },
  {
    weekNumber: 5,
    title: 'Semana 5',
    days: [
      { name: 'Segunda', focus: 'Sobrecarga', exercises: [ { name: 'Remada Unilateral com Barra', chapterSlug: 'semana-5-sobrecarga', planned: [{ sets: 4, reps: 6, weight: 60 }] } ] },
      { name: 'Quinta', focus: 'Chin Up Death', exercises: [ { name: 'Chin Up Death', chapterSlug: 'semana-5-sobrecarga', planned: [{ sets: 6, reps: 6, weight: 0 }] } ] },
      { name: 'S├íbado', focus: 'Giant Sets + Lat Hang', exercises: [ { name: 'Lat Hang', chapterSlug: 'semana-5-sobrecarga', planned: [{ sets: 3, reps: 0, weight: 0 }] } ] },
    ],
  },
  {
    weekNumber: 6,
    title: 'Semana 6',
    days: [
      { name: 'Segunda', focus: 'Finaliza├º├úo', exercises: [ { name: 'Quad Drop + Superset', chapterSlug: 'semana-6-finalizacao', planned: [{ sets: 4, reps: 10, weight: 40 }] } ] },
      { name: 'Quinta', focus: 'Mega Chin Ups', exercises: [ { name: 'Chin Up Mega Death', chapterSlug: 'semana-6-finalizacao', planned: [{ sets: 9, reps: 6, weight: 0 }] } ] },
      { name: 'S├íbado', focus: 'Finish', exercises: [ { name: 'ISO Hold + Smith Deadlift', chapterSlug: 'semana-6-finalizacao', planned: [{ sets: 5, reps: 8, weight: 60 }] } ] },
    ],
  },
];

export default seed;
