import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN || "SUA_DSN_AQUI",

  // Ajuste isso em produção conforme necessário
  tracesSampleRate: 1.0,

  // Configuração para Session Replay (Substitui a necessidade básica do LogRocket)
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,

  // Integrar com o design Hooke
  debug: false,
});
