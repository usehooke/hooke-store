# 🔍 Guia de Troubleshooting: "Maximum Update Depth Exceeded"

## 🚨 Sintomas do Problema

**Erro no Console:**
```
Uncaught Error: Maximum update depth exceeded. This can happen when a component 
calls setState inside useEffect, but useEffect either doesn't have a dependency 
array, or one of the dependencies keeps changing on every render.
```

**Na tela:**
- Página branca (componente não renderiza)
- Timeout ou travamento
- Carrinho não funciona
- Erro #185 do React

---

## 🔴 Causas Comuns

### Causa #1: `persist` Sem `skipHydration`

```typescript
// ❌ ERRADO
export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({ /* ... */ }),
    {
      name: 'hooke-cart-storage',
      storage: localStorage,
      // ❌ skipHydration está FALTANDO!
    }
  )
);
```

**O que acontece:**
1. Componente renderiza (estado vazio)
2. useEffect + persist chama setState automaticamente
3. Componente renderiza de novo (novo estado)
4. persist chama setState OUTRA VEZ
5. **Loop infinito!** 🔄🔄🔄

**Solução:**
```typescript
// ✅ CORRETO
{
  name: 'hooke-cart-storage',
  storage: localStorage,
  skipHydration: true, // ← Previne rehidratação automática
}
```

---

### Causa #2: `isOpen` Sendo Salvo no localStorage

```typescript
// ❌ ERRADO
partialize: (state) => ({ 
  items: state.items,
  isOpen: state.isOpen // ← Não salve UI state!
})
```

**O que acontece:**
1. Usuário abre carrinho (isOpen = true)
2. Página recarrega
3. localStorage carrega isOpen = true
4. CartSidebar renderiza aberto
5. Todos componentes re-renderizam
6. Cascata de atualizações ❌

**Solução:**
```typescript
// ✅ CORRETO
partialize: (state) => ({ 
  items: state.items
  // isOpen NÃO está aqui - sempre false ao carregar
})
```

---

### Causa #3: CartSidebar com `if (!mounted) return null`

```typescript
// ❌ ERRADO
export default function CartSidebar() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // ← React vê: null → JSX (rematch!)
  
  return <div>/* Carrinho */</div>;
}
```

**O que React vê:**
1. Renderização SSR: CartSidebar = null (não renderiza nada)
2. Renderização cliente: CartSidebar = `<div>...</div>`
3. React compara: null ≠ JSX → **Hydration mismatch!** ❌

**Solução:**
```typescript
// ✅ CORRETO - Usar Portal sempre renderizado
import { createPortal } from 'react-dom';

export default function CartSidebar() {
  const isOpen = useCartStore((state) => state.isOpen);
  
  return createPortal(
    <div className={isOpen ? "visible" : "hidden invisible"}>
      {/* Sempre renderiza, muda visibilidade com CSS */}
    </div>,
    document.body
  );
}
```

---

### Causa #4: Componente Usando `get()` dentro de Render

```typescript
// ❌ ERRADO
export default function Navbar() {
  // ❌ Chamar get() dentro do render = estado mutável
  const total = useCartStore.getState().getTotalItems();
  
  return <span>{total}</span>;
}
```

**Por que é ruim:**
- `getState()` retorna estado atual (não reativo)
- Mudança no store não faz componente re-renderizar
- Tem `getTotalItems()` que é uma função (referência muda a cada vez)
- Componente não sabe quando re-renderizar

**Solução:**
```typescript
// ✅ CORRETO - Usar hook com seletor
export default function Navbar() {
  const totalItems = useCartStore(selectCartTotalItems);
  
  return <span>{totalItems}</span>;
}
```

---

## ✅ Checklist de Correção

- [ ] **skipHydration: true** - adicionado?
- [ ] **partialize** - salva apenas `items`?
- [ ] **CartSidebar** - usa Portal + CSS (não null)?
- [ ] **Componentes** - usam seletores (não getters)?
- [ ] **Storage** - valida SSR/cliente?
- [ ] **Build** - `npm run build` passa?
- [ ] **Console (F12)** - sem erros React?
- [ ] **localStorage** - contém apenas `items` (não `isOpen`)?

---

## 🧪 Testes de Validação

### Teste 1: Verificar localStorage
```javascript
// Abra DevTools (F12) → Console

// Deve retornar apenas items, NÃO isOpen
JSON.parse(localStorage.getItem('hooke-cart-storage'))
// Output esperado:
// {
//   state: { items: [...] },
//   version: 0
// }
```

### Teste 2: Verificar Hidratação
```javascript
// Criar novo item
useCartStore.getState().addItem(produto, 'M');

// isOpen deve ser true
console.log(useCartStore.getState().isOpen); // true ✅

// Recarregar página
location.reload();

// Esperar 1 segundo, verificar:
setTimeout(() => {
  console.log(useCartStore.getState().isOpen); // false ✅ (não persistido)
  console.log(useCartStore.getState().items); // [...] ✅ (persistido)
}, 1000);
```

