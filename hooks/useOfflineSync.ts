import { useState, useEffect, useCallback } from 'react';
import { db, auth } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

/**
 * useOfflineSync - O Motor de Resiliência Hooke.
 * Gerencia intenções do usuário (favoritos, cliques) em LocalStorage
 * e sincroniza com o Firebase quando online.
 */

interface SyncAction {
    type: 'FAVORITE' | 'ADD_TO_CART' | 'VIEW_DETAIL';
    productId: string;
    timestamp: number;
    synced: boolean;
}

const STORAGE_KEY = 'hooke_offline_sync_buffer';

export function useOfflineSync() {
    const [isOnline, setIsOnline] = useState(true);
    const [pendingActions, setPendingActions] = useState<SyncAction[]>([]);

    // 1. Monitorar Status da Rede
    useEffect(() => {
        setIsOnline(navigator.onLine);
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        // Carregar buffer inicial
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) setPendingActions(JSON.parse(saved));

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    // 2. Função Principal para Registrar Ações
    const trackAction = useCallback(async (type: SyncAction['type'], productId: string) => {
        const newAction: SyncAction = {
            type,
            productId,
            timestamp: Date.now(),
            synced: false
        };

        // Adiciona ao buffer local
        const currentBuffer = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        const updatedBuffer = [...currentBuffer, newAction];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedBuffer));
        setPendingActions(updatedBuffer);

        // Se online, tenta sincronizar imediatamente
        if (navigator.onLine) {
            await syncBuffer(updatedBuffer);
        }
    }, []);

    // 3. Sincronização com o Firebase
    const syncBuffer = useCallback(async (buffer: SyncAction[]) => {
        const unsynced = buffer.filter(a => !a.synced);
        if (unsynced.length === 0) return;

        try {
            const syncRef = collection(db, 'user_interactions');
            const userId = auth.currentUser?.uid || 'anonymous';

            for (const action of unsynced) {
                await addDoc(syncRef, {
                    ...action,
                    userId,
                    created_at: serverTimestamp(),
                    source: 'wafer-elite-launch'
                });
                action.synced = true;
            }

            // Limpa o que já foi sincronizado
            const finalBuffer = buffer.filter(a => !a.synced);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(finalBuffer));
            setPendingActions(finalBuffer);
            
            console.log(`[OfflineSync] ${unsynced.length} ações sincronizadas com sucesso.`);
        } catch (error) {
            console.error('[OfflineSync] Falha ao sincronizar:', error);
        }
    }, []);

    // 4. Trigger de Sincronização Automática ao Voltar Online
    useEffect(() => {
        if (isOnline && pendingActions.length > 0) {
            syncBuffer(pendingActions);
        }
    }, [isOnline, pendingActions, syncBuffer]);

    return {
        isOnline,
        trackAction,
        pendingCount: pendingActions.length
    };
}
