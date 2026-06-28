"use client";

import { useEffect, useRef } from "react";
import { printOrder } from "@/lib/print";
import type { Order, OrderPrintStatus } from "@/types";

type UpdatePrintStatus = (
  id: string,
  printStatus: OrderPrintStatus
) => Promise<Order>;

export function useAutoPrint(orders: Order[], updatePrintStatus: UpdatePrintStatus) {
  const printingIdsRef = useRef(new Set<string>());
  const queueRef = useRef<Promise<void>>(Promise.resolve());

  useEffect(() => {
    const pending = orders.filter((order) => order.printStatus === "pending");

    for (const order of pending) {
      if (printingIdsRef.current.has(order.id)) continue;

      printingIdsRef.current.add(order.id);

      queueRef.current = queueRef.current.then(async () => {
        try {
          await printOrder(order);
          await updatePrintStatus(order.id, "printed");
        } catch {
          try {
            await updatePrintStatus(order.id, "failed");
          } catch {
            // Mantém estado local; o proximo poll pode reconciliar.
          }
        } finally {
          printingIdsRef.current.delete(order.id);
        }
      });
    }
  }, [orders, updatePrintStatus]);
}
