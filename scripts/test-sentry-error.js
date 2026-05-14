const Sentry = require("@sentry/nextjs");

// HOOKE SYSTEM: SERVERSIDE ERROR TRIGGER
// Este script simula um erro no servidor para validar a conexão com a Sentry.

const DSN = "https://49ba0a8ba9b011d17307bb9fff740857@o4511377673879552.ingest.us.sentry.io/4511377676632064";

Sentry.init({
  dsn: DSN,
  tracesSampleRate: 1.0,
  debug: true,
});

console.log("🚀 Disparando erro sintético para Sentry...");

try {
  // @ts-ignore
  myUndefinedFunction();
} catch (error) {
  Sentry.captureException(error);
  console.log("✅ Erro capturado e enviado para a Sentry.");
}

// Pequeno delay para garantir o envio antes do processo fechar
setTimeout(() => {
  console.log("🏁 Teste concluído. Verifique seu Dashboard.");
  process.exit(0);
}, 3000);
