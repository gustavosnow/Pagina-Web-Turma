import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/* Ilha flutuante em voxels. O canvas é renderizado em baixa resolução e ampliado com
   image-rendering: pixelated, o que dá o pixel "de verdade" do 8 bits. */

const COR = {
  grama: "#00e436",
  gramaEscura: "#008751",
  terra: "#ab5236",
  terraEscura: "#7e2553",
  pedra: "#5f574f",
  pedraClara: "#83769c",
  tronco: "#ab5236",
  folha: "#008751",
  folhaClara: "#00e436",
  castelo: "#c2c3c7",
  casteloEscuro: "#83769c",
  telhado: "#ff004d",
  caminho: "#ffccaa",
};

type Voxel = [number, number, number, string];

function ruido(x: number, z: number) {
  return Math.sin(x * 1.7 + z * 0.9) * 0.5 + Math.cos(z * 1.3 - x * 0.6) * 0.5;
}

function montarIlha(): Voxel[] {
  const v: Voxel[] = [];
  const R = 7;
  const topo = new Map<string, number>();
  // caminho de terra até o castelo
  const caminho = new Set<string>();
  for (let i = -5; i <= 2; i++) caminho.add(`${i},${Math.round(i * 0.4) + 1}`);
  for (let x = -R; x <= R; x++) {
    for (let z = -R; z <= R; z++) {
      const d = Math.hypot(x, z) + ruido(x, z) * 0.9;
      if (d > R) continue;
      const h = d < 3.5 && ruido(x * 0.5, z * 0.5) > 0.3 ? 1 : 0;
      topo.set(`${x},${z}`, h);
      const fundo = -Math.round((R - d) * 0.9) - 1;
      for (let y = h; y >= fundo; y--) {
        let cor: string;
        if (y === h) cor = caminho.has(`${x},${z}`) ? COR.caminho : (x + z) % 3 === 0 ? COR.gramaEscura : COR.grama;
        else if (y >= h - 2) cor = (x * z) % 2 === 0 ? COR.terra : COR.terraEscura;
        else cor = (x + y) % 2 === 0 ? COR.pedra : COR.pedraClara;
        v.push([x, y, z, cor]);
      }
    }
  }
  const arvore = (x: number, z: number, alt = 2) => {
    const base = (topo.get(`${x},${z}`) ?? 0) + 1;
    for (let y = 0; y < alt; y++) v.push([x, base + y, z, COR.tronco]);
    for (let dx = -1; dx <= 1; dx++)
      for (let dz = -1; dz <= 1; dz++)
        for (let dy = 0; dy < 2; dy++)
          if (!(Math.abs(dx) + Math.abs(dz) === 2 && dy === 1))
            v.push([x + dx, base + alt + dy, z + dz, (dx + dz + dy) % 2 === 0 ? COR.folha : COR.folhaClara]);
    v.push([x, base + alt + 2, z, COR.folhaClara]);
  };
  arvore(-4, -2);
  arvore(-2, 4, 3);
  arvore(4, 4);
  arvore(-5, 2);
  arvore(1, -5, 3);

  // castelo (a "formatura" no fim do caminho)
  const cx = 3,
    cz = -1;
  const baseC = (topo.get(`${cx},${cz}`) ?? 0) + 1;
  for (let x = 0; x < 3; x++)
    for (let z = 0; z < 3; z++)
      for (let y = 0; y < 4; y++) {
        const porta = x === 1 && z === 2 && y < 2;
        if (!porta) v.push([cx + x, baseC + y, cz + z, (x + y + z) % 2 ? COR.castelo : COR.casteloEscuro]);
      }
  [
    [0, 0],
    [2, 0],
    [0, 2],
    [2, 2],
  ].forEach(([x, z]) => v.push([cx + x, baseC + 4, cz + z, COR.castelo]));
  for (let y = 5; y < 8; y++) v.push([cx + 1, baseC + y - 1, cz + 1, COR.casteloEscuro]);
  v.push([cx + 1, baseC + 7, cz + 1, COR.telhado]);
  v.push([cx + 2, baseC + 7, cz + 1, COR.telhado]);
  return v;
}

function Voxels() {
  const voxels = useMemo(montarIlha, []);
  const ref = useRef<THREE.InstancedMesh>(null);
  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const m = new THREE.Matrix4();
    const c = new THREE.Color();
    voxels.forEach(([x, y, z, cor], i) => {
      m.setPosition(x, y, z);
      mesh.setMatrixAt(i, m);
      mesh.setColorAt(i, c.set(cor));
    });
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [voxels]);
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, voxels.length]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshLambertMaterial />
    </instancedMesh>
  );
}

