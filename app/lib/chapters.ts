export const chapters = [
  {
    id: "00-introducao",
    title: "Introdução",
    slug: "introducao",
    order: 0,
    description: "Mentalidade, anatomia básica e RPE 101",
    isChapter: false
  },
  {
    id: "01-mentalidade",
    title: "PARTE I: PRÁTICA",
    slug: "mentalidade-back-discipline",
    order: 1,
    description: "6 semanas de treinamento progressivo",
    part: "I"
  },
  {
    id: "03-semana-1",
    title: "Semana 1 — Ativação e Base de Força",
    slug: "semana-1-ativacao",
    order: 2,
    description: "Remadas pesadas, levantamento terra, puxadas",
    part: "I"
  },
  {
    id: "04-semana-2",
    title: "Semana 2 — Progressão de Volume",
    slug: "semana-2-progressao",
    order: 3,
    description: "Aumento de volume, feeder sets, rack pull",
    part: "I"
  },
  {
    id: "05-semana-3",
    title: "Semana 3 — Pico de Contração",
    slug: "semana-3-pico",
    order: 4,
    description: "Meadows rows, deadstop row, drop sets",
    part: "I"
  },
  {
    id: "06-semana-4",
    title: "Semana 4 — Desafio de Resistência",
    slug: "semana-4-desafio",
    order: 5,
    description: "Challenge sets, farmer walks, super-séries",
    part: "I"
  },
  {
    id: "07-semana-5",
    title: "Semana 5 — Sobrecarga Máxima",
    slug: "semana-5-sobrecarga",
    order: 6,
    description: "Pirâmides, déficit deadlift, chin up death",
    part: "I"
  },
  {
    id: "08-semana-6",
    title: "Semana 6 — Finalização",
    slug: "semana-6-finalizacao",
    order: 7,
    description: "Quad drop sets, iso holds, smith deadlift",
    part: "I"
  },
  {
    id: "09-anatomia-funcional",
    title: "PARTE II: AVANÇADO",
    slug: "anatomia-funcional",
    order: 8,
    description: "Anatomia funcional detalhada",
    part: "II"
  },
  {
    id: "10-analise-tecnica",
    title: "Análise Biomecânica",
    slug: "analise-tecnica",
    order: 9,
    description: "Técnica dos grandes levantamentos",
    part: "II"
  },
  {
    id: "11-saude-ombro",
    title: "Saúde do Ombro e Manguito Rotador",
    slug: "saude-ombro",
    order: 10,
    description: "Prevenção de lesões e reabilitação",
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