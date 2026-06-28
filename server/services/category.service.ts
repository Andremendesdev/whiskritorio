import { prisma } from "@/lib/prisma";
import { toCategoryDTO } from "@/server/mappers";
import type { Category } from "@/types";

export const categoryService = {
  async list(): Promise<Category[]> {
    const rows = await prisma.category.findMany({ orderBy: { name: "asc" } });
    return rows.map(toCategoryDTO);
  },

  async create(input: { name: string; slug: string }): Promise<Category> {
    const row = await prisma.category.create({ data: input });
    return toCategoryDTO(row);
  },
};
