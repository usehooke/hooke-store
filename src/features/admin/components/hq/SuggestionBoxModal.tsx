"use client";
import React, { useState } from 'react';
import { X, Send } from 'lucide-react';

export function SuggestionBoxModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
    const [text, setText] = useState("");
    const [sent, setSent] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!text.trim()) return;
        setSent(true);
        setTimeout(() => {
            setText("");
            setSent(false);
            onClose();
        }, 3000);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm">
            <div className="bg-white max-w-sm w-full p-8 rounded-none shadow-2xl relative animate-in fade-in zoom-in duration-300">
                <button 
                  onClick={onClose} 
                  className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-none bg-stone-100 text-stone-500 hover:text-stone-800 hover:bg-stone-200 transition-colors"
                >
                    <X size={16} />
                </button>
                
                {sent ? (
                    <div className="text-center py-10 animate-in slide-in-from-bottom-4 flex flex-col items-center">
                        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-none flex items-center justify-center mb-6">
                            <Send size={24} />
                        </div>
                        <h3 className="font-heading font-bold text-2xl text-stone-800 mb-2">Ideia Recebida!</h3>
                        <p className="text-sm text-stone-500 font-medium">Nossos agentes receberam seu feedback na caixa de entrada e já estão analisando.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <h3 className="font-heading font-bold text-2xl mb-2 text-stone-800">Caixinha de Ideias</h3>
                        <p className="text-sm text-stone-500 mb-6 font-medium">Sugestões de produtos, feedbacks do site ou o que gostaria de ver na Hooke Store? A equipe vai ler!</p>
                        
                        <textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            className="w-full h-36 border-2 border-stone-100 bg-stone-50 rounded-none p-4 text-sm font-medium focus:outline-none focus:border-stone-800 focus:bg-white resize-none transition-all placeholder:text-stone-400 mb-6"
                            placeholder="Ex: Gostaria de ver mais tons pastéis na próxima coleção..."
                        />

                        <button 
                          type="submit" 
                          disabled={!text.trim()}
                          className="w-full bg-stone-900 text-white font-bold text-[11px] tracking-widest uppercase py-4 rounded-none hover:bg-stone-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            <Send size={14} /> Enviar para a Equipe
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
