// ============================================================
// GRUPOS DE CAPÍTULOS — usados para exibição agrupada em /livro
// Cada grupo contém uma lista de slugs de capítulos filhos.
// ============================================================

export interface ChapterGroup {
  id: string;
  title: string;
  description: string;
  part: string;
  order: number;
  children: string[]; // slugs
}

export interface Chapter {
  id: string;
  title: string;
  slug: string;
  order: number;
  description: string;
  part?: string;
  isChapter?: boolean;
}

export const chapters: Chapter[] = [
  // ── Introdução ──
  {
    id: "00-introducao",
    title: "Introdução",
    slug: "introducao",
    order: 0,
    description: "Boas-vindas e visão geral do programa",
    isChapter: false,
  },

  // ── Cap. 1: Mentalidade (2 subcapítulos) ──
  {
    id: "01-mentalidade-principios",
    title: "1.1 — Princípios Back Discipline",
    slug: "mentalidade-principios",
    order: 1,
    description: "A filosofia do investimento em cada repetição e a conexão mente-músculo",
    part: "I",
  },
  {
    id: "01-mentalidade-objetivos",
    title: "1.2 — Objetivos e Técnica",
    slug: "mentalidade-objetivos",
    order: 2,
    description: "Espessura, largura e a importância da técnica inteligente",
    part: "I",
  },

  // ── Cap. 2: Sistema RPE (4 subcapítulos) ──
  {
    id: "02-rpe-basico",
    title: "2.1 — Escala RPE",
    slug: "rpe-basico",
    order: 3,
    description: "O que é RPE, a escala de 6 a 13, quando deixar repetições no tanque",
    part: "I",
  },
  {
    id: "02-rpe-drop-rest-pause",
    title: "2.2 — Drop Set, Rest-Pause e Cluster",
    slug: "rpe-drop-rest-pause",
    order: 4,
    description: "Técnicas de série única para alta intensidade",
    part: "I",
  },
  {
    id: "02-rpe-feeder-challenge",
    title: "2.3 — Feeder Set, Challenge Set e Giant Set",
    slug: "rpe-feeder-challenge",
    order: 5,
    description: "Técnicas de volume e pré-ativação muscular",
    part: "I",
  },
  {
    id: "02-rpe-iso-forced",
    title: "2.4 — ISO Hold e Repetições Forçadas",
    slug: "rpe-iso-forced",
    order: 6,
    description: "Técnicas de finalização para extrair o máximo de cada série",
    part: "I",
  },

  // ── Semana 1 ──
  {
    id: "03-semana-1-visao-geral",
    title: "3.1 — Visão Geral e Preparação",
    slug: "semana-1-visao-geral",
    order: 7,
    description: "Objetivos da Semana 1: ativação, base de força e fundação do programa",
    part: "I",
  },
  {
    id: "03-semana-1-segunda",
    title: "3.2 — Segunda: Remadas + Levantamento Terra",
    slug: "semana-1-segunda",
    order: 8,
    description: "Remada unilateral, Smith Row, remada com halteres e terra com correntes",
    part: "I",
  },
  {
    id: "03-semana-1-quinta",
    title: "3.3 — Quinta: Puxadas e Alongamento",
    slug: "semana-1-quinta",
    order: 9,
    description: "Pulldowns, Hammer Strength High Row e pull-over com banda",
    part: "I",
  },
  {
    id: "03-semana-1-sabado",
    title: "3.4 — Sábado: Giant Sets",
    slug: "semana-1-sabado",
    order: 10,
    description: "4 rodadas de pulldown corda, barra fixa, remada baixa e kettlebell row",
    part: "I",
  },

  // ── Semana 2 ──
  {
    id: "04-semana-2-visao-geral",
    title: "4.1 — Visão Geral e Preparação",
    slug: "semana-2-visao-geral",
    order: 11,
    description: "Progressão de volume, feeder sets e introdução ao Rack Pull",
    part: "I",
  },
  {
    id: "04-semana-2-segunda",
    title: "4.2 — Segunda: Volume + Rack Pull",
    slug: "semana-2-segunda",
    order: 12,
    description: "Remada com halteres, D.Y. Row, remada com correntes e Rack Pull",
    part: "I",
  },
  {
    id: "04-semana-2-quinta",
    title: "4.3 — Quinta: Puxadas Variadas",
    slug: "semana-2-quinta",
    order: 13,
    description: "Away facing pulldown, underhand pulldown, chin-ups com 3 pegadas",
    part: "I",
  },
  {
    id: "04-semana-2-sabado",
    title: "4.4 — Sábado: Giant Sets + Face Pulls",
    slug: "semana-2-sabado",
    order: 14,
    description: "Pulldown corda, remada baixa, kettlebell row e Face Pulls",
    part: "I",
  },

  // ── Semana 3 ──
  {
    id: "05-semana-3-visao-geral",
    title: "5.1 — Visão Geral e Preparação",
    slug: "semana-3-visao-geral",
    order: 15,
    description: "Técnicas de alta intensidade: Meadows Row, drop sets e Deadstop Row",
    part: "I",
  },
  {
    id: "05-semana-3-segunda",
    title: "5.2 — Segunda: Meadows Rows + Contrações",
    slug: "semana-3-segunda",
    order: 16,
    description: "Meadows Row, EZ Bar Cable Row, Deadstop Dumbbell Row, hiperextensão",
    part: "I",
  },
  {
    id: "05-semana-3-quinta",
    title: "5.3 — Quinta: Puxadas com ISO Holds",
    slug: "semana-3-quinta",
    order: 17,
    description: "Puxador supinado, ISO hold, encolhimento com banda, TRX horizontal",
    part: "I",
  },
  {
    id: "05-semana-3-sabado",
    title: "5.4 — Sábado: Giant Sets + Stretchers",
    slug: "semana-3-sabado",
    order: 18,
    description: "Pulldown corda, Face Pull, kettlebell row e Stretcher",
    part: "I",
  },

  // ── Semana 4 ──
  {
    id: "06-semana-4-visao-geral",
    title: "6.1 — Visão Geral e Preparação",
    slug: "semana-4-visao-geral",
    order: 19,
    description: "Pico de volume: Challenge Set, Rest-Pause e Farmer's Walk",
    part: "I",
  },
  {
    id: "06-semana-4-segunda",
    title: "6.2 — Segunda: Desafio + Volume Máximo",
    slug: "semana-4-segunda",
    order: 20,
    description: "Meadows Row Challenge Set, T-Bar Rest-Pause, Farmer's Walk",
    part: "I",
  },
  {
    id: "06-semana-4-quinta",
    title: "6.3 — Quinta: Superset + ISO",
    slug: "semana-4-quinta",
    order: 21,
    description: "Puxador unilateral, superset away+toward, pull-over, TRX",
    part: "I",
  },
  {
    id: "06-semana-4-sabado",
    title: "6.4 — Sábado: Trisets",
    slug: "semana-4-sabado",
    order: 22,
    description: "Remada pronada + halteres + Face Pull e puxador neutro + trap bar + Stretcher",
    part: "I",
  },

  // ── Semana 5 ──
  {
    id: "07-semana-5-visao-geral",
    title: "7.1 — Visão Geral e Preparação",
    slug: "semana-5-visao-geral",
    order: 23,
    description: "Sobrecarga máxima: pirâmide lenta, terra com déficit e Chin Up Death",
    part: "I",
  },
  {
    id: "07-semana-5-segunda",
    title: "7.2 — Segunda: Sobrecarga + Déficit",
    slug: "semana-5-segunda",
    order: 24,
    description: "Pirâmide lenta, Smith Rest-Pause Triple Drop, T-Bar Tom Platz, déficit",
    part: "I",
  },
  {
    id: "07-semana-5-quinta",
    title: "7.3 — Quinta: Chin Up Death",
    slug: "semana-5-quinta",
    order: 25,
    description: "6 séries de barra fixa até a falha (2 ampla, 2 média, 2 estreita)",
    part: "I",
  },
  {
    id: "07-semana-5-sabado",
    title: "7.4 — Sábado: Giant Sets + Lat Hang",
    slug: "semana-5-sabado",
    order: 26,
    description: "25 séries: Smith Row, pull-over, kettlebell row, Face Pull e Lat Hang",
    part: "I",
  },

  // ── Semana 6 ──
  {
    id: "08-semana-6-visao-geral",
    title: "8.1 — Visão Geral e Preparação",
    slug: "semana-6-visao-geral",
    order: 27,
    description: "Clímax do programa: Quad Drop, Mega Chin Up Death e ISO Hold + Smith",
    part: "I",
  },
  {
    id: "08-semana-6-segunda",
    title: "8.2 — Segunda: Quad Drop + Superset",
    slug: "semana-6-segunda",
    order: 28,
    description: "Quad Drop Set, supersérie remada unilateral + Meadows, remada elevada",
    part: "I",
  },
  {
    id: "08-semana-6-quinta",
    title: "8.3 — Quinta: Mega Chin Up Death",
    slug: "semana-6-quinta",
    order: 29,
    description: "9 séries de barra fixa (3 ampla, 3 média, 3 estreita)",
    part: "I",
  },
  {
    id: "08-semana-6-sabado",
    title: "8.4 — Sábado: Finalização",
    slug: "semana-6-sabado",
    order: 30,
    description: "Trisets finais, ISO Hold + Smith Deadlift — o finalizador final",
    part: "I",
  },

  // ── Parte II ──
  {
    id: "09-anatomia-funcional",
    title: "Capítulo 9: Anatomia Funcional Aplicada",
    slug: "anatomia-funcional",
    order: 31,
    description: "Trapézio (superior, médio, inferior), Romboides, Latíssimo, Eretores da espinha",
    part: "II",
  },
  {
    id: "10-analise-tecnica",
    title: "Capítulo 10: Análise Técnica dos Grandes Levantamentos",
    slug: "analise-tecnica",
    order: 32,
    description: "Fases do Levantamento Terra, Biomecânica das Remadas, Puxadas e Barras",
    part: "II",
  },
  {
    id: "11-saude-ombro",
    title: "Capítulo 11: Saúde do Ombro e Manguito Rotador",
    slug: "saude-ombro",
    order: 33,
    description: "Infraspinatus, Teres Minor, SITS - os 4 músculos do manguito rotador",
    part: "II",
  },
];

