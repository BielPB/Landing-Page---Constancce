document.documentElement.classList.add("js-ready");

const APP_URL = "https://www.constancceapp.com/";

function track(eventName, data = {}) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: eventName, ...data });
  if (typeof window.fbq === "function") {
    window.fbq("trackCustom", eventName, data);
  }
}

// Entrada suave: a página continua totalmente visível caso o JavaScript falhe.
const revealItems = document.querySelectorAll(".reveal");
revealItems.forEach((item) => {
  item.style.setProperty("--delay", `${Number(item.dataset.delay || 0)}ms`);
});

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -35px" }
  );
  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

// Quiz realmente personalizado: as três respostas influenciam o resultado.
const questions = [
  {
    title: "Qual área da sua vida mais precisa de organização hoje?",
    options: [
      ["Hábitos e rotina", "Começo bem, mas não consigo manter o ritmo.", "habitos"],
      ["Treinos e saúde", "Faço, mas não acompanho minha evolução como deveria.", "treinos"],
      ["Finanças", "Recebo, gasto e perco a visão do que está acontecendo.", "financas"],
      ["Metas e projetos", "Tenho objetivos, mas eles acabam ficando para depois.", "metas"],
      ["Tudo ao mesmo tempo", "Minha rotina está espalhada em lugares diferentes.", "centralizacao"]
    ]
  },
  {
    title: "O que normalmente faz você perder o ritmo?",
    options: [
      ["Esqueço o que preciso fazer", "Minha rotina depende demais da memória.", "memoria"],
      ["Uso ferramentas demais", "As informações ficam espalhadas.", "fragmentacao"],
      ["Não consigo ver resultado", "Sem progresso visível, perco a motivação.", "visibilidade"],
      ["Tento mudar tudo de uma vez", "A rotina fica pesada e difícil de sustentar.", "excesso"]
    ]
  },
  {
    title: "Você conseguiria mostrar como evoluiu nos últimos 30 dias?",
    options: [
      ["Sim, acompanho com clareza", "Tenho registros e consigo comparar.", "claro"],
      ["Mais ou menos", "Lembro de algumas coisas, mas falta uma visão completa.", "parcial"],
      ["Não com clareza", "Sei que fiz coisas, mas não consigo provar o avanço.", "baixo"],
      ["Sinceramente, não faço ideia", "Os dias passam sem deixar um histórico.", "nenhum"]
    ]
  }
];

const resultByArea = {
  habitos: {
    title: "Seu problema não parece ser começar. É continuar quando a motivação passa.",
    text: "Você já demonstra intenção de mudar, mas seus hábitos ainda dependem demais do impulso do momento.",
    action: "Transforme cada hábito concluído em um registro que incentive o próximo dia."
  },
  treinos: {
    title: "Você pode estar se esforçando sem conseguir enxergar a própria evolução.",
    text: "Treinar sem registrar cargas, exercícios e frequência torna difícil perceber o que realmente está melhorando.",
    action: "Centralize seus treinos e compare a execução ao longo das semanas."
  },
  financas: {
    title: "Sem visualizar o dinheiro, suas decisões ficam mais difíceis de controlar.",
    text: "Quando entradas, despesas e próximas contas não estão reunidas, é fácil perder a noção do conjunto.",
    action: "Registre as movimentações no momento em que acontecem e mantenha o saldo visível."
  },
  metas: {
    title: "A meta existe, mas ainda não foi transformada em um caminho visível.",
    text: "Objetivos que ficam apenas na cabeça disputam espaço com todas as urgências do dia.",
    action: "Divida cada meta em etapas e acompanhe o percentual que já foi construído."
  },
  centralizacao: {
    title: "Sua rotina está espalhada demais para você conseguir enxergar o todo.",
    text: "O problema não é falta de esforço. É tentar acompanhar áreas conectadas usando ferramentas que não conversam entre si.",
    action: "Reúna execução, registros e progresso em um único painel diário."
  }
};

const barrierText = {
  memoria: "Como tudo depende da memória, tarefas importantes desaparecem no meio das urgências.",
  fragmentacao: "O excesso de ferramentas cria atrito e faz você abandonar o acompanhamento.",
  visibilidade: "Sem uma resposta visual para o esforço, continuar parece mais difícil do que realmente é.",
  excesso: "Tentar mudar tudo de uma vez torna a rotina pesada antes que ela tenha tempo de se consolidar."
};

const visibilityText = {
  claro: "Você já possui o hábito de acompanhar e pode ganhar ainda mais clareza centralizando as áreas.",
  parcial: "Existem registros, mas ainda falta uma visão única que conecte as decisões do dia.",
  baixo: "Hoje, você não consegue demonstrar com clareza o quanto avançou no último mês.",
  nenhum: "Seus dias estão passando sem deixar um histórico confiável da pessoa que você está construindo."
};

let currentQuestion = 0;
let answers = [];

const quizIntro = document.getElementById("quizIntro");
const quizCard = document.getElementById("quizCard");
const quizResult = document.getElementById("quizResult");
const questionMount = document.getElementById("questionMount");
const quizCounter = document.getElementById("quizCounter");
const quizPercent = document.getElementById("quizPercent");
const quizProgress = document.getElementById("quizProgress");
const quizBack = document.getElementById("quizBack");

function focusQuizHeading() {
  const heading = document.querySelector(".question h3, #resultTitle");
  if (!heading) return;
  heading.setAttribute("tabindex", "-1");
  heading.focus({ preventScroll: true });
}

