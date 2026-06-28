import { NextRequest } from "next/server";
import { orderService } from "@/server/services/order.service";
import { guardAdmin, handle, jsonError } from "@/server/http";
import {
  ORDER_PRINT_STATUSES,
  ORDER_STATUSES,
  type OrderPrintStatus,
  type OrderStatus,
} from "@/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, { params }: Params) {
  const denied = await guardAdmin();
  if (denied) return denied;

  const { id } = await params;

  let body: { status?: OrderStatus; printStatus?: OrderPrintStatus };
  try {
    body = (await request.json()) as { status?: OrderStatus; printStatus?: OrderPrintStatus };
  } catch {
    return jsonError("Corpo da requisição inválido.");
  }

  const hasStatus = body.status !== undefined;
  const hasPrintStatus = body.printStatus !== undefined;

  if (!hasStatus && !hasPrintStatus) {
    return jsonError("Informe status ou printStatus para atualizar.");
  }

  if (hasStatus && !ORDER_STATUSES.includes(body.status!)) {
    return jsonError("Status inválido.");
  }

  if (hasPrintStatus && !ORDER_PRINT_STATUSES.includes(body.printStatus!)) {
    return jsonError("Status de impressão inválido.");
  }

  if (hasStatus && hasPrintStatus) {
    return handle(async () => {
      await orderService.updateStatus(id, body.status as OrderStatus);
      return orderService.updatePrintStatus(id, body.printStatus as OrderPrintStatus);
    });
  }

  if (hasPrintStatus) {
    return handle(() =>
      orderService.updatePrintStatus(id, body.printStatus as OrderPrintStatus)
    );
  }

  return handle(() => orderService.updateStatus(id, body.status as OrderStatus));
}
