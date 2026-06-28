"use client";

import { useRef, useState, useMemo, useCallback } from "react";
import { motion, useInView } from "framer-motion";
import { ProductCard, type ProductPromo } from "@/components/ProductCard";
import type { Product } from "@/types";

type FeaturedCarouselProps = {
  products: Product[];
  /** Quantidade máxima de itens no carrossel. */
  limit?: number;
};

/** Selo de destaque definido por posição (display-only). */
function promoFor(index: number): ProductPromo | undefined {
  if (index % 5 === 0) return { label: "Oferta", tone: "offer" };
  if (index % 5 === 1 || index % 5 === 3) return { label: "Mais pedido", tone: "popular" };
  return undefined;
}

export function FeaturedCarousel({ products, limit = 10 }: FeaturedCarouselProps) {
  const featured = useMemo(() => products.slice(0, limit), [products, limit]);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(headerRef, { once: true, margin: "-80px" });
  const [active, setActive] = useState(0);

  const handleScroll = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const first = el.firstElementChild as HTMLElement | null;
    const step = first ? first.offsetWidth + 12 : el.clientWidth;
    setActive(Math.round(el.scrollLeft / step));
  }, []);

  const scrollByDir = useCallback((dir: -1 | 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const first = el.firstElementChild as HTMLElement | null;
    const step = first ? first.offsetWidth + 12 : el.clientWidth;
    el.scrollBy({ left: dir * step * 2, behavior: "smooth" });
  }, []);

  const scrollToIndex = useCallback((index: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    const first = el.firstElementChild as HTMLElement | null;
    const step = first ? first.offsetWidth + 12 : el.clientWidth;
    el.scrollTo({ left: index * step, behavior: "smooth" });
  }, []);

  if (featured.length === 0) return null;

  return (
    <section
      className="relative w-full overflow-hidden pt-16 pb-8 md:pt-24 md:pb-10"
      style={{ background: "var(--bg)" }}
      id="destaques"
    >
      <div
        className="absolute inset-0 pointer-events-none opacity-50"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 0%, rgb(var(--neon-rgb) / 0.04) 0%, transparent 60%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 md:px-12 lg:px-20">
        {/* header */}
        <div ref={headerRef} className="mb-6 flex items-end justify-between gap-6 md:mb-8">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="mb-4 flex items-center gap-3"
            >
              <span className="block h-px w-10" style={{ background: "var(--neon)" }} />
              <span
                className="text-xs font-semibold uppercase tracking-[0.3em]"
                style={{ color: "var(--neon)" }}
              >
                Os queridinhos
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              className="uppercase leading-none text-white"
              style={{
                fontFamily: "var(--font-bebas)",
                fontSize: "clamp(2.5rem, 7vw, 5rem)",
                letterSpacing: "0.02em",
              }}
            >
              Mais{" "}
              <span
                style={{
                  color: "var(--neon)",
                  textShadow: "0 0 30px rgb(var(--neon-rgb) / 0.4)",
                }}
              >
                Vendidos
              </span>
            </motion.h2>
          </div>

          {/* arrows — desktop */}
          <div className="hidden shrink-0 gap-2 md:flex">
            {([-1, 1] as const).map((dir) => (
              <button
                key={dir}
                onClick={() => scrollByDir(dir)}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-zinc-400 transition-all duration-300 hover:border-yellow-500/50 hover:text-[var(--neon)]"
                aria-label={dir === -1 ? "Anterior" : "Próximo"}
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  {dir === -1 ? (
                    <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                  ) : (
                    <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                  )}
                </svg>
              </button>
            ))}
          </div>
        </div>

        {/* scroller */}
        <div
          ref={scrollerRef}
          onScroll={handleScroll}
          className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {featured.map((product, i) => (
            <div
              key={product.id}
              className="w-[46vw] shrink-0 snap-start sm:w-[15rem] md:w-[17rem]"
            >
              <ProductCard
                product={product}
                index={i}
                promo={promoFor(i)}
                originalPrice={product.originalPrice ?? undefined}
                animateInView={false}
              />
            </div>
          ))}
        </div>

        {/* dots */}
        <div className="mt-4 flex justify-center gap-2">
          {featured.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollToIndex(i)}
              aria-label={`Ir para o item ${i + 1}`}
              className="h-2 rounded-full transition-all duration-300"
              style={{
                width: i === active ? "1.5rem" : "0.5rem",
                background: i === active ? "var(--neon)" : "rgba(255,255,255,0.18)",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
