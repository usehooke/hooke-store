// store/cart-store.ts
// ============================================================================
// ZUSTAND STORE - CARRINHO COM PERSISTÊNCIA SEGURA
// ============================================================================
// Erro original: "Maximum update depth exceeded"
// Causa: Hidratação desincronizada + isOpen salvo no localStorage
// Solução: skipHydration + partialize + seletores memoizados
// ============================================================================

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Product } from '@/types';

/**
 * CartItem = Produto + Metadados do Carrinho
 * - quantity: quantas unidades deste item
 * - selectedSize: qual tamanho foi escolhido (P, M, G...)
 * - cartItemId: ID único (ex: "123-M") para diferenciar tamanhos
 */
export interface CartItem extends Product {
  quantity: number;
  selectedSize: string;
  cartItemId: string;
}

/**
 * CartState = Aquilo que DE VERDADE precisa estar no store
 * 
 * ✅ items: DEVE ser persistido (é application state)
 * ❌ isOpen: NÃO deve ser persistido (é UI state - muda a cada clique)
 */
interface CartState {
  items: CartItem[];
  isOpen: boolean;
  
  // Actions
  addItem: (product: Product, size: string) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
}

// ============================================================================
// CRIAR STORE COM PERSIST MIDDLEWARE
// ============================================================================

export const useCartStore = create<CartState>()(
  persist(
    // ========================================================================
    // REDUCER: Define as ações e estado inicial
    // ========================================================================
    (set, get) => ({
      // Estado Inicial
      items: [],
      isOpen: false,

      // ====================================================================
      // 🎯 AÇÃO: Abrir/Fechar Carrinho (UI State)
      // ====================================================================
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      // ====================================================================
      // 🎯 AÇÃO: Adicionar Item
      // ====================================================================
      // Lógica:
      // 1. Se produto + tamanho já existe → aumentar quantidade
      // 2. Se é novo → adicionar à lista
      // 3. Abrir carrinho automaticamente
      addItem: (product: Product, size: string) => {
        const currentItems = get().items;
        const uniqueId = `${product.id}-${size}`; // Ex: "123-M"

        const existingItemIndex = currentItems.findIndex(
          (item) => item.cartItemId === uniqueId
        );

        if (existingItemIndex > -1) {
          // ✅ Item já existe com esse tamanho - aumentar quantidade
          const newItems = [...currentItems];
          newItems[existingItemIndex].quantity += 1;
          set({ items: newItems, isOpen: true });
        } else {
          // ✅ Item novo - adicionar à lista
          const newItem: CartItem = {
            ...product,
            quantity: 1,
            selectedSize: size,
            cartItemId: uniqueId,
          };
          set({ items: [...currentItems, newItem], isOpen: true });
        }
      },

      // ====================================================================
      // 🎯 AÇÃO: Remover Item
      // ====================================================================
      removeItem: (cartItemId: string) => {
        set({
          items: get().items.filter((item) => item.cartItemId !== cartItemId),
        });
      },

      // ====================================================================
      // 🎯 AÇÃO: Atualizar Quantidade
      // ====================================================================
      updateQuantity: (cartItemId: string, quantity: number) => {
        if (quantity < 1) return; // Validação: não permitir quantidade 0

        const currentItems = get().items;
        const newItems = currentItems.map((item) =>
          item.cartItemId === cartItemId 
            ? { ...item, quantity: quantity } 
            : item
        );
        set({ items: newItems });
      },

      // ====================================================================
      // 🎯 AÇÃO: Limpar Carrinho
      // ====================================================================
      clearCart: () => set({ items: [], isOpen: false }),
    }),

    // ========================================================================
    // CONFIGURAÇÃO DO PERSIST MIDDLEWARE
    // ========================================================================
    {
      // Nome da chave no localStorage
      name: 'hooke-cart-storage',

      // ====================================================================
      // 🔑 CONFIGURAÇÃO #1: Storage com Validação SSR
      // ====================================================================
      // Problema: Next.js renderiza no servidor (SSR)
      // Servidor não tem acesso a localStorage (objeto do browser)
      // Solução: Criar um storage falso para SSR, real para cliente
      storage: createJSONStorage(() => {
        if (typeof window !== 'undefined') {
          // ✅ Cliente - tem acesso a localStorage
          return localStorage;
        }
        // ✅ Servidor (SSR) - retornar storage fake
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        };
      }),

      // ====================================================================
      // 🔑 CONFIGURAÇÃO #2: skipHydration - CRÍTICO!
      // ====================================================================
      // Problema SEM skipHydration:
      // 1. Componente renderiza com estado vazio
      // 2. Zustand lê localStorage e MUDA estado automaticamente
      // 3. Componente renderiza NOVAMENTE com novo estado
      // 4. React vê mudança em cascade = "Maximum update depth exceeded" ❌
      //
      // Solução COM skipHydration: true
      // - Zustand NÃO rehidrता automaticamente
      // - Você controla QUANDO reidratar (geralmente useEffect com HydrationCheck)
      // - Componentes renderizam uma única vez
      skipHydration: true,

      // ====================================================================
      // 🔑 CONFIGURAÇÃO #3: partialize - O QUE SALVAR?
      // ====================================================================
      // Crítico: NÃO salve UI state no localStorage!
      //
      // ✅ SALVE: items (dados do carrinho)
      // ❌ NÃO SALVE: isOpen (se carrinho está aberto)
      //
      // Por que isOpen não deve ser salvo:
      // - Usuário vai embora e volta depois
      // - localStorage carregaria isOpen: true
      // - Página reabriria com carrinho aberto (confuso!)
      // - Sincronização entre abas fica complicada
      //
      // Solução: partialize seleciona APENAS items
      partialize: (state) => ({
        items: state.items,
        // ❌ isOpen NÃO está aqui - sempre começa false!
      }),
    }
  )
);

