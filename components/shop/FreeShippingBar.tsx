'use client';

import { motion } from 'framer-motion';
import { Truck, CheckCircle2 } from 'lucide-react';
import { brandConfig } from '@/config/brandConfig';

interface FreeShippingBarProps {
  subtotal: number;
}

export default function FreeShippingBar({ subtotal }: FreeShippingBarProps) {
  const threshold = brandConfig.shop.freeShippingThreshold;
  const remaining = threshold - subtotal;
  const percentage = Math.min((subtotal / threshold) * 100, 100);
  const isFree = remaining <= 0;

  const formatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  return (
    <div className="bg-white border-b border-hooke-100 p-4 mb-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {isFree ? (
            <CheckCircle2 size={16} className="text-green-600 animate-bounce" />
          ) : (
            <Truck size={16} className="text-hooke-500" />
          )}
          <span className="text-[10px] font-bold uppercase tracking-widest text-hooke-900">
            {isFree 
              ? "Parabéns! Você ganhou Frete Grátis" 
              : `Faltam ${formatter.format(remaining)} para Frete Grátis`}
          </span>
        </div>
        <span className="text-[10px] font-black text-hooke-900">{Math.round(percentage)}%</span>
      </div>
      
      <div className="h-1.5 w-full bg-hooke-50 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`h-full ${isFree ? 'bg-green-600' : 'bg-hooke-900'}`}
        />
      </div>
    </div>
  );
}
