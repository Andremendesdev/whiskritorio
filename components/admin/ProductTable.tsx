"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Image from "next/image";
import { Edit3, Trash2, Search, ChevronLeft, ChevronRight } from "lucide-react";
import type { Product } from "@/types";
import { ProductTableSkeleton } from "@/components/admin/AdminSkeleton";
import { ADMIN_CATEGORY_FILTERS, categoryLabel } from "@/lib/categories";

const PAGE_SIZE = 5;

interface ProductTableProps {
  products: Product[];
  loading?: boolean;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

function formatPrice(price: number) {
  return price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function ProductThumb({ product }: { product: Product }) {
  return (
    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-zinc-900">
      {product.imageUrl ? (
        <Image src={product.imageUrl} alt={product.name} fill sizes="48px" className="object-cover" />
      ) : (
        <div className="h-full w-full bg-zinc-800" />
      )}
    </div>
  );
}

function ProductActions({
  product,
  onEdit,
  onDelete,
}: {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="flex shrink-0 gap-2">
      <button
        type="button"
        onClick={() => onEdit(product)}
        className="rounded-xl border border-white/10 p-2 text-zinc-400 transition hover:border-yellow-500/40 hover:bg-yellow-500/5 hover:text-white"
        aria-label={`Editar ${product.name}`}
      >
        <Edit3 className="h-3.5 w-3.5" />
      </button>
      <button
        type="button"
        onClick={() => onDelete(product.id)}
        className="rounded-xl border border-white/10 p-2 text-zinc-400 transition hover:border-red-500/40 hover:bg-red-500/5 hover:text-red-200"
        aria-label={`Deletar ${product.name}`}
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

function ProductRowCard({
  product,
  onEdit,
  onDelete,
}: {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <article className="rounded-2xl border border-white/10 bg-black/25 p-4 transition hover:bg-white/[0.02] lg:hidden">
      <div className="flex items-start gap-3">
        <ProductThumb product={product} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold text-white">{product.name}</h3>
            {!product.active && (
              <span className="shrink-0 rounded-full bg-zinc-800 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                Inativo
              </span>
            )}
          </div>
          <p className="mt-1 line-clamp-2 text-xs text-zinc-500">{product.description}</p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-white/10 pt-3">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-zinc-300">
            {categoryLabel(product.category)}
          </span>
          <span className="text-sm font-bold text-[var(--neon)]">{formatPrice(product.price)}</span>
        </div>
        <ProductActions product={product} onEdit={onEdit} onDelete={onDelete} />
      </div>
    </article>
  );
}

function ProductTableRow({
  product,
  onEdit,
  onDelete,
}: {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <article className="hidden grid-cols-[minmax(0,1.6fr)_0.8fr_0.7fr_auto] items-center gap-4 px-4 py-3 transition hover:bg-white/[0.02] lg:grid">
      <div className="flex min-w-0 items-center gap-3">
        <ProductThumb product={product} />
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="truncate font-semibold text-white">{product.name}</h3>
            {!product.active && (
              <span className="shrink-0 rounded-full bg-zinc-800 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                Inativo
              </span>
            )}
          </div>
          <p className="truncate text-xs text-zinc-500">{product.description}</p>
        </div>
      </div>

      <span className="w-fit rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold uppercase tracking-[0.1em] text-zinc-300">
        {categoryLabel(product.category)}
      </span>

      <span className="font-bold text-[var(--neon)]">{formatPrice(product.price)}</span>

      <div className="flex justify-end">
        <ProductActions product={product} onEdit={onEdit} onDelete={onDelete} />
      </div>
    </article>
  );
}

export function ProductTable({ products, loading, onEdit, onDelete }: ProductTableProps) {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(search.trim().toLowerCase());
      setPage(1);
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [category]);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        !debouncedSearch ||
        p.name.toLowerCase().includes(debouncedSearch) ||
        p.description.toLowerCase().includes(debouncedSearch);
      const matchCat = !category || p.category === category;
      return matchSearch && matchCat;
    });
  }, [products, debouncedSearch, category]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return (
    <section className="flex min-w-0 flex-col gap-4 rounded-3xl border border-white/10 bg-white/[0.035] p-5">
      <div className="flex flex-col gap-3">
        <p className="text-sm text-zinc-500">
          {filtered.length} de {products.length} itens
        </p>

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar produto…"
              className="h-9 w-full rounded-xl border border-white/10 bg-black/30 pl-8 pr-3 text-xs text-white outline-none placeholder:text-zinc-600 focus:border-yellow-500/40"
            />
          </div>

          <div className="flex flex-wrap gap-1.5">
            {ADMIN_CATEGORY_FILTERS.map((cat) => (
              <button
                key={cat.value}
                type="button"
                onClick={() => setCategory(cat.value)}
                className={`h-8 rounded-xl px-2.5 text-[10px] font-bold uppercase tracking-[0.1em] transition sm:h-9 sm:px-3 sm:text-xs ${
                  category === cat.value
                    ? "bg-[var(--neon)] text-black"
                    : "border border-white/10 text-zinc-400 hover:text-white"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <ProductTableSkeleton />
      ) : (
        <>
          <div className="space-y-3 lg:hidden">
            {paginated.map((product) => (
              <ProductRowCard
                key={product.id}
                product={product}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
            {paginated.length === 0 && (
              <p className="rounded-2xl border border-white/10 px-4 py-10 text-center text-sm text-zinc-500">
                Nenhum produto encontrado.
              </p>
            )}
          </div>

          <div className="hidden overflow-x-auto rounded-2xl border border-white/10 lg:block">
            <div className="min-w-[640px]">
              <div className="grid grid-cols-[minmax(0,1.6fr)_0.8fr_0.7fr_auto] gap-4 border-b border-white/10 bg-black/30 px-4 py-3 text-xs font-bold uppercase tracking-[0.16em] text-zinc-500">
                <span>Produto</span>
                <span>Categoria</span>
                <span>Preço</span>
                <span className="text-right">Ações</span>
              </div>

              <div className="divide-y divide-white/10">
                {paginated.map((product) => (
                  <ProductTableRow
                    key={product.id}
                    product={product}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                ))}

                {paginated.length === 0 && (
                  <p className="px-4 py-10 text-center text-sm text-zinc-500">
                    Nenhum produto encontrado.
                  </p>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {!loading && totalPages > 1 && (
        <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-zinc-500">
            Página {safePage} de {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={safePage === 1}
              className="flex h-8 items-center gap-1 rounded-xl border border-white/10 px-3 text-xs text-zinc-400 transition hover:border-white/20 hover:text-white disabled:opacity-30 lg:px-2"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              <span className="lg:hidden">Anterior</span>
            </button>

            <div className="hidden gap-2 lg:flex">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setPage(n)}
                  className={`h-8 w-8 rounded-xl text-xs font-bold transition ${
                    n === safePage
                      ? "bg-[var(--neon)] text-black"
                      : "border border-white/10 text-zinc-400 hover:text-white"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
              className="flex h-8 items-center gap-1 rounded-xl border border-white/10 px-3 text-xs text-zinc-400 transition hover:border-white/20 hover:text-white disabled:opacity-30 lg:px-2"
            >
              <span className="lg:hidden">Próximo</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
