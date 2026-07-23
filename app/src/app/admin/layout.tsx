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

  // Without profile → login page (middleware handles auth for other routes)
  if (!profile) {
    return <>{children}</>
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
