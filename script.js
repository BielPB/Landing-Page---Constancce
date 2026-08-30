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
    (entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle("is-visible", entry.isIntersecting);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -35px" }
  );
  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

// Coreografia tipográfica: preserva ênfases e quebras de linha enquanto anima palavra por palavra.
const animatedHeadings = document.querySelectorAll(
  ".hero-copy h1, .section-heading h2, .problem-copy h2, .pro-head h2, .audience-card h2, .final-section h2, .final-section h3, .journey-question h3"
);

function wrapHeadingWords(element) {
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
  const textNodes = [];
  let node;

  while ((node = walker.nextNode())) {
    if (node.textContent.trim()) textNodes.push(node);
  }

  let wordIndex = 0;
  textNodes.forEach((textNode) => {
    const fragment = document.createDocumentFragment();
    textNode.textContent.split(/(\s+)/).forEach((part) => {
      if (!part) return;
      if (/^\s+$/.test(part)) {
        fragment.append(part);
        return;
      }

      const word = document.createElement("span");
      word.className = "word";
      word.style.setProperty("--word-index", wordIndex);
      word.textContent = part;
      fragment.append(word);
      wordIndex += 1;
    });
    textNode.replaceWith(fragment);
  });

  element.classList.add("text-animate");
}

animatedHeadings.forEach(wrapHeadingWords);

if ("IntersectionObserver" in window) {
  const textObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle("text-in", entry.isIntersecting);
      });
    },
    { threshold: 0.35, rootMargin: "0px 0px -8%" }
  );
  animatedHeadings.forEach((heading) => textObserver.observe(heading));
} else {
  animatedHeadings.forEach((heading) => heading.classList.add("text-in"));
}

// Barra de progresso e deslocamento sutil do mockup principal.
const scrollProgress = document.getElementById("scrollProgress");
const heroVisual = document.querySelector(".hero-visual");
let scrollFrame = 0;

function updateScrollEffects() {
  const scrollable = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
  const progress = Math.min(Math.max(window.scrollY / scrollable, 0), 1);
  scrollProgress?.style.setProperty("--scroll-progress", progress.toFixed(4));

  if (heroVisual) {
    const heroOffset = Math.min(window.scrollY * 0.04, 20);
    heroVisual.style.setProperty("--parallax-y", `${heroOffset}px`);
  }
  scrollFrame = 0;
}

function requestScrollEffects() {
  if (scrollFrame) return;
  scrollFrame = requestAnimationFrame(updateScrollEffects);
}

window.addEventListener("scroll", requestScrollEffects, { passive: true });
window.addEventListener("resize", requestScrollEffects, { passive: true });
updateScrollEffects();

// Indicador editorial de seção e gatilhos visuais da seção em foco.
const signatureSections = Array.from(document.querySelectorAll("section[data-section]"));
const sectionIndicator = document.getElementById("sectionIndicator");
const sectionIndex = document.getElementById("sectionIndex");
const sectionName = document.getElementById("sectionName");
const sectionVisibility = new Map();

function setActiveSection(section) {
  if (!section) return;
  signatureSections.forEach((item) => item.classList.toggle("section-active", item === section));
  const [index, name] = section.dataset.section.split("/").map((part) => part.trim());
  if (sectionIndex) sectionIndex.textContent = index;
  if (sectionName) sectionName.textContent = name;
}

if (signatureSections.length && "IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        sectionVisibility.set(entry.target, entry.isIntersecting ? entry.intersectionRatio : 0);
      });

      const activeSection = signatureSections.reduce((best, section) => {
        return (sectionVisibility.get(section) || 0) > (sectionVisibility.get(best) || 0) ? section : best;
      }, signatureSections[0]);
      setActiveSection(activeSection);
    },
    { threshold: [0.12, 0.25, 0.4, 0.6], rootMargin: "-18% 0px -42%" }
  );
  signatureSections.forEach((section) => sectionObserver.observe(section));
}

function updateSectionIndicator() {
  sectionIndicator?.classList.toggle("visible", window.scrollY > Math.min(window.innerHeight * 0.65, 620));
}
window.addEventListener("scroll", updateSectionIndicator, { passive: true });
updateSectionIndicator();

// Interações de profundidade ficam restritas a ponteiros precisos e respeitam movimento reduzido.
const finePointer = window.matchMedia("(pointer: fine)");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

if (finePointer.matches && !reducedMotion.matches) {
  const cursorAura = document.getElementById("cursorAura");
  let pointerFrame = 0;
  let pointerX = -600;
  let pointerY = -600;

  window.addEventListener("pointermove", (event) => {
    pointerX = event.clientX;
    pointerY = event.clientY;
    document.body.classList.add("has-pointer");
    if (pointerFrame) return;
    pointerFrame = requestAnimationFrame(() => {
      cursorAura?.style.setProperty("--cursor-x", `${pointerX}px`);
      cursorAura?.style.setProperty("--cursor-y", `${pointerY}px`);
      pointerFrame = 0;
    });
  }, { passive: true });

  document.documentElement.addEventListener("mouseleave", () => {
    document.body.classList.remove("has-pointer");
  });

  if (heroVisual) {
    heroVisual.addEventListener("pointermove", (event) => {
      const rect = heroVisual.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      heroVisual.style.setProperty("--tilt-x", `${(x - 0.5) * 6}deg`);
      heroVisual.style.setProperty("--tilt-y", `${(0.5 - y) * 5}deg`);
      heroVisual.style.setProperty("--parallax-x", `${(x - 0.5) * 10}px`);
    });
    heroVisual.addEventListener("pointerleave", () => {
      heroVisual.style.setProperty("--tilt-x", "0deg");
      heroVisual.style.setProperty("--tilt-y", "0deg");
      heroVisual.style.setProperty("--parallax-x", "0px");
    });
  }

  document.querySelectorAll(".daily-card, .plan-card, .audience-card, .chaos-card").forEach((card) => {
    card.classList.add("tilt-card");
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      card.style.setProperty("--card-rx", `${(0.5 - y) * 4}deg`);
      card.style.setProperty("--card-ry", `${(x - 0.5) * 5}deg`);
      card.style.setProperty("--mx", `${x * 100}%`);
      card.style.setProperty("--my", `${y * 100}%`);
    });
    card.addEventListener("pointerleave", () => {
      card.style.setProperty("--card-rx", "0deg");
      card.style.setProperty("--card-ry", "0deg");
      card.style.setProperty("--mx", "50%");
      card.style.setProperty("--my", "50%");
    });
  });

  document.querySelectorAll(".btn").forEach((button) => {
    button.addEventListener("pointermove", (event) => {
      const rect = button.getBoundingClientRect();
      const x = event.clientX - (rect.left + rect.width / 2);
      const y = event.clientY - (rect.top + rect.height / 2);
      button.style.setProperty("--magnet-x", `${x * 0.08}px`);
      button.style.setProperty("--magnet-y", `${y * 0.08}px`);
    });
    button.addEventListener("pointerleave", () => {
      button.style.setProperty("--magnet-x", "0px");
      button.style.setProperty("--magnet-y", "0px");
    });
  });
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
  if (finePointer.matches && !reducedMotion.matches) {
    tab.addEventListener("mouseenter", () => activateTourTab(tab));
  }
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
