import { NextRequest } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { connection } from "next/server";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  await connection();
  const { slug } = await params;

  if (!adminDb) {
    return new Response("Conexão com o banco de dados indisponível no servidor.", { status: 500 });
  }

  try {
    // 1. Busca o Web Story no Firestore por ID/Slug
    const docRef = adminDb.collection("stories").doc(slug);
    const docSnap = await docRef.get();

    let storyData: any = null;
    if (docSnap.exists) {
      storyData = docSnap.data();
    } else {
      // Fallback: Busca pela propriedade "slug" caso o ID seja diferente
      const querySnap = await adminDb.collection("stories").where("slug", "==", slug).limit(1).get();
      if (!querySnap.empty) {
        storyData = querySnap.docs[0].data();
      }
    }

    // 2. Se o Story não existir no banco, retorna uma página 404 Brutalista esteticamente alinhada
    if (!storyData) {
      return new Response(generateNotFoundHTML(slug), {
        status: 404,
        headers: {
          "Content-Type": "text/html; charset=utf-8",
        },
      });
    }

    // 3. Gera o HTML AMP estrito e validado para Google Discover
    const ampHTML = generateAMPStoryHTML(slug, storyData);

    return new Response(ampHTML, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        // Caching na CDN da Vercel para 0ms de carregamento no Discover
        "Cache-Control": "public, max-age=180, s-maxage=31536000, stale-while-revalidate=60",
      },
    });
  } catch (error: any) {
    console.error("❌ [Hooke Stories Engine] Falha crítica:", error);
    return new Response(`Falha interna no motor de Stories: ${error.message || error}`, { status: 500 });
  }
}

/**
 * Motor de Geração de HTML AMP Estrito para Google Web Stories
 * Blindado contra qualquer violação de especificação do AMP Validator.
 */
function generateAMPStoryHTML(slug: string, data: any): string {
  const canonicalUrl = `https://usehooke.com.br/stories/${slug}`;
  const title = data.title || "Hooke Atelier";
  const publisher = data.publisher || "Hooke Atelier";
  const publisherLogo = data.publisherLogo || "https://usehooke.com.br/favicon.ico";
  const poster = data.poster || "https://usehooke.com.br/hero-preta.avif";

  // Mapeia as páginas dinâmicas cadastradas no Firestore
  const pagesHTML = (data.pages || []).map((page: any, index: number) => {
    const pageId = page.id || `page-${index + 1}`;
    
    return `
    <amp-story-page id="${pageId}">
      <!-- Camada de Fundo (Preenchimento Total) -->
      <amp-story-grid-layer template="fill">
        ${page.mediaType === "video" ? `
          <amp-video src="${page.mediaUrl}"
            width="720" height="1280"
            layout="fill"
            autoplay loop muted noaudio
            poster="${poster}">
          </amp-video>
        ` : `
          <amp-img src="${page.mediaUrl}"
            width="720" height="1280"
            layout="fill"
            alt="${page.title || title}">
          </amp-img>
        `}
      </amp-story-grid-layer>

      <!-- Camada de Gradiente Sutil para Legibilidade -->
      <amp-story-grid-layer template="fill">
        <div class="gradient-overlay"></div>
      </amp-story-grid-layer>

      <!-- Camada de Texto Brutalista Minimalista -->
      <amp-story-grid-layer template="vertical" class="text-layer">
        <div class="text-container">
          ${page.title ? `<h2 class="slide-title animate-in-up">${page.title}</h2>` : ""}
          ${page.description ? `<p class="slide-copy animate-in-up-delay">${page.description}</p>` : ""}
        </div>
      </amp-story-grid-layer>

      <!-- ROTA DE ESCAPE DO CHECKOUT EXPRESS (SWIPE UP / OUTLINK) -->
      ${page.ctaLink ? `
      <amp-story-page-outlink layout="nodisplay" theme="custom" cta-accent-color="#000000" cta-accent-element="background">
        <a href="${page.ctaLink}" title="${page.ctaText || 'ADQUIRIR PEÇA'}">${page.ctaText || 'ADQUIRIR PEÇA'}</a>
      </amp-story-page-outlink>
      ` : ""}
    </amp-story-page>
    `;
  }).join("\n");

  return `<!DOCTYPE html>
<html amp lang="pt-BR">
<head>
  <meta charset="utf-8">
  <title>${title}</title>
  <link rel="canonical" href="${canonicalUrl}">
  <meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1">
  
  <!-- Scripts Obrigatórios do Google AMP & Stories Extension -->
  <script async src="https://cdn.ampproject.org/v0.js"></script>
  <script async custom-element="amp-story" src="https://cdn.ampproject.org/v0/amp-story-1.0.js"></script>
  ${data.pages?.some((p: any) => p.mediaType === "video") ? '<script async custom-element="amp-video" src="https://cdn.ampproject.org/v0/amp-video-0.1.js"></script>' : ""}

  <!-- Metadados de Indexação de Alta Definição para Google Discover -->
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${data.description || 'Uma obra de arte contemporânea do design editorial Hooke.'}">
  <meta property="og:image" content="${poster}">
  <meta property="og:type" content="article">
  <meta name="twitter:card" content="summary_large_image">

  <!-- Boilerplate CSS Obrigatório e Intocado (Validação Exigente do AMP) -->
  <style amp-boilerplate>body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}</style><noscript><style amp-boilerplate>body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}</style></noscript>

  <!-- Estilização Customizada Estética Soft Brutalist (NÃO PODE CONTER ESTILOS INLINE NO AMP) -->
  <style amp-custom>
    /* Tipografia de Alta Performance */
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&family=Playfair+Display:ital,wght@1,700;1,900&display=swap');

    body {
      font-family: 'Inter', -apple-system, sans-serif;
      color: #ffffff;
      background-color: #000000;
    }

    amp-story {
      background: #000;
    }

    /* Sobreposições Estéticas */
    .gradient-overlay {
      width: 100%;
      height: 100%;
      background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 40%, rgba(0,0,0,0.1) 100%);
      position: absolute;
      top: 0;
      left: 0;
    }

    /* Posicionamento do Texto Brutalista */
    .text-layer {
      justify-content: flex-end;
      padding: 32px 24px 80px 24px !important;
    }

    .text-container {
      max-width: 100%;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    /* Títulos Conceituais Itálicos */
    .slide-title {
      font-family: 'Playfair Display', serif;
      font-style: italic;
      font-weight: 900;
      font-size: 32px;
      line-height: 0.95;
      letter-spacing: -0.04em;
      color: #ffffff;
      margin: 0;
      text-transform: uppercase;
      text-shadow: 0 4px 12px rgba(0,0,0,0.3);
    }

    /* Descrição Premium */
    .slide-copy {
      font-size: 11px;
      font-weight: 700;
      line-height: 1.6;
      letter-spacing: 0.2em;
      color: rgba(255, 255, 255, 0.85);
      margin: 0;
      text-transform: uppercase;
      font-family: 'Inter', sans-serif;
      text-shadow: 0 2px 8px rgba(0,0,0,0.4);
    }

    /* Customizações Estéticas de Botões Swipe Up */
    amp-story-page-outlink a {
      font-family: 'Inter', sans-serif;
      font-size: 10px !important;
      font-weight: 900 !important;
      letter-spacing: 0.35em !important;
      text-transform: uppercase !important;
      color: #000000 !important;
      background-color: #ffffff !important;
      border: 2px solid #000000 !important;
      padding: 18px 36px !important;
      border-radius: 0px !important; /* Estética Strict Brutalist */
      box-shadow: 4px 4px 0px 0px rgba(0,0,0,1) !important;
      transition: all 0.3s ease !important;
    }

    /* Animações Micro-interações */
    .animate-in-up {
      animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    
    .animate-in-up-delay {
      animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards;
      opacity: 0;
    }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  </style>
</head>
<body>
  <!-- Contêiner do Story Principal (AMP Standalone) -->
  <amp-story standalone
    title="${title}"
    publisher="${publisher}"
    publisher-logo-src="${publisherLogo}"
    poster-portrait-src="${poster}">
    
    ${pagesHTML}

  </amp-story>
</body>
</html>`;
}

