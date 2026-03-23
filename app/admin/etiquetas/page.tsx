"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Product } from "@/types";
import { Loader2, Printer, CheckSquare, Square, Search, Trash2 } from "lucide-react";
import Barcode from "react-barcode";

export default function EtiquetasPage() {
 const [products, setProducts] = useState<Product[]>([]);
 const [loading, setLoading] = useState(true);
 const [searchTerm, setSearchTerm] = useState("");

 // Armazena os SKUs selecionados para impressão
 // O valor será a quantidade de etiquetas daquele SKU a serem impressas
 const [selectedSkus, setSelectedSkus] = useState<Record<string, number>>({});

 useEffect(() => {
 const fetchProducts = async () => {
 try {
 const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
 const querySnapshot = await getDocs(q);
 const productsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
 setProducts(productsData);
 } catch (error) {
 console.error("Erro ao buscar produtos:", error);
 } finally {
 setLoading(false);
 }
 };

 fetchProducts();
 }, []);

 const filteredProducts = products.filter(p =>
 p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
 p.category.toLowerCase().includes(searchTerm.toLowerCase())
 );

 const handleToggleSku = (sku: string) => {
 setSelectedSkus(prev => {
 const next = { ...prev };
 if (next[sku]) {
 delete next[sku]; // Remove se já existe
 } else {
 next[sku] = 1; // Adiciona com quantidade 1
 }
 return next;
 });
 };

 const updateQuantity = (sku: string, qty: number) => {
 if (qty < 1) return;
 setSelectedSkus(prev => ({
 ...prev,
 [sku]: qty
 }));
 };

 const handlePrint = () => {
 window.print();
 };

 if (loading) {
 return (
 <div className="flex justify-center items-center h-64">
 <Loader2 size={32} className="animate-spin text-hooke-900" />
 </div>
 );
 }

 const hasSelected = Object.keys(selectedSkus).length > 0;

 return (
 <div className="p-8">
 <div className="flex justify-between items-end mb-8 print:hidden">
 <div>
 <h1 className="text-3xl font-black text-hooke-900 tracking-tighter">Gerador de Etiquetas</h1>
 <p className="text-gray-500 text-sm mt-1">Selecione as variações dos produtos para imprimir os códigos de barras (SKUs).</p>
 </div>

 <button
 onClick={handlePrint}
 disabled={!hasSelected}
 className="flex items-center gap-2 bg-hooke-900 text-white px-6 py-3 font-bold tracking-widest text-sm hover:bg-black transition-colors disabled:opacity-50"
 >
 <Printer size={18} />
 Imprimir ({Object.values(selectedSkus).reduce((a, b) => a + b, 0)} etiquetas)
 </button>
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 print:hidden">
 {/* COLUNA ESQUERDA: LISTA DE PRODUTOS */}
 <div className="lg:col-span-8 space-y-4">
 <div className="relative">
 <Search className="absolute left-3 top-3 text-gray-400" size={18} />
 <input
 type="text"
 placeholder="Buscar produto por nome ou categoria..."
 value={searchTerm}
 onChange={(e) => setSearchTerm(e.target.value)}
 className="w-full pl-10 pr-4 py-3 border border-gray-300 focus:outline-none focus:border-hooke-900 text-sm bg-white"
 />
 </div>

 <div className="bg-white border border-gray-200 divide-y divide-gray-200">
 {filteredProducts.map(product => {
 // Extraimos todas as combinações de variação desse produto
 const variations: { key: string, label: string, sku: string, stock: number }[] = [];

 if (product.colors && product.colors.length > 0) {
 product.colors.forEach(color => {
 product.sizes.forEach(size => {
 const key = `${color.name}-${size}`;
 variations.push({
 key,
 label: `${color.name} / ${size}`,
 sku: product.skus?.[key] || "",
 stock: product.stock?.[key] || 0
 });
 });
 });
 } else {
 product.sizes.forEach(size => {
 variations.push({
 key: size,
 label: `Tamanho ${size}`,
 sku: product.skus?.[size] || "",
 stock: product.stock?.[size] || 0
 });
 });
 }

 // Filtramos apenas as variações que têm um SKU definido
 const validVariations = variations.filter(v => v.sku);

 if (validVariations.length === 0) return null;

 return (
 <div key={product.id} className="p-4">
 <h3 className="font-bold text-hooke-900 text-sm mb-3">{product.name}</h3>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
 {validVariations.map(variation => {
 const isSelected = !!selectedSkus[variation.sku];
 return (
 <div
 key={variation.key}
 onClick={() => handleToggleSku(variation.sku)}
 className={`flex items-center justify-between p-3 border cursor-pointer transition-colors
 ${isSelected ? 'border-hooke-900 bg-gray-50' : 'border-gray-200 hover:border-gray-300'}
 `}
 >
 <div className="flex items-center gap-3">
 <div className="text-hooke-900">
 {isSelected ? <CheckSquare size={18} /> : <Square size={18} className="text-gray-300" />}
 </div>
 <div>
 <p className="text-xs font-bold text-gray-800">{variation.label}</p>
 <p className="text-[10px] text-gray-500 font-mono mt-0.5">SKU: {variation.sku}</p>
 </div>
 </div>
 <div className="text-[10px] font-bold text-gray-400">
 Qtd Atual: {variation.stock}
 </div>
 </div>
 );
 })}
 </div>
 </div>
 );
 })}
 </div>
 </div>

 {/* COLUNA DIREITA: RESUMO */}
 <div className="lg:col-span-4">
 <div className="bg-gray-50 border border-hooke-900 p-6 sticky top-8">
 <h3 className="font-black text-hooke-900 tracking-widest text-sm border-b border-gray-200 pb-3 mb-4">
 Fila de Impressão
 </h3>

 {!hasSelected ? (
 <p className="text-sm text-gray-500">Selecione variações na lista ao lado para adicionar aqui.</p>
 ) : (
 <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
 {Object.entries(selectedSkus).map(([sku, qty]) => (
 <div key={sku} className="flex justify-between items-center bg-white border border-gray-200 p-3">
 <span className="text-xs font-mono font-bold text-hooke-900 truncate flex-1">{sku}</span>
 <div className="flex items-center gap-2">
 <span className="text-[10px] text-gray-500 font-bold">Qtd</span>
 <input
 type="number"
 value={qty}
 min={1}
 onChange={(e) => updateQuantity(sku, parseInt(e.target.value) || 1)}
 className="w-16 border border-gray-300 p-1 text-center text-sm focus:outline-none focus:border-hooke-900"
 />
 <button
 onClick={() => handleToggleSku(sku)}
 className="text-red-400 hover:text-red-600 p-1"
 >
 <Trash2 size={16} />
 </button>
 </div>
 </div>
 ))}
 </div>
 )}

 {hasSelected && (
 <button
 onClick={() => setSelectedSkus({})}
 className="w-full mt-6 py-2 text-xs font-bold tracking-widest text-gray-500 hover:text-black transition-colors"
 >
 Limpar Fila
 </button>
 )}
 </div>
 </div>
 </div>

 {/* ÁREA DE IMPRESSÃO (Oculta na tela, visível apenas no Print) */}
 <div className="hidden print:block bg-white w-full">
 <div className="grid grid-cols-3 gap-x-4 gap-y-8" style={{ width: '210mm' }}>
 {Object.entries(selectedSkus).flatMap(([sku, qty]) => {
 // Duplicar a etiqueta de acordo com a quantidade configurada
 return Array(qty).fill(sku).map((s, index) => (
 <div key={`${s}-${index}`} className="flex flex-col items-center justify-center border border-dashed border-gray-300 p-4" style={{ height: '38.1mm', width: '63.5mm' }}>
 {/* Exemplo de medida PIMACO 6280 (3 colunas, 38.1mm x 63.5mm) */}
 <Barcode
 value={s}
 width={1.5}
 height={40}
 fontSize={12}
 margin={0}
 displayValue={true}
 background="transparent"
 />
 <span className="text-[8px] mt-1 font-bold text-black tracking-widest">Hooke Store</span>
 </div>
 ));
 })}
 </div>
 </div>

 </div>
 );
}
