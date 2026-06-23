import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { z } from 'zod';

/**
 * Hooke Tiny Webhook — Atualização de Estoque em Tempo Real
 * 
 * ✅ MIGRADO para o Admin SDK (firebase-admin):
 * O Firebase Client SDK não deve ser usado em API Routes (server-side).
 * O Admin SDK oferece acesso privilegiado e sem as restrições gRPC do client SDK.
 */

// Schema Zod: aceita os múltiplos formatos de webhook do Tiny ERP
const TinyWebhookSchema = z.object({
  dados: z.object({
    sku: z.string().optional(),
    saldo: z.number().optional(),
  }).optional(),
  sku: z.string().optional(),
  codigo: z.string().optional(),
  idProduto: z.string().optional(),
  estoque: z.number().optional(),
  quantidade: z.number().optional(),
  saldo: z.number().optional(),
});

export async function POST(req: Request) {
  try {
    const rawPayload = await req.json();

    // Validação de schema — rejeita payloads estruturalmente inválidos
    const validation = TinyWebhookSchema.safeParse(rawPayload);
    if (!validation.success) {
      return NextResponse.json({ error: 'Payload com estrutura inválida.' }, { status: 400 });
    }

    const payload = validation.data;

    // Extração tipada dos campos relevantes
    const sku = payload?.dados?.sku || payload?.sku || payload?.codigo || payload?.idProduto;
    const newStock = payload?.dados?.saldo ?? payload?.estoque ?? payload?.quantidade ?? payload?.saldo;

    if (!sku || newStock === undefined) {
      return NextResponse.json({ error: 'Payload inválido. SKU ou Saldo ausentes.' }, { status: 400 });
    }

    // ⚡ Guard do Admin SDK
    if (!adminDb) {
      console.error('❌ [Tiny Webhook] adminDb não inicializado.');
      return NextResponse.json({ error: "[Hooke System] Service Unavailable" }, { status: 503 });
    }

    // Varredura cirúrgica no Firestore para encontrar a qual produto esse SKU pertence
    const snapshot = await adminDb.collection('produtos').get();
    
    const updatePromises: Promise<any>[] = [];
    let updated = false;

    snapshot.forEach((document) => {
      const data = document.data();
      if (data.skus) {
        const entries = Object.entries(data.skus);
        for (const [tamanhoCor, skuCode] of entries) {
           if (skuCode === sku) {
              // SKU Localizado!
              const currentStockObj = data.stock || {};
              currentStockObj[tamanhoCor] = Number(newStock);
              
              // ✅ await correto: updateDoc deve ser aguardado
              updatePromises.push(
                adminDb.collection('produtos').doc(document.id).update({ stock: currentStockObj })
              );
              updated = true;
           }
        }
      }
    });

    // Aguarda todas as atualizações de estoque
    if (updatePromises.length > 0) {
      await Promise.all(updatePromises);
    }

    if (updated) {
      return NextResponse.json({ success: true, message: `Estoque do SKU ${sku} atualizado com sucesso.` });
    } else {
      return NextResponse.json({ success: false, message: `SKU ${sku} não encontrado no banco de dados da loja.` }, { status: 404 });
    }
  } catch (error) {
    console.error("Erro Crítico no Webhook Tiny:", error);
    return NextResponse.json({ error: 'Erro interno ao processar webhook' }, { status: 500 });
  }
}
