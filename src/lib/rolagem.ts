import Lenis from "lenis";
import { gsap, ScrollTrigger, reduzirMovimento } from "./movimento";

let lenis: Lenis | null = null;

/** Liga a rolagem suave (Lenis) sincronizada com o ScrollTrigger. Devolve a função de desligar. */
export function iniciarRolagem() {
  if (reduzirMovimento()) return () => {};
  lenis = new Lenis({ duration: 1.1, smoothWheel: true });
  lenis.on("scroll", ScrollTrigger.update);
  const raf = (t: number) => lenis?.raf(t * 1000);
  gsap.ticker.add(raf);
  gsap.ticker.lagSmoothing(0);
  return () => {
    gsap.ticker.remove(raf);
    lenis?.destroy();
    lenis = null;
  };
}

export function pausarRolagem(pausar: boolean) {
  if (pausar) lenis?.stop();
  else lenis?.start();
  document.documentElement.style.overflow = pausar ? "hidden" : "";
}

/** Rola até uma âncora (#id) e passa o foco para ela, para quem navega por teclado */
export function irPara(alvo: string) {
  const el = document.querySelector<HTMLElement>(alvo);
  if (!el) return;
  const focar = () => {
    if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "-1");
    el.focus({ preventScroll: true });
  };
  if (lenis) lenis.scrollTo(el, { offset: -64, onComplete: focar });
  else {
    el.scrollIntoView({ behavior: reduzirMovimento() ? "auto" : "smooth" });
    focar();
  }
}