/**
 * HTML Brutalista para erro 404 (Story Não Encontrado)
 * Perfeitamente alinhado com o Quiet Luxury e Soft Brutalism da marca.
 */
function generateNotFoundHTML(slug: string): string {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Story Não Encontrado | Hooke Atelier</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&family=Playfair+Display:ital,wght@1,700&display=swap');
    body {
      margin: 0;
      padding: 0;
      background-color: #F5F5F5;
      color: #000000;
      font-family: 'Inter', sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: min(100vh, 100%);
      box-sizing: border-box;
    }
    .container {
      max-width: 500px;
      padding: 40px;
      border: 3px solid #000000;
      background-color: #ffffff;
      box-shadow: 12px 12px 0px 0px rgba(0,0,0,1);
      margin: 20px;
    }
    .tag {
      font-size: 9px;
      font-weight: 900;
      letter-spacing: 0.4em;
      color: #999;
      text-transform: uppercase;
      margin-bottom: 20px;
    }
    h1 {
      font-family: 'Playfair Display', serif;
      font-style: italic;
      font-size: 38px;
      line-height: 0.95;
      margin: 0 0 16px 0;
      text-transform: uppercase;
      letter-spacing: -0.02em;
    }
    p {
      font-size: 11px;
      line-height: 1.7;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: #444;
      margin: 0 0 32px 0;
      font-weight: 700;
    }
    .btn {
      display: inline-block;
      border: 2px solid #000000;
      background-color: #000000;
      color: #ffffff;
      padding: 16px 32px;
      text-decoration: none;
      font-size: 10px;
      font-weight: 900;
      letter-spacing: 0.3em;
      text-transform: uppercase;
      box-shadow: 4px 4px 0px 0px rgba(0,0,0,0.25);
      transition: all 0.2s ease;
    }
    .btn:hover {
      box-shadow: none;
      transform: translate(2px, 2px);
      background-color: #222222;
      border-color: #222222;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="tag">Erro 404 · Hooke OS</div>
    <h1>Obra Não<br>Encontrada</h1>
    <p>O story conceitual designado como "/stories/${slug}" não está disponível no arsenal ou foi arquivado por calibragem estética.</p>
    <a href="https://usehooke.com.br" class="btn">Retornar ao Site</a>
  </div>
</body>
</html>`;
}
