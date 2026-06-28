"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Beer, Snowflake, Truck, BadgePercent, type LucideIcon } from "lucide-react";
import { OpenStatusBadge } from "@/components/OpenStatusBadge";
import { isWhiskritorioOpen } from "@/lib/opening-hours";
import { useIntro } from "@/context/IntroContext";

/* ─── animation helpers ─────────────────────────────────── */
const EASE_OUT = [0.16, 1, 0.3, 1] as [number, number, number, number];

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: EASE_OUT, delay },
  }),
};

const fadeIn = {
  hidden: { opacity: 0 },
  show: (delay = 0) => ({
    opacity: 1,
    transition: { duration: 1, ease: "easeOut" as const, delay },
  }),
};

const headlineClass =
  "leading-[0.88] uppercase font-black text-[clamp(3.25rem,12vw,11rem)] md:text-[clamp(2.5rem,6vw,6.5rem)]";

/* ─── stat item ─────────────────────────────────────────── */
function StatItem({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <div className="flex flex-col items-center gap-2 text-center min-w-0">
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
        style={{ background: "rgb(var(--neon-rgb) / 0.1)" }}
      >
        <Icon className="h-5 w-5" strokeWidth={2} style={{ color: "var(--neon)" }} aria-hidden />
      </div>
      <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.1em] sm:tracking-[0.12em] text-zinc-300 leading-tight max-w-[5.5rem] sm:max-w-none">
        {label}
      </span>
    </div>
  );
}

