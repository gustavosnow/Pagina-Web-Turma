import { gsap, reduzirMovimento } from "../lib/movimento";
import { tocar } from "../lib/som";
import { DISCIPLINAS, TURMA } from "../data/turma";
import { PixelIcon } from "./PixelIcon";
import { Titulo } from "./Titulo";

/** Disciplinas do semestre como seleção de mundos: o bloco "?" pula e solta uma moeda */
export function Mundos() {

  function bater(el: HTMLElement) {
    tocar("coin");
    if (reduzirMovimento()) return;
    const bloco = el.querySelector(".mundo__bloco");
    const moeda = el.querySelector(".mundo__moeda");
    gsap.timeline().to(bloco, { y: -14, duration: 0.08, ease: "steps(2)" }).to(bloco, { y: 0, duration: 0.12, ease: "steps(3)" });
    gsap.fromTo(
      moeda,
      { y: 0, opacity: 1 },
      { y: -70, opacity: 0, duration: 0.6, ease: "steps(8)" },
    );
  }

  return (
    <section id="disciplinas" className="secao mundos" aria-labelledby="mundos-titulo">
      <div className="container">
        <Titulo id="mundos-titulo" icone="moeda" secao="05 DISCIPLINAS" titulo="SELECIONE O MUNDO">
          A grade do {TURMA.semestre}º semestre, turno da tarde. Cada disciplina é um mundo para zerar.
        </Titulo>
        <ul className="mundos__lista">
          {DISCIPLINAS.map((d) => (
            <li
              key={d.codigo}
              className="mundo"
              onMouseEnter={(e) => bater(e.currentTarget)}
            >
              <div className="mundo__bloco" aria-hidden="true">
                <span>?</span>
                <span className="mundo__moeda">
                  <PixelIcon nome="moeda" escala={3} />
                </span>
              </div>
              <div className="mundo__card">
                <p className="mundo__codigo">MUNDO {d.codigo}</p>
                <PixelIcon nome={d.icone} escala={5} className="mundo__icone" />
                <h3 className="mundo__nome">{d.nome}</h3>
                {d.professor && (
                  <p className="mundo__mestre">
                    <span>MESTRE</span> {d.professor}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="chao chao--tijolo" aria-hidden="true" />
    </section>
  );
}
