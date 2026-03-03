export type OrderStatus = 'pending' | 'approved' | 'in_process' | 'rejected' | 'cancelled' | 'sent';

export interface OrderCustomer {
    name: string;
    email: string;
    phone: string;
    isVip?: boolean; // Se o usuário optou por entrar na lista VIP
    document?: string; // CPF/CNPJ
    address?: {
        zip_code: string;
        street_name: string;
        street_number: string;
        neighborhood: string;
        city: string;
        state: string;
    };
}

export interface OrderItem {
    cartItemId: string; // Ex: oversized-preta-M
    id: string; // ID base do produto
    title: string;
    unit_price: number;
    quantity: number;
    size: string;
    imageUrl?: string;
}

export interface Order {
    id: string; // Gerado pelo Firebase
    customer: OrderCustomer;
    items: OrderItem[];
    totalAmount: number;
    status: OrderStatus;
    paymentMethod?: string;
    paymentId?: string; // ID da transação no Mercado Pago
    shippingValue?: number; // Valor do Frete
    shippingMethod?: string; // Metodo (PAC/SEDEX)
    shippingZipcode?: string; // CEP inserido no checkout
    discountValue?: number; // Valor de desconto (Cupom)
    couponCode?: string; // Código do cupom aplicado
    trackingCode?: string; // Rastreio (Correios/Transportadora)
    createdAt: number; // timestamp
    updatedAt: number;
}
