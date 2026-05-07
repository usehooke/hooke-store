# 🗺️ MAPA DE ARQUEOLOGIA VISUAL: Operação AVIF Elite

Este mapa identifica os ativos que precisam de intervenção para elevar a Hooke ao padrão **Zero Latency**.

---

## 🔴 1. ATIVOS LEGADOS EM USO (Urgente)
Estes arquivos estão ativos no `catalogo.ts`, mas usam formatos obsoletos (.jpg/.png).
**Missão para o Art Director:** Converter para AVIF (Max 150kb por imagem).

| Caminho | Tamanho Atual | Prioridade |
| :--- | :--- | :--- |
| `/produtos/camiseta-regata-canelada-verde-1.jpg` | 68KB | Alta (Home) |
| `/produtos/camiseta-regata-canelada-areia-1.jpg` | 54KB | Média |
| `/assets/femme/musas_001_forest_fit.png` | 477KB | **Crítica** (Femme) |
| `/assets/femme/musas_001_navy_focus.png` | 562KB | **Crítica** (Femme) |
| `/images/guia-medidas-camiseta.png` | 102KB | Alta (UX) |
| `/lookbook/HK_ELITE_FOUNDER_CAFE.png` | 726KB | Alta (Editorial) |
| `/lookbook/v1-7-1/marrom.jpg` | 223KB | Média (Lookbook) |
| `/lookbook/v1-7-1/puff.jpg` | 231KB | Média (Lookbook) |

---

## ⚠️ 2. ZONAS DE RISCO (Performance Crítica)
Estes arquivos já estão em AVIF, mas possuem um peso grotesco que trava o LCP (Largest Contentful Paint).
**Missão para o Art Director:** Re-comprimir mantendo a estética, visando redução de 90% no peso.

| Caminho | Tamanho Atual | Problema |
| :--- | :--- | :--- |
| `/hero-preta.avif` | **4.3 MB** | Bloqueia o carregamento inicial da Home |
| `/hero-verde.avif` | **4.1 MB** | Bloqueia o carregamento inicial da Home |
| `/produtos/old/Hooke-Regata-Canelada-Verde.avif` | 4.1 MB | Arquivo legado gigante |

---

## 🧹 3. STATUS DA PURGA (Arquivamento Offline)
Ativos órfãos e legados foram retirados do perímetro do projeto para garantir o "Zero Debt" no repositório.

- **[STATUS: CONCLUÍDO]** `public/produtos/old/` -> Movido para `C:\Users\Nando\Documents\Hooke_site_LEGACY_OFFLINE`
- **[AÇÃO PARA O ART DIRECTOR]** Analisar `public/lookbook/v1-7-1/` para conversão ou deleção.

---
**Assinado:** *Agent-LegacyRescue - Arqueólogo de Código*
