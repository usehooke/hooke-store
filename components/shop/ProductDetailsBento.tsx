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
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-8 font-sans">
      
      {/* 1. TECIDO (Editorial Look) */}
      <div className="col-span-2 bg-white rounded-sm p-6 flex flex-col justify-between border border-gray-100 hover:border-hooke-900 transition-all duration-500 group">
        <div className="bg-hooke-50 w-12 h-12 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
          <Feather className="text-hooke-900 w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold text-hooke-400 uppercase tracking-[0.2em]">Material</span>
            <Sparkles className="text-yellow-500 w-3 h-3" />
          </div>
          <h4 className="font-black text-hooke-900 uppercase tracking-tight text-lg leading-tight">{fabric}</h4>
          <p className="text-[11px] text-gray-500 mt-2 leading-relaxed">Desenvolvida com fibras selecionadas para um toque ultra-macio e durabilidade superior.</p>
        </div>
      </div>

      {/* 2. MODELAGEM */}
      <div className="col-span-1 bg-gray-50/50 rounded-sm p-5 flex flex-col justify-center items-center text-center border border-transparent hover:border-gray-200 transition-all">
        <Maximize2 className="text-hooke-900 w-5 h-5 mb-3" />
        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Corte</span>
        <h4 className="font-bold text-xs uppercase text-hooke-900 leading-tight">{model}</h4>
      </div>

      {/* 3. LAVAGEM */}
      <div className="col-span-1 bg-gray-50/50 rounded-sm p-5 flex flex-col justify-center items-center text-center border border-transparent hover:border-gray-200 transition-all">
        <Droplets className="text-hooke-900 w-5 h-5 mb-3" />
        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Tratamento</span>
        <h4 className="font-bold text-xs uppercase text-hooke-900 leading-tight">{wash}</h4>
      </div>

      {/* 4. ORIGEM (Full Width Bar) */}
      <div className="col-span-2 lg:col-span-4 bg-hooke-900 rounded-sm p-5 flex items-center justify-between text-white overflow-hidden relative">
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
            <MapPin className="text-white w-4 h-4" />
          </div>
          <div>
            <h4 className="font-black text-sm uppercase tracking-tighter">Produção Local & Ética</h4>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest">Brás, São Paulo • Brasil</p>
          </div>
        </div>
        <ShieldCheck className="text-green-400 w-6 h-6 relative z-10" />
        {/* Efeito Visual de Fundo */}
        <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/5 rounded-full blur-2xl" />
      </div>
    </div>
  );
}