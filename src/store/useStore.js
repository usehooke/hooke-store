import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import localforage from 'localforage';

/**
 * HOOKE ELITE: STATE ARCHITECTURE
 * Utilizando Zustand + localforage (IndexedDB) para performance offline-first.
 * Resolve o bloqueio síncrono e o limite de 5MB do LocalStorage tradicional.
 */

// Custom storage engine para o middleware de persistência do Zustand
const storageEngine = {
  getItem: async (name) => {
    const value = await localforage.getItem(name);
    return value ? JSON.stringify(value) : null;
  },
  setItem: async (name, value) => {
    await localforage.setItem(name, JSON.parse(value));
  },
  removeItem: async (name) => {
    await localforage.removeItem(name);
  },
};

export const useStore = create(
  persist(
    (set) => ({
      // ESTADO INICIAL
      arsenal: [],
      vipStatus: 'pending',
      
      // AÇÕES
      addToArsenal: (item) => set((state) => ({ 
        arsenal: [...state.arsenal, { ...item, id: Date.now() }] 
      })),
      
      setVipStatus: (status) => set({ vipStatus: status }),
      
      clearArsenal: () => set({ arsenal: [] }),
    }),
    {
      name: 'hooke-elite-pwa-storage',
      storage: createJSONStorage(() => storageEngine),
    }
  )
);
