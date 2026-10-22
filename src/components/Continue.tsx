import { useEffect, useRef, useState } from "react";
import { gsap, reduzirMovimento } from "../lib/movimento";
import { tocar } from "../lib/som";
import { irPara } from "../lib/rolagem";
import { useDigitacao } from "../hooks/useDigitacao";
import { ALUNOS, INSTAGRAM_URL, TURMA, caminhoFoto } from "../data/turma";
import { PixelPhoto } from "./PixelPhoto";
import { PixelIcon } from "./PixelIcon";
import { Estrelas, Montanhas } from "./Cenario";

/* Fim de jogo no estilo Undertale: a SOUL racha e se parte, aparece GAME OVER,
   uma voz pede para a turma ficar determinada... e a resposta é "ainda não". */

type Fase = "espera" | "quebra" | "gameover" | "fala" | "fim";

const FALA = "* Não desista ainda...\n* Turma! Fique determinada...";

export function Continue() {
  const raiz = useRef<HTMLElement>(null);
  const [fase, setFase] = useState<Fase>("espera");
  const { parcial, completo } = useDigitacao(FALA, fase === "fala", 45);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        obs.disconnect();
        if (reduzirMovimento()) return setFase("fim");
        setFase("quebra");
      },
      { threshold: 0.5 },
    );
    if (raiz.current) obs.observe(raiz.current);
    return () => obs.disconnect();
  }, []);

  // a alma racha, as metades se afastam e viram cacos
  useEffect(() => {
    if (fase !== "quebra" || !raiz.current) return;
    const ctx = gsap.context(() => {
      gsap
        .timeline({ onComplete: () => setFase("gameover") })
        .to({}, { duration: 0.6 })
        .call(() => tocar("quebra"))
        .set(".alma-quebra__inteira", { opacity: 0 })
        .set(".alma-quebra__metade", { opacity: 1 })
        .to(".alma-quebra__metade--e", { x: -6, duration: 0.1, ease: "steps(1)" })
        .to(".alma-quebra__metade--d", { x: 6, duration: 0.1, ease: "steps(1)" }, "<")
        .to({}, { duration: 0.7 })
        .set(".alma-quebra__metade", { opacity: 0 })
        .fromTo(
          ".caco",
          { x: 0, y: 0, opacity: 1 },
          {
            x: () => gsap.utils.random(-140, 140),
            y: () => gsap.utils.random(40, 220),
            opacity: 0,
            duration: 1.1,
            ease: "power1.in",
            stagger: 0.02,
          },
        );
    }, raiz);
    return () => ctx.revert();
  }, [fase]);

  useEffect(() => {
    if (fase === "gameover") {
      const t = setTimeout(() => setFase("fala"), 1200);
      return () => clearTimeout(t);
    }
    if (fase === "fala" && completo) {
      const t = setTimeout(() => {
        tocar("start");
        setFase("fim");
      }, 1100);
      return () => clearTimeout(t);
    }
  }, [fase, completo]);

  const fim = fase === "fim";

  return (
    <section ref={raiz} id="continue" className={`secao continue is-${fase}`} aria-labelledby="continue-titulo">
      <Estrelas />
      <div className="sol" aria-hidden="true" />
      <Montanhas className="continue__montanhas" cor="#2a1d4a" semente={11} altura={0.5} />

      <div className="container continue__conteudo">
        {(fase === "espera" || fase === "quebra") && (
          <div className="alma-quebra" aria-hidden="true">
            <PixelIcon nome="alma" escala={6} className="alma-quebra__inteira" />
            <PixelIcon nome="almaEsquerda" escala={6} className="alma-quebra__metade alma-quebra__metade--e" />
            <PixelIcon nome="almaDireita" escala={6} className="alma-quebra__metade alma-quebra__metade--d" />
            {Array.from({ length: 6 }, (_, i) => (
              <span key={i} className="caco" />
            ))}
          </div>
        )}
        <p className={`continue__gameover ${fase === "gameover" || fase === "fala" ? "is-visivel" : ""}`} aria-hidden="true">
          GAME
          <br />
          OVER
        </p>
        {fase === "fala" && (
          <p className="continue__fala" aria-hidden="true">
            {parcial}
          </p>
        )}

        <h2 id="continue-titulo" className={`continue__titulo ${fim ? "is-visivel" : ""}`}>
          <span className="sr-only">Game over? </span>AINDA NÃO.
        </h2>
        <p className={`continue__texto ${fim ? "is-visivel" : ""}`}>
          * A jornada continua, e o próximo nível é só o começo.
          <br />* Saber disso te enche de DETERMINAÇÃO.
        </p>
        <a
          href="#inicio"
          className={`ut-botao continue__btn ${fim ? "is-visivel" : ""}`}
          tabIndex={fim ? 0 : -1}
          onClick={(e) => {
            e.preventDefault();
            tocar("start");
            irPara("#inicio");
          }}
        >
          CONTINUAR
        </a>
      </div>

      <ul className="party" aria-label="A party completa">
        {ALUNOS.map((a) => (
          <li key={a.nome} title={a.apelido}>
            <PixelPhoto src={caminhoFoto(a.foto)} alt={a.nome} nitida={false} base={10} />
          </li>
        ))}
      </ul>

      <footer className="rodape">
        <p>
          <strong>
            {TURMA.nome.toUpperCase()} {TURMA.periodo}
          </strong>{" "}
          · {TURMA.instituicao}
        </p>
        <p>
          {TURMA.semestre}º semestre · turno da tarde · ingresso em {TURMA.ingresso}
        </p>
        <a className="rodape__instagram" href={INSTAGRAM_URL} target="_blank" rel="noreferrer">
          <PixelIcon nome="instagram" escala={2} />
          <span>@eng.software_pbs2024</span>
          <span className="sr-only"> (abre em uma nova aba)</span>
        </a>
        <p className="rodape__copy">© {new Date().getFullYear()} Feito pela turma. Nenhum bug foi ferido nesta produção.</p>
      </footer>
    </section>
  );
}
