"use client";

import { useMemo } from "react";
import { Banknote, Clock3, Package, UtensilsCrossed } from "lucide-react";
import { StatCard } from "@/components/admin/StatCard";
import { OverviewMensal } from "@/components/admin/OverviewMensal";
import { DashboardSkeleton } from "@/components/admin/AdminSkeleton";
import { useOrders } from "@/hooks/useOrders";
import { useProducts } from "@/hooks/useProducts";
import type { OrderStatus } from "@/types";

const statusStyles: Record<OrderStatus, { badge: string; dot: string }> = {
  pending: { badge: "border-yellow-400/30 bg-yellow-500/10 text-yellow-400", dot: "bg-yellow-400" },
  preparing: { badge: "border-sky-400/30 bg-sky-500/10 text-sky-300", dot: "bg-sky-400" },
  delivered: { badge: "border-emerald-400/30 bg-emerald-500/10 text-emerald-300", dot: "bg-emerald-400" },
};

const statusLabels: Record<OrderStatus, string> = {
  pending: "Pendente",
  preparing: "Preparando",
  delivered: "Entregue",
};

export function DashboardOverview() {
  const { products, loading: productsLoading } = useProducts();
  const { orders, loading: ordersLoading } = useOrders();
  const loading = productsLoading || ordersLoading;

  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  const revenue = useMemo(
    () => orders.reduce((sum, o) => sum + (o.status === "delivered" ? o.total : 0), 0),
    [orders]
  );
  const recentOrders = orders.slice(0, 5);

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="space-y-8">
      {/* hero banner */}
      <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.035] p-4 md:p-5">
        <div className="pointer-events-none absolute right-0 top-0 h-40 w-40 translate-x-1/3 -translate-y-1/3 rounded-full bg-[var(--neon)] opacity-5 blur-3xl" />
        <div className="relative flex flex-col justify-between gap-3 md:flex-row md:items-center">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[var(--neon)]">
              Painel de controle
            </p>
            <h1
              className="mt-1 text-3xl uppercase leading-none text-white md:text-4xl"
              style={{ fontFamily: "var(--font-bebas)" }}
            >
              Dashboard
            </h1>
            <p className="mt-2 max-w-xl text-xs text-zinc-500">
              Resumo rápido da operação: cardápio, fila de pedidos e receita entregue.
            </p>
          </div>
          <span className="w-fit rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-300">
            ● Sistema online
          </span>
        </div>
      </section>

      {/* overview financeiro mensal */}
      <OverviewMensal />

      {/* stat cards */}
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Produtos" value={String(products.length)} description="Itens no cardápio" icon={Package} />
        <StatCard
          title="Ativos"
          value={String(products.filter((p) => p.active).length)}
          description="Disponíveis para venda"
          icon={UtensilsCrossed}
        />
        <StatCard
          title="Pendentes"
          value={String(pendingOrders)}
          description="Pedidos aguardando preparo"
          icon={Clock3}
        />
        <StatCard
          title="Receita"
          value={revenue.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
          description="Total de pedidos entregues"
          icon={Banknote}
        />
      </section>

      {/* recent orders */}
      <section className="rounded-3xl border border-white/10 bg-white/[0.035] p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2
            className="text-2xl uppercase text-white"
            style={{ fontFamily: "var(--font-bebas)" }}
          >
            Últimos pedidos
          </h2>
          <a
            href="/admin/orders"
            className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--neon)] hover:underline"
          >
            Ver todos →
          </a>
        </div>

        <div className="overflow-hidden rounded-2xl border border-white/10">
          {/* header row */}
          <div className="hidden grid-cols-[1fr_1fr_1fr_1fr] gap-4 border-b border-white/10 bg-black/30 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-zinc-600 sm:grid">
            <span>ID</span>
            <span>Cliente</span>
            <span>Status</span>
            <span className="text-right">Total</span>
          </div>

          <div className="divide-y divide-white/10">
            {recentOrders.map((order) => {
              const st = statusStyles[order.status];
              return (
                <div
                  key={order.id}
                  className="grid items-center gap-4 px-4 py-3 transition hover:bg-white/[0.02] sm:grid-cols-[1fr_1fr_1fr_1fr]"
                >
                  <strong className="text-sm text-white">{order.id}</strong>
                  <span className="text-sm text-zinc-400">{order.customerName}</span>
                  <span className={`w-fit rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.1em] ${st.badge}`}>
                    {statusLabels[order.status]}
                  </span>
                  <strong className="text-right text-sm text-[var(--neon)]">
                    {order.total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                  </strong>
                </div>
              );
            })}

            {recentOrders.length === 0 && (
              <p className="px-4 py-8 text-center text-sm text-zinc-500">
                Nenhum pedido ainda.
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
