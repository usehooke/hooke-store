"use client";

import React from 'react';
import { Package, Users, Activity, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface MetricsGridProps {
  inventoryCount: number;
  activeUsers: number;
  totalRevenue: number;
}

export function MetricsGrid({ inventoryCount, activeUsers, totalRevenue }: MetricsGridProps) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card variant="brutalist">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-zinc-400">Estoque Vivo</CardTitle>
            <Package size={16} className="text-zinc-300" />
          </div>
          <CardDescription>Saúde do Lote Alpha</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black tracking-tighter">{inventoryCount}</span>
            <Badge variant="success" className="text-[8px]">Sync OK</Badge>
          </div>
        </CardContent>
      </Card>

      <Card variant="brutalist">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-zinc-400">Radar Ativo</CardTitle>
            <Users size={16} className="text-zinc-300" />
          </div>
          <CardDescription>Sessões em Tempo Real</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black tracking-tighter">{activeUsers}</span>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-emerald-500 animate-pulse" />
              <span className="text-[8px] font-black uppercase text-emerald-600">Live</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card variant="brutalist">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-zinc-400">Receita Acumulada</CardTitle>
            <TrendingUp size={16} className="text-zinc-300" />
          </div>
          <CardDescription>Faturamento Bruto Est.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-1">
            <span className="text-sm font-black text-zinc-400">R$</span>
            <span className="text-4xl font-black tracking-tighter">
              {totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card variant="brutalist">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-zinc-400">Eficiência</CardTitle>
            <Activity size={16} className="text-zinc-300" />
          </div>
          <CardDescription>Protocolo Operacional</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black tracking-tighter">99.8%</span>
            <Badge variant="luxury" className="text-[8px]">Stable</Badge>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
