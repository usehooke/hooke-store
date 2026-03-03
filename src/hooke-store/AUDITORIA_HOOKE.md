# Relatório de Auditoria Técnica - Hooke

**Data:** 19/02/2026
**Responsável:** CTO / QA Hooke

## 1. Fonte da Verdade (Catalogo.ts) vs Aplicação

A integridade dos dados está comprometida em algumas páginas de lançamento que utilizam configurações manuais (`hardcoded`) ao invés de consumir diretamente do `src/data/catalogo.ts`.

### 🚨 Inconsistências Críticas
*   **`src/app/lancamento/page.tsx`**:
    *   **Preços Hardcoded:** A constante `CONFIG.ofertas` define preços manualmente (ex: Kit 5 a R$ 225,90). Se o preço mudar no `catalogo.ts`, esta página **NÃO** será atualizada e venderá pelo preço errado.
    *   **Duplicidade de Dados:** Descrições de produtos e nomes estão redeclarados nesta página, gerando risco de divergência com o cadastro oficial.

### ✅ Pontos Positivos
*   **`src/app/regatas/page.tsx`**: Validado. Os preços estão sincronizados com a atualização recente do catálogo.
*   **`src/app/page.tsx` (Home)**: Consome corretamente `PRODUTOS` do catálogo.
*   **`src/app/colecao/page.tsx`**: Consome corretamente `PRODUTOS`.

---

## 2. Links e Navegação

### 🔗 Links Quebrados ou Placeholders
*   **`src/components/layout/Footer.tsx`**:
    *   Links Sociais (Instagram, Facebook, Twitter) apontam para `#`.
    *   Links Institucionais ("Trocas e Devoluções", "Guia de Medidas") apontam para `#`.
*   **`src/components/home/BentoHero.tsx`**:
    *   O link "Comprar Agora" no Hero principal aponta corretamente para `/produto/[slug]`, mas depende de uma lógica frágil de seleção de produtos.

---

## 3. Padrões de Código e Design (Clean Code)

### ⚠️ Oportunidades de Refatoração
*   **`src/components/home/BentoHero.tsx`**:
    *   **Lógica Frágil:** O código faz `mainProduct.name.replace("Camiseta", "").replace("Kit", "")` para ajustar o título visualmente. Isso é perigoso; se o nome do produto mudar para "T-Shirt", a lógica quebra. Sugestão: Adicionar um campo `shortName` no `catalogo.ts`.
    *   **Fallback Mágico:** Se não houver produtos com `featured: true`, ele pega os 3 primeiros. Isso pode colocar um produto indesejado (ex: uma meia) no banner principal sem aviso.

*   **`src/components/shop/ProductCard.tsx`**:
    *   **Parcelamento Hardcoded:** A lógica `const parcelas = 3;` está fixa no componente. Se a loja mudar para 6x sem juros, terá que editar arquivo por arquivo. Sugestão: Mover para `SITE_CONFIG` no `catalogo.ts`.

---

## 4. Plano de Ação Recomendado (Próximos Passos)

1.  **Centralização de Ofertas:**
    Refatorar `lancamento/page.tsx` para buscar preços e dados do `catalogo.ts` ou criar uma interface `OfferConfig` que valide os dados contra o catálogo.
2.  **Configuração Global de Parcelamento:**
    Mover a variável `parcelas` para `SITE_CONFIG` em `src/data/catalogo.ts` e consumir globalmente.
3.  **Correção de Links:**
    Mapear e criar as páginas institucionais faltantes (`/politica-de-trocas`, `/guia-medidas`) e atualizar o Footer.
4.  **Sanitização de Strings:**
    Remover a lógica de `.replace()` no frontend e garantir que os nomes no catálogo já estejam otimizados ou ter campos de "display name".

---
*Fim do Relatório*