// ============================================================================
// SELETORES MEMOIZADOS - Use nos Componentes!
// ============================================================================
// Em vez de:  useCartStore((state) => state.items.reduce(...))
// Use:        useCartStore(selectCartTotalItems)
//
// Benefício: React só re-renderiza se items muda, não se isOpen muda
// Sem seletor: mudança em isOpen & items = 2 re-renders
// Com seletor: mudança em isOpen = 0 re-renders, mudança items = 1 re-render

/**
 * Seletor: Pegar quantidade total de itens no carrinho
 * @example
 * const totalItems = useCartStore(selectCartTotalItems);
 * // Retorna: 3 (se há 2 camisetas + 1 regata)
 */
export const selectCartTotalItems = (state: CartState) => {
  return state.items.reduce((total, item) => total + item.quantity, 0);
};

/**
 * Seletor: Pegar valor total do carrinho
 * @example
 * const subTotal = useCartStore(selectCartSubTotal);
 * // Retorna: 299.90 (valor em BRL)
 */
export const selectCartSubTotal = (state: CartState) => {
  return state.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
};

// ============================================================================
// USO NOS COMPONENTES - EXEMPLOS
// ============================================================================

/**
 * ✅ CORRETO - Usar seletores
 * 
 * export default function Navbar() {
 *   const totalItems = useCartStore(selectCartTotalItems);
 *   return <span>{totalItems}</span>;
 * }
 * 
 * Re-renderiza APENAS quando items muda ✅
 */

/**
 * ❌ ERRADO - Usar state direto sem seletor
 * 
 * export default function Navbar() {
 *   const { items } = useCartStore();
 *   return <span>{items.length}</span>;
 * }
 * 
 * Re-renderiza quando tanto items quanto isOpen mudam ❌
 */

/**
 * ❌ ERRADO - Calcular dentro do componente
 * 
 * export default function Navbar() {
 *   const items = useCartStore((state) => state.items);
 *   const total = useMemo(() => {
 *     return items.reduce((acc, item) => acc + item.quantity, 0);
 *   }, [items]);
 *   return <span>{total}</span>;
 * }
 * 
 * Funciona mas é desnecessário - useMemo duplica o seletor ❌
 */

/**
 * ✅ CORRETO - Usar seletor memoizado do store
 * 
 * import { selectCartTotalItems } from '@/store/cart-store';
 * 
 * export default function Navbar() {
 *   const totalItems = useCartStore(selectCartTotalItems);
 *   return <span>{totalItems}</span>;
 * }
 * 
 * Simples, elegante, performático ✅
 */
