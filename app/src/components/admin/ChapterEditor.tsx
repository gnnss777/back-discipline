'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { updateChapter } from '@/actions/admin/chapters'
import { toast } from 'sonner'
import type { AdminChapter, ContentVersion } from '@/types/admin'
import { StatusBadge } from './StatusBadge'
import { MarkdownEditor } from './MarkdownEditor'
import { ChapterSidebar } from './ChapterSidebar'

export function ChapterEditor({
  chapter,
  versions,
  allChapters,
}: {
  chapter: AdminChapter
  versions: ContentVersion[]
  allChapters: AdminChapter[]
}) {
  const [title, setTitle] = useState(chapter.title)
  const [content, setContent] = useState(chapter.content_markdown)
  const [published, setPublished] = useState(chapter.is_published)
  const [saving, setSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const lastPersisted = useRef({ title: chapter.title, content: chapter.content_markdown, published: chapter.is_published })
  const savingRef = useRef(false)

  const hasChanges = title !== lastPersisted.current.title
    || content !== lastPersisted.current.content
    || published !== lastPersisted.current.published

  const save = useCallback(async () => {
    if (savingRef.current || !hasChanges) return
    savingRef.current = true
    setSaving(true)
    try {
      await updateChapter(chapter.id, { title, content_markdown: content, is_published: published })
      lastPersisted.current = { title, content, published }
      setLastSaved(new Date())
    } catch {
      toast.error('Erro ao salvar')
    } finally {
      setSaving(false)
      savingRef.current = false
    }
  }, [chapter.id, title, content, published, hasChanges])

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
        <div className="max-w-4xl mx-auto p-6">
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
            placeholder="Título do capítulo"
          />

          <div className="h-[75vh]">
            <MarkdownEditor value={content} onChange={setContent} />
          </div>

          {versions.length > 0 && (
            <div className="border-t border-[oklch(25%.01_270)] pt-4">
              <h3 className="text-sm font-semibold text-[oklch(70%.01_240)] mb-2">Histórico de versões</h3>
              <div className="space-y-1">
                {versions.map((v) => (
                  <div key={v.id} className="text-xs text-[oklch(50%.01_270)]">
                    {new Date(v.created_at).toLocaleString('pt-BR')}
                    {v.change_summary && ` — ${v.change_summary}`}
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
