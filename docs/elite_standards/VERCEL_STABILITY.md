# Vercel Stability & Elite Standards (Bíblia do Build)

Este documento serve como a **Fonte da Verdade** para todas as validações de código na Hooke Store. O build da Vercel falhará se qualquer uma destas regras for violada.

## 1. Regras de Ouro (Build Killers)

### 1.1 Variáveis Não Utilizadas
- **Problema**: O ESLint da Vercel (`next/typescript`) proíbe terminantemente variáveis declaradas mas não utilizadas.
- **Ação**: SEMPRE remova variáveis, imports ou parâmetros de função que não estejam sendo usados. 
- **Check**: `npx tsc --noEmit` + `next lint`.

### 1.2 Tipagem `any`
- **Problema**: O uso de `any` desativa a segurança do TypeScript e é proibido nos Elite Standards.
- **Ação**: Use interfaces, tipos específicos ou `unknown`. 
- **Dica**: Se um objeto vem de uma fonte desconhecida, use um `interface` flexível ou um `Record<string, any>` (com cautela), mas nunca o tipo puro `any`.

### 1.3 Tags de Imagem Nativa `<img>`
- **Problema**: Causa perda de performance e alertas de SEO/LCP.
- **Ação**: Use EXCLUSIVAMENTE o componente `<Image>` do `next/image`.
- **Exceção**: Apenas em scripts de rastreamento (como `noscript` do Facebook Pixel).

### 1.4 Case Sensitivity (O Assassino Silencioso)
- **Problema**: Windows é case-insensitive, mas a Vercel (Linux) é case-sensitive. Importar `Header.tsx` como `./header` funciona localmente mas quebra no deploy.
- **Ação**: Garanta que o nome do arquivo e o import sejam IDÊNTICOS em capitularização.

## 2. Padrões de Qualidade Hooke Store

### 2.1 CSS & UI
- **Fonte**: Use `font-heading` (Outfit) para títulos e `font-sans` (Inter) para corpo de texto.
- **Bordas**: Seguimos o estilo "Sharp" (retangular). Evite `rounded-full` ou `rounded-lg` a menos que seja um ícone redondo ou avatar.
- **Cores**: Use o sistema de cores `hooke-X` definido no `tailwind.config.ts`.

### 2.2 Hooks & State
- **Dependências**: Nunca ignore o aviso de dependências do `useEffect`. Se o efeito precisa de uma variável, ela DEVE estar no array ou a lógica deve ser refatorada (memoização).

## 3. Comandos de Validação
Antes de fazer o push, execute:
```bash
npm run lint-elite
```
Se este comando passar com 100% de sucesso, o build na Vercel está 99% garantido.
