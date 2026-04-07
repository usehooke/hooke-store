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
    Orbit
} from 'lucide-react';
import { auth } from '@/lib/firebase';
import { signOut, User } from 'firebase/auth';
import { useRouter } from 'next/navigation';

const menuItems = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Catálogo', href: '/admin/produtos', icon: Package },
    { label: 'Pedidos', href: '/admin/pedidos', icon: ShoppingBag },
    { label: 'Concierge', href: '/admin/concierge', icon: CupSoda },
    { label: 'PDV', href: '/admin/pdv', icon: Monitor },
    { label: 'Time de Agentes', href: '/admin/office', icon: Orbit },
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
            className={`bg-[#0D0D0D] border-r border-[rgba(255,255,255,0.05)] h-full transition-all duration-300 flex flex-col z-[50] ${isCollapsed ? 'w-20' : 'w-72'}`}
        >
            {/* Logo Section */}
            <div className="p-6 border-b border-[rgba(255,255,255,0.05)] flex items-center justify-between">
                {!isCollapsed && (
                    <span className="text-xl font-serif italic tracking-tighter text-[#FAFAFA]">Hooke Admin</span>
                )}
                <button 
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="p-2 hover:bg-white/5 rounded-none text-[#FAFAFA]"
                >
                    {isCollapsed ? <Menu size={20} /> : <X size={20} />}
                </button>
            </div>

            {/* Navigation Section */}
            <nav className="flex-1 p-4 space-y-2 mt-4">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link 
                            key={item.href} 
                            href={item.href}
                            className={`flex items-center gap-4 px-4 py-4 transition-all group relative ${
                                isActive 
                                ? 'text-[#FAFAFA] bg-white/5' 
                                : 'text-zinc-500 hover:text-[#FAFAFA] hover:bg-white/[0.02]'
                            }`}
                        >
                            <item.icon size={20} strokeWidth={1.5} className={isActive ? 'text-[#FAFAFA]' : 'group-hover:text-[#FAFAFA]'} />
                            {!isCollapsed && (
                                <span className="text-[11px] font-bold tracking-[0.2em] uppercase">{item.label}</span>
                            )}
                            {isActive && (
                                <div className="absolute left-0 w-1 h-8 bg-[#FAFAFA]" />
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* User Profile & Footer Section */}
            <div className="p-6 border-t border-[rgba(255,255,255,0.05)] space-y-4 bg-black/20">
                {!isCollapsed && (
                    <div className="space-y-1">
                        <p className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold">Autenticado como</p>
                        <p className="text-[11px] text-[#FAFAFA] truncate font-medium">{user.email}</p>
                    </div>
                )}
                <div className="flex items-center gap-2">
                    <button 
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full p-3 text-red-400 hover:bg-red-500/10 transition-colors text-[10px] font-bold tracking-widest uppercase"
                    >
                        <LogOut size={18} strokeWidth={1.5} />
                        {!isCollapsed && <span>Sair</span>}
                    </button>
                    {!isCollapsed && (
                        <Link href="/admin/config" className="p-3 text-zinc-500 hover:text-white transition-colors">
                            <Settings size={18} strokeWidth={1.5} />
                        </Link>
                    )}
                </div>
            </div>
        </aside>
    );
}
