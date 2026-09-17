import React from 'react';

const testimonials = [
  {
    id: 1,
    name: 'Rodrigo M.',
    city: 'São Paulo, SP',
    rating: 5,
    text: 'Finalmente uma camiseta que tem peso de verdade. O algodão 260g não encolhe, não deforma. Comprei 4 peças em 3 meses.',
    product: 'T-Shirt Vintage Fusca Preta',
    initials: 'RM',
  },
  {
    id: 2,
    name: 'Felipe A.',
    city: 'Curitiba, PR',
    rating: 5,
    text: 'A gola canelada de 3cm é diferente de tudo que já usei. Mantém o formato mesmo depois de 30 lavagens. Minimalismo que dura.',
    product: 'Oversized Heavyweight Preta',
    initials: 'FA',
  },
  {
    id: 3,
    name: 'Lucas T.',
    city: 'Rio de Janeiro, RJ',
    rating: 5,
    text: 'O Conjunto da minha namorada chegou e ficou perfeito. Viscose com caimento impecável. Ela não larga mais.',
    product: 'Conjunto em Viscose de alta gramatura',
    initials: 'LT',
  },
  {
    id: 4,
    name: 'Caio B.',
    city: 'Belo Horizonte, MG',
    rating: 5,
    text: 'Comprei o Opala SS e virei garoto propaganda involuntário. Todo mundo pergunta onde comprei. Entrega rápida, embalagem cuidadosa.',
    product: 'T-Shirt Vintage Opala SS',
    initials: 'CB',
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={`text-xs ${i < rating ? 'text-amber-500' : 'text-zinc-200'}`}
        >
          ★
        </span>
      ))}
    </div>
  );
}

export default function TestimonialsSection() {
  return (
    <section className="py-16 px-4 md:px-8 lg:px-12 bg-white border-t border-zinc-100">
      <div className="max-w-[1400px] mx-auto">
        {/* Cabeçalho */}
        <div className="text-center mb-12">
          <span className="text-[10px] md:text-xs font-black tracking-[0.4em] uppercase text-zinc-400 block mb-3">
            Prova Social
          </span>
          <h2 className="text-3xl font-black text-hooke-900 tracking-tighter uppercase">
            O que dizem os clientes
          </h2>
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className="text-amber-500 text-sm">★</span>
              ))}
            </div>
            <span className="text-xs font-bold text-zinc-500 tracking-wider">
              4.9 · 127 avaliações
            </span>
          </div>
        </div>

        {/* Grid de depoimentos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-[#FAF9F7] border border-zinc-100 p-6 flex flex-col gap-4 hover:border-zinc-300 transition-colors"
            >
              {/* Rating */}
              <StarRating rating={t.rating} />

              {/* Texto */}
              <p className="text-sm text-zinc-700 leading-relaxed flex-grow">
                &ldquo;{t.text}&rdquo;
              </p>

              {/* Produto */}
              <p className="text-[10px] font-bold tracking-[0.2em] text-zinc-400 uppercase">
                {t.product}
              </p>

              {/* Autor */}
              <div className="flex items-center gap-3 border-t border-zinc-100 pt-4">
                <div className="w-8 h-8 bg-hooke-900 text-white flex items-center justify-center text-[10px] font-black tracking-wider flex-shrink-0">
                  {t.initials}
                </div>
                <div>
                  <p className="text-xs font-black text-hooke-900">{t.name}</p>
                  <p className="text-[10px] text-zinc-400">{t.city}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA sutil */}
        <p className="text-center text-[10px] tracking-[0.3em] text-zinc-400 uppercase mt-10">
          Compra segura · Entrega Correios · Troca garantida em 7 dias
        </p>
      </div>
    </section>
  );
}
