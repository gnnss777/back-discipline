import Link from 'next/link'
import { Edit, ChevronRight } from 'lucide-react'
import { getChapters } from '@/actions/admin/chapters'
import { chapters as chaptersMeta } from '@/lib/chapters'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { getTopChapters } from '@/lib/admin-utils'
import type { ChapterWithPart } from '@/lib/admin-utils'

export default async function ChaptersPage() {
  const dbChapters = await getChapters().catch(() => [])
  const chapters: ChapterWithPart[] = dbChapters.length > 0 ? dbChapters : chaptersMeta.map((ch) => ({
    id: ch.slug,
    title: ch.title,
    is_published: true,
    part: ch.part || 'I',
  } as any))

  const { top3, part1, part2 } = getTopChapters(chapters)

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-[oklch(97%.005_240)]">Gerenciar Capítulos</h1>
        <p className="text-sm text-[oklch(70%.01_240)]">
          {chapters.length} capítulos no total • <Link href="/admin/chapters" className="text-[oklch(76%.14_230)] hover:underline">Ver todos</Link>
        </p>
      </div>

      {dbChapters.length === 0 && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl px-4 py-3 text-sm text-amber-400">
          Dados lidos dos arquivos do projeto. Clique em um capítulo para editar — ao salvar,
          será criado no banco de dados.
        </div>
      )}

      <div className="space-y-6">
        {part1.length > 0 && <Section title="Parte I — O Programa de Treino" chapters={part1.slice(0, 2)} />}
        {part2.length > 0 && <Section title="Parte II — Fundamentos Técnicos" chapters={part2.slice(0, 1)} />}
      </div>

      {chapters.length > 3 && (
        <div className="pt-4 border-t border-[oklch(25%.01_270)]">
          <Link
            href="/admin/chapters"
            className="flex items-center gap-2 px-4 py-3 rounded-lg bg-[oklch(18%.01_270)] border border-[oklch(25%.01_270)] hover:border-[oklch(76%.14_230/0.3)] transition-colors group text-[oklch(70%.01_240)]"
          >
            Ver todos os capítulos
            <ChevronRight className="w-4 h-4 group-hover:text-[oklch(76%.14_230)]" />
          </Link>
        </div>
      )}
    </div>
  )
}

function Section({ title, chapters }: { title: string; chapters: ChapterWithPart[] }) {
  return (
    <div>
      <h2 className="text-sm font-semibold uppercase tracking-wider text-[oklch(76%.14_230)] mb-3">
        {title}
      </h2>
      <div className="space-y-2">
        {chapters.map((ch: any) => (
          <Link
            key={ch.id}
            href={`/admin/chapters/${ch.id}`}
            className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[oklch(18%.01_270)] border border-[oklch(25%.01_270)] hover:border-[oklch(76%.14_230/0.3)] transition-colors group"
          >
            <span className="flex-1 text-sm text-[oklch(97%.005_240)]">{ch.title}</span>
            <StatusBadge published={ch.is_published} />
            <Edit className="w-4 h-4 text-[oklch(50%.01_270)] group-hover:text-[oklch(76%.14_230)]" />
          </Link>
        ))}
      </div>
    </div>
  )
}
