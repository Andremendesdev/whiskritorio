import { NextRequest } from "next/server";
import { orderService } from "@/server/services/order.service";
import { handle, jsonError } from "@/server/http";
import type { CreateOrderInput } from "@/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return handle(() => orderService.list());
}

export async function POST(request: NextRequest) {
  let body: CreateOrderInput;
  try {
    body = (await request.json()) as CreateOrderInput;
  } catch {
    return jsonError("Corpo da requisição inválido.");
  }

  if (!body?.customerName || !body?.phone || !body?.paymentMethod || !body?.items?.length) {
    return jsonError("Cliente, telefone, forma de pagamento e itens são obrigatórios.");
  }

  return handle(() => orderService.create(body), 201);
}
