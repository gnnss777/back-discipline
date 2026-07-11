import { chromium } from '@playwright/test';
import { writeFileSync, mkdirSync, existsSync, unlinkSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { chapterContents, getChapterContent } from '../src/lib/content';
import { chapters, chapterGroups, type ChapterGroup, type Chapter } from '../src/lib/chapters';
import { exercises } from '../src/data/exercises';

// ─── CONFIG ───

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PUBLIC_DIR = join(__dirname, '..', 'public');
const SCRIPTS_DIR = __dirname;

// ─── MARKDOWN → HTML CONVERTER ───

function escapeHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function renderInline(text: string): string {
  let result = escapeHtml(text);
  // Bold
  result = result.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  // Italic
  result = result.replace(/\*(.+?)\*/g, '<em>$1</em>');
  // Inline code
  result = result.replace(/`(.+?)`/g, '<code>$1</code>');
  return result;
}

function renderTable(rows: string[]): string {
  if (rows.length < 2) return '';
  // Parse header
  const headerCells = rows[0].split('|').filter((c: string) => c.trim());
  // Skip separator row (|---|)
  const dataRows = rows.slice(1).filter((r: string) => !/^\|?\s*:?-+:?\s*\|/.test(r.trim()));
  let html = '<table class="table">\n<thead>\n<tr>';
  for (const cell of headerCells) {
    html += `<th>${renderInline(cell.trim())}</th>`;
  }
  html += '</tr>\n</thead>\n<tbody>\n';
  for (const row of dataRows) {
    const cells = row.split('|').filter((c: string) => c.trim());
    if (cells.length === 0) continue;
    html += '<tr>';
    for (const cell of cells) {
      html += `<td>${renderInline(cell.trim())}</td>`;
    }
    html += '</tr>\n';
  }
  html += '</tbody>\n</table>\n';
  return html;
}

function renderList(lines: string[], ordered: boolean): string {
  const tag = ordered ? 'ol' : 'ul';
  let html = `<${tag}>\n`;
  for (const line of lines) {
    const content = line.replace(/^(\d+\.|[-*])\s+/, '');
    html += `  <li>${renderInline(content)}</li>\n`;
  }
  html += `</${tag}>\n`;
  return html;
}

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

function renderBlockToHtml(block: Block): string {
  const t = block.raw.trim();
  if (!t) return '';

  switch (block.type) {
    case 'h1':
      return `<h1>${renderInline(t.replace(/^#\s+/, ''))}</h1>\n`;
    case 'h2':
      return `<h2>${renderInline(t.replace(/^##\s+/, ''))}</h2>\n`;
    case 'h3':
      return `<h3>${renderInline(t.replace(/^###\s+/, ''))}</h3>\n`;
    case 'h4':
      return `<h4>${renderInline(t.replace(/\*\*/g, ''))}</h4>\n`;
    case 'hr':
      return `<hr />\n`;
    case 'paragraph':
      return `<p>${renderInline(t)}</p>\n`;
    case 'quote': {
      let quoteText = t.replace(/^>\s*/, '').replace(/^\*"(.+?)"\*/, '$1').replace(/^\*"(.+?)"/, '$1');
      let attribution = '';
      const dashIdx = quoteText.indexOf(' — ');
      if (dashIdx > 0) {
        const after = quoteText.slice(dashIdx + 3).trim();
        if (after.startsWith('John') || after.startsWith('Meadows') || after.startsWith('Não') || after.includes(',')) {
          // not attribution
        } else {
          attribution = after;
          quoteText = quoteText.slice(0, dashIdx);
        }
      }
      return `
        <div class="quote-box">
          <div class="quote-text">&ldquo;${renderInline(quoteText)}&rdquo;</div>
          ${attribution ? `<div class="quote-attribution">&mdash; ${renderInline(attribution)}</div>` : ''}
        </div>
      `;
    }
    case 'tip': {
      const content = t.replace(/^\*\*(Dica|Dica técnica|Dica avançada|Dica de Meadows):\*\*/i, '').trim();
      const label = t.match(/^\*\*(Dica|Dica técnica|Dica avançada|Dica de Meadows):\*\*/i)?.[1] || 'Dica';
      return `
        <div class="tip-box">
          <div class="tip-icon">💡</div>
          <div class="tip-content"><strong>${label}:</strong> ${renderInline(content)}</div>
        </div>
      `;
    }
    case 'warning': {
      const content = t.replace(/^\*\*(Cuidado|Aviso):\*\*/i, '').trim();
      const label = t.match(/^\*\*(Cuidado|Aviso):\*\*/i)?.[1] || 'Aviso';
      return `
        <div class="warning-box">
          <div class="warning-icon">⚠️</div>
          <div class="warning-content"><strong>${label}:</strong> ${renderInline(content)}</div>
        </div>
      `;
    }
    case 'protocol': {
      const steps = t.split('\n').filter(s => s.trim());
      let html = '<div class="protocol-list">\n';
      steps.forEach((step, idx) => {
        html += `
          <div class="protocol-item">
            <div class="protocol-number">${idx + 1}</div>
            <div class="protocol-content">${renderInline(step.replace(/^\d+\.\s*/, ''))}</div>
          </div>\n`;
      });
      html += '</div>\n';
      return html;
    }
    case 'overview': {
      const lines = t.split('\n');
      const title = lines[0].replace(/\*\*/g, '').replace(/:$/, '');
      const items = lines.slice(1).filter(l => l.trim().startsWith('- ') || l.trim().startsWith('* '));
      let html = `
        <div class="overview-card">
          <div class="overview-title">ℹ️ ${renderInline(title)}</div>
          <ul class="overview-list">
      `;
      items.forEach(item => {
        html += `<li class="overview-item"><span class="overview-bullet">•</span><span>${renderInline(item.replace(/^[-*]\s*/, ''))}</span></li>\n`;
      });
      html += `
          </ul>
        </div>
      `;
      return html;
    }
    case 'table':
      return renderTable(t.split('\n'));
    case 'bullet-list': {
      const items = t.split('\n').filter(l => l.trim());
      let html = '<ul>\n';
      items.forEach(item => {
        html += `<li>${renderInline(item.replace(/^[-*]\s*/, ''))}</li>\n`;
      });
      html += '</ul>\n';
      return html;
    }
    case 'label-group': {
      const m = t.match(LABEL_RE);
      const label = m ? m[1] : '';
      const content = t.replace(/^\*\*.*?:\*\*/, '').trim();
      return `
        <div class="label-group">
          <span class="label-title">${label}</span>
          <div class="label-content">${renderInline(content)}</div>
        </div>
      `;
    }
    case 'anatomy': {
      const lines = t.split('\n\n');
      const heading = lines[0].replace(/^###\s+/, '');
      let html = `
        <div class="anatomy-card">
          <div class="anatomy-title">📖 ${renderInline(heading)}</div>
      `;
      lines.slice(1).forEach(block => {
        const bt = block.trim();
        if (!bt) return;

        if (bt.startsWith('- ') || bt.startsWith('* ')) {
          const items = bt.split('\n').filter(s => s.trim());
          html += '<ul>\n';
          items.forEach(item => {
            html += `<li>${renderInline(item.replace(/^[-*]\s*/, ''))}</li>\n`;
          });
          html += '</ul>\n';
        } else if (LABEL_RE.test(bt)) {
          const l = bt.match(LABEL_RE)![1];
          const c = bt.replace(/^\*\*.*?:\*\*/, '').trim();
          html += `
            <div style="margin-top: 2mm;">
              <span class="label-title" style="display:inline-block; margin-bottom:0;">${l}:</span>
              <span style="color:#ccc; font-size:9.5pt;">${renderInline(c)}</span>
            </div>
          `;
        } else {
          html += `<p style="margin: 2mm 0 0;">${renderInline(bt)}</p>\n`;
        }
      });
      html += '</div>\n';
      return html;
    }
    case 'exercise': {
      const lines = t.split('\n\n');
      const heading = lines[0].replace(/^###\s+/, '');
      let restStart = 1;
      let statsLine = '';
      if (lines.length > 1 && isStatsBlock(lines[1])) {
        statsLine = lines[1].replace(/\*\*/g, '');
        restStart = 2;
      }
      const rest = lines.slice(restStart).join('\n\n');
      const subBlocks = rest.split('\n\n');

      let html = `
        <div class="exercise-box">
          <h4>${renderInline(heading)}</h4>
          ${statsLine ? `<div class="exercise-stats">🏋️‍♂️ ${renderInline(statsLine)}</div>` : ''}
          <div class="exercise-box-content">
      `;

      subBlocks.forEach(sb => {
        const sbt = sb.trim();
        if (!sbt) return;

        if (DICA_RE.test(sbt)) {
          const content = sbt.replace(DICA_RE, '').trim();
          html += `
            <div class="tip-box">
              <div class="tip-icon">💡</div>
              <div class="tip-content"><strong>Dica:</strong> ${renderInline(content)}</div>
            </div>
          `;
        } else if (WARNING_RE.test(sbt)) {
          const content = sbt.replace(WARNING_RE, '').trim();
          const label = sbt.match(WARNING_RE)![1];
          html += `
            <div class="warning-box">
              <div class="warning-icon">⚠️</div>
              <div class="warning-content"><strong>${label}:</strong> ${renderInline(content)}</div>
            </div>
          `;
        } else if (LABEL_RE.test(sbt)) {
          const m = sbt.match(LABEL_RE);
          const label = m ? m[1] : '';
          const content = sbt.replace(/^\*\*.*?:\*\*/, '').trim();
          html += `
            <div style="margin-top: 2mm;">
              <span class="label-title" style="display:inline-block; margin-bottom:0;">${label}:</span>
              <span style="color:#ccc; font-size:9.5pt;">${renderInline(content)}</span>
            </div>
          `;
        } else if (isStatsBlock(sbt)) {
          html += `<div class="exercise-stats" style="margin: 2mm 0;">${renderInline(sbt.replace(/\*\*/g, ''))}</div>\n`;
        } else if (sbt.startsWith('- ') || sbt.startsWith('* ')) {
          const items = sbt.split('\n').filter(s => s.trim());
          html += '<ul>\n';
          items.forEach(item => {
            html += `<li>${renderInline(item.replace(/^[-*]\s*/, ''))}</li>\n`;
          });
          html += '</ul>\n';
        } else if (PROTOCOL_STEP_RE.test(sbt)) {
          const steps = sbt.split('\n').filter(s => s.trim());
          html += '<div class="protocol-list">\n';
          steps.forEach((step, idx) => {
            html += `
              <div class="protocol-item">
                <div class="protocol-number">${idx + 1}</div>
                <div class="protocol-content">${renderInline(step.replace(/^\d+\.\s*/, ''))}</div>
              </div>\n`;
          });
          html += '</div>\n';
        } else if (sbt.startsWith('>')) {
          const qt = sbt.replace(/^>\s*/, '');
          html += `
            <div class="quote-box" style="padding:3mm; margin:3mm 0;">
              <div class="quote-text" style="font-size:10pt;">&ldquo;${renderInline(qt)}&rdquo;</div>
            </div>
          `;
        } else {
          html += `<p style="margin-bottom: 2mm;">${renderInline(sbt)}</p>\n`;
        }
      });

      html += '</div>\n</div>\n';
      return html;
    }
  }

  return '';
}

function mdToHtml(markdown: string): string {
  const blocks = buildBlocks(markdown);
  return blocks.map(renderBlockToHtml).join('\n');
}

// ─── PDF STYLES ───

const PDF_CSS = `
  @page {
    size: A4;
    margin: 18mm 16mm 12mm;
    background-color: #111111;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body {
    background: #111;
  }

  body {
    color: #e8e8e8;
    font-family: 'Montserrat', 'Segoe UI', Arial, sans-serif;
    font-size: 10.5pt;
    line-height: 1.6;
    padding: 0;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: 'Orbitron', 'Segoe UI', Arial, sans-serif;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #fff;
    page-break-after: avoid;
    page-break-inside: avoid;
  }

  h1 {
    font-size: 20pt;
    font-weight: 900;
    margin: 6mm 0 5mm;
    color: #B8956A;
  }

  h2 {
    font-size: 13pt;
    font-weight: 700;
    margin: 5mm 0 3mm;
    border-bottom: 1px solid #B8956A;
    padding-bottom: 2pt;
    color: #B8956A;
  }

  h3 {
    font-size: 11pt;
    font-weight: 700;
    margin: 4mm 0 2mm;
    color: #d4a86a;
  }

  h4 {
    font-size: 10pt;
    font-weight: 700;
    margin: 3mm 0 2mm;
    color: #c89a5a;
  }

  p {
    margin: 0 0 2mm;
    text-align: justify;
    orphans: 3;
    widows: 3;
  }

  strong {
    color: #fff;
    font-weight: 700;
  }

  em {
    color: #B8956A;
  }

  hr {
    border: none;
    border-top: 1px solid #B8956A;
    margin: 5mm 0;
    opacity: 0.4;
  }

  blockquote {
    margin: 2mm 0;
    padding: 2mm 4mm;
    border-left: 3px solid #B8956A;
    background: #1a1a1a;
    font-style: italic;
    color: #c0c0c0;
    page-break-inside: avoid;
  }

  blockquote strong {
    color: #B8956A;
  }

  ul, ol {
    margin: 1mm 0 2mm 4mm;
  }

  li {
    margin-bottom: 1mm;
    page-break-inside: avoid;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin: 3mm 0;
    font-size: 9pt;
    page-break-inside: avoid;
  }

  th {
    background: #B8956A;
    color: #111;
    padding: 1.5mm 3mm;
    text-align: left;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-size: 8pt;
  }

  td {
    padding: 1.5mm 3mm;
    border: 1px solid #333;
  }

  tr:nth-child(even) td {
    background: #1a1a1a;
  }

  pre, code {
    font-family: 'Courier New', monospace;
    font-size: 8pt;
    background: #1a1a1a;
    color: #B8956A;
  }

  pre {
    padding: 2mm;
    margin: 2mm 0;
    white-space: pre-wrap;
    border: 1px solid #333;
    page-break-inside: avoid;
  }

  code {
    padding: 0 1mm;
  }

  /* Cover page */
  .cover {
    page-break-after: always;
    page-break-before: avoid;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    min-height: 80vh;
    background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
    position: relative;
    margin: -18mm -16mm -12mm;
    padding: 18mm 16mm 12mm;
  }

  .cover::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background: radial-gradient(ellipse at center, rgba(184,149,106,0.08) 0%, transparent 70%);
  }

  .cover h1 {
    font-size: 32pt;
    margin: 0 0 5mm;
    letter-spacing: 0.15em;
    font-weight: 900;
    page-break-before: avoid;
  }

  .cover .subtitle {
    font-size: 12pt;
    color: #B8956A;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    margin-bottom: 15mm;
  }

  .cover .meta {
    font-size: 9pt;
    color: #888;
    margin-top: 20mm;
  }

  .cover .divider {
    width: 60mm;
    height: 1px;
    background: #B8956A;
    margin: 8mm auto;
    opacity: 0.5;
  }

  /* TOC */
  .toc {
    page-break-after: always;
    page-break-before: avoid;
  }

  .toc h2 {
    text-align: center;
    border: none;
    font-size: 16pt;
    margin-bottom: 8mm;
    page-break-before: avoid;
  }

  .toc-entry {
    display: flex;
    justify-content: space-between;
    padding: 1mm 0;
    border-bottom: 1px dotted #333;
    font-size: 10pt;
  }

  .toc-entry a {
    color: #ccc;
    text-decoration: none;
    flex: 1;
  }

  .toc-entry a:hover {
    color: #B8956A;
  }

  .toc-part {
    font-size: 11pt;
    color: #B8956A;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-top: 4mm;
    padding-top: 2mm;
    border-top: 1px solid #B8956A;
  }

  .toc-sub {
    padding-left: 5mm;
    font-size: 9pt;
  }

  /* Chapter content */
  .chapter-group {
    page-break-before: always;
  }

  .chapter-group:first-of-type {
    page-break-before: auto;
  }

  .chapter-group-header {
    text-align: center;
    padding: 0 0 4mm;
    margin-bottom: 6mm;
    border-bottom: 2px solid #B8956A;
  }

  .chapter-group-header h2 {
    border: none;
    margin: 0;
    font-size: 18pt;
    font-weight: 900;
    color: #B8956A;
    page-break-before: avoid;
  }

  .sub-chapter {
    margin-bottom: 10mm;
  }

  /* Exercise card */
  .exercise-card {
    margin-bottom: 12mm;
  }

  .exercise-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 4mm;
    padding-bottom: 2mm;
    border-bottom: 2px solid #B8956A;
    page-break-inside: avoid;
    page-break-after: avoid;
  }

  .exercise-header h2 {
    border: none;
    margin: 0;
    font-size: 14pt;
  }

  .exercise-meta {
    display: flex;
    gap: 3mm;
    flex-wrap: wrap;
    margin-bottom: 4mm;
    page-break-inside: avoid;
  }

  .exercise-meta span {
    font-size: 8pt;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    background: #1a1a1a;
    padding: 1mm 3mm;
    border: 1px solid #333;
    color: #B8956A;
  }

  .exercise-tips {
    margin-top: 4mm;
  }

  .exercise-tips h3 {
    font-size: 10pt;
    color: #B8956A;
  }

  .exercise-tips li {
    font-size: 9pt;
    color: #bbb;
  }

  /* Section break */
  .section-break {
    page-break-before: always;
    text-align: center;
    padding: 8mm 0 4mm;
  }

  .section-break + .chapter-group {
    page-break-before: avoid !important;
  }

  .section-break h2 {
    border: none;
    font-size: 20pt;
    color: #B8956A;
    margin-bottom: 3mm;
    page-break-before: avoid;
  }

  .section-break p {
    text-align: center;
    color: #888;
    font-size: 10pt;
  }

  /* ── Custom Boxes and Cards (Design System matching the web app) ── */
  
  .exercise-box {
    background: #161616;
    border: 1px solid #2a2a2a;
    border-left: 4px solid #B8956A;
    padding: 4mm 5mm;
    margin: 5mm 0;
    border-radius: 4px;
    page-break-inside: avoid;
  }

  .exercise-box h4 {
    font-family: 'Orbitron', 'Segoe UI', Arial, sans-serif;
    font-size: 12pt;
    font-weight: 700;
    color: #fff;
    margin-bottom: 2mm;
    border: none;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }

  .exercise-stats {
    display: inline-block;
    background: rgba(184, 149, 106, 0.12);
    color: #B8956A;
    font-size: 8.5pt;
    font-weight: 700;
    padding: 1mm 2.5mm;
    border-radius: 4px;
    margin-top: 1mm;
    margin-bottom: 3.5mm;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .quote-box {
    background: rgba(184, 149, 106, 0.04);
    border-left: 4px solid #B8956A;
    padding: 4mm 5mm;
    margin: 5mm 0;
    border-radius: 4px;
    page-break-inside: avoid;
  }

  .quote-text {
    font-size: 11pt;
    font-style: italic;
    font-weight: 300;
    color: #e0e0e0;
    line-height: 1.5;
  }

  .quote-attribution {
    font-size: 8.5pt;
    color: #B8956A;
    font-weight: 600;
    margin-top: 2mm;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .tip-box, .warning-box {
    background: #161616;
    border: 1px solid rgba(184, 149, 106, 0.15);
    padding: 3.5mm 4mm;
    margin: 4mm 0;
    border-radius: 4px;
    display: flex;
    gap: 3mm;
    align-items: flex-start;
    page-break-inside: avoid;
  }

  .warning-box {
    border-color: rgba(184, 149, 106, 0.25);
  }

  .tip-icon, .warning-icon {
    font-size: 12pt;
    flex-shrink: 0;
    line-height: 1;
  }

  .tip-content, .warning-content {
    color: #ccc;
    font-size: 9.5pt;
    line-height: 1.5;
    flex: 1;
  }

  .protocol-list {
    margin: 5mm 0;
    padding: 0;
  }

  .protocol-item {
    display: flex;
    gap: 4mm;
    align-items: flex-start;
    margin-bottom: 3mm;
    page-break-inside: avoid;
  }

  .protocol-number {
    flex-shrink: 0;
    width: 6.5mm;
    height: 6.5mm;
    border-radius: 50%;
    background: rgba(184, 149, 106, 0.15);
    color: #B8956A;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 8.5pt;
    font-weight: 700;
  }

  .protocol-content {
    color: #e8e8e8;
    font-size: 9.5pt;
    line-height: 1.5;
    flex: 1;
  }

  .overview-card {
    background: #161616;
    border: 1px solid #2a2a2a;
    padding: 4mm 5mm;
    margin: 5mm 0;
    border-radius: 4px;
    page-break-inside: avoid;
  }

  .overview-title {
    font-family: 'Orbitron', 'Segoe UI', Arial, sans-serif;
    font-size: 9.5pt;
    font-weight: 700;
    color: #B8956A;
    margin-bottom: 2.5mm;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .overview-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .overview-item {
    display: flex;
    gap: 2mm;
    color: #ccc;
    font-size: 9.5pt;
    margin-bottom: 1.5mm;
    align-items: flex-start;
  }

  .overview-bullet {
    color: #B8956A;
    font-weight: bold;
    line-height: 1;
  }

  .label-group {
    background: #161616;
    border: 1px solid #2a2a2a;
    padding: 3.5mm 4mm;
    margin: 4mm 0;
    border-radius: 4px;
    page-break-inside: avoid;
  }

  .label-title {
    font-family: 'Orbitron', 'Segoe UI', Arial, sans-serif;
    font-size: 8.5pt;
    font-weight: 700;
    color: #B8956A;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    display: block;
    margin-bottom: 1.5mm;
  }

  .label-content {
    color: #ccc;
    font-size: 9.5pt;
    line-height: 1.5;
  }

  .anatomy-card {
    background: #161616;
    border: 1px solid #2a2a2a;
    border-left: 4px solid #B8956A;
    padding: 4mm 5mm;
    margin: 5mm 0;
    border-radius: 4px;
    page-break-inside: avoid;
  }

  .anatomy-title {
    font-family: 'Orbitron', 'Segoe UI', Arial, sans-serif;
    font-size: 11pt;
    font-weight: 700;
    color: #fff;
    margin-bottom: 2.5mm;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }

  @media print {
    body { background: #111; }
  }
`;

// ─── HTML GENERATORS ───

function wrapHtml(title: string, bodyHtml: string): string {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=Orbitron:wght@500;700;900&display=swap" rel="stylesheet">
<style>${PDF_CSS}</style>
</head>
<body>
${bodyHtml}
</body>
</html>`;
}

function buildToc(chapterGroups: ChapterGroup[], chapters: Chapter[], isBook: boolean): string {
  let html = '<div class="toc">\n';
  html += '<h2>Sumário</h2>\n';

  const renderEntry = (label: string, id: string, indent = false) => {
    const cls = indent ? 'toc-entry toc-sub' : 'toc-entry';
    return `<div class="${cls}"><a href="#${id}">${label}</a></div>\n`;
  };

  // Part I
  html += '<div class="toc-part">Parte I — O Programa</div>\n';
  const part1Groups = chapterGroups.filter(g => g.part === 'I');
  for (const group of part1Groups) {
    html += renderEntry(group.title, `group-${group.id}`);
    for (const slug of group.children) {
      const ch = chapters.find(c => c.slug === slug);
      if (ch) {
        html += renderEntry(ch.title, `chapter-${ch.slug}`, true);
      }
    }
  }

  // Part II
  html += '<div class="toc-part">Parte II — Fundamentos</div>\n';
  const part2Groups = chapterGroups.filter(g => g.part === 'II');
  for (const group of part2Groups) {
    html += renderEntry(group.title, `group-${group.id}`);
    for (const slug of group.children) {
      const ch = chapters.find(c => c.slug === slug);
      if (ch) {
        html += renderEntry(ch.title, `chapter-${ch.slug}`, true);
      }
    }
  }

  html += '</div>\n';
  return html;
}

function buildChapterContent(slug: string): string {
  let content = getChapterContent(slug) ?? '';
  if (!content) return '<p>Conteúdo não disponível.</p>';
  // Remove first # Title (chapter-header provides it in PDF, avoid duplicate)
  content = content.replace(/^#\s+.+(\n|$)/, '');
  return mdToHtml(content);
}

function generateBookHtml(): string {
  const introChapter = chapters.find(c => c.slug === 'introducao');

  let body = '';

  // ── Cover ──
  body += `<div class="cover">
    <h1>BACK DISCIPLINE</h1>
    <div class="divider"></div>
    <div class="subtitle">Método Mountain Dog</div>
    <div class="subtitle" style="font-size:9pt;color:#888">Programa de 6 Semanas para Costas</div>
    <div class="meta">João Monteiro • Educador Físico e Nutricionista</div>
  </div>\n`;

  // ── TOC ──
  body += buildToc(chapterGroups, chapters, true);

  // ── Content ──
  const part1Groups = chapterGroups.filter(g => g.part === 'I');
  const part2Groups = chapterGroups.filter(g => g.part === 'II');

  // Intro (before Part I)
  body += '<div class="chapter-group" id="chapter-introducao">\n';
  body += '<div class="chapter-group-header"><h2>Introdução</h2></div>\n';
  if (introChapter) {
    body += buildChapterContent(introChapter.slug);
  }
  body += '</div>\n';

  // Part I
  body += '<div class="section-break"><h2>Parte I</h2><p>O Programa</p></div>\n';

  for (const group of part1Groups) {
    body += `<div class="chapter-group" id="group-${group.id}">\n`;
    body += `<div class="chapter-group-header"><h2>${group.title}</h2></div>\n`;
    for (const slug of group.children) {
      const ch = chapters.find(c => c.slug === slug);
      if (!ch) continue;
      body += `<div class="sub-chapter" id="chapter-${slug}">\n`;
      body += `<h2>${ch.title}</h2>\n`;
      body += buildChapterContent(slug);
      body += '</div>\n';
    }
    body += '</div>\n';
  }

  // Part II
  body += '<div class="section-break"><h2>Parte II</h2><p>Fundamentos</p></div>\n';

  for (const group of part2Groups) {
    body += `<div class="chapter-group" id="group-${group.id}">\n`;
    body += `<div class="chapter-group-header"><h2>${group.title}</h2></div>\n`;
    for (const slug of group.children) {
      const ch = chapters.find(c => c.slug === slug);
      if (!ch) continue;
      body += `<div class="sub-chapter" id="chapter-${slug}">\n`;
      body += `<h2>${ch.title}</h2>\n`;
      body += buildChapterContent(slug);
      body += '</div>\n';
    }
    body += '</div>\n';
  }

  return wrapHtml('Back Discipline — Livro', body);
}

function generateExercisesHtml(): string {
  let body = '';

  // ── Cover ──
  body += `<div class="cover">
    <h1>BACK DISCIPLINE</h1>
    <div class="divider"></div>
    <div class="subtitle">Biblioteca de Exercícios</div>
    <div class="meta">${exercises.length} exercícios • ${new Date().toLocaleDateString('pt-BR')}</div>
  </div>\n`;

  // ── TOC ──
  body += '<div class="toc">\n<h2>Índice de Exercícios</h2>\n';

  const categories = ['Remadas', 'Puxadas', 'Levantamento', 'Isolamento', 'Funcional'];
  for (const cat of categories) {
    const catExercises = exercises.filter(e => e.category === cat);
    if (catExercises.length === 0) continue;
    body += `<div class="toc-part">${cat}</div>\n`;
    for (const ex of catExercises) {
      body += `<div class="toc-entry"><a href="#ex-${ex.id}">${ex.name}</a></div>\n`;
    }
  }
  body += '</div>\n';

  // ── Exercises ──
  for (const ex of exercises) {
    body += `<div class="exercise-card" id="ex-${ex.id}">\n`;
    body += '<div class="exercise-header">\n';
    body += `<h2>${ex.name}</h2>\n`;
    body += '</div>\n';

    body += '<div class="exercise-meta">\n';
    body += `<span>${ex.category}</span>\n`;
    body += `<span>${ex.difficulty}</span>\n`;
    body += `<span>${ex.muscles.join(', ')}</span>\n`;
    body += '</div>\n';

    // Description
    body += `<p><strong>${ex.description}</strong></p>\n`;

    // Full description
    if (ex.fullDescription) {
      body += '<div class="full-description">\n';
      body += mdToHtml(ex.fullDescription);
      body += '</div>\n';
    }

    // Tips
    if (ex.tips && ex.tips.length > 0) {
      body += '<div class="exercise-tips">\n';
      body += '<h3>Dicas</h3>\n<ul>\n';
      for (const tip of ex.tips) {
        body += `<li>${tip}</li>\n`;
      }
      body += '</ul>\n</div>\n';
    }

    body += '</div>\n';
  }

  return wrapHtml('Back Discipline — Biblioteca de Exercícios', body);
}

// ─── PDF GENERATION ───

async function generatePdf(html: string, outputPath: string): Promise<void> {
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\Users\\gnnss\\AppData\\Local\\ms-playwright\\chromium-1223\\chrome-win64\\chrome.exe',
  });
  const page = await browser.newPage({ deviceScaleFactor: 2 });

  await page.setContent(html, { waitUntil: 'networkidle' });

  await page.pdf({
    path: outputPath,
    format: 'A4',
    margin: { top: '0', bottom: '0', left: '0', right: '0' },
    printBackground: true,
  });

  await browser.close();
  console.log(`PDF generated: ${outputPath}`);
}

// ─── MAIN ───

async function main() {
  if (!existsSync(PUBLIC_DIR)) {
    mkdirSync(PUBLIC_DIR, { recursive: true });
  }

  // Generate Book PDF
  console.log('Generating book HTML...');
  const bookHtml = generateBookHtml();
  const bookHtmlPath = join(SCRIPTS_DIR, 'temp-book.html');
  writeFileSync(bookHtmlPath, bookHtml, 'utf-8');
  console.log(`Book HTML saved: ${bookHtmlPath}`);

  console.log('Generating book PDF...');
  await generatePdf(bookHtml, join(PUBLIC_DIR, 'back-discipline-livro.pdf'));

  // Generate Exercises PDF
  console.log('Generating exercises HTML...');
  const exHtml = generateExercisesHtml();
  const exHtmlPath = join(SCRIPTS_DIR, 'temp-exercises.html');
  writeFileSync(exHtmlPath, exHtml, 'utf-8');
  console.log(`Exercises HTML saved: ${exHtmlPath}`);

  console.log('Generating exercises PDF...');
  await generatePdf(exHtml, join(PUBLIC_DIR, 'back-discipline-biblioteca.pdf'));

  // Clean up temp files
  try { unlinkSync(bookHtmlPath); } catch { }
  try { unlinkSync(exHtmlPath); } catch { }

  console.log('\nDone! PDFs generated in:');
  console.log(`  ${join(PUBLIC_DIR, 'back-discipline-livro.pdf')}`);
  console.log(`  ${join(PUBLIC_DIR, 'back-discipline-biblioteca.pdf')}`);
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
