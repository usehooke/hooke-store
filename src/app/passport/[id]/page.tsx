import React from 'react';
import { Lock } from 'lucide-react';
import Link from 'next/link';
import { adminDb } from '@/lib/firebase-admin';
import PassportClient from './PassportClient';

/**
 * HOOKE PASSPORT: POST-PURCHASE VAULT (Server-Side Component)
 * Aesthetic: Deep Slate Mode (#0A0A0A)
 * Core V16.0: Next.js 16 Server Component, Async Params, Hybrid Resiliency (Admin SDK + REST Fallback)
 */

export interface VaultAsset {
    id?: string;
    Numero_de_Serie: string;
    Categoria: string;
    Gramatura_Tecnica: number;
    Data_de_Lancamento: string;
    owner_id?: string;
}

// Resilient Asset Fetcher: Admin SDK -> REST Fallback -> Null
async function getVaultAsset(vaultId: string): Promise<VaultAsset | null> {
    // 1. Tentar via Admin SDK se disponível
    if (adminDb) {
        try {
            const snap = await adminDb.doc(`artifacts/hooke-standalone-pwa/vault/${vaultId}`).get();
            if (snap.exists) {
                return { id: snap.id, ...snap.data() } as VaultAsset;
            }
            return null;
        } catch (error) {
            console.error("Erro ao ler vault via Admin SDK:", error);
        }
    }

    // 2. Fallback via REST API se o Admin SDK não estiver inicializado (ex: build time ou chaves ausentes)
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    if (!projectId) return null;

    try {
        const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/artifacts/hooke-standalone-pwa/vault/${vaultId}`;
        const res = await fetch(url, { next: { revalidate: 60 } }); // Cache do fetch por 60s
        if (res.status === 404) return null;
        if (!res.ok) {
            throw new Error(`REST API returned status ${res.status}`);
        }
        const data = await res.json();
        
        // Mapear campos REST do Firestore
        const fields = data.fields || {};
        const getVal = (field: any) => {
            if (!field) return undefined;
            if ('stringValue' in field) return field.stringValue;
            if ('integerValue' in field) return Number(field.integerValue);
            if ('doubleValue' in field) return Number(field.doubleValue);
            if ('booleanValue' in field) return field.booleanValue;
            return undefined;
        };

        return {
            id: vaultId,
            Numero_de_Serie: getVal(fields.Numero_de_Serie) || '',
            Categoria: getVal(fields.Categoria) || '',
            Gramatura_Tecnica: getVal(fields.Gramatura_Tecnica) || 0,
            Data_de_Lancamento: getVal(fields.Data_de_Lancamento) || '',
            owner_id: getVal(fields.owner_id)
        } as VaultAsset;
    } catch (error) {
        console.error("Erro ao ler vault via REST API:", error);
        return null;
    }
}

export default async function PassportVault({ params }: { params: Promise<{ id: string }> }) {
    // Next.js 16 async params unwrapping
    const { id: vaultId } = await params;
    
    // Server-Side Resilient Fetch
    const vaultData = await getVaultAsset(vaultId);

    if (!vaultData) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center p-8 text-white text-center">
                <div className="p-8 border border-white/10 mb-12">
                    <Lock size={48} className="text-white/20" />
                </div>
                <h1 className="text-3xl font-black tracking-tighter uppercase mb-4 italic">Cofre Vazio</h1>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 max-w-xs mb-12">
                    O serial inserido não corresponde a nenhum ativo validado no protocolo Hooke.
                </p>
                <Link href="/" className="px-10 py-5 bg-white text-black text-[10px] font-black uppercase tracking-[0.5em] hover:bg-zinc-200 transition-colors border border-white">
                    Retornar ao Arsenal
                </Link>
            </div>
        );
    }

    return <PassportClient vaultData={vaultData} vaultId={vaultId} />;
}
