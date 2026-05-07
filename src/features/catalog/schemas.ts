import { z } from 'zod';

import { Department, Size } from '@/types';

export const productSchema = z.object({
  id: z.string(),
  name: z.string(),
  seoAltText: z.string().optional(),
  slug: z.string(),
  price: z.number().positive(),
  featured: z.boolean().default(false),
  isNew: z.boolean().optional(),
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
});

export type ProductSchema = z.infer<typeof productSchema>;
