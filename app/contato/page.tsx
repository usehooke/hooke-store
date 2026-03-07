import { MessageCircle, MapPin, Mail, Clock } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Fale Conosco | Hooke",
  description: "Entre em contato com a Hooke. Atendimento via WhatsApp, E-mail ou em nossa loja física no Brás.",
};

export default function ContactPage() {
  return (
    <main className="w-full bg-white min-h-screen">
      
      {/* 1. CABEÇALHO (Full Width) */}
      <div className="w-full px-6 md:px-12 pt-20 pb-12 border-b border-gray-100">
        <h1 className="text-4xl md:text-6xl font-black text-hooke-900 uppercase tracking-tighter leading-[0.9] mb-6">
          Atendimento <br/> Premium
        </h1>
        <p className="font-sans text-sm text-gray-500 max-w-lg leading-relaxed">
          Dúvidas sobre medidas, envios ou quer comprar em atacado? 
          Nossa equipe responde em minutos.
        </p>
      </div>

      {/* 2. GRID DE CONTATO */}
      <div className="w-full px-6 md:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24">
          
          {/* Lado Esquerdo: Canais Diretos */}
          <div className="space-y-12">
            
            {/* Bloco WhatsApp (Destaque) */}
            <div className="bg-hooke-50 p-8 border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <MessageCircle size={24} className="text-green-600" />
                <h3 className="text-lg font-black uppercase tracking-tight">WhatsApp</h3>
              </div>
              <p className="text-sm text-gray-600 mb-6">
                O canal mais rápido. Resolvemos trocas, dúvidas de tamanho e vendas diretas por aqui.
              </p>
              <Link 
                href="https://wa.me/5511975902528" 
                target="_blank"
                className="inline-flex w-full items-center justify-center gap-2 bg-green-600 text-white px-6 py-4 text-xs font-bold uppercase tracking-widest hover:bg-green-700 transition-colors shadow-sm"
              >
                Iniciar Conversa
              </Link>
            </div>

            {/* Outros Canais */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div>
                <div className="flex items-center gap-2 mb-2 text-hooke-900">
                  <Mail size={18} />
                  <h4 className="text-xs font-bold uppercase tracking-widest">E-mail</h4>
                </div>
                <p className="text-sm text-gray-500">sac@usehooke.com.br</p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2 text-hooke-900">
                  <Clock size={18} />
                  <h4 className="text-xs font-bold uppercase tracking-widest">Horário</h4>
                </div>
                <p className="text-sm text-gray-500">Seg a Sex: 08h às 18h</p>
              </div>
            </div>

          </div>

          {/* Lado Direito: Loja Física (Autoridade) */}
          <div className="relative h-full min-h-[400px] bg-gray-100 border border-gray-200 p-8 flex flex-col justify-end">
            {/* Se tiver foto da loja, use Image com fill aqui. Se não, use este bloco tipográfico */}
            <div className="absolute inset-0 bg-hooke-900 overflow-hidden">
               {/* Mapa ou Foto da Loja ficaria aqui. 
                   Como placeholder, deixamos um fundo escuro elegante. */}
               <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
            </div>

            <div className="relative z-10 text-white">
              <div className="mb-6">
                <MapPin size={32} strokeWidth={1} className="mb-4" />
                <h3 className="text-2xl font-black uppercase tracking-tight mb-2">Loja Física</h3>
                <p className="text-sm text-gray-300 leading-relaxed max-w-xs">
                  Shopping Vautier Premium<br />
                  Brás, São Paulo - SP
                </p>
              </div>
              <Link 
                href="https://maps.google.com/?q=Shopping+Vautier+Premium" 
                target="_blank"
                className="text-xs font-bold uppercase tracking-widest border-b border-white pb-1 inline-block hover:text-gray-300 hover:border-gray-300 transition-colors"
              >
                Ver no Mapa
              </Link>
            </div>
          </div>

        </div>
      </div>

      {/* 3. FAQ RÁPIDO */}
      <div className="w-full bg-hooke-50 px-6 md:px-12 py-20 border-t border-gray-100">
        <h2 className="text-2xl font-black uppercase tracking-tight mb-12 text-center">Dúvidas Frequentes</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-white p-8 border border-gray-100">
            <h3 className="text-xs font-bold uppercase tracking-widest mb-3">Qual o prazo de entrega?</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Enviamos em até 24h úteis após a confirmação. Para SP capital, chega no dia seguinte via Sedex.
            </p>
          </div>
          <div className="bg-white p-8 border border-gray-100">
            <h3 className="text-xs font-bold uppercase tracking-widest mb-3">Como funciona a troca?</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              A primeira troca é por nossa conta. Você tem 7 dias após o recebimento para solicitar.
            </p>
          </div>
          <div className="bg-white p-8 border border-gray-100">
            <h3 className="text-xs font-bold uppercase tracking-widest mb-3">Vendem no Atacado?</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Sim! Temos condições especiais para lojistas a partir de 12 peças. Chame no WhatsApp.
            </p>
          </div>
        </div>
      </div>

    </main>
  );
}