import { getAdminProducts } from '@/features/admin/services/adminProductService';
import { AdminProductsView } from './AdminProductsView';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Inventário | Hooke Command Center',
  description: 'Gerenciamento de Catálogo Elite',
};

import { headers } from 'next/headers';

// Admin sempre precisa ler dados atualizados do banco
// export const dynamic = 'force-dynamic';

export default async function AdminProductsPage() {
  headers();
  // Leitura com privilégios de Admin direto no Firebase Admin SDK
  const products = await getAdminProducts();

  // Cálculos de Health Dashboard (Feitos no servidor = 0 processamento no cliente)
  let eliteProductsCount = 0;
  let lowStockCount = 0;
  let totalStockValue = 0;

  products.forEach((p) => {
    const hasDept = !!p.department;
    const hasMinImages = p.images && p.images.length >= 4;
    const hasSEO = p.seo?.metaDescription && p.seo.metaDescription.length >= 50;
    const hasDescription = p.description && p.description.length >= 100;
    
    if (hasDept && hasMinImages && hasSEO && hasDescription) {
      eliteProductsCount++;
    }

    if (p.stock && typeof p.stock === 'object') {
      Object.values(p.stock).forEach((val) => {
        if (typeof val === 'number' && val < 3) lowStockCount++;
      });
    } else if (typeof (p as any).quantity === 'number' && (p as any).quantity < 3) {
      lowStockCount++;
    }

    let totalQty = 0;
    if (p.stock && typeof p.stock === 'object') {
      Object.values(p.stock).forEach((val) => {
        if (typeof val === 'number') totalQty += val;
      });
    } else if (typeof (p as any).quantity === 'number') {
      totalQty = (p as any).quantity;
    }
    totalStockValue += totalQty * (p.price || 0);
  });

  const catalogHealth = products.length > 0 ? (eliteProductsCount / products.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-zinc-50 p-4 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header Elite Modernizado */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-black/10 pb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-8 h-[2px] bg-black" />
              <p className="text-[10px] font-black tracking-[0.2em] text-black uppercase">Hooke Elite Office V4</p>
            </div>
            <h1 className="text-4xl font-black tracking-tighter text-black">Comando Central</h1>
          </div>
        </header>

        {/* Health Dashboard Brutalista */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border border-black/10 p-6 bg-white shadow-sm flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Saúde do Catálogo</span>
              <span className="text-[10px] font-mono font-black px-2 py-0.5 border border-black/10 bg-zinc-50 text-black">AUDITORIA ELITE</span>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-4xl font-black tracking-tighter">{catalogHealth.toFixed(0)}%</span>
              <span className="text-xs text-zinc-400 font-bold">de produtos Elite</span>
            </div>
            <div className="mt-4 w-full bg-zinc-100 h-1.5 rounded-none overflow-hidden">
              <div className="bg-black h-full transition-all duration-1000" style={{ width: `${catalogHealth}%` }} />
            </div>
          </div>

          <div className={`border p-6 bg-white shadow-sm flex flex-col justify-between transition-all ${lowStockCount > 0 ? "border-amber-200" : "border-black/10"}`}>
            <div className="flex items-start justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Alerta de Ruptura</span>
              <span className={`text-[10px] font-mono font-black px-2 py-0.5 border ${lowStockCount > 0 ? "border-amber-200 bg-amber-50 text-amber-700" : "border-black/10 bg-zinc-50 text-black"}`}>
                LIMITE &lt; 3 UNIDADES
              </span>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className={`text-4xl font-black tracking-tighter ${lowStockCount > 0 ? "text-amber-600" : ""}`}>{lowStockCount}</span>
              <span className="text-xs text-zinc-400 font-bold">SKUs em nível crítico</span>
            </div>
            <p className="mt-4 text-[9px] font-black tracking-wide text-zinc-400 uppercase">
              {lowStockCount > 0 ? "⚠️ Ação recomendada para reposição" : "✅ Estoque balanceado"}
            </p>
          </div>

          <div className="border border-black/10 p-6 bg-white shadow-sm flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Capital Físico Ativo</span>
              <span className="text-[10px] font-mono font-black px-2 py-0.5 border border-black/10 bg-zinc-50 text-black">AVALIAÇÃO ERP</span>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-black tracking-tighter">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(totalStockValue)}
              </span>
              <span className="text-xs text-zinc-400 font-bold">em inventário</span>
            </div>
            <p className="mt-4 text-[9px] font-black tracking-wide text-zinc-400 uppercase">
              Patrimônio baseado nos custos de venda
            </p>
          </div>
        </section>

        {/* View Interativa Passando os Produtos Iniciais */}
        <AdminProductsView initialProducts={products} />

      </div>
    </div>
  );
}
