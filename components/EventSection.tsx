"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import type { Event } from "@/types";

const PLACEHOLDER_IMAGE = "/images/fundo.png";
const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

/* ─── event card ─────────────────────────────────────────── */
function EventCard({ event, index }: { event: Event; index: number }) {
  const imageSrc = event.imageUrl || PLACEHOLDER_IMAGE;
  const hasTicketUrl = Boolean(event.ticketUrl);

  return (
    <motion.div
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.55, ease: EASE, delay: index * 0.1 }}
      whileHover={{
        y: -4,
        borderColor: "rgb(var(--neon-rgb) / 0.2)",
        boxShadow: "0 12px 40px rgba(0,0,0,0.5), 0 0 0 1px rgb(var(--neon-rgb) / 0.1)",
      }}
      className="group relative flex flex-col sm:flex-row sm:items-stretch gap-4 sm:gap-5 p-4 sm:p-6 rounded-2xl transition-all duration-300 overflow-hidden"
      style={{
        background: "var(--surface)",
        border: "1px solid rgba(255,255,255,0.07)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.35)",
      }}
    >
      {/* foto do show */}
      <div className="relative shrink-0 w-full sm:w-36 md:w-44 h-40 sm:h-full sm:min-h-[8.5rem] rounded-xl overflow-hidden bg-zinc-900">
        <Image
          src={imageSrc}
          alt={`Show ${event.band} ao vivo`}
          fill
          unoptimized
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, 176px"
        />
        <div
          className="absolute inset-0 pointer-events-none sm:hidden"
          style={{
            background:
              "linear-gradient(to top, rgba(8,8,9,0.85) 0%, transparent 50%)",
          }}
        />
        <span
          className="absolute bottom-2 left-2 sm:hidden px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-[0.1em]"
          style={{ background: "var(--neon)", color: "#000" }}
        >
          {event.genre}
        </span>
      </div>

      <div className="flex flex-1 min-w-0 gap-4 sm:gap-5">
        {/* data */}
        <div
          className="flex flex-col items-center justify-center shrink-0 w-14 h-14 rounded-xl"
          style={{
            background: "rgb(var(--neon-rgb) / 0.07)",
            border: "1px solid rgb(var(--neon-rgb) / 0.15)",
          }}
        >
          <span
            className="text-2xl leading-none font-black"
            style={{ fontFamily: "var(--font-bebas)", color: "var(--neon)" }}
          >
            {event.day}
          </span>
          <span className="text-[9px] font-bold uppercase tracking-[0.1em] text-zinc-500 mt-0.5">
            {event.month}
          </span>
        </div>

        {/* conteúdo */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-2">
            <h3
              className="text-white uppercase leading-none"
              style={{
                fontFamily: "var(--font-bebas)",
                fontSize: "1.45rem",
                letterSpacing: "0.04em",
              }}
            >
              {event.band}
            </h3>
            <span className="text-[10px] text-zinc-600 uppercase tracking-[0.12em]">
              {event.genre}
            </span>
          </div>

          <p className="text-xs text-zinc-500 leading-relaxed mb-3 line-clamp-2">
            {event.description}
          </p>

          <span className="flex items-center gap-1.5 text-[11px] text-zinc-600">
            <svg
              className="w-3 h-3 shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" strokeLinecap="round" />
            </svg>
            {event.weekday} · {event.time}h
          </span>
        </div>

        {/* cta */}
        <motion.a
          href={event.ticketUrl ?? "#"}
          target={hasTicketUrl ? "_blank" : undefined}
          rel={hasTicketUrl ? "noopener noreferrer" : undefined}
          whileTap={{ scale: 0.93 }}
          onClick={(e) => e.stopPropagation()}
          className="self-center shrink-0 px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-[0.1em] opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden sm:flex"
          style={{
            background: "var(--neon)",
            color: "#000",
            boxShadow: "0 0 14px rgb(var(--neon-rgb) / 0.25)",
          }}
        >
          Ingressos
        </motion.a>
      </div>
    </motion.div>
  );
}

type EventSectionProps = {
  events: Event[];
};

/* ─── section ────────────────────────────────────────────── */
export function EventSection({ events }: EventSectionProps) {
  const headerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(headerRef, { once: true, margin: "-80px" });

  return (
    <section
      className="relative w-full py-24 md:py-32 overflow-hidden"
      style={{ background: "var(--bg)" }}
      id="eventos"
    >
      {/* separador */}
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{
          background:
            "linear-gradient(to right, transparent, rgb(var(--neon-rgb) / 0.2) 30%, rgb(var(--neon-rgb) / 0.35) 50%, rgb(var(--neon-rgb) / 0.2) 70%, transparent)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        {/* header */}
        <div ref={headerRef} className="mb-10 md:mb-14">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, ease: EASE }}
            className="flex items-center gap-3 mb-5"
          >
            <span
              className="block h-px w-10"
              style={{ background: "var(--neon)" }}
            />
            <span
              className="text-xs uppercase tracking-[0.3em] font-semibold"
              style={{ color: "var(--neon)" }}
            >
              Agenda — Shows ao Vivo
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
            className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4"
          >
            <h2
              className="uppercase leading-none text-white"
              style={{
                fontFamily: "var(--font-bebas)",
                fontSize: "clamp(3rem, 8vw, 6rem)",
                letterSpacing: "0.02em",
              }}
            >
              Shows{" "}
              <span
                style={{
                  color: "var(--neon)",
                  textShadow: "0 0 28px rgb(var(--neon-rgb) / 0.35)",
                }}
              >
                ao Vivo
              </span>
            </h2>

            <motion.a
              href="#"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.35 }}
              whileHover={{ color: "var(--neon)" }}
              className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-zinc-600 transition-colors duration-300 pb-2"
            >
              Ver agenda completa
              <svg
                className="w-3.5 h-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  d="M5 12h14M12 5l7 7-7 7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.a>
          </motion.div>
        </div>

        {/* cards */}
        <div className="flex flex-col gap-4">
          {events.length > 0 ? (
            events.map((event, i) => (
              <EventCard key={event.id} event={event} index={i} />
            ))
          ) : (
            <p className="rounded-2xl border border-white/10 px-6 py-12 text-center text-sm text-zinc-500">
              <span
                className="block text-2xl uppercase text-white mb-2"
                style={{ fontFamily: "var(--font-bebas)", color: "var(--neon)" }}
              >
                Em breve
              </span>
              Novas promoções na agenda do Whiskritório.
            </p>
          )}
        </div>
      </div>

      {/* separador inferior */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px pointer-events-none"
        style={{
          background:
            "linear-gradient(to right, transparent, rgba(255,255,255,0.05) 40%, rgba(255,255,255,0.07) 50%, rgba(255,255,255,0.05) 60%, transparent)",
        }}
      />
    </section>
  );
}