/* ─── main component ─────────────────────────────────────── */
export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { shouldRevealHero } = useIntro();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const update = () => setIsOpen(isWhiskritorioOpen());
    update();
    const id = setInterval(update, 60_000);
    return () => clearInterval(id);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const rawY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const bgY = useSpring(rawY, { stiffness: 80, damping: 20 });
  const contentOpacity = useTransform(scrollYProgress, [0, 0.45], [1, 0]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen w-full overflow-hidden flex flex-col"
      style={{ background: "var(--bg)" }}
    >
      {/* ── background: vídeo cinematográfico ───────────────── */}
      <motion.div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        style={{ zIndex: 0, y: bgY }}
        aria-hidden
        initial={{ scale: 1.18, opacity: 0 }}
        animate={
          shouldRevealHero
            ? { scale: 1, opacity: 1 }
            : { scale: 1.18, opacity: 0 }
        }
        transition={{ duration: 1.15, ease: EASE_OUT, delay: shouldRevealHero ? 0.05 : 0 }}
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 h-full w-full object-cover object-[40%_center] scale-105 md:object-center"
          style={{ filter: "brightness(0.5) saturate(0.9)" }}
        >
          <source src="/herovid.mp4" type="video/mp4" />
        </video>

        <div
          className="absolute inset-0 md:hidden"
          style={{
            background:
              "linear-gradient(to bottom, rgba(2,2,3,0.72) 0%, rgba(2,2,3,0.35) 45%, rgba(2,2,3,0.65) 85%, var(--bg) 100%)",
          }}
        />
        <div
          className="absolute inset-0 hidden md:block"
          style={{
            background:
              "linear-gradient(to right, rgba(2,2,3,0.88) 0%, rgba(2,2,3,0.45) 50%, rgba(2,2,3,0.7) 100%)",
          }}
        />
        <div
          className="absolute inset-0 hidden md:block"
          style={{
            background:
              "linear-gradient(to bottom, rgba(2,2,3,0.45) 0%, transparent 22%, transparent 72%, var(--bg) 100%)",
          }}
        />
      </motion.div>

      {/* ambient orb left */}
      <div
        className="absolute pointer-events-none"
        style={{
          left: "-15%",
          top: "10%",
          width: "600px",
          height: "600px",
          background:
            "radial-gradient(circle, rgb(var(--neon-rgb) / 0.07) 0%, transparent 70%)",
          borderRadius: "50%",
        }}
      />

      {/* ambient orb right */}
      <div
        className="absolute pointer-events-none"
        style={{
          right: "-10%",
          bottom: "5%",
          width: "500px",
          height: "500px",
          background:
            "radial-gradient(circle, rgb(var(--neon-rgb) / 0.05) 0%, transparent 70%)",
          borderRadius: "50%",
        }}
      />

      {/* diagonal slash accent */}
      <motion.div
        className="absolute pointer-events-none"
        style={{ y: bgY }}
        initial={{ opacity: 0, scaleY: 0 }}
        animate={{ opacity: 1, scaleY: 1 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
      >
        <div
          style={{
            position: "absolute",
            right: "8%",
            top: "-5%",
            width: "3px",
            height: "110vh",
            background:
              "linear-gradient(to bottom, transparent, rgb(var(--neon-rgb) / 0.5) 30%, rgb(var(--neon-rgb) / 0.8) 50%, rgb(var(--neon-rgb) / 0.5) 70%, transparent)",
            transform: "rotate(12deg)",
            transformOrigin: "top center",
            filter: "blur(1px)",
            boxShadow: "0 0 20px rgb(var(--neon-rgb) / 0.3)",
          }}
        />
      </motion.div>

      {/* second line */}
      <motion.div
        className="absolute pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 0.6 }}
      >
        <div
          style={{
            position: "absolute",
            right: "12%",
            top: "-5%",
            width: "1px",
            height: "110vh",
            background:
              "linear-gradient(to bottom, transparent, rgb(var(--neon-rgb) / 0.2) 40%, rgb(var(--neon-rgb) / 0.3) 55%, transparent)",
            transform: "rotate(12deg)",
            transformOrigin: "top center",
          }}
        />
      </motion.div>

      {/* grain overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "256px",
        }}
      />

      {/* ── main content ─────────────────────────────────────── */}
      <motion.div
        style={{ opacity: contentOpacity }}
        className="relative z-10 flex-1 flex flex-col justify-center px-6 md:px-12 lg:px-20 pt-32 pb-24"
      >
        {/* delivery badge */}
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate={shouldRevealHero ? "show" : "hidden"}
          custom={0.15}
          className="mb-5 md:mb-6"
        >
          <div
            className="inline-flex flex-wrap items-center gap-x-3 gap-y-1.5 px-4 py-2.5 rounded-full"
            style={{
              background: "rgba(255,255,255,0.04)",
              backdropFilter: "blur(12px)",
            }}
          >
            <span
              className="text-[11px] md:text-xs font-bold uppercase tracking-[0.14em]"
              style={{ color: "var(--neon)" }}
            >
              Ent. grátis acima de R$ 150
            </span>
            <span className="hidden sm:block w-px h-3.5 bg-zinc-700" aria-hidden />
            <span className="text-[11px] md:text-xs font-semibold uppercase tracking-[0.12em] text-zinc-400">
              Mín. R$ 35,00
            </span>
          </div>
        </motion.div>

        {/* headline */}
        <div className="relative">
          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate={shouldRevealHero ? "show" : "hidden"}
            custom={0.35}
            className={headlineClass}
            style={{
              fontFamily: "var(--font-bebas)",
              color: "#ffffff",
              letterSpacing: "0.02em",
            }}
          >
            Bebidas
          </motion.h1>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate={shouldRevealHero ? "show" : "hidden"}
            custom={0.48}
            className={headlineClass}
            style={{
              fontFamily: "var(--font-bebas)",
              color: "#ffffff",
              letterSpacing: "0.02em",
            }}
          >
            <span
              style={{
                color: "var(--neon)",
                textShadow:
                  "0 0 40px rgb(var(--neon-rgb) / 0.5), 0 0 80px rgb(var(--neon-rgb) / 0.2)",
              }}
            >
              Amigos
            </span>{" "}
            &
          </motion.h1>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate={shouldRevealHero ? "show" : "hidden"}
            custom={0.58}
            className={headlineClass}
            style={{
              fontFamily: "var(--font-bebas)",
              color: "#ffffff",
              letterSpacing: "0.02em",
            }}
          >
            Bons Momentos
          </motion.h1>
        </div>

        {/* eyebrow label */}
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate={shouldRevealHero ? "show" : "hidden"}
          custom={0.55}
          className="flex items-center gap-3 mt-5 md:mt-6"
        >
          <span className="block h-px w-10" style={{ background: "var(--neon)" }} />
          <span
            className="text-xs uppercase tracking-[0.3em] font-semibold"
            style={{ color: "var(--neon)" }}
          >
            A MELHOR Conveniência e Distribuidora em Piraju
          </span>
        </motion.div>

        {/* status aberto/fechado — fixo acima dos botões */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={shouldRevealHero ? "show" : "hidden"}
          custom={0.58}
          className="mt-4 md:mt-5"
        >
          <OpenStatusBadge isOpen={isOpen} />
        </motion.div>

        {/* CTA row */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={shouldRevealHero ? "show" : "hidden"}
          custom={0.6}
          className="mt-8 md:mt-9 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3"
        >
          <motion.a
            href="#cardapio"
            whileHover={{
              scale: 1.04,
              boxShadow: "0 0 30px rgb(var(--neon-rgb) / 0.5)",
            }}
            whileTap={{ scale: 0.97 }}
            className="flex w-full shrink-0 items-center justify-center gap-2.5 whitespace-nowrap rounded-full px-8 py-4 text-sm font-bold uppercase tracking-[0.12em] transition-colors duration-300 sm:w-auto"
            style={{
              background:
                "linear-gradient(to bottom, var(--neon) 0%, var(--color-amber-500) 55%, var(--color-amber-600) 100%)",
              color: "#000",
              boxShadow: "0 0 20px rgb(var(--neon-rgb) / 0.3)",
            }}
          >
            <Beer className="w-4 h-4" strokeWidth={2.25} aria-hidden />
            Ver Cardápio
          </motion.a>

          <motion.a
            href="#eventos"
            whileHover={{
              scale: 1.04,
              borderColor: "rgb(var(--neon-rgb) / 0.6)",
              color: "var(--neon)",
            }}
            whileTap={{ scale: 0.97 }}
            className="flex w-full shrink-0 items-center justify-center gap-2.5 whitespace-nowrap rounded-full border px-8 py-4 text-sm font-bold uppercase tracking-[0.12em] text-white transition-all duration-300 sm:w-auto"
            style={{
              background: "rgba(255,255,255,0.04)",
              backdropFilter: "blur(10px)",
              borderColor: "rgba(255,255,255,0.12)",
            }}
          >
            Ver Promoções
          </motion.a>
        </motion.div>

        {/* ── stats bar ──────────────────────────────────────── */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={shouldRevealHero ? "show" : "hidden"}
          custom={0.85}
          className="mt-16 md:mt-20"
        >
          <div
            className="inline-flex w-full max-w-full items-start justify-between gap-3 px-4 py-5 sm:w-auto sm:items-center sm:justify-start sm:gap-8 md:gap-12 sm:px-8 rounded-2xl"
            style={{
              background: "rgba(255,255,255,0.03)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.07)",
              boxShadow: "0 0 0 1px rgb(var(--neon-rgb) / 0.05) inset",
            }}
          >
            <StatItem icon={Snowflake} label="Produtos gelados" />
            <div className="w-px self-stretch min-h-12 bg-zinc-800 shrink-0" />
            <StatItem icon={Truck} label="Entrega rápida" />
            <div className="w-px self-stretch min-h-12 bg-zinc-800 shrink-0 hidden sm:block" />
            <StatItem icon={BadgePercent} label="Melhores preços" />
          </div>
        </motion.div>
      </motion.div>

      {/* ── scroll cue ──────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={shouldRevealHero ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: shouldRevealHero ? 1.5 : 0, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] uppercase tracking-[0.3em] text-zinc-600">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="w-px h-8"
          style={{
            background:
              "linear-gradient(to bottom, rgb(var(--neon-rgb) / 0.6), transparent)",
          }}
        />
      </motion.div>

      {/* ── bottom edge gradient ─────────────────────────────── */}
      <div
        className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, rgba(2,2,3,0.9) 0%, transparent 100%)",
        }}
      />
    </section>
  );
}
