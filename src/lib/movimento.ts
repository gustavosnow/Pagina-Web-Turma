import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { useMidia } from "../hooks/useMidia";

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

const consulta = typeof window !== "undefined" ? window.matchMedia("(prefers-reduced-motion: reduce)") : null;

/** true quando o sistema pede menos movimento: sem Lenis, sem animações presas à rolagem */
export function reduzirMovimento() {
  return consulta?.matches ?? false;
}

export const useReduzirMovimento = () => useMidia("(prefers-reduced-motion: reduce)");

export { gsap, ScrollTrigger };
