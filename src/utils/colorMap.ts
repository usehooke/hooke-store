export const COLOR_FAMILY_MAP: Record<string, string> = {
  "preto": "Preto",
  "branco": "Branco",
  "off-white": "Off-White",
  "off white": "Off-White",
  "cinza": "Cinza",
  "chumbo": "Cinza",
  "mescla": "Cinza",
  "prata": "Cinza",
  "azul": "Azul",
  "azul marinho": "Azul",
  "azul bebê": "Azul",
  "azul petróleo": "Azul",
  "azul claro": "Azul",
  "areia": "Areia",
  "bege": "Areia",
  "caqui": "Areia",
  "nude": "Areia",
  "ferrugem": "Ferrugem",
  "mostarda": "Amarelo",
  "amarelo": "Amarelo",
  "verde": "Verde",
  "verde musgo": "Verde",
  "verde militar": "Verde",
  "vermelho": "Vermelho",
  "bordo": "Vermelho",
  "vinho": "Vermelho",
  "rosa": "Rosa",
  "marrom": "Marrom",
};

export function getColorFamily(colorName?: string): string {
  if (!colorName) return "Outros";
  const normalized = colorName.toLowerCase().trim();
  
  // Tenta match exato primeiro
  if (COLOR_FAMILY_MAP[normalized]) return COLOR_FAMILY_MAP[normalized];
  
  // Tenta match parcial (ex: "camiseta azul escuro" -> "Azul")
  for (const [key, family] of Object.entries(COLOR_FAMILY_MAP)) {
    if (normalized.includes(key)) return family;
  }
  
  // Se não achar, capitaliza a primeira letra e retorna
  return colorName.charAt(0).toUpperCase() + colorName.slice(1).toLowerCase();
}
