'use client'

import { useState } from 'react'
import type { Block, TipBlock, WarningBlock, HeadingBlock, ParagraphBlock, ExerciseBlock, QuoteBlock, ListBlock, LibraryItemBlock } from '@/types/blocks'
import { BlockContainer } from './BlockContainer'
import { Lightbulb, AlertTriangle, Heading1, Heading2, Heading3, Text, Dumbbell, Quote, List as ListIcon, Plus, Trash2, Library } from 'lucide-react'

interface BlockEditorProps {
  block: Block
  onChange: (next: Block) => void
  onDelete: () => void
  onMoveUp: () => void
  onMoveDown: () => void
  canMoveUp: boolean
  canMoveDown: boolean
}

const baseInput =
  'w-full bg-[oklch(15%.01_270)] border border-[oklch(25%.01_270)] rounded px-3 py-2 text-sm text-[oklch(97%.005_240)] focus:outline-none focus:border-[oklch(76%.14_230)]'

export function BlockEditor(props: BlockEditorProps) {
  const { block } = props
  switch (block.type) {
    case 'paragraph':
      return <ParagraphEditor {...props} block={block} />
    case 'heading':
      return <HeadingEditor {...props} block={block} />
    case 'tip':
      return <TipEditor {...props} block={block} />
    case 'warning':
      return <WarningEditor {...props} block={block} />
    case 'exercise':
      return <ExerciseEditor {...props} block={block} />
    case 'quote':
      return <QuoteEditor {...props} block={block} />
    case 'list':
      return <ListEditor {...props} block={block} />
    case 'library_item':
      return <LibraryItemEditor {...props} block={block} />
    default:
      return null
  }
}

function ParagraphEditor({
  block,
  onChange,
  ...rest
}: BlockEditorProps & { block: ParagraphBlock }) {
  return (
    <BlockContainer
      type="paragraph"
      label="Parágrafo"
      icon={<Text className="w-3.5 h-3.5" />}
      canMoveDown={rest.canMoveDown}
      canMoveUp={rest.canMoveUp}
      onDelete={rest.onDelete}
      onMoveDown={rest.onMoveDown}
      onMoveUp={rest.onMoveUp}
    >
      <textarea
        value={block.content}
        onChange={(e) => onChange({ ...block, content: e.target.value })}
        rows={3}
        placeholder="Escreva o parágrafo aqui..."
        className={`${baseInput} resize-y leading-relaxed`}
      />
    </BlockContainer>
  )
}

function HeadingEditor({
  block,
  onChange,
  ...rest
}: BlockEditorProps & { block: HeadingBlock }) {
  const Icon = block.level === 1 ? Heading1 : block.level === 2 ? Heading2 : Heading3
  return (
    <BlockContainer
      type="heading"
      label={`T\u00edtulo H${block.level}`}
      icon={<Icon className="w-3.5 h-3.5" />}
      canMoveDown={rest.canMoveDown}
      canMoveUp={rest.canMoveUp}
      onDelete={rest.onDelete}
      onMoveDown={rest.onMoveDown}
      onMoveUp={rest.onMoveUp}
    >
      <div className="flex items-center gap-2">
        <select
          value={block.level}
          onChange={(e) => onChange({ ...block, level: Number(e.target.value) as 1 | 2 | 3 })}
          className="bg-[oklch(15%.01_270)] border border-[oklch(25%.01_270)] rounded px-2 py-1 text-xs text-[oklch(97%.005_240)]"
        >
          <option value={1}>H1</option>
          <option value={2}>H2</option>
          <option value={3}>H3</option>
        </select>
        <input
          value={block.content}
          onChange={(e) => onChange({ ...block, content: e.target.value })}
          placeholder={`T\u00edtulo n\u00edvel ${block.level}`}
          className={`${baseInput} text-base font-semibold`}
          style={{ fontWeight: block.level === 3 ? 700 : 600 }}
        />
      </div>
    </BlockContainer>
  )
}

function TipEditor({
  block,
  onChange,
  ...rest
}: BlockEditorProps & { block: TipBlock }) {
  return (
    <BlockContainer
      type="tip"
      label="Dica"
      icon={<Lightbulb className="w-3.5 h-3.5" />}
      accent="tip"
      canMoveDown={rest.canMoveDown}
      canMoveUp={rest.canMoveUp}
      onDelete={rest.onDelete}
      onMoveDown={rest.onMoveDown}
      onMoveUp={rest.onMoveUp}
    >
      <textarea
        value={block.content}
        onChange={(e) => onChange({ ...block, content: e.target.value })}
        rows={2}
        placeholder="Escreva uma dica..."
        className={`${baseInput} bg-emerald-500/10 border-emerald-500/30 text-emerald-100 leading-relaxed resize-y`}
      />
    </BlockContainer>
  )
}

function WarningEditor({
  block,
  onChange,
  ...rest
}: BlockEditorProps & { block: WarningBlock }) {
  return (
    <BlockContainer
      type="warning"
      label="Aviso"
      icon={<AlertTriangle className="w-3.5 h-3.5" />}
      accent="warning"
      canMoveDown={rest.canMoveDown}
      canMoveUp={rest.canMoveUp}
      onDelete={rest.onDelete}
      onMoveDown={rest.onMoveDown}
      onMoveUp={rest.onMoveUp}
    >
      <textarea
        value={block.content}
        onChange={(e) => onChange({ ...block, content: e.target.value })}
        rows={2}
        placeholder="Escreva um aviso..."
        className={`${baseInput} bg-amber-500/10 border-amber-500/30 text-amber-100 leading-relaxed resize-y`}
      />
    </BlockContainer>
  )
}

