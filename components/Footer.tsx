import { Store, MapPin, Phone, Clock, Mail, ExternalLink } from "lucide-react";

const MAPS_EMBED_URL =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.348!2d-46.657!3d-23.561!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce599ceb8f9f63%3A0xeb45ea586429733!2sAv.%20Paulista%2C%20S%C3%A3o%20Paulo%20-%20SP!5e0!3m2!1spt-BR!2sbr!4v1710000000000!5m2!1spt-BR!2sbr";

const MAPS_LINK = "https://www.google.com/maps/search/?api=1&query=Whiskritório+Piraju";

const navLinks = [
  { label: "Cardápio", href: "/cardapio" },
  { label: "Eventos", href: "#eventos" },
  { label: "Avaliações", href: "#avaliacoes" },
];

const hours = [
  { days: "Seg — Sáb", time: "7h às 22h" },
  { days: "Domingo", time: "8h às 20h" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      id="contato"
      className="relative w-full overflow-hidden"
      style={{ background: "var(--bg)" }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{
          background:
            "linear-gradient(to right, transparent, rgb(var(--neon-rgb) / 0.25) 40%, rgb(var(--neon-rgb) / 0.4) 50%, rgb(var(--neon-rgb) / 0.25) 60%, transparent)",
        }}
      />

      {/* map */}
      <div className="relative w-full">
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            background:
              "linear-gradient(to bottom, var(--bg) 0%, transparent 12%, transparent 88%, var(--bg) 100%)",
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            background:
              "linear-gradient(to right, var(--bg) 0%, transparent 8%, transparent 92%, var(--bg) 100%)",
          }}
        />
        <iframe
          title="Localização Whiskritório no Google Maps"
          src={MAPS_EMBED_URL}
          className="w-full h-[280px] md:h-[360px] border-0 grayscale opacity-70 hover:opacity-90 transition-opacity duration-500"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>

      <div className="relative z-20 max-w-7xl mx-auto px-6 md:px-12 lg:px-20 -mt-8 md:-mt-12 pb-10">
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 p-8 md:p-10 rounded-2xl"
          style={{
            background: "rgba(2,2,3,0.95)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(255,255,255,0.07)",
            boxShadow: "0 8px 40px rgba(0,0,0,0.5)",
          }}
        >
          {/* brand */}
          <div className="lg:col-span-1">
            <a href="/" className="inline-flex items-center gap-2.5 mb-4">
              <Store className="w-5 h-7 text-[var(--neon)]" strokeWidth={2} aria-hidden />
              <span
                className="text-xl font-black uppercase text-white"
                style={{ fontFamily: "var(--font-bebas)", letterSpacing: "0.08em" }}
              >
                Whisk<span className="text-[var(--neon)]">ritório</span>
              </span>
            </a>
            <p className="text-sm text-zinc-500 leading-relaxed max-w-xs">
              Conveniência e distribuidora com variedade, preço justo e atendimento rápido.
            </p>
          </div>

          {/* contato */}
          <div>
            <h3
              className="text-white uppercase mb-4"
              style={{
                fontFamily: "var(--font-bebas)",
                fontSize: "1.15rem",
                letterSpacing: "0.12em",
              }}
            >
              Contato
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href={MAPS_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2.5 text-sm text-zinc-400 hover:text-[var(--neon)] transition-colors group"
                >
                  <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-[var(--neon)]" strokeWidth={2} />
                  <span>
                    Rua Augusta, 1456 — Consolação
                    <br />
                    São Paulo — SP, 01305-100
                    <ExternalLink className="inline w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </span>
                </a>
              </li>
              <li>
                <a
                  href="tel:+5511999999999"
                  className="flex items-center gap-2.5 text-sm text-zinc-400 hover:text-[var(--neon)] transition-colors"
                >
                  <Phone className="w-4 h-4 shrink-0 text-[var(--neon)]" strokeWidth={2} />
                  (11) 99999-9999
                </a>
              </li>
              <li>
                <a
                  href="mailto:contato@whiskritorio.com.br"
                  className="flex items-center gap-2.5 text-sm text-zinc-400 hover:text-[var(--neon)] transition-colors"
                >
                  <Mail className="w-4 h-4 shrink-0 text-[var(--neon)]" strokeWidth={2} />
                  contato@whiskritorio.com.br
                </a>
              </li>
            </ul>
          </div>

          {/* horários */}
          <div>
            <h3
              className="text-white uppercase mb-4"
              style={{
                fontFamily: "var(--font-bebas)",
                fontSize: "1.15rem",
                letterSpacing: "0.12em",
              }}
            >
              Horários
            </h3>
            <ul className="space-y-2.5">
              {hours.map((row) => (
                <li key={row.days} className="flex items-center justify-between gap-4 text-sm">
                  <span className="flex items-center gap-2 text-zinc-500">
                    <Clock className="w-3.5 h-3.5 text-[var(--neon)]" strokeWidth={2} />
                    {row.days}
                  </span>
                  <span className="text-zinc-300 font-medium">{row.time}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* links */}
          <div>
            <h3
              className="text-white uppercase mb-4"
              style={{
                fontFamily: "var(--font-bebas)",
                fontSize: "1.15rem",
                letterSpacing: "0.12em",
              }}
            >
              Navegação
            </h3>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-zinc-400 hover:text-[var(--neon)] transition-colors uppercase tracking-[0.08em]"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
            <a
              href={MAPS_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-[0.1em] transition-all duration-300 hover:scale-[1.03]"
              style={{
                background: "var(--neon)",
                color: "#000",
                boxShadow: "0 0 16px rgb(var(--neon-rgb) / 0.25)",
              }}
            >
              <MapPin className="w-3.5 h-3.5" strokeWidth={2.5} />
              Como chegar
            </a>
          </div>
        </div>

        {/* bottom bar */}
        <div
          className="mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] uppercase tracking-[0.12em] text-zinc-600"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          <p>© {year} Whiskritório. Todos os direitos reservados.</p>
          <p>Conveniência e Distribuidora · Piraju</p>
        </div>
      </div>
    </footer>
  );
}
