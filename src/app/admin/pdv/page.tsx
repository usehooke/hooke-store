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
  // 1. Busca os produtos diretamente do Firebase Admin SDK no Servidor!
  // Isso garante 0 delays, 0 mocks e 100% de segurança.
  const products = await getAdminProducts();

  // 2. Filtramos apenas os produtos ativos para o PDV
  const activeProducts = products.filter(p => p.isActive);

  return (
    <InteractivePDV initialProducts={activeProducts} />
  );
}
