export const chapters = [
  {
    id: "00-introducao",
    title: "Introdução",
    slug: "introducao",
    order: 0,
    description: "Boas-vindas e visão geral do programa",
    isChapter: false
  },
  {
    id: "01-mentalidade-mountain-dog",
    title: "Capítulo 1: Introdução e Mentalidade Mountain Dog",
    slug: "mentalidade-mountain-dog",
    order: 1,
    description: "A filosofia de investimento em cada repetição, o objetivo de construir espessura e largura",
    part: "I"
  },
  {
    id: "02-sistema-rpe",
    title: "Capítulo 2: O Sistema de Intensidade - Dominando o RPE",
    slug: "sistema-rpe",
    order: 2,
    description: "Escala de RPE de 6 a 13 detalhada, quando deixar reps no tanque e quando ir além da falha",
    part: "I"
  },
  {
    id: "03-semana-1",
    title: "Capítulo 3: Semana 1 - Ativação e Base de Força",
    slug: "semana-1-ativacao",
    order: 3,
    description: "Foco em remadas pesadas para espessura, levantamento terra com correntes, treino de largura",
    part: "I"
  },
  {
    id: "04-semana-2",
    title: "Capítulo 4: Semana 2 - Progressão de Volume",
    slug: "semana-2-progressao",
    order: 4,
    description: "Aumento gradual do volume, feeder sets, introdução ao Rack Pull",
    part: "I"
  },
  {
    id: "05-semana-3",
    title: "Capítulo 5: Semana 3 - Pico de Contração e Drop Sets",
    slug: "semana-3-pico",
    order: 5,
    description: "Meadows Rows, Deadstop Row, hiperextensões com bandas",
    part: "I"
  },
  {
    id: "06-semana-4",
    title: "Capítulo 6: Semana 4 - Desafio de Resistência e Isolamento",
    slug: "semana-4-desafio",
    order: 6,
    description: "Challenge Set, Farmer's Walks, super-séries para pump",
    part: "I"
  },
  {
    id: "07-semana-5",
    title: "Capítulo 7: Semana 5 - Sobrecarga Máxima e Déficit",
    slug: "semana-5-sobrecarga",
    order: 7,
    description: "Pirâmides de alta repetição, Levantamento terra em déficit, Chin up Death",
    part: "I"
  },
  {
    id: "08-semana-6",
    title: "Capítulo 8: Semana 6 - A Finalização do Campeão",
    slug: "semana-6-finalizacao",
    order: 8,
    description: "Quad drop sets, superséries combinadas, ISO holds + Smith deadlift",
    part: "I"
  },
  {
    id: "09-anatomia-funcional",
    title: "Capítulo 9: Anatomia Funcional Aplicada",
    slug: "anatomia-funcional",
    order: 9,
    description: "Trapézio (superior, médio, inferior), Romboides, Latíssimo, Eretores da espinha",
    part: "II"
  },
  {
    id: "10-analise-tecnica",
    title: "Capítulo 10: Análise Técnica dos Grandes Levantamentos",
    slug: "analise-tecnica",
    order: 10,
    description: "Fases do Levantamento Terra, Biomecânica das Remadas, Puxadas e Barras",
    part: "II"
  },
  {
    id: "11-saude-ombro",
    title: "Capítulo 11: O Extra - Saúde do Ombro e Manguito Rotador",
    slug: "saude-ombro",
    order: 11,
    description: "Infraspinatus, Teres Minor, SITS - os 4 músculos do manguito rotador",
    part: "II"
  }
];

export function getChapterBySlug(slug: string) {
  return chapters.find(c => c.slug === slug);
}

export function getNextChapter(currentSlug: string) {
  const current = chapters.find(c => c.slug === currentSlug);
  if (!current) return null;
  const nextOrder = current.order + 1;
  return chapters.find(c => c.order === nextOrder);
}

export function getPrevChapter(currentSlug: string) {
  const current = chapters.find(c => c.slug === currentSlug);
  if (!current) return null;
  const prevOrder = current.order - 1;
  return chapters.find(c => c.order === prevOrder);
}