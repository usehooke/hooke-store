import { z } from "zod";
import { ProductSchema, ProductCategorySchema } from "@/lib/schemas";
import { ModelSigla, PrintSigla } from "@/utils/sku-generator";

export * from "./enums";

export type ProductCategory = z.infer<typeof ProductCategorySchema>;

export type Product = z.infer<typeof ProductSchema> & {
  modelSigla?: ModelSigla;
  printSigla?: PrintSigla;
};

export interface MenuItem {
  label: string;
  href: string;
}

export interface Review {
  id: string;
  productId: string;
  productName: string;
  name: string;
  rating: number;
  comment: string;
  channel: 'site' | 'whatsapp' | 'instagram';
  location?: string;
  approved: boolean;
  createdAt: any;
}
