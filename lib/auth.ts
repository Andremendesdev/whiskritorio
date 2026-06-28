import { cookies } from "next/headers";

export const ADMIN_COOKIE = "whiskritorio_admin";
export const ADMIN_COOKIE_VALUE = "authenticated";

/** Verifica se a requisição atual tem sessão de admin válida. */
export async function isAdmin(): Promise<boolean> {
  const store = await cookies();
  return store.get(ADMIN_COOKIE)?.value === ADMIN_COOKIE_VALUE;
}
