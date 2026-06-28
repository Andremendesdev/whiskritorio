import { prisma } from "@/lib/prisma";
import { toProductDTO } from "@/server/mappers";
import type { Product, ProductInput } from "@/types";

const withCategory = { category: true } as const;

async function resolveCategoryId(slug: string): Promise<string> {
  const category = await prisma.category.findUnique({ where: { slug } });
  if (!category) {
    throw new Error(`Categoria "${slug}" não encontrada.`);
  }
  return category.id;
}

/** Só mantém o preço cheio quando ele realmente representa um desconto. */
function normalizeOriginalPrice(input: ProductInput): number | null {
  const original = input.originalPrice;
  if (original == null || !Number.isFinite(original) || original <= input.price) {
    return null;
  }
  return original;
}

export const productService = {
  async list(): Promise<Product[]> {
    const rows = await prisma.product.findMany({
      include: withCategory,
      orderBy: { name: "asc" },
    });
    return rows.map(toProductDTO);
  },

  /** Apenas produtos ativos — usado pela vitrine pública. */
  async listActive(): Promise<Product[]> {
    const rows = await prisma.product.findMany({
      where: { active: true },
      include: withCategory,
      orderBy: { name: "asc" },
    });
    return rows.map(toProductDTO);
  },

  async getById(id: string): Promise<Product | null> {
    const row = await prisma.product.findUnique({
      where: { id },
      include: withCategory,
    });
    return row ? toProductDTO(row) : null;
  },

  async create(input: ProductInput): Promise<Product> {
    const categoryId = await resolveCategoryId(input.category);
    const row = await prisma.product.create({
      data: {
        name: input.name,
        description: input.description,
        price: input.price,
        originalPrice: normalizeOriginalPrice(input),
        imageUrl: input.imageUrl || null,
        active: input.active,
        categoryId,
      },
      include: withCategory,
    });
    return toProductDTO(row);
  },

  async update(id: string, input: ProductInput): Promise<Product> {
    const categoryId = await resolveCategoryId(input.category);
    const row = await prisma.product.update({
      where: { id },
      data: {
        name: input.name,
        description: input.description,
        price: input.price,
        originalPrice: normalizeOriginalPrice(input),
        imageUrl: input.imageUrl || null,
        active: input.active,
        categoryId,
      },
      include: withCategory,
    });
    return toProductDTO(row);
  },

  async remove(id: string): Promise<void> {
    await prisma.product.delete({ where: { id } });
  },
};
