'use client'

import { Lightbulb, AlertTriangle, Dumbbell, Quote, Library } from 'lucide-react'
import type { Block } from '@/types/blocks'

export function BlockPreview({ blocks }: { blocks: Block[] }) {
  return (
    <div className="space-y-4 text-[oklch(90%.01_240)]">
      {blocks.length === 0 && (
        <p className="text-sm text-[oklch(50%.01_270)] italic">Adicione um bloco para começar...</p>
      )}
      {blocks.map((block) => (
        <BlockRender key={block.id} block={block} />
      ))}
    </div>
  )
}

function BlockRender({ block }: { block: Block }) {
  switch (block.type) {
    case 'paragraph':
      return <p className="leading-relaxed">{block.content}</p>
    case 'heading':
      if (block.level === 1) return <h1 className="text-3xl font-medium text-[oklch(97%.005_240)] mt-6 mb-3 tracking-wider">{block.content}</h1>
      if (block.level === 2) return <h2 className="text-2xl font-medium text-[oklch(97%.005_240)] mt-5 mb-2 tracking-wider border-b border-[oklch(25%.01_270)] pb-2">{block.content}</h2>
      return <h3 className="text-lg font-bold text-[oklch(76%.14_230)] mt-4 mb-2 tracking-wider">{block.content}</h3>
    case 'tip':
      return (
        <div className="flex gap-3 p-4 bg-[oklch(18%.01_270)] border border-emerald-500/30 rounded my-4">
          <Lightbulb className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm leading-relaxed whitespace-pre-wrap">{block.content}</div>
        </div>
      )
    case 'warning':
      return (
        <div className="flex gap-3 p-4 bg-[oklch(18%.01_270)] border border-amber-500/30 rounded my-4">
          <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm leading-relaxed whitespace-pre-wrap">{block.content}</div>
        </div>
      )
    case 'exercise':
      return (
        <div className="p-5 bg-[oklch(18%.01_270)] border-l-4 border-l-blue-400 border border-[oklch(25%.01_270)] rounded my-4">
          <div className="flex items-center gap-2 mb-2">
            <Dumbbell className="w-4 h-4 text-blue-400" />
            <h4 className="text-base font-bold text-[oklch(97%.005_240)] tracking-wider">{block.title || 'Exerc\u00edcio'}</h4>
          </div>
          {block.muscles && (
            <p className="text-xs text-blue-400 mb-2">
              <strong className="text-blue-300">M\u00fasculos:</strong> {block.muscles}
            </p>
          )}
          <div className="text-sm leading-relaxed whitespace-pre-wrap">{block.content}</div>
        </div>
      )
    case 'quote':
      return (
        <div className="p-6 bg-[oklch(76%.14_230/0.05)] border-l-4 border-l-[oklch(76%.14_230)] rounded my-4">
          <Quote className="w-6 h-6 text-[oklch(76%.14_230)/0.4] mb-2" />
          <p className="text-base italic text-[oklch(97%.005_240)] font-light leading-relaxed whitespace-pre-wrap">&ldquo;{block.content}&rdquo;</p>
          {block.attribution && (
            <p className="text-sm text-[oklch(76%.14_230)] mt-2 font-medium tracking-wider">&mdash; {block.attribution}</p>
          )}
        </div>
      )
    case 'list':
      return block.ordered ? (
        <ol className="space-y-2 my-3 ml-6 list-decimal">
          {block.items.map((item, idx) => (
            <li key={idx} className="leading-relaxed">{item}</li>
          ))}
        </ol>
      ) : (
        <ul className="space-y-2 my-3 ml-6 list-disc">
          {block.items.map((item, idx) => (
            <li key={idx} className="leading-relaxed">{item}</li>
          ))}
        </ul>
      )
    case 'library_item':
      return (
        <a
          href={`/biblioteca/${block.exercise_slug}`}
          target="_blank"
          rel="noopener"
          className="flex items-center gap-2 p-3 bg-[oklch(76%.14_230/0.1)] border border-[oklch(76%.14_230/0.3)] rounded my-3 text-[oklch(76%.14_230)] hover:bg-[oklch(76%.14_230/0.2)]"
        >
          <Library className="w-4 h-4" />
          <span className="font-mono text-sm">{block.exercise_slug}</span>
        </a>
      )
    default:
      return null
  }
}
