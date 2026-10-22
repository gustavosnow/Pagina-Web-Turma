import { useEffect, useRef, useState } from "react";
import { gsap, reduzirMovimento } from "../lib/movimento";
import { tocar } from "../lib/som";
import { useDigitacao } from "../hooks/useDigitacao";
import { PROFESSORES, TURMA, caminhoFoto, iniciais, type Professor } from "../data/turma";
import { PixelPhoto } from "./PixelPhoto";
import { PixelIcon, type NomeSprite } from "./PixelIcon";
import { Titulo } from "./Titulo";

/* Professores como encontros de batalha no estilo Undertale. Ninguém sai ferido:
   LUTAR sempre erra, AGIR conversa, ITEM tem café e MISERICÓRDIA poupa o mestre
   (depois de AGIR, como no jogo). */

type Menu = "principal" | "agir" | "item" | "misericordia";
type Opcao = { rotulo: string; acao: () => void; destaque?: boolean };

const ACOES: { id: Exclude<Menu, "principal"> | "lutar"; rotulo: string; icone: NomeSprite }[] = [
  { id: "lutar", rotulo: "LUTAR", icone: "espada" },
  { id: "agir", rotulo: "AGIR", icone: "balao" },
  { id: "item", rotulo: "ITEM", icone: "bolsa" },
  { id: "misericordia", rotulo: "MISERICÓRDIA", icone: "xis" },
];

const primeiroNome = (p: Professor) => p.nome.split(" ")[0];

function Inimigo({ p, ativo, poupado }: { p: Professor; ativo: boolean; poupado: boolean }) {
  return (
    <span className={`inimigo__sprite ${ativo ? "is-ativo" : ""} ${poupado ? "is-poupado" : ""}`}>
      {p.foto ? (
        <PixelPhoto src={caminhoFoto(p.foto)} alt="" nitida={false} base={22} />
      ) : (
        <span className="inimigo__iniciais">{iniciais(p.nome)}</span>
      )}
    </span>
  );
}

