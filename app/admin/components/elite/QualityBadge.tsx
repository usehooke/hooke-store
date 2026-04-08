"use client";

import { CheckCircle2, AlertCircle, HelpCircle } from "lucide-react";
import { Product } from "@/types";

interface QualityBadgeProps {
  product: Product;
}

export function QualityBadge({ product }: QualityBadgeProps) {
  const issues: string[] = [];

  // Critérios Elite Hooke
  if (!product.department) issues.push("Sem departamento definido");
  if (!product.images || product.images.length < 4) issues.push(`Poucas fotos na galeria (${product.images?.length || 0}/4)`);
  if (!product.seo?.metaDescription || product.seo.metaDescription.length < 50) issues.push("Meta Description incompleta para Google");
  if (!product.description || product.description.length < 100) issues.push("Descrição rica muito curta");

  const isElite = issues.length === 0;

  if (isElite) {
    return (
      <div className="flex items-center gap-1.5 text-green-600 bg-green-50 px-2 py-1 rounded-full border border-green-100">
        <CheckCircle2 size={12} />
        <span className="text-[10px] font-black tracking-widest uppercase">Padrão Elite</span>
      </div>
    );
  }

  return (
    <div 
      className="flex items-center gap-1.5 text-amber-600 bg-amber-50 px-2 py-1 rounded-full border border-amber-100 cursor-help group relative"
      title={issues.join(" | ")}
    >
      <AlertCircle size={12} />
      <span className="text-[10px] font-black tracking-widest uppercase">Requer Atualização</span>
      
      {/* Tooltip customizado simples */}
      <div className="absolute bottom-full mb-2 left-0 hidden group-hover:block z-50 bg-white border border-gray-200 p-3 shadow-xl w-64 pointer-events-none">
        <p className="text-[10px] font-black text-amber-900 border-b border-amber-100 pb-1 mb-2">PENDÊNCIAS TÉCNICAS:</p>
        <ul className="space-y-1">
          {issues.map((issue, i) => (
            <li key={i} className="text-[9px] text-amber-800 flex items-start gap-1">
              • {issue}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
