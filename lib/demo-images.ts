/**
 * Modo demo: uma única imagem premium em produtos e seção Conheça o Local.
 *
 * Ativar: NEXT_PUBLIC_DEMO_IMAGES=true no .env e reiniciar o dev server.
 * Desativar: false ou remover a variável.
 */

export const DEMO_HERO_IMAGE = "/demo/local-01.jpg";

export function isDemoImagesEnabled(): boolean {
  const raw =
    process.env.NEXT_PUBLIC_DEMO_IMAGES ?? process.env.DEMO_IMAGES ?? "";
  return raw.trim().toLowerCase() === "true";
}

export function demoImageForProduct(_productId: string): string {
  return DEMO_HERO_IMAGE;
}

export function resolveProductImageUrl(product: {
  id: string;
  imageUrl: string;
}): string {
  if (isDemoImagesEnabled()) {
    return DEMO_HERO_IMAGE;
  }
  return product.imageUrl;
}

export type LocalPhoto = {
  id: number;
  src: string;
  alt: string;
  label: string;
  className: string;
  sizes: string;
};

/** Fotos reais da loja (modo normal). */
export const STORE_LOCAL_PHOTOS: LocalPhoto[] = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=800&q=85&auto=format&fit=crop",
    alt: "Prateleiras organizadas da Whiskritório com produtos variados",
    label: "Loja principal",
    className: "md:col-span-2 md:row-span-2",
    sizes: "(max-width: 768px) 50vw, 33vw",
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1578916171728-46686e6858c4?w=600&q=85&auto=format&fit=crop",
    alt: "Corredor de bebidas geladas na Whiskritório",
    label: "Bebidas geladas",
    className: "",
    sizes: "(max-width: 768px) 50vw, 17vw",
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&q=85&auto=format&fit=crop",
    alt: "Seção de hortifruti e mercearia fresca",
    label: "Mercearia fresca",
    className: "",
    sizes: "(max-width: 768px) 50vw, 17vw",
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1583258292688-d0213dc5a3bb?w=800&q=85&auto=format&fit=crop",
    alt: "Balcão de atendimento da conveniência Whiskritório",
    label: "Atendimento",
    className: "md:col-span-2",
    sizes: "(max-width: 768px) 100vw, 50vw",
  },
];

const DEMO_LOCAL_LABELS = [
  { label: "Adega premium", className: "md:col-span-2 md:row-span-2", sizes: "(max-width: 768px) 50vw, 33vw" },
  { label: "Garrafas selecionadas", className: "", sizes: "(max-width: 768px) 50vw, 17vw" },
  { label: "Destilados premium", className: "", sizes: "(max-width: 768px) 50vw, 17vw" },
  { label: "Salão do bar", className: "md:col-span-2", sizes: "(max-width: 768px) 100vw, 50vw" },
] as const;

/** Modo demo — mesma imagem em todos os slots da grade. */
export const DEMO_LOCAL_PHOTOS: LocalPhoto[] = DEMO_LOCAL_LABELS.map((item, i) => ({
  id: i + 1,
  src: DEMO_HERO_IMAGE,
  alt: "Garrafas premium de whisky e destilados com iluminação dourada",
  label: item.label,
  className: item.className,
  sizes: item.sizes,
}));

export function getLocalPhotos(): LocalPhoto[] {
  return isDemoImagesEnabled() ? DEMO_LOCAL_PHOTOS : STORE_LOCAL_PHOTOS;
}
