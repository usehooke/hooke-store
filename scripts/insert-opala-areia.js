const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

async function insertProduct() {
  try {
    const productId = 'T-SHIRT-VINTAGE-OPALA-ARE';
    const product = {
      id: productId,
      name: "T-Shirt Vintage Opala SS",
      slug: "t-shirt-vintage-opala-ss-areia",
      price: 45,
      featured: false,
      isActive: true,
      isNew: true,
      isHeroBanner: false,
      heroImageUrl: "",
      description: "Uma peça de pura engenharia têxtil com caimento estruturado e gramatura pesada premium. Desenvolvida em tom areia de inspiração mineral, exibe uma ilustração vintage de traço fino de um clássico Chevrolet Opala SS. O toque frio do tecido de alta qualidade se une à gola robusta de ribana para garantir uma silhueta limpa e impecável. No hem, a nossa etiqueta física de alta definição Woven Label chancela a peça com o refino tipográfico puro de nossa Wordmark.",
      imageUrl: "",
      images: [],
      sizes: ["P", "M", "G", "GG"],
      department: "unissex",
      category: "Vintage",
      details: {
        fabric: "malha em 100% Algodão com certificado 30,1 penteada de 260g",
        model: "Regular",
        wash: "Padrão Hooke",
        grammage: "260g/m²",
        yarn: "30.1 Penteado",
        collar: "Canelada de 3cm"
      },
      seo: {
        altText: "T-Shirt Vintage Opala SS",
        metaDescription: "Camiseta premium Hooke: T-Shirt Vintage Opala SS Sand. Algodão de gramatura robusta 260g com caimento estruturado e alta longevidade."
      },
      stock: {
        P: 2,
        M: 2,
        G: 2,
        GG: 2
      },
      skus: {
        P: "T-SHIRT-VINTAGE-OPALA-ARE-P",
        M: "T-SHIRT-VINTAGE-OPALA-ARE-M",
        G: "T-SHIRT-VINTAGE-OPALA-ARE-G",
        GG: "T-SHIRT-VINTAGE-OPALA-ARE-GG"
      },
      modelId: "T-SHIRT-VINTAGE-Opala-SS",
      color: "Areia",
      shipping: {
        weight: 0.32,
        width: 25,
        height: 2,
        length: 20
      },
      totalStock: 8,
      updatedAt: Date.now()
    };

    await db.collection('produtos').doc(productId).set(product);
    console.log(`Produto ${productId} inserido com sucesso!`);
  } catch (error) {
    console.error("Erro ao inserir produto:", error);
  }
}

insertProduct();
