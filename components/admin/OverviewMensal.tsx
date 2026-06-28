"use client";

import { useMemo, useState, type ReactNode } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  Minus,
  Receipt,
  ShoppingBag,
  Sun,
  Wallet,
} from "lucide-react";
import { OverviewLineChart, type ChartPeriod, type ChartPoint } from "@/components/admin/OverviewLineChart";
import { useOrders } from "@/hooks/useOrders";
import type { Order, OrderStatus } from "@/types";

const BRL = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const MONTHS_SHORT = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

function startOfDay(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function isSameDay(a: Date, b: Date) {
  return startOfDay(a).getTime() === startOfDay(b).getTime();
}

function isSameMonth(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

/** Soma o total dos pedidos cujo status está em `statuses` e passam no filtro de data. */
function sumOrders(
  orders: Order[],
  statuses: Set<OrderStatus>,
  predicate: (date: Date) => boolean
) {
  return orders.reduce((sum, order) => {
    if (!statuses.has(order.status)) return sum;
    return predicate(new Date(order.createdAt)) ? sum + order.total : sum;
  }, 0);
}

function buildChartSeries(
  orders: Order[],
  statuses: Set<OrderStatus>,
  period: ChartPeriod,
  now: Date
): ChartPoint[] {
  if (period === "week") {
    return Array.from({ length: 7 }).map((_, i) => {
      const ref = new Date(now);
      ref.setDate(now.getDate() - (6 - i));
      return {
        label: WEEKDAYS[ref.getDay()],
        isToday: isSameDay(ref, now),
        total: sumOrders(orders, statuses, (d) => isSameDay(d, ref)),
        showLabel: true,
      };
    });
  }

  if (period === "month") {
    const year = now.getFullYear();
    const month = now.getMonth();
    const lastDay = now.getDate();

    return Array.from({ length: lastDay }).map((_, i) => {
      const day = i + 1;
      const ref = new Date(year, month, day);
      const isToday = isSameDay(ref, now);
      return {
        label: String(day),
        isToday,
        total: sumOrders(orders, statuses, (d) => isSameDay(d, ref)),
        showLabel: day === 1 || day === lastDay || day % 5 === 0 || isToday,
      };
    });
  }

  const year = now.getFullYear();
  const currentMonth = now.getMonth();

  return Array.from({ length: currentMonth + 1 }).map((_, i) => ({
    label: MONTHS_SHORT[i],
    isToday: i === currentMonth,
    total: sumOrders(
      orders,
      statuses,
      (d) => d.getFullYear() === year && d.getMonth() === i
    ),
    showLabel: true,
  }));
}

function countOrders(
  orders: Order[],
  statuses: Set<OrderStatus>,
  predicate: (date: Date) => boolean
) {
  return orders.reduce((count, order) => {
    if (!statuses.has(order.status)) return count;
    return predicate(new Date(order.createdAt)) ? count + 1 : count;
  }, 0);
}

type StatusFilter = "delivered" | "all";

const FILTER_STATUSES: Record<StatusFilter, Set<OrderStatus>> = {
  delivered: new Set<OrderStatus>(["delivered"]),
  all: new Set<OrderStatus>(["pending", "preparing", "delivered"]),
};

/** Variação percentual de `current` em relação a `previous`. */
function variation(current: number, previous: number) {
  if (previous === 0) {
    if (current === 0) return { pct: 0, direction: "flat" as const };
    return { pct: 100, direction: "up" as const };
  }
  const pct = ((current - previous) / previous) * 100;
  return {
    pct: Math.abs(pct),
    direction: pct > 0 ? ("up" as const) : pct < 0 ? ("down" as const) : ("flat" as const),
  };
}

type Direction = "up" | "down" | "flat";

function TrendBadge({ direction, pct, label }: { direction: Direction; pct: number; label: string }) {
  const config = {
    up: {
      className: "border-emerald-400/30 bg-emerald-500/10 text-emerald-300",
      Icon: ArrowUpRight,
    },
    down: {
      className: "border-red-400/30 bg-red-500/10 text-red-300",
      Icon: ArrowDownRight,
    },
    flat: {
      className: "border-zinc-500/30 bg-zinc-500/10 text-zinc-400",
      Icon: Minus,
    },
  }[direction];
  const Icon = config.Icon;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.08em] ${config.className}`}
    >
      <Icon className="h-3 w-3" />
      {pct.toLocaleString("pt-BR", { maximumFractionDigits: 1 })}% {label}
    </span>
  );
}

function SummaryBlock({
  icon: Icon,
  label,
  value,
  footer,
  highlight,
}: {
  icon: typeof Sun;
  label: string;
  value: string;
  footer?: ReactNode;
  highlight?: boolean;
}) {
  return (
    <article
      className={`min-w-[120px] flex-1 rounded-xl border p-3 ${
        highlight
          ? "border-[var(--neon)]/20 bg-[var(--neon)]/[0.06]"
          : "border-white/10 bg-black/25"
      }`}
    >
      <div className="mb-1.5 flex items-center gap-1.5">
        <span
          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg ${
            highlight ? "bg-[var(--neon)] text-black" : "bg-white/10 text-white"
          }`}
        >
          <Icon className="h-3 w-3" />
        </span>
        <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-zinc-500">
          {label}
        </span>
      </div>
      <strong
        className="block text-lg uppercase leading-none text-white md:text-xl"
        style={{ fontFamily: "var(--font-bebas)" }}
      >
        {value}
      </strong>
      {footer && <div className="mt-1.5">{footer}</div>}
    </article>
  );
}

