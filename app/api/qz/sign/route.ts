import { createSign } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { guardAdmin, jsonError } from "@/server/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function normalizePrivateKey(key: string): string {
  return key.includes("\\n") ? key.replace(/\\n/g, "\n") : key;
}

export async function POST(request: NextRequest) {
  const denied = await guardAdmin();
  if (denied) return denied;

  let body: { toSign?: string };
  try {
    body = (await request.json()) as { toSign?: string };
  } catch {
    return jsonError("Corpo da requisição inválido.");
  }

  if (!body.toSign) {
    return jsonError("Campo toSign é obrigatório.");
  }

  const privateKey = process.env.QZ_PRIVATE_KEY;
  if (!privateKey) {
    return jsonError("QZ_PRIVATE_KEY não configurada.", 500);
  }

  try {
    const sign = createSign("SHA512");
    sign.update(body.toSign);
    sign.end();
    const signature = sign.sign(normalizePrivateKey(privateKey), "base64");

    return new NextResponse(signature, {
      status: 200,
      headers: {
        "Content-Type": "text/plain",
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Erro ao assinar requisição QZ.";
    return jsonError(message, 500);
  }
}
