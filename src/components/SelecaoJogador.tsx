import { useEffect, useRef, useState } from "react";
import { gsap, reduzirMovimento } from "../lib/movimento";
import { tocar } from "../lib/som";
import { ALUNOS, TURMA, caminhoFoto, iniciais, type Aluno } from "../data/turma";
import { PixelPhoto } from "./PixelPhoto";
import { Titulo } from "./Titulo";
import { PixelIcon } from "./PixelIcon";

const COLUNAS = 4;
const alunos = [...ALUNOS].sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));

function Avatar({ aluno, nitida, base }: { aluno: Aluno; nitida: boolean; base?: number }) {
  if (!aluno.foto)
    return (
      <span className="avatar-iniciais" aria-hidden="true">
        {iniciais(aluno.nome)}
      </span>
    );
  return <PixelPhoto src={caminhoFoto(aluno.foto)} alt="" nitida={nitida} base={base} />;
}

/** Foto grande do jogador escolhido: a cada troca, entra pixelada e fica nítida */
function FotoPreview({ aluno }: { aluno: Aluno }) {
  const [nitida, setNitida] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setNitida(true), 40);
    return () => clearTimeout(t);
  }, []);
  return <Avatar aluno={aluno} nitida={nitida} base={8} />;
}

/** Tela de seleção de personagem, no estilo dos jogos de luta. Setas do teclado navegam. */
export function SelecaoJogador() {
  const [sel, setSel] = useState(0);
  const [prontos, setProntos] = useState<Set<number>>(new Set());
  // "É este o nome?": aberto ao confirmar um jogador
  const [confirmando, setConfirmando] = useState<number | null>(null);
  const botoes = useRef<(HTMLButtonElement | null)[]>([]);
  const preview = useRef<HTMLDivElement>(null);
  const aluno = alunos[sel];

  function escolher(i: number, foco = false) {
    if (i === sel) return;
    setSel(i);
    tocar("blip");
    if (foco) botoes.current[i]?.focus();
  }

  function confirmar(i: number) {
    tocar("select");
    setSel(i);
    setConfirmando(i);
  }

  function responder(sim: boolean) {
    const i = confirmando;
    setConfirmando(null);
    if (i === null) return;
    botoes.current[i]?.focus();
    if (!sim) return tocar("blip");
    tocar("start");
    setProntos((p) => new Set(p).add(i));
    if (!reduzirMovimento() && preview.current) {
      gsap.fromTo(preview.current, { x: -6 }, { x: 0, duration: 0.3, ease: "steps(6)" });
      gsap.fromTo(".preview__flash", { opacity: 1 }, { opacity: 0, duration: 0.6, ease: "steps(6)" });
    }
  }

  function teclado(e: React.KeyboardEvent) {
    const n = alunos.length;
    const mapa: Record<string, number> = {
      ArrowRight: sel + 1,
      ArrowLeft: sel - 1,
      ArrowDown: sel + COLUNAS,
      ArrowUp: sel - COLUNAS,
      Home: 0,
      End: n - 1,
    };
    if (e.key in mapa) {
      e.preventDefault();
      escolher((mapa[e.key] + n) % n, true);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      confirmar(sel);
    }
  }

  const pronto = prontos.has(sel);

  return (
    <section id="jogadores" className="secao selecao" aria-labelledby="jogadores-titulo">
      <div className="selecao__fundo" aria-hidden="true" />
      <div className="container">
        <Titulo id="jogadores-titulo" icone="jogador" secao="03 JOGADORES" titulo="SELECIONE SEU JOGADOR" claro>
          {alunos.length} jogadores, uma party só. Passe o mouse ou use as setas; Enter escolhe.
        </Titulo>

        <div className="selecao__grid">
          <div ref={preview} className={`preview ${pronto ? "is-pronto" : ""}`} aria-live="polite">
            <div className="preview__foto">
              <FotoPreview key={sel} aluno={aluno} />
              <span className="preview__flash" aria-hidden="true" />
              <span className="preview__p1 etiqueta" aria-hidden="true">
                P1
              </span>
              {pronto && (
                <span className="preview__ready" aria-hidden="true">
                  PRONTO!
                </span>
              )}
            </div>
            <div className="ut-caixa preview__info">
              <p className="preview__num" aria-hidden="true">
                {String(sel + 1).padStart(2, "0")} / {alunos.length}
              </p>
              <h3 className="preview__nome">"{aluno.apelido}"</h3>
              <p className="preview__completo">{aluno.nome}</p>
              <dl className="preview__ficha">
                <div>
                  <dt>LV</dt>
                  <dd>{TURMA.semestre}</dd>
                </div>
                <div>
                  <dt>HP</dt>
                  <dd>20 / 20</dd>
                </div>
                <div>
                  <dt>AT</dt>
                  <dd>10 (0)</dd>
                </div>
                <div>
                  <dt>EXP</dt>
                  <dd>desde {TURMA.ingresso}</dd>
                </div>
                <div>
                  <dt>DF</dt>
                  <dd>10 (0)</dd>
                </div>
                <div>
                  <dt>NEXT</dt>
                  <dd>{TURMA.semestre + 1}º semestre</dd>
                </div>
                <div className="preview__ficha-larga">
                  <dt>ARMA</dt>
                  <dd>Teclado</dd>
                </div>
                <div className="preview__ficha-larga">
                  <dt>ARMADURA</dt>
                  <dd>Café</dd>
                </div>
              </dl>
            </div>
            {confirmando !== null && (
              <div className="nome-confirma" role="dialog" aria-modal="false" aria-labelledby="nome-confirma-titulo">
                <p className="nome-confirma__pergunta" id="nome-confirma-titulo">
                  É este o nome?
                </p>
                <p className="nome-confirma__nome">{alunos[confirmando].apelido}</p>
                <div className="nome-confirma__opcoes" onKeyDown={(e) => e.key === "Escape" && responder(false)}>
                  <button type="button" className="ut-opcao" onClick={() => responder(false)}>
                    <PixelIcon nome="alma" escala={3} className="ut-opcao__alma" />
                    Não
                  </button>
                  <button type="button" className="ut-opcao" onClick={() => responder(true)} autoFocus>
                    <PixelIcon nome="alma" escala={3} className="ut-opcao__alma" />
                    Sim
                  </button>
                </div>
              </div>
            )}
          </div>

          <div
            className="selecao__grade"
            role="listbox"
            aria-label="Alunos da turma"
            onKeyDown={teclado}
          >
            {alunos.map((a, i) => (
              <button
                key={a.nome}
                ref={(el) => (botoes.current[i] = el)}
                type="button"
                role="option"
                aria-selected={i === sel}
                aria-label={a.nome}
                tabIndex={i === sel ? 0 : -1}
                className={`celula ${i === sel ? "is-sel" : ""} ${prontos.has(i) ? "is-pronto" : ""}`}
                onMouseEnter={() => escolher(i)}
                onFocus={() => escolher(i)}
                onClick={() => confirmar(i)}
              >
                <Avatar aluno={a} nitida={i === sel} base={12} />
                <span className="celula__nome">{a.apelido}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
