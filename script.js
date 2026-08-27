// =========================
// CONFIGURAÇÃO RÁPIDA
// =========================
const CONSTANCCE_CONFIG = {
  // Planos
  basicUrl: "",       // URL para cadastro/acesso gratuito BASIC
  proCheckoutUrl: "", // URL do checkout PRO

  // VSL
  // Opções: "html5" para MP4/WebM direto ou "youtube" para YouTube.
  vslProvider: "html5",
  vslUrl: "",          // Ex.: "assets/vsl.mp4"
  youtubeVideoId: "",  // Ex.: "dQw4w9WgXcQ"
  unlockAt: 0.70,       // 70% assistido

  // Ative SOMENTE localmente se quiser testar o desbloqueio sem VSL.
  devMode: false,

  metaPixelId: "",
  gaMeasurementId: ""
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
let vslUnlocked = localStorage.getItem("constancce_vsl_unlocked") === "1";

const intro = document.getElementById("quizIntro");
const quizCard = document.getElementById("quizCard");
const result = document.getElementById("quizResult");
const mount = document.getElementById("questionMount");
const counter = document.getElementById("quizCounter");
const percent = document.getElementById("quizPercent");
const progress = document.getElementById("quizProgress");
const backBtn = document.getElementById("quizBack");
const landing = document.getElementById("landingContent");
const postVslContent = document.getElementById("postVslContent");
const siteFooter = document.getElementById("siteFooter");
const mobileSticky = document.getElementById("mobileSticky");
const vslGateStatus = document.getElementById("vslGateStatus");
const vslGateTitle = document.getElementById("vslGateTitle");
const vslGateHint = document.getElementById("vslGateHint");

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
    </div>`;

  mount.querySelectorAll(".answer").forEach(btn => {
    btn.addEventListener("click", () => selectAnswer(Number(btn.dataset.index)));
  });
}

function selectAnswer(index) {
  const selected = questions[currentQuestion].options[index];
  answers[currentQuestion] = {label: selected[0], value: selected[2]};
  track("quiz_answer", {question: currentQuestion + 1, answer: selected[2]});
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
    ? " E como você já viveu vários ciclos de começar e parar, reduzir a dependência da motivação é especialmente importante." : "";
  const visibilityText = ["baixo","nenhum"].includes(visibility)
    ? " Hoje, o maior sinal é que você não consegue provar com clareza o quanto avançou nos últimos 30 dias." : "";
  document.getElementById("resultText").textContent =
    `${areaText[area] || "O seu principal desafio parece ser transformar intenção em acompanhamento."}${intensity}${visibilityText} O Constancce foi pensado para centralizar execução e progresso em um único lugar.`;
  track("quiz_complete", {primary_area: area || "indefinido"});
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
  if (currentQuestion > 0) { currentQuestion--; renderQuestion(); }
});

document.getElementById("unlockPage").addEventListener("click", () => {
  landing.classList.remove("is-locked");
  landing.setAttribute("aria-hidden", "false");
  document.body.classList.remove("quiz-open");
  document.getElementById("vsl").scrollIntoView({behavior:"smooth"});

  // Se o usuário já desbloqueou a VSL anteriormente, mantém a liberação.
  if (vslUnlocked) unlockPostVsl(false);
  track("landing_vsl_revealed");
});

document.body.classList.add("quiz-open");

// =========================
// VSL GATE — 70% ASSISTIDO
// =========================
function updateVslProgress(value) {
  // O progresso continua sendo calculado internamente para liberar a página,
  // mas nenhuma porcentagem, tempo restante ou barra é exibida ao usuário.
  return Math.max(0, Math.min(1, value));
}

function unlockPostVsl(persist = true) {
  if (vslUnlocked && !postVslContent.classList.contains("is-vsl-locked")) return;
  vslUnlocked = true;
  if (persist) localStorage.setItem("constancce_vsl_unlocked", "1");

  postVslContent.classList.remove("is-vsl-locked");
  postVslContent.setAttribute("aria-hidden", "false");
  siteFooter.classList.remove("is-vsl-locked");
  siteFooter.setAttribute("aria-hidden", "false");

  vslGateStatus.classList.add("unlocked");
  vslGateTitle.textContent = "Pronto. A próxima parte foi liberada para você.";
  vslGateHint.textContent = "Continue abaixo para conhecer os recursos e escolher entre BASIC e PRO.";

  if (window.innerWidth <= 640) mobileSticky.classList.remove("hidden");
  track("vsl_70_percent", {unlock_at: CONSTANCCE_CONFIG.unlockAt});
}

function sumPlayedRanges(video) {
  let total = 0;
  for (let i = 0; i < video.played.length; i++) {
    total += video.played.end(i) - video.played.start(i);
  }
  return total;
}

function mountHtml5Vsl() {
  const frame = document.getElementById("videoFrame");

  frame.innerHTML = `
    <video id="constancceVsl" playsinline preload="metadata" controlsList="nodownload noplaybackrate nofullscreen">
      <source src="${CONSTANCCE_CONFIG.vslUrl}">
    </video>

    <div class="vsl-video-controls" id="vslCustomControls">
      <button type="button" class="vsl-control-main" id="vslPlayPause" aria-label="Pausar vídeo">❚❚</button>

      <div class="vsl-control-actions">
        <button type="button" class="vsl-control-icon" id="vslMute" aria-label="Ativar ou desativar áudio">🔊</button>
        <button type="button" class="vsl-control-icon" id="vslFullscreen" aria-label="Tela cheia">⛶</button>
      </div>
    </div>
  `;

  const video = document.getElementById("constancceVsl");
  const playPause = document.getElementById("vslPlayPause");
  const muteBtn = document.getElementById("vslMute");
  const fullscreenBtn = document.getElementById("vslFullscreen");

  let milestone25 = false;
  let milestone50 = false;

  const syncPlayButton = () => {
    playPause.textContent = video.paused ? "▶" : "❚❚";
    playPause.setAttribute("aria-label", video.paused ? "Reproduzir vídeo" : "Pausar vídeo");
  };

  const togglePlay = () => {
    if (video.paused) video.play().catch(() => {});
    else video.pause();
  };

  playPause.addEventListener("click", togglePlay);
  video.addEventListener("click", togglePlay);

  muteBtn.addEventListener("click", () => {
    video.muted = !video.muted;
    muteBtn.textContent = video.muted ? "🔇" : "🔊";
  });

  fullscreenBtn.addEventListener("click", async () => {
    try {
      if (!document.fullscreenElement) await frame.requestFullscreen();
      else await document.exitFullscreen();
    } catch (_) {}
  });

  video.addEventListener("play", () => {
    syncPlayButton();
    track("vsl_play", {provider:"html5"});
  }, {once:true});

  video.addEventListener("pause", syncPlayButton);

  video.addEventListener("timeupdate", () => {
    if (!video.duration || !isFinite(video.duration)) return;

    const watched = sumPlayedRanges(video);
    const ratio = Math.min(1, watched / video.duration);

    // Contagem invisível: usada apenas pela regra de desbloqueio.
    updateVslProgress(ratio);

    if (!milestone25 && ratio >= .25) {
      milestone25 = true;
      track("vsl_25_percent");
    }

    if (!milestone50 && ratio >= .50) {
      milestone50 = true;
      track("vsl_50_percent");
    }

    if (!vslUnlocked && ratio >= CONSTANCCE_CONFIG.unlockAt) {
      unlockPostVsl();
    }
  });

  // O primeiro clique no placeholder já inicia a VSL.
  video.play().catch(() => {
    syncPlayButton();
  });
}

let ytPlayer = null;
let ytTimer = null;
let ytFurthest = 0;

function mountYouTubeVsl() {
  const frame = document.getElementById("videoFrame");

  frame.innerHTML = `
    <div id="youtubeVslPlayer"></div>

    <div class="vsl-video-controls youtube-controls" id="vslYoutubeControls">
      <button type="button" class="vsl-control-main" id="ytPlayPause" aria-label="Reproduzir ou pausar vídeo">❚❚</button>

      <div class="vsl-control-actions">
        <button type="button" class="vsl-control-icon" id="ytMute" aria-label="Ativar ou desativar áudio">🔊</button>
        <button type="button" class="vsl-control-icon" id="ytFullscreen" aria-label="Tela cheia">⛶</button>
      </div>
    </div>
  `;

  const createPlayer = () => {
    ytPlayer = new YT.Player("youtubeVslPlayer", {
      videoId: CONSTANCCE_CONFIG.youtubeVideoId,
      playerVars: {
        rel: 0,
        modestbranding: 1,
        playsinline: 1,
        controls: 0,
        disablekb: 1,
        fs: 0
      },
      events: {
        onReady: event => {
          const playPause = document.getElementById("ytPlayPause");
          const muteBtn = document.getElementById("ytMute");
          const fullscreenBtn = document.getElementById("ytFullscreen");

          playPause.addEventListener("click", () => {
            const state = ytPlayer.getPlayerState();
            if (state === YT.PlayerState.PLAYING) ytPlayer.pauseVideo();
            else ytPlayer.playVideo();
          });

          muteBtn.addEventListener("click", () => {
            if (ytPlayer.isMuted()) {
              ytPlayer.unMute();
              muteBtn.textContent = "🔊";
            } else {
              ytPlayer.mute();
              muteBtn.textContent = "🔇";
            }
          });

          fullscreenBtn.addEventListener("click", async () => {
            try {
              if (!document.fullscreenElement) await frame.requestFullscreen();
              else await document.exitFullscreen();
            } catch (_) {}
          });

          // Tenta iniciar a partir do clique que abriu a VSL.
          event.target.playVideo();
        },

        onStateChange: event => {
          const playPause = document.getElementById("ytPlayPause");

          if (playPause) {
            playPause.textContent = event.data === YT.PlayerState.PLAYING ? "❚❚" : "▶";
          }

          if (event.data === YT.PlayerState.PLAYING) {
            track("vsl_play", {provider:"youtube"});

            if (!ytTimer) {
              ytTimer = setInterval(() => {
                const duration = ytPlayer.getDuration();
                const current = ytPlayer.getCurrentTime();
                if (!duration) return;

                // Impede saltos artificiais e mantém a regra de 70% real.
                if (current > ytFurthest + 4) {
                  ytPlayer.seekTo(ytFurthest, true);
                  return;
                }

                ytFurthest = Math.max(ytFurthest, current);
                const ratio = Math.min(1, ytFurthest / duration);

                // Progresso calculado silenciosamente.
                updateVslProgress(ratio);

                if (!vslUnlocked && ratio >= CONSTANCCE_CONFIG.unlockAt) {
                  unlockPostVsl();
                }
              }, 1000);
            }
          }
        }
      }
    });
  };

  window.onYouTubeIframeAPIReady = createPlayer;

  if (!window.YT || !window.YT.Player) {
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(tag);
  } else {
    createPlayer();
  }
}

function startVsl() {
  if (CONSTANCCE_CONFIG.vslProvider === "youtube") {
    if (!CONSTANCCE_CONFIG.youtubeVideoId) {
      alert("Adicione o ID do vídeo do YouTube em CONSTANCCE_CONFIG.youtubeVideoId.");
      return;
    }
    mountYouTubeVsl();
  } else {
    if (!CONSTANCCE_CONFIG.vslUrl) {
      alert("Adicione o arquivo/URL da VSL em CONSTANCCE_CONFIG.vslUrl.");
      return;
    }
    mountHtml5Vsl();
  }
}

document.getElementById("playVsl").addEventListener("click", startVsl);

if (CONSTANCCE_CONFIG.devMode) {
  const btn = document.createElement("button");
  btn.className = "dev-unlock";
  btn.textContent = "DEV: simular 70% assistido";
  btn.addEventListener("click", () => unlockPostVsl(false));
  vslGateStatus.appendChild(btn);
}

// =========================
// PLANOS
// =========================
document.querySelectorAll(".js-basic").forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    track("basic_plan_click");
    if (CONSTANCCE_CONFIG.basicUrl) {
      window.location.href = CONSTANCCE_CONFIG.basicUrl;
    } else {
      alert("Adicione a URL de cadastro do plano BASIC em CONSTANCCE_CONFIG.basicUrl.");
    }
  });
});

document.querySelectorAll(".js-checkout").forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    track("pro_checkout_click", {price:37.90});
    if (CONSTANCCE_CONFIG.proCheckoutUrl) {
      window.location.href = CONSTANCCE_CONFIG.proCheckoutUrl;
    } else {
      alert("Adicione o checkout PRO em CONSTANCCE_CONFIG.proCheckoutUrl.");
    }
  });
});

document.querySelectorAll(".js-plans").forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    if (!vslUnlocked) {
      document.getElementById("vsl").scrollIntoView({behavior:"smooth"});
      return;
    }
    document.getElementById("planos").scrollIntoView({behavior:"smooth"});
  });
});

// =========================
// FAQ
// =========================
document.querySelectorAll(".faq details").forEach(item => {
  item.addEventListener("toggle", () => {
    if (item.open) {
      document.querySelectorAll(".faq details").forEach(other => {
        if (other !== item) other.open = false;
      });
    }
  });
});

window.CONSTANCCE_CONFIG = CONSTANCCE_CONFIG;
