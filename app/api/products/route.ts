import { NextRequest } from "next/server";
import { productService } from "@/server/services/product.service";
import { guardAdmin, handle, jsonError } from "@/server/http";
import type { ProductInput } from "@/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export async function GET() {
  return handle(() => productService.list());
}

export async function POST(request: NextRequest) {
  const denied = await guardAdmin();
  if (denied) return denied;

  let body: ProductInput;
  try {
    body = (await request.json()) as ProductInput;
  } catch {
    return jsonError("Corpo da requisição inválido.");
  }

  if (!body?.name || !body?.category) {
    return jsonError("Nome e categoria são obrigatórios.");
  }

  return handle(() => productService.create(body), 201);
}
