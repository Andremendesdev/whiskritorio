"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check, Copy, RefreshCw } from "lucide-react";
import { formatPrice } from "@/lib/cart";
import {
  PIX_KEY,
  PIX_PAYMENT_TTL_SECONDS,
  createPixPaymentSession,
  formatCountdown,
} from "@/lib/pix";

interface PixPaymentBlockProps {
  amount: number;
  active: boolean;
  onExpiredChange?: (expired: boolean) => void;
}

export function PixPaymentBlock({ amount, active, onExpiredChange }: PixPaymentBlockProps) {
  const [session, setSession] = useState<ReturnType<typeof createPixPaymentSession> | null>(
    null
  );
  const [now, setNow] = useState(Date.now());
  const [copied, setCopied] = useState(false);

  const regenerate = useCallback(() => {
    if (!active || amount <= 0 || !PIX_KEY) return;
    setSession(createPixPaymentSession(amount));
    setCopied(false);
  }, [active, amount]);

  useEffect(() => {
    if (!active || amount <= 0) {
      setSession(null);
      setCopied(false);
      return;
    }
    regenerate();
  }, [active, amount, regenerate]);

  useEffect(() => {
    if (!session) return;
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [session]);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2200);
    return () => clearTimeout(timer);
  }, [copied]);

  const secondsLeft = session
    ? Math.max(0, Math.ceil((session.expiresAt - now) / 1000))
    : 0;
  const expired = Boolean(session && secondsLeft === 0);
  const progress = session ? secondsLeft / PIX_PAYMENT_TTL_SECONDS : 0;
  const trackExpiry = active && amount > 0 && Boolean(PIX_KEY) && Boolean(session);

  useEffect(() => {
    if (!trackExpiry) {
      onExpiredChange?.(false);
      return;
    }
    onExpiredChange?.(expired);
  }, [trackExpiry, expired, onExpiredChange]);

  if (!active || amount <= 0) return null;

  if (!PIX_KEY) {
    return (
      <div
        className="rounded-xl px-4 py-3 text-xs text-[#f87171]"
        style={{
          background: "rgba(248,113,113,0.08)",
          border: "1px solid rgba(248,113,113,0.25)",
        }}
      >
        Chave Pix não configurada. Informe `NEXT_PUBLIC_PIX_KEY` no ambiente.
      </div>
    );
  }

  if (!session) return null;

  const handleCopy = async () => {
    if (expired) return;
    try {
      await navigator.clipboard.writeText(session.code);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl p-4 space-y-3"
      style={{
        background: "rgb(var(--neon-rgb) / 0.06)",
        border: "1px solid rgb(var(--neon-rgb) / 0.18)",
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-[0.15em] text-zinc-500 font-semibold">
            Pix copia e cola
          </p>
          <p className="text-xs text-zinc-400 mt-1">
            Valor:{" "}
            <span className="text-[var(--neon)] font-semibold">{formatPrice(amount)}</span>
          </p>
        </div>
        {expired ? (
          <button
            type="button"
            onClick={regenerate}
            className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.08em] px-2.5 py-1.5 rounded-full text-black"
            style={{ background: "var(--neon)" }}
          >
            <RefreshCw className="w-3 h-3" />
            Novo código
          </button>
        ) : (
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.08em] px-2.5 py-1.5 rounded-full transition-colors"
            style={{
              background: copied ? "rgba(34,197,94,0.15)" : "rgb(var(--neon-rgb) / 0.15)",
              color: copied ? "#4ade80" : "var(--neon)",
              border: `1px solid ${copied ? "rgba(34,197,94,0.35)" : "rgb(var(--neon-rgb) / 0.35)"}`,
            }}
          >
            {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            {copied ? "Copiado" : "Copiar"}
          </button>
        )}
      </div>

      <div
        className="rounded-lg px-3 py-2.5 text-[11px] leading-relaxed break-all font-mono"
        style={{
          background: "rgba(0,0,0,0.35)",
          border: "1px solid rgba(255,255,255,0.06)",
          color: expired ? "#71717a" : "#d4d4d8",
        }}
      >
        {session.code}
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.12em]">
          <span className={expired ? "text-[#f87171]" : "text-zinc-500"}>
            {expired ? "Código expirado" : "Tempo restante"}
          </span>
          <span
            className="font-semibold tabular-nums"
            style={{ color: expired ? "#f87171" : "var(--neon)" }}
          >
            {formatCountdown(secondsLeft)}
          </span>
        </div>
        <div
          className="h-1.5 rounded-full overflow-hidden"
          style={{ background: "rgba(255,255,255,0.08)" }}
        >
          <motion.div
            className="h-full rounded-full"
            style={{
              background: expired
                ? "#f87171"
                : "linear-gradient(90deg, var(--neon), #fde047)",
              width: `${progress * 100}%`,
            }}
            animate={{ width: `${progress * 100}%` }}
            transition={{ duration: 1, ease: "linear" }}
          />
        </div>
      </div>

      <p className="text-[10px] text-zinc-500 leading-relaxed">
        {expired
          ? "Gere um novo código Pix antes de confirmar o pedido."
          : "Copie o código, pague no app do banco e confirme o pedido em seguida."}
      </p>
    </motion.div>
  );
}
