'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { FileText, Download, RefreshCw } from 'lucide-react'

interface PdfInfo {
  book: string
  filename: string
  generated: boolean
  size: number
  url: string
}

const books = [
  { id: 'livro', label: 'O Programa de Treino', file: 'back-discipline-livro.pdf' },
  { id: 'fundamentos', label: 'Fundamentos Técnicos', file: 'back-discipline-fundamentos.pdf' },
  { id: 'biblioteca', label: 'Biblioteca de Exercícios', file: 'back-discipline-biblioteca.pdf' },
]

export default function PdfPage() {
  const [generating, setGenerating] = useState(false)
  const [pdfs, setPdfs] = useState<PdfInfo[]>([])
  const [lastGenerated, setLastGenerated] = useState<Date | null>(null)

  // Check existing PDFs on load
  useEffect(() => {
    checkExisting()
  }, [])

  async function checkExisting() {
    const results = await Promise.all(
      books.map(async (book) => {
        const res = await fetch(book.file)
        if (res.ok) {
          const blob = await res.blob()
          return {
            book: book.id,
            filename: book.file,
            generated: true,
            size: blob.size,
            url: book.file,
          } as PdfInfo
        }
        return {
          book: book.id,
          filename: book.file,
          generated: false,
          size: 0,
          url: book.file,
        } as PdfInfo
      })
    )
    setPdfs(results)
  }

  async function handleGenerateAll() {
    setGenerating(true)
    try {
      const res = await fetch('/api/admin/pdf/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      const data = await res.json()

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Erro ao gerar PDFs')
      }

      setPdfs(data.pdfs)
      setLastGenerated(new Date())
      toast.success('Todos os PDFs foram gerados!')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao gerar PDFs')
    } finally {
      setGenerating(false)
    }
  }

  function formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes}B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)}KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`
  }

  return (
    <div className="max-w-2xl space-y-6">
      <p className="text-sm text-[oklch(70%.01_240)]">
        Gere os PDFs com o conteúdo mais recente. O processo leva cerca de 1-2 minutos para gerar todos os 3 livros.
      </p>

      {/* Generate button */}
      <button
        onClick={handleGenerateAll}
        disabled={generating}
        className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-[oklch(76%.14_230)] text-black rounded-xl text-lg font-semibold hover:brightness-110 disabled:opacity-50 transition-all"
      >
        <RefreshCw className={`w-5 h-5 ${generating ? 'animate-spin' : ''}`} />
        {generating ? 'Gerando PDFs...' : 'Gerar Todos os PDFs'}
      </button>

      {lastGenerated && (
        <p className="text-xs text-[oklch(50%.01_270)] text-center">
          Última geração: {lastGenerated.toLocaleString('pt-BR')}
        </p>
      )}

      {/* PDF list */}
      <div className="grid gap-4">
        {books.map((book) => {
          const info = pdfs.find((p) => p.book === book.id)
          const exists = info?.generated ?? false

          return (
            <div
              key={book.id}
              className="flex items-center gap-4 px-4 py-4 rounded-lg bg-[oklch(18%.01_270)] border border-[oklch(25%.01_270)]"
            >
              <FileText className="w-6 h-6 text-[oklch(76%.14_230)]" />
              <div className="flex-1">
                <p className="text-sm text-[oklch(97%.005_240)]">{book.label}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-[oklch(50%.01_270)]">{book.file}</span>
                  {exists && (
                    <>
                      <span className="text-xs text-[oklch(50%.01_270)]">•</span>
                      <span className="text-xs text-emerald-400">{formatSize(info!.size)}</span>
                    </>
                  )}
                  {!exists && (
                    <>
                      <span className="text-xs text-[oklch(50%.01_270)]">•</span>
                      <span className="text-xs text-amber-400">Não gerado</span>
                    </>
                  )}
                </div>
              </div>
              {exists && (
                <a
                  href={book.file}
                  download
                  className="flex items-center gap-2 px-4 py-2 bg-[oklch(22%.01_270)] hover:bg-[oklch(25%.01_270)] rounded-lg text-sm text-[oklch(70%.01_240)] hover:text-[oklch(97%.005_240)] transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download
                </a>
              )}
            </div>
          )
        })}
      </div>

      {pdfs.length === 0 && (
        <p className="text-center text-[oklch(50%.01_270)] py-8">
          Nenhum PDF gerado ainda. Clique em &quot;Gerar Todos os PDFs&quot; para começar.
        </p>
      )}
    </div>
  )
}
