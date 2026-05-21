"use client";

import { useEffect, useState, useMemo } from "react";
import { db, auth } from "@/lib/firebase";
import { collection, getDocs, doc, updateDoc, query, orderBy } from "firebase/firestore";
import { onAuthStateChanged, User } from "firebase/auth";
import { useRouter } from "next/navigation";
import { Order, OrderStatus } from "@/types/order";
import { Package, Save, MessageCircle, X, Crown, Wrench, Handshake, Copy, Check } from "lucide-react";
import Link from "next/link";
import { Toaster, toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

// ─── Analisador Semântico de Rastreio ───────────────────────────────────────
function detectShipper(code: string): { label: string; color: string; icon: string } | null {
  const c = code.trim().toUpperCase();
  // Correios: 2 letras + 9 dígitos + 2 letras (AA000000000BR)
  if (/^[A-Z]{2}\d{9}[A-Z]{2}$/.test(c)) {
    return { label: "Correios", color: "bg-blue-100 text-blue-800 border-blue-300", icon: "📫" };
  }
  // Jadlog: 14 dígitos numéricos
  if (/^\d{14}$/.test(c)) {
    return { label: "Jadlog", color: "bg-orange-100 text-orange-800 border-orange-300", icon: "🟠" };
  }
  // Total Express: começa com TE + números
  if (/^TE\d{10,}$/.test(c)) {
    return { label: "Total Express", color: "bg-purple-100 text-purple-800 border-purple-300", icon: "🟣" };
  }
  // Sequência genérica longa de dígitos (outros transportadores)
  if (/^\d{10,20}$/.test(c)) {
    return { label: "Transportadora", color: "bg-gray-100 text-gray-700 border-gray-300", icon: "📦" };
  }
  return null;
}

// ─── Gerador de Templates de Resgate ────────────────────────────────────────
function buildRescueTemplates(order: Order) {
  const firstName = order.customer?.name?.split(" ")[0] || "Cliente";
  const itemList = order.items.map((i) => `*${i.quantity}x ${i.title}* (tam. ${i.size})`).join(", ");
  const total = order.totalAmount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  // Detecta se tem camiseta/regata para personalizar o tom técnico
  const hasCamiseta = order.items.some(
    (i) =>
      i.title.toLowerCase().includes("camiseta") ||
      i.title.toLowerCase().includes("t-shirt") ||
      i.title.toLowerCase().includes("oversized")
  );
  const hasRegata = order.items.some(
    (i) => i.title.toLowerCase().includes("regata") || i.title.toLowerCase().includes("cropped")
  );

  const technicalHighlight = hasCamiseta
    ? "algodão heavyweight 260g com toque aveludado, caimento boxy estruturado e etiqueta Woven tecida em alta definição"
    : hasRegata
    ? "blend premium de algodão + elastano com cavas anatômicas e logo termocolante de alta fixação"
    : "tecidos premium de alta gramatura, acabamento peletizado soft e costuras reforçadas de dupla agulha";

  return {
    vip: `Fala ${firstName}! 🖤\n\nVi aqui que você deixou as peças ${itemList} no carrinho — e olha, essas peças estão nas últimas unidades. Não quero que você perca.\n\nSe quiser garantir agora, seu total é de ${total}. Posso reservar por 24h pra você. É só me confirmar aqui! 👊`,

    technical: `Oi ${firstName}, tudo bem?\n\nEsqueci de te contar sobre o que você separou: ${itemList}.\n\nO que torna essas peças especiais é o ${technicalHighlight}. É o tipo de produto que dura 2, 3 anos e só melhora com o uso.\n\nSe tiver alguma dúvida sobre tamanho ou tecido, pode perguntar. Aqui estou! 💪`,

    relational: `Ei ${firstName}! Fernando da Hooke aqui 👋\n\nAcompanho cada pedido aqui e notei que você montou um carrinho maneiro com ${itemList}, mas não finalizou.\n\nRolou alguma dificuldade? Pode ser no frete, no pagamento... Qualquer coisa, me fala aqui que a gente resolve juntos. Não vou te deixar na mão. 🤝`,
  };
}

// ─── Modal Central de Resgate ────────────────────────────────────────────────
function RescueModal({ order, onClose }: { order: Order; onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<"vip" | "technical" | "relational">("vip");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const templates = useMemo(() => buildRescueTemplates(order), [order]);

  const tabs = [
    { key: "vip" as const, label: "Tom VIP", icon: <Crown size={14} />, sublabel: "Escassez & Urgência" },
    { key: "technical" as const, label: "Tom Técnico", icon: <Wrench size={14} />, sublabel: "Diferenciais do Produto" },
    { key: "relational" as const, label: "Fernando Hooke", icon: <Handshake size={14} />, sublabel: "Relacional & Pessoal" },
  ];

  const activeTemplate = templates[activeTab];

  const handleCopy = async (key: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      toast.success("Mensagem copiada para a área de transferência!");
      setTimeout(() => setCopiedKey(null), 2000);
    } catch {
      toast.error("Falha ao copiar. Selecione o texto manualmente.");
    }
  };

  const handleWhatsApp = (text: string) => {
    if (!order.customer.phone) {
      toast.error("Telefone não informado neste pedido.");
      return;
    }
    const cleanPhone = order.customer.phone.replace(/\D/g, "");
    window.open(`https://wa.me/55${cleanPhone}?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="w-full max-w-2xl bg-white border-2 border-black shadow-[8px_8px_0px_rgba(0,0,0,1)] overflow-hidden"
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header do Modal */}
          <div className="flex items-center justify-between p-6 border-b-2 border-black bg-black text-white">
            <div>
              <h2 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                <MessageCircle size={16} /> Central de Resgate Inteligente
              </h2>
              <p className="text-[10px] text-zinc-400 mt-1 uppercase tracking-widest">
                {order.customer.name} · {order.items.length} {order.items.length === 1 ? "item" : "itens"} no carrinho
              </p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-zinc-800 transition-colors rounded-none">
              <X size={18} />
            </button>
          </div>

          {/* Abas dos 3 Toms */}
          <div className="flex border-b-2 border-black relative">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 py-4 px-3 text-center transition-all relative ${
                  activeTab === tab.key ? "bg-white text-black" : "bg-zinc-50 text-zinc-400 hover:bg-zinc-100"
                }`}
              >
                {activeTab === tab.key && (
                  <motion.div
                    layoutId="rescue-tab-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-black"
                  />
                )}
                <div className="flex flex-col items-center gap-1">
                  <span className={activeTab === tab.key ? "text-black" : "text-zinc-400"}>{tab.icon}</span>
                  <span className="text-[9px] font-black uppercase tracking-widest">{tab.label}</span>
                  <span className="text-[8px] text-zinc-400 hidden sm:block">{tab.sublabel}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Conteúdo do Template Ativo */}
          <div className="p-6 space-y-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.15 }}
              >
                <textarea
                  className="w-full min-h-[200px] p-5 border-2 border-black font-mono text-xs leading-relaxed bg-zinc-50 focus:outline-none focus:bg-white transition-colors resize-none shadow-[3px_3px_0px_rgba(0,0,0,1)]"
                  value={activeTemplate}
                  readOnly
                />
              </motion.div>
            </AnimatePresence>

            <div className="flex gap-3">
              <button
                onClick={() => handleCopy(activeTab, activeTemplate)}
                className="flex-1 flex items-center justify-center gap-2 py-4 border-2 border-black bg-white hover:bg-zinc-100 text-[10px] font-black uppercase tracking-widest shadow-[3px_3px_0px_rgba(0,0,0,1)] hover:shadow-none active:translate-x-0.5 active:translate-y-0.5 transition-all"
              >
                {copiedKey === activeTab ? (
                  <>
                    <Check size={13} className="text-green-600" /> Copiado!
                  </>
                ) : (
                  <>
                    <Copy size={13} /> Copiar Mensagem
                  </>
                )}
              </button>
              <button
                onClick={() => handleWhatsApp(activeTemplate)}
                className="flex-1 flex items-center justify-center gap-2 py-4 border-2 border-black bg-green-500 hover:bg-green-600 text-white text-[10px] font-black uppercase tracking-widest shadow-[3px_3px_0px_rgba(0,0,0,1)] hover:shadow-none active:translate-x-0.5 active:translate-y-0.5 transition-all"
              >
                <MessageCircle size={13} /> Enviar via WhatsApp
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Componente Principal ────────────────────────────────────────────────────
export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [viewMode, setViewMode] = useState<"all" | "opportunities">("all");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [rescueOrder, setRescueOrder] = useState<Order | null>(null);
  // Estado local para edição de rastreio (para mostrar badge instantâneo)
  const [trackingInputs, setTrackingInputs] = useState<Record<string, string>>({});
  const router = useRouter();

  useEffect(() => {
    const fireauth = auth;
    if (!fireauth) return;
    const unsubscribe = onAuthStateChanged(fireauth, (currentUser) => {
      if (!currentUser) router.push("/login");
      else {
        setUser(currentUser);
        fetchOrders();
      }
    });
    return () => unsubscribe();
  }, [router]);

  async function fetchOrders() {
    const firestore = db;
    if (!firestore) { setLoading(false); return; }
    try {
      const q = query(collection(firestore, "pedidos"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      const data: Order[] = [];
      snap.forEach((d) => data.push(d.data() as Order));
      setOrders(data);
      // Inicializa inputs de rastreio com valores do banco
      const initialInputs: Record<string, string> = {};
      data.forEach((o) => { initialInputs[o.id] = o.trackingCode || ""; });
      setTrackingInputs(initialInputs);
    } catch (err) {
      console.error(err);
      toast.error("Falha ao carregar pedidos.");
    } finally {
      setLoading(false);
    }
  }

  const handleUpdateOrder = async (orderId: string, novoStatus: OrderStatus, novoRastreio: string) => {
    const firestore = db;
    if (!firestore) { toast.error("Banco de dados offline."); return; }
    setSavingId(orderId);
    try {
      await updateDoc(doc(firestore, "pedidos", orderId), {
        status: novoStatus,
        trackingCode: novoRastreio,
        updatedAt: Date.now(),
      });
      toast.success(`Pedido ${orderId.slice(0, 8)}... atualizado!`);
    } catch {
      toast.error("Erro ao atualizar pedido.");
    } finally {
      setSavingId(null);
    }
  };

  const handleChange = (id: string, field: "status" | "trackingCode", value: string) => {
    if (field === "trackingCode") {
      setTrackingInputs((prev) => ({ ...prev, [id]: value }));
    }
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, [field]: value } : o)));
  };

  const handleWhatsAppNotify = (order: Order) => {
    if (!order.customer.phone || !order.trackingCode) {
      toast.error("Telefone ou Código de Rastreio não informados.");
      return;
    }
    const firstName = order.customer.name.split(" ")[0];
    const msg = `Fala ${firstName}, Fernando da Hooke aqui! Sua ordem ${order.id.slice(0, 8)} foi postada. Segue o rastro: ${order.trackingCode}. Qualquer coisa me chama! 👊`;
    const cleanPhone = order.customer.phone.replace(/\D/g, "");
    window.open(`https://wa.me/55${cleanPhone}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const isOpportunity = (order: Order) => {
    if (order.status !== "pending") return false;
    const DOIS_HORAS_MS = 2 * 60 * 60 * 1000;
    return Date.now() - order.createdAt >= DOIS_HORAS_MS;
  };

  const filteredOrders = viewMode === "opportunities" ? orders.filter(isOpportunity) : orders;

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
    };
    const s = map[status] ?? { cls: "bg-gray-100 text-gray-600 border-gray-200", label: status };
    return (
      <span className={`px-2 py-1 text-[9px] font-black tracking-widest border rounded-none uppercase ${s.cls}`}>
        {s.label}
      </span>
    );
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white font-sans">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-black uppercase tracking-widest text-zinc-400">Carregando painel logístico...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans pb-24">
      <Toaster position="top-right" richColors />

      {/* Modal de Resgate Inteligente */}
      {rescueOrder && <RescueModal order={rescueOrder} onClose={() => setRescueOrder(null)} />}

      <div className="max-w-7xl mx-auto p-6 md:p-10">

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
            ← Produtos
          </Link>
        </div>

        {/* ── Abas Deslizantes Framer Motion ── */}
        <div className="relative flex gap-0 mb-10 border-2 border-black overflow-hidden w-full max-w-md shadow-[4px_4px_0px_rgba(0,0,0,1)]">
          {(["all", "opportunities"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
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
        <div className="border-2 border-black overflow-x-auto shadow-[4px_4px_0px_rgba(0,0,0,1)]">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="border-b-2 border-black bg-zinc-50">
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

                return (
                  <tr key={order.id} className="border-b border-zinc-100 hover:bg-zinc-50 transition-colors">
                    <td className="p-4">
                      <div className="flex flex-col gap-1">
                        <span className="font-mono text-xs text-black font-bold max-w-[120px] truncate" title={order.id}>
                          {order.id.slice(0, 10)}...
                        </span>
                        <span className="text-[9px] text-zinc-400">{dataFormatada}</span>
                        {isOpportunity(order) && (
                          <span className="text-[8px] bg-amber-100 text-amber-700 border border-amber-300 px-1.5 py-0.5 font-black uppercase tracking-widest w-fit">
                            ⚡ Oportunidade
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-bold text-black">{order.customer?.name || "Cliente Desconhecido"}</span>
                        <span className="text-xs text-zinc-400">{order.customer?.email || "Sem e-mail"}</span>
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
                        {order.paymentMethod && (
                          <span className="text-[9px] bg-zinc-100 px-2 py-0.5 font-bold uppercase tracking-widest w-fit">
                            {order.paymentMethod}
                          </span>
                        )}
                        {order.shippingMethod && (
                          <span className="text-[9px] text-zinc-400 font-bold tracking-widest">{order.shippingMethod}</span>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <label htmlFor={`status-${order.id}`} className="sr-only">Status</label>
                      <select
                        id={`status-${order.id}`}
                        value={order.status}
                        onChange={(e) => handleChange(order.id, "status", e.target.value)}
                        className="w-full bg-white border-2 border-black px-2 py-2 text-xs font-bold tracking-widest outline-none focus:ring-0 text-black mb-2"
                      >
                        <option value="pending">Pendente (MP)</option>
                        <option value="approved">Aprovado (MP)</option>
                        <option value="paid">Pago (Confirmado)</option>
                        <option value="rejected">Recusado (MP)</option>
                        <option value="cancelled">Cancelado</option>
                        <option value="in_process">Em Análise (MP)</option>
                        <option value="sent">Enviado (Logística)</option>
                        <option value="shipped">Postado (Rastreio)</option>
                      </select>
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="p-4">
                      {/* Campo de rastreio com badge semântico automático */}
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={currentTracking}
                          onChange={(e) => handleChange(order.id, "trackingCode", e.target.value)}
                          placeholder="Ex: BR123456789BR"
                          className="w-full bg-white border-2 border-black px-3 py-2 text-xs font-mono focus:outline-none text-black"
                        />
                        <AnimatePresence>
                          {shipper && (
                            <motion.span
                              initial={{ opacity: 0, y: -4 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -4 }}
                              className={`inline-flex items-center gap-1.5 px-2 py-1 text-[9px] font-black uppercase tracking-widest border ${shipper.color}`}
                            >
                              {shipper.icon} {shipper.label}
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </div>
                    </td>
                    <td className="p-4 align-middle">
                      <div className="flex flex-col gap-2 min-w-[110px]">
                        {/* Salvar */}
                        <button
                          onClick={() => handleUpdateOrder(order.id, order.status, currentTracking)}
                          disabled={savingId === order.id}
                          className="bg-black hover:bg-zinc-800 text-white px-4 py-3 text-[9px] font-black tracking-widest uppercase transition-all disabled:opacity-50 flex items-center justify-center gap-2 border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,0.3)] hover:shadow-none active:translate-x-0.5 active:translate-y-0.5 w-full"
                        >
                          {savingId === order.id ? (
                            <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <><Save size={12} /> Salvar</>
                          )}
                        </button>

                        {/* Notificar Rastreio (aba: todos) */}
                        {order.trackingCode && order.customer?.phone && viewMode === "all" && (
                          <button
                            onClick={() => handleWhatsAppNotify(order)}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 text-[9px] font-black tracking-widest uppercase transition-all flex items-center justify-center gap-2 border-2 border-green-700 w-full"
                          >
                            <MessageCircle size={12} /> Avisar
                          </button>
                        )}

                        {/* Botão Resgatar → abre Modal */}
                        {viewMode === "opportunities" && order.customer?.phone && (
                          <button
                            onClick={() => setRescueOrder(order)}
                            className="bg-amber-400 hover:bg-amber-500 text-black px-4 py-3 text-[9px] font-black tracking-widest uppercase transition-all flex items-center justify-center gap-2 border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:shadow-none active:translate-x-0.5 active:translate-y-0.5 w-full"
                          >
                            <MessageCircle size={12} /> Resgatar
                          </button>
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
                {viewMode === "opportunities" ? "Nenhuma oportunidade no momento." : "Nenhum pedido registrado."}
              </p>
              <p className="text-[10px] text-zinc-300 mt-2">
                {viewMode === "opportunities"
                  ? "Carrinhos pendentes com mais de 2h aparecerão aqui."
                  : "Os pedidos sincronizados com Mercado Pago aparecerão aqui."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
