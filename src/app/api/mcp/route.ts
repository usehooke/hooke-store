import { NextResponse } from 'next/server';

// Usaremos um mock de dados para o teste inicial gratuito
const mockDb = {
  "CAM-VINT-FUSCA-PTO": {
    name: "Camiseta Vintage Fusca Preto",
    stock: { P: 10, M: 5, G: 0 },
    totalStock: 15
  }
};

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 1. Handshake inicial do protocolo MCP (Listagem de Ferramentas)
    if (body.method === 'tools/list') {
      return NextResponse.json({
        tools: [
          {
            name: 'consultar_estoque',
            description: 'Consulta a grade de estoque atualizada de um produto no Firestore pelo ID.',
            inputSchema: {
              type: 'object',
              properties: {
                productId: { type: 'string', description: 'Ex: CAM-VINT-FUSCA-PTO' }
              },
              required: ['productId']
            }
          },
          {
            name: 'analisar_custo_frete',
            description: 'Varre a tabela logística e as especificações de peso de tecidos cadastrados.',
            inputSchema: { type: 'object', properties: {} }
          }
        ]
      });
    }

    // 2. Orquestração e execução de chamadas de ferramentas (Call Tool)
    if (body.method === 'tools/call') {
      const { name, arguments: args } = body.params;

      if (name === 'consultar_estoque') {
        const data = mockDb[args.productId as keyof typeof mockDb];
        
        if (!data) {
          return NextResponse.json({ content: [{ type: 'text', text: 'Produto não encontrado na base.' }] });
        }

        return NextResponse.json({
          content: [{ type: 'text', text: `Grade atual de ${data.name}: ${JSON.stringify(data.stock)}. Total: ${data.totalStock} un.` }]
        });
      }

      if (name === 'analisar_custo_frete') {
        // Puxa as regras de gramatura e peso padrão para auditoria
        return NextResponse.json({
          content: [{ type: 'text', text: 'Algodão Heavyweight: 320g | Viscose Nobre: 550g | Cubagem base: 25x20x2cm.' }]
        });
      }
    }

    return NextResponse.json({ error: 'Método MCP não implementado.' }, { status: 404 });

  } catch (error: any) {
    console.error('[MCP Server Fault]:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
