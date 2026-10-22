/* Peças de cenário em pixel: montanhas em degraus e campo de estrelas. */

function aleatorio(semente: number) {
  let s = semente;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

type MontanhasProps = { cor: string; semente: number; altura: number; className?: string };

export function Montanhas({ cor, semente, altura, className }: MontanhasProps) {
  const L = 320;
  const A = 100;
  const passo = 4;
  const rnd = aleatorio(semente);
  // picos aleatórios e silhueta em degraus de 4 unidades
  const picos = Array.from({ length: 6 }, (_, i) => ({ x: (i + rnd() * 0.8) * (L / 5.5), h: A * altura * (0.55 + rnd() * 0.45) }));
  let d = `M0 ${A}`;
  for (let x = 0; x <= L; x += passo) {
    const h = Math.max(...picos.map((p) => p.h - Math.abs(x - p.x) * 0.9));
    const y = A - Math.max(passo, Math.round(Math.max(0, h) / passo) * passo);
    d += ` V${y} H${x + passo}`;
  }
  d += ` V${A} Z`;
  return (
    <svg
      className={`montanhas ${className ?? ""}`}
      viewBox={`0 0 ${L} ${A}`}
      preserveAspectRatio="xMidYMax slice"
      shapeRendering="crispEdges"
      aria-hidden="true"
    >
      <path d={d} fill={cor} />
    </svg>
  );
}

export function Estrelas({ quantidade = 60 }: { quantidade?: number }) {
  const rnd = aleatorio(42);
  return (
    <div className="estrelas" aria-hidden="true">
      {Array.from({ length: quantidade }, (_, i) => (
        <span
          key={i}
          className={`estrela ${i % 7 === 0 ? "estrela--grande" : ""}`}
          style={{
            left: `${rnd() * 100}%`,
            top: `${rnd() * 70}%`,
            animationDelay: `${(rnd() * 3).toFixed(2)}s`,
          }}
        />
      ))}
    </div>
  );
}
