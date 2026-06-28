import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";

const NO_STORE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  Pragma: "no-cache",
  Expires: "0",
};

/** Resposta JSON de erro padronizada. */
export function jsonError(message: string, status = 400) {
  return NextResponse.json(
    { ok: false, message },
    { status, headers: NO_STORE_HEADERS }
  );
}

/**
 * Garante que a requisição é de um admin autenticado.
 * Retorna `null` quando autorizado, ou uma resposta 401 quando não.
 */
export async function guardAdmin(): Promise<NextResponse | null> {
  if (await isAdmin()) return null;
  return jsonError("Não autorizado.", 401);
}

/** Executa um handler de service traduzindo exceções em respostas HTTP. */
export async function handle<T>(
  fn: () => Promise<T>,
  status = 200
): Promise<NextResponse> {
  try {
    const data = await fn();
    return NextResponse.json(data, { status, headers: NO_STORE_HEADERS });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Erro interno no servidor.";
    return jsonError(message, 500);
  }
}
