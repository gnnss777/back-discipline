export function dispatchPush(title: string, body: string) {
  if (typeof window === 'undefined') return
  window.dispatchEvent(
    new CustomEvent('bc-push', { detail: { title, body } })
  )
}
