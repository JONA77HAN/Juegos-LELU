// Base de datos de preguntas Anime (Naruto Canon, DBZ, Bleach, One Piece)
const QUESTIONS_DATABASE = [
  // --- FÁCILES (10 PTS) ---
  {
    anime: "Dragon Ball Z",
    badgeClass: "bg-amber-950/80 border-amber-500 text-amber-300",
    difficulty: "Fácil",
    points: 10,
    question: "¿Cómo se llama la técnica insignia de Goku aprendida con el Maestro Roshi?",
    options: ["Kamehameha", "Masenko", "Makankosappo", "Kienzan", "Big Bang Attack"],
    correct: 0
  },
  {
    anime: "Naruto",
    badgeClass: "bg-orange-950/80 border-orange-500 text-orange-300",
    difficulty: "Fácil",
    points: 10,
    question: "¿Quién es el maestro y líder del Equipo 7 original formado por Naruto, Sasuke y Sakura?",
    options: ["Iruka Umino", "Kakashi Hatake", "Jiraiya", "Might Guy", "Yamato"],
    correct: 1
  },
  {
    anime: "One Piece",
    badgeClass: "bg-red-950/80 border-red-500 text-red-300",
    difficulty: "Fácil",
    points: 10,
    question: "¿Cuál es el sueño principal de Monkey D. Luffy?",
    options: ["Ser el mejor espadachín", "Ser el Rey de los Piratas", "Encontrar el All Blue", "Dibujar el mapa del mundo", "Destruir la Marina"],
    correct: 1
  },
  {
    anime: "Bleach",
    badgeClass: "bg-cyan-950/80 border-cyan-500 text-cyan-300",
    difficulty: "Fácil",
    points: 10,
    question: "¿Cómo se llama la espada principal de Ichigo Kurosaki?",
    options: ["Senbonzakura", "Hyorinmaru", "Zangetsu", "Kyoka Suigetsu", "Wabisuke"],
    correct: 2
  },
  {
    anime: "Dragon Ball Z",
    badgeClass: "bg-amber-950/80 border-amber-500 text-amber-300",
    difficulty: "Fácil",
    points: 10,
    question: "¿En qué planeta nació originalmente Son Goku (Kakarotto)?",
    options: ["Planeta Namek", "Planeta Vegeta", "Planeta Kaioshin", "Planeta Yardrat", "Planeta Tierra"],
    correct: 1
  },

  // --- MEDIAS (15 PTS) ---
  {
    anime: "Naruto Shippuden",
    badgeClass: "bg-orange-950/80 border-orange-500 text-orange-300",
    difficulty: "Media",
    points: 15,
    question: "¿Cuál de estos personajes NUNCA perteneció a la organización Akatsuki en la historia canon?",
    options: ["Itachi Uchiha", "Sasori", "Kisame Hoshigaki", "Zabuza Momochi", "Deidara"],
    correct: 3
  },
  {
    anime: "Dragon Ball Z",
    badgeClass: "bg-amber-950/80 border-amber-500 text-amber-300",
    difficulty: "Media",
    points: 15,
    question: "¿Quién destruye por completo a Cell Perfecto usando un Kamehameha Padre e Hijo?",
    options: ["Vegeta", "Goku", "Gohan", "Trunks del Futuro", "Piccolo"],
    correct: 2
  },
  {
    anime: "One Piece",
    badgeClass: "bg-red-950/80 border-red-500 text-red-300",
    difficulty: "Media",
    points: 15,
    question: "¿Cuál es el tipo de Fruta del Diablo (Akuma no Mi) que consumió originalmente Luffy?",
    options: ["Logia", "Zoan", "Paramecia", "Zoan Mitológica", "SMILE Artificial"],
    correct: 2
  },
  {
    anime: "Bleach",
    badgeClass: "bg-cyan-950/80 border-cyan-500 text-cyan-300",
    difficulty: "Media",
    points: 15,
    question: "¿Cómo se llama la segunda liberación definitiva de las espadas de los Capitanes Shinigami?",
    options: ["Shikai", "Bankai", "Resurrección", "Volstandig", "Saigo no Getsuga"],
    correct: 1
  },
  {
    anime: "Naruto Shippuden",
    badgeClass: "bg-orange-950/80 border-orange-500 text-orange-300",
    difficulty: "Media",
    points: 15,
    question: "¿Cuál es el nombre del Bijuu (Bestia con Cola) sellado dentro de Gaara?",
    options: ["Shukaku (1 Cola)", "Matatabi (2 Colas)", "Isobu (3 Colas)", "Kurama (9 Colas)", "Gyuki (8 Colas)"],
    correct: 0
  },

  // --- DIFÍCILES (20 PTS) ---
  {
    anime: "Naruto Shippuden",
    badgeClass: "bg-orange-950/80 border-orange-500 text-orange-300",
    difficulty: "Difícil",
    points: 20,
    question: "¿Cuál es el verdadero nombre del legendario Sabio de los Seis Caminos (Rikudo Sennin)?",
    options: ["Asura Otsutsuki", "Indra Otsutsuki", "Hagoromo Otsutsuki", "Hamura Otsutsuki", "Madara Uchiha"],
    correct: 2
  },
  {
    anime: "One Piece",
    badgeClass: "bg-red-950/80 border-red-500 text-red-300",
    difficulty: "Difícil",
    points: 20,
    question: "¿Quién era el antiguo vicecapitán de los Piratas de Roger, conocido como el 'Rey Oscuro'?",
    options: ["Silvers Rayleigh", "Skopper Gaban", "Crocus", "Douglas Bullet", "Edward Newgate"],
    correct: 0
  },
  {
    anime: "Dragon Ball Z",
    badgeClass: "bg-amber-950/80 border-amber-500 text-amber-300",
    difficulty: "Difícil",
    points: 20,
    question: "¿Cuál es el nombre del fusionado resultante al usar los Pendientes Pothara entre Goku y Vegeta?",
    options: ["Gogeta", "Vegetto", "Gotenks", "Veku", "Gokita"],
    correct: 1
  },
  {
    anime: "Bleach",
    badgeClass: "bg-cyan-950/80 border-cyan-500 text-cyan-300",
    difficulty: "Difícil",
    points: 20,
    question: "¿Quién es el líder original y rey del Seireitei / Wandenreich de los Quincy?",
    options: ["Sosuke Aizen", "Yhwach", "Jugram Haschwalth", "Baraggan Louisenbairn", "Uryu Ishida"],
    correct: 1
  },
  {
    anime: "Naruto Shippuden",
    badgeClass: "bg-orange-950/80 border-orange-500 text-orange-300",
    difficulty: "Difícil",
    points: 20,
    question: "¿Qué técnica prohibida usó Might Guy contra Madara Uchiha abriendo la Octava Puerta de la Muerte?",
    options: ["Hirudora", "Asa Kujaku", "Yagai (Guy Nocturno)", "Omote Renge", "Ura Renge"],
    correct: 2
  }
];

