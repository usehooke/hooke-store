/** @type {import('next').NextConfig} */
const nextConfig = {
  // 🚨 O PULO DO GATO (Correção do Erro de Build):
  // Isso força o Next.js a processar o pacote do Typebot corretamente na Vercel.
  transpilePackages: ["@typebot.io/react"],

  // Otimização de Imagens
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { 
        protocol: 'https', 
        hostname: '**' 
      },
    ],
    unoptimized: false,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },

  // Performance e Segurança
  reactStrictMode: true, 
  swcMinify: true, 
  poweredByHeader: false, // Remove o aviso "X-Powered-By" (Segurança)

  // Limpeza para Produção
  compiler: {
    // Remove console.log apenas quando o site estiver online (produção)
    removeConsole: process.env.NODE_ENV === "production",
  },
};

module.exports = nextConfig;