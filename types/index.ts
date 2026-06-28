/**
 * DTOs compartilhados entre client e server.
 *
 * Importante: este arquivo NÃO importa `@prisma/client`. Assim os components
 * de UI podem usar os tipos sem arrastar o Prisma para o bundle do browser.
 * Os services no servidor convertem as entidades do Prisma para estes DTOs.
 */

export const ORDER_STATUSES = ["pending", "preparing", "delivered"] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const ORDER_PRINT_STATUSES = ["pending", "printed", "failed"] as const;
export type OrderPrintStatus = (typeof ORDER_PRINT_STATUSES)[number];

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  /** Preço cheio "de" — quando maior que `price`, a UI exibe risco + % de desconto. */
  originalPrice: number | null;
  /** Slug da categoria (ex.: "classico"). */
  category: string;
  categoryId: string;
  imageUrl: string;
  active: boolean;
  createdAt: string;
}

/** Dados aceitos ao criar/editar um produto. */
export interface ProductInput {
  name: string;
  description: string;
  price: number;
  /** Preço cheio "de" (opcional). Maior que `price` ativa o desconto. */
  originalPrice?: number | null;
  /** Slug da categoria. */
  category: string;
  imageUrl: string;
  active: boolean;
}

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export type PaymentMethod = "pix" | "dinheiro" | "cartao";

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  paymentMethod: PaymentMethod | null;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  printStatus: OrderPrintStatus;
  printedAt: string | null;
  createdAt: string;
}

/** Item enviado ao criar um pedido. */
export interface OrderItemInput {
  productId?: string;
  name: string;
  quantity: number;
  price: number;
}

/** Dados aceitos ao criar um pedido. */
export interface CreateOrderInput {
  customerName: string;
  phone: string;
  paymentMethod: PaymentMethod;
  items: OrderItemInput[];
}

export interface Event {
  id: string;
  band: string;
  genre: string;
  description: string;
  imageUrl: string;
  startsAt: string;
  day: string;
  month: string;
  weekday: string;
  time: string;
  ticketUrl: string | null;
  active: boolean;
}

/** Dados aceitos ao criar/editar um show. */
export interface EventInput {
  band: string;
  genre: string;
  description: string;
  imageUrl: string;
  startsAt: string;
  ticketUrl: string;
  active: boolean;
}
