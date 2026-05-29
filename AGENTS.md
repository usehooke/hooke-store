# Hooke Store Governança e Inteligência Artificial

## 🧠 DIRETRIZES DO MOTOR HERMES AGENT (ORANGE BOOK ANCHOR)
- Sempre que instruído a modificar ou dar manutenção na rota `/api/agent`, no arquivo `tools/hooke_tools.py`, ou nas configurações agênticas, você DEVE ler e consultar o arquivo de referência técnica localizado em: `docs/architecture/hermes/Hermes-Agent-The-Complete-Guide-v260407.pdf`.
- Siga rigorosamente a semântica de 'Learning Loop' (O agente constrói suas próprias rédeas), a arquitetura de 'Three-Layer Memory' (SQLite + FTS5) e os limites de truncamento de saída de ferramentas (`tool_output.max_bytes`) descritos no manual.
- Garanta que toda nova ferramenta integrada chame `registry.register()` no momento da importação, conforme documentado no fluxo de dados do subsistema core do Hermes.
