"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { formatOrderDateTime } from "@/lib/datetime";

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

interface CartFinishViewProps {
  confirmedAt: string;
  onNewOrder: () => void;
}

export function CartFinishView({ confirmedAt, onNewOrder }: CartFinishViewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: EASE }}
      className="flex flex-1 flex-col items-center justify-center px-6 py-10 text-center"
    >
      <div
        className="mb-6 flex h-20 w-20 items-center justify-center rounded-full"
        style={{
          background: "rgb(var(--neon-rgb) / 0.12)",
          border: "1px solid rgb(var(--neon-rgb) / 0.35)",
          boxShadow: "0 0 32px rgb(var(--neon-rgb) / 0.2)",
        }}
      >
        <Check className="h-10 w-10 text-[var(--neon)]" strokeWidth={2.5} />
      </div>

      <h3
        className="text-white uppercase leading-tight"
        style={{ fontFamily: "var(--font-bebas)", fontSize: "2rem", letterSpacing: "0.06em" }}
      >
        Pedido confirmado
      </h3>

      <p className="mt-3 text-sm text-zinc-400">
        Confirmado em{" "}
        <span className="font-semibold text-zinc-300">{formatOrderDateTime(confirmedAt)}</span>
      </p>

      <p className="mt-6 max-w-[260px] text-base leading-relaxed text-zinc-500">
        Obrigado pela preferência!
      </p>

      <motion.button
        type="button"
        onClick={onNewOrder}
        whileHover={{ scale: 1.02, boxShadow: "0 0 32px rgb(var(--neon-rgb) / 0.5)" }}
        whileTap={{ scale: 0.98 }}
        className="mt-10 w-full max-w-xs py-4 rounded-full text-sm font-bold uppercase tracking-[0.12em]"
        style={{
          background: "var(--neon)",
          color: "#000",
          boxShadow: "0 0 24px rgb(var(--neon-rgb) / 0.3)",
        }}
      >
        Fazer novo pedido
      </motion.button>
    </motion.div>
  );
}
