"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Product } from "@/data/catalogo"; // IMPORTAÇÃO CORRIGIDA

interface ProductGalleryProps {
  product: Product;
}

export default function ProductGallery({ product }: ProductGalleryProps) {
  // Fallback seguro se não tiver galeria extra
  const images = product.images && product.images.length > 0
    ? product.images
    : [product.imageUrl, product.imageUrl, product.imageUrl, product.imageUrl];

  const [selectedImage, setSelectedImage] = useState(images[0]);

  // V4: Ouve eventos de mudança de cor disparados por outros componentes
  useEffect(() => {
    const handleImageChange = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      if (customEvent.detail) {
        setSelectedImage(customEvent.detail);
      }
    };
    window.addEventListener("change-product-image", handleImageChange);
    return () => window.removeEventListener("change-product-image", handleImageChange);
  }, []);

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4 w-full h-full">

      {/* THUMBNAILS */}
      <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto scrollbar-hide py-2 md:py-0 px-1 md:px-0 justify-start md:w-24 md:h-[80vh] sticky top-24">
        {images.map((img, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(img)}
            className={`
              relative w-20 h-24 md:w-full md:h-32 flex-shrink-0 cursor-pointer transition-all duration-300
              ${selectedImage === img
                ? "opacity-100 ring-2 ring-hooke-900 ring-offset-2"
                : "opacity-60 hover:opacity-100 border border-gray-100"
              }
            `}
          >
            <Image
              src={img}
              alt={`Vista ${index + 1}`}
              fill
              className="object-cover object-center"
              sizes="100px"
            />
          </button>
        ))}
      </div>

      {/* MAIN IMAGE */}
      <div className="relative flex-1 aspect-[4/5] md:aspect-auto md:h-[85vh] bg-gray-50 overflow-hidden group cursor-zoom-in">
        <Image
          src={selectedImage}
          alt={product.seoAltText || product.name}
          fill
          priority
          className="object-cover object-center transition-all duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 70vw"
        />
      </div>
    </div>
  );
}