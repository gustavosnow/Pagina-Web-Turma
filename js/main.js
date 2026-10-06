/* ==============================================
   DADOS DA TURMA — edite aqui para personalizar
   ============================================== */
const TURMA = {
  alunos: [
    { nome: "Cybele Isabela dos Santos Silva", iniciais: "CI" },
    { nome: "Gustavo Neves Coelho",            iniciais: "GN" },
    { nome: "Hanrry Julio Araujo Santos",      iniciais: "HJ" },
    { nome: "Hortencia Gomes Silva",           iniciais: "HG" },
    { nome: "Igo Roberth Costa Martins",       iniciais: "IR" },
    { nome: "Ikki Silva Carvalho",             iniciais: "IS" },
    { nome: "Israel Martins de Moura Barros",  iniciais: "IM" },
    { nome: "Italo Dannyel Silva da Silva",    iniciais: "ID" },
    { nome: "Jose Gomes Cabral Neto",          iniciais: "JG" },
    { nome: "Lucas Daniel Brito Queiroz",      iniciais: "LD" },
    { nome: "Lucas Henrique Oliveira Souza",   iniciais: "LH" },
    { nome: "Luiz Felipe Meneses Ferreira",    iniciais: "LF" },
    { nome: "Mauricio Araujo Lucas",           iniciais: "MA" },
    { nome: "Nicolas Gabriel Cunha de Sousa",  iniciais: "NG" },
    { nome: "Saylon da Rocha Batista",         iniciais: "SR" },
    { nome: "Vitoria Mota Ribas",              iniciais: "VM" },
  ],
  professores: [
    {
      nome: "Jacqueline Cristina Teixeira do Rosario",
      disciplina: "Arquitetura de Software e Gerência de Projetos",
      iniciais: "JC",
      foto: "",
      resumo: "Conduz Arquitetura de Software e Gerência de Projetos. Com a turma, trabalha a estrutura dos sistemas e a organização do trabalho, do planejamento à entrega.",
    },
    {
      nome: "Alan Cloves Silva Barreto",
      disciplina: "Fundamentos de Redes de Computadores",
      iniciais: "AC",
      foto: "",
      resumo: "Leciona Fundamentos de Redes de Computadores. Apresenta como as máquinas se comunicam, da rede local aos protocolos que sustentam a internet.",
    },
    {
      nome: "Vanessa Castro Rezende",
      disciplina: "Processos de Desenvolvimento de Software",
      iniciais: "VC",
      foto: "",
      resumo: "Responsável por Processos de Desenvolvimento de Software. Acompanha a turma nas etapas que levam uma ideia até um software em uso.",
    },
    {
      nome: "Keny Lucas da Silva Goes",
      disciplina: "Robótica Móvel",
      iniciais: "KL",
      foto: "",
      resumo: "Leciona Robótica Móvel. A turma estuda como um robô percebe o ambiente, se desloca e decide o caminho enquanto se move.",
    },
  ],
  disciplinas: [
    { nome: "Arquitetura de Software",                    info: "5º semestre • turno da tarde", icone: "🏗️" },
    { nome: "Gerência de Projetos",                       info: "5º semestre • turno da tarde", icone: "📋" },
    { nome: "Fundamentos de Redes de Computadores",       info: "5º semestre • turno da tarde", icone: "📡" },
    { nome: "Processos de Desenvolvimento de Software",   info: "5º semestre • turno da tarde", icone: "⚙️" },
    { nome: "Robótica Móvel",                             info: "5º semestre • turno da tarde", icone: "🤖" },
  ],
};

/* ==============================================
   RENDERIZAÇÃO
   ============================================== */

/** Cria card de aluno */
function criarCardAluno(aluno) {
  const card = document.createElement("div");
  card.className = "student-card";
  card.innerHTML = `
    <div class="student-card__avatar" aria-hidden="true">${aluno.iniciais}</div>
    <p class="student-card__name">${aluno.nome}</p>
    <p class="student-card__role">Aluno</p>
  `;
  return card;
}

/** Cria o slide de um professor, com foto e resumo */
function criarSlideProfessor(professor) {
  const slide = document.createElement("article");
  slide.className = "teacher-slide";
  const foto = professor.foto
    ? `<img src="${professor.foto}" alt="Foto de ${professor.nome}">`
    : `<span aria-hidden="true">${professor.iniciais}</span>`;
  slide.innerHTML = `
    <div class="teacher-slide__photo">${foto}</div>
    <div class="teacher-slide__body">
      <h3 class="teacher-slide__name">${professor.nome}</h3>
      <p class="teacher-slide__subject">${professor.disciplina}</p>
      <p class="teacher-slide__summary">${professor.resumo}</p>
    </div>
  `;
  return slide;
}

