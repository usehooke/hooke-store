import express from 'express';
import cors from 'cors';
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { CallToolRequestSchema, ListToolsRequestSchema, ErrorCode, McpError } from "@modelcontextprotocol/sdk/types.js";

const app = express();
app.use(cors());

const server = new Server(
  { name: "hooke-store-mcp", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "consultar_estoque",
        description: "Consulta a grade de estoque atualizada de um produto no Firestore pelo ID.",
        inputSchema: { type: "object", properties: { productId: { type: "string" } }, required: ["productId"] }
      },
      {
        name: "analisar_custo_frete",
        description: "Varre a tabela logística e as especificações de peso.",
        inputSchema: { type: "object", properties: {} }
      }
    ]
  };
});

const mockDb = {
  "CAM-VINT-FUSCA-PTO": { name: "Camiseta Vintage Fusca Preto", stock: { P: 10, M: 5, G: 0 }, totalStock: 15 }
};

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const toolName = request.params.name;
  const args = request.params.arguments || {};
  if (toolName === "consultar_estoque") {
    const { productId } = args;
    const data = mockDb[productId];
    if (!data) return { content: [{ type: 'text', text: 'Produto não encontrado na base.' }] };
    return { content: [{ type: "text", text: `Grade atual de ${data.name}: ${JSON.stringify(data.stock)}. Total: ${data.totalStock} un.` }] };
  }
  if (toolName === "analisar_custo_frete") {
    return { content: [{ type: "text", text: 'Algodão Heavyweight: 320g | Viscose Nobre: 550g | Cubagem base: 25x20x2cm.' }] };
  }
  throw new McpError(ErrorCode.MethodNotFound, `Ferramenta desconhecida: ${toolName}`);
});

let transport = null;

app.get('/api/mcp', async (req, res) => {
  console.log("Client connected to SSE stream");
  transport = new SSEServerTransport("/api/mcp", res);
  await server.connect(transport);
});

// Precisa passar req.body porque express.json() consome o stream
app.post('/api/mcp', express.json(), async (req, res) => {
  if (!transport) {
    return res.status(400).json({ error: "SSE não inicializado." });
  }
  try {
    await transport.handlePostMessage(req, res, req.body);
  } catch (err) {
    console.error("Error processing message:", err);
    res.status(500).json({ error: "Erro interno do servidor MCP" });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`MCP Server Express rodando nativamente na porta ${PORT}`);
});
