import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, setDoc, doc } from 'firebase/firestore';
import { PRODUTOS } from '@/data/catalogo';

export async function GET() {
    try {
        console.log('Iniciando migração pela API route nova pasta...');

        // A TRAVA DO TECH LEAD: Se o banco for nulo, aborta a operação.
        if (!db) {
            throw new Error("[Hooke System] Banco de dados offline. Abortando migração.");
        }

        const produtosRef = collection(db, 'produtos');
        let count = 0;

        for (const produto of PRODUTOS) {
            await setDoc(doc(produtosRef, produto.id), produto);
            console.log(`Migrado: ${produto.name}`);
            count++;
        }

        console.log(`Migração concluída! ${count} produtos processados.`);
        return NextResponse.json({ success: true, count, message: 'Migração concluída com sucesso!' });
    } catch (error: unknown) {
        console.error('Erro na migração:', error);
        return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
    }
}
