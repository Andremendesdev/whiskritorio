"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Star } from "lucide-react";

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

const GOOGLE_RATING = 4.9;
const TOTAL_REVIEWS = 847;

const reviews = [
  {
    id: 1,
    name: "Rafael M.",
    date: "há 1 semana",
    rating: 5,
    text: "Melhor conveniência da região. Sempre encontro o que preciso e o atendimento é rápido. Preços justos e produtos sempre frescos.",
  },
  {
    id: 2,
    name: "Camila S.",
    date: "há 2 semanas",
    rating: 5,
    text: "Compro no atacado para o meu comércio e a Whiskritório nunca falha. Entrega pontual e variedade incrível de produtos.",
  },
  {
    id: 3,
    name: "Bruno T.",
    date: "há 3 semanas",
    rating: 5,
    text: "Pedido pelo site chegou certinho e rápido. Refrigerante gelado, mercearia completa. Virou minha conveniência de confiança.",
  },
  {
    id: 4,
    name: "Juliana P.",
    date: "há 1 mês",
    rating: 4,
    text: "Loja organizada e limpa. Só achei que no sábado de manhã fica um pouco cheio, mas o atendimento continua eficiente.",
  },
  {
    id: 5,
    name: "Marcos A.",
    date: "há 1 mês",
    rating: 5,
    text: "Whiskritório virou nosso point fixo. Compro tudo aqui — do dia a dia ao atacado. Recomendo o combo churrasco!",
  },
  {
    id: 6,
    name: "Fernanda L.",
    date: "há 2 meses",
    rating: 5,
    text: "Equipe super atenciosa e loja bem abastecida. O pedido online chegou certinho. Nota 10 no Google!",
  },
];

function GoogleLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} de 5 estrelas`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className="w-3.5 h-3.5"
          fill={i <= rating ? "var(--neon)" : "transparent"}
          stroke={i <= rating ? "var(--neon)" : "rgba(255,255,255,0.2)"}
          strokeWidth={1.5}
        />
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: (typeof reviews)[0] }) {
  const initial = review.name.replace(/\s/g, "").slice(0, 2).toUpperCase();

  return (
    <article
      className="flex flex-col gap-3 p-5 rounded-2xl shrink-0 w-[min(100%,320px)] sm:w-[340px] min-h-[200px]"
      style={{
        background: "var(--surface)",
        border: "1px solid rgba(255,255,255,0.07)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.35)",
      }}
    >
      <div className="flex items-start gap-3">
        <div
          className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-black"
          style={{ background: "var(--neon)" }}
        >
          {initial}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-white truncate">{review.name}</p>
          <p className="text-[11px] text-zinc-600">{review.date}</p>
        </div>
        <GoogleLogo className="w-5 h-5 shrink-0 opacity-80" />
      </div>

      <Stars rating={review.rating} />

      <p className="text-sm text-zinc-400 leading-relaxed flex-1 line-clamp-4">{review.text}</p>
    </article>
  );
}

const marqueeReviews = [...reviews, ...reviews];

export function Preview() {
  const headerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(headerRef, { once: true, margin: "-80px" });

  return (
    <section
      className="relative w-full py-24 md:py-32 overflow-hidden"
      style={{ background: "var(--bg)" }}
      id="avaliacoes"
    >
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
            <span className="block h-px w-10" style={{ background: "var(--neon)" }} />
            <span
              className="text-xs uppercase tracking-[0.3em] font-semibold"
              style={{ color: "var(--neon)" }}
            >
              Avaliações — Google
            </span>
          </motion.div>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
            >
              <h2
                className="uppercase leading-none text-white"
                style={{
                  fontFamily: "var(--font-bebas)",
                  fontSize: "clamp(3rem, 8vw, 6rem)",
                  letterSpacing: "0.02em",
                }}
              >
                O que dizem
                <br />
                <span
                  style={{
                    color: "var(--neon)",
                    textShadow: "0 0 28px rgb(var(--neon-rgb) / 0.35)",
                  }}
                >
                  no Google
                </span>
              </h2>
            </motion.div>

            {/* rating summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: EASE, delay: 0.2 }}
              className="flex items-center gap-5 px-6 py-5 rounded-2xl shrink-0"
              style={{
                background: "rgba(255,255,255,0.03)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <GoogleLogo className="w-10 h-10" />
              <div>
                <div className="flex items-baseline gap-2">
                  <span
                    className="text-4xl font-black leading-none"
                    style={{ fontFamily: "var(--font-bebas)", color: "var(--neon)" }}
                  >
                    {GOOGLE_RATING.toFixed(1)}
                  </span>
                  <Stars rating={5} />
                </div>
                <p className="text-xs text-zinc-500 mt-1">
                  {TOTAL_REVIEWS}+ avaliações no Google
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* reviews — rolagem horizontal automática */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.7, ease: EASE, delay: 0.25 }}
          className="relative -mx-6 md:-mx-12 lg:-mx-20"
        >
          <div className="reviews-marquee-wrap overflow-hidden" aria-label="Avaliações de clientes">
            <div className="reviews-marquee-track flex w-max gap-4 md:gap-5 px-6 md:px-12 lg:px-20">
              {marqueeReviews.map((review, i) => (
                <ReviewCard key={`${review.id}-${i}`} review={review} />
              ))}
            </div>
          </div>
          <div
            className="pointer-events-none absolute inset-y-0 left-0 w-12 md:w-20 z-10"
            style={{
              background: "linear-gradient(to right, var(--bg), transparent)",
            }}
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-y-0 right-0 w-12 md:w-20 z-10"
            style={{
              background: "linear-gradient(to left, var(--bg), transparent)",
            }}
            aria-hidden
          />
        </motion.div>

        {/* CTA google */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, ease: EASE }}
          className="mt-12 flex justify-center"
        >
          <motion.a
            href="https://www.google.com/maps"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{
              scale: 1.03,
              borderColor: "rgb(var(--neon-rgb) / 0.4)",
              color: "var(--neon)",
            }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-3 px-7 py-3.5 rounded-full text-sm font-semibold uppercase tracking-[0.1em] text-zinc-400 transition-all duration-300"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <GoogleLogo className="w-5 h-5" />
            Ver todas no Google
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
