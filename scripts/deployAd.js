const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const fs = require('fs');
const path = require('path');

// Mock data to import
const dataPath = path.join(__dirname, '../src/config/products.ts');

async function deploy() {
    try {
        console.log("🔥 Guardião SEO: Iniciando Carga de Dados...");
        const serviceAccount = require('../serviceAccountKey.json');
        
        const app = initializeApp({
            credential: cert(serviceAccount)
        });
        
        const db = getFirestore(app);

        // Product payload
        const product = {
            name: "Conjunto Manga Morcego Marrom",
            seoAltText: "presente perfeito dia das maes conjunto feminino manga morcego marrom alta gramatura que nao marca - hooke femme",
            slug: "conjunto-feminino-manga-morcego-marrom",
            price: 100.00,
            featured: true,
            isPremiumCollection: true,
            isNew: true,
            totalStock: 24,
            stock: {
                "P": 8,
                "M": 8,
                "G": 8
            },
            description: "edição especial. arquitetura silhueta manga morcego. viscose estruturada de alta densidade projetada para cair com fluidez e não marcar. o nível máximo do streetwear de luxo para o dia das mães.",
            imageUrl: "/ensaio-feminino/conjunto-feminino-manga_morcego-marrom/hooke_manga_morcego_marrom_alfaiate_master_01_1777561912183.png",
            images: [
              "/ensaio-feminino/conjunto-feminino-manga_morcego-marrom/hooke_manga_morcego_marrom_alfaiate_master_01_1777561912183.png",
              "/ensaio-feminino/conjunto-feminino-manga_morcego-marrom/hooke_manga_morcego_marrom_alfaiate_master_02_dynamic_1777562012010.png",
              "/ensaio-feminino/conjunto-feminino-manga_morcego-marrom/hooke_manga_morcego_marrom_alfaiate_calca_focus.png",
              "/ensaio-feminino/conjunto-feminino-manga_morcego-marrom/hooke_manga_morcego_marrom_alfaiate_closeup.png"
            ],
            sizes: ["P", "M", "G"],
            department: "Feminino",
            category: "Conjuntos",
            details: { fabric: "Viscose e Elastano (Alta Gramatura)", model: "Manga Morcego & Pantalona", wash: "Acabamento Premium" },
            status: "ativo",
            createdAt: new Date().toISOString()
        };

        const docRef = db.collection('produtos').doc('fem-conjunto-manga-morcego-marrom');
        await docRef.set(product);
        console.log("✅ Anúncio Criado com Sucesso!");
        console.log("ID do Produto:", docRef.id);
        console.log("URL de Imagem Principal:", product.imageUrl);
        console.log("Status: ATIVO");
        
        process.exit(0);
    } catch (error) {
        console.error("Erro no Deploy:", error);
        process.exit(1);
    }
}

deploy();
