import { create } from 'zustand';
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware';
import { get, set as idbSet, del } from 'idb-keyval';
import { Product } from '@/types'; // assumindo que Product existe globalmente ou criaremos um fallback

/**
 * HOOKE ELITE V10.0: CORE STATE ARCHITECTURE
 * Utilizando Zustand + idb-keyval (IndexedDB) para performance offline-first radical.
 * Resolve o bloqueio síncrono da UI e unifica o driver de persistência em todo o App.
 */

// Custom storage engine para o middleware de persistência do Zustand usando idb-keyval
const idbStorageEngine: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    return (await get(name)) || null;
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await idbSet(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    await del(name);
  },
};

export interface ArsenalItem extends Partial<Product> {
  id: string;
  name?: string;
  price?: number;
  addedAt?: number;
}

export interface RootState {
  arsenal: ArsenalItem[];
  vipStatus: 'pending' | 'approved' | 'rejected';
  
  // Actions
  addToArsenal: (item: ArsenalItem) => void;
  setVipStatus: (status: 'pending' | 'approved' | 'rejected') => void;
  clearArsenal: () => void;
}

export const useStore = create<RootState>()(
  persist(
    (set) => ({
      // ESTADO INICIAL
      arsenal: [],
      vipStatus: 'pending',
      
      // AÇÕES
      addToArsenal: (item) => set((state) => ({ 
        arsenal: [...state.arsenal, { ...item, id: item.id ?? String(Date.now()) }] 
      })),
      
      setVipStatus: (status) => set({ vipStatus: status }),
      
      clearArsenal: () => set({ arsenal: [] }),
    }),
    {
      name: 'hooke-elite-pwa-storage',
      // Utilizando motor IndexedDB otimizado e assíncrono (Non-blocking UI)
      storage: createJSONStorage(() => idbStorageEngine),
    }
  )
);
