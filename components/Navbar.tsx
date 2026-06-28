"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Store } from "lucide-react";
import { useIntro } from "@/context/IntroContext";

/* ─── logo ──────────────────────────────────────────────── */
function NavbarLogo({ className }: { className?: string }) {
  return (
    <Image
      src="/logo.png"
      alt="Whiskritório"
      width={360}
      height={112}
      quality={100}
      priority
      className={`h-16 md:h-20 w-auto object-contain ${className ?? ""}`}
    />
  );
}

function NavbarName({ className }: { className?: string }) {
  return (
    <Image
      src="/name.png"
      alt="Whiskritório"
      width={1536}
      height={249}
      quality={100}
      priority
      sizes="(max-width: 768px) 180px, 240px"
      className={`h-7 sm:h-8 md:h-9 w-auto object-contain -ml-6 sm:-ml-7 md:-ml-8 ${className ?? ""}`}
    />
  );
}

/* ─── data ───────────────────────────────────────────────── */
const links = [
  { label: "Cardápio", href: "/cardapio" },
  { label: "Eventos", href: "#eventos" },
  { label: "Contato", href: "#contato" },
];

/* ─── nav link with animated underline ──────────────────── */
function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      className="group relative text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-400 hover:text-white transition-colors duration-300 py-1"
    >
      {label}
      <span
        className="absolute -bottom-0.5 left-0 h-px w-0 group-hover:w-full transition-all duration-300 ease-out"
        style={{ background: "var(--neon)" }}
      />
    </a>
  );
}

/* ─── mobile menu overlay ────────────────────────────────── */
function MobileMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* backdrop */}
          <motion.div
            className="fixed inset-0 z-40"
            style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
          />

          {/* panel */}
          <motion.div
            className="fixed top-0 right-0 bottom-0 z-50 w-[80vw] max-w-sm flex flex-col"
            style={{
              background: "var(--surface)",
              borderLeft: "1px solid rgb(var(--neon-rgb) / 0.1)",
            }}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* top bar */}
            <div className="flex items-center justify-between px-8 pt-8 pb-6 border-b border-white/5">
              <div className="flex items-center gap-0">
                <NavbarLogo />
                <NavbarName className="-ml-6 h-8" />
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full text-zinc-400 hover:text-white transition-colors"
                style={{ background: "rgba(255,255,255,0.05)" }}
                aria-label="Fechar menu"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {/* links */}
            <nav className="flex flex-col px-8 py-8 gap-1 flex-1">
              {links.map((link, i) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  onClick={onClose}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.4,
                    ease: [0.16, 1, 0.3, 1],
                    delay: 0.1 + i * 0.06,
                  }}
                  className="group flex items-center justify-between py-4 border-b text-white hover:text-[var(--neon)] transition-colors duration-300"
                  style={{ borderColor: "rgba(255,255,255,0.05)" }}
                >
                  <span
                    className="text-2xl font-black uppercase"
                    style={{ fontFamily: "var(--font-bebas)", letterSpacing: "0.06em" }}
                  >
                    {link.label}
                  </span>
                  <svg
                    className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-300"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--neon)"
                    strokeWidth="2"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </motion.a>
              ))}
            </nav>

            {/* bottom CTA */}
            <motion.div
              className="px-8 pb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.38, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <a
                href="#"
                onClick={onClose}
                className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl text-sm font-bold uppercase tracking-[0.12em] transition-all duration-300 active:scale-95"
                style={{
                  background: "var(--neon)",
                  color: "#000",
                  boxShadow: "0 0 24px rgb(var(--neon-rgb) / 0.3)",
                }}
              >
                <Store className="w-6 h-8 text-[var(--neon)]" strokeWidth={2} aria-hidden />
                Pedir Agora
              </a>
              <p className="text-center text-[10px] text-zinc-600 mt-4 uppercase tracking-[0.15em]">
                Delivery · Retirada · Mesa
              </p>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ─── main navbar ────────────────────────────────────────── */
export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { shouldRevealHero } = useIntro();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* lock body scroll when mobile menu is open */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <motion.header
        className="fixed top-0 left-0 right-0 z-30"
        initial={{ y: -80, opacity: 0 }}
        animate={shouldRevealHero ? { y: 0, opacity: 1 } : { y: -80, opacity: 0 }}
        transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1], delay: shouldRevealHero ? 0.25 : 0 }}
      >
        {/* bar */}
        <div
          className="relative flex items-center justify-between pl-2 pr-4 sm:pl-3 sm:pr-6 md:pl-4 md:pr-12 lg:pl-5 lg:pr-20 transition-all duration-500"
          style={{
            height: scrolled ? "80px" : "96px",
            background: scrolled
              ? "rgba(2,2,3,0.85)"
              : "linear-gradient(to bottom, rgba(2,2,3,0.7) 0%, transparent 100%)",
            backdropFilter: scrolled ? "blur(20px)" : "none",
            WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
          }}
        >
          {/* logo — mobile */}
          <a href="/" className="relative z-10 flex shrink-0 md:hidden">
            <NavbarLogo />
          </a>

          {/* logo + name — desktop */}
          <a href="/" className="hidden md:flex items-center gap-0 shrink-0">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
              <NavbarLogo />
            </motion.div>
            <NavbarName />
          </a>

          {/* name — mobile, centralizado */}
          <a
            href="/"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 md:hidden"
          >
            <NavbarName className="!ml-0 h-8" />
          </a>

          {/* desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <NavLink key={link.label} {...link} />
            ))}
          </nav>

          {/* right side */}
          <div className="hidden md:flex items-center gap-4">
            {/* phone */}
            <a
              href="tel:+551199999999"
              className="flex items-center gap-2 text-[11px] uppercase tracking-[0.12em] text-zinc-500 hover:text-zinc-300 transition-colors duration-300"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 8.37a16 16 0 006.72 6.72l1.83-1.34a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Reservas
            </a>

            <motion.a
              href="#"
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 28px rgb(var(--neon-rgb) / 0.5)",
              }}
              whileTap={{ scale: 0.96 }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-[11px] font-bold uppercase tracking-[0.12em] transition-colors duration-300"
              style={{
                background: "var(--neon)",
                color: "#000",
                boxShadow: "0 0 16px rgb(var(--neon-rgb) / 0.25)",
              }}
            >
              <Store className="w-2 h-3.5 text-[var(--neon)]" strokeWidth={2} aria-hidden />
              Pedir Agora
            </motion.a>
          </div>

          {/* mobile: menu */}
          <div className="relative z-10 flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileOpen(true)}
              className="flex flex-col gap-[5px] p-2 group"
              aria-label="Abrir menu"
            >
            <span
              className="block h-px transition-all duration-300 group-hover:w-6"
              style={{ width: "24px", background: "#fff" }}
            />
            <span
              className="block h-px transition-all duration-300"
              style={{ width: "16px", background: "var(--neon)" }}
            />
            <span
              className="block h-px transition-all duration-300 group-hover:w-6"
              style={{ width: "24px", background: "#fff" }}
            />
            </button>
          </div>
        </div>
      </motion.header>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
