import { MercadoPagoConfig } from 'mercadopago';

if (!process.env.MP_ACCESS_TOKEN) {
    throw new Error('MP_ACCESS_TOKEN não está definido nas variáveis de ambiente');
}

// Inicializamos o client HTTP do Mercado Pago
export const client = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN,
    options: { timeout: 5000, idempotencyKey: 'hooke-store' }
});
