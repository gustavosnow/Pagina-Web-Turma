import { useEffect, useRef } from "react";
import { gsap, reduzirMovimento } from "../lib/movimento";

type Props = {
  src: string;
  alt: string;
  /** true = foto nítida; false = pixelada */
  nitida: boolean;
  /** Quantos "pixels" de lado a foto tem quando pixelada */
  base?: number;
  className?: string;
};

const LADO = 256; // resolução interna do canvas
const NIVEIS = 6; // tons por canal na versão pixelada (posterização, cara de 8 bits)

/** Foto desenhada em canvas que alterna entre pixelada e nítida, em degraus. */
export function PixelPhoto({ src, alt, nitida, base = 14, className }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const peqRef = useRef<HTMLCanvasElement | null>(null);
  const estado = useRef({ p: nitida ? 1 : 0 });

  function desenhar() {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const p = estado.current.p;
    if (p >= 0.999) {
      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(img, 0, 0, LADO, LADO);
      return;
    }
    const res = Math.max(4, Math.round(base * Math.pow(LADO / 2 / base, p)));
    const peq = (peqRef.current ??= document.createElement("canvas"));
    peq.width = peq.height = res;
    const pctx = peq.getContext("2d", { willReadFrequently: true });
    if (!pctx) return;
    pctx.drawImage(img, 0, 0, res, res);
    if (p < 0.5) {
      const dados = pctx.getImageData(0, 0, res, res);
      const passo = 255 / (NIVEIS - 1);
      for (let i = 0; i < dados.data.length; i += 4) {
        dados.data[i] = Math.round(dados.data[i] / passo) * passo;
        dados.data[i + 1] = Math.round(dados.data[i + 1] / passo) * passo;
        dados.data[i + 2] = Math.round(dados.data[i + 2] / passo) * passo;
      }
      pctx.putImageData(dados, 0, 0);
    }
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(peq, 0, 0, res, res, 0, 0, LADO, LADO);
  }

  useEffect(() => {
    const img = new Image();
    img.decoding = "async";
    img.src = src;
    img.onload = () => {
      imgRef.current = img;
      desenhar();
    };
    return () => {
      img.onload = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  useEffect(() => {
    const alvo = nitida ? 1 : 0;
    if (reduzirMovimento()) {
      estado.current.p = alvo;
      desenhar();
      return;
    }
    const tween = gsap.to(estado.current, {
      p: alvo,
      duration: nitida ? 0.5 : 0.3,
      ease: "steps(6)",
      onUpdate: desenhar,
    });
    return () => {
      tween.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nitida]);

  return <canvas ref={canvasRef} width={LADO} height={LADO} className={className} role="img" aria-label={alt} />;
}
