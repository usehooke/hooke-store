import Link from "next/link";
import { Facebook, Instagram, Twitter, Send } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-hooke-900 text-white border-t border-gray-800">

      {/* 1. ÁREA PRINCIPAL */}
      <div className="w-full px-6 md:px-12 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">

          {/* Coluna 1: Marca */}
          <div className="space-y-6">
            <h2 className="text-2xl font-black uppercase tracking-tighter">Hooke</h2>
            <p className="text-xs text-gray-400 leading-relaxed max-w-xs">
              Redefinindo o básico masculino. Camisetas de algodão com certificado BCA, modelagem precisa e durabilidade extrema.
            </p>
            <div className="flex gap-4">
              <a href="https://instagram.com/hookestore" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" aria-label="Instagram">
                <Instagram size={18} strokeWidth={1.5} />
              </a>
              <a href="https://facebook.com/hookestore" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" aria-label="Facebook">
                <Facebook size={18} strokeWidth={1.5} />
              </a>
              <a href="https://twitter.com/hookestore" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" aria-label="Twitter">
                <Twitter size={18} strokeWidth={1.5} />
              </a>
            </div>
          </div>

          {/* Coluna 2: Shop */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest mb-6 text-gray-500">Shop</h3>
            <ul className="space-y-4 text-xs font-medium tracking-wide">
              <li><Link href="/colecao" className="hover:text-gray-300 transition-colors">Ver Tudo</Link></li>
              <li><Link href="/lancamento" className="hover:text-gray-300 transition-colors">Lançamentos</Link></li>
              <li><Link href="/colecao" className="hover:text-gray-300 transition-colors">Kits Promocionais</Link></li>
              <li><Link href="/colecao" className="hover:text-gray-300 transition-colors">Best Sellers</Link></li>
            </ul>
          </div>

          {/* Coluna 3: Suporte */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest mb-6 text-gray-500">Suporte</h3>
            <ul className="space-y-4 text-xs font-medium tracking-wide">
              <li><Link href="/conta" className="hover:text-gray-300 transition-colors">Minha Conta</Link></li>
              <li><Link href="/contato" className="hover:text-gray-300 transition-colors">Fale Conosco</Link></li>
              <li><Link href="/politica-de-trocas" className="hover:text-gray-300 transition-colors">Trocas e Devoluções</Link></li>
              <li><Link href="/guia-medidas" className="hover:text-gray-300 transition-colors">Guia de Medidas</Link></li>
            </ul>
          </div>

          {/* Coluna 4: Newsletter (Correção de Acessibilidade Aplicada) */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest mb-6 text-gray-500">Fique por dentro</h3>
            <p className="text-xs text-gray-400 mb-4">
              Cadastre-se para receber acesso antecipado aos lançamentos.
            </p>
            <form className="flex flex-col gap-2">
              <div className="relative">
                <input
                  type="email"
                  placeholder="SEU E-MAIL"
                  className="w-full bg-transparent border-b border-gray-700 py-3 text-xs font-bold uppercase tracking-wide placeholder:text-gray-600 focus:outline-none focus:border-white transition-colors text-white"
                />
                <button
                  type="submit"
                  aria-label="Cadastrar na newsletter"
                  className="absolute right-0 top-3 text-gray-400 hover:text-white transition-colors"
                >
                  <Send size={14} />
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>

      {/* 2. BARRA INFERIOR (Copyright) */}
      <div className="w-full px-6 md:px-12 py-6 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-[10px] text-gray-600 uppercase tracking-widest text-center md:text-left">
          © {currentYear} Hooke Store. Todos os direitos reservados.
        </p>

        {/* Ícones de Pagamento */}
        <div className="flex items-center gap-4 opacity-50 grayscale">
          <span className="text-[10px] font-bold text-gray-500">PIX</span>
          <span className="text-[10px] font-bold text-gray-500">MASTERCARD</span>
          <span className="text-[10px] font-bold text-gray-500">VISA</span>
        </div>
      </div>

    </footer>
  );
}