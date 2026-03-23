"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbsProps {
 items: {
 label: string;
 href?: string;
 }[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
 return (
 <nav className="flex items-center gap-2 text-[10px] tracking-[0.2em] text-hooke-400 font-bold mb-8 animate-in fade-in slide-in-from-left-4 duration-700">
 <Link 
 href="/" 
 className="flex items-center gap-1 hover:text-hooke-900 transition-colors"
 aria-label="Home"
 >
 <Home size={10} className="mb-0.5" />
 <span>Home</span>
 </Link>
 
 {items.map((item, index) => (
 <div key={index} className="flex items-center gap-2">
 <ChevronRight size={10} className="text-hooke-200" />
 {item.href ? (
 <Link 
 href={item.href} 
 className="hover:text-hooke-900 transition-colors border-b border-transparent hover:border-hooke-900"
 >
 {item.label}
 </Link>
 ) : (
 <span className="text-hooke-900">{item.label}</span>
 )}
 </div>
 ))}
 </nav>
 );
}
