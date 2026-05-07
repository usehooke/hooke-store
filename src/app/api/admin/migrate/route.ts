import { NextResponse } from 'next/server';
import admin from 'firebase-admin';
import { PRODUTOS } from '@/config';

/**
 * HOOKE ELITE: ADMIN MIGRATION SERVICE
 * Bypasses Firestore Security Rules using the Service Account.
 * Syncs the local PRODUTOS array to the products collection.
 */

export async function GET() {
    try {
        console.log('🚀 [Hooke Admin] Iniciando Sincronização de Elite...');

        const serviceAccountKeyB64 = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

        if (!serviceAccountKeyB64) {
             console.error("❌ [Hooke Admin] Chave de Serviço não encontrada.");
             return NextResponse.json({ error: "Service Account Absent" }, { status: 500 });
        }

        const serviceAccount = JSON.parse(
            Buffer.from(serviceAccountKeyB64, 'base64').toString('utf-8')
        );

        // Inicializa o Admin se ainda não estiver pronto
        if (!admin.apps.length) {
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount)
            });
        }

        const db = admin.firestore();
        const batch = db.batch();
        const collectionRef = db.collection('produtos');

        let count = 0;
        for (const produto of PRODUTOS) {
            const docRef = collectionRef.doc(produto.id);
            batch.set(docRef, {
                ...produto,
                updatedAt: admin.firestore.FieldValue.serverTimestamp(),
                isActive: true
            });
            count++;
        }

        await batch.commit();

        console.log(`✨ [Hooke Admin] Sincronização concluída: ${count} itens.`);
        return NextResponse.json({ 
            success: true, 
            count, 
            status: "Database Synced (Admin SDK)" 
        });

    } catch (error: unknown) {
        console.error('💥 [Hooke Admin] Erro Crático na Sincronização:', error);
        return NextResponse.json({ 
            success: false, 
            error: error instanceof Error ? error.message : String(error) 
        }, { status: 500 });
    }
}
