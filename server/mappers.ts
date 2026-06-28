import type {
  Category as PrismaCategory,
  Event as PrismaEvent,
  Order as PrismaOrder,
  OrderItem as PrismaOrderItem,
  Product as PrismaProduct,
} from "@prisma/client";
import { formatEventDisplay } from "@/lib/datetime";
import { demoImageForProduct, isDemoImagesEnabled } from "@/lib/demo-images";
import type { Category, Event, Order, OrderItem, Product } from "@/types";

type ProductWithCategory = PrismaProduct & { category: PrismaCategory };
type OrderWithItems = PrismaOrder & { items: PrismaOrderItem[] };

export function toCategoryDTO(category: PrismaCategory): Category {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
  };
}

export function toProductDTO(product: ProductWithCategory): Product {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: Number(product.price),
    originalPrice: product.originalPrice != null ? Number(product.originalPrice) : null,
    category: product.category.slug,
    categoryId: product.categoryId,
    imageUrl: isDemoImagesEnabled()
      ? demoImageForProduct(product.id)
      : (product.imageUrl ?? ""),
    active: product.active,
    createdAt: product.createdAt.toISOString(),
  };
}

export function toOrderItemDTO(item: PrismaOrderItem): OrderItem {
  return {
    id: item.id,
    name: item.name,
    quantity: item.quantity,
    price: Number(item.price),
  };
}

export function toOrderDTO(order: OrderWithItems): Order {
  return {
    id: order.id,
    customerName: order.customerName,
    phone: order.phone,
    paymentMethod: (order.paymentMethod as Order["paymentMethod"]) ?? null,
    items: order.items.map(toOrderItemDTO),
    total: Number(order.total),
    status: order.status,
    printStatus: order.printStatus,
    printedAt: order.printedAt?.toISOString() ?? null,
    createdAt: order.createdAt.toISOString(),
  };
}

export function toEventDTO(event: PrismaEvent): Event {
  const display = formatEventDisplay(event.startsAt.toISOString());

  return {
    id: event.id,
    band: event.band,
    genre: event.genre,
    description: event.description,
    imageUrl: event.imageUrl ?? "",
    startsAt: event.startsAt.toISOString(),
    day: display.day,
    month: display.month,
    weekday: display.weekday,
    time: display.time,
    ticketUrl: event.ticketUrl,
    active: event.active,
  };
}
