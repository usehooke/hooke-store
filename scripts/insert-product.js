const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function insert() {
  try {
    const prod = {
      name: "Produto Teste Agent",
      slug: "produto-teste-agent",
      price: 199.90,
      description: "Produto de teste inserido pelo Agente",
      imageUrl: "/produtos/hk_elite_heavy_black_v2.png",
      sizes: ["M", "G"],
      department: "masculino",
      category: "Camisetas",
      isActive: true,
      featured: true,
      seoAltText: "Teste",
      stock: { "M": 10, "G": 5 }
    };
    const res = await db.collection("produtos").doc("produto-teste-agent").set(prod);
    console.log("Produto inserido no Firebase com sucesso:", res);
  } catch(e) {
    console.error("Erro ao inserir produto:", e);
  }
}
insert();
