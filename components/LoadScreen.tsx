"use client";

import { useEffect } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useIntro } from "@/context/IntroContext";
import { introWasPlayed, persistIntroDone } from "@/lib/intro-storage";

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];
const MIN_DURATION = 2400;

function preloadAssets() {
  return Promise.all([
    new Promise<void>((resolve) => {
      const video = document.createElement("video");
      video.preload = "auto";
      video.src = "/herovid.mp4";
      video.muted = true;
      const done = () => resolve();
      video.addEventListener("canplaythrough", done, { once: true });
      video.addEventListener("error", done, { once: true });
      setTimeout(done, 3500);
    }),
    new Promise<void>((resolve) => {
      const img = new window.Image();
      img.src = "/logo.png";
      img.onload = () => resolve();
      img.onerror = () => resolve();
    }),
    new Promise<void>((resolve) => setTimeout(resolve, MIN_DURATION)),
  ]);
}

export function LoadScreen() {
  const { phase, markExiting, markComplete } = useIntro();
  const pathname = usePathname();
  const visible =
    pathname === "/" && (phase === "loading" || phase === "exiting");

  useEffect(() => {
    if (phase !== "loading") return;

    if (introWasPlayed()) {
      persistIntroDone();
      markComplete();
      return;
    }

    let cancelled = false;

    preloadAssets().then(() => {
      if (cancelled) return;
      markExiting();
      window.setTimeout(() => {
        if (!cancelled) markComplete();
      }, 1100);
    });

    return () => {
      cancelled = true;
    };
  }, [phase, markExiting, markComplete]);

  return (
    <AnimatePresence mode="wait">
      {visible && (
        <motion.div
          key="loadscreen"
          className="fixed inset-0 z-[9999] pointer-events-none"
          initial={{ opacity: 1 }}
          exit={{ opacity: 1 }}
          aria-hidden
        >
          <motion.div
            className="absolute inset-x-0 top-0 h-1/2 bg-[var(--bg)]"
            initial={{ y: 0 }}
            animate={phase === "exiting" ? { y: "-100%" } : { y: 0 }}
            transition={{ duration: 0.9, ease: EASE }}
          />
          <motion.div
            className="absolute inset-x-0 bottom-0 h-1/2 bg-[var(--bg)]"
            initial={{ y: 0 }}
            animate={phase === "exiting" ? { y: "100%" } : { y: 0 }}
            transition={{ duration: 0.9, ease: EASE }}
          />

          <AnimatePresence>
            {phase === "loading" && (
              <motion.div
                className="absolute inset-0 flex flex-col items-center justify-center pointer-events-auto"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 1.08 }}
                transition={{ duration: 0.45, ease: EASE }}
              >
                <div
                  className="absolute inset-0 opacity-40"
                  style={{
                    background:
                      "radial-gradient(circle at 50% 45%, rgb(var(--neon-rgb) / 0.12) 0%, transparent 55%)",
                  }}
                />

                <div
                  className="absolute inset-0 opacity-[0.035] pointer-events-none"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                    backgroundRepeat: "repeat",
                    backgroundSize: "256px",
                  }}
                />

                <div className="relative flex flex-col items-center">
                  <div className="relative flex h-52 w-[min(92vw,42rem)] sm:h-64 md:h-72 items-center justify-center">
                    <motion.div
                      className="absolute h-[14rem] w-[14rem] sm:h-[17rem] sm:w-[17rem] md:h-[19rem] md:w-[19rem] rounded-full"
                      style={{
                        background:
                          "radial-gradient(circle, rgb(var(--neon-rgb) / 0.22) 0%, transparent 68%)",
                      }}
                      animate={{ opacity: [0.45, 0.75, 0.45], scale: [0.92, 1.06, 0.92] }}
                      transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                      aria-hidden
                    />

                    <motion.div
                      className="absolute h-[15rem] w-[15rem] sm:h-[18rem] sm:w-[18rem] md:h-[20rem] md:w-[20rem] rounded-full border border-yellow-400/20"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                      aria-hidden
                    />

                    <motion.div
                      initial={{ scale: 0.88, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.85, ease: EASE }}
                      className="relative z-10"
                    >
                      <motion.div
                        animate={{ y: [0, -6, 0] }}
                        transition={{
                          duration: 2.6,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      >
                        <Image
                          src="/logo.png"
                          alt="Whiskritório"
                          width={800}
                          height={250}
                          priority
                          className="h-52 sm:h-64 md:h-72 w-auto max-w-[min(92vw,42rem)] object-contain"
                        />
                      </motion.div>
                    </motion.div>
                  </div>

                  <motion.p
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35, duration: 0.6, ease: EASE }}
                    className="mt-8 sm:mt-10 text-[10px] sm:text-xs uppercase tracking-[0.35em] text-zinc-500 font-semibold"
                  >
                    Conveniência e Distribuidora
                  </motion.p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
