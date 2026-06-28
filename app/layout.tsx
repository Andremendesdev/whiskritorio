import type { Metadata } from "next";
import { Barlow_Condensed, Bebas_Neue } from "next/font/google";
import { CartProvider } from "@/context/CartContext";
import { SiteChrome } from "@/components/SiteChrome";
import "./globals.css";

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-barlow",
  display: "swap",
});

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-bebas",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Whiskritório — Conveniência e Distribuidora",
  description:
    "Sua conveniência de confiança com variedade de produtos, preços justos e entrega rápida. Atacado e varejo para o seu dia a dia.",
  keywords: ["conveniência", "distribuidora", "mercado", "atacado", "Whiskritório"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${barlowCondensed.variable} ${bebasNeue.variable}`}>
      <body className="antialiased">
        <CartProvider>
          <SiteChrome>{children}</SiteChrome>
        </CartProvider>
      </body>
    </html>
  );
}
