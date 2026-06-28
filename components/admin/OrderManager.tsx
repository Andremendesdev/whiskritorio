"use client";

import { OrderTable, statusLabels } from "@/components/admin/OrderTable";
import { ToastContainer, useToast } from "@/components/admin/AdminToast";
import { useAutoPrint } from "@/hooks/useAutoPrint";
import { useOrders } from "@/hooks/useOrders";
import type { OrderStatus } from "@/types";

export function OrderManager() {
  const { orders, loading, error, updateStatus, updatePrintStatus, reprintOrder } =
    useOrders({ pollInterval: 5000 });
  const { toasts, push, dismiss } = useToast();

  useAutoPrint(orders, updatePrintStatus);

  async function handleStatusChange(id: string, status: OrderStatus) {
    try {
      await updateStatus(id, status);
      push(`Pedido ${id} → ${statusLabels[status]}`, "success");
    } catch (err) {
      push(err instanceof Error ? err.message : "Erro ao atualizar status.", "error");
    }
  }

  async function handleReprint(id: string) {
    try {
      await reprintOrder(id);
      push(`Pedido ${id} na fila de reimpressão`, "success");
    } catch (err) {
      push(err instanceof Error ? err.message : "Erro ao reimprimir pedido.", "error");
    }
  }

  return (
    <>
      <ToastContainer toasts={toasts} onDismiss={dismiss} />

      <div className="space-y-6">
        <section>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--neon)]">Cozinha</p>
          <h1 className="mt-2 text-5xl uppercase text-white" style={{ fontFamily: "var(--font-bebas)" }}>
            Pedidos
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Filtre por status, busque por cliente e atualize a fila da cozinha.
          </p>
        </section>

        {error && (
          <p className="rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </p>
        )}

        <OrderTable
          orders={orders}
          loading={loading}
          onStatusChange={handleStatusChange}
          onReprint={handleReprint}
        />
      </div>
    </>
  );
}
