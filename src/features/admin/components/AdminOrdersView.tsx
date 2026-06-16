"use client";

import { useState, useMemo, useTransition } from "react";
import { Order, OrderStatus } from "@/types/order";
import { updateOrderStatus, bulkUpdateOrders } from "@/actions/orderActions";
import { Package, Save, MessageCircle, X, Crown, Wrench, Handshake, Copy, Check, CheckSquare, Square } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

// ─── Analisador Semântico de Rastreio ───────────────────────────────────────
function detectShipper(code: string): { label: string; color: string; icon: string } | null {
  const c = code.trim().toUpperCase();
  if (/^[A-Z]{2}\d{9}[A-Z]{2}$/.test(c)) return { label: "Correios", color: "bg-blue-100 text-blue-800 border-blue-300", icon: "📫" };
  if (/^\d{14}$/.test(c)) return { label: "Jadlog", color: "bg-orange-100 text-orange-800 border-orange-300", icon: "🟠" };
  if (/^TE\d{10,}$/.test(c)) return { label: "Total Express", color: "bg-purple-100 text-purple-800 border-purple-300", icon: "🟣" };
  if (/^\d{10,20}$/.test(c)) return { label: "Transportadora", color: "bg-gray-100 text-gray-700 border-gray-300", icon: "📦" };
  return null;
}

const StatusBadge = ({ status }: { status: OrderStatus }) => {
  const map: Record<OrderStatus, { cls: string; label: string }> = {
    pending:    { cls: "bg-yellow-100 text-yellow-800 border-yellow-200", label: "Pendente" },
    approved:   { cls: "bg-green-100 text-green-800 border-green-200", label: "Aprovado" },
    in_process: { cls: "bg-blue-100 text-blue-800 border-blue-200", label: "Em Análise" },
    rejected:   { cls: "bg-red-100 text-red-800 border-red-200", label: "Recusado" },
    cancelled:  { cls: "bg-gray-100 text-gray-800 border-gray-200", label: "Cancelado" },
    sent:       { cls: "bg-zinc-900 text-white border-zinc-900", label: "Enviado" },
    paid:       { cls: "bg-emerald-100 text-emerald-800 border-emerald-200", label: "Pago" },
    shipped:    { cls: "bg-indigo-100 text-indigo-800 border-indigo-200", label: "Postado" },
    abandoned_cart: { cls: "bg-rose-100 text-rose-800 border-rose-200", label: "Abandono" },
  };
  const s = map[status] ?? { cls: "bg-gray-100 text-gray-600 border-gray-200", label: status };
  return (
    <span className={`px-2 py-1 text-[9px] font-black tracking-widest border rounded-none uppercase ${s.cls}`}>
      {s.label}
    </span>
  );
};

