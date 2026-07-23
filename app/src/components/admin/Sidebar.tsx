'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, BookOpen, Dumbbell, Users, Settings, FileText, X } from 'lucide-react'
import type { AdminProfile } from '@/types/admin'
import { useAdminStore } from '@/stores/adminStore'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/chapters', label: 'Capítulos', icon: BookOpen },
  { href: '/admin/exercises', label: 'Exercícios', icon: Dumbbell },
  { href: '/admin/users', label: 'Usuários', icon: Users },
  { href: '/admin/pdf', label: 'Gerar PDFs', icon: FileText },
  { href: '/admin/settings', label: 'Configurações', icon: Settings },
]

export function AdminSidebar({ profile }: { profile: AdminProfile }) {
  const pathname = usePathname()
  const { sidebarCollapsed, toggleSidebar } = useAdminStore()

  return (
    <>
      {/* Mobile overlay */}
      {!sidebarCollapsed && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      <aside
        className={`fixed left-0 top-0 bottom-0 w-56 bg-[oklch(15%.01_270)] border-r border-[oklch(25%.01_270)] flex flex-col z-50 transition-transform duration-200 ${
          sidebarCollapsed ? '-translate-x-full lg:translate-x-0' : 'translate-x-0'
        }`}
      >
        <div className="p-4 border-b border-[oklch(25%.01_270)] flex items-center justify-between">
          <div>
            <h2 className="font-heading text-sm uppercase tracking-widest text-[oklch(97%.005_240)]">
              Back Discipline
            </h2>
            <p className="text-xs text-[oklch(70%.01_240)] mt-1">Admin Panel</p>
          </div>
          <button
            onClick={toggleSidebar}
            className="lg:hidden text-[oklch(50%.01_270)] hover:text-[oklch(97%.005_240)]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <nav className="flex-1 p-2 space-y-1">
          {navItems.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => {
                  if (window.innerWidth < 1024) toggleSidebar()
                }}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  active
                    ? 'bg-[oklch(76%.14_230/0.15)] text-[oklch(76%.14_230)]'
                    : 'text-[oklch(70%.01_240)] hover:bg-[oklch(25%.01_270)]'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-[oklch(25%.01_270)]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[oklch(76%.14_230)] flex items-center justify-center text-black font-semibold text-sm">
              {profile.display_name?.charAt(0)?.toUpperCase() || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-[oklch(97%.005_240)] truncate">
                {profile.display_name || 'Admin'}
              </p>
              <p className="text-xs text-[oklch(50%.01_270)] capitalize">{profile.role}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
