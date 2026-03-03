"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Order } from "@/types/order";
import { Package, Search, ChevronLeft, CreditCard } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

function MyOrdersContent() {
    const searchParams = useSearchParams();
    const rawEmail = searchParams.get("email") || "";
    const rawId = searchParams.get("id") || "";

    const [email, setEmail] = useState(rawEmail);
    const [phone, setPhone] = useState("");
    const [orderId, setOrderId] = useState(rawId);
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, "");
        if (value.length > 2) value = value.replace(/^(\d{2})(\d)/, "($1) $2");
        if (value.length > 9) value = value.replace(/(\d{5})(\d)/, "$1-$2");
        setPhone(value.substring(0, 15));
    };

    const digitsOnly = (str: string | undefined) => (str || "").replace(/\D/g, "");

    const formatter = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    });

    const fetchOrder = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!email || !orderId || phone.length < 14) {
            setError("Preencha o e-mail, telefone (com DDD) e o ID do pedido.");
            return;
        }

        setLoading(true);
        setError("");
        setOrder(null);

        try {
            const docRef = doc(db, "pedidos", orderId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data() as Order;
                const isEmailMatch = data.customer.email.toLowerCase().trim() === email.toLowerCase().trim();
                const isPhoneMatch = digitsOnly(data.customer.phone) === digitsOnly(phone);

                if (isEmailMatch && isPhoneMatch) {
                    setOrder(data);
                } else {
                    setError("As credenciais fornecidas não correspondem a este pedido.");
                }
            } else {
                setError("Pedido não encontrado. Verifique o ID informado.");
            }
        } catch (err) {
            console.error(err);
            setError("Falha ao buscar o pedido no servidor.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (rawEmail && rawId) {
            // Chamada direta segura para carga inicial baseada na URL
            const loadInitialOrder = async () => {
                setLoading(true);
                setError("");
                try {
                    const docRef = doc(db, "pedidos", rawId);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        const data = docSnap.data() as Order;
                        // Na busca inicial pela URL, só temos email e id
                        if (data.customer.email.toLowerCase().trim() === rawEmail.toLowerCase().trim()) {
                            // Se acessou pela URL mas não preencheu Wpp, avisamos ou carregamos? 
                            // O ideal é carregar para não quebrar o link de redirecionamento imediato do Mercado Pago.
                            setOrder(data);
                        } else {
                            setError("O e-mail da URL não corresponde ao pedido.");
                        }
                    } else {
                        setError("Pedido não encontrado. Verifique o ID informado.");
                    }
                } catch (err) {
                    console.error(err);
                    setError("Falha ao buscar o pedido.");
                } finally {
                    setLoading(false);
                }
            };
            loadInitialOrder();
        }
    }, [rawEmail, rawId]);

    const translateStatus = (status: string) => {
        const map: Record<string, string> = {
            'pending': 'Aguardando Pagamento',
            'approved': 'Pagamento Aprovado',
            'in_process': 'Em Análise',
            'rejected': 'Pagamento Recusado',
            'cancelled': 'Cancelado',
            'sent': 'Enviado (Em trânsito)',
        };
        return map[status] || status;
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans pt-32 pb-24">
            <div className="max-w-3xl mx-auto w-full px-4">

                <div className="mb-8">
                    <Link href="/" className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-hooke-500 hover:text-black transition-colors">
                        <ChevronLeft size={16} className="mr-1" />
                        Voltar à Loja
                    </Link>
                    <h1 className="text-4xl font-black uppercase tracking-tighter text-hooke-900 mt-4">Meus Pedidos</h1>
                    <p className="text-sm text-gray-500 mt-2">Acompanhe o status da sua compra de forma rápida.</p>
                </div>

                {/* BUSCA */}
                <div className="bg-white p-6 sm:p-8 border border-gray-200 shadow-sm mb-8">
                    <form onSubmit={fetchOrder} className="flex flex-col sm:flex-row gap-4 items-end">
                        <div className="w-full">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-hooke-900 block mb-2">E-mail de Compra</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full border border-gray-300 p-3 text-sm focus:outline-none focus:border-hooke-900 focus:ring-1 focus:ring-hooke-900 transition-all rounded-none"
                                placeholder="Seu e-mail..."
                            />
                        </div>
                        <div className="w-full">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-hooke-900 block mb-2">Seu WhatsApp</label>
                            <input
                                type="tel"
                                value={phone}
                                onChange={handlePhoneChange}
                                className="w-full border border-gray-300 p-3 text-sm focus:outline-none focus:border-hooke-900 focus:ring-1 focus:ring-hooke-900 transition-all rounded-none"
                                placeholder="(11) 90000-0000"
                            />
                        </div>
                        <div className="w-full">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-hooke-900 block mb-2">ID do Pedido</label>
                            <input
                                type="text"
                                value={orderId}
                                onChange={(e) => setOrderId(e.target.value)}
                                className="w-full border border-gray-300 p-3 text-sm focus:outline-none focus:border-hooke-900 focus:ring-1 focus:ring-hooke-900 transition-all rounded-none"
                                placeholder="hooke-123..."
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full sm:w-auto h-[46px] bg-hooke-900 text-white px-8 flex items-center justify-center font-bold uppercase tracking-widest text-xs hover:bg-black transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? "BUSCANDO..." : <><Search size={16} className="mr-2" /> RASTREAR</>}
                        </button>
                    </form>
                    {error && <p className="text-red-500 text-xs font-bold mt-4">{error}</p>}
                </div>

                {/* DETALHES DO PEDIDO */}
                {order && (
                    <div className="bg-white border border-hooke-900 shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="bg-hooke-900 text-white p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                                <p className="text-[10px] uppercase tracking-widest opacity-70 mb-1">Pedido</p>
                                <p className="font-mono text-sm sm:text-base">{order.id}</p>
                            </div>
                            <div className="text-left sm:text-right">
                                <p className="text-[10px] uppercase tracking-widest opacity-70 mb-1">Status Atual</p>
                                <div className="inline-flex items-center bg-white text-hooke-900 px-4 py-1 font-bold text-xs uppercase tracking-widest">
                                    <Package size={14} className="mr-2" />
                                    {translateStatus(order.status)}
                                </div>
                            </div>
                        </div>

                        <div className="p-6 sm:p-8">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8 pb-8 border-b border-gray-200">
                                {/* Cliente */}
                                <div>
                                    <h3 className="text-xs font-bold uppercase tracking-widest text-hooke-900 mb-4 border-l-2 border-hooke-900 pl-3">Dados do Cliente</h3>
                                    <p className="text-sm text-gray-800 font-medium">{order.customer.name}</p>
                                    <p className="text-sm text-gray-500">{order.customer.email}</p>
                                    {order.customer.document && <p className="text-sm text-gray-500 mt-1">Doc: {order.customer.document}</p>}
                                </div>

                                {/* Entrega */}
                                <div>
                                    <h3 className="text-xs font-bold uppercase tracking-widest text-hooke-900 mb-4 border-l-2 border-hooke-900 pl-3">Entrega</h3>
                                    <div className="flex flex-col text-sm text-gray-800">
                                        <span className="font-medium flex items-center mb-1">
                                            <Package size={16} className="mr-2 text-gray-400" />
                                            {order.shippingMethod ? order.shippingMethod.toUpperCase() : "Padrão"}
                                        </span>
                                        <span className="text-gray-500">CEP: {order.shippingZipcode || order.customer.address?.zip_code || "Não informado"}</span>
                                        {order.shippingValue !== undefined && order.shippingValue > 0 && (
                                            <span className="text-gray-500 font-medium mt-1">Valor: {formatter.format(order.shippingValue)}</span>
                                        )}
                                        {order.shippingValue === 0 && <span className="text-green-600 font-bold mt-1">Frete Grátis</span>}
                                    </div>
                                    {order.trackingCode && (
                                        <div className="mt-4 bg-green-50 border border-green-200 p-3">
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-green-800 mb-1">Código de Rastreio dos Correios</p>
                                            <p className="font-mono text-sm font-bold text-green-900">{order.trackingCode}</p>
                                        </div>
                                    )}
                                </div>

                                {/* Pagamento */}
                                <div>
                                    <h3 className="text-xs font-bold uppercase tracking-widest text-hooke-900 mb-4 border-l-2 border-hooke-900 pl-3">Pagamento</h3>
                                    <div className="flex items-center text-sm text-gray-800">
                                        <CreditCard size={16} className="mr-2 text-gray-400" />
                                        <span className="font-medium">{order.paymentMethod ? order.paymentMethod.toUpperCase() : "Aguardando..."}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Itens */}
                            <div>
                                <h3 className="text-xs font-bold uppercase tracking-widest text-hooke-900 mb-6">Resumo da Compra</h3>
                                <ul className="space-y-6">
                                    {order.items.map((item, idx) => (
                                        <li key={idx} className="flex gap-4">
                                            <div className="relative w-20 h-24 bg-gray-100 border border-gray-200 flex-shrink-0">
                                                {item.imageUrl ? (
                                                    <Image src={item.imageUrl} alt={item.title} fill className="object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                        <Package size={24} />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 flex flex-col justify-between">
                                                <div>
                                                    <p className="font-bold text-hooke-900 leading-tight">{item.title}</p>
                                                    <p className="text-xs text-gray-500 mt-1">Tam: {item.size} • Qtd: {item.quantity}</p>
                                                </div>
                                                <p className="font-bold text-hooke-900">{formatter.format(item.unit_price)}</p>
                                            </div>
                                            <div className="text-right flex items-end">
                                                <p className="font-black text-hooke-900">{formatter.format(item.unit_price * item.quantity)}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="bg-gray-50 p-6 sm:p-8 flex justify-between items-center border-t border-gray-200">
                            <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Total Gasto</p>
                            <p className="text-2xl font-black text-hooke-900">{formatter.format(order.totalAmount)}</p>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}

export default function MyOrdersPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-white">
                <p className="text-xs font-bold text-hooke-900 uppercase tracking-widest">Carregando painel...</p>
            </div>
        }>
            <MyOrdersContent />
        </Suspense>
    );
}
