# Hooke Store Governança e Inteligência Artificial

## 🧠 DIRETRIZES DO MOTOR HERMES AGENT (ORANGE BOOK ANCHOR)
- Sempre que instruído a modificar ou dar manutenção na rota `/api/agent`, no arquivo `tools/hooke_tools.py`, ou nas configurações agênticas, você DEVE ler e consultar o arquivo de referência técnica localizado em: `docs/architecture/hermes/Hermes-Agent-The-Complete-Guide-v260407.pdf`.
- Siga rigorosamente a semântica de 'Learning Loop' (O agente constrói suas próprias rédeas), a arquitetura de 'Three-Layer Memory' (SQLite + FTS5) e os limites de truncamento de saída de ferramentas (`tool_output.max_bytes`) descritos no manual.
- Garanta que toda nova ferramenta integrada chame `registry.register()` no momento da importação, conforme documentado no fluxo de dados do subsistema core do Hermes.

## 🛠️ REGRAS DE ENGENHARIA E CONTEXTO DA HOOKE STORE
- **Stack Técnico:** O repositório opera em Next.js (App Router), e todas as validações de input ou banco de dados devem obrigatoriamente passar por Zod.
- **Identidade Visual:** Design Minimalista e Soft Brutalism. Interface premium, de alto impacto, evitando componentes padrão do navegador ou paletas genéricas.
- **Regras de Produto:** Golas das camisetas possuem 3cm de espessura (caneladas), e as malhas pesadas são de 260g (Heavyweight).
- **Semântica:** Todo conteúdo voltado ao usuário deve ser mantido em Português Brasileiro (PT-BR), com tom estratégico, refinado e focado na estética de "alta costura" da marca.