// ============================================================
// GRUPOS — definem agrupamento de subcapítulos na UI
// ============================================================
export const chapterGroups: ChapterGroup[] = [
  {
    id: "mentalidade",
    title: "Capítulo 1: Mentalidade Back Discipline",
    description: "A filosofia de investimento em cada repetição, o objetivo de construir espessura e largura",
    part: "I",
    order: 1,
    children: ["mentalidade-principios", "mentalidade-objetivos"],
  },
  {
    id: "sistema-rpe",
    title: "Capítulo 2: Sistema de Intensidade — RPE 6 a 13",
    description: "Escala de RPE detalhada e arsenal completo de técnicas de intensidade",
    part: "I",
    order: 2,
    children: ["rpe-basico", "rpe-drop-rest-pause", "rpe-feeder-challenge", "rpe-iso-forced"],
  },
  {
    id: "semana-1",
    title: "Semana 1 — Ativação e Base de Força",
    description: "Foco em remadas pesadas para espessura, levantamento terra com correntes, treino de largura",
    part: "I",
    order: 3,
    children: ["semana-1-visao-geral", "semana-1-segunda", "semana-1-quinta", "semana-1-sabado"],
  },
  {
    id: "semana-2",
    title: "Semana 2 — Progressão de Volume",
    description: "Aumento gradual do volume, feeder sets, introdução ao Rack Pull",
    part: "I",
    order: 4,
    children: ["semana-2-visao-geral", "semana-2-segunda", "semana-2-quinta", "semana-2-sabado"],
  },
  {
    id: "semana-3",
    title: "Semana 3 — Pico de Contração e Drop Sets",
    description: "Meadows Rows, Deadstop Row, hiperextensões com bandas",
    part: "I",
    order: 5,
    children: ["semana-3-visao-geral", "semana-3-segunda", "semana-3-quinta", "semana-3-sabado"],
  },
  {
    id: "semana-4",
    title: "Semana 4 — Desafio de Resistência",
    description: "Challenge Set, Farmer's Walks, super-séries para pump",
    part: "I",
    order: 6,
    children: ["semana-4-visao-geral", "semana-4-segunda", "semana-4-quinta", "semana-4-sabado"],
  },
  {
    id: "semana-5",
    title: "Semana 5 — Sobrecarga Máxima",
    description: "Pirâmides de alta repetição, Levantamento terra em déficit, Chin up Death",
    part: "I",
    order: 7,
    children: ["semana-5-visao-geral", "semana-5-segunda", "semana-5-quinta", "semana-5-sabado"],
  },
  {
    id: "semana-6",
    title: "Semana 6 — Finalização",
    description: "Quad drop sets, superséries combinadas, ISO holds + Smith deadlift",
    part: "I",
    order: 8,
    children: ["semana-6-visao-geral", "semana-6-segunda", "semana-6-quinta", "semana-6-sabado"],
  },
];

