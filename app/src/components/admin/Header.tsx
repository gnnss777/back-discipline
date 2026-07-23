'use client'

import { usePathname } from 'next/navigation'
import { Menu, LogOut } from 'lucide-react'
import { createSupabaseClient } from '@/app/supabase/client'
import { useRouter } from 'next/navigation'
import type { AdminProfile } from '@/types/admin'
import { useAdminStore } from '@/stores/adminStore'

const pageTitles: Record<string, string> = {
  '/admin': 'Dashboard',
  '/admin/chapters': 'Capítulos',
  '/admin/chapters/': 'Editor de Capítulo',
  '/admin/exercises': 'Exercícios',
  '/admin/exercises/': 'Editor de Exercício',
  '/admin/users': 'Usuários',
  '/admin/pdf': 'Gerar PDFs',
  '/admin/settings': 'Configurações',
}

export function AdminHeader({ profile }: { profile: AdminProfile }) {
  const pathname = usePathname()
  const router = useRouter()
  const toggleSidebar = useAdminStore((s) => s.toggleSidebar)

  const title = Object.entries(pageTitles).find(([path]) =>
    pathname === path || pathname.startsWith(path)
  )?.[1] || 'Admin'

  async function handleLogout() {
    const client = createSupabaseClient()
    if (!client) return
    const { error } = await client.auth.signOut()
    if (error) return
    router.push('/admin/login')
  }

  return (
    <header className="h-14 border-b border-[oklch(25%.01_270)] flex items-center justify-between px-4">
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="lg:hidden text-[oklch(70%.01_240)] hover:text-[oklch(97%.005_240)]"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-semibold text-[oklch(97%.005_240)]">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-sm text-[oklch(50%.01_270)] hidden sm:block">
          {profile.display_name || 'Admin'}
        </span>
        <button
          onClick={handleLogout}
          className="text-[oklch(50%.01_270)] hover:text-red-400 transition-colors"
          title="Sair"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  )
}
