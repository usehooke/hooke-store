const TINY_API_TOKEN = process.env.TINY_API_TOKEN;
const TINY_API_URL = "https://api.tiny.com.br/api2";

export class TinyClient {
  private static async post(endpoint: string, data: Record<string, unknown>) {
    const formData = new URLSearchParams();
    formData.append("token", TINY_API_TOKEN || "");
    formData.append("formato", "json");
    
    for (const [key, value] of Object.entries(data)) {
        const val = typeof value === 'object' ? JSON.stringify(value) : String(value);
        formData.append(key, val);
    }

    const response = await fetch(`${TINY_API_URL}${endpoint}`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Tiny API Error: ${response.statusText}`);
    }

    return response.json();
  }

  // Baixa de estoque (Sincronização)
  static async updateStock(sku: string, quantity: number, depositoId?: string) {
    return this.post("/produto.atualizar.estoque.php", {
      id: sku, // Tiny pode usar SKU ou ID interno
      quantidade: quantity,
      tipo: "S", // 'S' para Saída, 'E' para Entrada
      idDeposito: depositoId,
    });
  }

  // Obter saldo de estoque
  static async getStock(sku: string) {
    return this.post("/produto.obter.estoque.php", {
      id: sku,
    });
  }

  // Incluir novo produto (Cadastro Mestre)
  static async createProduct(productData: Record<string, unknown>) {
    return this.post("/produto.incluir.php", {
      produto: productData
    });
  }
}
