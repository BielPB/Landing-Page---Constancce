// =========================
// CONFIGURAÇÃO RÁPIDA
// =========================
// Coloque aqui o link real do checkout quando estiver pronto.
const CONSTANCCE_CONFIG = {
  checkoutUrl: "", // Ex.: "https://seu-checkout.com/constancce"
  vslEmbedUrl: "", // Ex.: URL de embed do YouTube/Vimeo/Panda
  metaPixelId: "", // Opcional
  gaMeasurementId: "" // Opcional
};

// =========================
// QUIZ
// =========================
const questions = [
  {
    title: "Qual área da sua vida parece mais desorganizada hoje?",
    options: [
      ["Hábitos e rotina", "Começo bem, mas não consigo manter constância.", "habitos"],
      ["Treinos", "Treino, mas não acompanho minha evolução como deveria.", "treinos"],
      ["Finanças", "Recebo, gasto e nem sempre sei exatamente para onde o dinheiro foi.", "financas"],
      ["Metas", "Tenho objetivos, mas acabo deixando muitos de lado.", "metas"],
      ["Tudo ao mesmo tempo", "Parece que estou tentando organizar minha vida inteira em lugares diferentes.", "centralizacao"]
    ]
  },
  {
    title: "Quantas vezes você já começou algo motivado e abandonou poucos dias depois?",
    options: [
      ["Quase nunca", "", "baixo"],
      ["Algumas vezes", "", "medio"],
      ["Muitas vezes", "", "alto"],
      ["Já perdi as contas", "", "muito_alto"]
    ]
  },
  {
    title: "Se alguém perguntasse o quanto você evoluiu nos últimos 30 dias, conseguiria mostrar?",
    options: [
      ["Sim. Acompanho praticamente tudo.", "", "claro"],
      ["Mais ou menos.", "", "parcial"],
      ["Não com clareza.", "", "baixo"],
      ["Sinceramente? Não faço ideia.", "", "nenhum"]
    ]
  },
  {
    title: "O que mais ajudaria você a ter constância?",
    options: [
      ["Enxergar minha evolução", "", "progresso"],
      ["Ter uma rotina mais organizada", "", "rotina"],
      ["Acompanhar meus hábitos diariamente", "", "habitos"],
      ["Controlar melhor minhas metas", "", "metas"],
      ["Ter tudo em um único lugar", "", "centralizacao"]
    ]
  },
  {
    title: "Imagine abrir um único aplicativo e visualizar rotina, hábitos, treinos, dinheiro, metas e progresso. Isso faria diferença?",
    options: [
      ["Sim, muita.", "", "sim"],
      ["Provavelmente.", "", "provavelmente"],
      ["Quero entender como funciona.", "", "curioso"]
    ]
  }
];

let currentQuestion = 0;
let answers = [];

const intro = document.getElementById("quizIntro");
const quizCard = document.getElementById("quizCard");
const result = document.getElementById("quizResult");
const mount = document.getElementById("questionMount");
const counter = document.getElementById("quizCounter");
const percent = document.getElementById("quizPercent");
const progress = document.getElementById("quizProgress");
const backBtn = document.getElementById("quizBack");
const landing = document.getElementById("landingContent");
const mobileSticky = document.getElementById("mobileSticky");

function track(eventName, data = {}) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({event: eventName, ...data});
  if (typeof window.fbq === "function") window.fbq("trackCustom", eventName, data);
}

function renderQuestion() {
  const q = questions[currentQuestion];
  const pct = Math.round(((currentQuestion + 1) / questions.length) * 100);

  counter.textContent = `Pergunta ${currentQuestion + 1} de ${questions.length}`;
  percent.textContent = `${pct}%`;
  progress.style.width = `${pct}%`;
  backBtn.classList.toggle("hidden", currentQuestion === 0);

  mount.innerHTML = `
    <div class="question">
      <h2>${q.title}</h2>
      <div class="answers">
        ${q.options.map((opt, i) => `
          <button class="answer" data-index="${i}">
            <span class="answer-index">${String.fromCharCode(65+i)}</span>
            <span class="answer-copy">
              <strong>${opt[0]}</strong>
              ${opt[1] ? `<small>${opt[1]}</small>` : ""}
            </span>
          </button>
        `).join("")}
      </div>
    </div>
  `;

  mount.querySelectorAll(".answer").forEach(btn => {
    btn.addEventListener("click", () => selectAnswer(Number(btn.dataset.index)));
  });
}

function selectAnswer(index) {
  const selected = questions[currentQuestion].options[index];
  answers[currentQuestion] = {
    label: selected[0],
    value: selected[2]
  };

  track("quiz_answer", {
    question: currentQuestion + 1,
    answer: selected[2]
  });

  if (currentQuestion < questions.length - 1) {
    currentQuestion++;
    renderQuestion();
  } else {
    showResult();
  }
}

