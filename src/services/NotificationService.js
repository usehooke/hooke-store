/**
 * HOOKE NOTIFICATION ENGINE - ALPHA COMMAND
 * Integration: WhatsApp Bridge & Webhook Telemetry
 */

const WHATSAPP_WEBHOOK_URL = process.env.NEXT_PUBLIC_WHATSAPP_WEBHOOK_URL;

export const NotificationService = {
    /**
     * Dispara notificação de venda para o ecossistema externo (Make/Zapier)
     */
    triggerSaleNotification: async (orderData) => {
        if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
            console.log('🧪 [Dev Mode] Webhook silenciado em localhost:', orderData);
            return;
        }

        try {
            const payload = {
                clienteId: orderData.userId,
                valorTotal: orderData.total,
                itensArsenal: orderData.items.map(i => i.name),
                timestamp: new Date().toISOString(),
                statusEstoque: orderData.currentStock
            };

            await fetch(WHATSAPP_WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
        } catch (error) {
            console.error('❌ [Hooke Backend] Falha no Webhook de Venda:', error);
        }
    },

    /**
     * Formata e envia notificação VIP via WhatsApp Bridge
     */
    sendVipWhatsAppNotification: async (orderData) => {
        if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
            console.log('🧪 [Dev Mode] WhatsApp silenciado em localhost');
            return;
        }

        const message = `*NOVA RESERVA HOOKE* ⚡
Cliente: ${orderData.userName || 'Cliente Anônimo'}
Arsenal: ${orderData.items.map(i => i.name).join(', ')}
Valor: R$ ${orderData.total.toFixed(2)}
Estoque Restante: ${orderData.currentStock} un.`;

        try {
            await fetch(WHATSAPP_WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message, ...orderData })
            });
        } catch (error) {
            console.error('❌ [Hooke Backend] Falha no WhatsApp Bridge:', error);
        }
    },

    /**
     * Simula disparo de Push Notification PWA via Firebase Messaging
     */
    sendGlobalPushNotification: async (message = "Fernando liberou um novo drop no Lote 001. Acesse seu Arsenal.") => {
        console.log('🚀 [Push Engine] Disparando Notificação Global:', message);
        // Em um cenário real, aqui seria a integração com getMessaging(app) e sendToTopic
        return true;
    }
};
