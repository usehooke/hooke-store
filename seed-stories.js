const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

// Inicializa o SDK Admin do Firebase local
if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

async function seed() {
  console.log("🚀 [Hooke Stories Seed] Iniciando injeção de Stories conceituais...");

  // STORY 1: Camiseta Vintage Fusca (Nostalgia e Gramatura Robusta)
  const story1 = {
    title: "Camiseta Vintage Fusca",
    publisher: "Hooke Atelier",
    publisherLogo: "https://usehooke.com.br/favicon.ico",
    poster: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?q=80&w=640&auto=format&fit=crop",
    description: "Nostalgia vintage clássica aliada ao caimento estruturado e gramatura pesada.",
    slug: "camiseta-vintage-fusca",
    createdAt: Date.now(),
    pages: [
      {
        id: "fusca-slide-1",
        mediaUrl: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?q=80&w=720&auto=format&fit=crop",
        mediaType: "image",
        title: "A Nostalgia Clássica",
        description: "Capturamos a essência do design vintage atemporal para a engenharia urbana.",
      },
      {
        id: "fusca-slide-2",
        mediaUrl: "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?q=80&w=720&auto=format&fit=crop",
        mediaType: "image",
        title: "Gramatura Heavyweight",
        description: "Algodão premium peletizado 260g que confere caimento estruturado incomparável.",
      },
      {
        id: "fusca-slide-3",
        mediaUrl: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=720&auto=format&fit=crop",
        mediaType: "image",
        title: "A Assinatura Woven",
        description: "Etiqueta woven tecida em alta definição na barra. Refino industrial.",
        ctaLink: "/checkout?productId=camiseta-vintage-fusca&size=G",
        ctaText: "ADQUIRIR PEÇA"
      }
    ]
  };

  // STORY 2: Camiseta Street Kombi (Estética Street Utopia e Caimento Boxy)
  const story2 = {
    title: "Camiseta Street Kombi",
    publisher: "Hooke Atelier",
    publisherLogo: "https://usehooke.com.br/favicon.ico",
    poster: "https://images.unsplash.com/photo-1520188129108-30ab6df451a7?q=80&w=640&auto=format&fit=crop",
    description: "Explorando a estética street utopia e a liberdade da estrada com modelagem boxy fit.",
    slug: "camiseta-street-kombi",
    createdAt: Date.now(),
    pages: [
      {
        id: "kombi-slide-1",
        mediaUrl: "https://images.unsplash.com/photo-1520188129108-30ab6df451a7?q=80&w=720&auto=format&fit=crop",
        mediaType: "image",
        title: "Street Utopia",
        description: "A liberdade da estrada e o pulso urbano encontram a sofisticação fria.",
      },
      {
        id: "kombi-slide-2",
        mediaUrl: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=720&auto=format&fit=crop",
        mediaType: "image",
        title: "Modelagem Boxy Fit",
        description: "Estrutura ergonômica inspirada no soft brutalism contemporâneo.",
      },
      {
        id: "kombi-slide-3",
        mediaUrl: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=720&auto=format&fit=crop",
        mediaType: "image",
        title: "Destaque do Arsenal",
        description: "Edição ultra limitada produzida sob rígido refino estético e de costuras.",
        ctaLink: "/checkout?productId=camiseta-street-kombi&size=G",
        ctaText: "ADQUIRIR PEÇA"
      }
    ]
  };

  // STORY 3: O Guia da Camiseta Masculina para Encontros
  const story3 = {
    title: "Guia da Camiseta para Encontros",
    publisher: "Hooke Atelier",
    publisherLogo: "https://usehooke.com.br/favicon.ico",
    poster: "https://images.unsplash.com/photo-1488161628813-04466f872be2?q=80&w=640&auto=format&fit=crop",
    description: "Menos é mais. O guia cirúrgico do visual masculino essencial de presença para o primeiro encontro.",
    slug: "guia-camiseta-encontros",
    createdAt: Date.now(),
    pages: [
      {
        id: "encontros-slide-1",
        mediaUrl: "https://images.unsplash.com/photo-1488161628813-04466f872be2?q=80&w=720&auto=format&fit=crop",
        mediaType: "image",
        title: "Menos é muito mais",
        description: "Para um primeiro encontro, o maior erro do homem é tentar chamar atenção pelo excesso. Descubra o que elas reparam.",
      },
      {
        id: "encontros-slide-2",
        mediaUrl: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=720&auto=format&fit=crop",
        mediaType: "image",
        title: "O Poder do Básico",
        description: "A camiseta lisa passa sensação de homem seguro. Cores sóbrias como Preto, Branco, Cinza e Verde Militar dominam.",
        ctaLink: "https://usehooke.com.br/?utm_source=discover&utm_medium=stories_encontros",
        ctaText: "ARMAREI MEU LOOK"
      },
      {
        id: "encontros-slide-3",
        mediaUrl: "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?q=80&w=720&auto=format&fit=crop",
        mediaType: "image",
        title: "O Perigo do Excesso",
        description: "Elas NÃO curtem gola V super profunda. Passa uma vibe datada. A Gola Careca grossa e alinhada segue imbatível.",
      },
      {
        id: "encontros-slide-4",
        mediaUrl: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?q=80&w=720&auto=format&fit=crop",
        mediaType: "image",
        title: "Maturidade nas Estampas",
        description: "Fuja de estampas genéricas que infantilizam o visual. Escolha temas vintage minimalistas e sóbrios de personalidade.",
      },
      {
        id: "encontros-slide-5",
        mediaUrl: "https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=720&auto=format&fit=crop",
        mediaType: "image",
        title: "O Toque Henley",
        description: "A gola Henley traz botões que conferem refino casual maduro, dando aquela estética de 'me arrumei sem forçar a barra'.",
      },
      {
        id: "encontros-slide-6",
        mediaUrl: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=720&auto=format&fit=crop",
        mediaType: "image",
        title: "A Geometria Perfeita",
        description: "Vista estrutura. Vista o caimento pesado definitivo da Hooke. Tecido premium que não deforma após a lavagem.",
        ctaLink: "https://usehooke.com.br/?utm_source=discover&utm_medium=stories_encontros",
        ctaText: "ARMAREI MEU LOOK"
      }
    ]
  };

  try {
    // Grava o Story 1
    await db.collection("stories").doc(story1.slug).set(story1);
    console.log("✓ Story 1 (Vintage Fusca) injetado com sucesso!");

    // Grava o Story 2
    await db.collection("stories").doc(story2.slug).set(story2);
    console.log("✓ Story 2 (Street Kombi) injetado com sucesso!");

    // Grava o Story 3
    await db.collection("stories").doc(story3.slug).set(story3);
    console.log("✓ Story 3 (Guia Encontros) injetado com sucesso!");

    console.log("🎉 [Hooke Stories Seed] Todos os stories conceituais foram injetados com absoluto sucesso no Firestore!");
  } catch (error) {
    console.error("❌ Erro ao rodar seed de Stories:", error);
  }
}

seed();
