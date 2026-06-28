"use client";

import { ensureQzConnected, resolvePrinterName } from "@/lib/qz/connection";
import { formatOrderTicket } from "@/lib/print/format-ticket";
import type { Order } from "@/types";

export async function printOrder(order: Order): Promise<void> {
  const qz = await ensureQzConnected();
  const printer = await resolvePrinterName(qz);
  const data = formatOrderTicket(order);
  const config = qz.configs.create(printer);

  await qz.print(config, [
    {
      type: "raw",
      format: "plain",
      data,
    },
  ]);
}
