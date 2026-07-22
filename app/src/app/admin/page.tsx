import { getChapters } from '@/actions/admin/chapters'
import { getExercises } from '@/actions/admin/exercises'
import { BookOpen, Dumbbell, Users, FileText } from 'lucide-react'

export default async function AdminDashboard() {
  const [chapters, exercises] = await Promise.all([
    getChapters().catch(() => []),
    getExercises().catch(() => []),
  ])

  const publishedChapters = chapters.filter((c) => c.is_published).length
  const publishedExercises = exercises.filter((e) => e.is_published).length

  const stats = [
    { label: 'Capítulos', value: chapters.length, published: publishedChapters, icon: BookOpen },
    { label: 'Exercícios', value: exercises.length, published: publishedExercises, icon: Dumbbell },
    { label: 'Usuários', value: '—', icon: Users },
    { label: 'PDFs', value: 3, icon: FileText },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-[oklch(18%.01_270)] rounded-xl p-4 border border-[oklch(25%.01_270)]">
            <div className="flex items-center gap-3 mb-3">
              <stat.icon className="w-5 h-5 text-[oklch(76%.14_230)]" />
              <span className="text-sm text-[oklch(70%.01_240)]">{stat.label}</span>
            </div>
            <div className="text-2xl font-semibold text-[oklch(97%.005_240)]">{stat.value}</div>
            {'published' in stat && (
              <div className="text-xs text-[oklch(50%.01_270)] mt-1">
                {stat.published} publicados
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="bg-[oklch(18%.01_270)] rounded-xl p-6 border border-[oklch(25%.01_270)]">
        <h2 className="text-lg font-semibold text-[oklch(97%.005_240)] mb-4">Ações rápidas</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <a
            href="/admin/chapters"
            className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[oklch(22%.01_270)] hover:bg-[oklch(25%.01_270)] transition-colors text-[oklch(70%.01_240)] hover:text-[oklch(97%.005_240)]"
          >
            <BookOpen className="w-4 h-4" />
            <span className="text-sm">Editar capítulos</span>
          </a>
          <a
            href="/admin/exercises"
            className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[oklch(22%.01_270)] hover:bg-[oklch(25%.01_270)] transition-colors text-[oklch(70%.01_240)] hover:text-[oklch(97%.005_240)]"
          >
            <Dumbbell className="w-4 h-4" />
            <span className="text-sm">Gerenciar exercícios</span>
          </a>
          <a
            href="/admin/pdf"
            className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[oklch(22%.01_270)] hover:bg-[oklch(25%.01_270)] transition-colors text-[oklch(70%.01_240)] hover:text-[oklch(97%.005_240)]"
          >
            <FileText className="w-4 h-4" />
            <span className="text-sm">Gerar PDFs</span>
          </a>
        </div>
      </div>
    </div>
  )
}
