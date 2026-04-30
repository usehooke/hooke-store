import { Product as GlobalProduct } from "@/types";

// Arquivo de proxy (Backward Compatibility)
// TODO: Atualizar importações em todo o projeto para ler diretamente de @/src/config e deletar este arquivo no futuro.
export * from "@/src/config";
export type Product = GlobalProduct;
