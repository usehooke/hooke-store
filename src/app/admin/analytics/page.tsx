"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, TrendingUp, Users, ShoppingCart, DollarSign, Eye, RefreshCw } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Toaster, toast } from 'sonner';
import { motion } from 'framer-motion';

// Tooltip brutalista premium com desfoque de fundo e sombra preta rígida
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="backdrop-blur-md bg-white/95 border-2 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-mono text-xs">
        <p className="font-black text-black mb-2 uppercase tracking-wider">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 mb-1.5 last:mb-0">
            <div className="w-3 h-3 border-2 border-black" style={{ backgroundColor: entry.payload.fill || entry.color || entry.stroke }} />
            <span className="text-zinc-600 font-bold uppercase tracking-tight">{entry.name}:</span>
            <span className="font-black text-black">
              {entry.name === 'Vendas' ? `R$ ${entry.value.toLocaleString('pt-BR')}` : entry.value.toLocaleString('pt-BR')}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};


export default function AdminAnalyticsPage() {
  const [period, setPeriod] = useState<'7d' | '30d' | '90d' | 'ytd'>('30d');
  const [isLoading, setIsLoading] = useState(false);

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Dados atualizados com sucesso!');
    } finally {
      setIsLoading(false);
    }
  };

  // Mock data para gráficos
  const salesData = [
    { month: 'Jan', vendas: 4000, visitantes: 2400 },
    { month: 'Fev', vendas: 3000, visitantes: 1398 },
    { month: 'Mar', vendas: 2000, visitantes: 9800 },
    { month: 'Abr', vendas: 2780, visitantes: 3908 },
    { month: 'Mai', vendas: 1890, visitantes: 4800 },
    { month: 'Jun', vendas: 2390, visitantes: 3800 },
  ];

  const categoryData = [
    { name: 'Camisetas', value: 45 },
    { name: 'Regatas', value: 25 },
    { name: 'Accessories', value: 20 },
    { name: 'Outros', value: 10 },
  ];

  const COLORS = ['#000000', '#404040', '#808080', '#C0C0C0'];

  return (
    <div className="min-h-screen bg-white pb-20">
      <Toaster position="bottom-right" theme="light" richColors />
      
      {/* Header */}
      <header className="border-b-2 border-black p-8">
        <Link href="/admin" className="flex items-center gap-2 text-zinc-400 hover:text-black transition-colors text-xs font-bold tracking-widest mb-6">
          <ArrowLeft size={14} /> Voltar ao Dashboard
        </Link>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl font-black tracking-tighter mb-2">Analytics</h1>
            <p className="text-zinc-500 text-sm">Insights detalhados de vendas, tráfego e comportamento.</p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="flex items-center gap-2 px-6 py-3 border-2 border-black text-xs font-black tracking-widest hover:bg-zinc-100 transition-colors disabled:opacity-50"
          >
            <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
            {isLoading ? 'Atualizando...' : 'Atualizar'}
          </button>
        </div>
      </header>

      {/* Period Filter */}
      <div className="flex border-b-2 border-black bg-white z-10">
        <button
          onClick={() => setPeriod('7d')}
          className={`px-6 py-4 text-xs font-black tracking-widest uppercase transition-all ${
            period === '7d' 
              ? 'bg-black text-white border-b-2 border-black' 
              : 'text-zinc-400 hover:text-black'
          }`}
        >
          Últimos 7 dias
        </button>
        <button
          onClick={() => setPeriod('30d')}
          className={`px-6 py-4 text-xs font-black tracking-widest uppercase transition-all ${
            period === '30d' 
              ? 'bg-black text-white border-b-2 border-black' 
              : 'text-zinc-400 hover:text-black'
          }`}
        >
          Últimos 30 dias
        </button>
        <button
          onClick={() => setPeriod('90d')}
          className={`px-6 py-4 text-xs font-black tracking-widest uppercase transition-all ${
            period === '90d' 
              ? 'bg-black text-white border-b-2 border-black' 
              : 'text-zinc-400 hover:text-black'
          }`}
        >
          Últimos 90 dias
        </button>
        <button
          onClick={() => setPeriod('ytd')}
          className={`px-6 py-4 text-xs font-black tracking-widest uppercase transition-all ${
            period === 'ytd' 
              ? 'bg-black text-white border-b-2 border-black' 
              : 'text-zinc-400 hover:text-black'
          }`}
        >
          Este Ano
        </button>
      </div>

      {/* Main Content */}
      <main className="p-8 md:p-16 max-w-7xl mx-auto space-y-12">
        
        {/* KPIs */}
        <section>
          <h2 className="text-2xl font-black tracking-tighter mb-6">Métricas Principais</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Receita Total */}
            <motion.div 
              whileHover={{ y: -6, scale: 1.01 }}
              transition={{ type: "spring", stiffness: 350, damping: 15 }}
              className="border-2 border-black p-6 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <span className="text-xs font-black uppercase tracking-widest text-zinc-400">Receita Total</span>
                <DollarSign size={18} className="text-zinc-400" />
              </div>
              <p className="text-3xl font-black tracking-tighter mb-2">R$ 45.890</p>
              <p className="text-xs font-bold text-green-600 flex items-center gap-1.5">
                <span className="inline-block animate-pulse w-2 h-2 rounded-full bg-green-500"></span>
                ↑ +12% vs. mês anterior
              </p>
            </motion.div>

            {/* Número de Vendas */}
            <motion.div 
              whileHover={{ y: -6, scale: 1.01 }}
              transition={{ type: "spring", stiffness: 350, damping: 15 }}
              className="border-2 border-black p-6 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <span className="text-xs font-black uppercase tracking-widest text-zinc-400">Total de Vendas</span>
                <ShoppingCart size={18} className="text-zinc-400" />
              </div>
              <p className="text-3xl font-black tracking-tighter mb-2">234</p>
              <p className="text-xs font-bold text-green-600 flex items-center gap-1.5">
                <span className="inline-block animate-pulse w-2 h-2 rounded-full bg-green-500"></span>
                ↑ +8% vs. mês anterior
              </p>
            </motion.div>

            {/* Visitantes Únicos */}
            <motion.div 
              whileHover={{ y: -6, scale: 1.01 }}
              transition={{ type: "spring", stiffness: 350, damping: 15 }}
              className="border-2 border-black p-6 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <span className="text-xs font-black uppercase tracking-widest text-zinc-400">Visitantes Únicos</span>
                <Users size={18} className="text-zinc-400" />
              </div>
              <p className="text-3xl font-black tracking-tighter mb-2">8.932</p>
              <p className="text-xs font-bold text-red-600 flex items-center gap-1.5">
                <span className="inline-block animate-pulse w-2 h-2 rounded-full bg-red-500"></span>
                ↓ -5% vs. mês anterior
              </p>
            </motion.div>

            {/* Taxa de Conversão */}
            <motion.div 
              whileHover={{ y: -6, scale: 1.01 }}
              transition={{ type: "spring", stiffness: 350, damping: 15 }}
              className="border-2 border-black p-6 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <span className="text-xs font-black uppercase tracking-widest text-zinc-400">Conversão</span>
                <TrendingUp size={18} className="text-zinc-400" />
              </div>
              <p className="text-3xl font-black tracking-tighter mb-2">2.62%</p>
              <p className="text-xs font-bold text-green-600 flex items-center gap-1.5">
                <span className="inline-block animate-pulse w-2 h-2 rounded-full bg-green-500"></span>
                ↑ +0.3% vs. mês anterior
              </p>
            </motion.div>
          </div>
        </section>

        {/* Charts */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Gráfico de Vendas vs Visitantes */}
          <div className="lg:col-span-2 border-2 border-black p-6 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h3 className="text-lg font-black tracking-tighter">Vendas vs Visitantes</h3>
                <p className="text-xs text-zinc-400 font-bold uppercase tracking-wider">Desempenho de tráfego e conversão de receita</p>
              </div>
              <div className="flex items-center gap-4 text-xs font-mono">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 bg-black border border-black rounded-sm"></span>
                  <span className="font-bold">VENDAS</span>
                </div>
                <div className="flex items-center gap-1.5 text-zinc-400">
                  <span className="w-3 h-3 bg-zinc-400 border border-zinc-400 rounded-sm"></span>
                  <span className="font-bold">VISITANTES</span>
                </div>
              </div>
            </div>
            
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={salesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#000000" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#000000" stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#808080" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#808080" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="2 2" stroke="#f4f4f5" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fill: '#71717a', fontSize: 10, fontWeight: 'bold', fontFamily: 'monospace' }} 
                  axisLine={{ stroke: '#000000', strokeWidth: 2 }}
                  tickLine={{ stroke: '#000000', strokeWidth: 2 }}
                />
                <YAxis 
                  tick={{ fill: '#71717a', fontSize: 10, fontWeight: 'bold', fontFamily: 'monospace' }} 
                  axisLine={{ stroke: '#000000', strokeWidth: 2 }}
                  tickLine={{ stroke: '#000000', strokeWidth: 2 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="vendas" 
                  stroke="#000000" 
                  strokeWidth={2.5} 
                  fillOpacity={1} 
                  fill="url(#colorSales)" 
                  name="Vendas"
                />
                <Area 
                  type="monotone" 
                  dataKey="visitantes" 
                  stroke="#808080" 
                  strokeWidth={2} 
                  fillOpacity={1} 
                  fill="url(#colorVisitors)" 
                  name="Visitantes"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Donut Chart Categorias */}
          <div className="border-2 border-black p-6 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="text-lg font-black tracking-tighter mb-2">Vendas por Categoria</h3>
            <p className="text-xs text-zinc-400 font-bold uppercase tracking-wider mb-6">Divisão do volume por tipo de peça</p>
            
            <div className="relative flex justify-center items-center h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[index % COLORS.length]} 
                        stroke="#000000" 
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              {/* Centro do Donut */}
              <div className="absolute text-center pointer-events-none">
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block mb-0.5">Foco</span>
                <span className="text-xl font-mono font-black text-black">TOP #1</span>
              </div>
            </div>
            
            {/* Legenda Customizada */}
            <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-zinc-100 font-mono text-[10px]">
              {categoryData.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 border border-black" style={{ backgroundColor: COLORS[index] }}></span>
                  <span className="font-bold text-zinc-700 truncate uppercase">{entry.name}</span>
                  <span className="font-black text-black ml-auto">{entry.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Top Produtos */}
        <section className="border-2 border-black p-6 bg-white">
          <h3 className="text-lg font-black tracking-tighter mb-6">Top 10 Produtos Mais Vendidos</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-black">
                  <th className="text-left py-3 px-4 font-black uppercase text-xs tracking-widest">Produto</th>
                  <th className="text-center py-3 px-4 font-black uppercase text-xs tracking-widest">Quantidade</th>
                  <th className="text-right py-3 px-4 font-black uppercase text-xs tracking-widest">Receita</th>
                  <th className="text-right py-3 px-4 font-black uppercase text-xs tracking-widest">% do Total</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'Camiseta Oversized Preta', qty: 42, revenue: 5880, percent: 12.8 },
                  { name: 'Regata Militar Verde', qty: 38, revenue: 5320, percent: 11.6 },
                  { name: 'Camiseta Vintage Fusca', qty: 35, revenue: 4900, percent: 10.7 },
                  { name: 'Oversized Off-White', qty: 32, revenue: 4480, percent: 9.8 },
                  { name: 'Hoodie Premium Black', qty: 28, revenue: 3920, percent: 8.5 },
                ].map((product, idx) => (
                  <tr key={idx} className="border-b border-black/10 hover:bg-zinc-50">
                    <td className="py-3 px-4 font-bold">{product.name}</td>
                    <td className="text-center py-3 px-4">{product.qty}</td>
                    <td className="text-right py-3 px-4 font-bold">R$ {product.revenue.toLocaleString('pt-BR')}</td>
                    <td className="text-right py-3 px-4 font-bold">{product.percent}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Relatórios */}
        <section className="border-2 border-black p-8 bg-zinc-50">
          <h3 className="text-lg font-black tracking-tighter mb-6 flex items-center gap-2">
            <Eye size={18} />
            Exportar Relatório
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="border-2 border-black p-4 bg-white hover:bg-black hover:text-white transition-all text-xs font-black tracking-widest uppercase">
              PDF Completo
            </button>
            <button className="border-2 border-black p-4 bg-white hover:bg-black hover:text-white transition-all text-xs font-black tracking-widest uppercase">
              CSV (Excel)
            </button>
            <button className="border-2 border-black p-4 bg-white hover:bg-black hover:text-white transition-all text-xs font-black tracking-widest uppercase">
              Email (Agendado)
            </button>
          </div>
        </section>

      </main>
    </div>
  );
}
