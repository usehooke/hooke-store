import { getAdminProducts } from '@/features/admin/services/adminProductService';
import { GeradorView } from './GeradorView';
import { Metadata } from 'next';
import { connection } from "next/server";
import fs from 'fs';
import path from 'path';

export const metadata: Metadata = {
  title: 'Estúdio Lookbook | Hooke Command Center',
  description: 'Estúdio visual pré-computado de lookbook com controle Antigravity Engine',
};

function getExistingLookbookImages(productId: string): Record<string, string | null> {
  const lookbookDir = path.join(process.cwd(), 'public', 'lookbook', productId);
  const result: Record<string, string | null> = {
    hero: null,
    meioCorpo: null,
    editorial: null,
    detalhe: null,
  };

  try {
    if (fs.existsSync(lookbookDir)) {
      const files = fs.readdirSync(lookbookDir);
      const shotKeys = ['hero', 'meioCorpo', 'editorial', 'detalhe'];
      const extensions = ['.jpg', '.jpeg', '.png', '.webp'];

      for (const shot of shotKeys) {
        // Find if a file starting with shot name and having one of the extensions exists
        const matchedFile = files.find(file => {
          const lower = file.toLowerCase();
          return extensions.some(ext => lower === `${shot.toLowerCase()}${ext}`);
        });

        if (matchedFile) {
          result[shot] = `/lookbook/${productId}/${matchedFile}`;
        }
      }
    }
  } catch (err) {
    console.error(`❌ [GeradorPage] Erro ao escanear lookbook de ${productId}:`, err);
  }

  return result;
}

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
    .map((p) => {
      const productId = p.id || '';
      return {
        id: productId,
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
        lookbookImages: getExistingLookbookImages(productId),
      };
    });

  return (
    <div className="min-h-screen bg-zinc-50 p-4 md:p-10 font-sans">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-black/10 pb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-8 h-[2px] bg-black" />
              <p className="text-[10px] font-black tracking-[0.2em] text-black uppercase">Antigravity Engine</p>
            </div>
            <h1 className="text-4xl font-black tracking-tighter text-black">Estúdio Lookbook</h1>
            <p className="text-sm text-zinc-400 mt-2 max-w-lg">
              Selecione um produto, visualize os 4 shots do lookbook e baixe as imagens prontas.
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
