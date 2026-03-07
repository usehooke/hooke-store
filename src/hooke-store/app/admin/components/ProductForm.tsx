"use client";

import { useState } from "react";
import Image from "next/image";
import { UploadButton } from "@/utils/uploadthing";
import { toast } from "sonner";
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
    DragEndEvent,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    rectSortingStrategy,
    useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const AVAILABLE_SIZES = ["P", "M", "G", "GG", "XG"];

interface FormProductData {
    id?: string;
    name?: string;
    category?: string;
    price?: number;
    description?: string;
    featured?: boolean;
    isActive?: boolean;
    sizes?: string[];
    images?: string[];
    imagem?: string;
    colors?: { name: string; imageUrl: string }[];
    seoAltText?: string;
    seo?: { altText?: string; metaDescription?: string };
    stock?: Record<string, number>;
    [key: string]: unknown;
}

interface ProductFormProps {
    initialData?: FormProductData | null;
    onSubmit: (data: FormProductData) => void;
    onCancel: () => void;
    isSaving: boolean;
}

function SortablePhoto({ id, url, onRemove }: { id: string; url: string; onRemove: () => void }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={style} className="relative w-24 h-24 border border-hooke-900 group bg-gray-50 flex items-center justify-center shrink-0">
            <Image src={url} alt="Gallery item" fill className="object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                    type="button"
                    {...attributes}
                    {...listeners}
                    className="text-white hover:text-hooke-400 cursor-grab active:cursor-grabbing p-1"
                    title="Arraste para reordenar"
                >
                    <GripVertical size={18} />
                </button>
                <button
                    type="button"
                    onClick={onRemove}
                    className="text-red-400 hover:text-red-600 p-1 bg-black/50 rounded-full"
                    title="Remover foto"
                >
                    <Trash2 size={16} />
                </button>
            </div>
        </div>
    );
}

