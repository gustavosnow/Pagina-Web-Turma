// Gera as fotos do site (webp quadrado, 512px) a partir da pasta original.
// Uso: npm run fotos -- "<pasta com as fotos>"
// A pasta original nunca é alterada: o script só lê dela.
import sharp from "sharp";
import { readdir, mkdir } from "node:fs/promises";
import { join, parse } from "node:path";

const origem = process.argv[2];
if (!origem) {
  console.error('Informe a pasta das fotos: npm run fotos -- "C:/caminho/da/pasta"');
  process.exit(1);
}
const destino = "public/fotos";

// Nome do arquivo original (sem extensão, em minúsculas) -> slug usado em src/data/turma.ts
const MAPA = {
  "cybele-silva": "cybele-silva",
  "gustavo neves coelho": "gustavo-coelho",
  "hanrry": "hanrry-santos",
  "hortencia-silva": "hortencia-silva",
  "igo-martins": "igo-martins",
  "ikki silva carvalho": "ikki-carvalho",
  "israel": "israel-barros",
  "italo dannyel silva da silva": "italo-silva",
  "jose-neto": "jose-neto",
  "lucas-daniel": "lucas-daniel",
  "lucas-souza": "lucas-souza",
  "luiz felipe meneses ferreira": "luiz-ferreira",
  "mauricio-lucas": "mauricio-lucas",
  "nicolas gabriel cunha de sousa": "nicolas-sousa",
  "saylon-batista": "saylon-batista",
  "vitoria-mota": "vitoria-mota",
  "jacqueline cristina teixeira do rosario": "jacqueline-rosario",
};

// Fotos de corpo inteiro ou com o rosto fora do centro: recorte manual (em px da original).
const RECORTES = {
  "hanrry-santos": { left: 220, top: 200, width: 200, height: 200 },
  "israel-barros": { left: 215, top: 85, width: 210, height: 210 },
  "jose-neto": { left: 130, top: 0, width: 270, height: 270 },
  "jacqueline-rosario": { left: 0, top: 0, width: 500, height: 500 },
};

async function listar(pasta) {
  const itens = await readdir(pasta, { withFileTypes: true });
  const arquivos = [];
  for (const item of itens) {
    const caminho = join(pasta, item.name);
    if (item.isDirectory()) arquivos.push(...(await listar(caminho)));
    else if (/\.(jpe?g|png|webp)$/i.test(item.name)) arquivos.push(caminho);
  }
  return arquivos;
}

await mkdir(destino, { recursive: true });
for (const arquivo of await listar(origem)) {
  const slug = MAPA[parse(arquivo).name.toLowerCase()];
  if (!slug) {
    console.warn(`sem mapeamento, ignorado: ${arquivo}`);
    continue;
  }
  let imagem = sharp(arquivo).rotate();
  if (RECORTES[slug]) imagem = imagem.extract(RECORTES[slug]);
  await imagem
    .resize(512, 512, { fit: "cover", position: sharp.strategy.attention })
    .webp({ quality: 82 })
    .toFile(join(destino, `${slug}.webp`));
  console.log(`ok  ${slug}.webp`);
}
