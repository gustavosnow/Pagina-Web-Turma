/* ==============================================
   DADOS DA TURMA — edite aqui para personalizar
   ============================================== */

export type Aluno = {
  nome: string;
  /** Nome curto exibido na grade de seleção */
  apelido: string;
  /** Arquivo em public/fotos (sem extensão). Vazio = avatar pixel com as iniciais */
  foto: string;
};

export type Professor = {
  nome: string;
  disciplina: string;
  foto: string;
  resumo: string;
};

export type Disciplina = {
  codigo: string;
  nome: string;
  professor?: string;
  icone: IconeDisciplina;
};

export type IconeDisciplina = "arquitetura" | "gerencia" | "redes" | "processos" | "robotica" | "cultura";

export type Semestre = {
  numero: number;
  estado: "concluido" | "atual" | "futuro";
  disciplinas: string[];
};

export const TURMA = {
  nome: "Engenharia de Software",
  periodo: "2026.2",
  semestre: 5,
  turno: "tarde",
  ingresso: 2024,
  instituicao: "UEPA",
  sobre:
    "A turma ingressou em 2024 e hoje cursa o 5º semestre no turno da tarde. Neste período a sala percorre arquitetura de software, gerência de projetos, processos de desenvolvimento, redes de computadores e robótica móvel.",
};

export const DOCENTE_RESPONSAVEL = {
  nome: "Jacqueline Cristina Teixeira do Rosario",
  foto: "jacqueline-rosario",
  disciplinas: ["Arquitetura de Software", "Gerência de Projetos"],
  fala: [
    "* Uma mestra entrou na party!",
    "* Jacqueline Cristina Teixeira do Rosario é a docente responsável pela turma.",
    "* Conduz Arquitetura de Software e Gerência de Projetos: a estrutura dos sistemas e a organização do trabalho, do planejamento à entrega.",
    "* Saber que ela guia a turma te enche de DETERMINAÇÃO.",
  ],
};

export const ALUNOS: Aluno[] = [
  { nome: "Cybele Isabela dos Santos Silva", apelido: "Cybele", foto: "cybele-silva" },
  { nome: "Gustavo Neves Coelho", apelido: "Gustavo", foto: "gustavo-coelho" },
  { nome: "Hanrry Julio Araujo Santos", apelido: "Hanrry", foto: "hanrry-santos" },
  { nome: "Hortencia Gomes Silva", apelido: "Hortencia", foto: "hortencia-silva" },
  { nome: "Igo Roberth Costa Martins", apelido: "Igo", foto: "igo-martins" },
  { nome: "Ikki Silva Carvalho", apelido: "Ikki", foto: "ikki-carvalho" },
  { nome: "Israel Martins de Moura Barros", apelido: "Israel", foto: "israel-barros" },
  { nome: "Italo Dannyel Silva da Silva", apelido: "Italo", foto: "italo-silva" },
  { nome: "Jose Gomes Cabral Neto", apelido: "José", foto: "jose-neto" },
  { nome: "Lucas Daniel Brito Queiroz", apelido: "Lucas D.", foto: "lucas-daniel" },
  { nome: "Lucas Henrique Oliveira Souza", apelido: "Lucas H.", foto: "lucas-souza" },
  { nome: "Luiz Felipe Meneses Ferreira", apelido: "Luiz", foto: "luiz-ferreira" },
  { nome: "Mauricio Araujo Lucas", apelido: "Mauricio", foto: "mauricio-lucas" },
  { nome: "Nicolas Gabriel Cunha de Sousa", apelido: "Nicolas", foto: "nicolas-sousa" },
  { nome: "Saylon da Rocha Batista", apelido: "Saylon", foto: "saylon-batista" },
  { nome: "Vitoria Mota Ribas", apelido: "Vitória", foto: "vitoria-mota" },
];

