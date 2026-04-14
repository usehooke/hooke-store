import { z } from "zod";
import { ProductSchema, ProductCategorySchema } from "@/lib/schemas";
import { ModelSigla, PrintSigla } from "@/utils/sku-generator";

export type ProductCategory = z.infer<typeof ProductCategorySchema>;

export type Product = z.infer<typeof ProductSchema> & {
  modelSigla?: ModelSigla;
  printSigla?: PrintSigla;
};

export interface MenuItem {
  label: string;
  href: string;
}
