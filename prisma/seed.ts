import { PrismaClient, type Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const categories: Prisma.CategoryCreateInput[] = [
  { name: "Bebidas", slug: "bebidas" },
  { name: "Mercearia", slug: "mercearia" },
  { name: "Frios", slug: "frios" },
  { name: "Higiene", slug: "higiene" },
  { name: "Combo", slug: "combo" },
];

const products: Array<{
  name: string;
  description: string;
  price: number;
  categorySlug: string;
  imageUrl: string;
}> = [
  {
    name: "Refrigerante 2L",
    description: "Refrigerante gelado, diversos sabores disponíveis.",
    price: 12.9,
    categorySlug: "bebidas",
    imageUrl:
      "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600&q=85&auto=format&fit=crop",
  },
  {
    name: "Cerveja Lata 350ml",
    description: "Cerveja gelada, ideal para o dia a dia.",
    price: 4.5,
    categorySlug: "bebidas",
    imageUrl:
      "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=600&q=85&auto=format&fit=crop",
  },
  {
    name: "Arroz 5kg",
    description: "Arroz tipo 1, pacote de 5kg.",
    price: 28.9,
    categorySlug: "mercearia",
    imageUrl:
      "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&q=85&auto=format&fit=crop",
  },
  {
    name: "Feijão 1kg",
    description: "Feijão carioca, pacote de 1kg.",
    price: 8.9,
    categorySlug: "mercearia",
    imageUrl:
      "https://images.unsplash.com/photo-1584270354949-c26b0d646042?w=600&q=85&auto=format&fit=crop",
  },
  {
    name: "Combo Churrasco",
    description: "Carvão + linguiça + refrigerante 2L. Tudo para o fim de semana.",
    price: 49.9,
    categorySlug: "combo",
    imageUrl:
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=85&auto=format&fit=crop",
  },
];

async function main() {
  // 1) Admin
  const email = process.env.ADMIN_EMAIL ?? "admin@whiskritorio.com";
  const password = process.env.ADMIN_PASSWORD ?? "whiskritorio123";
  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.upsert({
    where: { email },
    update: {},
    create: { email, password: passwordHash, name: "Admin Whiskritório", role: "ADMIN" },
  });
  console.log(`✓ Admin garantido: ${email}`);

  // 2) Categorias
  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: { name: category.name },
      create: category,
    });
  }
  console.log(`✓ ${categories.length} categorias`);

  // 3) Produtos
  const categoryBySlug = new Map(
    (await prisma.category.findMany()).map((c) => [c.slug, c.id])
  );

  for (const product of products) {
    const categoryId = categoryBySlug.get(product.categorySlug);
    if (!categoryId) continue;

    const existing = await prisma.product.findFirst({ where: { name: product.name } });
    const data = {
      name: product.name,
      description: product.description,
      price: product.price,
      imageUrl: product.imageUrl,
      active: true,
      categoryId,
    };

    if (existing) {
      await prisma.product.update({ where: { id: existing.id }, data });
    } else {
      await prisma.product.create({ data });
    }
  }
  console.log(`✓ ${products.length} produtos`);

  // 4) Remove eventos de exemplo (agenda gerenciada pelo admin)
  const removed = await prisma.event.deleteMany({
    where: {
      band: { in: ["Dead Signal", "Neon Wolves", "Blackout Trio"] },
    },
  });
  if (removed.count > 0) {
    console.log(`✓ ${removed.count} eventos de exemplo removidos`);
  }

  // 5) Pedido de exemplo
  const refrigerante = await prisma.product.findFirst({ where: { name: "Refrigerante 2L" } });
  if (refrigerante) {
    const hasOrders = await prisma.order.count();
    if (hasOrders === 0) {
      await prisma.order.create({
        data: {
          customerName: "Rafael Martins",
          phone: "(11) 98888-1010",
          status: "delivered",
          total: Number(refrigerante.price) * 2,
          items: {
            create: [
              {
                productId: refrigerante.id,
                name: refrigerante.name,
                quantity: 2,
                price: Number(refrigerante.price),
              },
            ],
          },
        },
      });
      console.log("✓ Pedido de exemplo criado");
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
