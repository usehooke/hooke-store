# 🚀 Zustand Speed Reference - Cheat Sheet

## 🎯 Regras de Ouro

```
1. ❌ NÃO salve UI state        → ✅ Salve application state APENAS
2. ❌ NÃO use persist auto     → ✅ Use skipHydration: true
3. ❌ NÃO renderize null→JSX   → ✅ Use Portal sempre
4. ❌ NÃO use get() em render  → ✅ Use hooks com seletores
5. ❌ NÃO chame getTotalItems  → ✅ Use selectCartTotalItems
```

---

## 📝 Template: Store com Persist

```typescript
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface StoreState {
  items: any[];
  isOpen: boolean;
  
  addItem: (item: any) => void;
  removeItem: (id: string) => void;
  openModal: () => void;
  closeModal: () => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set,Get) => ({
      items: [],
      isOpen: false,
      
      addItem: (item) => set((state) => ({ items: [...state.items, item] })),
      removeItem: (id) => set((state) => ({ 
        items: state.items.filter((item) => item.id !== id) 
      })),
      openModal: () => set({ isOpen: true }),
      closeModal: () => set({ isOpen: false }),
    }),
    {
      name: 'store-name',
      storage: createJSONStorage(() => {
        if (typeof window !== 'undefined') {
          return localStorage;
        }
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        };
      }),
      skipHydration: true, // ← IMPORTANTE!
      partialize: (state) => ({ items: state.items }), // ← Salvar apenas items
    }
  )
);

// Seletores
export const selectItems = (state: StoreState) => state.items;
export const selectItemCount = (state: StoreState) => state.items.length;
```

---

## 🎣 Template: Usar nos Componentes

### ✅ CORRETO
```typescript
import { selectItemCount } from '@/store';

export function MyComponent() {
  const count = useStore(selectItemCount);
  
  return <div>{count} items</div>;
}
```

### ❌ ERRADO
```typescript
export function MyComponent() {
  // ❌ Re-renderiza em TODA mudança do store
  const { items } = useStore();
  
  return <div>{items.length} items</div>;
}
```

### ❌ ERRADO
```typescript
export function MyComponent() {
  // ❌ Não é reativo, não funciona
  const count = useStore.getState().items.length;
  
  return <div>{count} items</div>;
}
```

---

## 🔧 Comparação: getter vs selector

| | getter | selector |
|--|--------|----------|
| Implementação | método no store | função fora do store |
| Reatividade | ✅ Reativo | ✅ Reativo |
| Performance | ❌ Re-calcula sempre | ✅ Memoizado |
| Manutenção | ❌ Polui store | ✅ Limpo |
| **Recomendação** | **Evite** | **Prefira** |

**Código:**
```typescript
// ❌ GETTER
export const useStore = create((set, get) => ({
  items: [],
  getTotalItems: () => get().items.length, // ← Getter (ruim)
}));

// ✅ SELECTOR
export const selectTotalItems = (state) => state.items.length; // ← Selector (bom)
```

---

## 🧮 Formula: Store Identity

```
Store = {
  State (o que guarda)
  + Actions (como muda)
  + Selectors (como lê)
}
```

**Exemplo:**
```typescript
// STATE
interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

// ACTIONS
addItem: (product: Product, size: string) => void;
removeItem: (cartItemId: string) => void;
openCart: () => void;
closeCart: () => void;

// SELECTORS
selectCartTotalItems = (state) => state.items.reduce(...);
selectCartSubTotal = (state) => state.items.reduce(...);
```

---

## 📊 Storage Strategy Matrix

| State | Persiste? | Por quê? |
|-------|-----------|---------|
| `items` | ✅ SIM | Dados críticos, usuário quer ver depois |
| `isOpen` | ❌ NÃO | UI state, confunde UX se lembrar |
| `selectedSize` | ✅ SIM (?)* | Depende: pode salvar draft de compra |
| `isLoading` | ❌ NÃO | UI state temporal, nunca persiste |
| `theme` | ✅ SIM | Preferência do usuário |
| `activeTab` | ❌ NÃO | Contexto UI, resetar é melhor |
| `user` | ✅ SIM | Dados críticos |
| `userPreferences` | ✅ SIM | Preferência do usuário |

*Em caso de dúvida: **não persista UI state**

---

## 🎯 Checklist: "Devo Persistir Isso?"

```
Pergunta 1: Perder esse dado quando recarregar é RUIM?
└─ SIM → Persista ✅
└─ NÃO → Não persista ❌

Pergunta 2: Esse dado muda FREQUENTEMENTE (a cada clique)?
└─ SIM → Não persista ❌ (é UI state)
└─ NÃO → Persista ✅

Pergunta 3: Lembrar desse estado depois melhora UX?
└─ SIM → Persista ✅
└─ NÃO → Não persista ❌
```

**Exemplo (isOpen):**
```
P1: Perder isOpen quando recarregar é RUIM?
R: NÃO - Carrinho deve começar fechado novamente

P2: isOpen muda frequentemente?
R: SIM - A cada clique em "abrir" / "fechar"

P3: Lembrar isOpen melhora UX?
R: NÃO - Carrinho aberto automaticamente é confuso

Resultado: ❌ NÃO PERSISTA
```

