'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { FileText } from 'lucide-react'

const books = [
  { id: 'livro', label: 'O Programa de Treino', file: 'back-discipline-livro.pdf' },
  { id: 'fundamentos', label: 'Fundamentos Técnicos', file: 'back-discipline-fundamentos.pdf' },
  { id: 'biblioteca', label: 'Biblioteca de Exercícios', file: 'back-discipline-biblioteca.pdf' },
]

export default function PdfPage() {
  const [generating, setGenerating] = useState<string | null>(null)

  async function handleGenerate(bookId: string) {
    setGenerating(bookId)
    await new Promise((r) => setTimeout(r, 2000))
    setGenerating(null)
    toast.success(`PDF gerado: ${books.find((b) => b.id === bookId)?.label}`)
  }

  return (
    <div className="max-w-2xl space-y-6">
      <p className="text-sm text-[oklch(70%.01_240)]">
        Clique em &quot;Gerar&quot; para regenerar o PDF com o conteúdo mais recente do banco de dados.
      </p>

      <div className="grid gap-4">
        {books.map((book) => (
          <div
            key={book.id}
            className="flex items-center gap-4 px-4 py-4 rounded-lg bg-[oklch(18%.01_270)] border border-[oklch(25%.01_270)]"
          >
            <FileText className="w-6 h-6 text-[oklch(76%.14_230)]" />
            <div className="flex-1">
              <p className="text-sm text-[oklch(97%.005_240)]">{book.label}</p>
              <p className="text-xs text-[oklch(50%.01_270)]">{book.file}</p>
            </div>
            <button
              onClick={() => handleGenerate(book.id)}
              disabled={generating === book.id}
              className="px-4 py-2 bg-[oklch(76%.14_230)] text-black rounded-lg text-sm font-semibold hover:brightness-110 disabled:opacity-50"
            >
              {generating === book.id ? 'Gerando...' : 'Gerar'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
