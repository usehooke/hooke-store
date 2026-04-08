"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

export default function DepartmentFAB() {
  const pathname = usePathname();

  // O botão só faz sentido aparecer dentro das rotas de loja principal, 
  // mas como os departamentos são a base, aparecerá em "masculino", "feminino".
  const isFeminino = pathname.includes("/feminino");

  // Se não estiver em nenhuma das vitrines principais, pode ocultar (ex: checkout, painel do admin)
  if (!pathname.includes("/masculino") && !pathname.includes("/feminino") && pathname !== "/") {
    return null;
  }

  return (
    <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className="bg-white/80 backdrop-blur-xl p-1 rounded-full shadow-2xl border border-hooke-100 flex items-center relative overflow-hidden">
        
        {/* Background Animado do Toggle */}
        <motion.div 
          layoutId="fab-active-bg"
          className="absolute inset-y-1 bg-black rounded-full w-[calc(50%-4px)]"
          initial={false}
          animate={{
            left: isFeminino ? "auto" : "4px",
            right: isFeminino ? "4px" : "auto"
          }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />

        <Link 
          href="/masculino" 
          className="relative z-10 w-28 text-center py-2.5 text-[10px] font-bold tracking-[0.2em] uppercase transition-colors"
          style={{ color: !isFeminino ? "white" : "black" }}
        >
          Masculino
        </Link>
        <Link 
          href="/feminino" 
          className="relative z-10 w-28 text-center py-2.5 text-[10px] font-bold tracking-[0.2em] uppercase transition-colors"
          style={{ color: isFeminino ? "white" : "black" }}
        >
          Feminino
        </Link>

      </div>
    </div>
  );
}
