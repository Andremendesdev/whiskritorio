"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BarChart3, ClipboardList, LogOut, Mic2, Package, ShieldCheck } from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: BarChart3 },
  { label: "Produtos", href: "/admin/products", icon: Package },
  { label: "Shows", href: "/admin/events", icon: Mic2 },
  { label: "Pedidos", href: "/admin/orders", icon: ClipboardList },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-[var(--bg)] text-white">
      <div className="pointer-events-none fixed inset-0 opacity-70">
        <div className="absolute left-[-12rem] top-[-10rem] h-96 w-96 rounded-full bg-yellow-500/10 blur-3xl" />
        <div className="absolute bottom-[-12rem] right-[-8rem] h-96 w-96 rounded-full bg-zinc-700/20 blur-3xl" />
      </div>

      <div className="relative z-10 flex min-h-screen">
        <aside className="hidden w-72 shrink-0 border-r border-white/10 bg-black/30 px-5 py-6 backdrop-blur-xl lg:block">
          <Link href="/admin" className="mb-8 flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--neon)] text-black shadow-[0_0_24px_rgb(234_179_8_/_0.25)]">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <span>
              <span className="block text-xs uppercase tracking-[0.3em] text-zinc-500">
                Whiskritório
              </span>
              <span
                className="block text-2xl uppercase leading-none text-white"
                style={{ fontFamily: "var(--font-bebas)" }}
              >
                Admin
              </span>
            </span>
          </Link>

          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold uppercase tracking-[0.12em] transition ${
                    active
                      ? "bg-[var(--neon)] text-black"
                      : "text-zinc-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <button
            type="button"
            onClick={logout}
            className="mt-8 flex w-full items-center gap-3 rounded-2xl border border-white/10 px-4 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-zinc-400 transition hover:border-red-400/30 hover:bg-red-500/10 hover:text-red-200"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </button>
        </aside>

        <section className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 border-b border-white/10 bg-[var(--bg)]/85 px-5 py-4 backdrop-blur-xl lg:hidden">
            <div className="mb-4 flex items-center justify-between">
              <Link href="/admin" className="text-2xl uppercase" style={{ fontFamily: "var(--font-bebas)" }}>
                Whisk Admin
              </Link>
              <button
                type="button"
                onClick={logout}
                className="rounded-full border border-white/10 p-2 text-zinc-400"
                aria-label="Sair do admin"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
            <nav className="flex gap-2 overflow-x-auto">
              {navItems.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] ${
                      active ? "bg-[var(--neon)] text-black" : "bg-white/5 text-zinc-400"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </header>

          <div className="p-5 md:p-8 lg:p-10">{children}</div>
        </section>
      </div>
    </main>
  );
}
