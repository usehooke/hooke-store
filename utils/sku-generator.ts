export const MODEL_DICTIONARY = {
  TSH: { label: "Tradicional Gola Careca", shopeeCategory: "T-shirt Masculina", tiktokCategory: "T-shirt Masculina" },
  TSV: { label: "Tradicional Gola V", shopeeCategory: "T-shirt Masculina", tiktokCategory: "T-shirt Masculina" },
  OVE: { label: "Oversized", shopeeCategory: "T-shirt Oversized", tiktokCategory: "T-shirt Oversized" },
  POL: { label: "Polo", shopeeCategory: "Camisa Polo", tiktokCategory: "Camisa Polo" },
  HEN: { label: "Henley", shopeeCategory: "Camiseta Masculina", tiktokCategory: "Camiseta Masculina" },
  MAC: { label: "Regata Machão", shopeeCategory: "Regata Masculina", tiktokCategory: "Regata Masculina" },
  CAV: { label: "Regata Cavada", shopeeCategory: "Regata Masculina", tiktokCategory: "Regata Masculina" },
  CAL: { label: "Calça Texturizada", shopeeCategory: "Calça Masculina", tiktokCategory: "Calça Masculina" },
} as const;

export const PRINT_DICTIONARY = {
  MAV: { label: "Maverick" },
  POR: { label: "Portugal" },
  FSK: { label: "Fusca / Kombi" },
  TEX: { label: "Texturizado", weight: 450 }, // Peso diferenciado
  CAN: { label: "Canelado", weight: 350 },     // Peso diferenciado
  HK1: { label: "Hooke 001" },
} as const;

export const COLOR_DICTIONARY = {
  PRE: { label: "Preta" },
  BRA: { label: "Branca" },
  OFF: { label: "Off White" },
  AZU: { label: "Azul" },
  ROY: { label: "Azul Royal" },
  VER: { label: "Verde" },
  AZE: { label: "Azeitona" },
  AMA: { label: "Amarelo" },
  VMH: { label: "Vermelho" },
  MAR: { label: "Marrom" },
  BOR: { label: "Bordo" },
  ARE: { label: "Areia" },
  CRM: { label: "Caramelo" },
  MCL: { label: "Mescla Claro" },
  MES: { label: "Mescla Escuro" },
} as const;

export type ModelSigla = keyof typeof MODEL_DICTIONARY;
export type PrintSigla = keyof typeof PRINT_DICTIONARY;
export type ColorSigla = keyof typeof COLOR_DICTIONARY;

interface SKUData {
  model: ModelSigla;
  print: PrintSigla | string; // Estampa/Modelo (ex: MAV)
  color: ColorSigla | string; // Cor (ex: BEG)
  size: string;  // Tamanho (ex: P)
}

/**
 * Gera o SKU no formato: [MODELAGEM]-[ESTAMPA]-[COR]-[TAMANHO]
 */
export function generateSKU({ model, print, color, size }: SKUData): string {
  const parts = [
    model.toUpperCase(),
    print.toUpperCase(),
    color.toUpperCase(),
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
