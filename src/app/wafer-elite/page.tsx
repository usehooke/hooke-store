import React from 'react';
import BottomNav from '@/components/layout/BottomNav';
import WaferEliteClient from './WaferEliteClient';
import { Metadata } from 'next';

/**
 * Wafer Elite Launch Page - A Cúpula do E-commerce Hooke.
 * Core V16.0: Server Component
 */

export const metadata: Metadata = {
    title: 'Wafer Elite Black (320g) - Hooke Store',
    description: 'Nossa peça mais pesada até hoje. Um tricô estruturado que mantém a forma original por anos. Modelagem Sharp Boxy e toque de algodão egípcio.',
    openGraph: {
        title: 'Wafer Elite Black (320g) - Hooke Store',
        description: 'Estrutura Heavyweight de 320g de puro luxo têxtil.',
    }
};

const PRODUCT_DATA = {
    id: 'wafer-elite-320g',
    name: 'Wafer Elite Black (320g)',
    price: 189.90,
    fabric: 'Wafer Tex 320g (Heavyweight)',
    description: 'Nossa peça mais pesada até hoje. Um tricô estruturado que mantém a forma original por anos. Modelagem "Sharp Boxy" e toque de algodão egípcio.',
    image: '/produtos/wafer-elite.png'
};

export default function WaferElitePage() {
    return (
        <main className="min-h-screen bg-white text-black font-sans pb-32 overflow-x-hidden">
            <WaferEliteClient productData={PRODUCT_DATA} />
            <BottomNav />
        </main>
    );
}
