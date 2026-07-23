'use client'

import { useState, useEffect } from 'react'
import { getProfiles, updateProfileRole } from '@/actions/admin/users'
import { toast } from 'sonner'
import type { AdminProfile } from '@/types/admin'

export default function UsersPage() {
  const [profiles, setProfiles] = useState<AdminProfile[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getProfiles()
      .then(setProfiles)
      .catch(() => toast.error('Erro ao carregar usuários'))
      .finally(() => setLoading(false))
  }, [])

  async function handleRoleChange(userId: string, role: 'admin' | 'editor') {
    try {
      await updateProfileRole(userId, role)
      setProfiles((prev) => prev.map((p) => (p.id === userId ? { ...p, role } : p)))
      toast.success('Role atualizada')
    } catch {
      toast.error('Erro ao atualizar role')
    }
  }

  if (loading) {
    return <div className="text-[oklch(70%.01_240)]">Carregando...</div>
  }

  return (
    <div className="space-y-4">
      {profiles.map((profile) => (
        <div
          key={profile.id}
          className="flex items-center gap-4 px-4 py-3 rounded-lg bg-[oklch(18%.01_270)] border border-[oklch(25%.01_270)]"
        >
          <div className="w-10 h-10 rounded-full bg-[oklch(76%.14_230)] flex items-center justify-center text-black font-semibold">
            {profile.display_name?.charAt(0)?.toUpperCase() || '?'}
          </div>
          <div className="flex-1">
            <p className="text-sm text-[oklch(97%.005_240)]">
              {profile.display_name || 'Sem nome'}
            </p>
            <p className="text-xs text-[oklch(50%.01_270)]">{profile.id}</p>
          </div>
          <select
            value={profile.role}
            onChange={(e) => handleRoleChange(profile.id, e.target.value as 'admin' | 'editor')}
            className="px-3 py-1 bg-[oklch(22%.01_270)] border border-[oklch(30%.01_270)] rounded-lg text-sm text-[oklch(97%.005_240)]"
          >
            <option value="editor">Editor</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      ))}

      {profiles.length === 0 && (
        <p className="text-center text-[oklch(50%.01_270)] py-8">
          Nenhum usuário encontrado
        </p>
      )}
    </div>
  )
}
