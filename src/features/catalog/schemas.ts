import { z } from 'zod';

import { Department, Size } from '@/types';

export const productSchema = z.object({
  id: z.string().optional().or(z.literal('')),
  name: z.string().min(1, "O nome do produto é obrigatório"),
  seoAltText: z.string().optional(),
  slug: z.string().optional(),
  price: z.number().min(0, "O preço deve ser maior ou igual a zero"),
  featured: z.preprocess((val) => val === 'true' || val === true, z.boolean()).default(false),
  isActive: z.preprocess((val) => val === 'true' || val === true, z.boolean()).default(true),
  isNew: z.preprocess((val) => val === 'true' || val === true, z.boolean()).optional(),
  isHeroBanner: z.preprocess((val) => val === 'true' || val === true, z.boolean()).optional(),
  heroImageUrl: z.string().optional(),
  description: z.string().min(1, "A narrativa premium (descrição) é obrigatória"),
  imageUrl: z.string().min(1, "A imagem principal é obrigatória"),
  images: z.array(z.string()).min(1, "Adicione pelo menos 1 imagem ao arsenal da galeria"),
  sizes: z.array(z.nativeEnum(Size)).min(1, "Selecione ao menos 1 tamanho"),
  department: z.nativeEnum(Department),
  category: z.string().min(1, "A categoria é obrigatória"),
  details: z.object({
    fabric: z.string().optional(),
    model: z.string().optional(),
    wash: z.string().optional(),
  }).optional(),
  seo: z.object({
    altText: z.string().optional(),
    metaDescription: z.string().optional(),
  }).optional(),
  stock: z.record(z.string(), z.number()).optional(),
  skus: z.record(z.string(), z.string()).optional(),
  modelId: z.string().optional(),
  color: z.string().optional(),
});

export type ProductSchema = z.infer<typeof productSchema>;