export default function ProductForm({ initialData, onSubmit, onCancel, isSaving }: ProductFormProps) {
    // Estado do Form
    const [name, setName] = useState(initialData?.name || "");
    const [category, setCategory] = useState(initialData?.category || "Oversized");
    const [price, setPrice] = useState(initialData?.price || 0);
    const [description, setDescription] = useState(initialData?.description || "");
    const [featured, setFeatured] = useState(initialData?.featured || false);
    const [isActive, setIsActive] = useState(initialData?.isActive !== false);
    const [sizes, setSizes] = useState<string[]>(initialData?.sizes || ["P", "M", "G", "GG"]);

    // Estoque
    const [stock, setStock] = useState<Record<string, number>>(initialData?.stock || {});

    // Pro Gallery V4
    const [images, setImages] = useState<string[]>(initialData?.images || (initialData?.imagem ? [initialData?.imagem] : []));

    // Variações com Foto V4
    const [colors, setColors] = useState<{ name: string; imageUrl: string }[]>(initialData?.colors || []);
    const [newColorName, setNewColorName] = useState("");
    const [newColorImg, setNewColorImg] = useState("");

    // SEO
    const [seoAltText, setSeoAltText] = useState(initialData?.seoAltText || "");
    const [metaDescription, setMetaDescription] = useState(initialData?.seo?.metaDescription || "");

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const toggleSize = (size: string) => {
        setSizes((prev) => {
            const isRemoving = prev.includes(size);
            const newSizes = isRemoving ? prev.filter((s) => s !== size) : [...prev, size];

            // Opcional: Limpar estoque das variações que possuem o tamanho removido (descomente se desejar limpeza estrita)
            /* if (isRemoving) {
                const newStock = { ...stock };
                Object.keys(newStock).forEach(key => {
                    if (key === size || key.endsWith(`-${size}`)) {
                        delete newStock[key];
                    }
                });
                setStock(newStock);
            } */

            return newSizes;
        });
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            setImages((items) => {
                const oldIndex = items.indexOf(active.id as string);
                const newIndex = items.indexOf(over.id as string);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    const handleAddColor = () => {
        if (!newColorName || !newColorImg) {
            toast.error("Preencha o nome da cor e selecione uma foto da galeria.");
            return;
        }
        setColors([...colors, { name: newColorName, imageUrl: newColorImg }]);
        setNewColorName("");
        setNewColorImg("");
    };

    const submitForm = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !price || images.length === 0) {
            toast.error("Preencha o nome, preço e adicione pelo menos 1 foto.");
            return;
        }

        const formData = {
            name,
            category,
            price: Number(price),
            description,
            featured,
            isActive,
            sizes,
            images,
            imagem: images[0], // Capa principal
            seoAltText,
            seo: { metaDescription },
            colors,
            stock // Salva o controle de estoque
        };

        onSubmit(formData);
    };

    return (
        <div className="p-8 border border-hooke-900 bg-gray-50">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-black uppercase tracking-tighter text-hooke-900">
                    {initialData ? "Editar Produto" : "Criar Novo Produto Pro"}
                </h2>
                <span className="text-xs bg-hooke-900 text-white px-3 py-1 font-bold tracking-widest uppercase">V4.0 Panel</span>
            </div>

            <form onSubmit={submitForm} className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                {/* COLUNA ESQUERDA: IMAGENS & SEO */}
                <div className="lg:col-span-4 space-y-8">

                    {/* Galeria Pro */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-black uppercase tracking-widest text-hooke-900 border-b border-gray-200 pb-2 flex justify-between">
                            <span>Galeria Pro (Max 5)</span>
                            <span className="text-gray-400">{images.length}/5</span>
                        </h3>

                        <p className="text-xs text-gray-500 font-sans mb-4">
                            A primeira foto será a capa do produto. Arraste para ordenar.
                        </p>

                        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                            <SortableContext items={images} strategy={rectSortingStrategy}>
                                <div className="flex flex-wrap gap-4 mb-4">
                                    {images.map((url) => (
                                        <SortablePhoto
                                            key={url}
                                            id={url}
                                            url={url}
                                            onRemove={() => setImages(images.filter((img) => img !== url))}
                                        />
                                    ))}

                                    {images.length < 5 && (
                                        <div className="w-24 h-24 relative flex items-center justify-center border border-dashed border-hooke-900 bg-white">
                                            <UploadButton
                                                endpoint="imageUploader"
                                                onClientUploadComplete={(res) => {
                                                    if (res && res[0]) {
                                                        setImages([...images, res[0].url]);
                                                    }
                                                }}
                                                onUploadError={(error: Error) => alert(`Erro: ${error.message}`)}
                                                appearance={{
                                                    button: "text-hooke-900 absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10",
                                                    allowedContent: "hidden"
                                                }}
                                            />
                                            <div className="flex flex-col items-center text-hooke-900 gap-1 absolute pointer-events-none">
                                                <Plus size={20} />
                                                <span className="text-[10px] uppercase font-bold tracking-widest">Adicionar</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </SortableContext>
                        </DndContext>
                    </div>

                    {/* Variações com Foto */}
                    <div className="space-y-4 pt-6 border-t border-gray-200">
                        <h3 className="text-sm font-black uppercase tracking-widest text-hooke-900 border-b border-gray-200 pb-2">
                            Variações com Foto (Cores)
                        </h3>
                        <p className="text-xs text-gray-500 font-sans mb-4">
                            Vincule uma cor específica a uma foto da galeria.
                        </p>

                        {colors.length > 0 && (
                            <div className="flex flex-col gap-2 mb-4">
                                {colors.map((color, idx) => (
                                    <div key={idx} className="flex items-center justify-between border border-gray-200 p-2 bg-white">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 relative border border-gray-100">
                                                <Image src={color.imageUrl} alt={color.name} fill className="object-cover" />
                                            </div>
                                            <span className="text-xs font-bold uppercase tracking-widest">{color.name}</span>
                                        </div>
                                        <button type="button" onClick={() => setColors(colors.filter((_, i) => i !== idx))} className="text-red-500">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="flex flex-col gap-2 bg-white p-3 border border-gray-200">
                            <input
                                type="text"
                                placeholder="Ex: Off-White"
                                value={newColorName}
                                onChange={(e) => setNewColorName(e.target.value)}
                                className="w-full border border-gray-300 p-2 text-xs focus:ring-1 focus:ring-hooke-900 outline-none"
                            />
                            <select
                                value={newColorImg}
                                onChange={(e) => setNewColorImg(e.target.value)}
                                className="w-full border border-gray-300 p-2 text-xs outline-none bg-white"
                            >
                                <option value="">Selecione a foto correspondente...</option>
                                {images.map((img, i) => (
                                    <option key={img} value={img}>Foto {i + 1}</option>
                                ))}
                            </select>
                            <button
                                type="button"
                                onClick={handleAddColor}
                                className="text-[10px] bg-hooke-900 text-white p-2 font-bold uppercase tracking-widest mt-1 hover:bg-black transition-colors"
                            >
                                Adicionar Cor
                            </button>
                        </div>
                    </div>

                    {/* SEO Técnico */}
                    <div className="space-y-4 pt-6 border-t border-gray-200">
                        <h3 className="text-sm font-black uppercase tracking-widest text-hooke-900 border-b border-gray-200 pb-2">
                            SEO Técnico
                        </h3>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-hooke-900 block">Descrição para o Google (Alt Text)</label>
                            <input
                                type="text"
                                value={seoAltText}
                                onChange={(e) => setSeoAltText(e.target.value)}
                                className="w-full border border-gray-300 p-3 text-sm focus:outline-none focus:ring-1 focus:ring-hooke-900 transition-all rounded-none"
                                placeholder="Ex: Homem usando camiseta premium preta Hooke em ambiente urbano"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-hooke-900 block">Meta Description (Google)</label>
                            <textarea
                                value={metaDescription}
                                onChange={(e) => setMetaDescription(e.target.value)}
                                rows={2}
                                className="w-full border border-gray-300 p-3 text-sm focus:outline-none focus:ring-1 focus:ring-hooke-900 transition-all rounded-none resize-none"
                                placeholder="Resumo chamativo para o Google, até 160 caracteres."
                            />
                            <p className="text-[10px] text-gray-400 text-right">{metaDescription.length}/160</p>
                        </div>
                    </div>

                </div>

                {/* COLUNA DIREITA: DADOS */}
                <div className="lg:col-span-8 space-y-6">

                    <h3 className="text-sm font-black uppercase tracking-widest text-hooke-900 border-b border-gray-200 pb-2">
                        Informações do Produto
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-hooke-900 block">Nome do Produto *</label>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full border border-gray-300 p-3 text-sm focus:outline-none focus:border-hooke-900 transition-all rounded-none"
                                placeholder="Ex: Camiseta Oversized Preta"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-hooke-900 block">Preço (R$) *</label>
                            <input
                                type="number"
                                required
                                step="0.01"
                                value={price || ""}
                                onChange={(e) => setPrice(parseFloat(e.target.value))}
                                className="w-full border border-gray-300 p-3 text-sm focus:outline-none focus:border-hooke-900 transition-all rounded-none"
                                placeholder="Ex: 89.90"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-hooke-900 block">Categoria *</label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full border border-gray-300 p-3 text-sm focus:outline-none focus:border-hooke-900 transition-all rounded-none bg-white"
                        >
                            <option value="Oversized">Oversized</option>
                            <option value="Regatas">Regatas</option>
                            <option value="Vintage">Vintage</option>
                            <option value="Kits">Kits</option>
                            <option value="Lifestyle">Lifestyle</option>
                        </select>
                    </div>

                    <div className="space-y-2 bg-white flex flex-col pt-2 pb-6 z-10 relative">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-hooke-900 block">Descrição Rica (Estilo, Composição, Gramatura) *</label>
                        <div className="border border-gray-300 min-h-[200px] mb-8 relative pb-4">
                            <ReactQuill
                                theme="snow"
                                value={description}
                                onChange={setDescription}
                                className="h-[150px]"
                                modules={{
                                    toolbar: [
                                        ['bold', 'italic', 'underline'],
                                        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                        ['clean']
                                    ],
                                }}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-hooke-900 block mb-3">Tamanhos Disponíveis</label>
                        <div className="flex flex-wrap gap-2">
                            {AVAILABLE_SIZES.map(size => {
                                const isSelected = sizes.includes(size);
                                return (
                                    <button
                                        key={size}
                                        type="button"
                                        onClick={() => toggleSize(size)}
                                        className={`w-10 h-10 flex items-center justify-center font-bold text-sm transition-all border-2
                            ${isSelected ? 'bg-hooke-900 text-white border-hooke-900' : 'bg-transparent text-gray-400 border-gray-200 hover:border-gray-400'}
                          `}
                                    >
                                        {size}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="space-y-4 pt-6 border-t border-gray-200">
                        <div className="flex justify-between items-center">
                            <h3 className="text-sm font-black uppercase tracking-widest text-hooke-900">
                                Grade de Estoque
                            </h3>
                            {Object.keys(stock).length > 0 && (
                                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 font-bold">
                                    Total: {Object.values(stock).reduce((a, b) => a + (Number(b) || 0), 0)} itens
                                </span>
                            )}
                        </div>

                        {sizes.length === 0 ? (
                            <p className="text-xs text-red-500 font-bold bg-red-50 p-3 border border-red-200">
                                Selecione pelo menos 1 tamanho para definir o estoque.
                            </p>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 border border-gray-200 p-4">
                                {colors.length > 0 ? (
                                    // Com cores: Iterar Cores x Tamanhos
                                    colors.map(color => (
                                        sizes.map(size => {
                                            const comboKey = `${color.name}-${size}`;
                                            return (
                                                <div key={comboKey} className="flex justify-between items-center bg-white border border-gray-300 p-2">
                                                    <div className="flex items-center gap-2">
                                                        {color.imageUrl && (
                                                            <div className="w-6 h-6 relative border border-gray-200">
                                                                <Image src={color.imageUrl} alt={color.name} fill className="object-cover" />
                                                            </div>
                                                        )}
                                                        <span className="text-xs font-bold text-gray-700">
                                                            {color.name} / {size}
                                                        </span>
                                                    </div>
                                                    <input
                                                        type="number"
                                                        placeholder="Qtd"
                                                        value={stock[comboKey] || ""}
                                                        onChange={(e) => setStock({ ...stock, [comboKey]: parseInt(e.target.value) || 0 })}
                                                        min={0}
                                                        className="w-20 border border-gray-300 p-1 text-center text-sm focus:outline-none focus:border-hooke-900"
                                                    />
                                                </div>
                                            );
                                        })
                                    ))
                                ) : (
                                    // Sem cores: Iterar apenas Tamanhos
                                    sizes.map(size => (
                                        <div key={size} className="flex justify-between items-center bg-white border border-gray-300 p-2 lg:-col-span-1">
                                            <span className="text-xs font-bold text-gray-700">Tamanho {size}</span>
                                            <input
                                                type="number"
                                                placeholder="Qtd"
                                                value={stock[size] || ""}
                                                onChange={(e) => setStock({ ...stock, [size]: parseInt(e.target.value) || 0 })}
                                                min={0}
                                                className="w-20 border border-gray-300 p-1 text-center text-sm focus:outline-none focus:border-hooke-900"
                                            />
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-6 pt-4 border-t border-gray-200">
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="featuredCheckbox"
                                checked={featured}
                                onChange={(e) => setFeatured(e.target.checked)}
                                className="w-4 h-4 text-hooke-900 focus:ring-hooke-900"
                            />
                            <label htmlFor="featuredCheckbox" className="text-xs font-bold uppercase tracking-widest cursor-pointer">Destacar na Home</label>
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="activeCheckbox"
                                checked={isActive}
                                onChange={(e) => setIsActive(e.target.checked)}
                                className="w-4 h-4 text-hooke-900 focus:ring-hooke-900"
                            />
                            <label htmlFor="activeCheckbox" className="text-xs font-bold uppercase tracking-widest cursor-pointer">Ativo (Visível)</label>
                        </div>
                    </div>

                </div>

                {/* FOOTER ACTIONS */}
                <div className="lg:col-span-12 flex items-center justify-end gap-4 mt-6 border-t border-gray-200 pt-6">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-6 py-3 font-bold uppercase tracking-widest text-xs border border-hooke-900 text-hooke-900 hover:bg-gray-100 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="px-8 py-3 font-bold uppercase tracking-widest text-xs bg-hooke-900 text-white hover:bg-black transition-colors disabled:opacity-50"
                    >
                        {isSaving ? "Salvando..." : "Salvar Produto"}
                    </button>
                </div>

            </form>
        </div>
    );
}
