import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api', '/checkout', '/login', '/hq', '/meus-pedidos'],
      },
    ],
    sitemap: 'https://www.usehooke.com.br/sitemap.xml',
  };
}
