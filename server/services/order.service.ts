import { prisma } from "@/lib/prisma";
import { toOrderDTO } from "@/server/mappers";
import type { CreateOrderInput, Order, OrderPrintStatus, OrderStatus } from "@/types";

const withItems = { items: true } as const;

export const orderService = {
  async list(): Promise<Order[]> {
    const rows = await prisma.order.findMany({
      include: withItems,
      orderBy: { createdAt: "desc" },
    });
    return rows.map(toOrderDTO);
  },

  async getById(id: string): Promise<Order | null> {
    const row = await prisma.order.findUnique({
      where: { id },
      include: withItems,
    });
    return row ? toOrderDTO(row) : null;
  },

  async create(input: CreateOrderInput): Promise<Order> {
    const total = input.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const row = await prisma.order.create({
      data: {
        customerName: input.customerName,
        phone: input.phone,
        paymentMethod: input.paymentMethod,
        total,
        items: {
          create: input.items.map((item) => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            productId: item.productId ?? null,
          })),
        },
      },
      include: withItems,
    });
    return toOrderDTO(row);
  },

  async updateStatus(id: string, status: OrderStatus): Promise<Order> {
    const row = await prisma.order.update({
      where: { id },
      data: { status },
      include: withItems,
    });
    return toOrderDTO(row);
  },

  async updatePrintStatus(id: string, printStatus: OrderPrintStatus): Promise<Order> {
    const row = await prisma.order.update({
      where: { id },
      data: {
        printStatus,
        printedAt: printStatus === "printed" ? new Date() : null,
      },
      include: withItems,
    });
    return toOrderDTO(row);
  },
};
