'use client'

import { useState, useEffect, useCallback } from 'react'
import { X, Download, Smartphone } from 'lucide-react'
import { subscribeUser, unsubscribeUser } from '../app/actions'

const DISMISSED_KEY = 'bc-install-dismissed'

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

function PushNotificationManager() {
  const [subscription, setSubscription] = useState<PushSubscription | null>(null)

  useEffect(() => {
    if (!('serviceWorker' in navigator && 'PushManager' in window)) return
    let cancelled = false
    async function init() {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
          updateViaCache: 'none',
        })
        if (cancelled) return
        const sub = await registration.pushManager.getSubscription()
        setSubscription(sub)
      } catch {
        // service worker registration failed
      }
    }
    init()
    return () => { cancelled = true }
  }, [])

  const subscribeToPush = useCallback(async () => {
    if (!process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY) return
    try {
      const registration = await navigator.serviceWorker.ready
      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
        ),
      })
      setSubscription(sub)
      await subscribeUser(JSON.parse(JSON.stringify(sub)))
    } catch {
      // permission denied or error
    }
  }, [])

  const unsubscribeFromPush = useCallback(async () => {
    await subscription?.unsubscribe()
    setSubscription(null)
    await unsubscribeUser()
  }, [subscription])

  if (!subscription) {
    return (
      <button
        onClick={subscribeToPush}
        className="flex items-center gap-1 text-xs text-background/70 hover:text-background underline"
      >
        Ativar notificações
      </button>
    )
  }

  return (
    <button
      onClick={unsubscribeFromPush}
      className="text-xs text-background/70 hover:text-background underline"
    >
      Notificações ativadas
    </button>
  )
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null)
  const [isInstallable, setIsInstallable] = useState(false)
  const [isStandalone] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(display-mode: standalone)').matches : false
  )
  const [isIOS] = useState(() =>
    typeof window !== 'undefined'
      ? /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as unknown as Record<string, unknown>).MSStream
      : false
  )
  const [dismissed, setDismissed] = useState(() => {
    if (typeof window === 'undefined') return true
    return localStorage.getItem(DISMISSED_KEY) === 'true'
  })

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setIsInstallable(true)
    }

    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = useCallback(() => {
    if (!deferredPrompt) return
    const promptEvent = deferredPrompt as Event & { prompt: () => void; userChoice: Promise<{ outcome: string }> }
    promptEvent.prompt()
    promptEvent.userChoice.then((choiceResult: { outcome: string }) => {
      if (choiceResult.outcome === 'accepted') {
        setIsInstallable(false)
      }
      setDeferredPrompt(null)
    })
  }, [deferredPrompt])

  const handleDismiss = useCallback(() => {
    localStorage.setItem(DISMISSED_KEY, 'true')
    setDismissed(true)
  }, [])

  if (isStandalone || dismissed) return null

  const showInstall = isInstallable || isIOS

  if (!showInstall) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] bg-primary text-background">
      <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <Smartphone className="w-5 h-5 shrink-0" />
          {isIOS ? (
            <p className="text-xs font-medium">
              Instale o Back Discipline no seu iPhone:{' '}
              <span className="font-bold">
                Compartilhar ⎋ → Adicionar à Tela de Início
              </span>
            </p>
          ) : (
            <p className="text-xs font-medium">
              Instale o Back Discipline como aplicativo
            </p>
          )}
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {isIOS ? (
            <PushNotificationManager />
          ) : (
            <button
              onClick={handleInstall}
              className="flex items-center gap-1 px-3 py-1 bg-background text-primary text-xs font-bold rounded hover:bg-card transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Instalar
            </button>
          )}

          {!isIOS && <PushNotificationManager />}

          <button
            onClick={handleDismiss}
            className="text-background/60 hover:text-background transition-colors"
            aria-label="Fechar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
