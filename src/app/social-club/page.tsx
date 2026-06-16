"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronLeft, Gift, Share2, Copy, Check, MessageSquare, Coffee, ShieldAlert } from "lucide-react";
import { toast } from "sonner";

export default function SocialClubPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [generatedLink, setGeneratedLink] = useState("");
  const [copied, setCopied] = useState(false);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 2) value = value.replace(/^(\d{2})(\d)/, "($1) $2");
    if (value.length > 9) value = value.replace(/(\d{5})(\d)/, "$1-$2");
    setPhone(value.substring(0, 15));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || phone.length < 14) {
      toast.error("Por favor, preencha todos os dados corretamente.");
      return;
    }

    const cleanEmail = email.trim().toLowerCase();
    const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.usehooke.com.br";
    const refLink = `${siteUrl}?ref=${encodeURIComponent(cleanEmail)}`;
    
    setGeneratedLink(refLink);
    toast.success("Link de indicação gerado com sucesso!");
  };

  const handleCopyLink = () => {
    if (!generatedLink) return;
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    toast.success("Link copiado para a área de transferência!");
    setTimeout(() => setCopied(false), 2000);
  };

  const shareText = `Cara, acabei de pegar umas camisetas pesadas de algodão de 260g caneladas na Hooke. Segue meu link com 15% de desconto para você usar no seu primeiro drop: ${generatedLink}`;
  const whatsappShareUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;

  return (
    <div className="min-h-screen bg-[#F9F9F8] text-black font-sans pt-32 pb-24 px-4 md:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Back button */}
        <Link 
          href="/" 
          className="inline-flex items-center text-xs font-bold tracking-widest text-zinc-500 hover:text-black transition-colors uppercase"
        >
          <ChevronLeft size={16} /> Voltar à Loja
        </Link>

        {/* Hero Section */}
        <div className="mt-8 border-2 border-black bg-white p-8 md:p-12 shadow-[8px_8px_0px_0px_#000] space-y-6 relative overflow-hidden">
          <div className="absolute top-4 right-4 opacity-10">
            <Gift size={120} className="text-black" />
          </div>

          <div className="space-y-2 relative z-10">
            <span className="text-[10px] font-mono font-black uppercase tracking-[0.3em] text-zinc-400">
              Hooke Atelier
            </span>
            <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-black leading-none">
              Social Club
            </h1>
            <p className="text-xs md:text-sm font-bold tracking-widest text-zinc-500 uppercase">
              Indique e Receba Benefícios Exclusivos
            </p>
          </div>

          <p className="text-xs md:text-sm text-zinc-700 leading-relaxed max-w-lg">
            A Hooke é um espaço para quem valoriza a permanência. Nosso Social Club é a forma de expandir essa comunidade de forma orgânica. 
            Indique o Club para os seus amigos e espalhe a cultura das camisetas pesadas de alta costura.
          </p>

          {/* Regras Brutalistas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-black/10">
            <div className="border border-black/10 p-4 bg-zinc-50">
              <span className="text-[18px] font-black block text-black mb-1">15% OFF</span>
              <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400 block mb-1">Para seu indicado</span>
              <p className="text-[11px] text-zinc-600 leading-snug">Seu amigo ganha 15% de desconto automático na primeira compra usando seu link.</p>
            </div>
            <div className="border border-black/10 p-4 bg-zinc-50">
              <span className="text-[18px] font-black block text-green-600">R$ 35,00</span>
              <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400 block mb-1">Para você</span>
              <p className="text-[11px] text-zinc-600 leading-snug">Quando o seu amigo finalizar a primeira compra dele, você ganha R$ 35,00 de crédito em conta para usar no próximo drop.</p>
            </div>
          </div>
        </div>

        {/* Gerador de Link */}
        <div className="mt-8 border-2 border-black bg-white p-8 shadow-[8px_8px_0px_0px_#000] space-y-6">
          <h2 className="text-lg font-black uppercase tracking-tight text-black border-b border-black/10 pb-3">
            {generatedLink ? "Seu Link do Club" : "Gere Seu Link de Membro"}
          </h2>

          {!generatedLink ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">Nome Completo *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome"
                  className="w-full bg-white border border-black/10 px-4 py-3 text-xs focus:outline-none focus:border-black rounded-none font-medium"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">E-mail de Cadastro *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Seu e-mail cadastrado"
                    className="w-full bg-white border border-black/10 px-4 py-3 text-xs focus:outline-none focus:border-black rounded-none font-medium"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={handlePhoneChange}
                    placeholder="(11) 99999-9999"
                    className="w-full bg-white border border-black/10 px-4 py-3 text-xs focus:outline-none focus:border-black rounded-none font-medium"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-black text-white font-black text-[10px] uppercase tracking-[0.25em] hover:bg-zinc-900 transition-colors"
              >
                Gerar Meu Link de Indicação →
              </button>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="flex flex-col gap-2">
                <p className="text-xs text-zinc-500 leading-relaxed">
                  Copie e compartilhe o link exclusivo abaixo para convidar seus amigos a fazerem parte da Hooke.
                </p>
                
                {/* Box de link */}
                <div className="flex border-2 border-black bg-zinc-50 p-2.5 items-center justify-between gap-4">
                  <span className="text-[11px] font-mono truncate text-zinc-600 pl-2 select-all">
                    {generatedLink}
                  </span>
                  <button
                    onClick={handleCopyLink}
                    className="p-2.5 bg-black text-white hover:bg-zinc-800 transition-colors shrink-0 flex items-center justify-center"
                    title="Copiar Link"
                  >
                    {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                  </button>
                </div>
              </div>

              {/* Botões Rápidos */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <a
                  href={whatsappShareUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-4 bg-[#25D366] text-white text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#20bd5a] transition-colors text-center border-2 border-black shadow-[4px_4px_0px_0px_#000]"
                >
                  <MessageSquare size={14} fill="white" /> Enviar no WhatsApp
                </a>
                <button
                  onClick={() => {
                    setGeneratedLink("");
                  }}
                  className="py-4 bg-white text-black text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-zinc-50 transition-colors border-2 border-black"
                >
                  Gerar Outro Link
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Detalhes e FAQ */}
        <div className="mt-8 border border-black/10 bg-white p-6 space-y-4">
          <div className="flex items-center gap-2 text-zinc-400 mb-2">
            <Coffee size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest">Informações Importantes</span>
          </div>

          <ul className="space-y-3 text-[11px] text-zinc-600 leading-relaxed list-disc list-inside">
            <li>O desconto de 15% é válido apenas para o **primeiro pedido** do usuário indicado.</li>
            <li>O crédito de R$ 35,00 é gerado assim que o pagamento do indicado for **aprovado**.</li>
            <li>Você receberá a notificação de confirmação e o cupom de crédito direto no seu e-mail/WhatsApp de cadastro.</li>
            <li>A Hooke reserva-se o direito de auditar e suspender créditos de contas em caso de autopromoção ou fraude.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
