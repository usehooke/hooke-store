import { getAdminProducts } from '@/features/admin/services/adminProductService';
import { GeradorView } from './GeradorView';
import { Metadata } from 'next';
import { connection } from "next/server";

export const metadata: Metadata = {
  title: 'Gerador de Fotos IA | Hooke Command Center',
  description: 'Gerador automático de prompts para fotos de produto com IA',
};

export default async function GeradorPage() {
  await connection();

  // ✅ try/catch explícito: evita tela branca em caso de falha no Firestore
  let products: Awaited<ReturnType<typeof getAdminProducts>> = [];
  try {
    products = await getAdminProducts();
  } catch (err) {
    console.error("❌ [GeradorPage] Falha ao carregar produtos:", err);
    // O error.tsx vai capturar se o throw chegar até aqui
    throw err;
  }

  // Mapeia apenas os campos necessários para o gerador (leve para o client)
  const productOptions = products
    .filter((p) => p.isActive !== false)
    .map((p) => ({
      id: p.id || '',
      name: p.name,
      color: (p as any).color || '',
      category: p.category || '',
      imageUrl: p.imageUrl || (p.images?.[0] ?? ''),
      details: {
        fabric: (p as any).details?.fabric || '',
        grammage: (p as any).details?.grammage || '',
        collar: (p as any).details?.collar || '',
        model: (p as any).details?.model || '',
      },
    }));

  return (
    <div className="min-h-screen bg-zinc-50 p-4 md:p-10 font-sans">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-black/10 pb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-8 h-[2px] bg-black" />
              <p className="text-[10px] font-black tracking-[0.2em] text-black uppercase">Produção Visual IA</p>
            </div>
            <h1 className="text-4xl font-black tracking-tighter text-black">Gerador de Prompts</h1>
            <p className="text-sm text-zinc-400 mt-2 max-w-lg">
              Selecione um produto, gere os 4 prompts de fotografia e copie direto para a IA.
            </p>
          </div>
          {/* Indicador de produtos carregados */}
          <div className="flex items-center gap-2 text-[9px] font-black tracking-[0.2em] uppercase text-zinc-400">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-none" />
            {productOptions.length} produto{productOptions.length !== 1 ? 's' : ''} disponível{productOptions.length !== 1 ? 'is' : ''}
          </div>
        </header>

        <GeradorView products={productOptions} />

      </div>
    </div>
  );
}
