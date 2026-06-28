import { NextRequest } from "next/server";
import { categoryService } from "@/server/services/category.service";
import { guardAdmin, handle, jsonError } from "@/server/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return handle(() => categoryService.list());
}

export async function POST(request: NextRequest) {
  const denied = await guardAdmin();
  if (denied) return denied;

  let body: { name?: string; slug?: string };
  try {
    body = (await request.json()) as { name?: string; slug?: string };
  } catch {
    return jsonError("Corpo da requisição inválido.");
  }

  if (!body.name || !body.slug) {
    return jsonError("Nome e slug são obrigatórios.");
  }

  return handle(() => categoryService.create({ name: body.name!, slug: body.slug! }), 201);
}
