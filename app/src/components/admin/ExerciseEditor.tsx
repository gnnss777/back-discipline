'use client'

import { useState } from 'react'
import { updateExercise } from '@/actions/admin/exercises'
import { toast } from 'sonner'
import { StatusBadge } from '@/components/admin/StatusBadge'
import type { AdminExercise } from '@/types/admin'

export function ExerciseEditor({ exercise }: { exercise: AdminExercise }) {
  const [name, setName] = useState(exercise.name)
  const [category, setCategory] = useState(exercise.category)
  const [difficulty, setDifficulty] = useState(exercise.difficulty)
  const [description, setDescription] = useState(exercise.description)
  const [fullDescription, setFullDescription] = useState(exercise.full_description)
  const [muscles, setMuscles] = useState(exercise.muscles.join(', '))
  const [tips, setTips] = useState(exercise.tips.join('\n'))
  const [published, setPublished] = useState(exercise.is_published)
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    setSaving(true)
    try {
      await updateExercise(exercise.id, {
        name,
        category,
        difficulty,
        description,
        full_description: fullDescription,
        muscles: muscles.split(',').map((m) => m.trim()).filter(Boolean),
        tips: tips.split('\n').map((t) => t.trim()).filter(Boolean),
        is_published: published,
      })
      toast.success('Exercício salvo')
    } catch {
      toast.error('Erro ao salvar')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <StatusBadge published={published} />
          <button
            onClick={() => setPublished(!published)}
            className="text-xs px-2 py-1 rounded border border-[oklch(25%.01_270)] text-[oklch(70%.01_240)] hover:bg-[oklch(25%.01_270)]"
          >
            {published ? 'Despublicar' : 'Publicar'}
          </button>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 bg-[oklch(76%.14_230)] text-black rounded-lg text-sm font-semibold hover:brightness-110 disabled:opacity-50"
        >
          {saving ? 'Salvando...' : 'Salvar'}
        </button>
      </div>

      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full text-2xl font-semibold bg-transparent border-b border-[oklch(25%.01_270)] pb-2 text-[oklch(97%.005_240)] focus:outline-none focus:border-[oklch(76%.14_230)]"
      />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-[oklch(50%.01_270)] uppercase tracking-wider">Categoria</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full mt-1 px-3 py-2 bg-[oklch(18%.01_270)] border border-[oklch(25%.01_270)] rounded-lg text-sm text-[oklch(97%.005_240)]"
          >
            {['Remadas', 'Puxadas', 'Levantamento', 'Isolamento', 'Funcional'].map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs text-[oklch(50%.01_270)] uppercase tracking-wider">Dificuldade</label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="w-full mt-1 px-3 py-2 bg-[oklch(18%.01_270)] border border-[oklch(25%.01_270)] rounded-lg text-sm text-[oklch(97%.005_240)]"
          >
            {['Iniciante', 'Intermediário', 'Avançado'].map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="text-xs text-[oklch(50%.01_270)] uppercase tracking-wider">Músculos (separados por vírgula)</label>
        <input
          type="text"
          value={muscles}
          onChange={(e) => setMuscles(e.target.value)}
          className="w-full mt-1 px-3 py-2 bg-[oklch(18%.01_270)] border border-[oklch(25%.01_270)] rounded-lg text-sm text-[oklch(97%.005_240)] focus:outline-none focus:border-[oklch(76%.14_230)]"
          placeholder="Latíssimo, Rombóides, Trapézio"
        />
      </div>

      <div>
        <label className="text-xs text-[oklch(50%.01_270)] uppercase tracking-wider">Dicas (uma por linha)</label>
        <textarea
          value={tips}
          onChange={(e) => setTips(e.target.value)}
          rows={4}
          className="w-full mt-1 px-3 py-2 bg-[oklch(18%.01_270)] border border-[oklch(25%.01_270)] rounded-lg text-sm text-[oklch(97%.005_240)] resize-none focus:outline-none focus:border-[oklch(76%.14_230)]"
          placeholder="Mantenha o abdômen contraído"
        />
      </div>

      <div>
        <label className="text-xs text-[oklch(50%.01_270)] uppercase tracking-wider">Descrição curta</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          className="w-full mt-1 px-3 py-2 bg-[oklch(18%.01_270)] border border-[oklch(25%.01_270)] rounded-lg text-sm text-[oklch(97%.005_240)] resize-none focus:outline-none focus:border-[oklch(76%.14_230)]"
        />
      </div>

      <div>
        <label className="text-xs text-[oklch(50%.01_270)] uppercase tracking-wider">Descrição completa (markdown)</label>
        <textarea
          value={fullDescription}
          onChange={(e) => setFullDescription(e.target.value)}
          rows={15}
          className="w-full mt-1 px-3 py-2 bg-[oklch(18%.01_270)] border border-[oklch(25%.01_270)] rounded-lg text-sm text-[oklch(97%.005_240)] font-mono resize-none focus:outline-none focus:border-[oklch(76%.14_230)]"
        />
      </div>
    </div>
  )
}
