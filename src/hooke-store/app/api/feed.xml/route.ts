import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { Product } from "@/types";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const productsRef = collection(db, "produtos");
        // Buscamos apenas os que não estão ocultos
        const q = query(productsRef, where("isActive", "==", true));
        const querySnapshot = await getDocs(q);

        const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://hooke-store.vercel.app";

        let xmlItems = "";

        querySnapshot.forEach((doc) => {
            const product = doc.data() as Product;

            // Tratamento contra quebras de XML (Escape CDATA)
            const title = `<![CDATA[${product.name}]]>`;
            const description = `<![CDATA[${product.description || "Camiseta Hooke Premium"}]]>`;

            // Link direto do produto
            const link = `${appUrl}/produto/${product.id}`;
            // Mapeando a primeira imagem se existir
            const imageLink = product.images?.[0] || `${appUrl}/logo.png`;

            // Validação de Preço formatado (Ex: 129.90 BRL)
            const price = Number(product.price).toFixed(2) + " BRL";

            // Disponibilidade baseada na lógica de kits/estoque (simplificado: in_stock se estiver publico)
            const availability = "in stock"; // Poderíamos aprofundar validando as variações

            xmlItems += `
            <item>
                <g:id>${product.id}</g:id>
                <g:title>${title}</g:title>
                <g:description>${description}</g:description>
                <g:link>${link}</g:link>
                <g:image_link>${imageLink}</g:image_link>
                <g:brand>Hooke</g:brand>
                <g:condition>new</g:condition>
                <g:availability>${availability}</g:availability>
                <g:price>${price}</g:price>
                <g:item_group_id>${product.id}</g:item_group_id>
            </item>
            `;
        });

        // Montagem do Envelope RSS Master
        const rssFeed = `<?xml version="1.0" encoding="UTF-8"?>
        <rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
            <channel>
                <title><![CDATA[Hooke Store]]></title>
                <link>${appUrl}</link>
                <description><![CDATA[Catálogo Oficial Hooke no Instagram]]></description>
                ${xmlItems}
            </channel>
        </rss>`;

        return new NextResponse(rssFeed, {
            status: 200,
            headers: {
                "Content-Type": "text/xml; charset=utf-8",
                "Cache-Control": "s-maxage=3600, stale-while-revalidate", // Cache poderoso para suportar requisições pesadas do Meta
            },
        });

    } catch (error) {
        console.error("Erro ao gerar XML Feed:", error);
        return new NextResponse("Error generating feed", { status: 500 });
    }
}
