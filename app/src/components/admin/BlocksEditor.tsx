'use client'

import { useState, useMemo } from 'react'
import { Eye, Edit3 } from 'lucide-react'
import type { Block } from '@/types/blocks'
import { BlockEditor } from './blocks/BlockEditor'
import { AddBlockButton } from './blocks/AddBlockButton'
import { BlockPreview } from './BlockPreview'

interface BlocksEditorProps {
  blocks: Block[]
  onChange: (blocks: Block[], markdown: string) => void
  serialize: (blocks: Block[]) => string
}

export function BlocksEditor({ blocks, onChange, serialize }: BlocksEditorProps) {
  const [view, setView] = useState<'edit' | 'preview'>('edit')

  function update(idx: number, next: Block) {
    const newBlocks = [...blocks]
    newBlocks[idx] = next
    onChange(newBlocks, serialize(newBlocks))
  }

  function move(idx: number, direction: -1 | 1) {
    const target = idx + direction
    if (target < 0 || target >= blocks.length) return
    const newBlocks = [...blocks]
    ;[newBlocks[idx], newBlocks[target]] = [newBlocks[target], newBlocks[idx]]
    onChange(newBlocks, serialize(newBlocks))
  }

  function remove(idx: number) {
    const newBlocks = blocks.filter((_, i) => i !== idx)
    onChange(newBlocks, serialize(newBlocks))
  }

  function add(newBlock: Block) {
    // If the new block is a heading at level 1 or 2, insert after current heading
    const newBlocks = [...blocks, newBlock]
    onChange(newBlocks, serialize(newBlocks))
  }

  const empty = useMemo(() => blocks.length === 0, [blocks])

  return (
    <div className="flex flex-col h-full border border-[oklch(25%.01_270)] rounded-xl overflow-hidden bg-[oklch(15%.01_270)]">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-[oklch(25%.01_270)] bg-[oklch(15%.01_270)] flex-wrap">
        <AddBlockButton onAdd={add} />
        <span className="text-xs text-[oklch(50%.01_270)]">{blocks.length} bloco(s)</span>
        <span className="flex-1" />
        <button
          type="button"
          onClick={() => setView(view === 'edit' ? 'preview' : 'edit')}
          className={`flex items-center gap-1 px-3 py-1.5 rounded text-xs ${
            view === 'preview'
              ? 'bg-[oklch(76%.14_230)/0.2] text-[oklch(76%.14_230)]'
              : 'text-[oklch(70%.01_240)] hover:bg-[oklch(25%.01_270)]'
          }`}
        >
          {view === 'preview' ? (
            <>
              <Edit3 className="w-3.5 h-3.5" /> Editar
            </>
          ) : (
            <>
              <Eye className="w-3.5 h-3.5" /> Preview
            </>
          )}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {view === 'edit' ? (
          empty ? (
            <div className="flex items-center justify-center h-full text-sm text-[oklch(50%.01_270)] italic">
              Use o bot\u00e3o "Adicionar bloco" para come\u00e7ar.
            </div>
          ) : (
            <div className="space-y-3 max-w-3xl mx-auto">
              {blocks.map((block, idx) => (
                <BlockEditor
                  key={block.id}
                  block={block}
                  onChange={(next) => update(idx, next)}
                  onDelete={() => remove(idx)}
                  onMoveUp={() => move(idx, -1)}
                  onMoveDown={() => move(idx, 1)}
                  canMoveUp={idx > 0}
                  canMoveDown={idx < blocks.length - 1}
                />
              ))}
            </div>
          )
        ) : (
          <div className="max-w-3xl mx-auto">
            <BlockPreview blocks={blocks} />
          </div>
        )}
      </div>
    </div>
  )
}
