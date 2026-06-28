"use client";

import { useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LockKeyhole } from "lucide-react";

const ADMIN_EMAIL = "admin@whiskritorio.com";
const ADMIN_PASSWORD = "whiskritorio123";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        setError("Credenciais inválidas.");
        return;
      }

      const next = searchParams.get("next") ?? "/admin";
      router.push(next.startsWith("/admin") ? next : "/admin");
      router.refresh();
    } catch {
      setError("Não foi possível entrar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-[var(--bg)] px-6 text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-1/2 top-[-12rem] h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-yellow-500/10 blur-3xl" />
      </div>

      <form
        onSubmit={handleSubmit}
        className="relative z-10 w-full max-w-md rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl"
      >
        <div className="mb-8">
          <span className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--neon)] text-black">
            <LockKeyhole className="h-6 w-6" />
          </span>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-zinc-500">Área restrita</p>
          <h1
            className="mt-2 text-5xl uppercase leading-none"
            style={{ fontFamily: "var(--font-bebas)" }}
          >
            Admin Whiskritório
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            Acesse o painel para gerenciar produtos e pedidos.
          </p>
        </div>

        <div className="space-y-4">
          <label className="block space-y-2">
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">Email</span>
            <input
              name="email"
              type="email"
              required
              autoComplete="username"
              defaultValue={ADMIN_EMAIL}
              className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-yellow-500/50"
            />
          </label>

          <label className="block space-y-2">
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">Senha</span>
            <input
              name="password"
              type="password"
              required
              autoComplete="current-password"
              defaultValue={ADMIN_PASSWORD}
              className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-yellow-500/50"
            />
          </label>
        </div>

        {error && (
          <p className="mt-4 rounded-2xl bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-full bg-[var(--neon)] px-5 py-3 text-xs font-black uppercase tracking-[0.18em] text-black transition hover:scale-[1.02] disabled:opacity-60"
        >
          {loading ? "Entrando..." : "Entrar no admin"}
        </button>

        <p className="mt-5 text-center text-xs text-zinc-600">
          Demo: {ADMIN_EMAIL} / {ADMIN_PASSWORD}
        </p>
      </form>
    </main>
  );
}
