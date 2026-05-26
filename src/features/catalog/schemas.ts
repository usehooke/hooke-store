import { z } from 'zod';

import { Department, Size } from '@/types';

export const productSchema = z.object({
  id: z.string(),
  name: z.string(),
  seoAltText: z.string().optional(),
  slug: z.string().optional(),
  price: z.number().min(0),
  featured: z.boolean().default(false),
  isActive: z.boolean().default(true),
  isNew: z.boolean().optional(),
  isHeroBanner: z.boolean().optional(),
  heroImageUrl: z.string().optional(),
  description: z.string(),
  imageUrl: z.string(),
  images: z.array(z.string()),
  sizes: z.array(z.nativeEnum(Size)),
  department: z.nativeEnum(Department),
  category: z.string(),
  details: z.object({
    fabric: z.string(),
    model: z.string(),
    wash: z.string(),
  }).optional(),
  seo: z.object({
    altText: z.string().optional(),
    metaDescription: z.string().optional(),
  }).optional(),
  stock: z.record(z.string(), z.number()).optional(),
});

export type ProductSchema = z.infer<typeof productSchema>;