---

## 🚨 Erros Comuns & Soluções

### Erro 1: getCurrentState vs getState
```typescript
// ❌ ERRADO - método não existe
useStore.getCurrentState()

// ✅ CORRETO
useStore.getState()
```

### Erro 2: Esquecer de importar seletor
```typescript
// ❌ ERRADO
const total = useStore((state) => // ← Qual estado?

// ✅ CORRETO
import { selectCartTotalItems } from '@/store';
const total = useStore(selectCartTotalItems);
```

### Erro 3: Passar função ao invés de chamar
```typescript
// ❌ ERRADO
const total = useStore(state => selectCartTotalItems);

// ✅ CORRETO
const total = useStore(selectCartTotalItems);
```

### Erro 4: Combinar getState com hook
```typescript
// ❌ ERRADO - getState não é reativo
useEffect(() => {
  const items = useStore.getState().items;
  console.log(items); // Não vai atualizar quando items mudar
}, []);

// ✅ CORRETO
const items = useStore((state) => state.items);
useEffect(() => {
  console.log(items); // Atualiza quando items mudar
}, [items]);
```

---

## 🧪 Testes Essenciais

### Teste 1: Persistência
```typescript
test('items persistem no localStorage', () => {
  const store = useStore.getState();
  store.addItem(produto);
  
  localStorage. // localStorage tem items ✅
  location.reload();
  // items ainda estão lá ✅
});
```

### Teste 2: isOpen não persiste
```typescript
test('isOpen não persiste', () => {
  const store = useStore.getState();
  store.openCart();
  expect(store.isOpen).toBe(true);
  
  location.reload();
  // After reload:
  expect(store.isOpen).toBe(false); // ✅
});
```

### Teste 3: Seletor é reativo
```typescript
test('seletor é reativo', () => {
  let renders = 0;
  const unsubscribe = useStore.subscribe(
    selectCartTotalItems,
    () => renders++
  );
  
  useStore.getState().addItem(produto);
  expect(renders).toBe(1); // Re-subscribed 1 vez ✅
  
  useStore.getState().openCart();
  expect(renders).toBe(1); // Não re-subscribed (isOpen é ignorado) ✅
});
```

---

## 📱 Integração Next.js

### Dynamic Import
```typescript
// components/DynamicCart.tsx
import dynamic from 'next/dynamic';

const CartSidebar = dynamic(
  () => import('./CartSidebar'),
  { ssr: false } // ← NÃO renderizar no servidor
);

export default function DynamicCart() {
  return <CartSidebar />;
}
```

### Layout Root
```typescript
// app/layout.tsx
import DynamicCart from '@/components/DynamicCart';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Header />
        <DynamicCart /> {/* ← Dynamic import, não renderiza no servidor */}
        {children}
        <Footer />
      </body>
    </html>
  );
}
```

---

## 🎨 Portal Rendering Pattern

```typescript
import { createPortal } from 'react-dom';

export function Modal() {
  const isOpen = useStore((state) => state.isOpen);
  
  return createPortal(
    <div className={isOpen ? 'visible' : 'invisible'}>
      {/* Sempre renderiza, muda CSS */}
    </div>,
    document.body
  );
}
```

**Por que usar Portal:**
1. ✅ Renderiza sempre (sem hydration mismatch)
2. ✅ CSS controla visibilidade (não condicional JSX)
3. ✅ Evita z-index issues (no document.body)
4. ✅ Funciona com Next.js SSR

---

## 🔗 Dependências Recomendadas

```json
{
  "zustand": "^4.4.0",
  "immer": "^10.0.0"
}
```

**Opcional:**
```typescript
// Não precisa, mas é útil para mutações
import { immer } from 'zustand/middleware/immer';

const useStore = create<StoreState>()(
  immer(
    persist((set) => ({
      items: [],
      addItem: (item) => set((state) => {
        state.items.push(item); // Muta diretamente
      }),
    }), {
      /* config */
    })
  )
);
```

---

## 📞 Quick Links

| Tópico | Link |
|--------|------|
| Zustand Docs | https://github.com/pmndrs/zustand |
| Persist API | https://docs.pmnd.rs/zustand/integrations/persisting-store-data |
| TypeScript | https://docs.pmnd.rs/zustand/guides/how-to-use-with-typescript |
| Testing | https://docs.pmnd.rs/zustand/guides/testing |

---

## ✅ Resumo em 30 Segundos

```typescript
// 1. Criar store com persist
export const useStore = create<T>()(
  persist((set) => ({
    // state
    // actions
  }), {
    name: 'store-name',
    skipHydration: true,        // ← Importante!
    partialize: (s) => ({ ... }), // ← Salvar apenas o necessário
  })
);

// 2. Criar seletores
export const selectX = (s: T) => s.x;

// 3. Usar nos componentes
const x = useStore(selectX);

// 4. Pronto! 🎉
```

---

**Last Updated:** Feb 6, 2026
**Status:** ✅ Production Ready
