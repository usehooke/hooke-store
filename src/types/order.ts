import { z } from "zod";
import { OrderSchema, OrderItemSchema, CustomerSchema, OrderStatusSchema } from "@/lib/schemas";

export type OrderStatus = z.infer<typeof OrderStatusSchema>;
export type OrderCustomer = z.infer<typeof CustomerSchema>;
export type OrderItem = z.infer<typeof OrderItemSchema>;
export type Order = z.infer<typeof OrderSchema>;
