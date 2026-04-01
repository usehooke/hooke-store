$mapping = @{
    "camiseta-oversized-preta-premium-hooke-3.avif" = "HK_PROD_OV_BLACK_03.avif";
    "camiseta-oversized-preta-premium-hooke-1.avif" = "HK_PROD_OV_BLACK_01.avif";
    "camiseta-oversized-preta-premium-hooke-2.avif" = "HK_PROD_OV_BLACK_02.avif";
    "camiseta-oversized-preta-premium-hooke-4.avif" = "HK_PROD_OV_BLACK_04.avif";
    "camiseta-oversized-preta-premium-hooke-5.avif" = "HK_PROD_OV_BLACK_05.avif";
    "camiseta-oversized-offwhite-premium-hooke-1.avif" = "HK_PROD_OV_OFFWHITE_01.avif";
    "camiseta-oversized-offwhite-premium-hooke-2.avif" = "HK_PROD_OV_OFFWHITE_02.avif";
    "camiseta-oversized-offwhite-premium-hooke-3.avif" = "HK_PROD_OV_OFFWHITE_03.avif";
    "camiseta-oversized-offwhite-premium-hooke-4.avif" = "HK_PROD_OV_OFFWHITE_04.avif";
    "camiseta-oversized-azul-premium-hooke-1.avif" = "HK_PROD_OV_BLUE_01.avif";
    "camiseta-oversized-azul-premium-hooke-2.avif" = "HK_PROD_OV_BLUE_02.avif";
    "camiseta-oversized-azul-premium-hooke-3.avif" = "HK_PROD_OV_BLUE_03.avif";
    "camiseta-oversized-verde-premium-hooke-1.avif" = "HK_PROD_OV_GREEN_01.avif";
    "camiseta-oversized-verde-premium-hooke-2.avif" = "HK_PROD_OV_GREEN_02.avif";
    "camiseta-Regata-canelada-verde-1.jpg" = "HK_PROD_RE_MILITARY_01.jpg";
    "camiseta-Regata-canelada-verde-2.jpg" = "HK_PROD_RE_MILITARY_02.jpg";
    "Hooke-Regata-Canelada-Verde.avif" = "HK_PROD_RE_MILITARY_HERO.avif";
    "camiseta-Regata-canelada-areia-1.jpg" = "HK_PROD_RE_SAND_01.jpg";
    "camiseta-Regata-canelada-areia-2.jpg" = "HK_PROD_RE_SAND_02.jpg";
    "camiseta-Regata-canelada-marrom-1.jpg" = "HK_PROD_RE_COFFEE_01.jpg";
    "camiseta-Regata-canelada-marrom-2.jpg" = "HK_PROD_RE_COFFEE_02.jpg";
    "camiseta-Regata-canelada-marrom-3.jpg" = "HK_PROD_RE_COFFEE_03.jpg";
    "regata-lifestyle-bege.jpg" = "HK_PROD_RE_LIFESTYLE_BEGE_01.jpg";
    "camiseta-Regata-algodao-branca-1.jpg" = "HK_PROD_RE_WHITE_01.jpg";
    "camiseta-vintage-fusca-preta-1.jpg" = "HK_PROD_VI_FUSCA_BLACK_01.jpg";
    "camiseta-vintage-fusca-preta-2.png" = "HK_PROD_VI_FUSCA_BLACK_02.png";
    "camiseta-vintage-fusca-preta-3.png" = "HK_PROD_VI_FUSCA_BLACK_03.png";
    "camiseta-vintage-fusca-offwhite-1.jpg" = "HK_PROD_VI_FUSCA_OFFWHITE_01.jpg";
    "camiseta-vintage-fusca-offwhite-4.jpg" = "HK_PROD_VI_FUSCA_OFFWHITE_04.jpg";
    "camiseta-vintage-fusca-bordo-1.jpg" = "HK_PROD_VI_FUSCA_BORDO_01.jpg";
    "camiseta-vintage-kombi-offwhite-1.jpg" = "HK_PROD_VI_KOMBI_OFFWHITE_01.jpg";
    "camiseta-vintage-maverik-vermelha-1.jpg" = "HK_PROD_VI_MAVERICK_RED_01.jpg";
    "camiseta-vintage-maverik-areia-1.jpg" = "HK_PROD_VI_MAVERICK_AREIA_01.jpg";
    "wafer-elite.png" = "HK_PROD_WAFER_ELITE.png";
}

foreach ($oldName in $mapping.Keys) {
    $newName = $mapping[$oldName]
    $oldPath = "public/produtos/$oldName"
    $newPath = "public/produtos/$newName"
    if (Test-Path $oldPath) {
        Rename-Item -Path $oldPath -NewName $newName -Force
        Write-Host "Renamed: $oldName -> $newName"
    } else {
        Write-Host "Not found: $oldName"
    }
}
