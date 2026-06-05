import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
 return {
  name: 'Back Discipline',
  short_name: 'BC',
  description: 'Um guia prático de 6 semanas para construir costas épicas usando o método John Meadows',
  start_url: '/',
  display: 'standalone',
  background_color: '#0A0A0D',
  theme_color: '#46BDEB',
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
    {
      src: '/icon-192x192-maskable.png',
      sizes: '192x192',
      type: 'image/png',
      purpose: 'maskable',
    },
    {
      src: '/icon-512x512-maskable.png',
      sizes: '512x512',
      type: 'image/png',
      purpose: 'maskable',
    },
  ],
 }
}
