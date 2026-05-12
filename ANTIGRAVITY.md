# 🛡️ HOOKE HQ: CONTEXTO E DIRETRIZES ELITE

Este arquivo contém o contexto permanente do projeto **Hooke Store**, servindo como fonte de verdade para a inteligência artificial (Antigravity) e desenvolvedores.

## 🧠 NÚCLEO IAGEMINI: ANTIGRAVITY
Como motor central de inteligência deste projeto, minhas responsabilidades são:
- **Análise de Mudanças**: Validar cada commit/alteração contra os padrões Elite.
- **Busca de Tendências**: Identificar padrões de mercado e tecnologias emergentes (ex: Next.js 16/React 19).
- **Sugestão de Melhorias**: Propor refatorações para manter a arquitetura limpa e performática.
- **Detecção de Riscos**: Antecipar quebras em caminhos críticos (Checkout, Cache, Sync).


## 🚀 1. STACK TECNOLÓGICA (V15.0 ELITE)
- **Frontend**: Next.js 16.2 (App Router), React 19.0.
- **Estilização**: Tailwind CSS 3.4 + Radix UI (Patterns).
- **Animações**: Framer Motion 12.0 (Motion Shield).
- **Estado**: Zustand 5.0 (Global) + TanStack Query 5.0 (Server-side Cache).
- **Backend/DB**: Firebase 12.9 (Client) + Firebase Admin SDK (Server).
- **Validação**: Zod (Blindagem de dados obrigatória).
- **Pagamentos**: Mercado Pago (Checkout Pro).
- **Infra**: Vercel (Analytics, Speed Insights, Edge Config).
- **PWA**: PWA completo via `@ducanh2912/next-pwa`.

## 🛠️ 2. PADRÕES DE CÓDIGO E ARQUITETURA
- **Blindagem de Dados (Zod)**: Todo dado vindo do Firestore **DEVE** passar pelo `ProductSchema` ou `OrderSchema` em `src/lib/schemas.ts`. Nunca confie no banco sem validação.
- **Revalidação Nativa (Elite)**: Substituir o foco em `unstable_cache` pelo padrão de revalidação nativa do Next.js. Utilizar `Server Actions` acopladas a `revalidateTag(tag)` para purga imediata do cache após mutações, garantindo consistência em tempo real.
- **Sincronização Offline-First**: Falhas de rede (especialmente no PDV) devem injetar transações em uma `Sync Queue` gerenciada no **Zustand** e persistida em **IndexedDB**. O sistema deve realizar retentativas automáticas e silenciosas assim que a conexão for restabelecida.
- **Feature-Based Design**: Organização por domínios em `src/features/` (ex: `radar`, `catalog`).
- **Server Actions**: Operações administrativas e mutações protegidas residem em `src/app/admin/actions/`.
- **Silent Failures**: Logs de auditoria (`audit.ts`) e falhas de cache não devem interromper a UX do usuário.
- **Elite Observability**: Integração total Sentry-GitHub. Cada build gera uma `Sentry Release` vinculada aos commits do GitHub para rastreamento preciso de bugs por versão.

## 📊 3. ARQUITETURA DE DADOS (FIRESTORE)
- **`produtos`**: Catálogo principal. Esquema rígido via `ProductSchema`.
- **`pedidos`**: Transações e rastreamento. Status: `pending`, `approved`, `cancelled`.
- **`coupons`**: Regras de descontos promocionais.
- **`concierge_sessions`**: Monitoramento de telemetria em tempo real (Radar).
- **`modelagens`, `estampas_tecidos`, `cores`**: Tabelas de suporte para o CMS.
- **`user_interactions`**: Registro de telemetria e comportamento do usuário (Cliques, favoritos).
- **Cérebro AI (Gemini Vision)**: O processamento do **Magic Studio** deve operar sob um System Prompt restrito à estética **'Quiet Luxury'**. O foco deve ser na engenharia da peça e na presença obrigatória da **Etiqueta Woven**. Retornos devem ser estritamente em **JSON** para evitar quebras de parsing.
- **`artifacts/hooke-standalone-pwa/users/admin_logs`**: Trilha de auditoria administrativa.

## 🎨 4. DECISÕES DE DESIGN (SOFT BRUTALIST)
- **Sharp Edges**: `borderRadius: 0px` em quase todos os componentes para um visual "cortante".
- **Fat Finger Exception**: Em áreas críticas de conversão mobile (**Bottom Navigation, FABs e Checkout PIX**), é obrigatório o uso de áreas de toque massivas (mínimo `min-h-[64px]`) e feedback tátil/visual imediato (`active:scale-95`), priorizando a conversão sobre a estética pura.
- **Pure Black**: `hooke-900` é `#000`. Contraste máximo.
- **Tipografia**: 
  - `Jost`: Títulos, logos e estados de urgência (Impacto).
  - `Inter`: Corpo de texto e dados técnicos (Legibilidade).
- **Micro-animações**: Transações suaves via Framer Motion, mas com gatilhos rápidos (0.2s - 0.4s).
- **Sombra Editorial**: Uso de sombras profundas e suaves para destacar cards sobre o fundo "Paper".

## 🛑 5. O QUE NÃO PODE QUEBRAR (CRITICAL PATHS)
- **Checkout Flow**: A integração entre Mercado Pago e a criação do documento em `pedidos`.
- **Filtros do Catálogo**: A lógica de renderização baseada em categorias/departamentos.
- **Admin Shield**: O acesso às rotas `/admin/*` deve sempre validar a claim `admin: true`.
- **PWA Offline**: O carrinho de compras e interações devem persistir localmente via `idb-keyval` (IndexedDB) antes da sincronização.

## 🎯 6. PRÓXIMAS PRIORIDADES
1.  **Refinamento do Catálogo**: Implementação de filtros avançados (tamanho, cor, faixa de preço).
2.  **Estabilização de Pagamentos**: Refinar Webhooks do Mercado Pago para lidar com expiração de Pix.
3.  **Magic Studio**: Integração total do motor de onboarding AI para novos produtos.
4.  **Radar V2**: Adicionar métricas de abandono de carrinho em tempo real no dashboard.

---
*Este documento deve ser atualizado sempre que uma decisão arquitetural de longo prazo for tomada.*
