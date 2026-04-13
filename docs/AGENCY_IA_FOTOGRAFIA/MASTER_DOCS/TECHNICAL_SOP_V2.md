# 📜 TECHNICAL SOP V2: IA Photography Super-Fidelity (Hooke Elite)

Este Procedimento Operacional Padrão (SOP) define o pipeline técnico absoluto para garantir que as fotos geradas por IA sejam indistinguíveis de fotografias reais.

---

## 🛠️ O Pipeline Técnico (A Pilha de Fidelidade)

Para atingir o padrão Elite, as Squads Alpha e Beta devem utilizar a seguinte configuração de software:

| Camada | Ferramenta Recomendada | Função |
| :--- | :--- | :--- |
| **Modelo Base** | Flux.1 [dev] ou SDXL 1.0 | Garante o realismo fotográfico e a luz de estúdio. |
| **Constraint Unit** | ControlNet (Canny ou Depth) | **Obrigatório.** Trava a silhueta da roupa 1:1. |
| **Identity Unit** | IP-Adapter FaceID v2 | Trava o rosto do modelo oficial (Fundador ou Musa). |
| **Texture Unit** | LoRA Específica (Textile) | Injeta a trama do tecido (ex: Suedine ou Viscose). |

---

## 📐 Operação Determinística (Passo a Passo)

### 1. Preparação da Amostra (Hardware Input)
1. **Foto RAW:** Tire uma foto da peça física em um fundo liso e bem iluminado.
2. **Máscara:** Crie uma máscara isolando apenas a roupa usando ferramentas como Segment Anything (SAM).
3. **Preprocessamento:** Use um preprocessador `Canny` ou `SoftEdge` para extrair as linhas de costura exatas da peça.

### 2. Configuração do Orquestrador (ComfyUI Workflow)
*   **Prompt de Gatilho:** Use as instruções do [MASTER_PROMPTS_V2.md](MASTER_PROMPTS_V2.md).
*   **ControlNet Strength:** Ajuste entre **0.7 e 0.9**. Se o valor for muito baixo, a IA vai "imaginar" novas costuras.
*   **Denoising Strength:** Para inpainting de rosto, mantenha em **0.35 - 0.45** para preservar a textura da pele original.

---

## 🛑 Protocolo de Veto (Agent-Growth)

Qualquer asset gerado será vetado se apresentar os seguintes "Sintomas de IA Baixa-Fidelidade":
1. **Dedo-de-Salsicha ou Anatomia Errada.**
2. **Pele Sem Poros:** Efeito "Airbrush" exagerado.
3. **Costura Inconsistente.**
4. **Logotipo Fantasma.**

---

## 🚀 Próximos Passos
Consulte sempre a pasta `BRAND_IDENTITY/` para as imagens de referência facial oficiais antes de iniciar qualquer renderização.

**Assinado:** *Antigravity - Orchestrator*
