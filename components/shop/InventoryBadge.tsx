'use client';

import { useEffect, useState } from 'react';
import { Flame } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface InventoryBadgeProps {
 stock?: Record<string, number>;
 selectedSize: string | null;
 selectedColor: string | null;
}

export default function InventoryBadge({ stock, selectedSize, selectedColor }: InventoryBadgeProps) {
 const [displayStock, setDisplayStock] = useState<number | null>(null);

 useEffect(() => {
 if (!stock || !selectedSize) {
 setDisplayStock(null);
 return;
 }

 const comboKey = selectedColor ? `${selectedColor}-${selectedSize}` : selectedSize;
 const quantity = stock[comboKey] || 0;
 
 // Só mostramos o alerta se o estoque estiver entre 1 e 3 (padrão de escassez)
 if (quantity > 0 && quantity <= 3) {
 setDisplayStock(quantity);
 } else {
 setDisplayStock(null);
 }
 }, [stock, selectedSize, selectedColor]);

 return (
 <AnimatePresence>
 {displayStock !== null && (
 <motion.div
 initial={{ opacity: 0, y: 10 }}
 animate={{ opacity: 1, y: 0 }}
 exit={{ opacity: 0, scale: 0.95 }}
 className="flex items-center gap-2 bg-amber-50 border border-amber-200 px-3 py-2 rounded-sm mt-4 inline-flex"
 >
 <Flame size={14} className="text-amber-600 animate-pulse" fill="currentColor" />
 <span className="text-[10px] md:text-xs font-bold tracking-widest text-amber-800">
 Apenas {displayStock} {displayStock === 1 ? 'unidade disponível' : 'unidades disponíveis'}!
 </span>
 </motion.div>
 )}
 </AnimatePresence>
 );
}
