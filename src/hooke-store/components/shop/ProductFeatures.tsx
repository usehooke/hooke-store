// components/shop/ProductFeatures.tsx
import { Truck, ShieldCheck, Gem, RefreshCw } from "lucide-react";

export default function ProductFeatures() {
  const features = [
    {
      icon: <Gem className="w-5 h-5" />,
      title: "Algodão Premium",
      description: "Toque macio e alta durabilidade.",
    },
    {
      icon: <RefreshCw className="w-5 h-5" />,
      title: "1ª Troca Grátis",
      description: "Se não servir, a gente resolve.",
    },
    {
      icon: <Truck className="w-5 h-5" />,
      title: "Envio Rápido",
      description: "Despachamos em até 24h.",
    },
    {
      icon: <ShieldCheck className="w-5 h-5" />,
      title: "Compra Segura",
      description: "Seus dados 100% protegidos.",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-hooke-100 animate-in fade-in duration-700 delay-500">
      {features.map((feature, index) => (
        <div key={index} className="flex items-start gap-3">
          <div className="p-2 bg-hooke-50 text-hooke-900 rounded-sm">
            {feature.icon}
          </div>
          <div>
            <h4 className="text-sm font-bold text-hooke-900 uppercase tracking-wide">
              {feature.title}
            </h4>
            <p className="text-xs text-hooke-500 mt-0.5">
              {feature.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}