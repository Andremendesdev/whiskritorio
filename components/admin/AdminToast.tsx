"use client";

import { useEffect, useState, useCallback } from "react";
import { CheckCircle2, XCircle, AlertCircle, X } from "lucide-react";

export type ToastType = "success" | "error" | "info";

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

/* ─── hook to be used in manager components ─────────────── */
export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const push = useCallback((message: string, type: ToastType = "success") => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { toasts, push, dismiss };
}

/* ─── icon map ───────────────────────────────────────────── */
const icons: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />,
  error: <XCircle className="h-4 w-4 shrink-0 text-red-400" />,
  info: <AlertCircle className="h-4 w-4 shrink-0 text-sky-400" />,
};

const barColors: Record<ToastType, string> = {
  success: "bg-emerald-400",
  error: "bg-red-400",
  info: "bg-sky-400",
};

/* ─── single toast item ──────────────────────────────────── */
function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className={`relative flex w-full max-w-sm items-start gap-3 overflow-hidden rounded-2xl border border-white/10 bg-zinc-900 px-4 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.5)] transition-all duration-300 ${
        visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      }`}
    >
      {/* progress bar */}
      <span
        className={`absolute bottom-0 left-0 h-[2px] w-full origin-left animate-[shrink_4s_linear_forwards] ${barColors[toast.type]}`}
      />

      {icons[toast.type]}

      <p className="flex-1 text-sm text-zinc-200">{toast.message}</p>

      <button
        type="button"
        onClick={onDismiss}
        aria-label="Fechar"
        className="ml-1 shrink-0 text-zinc-500 hover:text-white"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

/* ─── portal container rendered at manager level ─────────── */
export function ToastContainer({
  toasts,
  onDismiss,
}: {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}) {
  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-2"
    >
      {toasts.map((t) => (
        <div key={t.id} className="pointer-events-auto">
          <ToastItem toast={t} onDismiss={() => onDismiss(t.id)} />
        </div>
      ))}
    </div>
  );
}
