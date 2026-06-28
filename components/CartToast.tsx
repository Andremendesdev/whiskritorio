"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";

interface CartToastProps {
  message: string | null;
}

export function CartToast({ message }: CartToastProps) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          role="status"
          aria-live="polite"
          initial={{ opacity: 0, y: 16, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.95 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="fixed z-50 bottom-24 right-6 md:bottom-28 md:right-8 flex items-center gap-3 px-4 py-3.5 rounded-2xl max-w-[min(100vw-3rem,20rem)]"
          style={{
            background: "rgba(8,8,9,0.92)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgb(var(--neon-rgb) / 0.25)",
            boxShadow:
              "0 0 28px rgb(var(--neon-rgb) / 0.2), 0 8px 32px rgba(0,0,0,0.5)",
          }}
        >
          <span
            className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
            style={{
              background: "var(--neon)",
              boxShadow: "0 0 14px rgb(var(--neon-rgb) / 0.4)",
            }}
          >
            <Check className="w-4 h-4 text-black" strokeWidth={3} />
          </span>
          <p className="text-sm font-medium text-white leading-snug">{message}</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
