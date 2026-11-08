// SINTETIZADOR DE SONIDO (WEB AUDIO API)
const AudioSys = {
  ctx: null,
  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  },
  playShoot() {
    this.init();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(450, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.12);
    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.12);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.12);
  },
  playMelee() {
    this.init();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(120, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.15);
  },
  playHit() {
    this.init();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(200, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(60, this.ctx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.08);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.08);
  },
  playExplosion() {
    this.init();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(30, this.ctx.currentTime + 0.4);
    gain.gain.setValueAtTime(0.4, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.4);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.4);
  },
  playAstral() {
    this.init();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(900, this.ctx.currentTime + 0.3);
    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.3);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.3);
  },
  playVictory() {
    this.init();
    const notes = [261.63, 329.63, 392.00, 523.25];
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.1);
      gain.gain.setValueAtTime(0.2, this.ctx.currentTime + idx * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + idx * 0.1 + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(this.ctx.currentTime + idx * 0.1);
      osc.stop(this.ctx.currentTime + idx * 0.1 + 0.25);
    });
  }
};

// LISTA DE ÍTEMS (12 ÍTEMS)
const ITEMS_DATA = [
  { id: 'sword', icon: '⚔️', name: 'Espada', desc: '+50% de ataque cuerpo a cuerpo' },
  { id: 'gun', icon: '🔫', name: 'Pistola', desc: '+20% de ataque a distancia' },
  { id: 'wool', icon: '🧶', name: 'Lana', desc: 'Atrae al enemigo cuando un proyectil lo daña' },
  { id: 'astral', icon: '🔮', name: 'Esfera Astral', desc: 'Inmune por unos seg. al recibir >40 daño' },
  { id: 'life', icon: '❤️', name: 'Vida', desc: '+50% de vida extra (750 HP)' },
  { id: 'explosive', icon: '💥', name: 'Explosivo', desc: 'El 4° proyectil genera una gran explosión' },
  { id: 'hole', icon: '🕳️', name: 'Hoyo', desc: 'Se achica al sufrir daño; se reinicia si hace >40 daño' },
  { id: 'boots', icon: '🛼', name: 'Patines', desc: '+35% de velocidad de movimiento' },
  { id: 'shield', icon: '🛡️', name: 'Escudo', desc: 'Reduce todo el daño recibido en 20%' },
  { id: 'vampire', icon: '🧛', name: 'Vampiro', desc: 'Recuperas el 25% del daño infligido al oponente' },
  { id: 'thorn', icon: '🌵', name: 'Espina', desc: 'Devuelve un 30% del daño cuerpo a cuerpo al atacante' },
  { id: 'repeater', icon: '⚡', name: 'Repetidor', desc: 'Reduce el tiempo entre disparos un 35%' }
];

let p1SelectedItems = [];
let p2SelectedItems = [];
let gameRunning = false;
let animationFrameId = null;

const screenMenu = document.getElementById('main-menu');
const screenSelect = document.getElementById('select-screen');
const screenGame = document.getElementById('game-screen');
const overlayGameOver = document.getElementById('game-over-overlay');

const btnLocal = document.getElementById('btn-local');
const btnAI = document.getElementById('btn-ai');
const btnStart = document.getElementById('btn-start');
const btnBack = document.getElementById('btn-back');
const btnRestart = document.getElementById('btn-restart');
const btnMenuGo = document.getElementById('btn-menu-go');

const colorP1 = document.getElementById('color-p1');
const colorP2 = document.getElementById('color-p2');
const countP1El = document.getElementById('count-p1');
const countP2El = document.getElementById('count-p2');

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

btnLocal.addEventListener('click', () => {
  AudioSys.init();
  switchScreen(screenSelect);
});

btnBack.addEventListener('click', () => switchScreen(screenMenu));
btnAI.addEventListener('click', () => alert('El modo IA estará disponible en una próxima versión.'));

btnStart.addEventListener('click', () => {
  switchScreen(screenGame);
  initGame();
});

btnRestart.addEventListener('click', () => {
  overlayGameOver.classList.remove('active');
  initGame();
});

btnMenuGo.addEventListener('click', () => {
  overlayGameOver.classList.remove('active');
  switchScreen(screenMenu);
});

function switchScreen(screenToShow) {
  [screenMenu, screenSelect, screenGame].forEach(s => s.classList.remove('active'));
  screenToShow.classList.add('active');
  if (screenToShow !== screenGame) {
    gameRunning = false;
    cancelAnimationFrame(animationFrameId);
  }
}

