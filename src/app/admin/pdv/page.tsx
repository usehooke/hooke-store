import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PDV Elite | Hooke Command Center',
  description: 'Ponto de Venda de Alta Performance',
};

export default function PDVPage() {
  return (
    <div className="flex h-screen items-center justify-center bg-zinc-50 p-8">
      <h1 className="text-3xl font-bold uppercase tracking-widest border-2 border-black p-8 bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        Teste de Renderização PDV (Isolamento)
      </h1>
    </div>
  );
}

/* CÓDIGO ORIGINAL PRESERVADO PARA RESTAURAÇÃO:
import { getAdminProducts } from '@/features/admin/services/adminProductService';
import { InteractivePDV } from './InteractivePDV';
import { connection } from "next/server";

export default async function PDVPage() {
  await connection(); // Opt into dynamic rendering (Dynamic I/O)

  let products: Awaited<ReturnType<typeof getAdminProducts>> = [];
  try {
    products = await getAdminProducts();
  } catch (err) {
    console.error("❌ [PDVPage] Falha ao carregar produtos:", err);
    throw err;
  }

  const activeProducts = products.filter(p => p.isActive);

  return (
    <InteractivePDV initialProducts={activeProducts} />
  );
}
*/
