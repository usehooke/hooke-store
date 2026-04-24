import { NextResponse } from 'next/server';

export const runtime = 'edge';

const INSTAGRAM_ACCESS_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN || '';
const INSTAGRAM_API_URL = `https://graph.instagram.com/me/media?fields=id,caption,media_url,permalink,media_type,thumbnail_url&access_token=${INSTAGRAM_ACCESS_TOKEN}&limit=10`;

export async function GET() {
    try {
        if (!INSTAGRAM_ACCESS_TOKEN) {
            // Se não tem token, retornamos 200 vazio para não poluir o console do navegador com erros 401.
            // O desenvolvedor verá o aviso no log do servidor.
            console.warn('Instagram API: Missing INSTAGRAM_ACCESS_TOKEN in environment variables.');
            return NextResponse.json({ feed: [] });
        }

        const res = await fetch(INSTAGRAM_API_URL, {
            next: { revalidate: 86400 } // ISR - Revalidação diária
        });

        if (!res.ok) {
            throw new Error(`Instagram API Error: ${res.status}`);
        }

        const data = await res.json();

        interface InstagramMedia {
            id: string;
            media_type: string;
            media_url: string;
            permalink: string;
            caption?: string;
        }

        // Filtrar para retornar apenas imagens e álbuns (exclui videos simples se quisermos apenas vitrine unificada, ou pega os thumbnails)
        const formattedFeed = data.data
            .filter((item: InstagramMedia) => item.media_type === 'IMAGE' || item.media_type === 'CAROUSEL_ALBUM')
            .map((item: InstagramMedia) => ({
                id: item.id,
                imageUrl: item.media_url,
                link: item.permalink,
                caption: item.caption || 'Look Hooke Store'
            }));

        return NextResponse.json({ feed: formattedFeed });
    } catch (error) {
        console.error('Falha ao buscar feed do Instagram:', error);
        return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
    }
}
