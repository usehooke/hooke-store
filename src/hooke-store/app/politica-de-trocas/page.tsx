export const metadata = {
    title: "Política de Trocas e Devoluções | Hooke",
    description: "Saiba como funciona a política de trocas e devoluções da Hooke. A primeira troca é grátis e sem complicações.",
};

export default function PoliticaDeTrocas() {
    return (
        <main className="w-full bg-white min-h-screen py-24 px-6 md:px-12">
            <div className="max-w-3xl mx-auto space-y-12">
                <div className="border-b border-gray-100 pb-8 text-center md:text-left">
                    <span className="text-hooke-500 text-xs font-bold uppercase tracking-widest mb-2 block">Institucional</span>
                    <h1 className="text-4xl md:text-5xl font-black text-hooke-900 uppercase tracking-tighter">Trocas e Devoluções</h1>
                </div>

                <div className="prose prose-sm md:prose-base max-w-none text-gray-600 font-sans space-y-6">
                    <p>
                        Na Hooke, nós te garantimos excelência e qualidade em peças incríveis para o seu dia a dia. Se por acaso você precisar efetuar uma troca ou devolução, nosso processo é simples e transparente.
                    </p>

                    <h3 className="text-xl font-bold uppercase tracking-tighter text-hooke-900 mt-8 mb-4">A Primeira Troca é Grátis</h3>
                    <p>
                        O custo de frete da sua <strong>primeira troca</strong> de pedido é por nossa conta. Os custos de envio para devolução do produto e reenvio da nova peça até você serão cobertos pela Hooke, através de logística reversa.
                    </p>

                    <h3 className="text-xl font-bold uppercase tracking-tighter text-hooke-900 mt-8 mb-4">Prazos</h3>
                    <ul className="list-disc pl-5 space-y-2">
                        <li><strong>Desistência / Arrependimento:</strong> Você tem até 7 (sete) dias corridos, contados a partir do dia de recebimento do pedido, para solicitar a devolução.</li>
                        <li><strong>Troca por tamanho ou modelo:</strong> Você tem até 30 (trinta) dias corridos a partir da data de entrega do pedido.</li>
                        <li><strong>Defeito de fabricação:</strong> Você possui até 90 (noventa) dias corridos para informar vícios ou defeitos ocultos no produto.</li>
                    </ul>

                    <h3 className="text-xl font-bold uppercase tracking-tighter text-hooke-900 mt-8 mb-4">Condições das Peças</h3>
                    <p>
                        Para que a troca ou devolução seja aceita, a peça deve cumprir as seguintes condições:
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>A etiqueta original deve estar afixada na peça intacta.</li>
                        <li>O produto não pode ter indícios de uso, lavagem, ou odores (suor, perfume, fumaça etc).</li>
                        <li>Não serão aceitas peças com alterações feitas pelo cliente (bainha, ajustes etc).</li>
                    </ul>

                    <h3 className="text-xl font-bold uppercase tracking-tighter text-hooke-900 mt-8 mb-4">Como Solicitar</h3>
                    <p>
                        Para iniciar o seu processo, entre em contato com nossa equipe de atendimento através do nosso WhatsApp oficial ou pelo e-mail suporte@hooke.com.br, informando seu número de pedido e o motivo da troca/devolução. Nossa equipe enviará o código de autorização de postagem.
                    </p>
                </div>
            </div>
        </main>
    );
}
