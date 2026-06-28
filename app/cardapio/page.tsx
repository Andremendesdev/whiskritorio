import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { BurgersSection } from "@/components/BurgersSection";
import { getPublicProducts } from "@/server/get-public-products";
import type { Product } from "@/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Produtos — Whiskritório",
  description: "Catálogo completo de produtos da Whiskritório — Conveniência e Distribuidora.",
};

export default async function CardapioPage() {
  let products: Product[] = [];
  try {
    products = await getPublicProducts();
  } catch {
    products = [];
  }

  return (
    <main className="min-h-screen pt-20" style={{ background: "var(--bg)" }}>
      <div
        className="sticky top-16 z-20 border-b border-white/10 backdrop-blur-md"
        style={{ background: "rgba(2, 2, 3, 0.92)" }}
      >
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-6 py-3 md:gap-4 md:px-12 lg:px-20">
          <Link
            href="/"
            className="inline-flex shrink-0 items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-zinc-400 transition hover:border-yellow-500/40 hover:text-white"
            aria-label="Voltar para a página inicial"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Link>
          <h1
            className="min-w-0 flex-1 uppercase leading-none text-white"
            style={{
              fontFamily: "var(--font-bebas)",
              fontSize: "clamp(1.75rem, 4vw, 2.25rem)",
              letterSpacing: "0.02em",
            }}
          >
            Cardápios e Burgers
          </h1>
        </div>
      </div>

      <BurgersSection products={products} mode="full" compact />
    </main>
  );
}
