import Image from "next/image";
import Link from "next/link";
import { Instagram } from "lucide-react";

interface SocialPost {
    id: string | number;
    imageUrl: string;
    link: string;
    alt: string;
}

// Mock das postagens do Instagram ligadas aos produtos reais
const SOCIAL_POSTS: SocialPost[] = [
    {
        id: 1,
        imageUrl: "/produtos/camiseta-oversized-preta-premium-hooke-3.avif",
        link: "/produto/camiseta-oversized-preta-premium",
        alt: "Homem usando camiseta oversized preta Hooke",
    },
    {
        id: 2,
        imageUrl: "/produtos/camiseta-Regata-canelada-verde-2.jpg",
        link: "/produto/regata-canelada-verde",
        alt: "Homem usando regata canelada verde Hooke",
    },
    {
        id: 3,
        imageUrl: "/produtos/regata-lifestyle-bege.jpg",
        link: "/produto/regata-lifestyle-bege",
        alt: "Homem usando regata lifestyle bege Hooke",
    },
    {
        id: 4,
        imageUrl: "/produtos/camiseta-vintage-fusca-preta-1.jpg",
        link: "/produto/camiseta-vintage-fusca-preta",
        alt: "Homem usando camiseta vintage fusca preta",
    },
    {
        id: 5,
        imageUrl: "/produtos/camiseta-oversized-offwhite-premium-hooke-1.avif",
        link: "/produto/camiseta-oversized-offwhite-premium",
        alt: "Homem usando camiseta oversized off-white Hooke",
    },
];

async function getInstagramFeed() {
    const token = process.env.INSTAGRAM_ACCESS_TOKEN;
    if (!token) return SOCIAL_POSTS; // Fallback instantâneo se não houver Token

    try {
        const res = await fetch(
            `https://graph.instagram.com/me/media?fields=id,caption,media_url,permalink,media_type,thumbnail_url&access_token=${token}&limit=10`,
            { next: { revalidate: 86400 } } // Cache de 24 horas no Next.js (ISR)
        );

        if (!res.ok) return SOCIAL_POSTS;

        const data = await res.json();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const formatted = data.data
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .filter((item: any) => item.media_type === 'IMAGE' || item.media_type === 'CAROUSEL_ALBUM')
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .map((item: any) => ({
                id: item.id,
                imageUrl: item.media_url,
                // Aqui podemos futuramente usar IA para ligar a foto ao produto real, por enquanto manda pra Home
                link: item.permalink,
                alt: item.caption || 'Look Hooke Store'
            }));

        if (formatted.length > 0) return formatted.slice(0, 5); // Pega apenas as 5 mais recentes
        return SOCIAL_POSTS;
    } catch (error) {
        console.error("Instagram Feed Error. Fallback para os mocks locais.", error);
        return SOCIAL_POSTS;
    }
}

export default async function SocialFeed() {
    const feedPhotos = await getInstagramFeed();

    return (
        <section className="py-24 bg-white border-t border-gray-100 overflow-hidden">
            {/* Cabeçalho da Seção */}
            <div className="flex flex-col items-center justify-center mb-12 px-6 text-center">
                <a
                    href="https://instagram.com/use.hooke"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex flex-col items-center gap-3"
                >
                    <div className="bg-gray-50 p-4 rounded-full text-hooke-900 group-hover:bg-hooke-900 group-hover:text-white transition-colors duration-300">
                        <Instagram size={28} strokeWidth={1.5} />
                    </div>
                    <div>
                        <span className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500 mb-1 block">
                            Siga os Bastidores
                        </span>
                        <h2 className="text-2xl md:text-3xl font-black text-hooke-900 uppercase tracking-tighter hover:opacity-80 transition-opacity">
                            @use.hooke
                        </h2>
                    </div>
                </a>
            </div>

            {/* Grid de Fotos (Scroll Horizontal no Mobile, Grid Dinâmico no Desktop) */}
            <div className="w-full relative px-2 md:px-6">
                <div className="flex overflow-x-auto md:grid md:grid-cols-5 gap-4 pb-8 md:pb-0 snap-x snap-mandatory hide-scrollbar">
                    {feedPhotos.map((post: SocialPost) => (
                        <Link
                            key={post.id}
                            href={post.link}
                            className="relative min-w-[280px] md:min-w-0 aspect-[4/5] bg-gray-100 block group overflow-hidden snap-center flex-shrink-0"
                        >
                            <Image
                                src={post.imageUrl}
                                alt={post.alt}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                sizes="(max-width: 768px) 80vw, 20vw"
                            />

                            {/* Overlay On Hover */}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 text-white flex flex-col items-center gap-2">
                                    <Instagram size={32} strokeWidth={1.5} />
                                    <span className="text-[10px] uppercase tracking-widest font-bold border-b border-white pb-1">
                                        Comprar o Look
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
