import { useEffect, useRef, useState } from "react";
import { tocar } from "../lib/som";
import { useDigitacao } from "../hooks/useDigitacao";
import { DOCENTE_RESPONSAVEL as D, caminhoFoto } from "../data/turma";
import { PixelPhoto } from "./PixelPhoto";
import { PixelIcon } from "./PixelIcon";
import { Titulo } from "./Titulo";

/** A docente responsável como "mestra da guilda", falando numa caixa de texto no estilo Undertale. */
export function Docente() {
  const raiz = useRef<HTMLElement>(null);
  const [visivel, setVisivel] = useState(false);
  const [linha, setLinha] = useState(0);
  const texto = D.fala[linha];
  const { parcial, completo, completar } = useDigitacao(texto, visivel);
  const ultima = linha === D.fala.length - 1;

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => e.isIntersecting && setVisivel(true), { threshold: 0.35 });
    if (raiz.current) obs.observe(raiz.current);
    return () => obs.disconnect();
  }, []);

  function avancar() {
    if (!completo) return completar();
    tocar("select");
    setLinha((l) => (l + 1) % D.fala.length);
  }

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
            {/* texto completo para leitores de tela; a versão digitada fica escondida deles */}
            <div className="sr-only">
              <h3>{D.nome}</h3>
              {D.fala.map((f) => (
                <p key={f}>{f}</p>
              ))}
            </div>
            <div className="ut-caixa dialogo" aria-hidden="true" onClick={avancar}>
              <div className="dialogo__rosto">
                <PixelPhoto src={caminhoFoto(D.foto)} alt="" nitida={false} base={16} />
              </div>
              <p className="dialogo__texto">
                {parcial}
                {completo && <span className="dialogo__cursor" />}
              </p>
              <p className="dialogo__paginas">
                {linha + 1}/{D.fala.length}
              </p>
            </div>
            <button type="button" className="ut-botao" onClick={avancar} aria-label="Avançar o diálogo">
              {completo ? (ultima ? "RECOMEÇAR" : "PRÓXIMO") : "PULAR"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
