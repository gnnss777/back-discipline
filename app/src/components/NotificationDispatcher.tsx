'use client'

import { useEffect, useRef } from 'react'
import { useAuth } from '../hooks/useAuth'

export function NotificationDispatcher() {
  const { user } = useAuth()
  const swRegistered = useRef(false)

  useEffect(() => {
    if (!user || swRegistered.current) return
    if (!('serviceWorker' in navigator)) return

    swRegistered.current = true
    navigator.serviceWorker.register('/sw.js', {
      scope: '/',
      updateViaCache: 'none',
    }).catch(() => {})
  }, [user])

  useEffect(() => {
    const handler = (e: CustomEvent) => {
      const { title, body } = e.detail
      if (!('serviceWorker' in navigator)) return

      navigator.serviceWorker.ready.then((registration) => {
        registration.showNotification(title, {
          body,
          icon: '/icon-192x192.png',
          badge: '/icon-192x192.png',
        })
      }).catch(() => {})
    }

    window.addEventListener('bc-push' as any, handler as any)
    return () => window.removeEventListener('bc-push' as any, handler as any)
  }, [])

  return null
}
