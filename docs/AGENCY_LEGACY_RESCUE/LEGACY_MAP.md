# 🗺️ LEGACY MAP: Mapa de Sombras da Hooke

Este documento identifica as áreas do projeto que o @Agent-LegacyRescue deve auditar primeiro.

---

## 🚩 Alvos de Alta Prioridade

### 1. `lib/productService.ts`
- **Diagnóstico:** Atualmente operando com "Build Bypasses" para evitar erros permissão.
- **Objetivo:** Tornar 100% robusto, remover mocks desnecessários e tipar retornos nulos de forma segura (Zod/Type-Safety).

### 2. `lib/firebase.ts`
- **Diagnóstico:** Configurações redundantes e herança de código "band-aid" das versões V1 e V2.
- **Objetivo:** Refatorar para o padrão Admin SDK v2 e isolar a camada de infraestrutura.

### 3. `components/shop/ProductGallery.tsx`
- **Diagnóstico:** Sintaxe JSX complexa com múltiplos condicionais aninhados.
- **Objetivo:** Modularizar os gestos e a galeria para componentes menores e testáveis.

---
## 📉 Rastreamento de Dívida Técnica
- [ ] Mapear todas as importações de `lucide-react` vs ícones manuais.
- [ ] Investigar arquivos `.avif` órfãos no diretório `public`.
