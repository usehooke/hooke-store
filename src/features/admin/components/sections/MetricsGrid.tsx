"use client";

import { motion } from "framer-motion";
import { ShoppingBag, TrendingUp, Package, Zap } from "lucide-react";

interface MetricsGridProps {
  ordersToday: number;
  revenueToday: number;
  ordersInProgress: number;
}

export default function MetricsGrid({ ordersToday, revenueToday, ordersInProgress }: MetricsGridProps) {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  const metrics = [
    {
      label: "Faturamento Hoje",
      value: formatCurrency(revenueToday),
      icon: TrendingUp,
      trend: "Performance Live",
      trendColor: "text-emerald-500",
      bgIcon: TrendingUp,
    },
    {
      label: "Pedidos Novos",
      value: ordersToday,
      icon: ShoppingBag,
      trend: "+8% vs Méd.",
      trendColor: "text-zinc-400",
      bgIcon: ShoppingBag,
    },
    {
      label: "Em Andamento",
      value: ordersInProgress,
      icon: Package,
      trend: "Logística Ativa",
      trendColor: "text-zinc-600",
      bgIcon: Zap,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {metrics.map((metric, idx) => (
        <motion.div
          key={metric.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="bg-white border border-black/[0.05] p-12 relative overflow-hidden group hover:shadow-2xl hover:shadow-black/[0.02] transition-all"
        >
          <div className="relative z-10">
            <div className="flex justify-between items-center mb-10">
              <div className="p-3 bg-zinc-50 border border-black/[0.03] text-zinc-900">
                <metric.icon size={20} strokeWidth={1.5} />
              </div>
              <span className={`text-[10px] font-black px-3 py-1 uppercase tracking-tighter italic ${metric.trendColor} bg-zinc-50 border border-black/[0.02]`}>
                {metric.trend}
              </span>
            </div>
            <h3 className="text-[11px] font-black tracking-[0.3em] uppercase text-zinc-400 mb-2">{metric.label}</h3>
            <p className="text-6xl font-serif text-zinc-900 tracking-tighter">{metric.value}</p>
          </div>
          {/* Fundo Decorativo Técnico (Sutil) */}
          <div className="absolute right-[-10px] bottom-[-10px] text-black/[0.01] scale-[3] rotate-[5deg] pointer-events-none group-hover:text-black/[0.02] transition-colors">
            <metric.bgIcon size={48} />
          </div>
        </motion.div>
      ))}
    </div>
  );
}