export const PROFESSORES: Professor[] = [
  {
    nome: "Jacqueline Cristina Teixeira do Rosario",
    disciplina: "Arquitetura de Software e Gerência de Projetos",
    foto: "jacqueline-rosario",
    resumo:
      "Conduz Arquitetura de Software e Gerência de Projetos. Com a turma, trabalha a estrutura dos sistemas e a organização do trabalho, do planejamento à entrega.",
  },
  {
    nome: "Alan Cloves Silva Barreto",
    disciplina: "Fundamentos de Redes de Computadores",
    foto: "",
    resumo:
      "Leciona Fundamentos de Redes de Computadores. Apresenta como as máquinas se comunicam, da rede local aos protocolos que sustentam a internet.",
  },
  {
    nome: "Vanessa Castro Rezende",
    disciplina: "Processos de Desenvolvimento de Software",
    foto: "",
    resumo:
      "Responsável por Processos de Desenvolvimento de Software. Acompanha a turma nas etapas que levam uma ideia até um software em uso.",
  },
  {
    nome: "Keny Lucas da Silva Goes",
    disciplina: "Robótica Móvel e Cultura, Sociedade e Tecnologia",
    foto: "",
    resumo:
      "Leciona Robótica Móvel e Cultura, Sociedade e Tecnologia. A turma conecta sistemas autônomos aos impactos sociais e tecnológicos do desenvolvimento.",
  },
];

export const DISCIPLINAS: Disciplina[] = [
  { codigo: "5-1", nome: "Arquitetura de Software", professor: "Jacqueline Rosario", icone: "arquitetura" },
  { codigo: "5-2", nome: "Gerência de Projetos", professor: "Jacqueline Rosario", icone: "gerencia" },
  { codigo: "5-3", nome: "Fundamentos de Redes de Computadores", professor: "Alan Barreto", icone: "redes" },
  { codigo: "5-4", nome: "Processos de Desenvolvimento de Software", professor: "Vanessa Rezende", icone: "processos" },
  { codigo: "5-5", nome: "Robótica Móvel", professor: "Keny Goes", icone: "robotica" },
  { codigo: "5-6", nome: "Cultura, Sociedade e Tecnologia", professor: "Keny Goes", icone: "cultura" },
];

/** Histórico confirmado pelas pastas compartilhadas da turma no Google Drive. */
export const SEMESTRES: Semestre[] = [
  {
    numero: 1,
    estado: "concluido",
    disciplinas: [
      "Matemática Discreta",
      "Linguagens Formais",
      "Inglês Instrumental",
      "Programação Estruturada",
      "Sistemas de Informação",
      "Sistemas Operacionais",
    ],
  },
  {
    numero: 2,
    estado: "concluido",
    disciplinas: [
      "Estrutura de Dados",
      "Modelagem de Dados",
      "Programação Web",
      "Análise Orientada a Objetos I",
      "Estatística Aplicada",
    ],
  },
  {
    numero: 3,
    estado: "concluido",
    disciplinas: [
      "Análise e Projeto de Algoritmos",
      "Microcontroladores e Microprocessadores",
      "Inovação Tecnológica e Empreendedorismo",
      "Banco de Dados I",
      "Programação Orientada a Objetos I",
      "Fundamentos de Engenharia de Software",
    ],
  },
  {
    numero: 4,
    estado: "concluido",
    disciplinas: [
      "Sistemas Multirobóticos",
      "Projeto Integrado I",
      "Programação Orientada a Objetos II",
      "Análise e Projeto de Software",
      "Banco de Dados II",
    ],
  },
  {
    numero: 5,
    estado: "atual",
    disciplinas: DISCIPLINAS.map((disciplina) => disciplina.nome),
  },
  { numero: 6, estado: "futuro", disciplinas: [] },
  { numero: 7, estado: "futuro", disciplinas: [] },
  { numero: 8, estado: "futuro", disciplinas: [] },
];

export const INSTAGRAM_URL = "https://www.instagram.com/eng.software_pbs2024/";

export function iniciais(nome: string) {
  const partes = nome.split(" ").filter((p) => p.length > 2);
  return (partes[0][0] + (partes[1]?.[0] ?? "")).toUpperCase();
}

export function caminhoFoto(slug: string) {
  return `${import.meta.env.BASE_URL}fotos/${slug}.webp`;
}
