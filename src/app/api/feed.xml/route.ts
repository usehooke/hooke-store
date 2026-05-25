import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { Product } from "@/types";


export async function GET() {
    try {
        const firestore = db;
        if (!firestore) {
            console.error("❌ [Hooke System] Feed XML abortado: Firestore offline.");
            return new NextResponse("[Hooke System] Service Unavailable", { status: 503 });
        }

        const productsRef = collection(firestore, "produtos");
        const q = query(productsRef, where("isActive", "==", true));
        const querySnapshot = await getDocs(q);

        const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.usehooke.com.br";

        let xmlItems = "";

        querySnapshot.forEach((doc) => {
            const product = doc.data() as Product;

            const title = `<![CDATA[${product.name}]]>`;
            const description = `<![CDATA[${product.description || "Design Essencial Hooke. Algodão Premium Heavyweight 260g."}]]>`;
            const link = `${appUrl}/produto/${product.id}`;
            const imageLink = product.images?.[0] || product.imageUrl || `${appUrl}/logo.png`;
            const price = Number(product.price).toFixed(2) + " BRL";
            const availability = (product.totalStock ?? 1) > 0 ? "in_stock" : "out_of_stock";
            const color = product.details?.color || "Preto";
            const material = product.details?.fabric || "Algodão";
            const gender = product.department === "feminino" ? "female" : product.department === "masculino" ? "male" : "unisex";

            // Para Merchant Center PMax, cada tamanho é uma VARIANTE do produto principal
            const sizes = product.sizes && product.sizes.length > 0 ? product.sizes : ["UN"];

            sizes.forEach((size) => {
                const skuVariante = `${product.id}-${size}`;

                xmlItems += `
            <item>
                <g:id>${skuVariante}</g:id>
                <g:title>${title} - ${size}</g:title>
                <g:description>${description}</g:description>
                <g:link>${link}?size=${size}</g:link>
                <g:image_link>${imageLink}</g:image_link>
                <g:brand>Hooke</g:brand>
                <g:condition>new</g:condition>
                <g:availability>${availability}</g:availability>
                <g:price>${price}</g:price>
                <g:item_group_id>${product.id}</g:item_group_id>
                <g:mpn>${skuVariante}</g:mpn>
                <g:gender>${gender}</g:gender>
                <g:age_group>adult</g:age_group>
                <g:color><![CDATA[${color}]]></g:color>
                <g:size><![CDATA[${size}]]></g:size>
                <g:material><![CDATA[${material}]]></g:material>
                <g:shipping>
                    <g:country>BR</g:country>
                    <g:region>SP</g:region>
                    <g:price>20.00 BRL</g:price>
                </g:shipping>
            </item>
                `;
            });
        });

        // Envelope RSS Master
        const rssFeed = `<?xml version="1.0" encoding="UTF-8"?>
        <rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
            <channel>
                <title><![CDATA[Hooke Store Feed]]></title>
                <link>${appUrl}</link>
                <description><![CDATA[Catálogo de Produtos Hooke Elite - Feed Sincronizado V4]]></description>
                ${xmlItems}
            </channel>
        </rss>`;

        return new NextResponse(rssFeed, {
            status: 200,
            headers: {
                "Content-Type": "text/xml; charset=utf-8",
                "Cache-Control": "s-maxage=3600, stale-while-revalidate=86400", // Cache agressivo
            },
        });

    } catch (error) {
        console.error("Erro ao gerar XML Feed:", error);
        return new NextResponse("Error generating feed", { status: 500 });
    }
}
