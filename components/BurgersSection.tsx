"use client";

import { useState, useRef, useMemo } from "react";
import Link from "next/link";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { ProductCard } from "@/components/ProductCard";
import { categoryLabelPlural } from "@/lib/categories";
import { saveHomeScroll } from "@/lib/intro-storage";
import type { Product } from "@/types";

type BurgersSectionProps = {
  products: Product[];
  mode?: "preview" | "full";
  limit?: number;
  sectionId?: string;
  compact?: boolean;
};

/* ─── section ────────────────────────────────────────────── */
export function BurgersSection({
  products,
  mode = "full",
  limit = 6,
  sectionId,
  compact = false,
}: BurgersSectionProps) {
  const isPreview = mode === "preview";
  const [activeCategory, setActiveCategory] = useState("todos");
  const headerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(headerRef, { once: true, margin: "-80px" });

  const catalogProducts = useMemo(
    () => (isPreview ? products.slice(0, limit) : products),
    [products, isPreview, limit]
  );

  /* categorias geradas dinamicamente a partir dos produtos do banco */
  const categories = useMemo(() => {
    const slugs = Array.from(new Set(products.map((p) => p.category)));
    return [
      { id: "todos", label: "Todos" },
      ...slugs.map((slug) => ({ id: slug, label: categoryLabelPlural(slug) })),
    ];
  }, [products]);

  const filtered = isPreview
    ? catalogProducts
    : activeCategory === "todos"
      ? products
      : products.filter((p) => p.category === activeCategory);

  const showViewAll = isPreview && products.length > limit;

  const categoryPills = !isPreview && (
    <div className="flex flex-wrap gap-2">
      {categories.map((cat) => {
        const isActive = activeCategory === cat.id;
        return (
          <motion.button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            whileTap={{ scale: 0.93 }}
            className="px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-[0.1em] transition-all duration-300"
            style={
              isActive
                ? {
                    background: "var(--neon)",
                    color: "#000",
                    boxShadow: "0 0 16px rgb(var(--neon-rgb) / 0.3)",
                  }
                : {
                    background: "rgba(255,255,255,0.05)",
                    color: "#71717a",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }
            }
          >
            {cat.label}
          </motion.button>
        );
      })}
    </div>
  );

  return (
    <section
      className={`relative w-full overflow-hidden ${
        compact
          ? "pt-4 pb-20 md:pt-6"
          : isPreview
            ? "pt-6 pb-12 md:pt-8 md:pb-16"
            : "pt-24 pb-12 md:pt-32 md:pb-16"
      }`}
      style={{ background: "var(--bg)" }}
      id={sectionId}
    >
      {/* subtle grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-50"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 0%, rgb(var(--neon-rgb) / 0.04) 0%, transparent 60%)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-12 lg:px-20">

        {/* ── header ───────────────────────────────────────── */}
        {compact ? (
          !isPreview && (
            <div ref={headerRef} className="mb-6">
              {categoryPills}
            </div>
          )
        ) : (
          <div ref={headerRef} className={isPreview ? "mb-6 md:mb-8" : "mb-12 md:mb-16"}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-3 mb-5"
            >
              <span
                className="block h-px w-10"
                style={{ background: "var(--neon)" }}
              />
              <span
                className="text-xs uppercase tracking-[0.3em] font-semibold"
                style={{ color: "var(--neon)" }}
              >
                Cardápio — Produtos
              </span>
            </motion.div>

            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              >
                <h2
                  className="uppercase leading-none text-white"
                  style={{
                    fontFamily: "var(--font-bebas)",
                    fontSize: "clamp(3rem, 8vw, 6rem)",
                    letterSpacing: "0.02em",
                  }}
                >
                  Produtos
                  <br />
                  <span
                    style={{
                      color: "var(--neon)",
                      textShadow: "0 0 30px rgb(var(--neon-rgb) / 0.4)",
                    }}
                  >
                    em Destaque
                  </span>
                </h2>
                <p className="mt-3 text-sm text-zinc-500 max-w-sm">
                  Variedade de itens para o seu dia a dia, com preços
                  justos e entrega rápida.
                </p>
              </motion.div>

              {!isPreview && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.22 }}
                >
                  {categoryPills}
                </motion.div>
              )}
            </div>
          </div>
        )}

        {/* ── grid ─────────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={isPreview ? "preview" : activeCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4"
          >
            {filtered.map((burger, i) => (
              <ProductCard
                key={burger.id}
                product={burger}
                index={i}
                originalPrice={burger.originalPrice ?? undefined}
              />
            ))}
          </motion.div>
        </AnimatePresence>

        {isPreview && products.length > limit && (
          <p className="mt-6 text-center text-xs uppercase tracking-[0.15em] text-zinc-600">
            Mostrando {Math.min(limit, products.length)} de {products.length} itens
          </p>
        )}

        {products.length === 0 && (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-16 text-center">
            <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">
              Cardápio em atualização. Volte em breve.
            </p>
          </div>
        )}

        {showViewAll && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mt-14 flex justify-center"
          >
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/cardapio"
                onClick={saveHomeScroll}
                className="flex items-center gap-3 px-8 py-4 rounded-full text-sm font-bold uppercase tracking-[0.12em] border text-zinc-400 transition-all duration-300 hover:border-yellow-500/50 hover:text-[var(--neon)]"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  backdropFilter: "blur(10px)",
                  borderColor: "rgba(255,255,255,0.1)",
                }}
              >
                Ver Cardápio Completo
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
