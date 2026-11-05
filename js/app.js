/**
 * ESTADO SIMULADO (Mock Data en arreglos JS)
 * Listo para ser reemplazado por llamadas fetch() a un Backend real.
 */
const state = {
  currentUser: null,
  currentQuestionIndex: 0,

  // Usuarios registrados y sus puntos para el Ranking
  users: [
    {
      id: 1,
      username: "alex_dev",
      name: "Alex Rivera",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
      bio: "Frontend Architect | Creando interfaces rápidas ⚡ | Fan de las trivias.",
      points: 1250
    },
    {
      id: 2,
      username: "sara_design",
      name: "Sara Méndez",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80",
      bio: "UI/UX Designer & Creadora de contenido digital.",
      points: 1420
    },
    {
      id: 3,
      username: "marco_tech",
      name: "Marco Polo",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80",
      bio: "Explorando el mundo del desarrollo web y el gaming.",
      points: 980
    },
    {
      id: 4,
      username: "valeria_code",
      name: "Valeria Gómez",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80",
      bio: "JavaScript, café y retos diarios.",
      points: 1150
    }
  ],

  // Publicaciones del Feed (Imágenes y Videos)
  posts: [
    {
      id: 101,
      userId: 2,
      type: "image",
      mediaUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=900&auto=format&fit=crop&q=80",
      caption: "Configurando mi nuevo entorno de desarrollo minimalista. ¿Prefieren tema oscuro o claro para programar? 💻✨",
      likes: 128,
      likedByMe: false,
      timestamp: "Hace 2 horas",
      comments: [
        { user: "alex_dev", text: "¡Tema oscuro siempre! Cuida la vista." },
        { user: "marco_tech", text: "Increíble setup, muy limpio." }
      ]
    },
    {
      id: 102,
      userId: 1,
      type: "video",
      // Video MP4 libre de derechos de W3C / Pexels
      mediaUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
      caption: "Probando el reproductor nativo de video en nuestra nueva red social. ¡No olvides pasar por la sección de Trivias para sumar puntos! 🎬🚀",
      likes: 245,
      likedByMe: true,
      timestamp: "Hace 5 horas",
      comments: [
        { user: "valeria_code", text: "Corre súper fluido en móvil." }
      ]
    },
    {
      id: 103,
      userId: 1,
      type: "image",
      mediaUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=900&auto=format&fit=crop&q=80",
      caption: "Preparando nuevas preguntas de arquitectura web para el ranking de esta semana. 🔥",
      likes: 89,
      likedByMe: false,
      timestamp: "Ayer",
      comments: []
    }
  ],

  // Banco de preguntas estilo Kahoot
  questions: [
    {
      question: "¿Qué método de un arreglo en JavaScript crea un nuevo arreglo con los resultados de aplicar una función a cada elemento?",
      options: ["Array.forEach()", "Array.map()", "Array.filter()", "Array.reduce()"],
      correctIndex: 1,
      points: 150
    },
    {
      question: "¿Qué propiedad de CSS Grid permite definir el espacio entre filas y columnas?",
      options: ["grid-spacing", "space-between", "gap", "margin-grid"],
      correctIndex: 2,
      points: 100
    },
    {
      question: "¿Cuál etiqueta semántica de HTML5 es ideal para agrupar enlaces principales de navegación?",
      options: ["<nav>", "<header>", "<aside>", "<menu>"],
      correctIndex: 0,
      points: 100
    },
    {
      question: "¿Cómo se declara una variable en JavaScript cuyo valor o referencia NO puede ser reasignado?",
      options: ["var", "let", "static", "const"],
      correctIndex: 3,
      points: 150
    }
  ]
};

// ================= SELECTORES DEL DOM =================
const loginScreen = document.getElementById("login-screen");
const appContainer = document.getElementById("app-container");
const loginForm = document.getElementById("login-form");
const logoutBtn = document.getElementById("logout-btn");
const navButtons = document.querySelectorAll(".nav-btn");
const views = document.querySelectorAll(".view");

// ================= 1. AUTENTICACIÓN SIMULADA =================
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const usernameInput = document.getElementById("username").value.trim().toLowerCase();

  // Buscar usuario existente o crear sesión con el usuario demo principal
  let foundUser = state.users.find(u => u.username.toLowerCase() === usernameInput);
  if (!foundUser) {
    foundUser = state.users[0];
    foundUser.username = usernameInput || "alex_dev";
  }

  state.currentUser = foundUser;
  initApp();
});

