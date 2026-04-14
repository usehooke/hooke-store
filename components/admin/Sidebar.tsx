'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
    LayoutDashboard, 
    Package, 
    ShoppingBag, 
    CupSoda, 
    Monitor, 
    Settings, 
    LogOut,
    Menu,
    X,
    Orbit,
    Zap
} from 'lucide-react';
import { auth } from '@/lib/firebase';
import { signOut, User } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

const menuItems = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Catálogo', href: '/admin/produtos', icon: Package },
    { label: 'Pedidos', href: '/admin/pedidos', icon: ShoppingBag },
    { label: 'Concierge', href: '/admin/concierge', icon: CupSoda },
    { label: 'PDV Elite', href: '/admin/pdv', icon: Monitor },
    { label: 'Ops Desk', href: '/admin/office', icon: Orbit },
];

export default function Sidebar({ user }: { user: User }) {
    const pathname = usePathname();
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
                "bg-[#080808] border-r border-white/[0.05] h-full transition-all duration-500 ease-in-out flex flex-col z-[50] relative",
                isCollapsed ? "w-24" : "w-80"
            )}
        >
            {/* Logo Section / Branding */}
            <div className="p-8 border-b border-white/[0.05] flex items-center justify-between">
                {!isCollapsed && (
                    <div className="flex flex-col">
                        <span className="text-xl font-serif italic tracking-tighter text-[#FAFAFA]">Hooke Elite</span>
                        <span className="text-[7px] font-black uppercase tracking-[0.4em] text-zinc-600 mt-1">Admin OS v2.0</span>
                    </div>
                )}
                <button 
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="p-3 hover:bg-white/5 transition-colors text-zinc-500 hover:text-white"
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
                            className={cn(
                                "flex items-center gap-4 px-5 py-5 transition-all group relative overflow-hidden",
                                isActive 
                                    ? "text-[#FAFAFA] bg-white/[0.03] border border-white/[0.05]" 
                                    : "text-zinc-500 hover:text-white hover:bg-white/[0.01]"
                            )}
                        >
                            <item.icon size={18} strokeWidth={isActive ? 2 : 1.5} className={cn("transition-colors", isActive ? "text-white" : "group-hover:text-white")} />
                            {!isCollapsed && (
                                <span className="text-[10px] font-black tracking-[0.25em] uppercase italic transition-all">{item.label}</span>
                            )}
                            
                            {isActive && (
                                <div className="absolute left-0 w-1 h-6 bg-white animate-pulse" />
                            )}

                            {/* Hover Subpixel Glow */}
                            <div className="absolute inset-0 bg-gradient-to-r from-white/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                        </Link>
                    );
                })}
            </nav>

            {/* Safety & User Profile */}
            <div className="p-8 border-t border-white/[0.05] space-y-6 bg-black/20 backdrop-blur-md">
                {!isCollapsed && (
                    <div className="space-y-2 px-1">
                        <div className="flex items-center gap-2">
                             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                             <p className="text-[8px] uppercase tracking-[0.3em] text-zinc-500 font-black">Sessão Segura</p>
                        </div>
                        <p className="text-[11px] text-[#FAFAFA] truncate font-mono opacity-80">{user.email}</p>
                    </div>
                )}
                <div className="flex flex-col gap-2">
                    <button 
                        onClick={handleLogout}
                        className="flex items-center gap-4 w-full p-4 text-zinc-600 hover:text-red-500 hover:bg-red-500/5 transition-all text-[9px] font-black tracking-[0.3em] uppercase group"
                    >
                        <LogOut size={16} strokeWidth={1.5} className="group-hover:-translate-x-1 transition-transform" />
                        {!isCollapsed && <span>Encerrar OPS</span>}
                    </button>
                    
                    {!isCollapsed && (
                        <div className="flex justify-between items-center pt-2 px-2">
                             <Link href="/admin/config" className="text-zinc-700 hover:text-white transition-colors">
                                <Settings size={14} />
                             </Link>
                             <div className="flex gap-2 opacity-20">
                                 <Zap size={10} className="fill-white text-white" />
                                 <Orbit size={10} className="text-white" />
                             </div>
                        </div>
                    )}
                </div>
            </div>
        </aside>
    );
}
