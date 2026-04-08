"use client";

import { useState } from "react";
import Image from "next/image";
import { UploadButton } from "@/utils/uploadthing";
import { Trash2, GripVertical, Plus } from "lucide-react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";

// dnd-kit
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

import { 
  ModelSigla,
  PrintSigla
} from "@/utils/sku-generator";
import { Product } from "@/types";

const AVAILABLE_SIZES_MASCO = ["P", "M", "G", "GG", "XG", "G1", "G2"];
const AVAILABLE_SIZES_FEMIN = ["PP", "P", "M", "G", "GG"];

type FormProductData = Partial<Product>;

interface ProductFormProps {
  initialData?: FormProductData | null;
  onSubmit: (data: FormProductData) => void;
  onCancel: () => void;
  isSaving: boolean;
}

function SortablePhoto({ id, url, onRemove }: { id: string; url: string; onRemove: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  return (
    <div ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition }} className="relative w-24 h-24 border border-hooke-900 group bg-gray-50 flex items-center justify-center shrink-0">
      <Image priority src={url} alt="Gallery item" fill className="object-cover" />
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
        <button type="button" {...attributes} {...listeners} className="text-white hover:text-hooke-400 cursor-grab active:cursor-grabbing p-1"><GripVertical size={18} /></button>
        <button type="button" onClick={onRemove} className="text-red-400 hover:text-red-600 p-1 bg-black/50 rounded-full"><Trash2 size={16} /></button>
      </div>
    </div>
  );
}

