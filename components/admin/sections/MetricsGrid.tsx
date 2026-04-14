"use client";

import { motion } from "framer-motion";
import { ShoppingBag, CupSoda, Users, TrendingUp, ArrowUpRight } from "lucide-react";

interface MetricsGridProps {
  ordersToday: number;
  activeConcierge: number;
}

export default function MetricsGrid({ ordersToday, activeConcierge }: MetricsGridProps) {
  const metrics = [
    {
      label: "Pedidos de Hoje",
      value: ordersToday,
      icon: ShoppingBag,
      trend: "+12% vs Ontem",
      trendColor: "text-emerald-500",
      bgIcon: ShoppingBag,
    },
    {
      label: "Concierge Ativo",
      value: activeConcierge,
      icon: CupSoda,
      trend: "Live Sync",
      trendColor: "text-zinc-500",
      bgIcon: CupSoda,
    },
    {
      label: "Live Store",
      value: 42,
      icon: Users,
      trend: "Estável",
      trendColor: "text-zinc-500",
      bgIcon: TrendingUp,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {metrics.map((metric, idx) => (
        <motion.div
          key={metric.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="bg-[#0D0D0D] border border-white/[0.05] p-10 relative overflow-hidden group hover:border-white/[0.1] transition-all"
        >
          <div className="relative z-10">
            <div className="flex justify-between items-center mb-6">
              <metric.icon className="text-zinc-500" size={20} strokeWidth={1.5} />
              <span className={`text-[9px] font-black px-2 py-1 uppercase tracking-tighter italic ${metric.trendColor} bg-white/5 border border-white/5`}>
                {metric.trend}
              </span>
            </div>
            <h3 className="text-[10px] font-black tracking-[0.3em] uppercase text-zinc-500 mb-2">{metric.label}</h3>
            <p className="text-7xl font-serif text-[#FAFAFA] tracking-tighter">{metric.value}</p>
          </div>
          {/* Fundo Decorativo Técnico */}
          <div className="absolute right-[-20px] bottom-[-20px] text-white/[0.01] scale-[4] rotate-[10deg] pointer-events-none group-hover:text-white/[0.02] transition-colors">
            <metric.bgIcon size={48} />
          </div>
        </motion.div>
      ))}
    </div>
  );
}
