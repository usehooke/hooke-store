import React from 'react';
import Link from 'next/link';

export default function PoliticaDevolucao() {
  return (
    <main className="min-h-screen bg-gray-50 pt-32 pb-20 px-6">
      <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-sm">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Política de Devolução e Trocas</h1>
        
        <div className="prose prose-gray max-w-none text-gray-600 space-y-6">
          <p>
            Na <strong>Hooke</strong>, nossa prioridade é que você se sinta bem com o que veste. 
            Se por algum motivo o produto não atendeu às suas expectativas, oferecemos um processo simples e transparente, 
            respeitando o Código de Defesa do Consumidor.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 pt-4">1. Prazo para Devolução (Direito de Arrependimento)</h3>
          <p>
            Conforme o Art. 49 do CDC, você tem até <strong>7 (sete) dias corridos</strong> após o recebimento do pedido 
            para solicitar a devolução por arrependimento ou desistência. O produto deve estar sem uso, com a etiqueta intacta 
            e na embalagem original.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 pt-4">2. Como Solicitar</h3>
          <p>
            Para iniciar o processo, entre em contato conosco através do e-mail <strong>contato@usehooke.com.br</strong> 
            informando o número do pedido e o motivo da devolução. Nossa equipe retornará em até 24 horas úteis com as instruções de envio.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 pt-4">3. Trocas por Tamanho ou Defeito</h3>
          <p>
            Se a peça não serviu ou apresentou algum defeito de fabricação, o prazo para solicitação é de até <strong>30 dias corridos</strong>. 
            A primeira troca é por nossa conta (frete reverso gratuito).
          </p>

          <h3 className="text-xl font-semibold text-gray-900 pt-4">4. Reembolso</h3>
          <p>
            Após o recebimento e análise da peça em nosso centro de distribuição (até 3 dias úteis), o reembolso será processado 
            na mesma forma de pagamento original (estorno no cartão ou PIX) em até 5 dias úteis.
          </p>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-100">
          <Link href="/" className="text-sm font-semibold text-black hover:underline">
            ← Voltar para a Loja
          </Link>
        </div>
      </div>
    </main>
  );
}