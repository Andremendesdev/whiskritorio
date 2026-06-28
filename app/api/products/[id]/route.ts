import { NextRequest } from "next/server";
import { productService } from "@/server/services/product.service";
import { guardAdmin, handle, jsonError } from "@/server/http";
import type { ProductInput } from "@/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  const { id } = await params;
  return handle(async () => {
    const product = await productService.getById(id);
    if (!product) throw new Error("Produto não encontrado.");
    return product;
  });
}

export async function PUT(request: NextRequest, { params }: Params) {
  const denied = await guardAdmin();
  if (denied) return denied;

  const { id } = await params;

  let body: ProductInput;
  try {
    body = (await request.json()) as ProductInput;
  } catch {
    return jsonError("Corpo da requisição inválido.");
  }

  return handle(() => productService.update(id, body));
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const denied = await guardAdmin();
  if (denied) return denied;

  const { id } = await params;
  return handle(async () => {
    await productService.remove(id);
    return { ok: true };
  });
}
