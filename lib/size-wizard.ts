/**
 * Utilitário de recomendação de tamanho para Hooke Store.
 * Baseado em modelagem masculina premium.
 */

export type FitnessGoal = 'slim' | 'regular' | 'loose';

interface RecommendationParams {
  height: number; // em cm
  weight: number; // em kg
  preference: FitnessGoal;
}

export function calculateRecommendedSize({ height, weight, preference }: RecommendationParams): string {
  
  let baseSize = 'M';

  // 1. Lógica por Peso (Principal fator de volume)
  if (weight < 65) baseSize = 'P';
  else if (weight < 78) baseSize = 'M';
  else if (weight < 90) baseSize = 'G';
  else if (weight < 105) baseSize = 'GG';
  else baseSize = 'XG';

  // 2. Refinamento por Altura (Distribuição)
  if (height > 185 && (baseSize === 'P' || baseSize === 'M')) {
    // Pessoas altas e magras precisam de mais comprimento, sobe 1 tamanho
    baseSize = baseSize === 'P' ? 'M' : 'G';
  }
  
  if (height < 165 && (baseSize === 'G' || baseSize === 'GG')) {
    // Pessoas baixas e encorpadas, mantém o tamanho mas avisa (lógica futura)
  }

  // 3. Ajuste por Preferência de Caimento
  const sizeMap = ['P', 'M', 'G', 'GG', 'XG'];
  let sizeIndex = sizeMap.indexOf(baseSize);

  if (preference === 'slim' && sizeIndex > 0) {
    sizeIndex -= 1;
  } else if (preference === 'loose' && sizeIndex < sizeMap.length - 1) {
    sizeIndex += 1;
  }

  return sizeMap[sizeIndex];
}
