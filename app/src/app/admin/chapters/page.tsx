import Link from 'next/link'
import { Edit } from 'lucide-react'
import { getChapters } from '@/actions/admin/chapters'
import { StatusBadge } from '@/components/admin/StatusBadge'

export default async function ChaptersPage() {
  const chapters = await getChapters().catch(() => [])

  const part1 = chapters.filter((c) => c.part === 'I' || c.part === 'intro')
  const part2 = chapters.filter((c) => c.part === 'II')

  return (
    <div className="space-y-6">
      <p className="text-sm text-[oklch(70%.01_240)]">
        {chapters.length} capítulos no total
      </p>

      <div className="space-y-6">
        <Section title="Parte I — O Programa de Treino" chapters={part1} />
        <Section title="Parte II — Fundamentos Técnicos" chapters={part2} />
      </div>
    </div>
  )
}

function Section({ title, chapters }: { title: string; chapters: Awaited<ReturnType<typeof getChapters>> }) {
  if (chapters.length === 0) return null

  return (
    <div>
      <h2 className="text-sm font-semibold uppercase tracking-wider text-[oklch(76%.14_230)] mb-3">
        {title}
      </h2>
      <div className="space-y-1">
        {chapters.map((ch) => (
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
