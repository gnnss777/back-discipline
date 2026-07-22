import { redirect } from 'next/navigation'
import { getCurrentProfile } from '@/actions/admin/auth'
import { AdminSidebar } from '@/components/admin/Sidebar'
import { AdminHeader } from '@/components/admin/Header'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const profile = await getCurrentProfile()
  if (!profile) redirect('/admin/login')

  return (
    <div className="flex min-h-screen bg-[oklch(12%.01_270)]">
      <AdminSidebar profile={profile} />
      <div className="flex-1 flex flex-col ml-56">
        <AdminHeader profile={profile} />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
