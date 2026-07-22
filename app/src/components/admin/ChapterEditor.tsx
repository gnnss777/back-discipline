'use client'

import { useState, useEffect, useCallback } from 'react'
import { updateChapter } from '@/actions/admin/chapters'
import { toast } from 'sonner'
import type { AdminChapter, ContentVersion } from '@/types/admin'
import { StatusBadge } from './StatusBadge'
import { MarkdownEditor } from './MarkdownEditor'

export function ChapterEditor({
  chapter,
  versions,
}: {
  chapter: AdminChapter
  versions: ContentVersion[]
}) {
  const [title, setTitle] = useState(chapter.title)
  const [content, setContent] = useState(chapter.content_markdown)
  const [published, setPublished] = useState(chapter.is_published)
  const [saving, setSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  const save = useCallback(async () => {
    setSaving(true)
    try {
      await updateChapter(chapter.id, { title, content_markdown: content, is_published: published })
      setLastSaved(new Date())
      toast.success('Salvo')
    } catch {
      toast.error('Erro ao salvar')
    } finally {
      setSaving(false)
    }
  }, [chapter.id, title, content, published])

  useEffect(() => {
    const timer = setInterval(() => {
      if (content !== chapter.content_markdown || title !== chapter.title) {
        save()
      }
    }, 30000)
    return () => clearInterval(timer)
  }, [content, title, save, chapter])

  return (
    <div className="space-y-6">
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
          className="px-4 py-2 bg-[oklch(76%.14_230)] text-black rounded-lg text-sm font-semibold hover:brightness-110"
        >
          Salvar agora
        </button>
      </div>

      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full text-2xl font-semibold bg-transparent border-b border-[oklch(25%.01_270)] pb-2 text-[oklch(97%.005_240)] focus:outline-none focus:border-[oklch(76%.14_230)]"
        placeholder="Título do capítulo"
      />

      <div className="min-h-[60vh]">
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
  )
}
