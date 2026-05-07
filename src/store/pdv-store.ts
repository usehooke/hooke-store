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
  sizeQuantities: Record<string, number>; // { "P": 2, "G": 5 }
  customPrice?: number;
  addedAt: number;
}

export interface OfflineSale {
  id: string;
  items: PDVItem[];
  customerName: string;
  customerPhone?: string;
  total: number;
  isWholesale?: boolean;
  paymentMethod: 'dinheiro' | 'pix' | 'cartao';
  timestamp: number;
  status: 'pending' | 'synced' | 'failed' | 'exhausted';
  retryCount: number;
  lastError?: string;
  addedAt?: number;
}

interface PDVState {
  items: PDVItem[];
  offlineQueue: OfflineSale[];
  isWholesale: boolean; // Toggle manual de atacado
  
  // Actions
  addItem: (product: Product, size: string) => void;
  updateSizeQuantity: (productId: string, size: string, quantity: number) => void;
  updateCustomPrice: (productId: string, price: number) => void;
  removeItem: (productId: string) => void;
  setWholesale: (status: boolean) => void;
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
      isWholesale: false,

      setWholesale: (status) => set({ isWholesale: status }),

      addItem: (product: Product, size: string) => {
        const currentItems = get().items;
        const existingItemIndex = currentItems.findIndex(item => item.id === product.id);

        if (existingItemIndex > -1) {
          const newItems = [...currentItems];
          const item = newItems[existingItemIndex];
          item.sizeQuantities[size] = (item.sizeQuantities[size] || 0) + 1;
          set({ items: newItems });
        } else {
          const newItem: PDVItem = {
            ...product,
            sizeQuantities: { [size]: 1 },
            addedAt: Date.now()
          };
          set({ items: [...currentItems, newItem] });
        }
      },

      updateSizeQuantity: (productId, size, quantity) => {
        const currentItems = get().items;
        const newItems = currentItems.map(item => {
          if (item.id === productId) {
            const newSizes = { ...item.sizeQuantities };
            if (quantity <= 0) {
              delete newSizes[size];
            } else {
              newSizes[size] = quantity;
            }
            return { ...item, sizeQuantities: newSizes };
          }
          return item;
        }).filter(item => Object.keys(item.sizeQuantities).length > 0);
        
        set({ items: newItems });
      },

      updateCustomPrice: (productId, price) => {
        const currentItems = get().items;
        const newItems = currentItems.map(item => 
          item.id === productId ? { ...item, customPrice: price } : item
        );
        set({ items: newItems });
      },

      removeItem: (productId: string) => {
        set({
          items: get().items.filter((item) => item.id !== productId),
        });
      },

      clearCart: () => set({ items: [], isWholesale: false }),

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
          items: [],
          isWholesale: false
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
      name: 'hooke-pdv-storage-v3.5', // Nova versão para evitar conflito
      storage: createJSONStorage(() => idbStorage),
    }
  )
);

// Selectors
export const selectPDVCount = (state: PDVState) => 
  state.items.reduce((acc, item) => {
    const itemQty = Object.values(item.sizeQuantities).reduce((a, b) => a + b, 0);
    return acc + itemQty;
  }, 0);

export const selectPDVTotal = (state: PDVState) => {
  const totalItems = selectPDVCount(state);
  const isAutoWholesale = totalItems >= 5;

  return state.items.reduce((acc, item) => {
    const itemQty = Object.values(item.sizeQuantities).reduce((a, b) => a + b, 0);
    
    // Prioridade: Preço Customizado > Preço Combo (se atacado auto) > Preço Normal
    let unitPrice = item.price;
    if (item.customPrice !== undefined) {
      unitPrice = item.customPrice;
    } else if (isAutoWholesale && item.comboPrice) {
      unitPrice = item.comboPrice;
    }

    return acc + (unitPrice * itemQty);
  }, 0);
};

export const selectPendingSales = (state: PDVState) => 
  state.offlineQueue.filter(s => s.status === 'pending');
