import withBundleAnalyzer from '@next/bundle-analyzer';
import { withSentryConfig } from "@sentry/nextjs";

/**
 * HOOKE — next.config.mjs (Fase 1: Estabilização)
 * 
 * Mudanças aplicadas:
 * - Removida chave `eslint` depreciada no Next 16 (era raiz, agora é via CLI)
 * - Movida `cacheComponents` de `experimental` para raiz (aviso do build)
 * - Wildcard `hostname: '**'` restrito a domínios confiáveis da operação
 * - Mantido `typescript.ignoreBuildErrors: true` até refatoração de tipos estar completa
 */
const nextConfig = {
  // ✅ Movida de experimental.cacheComponents para raiz (Next 16)
  cacheComponents: true,

  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },

  // Matcher do proxy é definido no próprio proxy.ts via export const config
  // (next.config.mjs não aceita a chave 'matcher' diretamente)

  transpilePackages: ["@typebot.io/react"],

  // ⚠️ Bypass ativo — remover após limpar erros de TypeScript nas Fases seguintes
  typescript: { ignoreBuildErrors: true },

  // Otimização de Imagens — domínios explícitos (sem wildcard)
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      // CDN principal de fotos e assets da Hooke
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      // ERP Tiny: fotos de produto vindas do catálogo
      { protocol: 'https', hostname: 'tiny.com.br' },
      { protocol: 'https', hostname: '*.tiny.com.br' },
      // Google User Content (avatares de usuários Google)
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      // Firebase Storage (imagens do admin)
      { protocol: 'https', hostname: 'firebasestorage.googleapis.com' },
      // Mercado Pago (logos de pagamento)
      { protocol: 'https', hostname: 'http2.mlstatic.com' },
    ],
    unoptimized: false,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },

  // Performance e Segurança
  reactStrictMode: true,
  poweredByHeader: false,

  // Limpeza de console.log em produção
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  // Logs detalhados em dev
  logging: {
    fetches: {
      fullUrl: true,
    },
  },

  // Turbopack (dev)
  turbopack: {},
};

const analyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const sentryConfig = {
  silent: true,
  org: "hooke",
  project: "javascript-nextjs",
  authToken: process.env.SENTRY_AUTH_TOKEN,
  widenClientFileUpload: true,
  tunnelRoute: "/monitoring",
};

export default withSentryConfig(analyzer(nextConfig), sentryConfig);
