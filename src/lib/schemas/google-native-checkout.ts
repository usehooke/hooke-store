import { z } from 'zod';

export const GoogleNativeItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  quantity: z.number().int().positive(),
  price: z.number().positive(),
  size: z.string(),
  color: z.string().optional(),
});

export const GoogleNativeCustomerSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  phone: z.string().optional(),
});

export const GoogleNativeOrderSchema = z.object({
  customer: GoogleNativeCustomerSchema,
  items: z.array(GoogleNativeItemSchema).min(1),
  totalAmount: z.number().positive(),
  shippingAddress: z.object({
    street: z.string(),
    number: z.string(),
    complement: z.string().optional(),
    neighborhood: z.string(),
    city: z.string(),
    state: z.string(),
    zipcode: z.string(),
  }),
  paymentMethod: z.string(),
});

export type GoogleNativeOrderPayload = z.infer<typeof GoogleNativeOrderSchema>;
