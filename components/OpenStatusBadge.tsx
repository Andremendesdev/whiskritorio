"use client";

import { motion } from "framer-motion";

export function OpenStatusBadge({ isOpen }: { isOpen: boolean }) {
  const color = isOpen ? "#4ade80" : "#f87171";
  const glow = isOpen ? "rgba(74,222,128,0.5)" : "rgba(248,113,113,0.5)";
  const bg = isOpen ? "rgba(74,222,128,0.1)" : "rgba(248,113,113,0.1)";
  const border = isOpen ? "rgba(74,222,128,0.35)" : "rgba(248,113,113,0.35)";

  return (
    <div
      className="flex w-fit shrink-0 items-center gap-2 rounded-full px-3 py-1.5 md:gap-2.5 md:px-4 md:py-2"
      style={{
        background: bg,
        border: `1px solid ${border}`,
        boxShadow: `0 0 16px ${glow}`,
      }}
      role="status"
      aria-live="polite"
      aria-label={
        isOpen ? "Estabelecimento aberto agora" : "Estabelecimento fechado agora"
      }
    >
      {isOpen ? (
        <motion.span
          className="block h-2 w-2 shrink-0 rounded-full md:h-2.5 md:w-2.5"
          style={{ background: color, boxShadow: `0 0 8px ${glow}` }}
          animate={{ opacity: [1, 0.35, 1] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          aria-hidden
        />
      ) : (
        <span
          className="block h-2 w-2 shrink-0 rounded-full md:h-2.5 md:w-2.5"
          style={{ background: color, boxShadow: `0 0 8px ${glow}` }}
          aria-hidden
        />
      )}
      <span
        className="text-[10px] font-bold uppercase tracking-[0.14em] md:text-xs md:tracking-[0.16em]"
        style={{ color, textShadow: `0 0 12px ${glow}` }}
      >
        {isOpen ? "Aberto agora" : "Fechado agora"}
      </span>
    </div>
  );
}