function renderQuestion() {
  const question = questions[currentQuestion];
  const percentage = Math.round(((currentQuestion + 1) / questions.length) * 100);
  quizCounter.textContent = `Pergunta ${currentQuestion + 1} de ${questions.length}`;
  quizPercent.textContent = `${percentage}%`;
  quizProgress.style.width = `${percentage}%`;
  quizBack.classList.toggle("hidden", currentQuestion === 0);

  questionMount.innerHTML = `
    <div class="question">
      <h3>${question.title}</h3>
      <div class="answers">
        ${question.options.map((option, index) => `
          <button class="answer" type="button" data-index="${index}">
            <span class="answer-index">${String.fromCharCode(65 + index)}</span>
            <span class="answer-copy">
              <strong>${option[0]}</strong>
              <small>${option[1]}</small>
            </span>
          </button>
        `).join("")}
      </div>
    </div>
  `;

  questionMount.querySelectorAll(".answer").forEach((button) => {
    button.addEventListener("click", () => selectAnswer(Number(button.dataset.index)));
  });
  focusQuizHeading();
}

function selectAnswer(index) {
  const selected = questions[currentQuestion].options[index];
  answers[currentQuestion] = { label: selected[0], value: selected[2] };
  track("quiz_answer", { question: currentQuestion + 1, answer: selected[2] });

  if (currentQuestion < questions.length - 1) {
    currentQuestion += 1;
    renderQuestion();
    return;
  }
  showResult();
}

function showResult() {
  const area = answers[0]?.value || "centralizacao";
  const barrier = answers[1]?.value || "fragmentacao";
  const visibility = answers[2]?.value || "parcial";
  const result = resultByArea[area];

  document.getElementById("resultTitle").textContent = result.title;
  document.getElementById("resultText").textContent = `${result.text} ${barrierText[barrier]} ${visibilityText[visibility]}`;
  document.getElementById("resultAction").textContent = result.action;

  quizCard.classList.add("hidden");
  quizResult.classList.remove("hidden");
  focusQuizHeading();
  track("quiz_complete", { primary_area: area, barrier, visibility });
}

function startQuiz() {
  currentQuestion = 0;
  answers = [];
  quizIntro.classList.add("hidden");
  quizResult.classList.add("hidden");
  quizCard.classList.remove("hidden");
  renderQuestion();
  track("quiz_start");
}

document.getElementById("startQuiz")?.addEventListener("click", startQuiz);
document.getElementById("restartQuiz")?.addEventListener("click", startQuiz);
quizBack?.addEventListener("click", () => {
  if (currentQuestion === 0) return;
  currentQuestion -= 1;
  renderQuestion();
});

// Tour das telas.
const tourTabs = Array.from(document.querySelectorAll(".tour-tab"));
const tourImage = document.getElementById("tourImage");
const tourStatus = document.getElementById("tourStatus");

function activateTourTab(tab) {
  if (!tab || tab.classList.contains("active")) return;
  tourTabs.forEach((item) => {
    const isActive = item === tab;
    item.classList.toggle("active", isActive);
    item.setAttribute("aria-selected", String(isActive));
  });

  const nextImage = new Image();
  nextImage.src = tab.dataset.image;
  tourImage.classList.add("switching");

  const applyImage = () => {
    tourImage.src = tab.dataset.image;
    tourImage.alt = tab.dataset.alt;
    tourStatus.textContent = tab.dataset.title;
    requestAnimationFrame(() => tourImage.classList.remove("switching"));
  };

  if (nextImage.complete) applyImage();
  else nextImage.addEventListener("load", applyImage, { once: true });
  track("feature_view", { feature: tab.dataset.title });
}

tourTabs.forEach((tab, index) => {
  tab.addEventListener("click", () => activateTourTab(tab));
  tab.addEventListener("keydown", (event) => {
    if (!['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft'].includes(event.key)) return;
    event.preventDefault();
    const direction = ['ArrowDown', 'ArrowRight'].includes(event.key) ? 1 : -1;
    const nextIndex = (index + direction + tourTabs.length) % tourTabs.length;
    tourTabs[nextIndex].focus();
    activateTourTab(tourTabs[nextIndex]);
  });
});

// Mantém apenas uma pergunta do FAQ aberta.
document.querySelectorAll(".faq details").forEach((item) => {
  item.addEventListener("toggle", () => {
    if (!item.open) return;
    document.querySelectorAll(".faq details").forEach((other) => {
      if (other !== item) other.open = false;
    });
    track("faq_open", { question: item.querySelector("summary")?.textContent || "" });
  });
});

// Identifica a origem de cada clique sem alterar o destino solicitado.
document.querySelectorAll(`a[href="${APP_URL}"]`).forEach((link) => {
  link.addEventListener("click", () => {
    track("app_cta_click", {
      label: link.textContent.trim().replace(/\s+/g, " "),
      section: link.closest("section")?.id || link.closest("section")?.className || "footer"
    });
  });
});

// Evita que o CTA fixo cubra o CTA final no celular.
const mobileSticky = document.getElementById("mobileSticky");
const finalSection = document.querySelector(".final-section");
if (mobileSticky && finalSection && "IntersectionObserver" in window) {
  const stickyObserver = new IntersectionObserver(([entry]) => {
    mobileSticky.style.opacity = entry.isIntersecting ? "0" : "1";
    mobileSticky.style.pointerEvents = entry.isIntersecting ? "none" : "auto";
  }, { threshold: 0.15 });
  stickyObserver.observe(finalSection);
}

window.CONSTANCCE_CONFIG = { appUrl: APP_URL };