function texturaInterrogacao() {
  const s = 16;
  const c = document.createElement("canvas");
  c.width = c.height = s;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#1d2b53";
  ctx.fillRect(0, 0, s, s);
  ctx.fillStyle = "#ffa300";
  ctx.fillRect(1, 1, s - 2, s - 2);
  ctx.fillStyle = "#ffec27";
  ctx.fillRect(1, 1, s - 3, 1);
  ctx.fillRect(1, 1, 1, s - 3);
  ctx.fillStyle = "#1d2b53";
  [
    [2, 2],
    [13, 2],
    [2, 13],
    [13, 13],
  ].forEach(([x, y]) => ctx.fillRect(x, y, 1, 1));
  // o "?"
  ctx.fillStyle = "#fff1e8";
  const q = ["..xxxx..", ".xx..xx.", ".....xx.", "....xx..", "...xx...", "........", "...xx...", "...xx..."];
  q.forEach((linha, y) => [...linha].forEach((ch, x) => ch === "x" && ctx.fillRect(4 + x, 4 + y, 1, 1)));
  const t = new THREE.CanvasTexture(c);
  t.magFilter = THREE.NearestFilter;
  t.minFilter = THREE.NearestFilter;
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function BlocoInterrogacao() {
  const ref = useRef<THREE.Mesh>(null);
  const textura = useMemo(texturaInterrogacao, []);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (!ref.current) return;
    ref.current.position.y = 7 + Math.round(Math.sin(t * 2) * 4) / 8;
    ref.current.rotation.y = t * 0.6;
  });
  return (
    <mesh ref={ref} position={[-3, 7, 1]}>
      <boxGeometry args={[1.6, 1.6, 1.6]} />
      <meshBasicMaterial map={textura} />
    </mesh>
  );
}

function Moedas() {
  const grupo = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    grupo.current?.children.forEach((m, i) => {
      const a = t * 0.5 + (i / 6) * Math.PI * 2;
      m.position.set(Math.cos(a) * 9.5, 3 + Math.sin(a * 2) * 0.8, Math.sin(a) * 9.5);
      m.rotation.y = t * 3 + i;
    });
  });
  return (
    <group ref={grupo}>
      {Array.from({ length: 6 }, (_, i) => (
        <mesh key={i} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.55, 0.55, 0.18, 8]} />
          <meshLambertMaterial color="#ffec27" emissive="#ffa300" emissiveIntensity={0.35} />
        </mesh>
      ))}
    </group>
  );
}

function Nuvens() {
  const grupo = useRef<THREE.Group>(null);
  const nuvens = useMemo(
    () => [
      { x: -14, y: 10, z: -8, s: 1 },
      { x: 10, y: 12, z: -12, s: 1.3 },
      { x: 16, y: 6, z: 6, s: 0.8 },
    ],
    [],
  );
  useFrame((_, dt) => {
    grupo.current?.children.forEach((n) => {
      n.position.x += dt * 0.8;
      if (n.position.x > 22) n.position.x = -22;
    });
  });
  return (
    <group ref={grupo}>
      {nuvens.map((n, i) => (
        <group key={i} position={[n.x, n.y, n.z]} scale={n.s}>
          {[
            [0, 0, 0, 4, 1.2, 2],
            [0.8, 0.9, 0, 2.4, 1, 1.6],
            [-1.2, 0.5, 0.3, 1.6, 0.8, 1.4],
          ].map(([x, y, z, w, h, d], j) => (
            <mesh key={j} position={[x, y, z]}>
              <boxGeometry args={[w, h, d]} />
              <meshLambertMaterial color="#fff1e8" />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

function Cena({ animar }: { animar: boolean }) {
  const ilha = useRef<THREE.Group>(null);
  const mouse = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const mover = (e: PointerEvent) => {
      mouse.current.x = (e.clientX / innerWidth) * 2 - 1;
      mouse.current.y = (e.clientY / innerHeight) * 2 - 1;
    };
    addEventListener("pointermove", mover);
    return () => removeEventListener("pointermove", mover);
  }, []);
  useFrame(({ clock }, dt) => {
    const g = ilha.current;
    if (!g || !animar) return;
    const t = clock.elapsedTime;
    g.rotation.y += dt * (0.12 + mouse.current.x * 0.3);
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, mouse.current.y * 0.12, 0.05);
    g.position.y = Math.sin(t * 0.8) * 0.4;
  });
  return (
    <>
      <ambientLight intensity={1.1} />
      <directionalLight position={[8, 16, 10]} intensity={2.2} />
      <directionalLight position={[-10, 4, -6]} intensity={0.5} color="#29adff" />
      <group ref={ilha} rotation={[0, -0.6, 0]}>
        <Voxels />
        <BlocoInterrogacao />
        <Moedas />
      </group>
      <Nuvens />
    </>
  );
}

/** Tamanho do "pixel" na tela: quanto maior, mais quadradão */
function dprPixelado() {
  return 1 / (innerWidth < 700 ? 3 : 4);
}

export default function Hero3D({ animar }: { animar: boolean }) {
  const wrap = useRef<HTMLDivElement>(null);
  const [visivel, setVisivel] = useState(true);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => setVisivel(e.isIntersecting));
    if (wrap.current) obs.observe(wrap.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={wrap} className="hero__3d" aria-hidden="true">
      <Canvas
        dpr={dprPixelado()}
        frameloop={visivel && animar ? "always" : "demand"}
        gl={{ antialias: false, alpha: true, powerPreference: "low-power" }}
        camera={{ position: [27, 18, 27], fov: 34 }}
        onCreated={({ camera }) => camera.lookAt(0, 1.5, 0)}
      >
        <Cena animar={animar} />
      </Canvas>
    </div>
  );
}
