// src/components/layout/Footer.tsx
import Link from "next/link";
import { Instagram, MapPin, MessageCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-hooke-900 text-white pt-16 pb-8 border-t border-hooke-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* COLUNA 1: MARCA */}
          <div>
            <h2 className="text-2xl font-bold tracking-tighter mb-4">HOOKE</h2>
            <p className="text-hooke-400 text-sm leading-relaxed">
              Moda masculina minimalista para quem valoriza o corte, o tecido e a atitude. 
              Vista a sua essência.
            </p>
            <div className="mt-6 flex gap-4">
              <a 
                href="https://instagram.com/use.hooke" 
                target="_blank" 
                className="w-10 h-10 rounded-full bg-hooke-800 flex items-center justify-center hover:bg-white hover:text-black transition-colors"
              >
                <Instagram size={20} />
              </a>
              <a 
                href="https://wa.me/5511999999999" // Troque pelo seu número
                target="_blank" 
                className="w-10 h-10 rounded-full bg-hooke-800 flex items-center justify-center hover:bg-[#25D366] hover:text-white transition-colors"
              >
                <MessageCircle size={20} />
              </a>
            </div>
          </div>

          {/* COLUNA 2: NAVEGAÇÃO */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest mb-6 text-hooke-400">Loja</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/" className="hover:text-hooke-300 transition-colors">Home</Link>
              </li>
              <li>
                <Link href="/camisetas" className="hover:text-hooke-300 transition-colors">Camisetas</Link>
              </li>
              <li>
                <Link href="/sobre" className="hover:text-hooke-300 transition-colors">Sobre a Marca</Link>
              </li>
              <li>
                <Link href="/contato" className="hover:text-hooke-300 transition-colors">Fale Conosco</Link>
              </li>
            </ul>
          </div>

          {/* COLUNA 3: LOJAS FÍSICAS */}
          <div className="lg:col-span-2">
            <h3 className="text-sm font-bold uppercase tracking-widest mb-6 text-hooke-400">Nossas Lojas (Brás)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              <div className="flex items-start">
                <MapPin className="mt-1 mr-3 text-hooke-500 shrink-0" size={18} />
                <div>
                  <strong className="block text-white mb-1">Shopping Vautier Premium</strong>
                  <p className="text-hooke-400 text-sm">Rua Thiers, 184<br />Loja 142</p>
                </div>
              </div>

              <div className="flex items-start">
                <MapPin className="mt-1 mr-3 text-hooke-500 shrink-0" size={18} />
                <div>
                  <strong className="block text-white mb-1">Shopping Porto Brás</strong>
                  <p className="text-hooke-400 text-sm">Rua Thiers, 282<br />Loja 1598</p>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* BARRA INFERIOR: DIREITOS AUTORAIS */}
        <div className="border-t border-hooke-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-hooke-500 text-center md:text-left">
            © {new Date().getFullYear()} Hooke Moda Masculina. Todos os direitos reservados. CNPJ: XX.XXX.XXX/0001-XX
          </p>
          <div className="flex gap-4 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            {/* Imagens ilustrativas de pagamento (apenas visual) */}
            <div className="h-6 w-10 bg-white/10 rounded"></div> {/* Visa */}
            <div className="h-6 w-10 bg-white/10 rounded"></div> {/* Master */}
            <div className="h-6 w-10 bg-white/10 rounded"></div> {/* Pix */}
          </div>
        </div>
      </div>
    </footer>
  );
}