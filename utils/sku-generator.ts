export const MODEL_DICTIONARY = {
  TSH: { label: "Camiseta Tradicional", shopeeCategory: "T-shirt Masculina", tiktokCategory: "T-shirt Masculina" },
  POR: { label: "Gola Portuguesa", shopeeCategory: "Camisa Polo", tiktokCategory: "Camisa Polo" },
  POL: { label: "Camisa Polo", shopeeCategory: "Camisa Polo", tiktokCategory: "Camisa Polo" },
  HEN: { label: "Gola Henley", shopeeCategory: "Camiseta Masculina", tiktokCategory: "Camiseta Masculina" },
  OVE: { label: "Oversized", shopeeCategory: "T-shirt Oversized", tiktokCategory: "T-shirt Oversized" },
  RAG: { label: "Raglan", shopeeCategory: "T-shirt Masculina", tiktokCategory: "T-shirt Masculina" },
  CAL: { label: "Calça Texturizada", shopeeCategory: "Calça Masculina", tiktokCategory: "Calça Masculina" },
} as const;

export type ModelSigla = keyof typeof MODEL_DICTIONARY;

interface SKUData {
  model: ModelSigla;
  print: string; // Estampa/Modelo (ex: MAV)
  color: string; // Cor (ex: BEG)
  size: string;  // Tamanho (ex: P)
}

/**
 * Gera o SKU no formato: [MODELAGEM]-[ESTAMPA]-[COR]-[TAMANHO]
 */
export function generateSKU({ model, print, color, size }: SKUData): string {
  const parts = [
    model.toUpperCase(),
    print.toUpperCase().substring(0, 3),
    color.toUpperCase().substring(0, 3),
    size.toUpperCase()
  ];
  
  return parts.join("-");
}

/**
 * Retorna as sugestões de marketplace baseadas na modelagem
 */
export function getMarketplaceMapping(model: ModelSigla) {
  return MODEL_DICTIONARY[model] || null;
}
