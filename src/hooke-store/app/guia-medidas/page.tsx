import { Ruler } from "lucide-react";

export const metadata = {
    title: "Guia de Medidas | Hooke",
    description: "Aprenda a escolher o tamanho perfeito das suas camisetas Hooke. Modelagem Oversized e Regular.",
};

export default function GuiaMedidas() {
    return (
        <main className="w-full bg-white min-h-screen py-24 px-6 md:px-12">
            <div className="max-w-4xl mx-auto space-y-12">
                <div className="border-b border-gray-100 pb-8 text-center">
                    <div className="w-12 h-12 mx-auto bg-hooke-50 text-hooke-900 flex items-center justify-center mb-6 rounded-none">
                        <Ruler size={24} strokeWidth={1.5} />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-hooke-900 uppercase tracking-tighter">Guia de Medidas</h1>
                    <p className="mt-4 text-gray-500 max-w-lg mx-auto">
                        Evite trocas. Descubra o tamanho ideal comparando nossas medidas com uma camiseta que veste bem em você.
                    </p>
                </div>

                <div className="space-y-16">

                    {/* OVERSZIED */}
                    <div>
                        <h2 className="text-2xl font-bold uppercase tracking-tighter text-hooke-900 mb-6 border-l-4 border-hooke-900 pl-4">Camisetas Oversized</h2>
                        <p className="text-gray-600 mb-6">Modelagem ampla estilo streetwear, com ombros deslocados e mangas mais longas. Se prefere um caimento mais justo, opte por um tamanho menor.</p>

                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[600px] text-left border-collapse bg-gray-50">
                                <thead>
                                    <tr className="bg-hooke-900 text-white text-xs uppercase tracking-widest font-bold">
                                        <th className="p-4 border border-hooke-800">Tamanho</th>
                                        <th className="p-4 border border-hooke-800">Comprimento (A)</th>
                                        <th className="p-4 border border-hooke-800">Tórax/Largura (B)</th>
                                        <th className="p-4 border border-hooke-800">Manga (C)</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm font-medium text-gray-600">
                                    <tr className="hover:bg-gray-100 transition-colors border-b border-gray-200">
                                        <td className="p-4 font-black text-hooke-900">P</td>
                                        <td className="p-4">72 cm</td>
                                        <td className="p-4">54 cm</td>
                                        <td className="p-4">22 cm</td>
                                    </tr>
                                    <tr className="hover:bg-gray-100 transition-colors border-b border-gray-200">
                                        <td className="p-4 font-black text-hooke-900">M</td>
                                        <td className="p-4">74 cm</td>
                                        <td className="p-4">56 cm</td>
                                        <td className="p-4">23 cm</td>
                                    </tr>
                                    <tr className="hover:bg-gray-100 transition-colors border-b border-gray-200">
                                        <td className="p-4 font-black text-hooke-900">G</td>
                                        <td className="p-4">76 cm</td>
                                        <td className="p-4">58 cm</td>
                                        <td className="p-4">24 cm</td>
                                    </tr>
                                    <tr className="hover:bg-gray-100 transition-colors border-b border-gray-200">
                                        <td className="p-4 font-black text-hooke-900">GG</td>
                                        <td className="p-4">79 cm</td>
                                        <td className="p-4">61 cm</td>
                                        <td className="p-4">25 cm</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* REGATAS E VINTAGE */}
                    <div>
                        <h2 className="text-2xl font-bold uppercase tracking-tighter text-hooke-900 mb-6 border-l-4 border-hooke-900 pl-4">Regatas e Camisetas Regular</h2>
                        <p className="text-gray-600 mb-6">Modelagem estruturada que valoriza o corpo. Caimento mais próximo à pele na região do tórax e braços. Tamanho padrão brasileiro.</p>

                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[600px] text-left border-collapse bg-gray-50">
                                <thead>
                                    <tr className="bg-hooke-900 text-white text-xs uppercase tracking-widest font-bold">
                                        <th className="p-4 border border-hooke-800">Tamanho</th>
                                        <th className="p-4 border border-hooke-800">Comprimento (A)</th>
                                        <th className="p-4 border border-hooke-800">Tórax/Largura (B)</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm font-medium text-gray-600">
                                    <tr className="hover:bg-gray-100 transition-colors border-b border-gray-200">
                                        <td className="p-4 font-black text-hooke-900">P</td>
                                        <td className="p-4">70 cm</td>
                                        <td className="p-4">50 cm</td>
                                    </tr>
                                    <tr className="hover:bg-gray-100 transition-colors border-b border-gray-200">
                                        <td className="p-4 font-black text-hooke-900">M</td>
                                        <td className="p-4">72 cm</td>
                                        <td className="p-4">52 cm</td>
                                    </tr>
                                    <tr className="hover:bg-gray-100 transition-colors border-b border-gray-200">
                                        <td className="p-4 font-black text-hooke-900">G</td>
                                        <td className="p-4">74 cm</td>
                                        <td className="p-4">54 cm</td>
                                    </tr>
                                    <tr className="hover:bg-gray-100 transition-colors border-b border-gray-200">
                                        <td className="p-4 font-black text-hooke-900">GG</td>
                                        <td className="p-4">76 cm</td>
                                        <td className="p-4">56 cm</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-8 bg-gray-100 p-6 text-sm text-gray-500 border border-gray-200 text-center">
                            * Variações de até 2cm podem ocorrer no processo de fabricação (margem de tolerância).
                        </div>
                    </div>

                </div>
            </div>
        </main>
    );
}
