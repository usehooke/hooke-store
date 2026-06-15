"use client";

import { CldImage } from "next-cloudinary";
import type { CldImageProps } from "next-cloudinary";

/**
 * HOOKE — CldImageHooke
 * 
 * Componente centralizador de todas as imagens Cloudinary do projeto.
 * Implementa o efeito "blur-up" automático:
 *  1. Gera um blurDataURL a partir da URL Cloudinary (versão 1% qualidade, blur 200)
 *  2. Exibe o blur como placeholder enquanto a imagem real carrega
 *  3. Transição suave entre o blur e a imagem final
 * 
 * Uso: substitua <CldImage> por <CldImageHooke> em qualquer componente.
 */

/**
 * Gera a URL de um placeholder blur leve a partir de um publicId do Cloudinary.
 * Resultado: imagem tiny de ~200 bytes, perfeita para uso como blurDataURL.
 */
function buildBlurUrl(src: string): string {
  // Se for upload normal do Cloudinary, usa transformações
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'hooke';
  return `https://res.cloudinary.com/${cloudName}/image/upload/e_blur:1200,q_1,f_avif,w_20/${src}`;
}

interface CldImageHookeProps extends Omit<CldImageProps, "placeholder" | "blurDataURL"> {
  src: string;
}

export function CldImageHooke({ src, ...props }: CldImageHookeProps) {
  const blurUrl = buildBlurUrl(src);

  return (
    <CldImage
      src={src}
      placeholder="blur"
      blurDataURL={blurUrl}
      format="avif"
      quality="auto"
      {...props}
    />
  );
}

export default CldImageHooke;
