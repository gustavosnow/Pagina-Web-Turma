import { useEffect, useRef, useState } from "react";
import { gsap } from "../lib/movimento";
import { tocar } from "../lib/som";
import { ALUNOS } from "../data/turma";

type Props = { aoIniciar: () => void };

const MENSAGENS = [
  "CARREGANDO MAPA...",
  `CARREGANDO ${ALUNOS.length} JOGADORES...`,
  "COMPILANDO CAFÉ...",
  "PRONTO!",
];

/** Tela de "liga o console": barra de carregamento e PRESS START. Qualquer tecla ou clique entra. */
export function BootScreen({ aoIniciar }: Props) {
  const raiz = useRef<HTMLDivElement>(null);
  const botao = useRef<HTMLButtonElement>(null);
  const [progresso, setProgresso] = useState(0);
  const saindo = useRef(false);

  const pronto = progresso >= 100;
  const mensagem = MENSAGENS[Math.min(MENSAGENS.length - 1, Math.floor((progresso / 100) * (MENSAGENS.length - 1)))];

  useEffect(() => {
    const estado = { v: 0 };
    const tween = gsap.to(estado, {
      v: 100,
      duration: 1.6,
      ease: "steps(10)",
      onUpdate: () => setProgresso(Math.round(estado.v)),
    });
    botao.current?.focus();
    return () => {
      tween.kill();
    };
  }, []);

  function entrar() {
    if (saindo.current) return;
    saindo.current = true;
    tocar("start");
    const el = raiz.current;
    if (!el) return aoIniciar();
    gsap
      .timeline({ onComplete: aoIniciar })
      .to(el.querySelector(".boot__conteudo"), { scale: 1.08, opacity: 0, duration: 0.25, ease: "steps(4)" })
      .to(el.querySelector(".boot__metade--cima"), { yPercent: -100, duration: 0.5, ease: "steps(8)" }, "<0.1")
      .to(el.querySelector(".boot__metade--baixo"), { yPercent: 100, duration: 0.5, ease: "steps(8)" }, "<");
  }

  useEffect(() => {
    const tecla = (e: KeyboardEvent) => {
      if (e.key === "Tab") return;
      e.preventDefault();
      entrar();
    };
    window.addEventListener("keydown", tecla);
    return () => window.removeEventListener("keydown", tecla);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={raiz} className="boot" role="dialog" aria-modal="true" aria-label="Tela inicial" onClick={entrar}>
      <div className="boot__metade boot__metade--cima" />
      <div className="boot__metade boot__metade--baixo" />
      <div className="boot__conteudo">
        <p className="boot__marca">
          ES<span>2026.2</span>
        </p>
        <p className="boot__sub">ENTERTAINMENT SYSTEM</p>
        <div
          className="boot__barra"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progresso}
          aria-label="Carregando"
        >
          <div className="boot__barra-fill" style={{ width: `${progresso}%` }} />
        </div>
        <p className="boot__msg" aria-live="polite">
          {mensagem}
        </p>
        <button ref={botao} type="button" className={`boot__start ${pronto ? "is-pronto" : ""}`} onClick={entrar}>
          PRESS START
        </button>
        <p className="boot__dica">qualquer tecla ou clique para começar</p>
        <p className="boot__copy">© {new Date().getFullYear()} TURMA DE ENGENHARIA DE SOFTWARE · UEPA</p>
      </div>
    </div>
  );
}
