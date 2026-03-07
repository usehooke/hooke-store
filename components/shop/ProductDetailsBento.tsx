import { Feather, Maximize2, Droplets, MapPin, ShieldCheck } from "lucide-react";

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
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
      
      {/* 1. TECIDO */}
      <div className="col-span-2 bg-hooke-100 rounded-sm p-6 flex flex-col justify-between border border-hooke-200">
        <div className="bg-white w-10 h-10 rounded-full flex items-center justify-center mb-4">
          <Feather className="text-hooke-900 w-5 h-5" />
        </div>
        <div>
          <h4 className="font-bold text-hooke-900 uppercase tracking-wider text-sm">{fabric}</h4>
          <p className="text-xs text-hooke-500 mt-1">Toque macio, alta durabilidade e conforto térmico.</p>
        </div>
      </div>

      {/* 2. MODELAGEM */}
      <div className="col-span-1 bg-white rounded-sm p-4 flex flex-col justify-center items-center text-center border border-hooke-100 hover:border-hooke-900 transition-colors">
        <Maximize2 className="text-hooke-400 w-6 h-6 mb-2" />
        <h4 className="font-bold text-xs uppercase">{model}</h4>
        <p className="text-[10px] text-hooke-400 mt-1">Caimento perfeito</p>
      </div>

      {/* 3. LAVAGEM */}
      <div className="col-span-1 bg-white rounded-sm p-4 flex flex-col justify-center items-center text-center border border-hooke-100 hover:border-hooke-900 transition-colors">
        <Droplets className="text-hooke-400 w-6 h-6 mb-2" />
        <h4 className="font-bold text-xs uppercase">{wash}</h4>
        <p className="text-[10px] text-hooke-400 mt-1">Não encolhe</p>
      </div>

      {/* 4. ORIGEM */}
      <div className="col-span-2 md:col-span-4 bg-hooke-900 rounded-sm p-4 flex items-center justify-between text-white">
        <div className="flex items-center gap-3">
          <MapPin className="text-hooke-200 w-5 h-5" />
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider">Produção Local</h4>
            <p className="text-xs text-gray-400">Feito eticamente em São Paulo, Brasil.</p>
          </div>
        </div>
        <ShieldCheck className="text-green-400 w-5 h-5" />
      </div>
    </div>
  );
}