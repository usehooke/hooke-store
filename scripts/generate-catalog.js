const { jsPDF } = require("jspdf");
const fs = require("fs");
const path = require("path");

async function generateCatalog() {
    // 1. Configurações (Vertical 1080x1920 pixels)
    const doc = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [1080, 1920]
    });

    const brainPath = "C:\\Users\\Nando\\.gemini\\antigravity\\brain\\0f2ddb9c-bf0d-4ef7-b875-e0c2cd9c73bd";
    
    // Mapeamento de Arquivos
    const assets = {
        waferAreia: path.join(brainPath, "media__1774454835244.jpg"),
        waferMarrom: path.join(brainPath, "media__1774454860929.jpg"),
        waferBlack: path.join(brainPath, "media__1774454885659.jpg"),
        kombiFull: path.join(brainPath, "media__1774454945771.jpg"),
        kombiPuff: path.join(brainPath, "media__1774454952413.jpg")
    };

    // --- PÁGINA 1: CAPA MORRENA E MINIMALISTA ---
    // Fundo Branco + Logo + Foto Impacto (Kombi)
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, 1080, 1920, 'F');
    
    doc.setTextColor(0, 0, 0);
    // Logo "hooke" lowercase como no site
    doc.setFontSize(140);
    doc.text("hooke", 540, 400, { align: "center", charSpace: 2 });
    
    // Foto de Impacto (Usar Kombi Full no centro)
    const imgKombi = fs.readFileSync(assets.kombiFull).toString('base64');
    doc.addImage(`data:image/jpeg;base64,${imgKombi}`, 'JPEG', 140, 550, 800, 1000, undefined, 'SLOW');

    doc.setFontSize(30);
    doc.text("V 1.7.1", 540, 1750, { align: "center", charSpace: 10 });
    doc.text("CONJUNTO WAFER & RETRO KOMBI", 540, 1820, { align: "center" });

    // --- PÁGINA 2: LOTE WAFER ---
    doc.addPage([1080, 1920], "portrait");
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, 1080, 1920, 'F');

    doc.setFontSize(70);
    doc.text("LOTE WAFER", 540, 180, { align: "center" });
    
    // Fotos Wafer Lateralmente para não perder proporção
    const waferImg1 = fs.readFileSync(assets.waferAreia).toString('base64');
    doc.addImage(`data:image/jpeg;base64,${waferImg1}`, 'JPEG', 40, 250, 480, 600, undefined, 'SLOW'); 
    
    const waferImg2 = fs.readFileSync(assets.waferBlack).toString('base64');
    doc.addImage(`data:image/jpeg;base64,${waferImg2}`, 'JPEG', 560, 250, 480, 600, undefined, 'SLOW');

    const waferImgDetail = fs.readFileSync(assets.waferMarrom).toString('base64');
    doc.addImage(`data:image/jpeg;base64,${waferImgDetail}`, 'JPEG', 40, 880, 1000, 500, undefined, 'SLOW');

    // Informações
    doc.setFontSize(30);
    doc.text("GRADE DE TAMANHOS: P  M  G  GG", 540, 1550, { align: "center" });
    doc.text("CORES: AREIA | PRETO | MARROM", 540, 1610, { align: "center" });
    
    doc.setFontSize(24);
    doc.text("TECIDO CANELADO EXCLUSIVO (WAFER TEX)", 540, 1750, { align: "center" });

    // --- PÁGINA 3: RETRO KOMBI ---
    doc.addPage([1080, 1920], "portrait");
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, 1080, 1920, 'F');

    doc.setFontSize(70);
    doc.text("RETRO KOMBI", 540, 180, { align: "center" });

    // Foto Kombi com destaque máximo
    doc.addImage(`data:image/jpeg;base64,${imgKombi}`, 'JPEG', 90, 250, 900, 1125, undefined, 'SLOW');

    // Detalhe Puff
    const kombiPuffImg = fs.readFileSync(assets.kombiPuff).toString('base64');
    doc.addImage(`data:image/jpeg;base64,${kombiPuffImg}`, 'JPEG', 40, 1420, 1000, 350, undefined, 'SLOW');

    doc.setFontSize(30);
    doc.text("SERIE VINTAGE - ESTAMPA EM PUFF", 540, 1820, { align: "center" });
    doc.text("P  M  G  GG", 540, 1870, { align: "center" });

    // Salvar
    const pdfData = doc.output();
    fs.writeFileSync("catalogo-mobile-hooke-v2.pdf", pdfData, "binary");
    console.log("PDF v2 Gerado: catalogo-mobile-hooke-v2.pdf");
}

generateCatalog().catch(console.error);
