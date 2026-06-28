import type { Order, PaymentMethod } from "@/types";

const ESC = "\x1B";
const GS = "\x1D";

const paymentLabels: Record<PaymentMethod, string> = {
  pix: "PIX",
  dinheiro: "Dinheiro",
  cartao: "Cartão",
};

function money(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function line(text: string, width = 32): string {
  if (text.length <= width) return text;
  return text.slice(0, width - 1) + "…";
}

function divider(width = 32): string {
  return "-".repeat(width);
}

export function formatOrderTicket(order: Order): string {
  const createdAt = new Date(order.createdAt).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const payment = order.paymentMethod
    ? paymentLabels[order.paymentMethod]
    : "Não informado";

  const lines: string[] = [
    `${ESC}@`,
    `${ESC}a\x01`,
    "WHISKRITÓRIO",
    "COZINHA",
    `${ESC}a\x00`,
    divider(),
    `Pedido: ${line(order.id, 24)}`,
    `Data: ${createdAt}`,
    divider(),
    `Cliente: ${line(order.customerName, 23)}`,
    `Tel: ${line(order.phone, 27)}`,
    `Pagamento: ${line(payment, 21)}`,
    divider(),
    "ITENS",
  ];

  for (const item of order.items) {
    const subtotal = item.price * item.quantity;
    lines.push(line(`${item.quantity}x ${item.name}`, 32));
    lines.push(line(`   ${money(subtotal)}`, 32));
  }

  lines.push(
    divider(),
    `TOTAL: ${money(order.total)}`,
    divider(),
    "",
    "",
    `${GS}V\x00`
  );

  return lines.join("\n");
}
