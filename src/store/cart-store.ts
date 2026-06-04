import { create } from 'zustand';
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware';
import { get, set, del } from 'idb-keyval';
import { Product } from '@/types';

// Custom IDB Storage para Zustand (Offline-First Real, non-blocking OS thread)
const idbStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    return (await get(name)) || null;
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await set(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    await del(name);
  },
};

export interface CartItem extends Product {
  quantity: number;
  selectedSize: string;
  selectedColor?: string;
  cartItemId: string;
}

export interface CustomerData {
  name: string;
  email: string;
  phone: string;
  isVip: boolean;
  address?: {
    street: string;
    neighborhood: string;
    city: string;
    state: string;
  };
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

  // Checkout Data (Persistence 3.0)
  customer: CustomerData;
  setCustomer: (data: Partial<CustomerData>) => void;
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
      customer: { name: "", email: "", phone: "", isVip: true, address: { street: "", neighborhood: "", city: "", state: "" } },

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      setShipping: (zip: string | null, cost: number | null, method: string | null) =>
        set({ shippingZipCode: zip, shippingCost: cost, shippingMethod: method }),
      clearShipping: () =>
        set({ shippingZipCode: null, shippingCost: null, shippingMethod: null }),

      setCoupon: (code: string | null) => set({ appliedCoupon: code }),

      setCustomer: (data) => set((state) => ({ 
        customer: { ...state.customer, ...data } 
      })),

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

      // Configuração assíncrona Elite via idb-keyval (protege performance Mobile e Client Components)
      storage: createJSONStorage(() => idbStorage),

      skipHydration: true, // IMPORTANTE: Evita conflito inicial de hidratação

      // A MÁGICA ESTÁ AQUI:
      // Dizemos ao Zustand para salvar APENAS a lista de 'items', 'frete' e 'cupom'.
      // Ignoramos 'isOpen' para que o carrinho sempre comece fechado.
      partialize: (state) => ({
        items: state.items,
        shippingZipCode: state.shippingZipCode,
        shippingCost: state.shippingCost,
        shippingMethod: state.shippingMethod,
        appliedCoupon: state.appliedCoupon,
        customer: state.customer
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

// --- LOGICA DE PROMOÇÃO HOOKE ---
// 3 peças por R$ 199,90 | 5 peças por R$ 299,90
// Categorias elegíveis para o Kit
const ELIGIBLE_CATEGORIES = ['Oversized', 'camisetas-lisas', 'camisetas-estampadas', 'Vintage', 'Regatas'];

export const selectCartPromoDiscount = (state: CartState) => {
  // Filtra apenas os itens das categorias elegíveis para o pacote
  const eligibleItems = state.items.filter(item => ELIGIBLE_CATEGORIES.includes(item.category));
  const totalEligibleQty = eligibleItems.reduce((acc, item) => acc + item.quantity, 0);

  if (totalEligibleQty === 0) return 0;

  // Calculamos o preço médio atual dos itens elegíveis (para o desconto ser proporcional)
  const currentEligibleSubtotal = eligibleItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  
  let targetPrice = currentEligibleSubtotal;

  // Regra: 5 peças por 299.90 (Prioridade para o maior kit)
  if (totalEligibleQty >= 5) {
      const numKits5 = Math.floor(totalEligibleQty / 5);
      const remaining = totalEligibleQty % 5;
      
      // Preço médio das peças excedentes (usamos o preco medio original dos itens elegíveis)
      const avgOriginalPrice = currentEligibleSubtotal / totalEligibleQty;
      
      // Se sobrar 3 ou 4, aplicamos o kit de 3 no resto
      let extraPrice = 0;
      if (remaining >= 3) {
          extraPrice = 199.90 + (remaining - 3) * avgOriginalPrice;
      } else {
          extraPrice = remaining * avgOriginalPrice;
      }
      
      targetPrice = (numKits5 * 299.90) + extraPrice;
  } 
  // Regra: 3 peças por 199.90
  else if (totalEligibleQty >= 3) {
      const remaining = totalEligibleQty % 3;
      const avgOriginalPrice = currentEligibleSubtotal / totalEligibleQty;
      targetPrice = 199.90 + (remaining * avgOriginalPrice);
  }

  // O desconto é a diferença entre o subtotal original dos itens elegíveis e o preço alvo da promoção
  const discount = currentEligibleSubtotal - targetPrice;
  return discount > 0 ? Math.round(discount * 100) / 100 : 0;
};

export const selectCartFinalTotal = (state: CartState) => {
  const subtotal = selectCartSubTotal(state);
  const discount = selectCartPromoDiscount(state);
  return subtotal - discount;
};
