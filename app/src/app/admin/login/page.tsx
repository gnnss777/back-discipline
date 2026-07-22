'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseClient } from '@/app/supabase/client'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const client = createSupabaseClient()
      if (!client) {
        setError('Supabase não configurado')
        return
      }
      const { error: signInError } = await client.auth.signInWithPassword({ email, password })
      if (signInError) throw signInError
      router.push('/admin')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[oklch(12%.01_270)] p-4">
      <form onSubmit={handleLogin} className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-2">
          <h1 className="font-heading text-2xl uppercase tracking-wider text-[oklch(97%.005_240)]">
            Back Discipline
          </h1>
          <p className="text-sm text-[oklch(70%.01_240)]">Painel Administrativo</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 bg-[oklch(18%.01_270)] border border-[oklch(30%.01_270)] rounded-lg text-[oklch(97%.005_240)] placeholder:text-[oklch(50%.01_270)] focus:outline-none focus:border-[oklch(76%.14_230)]"
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 bg-[oklch(18%.01_270)] border border-[oklch(30%.01_270)] rounded-lg text-[oklch(97%.005_240)] placeholder:text-[oklch(50%.01_270)] focus:outline-none focus:border-[oklch(76%.14_230)]"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[oklch(76%.14_230)] text-black font-semibold rounded-lg hover:brightness-110 disabled:opacity-50"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </div>
      </form>
    </div>
  )
}