function showResult() {
  quizCard.classList.add("hidden");
  result.classList.remove("hidden");

  const area = answers[0]?.value;
  const consistency = answers[1]?.value;
  const visibility = answers[2]?.value;

  const areaText = {
    habitos: "Sua rotina parece depender demais da motivação do momento.",
    treinos: "Você até executa, mas falta um histórico simples que mostre se está avançando.",
    financas: "Sem registrar o dinheiro, suas decisões ficam difíceis de enxergar no longo prazo.",
    metas: "Objetivos sem acompanhamento tendem a virar apenas boas intenções.",
    centralizacao: "O excesso de ferramentas pode estar fragmentando sua visão da própria evolução."
  };

  const intensity = ["alto","muito_alto"].includes(consistency)
    ? " E como você já viveu vários ciclos de começar e parar, reduzir a dependência da motivação é especialmente importante."
    : "";

  const visibilityText = ["baixo","nenhum"].includes(visibility)
    ? " Hoje, o maior sinal é que você não consegue provar com clareza o quanto avançou nos últimos 30 dias."
    : "";

  document.getElementById("resultText").textContent =
    `${areaText[area] || "O seu principal desafio parece ser transformar intenção em acompanhamento."}${intensity}${visibilityText} O Constancce foi pensado para centralizar execução e progresso em um único lugar.`;

  track("quiz_complete", {
    primary_area: area || "indefinido"
  });
}

document.getElementById("startQuiz").addEventListener("click", () => {
  intro.classList.add("hidden");
  quizCard.classList.remove("hidden");
  currentQuestion = 0;
  answers = [];
  renderQuestion();
  track("quiz_start");
});

backBtn.addEventListener("click", () => {
  if (currentQuestion > 0) {
    currentQuestion--;
    renderQuestion();
  }
});

document.getElementById("unlockPage").addEventListener("click", () => {
  landing.classList.remove("is-locked");
  landing.setAttribute("aria-hidden", "false");
  document.body.classList.remove("quiz-open");
  document.getElementById("vsl").scrollIntoView({behavior:"smooth"});
  if (window.innerWidth <= 640) mobileSticky.classList.remove("hidden");
  track("landing_unlocked");
});

// Mantém a experiência de triagem como primeira etapa.
document.body.classList.add("quiz-open");

// =========================
// VSL
// =========================
function injectVsl() {
  if (!CONSTANCCE_CONFIG.vslEmbedUrl) return;

  const frame = document.getElementById("videoFrame");
  frame.innerHTML = `
    <iframe
      src="${CONSTANCCE_CONFIG.vslEmbedUrl}"
      title="VSL Constancce"
      loading="lazy"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen>
    </iframe>`;
}

document.getElementById("playVsl").addEventListener("click", () => {
  if (!CONSTANCCE_CONFIG.vslEmbedUrl) {
    alert("Adicione a URL da sua VSL no arquivo script.js, em CONSTANCCE_CONFIG.vslEmbedUrl.");
  } else {
    injectVsl();
  }
  track("vsl_play");
});

// =========================
// CHECKOUT
// =========================
document.querySelectorAll(".js-checkout").forEach(link => {
  link.addEventListener("click", e => {
    if (CONSTANCCE_CONFIG.checkoutUrl) {
      e.preventDefault();
      track("checkout_click", {price: 37.90});
      window.location.href = CONSTANCCE_CONFIG.checkoutUrl;
    } else if (link.getAttribute("href") === "#") {
      e.preventDefault();
      document.getElementById("oferta").scrollIntoView({behavior:"smooth"});
      console.info("Constancce: adicione o link real em CONSTANCCE_CONFIG.checkoutUrl.");
    }
  });
});

// =========================
// UX
// =========================
window.addEventListener("scroll", () => {
  document.getElementById("topbar").classList.toggle("scrolled", window.scrollY > 16);
});

// Fecha outros FAQs para manter leitura limpa.
document.querySelectorAll(".faq details").forEach(item => {
  item.addEventListener("toggle", () => {
    if (item.open) {
      document.querySelectorAll(".faq details").forEach(other => {
        if (other !== item) other.open = false;
      });
    }
  });
});

// =========================
// PLACEHOLDERS DE ANALYTICS
// =========================
// Para Meta Pixel e Google Analytics, cole os scripts oficiais no <head> do index.html
// e preencha os IDs em CONSTANCCE_CONFIG se quiser centralizar sua configuração.

// Exposição para inspeção no console.
window.CONSTANCCE_CONFIG = CONSTANCCE_CONFIG;