export function Batalha() {
  const raiz = useRef<HTMLElement>(null);
  const botoes = useRef<(HTMLButtonElement | null)[]>([]);
  const opcoesRef = useRef<HTMLDivElement>(null);
  const [alvo, setAlvo] = useState(0);
  const [menu, setMenu] = useState<Menu>("principal");
  const [texto, setTexto] = useState(`* ${PROFESSORES[0].nome} bloqueia o caminho!`);
  const [visivel, setVisivel] = useState(false);
  const [poupados, setPoupados] = useState<Set<number>>(new Set());
  const [pouparLiberado, setPouparLiberado] = useState<Set<number>>(new Set());
  const [errou, setErrou] = useState(0);
  const p = PROFESSORES[alvo];
  const { parcial, completo, completar } = useDigitacao(texto, visivel && menu === "principal");

  useEffect(() => {
    const el = raiz.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        setVisivel(true);
        tocar("encontro");
        if (!reduzirMovimento())
          gsap.fromTo(".batalha__arena", { opacity: 0 }, { opacity: 1, duration: 0.45, ease: "steps(6)", repeat: 0 });
        obs.disconnect();
      },
      { threshold: 0.4 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // ao abrir um submenu, o foco vai para a primeira opção
  useEffect(() => {
    if (menu !== "principal") opcoesRef.current?.querySelector("button")?.focus();
  }, [menu]);

  function dizer(t: string) {
    setMenu("principal");
    setTexto(t);
  }

  function escolherAlvo(i: number) {
    tocar("select");
    setAlvo(i);
    dizer(
      poupados.has(i)
        ? `* ${PROFESSORES[i].nome} já foi poupado.\n* Parece de bom humor.`
        : `* ${PROFESSORES[i].nome} bloqueia o caminho!`,
    );
  }

  function lutar() {
    tocar("blip");
    setErrou((n) => n + 1);
    if (!reduzirMovimento())
      gsap.fromTo(
        `.inimigo:nth-child(${alvo + 1}) .inimigo__sprite`,
        { x: -10 },
        { x: 0, duration: 0.4, ease: "steps(6)" },
      );
    dizer(`* Você pensou em lutar contra ${primeiroNome(p)}.\n* Pensou melhor.`);
  }

  function liberarPoupar() {
    setPouparLiberado((s) => new Set(s).add(alvo));
  }

  const opcoes: Record<Exclude<Menu, "principal">, Opcao[]> = {
    agir: [
      {
        rotulo: "Verificar",
        acao: () => dizer(`* ${p.nome.toUpperCase()} - ATQ ?? DEF ??\n* Mestre de ${p.disciplina}.`),
      },
      {
        rotulo: "Conversar",
        acao: () => {
          liberarPoupar();
          dizer(`* ${p.resumo}`);
        },
      },
      {
        rotulo: "Elogiar a aula",
        acao: () => {
          liberarPoupar();
          dizer(`* Você elogiou a aula.\n* ${primeiroNome(p)} parece contente.`);
        },
      },
    ],
    item: [
      { rotulo: "Café", acao: () => dizer("* Você bebeu o Café.\n* Seu HP foi maximizado.") },
      { rotulo: "Pendrive", acao: () => dizer("* Você conferiu o Pendrive.\n* O trabalho está salvo. Ufa.") },
    ],
    misericordia: [
      {
        rotulo: "Poupar",
        destaque: pouparLiberado.has(alvo) && !poupados.has(alvo),
        acao: () => {
          if (poupados.has(alvo)) return dizer(`* ${primeiroNome(p)} já foi poupado.`);
          if (!pouparLiberado.has(alvo))
            return dizer(`* Você tentou poupar ${primeiroNome(p)}.\n* Ainda não é a hora. (Tente AGIR primeiro.)`);
          tocar("coin");
          const novos = new Set(poupados).add(alvo);
          setPoupados(novos);
          dizer(
            `* Você poupou ${primeiroNome(p)}.\n* Você ganhou 0 EXP e muito conhecimento.` +
              (novos.size === PROFESSORES.length ? "\n* Todos os mestres foram poupados. Rota pacifista!" : ""),
          );
        },
      },
      { rotulo: "Fugir", acao: () => dizer("* Você tentou fugir...\n* Mas a matéria vai cair na prova.") },
    ],
  };

  function acionar(id: (typeof ACOES)[number]["id"]) {
    if (id === "lutar") return lutar();
    tocar("select");
    setMenu(id);
  }

  function tecladoAcoes(e: React.KeyboardEvent, i: number) {
    const n = ACOES.length;
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();
      const prox = (i + (e.key === "ArrowRight" ? 1 : -1) + n) % n;
      tocar("blip");
      botoes.current[prox]?.focus();
    }
  }

  function tecladoOpcoes(e: React.KeyboardEvent) {
    const lista = [...(opcoesRef.current?.querySelectorAll("button") ?? [])];
    const i = lista.indexOf(document.activeElement as HTMLButtonElement);
    if (e.key === "Escape") {
      e.preventDefault();
      const de = ACOES.findIndex((a) => a.id === menu);
      setMenu("principal");
      botoes.current[de]?.focus();
    } else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      tocar("blip");
      lista[(i + (e.key === "ArrowDown" ? 1 : -1) + lista.length) % lista.length]?.focus();
    }
  }

  return (
    <section ref={raiz} id="mestres" className="secao batalha" aria-labelledby="mestres-titulo">
      <div className="container">
        <Titulo id="mestres-titulo" icone="alma" secao="04 MESTRES" titulo="UM MESTRE BLOQUEIA O CAMINHO!" claro>
          Escolha um mestre e uma ação. Ninguém sai ferido.
        </Titulo>

        <ul className="sr-only" aria-label="Professores do semestre">
          {PROFESSORES.map((pr) => (
            <li key={pr.nome}>
              {pr.nome}, {pr.disciplina}. {pr.resumo}
            </li>
          ))}
        </ul>

        <div className="batalha__arena">
          <ul className="batalha__inimigos" aria-label="Escolha o mestre">
            {PROFESSORES.map((pr, i) => (
              <li key={pr.nome} className="inimigo">
                <button
                  type="button"
                  aria-pressed={i === alvo}
                  aria-label={`${pr.nome}${poupados.has(i) ? ", poupado" : ""}`}
                  onClick={() => escolherAlvo(i)}
                  onMouseEnter={() => tocar("blip")}
                >
                  {i === alvo && errou > 0 && (
                    <span key={errou} className="inimigo__miss" aria-hidden="true">
                      MISS
                    </span>
                  )}
                  <Inimigo p={pr} ativo={i === alvo} poupado={poupados.has(i)} />
                  <span className="inimigo__nome">
                    {i === alvo && <PixelIcon nome="alma" escala={2} />} {pr.nome.split(" ").slice(0, 2).join(" ")}
                  </span>
                  <span className="inimigo__disc">{pr.disciplina}</span>
                </button>
              </li>
            ))}
          </ul>

          <div className="ut-caixa batalha__caixa">
            {menu === "principal" ? (
              <>
                <p className="sr-only" aria-live="polite">
                  {texto}
                </p>
                <p className="batalha__texto" aria-hidden="true" onClick={completar}>
                  {parcial}
                  {!completo && " "}
                </p>
              </>
            ) : (
              <div ref={opcoesRef} className="batalha__opcoes" onKeyDown={tecladoOpcoes} role="menu" aria-label={menu}>
                {opcoes[menu].map((o) => (
                  <button
                    key={o.rotulo}
                    type="button"
                    role="menuitem"
                    className={`ut-opcao ${o.destaque ? "is-destaque" : ""}`}
                    onClick={o.acao}
                    onMouseEnter={(e) => e.currentTarget.focus()}
                  >
                    <PixelIcon nome="alma" escala={3} className="ut-opcao__alma" />* {o.rotulo}
                  </button>
                ))}
              </div>
            )}
          </div>

          <p className="batalha__status">
            <span>TURMA</span>
            <span>LV {TURMA.semestre}</span>
            <span className="batalha__hp">
              HP <span className="hp-barra" aria-hidden="true" /> 20 / 20
            </span>
            <span className="batalha__poupados">
              POUPADOS {poupados.size}/{PROFESSORES.length}
            </span>
          </p>

          <div className="batalha__acoes">
            {ACOES.map((a, i) => (
              <button
                key={a.id}
                ref={(el) => (botoes.current[i] = el)}
                type="button"
                className={`ut-acao ${menu === a.id ? "is-aberta" : ""}`}
                onClick={() => acionar(a.id)}
                onKeyDown={(e) => tecladoAcoes(e, i)}
                onMouseEnter={() => tocar("blip")}
              >
                <PixelIcon nome={a.icone} escala={3} className="ut-acao__icone" />
                <PixelIcon nome="alma" escala={3} className="ut-acao__alma" />
                {a.rotulo}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
