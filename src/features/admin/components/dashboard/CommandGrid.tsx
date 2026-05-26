"use client";

import React from 'react';
import Link from 'next/link';
import { Store, ShoppingCart, Tag, Globe, BarChart3, Settings, Wand2 } from "lucide-react";
import { Button } from "@/components/ui";

const commands = [
  { label: "Cadastro Mágico", href: "/admin/produtos/novo", icon: Wand2, color: "bg-black" },
  { label: "PDV Rápido", href: "/admin/pdv", icon: Store, color: "bg-zinc-900" },
  { label: "Catálogo", href: "/admin/produtos", icon: ShoppingCart, color: "bg-zinc-800" },
  { label: "Etiquetas", href: "/admin/pdv/etiquetas", icon: Tag, color: "bg-zinc-700" },
  { label: "Config", href: "/admin/config", icon: Settings, color: "bg-zinc-500" },
];

export function CommandGrid() {
  return (
    <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {commands.map((cmd) => (
        <Link key={cmd.href} href={cmd.href} className="w-full">
          <Button
            variant="brutalist"
            className={`w-full h-32 flex flex-col items-center justify-center gap-3 transition-transform active:scale-95 group border-2 border-black`}
          >
            <cmd.icon size={24} strokeWidth={1.5} className="group-hover:scale-110 transition-transform" />
            <span className="text-[9px] font-black uppercase tracking-[0.2em]">{cmd.label}</span>
          </Button>
        </Link>
      ))}
    </section>
  );
}
