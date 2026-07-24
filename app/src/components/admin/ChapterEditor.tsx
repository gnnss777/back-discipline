'use client'

import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { updateChapter } from '@/actions/admin/chapters'
import { toast } from 'sonner'
import type { AdminChapter, ContentVersion } from '@/types/admin'
import type { Block } from '@/types/blocks'
import { StatusBadge } from './StatusBadge'
import { BlocksEditor } from './BlocksEditor'
import { ChapterSidebar } from './ChapterSidebar'
import { parseMarkdownToBlocks, serializeBlocksToMarkdown } from '@/lib/blocks'

export function ChapterEditor({
  chapter,
  versions,
  allChapters,
}: {
  chapter: AdminChapter
  versions: ContentVersion[]
  allChapters: AdminChapter[]
}) {
  const initialBlocks = useMemo<Block[]>(() => {
    if (Array.isArray(chapter.content_blocks) && chapter.content_blocks.length > 0) {
      return chapter.content_blocks
    }
    return parseMarkdownToBlocks(chapter.content_markdown || '')
  }, [chapter.id])

  const [title, setTitle] = useState(chapter.title)
  const [blocks, setBlocks] = useState<Block[]>(initialBlocks)
  const [markdown, setMarkdown] = useState(chapter.content_markdown || serializeBlocksToMarkdown(initialBlocks))
  const [published, setPublished] = useState(chapter.is_published)
  const [saving, setSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const lastPersisted = useRef({
    title: chapter.title,
    markdown: chapter.content_markdown,
    published: chapter.is_published,
  })
  const savingRef = useRef(false)

  const hasChanges =
    title !== lastPersisted.current.title ||
    markdown !== lastPersisted.current.markdown ||
    published !== lastPersisted.current.published

  const save = useCallback(async () => {
    if (savingRef.current || !hasChanges) return
    savingRef.current = true
    setSaving(true)
    try {
      await updateChapter(chapter.id, {
        title,
        content_markdown: markdown,
        content_blocks: blocks,
        is_published: published,
      })
      lastPersisted.current = { title, markdown, published }
      setLastSaved(new Date())
    } catch {
      toast.error('Erro ao salvar')
    } finally {
      setSaving(false)
      savingRef.current = false
    }
  }, [chapter.id, title, markdown, blocks, published, hasChanges])

  function handleBlocksChange(nextBlocks: Block[], nextMarkdown: string) {
    setBlocks(nextBlocks)
    setMarkdown(nextMarkdown)
  }

  useEffect(() => {
    const timer = setInterval(() => {
      if (hasChanges && !savingRef.current) save()
    }, 30000)
    return () => clearInterval(timer)
  }, [save, hasChanges])

  return (
    <div className="flex h-full">
      <ChapterSidebar chapters={allChapters} currentId={chapter.id} />

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <StatusBadge published={published} />
              <button
                onClick={() => setPublished(!published)}
                className="text-xs px-2 py-1 rounded border border-[oklch(25%.01_270)] text-[oklch(70%.01_240)] hover:bg-[oklch(25%.01_270)]"
              >
                {published ? 'Despublicar' : 'Publicar'}
              </button>
              {lastSaved && (
                <span className="text-xs text-[oklch(50%.01_270)]">
                  Salvo {lastSaved.toLocaleTimeString('pt-BR')}
                </span>
              )}
              {saving && <span className="text-xs text-[oklch(76%.14_230)]">Salvando...</span>}
            </div>
            <button
              onClick={save}
              disabled={!hasChanges || saving}
              className="px-4 py-2 bg-[oklch(76%.14_230)] text-black rounded-lg text-sm font-semibold hover:brightness-110 disabled:opacity-30"
            >
              {saving ? 'Salvando...' : 'Salvar agora'}
            </button>
          </div>

          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-2xl font-semibold bg-transparent border-b border-[oklch(25%.01_270)] pb-2 text-[oklch(97%.005_240)] focus:outline-none focus:border-[oklch(76%.14_230)]"
            placeholder="T\u00edtulo do cap\u00edtulo"
          />

          <div className="h-[75vh]">
            <BlocksEditor
              blocks={blocks}
              onChange={handleBlocksChange}
              serialize={serializeBlocksToMarkdown}
            />
          </div>

          {versions.length > 0 && (
            <div className="border-t border-[oklch(25%.01_270)] pt-4">
              <h3 className="text-sm font-semibold text-[oklch(70%.01_240)] mb-2">
                Hist\u00f3rico de vers\u00f5es
              </h3>
              <div className="space-y-1">
                {versions.map((v) => (
                  <div key={v.id} className="text-xs text-[oklch(50%.01_270)]">
                    {new Date(v.created_at).toLocaleString('pt-BR')}
                    {v.change_summary && ` \u2014 ${v.change_summary}`}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
