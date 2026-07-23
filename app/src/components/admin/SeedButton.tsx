'use client'

import { useState } from 'react'
import { seedAll } from '@/actions/admin/seed'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export function SeedButton() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSeed() {
    setLoading(true)
    try {
      const result = await seedAll()
      let msg = ''
      if (result.chapters && result.exercises) {
        msg = `${result.chapters} capítulos e ${result.exercises} exercícios importados!`
      }
      if (result.errors && result.errors.length > 0) {
        msg += ` Erros: ${result.errors.join(', ')}`
        toast.error(msg)
      } else {
        toast.success(msg || 'Dados já existem no banco')
      }
      router.refresh()
    } catch (err) {
      toast.error('Erro ao importar dados')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleSeed}
      disabled={loading}
      className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[oklch(76%.14_230)] text-black rounded-lg font-semibold hover:brightness-110 disabled:opacity-50 transition-all"
    >
      {loading ? 'Importando...' : 'Importar dados dos arquivos TS para o banco'}
    </button>
  )
}
