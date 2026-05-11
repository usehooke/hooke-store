import { describe, it, expect, vi } from 'vitest';
import { productSchema } from '@/features/catalog/schemas';

describe('Estúdio: Zod vs Vision AI', () => {
  it('Deve rejeitar JSON malformado (Preço como String)', () => {
    const malformedAIResponse = {
      title: "Camiseta Alpha",
      luxuryDescription: "Descrição de luxo",
      suggestedPrice: "189.90", // ERRO: Deveria ser número
      category: "Oversized",
      fabric: "Pima",
      model: "Boxy",
      seoKeywords: ["tag1"]
    };

    const result = productSchema.safeParse({
        ...malformedAIResponse,
        id: 'test',
        slug: 'test',
        name: malformedAIResponse.title,
        price: malformedAIResponse.suggestedPrice, // Aqui o Zod deve pegar
        description: malformedAIResponse.luxuryDescription,
        imageUrl: 'test',
        images: ['test'],
        sizes: ['G'],
        department: 'masculino'
    });

    expect(result.success).toBe(false);
  });

  it('Deve validar corretamente um retorno íntegro da IA', () => {
    const healthyResponse = {
      id: 'test',
      name: "T-Shirt Hooke",
      slug: "t-shirt-hooke",
      price: 199.90,
      description: "Arquitetura têxtil pura.",
      category: "Premium",
      imageUrl: "https://hooke.com/img.jpg",
      images: [],
      sizes: ["G"],
      department: "masculino",
      featured: false
    };

    const result = productSchema.safeParse(healthyResponse);
    expect(result.success).toBe(true);
  });
});
