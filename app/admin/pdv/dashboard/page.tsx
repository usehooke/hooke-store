"use client";

import { usePDVStore } from "@/store/pdv-store";
import { 
 BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
 PieChart, Pie, Cell, Legend 
} from "recharts";
import { Package, TrendingUp, DollarSign, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function PDVDashboard() {
 const { offlineQueue } = usePDVStore();

 // Mock data for "Online" sales
 const onlineSalesTotal = 2450.00;
 const physicalSalesTotal = offlineQueue.reduce((acc, sale) => acc + sale.total, 0);

 const salesData = [
 { name: "Físico (PDV)", value: physicalSalesTotal },
 { name: "Online (Site)", value: onlineSalesTotal },
 ];

 const COLORS = ["#000000", "#6b7280"];

 // Mock data for top items
 const topItems = [
 { name: "Maverick Bege", sales: 12 },
 { name: "Oversized Black", sales: 8 },
 { name: "Vintage Fusca", sales: 5 },
 { name: "Regata Militar", sales: 3 },
 ];

 return (
 <div className="min-h-screen bg-hooke-50 text-hooke-900 font-sans p-6">
 <div className="max-w-7xl mx-auto">
 <header className="flex items-center justify-between mb-8">
 <div className="flex items-center gap-4">
 <Link href="/admin/pdv" className="p-3 shadow-neumorph rounded-full active:shadow-neumorph-inset">
 <ArrowLeft className="h-5 w-5" />
 </Link>
 <h1 className="text-2xl font-black tracking-tighter ">Fechamento de Caixa</h1>
 </div>
 <div className="text-xs font-bold text-hooke-500 ">
 {new Date().toLocaleDateString('pt-BR', { dateStyle: 'full' })}
 </div>
 </header>

 {/* Stats Grid */}
 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
 <div className="bg-hooke-50 p-6 shadow-neumorph text-center">
 <DollarSign className="h-6 w-6 mx-auto mb-2 text-hooke-500" />
 <p className="text-[10px] font-bold text-hooke-500 mb-1">Total Vendido</p>
 <p className="text-3xl font-black tracking-tighter">R$ {(physicalSalesTotal + onlineSalesTotal).toFixed(2)}</p>
 </div>
 <div className="bg-hooke-50 p-6 shadow-neumorph text-center">
 <TrendingUp className="h-6 w-6 mx-auto mb-2 text-hooke-500" />
 <p className="text-[10px] font-bold text-hooke-500 mb-1">Vendas PDV</p>
 <p className="text-3xl font-black tracking-tighter">R$ {physicalSalesTotal.toFixed(2)}</p>
 </div>
 <div className="bg-hooke-50 p-6 shadow-neumorph text-center">
 <Package className="h-6 w-6 mx-auto mb-2 text-hooke-500" />
 <p className="text-[10px] font-bold text-hooke-500 mb-1">Itens Saídos</p>
 <p className="text-3xl font-black tracking-tighter">
 {offlineQueue.reduce((acc, sale) => acc + sale.items.reduce((iAcc, item) => iAcc + item.quantity, 0), 0)}
 </p>
 </div>
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
 {/* Sales Mix Chart */}
 <div className="bg-hooke-50 p-8 shadow-neumorph">
 <h3 className="text-sm font-black tracking-widest mb-6">Mix de Vendas: Físico vs Online</h3>
 <div className="h-64">
 <ResponsiveContainer width="100%" height="100%">
 <PieChart>
 <Pie
 data={salesData}
 cx="50%"
 cy="50%"
 innerRadius={60}
 outerRadius={80}
 paddingAngle={5}
 dataKey="value"
 >
 {salesData.map((entry, index) => (
 <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
 ))}
 </Pie>
 <Tooltip />
 <Legend verticalAlign="bottom" height={36}/>
 </PieChart>
 </ResponsiveContainer>
 </div>
 </div>

 {/* Top Items Chart */}
 <div className="bg-hooke-50 p-8 shadow-neumorph">
 <h3 className="text-sm font-black tracking-widest mb-6">Top Itens do Dia</h3>
 <div className="h-64">
 <ResponsiveContainer width="100%" height="100%">
 <BarChart data={topItems} layout="vertical">
 <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" />
 <XAxis type="number" hide />
 <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 10, fontWeight: 'bold' }} />
 <Tooltip />
 <Bar dataKey="sales" fill="#000000" radius={[0, 4, 4, 0]} />
 </BarChart>
 </ResponsiveContainer>
 </div>
 </div>
 </div>
 </div>
 </div>
 );
}
