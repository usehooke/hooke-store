"use client";

import { useState, useEffect } from "react";
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

const AVAILABLE_SIZES = ["P", "M", "G", "GG", "XG", "G1", "G2"];

import { 
    generateSKU, 
    MODEL_DICTIONARY, 
    PRINT_DICTIONARY, 
    COLOR_DICTIONARY,
    ModelSigla,
    PrintSigla,
    ColorSigla
} from "@/utils/sku-generator";

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
    skus?: Record<string, string>;
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
    const [name, setName] = useState<string>(initialData?.name || "");
    const [category, setCategory] = useState<string>(initialData?.category || "Oversized");
    const [price, setPrice] = useState<number>(typeof initialData?.price === 'number' ? initialData.price : 0);
    const [comboPrice, setComboPrice] = useState<number>(typeof initialData?.comboPrice === 'number' ? initialData.comboPrice : 0);
    const [description, setDescription] = useState<string>(initialData?.description || "");
    const [featured, setFeatured] = useState(initialData?.featured || false);
    const [isActive, setIsActive] = useState(initialData?.isActive !== false);
    const [sizes, setSizes] = useState<string[]>(initialData?.sizes || ["P", "M", "G", "GG"]);

    // Dicionário Hooke 2026
    const [modelSigla, setModelSigla] = useState<ModelSigla>((initialData?.modelSigla as ModelSigla) || "TSH");
    const [printSigla, setPrintSigla] = useState<PrintSigla>((initialData?.printSigla as PrintSigla) || "HK1");
    const [weight, setWeight] = useState<number>(Number(initialData?.weight) || 300);

    // Estoque e SKUs
    const [stock, setStock] = useState<Record<string, number>>(initialData?.stock || {});
    const [skus, setSkus] = useState<Record<string, string>>(initialData?.skus || {});

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

    const updateSkus = (currentColors: { name: string }[], currentSizes: string[], currentModel: ModelSigla, currentPrint: PrintSigla) => {
        const newSkus = { ...skus };
        
        if (currentColors.length > 0) {
            currentColors.forEach(c => {
                // Tenta encontrar a sigla da cor no dicionário pelo nome
                const colorSiglaEntry = Object.entries(COLOR_DICTIONARY).find(([_code, info]) => info.label.toLowerCase() === c.name.toLowerCase());
                const colorSigla = colorSiglaEntry ? colorSiglaEntry[0] as ColorSigla : c.name.substring(0, 3).toUpperCase() as ColorSigla;

                currentSizes.forEach(s => {
                    const combo = `${c.name}-${s}`;
                    if (!newSkus[combo]) {
                        newSkus[combo] = generateSKU({
                            model: currentModel,
                            print: currentPrint,
                            color: colorSigla,
                            size: s
                        });
                    }
                });
            });
        } else {
            currentSizes.forEach(s => {
                if (!newSkus[s]) {
                    newSkus[s] = generateSKU({
                        model: currentModel,
                        print: currentPrint,
                        color: "UNI",
                        size: s
                    });
                }
            });
        }
        setSkus(newSkus);
    };

    useEffect(() => {
        const printInfo = (PRINT_DICTIONARY as Record<string, { label: string; weight?: number }>)[printSigla];
        if (printInfo?.weight) {
            setWeight(printInfo.weight);
        }
    }, [printSigla]);

    // Gera SKUs dinamicamente sempre que categoria, tamanho ou cor mudarem
    useEffect(() => {
        updateSkus(colors, sizes, modelSigla, printSigla);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [colors, sizes, modelSigla, printSigla]);

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
            comboPrice: Number(comboPrice),
            description,
            featured,
            isActive,
            sizes,
            images,
            imagem: images[0],
            seo: { metaDescription },
            colors,
            stock,
            skus,
            modelSigla,
            printSigla,
            weight
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
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-hooke-900 block">Preço Combo (3+) R$</label>
                            <input
                                type="number"
                                step="0.01"
                                value={comboPrice || ""}
                                onChange={(e) => setComboPrice(parseFloat(e.target.value))}
                                className="w-full border border-gray-300 p-3 text-sm focus:outline-none focus:border-hooke-900 transition-all rounded-none"
                                placeholder="Ex: 79.90"
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-hooke-900 block">Modelagem Hooke 2026 *</label>
                            <select
                                value={modelSigla}
                                onChange={(e) => setModelSigla(e.target.value as ModelSigla)}
                                className="w-full border border-gray-300 p-3 text-sm focus:outline-none focus:border-hooke-900 transition-all rounded-none bg-white"
                            >
                                {Object.entries(MODEL_DICTIONARY).map(([sigla, info]) => (
                                    <option key={sigla} value={sigla}>[{sigla}] {info.label}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-hooke-900 block">Estampa / Tecido Hooke 2026 *</label>
                            <select
                                value={printSigla}
                                onChange={(e) => setPrintSigla(e.target.value as PrintSigla)}
                                className="w-full border border-gray-300 p-3 text-sm focus:outline-none focus:border-hooke-900 transition-all rounded-none bg-white"
                            >
                                {Object.entries(PRINT_DICTIONARY).map(([sigla, info]) => (
                                    <option key={sigla} value={sigla}>[{sigla}] {info.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-hooke-900 block">Peso Estimado (g)</label>
                        <input
                            type="number"
                            value={weight}
                            onChange={(e) => setWeight(parseInt(e.target.value))}
                            className="w-full border border-gray-300 p-3 text-sm focus:outline-none focus:border-hooke-900 transition-all rounded-none"
                            placeholder="Ex: 300"
                        />
                        <p className="text-[9px] text-gray-400 mt-1 uppercase font-bold">O peso é ajustado automaticamente baseado no tecido, mas pode ser alterado manualmente.</p>
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
                                            ${isSelected ? 'bg-hooke-900 text-white border-hooke-900' : 'bg-transparent text-gray-300 border-gray-200 hover:border-hooke-400'}
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
                                Grade de Estoque e SKUs
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
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex flex-col">
                                                            <span className="text-[9px] uppercase tracking-wider text-gray-400 font-bold mb-1">SKU</span>
                                                            <input
                                                                type="text"
                                                                placeholder="SKU-AUTO"
                                                                value={skus[comboKey] || ""}
                                                                onChange={(e) => setSkus({ ...skus, [comboKey]: e.target.value.toUpperCase() })}
                                                                onFocus={() => {
                                                                    if (!skus[comboKey]) {
                                                                        const colorSiglaEntry = Object.entries(COLOR_DICTIONARY).find(([_code, info]) => info.label.toLowerCase() === color.name.toLowerCase());
                                                                        const colorSigla = colorSiglaEntry ? colorSiglaEntry[0] as ColorSigla : color.name.substring(0, 3).toUpperCase() as ColorSigla;
                                                                        
                                                                        setSkus({ ...skus, [comboKey]: generateSKU({
                                                                            model: modelSigla,
                                                                            print: printSigla,
                                                                            color: colorSigla,
                                                                            size: size
                                                                        }) });
                                                                    }
                                                                }}
                                                            />
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-[9px] uppercase tracking-wider text-gray-400 font-bold mb-1">QTD</span>
                                                            <input
                                                                type="number"
                                                                placeholder="Qtd"
                                                                value={stock[comboKey] || ""}
                                                                onChange={(e) => setStock({ ...stock, [comboKey]: parseInt(e.target.value) || 0 })}
                                                                min={0}
                                                                className="w-16 border border-gray-300 p-1 text-center text-xs focus:outline-none focus:border-hooke-900"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    ))
                                ) : (
                                    // Sem cores: Iterar apenas Tamanhos
                                    sizes.map(size => (
                                        <div key={size} className="flex justify-between items-center bg-white border border-gray-300 p-2 lg:-col-span-1">
                                            <span className="text-xs font-bold text-gray-700 w-24">Tamanho {size}</span>

                                            <div className="flex items-center gap-2">
                                                <div className="flex flex-col">
                                                    <span className="text-[9px] uppercase tracking-wider text-gray-400 font-bold mb-1">SKU</span>
                                                    <input
                                                        type="text"
                                                        placeholder="SKU-AUTO"
                                                        value={skus[size] || ""}
                                                        onChange={(e) => setSkus({ ...skus, [size]: e.target.value.toUpperCase() })}
                                                        onFocus={() => {
                                                            if (!skus[size]) {
                                                                setSkus({ ...skus, [size]: generateSKU({
                                                                    model: modelSigla,
                                                                    print: printSigla,
                                                                    color: "UNI",
                                                                    size: size
                                                                }) });
                                                            }
                                                        }}
                                                        className="w-28 border border-gray-300 p-1 text-center text-xs focus:outline-none focus:border-hooke-900 bg-gray-50 placeholder:text-gray-300"
                                                    />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[9px] uppercase tracking-wider text-gray-400 font-bold mb-1">QTD</span>
                                                    <input
                                                        type="number"
                                                        placeholder="Qtd"
                                                        value={stock[size] || ""}
                                                        onChange={(e) => setStock({ ...stock, [size]: parseInt(e.target.value) || 0 })}
                                                        min={0}
                                                        className="w-16 border border-gray-300 p-1 text-center text-xs focus:outline-none focus:border-hooke-900"
                                                    />
                                                </div>
                                            </div>
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
