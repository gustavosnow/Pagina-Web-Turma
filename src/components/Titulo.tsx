import { useEffect, useRef, type ReactNode } from "react";
import { gsap, reduzirMovimento } from "../lib/movimento";
import { PixelIcon, type NomeSprite } from "./PixelIcon";

type Props = {
  id: string;
  icone: NomeSprite;
  mundo: string;
  titulo: string;
  children?: ReactNode;
  claro?: boolean;
};

/** Cabeçalho padrão das seções: "MUNDO X", ícone, título e subtítulo, com entrada em degraus. */
export function Titulo({ id, icone, mundo, titulo, children, claro }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (reduzirMovimento() || !ref.current) return;
    const ctx = gsap.context(() => {
      gsap.from(ref.current!.children, {
        x: -40,
        opacity: 0,
        duration: 0.45,
        ease: "steps(5)",
        stagger: 0.08,
        scrollTrigger: { trigger: ref.current, start: "top 85%" },
      });
    }, ref);
    return () => ctx.revert();
  }, []);
  return (
    <div ref={ref} className={`titulo ${claro ? "titulo--claro" : ""}`}>
      <p className="titulo__mundo">
        <PixelIcon nome={icone} escala={3} /> {mundo}
      </p>
      <h2 id={id} className="titulo__h2">
        {titulo}
      </h2>
      {children && <p className="titulo__sub">{children}</p>}
    </div>
  );
}

/** Número que conta de 0 até o valor quando entra na tela */
export function Contador({ valor, sufixo = "" }: { valor: number; sufixo?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || reduzirMovimento()) return;
    const obj = { v: 0 };
    el.textContent = "0" + sufixo;
    const tween = gsap.to(obj, {
      v: valor,
      duration: 1.2,
      ease: `steps(${valor})`,
      paused: true,
      onUpdate: () => {
        el.textContent = Math.round(obj.v) + sufixo;
      },
    });
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        tween.play();
        obs.disconnect();
      }
    });
    obs.observe(el);
    return () => {
      obs.disconnect();
      tween.kill();
    };
  }, [valor, sufixo]);
  return (
    <span ref={ref}>
      {valor}
      {sufixo}
    </span>
  );
}
