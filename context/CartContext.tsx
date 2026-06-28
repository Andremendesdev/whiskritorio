"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { apiSend } from "@/lib/api";
import {
  BURGER_EXTRAS,
  type CartItem,
  type CustomerInfo,
  getCartTotal,
  getItemCount,
  toCreateOrderInput,
} from "@/lib/cart";
import { isValidCpf } from "@/lib/cpf";
import { isWhiskritorioOpen } from "@/lib/opening-hours";
import type { Order } from "@/types";

interface AddProductInput {
  id: string;
  name: string;
  price: number;
  meta?: string;
}

export type CartView = "cart" | "finish";

interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  total: number;
  isOpen: boolean;
  cartView: CartView;
  confirmedAt: string | null;
  customer: CustomerInfo;
  orderConfirmed: boolean;
  openMenu: () => void;
  closeMenu: () => void;
  setCustomer: (field: keyof CustomerInfo, value: string) => void;
  addBurger: (product: AddProductInput) => void;
  removeItem: (cartId: string) => void;
  updateQuantity: (cartId: string, quantity: number) => void;
  toggleExtra: (cartId: string, extraId: string) => void;
  confirmOrder: () => Promise<{ ok: boolean; message: string }>;
  clearOrder: () => void;
  startNewOrder: () => void;
  toastMessage: string | null;
}

const CartContext = createContext<CartContextValue | null>(null);

const emptyCustomer: CustomerInfo = { name: "", phone: "", cpf: "", paymentMethod: "" };

function newCartId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [cartView, setCartView] = useState<CartView>("cart");
  const [confirmedAt, setConfirmedAt] = useState<string | null>(null);
  const [customer, setCustomerState] = useState<CustomerInfo>(emptyCustomer);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showAddToast = useCallback((productName: string) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToastMessage(`${productName} adicionado ao pedido`);
    toastTimerRef.current = setTimeout(() => {
      setToastMessage(null);
      toastTimerRef.current = null;
    }, 3200);
  }, []);

  const itemCount = useMemo(() => getItemCount(items), [items]);
  const total = useMemo(() => getCartTotal(items), [items]);

  const openMenu = useCallback(() => setIsOpen(true), []);

  const clearOrder = useCallback(() => {
    setItems([]);
    setCustomerState(emptyCustomer);
    setOrderConfirmed(false);
    setCartView("cart");
    setConfirmedAt(null);
  }, []);

  const closeMenu = useCallback(() => {
    setIsOpen(false);
    if (cartView === "finish") {
      clearOrder();
    }
  }, [cartView, clearOrder]);

  const startNewOrder = useCallback(() => {
    clearOrder();
    setIsOpen(false);
  }, [clearOrder]);

  const setCustomer = useCallback((field: keyof CustomerInfo, value: string) => {
    setCustomerState((prev) => ({ ...prev, [field]: value }));
  }, []);

  const addBurger = useCallback(
    (product: AddProductInput) => {
      setItems((prev) => [
        ...prev,
        {
          cartId: newCartId(),
          type: "burger",
          productId: product.id,
          name: product.name,
          basePrice: product.price,
          quantity: 1,
          extras: [],
          meta: product.meta,
        },
      ]);
      showAddToast(product.name);
      setOrderConfirmed(false);
      setCartView("cart");
      setConfirmedAt(null);
    },
    [showAddToast]
  );

  const removeItem = useCallback((cartId: string) => {
    setItems((prev) => prev.filter((i) => i.cartId !== cartId));
  }, []);

  const updateQuantity = useCallback((cartId: string, quantity: number) => {
    if (quantity < 1) {
      setItems((prev) => prev.filter((i) => i.cartId !== cartId));
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.cartId === cartId ? { ...i, quantity } : i))
    );
  }, []);

  const toggleExtra = useCallback((cartId: string, extraId: string) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.cartId !== cartId || item.type !== "burger") return item;
        const has = item.extras.some((e) => e.id === extraId);
        if (has) {
          return {
            ...item,
            extras: item.extras.filter((e) => e.id !== extraId),
          };
        }
        const extra = BURGER_EXTRAS.find((e) => e.id === extraId);
        if (!extra) return item;
        return { ...item, extras: [...item.extras, extra] };
      })
    );
  }, []);

  const confirmOrder = useCallback(async (): Promise<{ ok: boolean; message: string }> => {
    if (!isWhiskritorioOpen()) {
      return { ok: false, message: "Estamos fechado no momento." };
    }
    if (items.length === 0) {
      return { ok: false, message: "Não há nada selecionado." };
    }
    const name = customer.name.trim();
    const phone = customer.phone.trim();
    const cpf = customer.cpf.trim();
    if (!name || !phone || !cpf) {
      return { ok: false, message: "Preencha nome, telefone e CPF para confirmar." };
    }
    if (!isValidCpf(cpf)) {
      return { ok: false, message: "Informe um CPF válido." };
    }
    if (!customer.paymentMethod) {
      return { ok: false, message: "Selecione a forma de pagamento." };
    }

    try {
      const input = toCreateOrderInput(items, customer);
      const order = await apiSend<Order>("/api/orders", "POST", input);
      setItems([]);
      setCustomerState(emptyCustomer);
      setOrderConfirmed(true);
      setConfirmedAt(order.createdAt);
      setCartView("finish");
      return { ok: true, message: "Pedido confirmado! Em breve entraremos em contato." };
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Não foi possível enviar o pedido. Tente novamente.";
      return { ok: false, message };
    }
  }, [items, customer]);

  const value = useMemo(
    () => ({
      items,
      itemCount,
      total,
      isOpen,
      cartView,
      confirmedAt,
      customer,
      orderConfirmed,
      openMenu,
      closeMenu,
      setCustomer,
      addBurger,
      removeItem,
      updateQuantity,
      toggleExtra,
      confirmOrder,
      clearOrder,
      startNewOrder,
      toastMessage,
    }),
    [
      items,
      itemCount,
      total,
      isOpen,
      cartView,
      confirmedAt,
      customer,
      orderConfirmed,
      openMenu,
      closeMenu,
      setCustomer,
      addBurger,
      removeItem,
      updateQuantity,
      toggleExtra,
      confirmOrder,
      clearOrder,
      startNewOrder,
      toastMessage,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart deve ser usado dentro de CartProvider");
  return ctx;
}
