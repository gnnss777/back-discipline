import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
 return {
  name: 'Back Discipline',
  short_name: 'BC',
  description: 'Um guia prático de 6 semanas para construir costas épicas usando o método John Meadows',
  start_url: '/',
  display: 'standalone',
  background_color: '#080808',
  theme_color: '#C9A86C',
  icons: [
   {
    src: '/icon-192x192.png',
    sizes: '192x192',
    type: 'image/png',
   },
   {
    src: '/icon-512x512.png',
    sizes: '512x512',
    type: 'image/png',
   },
  ],
 }
}
