'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'

interface AdminState {
  sidebarCollapsed: boolean
  toggleSidebar: () => void
  setSidebarCollapsed: (collapsed: boolean) => void
}

const AdminContext = createContext<AdminState | null>(null)

export function AdminProvider({ children }: { children: ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const toggleSidebar = () => setSidebarCollapsed((prev) => !prev)

  return (
    <AdminContext.Provider value={{ sidebarCollapsed, toggleSidebar, setSidebarCollapsed }}>
      {children}
    </AdminContext.Provider>
  )
}

export function useAdminStore(): AdminState {
  const ctx = useContext(AdminContext)
  if (!ctx) {
    // Fallback for when used outside provider
    return {
      sidebarCollapsed: false,
      toggleSidebar: () => {},
      setSidebarCollapsed: () => {},
    }
  }
  return ctx
}
