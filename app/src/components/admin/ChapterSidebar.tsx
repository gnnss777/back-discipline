'use client'

import Link from 'next/link'
import type { AdminChapter } from '@/types/admin'

interface ChapterSidebarProps {
  chapters: AdminChapter[]
  currentId: string
}

export function ChapterSidebar({ chapters, currentId }: ChapterSidebarProps) {
  const part1 = chapters.filter((c) => c.part === 'I' || c.part === 'intro')
  const part2 = chapters.filter((c) => c.part === 'II')

  return (
    <div className="h-full flex flex-col bg-[oklch(15%.01_270)] border-r border-[oklch(25%.01_270)]">
      <div className="p-4 border-b border-[oklch(25%.01_270)]">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-[oklch(76%.14_230)]">
          Capítulos
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {part1.map((ch) => (
          <Link
            key={ch.id}
            href={`/admin/chapters/${ch.id}`}
            className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
              ch.id === currentId
                ? 'bg-[oklch(76%.14_230/0.1)] text-[oklch(76%.14_230)] border border-[oklch(76%.14_230/0.2)]'
                : 'text-[oklch(70%.01_240)] hover:bg-[oklch(25%.01_270)] hover:text-[oklch(90%.01_240)]'
            }`}
          >
            {ch.title}
          </Link>
        ))}

        {part2.map((ch) => (
          <Link
            key={ch.id}
            href={`/admin/chapters/${ch.id}`}
            className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
              ch.id === currentId
                ? 'bg-[oklch(76%.14_230/0.1)] text-[oklch(76%.14_230)] border border-[oklch(76%.14_230/0.2)]'
                : 'text-[oklch(70%.01_240)] hover:bg-[oklch(25%.01_270)] hover:text-[oklch(90%.01_240)]'
            }`}
          >
            {ch.title}
          </Link>
        ))}
      </div>

      <div className="p-3 border-t border-[oklch(25%.01_270)]">
        <Link
          href="/admin/chapters"
          className="block w-full px-3 py-2 text-xs text-[oklch(70%.01_240)] hover:text-[oklch(90%.01_240)] hover:bg-[oklch(25%.01_270)] rounded text-center"
        >
          Ver todos os capítulos
        </Link>
      </div>
    </div>
  )
}
