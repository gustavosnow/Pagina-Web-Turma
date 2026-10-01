/* ==============================================
   DADOS DA TURMA — edite aqui para personalizar
   ============================================== */
const TURMA = {
  alunos: [
    { nome: "Aluno 01", iniciais: "A1" },
    { nome: "Aluno 02", iniciais: "A2" },
    { nome: "Aluno 03", iniciais: "A3" },
    { nome: "Aluno 04", iniciais: "A4" },
    { nome: "Aluno 05", iniciais: "A5" },
    { nome: "Aluno 06", iniciais: "A6" },
  ],
  professores: [
    { nome: "Prof. Placeholder", disciplina: "Disciplina A", iniciais: "PA" },
    { nome: "Prof. Placeholder", disciplina: "Disciplina B", iniciais: "PB" },
    { nome: "Prof. Placeholder", disciplina: "Disciplina C", iniciais: "PC" },
  ],
  disciplinas: [
    { nome: "Disciplina A", info: "Carga horária: 60h", icone: "💻" },
    { nome: "Disciplina B", info: "Carga horária: 40h", icone: "📐" },
    { nome: "Disciplina C", info: "Carga horária: 80h", icone: "📊" },
    { nome: "Disciplina D", info: "Carga horária: 60h", icone: "🔬" },
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
