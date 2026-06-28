import type { CreateOrderInput, PaymentMethod } from "@/types";

export type { PaymentMethod };

export type CartItemType = "burger";

export interface CartExtra {
  id: string;
  name: string;
  price: number;
}

export interface CartItem {
  cartId: string;
  type: CartItemType;
  productId: string;
  name: string;
  basePrice: number;
  quantity: number;
  extras: CartExtra[];
  meta?: string;
}

export const PAYMENT_METHODS: { id: PaymentMethod; label: string }[] = [
  { id: "pix", label: "Pix" },
  { id: "dinheiro", label: "Dinheiro" },
  { id: "cartao", label: "Cartão Débito ou crédito" },
];

export interface CustomerInfo {
  name: string;
  phone: string;
  cpf: string;
  paymentMethod: PaymentMethod | "";
}

export const BURGER_EXTRAS: CartExtra[] = [
  { id: "cheddar", name: "Cheddar extra", price: 4.5 },
  { id: "bacon", name: "Bacon extra", price: 6 },
  { id: "egg", name: "Ovo", price: 3 },
  { id: "onion", name: "Cebola caramelizada", price: 3.5 },
  { id: "pickles", name: "Pickles", price: 2.5 },
];

export function formatPrice(value: number): string {
  return `R$ ${value.toFixed(2).replace(".", ",")}`;
}

export function getUnitPrice(item: CartItem): number {
  const extrasTotal = item.extras.reduce((sum, e) => sum + e.price, 0);
  return item.basePrice + extrasTotal;
}

export function getLineTotal(item: CartItem): number {
  return getUnitPrice(item) * item.quantity;
}

function formatOrderItemName(item: CartItem): string {
  if (item.extras.length === 0) return item.name;
  const extrasLabel = item.extras.map((e) => e.name).join(", ");
  return `${item.name} (${extrasLabel})`;
}

/** Converte carrinho + cliente para o payload da API de pedidos. */
export function toCreateOrderInput(
  items: CartItem[],
  customer: CustomerInfo
): CreateOrderInput {
  return {
    customerName: customer.name.trim(),
    phone: customer.phone.trim(),
    paymentMethod: customer.paymentMethod as PaymentMethod,
    items: items.map((item) => ({
      productId: item.productId,
      name: formatOrderItemName(item),
      quantity: item.quantity,
      price: getUnitPrice(item),
    })),
  };
}

export function getCartTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + getLineTotal(item), 0);
}

export function getItemCount(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}
