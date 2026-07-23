import { notFound } from 'next/navigation'
import { getChapter, getChapterVersions, getChapters } from '@/actions/admin/chapters'
import { ChapterEditor } from '@/components/admin/ChapterEditor'

export default async function ChapterEditPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const chapter = await getChapter(id)
  if (!chapter) notFound()

  const versions = await getChapterVersions(id).catch(() => [])
  const allChapters = await getChapters().catch(() => [])

  return <ChapterEditor chapter={chapter} versions={versions} allChapters={allChapters} />
}
