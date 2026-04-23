# 📸 MANUAL MESTRE: Fotografia IA Hooke (Elite Standard)

Este documento consolida as diretrizes, prompts e o pipeline técnico absoluto para a geração de ativos visuais da Hooke Store. O objetivo é garantir 100% de fidelidade ao produto físico e à identidade biométrica dos modelos oficiais.

---

## 🏛️ 1. CONTEXTO MESTRE (UNISEX)
*Este bloco deve ser injetado no início de cada interação com a IA para calibrar a "vibe" do atelier.*

**Prompt de Contexto:**
> Atue como Diretor de Fotografia de Moda de Luxo para a Hooke Store. 
> DIRETRIZ DE OURO: Fidelidade absoluta ao produto físico. Não estilize, não simplifique as costuras.
> ILUMINAÇÃO ATELIER: Softbox multidirecional, sombras orgânicas e profundidade real (DOF). 
> ESTÉTICA: Minimalista, industrial chic, concreto, luz de claraboia ou estúdio cinza fosco.
> ZERO EFEITO PLÁSTICO: Pele humana real com poros, textura natural e micro-imperfeições.

---

## 🛡️ 2. SQUAD ALPHA: LINHA MASCULINA
*Foco: Porte imponente, barba bem cuidada e densidade têxtil (Fernando Luiz Jr).*

### A. Retrato Frontal (Fidelidade Facial)
**Prompt:**
```text
Ultrarrealistic portrait of the specific man in the reference (absolute facial and beard authenticity). High-end fashion studio. Soft cinematic lighting highlighting skin texture (not smooth, real skin pores visible). He is wearing the [DESCRIÇÃO_DA_ROUPA] with heavy 320g cotton texture. The collar must be thick and perfectly structured as in the physical reference. Square aspect ratio.
```

### B. Caimento Boxy (Estrutura da Roupa)
**Prompt:**
```text
Full body shot of the reference man. Standing confidently. Focus on the heavy drape of the [DESCRIÇÃO_DA_ROUPA]. The fabric must look thick, dense, and premium. Highlights: Dropped shoulders, wide sleeves, and straight hemline. Lighting: Dramatic side lighting to show fabric thickness relief.
```

---

## 💃 3. SQUAD BETA: LINHA FEMININA
*Foco: Musa 001 (35 anos), modelagem Boxy Regular e luxo nos detalhes metálicos.*

### A. Movimento e Modelagem
**Prompt:**
```text
Ultrarrealistic editorial of Musa 001 wearing the [DESCRIÇÃO] set. FIT: Structured Boxy Regular (not oversized). POSE: Walking gracefully. Lighting: Soft cinematic studio light. Focus on the garment silhouette and the fluid drape of 230g Viscose. 8k.
```

### B. Macro Técnico (Gold Details)
**Prompt:**
```text
Macro fashion shot of the waist area. Show the elastic waistband and the drawstring with clearly visible gold-metallic tips. Fabric: Premium matte Viscose Lore Liso. High precision on textures and seams. 8k.
```

---

## 📐 4. PIPELINE TÉCNICO (SOP ELITE)
*Configuração recomendada para orquestradores (ComfyUI / Automatic1111).*

| Camada | Ferramenta | Função |
| :--- | :--- | :--- |
| **Modelo Base** | Flux.1 [dev] | Realismo fotográfico e luz de estúdio superior. |
| **Constraint** | ControlNet (Canny) | Trava a costura 1:1 baseada na foto da peça real. |
| **Identity** | IP-Adapter FaceID | Garante a biometria exata (Fernando ou Musa). |
| **Denoising** | 0.35 - 0.45 | Evita o efeito "boneca" e mantém poros reais na pele. |

---

## 🛑 5. PROTOCOLO DE VETO (QA)
Qualquer imagem deve ser descartada se apresentar:
1. **Pele Lisa Demais:** Sem poros ou textura natural.
2. **Gola Fina:** No masculino, a gola deve ser grossa (ribana pesada).
3. **Modelagem Errada:** No feminino, se parecer "sacão" (oversized), vetar. Deve ser Boxy Regular.
4. **Detalhes Metálicos Opacos:** Ponteiras douradas devem refletir luz como metal real.

---
**Assinado:** *Antigravity - AI Orchestrator*
