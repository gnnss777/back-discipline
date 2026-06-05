'use client';

import { Dumbbell, Lightbulb, AlertTriangle, Info, Quote, BookOpen, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { findExerciseByHeadingName } from '../../../data/exercises';

// ─── Types ───────────────────────────────────────────

interface Block {
 type: 'h1' | 'h2' | 'h3' | 'h4' | 'hr' | 'paragraph'
  | 'exercise' | 'quote' | 'tip' | 'warning'
  | 'protocol' | 'overview' | 'table' | 'bullet-list' | 'label-group' | 'anatomy';
 raw: string;
}

// ─── PARSING ─────────────────────────────────────────

const EXERCISE_RE = /^###\s+(Exercício\s+\d+|(\d+\.))[\s:]/i;
const STATS_RE = /^\*\*.*[\d×x]|^\*\*.*RPE|^\*\*.*série|^\*\*.*reps/i;
const LABEL_RE = /^\*\*(Técnica|Setup|Por que funciona|Benefício|Meta|Quando usar|Execução|Função|Melhor|Recomendação|Progressão|Prevenção|Fatores|Estudo)\b/i;
const DICA_RE = /^\*\*(Dica|Dica técnica|Dica avançada|Dica de Meadows):/i;
const WARNING_RE = /^\*\*(Cuidado|Aviso):/i;
const OVERVIEW_RE = /^\*\*O que/i;
const PROTOCOL_STEP_RE = /^\d+\.\s/;
const QUOTE_RE = /^\*"/;
const ANATOMY_RE = /^###\s+(Trapézio|Latíssimo|Romboides|Eretores|Deltoide|Supraespinhal|Infraespinhal|Teres|Subescapular|Manguito)/i;

function isExerciseHeading(line: string): boolean {
 return EXERCISE_RE.test(line);
}

function isStatsBlock(line: string): boolean {
 return STATS_RE.test(line.trim());
}

function isMajorHeading(line: string): boolean {
 return /^#{1,3}\s/.test(line.trim());
}

function buildBlocks(content: string): Block[] {
 const rawBlocks = content.split('\n\n');
 const blocks: Block[] = [];

 for (let i = 0; i < rawBlocks.length; i++) {
  const raw = rawBlocks[i];
  const trimmed = raw.trim();
  if (!trimmed) continue;

  // ── Exercise card (merge heading + stats + body + labels) ──
  if (isExerciseHeading(trimmed)) {
   let merged = raw;
   let j = i + 1;
   // merge stats line
   if (j < rawBlocks.length && isStatsBlock(rawBlocks[j])) {
    merged += '\n\n' + rawBlocks[j];
    j++;
   }
   // merge everything until next major heading or another exercise
   while (j < rawBlocks.length) {
    const next = rawBlocks[j].trim();
    if (isExerciseHeading(next) || isMajorHeading(next) || /^##+\s/.test(next)) break;
    if (next === '---') break;
    merged += '\n\n' + rawBlocks[j];
    j++;
   }
   blocks.push({ type: 'exercise', raw: merged });
   i = j - 1;
   continue;
  }

  // ── Anatomy heading ──
  if (ANATOMY_RE.test(trimmed)) {
   let merged = raw;
   let j = i + 1;
   while (j < rawBlocks.length) {
    const next = rawBlocks[j].trim();
    if (isMajorHeading(next) || ANATOMY_RE.test(next)) break;
    if (next === '---') break;
    merged += '\n\n' + rawBlocks[j];
    j++;
   }
   blocks.push({ type: 'anatomy', raw: merged });
   i = j - 1;
   continue;
  }

  // ── Table ──
  if (trimmed.startsWith('|')) {
   blocks.push({ type: 'table', raw });
   continue;
  }

  // ── Headings ──
  if (trimmed.startsWith('# ')) {
   blocks.push({ type: 'h1', raw });
   continue;
  }
  if (trimmed.startsWith('## ')) {
   blocks.push({ type: 'h2', raw });
   continue;
  }
  if (trimmed.startsWith('### ')) {
   blocks.push({ type: 'h3', raw });
   continue;
  }
  if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
   blocks.push({ type: 'h4', raw });
   continue;
  }

  // ── HR ──
  if (trimmed === '---') {
   blocks.push({ type: 'hr', raw });
   continue;
  }

  // ── Blockquote (> pattern) ──
  if (trimmed.startsWith('>')) {
   blocks.push({ type: 'quote', raw });
   continue;
  }

  // ── Quote (*"pattern) ──
  if (QUOTE_RE.test(trimmed)) {
   blocks.push({ type: 'quote', raw });
   continue;
  }

  // ── Warning ──
  if (WARNING_RE.test(trimmed)) {
   blocks.push({ type: 'warning', raw });
   continue;
  }

  // ── Tip ──
  if (DICA_RE.test(trimmed)) {
   blocks.push({ type: 'tip', raw });
   continue;
  }

  // ── Overview ──
  if (OVERVIEW_RE.test(trimmed)) {
   blocks.push({ type: 'overview', raw });
   continue;
  }

  // ── Label group ──
  if (LABEL_RE.test(trimmed)) {
   blocks.push({ type: 'label-group', raw });
   continue;
  }

  // ── Protocol list ──
  if (PROTOCOL_STEP_RE.test(trimmed)) {
   blocks.push({ type: 'protocol', raw });
   continue;
  }

  // ── Bullet list ──
  if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
   blocks.push({ type: 'bullet-list', raw });
   continue;
  }

  // ── Default: paragraph ──
  blocks.push({ type: 'paragraph', raw });
 }

 return blocks;
}

