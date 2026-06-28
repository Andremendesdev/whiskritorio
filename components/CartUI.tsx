"use client";

import { FloatingCartButton } from "@/components/FloatingCartButton";
import { CardMenu } from "@/components/CardMenu";
import { CartToast } from "@/components/CartToast";
import { useCart } from "@/context/CartContext";

export function CartUI() {
  const { itemCount, openMenu, toastMessage } = useCart();

  return (
    <>
      <CartToast message={toastMessage} />
      <FloatingCartButton count={itemCount} onClick={openMenu} />
      <CardMenu />
    </>
  );
}
