import { create } from 'zustand';
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware';
import { Product } from '@/types';
import { get, set as idbSet, del } from 'idb-keyval';

// Custom storage for IndexedDB using idb-keyval
const idbStorage: StateStorage = {
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

export interface PDVItem extends Product {
  quantity: number;
  selectedSize: string;
  cartItemId: string;
}

export interface OfflineSale {
  id: string;
  items: PDVItem[];
  customerName: string;
  customerPhone?: string;
  total: number;
  paymentMethod: 'dinheiro' | 'pix' | 'cartao';
  timestamp: number;
  status: 'pending' | 'synced' | 'failed' | 'exhausted';
  retryCount: number;
  lastError?: string;
}

interface PDVState {
  items: PDVItem[];
  offlineQueue: OfflineSale[];
  
  // Actions
  addItem: (product: Product, size: string) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  
  // Offline Sync Actions
  addToQueue: (sale: Omit<OfflineSale, 'status' | 'id' | 'retryCount' | 'lastError'>) => void;
  removeFromQueue: (saleId: string) => void;
  updateSaleStatus: (saleId: string, status: OfflineSale['status'], lastError?: string) => void;
}

export const usePDVStore = create<PDVState>()(
  persist(
    (set, get) => ({
      items: [],
      offlineQueue: [],

      addItem: (product: Product, size: string) => {
        const currentItems = get().items;
        const uniqueId = `${product.id}-${size}`;

        const existingItemIndex = currentItems.findIndex(
          (item) => item.cartItemId === uniqueId
        );

        if (existingItemIndex > -1) {
          const newItems = [...currentItems];
          newItems[existingItemIndex].quantity += 1;
          set({ items: newItems });
        } else {
          const newItem: PDVItem = {
            ...product,
            quantity: 1,
            selectedSize: size,
            cartItemId: uniqueId,
          };
          set({ items: [...currentItems, newItem] });
        }
      },

      removeItem: (cartItemId: string) => {
        set({
          items: get().items.filter((item) => item.cartItemId !== cartItemId),
        });
      },

      updateQuantity: (cartItemId: string, quantity: number) => {
        if (quantity < 1) return;
        const currentItems = get().items;
        const newItems = currentItems.map((item) =>
          item.cartItemId === cartItemId ? { ...item, quantity: quantity } : item
        );
        set({ items: newItems });
      },

      clearCart: () => set({ items: [] }),

      addToQueue: (saleData) => {
        const newSale: OfflineSale = {
          ...saleData,
          id: `sale-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          status: 'pending',
          paymentMethod: saleData.paymentMethod,
          retryCount: 0,
        };
        set({ 
          offlineQueue: [...get().offlineQueue, newSale],
          items: [] // Limpa o carrinho após mover para fila
        });
      },

      removeFromQueue: (saleId) => {
        set({
          offlineQueue: get().offlineQueue.filter((s) => s.id !== saleId),
        });
      },

      updateSaleStatus: (saleId, status, lastError) => {
        set({
          offlineQueue: get().offlineQueue.map((s) =>
            s.id === saleId ? { 
                ...s, 
                status, 
                lastError: lastError || s.lastError,
                retryCount: status === 'failed' ? s.retryCount + 1 : s.retryCount
            } : s
          ),
        });
      },
    }),
    {
      name: 'hooke-pdv-storage-v2', // Versão 2 para evitar conflito com localStorage antigo
      storage: createJSONStorage(() => idbStorage),
    }
  )
);

// Selectors
export const selectPDVCount = (state: PDVState) => 
  state.items.reduce((acc, item) => acc + item.quantity, 0);

export const selectPDVTotal = (state: PDVState) => {
  const totalItems = selectPDVCount(state);
  const isCombo = totalItems >= 3;

  return state.items.reduce((acc, item) => {
    // Se for combo e o produto tiver preço de combo, usa ele. Caso contrário, preço normal.
    // O combo se aplica a todas as peças se houver 3+ no total.
    const activePrice = isCombo && item.comboPrice ? item.comboPrice : item.price;
    return acc + activePrice * item.quantity;
  }, 0);
};

export const selectPendingSales = (state: PDVState) => 
  state.offlineQueue.filter(s => s.status === 'pending');
