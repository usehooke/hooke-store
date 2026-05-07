import { OfficeMap } from "@/features/admin/components/hq/OfficeMap";
import Link from "next/link";

export const metadata = {
  title: "HQ Virtual | Hooke",
  description: "Conheça o QG Virtual da Hooke, onde tudo acontece!",
};

export default function HQPage() {
  return (
    <div className="min-h-screen bg-stone-50 overflow-hidden relative flex flex-col selection:bg-stone-200">
      <header className="absolute top-0 w-full p-6 flex justify-between items-center z-10 pointer-events-none">
         <div>
            <h1 className="text-xl font-heading font-bold text-stone-800 uppercase tracking-widest">Hooke HQ</h1>
            <p className="text-xs text-stone-500 font-medium tracking-wide">Virtual Office & AI Operations</p>
         </div>
         <Link href="/" className="pointer-events-auto text-[10px] font-bold uppercase tracking-widest text-stone-600 hover:text-stone-900 transition-colors border-b border-transparent hover:border-stone-900 pb-1">
            Voltar à loja
         </Link>
      </header>

      <main className="flex-1 w-full h-full relative z-0">
         <OfficeMap />
      </main>
    </div>
  );
}
