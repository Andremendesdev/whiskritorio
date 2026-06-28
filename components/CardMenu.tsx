"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import {
  BURGER_EXTRAS,
  formatPrice,
  getLineTotal,
  PAYMENT_METHODS,
  type CartItem,
} from "@/lib/cart";
import { formatCpf, isValidCpf, stripCpf } from "@/lib/cpf";
import { PixPaymentBlock } from "@/components/PixPaymentBlock";
import { CartFinishView } from "@/components/CartFinishView";

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

function CartLineItem({
  item,
  onRemove,
  onQty,
  onToggleExtra,
}: {
  item: CartItem;
  onRemove: () => void;
  onQty: (q: number) => void;
  onToggleExtra: (extraId: string) => void;
}) {
  return (
    <div
      className="rounded-2xl p-4"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0 flex-1">
          <span
            className="text-[10px] uppercase tracking-[0.15em] font-semibold"
            style={{ color: item.type === "burger" ? "var(--neon)" : "#a1a1aa" }}
          >
            {item.type === "burger" ? "Hambúrguer" : "Cerveja"}
          </span>
          <h4
            className="text-white uppercase leading-tight mt-0.5 truncate"
            style={{ fontFamily: "var(--font-bebas)", fontSize: "1.25rem", letterSpacing: "0.04em" }}
          >
            {item.name}
          </h4>
          {item.meta && (
            <p className="text-[10px] text-zinc-600 mt-0.5">{item.meta}</p>
          )}
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="shrink-0 p-1.5 rounded-lg text-zinc-600 hover:text-red-400 transition-colors"
          aria-label={`Remover ${item.name}`}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {item.type === "burger" && (
        <div className="mb-3">
          <p className="text-[10px] uppercase tracking-[0.12em] text-zinc-600 mb-2">
            Adicionais
          </p>
          <div className="flex flex-wrap gap-1.5">
            {BURGER_EXTRAS.map((extra) => {
              const active = item.extras.some((e) => e.id === extra.id);
              return (
                <button
                  key={extra.id}
                  type="button"
                  onClick={() => onToggleExtra(extra.id)}
                  className="text-[10px] font-semibold px-2.5 py-1 rounded-full transition-all duration-200"
                  style={
                    active
                      ? {
                          background: "var(--neon)",
                          color: "#000",
                          boxShadow: "0 0 12px rgb(var(--neon-rgb) / 0.25)",
                        }
                      : {
                          background: "rgba(255,255,255,0.05)",
                          color: "#71717a",
                          border: "1px solid rgba(255,255,255,0.08)",
                        }
                  }
                >
                  {extra.name} +{formatPrice(extra.price).replace("R$ ", "")}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onQty(item.quantity - 1)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
            aria-label="Diminuir quantidade"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="w-6 text-center text-sm font-bold text-white">{item.quantity}</span>
          <button
            type="button"
            onClick={() => onQty(item.quantity + 1)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-black transition-colors"
            style={{ background: "var(--neon)" }}
            aria-label="Aumentar quantidade"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
        <span
          className="text-lg font-black"
          style={{ fontFamily: "var(--font-bebas)", color: "var(--neon)" }}
        >
          {formatPrice(getLineTotal(item))}
        </span>
      </div>
    </div>
  );
}

export function CardMenu() {
  const {
    items,
    total,
    isOpen,
    cartView,
    confirmedAt,
    customer,
    closeMenu,
    setCustomer,
    removeItem,
    updateQuantity,
    toggleExtra,
    confirmOrder,
    startNewOrder,
  } = useCart();

  const isFinishView = cartView === "finish" && confirmedAt;

  const [feedback, setFeedback] = useState<string | null>(null);
  const [cpfTouched, setCpfTouched] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [pixExpired, setPixExpired] = useState(false);
  const isEmpty = items.length === 0;
  const isPix = customer.paymentMethod === "pix";

  const cpfDigits = stripCpf(customer.cpf);
  const cpfComplete = cpfDigits.length === 11;
  const cpfInvalid =
    (cpfTouched || feedback === "Informe um CPF válido.") &&
    cpfComplete &&
    !isValidCpf(customer.cpf);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) setCpfTouched(false);
  }, [isOpen]);

  useEffect(() => {
    if (!isPix) setPixExpired(false);
  }, [isPix]);

  const closedMessage = "Estamos fechado no momento.";
  const pixExpiredMessage = "O código Pix expirou. Gere um novo código.";

  const handleConfirm = async () => {
    if (submitting) return;
    if (isPix && pixExpired) {
      setFeedback(pixExpiredMessage);
      return;
    }
    if (cpfDigits.length > 0) setCpfTouched(true);
    setSubmitting(true);
    setFeedback(null);
    try {
      const result = await confirmOrder();
      if (!result.ok) {
        setFeedback(result.message);
      } else {
        setFeedback(null);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeMenu}
            aria-hidden
          />

          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-labelledby="card-menu-title"
            className="fixed top-0 right-0 bottom-0 z-50 flex flex-col w-full max-w-md shadow-2xl"
            style={{
              background: "var(--surface)",
              borderLeft: "1px solid rgb(var(--neon-rgb) / 0.12)",
            }}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            {/* header */}
            <div
              className="flex items-center justify-between px-6 py-5 shrink-0"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{
                    background: "rgb(var(--neon-rgb) / 0.1)",
                    border: "1px solid rgb(var(--neon-rgb) / 0.2)",
                  }}
                >
                  <ShoppingBag className="w-5 h-5 text-[var(--neon)]" strokeWidth={2} />
                </div>
                <div>
                  <h2
                    id="card-menu-title"
                    className="text-white uppercase leading-none"
                    style={{ fontFamily: "var(--font-bebas)", fontSize: "1.5rem", letterSpacing: "0.06em" }}
                  >
                    {isFinishView ? "Finalizado" : "Seu Pedido"}
                  </h2>
                  <p className="text-[10px] text-zinc-600 uppercase tracking-[0.15em] mt-0.5">
                    Whiskritório
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={closeMenu}
                className="w-9 h-9 rounded-full flex items-center justify-center text-zinc-500 hover:text-white transition-colors"
                style={{ background: "rgba(255,255,255,0.05)" }}
                aria-label="Fechar pedido"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* body */}
            {isFinishView ? (
              <CartFinishView confirmedAt={confirmedAt} onNewOrder={startNewOrder} />
            ) : (
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
              {isEmpty ? (
                <div className="flex flex-col items-center justify-center text-center py-16 px-4">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    <ShoppingBag className="w-8 h-8 text-zinc-700" strokeWidth={1.5} />
                  </div>
                  <p
                    className="text-white uppercase mb-2"
                    style={{ fontFamily: "var(--font-bebas)", fontSize: "1.35rem", letterSpacing: "0.04em" }}
                  >
                    Não há nada selecionado
                  </p>
                  <p className="text-sm text-zinc-500 max-w-[240px] leading-relaxed">
                    Adicione hambúrgueres do cardápio para montar seu pedido.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {items.map((item) => (
                    <CartLineItem
                      key={item.cartId}
                      item={item}
                      onRemove={() => removeItem(item.cartId)}
                      onQty={(q) => updateQuantity(item.cartId, q)}
                      onToggleExtra={(id) => toggleExtra(item.cartId, id)}
                    />
                  ))}
                </div>
              )}

              {/* dados do cliente */}
              <div
                className="rounded-2xl p-5 space-y-4"
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-semibold">
                  Seus dados
                </p>

                <label className="block">
                  <span className="text-[11px] text-zinc-600 uppercase tracking-[0.1em] mb-1.5 block">
                    Nome completo
                  </span>
                  <input
                    type="text"
                    value={customer.name}
                    onChange={(e) => setCustomer("name", e.target.value)}
                    placeholder="Seu nome"
                    className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder:text-zinc-600 outline-none transition-colors focus:ring-1 focus:ring-[var(--neon)]/50"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }}
                  />
                </label>

                <label className="block">
                  <span className="text-[11px] text-zinc-600 uppercase tracking-[0.1em] mb-1.5 block">
                    Telefone
                  </span>
                  <input
                    type="tel"
                    value={customer.phone}
                    onChange={(e) => setCustomer("phone", e.target.value)}
                    placeholder="(00) 00000-0000"
                    className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder:text-zinc-600 outline-none transition-colors focus:ring-1 focus:ring-[var(--neon)]/50"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }}
                  />
                </label>

                <label className="block">
                  <span className="text-[11px] text-zinc-600 uppercase tracking-[0.1em] mb-1.5 block">
                    CPF
                  </span>
                  <input
                    type="text"
                    inputMode="numeric"
                    autoComplete="off"
                    value={customer.cpf}
                    onChange={(e) => setCustomer("cpf", formatCpf(e.target.value))}
                    onBlur={() => {
                      if (cpfDigits.length > 0) setCpfTouched(true);
                    }}
                    placeholder="000.000.000-00"
                    aria-invalid={cpfInvalid}
                    aria-describedby={cpfInvalid ? "cpf-error" : undefined}
                    maxLength={14}
                    className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder:text-zinc-600 outline-none transition-colors focus:ring-1 focus:ring-[var(--neon)]/50"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: cpfInvalid
                        ? "1px solid rgba(248,113,113,0.6)"
                        : "1px solid rgba(255,255,255,0.08)",
                    }}
                  />
                  {cpfInvalid && (
                    <p id="cpf-error" className="mt-1.5 text-xs text-[#f87171]">
                      CPF inválido. Verifique os números digitados.
                    </p>
                  )}
                </label>

                <div>
                  <span className="text-[11px] text-zinc-600 uppercase tracking-[0.1em] mb-1.5 block">
                    Forma de Pagamento
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {PAYMENT_METHODS.map((method) => {
                      const active = customer.paymentMethod === method.id;
                      return (
                        <button
                          key={method.id}
                          type="button"
                          onClick={() => setCustomer("paymentMethod", method.id)}
                          className="text-[10px] font-semibold px-2.5 py-1.5 rounded-full transition-all duration-200"
                          style={
                            active
                              ? {
                                  background: "var(--neon)",
                                  color: "#000",
                                  boxShadow: "0 0 12px rgb(var(--neon-rgb) / 0.25)",
                                }
                              : {
                                  background: "rgba(255,255,255,0.05)",
                                  color: "#71717a",
                                  border: "1px solid rgba(255,255,255,0.08)",
                                }
                          }
                        >
                          {method.label}
                        </button>
                      );
                    })}
                  </div>

                  <PixPaymentBlock
                    amount={total}
                    active={isPix && !isEmpty}
                    onExpiredChange={setPixExpired}
                  />
                </div>
              </div>

              {feedback && (
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`text-sm text-center px-4 py-3 rounded-xl ${
                    feedback === closedMessage
                      ? "text-[#f87171]"
                      : feedback === pixExpiredMessage
                        ? "text-[#f87171]"
                        : "text-zinc-400"
                  }`}
                  style={{
                    background:
                      feedback === closedMessage || feedback === pixExpiredMessage
                        ? "rgba(248,113,113,0.1)"
                        : "rgba(255,255,255,0.04)",
                    border: `1px solid ${
                      feedback === closedMessage || feedback === pixExpiredMessage
                        ? "rgba(248,113,113,0.35)"
                        : "rgba(255,255,255,0.08)"
                    }`,
                    boxShadow:
                      feedback === closedMessage || feedback === pixExpiredMessage
                        ? "0 0 20px rgba(248,113,113,0.2)"
                        : undefined,
                  }}
                >
                  {feedback}
                </motion.p>
              )}
            </div>
            )}

            {/* footer */}
            {!isFinishView && (
            <div
              className="shrink-0 px-6 py-5 space-y-4"
              style={{
                borderTop: "1px solid rgba(255,255,255,0.06)",
                background: "rgba(2,2,3,0.95)",
              }}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-[0.15em] text-zinc-500">Total</span>
                <span
                  className="text-2xl font-black"
                  style={{ fontFamily: "var(--font-bebas)", color: "var(--neon)" }}
                >
                  {formatPrice(total)}
                </span>
              </div>

              <motion.button
                type="button"
                onClick={handleConfirm}
                disabled={isEmpty || submitting}
                whileHover={!isEmpty && !submitting ? { scale: 1.02, boxShadow: "0 0 32px rgb(var(--neon-rgb) / 0.5)" } : {}}
                whileTap={!isEmpty && !submitting ? { scale: 0.98 } : {}}
                className="w-full py-4 rounded-full text-sm font-bold uppercase tracking-[0.12em] transition-opacity duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  background: isEmpty ? "rgb(var(--neon-rgb) / 0.25)" : "var(--neon)",
                  color: "#000",
                  boxShadow: isEmpty ? "none" : "0 0 24px rgb(var(--neon-rgb) / 0.3)",
                }}
              >
                {submitting
                  ? "Enviando pedido..."
                  : isEmpty
                    ? "Não há nada selecionado"
                    : "Confirmar pedido"}
              </motion.button>
            </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
