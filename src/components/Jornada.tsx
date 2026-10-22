import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { gsap, useReduzirMovimento } from "../lib/movimento";
import { tocar } from "../lib/som";
import { useMidia } from "../hooks/useMidia";
import { ALUNOS, DISCIPLINAS, PROFESSORES, TURMA } from "../data/turma";
import { PixelIcon, type NomeSprite } from "./PixelIcon";
import { Contador, Titulo } from "./Titulo";

type Fase = {
  rotulo: string;
  sub: string;
  tipo: "fase" | "atual" | "bloqueada" | "castelo";
  ponto: number;
  placaEmCima?: boolean;
};

// Trilha ortogonal, no estilo dos mapas de mundo dos jogos de plataforma (coordenadas do SVG)
const PONTOS: [number, number][] = [
  [100, 330],
  [280, 330],
  [280, 160],
  [480, 160],
  [480, 315],
  [680, 315],
  [680, 150],
  [880, 150],
  [880, 300],
  [1015, 300],
  [1015, 175],
  [1110, 175],
];

const FASES: Fase[] = [
  { rotulo: "1º SEMESTRE", sub: `INÍCIO · ${TURMA.ingresso}`, tipo: "fase", ponto: 0 },
  { rotulo: "2º SEMESTRE", sub: "FASE CONCLUÍDA", tipo: "fase", ponto: 2 },
  { rotulo: "3º SEMESTRE", sub: "FASE CONCLUÍDA", tipo: "fase", ponto: 4 },
  { rotulo: "4º SEMESTRE", sub: "FASE CONCLUÍDA", tipo: "fase", ponto: 6 },
  { rotulo: "5º SEMESTRE", sub: `VOCÊ ESTÁ AQUI · ${TURMA.periodo}`, tipo: "atual", ponto: 8 },
  { rotulo: "???", sub: "PRÓXIMAS FASES", tipo: "bloqueada", ponto: 9, placaEmCima: true },
  { rotulo: "FORMATURA", sub: "ZERAR O JOGO", tipo: "castelo", ponto: 11 },
];
const ATUAL = FASES.findIndex((f) => f.tipo === "atual");

function comprimentos() {
  const acum = [0];
  for (let i = 1; i < PONTOS.length; i++) {
    const [x1, y1] = PONTOS[i - 1];
    const [x2, y2] = PONTOS[i];
    acum.push(acum[i - 1] + Math.abs(x2 - x1) + Math.abs(y2 - y1));
  }
  return acum;
}

function MapaSvg({ alcancada, progressoRef }: { alcancada: number; progressoRef: React.Ref<SVGPathElement> }) {
  const d = "M" + PONTOS.map((p) => p.join(" ")).join(" L");
  return (
    <svg className="mapa__svg" viewBox="0 0 1200 460" shapeRendering="crispEdges" aria-hidden="true">
      {/* terreno */}
      <path
        d="M40 400 V250 H80 V210 H140 V110 H260 V90 H560 V110 H640 V80 H960 V110 H1060 V120 H1170 V260 H1130 V380 H900 V400 H600 V390 H300 V400 Z"
        className="mapa__terra"
      />
      <path
        d="M40 392 V250 H80 V210 H140 V110 H260 V90 H560 V110 H640 V80 H960 V110 H1060 V120 H1170 V260 H1130 V372 H900 V392 H600 V382 H300 V392 Z"
        className="mapa__grama"
      />
      {/* lago e ponte */}
      <rect x="540" y="200" width="90" height="56" className="mapa__lago" />
      <rect x="548" y="208" width="18" height="6" className="mapa__brilho" />
      {/* árvores */}
      {[
        [170, 240],
        [190, 130],
        [380, 250],
        [400, 120],
        [590, 340],
        [760, 230],
        [800, 110],
        [960, 230],
        [1120, 300],
        [230, 360],
      ].map(([x, y], i) => (
        <g key={i} transform={`translate(${x} ${y})`}>
          <rect x="-14" y="-28" width="28" height="20" fill="#008751" />
          <rect x="-8" y="-36" width="16" height="8" fill="#00e436" />
          <rect x="-4" y="-8" width="8" height="12" fill="#ab5236" />
        </g>
      ))}
      {/* trilha */}
      <path d={d} className="mapa__trilha-sombra" />
      <path d={d} className="mapa__trilha" />
      <path ref={progressoRef} d={d} className="mapa__trilha-feita" id="trilha" />
      {/* fases */}
      {FASES.map((f, i) => {
        const [x, y] = PONTOS[f.ponto];
        const feita = i <= alcancada;
        const abaixo = y > 250 && !f.placaEmCima;
        const largura = Math.max(150, Math.max(f.rotulo.length * 11, f.sub.length * 7) + 24);
        return (
          <g key={f.rotulo} transform={`translate(${x} ${y})`} className={`no no--${f.tipo} ${feita ? "is-feito" : ""}`}>
            {f.tipo === "castelo" ? (
              <g transform="translate(-28 -40) scale(4)">
                <PixelIconSvg nome="castelo" />
              </g>
            ) : (
              <>
                <rect x="-16" y="-16" width="32" height="32" className="no__base" />
                <rect x="-10" y="-10" width="20" height="20" className="no__miolo" />
                {f.tipo === "bloqueada" && (
                  <g transform="translate(-8 -8) scale(2)">
                    <PixelIconSvg nome="cadeado" />
                  </g>
                )}
              </>
            )}
            {f.tipo === "atual" && (
              <g transform="translate(4 -58) scale(3)">
                <g className="no__bandeira">
                  <PixelIconSvg nome="bandeira" />
                </g>
              </g>
            )}
            <g transform={`translate(0 ${abaixo ? 34 : -70})`}>
              <rect x={-largura / 2} y="0" width={largura} height="40" className="no__placa" />
              <text x="0" y="17" className="no__rotulo">
                {f.rotulo}
              </text>
              <text x="0" y="32" className="no__sub">
                {f.sub}
              </text>
            </g>
          </g>
        );
      })}
      <g id="jogador-mapa" className="mapa__jogador">
        <g transform="translate(-18 -48) scale(3)">
          <PixelIconSvg nome="jogador" />
        </g>
      </g>
    </svg>
  );
}

