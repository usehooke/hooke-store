import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    console.log("Webhook Tiny Recebido:", JSON.stringify(payload));

    // Tenta extrair o SKU e Saldo de diferentes formatos possíveis de webhooks
    const sku = payload?.dados?.sku || payload?.sku || payload?.codigo || payload?.idProduto;
    const newStock = payload?.dados?.saldo ?? payload?.estoque ?? payload?.quantidade ?? payload?.saldo;

    if (!sku || newStock === undefined) {
      console.error("Webhook falhou: SKU ou Saldo ausentes no payload.");
      return NextResponse.json({ error: 'Payload inválido. SKU ou Saldo ausentes.' }, { status: 400 });
    }

    // Varredura cirúrgica no Firebase para encontrar a qual produto esse SKU pertence
    const produtosRef = collection(db, 'produtos');
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
              
              updateDoc(doc(db, 'produtos', document.id), {
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
