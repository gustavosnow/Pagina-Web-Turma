import { useState } from "react";
import { tocar } from "../lib/som";
import { useDialogo } from "./CaixaDialogo";
import { PixelIcon } from "./PixelIcon";
import { TURMA } from "../data/turma";

/** A estrelinha de save: ao interagir, enche de DETERMINAÇÃO e "salva o arquivo". */
export function PontoSave({ className }: { className?: string }) {
  const { falar } = useDialogo();
  const [salvo, setSalvo] = useState(false);

  function interagir() {
    tocar("select");
    falar(
      [
        "* (Uma estrelinha brilha no meio do caminho.)",
        "* (Saber que a apresentação está chegando te enche de DETERMINAÇÃO.)",
        `* (Arquivo salvo: TURMA ES · LV ${TURMA.semestre} · ${TURMA.periodo})`,
      ],
      () => {
        tocar("salvar");
        setSalvo(true);
      },
    );
  }

  return (
    <button
      type="button"
      className={`ponto-save ${salvo ? "is-salvo" : ""} ${className ?? ""}`}
      onClick={interagir}
      onMouseEnter={() => tocar("blip")}
      aria-label={salvo ? "Ponto de save: arquivo salvo" : "Ponto de save"}
    >
      <PixelIcon nome="save" escala={4} />
      <span className="ponto-save__dica" aria-hidden="true">
        {salvo ? "SALVO!" : "SALVAR"}
      </span>
    </button>
  );
}
