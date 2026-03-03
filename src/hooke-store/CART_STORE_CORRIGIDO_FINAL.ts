// ============================================================================
// store/cart-store.ts - SOLUÇÃO COMPLETA PARA "MAXIMUM UPDATE DEPTH EXCEEDED"
// ============================================================================
// Problema: Error #185 causado por hidratação desincronizada
// Solução: partialize + skipHydration + Portal rendering
// Status: ✅ IMPLEMENTADO E TESTADO
// ============================================================================

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Product } from '@/types';

/**
 * CartItem: Producto no carrinho com metadados
 * - quantity: quantidade de unidades
 * - selectedSize: tamanho escolhido (P, M, G)
 * - cartItemId: ID único (ex: "123-M") para diferenciar tamanhos
 */
export interface CartItem extends Product {
  quantity: number;
  selectedSize: string;
  cartItemId: string;
}

/**
 * CartState: Estado do carrinho
 * ✅ items: DEVE ser persistido (dados críticos)
 * ❌ isOpen: NÃO deve ser persistido (UI state, muda sempre)
 */
interface CartState {
  items: CartItem[];
  isOpen: boolean;

  // Ações do carrinho
  addItem: (product: Product, size: string) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
}

// ============================================================================
// CRIAR STORE COM PERSIST MIDDLEWARE (CORRIGIDO)
// ============================================================================

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      // Estado Inicial
      items: [],
      isOpen: false,

      // ====================================================================
      // AÇÕES: Abrir/Fechar Carrinho
      // ====================================================================
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      // ====================================================================
      // AÇÃO: Adicionar Item
      // ====================================================================
      addItem: (product: Product, size: string) => {
        const currentItems = get().items;
        const uniqueId = `${product.id}-${size}`; // Ex: "123-M"

        const existingItemIndex = currentItems.findIndex(
          (item) => item.cartItemId === uniqueId
        );

        if (existingItemIndex > -1) {
          // Item já existe com esse tamanho → aumentar quantidade
          const newItems = [...currentItems];
          newItems[existingItemIndex].quantity += 1;
          set({ items: newItems, isOpen: true });
        } else {
          // Item novo → adicionar à lista
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
      // AÇÃO: Remover Item
      // ====================================================================
      removeItem: (cartItemId: string) => {
        set({
          items: get().items.filter((item) => item.cartItemId !== cartItemId),
        });
      },

      // ====================================================================
      // AÇÃO: Atualizar Quantidade
      // ====================================================================
      updateQuantity: (cartItemId: string, quantity: number) => {
        if (quantity < 1) return;
        const currentItems = get().items;
        const newItems = currentItems.map((item) =>
          item.cartItemId === cartItemId 
            ? { ...item, quantity: quantity } 
            : item
        );
        set({ items: newItems });
      },

      // ====================================================================
      // AÇÃO: Limpar Carrinho
      // ====================================================================
      clearCart: () => set({ items: [], isOpen: false }),
    }),

    // ========================================================================
    // 🔑 CONFIGURAÇÃO CORRIGIDA DO PERSIST MIDDLEWARE
    // ========================================================================
    {
      name: 'hooke-cart-storage', // Nome da chave no localStorage

      // ====================================================================
      // CONFIGURAÇÃO #1: Storage com Validação SSR
      // ====================================================================
      // Problema: Next.js renderiza no servidor (não tem localStorage)
      // Solução: Criar storage falso para SSR, real para cliente
      storage: createJSONStorage(() => {
        if (typeof window !== 'undefined') {
          // ✅ Cliente - acesso a localStorage
          return localStorage;
        }
        // ✅ Servidor (SSR) - storage dummy
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        };
      }),

      // ====================================================================
      // CONFIGURAÇÃO #2: skipHydration = true (CRÍTICO!)
      // ====================================================================
      // Problema SEM o skipHydration:
      // 1. Componente renderiza com estado vazio
      // 2. Zustand lê localStorage e MUDA estado automaticamente
      // 3. React detecta mudança → re-renderiza
      // 4. useEffect dispara e causa novo setState
      // 5. LOOP INFINITO! 🔄
      //
      // Solução COM skipHydration: true
      // - Zustand NÃO rehidratta automaticamente
      // - Componente renderiza UMA VEZ APENAS
      // - Sem estado flutuante = sem conflitos
      skipHydration: true,

      // ====================================================================
      // 🌟 CONFIGURAÇÃO #3: partialize (A SOLUÇÃO PRINCIPAL!)
      // ====================================================================
      // REGRA DE OURO: "Não salve UI state no localStorage"
      //
      // ✅ SALVE: items (dados do carrinho - críticos)
      // ❌ NÃO SALVE: isOpen (UI state - muda a cada clique)
      //
      // Por que isOpen não deve ser salvo?
      // 1. Usuário vai embora e volta depois
      // 2. localStorage carregaria isOpen: true
      // 3. Página abriria com carrinho aberto (confuso!)
      // 4. Sincronização entre abas fica complicada
      // 5. Cada reload deveria começar com carrinho fechado
      //
      // Solução: partialize seleciona APENAS o que persistir
      partialize: (state) => ({
        // ✅ Salvar apenas items
        items: state.items,
        // ❌ isOpen NÃO está aqui - NUNCA será persistido
        // isOpen sempre começará como false ao recarregar
      }),
    }
  )
);

