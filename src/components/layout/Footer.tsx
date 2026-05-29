import Link from "next/link";
import { Send } from "lucide-react";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import { brandConfig } from "@/config/brandConfig";

export default function Footer() {
  const currentYear = 2026; // Valor determinístico para o build PPR

 return (
 <footer className="w-full bg-hooke-900 text-white border-t border-gray-800">

 {/* 1. ÁREA PRINCIPAL */}
 <div className="w-full px-6 md:px-12 py-16 md:py-24">
 <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">

 {/* Coluna 1: Marca */}
 <div className="space-y-6">
 <Link href="/" className="inline-block hover:opacity-80 transition-opacity">
 <h2 className="font-heading text-[2rem] font-bold lowercase tracking-tight leading-none">{brandConfig.name.toLowerCase()}</h2>
 </Link>
 <p className="text-xs text-gray-400 leading-relaxed max-w-xs">
 {brandConfig.description}
 </p>
 <div className="flex gap-4">
 <a href={brandConfig.social.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" aria-label="Instagram">
 <FaInstagram size={18} />
 </a>
 <a href={brandConfig.social.facebook} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" aria-label="Facebook">
 <FaFacebook size={18} />
 </a>
 <a href={brandConfig.social.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" aria-label="Twitter">
 <FaTwitter size={18} />
 </a>
 </div>
 </div>

 {/* Coluna 2: Shop */}
 <div>
 <h3 className="font-heading text-xs font-bold tracking-[0.2em] mb-6 text-gray-500">Shop</h3>
 <ul className="space-y-4 text-xs font-medium tracking-wide">
 <li><Link href="/colecao" className="hover:text-gray-300 transition-colors">Ver Tudo</Link></li>
 <li><Link href="/lancamento" className="hover:text-gray-300 transition-colors">Lançamentos</Link></li>
 <li><Link href="/colecao" className="hover:text-gray-300 transition-colors">Kits Promocionais</Link></li>
 <li><Link href="/colecao" className="hover:text-gray-300 transition-colors">Best Sellers</Link></li>
 </ul>
 </div>

 {/* Coluna 3: Suporte */}
 <div>
 <h3 className="font-heading text-xs font-bold tracking-[0.2em] mb-6 text-gray-500">Suporte</h3>
 <ul className="space-y-4 text-xs font-medium tracking-wide">
 <li><Link href="/meus-pedidos" className="hover:text-gray-300 transition-colors">Minha Conta</Link></li>
 <li><Link href="/contato" className="hover:text-gray-300 transition-colors">Fale Conosco</Link></li>
 <li><Link href="/cartao-virtual" className="hover:text-gray-300 transition-colors font-bold">Cartão VIP Hooke</Link></li>
 <li><Link href="/politica-de-trocas" className="hover:text-gray-300 transition-colors">Trocas e Devoluções</Link></li>
 <li><Link href="/guia-medidas" className="hover:text-gray-300 transition-colors">Guia de Medidas</Link></li>
 <li className="pt-2">
 <Link href="/hq" className="group flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-[10px] uppercase font-bold tracking-widest">
 <span className="w-1.5 h-1.5 bg-emerald-500 rounded-none animate-pulse blur-[1px] group-hover:blur-none transition-all" />
 Conheça o QG Virtual da Hooke, onde tudo acontece!
 </Link>
 </li>
 </ul>
 </div>

 {/* Coluna 4: Newsletter */}
 <div>
 <h3 className="font-heading text-xs font-bold tracking-[0.2em] mb-6 text-gray-500">Fique por dentro</h3>
 <p className="text-xs text-gray-400 mb-4">
 Cadastre-se para receber acesso antecipado aos lançamentos.
 </p>
 <form className="flex flex-col gap-2" onSubmit={(e) => {
  e.preventDefault();
  const form = e.currentTarget;
  const input = form.querySelector('input[type="email"]') as HTMLInputElement;
  const email = input?.value?.trim();
  if (!email) return;
  // Salva localmente (futuro: enviar para API/Mailchimp)
  const existing = JSON.parse(localStorage.getItem('hooke-newsletter') || '[]');
  if (!existing.includes(email)) {
    existing.push(email);
    localStorage.setItem('hooke-newsletter', JSON.stringify(existing));
  }
  input.value = '';
  // Feedback visual
  const btn = form.querySelector('button') as HTMLButtonElement;
  if (btn) {
    btn.innerHTML = '✓';
    setTimeout(() => { btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>'; }, 2000);
  }
 }}>
 <div className="relative">
 <input
 type="email"
 placeholder="SEU E-MAIL"
 required
 className="w-full bg-transparent font-heading border-b border-gray-700 py-3 text-xs font-bold tracking-wide placeholder:text-gray-600 focus:outline-none focus:border-white transition-colors text-white"
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
 <p className="text-[10px] text-gray-600 tracking-widest text-center md:text-left">
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
