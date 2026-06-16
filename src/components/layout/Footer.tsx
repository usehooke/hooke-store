"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Send, ChevronDown } from "lucide-react";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import { brandConfig } from "@/config/brandConfig";

export default function Footer() {
  const currentYear = 2026; // Valor determinístico para o build PPR
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setStatus('idle');
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, phone }),
      });
      if (res.ok) {
        setStatus('success');
        setEmail("");
        setPhone("");
      } else {
        setStatus('error');
      }
    } catch (err) {
      console.error(err);
      setStatus('error');
    } finally {
      setLoading(false);
      setTimeout(() => setStatus('idle'), 4000);
    }
  };

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

  {/* Colunas 2 & 3: Links rápidos */}
  <div className="grid grid-cols-2 md:col-span-2 gap-8">
    <details className="group md:block" open>
      <summary className="font-heading text-xs font-bold tracking-[0.2em] mb-4 text-gray-500 uppercase list-none cursor-pointer flex justify-between items-center md:cursor-default md:pointer-events-none">
        Coleções
        <ChevronDown size={14} className="transition-transform group-open:rotate-180 md:hidden" />
      </summary>
      <ul className="space-y-3 text-xs text-gray-400 font-medium">
        <li><Link href="/masculino" className="hover:text-white transition-colors">Masculino</Link></li>
        <li><Link href="/feminino" className="hover:text-white transition-colors">Feminino</Link></li>
        <li><Link href="/lancamento" className="hover:text-white transition-colors">Novidades</Link></li>
        <li><Link href="/bazar-vip-hooke" className="hover:text-white transition-colors">Bazar VIP</Link></li>
      </ul>
    </details>

    <details className="group md:block" open>
      <summary className="font-heading text-xs font-bold tracking-[0.2em] mb-4 text-gray-500 uppercase list-none cursor-pointer flex justify-between items-center md:cursor-default md:pointer-events-none">
        Suporte
        <ChevronDown size={14} className="transition-transform group-open:rotate-180 md:hidden" />
      </summary>
      <ul className="space-y-3 text-xs text-gray-400 font-medium">
        <li><Link href="/contato" className="hover:text-gray-300 transition-colors">Fale Conosco</Link></li>
        <li><Link href="/guia-medidas" className="hover:text-gray-300 transition-colors">Guia de Medidas</Link></li>
        <li><Link href="/politica-de-trocas" className="hover:text-gray-300 transition-colors">Trocas</Link></li>
      </ul>
    </details>
  </div>

  {/* Coluna 4: Newsletter */}
  <div>
    <h3 className="font-heading text-xs font-bold tracking-[0.2em] mb-6 text-gray-500">Fique por dentro</h3>
    <p className="text-xs text-gray-400 mb-4">
      Cadastre-se para receber acesso antecipado aos lançamentos.
    </p>
    <form className="flex flex-col gap-3" onSubmit={handleNewsletterSubmit}>
      <div className="relative border-b border-gray-700">
        <input
          type="email"
          placeholder="SEU E-MAIL"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-transparent font-heading py-3 pr-8 text-xs font-bold tracking-wide placeholder:text-gray-600 focus:outline-none focus:border-white transition-colors text-white rounded-none"
        />
        <button
          type="submit"
          disabled={loading}
          aria-label="Cadastrar na newsletter"
          className="absolute right-0 top-3 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
        >
          {status === 'success' ? (
            <span className="text-emerald-500 font-bold text-xs">✓</span>
          ) : loading ? (
            <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent animate-spin rounded-full" />
          ) : (
            <Send size={14} />
          )}
        </button>
      </div>

      <div className="relative border-b border-gray-700">
        <input
          type="tel"
          placeholder="WHATSAPP (OPCIONAL)"
          value={phone}
          onChange={(e) => {
            let value = e.target.value.replace(/\D/g, "");
            if (value.length > 2) value = value.replace(/^(\d{2})(\d)/, "($1) $2");
            if (value.length > 9) value = value.replace(/(\d{5})(\d)/, "$1-$2");
            setPhone(value.substring(0, 15));
          }}
          className="w-full bg-transparent font-heading py-3 text-xs font-bold tracking-wide placeholder:text-gray-600 focus:outline-none focus:border-white transition-colors text-white rounded-none"
        />
      </div>

      {status === 'success' && (
        <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest mt-1 animate-in fade-in">✓ Cadastro realizado com sucesso!</p>
      )}
      {status === 'error' && (
        <p className="text-[10px] text-red-400 font-bold uppercase tracking-widest mt-1 animate-in fade-in">⚠️ Erro ao cadastrar. Tente novamente.</p>
      )}
    </form>
  </div>

  </div>
  </div>

  {/* 2. BARRA INFERIOR (Copyright) */}
  <div className="w-full px-6 md:px-12 py-6 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
    <p className="text-[10px] text-gray-600 tracking-widest text-center md:text-left">
      © {currentYear} Hooke Store. Todos os direitos reservados.
    </p>

    {/* Selos de Confiança e Pagamentos */}
    <div className="flex flex-col sm:flex-row items-center gap-6 mt-4 md:mt-0 opacity-40 hover:opacity-100 transition-opacity duration-300">
      <div className="flex items-center gap-4">
        {/* Selo Compra Segura */}
        <div className="flex items-center gap-1.5 text-[8px] font-black uppercase tracking-wider text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
          <span>Compra Segura</span>
        </div>
        {/* Selo SSL */}
        <div className="flex items-center gap-1.5 text-[8px] font-black uppercase tracking-wider text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
          <span>SSL Protegido</span>
        </div>
      </div>
      
      {/* Bandeiras de Pagamento */}
      <div className="flex items-center gap-2">
        {/* Pix */}
        <div className="border border-white/10 px-2.5 py-1 bg-white/5 flex items-center justify-center h-6" title="PIX">
          <span className="text-[8px] font-black text-gray-300 tracking-wider">PIX</span>
        </div>
        {/* Mastercard */}
        <div className="border border-white/10 px-2.5 py-1 bg-white/5 flex items-center justify-center h-6" title="Mastercard">
          <span className="text-[8px] font-black text-gray-300 tracking-wider">MASTERCARD</span>
        </div>
        {/* Visa */}
        <div className="border border-white/10 px-2.5 py-1 bg-white/5 flex items-center justify-center h-6" title="Visa">
          <span className="text-[8px] font-black text-gray-300 tracking-wider">VISA</span>
        </div>
      </div>
    </div>
  </div>
 </footer>
 );
}
