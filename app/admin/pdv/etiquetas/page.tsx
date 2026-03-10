"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Product } from "@/types";
import BarcodeLabel from "@/components/pdv/BarcodeLabel";
import { Package, Printer, Plus, Minus, ArrowLeft, Search } from "lucide-react";
import Link from "next/link";
import { generateSKU, ModelSigla } from "@/utils/sku-generator";

export default function LabelGeneratorPage() {
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("M");

  const { data: products } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await fetch("/api/products");
      return res.json();
    },
  });

  const filteredProducts = products?.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const currentSKU = selectedProduct ? generateSKU({
      model: (selectedProduct.category === 'Oversized' ? 'OVE' : 'TSH') as ModelSigla,
      print: selectedProduct.name.split(' ')[1] || 'HOOK',
      color: selectedProduct.name.split(' ')[2] || 'BLK',
      size: selectedSize
  }) : "";

  return (
    <div className="min-h-screen bg-hooke-50 text-hooke-900 font-sans p-6">
      <div className="max-w-6xl mx-auto">
        <header className="flex items-center gap-4 mb-8">
            <Link href="/admin/pdv" className="p-3 shadow-neumorph rounded-full active:shadow-neumorph-inset">
                <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-2xl font-black tracking-tighter uppercase">Gerador de Etiquetas</h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Config Section */}
          <div className="space-y-6">
            <div className="bg-hooke-50 p-6 shadow-neumorph space-y-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-hooke-500">1. Selecionar Produto</h3>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar produto..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-hooke-50 p-4 pl-12 shadow-neumorph-inset outline-none"
                />
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-hooke-500" />
              </div>
              
              <div className="max-h-64 overflow-y-auto space-y-2 pr-2">
                {filteredProducts?.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedProduct(p)}
                    className={`w-full text-left p-3 text-xs font-bold uppercase transition-all ${
                      selectedProduct?.id === p.id ? "shadow-neumorph-inset bg-hooke-900 text-white" : "shadow-neumorph"
                    }`}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>

            {quantity > 0 && selectedProduct && (
              <div className="bg-hooke-50 p-6 shadow-neumorph space-y-6">
                <h3 className="text-xs font-black uppercase tracking-widest text-hooke-500">2. Configurações</h3>
                
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase">Tam:</span>
                  <div className="flex gap-2">
                    {["P", "M", "G", "GG"].map(s => (
                      <button 
                        key={s} 
                        onClick={() => setSelectedSize(s)}
                        className={`px-3 py-1 text-[10px] font-black shadow-neumorph ${selectedSize === s ? "shadow-neumorph-inset" : ""}`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase">Qtd de Etiquetas:</span>
                  <div className="flex items-center gap-4">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 shadow-neumorph">
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="text-lg font-black">{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)} className="p-2 shadow-neumorph">
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Preview Section */}
          <div className="bg-hooke-50 p-8 shadow-neumorph h-fit sticky top-6">
            <h3 className="text-xs font-black uppercase tracking-widest text-hooke-500 mb-6">Preview Térmico (40x25mm)</h3>
            
            {selectedProduct ? (
              <div className="flex flex-col items-center">
                  <div className="p-8 bg-gray-200 shadow-neumorph-inset mb-8 flex justify-center w-full">
                    <BarcodeLabel 
                        sku={currentSKU} 
                        name={selectedProduct.name} 
                        size={selectedSize}
                    />
                  </div>
                  
                  <button 
                    className="w-full bg-hooke-900 text-white p-6 font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-neumorph active:scale-95 transition-all"
                    onClick={() => window.print()}
                  >
                    <Printer className="h-5 w-5" />
                    Imprimir {quantity} Etiquetas
                  </button>
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-hooke-300 border-2 border-dashed border-hooke-200">
                <Package className="h-12 w-12 mb-4" />
                <p className="text-xs font-bold uppercase">Selecione um produto</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          body * { visibility: hidden; }
          .print-area, .print-area * { visibility: visible; }
          .print-area { position: absolute; left: 0; top: 0; }
        }
      `}</style>
    </div>
  );
}
