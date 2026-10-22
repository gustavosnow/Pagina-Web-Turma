import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { useSyncExternalStore } from "react";

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

const consulta = typeof window !== "undefined" ? window.matchMedia("(prefers-reduced-motion: reduce)") : null;

/** true quando o sistema pede menos movimento: sem Lenis, sem animações presas à rolagem */
export function reduzirMovimento() {
  return consulta?.matches ?? false;
}

export function useReduzirMovimento() {
  return useSyncExternalStore(
    (cb) => {
      consulta?.addEventListener("change", cb);
      return () => consulta?.removeEventListener("change", cb);
    },
    reduzirMovimento,
    () => false,
  );
}

/** Easing em degraus, para o movimento "travado" de jogo 8 bits */
export const degraus = (n: number) => `steps(${n})`;

export { gsap, ScrollTrigger };
