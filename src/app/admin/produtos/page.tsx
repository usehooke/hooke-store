'use client';

import { useEffect, useState, useTransition } from "react";
import { db, auth } from "@/lib/firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Toaster, toast } from "sonner";

// Server Actions V11.0 Elite
import { toggleProductVisibility, deleteProduct, saveProduct } from "../actions/products";

// Novos Componentes Elite
import { AdminProductList } from "../components/elite/AdminProductList";
import { AdminProductDrawer } from "../components/elite/AdminProductDrawer";
import { Product } from "@/types";
import { LayoutDashboard, Barcode, LogOut, ExternalLink, Plus } from "lucide-react";
import { triggerHaptic } from "@/utils/haptics";

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  useEffect(() => {
    if (!auth) return;
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push("/login");
      } else {
        setUser(currentUser);
        fetchProducts();
      }
    });

    return () => unsubscribe();
  }, [router]);

  async function fetchProducts() {
    setLoading(true);
    try {
      if (!db) throw new Error("Firebase DB não inicializado.");
      const querySnapshot = await getDocs(collection(db, "produtos"));
      const productsData: Product[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        productsData.push({
          id: doc.id,
          ...data,
        } as Product);
      });
      setProducts(productsData);
    } catch (err) {
      console.error("Erro ao buscar produtos:", err);
      toast.error("Erro ao carregar catálogo. Verifique a conexão.");
    } finally {
      setLoading(false);
    }
  }

  const handleToggleActive = (id: string, currentStatus: boolean) => {
    // Optimistic UI Update
    setProducts(prev => prev.map(p => p.id === id ? { ...p, isActive: !currentStatus } : p));
    triggerHaptic('light');

    startTransition(async () => {
      const result = await toggleProductVisibility(id, currentStatus, user?.email || 'system');
      if (result.success) {
        toast.success(currentStatus ? "Produto ocultado" : "Produto visível");
      } else {
        // Rollback on failure
        setProducts(prev => prev.map(p => p.id === id ? { ...p, isActive: currentStatus } : p));
        toast.error("Erro ao alterar visibilidade.");
        triggerHaptic('heavy');
      }
    });
  };

  const handleDelete = (id: string, name: string) => {
    if (!window.confirm(`Excluir definitivamente "${name}"?`)) return;
    triggerHaptic('heavy');

    const previousProducts = [...products];
    // Optimistic UI Delete
    setProducts(prev => prev.filter(p => p.id !== id));

    startTransition(async () => {
      const result = await deleteProduct(id, name, user?.email || 'system');
      if (result.success) {
        toast.success("Produto excluído.");
      } else {
        // Rollback
        setProducts(previousProducts);
        toast.error("Erro ao excluir.");
      }
    });
  };

  const handleSaveProduct = async (data: Partial<Product>) => {
    startTransition(async () => {
      const result = await saveProduct(data, user?.email || 'system');
      if (result.success) {
        triggerHaptic('success');
        toast.success(data.id ? "Alterações salvas" : "Novo produto cadastrado");
        setIsDrawerOpen(false);
        setEditingProduct(null);
        fetchProducts(); // Refresh para pegar o ID caso seja novo
      } else {
        triggerHaptic('heavy');
        toast.error(`Falha: ${result.message}`);
      }
    });
  };

  const handleSyncTiny = async (product: Product) => {
    toast.info(`Sincronizando ${product.name}...`);
    try {
      const response = await fetch("/api/admin/sync/tiny", {
        method: "POST",
        body: JSON.stringify(product),
      });
      if (response.ok) {
        toast.success("Sincronizado com Tiny!");
        fetchProducts();
      } else {
        throw new Error();
      }
    } catch {
      toast.error("Falha na sincronização.");
    }
  };

  // Auditoria do catálogo e estoque para o Health Dashboard
  let eliteProductsCount = 0;
  let lowStockCount = 0;
  let totalStockValue = 0;

  products.forEach((p) => {
    // 1. Auditoria de Padrão Elite (Simetria ao QualityBadge)
    const hasDept = !!p.department;
    const hasMinImages = p.images && p.images.length >= 4;
    const hasSEO = p.seo?.metaDescription && p.seo.metaDescription.length >= 50;
    const hasDescription = p.description && p.description.length >= 100;
    
    if (hasDept && hasMinImages && hasSEO && hasDescription) {
      eliteProductsCount++;
    }

    // 2. Ruptura de estoque (limite < 3 unidades)
    if (p.stock && typeof p.stock === 'object') {
      Object.values(p.stock).forEach((val) => {
        if (typeof val === 'number' && val < 3) {
          lowStockCount++;
        }
      });
    } else if (typeof (p as any).quantity === 'number' && (p as any).quantity < 3) {
      lowStockCount++;
    }

    // 3. Capital total físico ativo
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
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-10 font-sans">
      <Toaster position="top-right" richColors />
      
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header Elite Modernizado */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-200 pb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-8 h-[2px] bg-hooke-900" />
              <p className="text-[10px] font-black tracking-[0.2em] text-hooke-900 uppercase">Hooke Elite Office</p>
            </div>
            <h1 className="text-4xl font-black tracking-tighter text-hooke-900">Gerenciamento de Inventário</h1>
            <p className="text-xs text-gray-400 mt-2 font-medium">Logado como <span className="text-gray-600 italic">{user?.email}</span></p>
          </div>

          <div className="flex items-center gap-3">
             <button
              onClick={() => {
                setEditingProduct(null);
                setIsDrawerOpen(true);
              }}
              className="px-6 py-3 bg-hooke-900 text-white text-[10px] font-black tracking-widest uppercase hover:bg-black transition-all shadow-lg hover:shadow-hooke-900/10 flex items-center gap-2"
             >
               <Plus size={14} /> Novo Produto Elite
             </button>
             
             <div className="h-10 w-px bg-gray-200 mx-2 hidden md:block" />

             <Link href="/admin/pedidos" className="p-3 text-gray-400 hover:text-hooke-900 transition-colors" title="Pedidos">
               <LayoutDashboard size={20} />
             </Link>
             <Link href="/admin/etiquetas" className="p-3 text-gray-400 hover:text-hooke-900 transition-colors" title="Etiquetas">
               <Barcode size={20} />
             </Link>
             <button onClick={() => signOut(auth!)} className="p-3 text-gray-400 hover:text-red-500 transition-colors" title="Sair">
               <LogOut size={20} />
             </button>
          </div>
        </header>

        {/* Health Dashboard Brutalista */}
        {!loading && products.length > 0 && (
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Saúde do Catálogo */}
            <div className="border-2 border-black p-6 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between animate-fadeIn">
              <div className="flex items-start justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Saúde do Catálogo</span>
                <span className="text-[10px] font-mono font-black px-2 py-0.5 border border-black bg-zinc-50 text-black">AUDITORIA ELITE</span>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-4xl font-black tracking-tighter">{catalogHealth.toFixed(0)}%</span>
                <span className="text-xs text-zinc-500 font-bold">de produtos Elite</span>
              </div>
              <div className="mt-4 w-full bg-zinc-100 h-2.5 border border-black">
                <div className="bg-black h-full transition-all duration-500" style={{ width: `${catalogHealth}%` }} />
              </div>
            </div>

            {/* Alerta de Ruptura */}
            <div className={`border-2 border-black p-6 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between transition-all ${lowStockCount > 0 ? "border-amber-500 shadow-[4px_4px_0px_0px_#f59e0b]" : ""}`}>
              <div className="flex items-start justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Alerta de Ruptura</span>
                <span className={`text-[10px] font-mono font-black px-2 py-0.5 border ${lowStockCount > 0 ? "border-amber-500 bg-amber-50 text-amber-700 animate-pulse" : "border-black bg-zinc-50 text-black"}`}>
                  LIMITE &lt; 3 UNIDADES
                </span>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className={`text-4xl font-black tracking-tighter ${lowStockCount > 0 ? "text-amber-600" : ""}`}>{lowStockCount}</span>
                <span className="text-xs text-zinc-500 font-bold">SKUs em nível crítico</span>
              </div>
              <p className="mt-4 text-[9px] font-black tracking-wide text-zinc-400 uppercase">
                {lowStockCount > 0 ? "⚠️ Ação imediata recomendada para reposição" : "✅ Estoque operacional balanceado"}
              </p>
            </div>

            {/* Valor em Estoque */}
            <div className="border-2 border-black p-6 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Capital Físico Ativo</span>
                <span className="text-[10px] font-mono font-black px-2 py-0.5 border border-black bg-zinc-50 text-black">AVALIAÇÃO ERP</span>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-3xl font-black tracking-tighter">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(totalStockValue)}
                </span>
                <span className="text-xs text-zinc-500 font-bold">em inventário</span>
              </div>
              <p className="mt-4 text-[9px] font-black tracking-wide text-zinc-400 uppercase">
                Patrimônio calculado com base nos custos de venda
              </p>
            </div>
          </section>
        )}

        {/* Lista Ultra-Limpa Principal */}
        <main className="bg-white border border-gray-100 p-6 shadow-sm min-h-[400px]">
          <AdminProductList
            products={products}
            isLoading={loading && products.length === 0}
            onEdit={(p) => {
              setEditingProduct(p);
              setIsDrawerOpen(true);
            }}
            onDelete={handleDelete}
            onToggleActive={handleToggleActive}
            onSync={handleSyncTiny}
          />
        </main>

        {/* Edição em Drawer Lateral */}
        <AdminProductDrawer
          isOpen={isDrawerOpen}
          onClose={() => {
            setIsDrawerOpen(false);
            setEditingProduct(null);
          }}
          product={editingProduct}
          onSubmit={handleSaveProduct}
          isSaving={isPending}
        />

        {/* Footer Minimalista */}
        <footer className="pt-10 flex justify-between items-center text-[9px] font-bold text-gray-300 uppercase tracking-[0.2em]">
          <p>© 2026 Hooke Store - Industrial Basics</p>
          <div className="flex gap-6">
             <Link href="/" className="hover:text-hooke-900 flex items-center gap-1">Site Público <ExternalLink size={10} /></Link>
             <Link href="/admin" className="hover:text-hooke-900">Dashboard</Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
