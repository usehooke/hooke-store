"use client";

import { useEffect, useState } from "react";
import { db, auth } from "@/lib/firebase";
import { collection, getDocs, doc, updateDoc, query, orderBy } from "firebase/firestore";
import { onAuthStateChanged, User } from "firebase/auth";
import { useRouter } from "next/navigation";
import { Order, OrderStatus } from "@/types/order";
import { Package, Save, MessageCircle } from "lucide-react";
import Link from "next/link";
import { Toaster, toast } from "sonner";

export default function AdminOrdersPage() {
 const [orders, setOrders] = useState<Order[]>([]);
 const [viewMode, setViewMode] = useState<'all' | 'opportunities'>('all');
 const [loading, setLoading] = useState(true);
 const [user, setUser] = useState<User | null>(null);
 const [savingId, setSavingId] = useState<string | null>(null);
 const router = useRouter();

 useEffect(() => {
 // Blindagem de Auth
 if (!auth) return;

 const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
 if (!currentUser) router.push("/login");
 else {
 setUser(currentUser);
 fetchOrders();
 }
 });
 return () => unsubscribe();
 }, [router]);

 async function fetchOrders() {
 // Blindagem de DB (Short-Circuit)
 if (!db) {
    setLoading(false);
    return;
 }

 try {
  const ordersRef = collection(db, "pedidos");
  const q = query(ordersRef, orderBy("createdAt", "desc"));
  const querySnapshot = await getDocs(q);
  const ordersData: Order[] = [];

  querySnapshot.forEach((doc) => {
  ordersData.push(doc.data() as Order);
  });

  setOrders(ordersData);
 } catch (error) {
  console.error("Erro ao buscar pedidos:", error);
  toast.error("Falha ao carregar pedidos.");
 } finally {
  setLoading(false);
 }
 }

 const handleUpdateOrder = async (orderId: string, novoStatus: OrderStatus, novoRastreio: string) => {
  if (!db) return;

  setSavingId(orderId);
  try {
  const orderRef = doc(db, "pedidos", orderId);
  await updateDoc(orderRef, {
  status: novoStatus,
  trackingCode: novoRastreio,
  updatedAt: Date.now()
  });
  toast.success(`Pedido ${orderId} atualizado!`);
  } catch (error) {
  console.error("Erro ao atualizar pedido:", error);
  toast.error("Erro ao atualizar pedido.");
  } finally {
  setSavingId(null);
  }
 };

 const handleChange = (id: string, field: "status" | "trackingCode", value: string) => {
  setOrders((prev) =>
  prev.map((o) => (o.id === id ? { ...o, [field]: value } : o))
  );
 };

 const handleWhatsAppNotify = (order: Order) => {
  if (!order.customer.phone || !order.trackingCode) {
  toast.error("Telefone ou Código de Rastreio não informados.");
  return;
  }

  const firstName = order.customer.name.split(" ")[0];
  const msg = `Fala ${firstName}, Fernando da Hooke aqui! Sua ordem ${order.id} foi postada. Segue o rastro: ${order.trackingCode}. Tmj!`;

  const encodedMsg = encodeURIComponent(msg);
  const cleanPhone = order.customer.phone.replace(/\D/g, "");

  // Prefixo 55 garantindo o código do país caso a pessoa digite só (11) 90000...
  const url = `https://wa.me/55${cleanPhone}?text=${encodedMsg}`;
  window.open(url, '_blank');
 };

 const handleRescueCart = (order: Order) => {
  if (!order.customer.phone) {
  toast.error("Telefone não informado neste checkout.");
  return;
  }

  const firstName = order.customer.name.split(" ")[0];
  const msg = `Fala ${firstName}, Nando da Hooke Store aqui! Vi que você montou um carrinho irado no nosso site com as peças (${order.items.map(i => i.title).join(', ')}), mas faltou alguma coisa pra você finalizar a compra?\n\nConseguiu simular o frete direitinho ou rolou algum bug na hora de pagar? Posso te ajudar por aqui! 👊`;

  const encodedMsg = encodeURIComponent(msg);
  const cleanPhone = order.customer.phone.replace(/\D/g, "");
  const url = `https://wa.me/55${cleanPhone}?text=${encodedMsg}`;
  window.open(url, '_blank');
 };

 // Função que define se um carrinho virou oportunidade (Pendente e criado há mais de 2h)
 const isOpportunity = (order: Order) => {
  if (order.status !== 'pending') return false;

  // 2 horas em milissegundos
  const DOIS_HORAS_MS = 2 * 60 * 60 * 1000;
  const passedTime = Date.now() - order.createdAt;

  return passedTime >= DOIS_HORAS_MS;
 };

 // Filtragem local baseada no viewMode
 const filteredOrders = viewMode === 'opportunities'
  ? orders.filter(isOpportunity)
  : orders;

  const StatusBadge = ({ status }: { status: OrderStatus }) => {
  const colors = {
  'pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'approved': 'bg-green-100 text-green-800 border-green-200',
  'in_process': 'bg-blue-100 text-blue-800 border-blue-200',
  'rejected': 'bg-red-100 text-red-800 border-red-200',
  'cancelled': 'bg-gray-100 text-gray-800 border-gray-200',
  'sent': 'bg-hooke-900 text-white border-hooke-900',
  };
  const labels = {
  'pending': 'Pendente',
  'approved': 'Aprovado',
  'in_process': 'Em Análise',
  'rejected': 'Recusado',
  'cancelled': 'Cancelado',
  'sent': 'Enviado',
  };
  return (
  <span className={`px-2 py-1 text-[10px] font-bold tracking-widest border rounded-none ${colors[status]}`}>
  {labels[status] || status}
  </span>
  );
  };

  if (loading || !user) {
  return (
  <div className="min-h-screen flex items-center justify-center bg-white font-sans">
  <p className="text-hooke-900 font-bold tracking-widest text-xs">Carregando painel de pedidos...</p>
  </div>
  );
  }

  return (
  <div className="min-h-screen bg-white p-8 font-sans pb-24">
  <Toaster position="top-right" richColors />
  <div className="max-w-7xl mx-auto">

  {/* Cabeçalho e Navegação */}
  <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 border-b border-hooke-900 pb-6 gap-4">
  <div>
  <h1 className="text-3xl font-black tracking-tighter text-hooke-900">Gestão de Pedidos</h1>
  <p className="text-xs tracking-widest text-gray-400 mt-2">Visão geral logística</p>
  </div>
  <div className="flex items-center gap-4">
  <Link
  href="/admin"
  className="text-xs font-bold tracking-widest text-hooke-900 hover:text-white transition-colors border border-hooke-900 px-6 py-3 hover:bg-hooke-900 rounded-none bg-white"
  >
  Ver Produtos
  </Link>
  </div>
  </div>

  {/* Filtros de Visualização (Toggle) */}
  <div className="flex gap-4 mb-8">
  <button
  onClick={() => setViewMode('all')}
  className={`text-xs font-bold tracking-widest px-6 py-3 transition-colors rounded-none border ${viewMode === 'all' ? 'bg-hooke-900 text-white border-hooke-900' : 'bg-transparent text-gray-500 border-gray-200 hover:border-gray-400'}`}
  >
  Todos os Pedidos
  </button>
  <button
  onClick={() => setViewMode('opportunities')}
  className={`text-xs font-bold tracking-widest px-6 py-3 transition-colors rounded-none border flex items-center gap-2 ${viewMode === 'opportunities' ? 'bg-green-600 text-white border-green-600' : 'bg-transparent text-gray-500 border-gray-200 hover:border-gray-400'}`}
  >
  <MessageCircle size={14} /> Oportunidades (Resgate)
  </button>
  </div>

  {/* Tabela de Pedidos */}
  <div className="bg-white border border-hooke-900 overflow-x-auto rounded-none">
  <table className="w-full text-left border-collapse min-w-[900px]">
  <thead>
  <tr className="border-b border-hooke-900 bg-gray-50">
  <th className="p-4 text-xs font-bold tracking-widest text-hooke-900">ID / Data</th>
  <th className="p-4 text-xs font-bold tracking-widest text-hooke-900">Cliente</th>
  <th className="p-4 text-xs font-bold tracking-widest text-hooke-900 w-[20%]">Itens</th>
  <th className="p-4 text-xs font-bold tracking-widest text-hooke-900">Total / Pagto</th>
  <th className="p-4 text-xs font-bold tracking-widest text-hooke-900 min-w-[150px]">Status</th>
  <th className="p-4 text-xs font-bold tracking-widest text-hooke-900 min-w-[200px]">Rastreio</th>
  <th className="p-4 text-xs font-bold tracking-widest text-hooke-900 text-right">Ação</th>
  </tr>
  </thead>
  <tbody>
  {filteredOrders.map((order) => {
  const dataFormatada = new Date(order.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  return (
  <tr key={order.id} className={`border-b border-gray-200 last:border-0 hover:bg-gray-50 transition-colors`}>
  <td className="p-4">
  <div className="flex flex-col gap-1">
  <span className="font-mono text-xs text-hooke-900 font-bold max-w-[120px] truncate" title={order.id}>{order.id}</span>
  <span className="text-[10px] text-gray-500 ">{dataFormatada}</span>
  </div>
  </td>
  <td className="p-4">
  <div className="flex flex-col gap-1">
  <span className="text-sm font-bold text-hooke-900">{order.customer.name}</span>
  <span className="text-xs text-gray-500">{order.customer.email}</span>
  {order.shippingZipcode && <span className="text-[10px] text-gray-400 font-mono mt-1 border border-gray-200 px-1 py-0.5 w-fit">CEP: {order.shippingZipcode}</span>}
  </div>
  </td>
  <td className="p-4 text-xs text-gray-600">
  <ul className="list-disc pl-4">
  {order.items.map((item, idx) => (
  <li key={idx} className="truncate" title={item.title}>
  {item.quantity}x {item.title} ({item.size})
  </li>
  ))}
  </ul>
  </td>
  <td className="p-4">
  <div className="flex flex-col gap-1 items-start">
  <span className="text-sm font-black text-hooke-900">
  {order.totalAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
  </span>
  {order.paymentMethod && <span className="text-[10px] bg-gray-200 px-2 py-0.5 mt-1">{order.paymentMethod}</span>}
  {order.shippingMethod && <span className="text-[10px] text-hooke-500 mt-1 font-bold tracking-widest">{order.shippingMethod}</span>}
  </div>
  </td>
  <td className="p-4">
  <select
  value={order.status}
  onChange={(e) => handleChange(order.id, "status", e.target.value)}
  className="w-full bg-white border border-gray-300 rounded-none px-2 py-2 text-xs font-bold tracking-widest focus:ring-1 focus:ring-hooke-900 focus:border-hooke-900 outline-none transition-all text-hooke-900"
  >
  <option value="pending">Pendente (MP)</option>
  <option value="approved">Aprovado (MP)</option>
  <option value="rejected">Recusado (MP)</option>
  <option value="cancelled">Cancelado (MP)</option>
  <option value="in_process">Em Análise (MP)</option>
  <option value="sent">Enviado (Manual)</option>
  </select>
  <div className="mt-2 text-left">
  <StatusBadge status={order.status} />
  </div>
  </td>
  <td className="p-4">
  <input
  type="text"
  value={order.trackingCode || ""}
  onChange={(e) => handleChange(order.id, "trackingCode", e.target.value)}
  placeholder="Ex: BR123456789"
  className="w-full bg-white border border-gray-300 rounded-none px-3 py-2 text-xs focus:ring-1 focus:ring-hooke-900 focus:border-hooke-900 outline-none transition-all text-hooke-900 font-mono"
  />
  </td>
  <td className="p-4 text-right align-middle">
  <div className="flex flex-col gap-2 w-full">
  <button
  onClick={() => handleUpdateOrder(order.id, order.status, order.trackingCode || "")}
  disabled={savingId === order.id}
  className="bg-hooke-900 hover:bg-black text-white px-4 py-3 rounded-none text-[10px] font-bold tracking-widest transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 w-full"
  >
  {savingId === order.id ? "Salvando" : <><Save size={14} /> Salvar</>}
  </button>

  {order.trackingCode && order.customer.phone && viewMode === 'all' && (
  <button
  onClick={() => handleWhatsAppNotify(order)}
  className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-none text-[10px] font-bold tracking-widest transition-colors flex items-center justify-center gap-2 w-full"
  title="Avisar cliente via WhatsApp"
  >
  <MessageCircle size={14} /> Avisar Base
  </button>
  )}

  {/* Botão de Resgate de Carrinho */}
  {viewMode === 'opportunities' && order.customer.phone && (
  <button
  onClick={() => handleRescueCart(order)}
  className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-none text-[10px] font-bold tracking-widest transition-colors flex items-center justify-center gap-2 w-full animate-pulse"
  title="Chamar cliente no WhatsApp"
  >
  <MessageCircle size={14} /> RESGATAR
  </button>
  )}
  </div>
  </td>
  </tr>
  )
  })}
  </tbody>
  </table>
  {filteredOrders.length === 0 && (
  <div className="p-16 flex flex-col items-center justify-center text-center">
  <Package size={48} className="text-gray-200 mb-4" />
  <p className="text-xs font-bold tracking-widest text-gray-400">
  {viewMode === 'opportunities' ? "Nenhuma oportunidade presa no checkout." : "Nenhum pedido registrado ainda."}
  </p>
  <p className="text-[10px] text-gray-400 mt-2">
  {viewMode === 'opportunities' ? "Os carrinhos pendentes com mais de 2h de idade aparecerão aqui." : "Os pedidos aparecerão aqui sincronizados com o Mercado Pago."}
  </p>
  </div>
  )}
  </div>
  </div>
  </div>
 );
}