logoutBtn.addEventListener("click", () => {
  state.currentUser = null;
  appContainer.classList.add("hidden");
  loginScreen.classList.remove("hidden");
});

function initApp() {
  loginScreen.classList.add("hidden");
  appContainer.classList.remove("hidden");

  updateSidebarUserInfo();
  renderFeed();
  loadTriviaQuestion();
  renderRanking();
  renderProfile();
}

function updateSidebarUserInfo() {
  document.getElementById("nav-avatar").src = state.currentUser.avatar;
  document.getElementById("nav-username").textContent = `@${state.currentUser.username}`;
  document.getElementById("nav-points").textContent = `${state.currentUser.points} pts`;
  document.getElementById("trivia-user-score").textContent = state.currentUser.points;
}

// ================= 2. NAVEGACIÓN SPA =================
navButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const targetId = btn.getAttribute("data-target");

    navButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    views.forEach(v => {
      v.classList.toggle("active-view", v.id === targetId);
    });

    // Refrescar vistas dinámicas al entrar
    if (targetId === "ranking-view") renderRanking();
    if (targetId === "profile-view") renderProfile();
  });
});

// ================= 3. RENDERIZADO DEL FEED =================
function renderFeed() {
  const feedContainer = document.getElementById("feed-container");
  feedContainer.innerHTML = "";

  state.posts.forEach(post => {
    const author = state.users.find(u => u.id === post.userId);
    const card = document.createElement("article");
    card.className = "post-card";

    // Renderizar imagen o video según corresponda
    const mediaHTML = post.type === "video"
      ? `<video src="${post.mediaUrl}" controls loop preload="metadata"></video>`
      : `<img src="${post.mediaUrl}" alt="Post de ${author.username}" loading="lazy">`;

    // Renderizar lista de comentarios
    const commentsHTML = post.comments.map(c =>
      `<div class="comment-item"><strong>@${c.user}</strong>${c.text}</div>`
    ).join("");

    card.innerHTML = `
      <div class="post-header">
        <img src="${author.avatar}" alt="${author.username}" class="post-avatar">
        <div class="post-user-info">
          <strong>@${author.username}</strong>
          <span>${post.timestamp}</span>
        </div>
      </div>

      <div class="post-media-wrapper">
        ${mediaHTML}
      </div>

      <div class="post-body">
        <div class="post-actions">
          <button class="action-btn like-btn ${post.likedByMe ? 'liked' : ''}" data-id="${post.id}">
            <i class="${post.likedByMe ? 'ri-heart-3-fill' : 'ri-heart-3-line'}"></i>
            <span>${post.likes}</span>
          </button>
          <button class="action-btn">
            <i class="ri-chat-3-line"></i>
            <span>${post.comments.length}</span>
          </button>
        </div>

        <p class="post-caption"><strong>@${author.username}</strong> ${post.caption}</p>

        <div class="comments-section">
          <div class="comments-list">${commentsHTML}</div>
          <form class="comment-form" data-id="${post.id}">
            <input type="text" placeholder="Añade un comentario..." required>
            <button type="submit">Publicar</button>
          </form>
        </div>
      </div>
    `;

    feedContainer.appendChild(card);
  });

  attachFeedEvents();
}

function attachFeedEvents() {
  // Eventos de Likes
  document.querySelectorAll(".like-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const postId = Number(btn.getAttribute("data-id"));
      const post = state.posts.find(p => p.id === postId);

      post.likedByMe = !post.likedByMe;
      post.likes += post.likedByMe ? 1 : -1;
      renderFeed();
    });
  });

  // Eventos para agregar comentarios
  document.querySelectorAll(".comment-form").forEach(form => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const postId = Number(form.getAttribute("data-id"));
      const input = form.querySelector("input");
      const text = input.value.trim();

      if (!text) return;

      const post = state.posts.find(p => p.id === postId);
      post.comments.push({
        user: state.currentUser.username,
        text
      });

      renderFeed();
    });
  });
}

// ================= 4. MOTOR DE TRIVIAS (ESTILO KAHOOT) =================
const kahootColors = ["k-red", "k-blue", "k-yellow", "k-green"];
const kahootIcons = [
  "ri-triangle-fill",
  "ri-vip-diamond-fill",
  "ri-checkbox-blank-circle-fill",
  "ri-checkbox-blank-fill"
];

