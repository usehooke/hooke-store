"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ActivityFeedProps {
  recentOrders: any[];
  activeUsers: any[];
}

export function ActivityFeed({ recentOrders, activeUsers }: ActivityFeedProps) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
      <Card variant="luxury" className="xl:col-span-8 overflow-hidden">
        <CardHeader className="border-b border-black/5 bg-zinc-50/50">
          <div className="flex justify-between items-center">
            <CardTitle>SalesPulse Feed</CardTitle>
            <Activity size={14} className="text-black animate-pulse" />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-black/5 max-h-[600px] overflow-y-auto custom-scrollbar">
            <AnimatePresence mode='popLayout'>
              {recentOrders.length === 0 ? (
                <div className="p-20 text-center text-zinc-300 italic text-xs uppercase tracking-widest">
                  Aguardando reservas no arsenal...
                </div>
              ) : (
                recentOrders.map((order, i) => (
                  <motion.div 
                    key={order.id || i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-6 p-6 hover:bg-zinc-50 transition-colors group"
                  >
                    <div className="w-14 h-14 border border-black/5 overflow-hidden flex-shrink-0 bg-zinc-100">
                      <img 
                        src="https://www.usehooke.com.br/cdn/shop/files/conjunto-wafer-off-white.jpg" 
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" 
                        alt="Order item"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[8px] font-black uppercase tracking-[0.2em] text-zinc-300 mb-1">Entrada de Pedido</p>
                      <h4 className="text-sm font-bold tracking-tight uppercase truncate">{order.userName || 'Anonymous Client'}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock size={10} className="text-zinc-300" />
                        <span className="text-[9px] text-zinc-400 font-mono">
                          {order.timestamp ? new Date(order.timestamp).toLocaleTimeString('pt-BR') : 'Just now'}
                        </span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-black font-mono">
                        R$ {Number(order.total || 0).toFixed(2)}
                      </p>
                      <div className="mt-1 flex justify-end">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>

      <Card variant="luxury" className="xl:col-span-4 overflow-hidden">
        <CardHeader className="border-b border-black/5 bg-zinc-50/50">
          <CardTitle>Radar de Navegação</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-black/5 max-h-[600px] overflow-y-auto custom-scrollbar">
            {activeUsers.map((session, i) => (
              <div key={i} className="flex items-center justify-between p-5 hover:bg-zinc-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-1 h-1 bg-emerald-500 animate-pulse" />
                  <p className="text-[10px] font-mono font-medium text-zinc-600">
                    SESS-{session.id?.slice(0, 8).toUpperCase() || 'UNKNOWN'}
                  </p>
                </div>
                <span className="text-[7px] font-black uppercase tracking-widest text-zinc-300">Acesso Mobile</span>
              </div>
            ))}
            {activeUsers.length === 0 && (
              <div className="p-10 text-center text-zinc-300 text-[10px] uppercase tracking-widest font-black">
                Zero sessões detectadas.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
