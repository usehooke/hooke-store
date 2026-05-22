import { adminDb } from '@/lib/firebase-admin';
import { AdminOrdersView } from '@/features/admin/components/AdminOrdersView';
import { Order } from '@/types/order';

// Esta página agora é renderizada 100% no servidor.
// Impede o cliente de baixar todo o banco do Firestore antes de montar a tela.
// Também implementa um limit() para evitar vazamentos de memória e sobrecarga do DOM.
export default async function AdminOrdersPage() {
    if (!adminDb) {
        return (
            <div className="p-10 text-red-500 font-bold uppercase tracking-widest text-sm text-center">
                Erro de Conexão com o Banco de Dados Admin.
            </div>
        );
    }

    let initialOrders: Order[] = [];

    try {
        const snapshot = await adminDb.collection("pedidos")
            .orderBy("createdAt", "desc")
            .limit(100) // Travamos em 100 para evitar congelamento e economizar leitura (Performance Elite)
            .get();

        snapshot.forEach((doc) => {
            const data = doc.data();
            initialOrders.push({
                id: doc.id,
                ...data,
                // Garantimos que a data venha como timestamp limpo para não quebrar a serialização do Next
                createdAt: data.createdAt?.toMillis ? data.createdAt.toMillis() : data.createdAt || Date.now()
            } as Order);
        });

    } catch (error) {
        console.error("Erro ao buscar pedidos no servidor:", error);
    }

    return <AdminOrdersView initialOrders={initialOrders} />;
}
