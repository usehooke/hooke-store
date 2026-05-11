"use client";

import React, { useEffect, useState } from 'react';
import { Command } from 'cmdk';
import { useRouter } from 'next/navigation';
import { LayoutDashboard, PackagePlus, ShoppingBag, LogOut, Search } from 'lucide-react';

/**
 * Hooke HQ: Global Command Palette (CMDK)
 * O motor de inteligência e navegação rápida do Admin.
 */
export function GlobalCommand() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  // Atalhos de teclado e eventos customizados
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    const handleOpen = () => setOpen(true);

    document.addEventListener('keydown', down);
    window.addEventListener('open-command-palette', handleOpen);
    
    return () => {
      document.removeEventListener('keydown', down);
      window.removeEventListener('open-command-palette', handleOpen);
    };
  }, []);

  const navigate = (href: string) => {
    router.push(href);
    setOpen(false);
  };

  return (
    <Command.Dialog 
      open={open} 
      onOpenChange={setOpen} 
      label="Global Command Palette"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12 bg-black/50 backdrop-blur-sm"
    >
      <div className="w-full max-w-2xl bg-white border-2 border-black shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] overflow-hidden flex flex-col">
        <div className="flex items-center px-6 py-4 border-b-2 border-black gap-4">
          <Search size={20} className="text-zinc-400" />
          <Command.Input 
            placeholder="O que você precisa, comandante?" 
            className="flex-1 bg-transparent border-none outline-none text-sm font-bold uppercase tracking-widest placeholder:text-zinc-200"
          />
          <kbd className="text-[10px] font-black opacity-20">ESC</kbd>
        </div>

        <Command.List className="p-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
          <Command.Empty className="py-8 text-center text-[10px] font-black uppercase tracking-[0.3em] text-zinc-300">
            Nenhum protocolo encontrado.
          </Command.Empty>

          <Command.Group heading="Aceleração" className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-300 mb-4 ml-2">
            <Item icon={LayoutDashboard} onSelect={() => navigate('/admin')}>Radar (Dashboard)</Item>
            <Item icon={PackagePlus} onSelect={() => navigate('/admin/produtos/novo')}>Estúdio (Novo Produto)</Item>
            <Item icon={ShoppingBag} onSelect={() => navigate('/admin/produtos')}>Balcão (Inventário)</Item>
          </Command.Group>

          <Command.Group heading="Sistema" className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-300 mb-4 ml-2 mt-8">
            <Item icon={LogOut} onSelect={() => router.push('/login')}>Sair do HQ</Item>
          </Command.Group>
        </Command.List>

        <div className="bg-zinc-50 px-6 py-3 border-t-2 border-black flex justify-between items-center">
          <span className="text-[8px] font-black uppercase tracking-[0.5em] opacity-20">Hooke HQ Engine v15.0</span>
          <div className="flex gap-4 opacity-30">
             <span className="text-[8px] font-black uppercase tracking-widest">↑↓ Navegar</span>
             <span className="text-[8px] font-black uppercase tracking-widest">ENTER Selecionar</span>
          </div>
        </div>
      </div>
    </Command.Dialog>
  );
}

function Item({ children, icon: Icon, onSelect }: { children: React.ReactNode, icon: any, onSelect: () => void }) {
  return (
    <Command.Item
      onSelect={onSelect}
      className="flex items-center gap-4 px-4 py-6 cursor-pointer aria-selected:bg-black aria-selected:text-white transition-colors border border-transparent aria-selected:border-black group"
    >
      <Icon size={18} className="group-aria-selected:scale-110 transition-transform" />
      <span className="text-xs font-black uppercase tracking-widest">{children}</span>
    </Command.Item>
  );
}
