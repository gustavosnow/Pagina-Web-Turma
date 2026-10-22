import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "../lib/movimento";
import { tocar } from "../lib/som";
import { useDigitacao } from "../hooks/useDigitacao";
import { ALUNOS, TURMA, caminhoFoto } from "../data/turma";
import { PixelPhoto } from "./PixelPhoto";
import { PixelIcon } from "./PixelIcon";

type Props = { aoIniciar: () => void };

/* Intro em quadros, como a abertura do Undertale: arte em sépia, texto digitado embaixo
   e, no fim, a tela de título. Enter/clique completa o texto ou passa o quadro. */

function ArteTurma() {
  return (
    <ul className="intro__rostos">
      {ALUNOS.map((a) => (
        <li key={a.nome}>
          <PixelPhoto src={caminhoFoto(a.foto)} alt="" nitida={false} base={8} />
        </li>
      ))}
    </ul>
  );
}

function ArteCastelo() {
  return (
    <div className="intro__cena intro__cena--noite">
      <span className="intro__lua" />
      <PixelIcon nome="castelo" escala={9} />
    </div>
  );
}

function ArteCaminho() {
  return (
    <div className="intro__cena intro__cena--dia">
      <PixelIcon nome="jogador" escala={6} className="intro__jogador" />
      <span className="intro__chao" />
    </div>
  );
}

const QUADROS = [
  { arte: <ArteTurma />, texto: `Há muito tempo, em ${TURMA.ingresso}, ${ALUNOS.length} estudantes entraram na ${TURMA.instituicao}.` },
  { arte: <ArteCastelo />, texto: "Eles atravessaram semestres, provas e entregas de madrugada." },
  { arte: <ArteCaminho />, texto: `Hoje, no ${TURMA.semestre}º semestre, a jornada continua...` },
];

export function BootScreen({ aoIniciar }: Props) {
  const raiz = useRef<HTMLDivElement>(null);
  const titulo = useRef<HTMLButtonElement>(null);
  const [q, setQ] = useState(0);
  const noTitulo = q >= QUADROS.length;
  const saindo = useRef(false);
  const { parcial, completo, completar } = useDigitacao(noTitulo ? "" : QUADROS[q].texto, !noTitulo, 45);

  const entrar = useCallback(() => {
    if (saindo.current) return;
    saindo.current = true;
    tocar("start");
    const el = raiz.current;
    if (!el) return aoIniciar();
    gsap
      .timeline({ onComplete: aoIniciar })
      .to(el, { backgroundColor: "#fff", duration: 0.08, ease: "steps(1)" })
      .to(el, { backgroundColor: "#000", duration: 0.08, ease: "steps(1)" })
      .to(el, { opacity: 0, duration: 0.5, ease: "steps(5)" });
  }, [aoIniciar]);

  const avancar = useCallback(() => {
    if (noTitulo) return entrar();
    if (!completo) return completar();
    setQ((n) => n + 1);
  }, [noTitulo, completo, completar, entrar]);

  // o quadro passa sozinho um tempo depois do texto terminar
  useEffect(() => {
    if (noTitulo || !completo) return;
    const t = setTimeout(() => setQ((n) => n + 1), 1800);
    return () => clearTimeout(t);
  }, [completo, noTitulo]);

  useEffect(() => {
    if (noTitulo) titulo.current?.focus();
  }, [noTitulo]);

  useEffect(() => {
    const tecla = (e: KeyboardEvent) => {
      if (e.key === "Tab") return;
      if (e.key === "Escape") return entrar();
      e.preventDefault();
      avancar();
    };
    addEventListener("keydown", tecla);
    return () => removeEventListener("keydown", tecla);
  }, [avancar, entrar]);

  return (
    <div ref={raiz} className="boot intro" role="dialog" aria-modal="true" aria-label="Abertura" onClick={avancar}>
      {!noTitulo ? (
        <div className="intro__quadro" key={q}>
          <div className="intro__arte" aria-hidden="true">
            {QUADROS[q].arte}
          </div>
          <p className="sr-only" aria-live="polite">
            {QUADROS[q].texto}
          </p>
          <p className="intro__texto" aria-hidden="true">
            {parcial}
          </p>
        </div>
      ) : (
        <div className="intro__titulo">
          <p className="intro__nome">
            ENGENHARIA
            <br />
            DE SOFTWARE
          </p>
          <p className="intro__periodo">
            {TURMA.instituicao} · {TURMA.periodo}
          </p>
          <button ref={titulo} type="button" className="intro__start" onClick={entrar}>
            [PRESS ENTER OU CLIQUE]
          </button>
        </div>
      )}
      <button
        type="button"
        className="intro__pular"
        onClick={(e) => {
          e.stopPropagation();
          entrar();
        }}
      >
        Pular intro
      </button>
    </div>
  );
}