function buildItemGrid(containerId, selectedArray, countEl) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';
  
  ITEMS_DATA.forEach(item => {
    const btn = document.createElement('button');
    btn.className = 'item-btn';
    btn.innerHTML = `
      <span class="icon">${item.icon}</span>
      <div class="details">
        <span class="name">${item.name}</span>
        <span class="desc">${item.desc}</span>
      </div>
    `;

    btn.addEventListener('click', () => {
      AudioSys.init();
      const idx = selectedArray.indexOf(item.id);
      if (idx >= 0) {
        selectedArray.splice(idx, 1);
        btn.classList.remove('selected');
      } else {
        if (selectedArray.length < 3) {
          selectedArray.push(item.id);
          btn.classList.add('selected');
        }
      }
      countEl.textContent = selectedArray.length;
    });

    container.appendChild(btn);
  });
}

buildItemGrid('items-p1', p1SelectedItems, countP1El);
buildItemGrid('items-p2', p2SelectedItems, countP2El);

const keys = {};
window.addEventListener('keydown', e => keys[e.code] = true);
window.addEventListener('keyup', e => keys[e.code] = false);

class Player {
  constructor(x, y, color, controls, items, hudHpId, badgesId) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.controls = controls;
    this.items = items;
    this.hudHpId = hudHpId;
    this.badgesId = badgesId;

    this.baseRadius = 26;
    this.radius = this.baseRadius;
    this.vx = 0;
    this.vy = 0;
    
    this.speed = items.includes('boots') ? 0.81 : 0.6;
    this.friction = 0.93;

    this.maxHp = items.includes('life') ? 750 : 500;
    this.hp = this.maxHp;

    this.meleeDamage = items.includes('sword') ? 45 : 30;
    this.rangedDamage = items.includes('gun') ? 30 : 25;
    this.rangedCooldown = items.includes('repeater') ? 220 : 350;

    this.lastMelee = 0;
    this.lastRanged = 0;
    this.shotCount = 0;

    this.damageTakenBuffer = 0;
    this.damageDealtBuffer = 0;

    this.isImmune = false;
    this.immuneTimer = 0;

    this.renderBadges();
  }

  renderBadges() {
    const container = document.getElementById(this.badgesId);
    container.innerHTML = '';
    this.items.forEach(itemId => {
      const item = ITEMS_DATA.find(i => i.id === itemId);
      if (item) {
        const span = document.createElement('span');
        span.textContent = item.icon;
        span.title = item.name;
        container.appendChild(span);
      }
    });
  }

  update() {
    if (keys[this.controls.up]) this.vy -= this.speed;
    if (keys[this.controls.down]) this.vy += this.speed;
    if (keys[this.controls.left]) this.vx -= this.speed;
    if (keys[this.controls.right]) this.vx += this.speed;

    this.vx *= this.friction;
    this.vy *= this.friction;

    this.x += this.vx;
    this.y += this.vy;

    if (this.x - this.radius < 0) { this.x = this.radius; this.vx *= -0.5; }
    if (this.x + this.radius > canvas.width) { this.x = canvas.width - this.radius; this.vx *= -0.5; }
    if (this.y - this.radius < 0) { this.y = this.radius; this.vy *= -0.5; }
    if (this.y + this.radius > canvas.height) { this.y = canvas.height - this.radius; this.vy *= -0.5; }

    if (this.isImmune) {
      this.immuneTimer--;
      if (this.immuneTimer <= 0) {
        this.isImmune = false;
      }
    }

    const hpPct = Math.max(0, (this.hp / this.maxHp) * 100);
    document.getElementById(this.hudHpId).style.width = hpPct + '%';
  }

  receiveDamage(rawAmount, attacker, isMelee = false) {
    if (this.isImmune) return;

    let finalAmount = rawAmount;

    if (this.items.includes('shield')) {
      finalAmount *= 0.8;
    }

    this.hp -= finalAmount;
    if (this.hp < 0) this.hp = 0;

    if (attacker && attacker.items.includes('vampire')) {
      attacker.hp = Math.min(attacker.maxHp, attacker.hp + finalAmount * 0.25);
    }

    if (isMelee && this.items.includes('thorn') && attacker && !attacker.isImmune) {
      attacker.hp -= finalAmount * 0.3;
      if (attacker.hp < 0) attacker.hp = 0;
    }

    if (this.items.includes('hole')) {
      this.radius = Math.max(14, this.radius - finalAmount * 0.05);
    }

    if (this.items.includes('astral')) {
      this.damageTakenBuffer += finalAmount;
      if (this.damageTakenBuffer >= 40) {
        this.isImmune = true;
        this.immuneTimer = 180;
        this.damageTakenBuffer = 0;
        AudioSys.playAstral();
        createRingParticle(this.x, this.y, '#9933ff');
      }
    }

    if (attacker && attacker.items.includes('hole')) {
      attacker.damageDealtBuffer += finalAmount;
      if (attacker.damageDealtBuffer >= 40) {
        attacker.radius = attacker.baseRadius;
        attacker.damageDealtBuffer = 0;
        createRingParticle(attacker.x, attacker.y, '#ffffff');
      }
    }
  }

  draw() {
    ctx.save();
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 15;
    ctx.fill();
    ctx.closePath();

    if (this.isImmune) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius + 6, 0, Math.PI * 2);
      ctx.strokeStyle = '#a64dff';
      ctx.lineWidth = 4;
      ctx.shadowColor = '#a64dff';
      ctx.shadowBlur = 20;
      ctx.stroke();
      ctx.closePath();
    } else if (this.items.includes('shield')) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius + 4, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.closePath();
    }

    ctx.restore();
  }
}