/** Monta uma fila infinita de alunos */
function montarFilaAlunos(container, alunos) {
  const track = document.createElement("div");
  track.className = "students-marquee__track";

  const grupo = document.createElement("div");
  grupo.className = "students-marquee__group";
  alunos.forEach(aluno => grupo.appendChild(criarCardAluno(aluno)));

  const copia = grupo.cloneNode(true);
  copia.setAttribute("aria-hidden", "true");
  track.append(grupo, copia);
  container.appendChild(track);
}

/** Cria card de disciplina */
function criarCardDisciplina(disciplina) {
  const card = document.createElement("div");
  card.className = "discipline-card";
  card.innerHTML = `
    <div class="discipline-card__icon">${disciplina.icone}</div>
    <p class="discipline-card__name">${disciplina.nome}</p>
    <p class="discipline-card__info">${disciplina.info}</p>
  `;
  return card;
}

/** Renderiza todos os cards nas grids */
function renderizarTurma() {
  const rowTop          = document.getElementById("students-row-top");
  const rowBottom       = document.getElementById("students-row-bottom");
  const disciplinesGrid = document.getElementById("disciplines-grid");
  const viewport        = document.getElementById("teacher-viewport");

  const alunos = [...TURMA.alunos].sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
  const meio = Math.ceil(alunos.length / 2);
  montarFilaAlunos(rowTop, alunos.slice(0, meio));
  montarFilaAlunos(rowBottom, alunos.slice(meio));

  TURMA.disciplinas.forEach(d => disciplinesGrid.appendChild(criarCardDisciplina(d)));

  TURMA.professores.forEach(p => viewport.appendChild(criarSlideProfessor(p)));
}

function iniciarProfessores() {
  const viewport = document.getElementById("teacher-viewport");
  const slider = viewport.closest(".teacher-slider");
  const cards = [...viewport.querySelectorAll(".teacher-slide")];
  const total = cards.length;
  let indice = 0;

  function mostrar(proximo) {
    indice = (proximo + total) % total;

    cards.forEach((card, i) => {
      const ativo = i === indice;
      card.classList.toggle("is-center", ativo);
      card.setAttribute("aria-hidden", ativo ? "false" : "true");
    });

    const atual = TURMA.professores[indice];
    viewport.setAttribute("aria-label", `${atual.nome}, ${atual.disciplina}. ${indice + 1} de ${total}`);
  }

  slider.querySelector(".teacher-slider__arrow--prev").addEventListener("click", () => mostrar(indice - 1));
  slider.querySelector(".teacher-slider__arrow--next").addEventListener("click", () => mostrar(indice + 1));

  mostrar(0);
}

/* ==============================================
   CONTADORES ANIMADOS
   ============================================== */
function animarContador(el, alvo, duracao = 1200) {
  const inicio = performance.now();
  function step(agora) {
    const progresso = Math.min((agora - inicio) / duracao, 1);
    el.textContent = Math.floor(progresso * alvo);
    if (progresso < 1) requestAnimationFrame(step);
    else el.textContent = alvo;
  }
  requestAnimationFrame(step);
}

function iniciarContadores() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animarContador(document.getElementById("count-alunos"),      TURMA.alunos.length);
        animarContador(document.getElementById("count-professores"), new Set(TURMA.professores.map(p => p.nome)).size);
        animarContador(document.getElementById("count-disciplinas"),  TURMA.disciplinas.length);
        observer.disconnect();
      }
    });
  }, { threshold: 0.4 });

  const section = document.querySelector(".about");
  if (section) observer.observe(section);
}

/* ==============================================
   MENU MOBILE
   ============================================== */
function iniciarMenuMobile() {
  const toggle = document.querySelector(".navbar__toggle");
  const links  = document.querySelector(".navbar__links");
  if (!toggle || !links) return;

  toggle.addEventListener("click", () => {
    links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", links.classList.contains("open"));
  });

  links.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => links.classList.remove("open"));
  });
}

/* ==============================================
   ANO NO RODAPÉ
   ============================================== */
function definirAno() {
  const el = document.getElementById("year");
  if (el) el.textContent = new Date().getFullYear();
}

/* ==============================================
   INICIALIZAÇÃO
   ============================================== */
document.addEventListener("DOMContentLoaded", () => {
  renderizarTurma();
  iniciarProfessores();
  iniciarContadores();
  iniciarMenuMobile();
  definirAno();
});
