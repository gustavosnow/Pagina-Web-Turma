import { useEffect, useState } from "react";
import { reduzirMovimento } from "../lib/movimento";
import { tocar } from "../lib/som";

/** Máquina de escrever das caixas de diálogo: uma letra por vez, com pausa depois da pontuação
    e a "voz" a cada letra. Com movimento reduzido, o texto aparece inteiro. */
export function useDigitacao(texto: string, ativo: boolean, velocidade = 30) {
  const [estado, setEstado] = useState({ texto, n: 0 });
  // trocou o texto: recomeça do zero
  const n = estado.texto === texto ? estado.n : 0;

  useEffect(() => {
    if (!ativo) return;
    if (reduzirMovimento()) {
      setEstado({ texto, n: texto.length });
      return;
    }
    if (n >= texto.length) return;
    const anterior = texto[n - 1] ?? "";
    const pausa = /[.,!?:…]/.test(anterior) && texto[n] === " " ? velocidade * 7 : velocidade;
    const t = setTimeout(() => {
      setEstado({ texto, n: n + 1 });
      if (texto[n].trim()) tocar("voz");
    }, pausa);
    return () => clearTimeout(t);
  }, [ativo, n, texto, velocidade]);

  return {
    parcial: texto.slice(0, n),
    completo: n >= texto.length,
    completar: () => setEstado({ texto, n: texto.length }),
  };
}
