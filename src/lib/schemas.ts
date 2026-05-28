import { z } from 'zod';
import { Department, Size } from "@/types/enums";

/**
 * HOOKE ELITE SCHEMAS
 * @Agent-LegacyRescue Protocol: Blindagem de Dados
 * Garante que o App nunca quebre por inconsistências no banco de dados.
 */

export const ProductCategorySchema = z.enum(["Kits", "Oversized", "Regatas", "Vintage", "Lifestyle", "Conjuntos", "Camisetas", "Cropped", "Top"]);

export const ProductSchema = z.object({
  id: z.string(),
  name: z.string().min(2),
  description: z.string().optional(),
  price: z.number().positive(),
  comboPrice: z.number().optional(),
  imageUrl: z.string().url().or(z.string().startsWith('/')),
  secondaryImageUrl: z.string().url().or(z.string().startsWith('/')).optional(),
  images: z.array(z.string()).optional(),
  sizes: z.array(z.nativeEnum(Size)).min(1),
  colors: z.array(z.object({
    name: z.string(),
    imageUrl: z.string()
  })).optional(),
  department: z.nativeEnum(Department),
  category: ProductCategorySchema,
  slug: z.string().optional(),
  seo: z.object({
    altText: z.string().optional(),
    metaDescription: z.string().optional(),
  }).optional(),
  seoAltText: z.string().optional(),
  totalStock: z.number().optional(),
  weight: z.number().optional(),
  rating: z.number().optional(),
  reviewsCount: z.number().optional(),
  isNew: z.preprocess((val) => val === 'true' || val === true, z.boolean()).optional(),
  launchExpiry: z.number().optional(),
  featured: z.preprocess((val) => val === 'true' || val === true, z.boolean()).optional().default(false),
  isActive: z.preprocess((val) => val === undefined ? true : (val === 'true' || val === true), z.boolean()).optional(),
  isPremiumCollection: z.boolean().optional(),
  isHeroBanner: z.preprocess((val) => val === 'true' || val === true, z.boolean()).optional(),
  heroImageUrl: z.string().url().or(z.string().startsWith('/')).optional(),
  modelId: z.string().optional(),
  color: z.string().optional(),
  details: z.object({
    fabric: z.string().optional(),
    model: z.string().optional(),
    wash: z.string().optional(),
  }).optional(),
  stock: z.record(z.string(), z.number()).optional(),
  skus: z.record(z.string(), z.string()).optional(),
});

export const OrderStatusSchema = z.enum(["pending", "approved", "in_process", "rejected", "cancelled", "sent", "paid", "shipped"]);

export const CustomerSchema = z.object({
  name: z.string().min(3, "Nome muito curto"),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  phone: z.string().min(10, "WhatsApp inválido").optional().or(z.literal("")),
  isVip: z.boolean().optional().default(false),
  document: z.string().optional(),
  address: z.object({
    zip_code: z.string(),
    street_name: z.string().optional().default(""),
    street_number: z.string().optional().default(""),
    neighborhood: z.string().optional().default(""),
    city: z.string().optional().default(""),
    state: z.string().optional().default(""),
  }).optional(),
});

export const OrderItemSchema = z.object({
  cartItemId: z.string(),
  id: z.string(),
  title: z.string(),
  unit_price: z.number(),
  quantity: z.number().int().positive(),
  size: z.string(),
  color: z.string().optional(),
  imageUrl: z.string().optional(),
});

export const OrderSchema = z.object({
  id: z.string(),
  customer: CustomerSchema,
  items: z.array(OrderItemSchema).min(1, "Carrinho vazio"),
  totalAmount: z.number(),
  status: OrderStatusSchema,
  paymentMethod: z.string().optional(),
  paymentId: z.string().optional(),
  shippingValue: z.number().default(0),
  shippingMethod: z.string().optional().default(""),
  shippingZipcode: z.string().optional().default(""),
  discountValue: z.number().default(0),
  couponCode: z.string().optional().default(""),
  trackingCode: z.string().optional(),
  createdAt: z.number(),
  updatedAt: z.number(),
});

export const ShippingRequestSchema = z.object({
  cepDestino: z.string().min(8, "CEP inválido").max(9),
  peso: z.string().optional().default("0.3"),
});

export const CheckoutRequestSchema = z.object({
  items: z.array(OrderItemSchema).min(1),
  customer: CustomerSchema,
  shippingValue: z.number().optional().default(0),
  shippingMethod: z.string().optional().default(""),
  shippingZipcode: z.string().optional().default(""),
  discountValue: z.number().optional().default(0),
  couponCode: z.string().optional().default(""),
});

export const CouponRequestSchema = z.object({
  code: z.string().min(3, "Código muito curto").max(20),
});

export const StoryPageSchema = z.object({
  id: z.string(),
  mediaType: z.enum(["image", "video"]),
  mediaUrl: z.string().url("URL de mídia inválida"),
  title: z.string().optional(),
  description: z.string().optional(),
  ctaLink: z.string().url("URL de CTA inválida").optional(),
  ctaText: z.string().optional().default("ADQUIRIR PEÇA"),
});

export const StorySchema = z.object({
  slug: z.string().min(3, "Slug muito curto").max(50, "Slug muito longo"),
  title: z.string().min(3, "Título muito curto").max(40, "Título muito longo (máx 40 caracteres)"),
  description: z.string().optional().default("Uma obra de arte contemporânea do design editorial Hooke."),
  poster: z.string().url("URL do pôster inválida"),
  publisher: z.string().optional().default("Hooke Atelier"),
  publisherLogo: z.string().optional().default("https://usehooke.com.br/favicon.ico"),
  pages: z.array(StoryPageSchema).min(1, "O Story deve conter pelo menos 1 página/lâmina"),
});

export type ProductType = z.infer<typeof ProductSchema>;
export type CustomerType = z.infer<typeof CustomerSchema>;
export type OrderType = z.infer<typeof OrderSchema>;
export type OrderItemType = z.infer<typeof OrderItemSchema>;
export type ShippingRequestType = z.infer<typeof ShippingRequestSchema>;
export type CheckoutRequestType = z.infer<typeof CheckoutRequestSchema>;
export type CouponRequestType = z.infer<typeof CouponRequestSchema>;
export type StoryType = z.infer<typeof StorySchema>;
export type StoryPageType = z.infer<typeof StoryPageSchema>;

