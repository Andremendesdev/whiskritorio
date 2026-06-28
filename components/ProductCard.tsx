"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { categoryLabelPlural } from "@/lib/categories";
import type { Product } from "@/types";

export type ProductPromo = {
  label: string;
  /** "popular" → verde (Mais pedido); "offer" → neon (Oferta). */
  tone: "popular" | "offer";
};

type ProductCardProps = {
  product: Product;
  index?: number;
  /** Selo promocional exibido no topo (substitui a categoria quando presente). */
  promo?: ProductPromo;
  /** Preço cheio "de" — exibe risco + percentual de desconto quando maior que o preço. */
  originalPrice?: number;
  /** Anima ao entrar na viewport (grade). Desligue em carrosséis. */
  animateInView?: boolean;
};

function formatBRL(value: number) {
  return `R$ ${value.toFixed(2).replace(".", ",")}`;
}

const PROMO_STYLES: Record<ProductPromo["tone"], { bg: string; color: string }> = {
  popular: { bg: "rgba(34,197,94,0.16)", color: "#4ade80" },
  offer: { bg: "rgb(var(--neon-rgb) / 0.16)", color: "var(--neon)" },
};

const EASE_OUT = [0.16, 1, 0.3, 1] as [number, number, number, number];

export function ProductCard({
  product,
  index = 0,
  promo,
  originalPrice,
  animateInView = true,
}: ProductCardProps) {
  const { addBurger } = useCart();
  const [added, setAdded] = useState(false);
  const [liked, setLiked] = useState(false);

  const hasDiscount = !!originalPrice && originalPrice > product.price;
  const discountPct = hasDiscount
    ? Math.round((1 - product.price / (originalPrice as number)) * 100)
    : 0;
  const imageSrc = product.imageUrl;

  const handleAdd = () => {
    addBurger({ id: product.id, name: product.name, price: product.price });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const motionProps = animateInView
    ? {
        initial: { opacity: 0, y: 16 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-40px" },
        transition: { duration: 0.7, ease: EASE_OUT, delay: index * 0.06 },
      }
    : {
        initial: { opacity: 0, y: 16 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, ease: EASE_OUT, delay: index * 0.05 },
      };

  return (
    <motion.article
      {...motionProps}
      className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-white/[0.07] transition-[border-color,box-shadow] duration-300 hover:border-yellow-400"
      style={{
        background: "var(--surface)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
      }}
      whileHover={{
        y: -4,
        boxShadow: "0 12px 40px rgba(0,0,0,0.6), 0 0 20px rgba(251,191,36,0.12)",
        transition: { duration: 0.3, ease: EASE_OUT },
      }}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-900">
        {imageSrc ? (
          <Image
            key={imageSrc}
            src={imageSrc}
            alt={product.name}
            fill
            unoptimized
            className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center bg-zinc-800 text-zinc-600">
            <span className="text-[10px] uppercase tracking-[0.2em]">Sem imagem</span>
          </div>
        )}

        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(8,8,9,0.85) 0%, rgba(8,8,9,0.1) 55%, transparent 100%)",
          }}
        />

        {promo ? (
          <div
            className="absolute left-2 top-2 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.1em]"
            style={{
              background: PROMO_STYLES[promo.tone].bg,
              color: PROMO_STYLES[promo.tone].color,
              backdropFilter: "blur(8px)",
            }}
          >
            {promo.label}
          </div>
        ) : (
          <div
            className="absolute left-2 top-2 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.1em]"
            style={{ background: "var(--neon)", color: "#000" }}
          >
            {categoryLabelPlural(product.category)}
          </div>
        )}

        <motion.button
          onClick={(e) => {
            e.stopPropagation();
            setLiked((v) => !v);
          }}
          whileTap={{ scale: 0.85 }}
          className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full transition-all duration-200"
          style={{
            background: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
          aria-label="Favoritar"
        >
          <svg
            className="h-3.5 w-3.5"
            viewBox="0 0 24 24"
            fill={liked ? "var(--neon)" : "none"}
            stroke={liked ? "var(--neon)" : "rgba(255,255,255,0.6)"}
            strokeWidth="2"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </motion.button>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-3 sm:p-4">
        <h3
          className="font-black uppercase leading-tight tracking-tight text-white"
          style={{ fontFamily: "var(--font-bebas)", fontSize: "clamp(1rem, 3.5vw, 1.3rem)" }}
        >
          {product.name}
        </h3>

        <p className="hidden flex-1 text-xs leading-relaxed text-zinc-500 line-clamp-2 sm:block">
          {product.description}
        </p>

        <div className="h-px bg-zinc-800" />

        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-col leading-none">
            <div className="flex items-center gap-2">
              <span
                className="font-black leading-none"
                style={{
                  fontFamily: "var(--font-bebas)",
                  fontSize: "clamp(1.1rem, 3vw, 1.4rem)",
                  color: "var(--neon)",
                  textShadow: "0 0 16px rgb(var(--neon-rgb) / 0.3)",
                }}
              >
                {formatBRL(product.price)}
              </span>
              {hasDiscount && (
                <span className="rounded-full bg-white/10 px-1.5 py-0.5 text-[9px] font-bold text-zinc-300">
                  -{discountPct}%
                </span>
              )}
            </div>
            {hasDiscount && (
              <span className="mt-1 text-[11px] text-zinc-600 line-through">
                {formatBRL(originalPrice as number)}
              </span>
            )}
          </div>

          <motion.button
            onClick={handleAdd}
            whileTap={{ scale: 0.93 }}
            className="flex shrink-0 items-center gap-1 rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.08em] transition-all duration-300 sm:px-4 sm:py-2 sm:text-[11px]"
            style={
              added
                ? { background: "#22c55e", color: "#fff", boxShadow: "0 0 20px rgba(34,197,94,0.4)" }
                : { background: "var(--neon)", color: "#000", boxShadow: "0 0 16px rgb(var(--neon-rgb) / 0.2)" }
            }
            animate={added ? { scale: [1, 1.08, 1] } : {}}
            transition={{ duration: 0.25 }}
          >
            {added ? (
              <>
                <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="hidden sm:inline">Adicionado</span>
              </>
            ) : (
              <>
                <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                </svg>
                <span className="hidden sm:inline">Adicionar</span>
              </>
            )}
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
}
