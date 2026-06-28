"use client";

import { usePathname } from "next/navigation";
import { IntroProvider } from "@/context/IntroContext";
import { Navbar } from "@/components/Navbar";
import { CartUI } from "@/components/CartUI";
import { LoadScreen } from "@/components/LoadScreen";
import { HomeScrollRestore } from "@/components/HomeScrollRestore";

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  return (
    <IntroProvider>
      {!isAdmin && <Navbar />}
      {!isAdmin && <LoadScreen />}
      {!isAdmin && <HomeScrollRestore />}
      {children}
      {!isAdmin && <CartUI />}
    </IntroProvider>
  );
}
