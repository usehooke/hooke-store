---
name: hooke-photo-studio
description: Diretrizes e padronização para a geração de fotografias (produtos, editoriais e campanhas) para a marca Hooke Store.
---

# Hooke Photo Studio

This skill dictates the exact standard operating procedure for generating AI photography for Hooke Store. You must ALWAYS adhere to these guidelines when asked to generate product, editorial, or campaign photos for the site.

## 1. The Founder Anchor (Model Profile)
The model used in Hooke Store photography must ALWAYS be exactly the same person to maintain brand consistency. 

**Core Physical Traits:**
- Brazilian man, early 30s.
- Broad stocky athletic build.
- Fair skin.
- Very short buzzed dark hair.
- Well-groomed short dark beard.
- Blue-green eyes, strong jaw.
- Confident, serious expression with subtle intensity.
- **Accessories:** He ALWAYS wears a thin black cord necklace with a small gold Hamsa pendant visible on his chest.

## 2. Brand Aesthetic & Lighting
Hooke Store follows a **Soft Brutalism** and minimalist premium aesthetic. 
- Avoid generic colors.
- Images must look highly realistic, high-end fashion catalog or high-end streetwear editorial style.
- No extreme exaggerated lighting; prefer soft studio lighting for product focus, or natural golden hour/overcast lighting for outdoor editorials.
- T-shirts are "Regular Algodão com certificado 30,1 penteada de 210g t-shirt, Canelada Comum" (heavyweight cotton, ribbed 3cm collar).

## 3. Standard Shots
When asked to generate photos, categorize them into one of these standard shots unless instructed otherwise:

### A. HERO (Full Body / 3/4)
- **Framing:** Full body or 3/4 shot (from thighs/knees up).
- **Styling:** The t-shirt is paired with dark raw denim jeans and clean minimalist white sneakers (or black boots, depending on the vibe).
- **Environment:** Clean studio background (concrete, soft gray, or off-white) or minimal industrial setting.
- **Pose:** Standing naturally, confident, arms relaxed at sides or one hand slightly in pocket.

### B. EDITORIAL (Candid / Lifestyle)
- **Framing:** Medium to full shot.
- **Styling:** Same as Hero, but interacting with the environment.
- **Environment:** Urban, industrial setting (e.g., concrete walls, brutalist architecture, city streets). 
- **Lighting:** Natural lighting, slightly moody or cinematic.
- **Pose:** Walking naturally, looking slightly to the side or over the shoulder. Candid feel.

### C. DETAIL (Close-up)
- **Framing:** Extreme close-up on the chest area.
- **Focus:** Showcasing the texture of the fabric and the exact details of the screen-printed graphic (silk screen ink texture). 
- **Accessories:** The gold Hamsa pendant should be partially visible resting near the collar/graphic.
- **Lighting:** Soft macro studio lighting to highlight textures.

## 4. Workflow for Graphic Tees (Vintage Category)
When generating a Vintage (Graphic) T-shirt:
1. Always incorporate the exact print description (e.g., "vintage-style screen-printed illustration of a classic Volkswagen Beetle...").
2. Explicitly tell the AI to "display the screen-printed graphic on the chest".
3. Provide the flat-lay product image as an ImagePath reference to the `generate_image` tool so the AI can accurately reproduce the print.

## 5. File Output Strategy
All generated final campaign photos MUST be saved directly to the site's public folder for immediate use:
**Path:** `C:\Users\Nando\Documents\Hooke_site\public\produtos\campanhas\`
Name the files descriptively, e.g., `hero_fusca_offwhite.png` or `editorial_kombi_black.png`.
