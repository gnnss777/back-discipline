'use client'

import { useState } from 'react'
import { Plus, Text, Heading1, Lightbulb, AlertTriangle, Dumbbell, Quote, List as ListIcon, Library } from 'lucide-react'
import type { Block, BlockType } from '@/types/blocks'
import { makeBlock } from '@/lib/blocks'

interface AddBlockButtonProps {
  onAdd: (block: Block) => void
}

interface Option {
  type: BlockType
  label: string
  icon: React.ReactNode
  build: () => Block
}

const options: Option[] = [
  { type: 'paragraph', label: 'Parágrafo', icon: <Text className="w-4 h-4" />, build: () => makeBlock('paragraph') },
  { type: 'heading', label: 'Título', icon: <Heading1 className="w-4 h-4" />, build: () => makeBlock('heading', { level: 2 }) },
  { type: 'tip', label: 'Dica', icon: <Lightbulb className="w-4 h-4 text-emerald-400" />, build: () => makeBlock('tip') },
  { type: 'warning', label: 'Aviso', icon: <AlertTriangle className="w-4 h-4 text-amber-400" />, build: () => makeBlock('warning') },
  { type: 'exercise', label: 'Exercício', icon: <Dumbbell className="w-4 h-4 text-blue-400" />, build: () => makeBlock('exercise') },
  { type: 'quote', label: 'Citação', icon: <Quote className="w-4 h-4" />, build: () => makeBlock('quote') },
  { type: 'list', label: 'Lista', icon: <ListIcon className="w-4 h-4" />, build: () => makeBlock('list', { items: [''] }) },
  { type: 'library_item', label: 'Item da biblioteca', icon: <Library className="w-4 h-4" />, build: () => makeBlock('library_item') },
]

export function AddBlockButton({ onAdd }: AddBlockButtonProps) {
  const [open, setOpen] = useState(false)
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[oklch(76%.14_230)] text-black font-semibold text-sm hover:brightness-110"
      >
        <Plus className="w-4 h-4" />
        Adicionar bloco
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-full mt-2 z-50 w-64 bg-[oklch(18%.01_270)] border border-[oklch(25%.01_270)] rounded-lg shadow-xl">
            <div className="p-1">
              {options.map((opt) => (
                <button
                  key={opt.type}
                  type="button"
                  onClick={() => {
                    onAdd(opt.build())
                    setOpen(false)
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded text-sm text-[oklch(97%.005_240)] hover:bg-[oklch(76%.14_230/0.1)] text-left"
                >
                  {opt.icon}
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
