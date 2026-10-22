import { useEffect, useRef, useState } from "react";
import { reduzirMovimento } from "../lib/movimento";
import { tocar } from "../lib/som";
import { irPara } from "../lib/rolagem";
import { ALUNOS, TURMA, caminhoFoto } from "../data/turma";
import { PixelPhoto } from "./PixelPhoto";
import { Estrelas, Montanhas } from "./Cenario";

/** Fim de jogo que não é fim: contagem do CONTINUE? e a virada para "ainda não". */
export function Continue() {
  const raiz = useRef<HTMLElement>(null);
  const [conta, setConta] = useState<number | null>(null);
  const terminou = conta === 0;

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        setConta(reduzirMovimento() ? 0 : 9);
        obs.disconnect();
      },
      { threshold: 0.5 },
    );
    if (raiz.current) obs.observe(raiz.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (conta === null || conta === 0) return;
    const t = setTimeout(() => {
      setConta(conta - 1);
      tocar(conta - 1 === 0 ? "start" : "tick");
    }, 380);
    return () => clearTimeout(t);
  }, [conta]);

  return (
    <section ref={raiz} id="continue" className={`secao continue ${terminou ? "is-fim" : ""}`} aria-labelledby="continue-titulo">
      <Estrelas />
      <div className="sol" aria-hidden="true" />
      <Montanhas className="continue__montanhas" cor="#2a1d4a" semente={11} altura={0.5} />

      <div className="container continue__conteudo">
        <div className="continue__placar" aria-hidden="true">
          <p className="continue__pergunta">{terminou ? "GAME OVER?" : "CONTINUE?"}</p>
          {!terminou && <p className="continue__num">{conta ?? 9}</p>}
        </div>
        <h2 id="continue-titulo" className={`continue__titulo ${terminou ? "is-visivel" : ""}`}>
          <span className="sr-only">Game over? </span>AINDA NÃO.
        </h2>
        <p className={`continue__texto ${terminou ? "is-visivel" : ""}`}>
          A jornada continua, e o próximo nível é só o começo. Vamos seguir criando, aprendendo e conquistando juntos.
        </p>
        <a
          href="#inicio"
          className={`btn btn--start continue__btn ${terminou ? "is-visivel" : ""}`}
          onClick={(e) => {
            e.preventDefault();
            tocar("start");
            irPara("#inicio");
          }}
        >
          JOGAR DE NOVO <span aria-hidden="true">▲</span>
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
        <p className="rodape__copy">© {new Date().getFullYear()} Feito pela turma. Nenhum bug foi ferido nesta produção.</p>
      </footer>
    </section>
  );
}
