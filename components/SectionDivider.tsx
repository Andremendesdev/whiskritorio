export function SectionDivider() {
  return (
    <div
      className="relative w-full h-14 sm:h-16 md:h-[4.5rem] overflow-hidden bg-[var(--bg)]"
      role="presentation"
      aria-hidden
    >
      {/* mobile — cover centralizado */}
      <div
        className="absolute inset-0 md:hidden"
        style={{
          backgroundImage: "url(/section-divider.png)",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center center",
        }}
      />

      {/* desktop — largura total, recorte vertical da faixa central */}
      <div
        className="absolute inset-0 hidden md:block"
        style={{
          backgroundImage: "url(/section-divider.png)",
          backgroundRepeat: "no-repeat",
          backgroundSize: "100% auto",
          backgroundPosition: "center center",
        }}
      />
    </div>
  );
}
