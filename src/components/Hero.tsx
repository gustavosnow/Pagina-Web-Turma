import { lazy, Suspense, useLayoutEffect, useRef } from "react";
import { gsap, useReduzirMovimento } from "../lib/movimento";
import { irPara } from "../lib/rolagem";
import { tocar } from "../lib/som";
import { TURMA } from "../data/turma";
import { Montanhas } from "./Cenario";

const Hero3D = lazy(() => import("./Hero3D"));

function Letras({ texto }: { texto: string }) {
  return (
    <>
      {[...texto].map((c, i) => (
        <span key={i} className="letra" aria-hidden="true">
          {c === " " ? " " : c}
        </span>
      ))}
    </>
  );
}

export function Hero({ iniciado }: { iniciado: boolean }) {
  const raiz = useRef<HTMLElement>(null);
  const reduzir = useReduzirMovimento();

  useLayoutEffect(() => {
    if (reduzir || !iniciado || !raiz.current) return;
    const ctx = gsap.context(() => {
      gsap
        .timeline({ delay: 0.15 })
        .from(".hero__tag", { y: -20, opacity: 0, duration: 0.4, ease: "steps(4)" })
        .from(".letra", { y: -120, opacity: 0, duration: 0.5, ease: "bounce.out", stagger: 0.025 }, "<0.1")
        .from(".hero__lead", { opacity: 0, duration: 0.4, ease: "steps(4)" }, "-=0.2")
        .from(".hero__acoes > *", { y: 30, opacity: 0, duration: 0.4, ease: "steps(5)", stagger: 0.1 }, "<");

      // parallax do cenário ao rolar
      gsap.to(".montanhas--longe", {
        yPercent: 18,
        ease: "none",
        scrollTrigger: { trigger: raiz.current, start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to(".hero__conteudo", {
        yPercent: 30,
        opacity: 0,
        ease: "none",
        scrollTrigger: { trigger: raiz.current, start: "top top", end: "bottom top", scrub: true },
      });
    }, raiz);
    return () => ctx.revert();
  }, [iniciado, reduzir]);

  return (
    <section ref={raiz} id="inicio" className="hero" aria-labelledby="hero-titulo">
      <div className="ceu" aria-hidden="true">
        <span className="nuvem nuvem--1" />
        <span className="nuvem nuvem--2" />
        <span className="nuvem nuvem--3" />
        <span className="nuvem nuvem--4" />
      </div>
      <Montanhas className="montanhas--longe" cor="#83769c" semente={3} altura={0.55} />
      <Montanhas className="montanhas--perto" cor="#008751" semente={7} altura={0.35} />

      <Suspense fallback={null}>
        <Hero3D animar={!reduzir} />
      </Suspense>

      <div className="hero__conteudo container">
        <p className="hero__tag">
          {TURMA.instituicao} · {TURMA.periodo} · {TURMA.semestre}º SEMESTRE · TARDE
        </p>
        <h1 id="hero-titulo" className="hero__titulo">
          <span className="sr-only">Turma de Engenharia de Software {TURMA.periodo}</span>
          <span className="hero__titulo-pre">
            <Letras texto="TURMA DE" />
          </span>
          <span className="hero__titulo-main">
            <Letras texto="ENGENHARIA" />
          </span>
          <span className="hero__titulo-main">
            <Letras texto="DE SOFTWARE" />
          </span>
        </h1>
        <p className="hero__lead">Uma jornada em 8 bits. Ingresso em {TURMA.ingresso}, nível 5 em andamento.</p>
        <div className="hero__acoes">
          <a
            href="#jornada"
            className="btn btn--start"
            onClick={(e) => {
              e.preventDefault();
              tocar("start");
              irPara("#jornada");
            }}
          >
            PRESS START <span aria-hidden="true">▶</span>
          </a>
          <a
            href="#jogadores"
            className="btn btn--sec"
            onClick={(e) => {
              e.preventDefault();
              tocar("select");
              irPara("#jogadores");
            }}
          >
            SELECIONAR JOGADOR
          </a>
        </div>
      </div>
      <p className="hero__dica" aria-hidden="true">
        ▼ ROLE PARA JOGAR
      </p>
      <div className="chao" aria-hidden="true" />
    </section>
  );
}
