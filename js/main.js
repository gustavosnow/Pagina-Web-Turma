/* ==============================================
   DADOS DA TURMA — edite aqui para personalizar
   ============================================== */
const TURMA = {
  alunos: [
    { nome: "Ana Paula Silva",      iniciais: "AP" },
    { nome: "Bruno Henrique Costa", iniciais: "BH" },
    { nome: "Carla Mendes",         iniciais: "CM" },
    { nome: "Diego Ferreira",       iniciais: "DF" },
    { nome: "Eduarda Lima",         iniciais: "EL" },
    { nome: "Felipe Rocha",         iniciais: "FR" },
    { nome: "Gabriela Nunes",       iniciais: "GN" },
    { nome: "Henrique Souza",       iniciais: "HS" },
    { nome: "Isabela Torres",       iniciais: "IT" },
    { nome: "João Vitor Alves",     iniciais: "JV" },
    { nome: "Karen Oliveira",       iniciais: "KO" },
    { nome: "Lucas Martins",        iniciais: "LM" },
    { nome: "Mariana Pereira",      iniciais: "MP" },
    { nome: "Nicolas Barbosa",      iniciais: "NB" },
    { nome: "Patrícia Gomes",       iniciais: "PG" },
    { nome: "Rafael Cardoso",       iniciais: "RC" },
    { nome: "Sara Ribeiro",         iniciais: "SR" },
    { nome: "Thiago Nascimento",    iniciais: "TN" },
    { nome: "Viviane Castro",       iniciais: "VC" },
    { nome: "Wesley Santos",        iniciais: "WS" },
  ],
  professores: [
    { nome: "Prof. Dr. André Luiz",       disciplina: "Algoritmos e Estruturas de Dados", iniciais: "AL" },
    { nome: "Profa. Dra. Beatriz Fontes", disciplina: "Banco de Dados",                  iniciais: "BF" },
    { nome: "Prof. Me. Carlos Eduardo",   disciplina: "Engenharia de Software",           iniciais: "CE" },
    { nome: "Profa. Esp. Daniela Mota",   disciplina: "Desenvolvimento Web",              iniciais: "DM" },
    { nome: "Prof. Dr. Fábio Corrêa",     disciplina: "Redes de Computadores",            iniciais: "FC" },
  ],
  disciplinas: [
    { nome: "Algoritmos e Estruturas de Dados", info: "Carga horária: 80h • 5º semestre", icone: "🧩" },
    { nome: "Banco de Dados",                   info: "Carga horária: 60h • 5º semestre", icone: "🗄️" },
    { nome: "Engenharia de Software",           info: "Carga horária: 60h • 5º semestre", icone: "⚙️" },
    { nome: "Desenvolvimento Web",              info: "Carga horária: 80h • 5º semestre", icone: "🌐" },
    { nome: "Redes de Computadores",            info: "Carga horária: 60h • 5º semestre", icone: "📡" },
    { nome: "Estágio Supervisionado",           info: "Carga horária: 40h • 5º semestre", icone: "🏢" },
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

/** Cria card de professor */
function criarCardProfessor(professor) {
  const card = document.createElement("div");
  card.className = "teacher-card";
  card.innerHTML = `
    <div class="teacher-card__avatar" aria-hidden="true">${professor.iniciais}</div>
    <div>
      <p class="teacher-card__name">${professor.nome}</p>
      <p class="teacher-card__subject">${professor.disciplina}</p>
    </div>
  `;
  return card;
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
  const studentsGrid    = document.getElementById("students-grid");
  const teachersGrid    = document.getElementById("teachers-grid");
  const disciplinesGrid = document.getElementById("disciplines-grid");

  TURMA.alunos.forEach(a => studentsGrid.appendChild(criarCardAluno(a)));
  TURMA.professores.forEach(p => teachersGrid.appendChild(criarCardProfessor(p)));
  TURMA.disciplinas.forEach(d => disciplinesGrid.appendChild(criarCardDisciplina(d)));
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
        animarContador(document.getElementById("count-professores"),  TURMA.professores.length);
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
  iniciarContadores();
  iniciarMenuMobile();
  definirAno();
});
