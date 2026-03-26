const fs = require("fs");
const path = require("path");

function toBase64(filePath) {
    const img = fs.readFileSync(filePath);
    return `data:image/jpeg;base64,${img.toString('base64')}`;
}

async function run() {
    const brainPath = "C:\\Users\\Nando\\.gemini\\antigravity\\brain\\0f2ddb9c-bf0d-4ef7-b875-e0c2cd9c73bd";
    
    // Assets
    const areia = toBase64(path.join(brainPath, "media__1774454835244.jpg"));
    const marrom = toBase64(path.join(brainPath, "media__1774454860929.jpg"));
    const preta = toBase64(path.join(brainPath, "media__1774454885659.jpg"));
    const kombi = toBase64(path.join(brainPath, "media__1774454945771.jpg"));
    const puff = toBase64(path.join(brainPath, "media__1774454952413.jpg"));

    const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Inter', sans-serif; margin: 0; padding: 0; background: #fff; }
        .page { width: 1080px; height: 1920px; position: relative; overflow: hidden; page-break-after: always; }
        .aspect-3-4 { aspect-ratio: 3 / 4; }
        @media print {
            .page { width: 1080px; height: 1920px; }
            body { -webkit-print-color-adjust: exact; }
        }
    </style>
</head>
<body>
    <!-- PAGE 1: COVER -->
    <div class="page flex flex-col justify-between p-24">
        <div class="flex justify-between items-start">
            <h1 class="text-9xl font-black tracking-tighter lowercase">hooke</h1>
            <div class="text-right pt-6">
                <p class="text-lg font-bold tracking-[0.5em] text-gray-300">V 1.7.1</p>
                <p class="text-sm font-bold tracking-[0.2em] text-gray-200 uppercase mt-2">Mobile Catalog</p>
            </div>
        </div>
        
        <div class="relative w-full aspect-3-4 bg-gray-50 flex items-center justify-center">
            <img src="${kombi}" class="absolute inset-0 w-full h-full object-cover shadow-2xl">
            <div class="absolute -bottom-8 -right-8 bg-black text-white p-12 text-2xl font-black tracking-widest uppercase">
                LOT 03 / 2026
            </div>
        </div>

        <div class="flex justify-between items-end border-t-2 border-black pt-12">
            <div>
                <p class="text-xl font-black uppercase tracking-widest">Minimalist Essentials</p>
                <p class="text-lg text-gray-400">The core of modern texture.</p>
            </div>
        </div>
    </div>

    <!-- PAGE 2: WAFER -->
    <div class="page bg-gray-50 p-12 py-32 space-y-24">
        <header class="px-12">
            <h2 class="text-7xl font-black tracking-tighter uppercase italic text-black">Lote Wafer</h2>
            <div class="h-1 w-32 bg-black mt-4"></div>
        </header>

        <div class="grid grid-cols-2 gap-8 px-8 h-[900px] items-start">
            <div class="aspect-3-4 bg-white relative shadow-xl">
                <img src="${areia}" class="w-full h-full object-cover">
                <div class="absolute top-4 left-4 text-xs font-bold tracking-widest uppercase bg-white/90 px-3 py-1">AREIA</div>
            </div>
            <div class="aspect-3-4 bg-white relative shadow-xl mt-32">
                <img src="${preta}" class="w-full h-full object-cover">
                <div class="absolute top-4 left-4 text-xs font-bold tracking-widest uppercase bg-white/90 px-3 py-1 font-sans">BLACK</div>
            </div>
        </div>

        <div class="px-12 space-y-8">
            <img src="${marrom}" class="w-full h-[500px] object-cover rounded-sm shadow-sm grayscale hover:grayscale-0 transition-all duration-700">
            <div class="flex justify-between items-center border-t border-gray-200 pt-8">
                <div>
                   <p class="text-xs font-bold tracking-[0.5em] text-gray-400">SPECS</p>
                   <p class="text-4xl font-black">P M G GG</p>
                </div>
                <p class="text-xs font-bold uppercase tracking-widest text-right">WAFER TEX® <br/> PREMIUM CANELADO</p>
            </div>
        </div>
    </div>

    <!-- PAGE 3: KOMBI -->
    <div class="page bg-black text-white p-24 flex flex-col justify-between">
        <div class="space-y-4">
            <h2 class="text-8xl font-black tracking-tighter uppercase border-l-8 border-white pl-8">RETRO</h2>
            <h3 class="text-5xl font-light tracking-[0.3em] uppercase pl-10 opacity-60">Kombi Series</h3>
        </div>

        <div class="relative w-full aspect-3-4 border border-white/10 shadow-black shadow-2xl overflow-hidden">
            <img src="${kombi}" class="absolute inset-0 w-full h-full object-cover">
        </div>

        <div class="grid grid-cols-2 items-end pt-12">
            <div class="border border-white/20 p-8 flex flex-col gap-6">
                 <img src="${puff}" class="w-full h-48 object-cover opacity-80">
                 <p class="text-xs font-black tracking-[.2em] uppercase">Puff Print High Detail</p>
            </div>
            <div class="text-right space-y-4">
                <p class="text-xs font-bold tracking-[.4em] text-gray-600">SIZES</p>
                <p class="text-3xl font-black italic">P M G GG</p>
                <div className="flex gap-2 justify-end pt-4">
                   <span class="inline-block w-6 h-6 rounded-full bg-white border-2 border-gray-800"></span>
                   <span class="text-sm font-bold tracking-widest">PRETO VINTAGE</span>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
    `;

    fs.writeFileSync("pro-catalog-preview.html", html);
    console.log("HTML profissional gerado: pro-catalog-preview.html");
}

run();
