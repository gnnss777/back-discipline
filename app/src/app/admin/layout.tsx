import { getCurrentProfile } from '@/actions/admin/auth'
import { AdminSidebar } from '@/components/admin/Sidebar'
import { AdminHeader } from '@/components/admin/Header'
import { AdminProvider } from '@/stores/adminStore'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const profile = await getCurrentProfile()

  // Not logged in at all → login page
  if (!profile) {
    return <>{children}</>
  }

  // Logged in but not admin/editor → show access denied
  if (profile.role !== 'admin' && profile.role !== 'editor') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[oklch(12%.01_270)] p-4">
        <div className="text-center space-y-4 max-w-sm">
          <div className="w-16 h-16 mx-auto rounded-full bg-amber-500/20 flex items-center justify-center">
            <span className="text-2xl">🔒</span>
          </div>
          <h1 className="font-heading text-xl uppercase tracking-wider text-[oklch(97%.005_240)]">
            Acesso Restrito
          </h1>
          <p className="text-sm text-[oklch(70%.01_240)]">
            Sua conta não tem permissão para acessar o painel administrativo.
            {profile.role === 'user' && ' Seu perfil está como "user".'}
          </p>
          <p className="text-xs text-[oklch(50%.01_270)]">
            Role atual: <span className="text-[oklch(76%.14_230)]">{profile.role}</span>
          </p>
          <a
            href="/"
            className="inline-block mt-4 px-6 py-2 bg-[oklch(76%.14_230)] text-black rounded-lg text-sm font-semibold"
          >
            Voltar ao início
          </a>
        </div>
      </div>
    )
  }

  return (
    <AdminProvider>
      <div className="flex min-h-screen bg-[oklch(12%.01_270)]">
        <AdminSidebar profile={profile} />
        <div className="flex-1 flex flex-col lg:ml-56">
          <AdminHeader profile={profile} />
          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
      </div>
    </AdminProvider>
  )
}
