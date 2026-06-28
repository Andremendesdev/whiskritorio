"use client";

import { useCallback, useEffect, useState } from "react";
import { apiGet, apiSend } from "@/lib/api";
import type { CreateOrderInput, Order, OrderPrintStatus, OrderStatus } from "@/types";

interface UseOrdersOptions {
  pollInterval?: number;
}

export function useOrders(options?: UseOrdersOptions) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async (refreshOptions?: { background?: boolean }) => {
    const isBackground = refreshOptions?.background ?? false;

    if (!isBackground) {
      setLoading(true);
      setError(null);
    }

    try {
      const data = await apiGet<Order[]>("/api/orders");
      setOrders(data);
    } catch (err) {
      if (!isBackground) {
        setError(err instanceof Error ? err.message : "Erro ao carregar pedidos.");
      }
    } finally {
      if (!isBackground) setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    const pollInterval = options?.pollInterval;
    if (!pollInterval) return;

    const intervalId = setInterval(() => {
      void refresh({ background: true });
    }, pollInterval);

    return () => clearInterval(intervalId);
  }, [options?.pollInterval, refresh]);

  const updateStatus = useCallback(async (id: string, status: OrderStatus) => {
    const updated = await apiSend<Order>(`/api/orders/${id}`, "PATCH", { status });
    setOrders((prev) => prev.map((o) => (o.id === id ? updated : o)));
    return updated;
  }, []);

  const updatePrintStatus = useCallback(async (id: string, printStatus: OrderPrintStatus) => {
    const updated = await apiSend<Order>(`/api/orders/${id}`, "PATCH", { printStatus });
    setOrders((prev) => prev.map((o) => (o.id === id ? updated : o)));
    return updated;
  }, []);

  const reprintOrder = useCallback(async (id: string) => {
    return updatePrintStatus(id, "pending");
  }, [updatePrintStatus]);

  const createOrder = useCallback(async (input: CreateOrderInput) => {
    const created = await apiSend<Order>("/api/orders", "POST", input);
    setOrders((prev) => [created, ...prev]);
    return created;
  }, []);

  return {
    orders,
    loading,
    error,
    refresh,
    updateStatus,
    updatePrintStatus,
    reprintOrder,
    createOrder,
  };
}
