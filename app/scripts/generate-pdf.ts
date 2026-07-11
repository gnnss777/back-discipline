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

function mdToHtml(markdown: string): string {
  const blocks = markdown.split('\n\n');
  const html: string[] = [];
  let inTable = false;
  let tableRows: string[] = [];
  let inList: string[] | null = null;
  let listOrdered = false;
  let inCodeBlock = false;
  let codeContent = '';
  let codeLang = '';

  function flushList() {
    if (inList) {
      html.push(renderList(inList, listOrdered));
      inList = null;
    }
  }

  function flushTable() {
    if (tableRows.length > 0) {
      html.push(renderTable(tableRows));
      tableRows = [];
      inTable = false;
    }
  }

  for (const block of blocks) {
    if (!block.trim()) continue;

    // Code block
    if (block.startsWith('```')) {
      if (!inCodeBlock) {
        inCodeBlock = true;
        codeLang = block.replace('```', '').trim();
        codeContent = '';
        continue;
      } else {
        inCodeBlock = false;
        html.push(`<pre><code>${escapeHtml(codeContent.trim())}</code></pre>\n`);
        continue;
      }
    }
    if (inCodeBlock) {
      codeContent += block + '\n\n';
      continue;
    }

    const lines = block.split('\n');

    // Table
    if (lines[0].trim().startsWith('|')) {
      inTable = true;
      tableRows.push(...lines);
      continue;
    }

    flushTable();
    if (inTable) flushTable();

    // List (unordered)
    if (lines[0].match(/^[-*]\s/)) {
      if (inList && listOrdered) flushList();
      if (!inList) {
        inList = [];
        listOrdered = false;
      }
      inList.push(...lines);
      continue;
    }

    // List (ordered)
    if (lines[0].match(/^\d+\.\s/)) {
      if (inList && !listOrdered) flushList();
      if (!inList) {
        inList = [];
        listOrdered = true;
      }
      inList.push(...lines);
      continue;
    }

    flushList();

    // Horizontal rule
    if (block.trim() === '---') {
      html.push('<hr />\n');
      continue;
    }

    // Headings
    const hMatch = block.match(/^(#{1,4})\s+(.+)$/m);
    if (hMatch) {
      const level = hMatch[1].length;
      const text = renderInline(hMatch[2].trim());
      html.push(`<h${level}>${text}</h${level}>\n`);
      // If there's more content after the heading on same block
      const rest = block.replace(/^#{1,4}\s+.+$/, '').trim();
      if (rest) {
        for (const line of rest.split('\n').filter(l => l.trim())) {
          html.push(`<p>${renderInline(line.trim())}</p>\n`);
        }
      }
      continue;
    }

    // Blockquote
    if (lines[0].startsWith('>')) {
      const quoteText = lines.map(l => l.replace(/^>\s?/, '')).join(' ').trim();
      html.push(`<blockquote>${renderInline(quoteText)}</blockquote>\n`);
      continue;
    }

    // Paragraph
    const paragraph = lines.map(l => renderInline(l.trim())).join(' ');
    if (paragraph.trim()) {
      html.push(`<p>${paragraph}</p>\n`);
    }
  }

  flushList();
  flushTable();
  if (inCodeBlock) {
    html.push(`<pre><code>${escapeHtml(codeContent.trim())}</code></pre>\n`);
  }

  return html.join('\n');
}

// ─── PDF STYLES ───

const PDF_CSS = `
  @page {
    size: A4;
    margin: 15mm 20mm;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    background: #111;
    color: #e8e8e8;
    font-family: 'Montserrat', 'Segoe UI', Arial, sans-serif;
    font-size: 10pt;
    line-height: 1.6;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: 'Orbitron', 'Segoe UI', Arial, sans-serif;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #fff;
    page-break-after: avoid;
  }

  h1 {
    font-size: 20pt;
    font-weight: 900;
    margin: 30mm 0 10mm;
    text-align: center;
    color: #B8956A;
  }

  h2 {
    font-size: 14pt;
    font-weight: 700;
    margin: 15mm 0 6mm;
    border-bottom: 2px solid #B8956A;
    padding-bottom: 4pt;
    color: #B8956A;
  }

  h3 {
    font-size: 11pt;
    font-weight: 700;
    margin: 10mm 0 4mm;
    color: #d4a86a;
  }

  h4 {
    font-size: 10pt;
    font-weight: 700;
    margin: 6mm 0 3mm;
    color: #c89a5a;
  }

  p {
    margin: 0 0 3mm;
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
    margin: 8mm 0;
    opacity: 0.4;
  }

  blockquote {
    margin: 4mm 0;
    padding: 3mm 5mm;
    border-left: 3px solid #B8956A;
    background: #1a1a1a;
    font-style: italic;
    color: #c0c0c0;
  }

  blockquote strong {
    color: #B8956A;
  }

  ul, ol {
    margin: 2mm 0 3mm 5mm;
  }

  li {
    margin-bottom: 1mm;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin: 4mm 0;
    font-size: 9pt;
  }

  th {
    background: #B8956A;
    color: #111;
    padding: 2mm 3mm;
    text-align: left;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-size: 8pt;
  }

  td {
    padding: 2mm 3mm;
    border: 1px solid #333;
  }

  tr:nth-child(even) td {
    background: #1a1a1a;
  }

  pre, code {
    font-family: 'Courier New', monospace;
    font-size: 9pt;
    background: #1a1a1a;
    color: #B8956A;
  }

  pre {
    padding: 3mm;
    margin: 4mm 0;
    white-space: pre-wrap;
    border: 1px solid #333;
  }

  code {
    padding: 0 1mm;
  }

  /* Cover page */
  .cover {
    page-break-after: always;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    height: 100vh;
    background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
    position: relative;
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
  }

  .toc h2 {
    text-align: center;
    border: none;
    font-size: 16pt;
    margin-bottom: 10mm;
  }

  .toc-entry {
    display: flex;
    justify-content: space-between;
    padding: 1.5mm 0;
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
    margin-top: 5mm;
    padding-top: 3mm;
    border-top: 1px solid #B8956A;
  }

  .toc-sub {
    padding-left: 5mm;
    font-size: 9pt;
  }

  /* Chapter content */
  .chapter {
    page-break-before: always;
  }

  .chapter:first-of-type {
    page-break-before: auto;
  }

  .chapter-header {
    text-align: center;
    padding: 15mm 0 8mm;
    margin-bottom: 8mm;
    border-bottom: 1px solid #B8956A;
  }

  .chapter-header h2 {
    border: none;
    margin: 0;
    font-size: 16pt;
  }

  /* Exercise card */
  .exercise-card {
    page-break-inside: avoid;
    page-break-after: always;
  }

  .exercise-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 6mm;
    padding-bottom: 3mm;
    border-bottom: 2px solid #B8956A;
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
    padding: 30mm 0;
  }

  .section-break h2 {
    border: none;
    font-size: 20pt;
    color: #B8956A;
    margin-bottom: 5mm;
  }

  .section-break p {
    text-align: center;
    color: #888;
    font-size: 10pt;
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
  const content = getChapterContent(slug);
  if (!content) return '<p>Conteúdo não disponível.</p>';
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
  body += '<div class="chapter" id="chapter-introducao">\n';
  body += '<div class="chapter-header"><h2>Introdução</h2></div>\n';
  if (introChapter) {
    body += buildChapterContent(introChapter.slug);
  }
  body += '</div>\n';

  // Part I
  body += '<div class="section-break"><h2>Parte I</h2><p>O Programa</p></div>\n';

  for (const group of part1Groups) {
    for (const slug of group.children) {
      const ch = chapters.find(c => c.slug === slug);
      if (!ch) continue;
      body += `<div class="chapter" id="chapter-${slug}">\n`;
      body += `<div class="chapter-header"><h2>${ch.title}</h2></div>\n`;
      body += buildChapterContent(slug);
      body += '</div>\n';
    }
  }

  // Part II
  body += '<div class="section-break"><h2>Parte II</h2><p>Fundamentos</p></div>\n';

  for (const group of part2Groups) {
    for (const slug of group.children) {
      const ch = chapters.find(c => c.slug === slug);
      if (!ch) continue;
      body += `<div class="chapter" id="chapter-${slug}">\n`;
      body += `<div class="chapter-header"><h2>${ch.title}</h2></div>\n`;
      body += buildChapterContent(slug);
      body += '</div>\n';
    }
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
    margin: { top: '15mm', bottom: '15mm', left: '20mm', right: '20mm' },
    printBackground: true,
    displayHeaderFooter: true,
    headerTemplate: '<div style="font-size:7pt;color:#666;text-align:center;width:100%;padding:2mm 20mm;font-family:Montserrat,sans-serif;">BACK DISCIPLINE</div>',
    footerTemplate: '<div style="font-size:7pt;color:#666;text-align:center;width:100%;padding:2mm 20mm;font-family:Montserrat,sans-serif;"><span class="pageNumber"></span> / <span class="totalPages"></span></div>',
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
