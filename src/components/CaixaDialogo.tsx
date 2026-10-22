import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { useDigitacao } from "../hooks/useDigitacao";
import { tocar } from "../lib/som";

/* Caixa de texto no estilo Undertale, presa no rodapé da tela.
   Qualquer parte do site abre com falar(["* linha 1", "* linha 2"]). Enter, Z, espaço ou clique avançam. */

type Fala = { linhas: string[]; aoFechar?: () => void };
type Ctx = { falar: (linhas: string[], aoFechar?: () => void) => void };

const DialogoCtx = createContext<Ctx>({ falar: () => {} });

export function useDialogo() {
  return useContext(DialogoCtx);
}

function Caixa({ fala, fechar }: { fala: Fala; fechar: () => void }) {
  const [i, setI] = useState(0);
  const caixa = useRef<HTMLDivElement>(null);
  const linha = fala.linhas[i];
  const { parcial, completo, completar } = useDigitacao(linha, true);

  const avancar = useCallback(() => {
    if (!completo) return completar();
    if (i < fala.linhas.length - 1) {
      tocar("blip");
      setI(i + 1);
    } else fechar();
  }, [completo, completar, i, fala.linhas.length, fechar]);

  useEffect(() => {
    caixa.current?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    const tecla = (e: KeyboardEvent) => {
      if (e.key === "Escape") return fechar();
      if (["Enter", " ", "z", "Z"].includes(e.key)) {
        e.preventDefault();
        avancar();
      }
    };
    addEventListener("keydown", tecla);
    return () => removeEventListener("keydown", tecla);
  }, [avancar, fechar]);

  return (
    <div className="ut-dialogo" role="dialog" aria-modal="false" aria-label="Diálogo" ref={caixa} tabIndex={-1} onClick={avancar}>
      <p className="sr-only" aria-live="polite">
        {linha}
      </p>
      <p className="ut-dialogo__texto" aria-hidden="true">
        {parcial}
      </p>
      {completo && (
        <span className="ut-dialogo__seta" aria-hidden="true">
          ▼
        </span>
      )}
      <button
        type="button"
        className="sr-only"
        onClick={(e) => {
          e.stopPropagation();
          avancar();
        }}
      >
        {i < fala.linhas.length - 1 ? "Continuar" : "Fechar"}
      </button>
    </div>
  );
}

export function DialogoProvider({ children }: { children: ReactNode }) {
  const [fala, setFala] = useState<Fala | null>(null);
  const [chave, setChave] = useState(0);
  const origem = useRef<HTMLElement | null>(null);

  const falar = useCallback((linhas: string[], aoFechar?: () => void) => {
    origem.current = document.activeElement as HTMLElement | null;
    setFala({ linhas, aoFechar });
    setChave((k) => k + 1);
  }, []);

  const atual = useRef<Fala | null>(null);
  atual.current = fala;

  const fechar = useCallback(() => {
    const aoFechar = atual.current?.aoFechar;
    setFala(null);
    origem.current?.focus({ preventScroll: true });
    aoFechar?.();
  }, []);

  return (
    <DialogoCtx.Provider value={{ falar }}>
      {children}
      {fala && <Caixa key={chave} fala={fala} fechar={fechar} />}
    </DialogoCtx.Provider>
  );
}
