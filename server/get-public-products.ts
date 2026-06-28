import { getDemoCatalog, shouldUseDemoCatalog } from "@/lib/demo-catalog";
import { productService } from "@/server/services/product.service";
import type { Product } from "@/types";

/** Produtos da vitrine pública — usa catálogo demo se o banco falhar ou estiver vazio. */
export async function getPublicProducts(): Promise<Product[]> {
  try {
    const fromDb = await productService.listActive();
    if (fromDb.length > 0) return fromDb;
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[catalog] Banco indisponível, tentando fallback demo.", error);
    }
  }

  if (shouldUseDemoCatalog()) {
    return getDemoCatalog();
  }

  return [];
}
