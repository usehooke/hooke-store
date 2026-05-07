"use client";

import { useCartStore } from "@/store/cart-store";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useEffect, useState } from 'react';
import { CartSheet } from '@/features/checkout';

export default function DynamicCart() {
  const [mounted, setMounted] = useState(false);
  const isOpen = useCartStore((state) => state.isOpen);
  const closeCart = useCartStore((state) => state.closeCart);

  useEffect(() => {
    // ⚡ HIDRATAÇÃO MANUAL (Requisito Next 15 + Zustand skipHydration)
    useCartStore.persist.rehydrate();
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
      <SheetContent className="w-full sm:max-w-md p-0 flex flex-col rounded-none border-l-2 border-hooke-900 bg-white">
        <CartSheet />
      </SheetContent>
    </Sheet>
  );
}
