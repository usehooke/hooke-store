"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import AdminProductForm from "./AdminProductForm";
import { Product } from "@/types";

interface AdminProductDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onSubmit: (data: any) => void;
  isSaving: boolean;
}

export function AdminProductDrawer({ isOpen, onClose, product, onSubmit, isSaving }: AdminProductDrawerProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay fundo escuro */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
          />

          {/* Sidebar Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full md:w-[60%] lg:w-[50%] xl:w-[45%] bg-white shadow-2xl z-[101] overflow-y-auto"
          >
            <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex items-center justify-between z-10">
              <div>
                <h2 className="text-xl font-black tracking-tighter text-hooke-900">
                  {product ? "Editar Produto" : "Novo Produto Elite"}
                </h2>
                <p className="text-[10px] font-bold tracking-widest text-gray-400 mt-1 uppercase">
                  Hooke Office: Detalhes Individuais
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-0">
              <AdminProductForm
                initialData={product ? (product as any) : null}
                onSubmit={onSubmit}
                onCancel={onClose}
                isSaving={isSaving}
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
