/* Sprites desenhados em grade de caracteres: cada letra é uma cor da paleta, "." é transparente.
   Saem como SVG de retângulos, nítidos em qualquer tamanho. */

const CORES: Record<string, string> = {
  k: "#1d2b53", // contorno
  w: "#fff1e8",
  g: "#c2c3c7",
  d: "#5f574f",
  r: "#ff004d",
  o: "#ffa300",
  y: "#ffec27",
  G: "#00e436",
  v: "#008751",
  b: "#29adff",
  p: "#ff77a8",
  m: "#ab5236",
  s: "#ffccaa",
};

export const SPRITES = {
  arquitetura: [
    "......kk......",
    ".....kyyk.....",
    "....kyyyyk....",
    "...kyyyyyyk...",
    "..kkkkkkkkkk..",
    "..kwk.kwk.kwk.",
    "..kwk.kwk.kwk.",
    "..kwk.kwk.kwk.",
    "..kwk.kwk.kwk.",
    "..kwk.kwk.kwk.",
    ".kkkkkkkkkkkk.",
    ".kggggggggggk.",
    "kkkkkkkkkkkkkk",
  ],
  gerencia: [
    "....kkkkkk....",
    "..kkkggggkkk..",
    "..kwkkkkkkwk..",
    "..kwwwwwwwwk..",
    "..kwGkwwwwwk..",
    "..kGkwkkkkwk..",
    "..kwwwwwwwwk..",
    "..kwGkwwwwwk..",
    "..kGkwkkkkwk..",
    "..kwwwwwwwwk..",
    "..kwrrwkkkwk..",
    "..kwwwwwwwwk..",
    "..kkkkkkkkkk..",
  ],
  redes: [
    "......kk......",
    ".....kbbk.....",
    ".....kbbk.....",
    "......kk......",
    "......kk......",
    "..kk..kk..kk..",
    ".kbbkkkkkkbbk.",
    ".kbbk.kk.kbbk.",
    "..kk..kk..kk..",
    "......kk......",
    ".....kkkk.....",
    "....kGGGGk....",
    "....kkkkkk....",
  ],
  processos: [
    ".....kkkk.....",
    "..kk.kggk.kk..",
    ".kggkkggkkggk.",
    ".kgggggggggk..",
    "..kggkkkkggk..",
    "kkggk....kggkk",
    "kgggk....kgggk",
    "kkggk....kggkk",
    "..kggkkkkggk..",
    ".kgggggggggk..",
    ".kggkkggkkggk.",
    "..kk.kggk.kk..",
    ".....kkkk.....",
  ],
  robotica: [
    "......kk......",
    "......rr......",
    "......kk......",
    "..kkkkkkkkkk..",
    ".kggggggggggk.",
    ".kgkkggggkkgk.",
    "kkgkbkggkbkgkk",
    "kgggkkggkkgggk",
    "kkgggggggggkk.",
    ".kggkkkkkkggk.",
    ".kggkykykyggk.",
    ".kggggggggggk.",
    "..kkkkkkkkkk..",
  ],
  coracao: [
    ".kk.kk.",
    "krrkrrk",
    "krwrrrk",
    "krrrrrk",
    ".krrrk.",
    "..krk..",
    "...k...",
  ],
  moeda: [
    "..kkkk..",
    ".kyyyyk.",
    "kyywyyok",
    "kyywyyok",
    "kyywyyok",
    "kyyyyyok",
    ".kyoook.",
    "..kkkk..",
  ],
  estrela: [
    "....k....",
    "...kyk...",
    "kkkkyykkk",
    "kyyyyyyyk",
    ".kyyyyyk.",
    "..kyyyk..",
    ".kyykyyk.",
    ".kyk.kyk.",
    ".kk...kk.",
  ],
  cadeado: [
    "..kkkk..",
    ".kk..kk.",
    ".k....k.",
    "kkkkkkkk",
    "kooooook",
    "kookkook",
    "kooookok",
    "kkkkkkkk",
  ],
  bandeira: [
    "kkkkk...",
    "krrrrk..",
    "krrrrrk.",
    "krrrrk..",
    "kkkkk...",
    "k.......",
    "k.......",
    "k.......",
    "k.......",
    "k.......",
  ],
  castelo: [
    "k.k.k....k.k.k",
    "kgkgk....kgkgk",
    "kgggk.kk.kgggk",
    "kgggkkggkkgggk",
    "kgkgkggggkgkgk",
    "kgggggggggggggk",
    "kggggkkkkggggk",
    "kgggkdddkkgggk",
    "kgggkddddkgggk",
    "kkkkkkkkkkkkkk",
  ],
  jogador: [
    "...kkkkk....",
    "..krrrrrk...",
    ".krrrwrrrkk.",
    ".kkkkkkkkkk.",
    "..kmssssk...",
    "..kmskskk...",
    "..kssssssk..",
    "...kssssk...",
    "..kkbbbbkk..",
    ".kokbbbbksk.",
    ".kokbbbbksk.",
    ".kokbbbbkkk.",
    "..kkbbbbk...",
    "...kddddk...",
    "...kdkkdk...",
    "...kk..kk...",
  ],
  som: [
    "....k...",
    "...kk...",
    "kkkwk.k.",
    "kwwwk..k",
    "kwwwk..k",
    "kkkwk.k.",
    "...kk...",
    "....k...",
  ],
  mudo: [
    "....k...",
    "...kk...",
    "kkkwk...",
    "kwwwkk.k",
    "kwwwk.k.",
    "kkkwkk.k",
    "...kk...",
    "....k...",
  ],
} as const;

export type NomeSprite = keyof typeof SPRITES;

type Props = {
  nome: NomeSprite;
  /** tamanho de cada pixel do sprite, em px */
  escala?: number;
  className?: string;
  titulo?: string;
};

export function PixelIcon({ nome, escala = 4, className, titulo }: Props) {
  const linhas = SPRITES[nome];
  const largura = Math.max(...linhas.map((l) => l.length));
  const rects: JSX.Element[] = [];
  linhas.forEach((linha, y) => {
    [...linha].forEach((c, x) => {
      const cor = CORES[c];
      if (cor) rects.push(<rect key={`${x}-${y}`} x={x} y={y} width={1.02} height={1.02} fill={cor} />);
    });
  });
  return (
    <svg
      className={className}
      viewBox={`0 0 ${largura} ${linhas.length}`}
      width={largura * escala}
      height={linhas.length * escala}
      shapeRendering="crispEdges"
      role={titulo ? "img" : undefined}
      aria-hidden={titulo ? undefined : true}
      aria-label={titulo}
    >
      {rects}
    </svg>
  );
}