// Estado del Juego
let score = 0;
let lives = 3;
let streak = 0;
let maxStreak = 0;
let correctCount = 0;
let currentQuestionIndex = 0;
let soundEnabled = true;
let availableQuestions = [];

// Audio Web API Synth
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playSound(freq, type = 'sine', duration = 0.1) {
  if (!soundEnabled) return;
  try {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {}
}

function playSuccessSound() {
  playSound(523.25, 'triangle', 0.1);
  setTimeout(() => playSound(659.25, 'triangle', 0.1), 80);
  setTimeout(() => playSound(783.99, 'triangle', 0.2), 160);
}

function playErrorSound() {
  playSound(220, 'sawtooth', 0.15);
  setTimeout(() => playSound(164.81, 'sawtooth', 0.25), 120);
}

// Inicialización de Pantallas y Eventos
document.addEventListener('DOMContentLoaded', () => {
  initParticles();

  document.getElementById('btn-start').addEventListener('click', startGame);
  document.getElementById('btn-restart').addEventListener('click', startGame);
  
  document.getElementById('btn-sound').addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    const icon = document.getElementById('sound-icon');
    icon.className = soundEnabled ? 'fa-solid fa-volume-high' : 'fa-solid fa-volume-xmark text-red-400';
  });
});

// Iniciar Juego
function startGame() {
  score = 0;
  lives = 3;
  streak = 0;
  maxStreak = 0;
  correctCount = 0;
  
  // Mezclar preguntas
  availableQuestions = [...QUESTIONS_DATABASE].sort(() => Math.random() - 0.5);
  currentQuestionIndex = 0;

  updateUI();

  showScreen('screen-quiz');
  loadQuestion();
}

function showScreen(screenId) {
  ['screen-start', 'screen-quiz', 'screen-result'].forEach(id => {
    document.getElementById(id).classList.add('hidden');
  });
  document.getElementById(screenId).classList.remove('hidden');
}

// Cargar Pregunta Actual
function loadQuestion() {
  if (currentQuestionIndex >= availableQuestions.length) {
    // Si se acabaron las preguntas, volver a mezclar
    availableQuestions = [...QUESTIONS_DATABASE].sort(() => Math.random() - 0.5);
    currentQuestionIndex = 0;
  }

  const q = availableQuestions[currentQuestionIndex];

  // UI Tags
  const animeBadge = document.getElementById('ui-anime-badge');
  animeBadge.textContent = q.anime;
  animeBadge.className = `px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${q.badgeClass}`;

  const diffBadge = document.getElementById('ui-difficulty-badge');
  diffBadge.textContent = `+${q.points} PTS (${q.difficulty})`;

  document.getElementById('ui-question').textContent = q.question;

  // Render Opciones
  const optionsContainer = document.getElementById('ui-options');
  optionsContainer.innerHTML = '';

  q.options.forEach((opt, idx) => {
    const btn = document.createElement('button');
    btn.className = "option-btn w-full p-4 rounded-xl text-left font-bold text-sm md:text-base bg-slate-950/70 border border-purple-500/30 hover:border-amber-400 hover:bg-purple-950/40 text-gray-200 flex items-center justify-between cursor-pointer shadow-md";
    btn.innerHTML = `
      <span><strong class="text-amber-400 mr-2">${String.fromCharCode(65 + idx)}.</strong> ${opt}</span>
      <i class="fa-solid fa-chevron-right text-xs text-gray-500"></i>
    `;
    btn.addEventListener('click', () => handleAnswer(idx, btn));
    optionsContainer.appendChild(btn);
  });
}

