"use client";

import { useEffect, useMemo, useState } from "react";

export type ChartPeriod = "week" | "month" | "year";

export interface ChartPoint {
  label: string;
  isToday: boolean;
  total: number;
  showLabel?: boolean;
}

const BRL = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const PERIOD_OPTIONS: { id: ChartPeriod; label: string }[] = [
  { id: "week", label: "Semana" },
  { id: "month", label: "Mês" },
  { id: "year", label: "Ano" },
];

interface OverviewLineChartProps {
  points: ChartPoint[];
  maxValue: number;
  title: string;
  subtitle: string;
  period: ChartPeriod;
  onPeriodChange: (period: ChartPeriod) => void;
}

const WIDTH = 400;
const HEIGHT = 200;
const PAD = { top: 16, right: 16, bottom: 36, left: 16 };
const PLOT_W = WIDTH - PAD.left - PAD.right;
const PLOT_H = HEIGHT - PAD.top - PAD.bottom;

function getPlotPoints(points: ChartPoint[], maxValue: number) {
  const step = points.length > 1 ? PLOT_W / (points.length - 1) : 0;
  return points.map((point, i) => {
    const x = PAD.left + step * i;
    const ratio = maxValue > 0 ? point.total / maxValue : 0;
    const y = PAD.top + PLOT_H - ratio * PLOT_H;
    return { x, y, point, i };
  });
}

function buildSmoothPath(plotPoints: { x: number; y: number }[]): string {
  if (plotPoints.length === 0) return "";
  if (plotPoints.length === 1) return `M ${plotPoints[0].x} ${plotPoints[0].y}`;

  let d = `M ${plotPoints[0].x} ${plotPoints[0].y}`;
  for (let i = 0; i < plotPoints.length - 1; i++) {
    const p0 = plotPoints[i];
    const p1 = plotPoints[i + 1];
    const cx = (p0.x + p1.x) / 2;
    d += ` C ${cx} ${p0.y}, ${cx} ${p1.y}, ${p1.x} ${p1.y}`;
  }
  return d;
}

function buildAreaPath(plotPoints: { x: number; y: number }[]): string {
  if (plotPoints.length === 0) return "";
  const line = buildSmoothPath(plotPoints);
  const last = plotPoints[plotPoints.length - 1];
  const first = plotPoints[0];
  const bottom = PAD.top + PLOT_H;
  return `${line} L ${last.x} ${bottom} L ${first.x} ${bottom} Z`;
}

export function OverviewLineChart({
  points,
  maxValue,
  title,
  subtitle,
  period,
  onPeriodChange,
}: OverviewLineChartProps) {
  const [hovered, setHovered] = useState<number | null>(null);

  useEffect(() => {
    setHovered(null);
  }, [period, points]);

  const plotPoints = useMemo(() => getPlotPoints(points, maxValue), [points, maxValue]);
  const linePath = useMemo(() => buildSmoothPath(plotPoints), [plotPoints]);
  const areaPath = useMemo(() => buildAreaPath(plotPoints), [plotPoints]);

  const gridLines = [0.25, 0.5, 0.75].map((pct) => PAD.top + PLOT_H * (1 - pct));
  const active = hovered !== null ? plotPoints[hovered] : null;
  const hitRadius = points.length > 14 ? 8 : 14;

  return (
    <div className="rounded-3xl border border-white/10 bg-black/25 p-5">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">
            {title}
          </span>
          <p className="mt-0.5 text-[11px] text-zinc-600">{subtitle}</p>
        </div>

        <div className="inline-flex rounded-full border border-white/10 bg-black/30 p-1">
          {PERIOD_OPTIONS.map((option) => {
            const activePeriod = period === option.id;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => onPeriodChange(option.id)}
                className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.08em] transition ${
                  activePeriod
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

      <div className="relative h-[200px] w-full">
        {active && (
          <div
            className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-xl border border-white/10 bg-zinc-900/95 px-3 py-2 text-center shadow-lg"
            style={{
              left: `${(active.x / WIDTH) * 100}%`,
              top: `${(active.y / HEIGHT) * 100}%`,
              marginTop: -12,
            }}
          >
            <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-zinc-500">
              {active.point.label}
              {active.point.isToday ? " · Atual" : ""}
            </p>
            <p
              className="text-lg leading-none text-[var(--neon)]"
              style={{ fontFamily: "var(--font-bebas)" }}
            >
              {BRL(active.point.total)}
            </p>
          </div>
        )}

        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="h-full w-full overflow-visible"
          preserveAspectRatio="none"
          role="img"
          aria-label={`Gráfico de receita — ${title}`}
        >
          <defs>
            <linearGradient id="overviewLineFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--neon)" stopOpacity="0.35" />
              <stop offset="100%" stopColor="var(--neon)" stopOpacity="0" />
            </linearGradient>
          </defs>

          {gridLines.map((y, i) => (
            <line
              key={i}
              x1={PAD.left}
              y1={y}
              x2={WIDTH - PAD.right}
              y2={y}
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
          ))}

          <path d={areaPath} fill="url(#overviewLineFill)" />

          <path
            d={linePath}
            fill="none"
            stroke="var(--neon)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />

          {plotPoints.map(({ x, y, point, i }) => (
            <g key={i}>
              <circle
                cx={x}
                cy={y}
                r={hitRadius}
                fill="transparent"
                className="cursor-pointer"
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              />
              <circle
                cx={x}
                cy={y}
                r={point.isToday ? 5 : hovered === i ? 4.5 : points.length > 14 ? 2.5 : 3.5}
                fill={point.isToday || hovered === i ? "var(--neon)" : "rgba(255,255,255,0.5)"}
                stroke={point.isToday ? "rgba(0,0,0,0.4)" : "transparent"}
                strokeWidth="1"
                className="pointer-events-none transition-all duration-150"
                vectorEffect="non-scaling-stroke"
              />
            </g>
          ))}

          {plotPoints.map(({ x, point, i }) =>
            point.showLabel !== false ? (
              <text
                key={`label-${i}`}
                x={x}
                y={HEIGHT - 8}
                textAnchor="middle"
                className={`fill-current font-bold uppercase tracking-[0.04em] ${
                  point.isToday ? "text-[var(--neon)]" : "text-zinc-500"
                }`}
                style={{ fontSize: points.length > 14 ? 9 : 11 }}
              >
                {point.label}
              </text>
            ) : null
          )}
        </svg>
      </div>
    </div>
  );
}
