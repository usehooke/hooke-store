"use client";

import React, { useState, useEffect } from "react";
import { 
  getAllReviewsForAdmin, 
  approveReview, 
  deleteReview, 
  addReviewManually 
} from "@/lib/reviewsService";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { Review, Product } from "@/types";
import { toast } from "sonner";
import { Star, Check, Trash2, Plus, X, MessageSquare, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "approved">("all");
  
  // Modal de Nova Review
  const [showAddModal, setShowAddModal] = useState(false);
  const [newReview, setNewReview] = useState({
    productId: "",
    productName: "",
    name: "",
    rating: 5,
    comment: "",
    channel: "whatsapp" as "site" | "whatsapp" | "instagram",
    location: "",
    approved: true
  });
  const [submitting, setSubmitting] = useState(false);

  // Carregar dados
  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getAllReviewsForAdmin();
      setReviews(data);
      
      // Carrega produtos do Firestore para o dropdown
      if (db) {
        const querySnapshot = await getDocs(collection(db, "produtos"));
        const prodList: Product[] = [];
        querySnapshot.forEach((doc) => {
          const d = doc.data();
          prodList.push({ id: doc.id, name: d.name, slug: d.slug } as any);
        });
        setProducts(prodList);
      }
    } catch (error) {
      console.error("Erro ao carregar reviews/produtos:", error);
      toast.error("Falha ao carregar as avaliações.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Aprovar Review
  const handleApprove = async (id: string) => {
    try {
      const res = await approveReview(id);
      if (res.success) {
        toast.success("Avaliação aprovada!");
        // Atualiza estado local
        setReviews(prev => prev.map(r => r.id === id ? { ...r, approved: true } : r));
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      toast.error("Erro ao aprovar a avaliação.");
    }
  };

  // Excluir Review
  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta avaliação permanentemente?")) return;
    try {
      const res = await deleteReview(id);
      if (res.success) {
        toast.success("Avaliação removida!");
        setReviews(prev => prev.filter(r => r.id !== id));
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      toast.error("Erro ao remover a avaliação.");
    }
  };

  // Criar Review Manual
  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.productId || !newReview.name || !newReview.comment) {
      toast.error("Preencha todos os campos obrigatórios.");
      return;
    }

    setSubmitting(true);
    try {
      // Acha o nome do produto selecionado
      const selectedProd = products.find(p => p.id === newReview.productId);
      const productName = selectedProd ? selectedProd.name : "Produto";

      const res = await addReviewManually({
        ...newReview,
        productName
      });

      if (res.success) {
        toast.success("Avaliação adicionada com sucesso!");
        setShowAddModal(false);
        setNewReview({
          productId: "",
          productName: "",
          name: "",
          rating: 5,
          comment: "",
          channel: "whatsapp",
          location: "",
          approved: true
        });
        loadData();
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      toast.error("Erro ao criar avaliação.");
    } finally {
      setSubmitting(false);
    }
  };

  // Estatísticas
  const totalReviews = reviews.length;
  const pendingReviews = reviews.filter(r => !r.approved).length;
  const approvedReviews = reviews.filter(r => r.approved).length;
  const averageRating = totalReviews > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1)
    : "0.0";

  // Reviews Filtradas
  const filteredReviews = reviews.filter(r => {
    if (filter === "pending") return !r.approved;
    if (filter === "approved") return r.approved;
    return true;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-black pb-6">
        <div>
          <span className="text-[10px] font-mono font-black uppercase tracking-[0.3em] text-zinc-400">HQ • MODERAÇÃO</span>
          <h1 className="text-3xl font-black uppercase tracking-tighter text-black mt-1">Depoimentos e UGC</h1>
        </div>
        <Button 
          variant="brutalist" 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2"
        >
          <Plus size={14} /> Adicionar Manual
        </Button>
      </div>

      {/* Grid de Estatísticas Brutalistas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="border-2 border-black p-6 bg-zinc-50 shadow-[4px_4px_0px_0px_#000]">
          <span className="text-[9px] font-bold tracking-widest text-zinc-400 uppercase">Média Geral</span>
          <p className="text-3xl font-black text-black mt-2 flex items-baseline gap-1.5">
            {averageRating} <span className="text-xs text-amber-500">★</span>
          </p>
        </div>
        <div className="border-2 border-black p-6 bg-zinc-50 shadow-[4px_4px_0px_0px_#000]">
          <span className="text-[9px] font-bold tracking-widest text-zinc-400 uppercase">Total de Reviews</span>
          <p className="text-3xl font-black text-black mt-2">{totalReviews}</p>
        </div>
        <div className="border-2 border-black p-6 bg-zinc-50 shadow-[4px_4px_0px_0px_#000]">
          <span className="text-[9px] font-bold tracking-widest text-zinc-400 uppercase">Aprovadas</span>
          <p className="text-3xl font-black text-green-600 mt-2">{approvedReviews}</p>
        </div>
        <div className="border-2 border-black p-6 bg-zinc-50 shadow-[4px_4px_0px_0px_#000] relative overflow-hidden">
          <span className="text-[9px] font-bold tracking-widest text-zinc-400 uppercase">Pendentes</span>
          <p className="text-3xl font-black text-red-600 mt-2">{pendingReviews}</p>
          {pendingReviews > 0 && (
            <span className="absolute top-2 right-2 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
          )}
        </div>
      </div>

      {/* Barra de Filtros */}
      <div className="flex flex-wrap gap-2 border-b border-zinc-100 pb-4">
        <button 
          onClick={() => setFilter("all")}
          className={`px-4 py-2 text-[10px] font-black uppercase tracking-wider border-2 border-black transition-all ${
            filter === "all" ? "bg-black text-white" : "bg-white text-black hover:bg-zinc-50"
          }`}
        >
          Todas ({totalReviews})
        </button>
        <button 
          onClick={() => setFilter("pending")}
          className={`px-4 py-2 text-[10px] font-black uppercase tracking-wider border-2 border-black transition-all relative ${
            filter === "pending" ? "bg-black text-white" : "bg-white text-black hover:bg-zinc-50"
          }`}
        >
          Pendentes ({pendingReviews})
          {pendingReviews > 0 && (
            <span className="ml-1.5 px-1.5 py-0.5 text-[8px] bg-red-500 text-white font-mono rounded-none">
              !
            </span>
          )}
        </button>
        <button 
          onClick={() => setFilter("approved")}
          className={`px-4 py-2 text-[10px] font-black uppercase tracking-wider border-2 border-black transition-all ${
            filter === "approved" ? "bg-black text-white" : "bg-white text-black hover:bg-zinc-50"
          }`}
        >
          Aprovadas ({approvedReviews})
        </button>
      </div>

      {/* Listagem */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-8 h-8 border-4 border-black border-t-transparent animate-spin" />
          <span className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">Sincronizando com Firestore...</span>
        </div>
      ) : filteredReviews.length === 0 ? (
        <div className="border-2 border-dashed border-zinc-200 p-20 text-center bg-zinc-50/50">
          <MessageSquare size={36} className="mx-auto text-zinc-300 mb-4" />
          <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Nenhuma avaliação encontrada neste filtro.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredReviews.map((review) => (
            <div 
              key={review.id}
              className={`border-2 border-black bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all flex flex-col justify-between relative ${
                !review.approved ? "border-amber-500 shadow-[4px_4px_0px_0px_#F59E0B]" : ""
              }`}
            >
              {/* Badge de Status / Origem */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-[8px] font-mono font-black uppercase tracking-wider px-2 py-0.5 border border-black/10 bg-zinc-50">
                  Via {review.channel.toUpperCase()} {review.location ? `· ${review.location}` : ""}
                </span>
                
                <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 ${
                  review.approved 
                    ? "bg-emerald-50 text-emerald-600 border border-emerald-300"
                    : "bg-amber-50 text-amber-600 border border-amber-300 animate-pulse"
                }`}>
                  {review.approved ? "Aprovada" : "Pendente de Moderação"}
                </span>
              </div>

              {/* Conteúdo */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-black">{review.name}</h3>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={12} 
                        className={i < review.rating ? "fill-amber-400 text-amber-400" : "text-zinc-200"} 
                      />
                    ))}
                  </div>
                </div>

                <p className="text-[10px] font-mono font-black uppercase text-zinc-400">
                  Item: <span className="text-black">{review.productName}</span>
                </p>

                <p className="text-xs text-zinc-700 leading-relaxed italic font-medium pt-1 border-t border-zinc-50">
                  "{review.comment}"
                </p>
              </div>

              {/* Ações */}
              <div className="flex gap-2 mt-6 pt-4 border-t border-zinc-100 justify-end">
                {!review.approved && (
                  <button
                    onClick={() => handleApprove(review.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white text-[9px] font-black uppercase tracking-widest border border-black hover:bg-emerald-700 transition-colors"
                  >
                    <Check size={12} /> Aprovar
                  </button>
                )}
                <button
                  onClick={() => handleDelete(review.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 text-[9px] font-black uppercase tracking-widest border border-red-200 hover:bg-red-100 transition-colors"
                >
                  <Trash2 size={12} /> Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Brutalista de Nova Review Manual */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white border-2 border-black shadow-[8px_8px_0px_0px_#000] w-full max-w-lg p-8 relative animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-black transition-colors"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-zinc-100">
              <MessageSquare size={20} />
              <h2 className="text-lg font-black uppercase tracking-tight text-black">Adicionar Avaliação Manual</h2>
            </div>

            <form onSubmit={handleAddReview} className="space-y-5">
              {/* Dropdown de Produto */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">Selecione o Produto *</label>
                <select
                  required
                  value={newReview.productId}
                  onChange={(e) => setNewReview(prev => ({ ...prev, productId: e.target.value }))}
                  className="w-full bg-white border border-black/10 px-4 py-3 text-xs font-bold uppercase tracking-wide focus:outline-none focus:border-black rounded-none"
                >
                  <option value="">-- Escolha --</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              {/* Nome & Localização */}
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Nome do Cliente *"
                  required
                  value={newReview.name}
                  onChange={(e) => setNewReview(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ex: Lucas A."
                />
                <Input
                  label="Localização"
                  value={newReview.location}
                  onChange={(e) => setNewReview(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="Ex: São Paulo, SP"
                />
              </div>

              {/* Canal & Nota */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">Origem / Canal</label>
                  <select
                    value={newReview.channel}
                    onChange={(e) => setNewReview(prev => ({ ...prev, channel: e.target.value as any }))}
                    className="w-full bg-white border border-black/10 px-4 py-3 text-xs font-bold uppercase tracking-wide focus:outline-none focus:border-black rounded-none"
                  >
                    <option value="whatsapp">WhatsApp</option>
                    <option value="instagram">Instagram</option>
                    <option value="site">Site</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">Estrelas / Nota *</label>
                  <select
                    value={newReview.rating}
                    onChange={(e) => setNewReview(prev => ({ ...prev, rating: parseInt(e.target.value, 10) }))}
                    className="w-full bg-white border border-black/10 px-4 py-3 text-xs font-bold uppercase tracking-wide focus:outline-none focus:border-black rounded-none"
                  >
                    <option value="5">5 Estrelas</option>
                    <option value="4">4 Estrelas</option>
                    <option value="3">3 Estrelas</option>
                    <option value="2">2 Estrelas</option>
                    <option value="1">1 Estrela</option>
                  </select>
                </div>
              </div>

              {/* Comentário */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">Depoimento *</label>
                <textarea
                  required
                  rows={3}
                  value={newReview.comment}
                  onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                  placeholder="Insira o texto da avaliação recebido no WhatsApp ou Instagram..."
                  className="w-full bg-white border border-black/10 px-4 py-3 text-xs font-medium focus:outline-none focus:border-black rounded-none resize-none"
                />
              </div>

              {/* Botões do Modal */}
              <div className="flex gap-2 pt-4 justify-end">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-6 py-3 border border-black/10 hover:bg-zinc-50 text-[10px] font-black uppercase tracking-widest"
                >
                  Cancelar
                </button>
                <Button
                  type="submit"
                  variant="buy"
                  size="md"
                  disabled={submitting}
                >
                  {submitting ? "Salvando..." : "Salvar Depoimento →"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
