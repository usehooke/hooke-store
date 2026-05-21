'use client';

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Product } from "@/types";
import { AdminProductList } from "../components/elite/AdminProductList";
import { AdminProductDrawer } from "../components/elite/AdminProductDrawer";
import { toggleProductVisibility, deleteProduct, saveProduct } from "../actions/products";
import { triggerHaptic } from "@/utils/haptics";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export function AdminProductsView({ initialProducts }: { initialProducts: Product[] }) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleToggleActive = (id: string, currentStatus: boolean) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, isActive: !currentStatus } : p));
    triggerHaptic('light');

    startTransition(async () => {
      const result = await toggleProductVisibility(id, currentStatus, 'admin-v4-server');
      if (result.success) {
        toast.success(currentStatus ? "Produto ocultado" : "Produto visível");
        router.refresh();
      } else {
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
    setProducts(prev => prev.filter(p => p.id !== id));

    startTransition(async () => {
      const result = await deleteProduct(id, name, 'admin-v4-server');
      if (result.success) {
        toast.success("Produto excluído.");
        router.refresh();
      } else {
        setProducts(previousProducts);
        toast.error("Erro ao excluir.");
      }
    });
  };

  const handleSaveProduct = async (data: Partial<Product>) => {
    startTransition(async () => {
      const result = await saveProduct(data, 'admin-v4-server');
      if (result.success) {
        triggerHaptic('success');
        toast.success(data.id ? "Alterações salvas" : "Novo produto cadastrado");
        setIsDrawerOpen(false);
        setEditingProduct(null);
        router.refresh(); // O Server Component vai re-buscar os dados frescos do banco
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
        router.refresh();
      } else {
        throw new Error();
      }
    } catch {
      toast.error("Falha na sincronização.");
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-black uppercase tracking-tighter">Inventário</h2>
        <button
          onClick={() => {
            setEditingProduct(null);
            setIsDrawerOpen(true);
          }}
          className="px-6 py-3 bg-black text-white text-[10px] font-black tracking-widest uppercase hover:bg-zinc-800 transition-all flex items-center gap-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] active:translate-y-1 active:shadow-none"
        >
          <Plus size={14} strokeWidth={2.5} /> Adicionar Geometria
        </button>
      </div>

      <div className="bg-white border border-black/10 p-6 shadow-sm min-h-[400px]">
        <AdminProductList
          products={products}
          isLoading={false}
          onEdit={(p) => {
            setEditingProduct(p);
            setIsDrawerOpen(true);
          }}
          onDelete={handleDelete}
          onToggleActive={handleToggleActive}
          onSync={handleSyncTiny}
        />
      </div>

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
    </div>
  );
}
