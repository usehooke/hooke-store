import { Feather, Maximize2, Droplets, MapPin, ShieldCheck, Sparkles } from "lucide-react";

// Agora recebe as "details" do produto como props
interface BentoProps {
  details?: {
    fabric: string;
    model: string;
    wash: string;
  }
}

export default function ProductDetailsBento({ details }: BentoProps) {
  // Valores padrão caso não venha preenchido
  const fabric = details?.fabric || "Algodão Premium";
  const model = details?.model || "Regular Fit";
  const wash = details?.wash || "Pré-Encolhida";

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mt-4 font-sans">
      
      {/* 1. MATERIAL (Compact) */}
      <div className="col-span-2 bg-white rounded-sm p-4 flex items-center gap-4 border border-gray-100 hover:border-hooke-900 transition-all duration-500 group">
        <div className="bg-hooke-50 w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center group-hover:scale-110 transition-transform">
          <Feather className="text-hooke-900 w-4 h-4" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-bold text-hooke-400 uppercase tracking-widest leading-none">Material</span>
            <Sparkles className="text-yellow-500 w-2.5 h-2.5" />
          </div>
          <h4 className="font-black text-hooke-900 uppercase tracking-tight text-sm leading-tight">{fabric}</h4>
        </div>
      </div>

      {/* 2. MODELAGEM (Compact) */}
      <div className="col-span-1 bg-gray-50/50 rounded-sm p-3 flex flex-col justify-center items-center text-center border border-transparent hover:border-gray-200 transition-all">
        <Maximize2 className="text-hooke-900 w-4 h-4 mb-2" />
        <h4 className="font-bold text-[10px] uppercase text-hooke-900 leading-tight">{model}</h4>
      </div>

      {/* 3. LAVAGEM (Compact) */}
      <div className="col-span-1 bg-gray-50/50 rounded-sm p-3 flex flex-col justify-center items-center text-center border border-transparent hover:border-gray-200 transition-all">
        <Droplets className="text-hooke-900 w-4 h-4 mb-2" />
        <h4 className="font-bold text-[10px] uppercase text-hooke-900 leading-tight">{wash}</h4>
      </div>

      {/* 4. ORIGEM (Slim Bar) */}
      <div className="col-span-2 lg:col-span-4 bg-hooke-900 rounded-sm p-3 flex items-center justify-between text-white overflow-hidden relative">
        <div className="flex items-center gap-3 relative z-10">
          <MapPin className="text-white w-3 h-3" />
          <h4 className="font-black text-[10px] uppercase tracking-widest">Produção Ética • SP</h4>
        </div>
        <ShieldCheck className="text-green-400 w-4 h-4 relative z-10" />
      </div>
    </div>
  );
}