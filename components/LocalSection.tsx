"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { getLocalPhotos, type LocalPhoto } from "@/lib/demo-images";

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

function PhotoCard({ photo, index }: { photo: LocalPhoto; index: number }) {
  return (
    <motion.figure
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, ease: EASE, delay: index * 0.08 }}
      whileHover={{ y: -3 }}
      className={`group relative overflow-hidden rounded-xl ${photo.className}`}
      style={{
        border: "1px solid rgba(255,255,255,0.07)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.35)",
      }}
    >
      <div className="relative aspect-[4/3] md:aspect-auto md:h-full md:min-h-[140px]">
        <Image
          key={photo.src}
          src={photo.src}
          alt={photo.alt}
          fill
          sizes={photo.sizes}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to top, rgba(2,2,3,0.85) 0%, rgba(2,2,3,0.15) 45%, transparent 100%)",
          }}
        />
        <figcaption
          className="absolute bottom-0 left-0 right-0 px-3 py-2.5"
          style={{ fontFamily: "var(--font-bebas)", letterSpacing: "0.12em" }}
        >
          <span className="text-[11px] font-bold uppercase text-white/90">
            {photo.label}
          </span>
        </figcaption>
      </div>
    </motion.figure>
  );
}

export function LocalSection() {
  const headerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(headerRef, { once: true, margin: "-60px" });
  const photos = getLocalPhotos();

  return (
    <section
      id="local"
      className="relative w-full py-16 md:py-20 overflow-hidden"
      style={{ background: "var(--bg)" }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{
          background:
            "linear-gradient(to right, transparent, rgb(var(--neon-rgb) / 0.2) 30%, rgb(var(--neon-rgb) / 0.35) 50%, rgb(var(--neon-rgb) / 0.2) 70%, transparent)",
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-12">
        <div ref={headerRef} className="mb-8 md:mb-10">
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, ease: EASE }}
            className="flex items-center gap-3 mb-3"
          >
            <span
              className="block h-px w-8"
              style={{ background: "var(--neon)" }}
            />
            <span
              className="text-[10px] uppercase tracking-[0.3em] font-semibold"
              style={{ color: "var(--neon)" }}
            >
              O Espaço
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: EASE, delay: 0.08 }}
          >
            <h2
              className="uppercase leading-none text-white"
              style={{
                fontFamily: "var(--font-bebas)",
                fontSize: "clamp(2.25rem, 6vw, 3.5rem)",
                letterSpacing: "0.02em",
              }}
            >
              Conheça o{" "}
              <span
                style={{
                  color: "var(--neon)",
                  textShadow: "0 0 24px rgb(var(--neon-rgb) / 0.35)",
                }}
              >
                Local
              </span>
            </h2>
            <p className="mt-2 text-sm text-zinc-500 max-w-md">
              Conveniência completa — prateleiras organizadas, produtos
              variados e atendimento rápido para o seu dia a dia.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 md:grid-rows-2 gap-3 md:gap-3.5 md:max-h-[320px]">
          {photos.map((photo, index) => (
            <PhotoCard key={photo.id} photo={photo} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
