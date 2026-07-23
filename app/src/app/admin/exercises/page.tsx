import Link from 'next/link'
import { Edit } from 'lucide-react'
import { getExercises } from '@/actions/admin/exercises'
import { StatusBadge } from '@/components/admin/StatusBadge'

const categories = ['Remadas', 'Puxadas', 'Levantamento', 'Isolamento', 'Funcional']

export default async function ExercisesPage() {
  const exercises = await getExercises().catch(() => [])

  return (
    <div className="space-y-6">
      <p className="text-sm text-[oklch(70%.01_240)]">
        {exercises.length} exercícios no total
      </p>

      {categories.map((cat) => {
        const filtered = exercises.filter((e) => e.category === cat)
        if (filtered.length === 0) return null

        return (
          <div key={cat}>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[oklch(76%.14_230)] mb-3">
              {cat}
            </h2>
            <div className="space-y-1">
              {filtered.map((ex) => (
                <Link
                  key={ex.id}
                  href={`/admin/exercises/${ex.id}`}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[oklch(18%.01_270)] border border-[oklch(25%.01_270)] hover:border-[oklch(76%.14_230/0.3)] transition-colors group"
                >
                  <span className="flex-1 text-sm text-[oklch(97%.005_240)]">{ex.name}</span>
                  <span className="text-xs text-[oklch(50%.01_270)]">{ex.difficulty}</span>
                  <StatusBadge published={ex.is_published} />
                  <Edit className="w-4 h-4 text-[oklch(50%.01_270)] group-hover:text-[oklch(76%.14_230)]" />
                </Link>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