// ─── INLINE RENDERER ─────────────────────────────

function renderInline(text: string): React.ReactNode[] {
 const parts: React.ReactNode[] = [];
 const regex = /(\*\*(.+?)\*\*|\*(.+?)\*)/g;
 let last = 0;
 let match: RegExpExecArray | null;
 let key = 0;

 while ((match = regex.exec(text)) !== null) {
  if (match.index > last) {
   parts.push(text.slice(last, match.index));
  }
  if (match[2]) {
   parts.push(<strong key={key++} className="text-foreground font-bold">{match[2]}</strong>);
  } else if (match[3]) {
   parts.push(<em key={key++} className="italic text-foreground">{match[3]}</em>);
  }
  last = regex.lastIndex;
 }
 if (last < text.length) {
  parts.push(text.slice(last));
 }
 return parts;
}

// ─── BLOCK RENDERERS ─────────────────────────────

function ExerciseCard({ raw }: { raw: string }) {
 const lines = raw.split('\n\n');

 // First line contains heading: "### Exercício 1: Name — stats"
 const heading = lines[0].replace(/^###\s+/, '');
 // Extract stats from heading if present (after em-dash)
 let headingName = heading;
 let headingStats = '';
 const dashIdx = heading.indexOf(' — ');
 if (dashIdx > 0 && lines.length >= 2 && !isStatsBlock(lines[1])) {
  // Stats might be inline in heading after em-dash
 }

 // Find stats line (the first **bold** block)
 let restStart = 1;
 let statsLine = '';
 if (lines.length > 1 && isStatsBlock(lines[1])) {
  statsLine = lines[1].replace(/\*\*/g, '');
  restStart = 2;
 }

 // Rest of content
 const rest = lines.slice(restStart).join('\n\n');

 // Split: description, labels/blocks, tip
 const subBlocks = rest.split('\n\n');

 return (
  <div className="p-5 bg-surface border-l-4 border-l-primary border border-secondary rounded my-6">
   <h4 className="text-lg font-bold text-foreground tracking-wider">{headingName}</h4>

   {statsLine && (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary text-sm font-bold rounded mt-3 mb-4">
     <Dumbbell className="w-3.5 h-3.5" />
     <span>{statsLine}</span>
    </div>
   )}

   <div className="space-y-3">
    {subBlocks.map((block, i) => {
     const t = block.trim();
     if (!t) return null;

     // Tip inline
     if (DICA_RE.test(t)) {
      const content = t.replace(DICA_RE, '').trim();
      return <TipBox key={i} text={`Dica: ${content}`} />;
     }

     // Warning inline
     if (WARNING_RE.test(t)) {
      const content = t.replace(WARNING_RE, '').trim();
      return <WarningBox key={i} text={`${t.match(WARNING_RE)![1]}: ${content}`} />;
     }

     // Label group inside exercise
     if (LABEL_RE.test(t)) {
      const m = t.match(LABEL_RE);
      const label = m ? m[1] : '';
      const content = t.replace(/^\*\*.*?:\*\*/, '').trim();
      return (
       <div key={i} className="pt-2">
        <span className="font-bold text-primary text-sm tracking-wider">{label}:</span>
        <div className="mt-1 text-muted-foreground leading-relaxed">{renderInline(content)}</div>
       </div>
      );
     }

     // Bold stats that weren't the main stats line
     if (isStatsBlock(t)) {
      return (
       <div key={i} className="text-primary text-sm font-bold">
        {t.replace(/\*\*/g, '')}
       </div>
      );
     }

     // Bullet list
     if (t.startsWith('- ') || t.startsWith('* ')) {
      const items = t.split('\n').filter(s => s.trim());
      return (
       <ul key={i} className="space-y-1.5 ml-5">
        {items.map((item, idx) => (
         <li key={idx} className="text-muted-foreground leading-relaxed list-disc">{renderInline(item.replace(/^[-*]\s*/, ''))}</li>
        ))}
       </ul>
      );
     }

     // Ordered list
     if (PROTOCOL_STEP_RE.test(t)) {
      const steps = t.split('\n').filter(s => s.trim());
      return <ProtocolList key={i} steps={steps} />;
     }

     // Blockquote
     if (t.startsWith('>')) {
      return <QuoteBox key={i} text={t.replace(/^>\s*/, '')} />;
     }

     // Plain paragraph
     return <p key={i} className="text-muted-foreground leading-relaxed">{renderInline(t)}</p>;
    })}
   </div>

   {(() => {
    const searchName = headingName.replace(/^(\d+\.?\s*|Exercício\s+\d+:\s*)/, '').split(' — ')[0];
    const exRef = findExerciseByHeadingName(searchName);
    const href = exRef ? `/biblioteca/${exRef.id}` : `/biblioteca?search=${encodeURIComponent(searchName)}`;
    return (
     <Link
      href={href}
      className="mt-4 pt-4 border-t border-secondary flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors tracking-wider"
     >
      <ExternalLink className="w-3 h-3" />
      VER NA BIBLIOTECA
     </Link>
    );
   })()}
  </div>
 );
}

function QuoteBox({ text }: { text: string }) {
 // Extract quote text (between *"...") and optional attribution (after em-dash)
 let quoteText = text.replace(/^>\s*/, '').replace(/^\*"(.+?)"\*/, '$1').replace(/^\*"(.+?)"/, '$1');
 let attribution = '';

 const dashIdx = quoteText.indexOf(' — ');
 if (dashIdx > 0) {
  const after = quoteText.slice(dashIdx + 3).trim();
  // Check if it looks like attribution
  if (after.startsWith('John') || after.startsWith('Meadows') || after.startsWith('Não') || after.includes(',')) {
   // Probably not attribution
  } else {
   attribution = after;
   quoteText = quoteText.slice(0, dashIdx);
  }
 }

 return (
  <div className="p-6 bg-primary/5 border-l-4 border-l-primary rounded my-6">
   <Quote className="w-6 h-6 text-primary/40 mb-2" />
   <p className="text-lg italic text-foreground font-light leading-relaxed">&ldquo;{quoteText}&rdquo;</p>
   {attribution && (
    <p className="text-sm text-primary mt-3 font-medium tracking-wider">&mdash; {attribution}</p>
   )}
  </div>
 );
}

function TipBox({ text }: { text: string }) {
 const content = text.replace(/^\*\*(Dica|Dica técnica|Dica avançada|Dica de Meadows):\*\*/, '').trim();
 return (
  <div className="flex gap-3 p-4 bg-surface border border-primary/20 rounded my-4">
   <Lightbulb className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
   <div className="text-muted-foreground text-sm leading-relaxed">{renderInline(content)}</div>
  </div>
 );
}

function WarningBox({ text }: { text: string }) {
 const content = text.replace(/^\*\*(Cuidado|Aviso):\*\*/, '').trim();
 return (
  <div className="flex gap-3 p-4 bg-surface border border-primary/30 rounded my-4">
   <AlertTriangle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
   <div className="text-muted-foreground text-sm leading-relaxed">{renderInline(content)}</div>
  </div>
 );
}

function ProtocolList({ steps }: { steps: string[] }) {
 return (
  <ol className="space-y-3 my-6">
   {steps.map((step, i) => (
    <li key={i} className="flex gap-4 items-start">
     <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold mt-0.5">
      {i + 1}
     </span>
     <span className="text-muted-foreground leading-relaxed pt-0.5">{renderInline(step.replace(/^\d+\.\s*/, ''))}</span>
    </li>
   ))}
  </ol>
 );
}

function OverviewCard({ raw }: { raw: string }) {
 const lines = raw.split('\n');
 const title = lines[0].replace(/\*\*/g, '').replace(/:$/, '');
 const items = lines.slice(1).filter(l => l.trim().startsWith('- ') || l.trim().startsWith('* '));

 return (
  <div className="p-5 bg-surface border border-secondary rounded my-6">
   <h4 className="font-bold text-primary mb-3 tracking-wider flex items-center gap-2 text-sm">
    <Info className="w-4 h-4" />
    {title}
   </h4>
   <ul className="space-y-2">
    {items.map((item, i) => (
     <li key={i} className="flex gap-2 text-muted-foreground leading-relaxed">
      <span className="text-primary mt-1 flex-shrink-0">•</span>
      <span>{renderInline(item.replace(/^[-*]\s*/, ''))}</span>
     </li>
    ))}
   </ul>
  </div>
 );
}

function LabelGroup({ raw }: { raw: string }) {
 const m = raw.match(LABEL_RE);
 const label = m ? m[1] : '';
 const content = raw.replace(/^\*\*.*?:\*\*/, '').trim();

 return (
  <div className="p-4 bg-surface border border-secondary rounded my-4">
   <span className="font-bold text-primary text-sm tracking-wider">{label}:</span>
   <div className="mt-1 text-muted-foreground leading-relaxed">{renderInline(content)}</div>
  </div>
 );
}

function AnatomyCard({ raw }: { raw: string }) {
 const lines = raw.split('\n\n');
 const heading = lines[0].replace(/^###\s+/, '');

 return (
  <div className="p-5 bg-surface border-l-4 border-l-primary border border-secondary rounded my-6">
   <div className="flex items-center gap-2 mb-3">
    <BookOpen className="w-4 h-4 text-primary" />
    <h4 className="text-base font-bold text-foreground tracking-wider">{heading}</h4>
   </div>
   {lines.slice(1).map((block, i) => {
    const t = block.trim();
    if (!t) return null;

    if (t.startsWith('- ') || t.startsWith('* ')) {
     const items = t.split('\n').filter(s => s.trim());
     return (
      <ul key={i} className="space-y-1.5 ml-5 my-2">
       {items.map((item, idx) => (
        <li key={idx} className="text-muted-foreground leading-relaxed list-disc">{renderInline(item.replace(/^[-*]\s*/, ''))}</li>
       ))}
      </ul>
     );
    }
    if (LABEL_RE.test(t)) {
     const l = t.match(LABEL_RE)![1];
     const c = t.replace(/^\*\*.*?:\*\*/, '').trim();
     return (
      <div key={i} className="mt-2">
       <span className="font-bold text-primary text-sm tracking-wider">{l}:</span>
       <span className="text-muted-foreground ml-1">{renderInline(c)}</span>
      </div>
     );
    }
    return <p key={i} className="text-muted-foreground leading-relaxed my-2">{renderInline(t)}</p>;
   })}
  </div>
 );
}

function ContentTable({ raw }: { raw: string }) {
 const rows = raw.split('\n').filter(r => r.trim());
 // Filter out separator row (|---|---|)
 const dataRows = rows.filter(r => !/^[\s\|-]+$/.test(r));
 if (dataRows.length < 2) return null;

 const headers = dataRows[0].split('|').filter(c => c.trim());
 const bodyRows = dataRows.slice(1);

 return (
  <div className="overflow-x-auto my-6">
   <table className="min-w-full border border-secondary">
    <thead>
     <tr className="bg-primary/10">
      {headers.map((h, i) => (
       <th key={i} className="px-4 py-3 border border-secondary text-primary text-sm font-bold tracking-wider text-left">{h.trim()}</th>
      ))}
     </tr>
    </thead>
    <tbody>
     {bodyRows.map((row, ri) => {
      const cells = row.split('|').filter(c => c.trim());
      return (
       <tr key={ri} className={ri % 2 === 0 ? 'bg-surface' : ''}>
        {cells.map((cell, ci) => (
         <td key={ci} className="px-4 py-2.5 border border-secondary text-muted-foreground text-sm">{cell.trim()}</td>
        ))}
       </tr>
      );
     })}
    </tbody>
   </table>
  </div>
 );
}

function BulletListBlock({ raw }: { raw: string }) {
 const items = raw.split('\n').filter(l => l.trim());
 return (
  <ul className="space-y-2 ml-6 my-4">
   {items.map((item, i) => (
    <li key={i} className="text-muted-foreground leading-relaxed list-disc">{renderInline(item.replace(/^[-*]\s*/, ''))}</li>
   ))}
  </ul>
 );
}

// ─── MAIN RENDERER ───────────────────────────────

type BlockRenderer = React.FC<{ raw: string }>;

const blockRenderers: Record<Block['type'], BlockRenderer> = {
 'h1': ({ raw }) => <h1 className="text-3xl font-medium text-foreground mt-10 mb-6 tracking-wider">{raw.replace('# ', '')}</h1>,
 'h2': ({ raw }) => {
  const headingText = raw.replace('## ', '');
  const exRef = findExerciseByHeadingName(headingText);
  return (
   <h2 className="text-2xl font-medium text-foreground mt-8 mb-5 tracking-wider border-b border-secondary pb-2 flex items-center gap-3 flex-wrap">
    <span>{headingText}</span>
    {exRef && (
     <Link
      href={`/biblioteca/${exRef.id}`}
      className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors font-normal tracking-wider no-underline"
     >
      <ExternalLink className="w-3 h-3" />
      VER NA BIBLIOTECA
     </Link>
    )}
   </h2>
  );
 },
 'h3': ({ raw }) => {
  const headingText = raw.replace('### ', '');
  const exRef = findExerciseByHeadingName(headingText);
  return (
   <h3 className="text-lg font-bold text-primary mt-6 mb-4 tracking-wider flex items-center gap-3 flex-wrap">
    <span>{headingText}</span>
    {exRef && (
     <Link
      href={`/biblioteca/${exRef.id}`}
      className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors font-normal tracking-wider no-underline"
     >
      <ExternalLink className="w-3 h-3" />
      VER NA BIBLIOTECA
     </Link>
    )}
   </h3>
  );
 },
 'h4': ({ raw }) => <h4 className="font-bold text-foreground mt-6 mb-3 tracking-wider uppercase text-sm">{raw.replace(/\*\*/g, '')}</h4>,
 'hr': () => <hr className="border-secondary my-8" />,
 'paragraph': ({ raw }) => <p className="text-muted-foreground leading-[2.0] text-lg font-light">{renderInline(raw.trim())}</p>,
 'exercise': ExerciseCard,
 'quote': ({ raw }) => {
  const text = raw.replace(/^>\s*/, '');
  return <QuoteBox text={text} />;
 },
 'tip': ({ raw }) => <TipBox text={raw} />,
 'warning': ({ raw }) => <WarningBox text={raw} />,
 'protocol': ({ raw }) => {
  const steps = raw.split('\n').filter(s => s.trim());
  return <ProtocolList steps={steps} />;
 },
 'overview': OverviewCard,
 'table': ContentTable,
 'bullet-list': BulletListBlock,
 'label-group': LabelGroup,
 'anatomy': AnatomyCard,
};

// ─── EXPORTED COMPONENT ────────────────────────────

interface ContentRendererProps {
 content: string;
}

export function ContentRenderer({ content }: ContentRendererProps) {
 const blocks = buildBlocks(content);

 return (
  <div className="space-y-6 text-muted-foreground text-lg leading-[2.0] font-light">
   {blocks.map((block, i) => {
    const Renderer = blockRenderers[block.type];
    return <Renderer key={i} raw={block.raw} />;
   })}
  </div>
 );
}