function loadTriviaQuestion() {
  const qIndex = state.currentQuestionIndex;
  const total = state.questions.length;
  const currentQ = state.questions[qIndex];

  // Actualizar cabeceras y barra de progreso
  document.getElementById("question-counter").textContent = `Pregunta ${qIndex + 1} de ${total}`;
  document.getElementById("question-points-badge").textContent = `+${currentQ.points} pts`;
  document.getElementById("quiz-progress").style.width = `${((qIndex + 1) / total) * 100}%`;
  document.getElementById("question-text").textContent = currentQ.question;

  // Ocultar mensaje de feedback previo
  document.getElementById("quiz-feedback").classList.add("hidden");

  // Construir botones estilo Kahoot
  const answersGrid = document.getElementById("answers-grid");
  answersGrid.innerHTML = "";

  currentQ.options.forEach((optionText, idx) => {
    const btn = document.createElement("button");
    btn.className = `kahoot-btn ${kahootColors[idx]}`;
    btn.innerHTML = `<i class="${kahootIcons[idx]}"></i> <span>${optionText}</span>`;

    btn.addEventListener("click", () => handleAnswerSelection(idx, currentQ));
    answersGrid.appendChild(btn);
  });
}

function handleAnswerSelection(selectedIndex, questionObj) {
  const allButtons = document.querySelectorAll(".kahoot-btn");
  const feedbackBox = document.getElementById("quiz-feedback");
  const feedbackMsg = document.getElementById("feedback-message");

  // Bloquear botones y resaltar la respuesta correcta
  allButtons.forEach((btn, idx) => {
    btn.disabled = true;
    if (idx === questionObj.correctIndex) {
      btn.classList.add("correct-choice");
    }
  });

  if (selectedIndex === questionObj.correctIndex) {
    state.currentUser.points += questionObj.points;
    feedbackMsg.textContent = `¡Correcto! Ganaste +${questionObj.points} puntos 🎉`;
    feedbackMsg.style.color = "#4ade80";
    updateSidebarUserInfo();
  } else {
    feedbackMsg.textContent = "Respuesta incorrecta. ¡Sigue intentando en la siguiente!";
    feedbackMsg.style.color = "#f87171";
  }

  feedbackBox.classList.remove("hidden");
}

document.getElementById("next-question-btn").addEventListener("click", () => {
  state.currentQuestionIndex = (state.currentQuestionIndex + 1) % state.questions.length;
  loadTriviaQuestion();
});

// ================= 5. RANKING DINÁMICO =================
function renderRanking() {
  const rankingList = document.getElementById("ranking-list");
  rankingList.innerHTML = "";

  // Ordenar usuarios de mayor a menor puntaje
  const sortedUsers = [...state.users].sort((a, b) => b.points - a.points);

  sortedUsers.forEach((user, index) => {
    const isMe = state.currentUser && user.id === state.currentUser.id;
    const medal = index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `#${index + 1}`;

    const row = document.createElement("div");
    row.className = `ranking-row ${isMe ? "current-user-row" : ""}`;
    row.innerHTML = `
      <span class="rank-pos">${medal}</span>
      <div class="rank-user">
        <img src="${user.avatar}" alt="${user.username}">
        <div>
          <strong>${user.name}</strong>
          <div style="font-size: 0.78rem; color: var(--text-muted);">@${user.username}</div>
        </div>
      </div>
      <span class="rank-points">${user.points} pts</span>
    `;
    rankingList.appendChild(row);
  });
}

// ================= 6. PERFIL DE USUARIO =================
function renderProfile() {
  const user = state.currentUser;
  const userPosts = state.posts.filter(p => p.userId === user.id);

  document.getElementById("profile-avatar").src = user.avatar;
  document.getElementById("profile-name").textContent = user.name;
  document.getElementById("profile-handle").textContent = `@${user.username}`;
  document.getElementById("profile-bio").textContent = user.bio;
  document.getElementById("stat-posts").textContent = userPosts.length;
  document.getElementById("stat-points").textContent = user.points;

  const grid = document.getElementById("profile-posts-grid");
  grid.innerHTML = "";

  userPosts.forEach(post => {
    const item = document.createElement("div");
    item.className = "grid-thumb";
    item.innerHTML = post.type === "video"
      ? `<video src="${post.mediaUrl}" muted></video>`
      : `<img src="${post.mediaUrl}" alt="Miniatura">`;
    grid.appendChild(item);
  });
}