import { useState, useEffect, useCallback } from 'react';
import { db, auth } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { get, set, del } from 'idb-keyval';

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

    // 1. Monitorar Status da Rede e Carregar Buffer
    useEffect(() => {
        setIsOnline(navigator.onLine);
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        // Carregar buffer inicial via IndexedDB (Elite Async)
        const loadBuffer = async () => {
          try {
            const saved = await get(STORAGE_KEY);
            if (saved) setPendingActions(JSON.parse(saved));
          } catch (e) {
            console.error("IDB Keyval Error:", e);
          }
        };
        
        loadBuffer();

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

        // Adiciona ao buffer local (Async IndexedDB)
        const currentBufferString = await get(STORAGE_KEY);
        const currentBuffer = JSON.parse(currentBufferString || '[]');
        const updatedBuffer = [...currentBuffer, newAction];
        await set(STORAGE_KEY, JSON.stringify(updatedBuffer));
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

        // ⚡ A TRAVA DO TECH LEAD: Se o banco estiver offline, não tentamos sincronizar.
        if (!db) {
            console.warn("⚠️ [Hooke System] Sincronização em buffer ignorada: Firestore offline.");
            return;
        }

        try {
            const syncRef = collection(db, 'user_interactions');
            const userId = auth?.currentUser?.uid || 'anonymous';

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
            await set(STORAGE_KEY, JSON.stringify(finalBuffer));
            setPendingActions(finalBuffer);
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
