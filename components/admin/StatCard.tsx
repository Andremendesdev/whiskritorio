import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
}

export function StatCard({ title, value, description, icon: Icon }: StatCardProps) {
  return (
    <article className="rounded-3xl border border-white/10 bg-white/[0.035] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
      <div className="mb-5 flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-[0.22em] text-zinc-500">{title}</span>
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--neon)] text-black">
          <Icon className="h-5 w-5" />
        </span>
      </div>
      <strong
        className="block text-4xl font-black uppercase leading-none text-white"
        style={{ fontFamily: "var(--font-bebas)" }}
      >
        {value}
      </strong>
      <p className="mt-2 text-sm text-zinc-500">{description}</p>
    </article>
  );
}