export function AdminOrdersView({ initialOrders }: { initialOrders: Order[] }) {
  const getWhatsAppRecoverLink = (order: Order) => {
    const phone = order.customer?.phone?.replace(/\D/g, "") || "";
    const name = order.customer?.name?.split(" ")[0] || "";
    const firstItem = order.items?.[0]?.title || "peça";
    const text = `Oi ${name}! Vi que você ficou de olho na ${firstItem}. Conseguiu escolher o seu tamanho? Se tiver qualquer dúvida sobre o caimento ou frete, me avisa aqui! A Hooke é instalável como aplicativo no celular, se preferir!`;
    return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
  };
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [viewMode, setViewMode] = useState<"all" | "opportunities">("all");
  const [trackingInputs, setTrackingInputs] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    initialOrders.forEach(o => { init[o.id] = o.trackingCode || ""; });
    return init;
  });
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isPending, startTransition] = useTransition();

  const isOpportunity = (order: Order) => {
    if (order.status !== "pending") return false;
    const DOIS_HORAS_MS = 2 * 60 * 60 * 1000;
    return Date.now() - order.createdAt >= DOIS_HORAS_MS;
  };

  const filteredOrders = viewMode === "opportunities" ? orders.filter(isOpportunity) : orders;

  const handleToggleSelect = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

  const handleSelectAll = () => {
    if (selectedIds.size === filteredOrders.length) {
      setSelectedIds(newSet => new Set());
    } else {
      setSelectedIds(new Set(filteredOrders.map(o => o.id)));
    }
  };

  const handleOptimisticUpdate = (id: string, newStatus: OrderStatus, newTracking: string) => {
    // Atualização otimista local imediata
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus, trackingCode: newTracking } : o));
    
    // Executa no background sem travar a UI
    startTransition(async () => {
      const res = await updateOrderStatus(id, newStatus, newTracking);
      if (res.success) {
        toast.success(`Pedido atualizado!`);
      } else {
        toast.error("Erro ao salvar no banco. Atualize a página.");
      }
    });
  };

  const handleBulkStatusChange = (newStatus: OrderStatus) => {
    const idsToUpdate = Array.from(selectedIds);
    if (idsToUpdate.length === 0) return;

    // Atualização Otimista
    setOrders(prev => prev.map(o => idsToUpdate.includes(o.id) ? { ...o, status: newStatus } : o));
    setSelectedIds(new Set()); // Limpa a seleção

    startTransition(async () => {
      const res = await bulkUpdateOrders(idsToUpdate, newStatus);
      if (res.success) {
        toast.success(`${idsToUpdate.length} pedidos atualizados para ${newStatus}!`);
      } else {
        toast.error("Falha na atualização em lote.");
      }
    });
  };

  const handleChange = (id: string, field: "status" | "trackingCode", value: string) => {
    if (field === "trackingCode") {
      setTrackingInputs(prev => ({ ...prev, [id]: value }));
    } else if (field === "status") {
      // Quando muda o status no select, já disparamos a transição otimista
      const currentTracking = trackingInputs[id] || "";
      handleOptimisticUpdate(id, value as OrderStatus, currentTracking);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-10 pb-32">
      
      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-6 border-b-2 border-black gap-4">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-400 mb-2">Arsenal Hooke · Logística</p>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-black uppercase leading-none">
            Gestão de<br /><span className="opacity-20 font-light not-italic">Pedidos</span>
          </h1>
        </div>
        <Link
          href="/admin"
          className="self-start md:self-auto text-xs font-black tracking-widest border-2 border-black px-6 py-3 hover:bg-black hover:text-white transition-all shadow-[3px_3px_0px_rgba(0,0,0,1)] hover:shadow-none uppercase"
        >
          ← Radar
        </Link>
      </div>

      {/* ── Barra de Ações em Massa (Flutuante Opcional ou Fixa) ── */}
      <AnimatePresence>
        {selectedIds.size > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6 p-4 bg-black text-white flex items-center justify-between shadow-[8px_8px_0px_rgba(0,0,0,0.1)] border border-black"
          >
            <div className="flex items-center gap-3">
              <span className="bg-white text-black font-black w-6 h-6 flex items-center justify-center text-[10px]">
                {selectedIds.size}
              </span>
              <span className="text-xs font-black uppercase tracking-widest text-zinc-300">Selecionados</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mr-2 hidden md:block">Ações Lote:</span>
              <button onClick={() => handleBulkStatusChange("paid")} className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-[9px] font-black tracking-widest uppercase transition-colors">
                Marcar Pago
              </button>
              <button onClick={() => handleBulkStatusChange("sent")} className="px-3 py-1.5 bg-white text-black hover:bg-zinc-200 text-[9px] font-black tracking-widest uppercase transition-colors">
                Marcar Enviado
              </button>
              <button onClick={() => setSelectedIds(new Set())} className="ml-4 text-zinc-500 hover:text-white transition-colors">
                <X size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Abas Deslizantes Framer Motion ── */}
      <div className="relative flex gap-0 mb-10 border-2 border-black overflow-hidden w-full max-w-md shadow-[4px_4px_0px_rgba(0,0,0,1)]">
        {(["all", "opportunities"] as const).map((mode) => (
          <button
            key={mode}
            onClick={() => { setViewMode(mode); setSelectedIds(new Set()); }}
            className={`flex-1 py-4 px-4 text-[10px] font-black tracking-widest uppercase transition-all relative z-10 flex items-center justify-center gap-2 ${
              viewMode === mode ? "text-white" : "text-zinc-500 hover:text-black"
            }`}
          >
            {viewMode === mode && (
              <motion.div
                layoutId="tab-bg"
                className="absolute inset-0 bg-black z-[-1]"
                transition={{ type: "spring", stiffness: 400, damping: 35 }}
              />
            )}
            {mode === "opportunities" && <MessageCircle size={12} />}
            {mode === "all" ? "Todos os Pedidos" : `Oportunidades (${orders.filter(isOpportunity).length})`}
          </button>
        ))}
      </div>

      {/* ── Tabela de Pedidos ── */}
      <div className="border-2 border-black overflow-x-auto shadow-[4px_4px_0px_rgba(0,0,0,1)] relative bg-white">
        {isPending && (
          <div className="absolute top-0 left-0 w-full h-1 bg-zinc-100 overflow-hidden z-20">
            <div className="h-full bg-black w-1/3 animate-ping" />
          </div>
        )}
        <table className="w-full text-left border-collapse min-w-[950px]">
          <thead>
            <tr className="border-b-2 border-black bg-zinc-50">
              <th className="p-4 w-12 text-center">
                <button onClick={handleSelectAll} className="text-zinc-400 hover:text-black">
                  {selectedIds.size === filteredOrders.length && filteredOrders.length > 0 ? <CheckSquare size={16} className="text-black" /> : <Square size={16} />}
                </button>
              </th>
              {["ID / Data", "Cliente", "Itens", "Total / Pagto", "Status", "Rastreio", "Ação"].map((h) => (
                <th key={h} className="p-4 text-[10px] font-black tracking-widest text-black uppercase">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => {
              const dataFormatada = new Date(order.createdAt).toLocaleDateString("pt-BR", {
                day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit",
              });
              const currentTracking = trackingInputs[order.id] ?? order.trackingCode ?? "";
              const shipper = currentTracking.length >= 5 ? detectShipper(currentTracking) : null;
              const isSelected = selectedIds.has(order.id);

              return (
                <tr key={order.id} className={`border-b border-zinc-100 hover:bg-zinc-50 transition-colors ${isSelected ? 'bg-zinc-50' : ''}`}>
                  <td className="p-4 text-center align-middle">
                    <button onClick={() => handleToggleSelect(order.id)} className="text-zinc-300 hover:text-black transition-colors">
                      {isSelected ? <CheckSquare size={16} className="text-black" /> : <Square size={16} />}
                    </button>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col gap-1">
                      <span className="font-mono text-xs text-black font-bold max-w-[120px] truncate" title={order.id}>
                        {order.id.slice(0, 10)}...
                      </span>
                      <span className="text-[9px] text-zinc-400">{dataFormatada}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-bold text-black">{order.customer?.name || "Desconhecido"}</span>
                      {order.shippingZipcode && (
                        <span className="text-[9px] text-zinc-400 font-mono border border-zinc-200 px-1 py-0.5 w-fit mt-1">
                          CEP: {order.shippingZipcode}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-xs text-zinc-600">
                    <ul className="list-disc pl-4 space-y-0.5">
                      {order.items?.map((item, idx) => (
                        <li key={idx} className="truncate max-w-[180px]" title={item.title}>
                          {item.quantity}x {item.title} <span className="text-zinc-400">({item.size})</span>
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col gap-1.5">
                      <span className="text-sm font-black text-black">
                        {order.totalAmount ? order.totalAmount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) : "R$ 0,00"}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <select
                      value={order.status}
                      onChange={(e) => handleChange(order.id, "status", e.target.value)}
                      className="w-full bg-white border-2 border-black px-2 py-2 text-xs font-bold tracking-widest outline-none focus:ring-0 text-black mb-2"
                    >
                      <option value="pending">Pendente</option>
                      <option value="approved">Aprovado</option>
                      <option value="paid">Pago</option>
                      <option value="rejected">Recusado</option>
                      <option value="cancelled">Cancelado</option>
                      <option value="in_process">Em Análise</option>
                      <option value="sent">Enviado</option>
                      <option value="shipped">Postado</option>
                      <option value="abandoned_cart">Carrinho Abandonado</option>
                    </select>
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="p-4">
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={currentTracking}
                        onChange={(e) => handleChange(order.id, "trackingCode", e.target.value)}
                        onBlur={() => handleOptimisticUpdate(order.id, order.status, currentTracking)}
                        placeholder="Ex: BR123456BR"
                        className="w-full bg-white border-2 border-black px-3 py-2 text-xs font-mono focus:outline-none text-black"
                      />
                    </div>
                  </td>
                  <td className="p-4 align-middle">
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => handleOptimisticUpdate(order.id, order.status, currentTracking)}
                        className="bg-black hover:bg-zinc-800 text-white px-4 py-3 text-[9px] font-black tracking-widest uppercase transition-all w-full flex justify-center items-center gap-2 border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,0.3)] hover:shadow-none active:translate-x-0.5 active:translate-y-0.5"
                      >
                        <Save size={12} /> Salvar
                      </button>

                      {order.status === "abandoned_cart" && order.customer?.phone && (
                        <a
                          href={getWhatsAppRecoverLink(order)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-[#25D366] hover:bg-[#20bd5a] text-white px-4 py-3 text-[9px] font-black tracking-widest uppercase transition-all w-full flex justify-center items-center gap-2 border-2 border-[#25D366] shadow-[2px_2px_0px_rgba(37,211,102,0.3)] hover:shadow-none text-center"
                        >
                          <MessageCircle size={12} /> Recuperar
                        </a>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filteredOrders.length === 0 && (
          <div className="p-16 flex flex-col items-center justify-center text-center">
            <Package size={48} className="text-zinc-200 mb-4" />
            <p className="text-xs font-black tracking-widest text-zinc-400 uppercase">
              Nenhum pedido encontrado.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