let projectiles = [];
let particles = [];

class Projectile {
  constructor(x, y, vx, vy, owner, isExplosive) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.owner = owner;
    this.isExplosive = isExplosive;
    this.radius = isExplosive ? 9 : 5;
    this.active = true;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
      this.active = false;
    }
  }

  draw() {
    ctx.save();
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.isExplosive ? '#ff6600' : this.owner.color;
    ctx.shadowColor = this.isExplosive ? '#ff0000' : this.owner.color;
    ctx.shadowBlur = 10;
    ctx.fill();
    ctx.closePath();
    ctx.restore();
  }
}

class Particle {
  constructor(x, y, color, size, vx, vy, life) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.size = size;
    this.vx = vx;
    this.vy = vy;
    this.life = life;
    this.maxLife = life;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.life--;
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = this.life / this.maxLife;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
    ctx.restore();
  }
}

function createSparks(x, y, color, count = 10) {
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 4 + 1;
    particles.push(new Particle(
      x, y, color,
      Math.random() * 3 + 2,
      Math.cos(angle) * speed,
      Math.sin(angle) * speed,
      Math.floor(Math.random() * 20 + 10)
    ));
  }
}

function createRingParticle(x, y, color) {
  for (let i = 0; i < 20; i++) {
    const angle = (i / 20) * Math.PI * 2;
    const speed = 3;
    particles.push(new Particle(
      x, y, color, 4,
      Math.cos(angle) * speed,
      Math.sin(angle) * speed,
      25
    ));
  }
}

let player1, player2;

function initGame() {
  projectiles = [];
  particles = [];

  player1 = new Player(
    150, canvas.height / 2,
    colorP1.value,
    { up: 'KeyW', down: 'KeyS', left: 'KeyA', right: 'KeyD', melee: 'KeyE', shoot: 'KeyQ' },
    [...p1SelectedItems],
    'hp-p1', 'badges-p1'
  );

  player2 = new Player(
    canvas.width - 150, canvas.height / 2,
    colorP2.value,
    { up: 'ArrowUp', down: 'ArrowDown', left: 'ArrowLeft', right: 'ArrowRight', melee: 'KeyK', shoot: 'KeyL' },
    [...p2SelectedItems],
    'hp-p2', 'badges-p2'
  );

  const barP1 = document.getElementById('hp-p1');
  const barP2 = document.getElementById('hp-p2');
  
  barP1.style.backgroundColor = colorP1.value;
  barP1.style.boxShadow = `0 0 10px ${colorP1.value}`;
  
  barP2.style.backgroundColor = colorP2.value;
  barP2.style.boxShadow = `0 0 10px ${colorP2.value}`;

  gameRunning = true;
  gameLoop(performance.now());
}

function gameLoop(timestamp) {
  if (!gameRunning) return;

  update(timestamp);
  render();

  if (player1.hp <= 0 || player2.hp <= 0) {
    endGame();
    return;
  }

  animationFrameId = requestAnimationFrame(gameLoop);
}

function processMeleeAttack(attacker, target, timestamp) {
  if (keys[attacker.controls.melee] && timestamp - attacker.lastMelee > 400) {
    attacker.lastMelee = timestamp;

    const dx = target.x - attacker.x;
    const dy = target.y - attacker.y;
    const dist = Math.hypot(dx, dy);

    AudioSys.playMelee();

    if (dist < attacker.radius + target.radius + 30) {
      target.receiveDamage(attacker.meleeDamage, attacker, true);
      AudioSys.playHit();
      
      const angle = Math.atan2(dy, dx);
      target.vx += Math.cos(angle) * 10;
      target.vy += Math.sin(angle) * 10;

      createSparks((attacker.x + target.x) / 2, (attacker.y + target.y) / 2, '#ffffff', 15);
    }
  }
}

