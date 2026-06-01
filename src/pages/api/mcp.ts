import { NextApiRequest, NextApiResponse } from "next";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { CallToolRequestSchema, ListToolsRequestSchema, ErrorCode, McpError } from "@modelcontextprotocol/sdk/types.js";

// Desativa o buffer do Next.js para que o Server-Sent Events funcione
export const config = {
  api: {
    bodyParser: true,
    responseLimit: false,
    externalResolver: true,
  },
};

const server = new Server(
  { name: "hooke-store-mcp", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "consultar_estoque",
        description: "Consulta a grade de estoque",
        inputSchema: { type: "object", properties: { productId: { type: "string" } }, required: ["productId"] }
      },
      {
        name: "analisar_custo_frete",
        description: "Varre a tabela logística",
        inputSchema: { type: "object", properties: {} }
      }
    ]
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const toolName = request.params.name;
  if (toolName === "consultar_estoque") return { content: [{ type: "text", text: "Estoque ok" }] };
  if (toolName === "analisar_custo_frete") return { content: [{ type: "text", text: "Frete calculado" }] };
  throw new McpError(ErrorCode.MethodNotFound, "Unknown");
});

let transport: SSEServerTransport | null = null;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    console.log("[MCP] GET /api/mcp - Inicializando SSE");
    
    // Força os headers corretos para garantir que o stream não seja interrompido
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache, no-transform");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders(); // Garante o envio imediato

    transport = new SSEServerTransport("/api/mcp", res as any);
    await server.connect(transport as any);
    
    // Deixa a requisição pendente para manter o túnel aberto
    res.on("close", () => {
      console.log("[MCP] GET /api/mcp - Conexão fechada pelo cliente");
      transport = null;
    });
    return;
  }

  if (req.method === "POST") {
    if (!transport) {
      console.log("[MCP] POST recebido sem transporte ativo");
      return res.status(400).json({ error: "SSE não inicializado." });
    }
    
    // SSEServerTransport.handlePostMessage precisa de MessageBody se usarmos express, ou string
    // O Next.js já parseou em req.body como objeto.
    try {
      await transport.handlePostMessage(req as any, res as any, req.body);
    } catch (e) {
      console.error("[MCP] Erro no POST:", e);
      res.status(500).json({ error: "Internal Server Error" });
    }
    return;
  }

  res.status(405).json({ error: "Method Not Allowed" });
}