export default function AdminProductForm({ initialData, onSubmit, onCancel, isSaving }: ProductFormProps) {
  const [activeTab, setActiveTab] = useState<"geral" | "visual" | "estoque" | "seo">("geral");
  
  const [name, setName] = useState(initialData?.name || "");
  const [department, setDepartment] = useState<"masculino" | "feminino" | "unissex">(initialData?.department || "masculino");
  const [category, setCategory] = useState(initialData?.category || (department === "feminino" ? "Conjuntos" : "Oversized"));
  const [price, setPrice] = useState(initialData?.price || 0);
  const [comboPrice, setComboPrice] = useState(initialData?.comboPrice || 0);
  const [description, setDescription] = useState(initialData?.description || "");
  const [sizes, setSizes] = useState<string[]>(initialData?.sizes || (department === "feminino" ? ["P", "M", "G"] : ["P", "M", "G", "GG"]));

  const [stock, setStock] = useState<Record<string, number>>(initialData?.stock || {});
  const [skus, setSkus] = useState<Record<string, string>>(initialData?.skus || {});
  const [images, setImages] = useState<string[]>(initialData?.images || (initialData?.imagem ? [initialData?.imagem] : []));
  const [metaDescription, setMetaDescription] = useState(initialData?.seo?.metaDescription || "");

  /* eslint-disable @typescript-eslint/no-unused-vars */
  const [featured, setFeatured] = useState(initialData?.featured || false);
  const [isActive, setIsActive] = useState(initialData?.isActive !== false);
  const [modelSigla, setModelSigla] = useState<ModelSigla>(initialData?.modelSigla || "TSH");
  const [printSigla, setPrintSigla] = useState<PrintSigla>(initialData?.printSigla || "HK1");
  const [weight, setWeight] = useState<number>(initialData?.weight || 300);
  const [colors, setColors] = useState<{ name: string; imageUrl: string }[]>(initialData?.colors || []);
  /* eslint-enable @typescript-eslint/no-unused-vars */

  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor));

  const handleSave = () => {
    onSubmit({
      ...initialData,
      name, department, category, price, comboPrice, description, featured, isActive,
      sizes, images, imagem: images[0], colors, stock, skus, modelSigla, printSigla, weight,
      seo: { ...initialData?.seo, metaDescription }
    });
  };

  return (
    <div className="flex flex-col h-full bg-white font-sans">
      {/* Tabs Internas */}
      <div className="flex border-b border-gray-100 bg-gray-50/50">
        {(["geral", "visual", "estoque", "seo"] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-4 text-[10px] font-black tracking-widest uppercase transition-all border-b-2 ${
              activeTab === tab ? "border-hooke-900 text-hooke-900 bg-white" : "border-transparent text-gray-400 hover:text-gray-600"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex-1 p-8 overflow-y-auto space-y-8 pb-32">
        {activeTab === "geral" && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                 <label className="text-[10px] font-black tracking-widest text-hooke-900 uppercase">Departamento</label>
                 <select 
                    value={department} 
                    onChange={(e) => setDepartment(e.target.value as "masculino" | "feminino" | "unissex")} 
                    className="w-full border border-gray-200 p-3 text-xs font-bold bg-white outline-none"
                  >
                   <option value="masculino">MASCULINO</option>
                   <option value="feminino">FEMININO</option>
                   <option value="unissex">UNISSEX</option>
                 </select>
               </div>
               <div className="space-y-2">
                 <label className="text-[10px] font-black tracking-widest text-hooke-900 uppercase">Categoria</label>
                 <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full border border-gray-200 p-3 text-xs font-bold bg-white outline-none">
                    {department === 'feminino' ? (
                      <><option value="Conjuntos">Conjuntos</option><option value="Cropped">Cropped</option><option value="Top">Top</option></>
                    ) : (
                      <><option value="Oversized">Oversized</option><option value="Regatas">Regatas</option><option value="Vintage">Vintage</option><option value="Kits">Kits</option></>
                    )}
                 </select>
               </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black tracking-widest text-hooke-900 uppercase">Nome do Produto</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full border border-gray-200 p-3 text-sm font-medium focus:border-hooke-900 outline-none" placeholder="Ex: Conjunto Muse Forest" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black tracking-widest text-hooke-900 uppercase">Preço (R$)</label>
                <input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} className="w-full border border-gray-200 p-3 text-sm font-medium outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black tracking-widest text-hooke-900 uppercase">Preço Combo (R$)</label>
                <input type="number" value={comboPrice} onChange={(e) => setComboPrice(Number(e.target.value))} className="w-full border border-gray-200 p-3 text-sm font-medium outline-none" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black tracking-widest text-hooke-900 uppercase">Descrição Hooke</label>
              <ReactQuill theme="snow" value={description} onChange={setDescription} className="bg-white min-h-[150px]" />
            </div>
          </div>
        )}

        {activeTab === "visual" && (
           <div className="space-y-8">
              <div className="space-y-4">
                <h3 className="text-xs font-black tracking-[0.2em] text-hooke-900 uppercase">Galeria do Produto</h3>
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => {
                  const { active, over } = e;
                  if (over && active.id !== over.id) {
                    setImages(items => {
                      const oldIdx = items.indexOf(active.id as string);
                      const newIdx = items.indexOf(over.id as string);
                      return arrayMove(items, oldIdx, newIdx);
                    });
                  }
                }}>
                  <SortableContext items={images} strategy={rectSortingStrategy}>
                    <div className="flex flex-wrap gap-3">
                      {images.map(url => <SortablePhoto key={url} id={url} url={url} onRemove={() => setImages(images.filter(i => i !== url))} />)}
                      {images.length < 5 && (
                        <div className="w-24 h-24 border-2 border-dashed border-gray-200 flex items-center justify-center relative hover:border-hooke-900 transition-colors">
                          <UploadButton 
                            endpoint="imageUploader" 
                            onClientUploadComplete={(res) => res?.[0] && setImages([...images, res[0].url])}
                            appearance={{ button: "absolute inset-0 w-full h-full opacity-0", allowedContent: "hidden" }}
                          />
                          <Plus className="text-gray-300" />
                        </div>
                      )}
                    </div>
                  </SortableContext>
                </DndContext>
              </div>
           </div>
        )}

        {activeTab === "estoque" && (
          <div className="space-y-6">
             <div className="space-y-3">
               <label className="text-[10px] font-black tracking-widest text-hooke-900 uppercase">Tamanhos Disponíveis</label>
               <div className="flex flex-wrap gap-2">
                 {(department === 'feminino' ? AVAILABLE_SIZES_FEMIN : AVAILABLE_SIZES_MASCO).map(s => (
                   <button key={s} type="button" onClick={() => setSizes(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])}
                           className={`w-10 h-10 text-xs font-bold border-2 transition-all ${sizes.includes(s) ? 'bg-hooke-900 text-white border-hooke-900' : 'bg-white text-gray-300 border-gray-100 hover:border-gray-300'}`}>
                     {s}
                   </button>
                 ))}
               </div>
             </div>
             {/* Grade Simplificada */}
             <div className="space-y-2">
                {sizes.map(s => (
                  <div key={s} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-100 uppercase">
                    <span className="text-[10px] font-bold">{s}</span>
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col"><label className="text-[8px] text-gray-400 font-black">QTD</label>
                        <input type="number" value={stock[s] || 0} onChange={(e) => setStock({...stock, [s]: Number(e.target.value)})} className="w-16 border-b border-gray-300 bg-transparent text-center text-xs font-bold outline-none" />
                      </div>
                      <div className="flex flex-col"><label className="text-[8px] text-gray-400 font-black">SKU</label>
                        <input type="text" value={skus[s] || ""} onChange={(e) => setSkus({...skus, [s]: e.target.value})} className="w-24 border-b border-gray-300 bg-transparent text-[10px] font-mono outline-none" placeholder="AUTO" />
                      </div>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        )}

        {activeTab === "seo" && (
           <div className="space-y-4">
              <label className="text-[10px] font-black tracking-widest text-hooke-900 uppercase">Meta Description (Google)</label>
              <textarea value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} rows={4} className="w-full border border-gray-200 p-4 text-xs font-medium focus:border-hooke-900 outline-none resize-none" placeholder="Resumo para o Google..." />
              <p className="text-[9px] text-gray-400 text-right">{metaDescription.length}/160 caracteres</p>
           </div>
        )}
      </div>

      {/* Footer Fixo de Ações */}
      <div className="p-6 border-t border-gray-100 bg-white flex items-center justify-end gap-4 shadow-xl">
        <button type="button" onClick={onCancel} className="text-[10px] font-black tracking-widest uppercase text-gray-400 hover:text-hooke-900 transition-colors">Cancelar</button>
        <button type="button" onClick={handleSave} disabled={isSaving} className="px-10 py-4 bg-hooke-900 text-white text-[10px] font-black tracking-widest uppercase hover:bg-black transition-all shadow-lg disabled:opacity-50">
          {isSaving ? "Processando..." : "Salvar Produto"}
        </button>
      </div>
    </div>
  );
}