function processShootAttack(attacker, target, timestamp) {
  if (keys[attacker.controls.shoot] && timestamp - attacker.lastRanged > attacker.rangedCooldown) {
    attacker.lastRanged = timestamp;
    attacker.shotCount++;

    let dx = target.x - attacker.x;
    let dy = target.y - attacker.y;
    const dist = Math.hypot(dx, dy) || 1;

    if (dist < 5) {
      dx = attacker.vx || 1;
      dy = attacker.vy || 0;
    }

    const angle = Math.atan2(dy, dx);
    const speed = 9;
    const isExplosive = attacker.items.includes('explosive') && (attacker.shotCount % 4 === 0);

    AudioSys.playShoot();

    projectiles.push(new Projectile(
      attacker.x + Math.cos(angle) * (attacker.radius + 10),
      attacker.y + Math.sin(angle) * (attacker.radius + 10),
      Math.cos(angle) * speed,
      Math.sin(angle) * speed,
      attacker,
      isExplosive
    ));
  }
}

function update(timestamp) {
  player1.update();
  player2.update();

  processMeleeAttack(player1, player2, timestamp);
  processMeleeAttack(player2, player1, timestamp);

  processShootAttack(player1, player2, timestamp);
  processShootAttack(player2, player1, timestamp);

  const dx = player2.x - player1.x;
  const dy = player2.y - player1.y;
  const dist = Math.hypot(dx, dy);
  const minDist = player1.radius + player2.radius;

  if (dist < minDist) {
    const angle = Math.atan2(dy, dx);
    const overlap = minDist - dist;
    
    player1.x -= Math.cos(angle) * overlap * 0.5;
    player1.y -= Math.sin(angle) * overlap * 0.5;
    player2.x += Math.cos(angle) * overlap * 0.5;
    player2.y += Math.sin(angle) * overlap * 0.5;

    const nx = dx / dist;
    const ny = dy / dist;
    const kx = player1.vx - player2.vx;
    const ky = player1.vy - player2.vy;
    const p = 2 * (nx * kx + ny * ky) / 2;

    player1.vx -= p * nx;
    player1.vy -= p * ny;
    player2.vx += p * nx;
    player2.vy += p * ny;
  }

  for (let i = projectiles.length - 1; i >= 0; i--) {
    const proj = projectiles[i];
    proj.update();

    const target = proj.owner === player1 ? player2 : player1;
    const pDist = Math.hypot(proj.x - target.x, proj.y - target.y);

    if (pDist < proj.radius + target.radius) {
      proj.active = false;

      if (proj.isExplosive) {
        target.receiveDamage(proj.owner.rangedDamage * 2.2, proj.owner, false);
        AudioSys.playExplosion();
        createSparks(proj.x, proj.y, '#ff4400', 30);
      } else {
        target.receiveDamage(proj.owner.rangedDamage, proj.owner, false);
        AudioSys.playHit();
        createSparks(proj.x, proj.y, proj.owner.color, 10);
      }

      if (proj.owner.items.includes('wool')) {
        const pullAngle = Math.atan2(proj.owner.y - target.y, proj.owner.x - target.x);
        target.vx += Math.cos(pullAngle) * 9;
        target.vy += Math.sin(pullAngle) * 9;
      }
    }

    if (!proj.active) {
      projectiles.splice(i, 1);
    }
  }

  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    if (particles[i].life <= 0) {
      particles.splice(i, 1);
    }
  }
}

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = 'rgba(69, 162, 158, 0.05)';
  ctx.lineWidth = 1;
  for (let x = 0; x < canvas.width; x += 40) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
  }
  for (let y = 0; y < canvas.height; y += 40) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
  }

  projectiles.forEach(p => p.draw());
  particles.forEach(p => p.draw());
  player1.draw();
  player2.draw();
}

function endGame() {
  gameRunning = false;
  AudioSys.playVictory();
  const winnerText = document.getElementById('winner-text');
  
  if (player1.hp <= 0 && player2.hp <= 0) {
    winnerText.textContent = '¡EMPATE!';
    winnerText.style.color = '#ffffff';
  } else if (player1.hp <= 0) {
    winnerText.textContent = '¡GANA EL JUGADOR 2!';
    winnerText.style.color = player2.color;
  } else {
    winnerText.textContent = '¡GANA EL JUGADOR 1!';
    winnerText.style.color = player1.color;
  }
  overlayGameOver.classList.add('active');
}