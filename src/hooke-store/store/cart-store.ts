import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Product } from '@/types';

// Definimos o item do carrinho
export interface CartItem extends Product {
  quantity: number;
  selectedSize: string;
  selectedColor?: string;
  cartItemId: string;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;

  // Ações
  addItem: (product: Product, size: string, color?: string) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;

  // Shipping
  shippingZipCode: string | null;
  shippingCost: number | null;
  shippingMethod: string | null;
  setShipping: (zip: string | null, cost: number | null, method: string | null) => void;
  clearShipping: () => void;

  // Coupon
  appliedCoupon: string | null;
  setCoupon: (code: string | null) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      shippingZipCode: null,
      shippingCost: null,
      shippingMethod: null,
      appliedCoupon: null,

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      setShipping: (zip: string | null, cost: number | null, method: string | null) =>
        set({ shippingZipCode: zip, shippingCost: cost, shippingMethod: method }),
      clearShipping: () =>
        set({ shippingZipCode: null, shippingCost: null, shippingMethod: null }),

      setCoupon: (code: string | null) => set({ appliedCoupon: code }),

      addItem: (product: Product, size: string, color?: string) => {
        const currentItems = get().items;
        const uniqueId = color ? `${product.id}-${color}-${size}` : `${product.id}-${size}`;

        const existingItemIndex = currentItems.findIndex(
          (item) => item.cartItemId === uniqueId
        );

        if (existingItemIndex > -1) {
          const newItems = [...currentItems];
          newItems[existingItemIndex].quantity += 1;
          // Abre o carrinho ao adicionar
          set({ items: newItems, isOpen: true });
        } else {
          const newItem: CartItem = {
            ...product,
            quantity: 1,
            selectedSize: size,
            selectedColor: color,
            cartItemId: uniqueId,
          };
          // Abre o carrinho ao adicionar
          set({ items: [...currentItems, newItem], isOpen: true });
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

      clearCart: () => set({
        items: [],
        isOpen: false,
        shippingZipCode: null,
        shippingCost: null,
        shippingMethod: null,
        appliedCoupon: null
      }),
    }),
    {
      name: 'hooke-cart-storage',

      // Configuração segura para Next.js (evita erro no servidor)
      storage: createJSONStorage(() => {
        if (typeof window !== 'undefined') {
          return localStorage;
        }
        return {
          getItem: () => null,
          setItem: () => { },
          removeItem: () => { },
        };
      }),

      skipHydration: true, // IMPORTANTE: Evita conflito inicial de hidratação

      // A MÁGICA ESTÁ AQUI:
      // Dizemos ao Zustand para salvar APENAS a lista de 'items', 'frete' e 'cupom'.
      // Ignoramos 'isOpen' para que o carrinho sempre comece fechado.
      partialize: (state) => ({
        items: state.items,
        shippingZipCode: state.shippingZipCode,
        shippingCost: state.shippingCost,
        shippingMethod: state.shippingMethod,
        appliedCoupon: state.appliedCoupon
      }),
    }
  )
);

// SELETORES (Use estes nos seus componentes)
export const selectCartTotalItems = (state: CartState) => {
  return state.items.reduce((total, item) => total + item.quantity, 0);
};

export const selectCartSubTotal = (state: CartState) => {
  return state.items.reduce((total, item) => total + item.price * item.quantity, 0);
};