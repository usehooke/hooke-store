'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
    LayoutDashboard, 
    Package, 
    ShoppingBag, 
    CupSoda, 
    Settings, 
    LogOut,
    Menu,
    X,
    Orbit,
    Zap,
    TrendingUp,
    Tag,
    Rocket,
    PackagePlus,
    Store,
    Star,
    Camera
} from 'lucide-react';
import { auth } from '@/lib/firebase';
import { signOut, User } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

const menuItems = [
    { label: 'Voltar ao Site', href: '/', icon: Store },
    { label: 'PDV Elite', href: '/admin/pdv', icon: Zap },
    { label: 'Catálogo', href: '/admin/produtos', icon: Package },
    { label: 'Pedidos', href: '/admin/pedidos', icon: ShoppingBag },
    { label: 'Etiquetas', href: '/admin/etiquetas', icon: Tag },
    { label: 'Avaliações', href: '/admin/reviews', icon: Star },
    { label: 'Gerador IA', href: '/admin/gerador', icon: Camera },
];

export function Sidebar({ user }: { user: User }) {
    const pathname = usePathname() || "";
    const router = useRouter();
    const [isCollapsed, setIsCollapsed] = React.useState(false);

    const handleLogout = async () => {
        if (auth) {
            await signOut(auth);
            router.push('/login');
        }
    };

    return (
        <aside 
            className={cn(
                "bg-white border-r border-black/[0.05] h-full transition-all duration-500 ease-in-out flex flex-col z-[50] relative",
                isCollapsed ? "w-24" : "w-80"
            )}
        >
            {/* Logo Section / Branding */}
            <div className="p-8 border-b border-black/[0.05] flex items-center justify-between">
                {!isCollapsed && (
                    <div className="flex flex-col">
                        <span className="text-xl font-serif italic tracking-tighter text-zinc-900">Hooke Atelier</span>
                        <span className="text-[7px] font-black uppercase tracking-[0.4em] text-zinc-400 mt-1">Command Center v3.0</span>
                    </div>
                )}
                <button 
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="p-3 hover:bg-black/[0.02] transition-colors text-zinc-400 hover:text-black"
                >
                    {isCollapsed ? <Menu size={18} /> : <X size={18} />}
                </button>
            </div>

            {/* Navigation Section */}
            <nav className="flex-1 p-6 space-y-2 mt-4 custom-scrollbar overflow-y-auto">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link 
                            key={item.href} 
                            href={item.href}
                            prefetch={false}
                            className={cn(
                                "flex items-center gap-4 px-5 py-5 transition-all group relative overflow-hidden",
                                isActive 
                                    ? "text-white bg-hooke-900 border border-black/[0.05]" 
                                    : "text-zinc-500 hover:text-white hover:bg-hooke-900"
                            )}
                        >
                            <item.icon size={18} strokeWidth={isActive ? 2 : 1.5} className={cn("transition-colors", isActive ? "text-white" : "group-hover:text-white")} />
                            {!isCollapsed && (
                                <span className="text-[10px] font-black tracking-[0.25em] uppercase italic transition-all">{item.label}</span>
                            )}
                            
                            {isActive && (
                                <div className="absolute left-0 top-0 w-1 h-full bg-white" />
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Safety & User Profile */}
            <div className="p-8 border-t border-black/[0.05] space-y-6 bg-gray-50/50">
                {!isCollapsed && (
                    <div className="space-y-1 px-1">
                        <div className="flex items-center gap-2">
                             <div className="w-1.5 h-1.5 rounded-none bg-emerald-500" />
                             <p className="text-[8px] uppercase tracking-[0.3em] text-zinc-400 font-black">Online • Seguro</p>
                        </div>
                        <p className="text-[11px] text-zinc-900 truncate font-mono font-medium">{user.email}</p>
                    </div>
                )}
                <div className="flex flex-col gap-2">
                    <button 
                        onClick={handleLogout}
                        className="flex items-center gap-4 w-full p-4 text-zinc-400 hover:text-red-500 hover:bg-red-500/5 transition-all text-[9px] font-black tracking-[0.3em] uppercase group"
                    >
                        <LogOut size={16} strokeWidth={1.5} className="group-hover:-translate-x-1 transition-transform" />
                        {!isCollapsed && <span>Sair do Sistema</span>}
                    </button>
                    
                    {!isCollapsed && (
                        <div className="flex justify-between items-center pt-2 px-2">
                             <Link href="/admin/config" prefetch={false} className="text-zinc-300 hover:text-black transition-colors">
                                <Settings size={14} />
                             </Link>
                             <div className="flex gap-2 opacity-10">
                                 <Zap size={10} className="fill-black text-black" />
                                 <Orbit size={10} className="text-black" />
                             </div>
                        </div>
                    )}
                </div>
            </div>
        </aside>
    );
}