function OverviewMensalSkeleton() {
  return (
    <section className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-4 md:p-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1.5">
          <div className="h-2.5 w-28 animate-pulse rounded bg-white/[0.06]" />
          <div className="h-6 w-40 animate-pulse rounded-lg bg-white/[0.06]" />
        </div>
        <div className="h-8 w-36 animate-pulse rounded-full bg-white/[0.06]" />
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-16 min-w-[120px] flex-1 animate-pulse rounded-xl bg-white/[0.04]" />
        ))}
      </div>
      <div className="mt-4 h-[200px] animate-pulse rounded-3xl bg-white/[0.04]" />
    </section>
  );
}

export function OverviewMensal() {
  const { orders, loading } = useOrders();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("delivered");
  const [chartPeriod, setChartPeriod] = useState<ChartPeriod>("week");

  const metrics = useMemo(() => {
    const statuses = FILTER_STATUSES[statusFilter];
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);

    const lastMonthRef = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const today = sumOrders(orders, statuses, (d) => isSameDay(d, now));
    const yesterdayTotal = sumOrders(orders, statuses, (d) => isSameDay(d, yesterday));
    const month = sumOrders(orders, statuses, (d) => isSameMonth(d, now));
    const lastMonth = sumOrders(orders, statuses, (d) => isSameMonth(d, lastMonthRef));
    const monthCount = countOrders(orders, statuses, (d) => isSameMonth(d, now));

    const todayCount = countOrders(orders, statuses, (d) => isSameDay(d, now));
    const yesterdayCount = countOrders(orders, statuses, (d) => isSameDay(d, yesterday));

    const chartSeries = buildChartSeries(orders, statuses, chartPeriod, now);
    const maxChart = Math.max(...chartSeries.map((d) => d.total), 1);

    return {
      today,
      yesterdayTotal,
      month,
      lastMonth,
      monthTicket: monthCount > 0 ? month / monthCount : 0,
      monthCount,
      todayCount,
      yesterdayCount,
      vsYesterday: variation(today, yesterdayTotal),
      vsLastMonth: variation(month, lastMonth),
      vsYesterdayCount: variation(todayCount, yesterdayCount),
      chartSeries,
      maxChart,
    };
  }, [orders, statusFilter, chartPeriod]);

  if (loading) return <OverviewMensalSkeleton />;

  const monthName = new Date().toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
  const revenueLabel = statusFilter === "delivered" ? "Receita entregue" : "Receita total";
  const chartSubtitleByPeriod: Record<ChartPeriod, string> = {
    week: `${revenueLabel} por dia · últimos 7 dias`,
    month: `${revenueLabel} por dia · mês atual`,
    year: `${revenueLabel} por mês · ano atual`,
  };
  const chartTitleByPeriod: Record<ChartPeriod, string> = {
    week: "Esta semana",
    month: "Este mês",
    year: "Este ano",
  };

  const monthCountLabel =
    statusFilter === "delivered"
      ? metrics.monthCount === 1
        ? "pedido entregue no mês"
        : "pedidos entregues no mês"
      : metrics.monthCount === 1
        ? "pedido no mês"
        : "pedidos no mês";

  return (
    <section className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-4 md:p-5">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[var(--neon)]">
            Visão financeira
          </p>
          <h2
            className="mt-0.5 text-2xl uppercase leading-none text-white md:text-3xl"
            style={{ fontFamily: "var(--font-bebas)" }}
          >
            Overview Mensal
          </h2>
          <span className="mt-0.5 block text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
            {monthName}
          </span>
        </div>

        <div className="inline-flex rounded-full border border-white/10 bg-black/30 p-0.5">
          {([
            { id: "delivered", label: "Entregues" },
            { id: "all", label: "Todos" },
          ] as const).map((option) => {
            const active = statusFilter === option.id;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => setStatusFilter(option.id)}
                className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.08em] transition ${
                  active
                    ? "bg-[var(--neon)] text-black"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <SummaryBlock
          icon={Sun}
          label="Hoje"
          value={BRL(metrics.today)}
          footer={
            <TrendBadge
              direction={metrics.vsYesterday.direction}
              pct={metrics.vsYesterday.pct}
              label="vs ontem"
            />
          }
        />
        <SummaryBlock
          icon={Wallet}
          label="Mês"
          value={BRL(metrics.month)}
          highlight
          footer={
            <TrendBadge
              direction={metrics.vsLastMonth.direction}
              pct={metrics.vsLastMonth.pct}
              label="vs mês passado"
            />
          }
        />
        <SummaryBlock
          icon={ShoppingBag}
          label="Pedidos hoje"
          value={String(metrics.todayCount)}
          footer={
            <TrendBadge
              direction={metrics.vsYesterdayCount.direction}
              pct={metrics.vsYesterdayCount.pct}
              label={`vs ${metrics.yesterdayCount} ontem`}
            />
          }
        />
        <SummaryBlock
          icon={Receipt}
          label="Ticket médio"
          value={BRL(metrics.monthTicket)}
          footer={
            <p className="text-[11px] text-zinc-500">
              {metrics.monthCount} {monthCountLabel}
            </p>
          }
        />
      </div>

      <div className="mt-4">
        <OverviewLineChart
          points={metrics.chartSeries}
          maxValue={metrics.maxChart}
          title={chartTitleByPeriod[chartPeriod]}
          subtitle={chartSubtitleByPeriod[chartPeriod]}
          period={chartPeriod}
          onPeriodChange={setChartPeriod}
        />
      </div>
    </section>
  );
}
