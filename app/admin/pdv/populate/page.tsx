"use client";

import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, doc, setDoc } from "firebase/firestore";
import { MODEL_DICTIONARY, PRINT_DICTIONARY, COLOR_DICTIONARY } from "@/utils/sku-generator";
import { Database, CheckCircle, AlertTriangle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function PopulateDictionaryPage() {
  const [isPopulating, setIsPopulating] = useState(false);
  const [results, setResults] = useState<{ type: string; count: number }[]>([]);

  const handlePopulate = async () => {
    setIsPopulating(true);
    setResults([]);
    
    try {
      // 1. Modelagens
      let modelCount = 0;
      for (const [sigla, info] of Object.entries(MODEL_DICTIONARY)) {
        await setDoc(doc(db, "modelagens", sigla), {
          ...info,
          sigla,
          updatedAt: new Date().toISOString()
        });
        modelCount++;
      }

      // 2. Estampas/Tecidos
      let printCount = 0;
      for (const [sigla, info] of Object.entries(PRINT_DICTIONARY)) {
        await setDoc(doc(db, "estampas_tecidos", sigla), {
          ...info,
          sigla,
          updatedAt: new Date().toISOString()
        });
        printCount++;
      }

      // 3. Cores
      let colorCount = 0;
      for (const [sigla, info] of Object.entries(COLOR_DICTIONARY)) {
        await setDoc(doc(db, "cores", sigla), {
          ...info,
          sigla,
          updatedAt: new Date().toISOString()
        });
        colorCount++;
      }

      setResults([
        { type: "Modelagens", count: modelCount },
        { type: "Estampas/Tecidos", count: printCount },
        { type: "Cores", count: colorCount },
      ]);
      
      toast.success("Banco de dados populado com sucesso!");
    } catch (error) {
      console.error("Erro ao popular banco:", error);
      toast.error("Erro ao popular banco de dados.");
    } finally {
      setIsPopulating(false);
    }
  };

  return (
    <div className="min-h-screen bg-hooke-50 p-8 font-sans">
      <div className="max-w-2xl mx-auto space-y-8">
        <header className="flex items-center gap-4">
          <Link href="/admin/pdv" className="p-3 shadow-neumorph rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-black uppercase tracking-tighter">Carga de Dicionário 2026</h1>
        </header>

        <div className="bg-hooke-50 p-8 shadow-neumorph space-y-6">
          <div className="flex items-center gap-4 text-yellow-600 bg-yellow-50 p-4 border border-yellow-200">
            <AlertTriangle className="h-6 w-6 shrink-0" />
            <p className="text-xs font-bold uppercase">
              Esta ação irá sobrescrever os dados existentes nas coleções <code className="bg-white px-1">modelagens</code>, <code className="bg-white px-1">estampas_tecidos</code> e <code className="bg-white px-1">cores</code>.
            </p>
          </div>

          <p className="text-sm text-gray-600">
            Clique no botão abaixo para carregar as <strong>8 modelagens</strong>, <strong>6 estampas/tecidos</strong> e <strong>15 cores</strong> oficiais da Hooke 2026 para o Firestore.
          </p>

          <button
            onClick={handlePopulate}
            disabled={isPopulating}
            className={`w-full p-6 font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-neumorph transition-all active:shadow-neumorph-inset ${
              isPopulating ? "opacity-50 cursor-not-allowed" : "bg-hooke-900 text-white hover:bg-black"
            }`}
          >
            {isPopulating ? (
              <>Carregando dados...</>
            ) : (
              <>
                <Database className="h-5 w-5" />
                Iniciar Carga de Dados
              </>
            )}
          </button>

          {results.length > 0 && (
            <div className="space-y-3 pt-6 border-t border-gray-200">
              <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Resultado da Carga:
              </h3>
              <div className="grid grid-cols-1 gap-2">
                {results.map((res) => (
                  <div key={res.type} className="flex justify-between p-3 bg-white border border-gray-100 shadow-sm text-xs font-bold">
                    <span>{res.type}</span>
                    <span className="text-hooke-900">{res.count} registros</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
