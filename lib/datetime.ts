const SP_TIMEZONE = "America/Sao_Paulo";

export function formatOrderDateTime(iso: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: SP_TIMEZONE,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
    .format(new Date(iso))
    .replace(",", " às");
}

export function formatEventDisplay(iso: string) {
  const date = new Date(iso);

  const day = new Intl.DateTimeFormat("pt-BR", {
    timeZone: SP_TIMEZONE,
    day: "2-digit",
  }).format(date);

  const month = new Intl.DateTimeFormat("pt-BR", {
    timeZone: SP_TIMEZONE,
    month: "short",
  })
    .format(date)
    .replace(".", "")
    .toUpperCase();

  const weekday = new Intl.DateTimeFormat("pt-BR", {
    timeZone: SP_TIMEZONE,
    weekday: "short",
  }).format(date);

  const time = new Intl.DateTimeFormat("pt-BR", {
    timeZone: SP_TIMEZONE,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);

  return { day, month, weekday, time };
}

/** Converte ISO para valor de input datetime-local (fuso SP). */
export function toDatetimeLocalValue(iso: string): string {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-CA", {
      timeZone: SP_TIMEZONE,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
      .formatToParts(new Date(iso))
      .map((part) => [part.type, part.value])
  );

  return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}`;
}

/** Interpreta datetime-local como horário de São Paulo e retorna ISO UTC. */
export function fromDatetimeLocalValue(value: string): string {
  return new Date(`${value}:00-03:00`).toISOString();
}
