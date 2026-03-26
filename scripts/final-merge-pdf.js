const { jsPDF } = require("jspdf");
const fs = require("fs");
const path = require("path");

const brainPath = "C:\\Users\\Nando\\.gemini\\antigravity\\brain\\0f2ddb9c-bf0d-4ef7-b875-e0c2cd9c73bd";
const images = [
    path.join(brainPath, "p1_full_1774458416860.png"),
    path.join(brainPath, "p2_full_1774458422149.png"),
    path.join(brainPath, "p3_full_1774458425888.png")
];

const doc = new jsPDF({
    orientation: "portrait",
    unit: "px",
    format: [1080, 1920],
    compress: false // Garantir qualidade máxima
});

images.forEach((imgPath, index) => {
    if (index > 0) doc.addPage([1080, 1920], "portrait");
    
    // Ler imagem como base64
    const imgData = fs.readFileSync(imgPath).toString('base64');
    doc.addImage(imgData, "PNG", 0, 0, 1080, 1920, undefined, "NONE");
});

const outputPath = path.join(brainPath, "catalogo-mobile-hooke-v3-PRO.pdf");
fs.writeFileSync(outputPath, Buffer.from(doc.output("arraybuffer")));

console.log(`PDF Gerado com sucesso em: ${outputPath}`);
