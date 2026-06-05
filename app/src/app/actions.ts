'use server'

import webpush from 'web-push'

webpush.setVapidDetails(
  '<mailto:contato@backdiscipline.com>',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
)

let subscription: webpush.PushSubscription | null = null

export async function subscribeUser(sub: webpush.PushSubscription) {
  subscription = sub
  return { success: true }
}

export async function unsubscribeUser() {
  subscription = null
  return { success: true }
}

export async function sendNotification(message: string) {
  if (!subscription) {
    throw new Error('Nenhuma inscrição disponível')
  }

  try {
    await webpush.sendNotification(
      subscription,
      JSON.stringify({
        title: 'Back Discipline',
        body: message,
        icon: '/icon-192x192.png',
      })
    )
    return { success: true }
  } catch (error) {
    console.error('Erro ao enviar notificação:', error)
    return { success: false, error: 'Falha ao enviar notificação' }
  }
}
