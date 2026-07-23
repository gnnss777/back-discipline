'use client'

import { useState, useMemo } from 'react'
import { Bold, Italic, List, Heading1, Heading2, Quote, Code, Eye, Lightbulb, AlertTriangle, Info, BookOpen, ExternalLink, Plus } from 'lucide-react'

// ─── BLOCK PARSING (similar a ContentRenderer) ────────────────────────────────────

interface Block {
  type: 'h1' | 'h2' | 'h3' | 'h4' | 'hr' | 'paragraph'
    | 'exercise' | 'quote' | 'tip' | 'warning'
    | 'protocol' | 'overview' | 'table' | 'bullet-list' | 'label-group' | 'anatomy';
  raw: string;
}

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
      if (j < rawBlocks.length && isStatsBlock(rawBlocks[j])) {
        merged += '\n\n' + rawBlocks[j];
        j++;
      }
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

    if (trimmed.startsWith('|')) {
      blocks.push({ type: 'table', raw });
      continue;
    }

    if (trimmed.startsWith('# ')) { blocks.push({ type: 'h1', raw }); continue; }
    if (trimmed.startsWith('## ')) { blocks.push({ type: 'h2', raw }); continue; }
    if (trimmed.startsWith('### ')) { blocks.push({ type: 'h3', raw }); continue; }
    if (trimmed.startsWith('**') && trimmed.endsWith('**')) { blocks.push({ type: 'h4', raw }); continue; }

    if (trimmed === '---') {
      blocks.push({ type: 'hr', raw });
      continue;
    }

    if (trimmed.startsWith('>')) { blocks.push({ type: 'quote', raw }); continue; }
    if (QUOTE_RE.test(trimmed)) { blocks.push({ type: 'quote', raw }); continue; }

    if (WARNING_RE.test(trimmed)) { blocks.push({ type: 'warning', raw }); continue; }
    if (DICA_RE.test(trimmed)) { blocks.push({ type: 'tip', raw }); continue; }
    if (OVERVIEW_RE.test(trimmed)) { blocks.push({ type: 'overview', raw }); continue; }
    if (LABEL_RE.test(trimmed)) { blocks.push({ type: 'label-group', raw }); continue; }
    if (PROTOCOL_STEP_RE.test(trimmed)) { blocks.push({ type: 'protocol', raw }); continue; }
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) { blocks.push({ type: 'bullet-list', raw }); continue; }

    blocks.push({ type: 'paragraph', raw });
  }

  return blocks;
}

function renderInline(text: string): string {
  const regex = /(\*\*(.+?)\*\*|\*(.+?)\*)/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let result = '';

  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) {
      result += text.slice(last, match.index);
    }
    if (match[2]) {
      result += `<strong class="text-[oklch(97%.005_240)]">${match[2]}</strong>`;
    } else if (match[3]) {
      result += `<em>${match[3]}</em>`;
    }
    last = regex.lastIndex;
  }
  if (last < text.length) {
    result += text.slice(last);
  }
  return result;
}

