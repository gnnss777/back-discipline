'use client'

import { useState, useMemo } from 'react'
import { Bold, Italic, List, Heading1, Heading2, Quote, Code, Eye } from 'lucide-react'

function parseMarkdown(md: string): string {
  let html = md
    .replace(/^### (.+)$/gm, '<h3 class="text-lg font-semibold text-[oklch(97%.005_240)] mt-4 mb-2">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-xl font-semibold text-[oklch(97%.005_240)] mt-6 mb-3">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold text-[oklch(97%.005_240)] mt-8 mb-4">$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-[oklch(97%.005_240)]">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code class="bg-[oklch(25%.01_270)] px-1 rounded text-sm">$1</code>')
    .replace(/^- (.+)$/gm, '<li class="text-[oklch(90%.01_240)] ml-4 list-disc">$1</li>')
    .replace(/^\d\. (.+)$/gm, '<li class="text-[oklch(90%.01_240)] ml-4 list-decimal">$1</li>')

  // Custom boxes
  html = html.replace(
    /:::tip\n([\s\S]*?):::/g,
    '<div class="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 my-4"><p class="text-sm text-emerald-400 mb-1">\uD83D\uDCA1 Dica</p>$1</div>'
  )
  html = html.replace(
    /:::warning\n([\s\S]*?):::/g,
    '<div class="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 my-4"><p class="text-sm text-amber-400 mb-1">\u26A0\uFE0F Atenção</p>$1</div>'
  )
  html = html.replace(
    /:::exercise\n([\s\S]*?):::/g,
    '<div class="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 my-4"><p class="text-sm text-blue-400 mb-1">\uD83C\uDFCB\uFE0F Exercício</p>$1</div>'
  )
  html = html.replace(
    /:::quote\n([\s\S]*?):::/g,
    '<blockquote class="border-l-4 border-[oklch(76%.14_230)] pl-4 my-4 italic text-[oklch(70%.01_240)]">$1</blockquote>'
  )

  return html
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
