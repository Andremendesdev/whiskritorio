import { DEMO_HERO_IMAGE, isDemoImagesEnabled } from "@/lib/demo-images";
import type { Product } from "@/types";

const DEMO_NOW = "2026-01-01T00:00:00.000Z";

/** Catálogo estático — vitrine quando o banco está vazio ou indisponível. */
export const DEMO_CATALOG: Product[] = [
  {
    id: "demo-whisky-red",
    name: "Whisky Red Label 750ml",
    description: "Whisky escocês blend, ideal para drinks ou puro com gelo.",
    price: 89.9,
    originalPrice: 109.9,
    category: "premium",
    categoryId: "demo-premium",
    imageUrl: DEMO_HERO_IMAGE,
    active: true,
    createdAt: DEMO_NOW,
  },
  {
    id: "demo-gin",
    name: "Gin London Dry 750ml",
    description: "Gin seco e aromático para gin tônica clássica.",
    price: 74.9,
    originalPrice: null,
    category: "premium",
    categoryId: "demo-premium",
    imageUrl: DEMO_HERO_IMAGE,
    active: true,
    createdAt: DEMO_NOW,
  },
  {
    id: "demo-vodka",
    name: "Vodka Premium 1L",
    description: "Vodka destilada, versátil para coquetéis e drinks.",
    price: 59.9,
    originalPrice: 69.9,
    category: "classico",
    categoryId: "demo-classico",
    imageUrl: DEMO_HERO_IMAGE,
    active: true,
    createdAt: DEMO_NOW,
  },
  {
    id: "demo-espumante",
    name: "Espumante Brut 750ml",
    description: "Espumante seco, perfeito para brindes e ocasiões especiais.",
    price: 49.9,
    originalPrice: null,
    category: "especial",
    categoryId: "demo-especial",
    imageUrl: DEMO_HERO_IMAGE,
    active: true,
    createdAt: DEMO_NOW,
  },
  {
    id: "demo-cerveja",
    name: "Cerveja Artesanal IPA 6un",
    description: "Pack com 6 latas geladas, amargor equilibrado.",
    price: 39.9,
    originalPrice: 44.9,
    category: "classico",
    categoryId: "demo-classico",
    imageUrl: DEMO_HERO_IMAGE,
    active: true,
    createdAt: DEMO_NOW,
  },
  {
    id: "demo-combo",
    name: "Combo Bar Premium",
    description: "Whisky + gin + mixer + gelo. Tudo para a noite perfeita.",
    price: 149.9,
    originalPrice: 179.9,
    category: "combo",
    categoryId: "demo-combo",
    imageUrl: DEMO_HERO_IMAGE,
    active: true,
    createdAt: DEMO_NOW,
  },
  {
    id: "demo-rum",
    name: "Rum Envelhecido 700ml",
    description: "Rum com notas de baunilha e caramelo, excelente puro.",
    price: 64.9,
    originalPrice: null,
    category: "especial",
    categoryId: "demo-especial",
    imageUrl: DEMO_HERO_IMAGE,
    active: true,
    createdAt: DEMO_NOW,
  },
  {
    id: "demo-tequila",
    name: "Tequila Reposado 750ml",
    description: "Tequila reposada, suave e ideal para margaritas.",
    price: 99.9,
    originalPrice: 119.9,
    category: "premium",
    categoryId: "demo-premium",
    imageUrl: DEMO_HERO_IMAGE,
    active: true,
    createdAt: DEMO_NOW,
  },
];

export function getDemoCatalog(): Product[] {
  return DEMO_CATALOG;
}

export function shouldUseDemoCatalog(): boolean {
  return isDemoImagesEnabled();
}
