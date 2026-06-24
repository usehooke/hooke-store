import React from 'react';
import { getAdminProducts } from '@/features/admin/services/adminProductService';
import { InteractivePDV } from './InteractivePDV';
import { Metadata } from 'next';
import { connection } from "next/server";

export const metadata: Metadata = {
  title: 'PDV Elite | Hooke Command Center',
  description: 'Ponto de Venda de Alta Performance',
};

export default async function PDVPage() {
  await connection(); // Opt into dynamic rendering (Dynamic I/O)

  // ✅ try/catch explícito: falhas do Firestore são capturadas pelo error.tsx
  let products: Awaited<ReturnType<typeof getAdminProducts>> = [];
  try {
    products = await getAdminProducts();
  } catch (err) {
    console.error("❌ [PDVPage] Falha ao carregar produtos:", err);
    throw err; // O error.tsx da rota vai capturar
  }

  // Filtramos apenas os produtos ativos para o PDV
  const activeProducts = products.filter(p => p.isActive);

  return (
    <InteractivePDV initialProducts={activeProducts} />
  );
}
