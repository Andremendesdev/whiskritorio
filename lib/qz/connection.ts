"use client";

import { setupQzSecurity } from "@/lib/qz/setup";

type QzTray = typeof import("qz-tray").default;

export async function getQz(): Promise<QzTray> {
  const qz = (await import("qz-tray")).default;
  await setupQzSecurity(qz);
  return qz;
}

export async function ensureQzConnected(): Promise<QzTray> {
  const qz = await getQz();
  if (!qz.websocket.isActive()) {
    await qz.websocket.connect();
  }
  return qz;
}

export async function resolvePrinterName(qz: QzTray): Promise<string> {
  const configured = process.env.NEXT_PUBLIC_QZ_PRINTER_NAME?.trim();

  if (configured) {
    const printers = await qz.printers.find();
    if (!printers.includes(configured)) {
      throw new Error(`Impressora "${configured}" não encontrada no QZ Tray.`);
    }
    return configured;
  }

  const defaultPrinter = await qz.printers.getDefault();
  if (!defaultPrinter) {
    throw new Error("Nenhuma impressora padrão configurada no QZ Tray.");
  }

  return defaultPrinter;
}
