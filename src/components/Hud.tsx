import { useEffect, useState } from "react";
import { PixelIcon } from "./PixelIcon";
import { alternarSom, aoMudarSom, somLigado, tocar } from "../lib/som";
import { irPara, pausarRolagem } from "../lib/rolagem";
import { TURMA } from "../data/turma";

const SECOES = [
  { id: "inicio", rotulo: "Início" },
  { id: "jornada", rotulo: "Jornada" },
  { id: "docente", rotulo: "Docente" },
  { id: "jogadores", rotulo: "Jogadores" },
  { id: "mestres", rotulo: "Mestres" },
  { id: "disciplinas", rotulo: "Disciplinas" },
];

/** Barra fixa no topo, no formato de HUD de jogo: navegação, nível da turma e som. */
export function Hud() {
  const [ativa, setAtiva] = useState("inicio");
  const [som, setSom] = useState(somLigado);
  const [menuAberto, setMenuAberto] = useState(false);

  useEffect(() => aoMudarSom(setSom), []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entradas) => entradas.forEach((e) => e.isIntersecting && setAtiva(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    SECOES.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!menuAberto) return;
    pausarRolagem(true);
    const fechar = (e: KeyboardEvent) => e.key === "Escape" && setMenuAberto(false);
    addEventListener("keydown", fechar);
    return () => {
      removeEventListener("keydown", fechar);
      pausarRolagem(false);
    };
  }, [menuAberto]);

  function navegar(e: React.MouseEvent, id: string) {
    e.preventDefault();
    tocar("select");
    setMenuAberto(false);
    // espera o menu fechar e a rolagem voltar antes de rolar
    requestAnimationFrame(() => irPara(`#${id}`));
  }

  const links = (
    <ul className="hud__links">
      {SECOES.map((s) => (
        <li key={s.id}>
          <a
            href={`#${s.id}`}
            aria-current={ativa === s.id ? "true" : undefined}
            onClick={(e) => navegar(e, s.id)}
            onMouseEnter={() => tocar("blip")}
          >
            {s.rotulo}
          </a>
        </li>
      ))}
    </ul>
  );

  return (
    <header className="hud">
      <div className="hud__inner">
        <a href="#inicio" className="hud__marca" onClick={(e) => navegar(e, "inicio")}>
          <PixelIcon nome="moeda" escala={3} />
          <span>
            ES <b>2026.2</b>
          </span>
        </a>
        <nav aria-label="Seções" className="hud__nav">
          {links}
        </nav>
        <div className="hud__status">
          <p className="hud__lv">LV {TURMA.semestre}</p>
          <button
            type="button"
            className="hud__som"
            aria-pressed={som}
            aria-label={som ? "Desligar efeitos sonoros" : "Ligar efeitos sonoros"}
            onClick={() => alternarSom()}
          >
            <PixelIcon nome={som ? "som" : "mudo"} escala={3} />
          </button>
          <button
            type="button"
            className="hud__menu-btn"
            aria-expanded={menuAberto}
            aria-controls="menu-pausa"
            onClick={() => {
              tocar("select");
              setMenuAberto((v) => !v);
            }}
          >
            {menuAberto ? "FECHAR" : "MENU"}
          </button>
        </div>
      </div>
      <div id="menu-pausa" className={`pausa ${menuAberto ? "is-aberto" : ""}`} hidden={!menuAberto}>
        <p className="pausa__titulo">PAUSE</p>
        <nav aria-label="Seções">{links}</nav>
      </div>
    </header>
  );
}
