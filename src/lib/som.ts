/* Efeitos sonoros chiptune gerados na hora com Web Audio (sem arquivos de áudio).
   Começam desligados; a preferência fica salva no navegador. */

type Nota = { freq: number; dur: number; tipo?: OscillatorType };

const CHAVE = "es20262:som";
let ctx: AudioContext | null = null;
let ligado = lerPreferencia();
const ouvintes = new Set<(v: boolean) => void>();

function lerPreferencia() {
  try {
    return localStorage.getItem(CHAVE) === "1";
  } catch {
    return false;
  }
}

export function somLigado() {
  return ligado;
}

export function alternarSom() {
  ligado = !ligado;
  try {
    localStorage.setItem(CHAVE, ligado ? "1" : "0");
  } catch {
    /* sem storage: vale só nesta visita */
  }
  ouvintes.forEach((fn) => fn(ligado));
  if (ligado) tocar("start");
  return ligado;
}

export function aoMudarSom(fn: (v: boolean) => void) {
  ouvintes.add(fn);
  return () => {
    ouvintes.delete(fn);
  };
}

const EFEITOS: Record<string, Nota[]> = {
  blip: [{ freq: 880, dur: 0.04 }],
  select: [
    { freq: 660, dur: 0.05 },
    { freq: 990, dur: 0.08 },
  ],
  coin: [
    { freq: 988, dur: 0.07 },
    { freq: 1319, dur: 0.22 },
  ],
  start: [
    { freq: 523, dur: 0.07 },
    { freq: 659, dur: 0.07 },
    { freq: 784, dur: 0.07 },
    { freq: 1047, dur: 0.16 },
  ],
  tick: [{ freq: 440, dur: 0.05, tipo: "triangle" }],
  texto: [{ freq: 1200, dur: 0.015 }],
  // "voz" das caixas de diálogo: um clique grave por letra
  voz: [{ freq: 196, dur: 0.035 }],
  salvar: [
    { freq: 784, dur: 0.06 },
    { freq: 988, dur: 0.06 },
    { freq: 1175, dur: 0.06 },
    { freq: 1568, dur: 0.2, tipo: "triangle" },
  ],
  encontro: [
    { freq: 880, dur: 0.04 },
    { freq: 0, dur: 0.04 },
    { freq: 880, dur: 0.04 },
    { freq: 0, dur: 0.04 },
    { freq: 880, dur: 0.08 },
  ],
  quebra: [
    { freq: 220, dur: 0.08, tipo: "sawtooth" },
    { freq: 110, dur: 0.25, tipo: "sawtooth" },
  ],
};

export type Efeito = keyof typeof EFEITOS;

export function tocar(efeito: Efeito) {
  if (!ligado) return;
  try {
    ctx ??= new AudioContext();
    if (ctx.state === "suspended") void ctx.resume();
    let t = ctx.currentTime;
    for (const nota of EFEITOS[efeito]) {
      if (nota.freq === 0) {
        t += nota.dur;
        continue;
      }
      const osc = ctx.createOscillator();
      const ganho = ctx.createGain();
      osc.type = nota.tipo ?? "square";
      osc.frequency.value = nota.freq;
      ganho.gain.setValueAtTime(0.06, t);
      ganho.gain.exponentialRampToValueAtTime(0.0001, t + nota.dur);
      osc.connect(ganho).connect(ctx.destination);
      osc.start(t);
      osc.stop(t + nota.dur);
      t += nota.dur;
    }
  } catch {
    /* navegador sem Web Audio: segue em silêncio */
  }
}
