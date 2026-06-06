# 🎨 HOOKE DESIGN SYSTEM — Soft Brutalism

> **Filosofia**: Alta costura encontra a brutalidade tipográfica. Cada pixel carrega peso, cada interação tem personalidade. Zero arredondamento. Sombras que ancoram. Preto absoluto.

---

## Princípios Fundamentais

| Princípio | Regra |
|-----------|-------|
| **Cantos** | `border-radius: 0` em tudo. Sem exceção. |
| **Sombras** | Usar APENAS os tokens semânticos (`shadow-brutal-sm`, `shadow-brutal`, `shadow-brutal-lg`). **NUNCA** usar `shadow-[...]` arbitrário. |
| **Cores** | Escala monocromática Hooke (preto → cinza → paper). Verde apenas para preço e confirmação. |
| **Tipografia** | `Jost` para títulos/headings, `Inter` para corpo. Sempre `uppercase tracking-widest` em labels. |
| **Interações** | Hover "afunda" o elemento (translate + shadow menor). Active comprime (`scale-[0.98]`). |

---

## Tokens de Sombra

```css
/* shadow-brutal-sm → Micro-elementos, badges, estados de hover/focus */
box-shadow: 2px 2px 0px 0px #000;

/* shadow-brutal → Padrão. Botões, cards, inputs */
box-shadow: 4px 4px 0px 0px #000;

/* shadow-brutal-lg → Destaque. Modais, cards em evidência */
box-shadow: 8px 8px 0px 0px #000;
```

### Efeito "Afundar" (Press)
Todo elemento brutalist deve "afundar" no hover:
```
hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-brutal-sm
active:translate-x-[3px] active:translate-y-[3px] active:shadow-none
```

---

## Componentes Primitivos

### `<Button>`
**Localização**: `src/components/ui/button.tsx`

| Variante | Quando usar | Visual |
|----------|------------|--------|
| `luxury` | Ações secundárias, links elegantes | Fundo cinza, hover inverte p/ preto |
| `brutalist` | Ações que precisam de peso visual (CTA secundário) | Borda 2px + sombra que afunda |
| `outline` | Seletores (tamanhos, filtros) | Contorno sutil |
| `ghost` | Ações terciárias (fechar, voltar) | Transparente |
| `buy` | **"COMPRAR AGORA"** — CTA principal de conversão | Preto sólido, hover escurece |
| `checkout` | **"FINALIZAR"** — Confirmação de compra | Verde sólido |
| `destructive` | Ações perigosas (deletar) | Vermelho sólido |
| `link` | Inline dentro de textos | Sublinhado |

**Tamanhos**: `xs` (badges) → `sm` → `md` (padrão) → `lg` → `xl` (CTAs principais) → `fab` (floating) → `icon` (quadrado)

```tsx
import { Button } from "@/components/ui/button"

// CTA de compra na vitrine
<Button variant="buy" size="lg" fullWidth>
  COMPRAR AGORA →
</Button>

// Seletor de tamanho
<Button variant={isSelected ? "buy" : "outline"} size="xs">
  M
</Button>

// Botão de fechar modal
<Button variant="ghost" size="icon">
  <X size={16} />
</Button>
```

---

### `<Input>`
**Localização**: `src/components/ui/input.tsx`

| Variante | Quando usar |
|----------|------------|
| `luxury` | Formulários de checkout/contato (padrão) |
| `brutalist` | Campos que precisam de peso visual (CEP, busca) |
| `ghost` | Campos dentro de cards já estilizados |

```tsx
import { Input } from "@/components/ui/input"

// Com label embutido
<Input variant="brutalist" label="CEP" placeholder="01311-200" />

// Sem label
<Input variant="luxury" placeholder="Nome completo" />
```

---

### `<Card>`
**Localização**: `src/components/ui/card.tsx`

| Variante | Quando usar |
|----------|------------|
| `luxury` | Cards de conteúdo editorial (padrão) |
| `brutalist` | Cards de destaque com sombra brutal |
| `ghost` | Cards invisíveis (para composição interna) |
| `product` | Cards de produto na vitrine (borda fina cinza) |

```tsx
import { Card, CardContent, CardFooter } from "@/components/ui/card"

<Card variant="product" className="p-2">
  <img src="..." />
  <CardContent>
    <h2>Camiseta Heavy Black</h2>
    <p>R$ 139,00</p>
  </CardContent>
  <CardFooter>
    <Button variant="buy" fullWidth>Comprar</Button>
  </CardFooter>
</Card>
```

---

## Regras de Ouro

### ✅ FAÇA
- Use os primitivos `<Button>`, `<Input>`, `<Card>` de `@/components/ui` para TODOS os elementos interativos
- Use os tokens `shadow-brutal-sm`, `shadow-brutal`, `shadow-brutal-lg` para sombras duras
- Use `shadow-editorial`, `shadow-subtle`, `shadow-glass` para sombras suaves
- Adicione `aria-label` em botões sem texto visível
- Use `tracking-widest uppercase font-bold text-[10px]` para labels/subtítulos

### ❌ NÃO FAÇA
- **NUNCA** escreva `shadow-[4px_4px_0px_0px_#000]` inline — use `shadow-brutal`
- **NUNCA** escreva `border-2 border-black` para estilo brutalist num botão — use `<Button variant="brutalist">`
- **NUNCA** crie um `<button>` nativo com classes Tailwind inline — use o componente `<Button>`
- **NUNCA** arredonde cantos (a menos que seja um FAB explícito)

---

## Mapa de Migração Pendente

Os seguintes arquivos ainda usam estilos inline e devem ser migrados progressivamente:

### Alta Prioridade (Visíveis ao cliente)
- [x] `GalleryCard.tsx` ✅ Migrado
- [x] `AddToCartSection.tsx` ✅ Migrado
- [x] `CartSidebar.tsx` ✅ Migrado
- [ ] `SsenseProductView.tsx` (33KB — componente mais pesado, precisa de sprint dedicada)
- [ ] `CheckoutForm.tsx` (22KB — sprint separada para evitar risco operacional)

### Média Prioridade (Admin)
- [ ] `InteractivePDV.tsx` (13 ocorrências de border-2 border-black)
- [ ] `admin/config/page.tsx` (21 ocorrências!)
- [ ] `AdminProductList.tsx`

### Baixa Prioridade (Estático/Marketing)
- [ ] `Footer.tsx`
- [ ] `Navbar.tsx`
- [ ] Landing pages (`/regatas`, `/treino`, `/bazar-vip-hooke`)

---

## Stack Técnica

| Dependência | Propósito |
|-------------|-----------|
| `class-variance-authority` (CVA) | Variantes tipadas para componentes |
| `clsx` | Merge condicional de classes |
| `tailwind-merge` | Resolve conflitos de classes Tailwind |
| `framer-motion` | Animações complexas (page transitions) |
| `lucide-react` | Ícones consistentes |
| `sonner` | Toasts/Notificações |

---

*Última atualização: Junho 2026*
*Mantido por: Equipe de Engenharia Hooke*
