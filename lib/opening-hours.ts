/** Horários do Whiskritório (fuso America/Sao_Paulo) */
export function isWhiskritorioOpen(now: Date = new Date()): boolean {
  const { minutes } = getSaoPauloDayAndMinutes(now);

  // Seg — Dom: 7h às 22h
  return minutes >= 7 * 60 && minutes < 22 * 60;
}

function getSaoPauloDayAndMinutes(now: Date): { day: number; minutes: number } {
  const weekday = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Sao_Paulo",
    weekday: "short",
  }).format(now);

  const dayMap: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };

  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Sao_Paulo",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(now);

  const hour = Number(parts.find((p) => p.type === "hour")?.value ?? 0);
  const minute = Number(parts.find((p) => p.type === "minute")?.value ?? 0);

  return {
    day: dayMap[weekday] ?? 0,
    minutes: hour * 60 + minute,
  };
}
