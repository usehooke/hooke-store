"use client";

import { useState } from "react";
import { Loader2, Truck } from "lucide-react";
import { useCartStore } from "@/store/cart-store";

const formatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

export default function ShippingSection() {
  const items = useCartStore(state => state.items);
  const { shippingZipCode, shippingMethod, setShipping } = useCartStore();
  
  const [zipInput, setZipInput] = useState(shippingZipCode || "");
  const [isCalculating, setIsCalculating] = useState(false);
  const [options, setOptions] = useState<Array<{ nome: string, valor: string, prazo: string }>>([]);
  const [error, setError] = useState("");

  const handleZipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 5) value = value.replace(/^(\d{5})(\d)/, "$1-$2");
    setZipInput(value.substring(0, 9));
  };

  const calculateShipping = async () => {
    if (zipInput.length !== 9) {
      setError("CEP inválido");
      return;
    }
    setError("");
    setIsCalculating(true);

    const weight = Math.max(0.3, items.reduce((acc, item) => acc + ((item.weight || 0.3) * item.quantity), 0));
    const volumeTotal = items.reduce((acc, item) => acc + ((item.weight ? (item.weight * 1000) : 300) * item.quantity), 0);
    // Aproximação grosseira para dimensões caso frontend seja responsável (mas a API exige cm)
    // O ideal: enviar weight, altura, largura, comprimento. Vamos usar um tamanho flexivel.
    const height = Math.max(2, items.reduce((acc, item) => acc + (2 * item.quantity), 0));
    
    try {
      const res = await fetch("/api/shipping", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
           cepDestino: zipInput, 
           peso: weight.toString(),
           altura: height.toString(),
           largura: "25",
           comprimento: "20"
        })
      });
      const data = await res.json();

      if (!res.ok) {
        if (data.fallbackWhatsApp) {
          setError("FALLBACK_WHATSAPP");
          return;
        }
        throw new Error(data.message || "Erro ao calcular");
      }

      setOptions(data.fretes);
    } catch (err) {
      setError("Serviço de frete instável. Tente novamente ou use o WhatsApp.");
    } finally {
      setIsCalculating(false);
    }
  };

  if (items.length === 0) return null;

  return (
    <div className="border-t border-hooke-100 pt-6 mt-4">
      <label className="text-[10px] font-black tracking-[0.2em] text-hooke-900 uppercase block mb-3">
        Simular Frete
      </label>
      
      <div className="flex gap-2 mb-3">
        <input
          type="text"
          placeholder="00000-000"
          value={zipInput}
          onChange={handleZipChange}
          className="flex-1 border border-hooke-200 px-4 py-3 text-sm focus:outline-none focus:border-hooke-900 focus:ring-1 focus:ring-hooke-900 rounded-none bg-white transition-all placeholder:text-gray-300 font-bold"
        />
        <button
          onClick={calculateShipping}
          disabled={isCalculating || zipInput.length < 9}
          className="bg-hooke-900 text-white px-6 py-3 text-[10px] font-black tracking-[0.2em] uppercase disabled:opacity-50 hover:bg-black transition-all rounded-none whitespace-nowrap min-w-[120px]"
        >
          {isCalculating ? <Loader2 size={16} className="animate-spin mx-auto" /> : "Calcular"}
        </button>
      </div>

      {error && error !== "FALLBACK_WHATSAPP" && (
        <p className="text-[10px] text-red-500 font-bold mb-3 animate-in fade-in">{error}</p>
      )}

      {error === "FALLBACK_WHATSAPP" && (
        <div className="bg-amber-50 border border-amber-200 p-4 mb-4 animate-in fade-in slide-in-from-top-2">
          <p className="text-[10px] text-amber-800 font-bold leading-relaxed uppercase tracking-wider">
            Correios em manutenção. Finalize via WhatsApp para frete manual.
          </p>
        </div>
      )}

      {options.length > 0 && (
        <div className="space-y-2 mt-4 animate-in fade-in slide-in-from-top-2">
          {options.map((opt, idx) => {
            const selected = shippingMethod === opt.nome;
            return (
              <button
                key={idx}
                onClick={() => setShipping(zipInput, Number(opt.valor), opt.nome)}
                className={`w-full flex items-center justify-between p-4 border text-left bg-white transition-all cursor-pointer rounded-none group
                ${selected ? 'border-hooke-900 bg-white ring-1 ring-hooke-900' : 'border-hooke-200 hover:border-hooke-400'}
                `}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-5 h-5 rounded-none border-2 flex items-center justify-center shrink-0 transition-colors ${selected ? 'border-hooke-900' : 'border-gray-200'}`}>
                    {selected && <div className="w-2.5 h-2.5 bg-hooke-900 rounded-none" />}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-black text-hooke-900 uppercase tracking-widest">{opt.nome}</span>
                    <span className="text-[10px] text-gray-400 font-bold">Entrega em até {opt.prazo} dias úteis</span>
                  </div>
                </div>
                <span className="text-sm font-black text-hooke-900">{formatter.format(Number(opt.valor))}</span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  );
}