// ============================================================
// HELPERS
// ============================================================

export function getChapterBySlug(slug: string) {
  return chapters.find(c => c.slug === slug);
}

export function getNextChapter(currentSlug: string) {
  const currentIdx = chapters.findIndex(c => c.slug === currentSlug);
  if (currentIdx === -1 || currentIdx >= chapters.length - 1) return null;
  return chapters[currentIdx + 1];
}

export function getPrevChapter(currentSlug: string) {
  const currentIdx = chapters.findIndex(c => c.slug === currentSlug);
  if (currentIdx <= 0) return null;
  return chapters[currentIdx - 1];
}

/** Retorna o grupo que contém um dado slug, ou null se for standalone */
export function getGroupBySlug(slug: string): ChapterGroup | null {
  return chapterGroups.find(g => g.children.includes(slug)) || null;
}

/** Retorna a contagem de subcapítulos completos de um grupo */
export function getGroupCompletedCount(
  group: ChapterGroup,
  progressData: { chapter_slug: string; completed: boolean }[]
): number {
  return group.children.filter(slug =>
    progressData.some(p => p.chapter_slug === slug && p.completed)
  ).length;
}

/** Verifica se todos os subcapítulos de um grupo estão completos */
export function isGroupComplete(
  group: ChapterGroup,
  progressData: { chapter_slug: string; completed: boolean }[]
): boolean {
  return group.children.every(slug =>
    progressData.some(p => p.chapter_slug === slug && p.completed)
  );
}
