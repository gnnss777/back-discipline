'use client'

import { ReactNode } from 'react'
import { ArrowUp, ArrowDown, Trash2 } from 'lucide-react'
import type { BlockType } from '@/types/blocks'

interface BlockContainerProps {
  type: BlockType
  label: string
  icon: ReactNode
  accent?: 'tip' | 'warning' | 'exercise' | 'default'
  canMoveUp?: boolean
  canMoveDown?: boolean
  onMoveUp?: () => void
  onMoveDown?: () => void
  onDelete?: () => void
  children: ReactNode
}

const accentBorder: Record<NonNullable<BlockContainerProps['accent']>, string> = {
  tip: 'border-l-emerald-400',
  warning: 'border-l-amber-400',
  exercise: 'border-l-blue-400',
  default: 'border-l-[oklch(25%.01_270)]',
}

const accentIcon: Record<NonNullable<BlockContainerProps['accent']>, string> = {
  tip: 'text-emerald-400',
  warning: 'text-amber-400',
  exercise: 'text-blue-400',
  default: 'text-[oklch(76%.14_230)]',
}

export function BlockContainer({
  type,
  label,
  icon,
  accent = 'default',
  canMoveDown,
  canMoveUp,
  onMoveDown,
  onMoveUp,
  onDelete,
  children,
}: BlockContainerProps) {
  return (
    <div
      className={`group bg-[oklch(18%.01_270)] border border-[oklch(25%.01_270)] border-l-4 ${accentBorder[accent]} rounded-lg overflow-hidden`}
    >
      <div className="flex items-center gap-2 px-3 py-1.5 border-b border-[oklch(25%.01_270)] bg-[oklch(15%.01_270)]">
        <span className={accentIcon[accent]}>{icon}</span>
        <span className="text-xs font-medium uppercase tracking-wider text-[oklch(70%.01_240)]">
          {label}
        </span>
        <span className="ml-auto flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={onMoveUp}
            disabled={!canMoveUp}
            className="p-1 rounded text-[oklch(70%.01_240)] hover:bg-[oklch(25%.01_270)] disabled:opacity-30 disabled:hover:bg-transparent"
            aria-label="Mover para cima"
          >
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={onMoveDown}
            disabled={!canMoveDown}
            className="p-1 rounded text-[oklch(70%.01_240)] hover:bg-[oklch(25%.01_270)] disabled:opacity-30 disabled:hover:bg-transparent"
            aria-label="Mover para baixo"
          >
            <ArrowDown className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="p-1 rounded text-red-400 hover:bg-red-500/20"
            aria-label="Excluir bloco"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </span>
      </div>
      <div className="p-3" data-block-type={type}>
        {children}
      </div>
    </div>
  )
}
