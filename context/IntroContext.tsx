"use client";

import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { usePathname } from "next/navigation";
import { introWasPlayed, persistIntroDone } from "@/lib/intro-storage";

type IntroPhase = "idle" | "loading" | "exiting" | "complete";

type IntroContextValue = {
  phase: IntroPhase;
  isIntroComplete: boolean;
  shouldRevealHero: boolean;
  markExiting: () => void;
  markComplete: () => void;
};

const IntroContext = createContext<IntroContextValue | null>(null);

export function IntroProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const prevPathRef = useRef(pathname);
  const [phase, setPhase] = useState<IntroPhase>("complete");

  useLayoutEffect(() => {
    const prev = prevPathRef.current;
    prevPathRef.current = pathname;

    /* Saiu da home → intro não deve repetir ao voltar */
    if (prev === "/" && pathname !== "/") {
      persistIntroDone();
    }

    if (pathname !== "/") {
      setPhase("complete");
      document.body.style.overflow = "";
      return;
    }

    if (introWasPlayed()) {
      setPhase("complete");
      document.body.style.overflow = "";
      return;
    }

    setPhase("loading");
    document.body.style.overflow = "hidden";
  }, [pathname]);

  const markExiting = useCallback(() => {
    setPhase("exiting");
  }, []);

  const markComplete = useCallback(() => {
    persistIntroDone();
    setPhase("complete");
    document.body.style.overflow = "";
  }, []);

  const value = useMemo(
    () => ({
      phase,
      isIntroComplete: phase === "complete",
      shouldRevealHero: phase === "exiting" || phase === "complete",
      markExiting,
      markComplete,
    }),
    [phase, markExiting, markComplete]
  );

  return <IntroContext.Provider value={value}>{children}</IntroContext.Provider>;
}

export function useIntro() {
  const ctx = useContext(IntroContext);
  if (!ctx) {
    return {
      phase: "complete" as IntroPhase,
      isIntroComplete: true,
      shouldRevealHero: true,
      markExiting: () => {},
      markComplete: () => {},
    };
  }
  return ctx;
}

export function useIntroActive() {
  const { phase } = useIntro();
  return phase === "loading" || phase === "exiting";
}