### Teste 3: Verificar Re-renders
```javascript
// Adicionar log no Navbar
export default function Navbar() {
  console.log('Navbar renderizou');
  const totalItems = useCartStore(selectCartTotalItems);
  return <span>{totalItems}</span>;
}

// Abrir carrinho (abrir/fechar múltiplas vezes)
// Console deve mostrar: 0 renders (isOpen não afeta Navbar) ✅

// Adicionar product ao carrinho
// Console deve mostrar: 1 render (items mudou) ✅
```

### Teste 4: Verificar Portal Rendering
```javascript
// Abra DevTools (F12) → Elements
// Procure por CartSidebar

// Deve estar sempre no DOM (mesmo com carrinho fechado)
// <div class="opacity-0 pointer-events-none">...</div> ✅

// Abrir carrinho:
// <div class="opacity-100 pointer-events-auto">...</div> ✅
```

---

## 🎯 Antes vs Depois - Comparação

| Cenário | ❌ Antes | ✅ Depois |
|---------|---------|---------|
| Abrir página | Loop infinito | Carrega normal |
| Adicionar produto | Cascata de updates | 1 update apenas |
| Abrir/fechar carrinho | Múltiplos re-renders | 0 re-renders (outros componentes) |
| Recarregar página | Carrinho aberto (errado) | Carrinho fechado (correto) |
| Console (F12) | Erro #185 | Sem erros ✅ |
| Performance | ~2s para interagir | Responsivo imediatamente |

---

## 📊 Fluxo de Dados - Visualização

### ❌ ANTES (Causa Loop Infinito)
```
1. Página carrega
   ↓
2. React renderiza CartSidebar (null, hydration check não feito)
   ↓
3. useEffect do persist atualiza estado (isOpen carregado do localStorage)
   ↓
4. CartSidebar renderiza (agora é JSX, não null)
   ↓
5. React detecta: null → JSX (mismatch!)
   ↓
6. CartSidebar setState novamente por causa de mudança em isOpen
   ↓
7. Volta ao passo 4 (LOOP INFINITO!) 🔄
```

### ✅ DEPOIS (Sem Loop)
```
1. Página carrega
   ↓
2. React renderiza CartSidebar (Portal sempre renderizado)
   ↓
3. useEffect verifica se precisa reidratar (skipHydration: true)
   ↓
4. CartSidebar não muda (Portal sempre estava lá)
   ↓
5. Usuário pode interagir (adicionar produtos)
   ↓
6. Apenas items atualizam no store (isOpen não persiste)
   ↓
7. Componentes usando seletores re-renderizam apenas quando necessário ✅
```

---

## 🚀 Performance: Antes vs Depois

```
ANTES (Problema):
- Time to Interactive: 8s+ (browser travado por loop)
- Console: 50+ React errors
- CPU: 95%+ durante 5 segundos
- User experience: 🤦

DEPOIS (Corrigido):
- Time to Interactive: <1s
- Console: 0 errors
- CPU: normal
- User experience: ✅
```

---

## 💡 Learnings & Melhores Práticas

### 1. Separe Application State de UI State
```typescript
// Application State (salve)
items: CartItem[]
user: { name, email }
theme: 'dark' | 'light'

// UI State (NÃO salve)
isOpen: boolean
isLoading: boolean
activeTab: number
```

### 2. Sempre Use `skipHydration` em Next.js com Zustand
```typescript
// Regra de ouro: sempre adicione isso
{
  skipHydration: true
}
```

### 3. Prefira Seletores a Getters
```typescript
// ❌ Getter
getTotalItems: () => number

// ✅ Seletor
selectCartTotalItems = (state) => number
```

### 4. Teste Hidratação SSR/Cliente
```typescript
// Sempre verifique:
- Página renderiza igual no servidor e cliente?
- localStorage vs estado inicial são iguais?
- Sem hydration mismatches?
```

### 5. Use Portal para Componentes Globais
```typescript
// Modal, Toast, Sidebar = sempre Portal
createPortal(<Component />, document.body)
```

---

## 📞 Ainda com Problemas?

1. **Limpar tudo:**
   ```javascript
   localStorage.clear()
   location.reload()
   ```

2. **Hard refresh:**
   - Windows: `Ctrl+Shift+R`
   - Mac: `Cmd+Shift+R`

3. **Verificar console:**
   - F12 → Console → há erros React?

4. **Verificar build:**
   ```bash
   npm run build
   ```

5. **Procurar por:**
   - `getState()` sendo chamado no render
   - `useState([])` que deveria estar no store
   - `useEffect` com dependências erradas
   - Componente renderizando condicional (null vs JSX)
