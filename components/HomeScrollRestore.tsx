"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { consumeHomeScroll } from "@/lib/intro-storage";

/** Restaura scroll da home ao voltar do cardápio (sem animação). */
export function HomeScrollRestore() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== "/") return;

    const savedY = consumeHomeScroll();
    if (savedY == null) return;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        window.scrollTo({ top: savedY, left: 0, behavior: "auto" });
      });
    });
  }, [pathname]);

  return null;
}
