"use client";

import { useEffect, useState } from "react";
import { db, auth } from "@/lib/firebase";
import { collection, getDocs, doc, updateDoc, setDoc } from "firebase/firestore";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { useRouter } from "next/navigation";
import { UploadButton } from "@/utils/uploadthing";
import Image from "next/image";
import Link from "next/link";

import { Trash2, Eye, EyeOff, Edit3, Barcode, RefreshCw, CheckCircle2, Monitor, Tags, FileText, Zap, Rocket, Copy, Orbit } from "lucide-react";
import { Toaster, toast } from "sonner";
import ProductForm from "./components/ProductForm";

interface AdminProduct {
 id: string;
 name: string;
 price: number;
 imagem?: string;
 isActive?: boolean;
 sizes?: string[];
 syncStatus?: 'pending' | 'synced' | 'failed';
 launchExpiry?: number;
 [key: string]: unknown;
}

export default function AdminPage() {
 const [products, setProducts] = useState<AdminProduct[]>([]);
 const [loading, setLoading] = useState(true);
 const [savingId, setSavingId] = useState<string | null>(null);
 const [user, setUser] = useState<User | null>(null);
 const router = useRouter();

 // Novos estados de Formulário de Cadastro
 const [showForm, setShowForm] = useState(false);
 const [isSavingNew, setIsSavingNew] = useState(false);
 const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null);

 const AVAILABLE_SIZES = ["P", "M", "G", "GG", "XG"];

 useEffect(() => {
  const fireauth = auth;
  if (!fireauth) {
    setLoading(false);
    return;
  }
  const unsubscribe = onAuthStateChanged(fireauth, (currentUser) => {
    if (!currentUser) {
      router.push("/login");
    } else {
      setUser(currentUser);
      fetchProducts();
    }
  });

  return () => unsubscribe();
 }, [router]);

 async function fetchProducts() {
  const firestore = db;
  // ⚡ A TRAVA DO TECH LEAD
  if (!firestore) {
      setLoading(false);
      return;
  }
 try {
 const querySnapshot = await getDocs(collection(firestore, "produtos"));
 const productsData: AdminProduct[] = [];
 querySnapshot.forEach((doc) => {
 const data = doc.data();
 productsData.push({
 id: doc.id,
 ...data,
 name: data.name,
 price: data.price,
 imagem: data.imagem,
 isActive: data.isActive !== false, // se não existir, assume true
 sizes: data.sizes || ["P", "M", "G", "GG"], // fallback
 } as AdminProduct);
 });
 setProducts(productsData);
 } catch (error) {
 console.error("Erro ao buscar produtos:", error);
 } finally {
 setLoading(false);
 }
 }

 const handleUpdate = async (id: string, newName: string, newPrice: number, newImagem?: string, newIsActive?: boolean, newSizes?: string[]) => {
  const firestore = db;
  // ⚡ A TRAVA DO TECH LEAD
  if (!firestore) {
      toast.error("Erro: Banco de dados offline.");
      return;
  }
 setSavingId(id);
 try {
 const productRef = doc(firestore, "produtos", id);
 await updateDoc(productRef, {
 name: newName,
 price: Number(newPrice),
 ...(newImagem && { imagem: newImagem }),
 isActive: newIsActive !== undefined ? newIsActive : true,
 sizes: newSizes || [],
 });
 toast.success(`Alterações salvas!`);
 } catch (error) {
 console.error("Erro ao atualizar produto:", error);
 toast.error("Erro ao atualizar produto.");
 } finally {
 setSavingId(null);
 }
 };

 const handleDelete = async (id: string, name: string) => {
 if (!window.confirm(`Tem certeza que deseja EXCLUIR DEFINITIVAMENTE o produto "${name}"? Essa ação não pode ser desfeita.`)) {
 return;
 }

 const firestore = db;
 // ⚡ A TRAVA DO TECH LEAD
 if (!firestore) {
     toast.error("Erro: Banco de dados offline.");
     return;
 }

 try {
 const productRef = doc(firestore, "produtos", id);
 // import { deleteDoc } from "firebase/firestore"; <-- vou garantir isso no top
 // Usando abordagem segura de exclusão real
 const { deleteDoc } = await import("firebase/firestore");
 await deleteDoc(productRef);
 toast.success(`Produto "${name}" excluído.`);
 fetchProducts();
 } catch (error) {
 console.error("Erro ao excluir:", error);
 toast.error("Erro ao excluir produto.");
 }
 };

 const toggleSize = (id: string, sizeToToggle: string, currentSizes: string[]) => {
 const newSizes = currentSizes.includes(sizeToToggle)
 ? currentSizes.filter(s => s !== sizeToToggle)
 : [...currentSizes, sizeToToggle];

 handleChange(id, "sizes", newSizes);
 };



 const handleChange = (id: string, field: "name" | "price" | "imagem" | "isActive" | "sizes", value: string | number | boolean | string[]) => {
 setProducts((prev) =>
 prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
 );
 };

 const handleLogout = async () => {
  const fireauth = auth;
  if (!fireauth) return;
 try {
 await signOut(fireauth);
 router.push("/login");
 } catch (error) {
 console.error("Erro ao deslogar:", error);
 }
 };

 const generateSlug = (name: string) => {
 return name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
 };

 const handleSavePro = async (data: Record<string, unknown>) => {
 setIsSavingNew(true);
 try {
 const isEditing = !!editingProduct;
 const slug = isEditing && editingProduct.id ? String(editingProduct.id) : generateSlug(String(data.name));
 const id = slug;

 const finalProduct = {
 id,
 name: data.name,
 slug,
 price: Number(data.price),
 comboPrice: Number(data.comboPrice),
 featured: data.featured,
 isNew: isEditing ? (editingProduct.isNew || false) : true,
 launchExpiry: isEditing ? editingProduct.launchExpiry : Date.now() + (30 * 24 * 60 * 60 * 1000),
 description: data.description,
 imagem: data.imagem,
 imageUrl: data.imagem,
 images: data.images,
 sizes: data.sizes,
 isActive: data.isActive,
 category: data.category,
 seo: data.seo || { altText: "", metaDescription: "" },
 colors: data.colors || [],
 skus: data.skus || {},
 syncStatus: 'pending', // Inicia como pendente
 details: isEditing ? (editingProduct.details || { fabric: "Algodão Premium", model: "Regular", wash: "Amaciada" }) : { fabric: "Algodão Premium", model: "Regular", wash: "Amaciada" }
 };

 const firestore = db;
 // ⚡ A TRAVA DO TECH LEAD
 if (!firestore) {
     toast.error("Erro: Banco de dados offline.");
     return;
 }
 await setDoc(doc(firestore, "produtos", id), finalProduct);
 
 // Orquestrar Sincronização com Tiny (Sem travar o usuário)
 const syncWithTiny = async () => {
 try {
 const response = await fetch("/api/admin/sync/tiny", {
 method: "POST",
 body: JSON.stringify(finalProduct),
 });
 
 if (response.ok) {
  const firestoreSync = db;
  if (!firestoreSync) return;
  await updateDoc(doc(firestoreSync, "produtos", id), { syncStatus: 'synced' });
  toast.success("Sincronizado com Tiny ERP!");
 } else {
 throw new Error("Tiny fail");
 }
 } catch (err) {
 console.error("Erro sync tiny:", err);
 const firestoreFail = db;
 if (!firestoreFail) return;
 await updateDoc(doc(firestoreFail, "produtos", id), { syncStatus: 'failed' });
 toast.error("Salvo no site, mas falhou ao enviar para o Tiny. Tente novamente mais tarde.", { duration: 5000 });
 }
 };

 syncWithTiny();

 toast.success(isEditing ? "Produto atualizado!" : "Produto cadastrado!");

 setShowForm(false);
 setEditingProduct(null);
 fetchProducts();

 } catch (err) {
 console.error("Erro ao salvar produto:", err);
 toast.error("Erro ao salvar produto. Veja o console.");
 } finally {
 setIsSavingNew(false);
 }
 };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white font-sans">
        <p className="text-hooke-900 font-bold tracking-widest text-xs animate-pulse">Acessando painel...</p>
      </div>
    );
  }

  if (!auth || !db) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white font-sans p-8  max-w-xl mx-auto text-center">
        <h1 className="text-3xl font-black text-red-600 mb-6 uppercase tracking-tighter italic">Erro de Conexão Crítico</h1>
        <div className="bg-red-50 border border-red-100 p-8 text-left space-y-4 mb-8">
          <p className="text-sm font-bold text-red-900">O Painel Administrativo está bloqueado pelo modo de segurança (Short-Circuit).</p>
          <hr className="border-red-200" />
          <p className="text-xs text-red-800 leading-relaxed font-medium">
            <span className="font-black">Motivo:</span> As credenciais do Firebase não foram detectadas no ambiente.
          </p>
          <p className="text-xs text-red-800 leading-relaxed">
            <span className="font-black">Como resolver:</span>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Se estiver Local: Certifique-se de que o arquivo <code className="bg-white px-1">.env.local</code> existe e <span className="font-bold underline">reinicie o servidor dev</span> (Ctrl+C e npm run dev).</li>
              <li>Se estiver na Vercel: Verifique se as Environment Variables foram adicionadas no Dashboard e faça um re-deploy.</li>
            </ul>
          </p>
        </div>
        <div className="flex gap-4 w-full">
          <button onClick={() => window.location.reload()} className="flex-1 px-8 py-4 bg-hooke-900 text-white font-black tracking-widest uppercase hover:bg-black transition-all">
            Tentar Reconetar
          </button>
          <Link href="/" className="flex-1 px-8 py-4 border border-black text-black font-black tracking-widest uppercase hover:bg-gray-50 transition-all">
            Voltar ao Site
          </Link>
        </div>
      </div>
    );
  }

  if (!user) {
    // Isso deve ser resolvido pelo push do router, mas serve como fallback
    return null;
  }

 return (
 <div className="min-h-screen bg-white p-8 font-sans pb-24">
 <Toaster position="top-right" richColors />
 <div className="max-w-6xl mx-auto">

 {/* Cabeçalho */}
 <div className="flex items-center justify-between mb-10 border-b border-hooke-900 pb-6">
 <div>
 <h1 className="text-3xl font-black tracking-tighter text-hooke-900">Painel Admin</h1>
 <p className="text-xs tracking-widest text-gray-400 mt-2">Logado como: {user.email}</p>
 </div>
 <div className="flex items-center gap-4 flex-wrap">
 <button
 onClick={() => {
 navigator.clipboard.writeText(`${window.location.origin}/api/feed.xml`);
 toast.success("URL do Catálogo Copiada! Cole no Gerenciador do Meta.");
 }}
 className="flex items-center gap-2 text-xs font-bold tracking-widest text-pink-600 bg-pink-50 border border-pink-200 px-6 py-3 hover:bg-pink-100 hover:text-pink-700 rounded-none transition-colors"
 title="Copiar Link XML para Instagram Shopping"
 >
 Catálogo Instagram
 </button>

 <Link
 href="/admin/etiquetas"
 className="flex items-center gap-2 text-xs font-bold tracking-widest text-hooke-900 bg-white border border-hooke-900 px-6 py-3 hover:bg-hooke-50 rounded-none transition-colors"
 >
 <Barcode size={16} /> Etiquetas (SKU)
 </Link>

 <button
 onClick={() => {
 setEditingProduct(null);
 setShowForm(!showForm);
 }}
 className="text-xs font-bold tracking-widest text-white bg-hooke-900 border border-hooke-900 px-6 py-3 hover:bg-black rounded-none transition-colors"
 >
 {showForm ? "CANCELAR" : "+ NOVO PRODUTO PRO"}
 </button>
 <Link
 href="/admin/pedidos"
 className="flex items-center gap-2 text-xs font-bold tracking-widest text-hooke-900 bg-gray-100 border border-transparent px-6 py-3 hover:bg-gray-200 rounded-none transition-colors"
 >
 Ver Pedidos
 </Link>
 <button
 onClick={handleLogout}
 className="text-xs font-bold tracking-widest text-hooke-900 hover:text-white transition-colors border border-hooke-900 px-6 py-3 hover:bg-hooke-900 rounded-none bg-white"
 >
 Sair
 </button>
 </div>
 </div>

 {/* Acesso Rápido - Hooke Pro 2026 */}
 <div className="mb-12">
 <h2 className="text-xs font-black tracking-[0.2em] text-hooke-900/40 mb-4">Módulos Hooke 2026</h2>
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
 <Link 
 href="/admin/pdv" 
 className="bg-white border border-hooke-900 p-6 shadow-neumorph hover:shadow-neumorph-inset transition-all group flex flex-col justify-between"
 >
 <div>
 <Monitor className="h-6 w-6 mb-4 text-hooke-900 group-hover:scale-110 transition-transform" />
 <h3 className="text-lg font-black tracking-tighter text-hooke-900">Frente de Caixa</h3>
 <p className="text-[10px] font-bold tracking-widest text-gray-400 mt-1">PDV Touch & Mobile</p>
 </div>
 <Zap className="h-4 w-4 text-yellow-500 mt-4 opacity-0 group-hover:opacity-100 transition-opacity" />
 </Link>

 <Link 
 href="/admin/pdv/etiquetas" 
 className="bg-white border border-hooke-900 p-6 shadow-neumorph hover:shadow-neumorph-inset transition-all group flex flex-col justify-between"
 >
 <div>
 <Tags className="h-6 w-6 mb-4 text-hooke-900 group-hover:scale-110 transition-transform" />
 <h3 className="text-lg font-black tracking-tighter text-hooke-900">Etiquetas</h3>
 <p className="text-[10px] font-bold tracking-widest text-gray-400 mt-1">Gerador Térmico (40x25)</p>
 </div>
 </Link>

 <Link 
 href="/admin/pdv/folha-skus" 
 className="bg-white border border-hooke-900 p-6 shadow-neumorph hover:shadow-neumorph-inset transition-all group flex flex-col justify-between"
 >
 <div>
 <FileText className="h-6 w-6 mb-4 text-hooke-900 group-hover:scale-110 transition-transform" />
 <h3 className="text-lg font-black tracking-tighter text-hooke-900">Guia de SKUs</h3>
 <p className="text-[10px] font-bold tracking-widest text-gray-400 mt-1">Dicionário Oficial 2026</p>
 </div>
 </Link>

  <Link 
  href="/admin/lancamentos" 
  className="bg-zinc-900 border border-hooke-900 p-6 shadow-neumorph hover:shadow-neumorph-inset transition-all group flex flex-col justify-between"
  >
  <div>
  <Rocket className="h-6 w-6 mb-4 text-white group-hover:scale-110 transition-transform" />
  <h3 className="text-lg font-black tracking-tighter text-white">Lançamentos</h3>
  <p className="text-[10px] font-bold tracking-widest text-zinc-500 mt-1">Lookbooks & Anúncios</p>
  </div>
  <Zap className="h-4 w-4 text-yellow-500 mt-4 opacity-0 group-hover:opacity-100 transition-opacity" />
  </Link>
 
  <Link 
  href="/admin/office" 
  className="bg-white border border-hooke-900 p-6 shadow-neumorph hover:shadow-neumorph-inset transition-all group flex flex-col justify-between"
  >
  <div>
  <Orbit className="h-6 w-6 mb-4 text-hooke-900 group-hover:scale-110 transition-transform" />
  <h3 className="text-lg font-black tracking-tighter text-hooke-900">Escritório Virtual</h3>
  <p className="text-[10px] font-bold tracking-widest text-gray-400 mt-1">Status do Time de Agentes</p>
  </div>
  </Link>
  </div>
  </div>

 {/* Formulário de Criação Condicional V4 */}
 {(showForm || editingProduct) && (
 <div className="mb-12">
 <ProductForm
 initialData={editingProduct}
 onSubmit={handleSavePro}
 onCancel={() => {
 setShowForm(false);
 setEditingProduct(null);
 }}
 isSaving={isSavingNew}
 />
 </div>
 )}

 {/* Tabela de Produtos */}
 <h2 className="text-xl font-black tracking-tighter text-hooke-900 mb-6">Seus Produtos</h2>
 <div className="bg-white border border-hooke-900 overflow-hidden rounded-none">
 <table className="w-full text-left border-collapse">
 <thead>
 <tr className="border-b border-hooke-900 bg-gray-50">
 <th className="p-4 text-xs font-bold tracking-widest text-hooke-900 hidden md:table-cell">ID</th>
 <th className="p-4 text-xs font-bold tracking-widest text-hooke-900">Visível</th>
 <th className="p-4 text-xs font-bold tracking-widest text-hooke-900">Tiny Sync</th>
 <th className="p-4 text-xs font-bold tracking-widest text-hooke-900">Imagem</th>
 <th className="p-4 text-xs font-bold tracking-widest text-hooke-900 w-[20%]">Nome do Produto</th>
 <th className="p-4 text-xs font-bold tracking-widest text-hooke-900">Preço (R$)</th>
 <th className="p-4 text-xs font-bold tracking-widest text-hooke-900 min-w-[200px]">Estoque (Tamanhos)</th>
 <th className="p-4 text-xs font-bold tracking-widest text-hooke-900 text-right">Ações</th>
 </tr>
 </thead>
 <tbody>
 {products.map((product) => (
 <tr key={product.id} className={`border-b border-gray-200 last:border-0 hover:bg-gray-50 transition-colors ${!product.isActive ? 'opacity-50 grayscale' : ''}`}>
 <td className="p-4 text-xs font-mono text-gray-500 truncate max-w-[100px] hidden md:table-cell" title={product.id}>{product.id}</td>

 {/* Toggle Visibility */}
 <td className="p-4 text-center">
 <button
 onClick={() => handleChange(product.id, "isActive", !product.isActive)}
 className="text-hooke-900 hover:scale-110 transition-transform flex justify-center w-full"
 title={product.isActive ? "Visível na vitrine" : "Oculto na vitrine"}
 >
 {product.isActive ? <Eye size={20} /> : <EyeOff size={20} className="text-gray-400" />}
 </button>
 </td>

 <td className="p-4 text-center">
 {(product.syncStatus === 'pending' || product.syncStatus === 'failed') ? (
 <button 
 onClick={() => handleSavePro(product)}
 className={`flex flex-col items-center justify-center w-full gap-1 ${product.syncStatus === 'failed' ? 'text-red-500' : 'text-amber-500'}`}
 title="Clique para tentar sincronizar agora"
 >
 <RefreshCw size={18} className={product.syncStatus === 'pending' ? 'animate-spin' : ''} />
 <span className="text-[8px] font-black ">{product.syncStatus === 'failed' ? 'Falhou' : 'Pendente'}</span>
 </button>
 ) : (
 <div className="flex flex-col items-center justify-center w-full gap-1 text-green-600">
 <CheckCircle2 size={18} />
 <span className="text-[8px] font-black ">Sincronizado</span>
 </div>
 )}
 </td>
 <td className="p-4">
 {product.imagem ? (
 <div className="flex flex-col gap-2 items-start">
 <div className="relative w-12 h-12 border border-hooke-900">
 <Image priority src={product.imagem} alt={product.name} fill className="object-cover" />
 </div>
 <button onClick={() => handleChange(product.id, "imagem", "")} className="text-[10px] text-red-500 font-bold tracking-widest text-left hover:underline">Remover</button>
 </div>
 ) : (
 <div className="w-28 relative h-10 border border-gray-300 pointer-events-auto flex items-center bg-white p-0">
 <UploadButton
 endpoint="imageUploader"
 onClientUploadComplete={(res) => {
 if (res && res[0]) {
 handleChange(product.id, "imagem", res[0].url);
 }
 }}
 onUploadError={(error: Error) => {
 alert(`Erro ao fazer upload: ${error.message}`);
 }}
 appearance={{
 button: "bg-hooke-900 text-white rounded-none text-[10px] font-bold tracking-widest px-2 hover:bg-black transition-colors w-full h-10 m-0",
 allowedContent: "hidden"
 }}
 />
 </div>
 )}
 </td>
 <td className="p-4">
 <input
 type="text"
 value={product.name}
 onChange={(e) => handleChange(product.id, "name", e.target.value)}
 className="w-full bg-white border border-gray-300 rounded-none px-3 py-2 text-sm focus:ring-1 focus:ring-hooke-900 focus:border-hooke-900 outline-none transition-all text-hooke-900"
 />
 </td>
 <td className="p-4">
 <div className="flex gap-1 flex-wrap">
 {AVAILABLE_SIZES.map(size => {
 const isStocked = (product.sizes || []).includes(size);
 return (
 <button
 key={size}
 onClick={() => toggleSize(product.id, size, product.sizes || [])}
 className={`w-7 h-7 text-[10px] font-bold border flex items-center justify-center transition-colors
 ${isStocked ? 'bg-hooke-900 text-white border-hooke-900' : 'bg-transparent text-gray-300 border-gray-200'} 
 `}
 >
 {size}
 </button>
 )
 })}
 </div>
 </td>
 <td className="p-4 text-right">
 <div className="flex justify-end gap-2 items-center">
 <button
 onClick={() => handleUpdate(product.id, product.name, product.price, product.imagem, product.isActive, product.sizes)}
 disabled={savingId === product.id}
 className="bg-hooke-900 hover:bg-black text-white px-4 py-2 rounded-none text-[10px] font-bold tracking-widest transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
 >
 {savingId === product.id ? "Salvando" : "Salvar Rápido"}
 </button>

 <button
 onClick={() => {
 const duplicatedProduct = {
 ...product,
 id: "",
 name: `${product.name} (Nova Cor)`,
 imagem: "",
 imageUrl: "",
 images: [],
 skus: {},
 stock: {},
 colors: [],
 syncStatus: 'pending' as const
 };
 setEditingProduct(duplicatedProduct);
 setShowForm(false);
 window.scrollTo({ top: 0, behavior: 'smooth' });
 }}
 className="bg-zinc-800 hover:bg-black text-white px-4 py-2 rounded-none text-[10px] font-bold tracking-widest transition-colors flex items-center gap-1"
 title="Copiar todos os dados para cadastrar uma nova cor (sem copiar galeria/skus)"
 >
 <Copy size={14} /> CLONAR
 </button>

 <button
 onClick={() => {
 setEditingProduct(product);
 setShowForm(false);
 window.scrollTo({ top: 0, behavior: 'smooth' });
 }}
 className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-none text-[10px] font-bold tracking-widest transition-colors flex items-center gap-1"
 title="Editar PRO"
 >
 <Edit3 size={14} /> PRO
 </button>

 <button
 onClick={() => handleDelete(product.id, product.name)}
 className="text-red-300 hover:text-red-600 transition-colors p-2"
 title="Excluir Produto"
 >
 <Trash2 size={16} />
 </button>
 </div>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 {products.length === 0 && (
 <div className="p-8 text-center text-xs font-bold tracking-widest text-gray-400">
 Nenhum produto encontrado.
 </div>
 )}
 </div>
 </div>
 </div>
 );
}
