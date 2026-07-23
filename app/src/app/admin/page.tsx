import { getChapters } from '@/actions/admin/chapters'
import { getExercises } from '@/actions/admin/exercises'
import { BookOpen, Dumbbell, FileText } from 'lucide-react'
import { seedChapters, seedExercises } from '@/actions/admin/seed'

export default async function AdminDashboard() {
  const [chapters, exercises] = await Promise.all([
    getChapters().catch(() => []),
    getExercises().catch(() => []),
  ])

  const needsSeed = chapters.length === 0 || exercises.length === 0

  return (
    <div className="space-y-6">
      {needsSeed && <SeedSection />}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[oklch(18%.01_270)] rounded-xl p-4 border border-[oklch(25%.01_270)]">
          <div className="flex items-center gap-3 mb-3">
            <BookOpen className="w-5 h-5 text-[oklch(76%.14_230)]" />
            <span className="text-sm text-[oklch(70%.01_240)]">Capítulos</span>
          </div>
          <div className="text-2xl font-semibold text-[oklch(97%.005_240)]">{chapters.length}</div>
        </div>
        <div className="bg-[oklch(18%.01_270)] rounded-xl p-4 border border-[oklch(25%.01_270)]">
          <div className="flex items-center gap-3 mb-3">
            <Dumbbell className="w-5 h-5 text-[oklch(76%.14_230)]" />
            <span className="text-sm text-[oklch(70%.01_240)]">Exercícios</span>
          </div>
          <div className="text-2xl font-semibold text-[oklch(97%.005_240)]">{exercises.length}</div>
        </div>
        <div className="bg-[oklch(18%.01_270)] rounded-xl p-4 border border-[oklch(25%.01_270)]">
          <div className="flex items-center gap-3 mb-3">
            <FileText className="w-5 h-5 text-[oklch(76%.14_230)]" />
            <span className="text-sm text-[oklch(70%.01_240)]">PDFs</span>
          </div>
          <div className="text-2xl font-semibold text-[oklch(97%.005_240)]">3</div>
        </div>
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

async function SeedSection() {
  let chapCount = 0
  let exCount = 0
  try {
    const [r1, r2] = await Promise.all([
      seedChapters().catch(() => ({ success: false, count: 0 })),
      seedExercises().catch(() => ({ success: false, count: 0 })),
    ])
    chapCount = r1.count || 0
    exCount = r2.count || 0
  } catch {}

  if (chapCount > 0 || exCount > 0) {
    return (
      <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4">
        <p className="text-sm text-emerald-400">
          Dados importados automaticamente: {chapCount} capítulos e {exCount} exercícios!
        </p>
      </div>
    )
  }

  return null
}