function ExerciseEditor({
  block,
  onChange,
  ...rest
}: BlockEditorProps & { block: ExerciseBlock }) {
  return (
    <BlockContainer
      type="exercise"
      label="Exerc\u00edcio"
      icon={<Dumbbell className="w-3.5 h-3.5" />}
      accent="exercise"
      canMoveDown={rest.canMoveDown}
      canMoveUp={rest.canMoveUp}
      onDelete={rest.onDelete}
      onMoveDown={rest.onMoveDown}
      onMoveUp={rest.onMoveUp}
    >
      <div className="space-y-2">
        <input
          value={block.title}
          onChange={(e) => onChange({ ...block, title: e.target.value })}
          placeholder="T\u00edtulo do exerc\u00edcio"
          className={`${baseInput} font-semibold`}
        />
        <input
          value={block.muscles ?? ''}
          onChange={(e) => onChange({ ...block, muscles: e.target.value })}
          placeholder="M\u00fasculos (opcional)"
          className={baseInput}
        />
        <textarea
          value={block.content}
          onChange={(e) => onChange({ ...block, content: e.target.value })}
          rows={3}
          placeholder="Descri\u00e7\u00e3o / instru\u00e7\u00f5es do exerc\u00edcio..."
          className={`${baseInput} resize-y leading-relaxed`}
        />
      </div>
    </BlockContainer>
  )
}

function QuoteEditor({
  block,
  onChange,
  ...rest
}: BlockEditorProps & { block: QuoteBlock }) {
  return (
    <BlockContainer
      type="quote"
      label="Cita\u00e7\u00e3o"
      icon={<Quote className="w-3.5 h-3.5" />}
      canMoveDown={rest.canMoveDown}
      canMoveUp={rest.canMoveUp}
      onDelete={rest.onDelete}
      onMoveDown={rest.onMoveDown}
      onMoveUp={rest.onMoveUp}
    >
      <textarea
        value={block.content}
        onChange={(e) => onChange({ ...block, content: e.target.value })}
        rows={2}
        placeholder="Cita\u00e7\u00e3o..."
        className={`${baseInput} italic resize-y`}
      />
      <input
        value={block.attribution ?? ''}
        onChange={(e) => onChange({ ...block, attribution: e.target.value || undefined })}
        placeholder="Atribui\u00e7\u00e3o (opcional)"
        className={`${baseInput} mt-2`}
      />
    </BlockContainer>
  )
}

function ListEditor({
  block,
  onChange,
  ...rest
}: BlockEditorProps & { block: ListBlock }) {
  function updateItem(idx: number, value: string) {
    const next = [...block.items]
    next[idx] = value
    onChange({ ...block, items: next })
  }
  function addItem() {
    onChange({ ...block, items: [...block.items, ''] })
  }
  function removeItem(idx: number) {
    onChange({ ...block, items: block.items.filter((_, i) => i !== idx) })
  }
  return (
    <BlockContainer
      type="list"
      label={`Lista ${block.ordered ? 'numerada' : 'com marcadores'}`}
      icon={<ListIcon className="w-3.5 h-3.5" />}
      canMoveDown={rest.canMoveDown}
      canMoveUp={rest.canMoveUp}
      onDelete={rest.onDelete}
      onMoveDown={rest.onMoveDown}
      onMoveUp={rest.onMoveUp}
    >
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-xs text-[oklch(70%.01_240)]">
          <input
            type="checkbox"
            checked={block.ordered}
            onChange={(e) => onChange({ ...block, ordered: e.target.checked })}
            className="rounded"
          />
          Numerada
        </label>
        {block.items.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <span className="text-xs text-[oklch(50%.01_270)] w-5 text-right">
              {block.ordered ? `${idx + 1}.` : '\u2022'}
            </span>
            <input
              value={item}
              onChange={(e) => updateItem(idx, e.target.value)}
              placeholder={`Item ${idx + 1}`}
              className={baseInput}
            />
            <button
              type="button"
              onClick={() => removeItem(idx)}
              className="p-1 rounded text-red-400 hover:bg-red-500/20"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addItem}
          className="flex items-center gap-1 text-xs px-2 py-1 rounded bg-[oklch(25%.01_270)] hover:bg-[oklch(76%.14_230/0.1)] text-[oklch(70%.01_240)]"
        >
          <Plus className="w-3.5 h-3.5" /> Adicionar item
        </button>
      </div>
    </BlockContainer>
  )
}

function LibraryItemEditor({
  block,
  onChange,
  ...rest
}: BlockEditorProps & { block: LibraryItemBlock }) {
  return (
    <BlockContainer
      type="library_item"
      label="Item da Biblioteca"
      icon={<Library className="w-3.5 h-3.5" />}
      canMoveDown={rest.canMoveDown}
      canMoveUp={rest.canMoveUp}
      onDelete={rest.onDelete}
      onMoveDown={rest.onMoveDown}
      onMoveUp={rest.onMoveUp}
    >
      <input
        value={block.exercise_slug}
        onChange={(e) => onChange({ ...block, exercise_slug: e.target.value })}
        placeholder="slug do exerc\u00edcio (ex: remada-unilateral)"
        className={`${baseInput} font-mono`}
      />
      <p className="text-xs text-[oklch(50%.01_270)] mt-2">
        Refer\u00eancia a um exerc\u00edcio da biblioteca.
      </p>
    </BlockContainer>
  )
}
