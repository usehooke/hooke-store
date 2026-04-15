import { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Hooke Store - PDV & Gestão',
    short_name: 'Hooke PDV',
    description: 'Sistema Híbrido de Gestão e Ponto de Venda Hooke',
    start_url: '/admin/pdv',
    scope: '/',
    display: 'standalone',
    background_color: '#f9fafb',
    theme_color: '#111827',
    orientation: 'any',
    categories: ['business', 'productivity', 'shopping'],
    icons: [
      {
        src: '/pdv-icon.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/pdv-icon.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon.svg',
        sizes: '192x192',
        type: 'image/svg+xml',
        purpose: 'any',
      },
    ],
    shortcuts: [
      {
        name: 'Abrir PDV Elite',
        short_name: 'PDV',
        description: 'Acesso Direto ao Ponto de Venda',
        url: '/admin/pdv',
        icons: [{ src: '/pdv-icon.png', sizes: '192x192' }]
      },
      {
        name: 'Dashboard Operacional',
        short_name: 'Dash',
        description: 'Visão Geral da Loja',
        url: '/admin',
        icons: [{ src: '/icon.svg', sizes: '192x192' }]
      }
    ]
  }
}