function ExerciseCard({ raw }: { raw: string }) {
  const lines = raw.split('\n\n');
  const heading = lines[0].replace(/^###\s+/, '');
  let restStart = 1;
  let statsLine = '';
  if (lines.length > 1 && isStatsBlock(lines[1])) {
    statsLine = lines[1].replace(/\*\*/g, '');
    restStart = 2;
  }
  const rest = lines.slice(restStart).join('\n\n');
  const subBlocks = rest.split('\n\n');

  return `
    <div class="p-5 bg-[oklch(18%.01_270)] border-l-4 border-l-[oklch(76%.14_230)] border border-[oklch(25%.01_270)] rounded my-6">
      <h4 class="text-lg font-bold text-[oklch(97%.005_240)] tracking-wider">${heading}</h4>
      ${statsLine ? `<div class="inline-flex items-center gap-2 px-3 py-1.5 bg-[oklch(76%.14_230/0.1)] text-[oklch(76%.14_230)] text-sm font-bold rounded mt-3 mb-4"><span>${statsLine}</span></div>` : ''}
      <div class="space-y-3">
        ${subBlocks.map((block, i) => {
          const t = block.trim();
          if (!t) return '';
          if (DICA_RE.test(t)) {
            const content = t.replace(DICA_RE, '').trim();
            return `<div class="flex gap-3 p-4 bg-[oklch(18%.01_270)] border border-[oklch(76%.14_230/0.2)] rounded my-4"><div class="text-[oklch(97%.005_240)]">${renderInline(content)}</div></div>`;
          }
          if (WARNING_RE.test(t)) {
            const content = t.replace(WARNING_RE, '').trim();
            return `<div class="flex gap-3 p-4 bg-[oklch(18%.01_270)] border border-[oklch(76%.14_230/0.3)] rounded my-4"><div class="text-[oklch(97%.005_240)]">${renderInline(content)}</div></div>`;
          }
          if (t.startsWith('- ') || t.startsWith('* ')) {
            const items = t.split('\n').filter(s => s.trim());
            return `<ul class="space-y-1.5 ml-5">${items.map((item, idx) => `<li class="text-[oklch(90%.01_240)] list-disc">${renderInline(item.replace(/^[-*]\s*/, ''))}</li>`).join('')}</ul>`;
          }
          if (t.startsWith('>')) {
            return `<div class="p-6 bg-[oklch(76%.14_230/0.05)] border-l-4 border-l-[oklch(76%.14_230)] rounded my-6"><div class="text-[oklch(97%.005_240)] italic">${renderInline(t.replace(/^>\s*/, ''))}</div></div>`;
          }
          return `<p class="text-[oklch(90%.01_240)]">${renderInline(t)}</p>`;
        }).join('')}
      </div>
    </div>
  `;
}

function QuoteBox({ text }: { text: string }) {
  let quoteText = text.replace(/^>\s*/, '').replace(/^\*"(.+?)"\*/, '$1').replace(/^\*"(.+?)"/, '$1');
  return `
    <div class="p-6 bg-[oklch(76%.14_230/0.05)] border-l-4 border-l-[oklch(76%.14_230)] rounded my-6">
      <div class="text-[oklch(76%.14_230/0.4)] mb-2">"</div>
      <p class="text-lg italic text-[oklch(97%.005_240)] font-light leading-relaxed">${renderInline(quoteText)}</p>
    </div>
  `;
}

function TipBox({ text }: { text: string }) {
  const content = text.replace(/^\*\*(Dica|Dica técnica|Dica avançada|Dica de Meadows):\*\*/, '').trim();
  return `
    <div class="flex gap-3 p-4 bg-[oklch(18%.01_270)] border border-[oklch(76%.14_230/0.2)] rounded my-4">
      <div class="text-[oklch(76%.14_230)]"><div class="w-5 h-5">💡</div></div>
      <div class="text-[oklch(90%.01_240)]">${renderInline(content)}</div>
    </div>
  `;
}

function WarningBox({ text }: { text: string }) {
  const content = text.replace(/^\*\*(Cuidado|Aviso):\*\*/, '').trim();
  return `
    <div class="flex gap-3 p-4 bg-[oklch(18%.01_270)] border border-[oklch(76%.14_230/0.3)] rounded my-4">
      <div class="text-[oklch(76%.14_230)]"><div class="w-5 h-5">⚠️</div></div>
      <div class="text-[oklch(90%.01_240)]">${renderInline(content)}</div>
    </div>
  `;
}

function OverviewCard({ raw }: { raw: string }) {
  const lines = raw.split('\n');
  const title = lines[0].replace(/\*\*/g, '').replace(/:$/, '');
  const items = lines.slice(1).filter(l => l.trim().startsWith('- ') || l.trim().startsWith('* '));
  return `
    <div class="p-5 bg-[oklch(18%.01_270)] border border-[oklch(25%.01_270)] rounded my-6">
      <h4 class="font-bold text-[oklch(76%.14_230)] mb-3 tracking-wider text-sm flex items-center gap-2">
        <div class="text-lg">ℹ️</div>
        ${title}
      </h4>
      <ul class="space-y-2">
        ${items.map((item, i) => `<li class="flex gap-2 text-[oklch(90%.01_240)]"><span class="text-[oklch(76%.14_230)] mt-1 flex-shrink-0">•</span>${renderInline(item.replace(/^[-*]\s*/, ''))}</li>`).join('')}
      </ul>
    </div>
  `;
}

function LabelGroup({ raw }: { raw: string }) {
  const m = raw.match(LABEL_RE);
  const label = m ? m[1] : '';
  const content = raw.replace(/^\*\*.*?:\*\*/, '').trim();
  return `
    <div class="p-4 bg-[oklch(18%.01_270)] border border-[oklch(25%.01_270)] rounded my-4">
      <span class="font-bold text-[oklch(76%.14_230)] text-sm tracking-wider">${label}:</span>
      <div class="mt-1 text-[oklch(90%.01_240)]">${renderInline(content)}</div>
    </div>
  `;
}

function AnatomyCard({ raw }: { raw: string }) {
  const lines = raw.split('\n\n');
  const heading = lines[0].replace(/^###\s+/, '');
  return `
    <div class="p-5 bg-[oklch(18%.01_270)] border-l-4 border-l-[oklch(76%.14_230)] border border-[oklch(25%.01_270)] rounded my-6">
      <div class="flex items-center gap-2 mb-3">
        <div class="text-xl">🦴</div>
        <h4 class="text-base font-bold text-[oklch(97%.005_240)] tracking-wider">${heading}</h4>
      </div>
      ${lines.slice(1).map((block, i) => {
        const t = block.trim();
        if (!t) return '';
        if (t.startsWith('- ') || t.startsWith('* ')) {
          const items = t.split('\n').filter(s => s.trim());
          return `<ul class="space-y-1.5 ml-5 my-2">${items.map((item, idx) => `<li class="text-[oklch(90%.01_240)] list-disc">${renderInline(item.replace(/^[-*]\s*/, ''))}</li>`).join('')}</ul>`;
        }
        if (LABEL_RE.test(t)) {
          const l = t.match(LABEL_RE)![1];
          const c = t.replace(/^\*\*.*?:\*\*/, '').trim();
          return `<div class="mt-2"><span class="font-bold text-[oklch(76%.14_230)] text-sm tracking-wider">${l}:</span><span class="text-[oklch(90%.01_240)] ml-1">${renderInline(c)}</span></div>`;
        }
        return `<p class="text-[oklch(90%.01_240)] my-2">${renderInline(t)}</p>`;
      }).join('')}
    </div>
  `;
}

// ─── RENDERER ────────────────────────────────

type BlockRenderer = React.FC<{ raw: string }>;

const blockRenderers: Record<Block['type'], BlockRenderer> = {
  'h1': ({ raw }) => `<h1 class="text-3xl font-medium text-[oklch(97%.005_240)] mt-10 mb-6 tracking-wider">${raw.replace('# ', '')}</h1>`,
  'h2': ({ raw }) => `<h2 class="text-2xl font-medium text-[oklch(97%.005_240)] mt-8 mb-5 tracking-wider border-b border-[oklch(25%.01_270)] pb-2">${raw.replace('## ', '')}</h2>`,
  'h3': ({ raw }) => `<h3 class="text-lg font-bold text-[oklch(76%.14_230)] mt-6 mb-4 tracking-wider">${raw.replace('### ', '')}</h3>`,
  'h4': ({ raw }) => `<h4 class="font-bold text-[oklch(97%.005_240)] mt-6 mb-3 tracking-wider uppercase text-sm">${raw.replace(/\*\*/g, '')}</h4>`,
  'hr': () => `<hr class="border-[oklch(25%.01_270)] my-8">`,
  'paragraph': ({ raw }) => `<p class="text-[oklch(90%.01_240)] leading-[2.0] text-lg font-light">${renderInline(raw.trim())}</p>`,
  'exercise': ExerciseCard,
  'quote': ({ raw }) => {
    const text = raw.replace(/^>\s*/, '');
    return QuoteBox({ text });
  },
  'tip': ({ raw }) => TipBox({ text: raw }),
  'warning': ({ raw }) => WarningBox({ text: raw }),
  'protocol': ({ raw }) => {
    const steps = raw.split('\n').filter(s => s.trim());
    return `<ol class="space-y-3 my-6">${steps.map((step, i) => `<li class="flex gap-4 items-start"><span class="flex-shrink-0 w-8 h-8 rounded-full bg-[oklch(76%.14_230/0.1)] text-[oklch(76%.14_230)] flex items-center justify-center text-sm font-bold mt-0.5">${i + 1}</span><span class="text-[oklch(90%.01_240)] leading-relaxed pt-0.5">${renderInline(step.replace(/^\d+\.\s*/, ''))}</span></li>`).join('')}</ol>`;
  },
  'overview': OverviewCard,
  'table': ({ raw }) => {
    const rows = raw.split('\n').filter(r => r.trim());
    const dataRows = rows.filter(r => !/^[\s\|-]+$/.test(r));
    if (dataRows.length < 2) return '';
    const headers = dataRows[0].split('|').filter(c => c.trim());
    const bodyRows = dataRows.slice(1);
    return `<div class="overflow-x-auto my-6"><table class="min-w-full border border-[oklch(25%.01_270)]"><thead><tr class="bg-[oklch(76%.14_230/0.1)]">${headers.map((h, i) => `<th class="px-4 py-3 border border-[oklch(25%.01_270)] text-[oklch(76%.14_230)] text-sm font-bold tracking-wider text-left">${h.trim()}</th>`).join('')}</tr></thead><tbody>${bodyRows.map((row, ri) => {
      const cells = row.split('|').filter(c => c.trim());
      return `<tr class="${ri % 2 === 0 ? 'bg-[oklch(18%.01_270)]' : ''}">${cells.map((cell, ci) => `<td class="px-4 py-2.5 border border-[oklch(25%.01_270)] text-[oklch(90%.01_240)] text-sm">${cell.trim()}</td>`).join('')}</tr>`;
    }).join('')}</tbody></table></div>`;
  },
  'bullet-list': ({ raw }) => {
    const items = raw.split('\n').filter(l => l.trim());
    return `<ul class="space-y-2 ml-6 my-4">${items.map((item, i) => `<li class="text-[oklch(90%.01_240)] list-disc">${renderInline(item.replace(/^[-*]\s*/, ''))}</li>`).join('')}</ul>`;
  },
  'label-group': LabelGroup,
  'anatomy': AnatomyCard,
};

function parseMarkdown(md: string): string {
  const blocks = buildBlocks(md);
  return `
    <div class="space-y-6 text-[oklch(90%.01_240)] text-lg leading-[2.0] font-light">
      ${blocks.map((block, i) => {
        const Renderer = blockRenderers[block.type];
        return Renderer ? Renderer({ raw: block.raw }) : '';
      }).join('')}
    </div>
  `;
}

export function MarkdownEditor({
  value,
  onChange,
}: {
  value: string
  onChange: (val: string) => void
}) {
  const [preview, setPreview] = useState(false)
  const previewHtml = useMemo(() => parseMarkdown(value), [value])

  function insertTemplate(template: string) {
    onChange(value + '\n\n' + template)
  }

  return (
    <div className="flex flex-col h-full border border-[oklch(25%.01_270)] rounded-xl overflow-hidden">
      <div className="flex items-center gap-1 p-2 border-b border-[oklch(25%.01_270)] bg-[oklch(15%.01_270)] flex-wrap">
        <button
          onClick={() => onChange(value + '**texto**')}
          className="p-1 rounded hover:bg-[oklch(25%.01_270)] text-[oklch(70%.01_240)]"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          onClick={() => onChange(value + '*texto*')}
          className="p-1 rounded hover:bg-[oklch(25%.01_270)] text-[oklch(70%.01_240)]"
        >
          <Italic className="w-4 h-4" />
        </button>
        <span className="w-px h-4 bg-[oklch(25%.01_270)] mx-1" />
        <button
          onClick={() => onChange(value + '\n# Título')}
          className="p-1 rounded hover:bg-[oklch(25%.01_270)] text-[oklch(70%.01_240)]"
        >
          <Heading1 className="w-4 h-4" />
        </button>
        <button
          onClick={() => onChange(value + '\n## Subtítulo')}
          className="p-1 rounded hover:bg-[oklch(25%.01_270)] text-[oklch(70%.01_240)]"
        >
          <Heading2 className="w-4 h-4" />
        </button>
        <span className="w-px h-4 bg-[oklch(25%.01_270)] mx-1" />
        <button
          onClick={() => onChange(value + '\n- item')}
          className="p-1 rounded hover:bg-[oklch(25%.01_270)] text-[oklch(70%.01_240)]"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          onClick={() => onChange(value + '\n:::quote\nCitação\n:::')}
          className="p-1 rounded hover:bg-[oklch(25%.01_270)] text-[oklch(70%.01_240)]"
        >
          <Quote className="w-4 h-4" />
        </button>
        <button
          onClick={() => onChange(value + '\n:::tip\nDica\n:::')}
          className="p-1 rounded hover:bg-[oklch(25%.01_270)] text-[oklch(70%.01_240)]"
        >
          <Code className="w-4 h-4" />
        </button>
        <span className="w-px h-4 bg-[oklch(25%.01_270)] mx-1" />
        <button
          onClick={() => insertTemplate(':::tip\nDica aqui\n:::')}
          className="text-xs px-2 py-1 rounded bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
        >
          +Dica
        </button>
        <button
          onClick={() => insertTemplate(':::warning\nAviso aqui\n:::')}
          className="text-xs px-2 py-1 rounded bg-amber-500/20 text-amber-400 hover:bg-amber-500/30"
        >
          +Aviso
        </button>
        <button
          onClick={() => insertTemplate(':::exercise\n## Exercício\n**Músculos:**\n:::')}
          className="text-xs px-2 py-1 rounded bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
        >
          +Exercício
        </button>
        <span className="flex-1" />
        <button
          onClick={() => setPreview(!preview)}
          className={`p-1 rounded ${preview ? 'bg-[oklch(76%.14_230/0.2)] text-[oklch(76%.14_230)]' : 'text-[oklch(50%.01_270)]'}`}
        >
          <Eye className="w-4 h-4" />
        </button>
      </div>

      {preview ? (
        <div
          className="flex-1 p-4 overflow-y-auto text-sm leading-relaxed text-[oklch(90%.01_240)] space-y-2"
          dangerouslySetInnerHTML={{ __html: previewHtml }}
        />
      ) : (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 w-full p-4 bg-transparent text-sm text-[oklch(97%.005_240)] font-mono resize-none focus:outline-none"
          placeholder="Escreva o conteúdo em markdown..."
        />
      )}
    </div>
  )
}