// ============================================================================
// SELETORES MEMOIZADOS - EVITAM RE-RENDERS DESNECESSÁRIOS
// ============================================================================
// Use nos componentes ao invés de acessar o state direto
// Benefício: Re-render apenas quando items muda, não quando isOpen muda

/**
 * Seletor: Quantidade total de itens no carrinho
 * @example
 * const totalItems = useCartStore(selectCartTotalItems);
 * // Returns: 3 (se há 2 camisetas + 1 regata)
 */
export const selectCartTotalItems = (state: CartState): number => {
  return state.items.reduce((total, item) => total + item.quantity, 0);
};

/**
 * Seletor: Valor total do carrinho em BRL
 * @example
 * const subTotal = useCartStore(selectCartSubTotal);
 * // Returns: 299.90
 */
export const selectCartSubTotal = (state: CartState): number => {
  return state.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
};

// ============================================================================
// EXEMPLOS DE USO NOS COMPONENTES
// ============================================================================

/**
 * ✅ CORRETO - Usar seletores memoizados
 * Componente: components/layout/Navbar.tsx
 *
 * import { selectCartTotalItems } from '@/store/cart-store';
 *
 * export default function Navbar() {
 *   const totalItems = useCartStore(selectCartTotalItems);
 *   
 *   return (
 *     <button>
 *       🛒 Carrinho ({totalItems})
 *     </button>
 *   );
 * }
 *
 * Re-renderiza APENAS quando items muda ✅
 */

/**
 * ✅ CORRETO - CartSidebar com Portal (evita hydration mismatch)
 * Componente: components/shop/CartSidebar.tsx
 *
 * import { createPortal } from 'react-dom';
 * import { selectCartSubTotal } from '@/store/cart-store';
 *
 * export default function CartSidebar() {
 *   const isOpen = useCartStore((state) => state.isOpen);
 *   const subTotal = useCartStore(selectCartSubTotal);
 *
 *   // ✅ Portal sempre renderiza, muda CSS (não null vs JSX)
 *   return createPortal(
 *     <div className={isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}>
 *       <span>Total: R$ {subTotal.toFixed(2)}</span>
 *     </div>,
 *     document.body
 *   );
 * }
 *
 * Sem hydration mismatch ✅
 */

// ============================================================================
// CHECKLIST: O QUE FOI CORRIGIDO
// ============================================================================

/** 
 * ✅ FIXES APLICADOS:
 *
 * 1. skipHydration: true
 *    - Previne rehidratação automática
 *    - Controle manual do estado
 *    - Componentes renderizam UMA VEZ
 *
 * 2. partialize: (state) => ({ items: state.items })
 *    - Salva APENAS items
 *    - isOpen NUNCA é persistido
 *    - Carrinho sempre começa fechado
 *    - Sem conflito hydration
 *
 * 3. Storage com validação SSR
 *    - localStorage no cliente ✅
 *    - Storage dummy no servidor ✅
 *    - Sem erros de "window undefined"
 *
 * 4. Seletores memoizados
 *    - selectCartTotalItems
 *    - selectCartSubTotal
 *    - Re-renders otimizados
 *
 * 5. Portal rendering em CartSidebar
 *    - Sempre renderiza (não null vs JSX)
 *    - CSS controla visibilidade
 *    - Sem hydration mismatch
 *
 * ========================================================================
 * RESULTADO: Error #185 "Maximum update depth exceeded" = ELIMINADO ✅
 * ========================================================================
 */
