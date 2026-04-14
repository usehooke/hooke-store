import { z } from 'zod';

/**
 * HOOKE ELITE SCHEMAS
 * @Agent-LegacyRescue Protocol: Blindagem de Dados
 * Garante que o App nunca quebre por inconsistências no banco de dados.
 */

export const ProductSchema = z.object({
  id: z.string(),
  name: z.string().min(2),
  description: z.string().optional().default(""),
  price: z.number().positive(),
  comboPrice: z.number().optional(),
  imageUrl: z.string().url().or(z.string().startsWith('/')),
  secondaryImageUrl: z.string().url().or(z.string().startsWith('/')).optional(),
  images: z.array(z.string()).optional().default([]),
  sizes: z.array(z.string()).min(1),
  colors: z.array(z.object({
    name: z.string(),
    imageUrl: z.string()
  })).optional(),
  department: z.enum(["masculino", "feminino", "unissex"]),
  category: z.string(),
  slug: z.string(),
  seoAltText: z.string().optional().default(""),
  totalStock: z.number().optional(),
  isNew: z.boolean().optional().default(false),
  featured: z.boolean().optional().default(false),
  isActive: z.boolean().optional().default(true),
  isPremiumCollection: z.boolean().optional().default(false),
  details: z.object({
    fabric: z.string(),
    model: z.string(),
    wash: z.string(),
  }).optional(),
});

export type ProductType = z.infer<typeof ProductSchema>;
