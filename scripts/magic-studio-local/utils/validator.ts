import fs from 'fs';
import path from 'path';
import { logValid, logError } from './logger';
import { z } from 'zod';

// Zod Schema baseado nas regras de luxo (Luxury Copywriting) e SEO da Hooke
export const LocalMetadataSchema = z.object({
  title: z.string().min(5, "Título muito curto"),
  luxuryDescription: z.string().min(20, "Copy de luxo muito curta"),
  suggestedPrice: z.number().positive("Preço deve ser positivo"),
  category: z.string().min(2, "Categoria obrigatória"),
  fabric: z.string().min(2, "Tecido obrigatório (ex: 100% Algodão Pima)"),
  model: z.string().min(2, "Modelagem obrigatória (ex: Boxy Fit)"),
  seoKeywords: z.array(z.string()).min(3, "Mínimo de 3 keywords SEO necessárias")
});

export type LocalMetadata = z.infer<typeof LocalMetadataSchema>;

export async function validatePreUpload(
  localFilePath: string, 
  metadata: any
): Promise<{ success: boolean; error?: string }> {
  try {
    // 1. Validação Física (File System)
    const absolutePath = path.resolve(process.cwd(), localFilePath);
    if (!fs.existsSync(absolutePath)) {
      logError('validator.ts', `Arquivo físico não encontrado: ${absolutePath}`);
      return { success: false, error: 'Arquivo_Inexistente' };
    }

    const stats = fs.statSync(absolutePath);
    const fileSizeInMB = stats.size / (1024 * 1024);
    
    if (fileSizeInMB > 10) {
      logError('validator.ts', `Arquivo excede 10MB (${fileSizeInMB.toFixed(2)}MB).`);
      return { success: false, error: 'Arquivo_Muito_Grande' };
    }

    const ext = path.extname(absolutePath).toLowerCase();
    if (!['.webp', '.jpeg', '.jpg', '.png'].includes(ext)) {
      logError('validator.ts', `Formato inválido: ${ext}. Use .webp ou .jpg`);
      return { success: false, error: 'Formato_Invalido' };
    }

    logValid('validator.ts', `Arquivo físico íntegro: ${path.basename(localFilePath)} (${fileSizeInMB.toFixed(2)}MB)`);

    // 2. Validação Lógica (Zod)
    const validationResult = LocalMetadataSchema.safeParse(metadata);
    if (!validationResult.success) {
      logError('validator.ts', `Metadados SEO/Zod inválidos:`, validationResult.error.format());
      return { success: false, error: 'SEO_Invalido' };
    }

    logValid('validator.ts', `Metadados e SEO rigorosamente validados.`);
    return { success: true };

  } catch (error: any) {
    logError('validator.ts', 'Falha catastrófica durante validação.', error);
    return { success: false, error: error.message };
  }
}