// Procesar Respuesta
function handleAnswer(selectedIndex, selectedBtn) {
  const q = availableQuestions[currentQuestionIndex];
  const allButtons = document.querySelectorAll('.option-btn');

  // Deshabilitar todos los botones temporalmente
  allButtons.forEach(b => b.style.pointerEvents = 'none');

  if (selectedIndex === q.correct) {
    // CORRECTO
    selectedBtn.classList.add('option-correct');
    playSuccessSound();
    
    score += q.points;
    correctCount++;
    streak++;
    if (streak > maxStreak) maxStreak = streak;

    // Verificar si llegó a 100 PTS
    if (score >= 100) {
      score = 100;
      updateUI();
      setTimeout(showVictory, 1000);
      return;
    }

  } else {
    // INCORRECTO
    selectedBtn.classList.add('option-wrong');
    allButtons[q.correct].classList.add('option-correct');
    playErrorSound();

    lives--;
    streak = 0;

    if (lives <= 0) {
      updateUI();
      setTimeout(showDefeat, 1200);
      return;
    }
  }

  updateUI();

  // Siguiente Pregunta
  setTimeout(() => {
    currentQuestionIndex++;
    loadQuestion();
  }, 1200);
}

// Actualizar UI
function updateUI() {
  document.getElementById('ui-score').innerHTML = `${score} <span class="text-xs text-gray-400">/ 100</span>`;
  
  // Vidas
  const livesContainer = document.getElementById('ui-lives');
  livesContainer.innerHTML = '';
  for (let i = 0; i < 3; i++) {
    if (i < lives) {
      livesContainer.innerHTML += `<i class="fa-solid fa-heart animate-pulse"></i>`;
    } else {
      livesContainer.innerHTML += `<i class="fa-regular fa-heart text-gray-600"></i>`;
    }
  }

  // Barra Progreso
  const percentage = Math.min(100, Math.round((score / 100) * 100));
  document.getElementById('ui-progress-bar').style.width = `${percentage}%`;
  document.getElementById('ui-progress-text').textContent = `${percentage}%`;
}

// Pantalla Victoria
function showVictory() {
  confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });

  const iconContainer = document.getElementById('result-icon-container');
  iconContainer.className = "inline-block p-5 rounded-full mb-4 bg-amber-500/20 border-2 border-amber-400 text-amber-400";
  
  document.getElementById('result-icon').className = "fa-solid fa-trophy text-6xl";
  document.getElementById('result-title').textContent = "¡VICTORIA LEGENDARIA!";
  document.getElementById('result-title').className = "text-3xl md:text-5xl font-black font-['Orbitron'] mb-2 text-amber-400";
  document.getElementById('result-subtitle').textContent = "¡Has alcanzado los 100 Puntos! Demostraste ser un verdadero Maestro Anime.";

  populateResults();
  showScreen('screen-result');
}

// Pantalla Derrota
function showDefeat() {
  const iconContainer = document.getElementById('result-icon-container');
  iconContainer.className = "inline-block p-5 rounded-full mb-4 bg-red-500/20 border-2 border-red-500 text-red-500";
  
  document.getElementById('result-icon').className = "fa-solid fa-skull text-6xl";
  document.getElementById('result-title').textContent = "¡HAS SIDO DERROTADO!";
  document.getElementById('result-title').className = "text-3xl md:text-5xl font-black font-['Orbitron'] mb-2 text-red-500";
  document.getElementById('result-subtitle').textContent = "Te has quedado sin vidas antes de llegar a la meta. ¡Entrena y vuelve a intentarlo!";

  populateResults();
  showScreen('screen-result');
}

function populateResults() {
  document.getElementById('res-score').textContent = score;
  document.getElementById('res-correct').textContent = correctCount;
  document.getElementById('res-streak').textContent = `${maxStreak}🔥`;
}

// Animación de Partículas Ambientales de Fondo
function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  const ctx = canvas.getContext('2d');
  
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = Array.from({ length: 40 }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    radius: Math.random() * 2 + 1,
    speedX: (Math.random() - 0.5) * 0.5,
    speedY: -Math.random() * 0.8 - 0.2,
    alpha: Math.random() * 0.5 + 0.2,
    color: ['#8b5cf6', '#ec4899', '#f59e0b', '#06b6d4'][Math.floor(Math.random() * 4)]
  }));

  function animate() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach(p => {
      p.x += p.speedX;
      p.y += p.speedY;

      if (p.y < 0) {
        p.y = height;
        p.x = Math.random() * width;
      }

      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    requestAnimationFrame(animate);
  }

  animate();
}