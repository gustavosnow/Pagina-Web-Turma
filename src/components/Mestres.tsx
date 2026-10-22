import { useEffect, useRef, useState } from "react";
import { gsap, reduzirMovimento } from "../lib/movimento";
import { tocar } from "../lib/som";
import { PROFESSORES, caminhoFoto, iniciais, type Professor } from "../data/turma";
import { PixelPhoto } from "./PixelPhoto";
import { Titulo } from "./Titulo";
import { useMidia } from "../hooks/useMidia";

const CORES_NPC = ["#ff004d", "#29adff", "#ffa300", "#00e436"];

function Carta({ p, i }: { p: Professor; i: number }) {
  const [ativa, setAtiva] = useState(false);
  // em tela de toque não há hover: a foto já aparece nítida
  const semHover = useMidia("(hover: none)");
  return (
    <li
      className="carta"
      style={{ "--cor-npc": CORES_NPC[i % CORES_NPC.length] } as React.CSSProperties}
      onMouseEnter={() => {
        setAtiva(true);
        tocar("blip");
      }}
      onMouseLeave={() => setAtiva(false)}
    >
      <div className="carta__topo">
        <span className="carta__num">#{String(i + 1).padStart(2, "0")}</span>
        <span className="carta__tipo">MESTRE</span>
      </div>
      <div className="carta__retrato">
        {p.foto ? (
          <PixelPhoto src={caminhoFoto(p.foto)} alt="" nitida={ativa || semHover} base={12} />
        ) : (
          <span className="carta__iniciais" aria-hidden="true">
            {iniciais(p.nome)}
          </span>
        )}
      </div>
      <h3 className="carta__nome">{p.nome}</h3>
      <p className="carta__disc">{p.disciplina}</p>
      <p className="carta__resumo">{p.resumo}</p>
    </li>
  );
}

/** Professores do semestre como cartas colecionáveis */
export function Mestres() {
  const raiz = useRef<HTMLElement>(null);
  useEffect(() => {
    if (reduzirMovimento() || !raiz.current) return;
    const ctx = gsap.context(() => {
      gsap.from(".carta", {
        y: 80,
        rotation: (i) => (i % 2 ? 6 : -6),
        opacity: 0,
        duration: 0.5,
        ease: "steps(6)",
        stagger: 0.1,
        scrollTrigger: { trigger: ".cartas", start: "top 80%" },
      });
    }, raiz);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={raiz} id="mestres" className="secao mestres" aria-labelledby="mestres-titulo">
      <div className="container">
        <Titulo id="mestres-titulo" icone="estrela" mundo="MUNDO 4 · PROFESSORES" titulo="OS MESTRES DE CADA MUNDO">
          Os responsáveis por guiar nossa formação neste semestre.
        </Titulo>
        <ul className="cartas">
          {PROFESSORES.map((p, i) => (
            <Carta key={p.nome} p={p} i={i} />
          ))}
        </ul>
      </div>
    </section>
  );
}
