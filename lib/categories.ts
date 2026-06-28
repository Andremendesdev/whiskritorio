/** Categorias do cardápio — fonte única para admin e site. */
export const PRODUCT_CATEGORIES = [
  { slug: "classico", label: "Clássico", labelPlural: "Clássicos" },
  { slug: "premium", label: "Premium", labelPlural: "Premium" },
  { slug: "especial", label: "Especial", labelPlural: "Especiais" },
  { slug: "vegano", label: "Vegano", labelPlural: "Veganos" },
  { slug: "combo", label: "Combo", labelPlural: "Combos" },
] as const;

export type ProductCategorySlug = (typeof PRODUCT_CATEGORIES)[number]["slug"];

const labelBySlug = new Map<string, string>(
  PRODUCT_CATEGORIES.map((c) => [c.slug, c.label])
);
const labelPluralBySlug = new Map<string, string>(
  PRODUCT_CATEGORIES.map((c) => [c.slug, c.labelPlural])
);

/** Rótulo singular (admin, badges). */
export function categoryLabel(slug: string): string {
  return labelBySlug.get(slug) ?? slug.charAt(0).toUpperCase() + slug.slice(1);
}

/** Rótulo plural (pills do cardápio). */
export function categoryLabelPlural(slug: string): string {
  return labelPluralBySlug.get(slug) ?? categoryLabel(slug);
}

/** Mapa slug → rótulo plural para compatibilidade com BurgersSection. */
export const CATEGORY_LABELS: Record<string, string> = Object.fromEntries(
  PRODUCT_CATEGORIES.map((c) => [c.slug, c.labelPlural])
);

/** Filtros do admin: Todas + cada categoria. */
export const ADMIN_CATEGORY_FILTERS = [
  { value: "", label: "Todas" },
  ...PRODUCT_CATEGORIES.map((c) => ({ value: c.slug, label: c.label })),
] as const;
