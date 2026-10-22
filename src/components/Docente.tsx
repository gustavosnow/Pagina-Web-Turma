import { useEffect, useRef, useState } from "react";
import { reduzirMovimento } from "../lib/movimento";
import { tocar } from "../lib/som";
import { DOCENTE_RESPONSAVEL as D, caminhoFoto } from "../data/turma";
import { PixelPhoto } from "./PixelPhoto";
import { PixelIcon } from "./PixelIcon";
import { Titulo } from "./Titulo";

/** A docente responsável como "mestra da guilda", com caixa de diálogo de RPG. */
export function Docente() {
  const raiz = useRef<HTMLElement>(null);
  const [visivel, setVisivel] = useState(false);
  const [linha, setLinha] = useState(0);
  const [letras, setLetras] = useState(0);

  const texto = D.fala[linha];
  const completa = letras >= texto.length;

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => e.isIntersecting && setVisivel(true), { threshold: 0.35 });
    if (raiz.current) obs.observe(raiz.current);
    return () => obs.disconnect();
  }, []);

  // máquina de escrever
  useEffect(() => {
    if (!visivel) return;
    if (reduzirMovimento()) {
      setLetras(texto.length);
      return;
    }
    if (completa) return;
    const t = setTimeout(() => {
      setLetras((n) => n + 1);
      if (letras % 3 === 0) tocar("texto");
    }, 28);
    return () => clearTimeout(t);
  }, [visivel, letras, completa, texto.length]);

  function avancar() {
    if (!completa) {
      setLetras(texto.length);
      return;
    }
    tocar("select");
    setLinha((l) => (l + 1) % D.fala.length);
    setLetras(0);
  }

  const ultima = linha === D.fala.length - 1;

  return (
    <section ref={raiz} id="docente" className="secao docente" aria-labelledby="docente-titulo">
      <div className="container">
        <Titulo id="docente-titulo" icone="estrela" mundo="MUNDO 2 · DOCENTE RESPONSÁVEL" titulo="A MESTRA DA GUILDA" claro>
          Toda party precisa de alguém que conheça o mapa.
        </Titulo>

        <div className="docente__grid">
          <figure className="retrato">
            <div className="retrato__moldura">
              <PixelPhoto src={caminhoFoto(D.foto)} alt={`Foto de ${D.nome}`} nitida={visivel} base={10} className="retrato__foto" />
            </div>
            <figcaption className="retrato__placa">
              <span>DOCENTE RESPONSÁVEL</span>
            </figcaption>
          </figure>

          <div className="dialogo-wrap">
            <ul className="docente__chips" aria-label="Mundos que conduz">
              {D.disciplinas.map((d) => (
                <li key={d}>
                  <PixelIcon nome="estrela" escala={2} /> {d}
                </li>
              ))}
            </ul>
            {/* texto completo para leitores de tela; a versão animada fica escondida deles */}
            <div className="sr-only">
              <h3>{D.nome}</h3>
              {D.fala.map((f) => (
                <p key={f}>{f}</p>
              ))}
            </div>
            <div className="dialogo" aria-hidden="true">
              <p className="dialogo__nome">JACQUELINE</p>
              <p className="dialogo__texto">
                {texto.slice(0, letras)}
                <span className="dialogo__cursor" />
              </p>
              <p className="dialogo__paginas">
                {linha + 1}/{D.fala.length}
              </p>
            </div>
            <button type="button" className="btn btn--dialogo" onClick={avancar} aria-label="Avançar o diálogo">
              {completa ? (ultima ? "RECOMEÇAR" : "PRÓXIMO") : "PULAR"} <span aria-hidden="true">▼</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
