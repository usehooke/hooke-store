import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { z } from 'zod';

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
      console.error("Webhook Tiny: payload rejeitado pelo schema Zod.", validation.error.format());
      return NextResponse.json({ error: 'Payload com estrutura inválida.' }, { status: 400 });
    }

    const payload = validation.data;

    // Extração tipada dos campos relevantes
    const sku = payload?.dados?.sku || payload?.sku || payload?.codigo || payload?.idProduto;
    const newStock = payload?.dados?.saldo ?? payload?.estoque ?? payload?.quantidade ?? payload?.saldo;

    if (!sku || newStock === undefined) {
      console.error("Webhook Tiny: SKU ou Saldo ausentes no payload.");
      return NextResponse.json({ error: 'Payload inválido. SKU ou Saldo ausentes.' }, { status: 400 });
    }

    // ⚡ A TRAVA DO TECH LEAD: Se o banco estiver offline, o Webhook não pode atualizar o estoque.
    const firestore = db;
    if (!firestore) {
      console.error("❌ [Hooke System] Webhook Tiny abortado: Firestore offline.");
      return NextResponse.json({ error: "[Hooke System] Service Unavailable" }, { status: 503 });
    }

    // Varredura cirúrgica no Firebase para encontrar a qual produto esse SKU pertence
    const produtosRef = collection(firestore, 'produtos');
    const snapshot = await getDocs(produtosRef);
    
    let updated = false;
    let productIdToUpdate = null;

    snapshot.forEach((document) => {
      const data = document.data();
      if (data.skus) {
        const entries = Object.entries(data.skus);
        for (const [tamanhoCor, skuCode] of entries) {
           if (skuCode === sku) {
              // SKU Localizado!
              const currentStockObj = data.stock || {};
              // Atualiza de forma atômica apenas a grade específica
              currentStockObj[tamanhoCor] = Number(newStock);
              
              updateDoc(doc(firestore, 'produtos', document.id), {
                 stock: currentStockObj
              });
              updated = true;
              productIdToUpdate = document.id;
           }
        }
      }
    });

    if (updated) {
      console.log(`Sucesso: Estoque mapeado para o produto ${productIdToUpdate}. Nova Qtd: ${newStock}`);
      return NextResponse.json({ success: true, message: `Estoque do SKU ${sku} atualizado com sucesso.` });
    } else {
      console.warn(`Aviso: Webhook recebeu SKU ${sku}, mas ele não existe em nenhum produto do Firebase.`);
      return NextResponse.json({ success: false, message: `SKU ${sku} não encontrado no banco de dados da loja.` }, { status: 404 });
    }
  } catch (error) {
    console.error("Erro Crítico no Webhook Tiny:", error);
    return NextResponse.json({ error: 'Erro interno ao processar webhook' }, { status: 500 });
  }
}
