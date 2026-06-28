"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { Search, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import type { Order, OrderPrintStatus, OrderStatus } from "@/types";
import { OrderCardSkeleton } from "@/components/admin/AdminSkeleton";

const PAGE_SIZE = 5;

const STATUS_FILTERS: { value: OrderStatus | ""; label: string }[] = [
  { value: "", label: "Todos" },
  { value: "pending", label: "Pendente" },
  { value: "preparing", label: "Preparando" },
  { value: "delivered", label: "Entregue" },
];

export const statusLabels: Record<OrderStatus, string> = {
  pending: "Pendente",
  preparing: "Preparando",
  delivered: "Entregue",
};

const statusStyles: Record<OrderStatus, { badge: string; dot: string }> = {
  pending: {
    badge: "border-yellow-400/30 bg-yellow-500/10 text-yellow-400",
    dot: "bg-yellow-400",
  },
  preparing: {
    badge: "border-sky-400/30 bg-sky-500/10 text-sky-300",
    dot: "bg-sky-400",
  },
  delivered: {
    badge: "border-emerald-400/30 bg-emerald-500/10 text-emerald-300",
    dot: "bg-emerald-400",
  },
};

export const printStatusLabels: Record<OrderPrintStatus, string> = {
  pending: "⏳ Pendente",
  printed: "✅ Impresso",
  failed: "❌ Falhou na impressão",
};

const printStatusStyles: Record<OrderPrintStatus, string> = {
  pending: "border-yellow-400/30 bg-yellow-500/10 text-yellow-400",
  printed: "border-emerald-400/30 bg-emerald-500/10 text-emerald-300",
  failed: "border-red-400/30 bg-red-500/10 text-red-300",
};

interface OrderTableProps {
  orders: Order[];
  loading?: boolean;
  onStatusChange: (id: string, status: OrderStatus) => void;
  onReprint: (id: string) => void;
}

export function OrderTable({ orders, loading, onStatusChange, onReprint }: OrderTableProps) {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "">("");
  const [page, setPage] = useState(1);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(search.trim().toLowerCase());
      setPage(1);
    }, 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [search]);

  useEffect(() => { setPage(1); }, [statusFilter]);

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const matchSearch =
        !debouncedSearch ||
        o.id.toLowerCase().includes(debouncedSearch) ||
        o.customerName.toLowerCase().includes(debouncedSearch) ||
        o.phone.includes(debouncedSearch);
      const matchStatus = !statusFilter || o.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [orders, debouncedSearch, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return (
    <section className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/[0.035] p-5">
      {/* header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-2xl uppercase text-white" style={{ fontFamily: "var(--font-bebas)" }}>
            Pedidos
          </h2>
          <p className="text-sm text-zinc-500">
            {filtered.length} de {orders.length} pedidos
          </p>
        </div>

        {/* filters */}
        <div className="flex flex-wrap gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar pedido ou cliente…"
              className="h-9 rounded-xl border border-white/10 bg-black/30 pl-8 pr-3 text-xs text-white outline-none placeholder:text-zinc-600 focus:border-yellow-500/40 w-52"
            />
          </div>

          <div className="flex gap-1">
            {STATUS_FILTERS.map((f) => (
              <button
                key={f.value}
                type="button"
                onClick={() => setStatusFilter(f.value)}
                className={`h-9 rounded-xl px-3 text-xs font-bold uppercase tracking-[0.1em] transition ${
                  statusFilter === f.value
                    ? "bg-[var(--neon)] text-black"
                    : "border border-white/10 text-zinc-400 hover:text-white"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* list */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => <OrderCardSkeleton key={i} />)}
        </div>
      ) : (
        <div className="space-y-3">
          {paginated.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onStatusChange={onStatusChange}
              onReprint={onReprint}
            />
          ))}
          {paginated.length === 0 && (
            <p className="rounded-2xl border border-white/10 px-4 py-10 text-center text-sm text-zinc-500">
              Nenhum pedido encontrado.
            </p>
          )}
        </div>
      )}

      {/* pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-between pt-1">
          <p className="text-xs text-zinc-500">
            Página {safePage} de {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={safePage === 1}
              className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 text-zinc-400 transition hover:text-white disabled:opacity-30"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
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
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
              className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 text-zinc-400 transition hover:text-white disabled:opacity-30"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

/* ─── order card ─────────────────────────────────────────── */
function OrderCard({
  order,
  onStatusChange,
  onReprint,
}: {
  order: Order;
  onStatusChange: (id: string, status: OrderStatus) => void;
  onReprint: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const styles = statusStyles[order.status];
  const showReprint = order.printStatus === "printed" || order.printStatus === "failed";

  return (
    <article className="overflow-hidden rounded-2xl border border-white/10 bg-black/25 transition hover:border-white/20">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center gap-4 px-4 py-3 text-left"
      >
        {/* dot */}
        <span className={`h-2 w-2 shrink-0 rounded-full ${styles.dot}`} />

        {/* id + customer */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <strong className="text-sm text-white">{order.id}</strong>
            <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.1em] ${styles.badge}`}>
              {statusLabels[order.status]}
            </span>
            <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold tracking-[0.05em] ${printStatusStyles[order.printStatus]}`}>
              {printStatusLabels[order.printStatus]}
            </span>
          </div>
          <p className="text-xs text-zinc-500">{order.customerName} · {order.phone}</p>
        </div>

        {/* total + time */}
        <div className="shrink-0 text-right">
          <strong className="block text-sm text-[var(--neon)]">
            {order.total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
          </strong>
          <span className="text-[10px] text-zinc-600">
            {new Date(order.createdAt).toLocaleString("pt-BR", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "2-digit" })}
          </span>
        </div>

        <ChevronDown className={`h-4 w-4 shrink-0 text-zinc-500 transition-transform ${expanded ? "rotate-180" : ""}`} />
      </button>

      {expanded && (
        <div className="border-t border-white/10 px-4 pb-4 pt-3">
          {/* items */}
          <div className="mb-3 rounded-xl bg-white/[0.03] p-3 space-y-1">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between gap-4 text-sm">
                <span className="text-zinc-400">{item.quantity}× {item.name}</span>
                <span className="text-zinc-500">
                  {item.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                </span>
              </div>
            ))}
          </div>

          {/* status changer */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-[0.14em] text-zinc-500">
              Atualizar status:
            </span>
            {(["pending", "preparing", "delivered"] as OrderStatus[]).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => onStatusChange(order.id, s)}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold uppercase tracking-[0.1em] transition ${
                  order.status === s
                    ? `${statusStyles[s].badge} border`
                    : "border border-white/10 text-zinc-400 hover:text-white"
                }`}
              >
                {statusLabels[s]}
              </button>
            ))}
          </div>

          {showReprint && (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => onReprint(order.id)}
                className="rounded-xl border border-white/10 px-3 py-1.5 text-xs font-bold tracking-[0.05em] text-zinc-300 transition hover:border-yellow-500/40 hover:text-white"
              >
                🔄 Reimprimir
              </button>
            </div>
          )}
        </div>
      )}
    </article>
  );
}
