// data/size-guide.ts

// Dica do modelo (Ajuste conforme suas fotos reais)
export const modelReferenceInfo = "Referência: O modelo da foto principal tem 1,73m, 77kg e está vestindo tamanho M.";

// URL do diagrama técnico.
// ⚠️ SUBSTITUA: No futuro, faça um desenho técnico bonito da sua camiseta
// com setas indicando A (Tórax) e B (Comprimento) e hospede na pasta /public.
// Por enquanto, usarei um placeholder genérico.
export const measurementDiagramUrl = "/images/guia-medidas-camiseta.png";

// Os dados da tabela
export const sizeGuideData = [
  {
    size: "P",
    chest: "52-54", // Tórax (cm)
    length: "68-70", // Comprimento (cm)
    sleeve: "20-21", // Manga (cm) - Opcional
  },
  {
    size: "M",
    chest: "55-57",
    length: "71-73",
    sleeve: "21-22",
  },
  {
    size: "G",
    chest: "58-60",
    length: "74-76",
    sleeve: "22-23",
  },
  {
    size: "GG",
    chest: "61-63",
    length: "77-79",
    sleeve: "23-24",
  },
];