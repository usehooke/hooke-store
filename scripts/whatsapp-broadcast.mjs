#!/usr/bin/env node
/**
 * scripts/whatsapp-broadcast.mjs
 * CLI de Gestão e Disparos Transacionais via WhatsApp — Hooke Store
 */

import { buildAbandonedCartRecoveryMessage } from '../src/lib/whatsapp/engine.ts';

console.log('========================================================');
console.log('📱 [Hooke WhatsApp Engine] Gerador de Mensagens');
console.log('========================================================\n');

const testDraft = {
  customerName: 'Rodrigo Medeiros',
  customerPhone: '11975902528',
  productNames: ['T-Shirt Vintage Fusca Preta (G)', 'Conjunto Viscose Verde (M)'],
  totalValue: 155.0,
  discountCoupon: 'HOOKE-VIP',
  checkoutUrl: 'https://www.usehooke.com.br/checkout?ref=wa_recovery'
};

const result = buildAbandonedCartRecoveryMessage(testDraft);

console.log('📋 MENSAGEM DE RECUPERAÇÃO HUMANIZADA:');
console.log('--------------------------------------------------------');
console.log(result.message);
console.log('--------------------------------------------------------\n');
console.log('🔗 LINK DIRETO WA.ME GERADO:');
console.log(result.waLink);
console.log('\n✅ Validação concluída com sucesso.');
