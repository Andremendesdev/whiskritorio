const INTRO_KEY = "whisk-intro-done";
const SCROLL_KEY = "whisk-home-scroll";

/** Persiste fora do React — sobrevive remount (Strict Mode) e navegação. */
let introHasPlayed = false;

export function introWasPlayed(): boolean {
  if (introHasPlayed) return true;
  if (typeof window === "undefined") return false;
  try {
    return sessionStorage.getItem(INTRO_KEY) === "1";
  } catch {
    return false;
  }
}

export function persistIntroDone(): void {
  introHasPlayed = true;
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(INTRO_KEY, "1");
  } catch {
    /* ignore */
  }
}

export function saveHomeScroll(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(SCROLL_KEY, String(window.scrollY));
  } catch {
    /* ignore */
  }
}

export function consumeHomeScroll(): number | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(SCROLL_KEY);
    sessionStorage.removeItem(SCROLL_KEY);
    if (raw == null) return null;
    const y = Number(raw);
    return Number.isFinite(y) ? y : null;
  } catch {
    return null;
  }
}
