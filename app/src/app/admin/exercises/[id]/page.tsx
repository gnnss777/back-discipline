import { notFound } from 'next/navigation'
import { getExercise } from '@/actions/admin/exercises'
import { ExerciseEditor } from '@/components/admin/ExerciseEditor'

export default async function ExerciseEditPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const exercise = await getExercise(id)
  if (!exercise) notFound()

  return <ExerciseEditor exercise={exercise} />
}