/** Sprite em escala 1 (1 pixel = 1 unidade), para posicionar com transform dentro do mapa */
function PixelIconSvg({ nome }: { nome: NomeSprite }) {
  return <PixelIcon nome={nome} escala={1} />;
}

export function Jornada() {
  const raiz = useRef<HTMLElement>(null);
  const progresso = useRef<SVGPathElement>(null);
  const desktop = useMidia("(min-width: 900px)");
  const reduzir = useReduzirMovimento();
  const [alcancada, setAlcancada] = useState(reduzir ? ATUAL : 0);
  const acum = useMemo(comprimentos, []);
  const total = acum[acum.length - 1];
  const fracoes = FASES.map((f) => acum[f.ponto] / total);

  useLayoutEffect(() => {
    const path = progresso.current;
    if (!desktop || !path || !raiz.current) return;
    const comp = path.getTotalLength();
    path.style.strokeDasharray = `${comp}`;
    const fim = fracoes[ATUAL];

    if (reduzir) {
      path.style.strokeDashoffset = `${comp * (1 - fim)}`;
      gsap.set("#jogador-mapa", {
        motionPath: { path: "#trilha", align: "#trilha", start: fim, end: fim },
      });
      setAlcancada(ATUAL);
      return;
    }

    let ultima = 0;
    const ctx = gsap.context(() => {
      const estado = { p: 0 };
      gsap.set("#jogador-mapa", { motionPath: { path: "#trilha", align: "#trilha", start: 0, end: 0 } });
      gsap.to(estado, {
        p: fim,
        ease: "none",
        scrollTrigger: {
          trigger: ".mapa",
          start: "center center",
          end: "+=1400",
          pin: ".jornada__palco",
          scrub: 0.6,
          anticipatePin: 1,
        },
        onUpdate: () => {
          path.style.strokeDashoffset = `${comp * (1 - estado.p)}`;
          gsap.set("#jogador-mapa", {
            motionPath: { path: "#trilha", align: "#trilha", start: estado.p, end: estado.p },
          });
          let idx = 0;
          fracoes.forEach((f, i) => estado.p >= f - 0.002 && (idx = i));
          if (idx !== ultima) {
            if (idx > ultima) tocar("coin");
            ultima = idx;
            setAlcancada(idx);
          }
        },
      });
    }, raiz);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [desktop, reduzir]);

  // celular: cada fase aparece ao entrar na tela
  useLayoutEffect(() => {
    if (desktop || reduzir || !raiz.current) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".fases-lista li").forEach((li) =>
        gsap.from(li, { x: -30, opacity: 0, duration: 0.4, ease: "steps(4)", scrollTrigger: { trigger: li, start: "top 88%" } }),
      );
    }, raiz);
    return () => ctx.revert();
  }, [desktop, reduzir]);

  const stats = [
    { rotulo: "JOGADORES", valor: ALUNOS.length, icone: "jogador" as const },
    { rotulo: "MESTRES", valor: PROFESSORES.length, icone: "estrela" as const },
    { rotulo: "MUNDOS", valor: DISCIPLINAS.length, icone: "moeda" as const },
    { rotulo: "NÍVEL", valor: TURMA.semestre, icone: "coracao" as const },
  ];

  return (
    <section ref={raiz} id="jornada" className="secao jornada" aria-labelledby="jornada-titulo">
      <div className="jornada__palco">
        <div className="container">
          <Titulo id="jornada-titulo" icone="bandeira" mundo="MUNDO 1 · SOBRE" titulo="NOSSA JORNADA">
            Cada semestre, uma fase. A mesma missão: evoluir juntos.
          </Titulo>

          <div className="jornada__topo">
            <p className="placa jornada__sobre">{TURMA.sobre}</p>
            <ul className="stats" aria-label="Números da turma">
              {stats.map((s) => (
                <li key={s.rotulo} className="stat">
                  <PixelIcon nome={s.icone} escala={3} />
                  <strong className="stat__valor">
                    <Contador valor={s.valor} />
                  </strong>
                  <span className="stat__rotulo">{s.rotulo}</span>
                </li>
              ))}
            </ul>
          </div>

          {desktop ? (
            <div className="mapa">
              <MapaSvg alcancada={alcancada} progressoRef={progresso} />
            </div>
          ) : null}

          <ol className={`fases-lista ${desktop ? "sr-only" : ""}`} aria-label="Fases da jornada">
            {FASES.map((f) => (
              <li key={f.rotulo} className={`fase fase--${f.tipo}`}>
                <span className="fase__marca" aria-hidden="true">
                  {f.tipo === "bloqueada" ? (
                    <PixelIcon nome="cadeado" escala={3} />
                  ) : f.tipo === "castelo" ? (
                    <PixelIcon nome="castelo" escala={2} />
                  ) : f.tipo === "atual" ? (
                    <PixelIcon nome="jogador" escala={2} />
                  ) : (
                    <PixelIcon nome="estrela" escala={3} />
                  )}
                </span>
                <span>
                  <strong>{f.rotulo}</strong>
                  <small>{f.sub}</small>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
