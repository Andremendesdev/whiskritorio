/**
 * Helpers de fetch para o client. Centralizam o parsing de JSON e o
 * tratamento de erros para que os hooks fiquem enxutos.
 */

async function parse<T>(response: Response): Promise<T> {
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const message =
      (data as { message?: string } | null)?.message ??
      "Erro ao comunicar com o servidor.";
    throw new Error(message);
  }
  return data as T;
}

export async function apiGet<T>(url: string): Promise<T> {
  const separator = url.includes("?") ? "&" : "?";
  const freshUrl = `${url}${separator}_=${Date.now()}`;
  const response = await fetch(freshUrl, {
    cache: "no-store",
    headers: {
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
    },
  });
  return parse<T>(response);
}

export async function apiSend<T>(
  url: string,
  method: "POST" | "PUT" | "PATCH" | "DELETE",
  body?: unknown
): Promise<T> {
  const response = await fetch(url, {
    method,
    cache: "no-store",
    headers: {
      ...(body ? { "Content-Type": "application/json" } : {}),
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  return parse<T>(response);
}
