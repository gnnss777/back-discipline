import type { AdminChapter } from '@/types/admin'
import type { Chapter } from '@/lib/chapters'

type ChapterWithPart = Chapter & { part: string } | { part: string }

export type { ChapterWithPart }

export function filterPart1(chapters: ChapterWithPart[]) {
  return chapters.filter((c) => c.part === 'I' || c.part === 'intro')
}

export function filterPart2(chapters: ChapterWithPart[]) {
  return chapters.filter((c) => c.part === 'II')
}

export function getTopChapters(chapters: ChapterWithPart[]) {
  const part1 = filterPart1(chapters)
  const part2 = filterPart2(chapters)
  const top3 = [...part1, ...part2].slice(0, 3)
  return { top3, part1, part2 }
}
