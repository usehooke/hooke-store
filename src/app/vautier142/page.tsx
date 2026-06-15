import React from 'react';
import VautierClient from './VautierClient';
import { Metadata } from 'next';

/**
 * HOOKE STORE: VAUTIER 142 FUNNEL - V16.0
 * Aesthetic: Sharp-Soft Brutalism (Alabastro Depth)
 * Core V16.0: Server Component
 */

export const metadata: Metadata = {
    title: 'Vautier 142 VIP Concierge - Hooke Store',
    description: 'Protocolo de reserva direta Rua Tiers 184. Experiência de atelier sob demanda.',
    openGraph: {
        title: 'Vautier 142 VIP Concierge - Hooke Store',
        description: 'Acesso exclusivo e agendamento de atelier no Vautier Premium.',
    }
};

export default function Vautier142Page() {
    return (
        <div className="min-h-screen font-sans bg-hooke-paper selection:bg-black selection:text-white flex flex-col items-center justify-center p-6 md:p-12">
            <VautierClient />
        </div>
    );
}
