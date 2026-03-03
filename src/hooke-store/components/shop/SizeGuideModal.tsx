// components/shop/SizeGuideModal.tsx
"use client";

import Image from "next/image";
import { Ruler, Info } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { sizeGuideData, modelReferenceInfo, measurementDiagramUrl } from "@/data/size-guide";

export default function SizeGuideModal() {
  return (
    <Dialog>
      {/* O GATILHO: O botão que o usuário clica na página do produto */}
      <DialogTrigger asChild>
        <button className="flex items-center gap-1.5 text-xs font-medium text-hooke-600 hover:text-hooke-900 underline-offset-2 hover:underline transition-colors">
          <Ruler size={14} />
          Guia de Medidas
        </button>
      </DialogTrigger>

      {/* O CONTEÚDO DO MODAL */}
      <DialogContent className="sm:max-w-[800px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-hooke-900 uppercase tracking-wider flex items-center gap-2">
            <Ruler className="text-hooke-500" /> Guia de Medidas e Caimento
          </DialogTitle>
          <DialogDescription>
            Use a tabela abaixo para encontrar o tamanho perfeito para você. Medidas em centímetros (cm) com a peça esticada em superfície plana.
          </DialogDescription>
        </DialogHeader>

        {/* CORPO DO MODAL: Layout Flexível (Mobile: Coluna / Desktop: Linha) */}
        <div className="mt-6 flex flex-col md:flex-row gap-8 items-start">
          
          {/* LADO ESQUERDO: Diagrama Visual */}
          <div className="w-full md:w-1/3 flex flex-col gap-4">
            <div className="relative aspect-[3/4] w-full rounded-sm overflow-hidden bg-hooke-50 border border-hooke-100">
              <Image
                src={measurementDiagramUrl}
                alt="Diagrama de como medir a camiseta"
                fill
                className="object-contain p-4"
              />
            </div>
            {/* Legenda do Diagrama */}
            <div className="text-sm text-hooke-600 space-y-1 bg-hooke-50 p-3 rounded-sm">
              <p><span className="font-bold text-hooke-900">A: Tórax:</span> Medida de axila a axila.</p>
              <p><span className="font-bold text-hooke-900">B: Comprimento:</span> Do ponto mais alto do ombro até a barra.</p>
            </div>
          </div>

          {/* LADO DIREITO: Tabela de Dados */}
          <div className="w-full md:w-2/3">
            <div className="overflow-hidden rounded-sm border border-hooke-200">
              <table className="w-full text-sm text-left text-hooke-600">
                <thead className="text-xs text-hooke-900 uppercase bg-hooke-100 font-bold tracking-wider">
                  <tr>
                    <th scope="col" className="px-4 py-3">Tamanho</th>
                    <th scope="col" className="px-4 py-3">A. Tórax</th>
                    <th scope="col" className="px-4 py-3">B. Comprimento</th>
                    <th scope="col" className="px-4 py-3 hidden sm:table-cell">C. Manga</th>
                  </tr>
                </thead>
                <tbody>
                  {sizeGuideData.map((row, index) => (
                    <tr 
                      key={row.size} 
                      className={`border-b border-hooke-100 hover:bg-hooke-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-hooke-50/30'}`}
                    >
                      <th scope="row" className="px-4 py-3 font-bold text-hooke-900 whitespace-nowrap">
                        <span className="inline-block w-8 h-8 leading-8 text-center rounded-sm bg-hooke-900 text-white">{row.size}</span>
                      </th>
                      <td className="px-4 py-3 font-medium">{row.chest}</td>
                      <td className="px-4 py-3 font-medium">{row.length}</td>
                      <td className="px-4 py-3 hidden sm:table-cell">{row.sleeve}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Dica do Modelo */}
            <div className="mt-6 flex items-start gap-2 bg-blue-50 p-4 rounded-sm text-blue-800 text-sm border border-blue-100">
              <Info size={18} className="mt-0.5 flex-shrink-0" />
              <p className="font-medium">{modelReferenceInfo}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}