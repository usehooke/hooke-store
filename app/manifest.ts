import { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Hooke Store - PDV & Gestão',
    short_name: 'Hooke PDV',
    description: 'Sistema Híbrido de Gestão e Ponto de Venda Hooke',
    start_url: '/admin/pdv',
    display: 'standalone',
    background_color: '#f9fafb',
    theme_color: '#111827',
    orientation: 'any',
    categories: ['business', 'productivity', 'shopping'],
    icons: [
      {
        src: '/icon.svg',
        sizes: '192x192',
        type: 'image/svg+xml',
        purpose: 'any',
      },
      {
        src: '/icon.svg',
        sizes: '512x512',
        type: 'image/svg+xml',
        purpose: 'maskable',
      },
    ],
  }
}