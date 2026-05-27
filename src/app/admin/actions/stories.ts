'use server';

import { adminDb } from '@/lib/firebase-admin';
import { revalidatePath } from 'next/cache';
import { logAdminAction } from './audit';
import { StorySchema } from '@/lib/schemas';

/**
 * Server Action Elite: Grava ou atualiza uma Web Story de alta performance no Firestore
 * e dispara a revalidação instantânea do cache da CDN na rota AMP correspondente.
 */
export async function saveStory(data: any, userEmail: string = 'system') {
    if (!adminDb) {
        return { success: false, message: "Conexão com o Firebase Admin DB indisponível no servidor." };
    }

    try {
        // 1. Validação estrita via Zod Schema no backend
        const validated = StorySchema.safeParse(data);
        if (!validated.success) {
            const errorMsg = validated.error.issues.map(e => `${e.path.join('.')}: ${e.message}`).join(' | ');
            return { success: false, message: `Validação de integridade falhou: ${errorMsg}` };
        }

        const storyPayload = validated.data;
        const slug = storyPayload.slug.trim().toLowerCase();

        // 2. Persistência atômica no Firestore usando privilégios de Admin
        await adminDb.collection('stories').doc(slug).set({
            ...storyPayload,
            slug, // Assegura o slug normalizado
            updatedAt: Date.now()
        });

        // 3. Registro de auditoria do Command Center
        try {
            await logAdminAction('CREATE_OR_UPDATE_STORY', { slug, title: storyPayload.title }, userEmail);
        } catch (auditErr) {
            console.warn("⚠️ [Hooke System] Falha ao registrar log de auditoria da story:", auditErr);
        }

        // 4. Limpeza imediata de cache do servidor (RSC Revalidation)
        revalidatePath(`/stories/${slug}`, 'page');
        revalidatePath('/', 'layout');

        return { success: true, slug };
    } catch (err: unknown) {
        console.error("❌ [Hooke Stories Action] Falha crítica ao gravar story:", err);
        return { success: false, message: (err instanceof Error ? err.message : "Erro desconhecido de banco.") };
    }
}
