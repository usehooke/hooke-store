'use client';

import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";
import ProductCard from "./ProductCard";
import { motion } from "framer-motion";

export default function RecentlyViewed() {
  const { items } = useRecentlyViewed();

  if (items.length === 0) return null;

  return (
    <section className="py-24 px-6 md:px-12 border-t border-gray-100 bg-white overflow-hidden">
      <div className="mb-12">
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-hooke-500 mb-2 block">
          Não deixe para depois
        </span>
        <h2 className="text-2xl md:text-3xl font-black text-hooke-900 uppercase tracking-tighter">
          Vistos Recentemente
        </h2>
      </div>

      <div className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory scrollbar-hide">
        {items.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="min-w-[280px] md:min-w-[320px] snap-center"
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
