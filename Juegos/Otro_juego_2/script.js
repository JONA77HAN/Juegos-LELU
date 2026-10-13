const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let p1, p2, projectiles = [], particles = [];
let gameRunning = false;
let selectionStep = 1; 
let p1Choice = null, p2Choice = null;
let mobileModeActive = false;

const keys = {};

function toggleMobileMode() {
    mobileModeActive = !mobileModeActive;
    const btn = document.getElementById('mobile-mode-btn');
    if (mobileModeActive) {
        btn.innerText = "🖥️ Modo Celular: ACTIVADO";
        btn.style.background = "#1f6feb";
    } else {
        btn.innerText = "📱 Activar Modo Celular";
        btn.style.background = "#238636";
    }
}

function pressKey(code, isDown) {
    keys[code] = isDown;
}

function triggerTouchAttack(char, skillSlot) {
    if (!gameRunning) return;
    const now = Date.now();
    if (now < char.silencedUntil) return;
    tryAttack(char, skillSlot);
}

// --- CONFIGURACIÓN DE RECARGAS ---
const DEFAULT_CD = { s1: 400, s2: 2500, s3: 5000 };
const SPIDER_CD  = { s1: 300, s2: 800, s3: 8000 };
const ELECTRIC_CD = { s1: 350, s2: 3000, s3: 1500 }; 
const ALMA_CD     = { s1: 450, s2: 6000, s3: 15000 };
const DRAGON_CD   = { s1: 300, s2: 7000, s3: 4000 };
const PORTAL_CD   = { s1: 400, s2: 4000, s3: 6000 };

class Entity {
    constructor(x, y, color, type, isP1) {
        this.x = x; this.y = y;
        this.w = 50; this.h = 50;
        this.color = color;
        this.type = type;
        this.isP1 = isP1;
        this.hp = 100;
        this.lastAttack = { s1: 0, s2: 0, s3: 0 };
        this.angle = 0; 
        this.silencedUntil = 0; 
        this.frozenUntil = 0;
        this.slowedUntil = 0;
        this.speedBoostUntil = 0;
        this.invisibleUntil = 0;
        this.extraDmgUntil = 0;
        this.possessedUntil = 0;
        this.isCharging = false;
        this.chargeDir = 0;
        this.isFlying = false;
        this.lastTP = 0;
    }

    draw() {
        const now = Date.now();
        if (now < this.invisibleUntil || this.isFlying) ctx.globalAlpha = 0.3;

        // Visualización de Congelado
        if (now < this.frozenUntil && !this.isFlying) {
            ctx.fillStyle = "rgba(173, 216, 230, 0.6)";
            ctx.fillRect(this.x-10, this.y-10, this.w+20, this.h+20);
        }

        // Visualización de Posesión (Alma)
        if (now < this.possessedUntil) {
            ctx.shadowBlur = 15; ctx.shadowColor = "#70a1ff";
            ctx.strokeStyle = "#70a1ff"; ctx.lineWidth = 4;
            ctx.strokeRect(this.x-8, this.y-8, this.w+16, this.h+16);
        }

        // --- CORRECCIÓN: BARRERA DE HIELO (HIELO S3) ---
        if (this.type === 'hielo' && now - this.lastAttack.s3 < 3000) {
            ctx.strokeStyle = "#00d2ff"; 
            ctx.lineWidth = 6;
            ctx.shadowBlur = 15;
            ctx.shadowColor = "#00d2ff";
            ctx.beginPath();
            ctx.arc(this.x + 25, this.y + 25, 45, 0, Math.PI * 2);
            ctx.stroke();
            ctx.fillStyle = "rgba(0, 210, 255, 0.2)";
            ctx.fill();
            ctx.shadowBlur = 0;
        }

        // Visualización del Escudo de Pan (Portal S3)
        if (this.type === 'portal' && now - this.lastAttack.s3 < 2000) {
            ctx.strokeStyle = "#1abc9c"; ctx.lineWidth = 5;
            let target = (this.isP1 ? p2 : p1);
            let dir = target.x > this.x ? 1 : -1;
            ctx.strokeRect(this.x + (dir * 60), this.y - 10, 10, 70);
        }

        // Dibujo del Personaje Base
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.w, this.h);
        
        // --- CORRECCIÓN: UNICORNIO DE HADA VISIBLE (HADA S3) ---
        if (this.isCharging) {
            ctx.font = "45px Arial";
            let offset = this.chargeDir > 0 ? 30 : -45;
            ctx.fillText("🦄", this.x + offset, this.y + 40);
        }

        // Ojos
        ctx.fillStyle = "white";
        let target = this.isP1 ? p2 : p1;
        let lookRight = target ? target.x > this.x : this.isP1;
        ctx.fillRect(lookRight ? this.x + 35 : this.x + 5, this.y + 10, 10, 10);
        ctx.globalAlpha = 1.0; ctx.shadowBlur = 0;
    }
}

function selectCharacter(choice) {
    if (selectionStep === 1) { 
        p1Choice = choice; selectionStep = 2; 
        document.getElementById('turn-indicator').innerText = "Jugador 2: Elige tu personaje"; 
    } else { 
        p2Choice = choice; startBattle(); 
    }
}

function startBattle() {
    p1 = new Entity(150, 250, getColor(p1Choice), p1Choice, true);
    p2 = new Entity(800, 250, getColor(p2Choice), p2Choice, false);
    document.getElementById('selection-screen').style.display = 'none';
    document.getElementById('game-ui').style.display = 'block';
    canvas.style.display = 'block';
    
    if (mobileModeActive) {
        document.getElementById('mobile-controls').style.display = 'flex';
    }

    gameRunning = true;
    loop();
}

function getColor(type) {
    const colors = { agua:'#3498db', fuego:'#e67e22', planta:'#27ae60', viento:'#95a5a6', veneno:'#9b59b6', oscuridad:'#485460', hada:'#ff7675', hielo:'#00d2ff', araña:'#2f3542', electrico:'#f1c40f', alma:'#a4b0be', dragon:'#c0392b', portal:'#1abc9c' };
    return colors[type];
}

window.addEventListener('keydown', e => keys[e.code] = true);
window.addEventListener('keyup', e => keys[e.code] = false);

window.addEventListener('keydown', e => {
    if (!gameRunning) return;
    const now = Date.now();
    if (now < p1.silencedUntil && (e.code==='Digit1'||e.code==='Digit2'||e.code==='Digit3')) return;
    if (now < p2.silencedUntil && (e.code==='KeyJ'||e.code==='KeyK'||e.code==='KeyL')) return;

    if (e.code === 'Digit1') tryAttack(p1, 's1');
    if (e.code === 'Digit2') tryAttack(p1, 's2');
    if (e.code === 'Digit3') tryAttack(p1, 's3');
    if (e.code === 'KeyJ') tryAttack(p2, 's1');
    if (e.code === 'KeyK') tryAttack(p2, 's2');
    if (e.code === 'KeyL') tryAttack(p2, 's3');
});

function tryAttack(char, skillSlot) {
    const now = Date.now();
    let cds = DEFAULT_CD;
    if (char.type === 'araña') cds = SPIDER_CD;
    if (char.type === 'electrico') cds = ELECTRIC_CD;
    if (char.type === 'alma') cds = ALMA_CD;
    if (char.type === 'dragon') cds = DRAGON_CD;
    if (char.type === 'portal') cds = PORTAL_CD;

    if (now - char.lastAttack[skillSlot] >= cds[skillSlot]) {
        executeAttack(char, skillSlot);
        char.lastAttack[skillSlot] = now;
    }
}

function executeAttack(char, skillSlot) {
    const enemy = char.isP1 ? p2 : p1;
    const dir = (enemy.x > char.x) ? 1 : -1;
    const spawnX = char.x + (dir === 1 ? 65 : -45);
    const now = Date.now();

    if (char.type === 'planta') {
        if (skillSlot === 's1') projectiles.push({ x: spawnX, y: char.y, vx: 12 * dir, vy: 0, img: '☘️', dmg: 15, life: 100, owner: char });
        // --- CORRECCIÓN: ATAQUE 2 PLANTA (LIANA/PULL) ---
        if (skillSlot === 's2') projectiles.push({ x: spawnX, y: char.y, vx: 16 * dir, vy: 0, img: '🌿', dmg: 5, life: 80, owner: char, pull: true });
        if (skillSlot === 's3') projectiles.push({ x: spawnX, y: char.y, vx: 0, vy: 0, img: '🌸', dmg: 40, life: 15, owner: char });
    } else if (char.type === 'hada') {
        let extra = (now < char.extraDmgUntil) ? 6 : 0;
        if (skillSlot === 's1') projectiles.push({ x: spawnX, y: char.y, vx: 13 * dir, vy: 0, img: '🌺', dmg: 12 + extra, life: 100, owner: char });
        if (skillSlot === 's2') char.extraDmgUntil = now + 4000;
        // --- CORRECCIÓN: ACTIVACIÓN DE CÁRGA UNICORNIO (HADA S3) ---
        if (skillSlot === 's3') { char.isCharging = true; char.chargeDir = dir; }
    } else if (char.type === 'hielo') {
        if (skillSlot === 's1') projectiles.push({ x: spawnX, y: char.y, vx: 12 * dir, vy: 0, img: '❄️', dmg: 10, life: 100, owner: char });
        if (skillSlot === 's2') projectiles.push({ x: spawnX, y: char.y, vx: 14 * dir, vy: 0, img: '🧊', dmg: 5, life: 100, owner: char, freeze: true });
        if (skillSlot === 's3') { /* La barrera de hielo se renderiza en draw() y bloquea proyectiles en loop() */ }
    } else if (char.type === 'portal') {
        if (skillSlot === 's1') projectiles.push({ x: spawnX, y: char.y, vx: 12 * dir, vy: 0, img: '🎐', dmg: 14, life: 100, owner: char });
        if (skillSlot === 's2') {
            let exitX = Math.random() * 800 + 100;
            let exitY = Math.random() * 300 + 100;
            projectiles.push({ x: char.x, y: char.y + 60, vx: 0, vy: 0, img: '🌀', life: 350, owner: char, isPortal: true, partnerX: exitX, partnerY: exitY - 60 });
            projectiles.push({ x: exitX, y: exitY, vx: 0, vy: 0, img: '🌀', life: 350, owner: char, isPortal: true, partnerX: char.x, partnerY: char.y });
        }
    } else if (char.type === 'dragon') {
        if (skillSlot === 's1') projectiles.push({ x: spawnX, y: char.y, vx: 9 * dir, vy: 0, img: '🔥', dmg: 16, life: 25, owner: char });
        if (skillSlot === 's2') {
            char.isFlying = true; char.invisibleUntil = now + 3000;
            let groundY = char.y; char.y -= 120;
            for(let i=0; i<8; i++) {
                setTimeout(() => { projectiles.push({ x: char.x + (i*dir*35), y: groundY, vx: 0, vy: 0, img: '🔺', dmg: 6, life: 240, owner: char, fireLine: true }); }, i * 250);
            }
            setTimeout(() => { char.isFlying = false; char.y += 120; }, 3000);
        }
        if (skillSlot === 's3') projectiles.push({ x: spawnX, y: char.y, vx: 13 * dir, vy: 0, img: '🔥', dmg: 22, life: 100, owner: char, destroyer: true });
    } else if (char.type === 'alma') {
        if (skillSlot === 's1') projectiles.push({ x: spawnX, y: char.y, vx: 11 * dir, vy: 0, img: '🔹', dmg: 12, life: 100, owner: char });
        if (skillSlot === 's2') projectiles.push({ x: spawnX, y: char.y, vx: 9 * dir, vy: 0, img: '💙', dmg: 5, life: 100, owner: char, possess: true });
        if (skillSlot === 's3') projectiles.push({ x: spawnX, y: char.y, vx: 0, vy: 0, img: '👻', dmg: 0.8, life: 600, owner: char, homing: true });
    } else if (char.type === 'electrico') {
        if (skillSlot === 's1') projectiles.push({ x: spawnX, y: char.y, vx: 18 * dir, vy: 0, img: '🧽', dmg: 10, life: 100, owner: char });
        if (skillSlot === 's2') projectiles.push({ x: spawnX, y: char.y - 15, vx: 25 * dir, vy: 0, img: '💡', dmg: 25, life: 80, owner: char, laser: true });
        if (skillSlot === 's3') { [[-5,-5],[5,-5],[-5,5],[5,5]].forEach(v => { projectiles.push({ x: char.x+20, y: char.y+20, vx: v[0], vy: v[1], img: '🟡', dmg: 5, life: 120, owner: char }); }); }
    } else if (char.type === 'araña') {
        if (skillSlot === 's1') projectiles.push({ x: spawnX, y: char.y, vx: 14 * dir, vy: 0, img: '🕸️', dmg: 8, life: 100, owner: char });
        if (skillSlot === 's2') projectiles.push({ x: spawnX, y: char.y, vx: 10 * dir, vy: 0, img: '🕸️', dmg: 2, life: 120, owner: char, slow: true });
        if (skillSlot === 's3') char.speedBoostUntil = now + 3000;
    } else if (char.type === 'oscuridad') {
        if (skillSlot === 's1') projectiles.push({ x: spawnX, y: char.y, vx: 12 * dir, vy: 0, img: '🌑', dmg: 14, life: 100, owner: char });
        if (skillSlot === 's2') { char.invisibleUntil = now + 2000; setTimeout(() => { char.x = Math.random() * 800; char.y = Math.random() * 400; }, 1900); }
        if (skillSlot === 's3') projectiles.push({ x: spawnX, y: char.y, vx: 15 * dir, vy: 0, img: '🍳', dmg: 5, life: 100, owner: char, swap: true });
    } else if (char.type === 'veneno') {
        if (skillSlot === 's1') projectiles.push({ x: spawnX, y: char.y, vx: 14 * dir, vy: 0, img: '🟣', dmg: 12, life: 100, owner: char });
        if (skillSlot === 's2') projectiles.push({ x: spawnX, y: char.y, vx: 16 * dir, vy: 0, img: '💜', dmg: 5, life: 100, owner: char, silence: true });
        if (skillSlot === 's3') projectiles.push({ x: char.x, y: char.y, vx: 0, vy: 0, img: '🟪', dmg: 35, life: 500, owner: char, mine: true });
    } else if (char.type === 'viento') {
        if (skillSlot === 's1') projectiles.push({ x: spawnX, y: char.y, vx: 16 * dir, vy: 0, img: '🌫️', dmg: 10, life: 100, owner: char });
        if (skillSlot === 's2') projectiles.push({ x: spawnX, y: char.y - 10, vx: 7 * dir, vy: 0, img: '🌪️', dmg: 2, life: 100, owner: char, push: true });
    } else if (char.type === 'agua') {
        if (skillSlot === 's1') projectiles.push({ x: spawnX, y: char.y, vx: 15 * dir, vy: 0, img: '💦', dmg: 12, life: 100, owner: char });
        if (skillSlot === 's2') { char.x += 180 * dir; projectiles.push({ x: char.x - (90 * dir), y: char.y, vx: 0, vy: 0, img: '🌊', dmg: 15, life: 12, owner: char }); }
        if (skillSlot === 's3') { let tx = char.x + 280 * dir, ty = char.y; setTimeout(() => { if (Math.hypot(tx - enemy.x, ty - enemy.y) < 100) enemy.hp -= 35; }, 1500); }
    } else if (char.type === 'fuego') {
        if (skillSlot === 's1') projectiles.push({ x: spawnX, y: char.y, vx: 15 * dir, vy: 0, img: '🔥', dmg: 12, life: 100, owner: char });
        if (skillSlot === 's2') projectiles.push({ x: spawnX, y: char.y, vx: 0, vy: 0, img: '🟧', dmg: 25, life: 15, owner: char });
        if (skillSlot === 's3') projectiles.push({ x: enemy.x, y: -60, vx: 0, vy: 8, img: '☄️', dmg: 40, life: 200, owner: char });
    }
}

function drawCooldowns(char, x, y) {
    const now = Date.now();
    const icons = { agua:['💦','🌊','⛲'], fuego:['🔥','🟧','☄️'], planta:['☘️','🌿','🌸'], viento:['🌫️','🌪️','⬛'], veneno:['🟣','💜','🟪'], oscuridad:['🌑','👥','🍳'], hada:['🌺','🍄','🦄'], hielo:['❄️','🧊','🟦'], araña:['🕸️','🕸️','⚡'], electrico:['🧽','💡','🟡'], alma:['🔹','💙','👻'], dragon:['🔥','🔺','🔥'], portal:['🎐','🌀','🍞'] };
    let cds = DEFAULT_CD;
    if (char.type === 'araña') cds = SPIDER_CD;
    if (char.type === 'electrico') cds = ELECTRIC_CD;
    if (char.type === 'alma') cds = ALMA_CD;
    if (char.type === 'dragon') cds = DRAGON_CD;
    if (char.type === 'portal') cds = PORTAL_CD;
    
    const set = icons[char.type];
    [0,1,2].forEach(i => {
        const bx = x + (i * 75), sid = 's' + (i+1);
        const progress = Math.min(1, (now - char.lastAttack[sid]) / cds[sid]);
        ctx.fillStyle = "#333"; ctx.fillRect(bx, y, 60, 6);
        ctx.fillStyle = (now < char.silencedUntil) ? "#8e44ad" : (progress === 1 ? "#2ecc71" : "#f1c40f");
        ctx.fillRect(bx, y, 60 * progress, 6);
        ctx.font = "20px Arial"; ctx.fillText(set[i], bx + 15, y + 25);
    });
}

function loop() {
    if (!gameRunning) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const now = Date.now();

    function move(p) {
        if (now < p.frozenUntil || p.isCharging) return;
        let speed = (now < p.slowedUntil) ? 2 : (now < p.speedBoostUntil ? 12 : 6);
        let up = (p === p1) ? 'KeyW' : 'ArrowUp', down = (p === p1) ? 'KeyS' : 'ArrowDown', left = (p === p1) ? 'KeyA' : 'ArrowLeft', right = (p === p1) ? 'KeyD' : 'ArrowRight';
        if (now < p.possessedUntil) { [up, down] = [down, up]; [left, right] = [right, left]; }
        if (keys[up] && p.y > 0) p.y -= speed;
        if (keys[down] && p.y < 450) p.y += speed;
        if (keys[left] && p.x > 0) p.x -= speed;
        if (keys[right] && p.x < 950) p.x += speed;
    }

    move(p1); move(p2);

    // --- CORRECCIÓN: MOVIMIENTO Y COLISIÓN DEL EMBISTE EN UNICORNIO (HADA S3) ---
    [p1, p2].forEach(p => {
        if (p.isCharging) {
            p.x += 12 * p.chargeDir;
            let enemy = (p === p1) ? p2 : p1;
            if (Math.hypot(p.x - enemy.x, p.y - enemy.y) < 50) {
                enemy.hp -= 30;
                p.isCharging = false;
            }
            if (p.x < 0 || p.x > 950) p.isCharging = false;
        }
    });

    p1.draw(); p2.draw();
    drawCooldowns(p1, 50, 450);
    drawCooldowns(p2, 730, 450);

    for (let i = projectiles.length - 1; i >= 0; i--) {
        let p = projectiles[i];
        let target = (p.owner === p1) ? p2 : p1;

        if (p.isPortal) {
            [p1, p2].forEach(player => {
                if (Math.hypot(player.x - p.x, player.y - p.y) < 30 && now - player.lastTP > 500) {
                    player.x = p.partnerX; player.y = p.partnerY;
                    player.lastTP = now;
                    p.life = 0;
                }
            });
        }

        let pEnemy = p.owner.isP1 ? p2 : p1;
        if (pEnemy.type === 'portal' && now - pEnemy.lastAttack.s3 < 2000) {
            let pDir = (pEnemy.isP1 ? p2 : p1).x > pEnemy.x ? 1 : -1;
            let shieldX = pEnemy.x + (pDir * 60);
            if (p.x > shieldX - 20 && p.x < shieldX + 20 && Math.abs(p.y - pEnemy.y) < 60) {
                p.img = '🍞'; p.owner = pEnemy; p.vx *= -1.5; p.dmg = 20; p.isPortal = false;
            }
        }

        if (p.homing) { let dx = target.x - p.x, dy = target.y - p.y, dist = Math.sqrt(dx*dx + dy*dy); p.vx = (dx/dist) * 3.5; p.vy = (dy/dist) * 3.5; }
        if (p.destroyer) { for (let j = projectiles.length-1; j >= 0; j--) { let o = projectiles[j]; if (o !== p && o.owner !== p.owner && Math.hypot(p.x-o.x, p.y-o.y) < 50) { projectiles.splice(j, 1); if (j < i) i--; } } }

        p.x += p.vx; p.y += p.vy; p.life--;
        ctx.font = p.laser ? "60px Arial" : "40px Arial"; ctx.fillText(p.img, p.x, p.y + 40);
        
        // BARRERA DE HIELO (BLOQUEO DE PROYECTILES)
        let isHitBlocked = (target.type === 'hielo' && now - target.lastAttack.s3 < 3000) || target.isFlying;
        if (isHitBlocked) { 
            if (Math.hypot((target.x + 25) - p.x, (target.y + 25) - p.y) < 55) { 
                p.life = 0; 
                continue; 
            } 
        }

        if (p.x < target.x + 50 && p.x + 40 > target.x && p.y < target.y + 50 && p.y + 40 > target.y) {
            if (p.possess) target.possessedUntil = now + 5000;
            if (p.slow) target.slowedUntil = now + 3000;
            if (p.freeze) target.frozenUntil = now + 3000;
            if (p.silence) target.silencedUntil = now + 3000;
            
            // --- CORRECCIÓN: LÓGICA DE ATRACCIÓN / LIANA PLANTA ---
            if (p.pull) {
                target.x += (p.owner.x - target.x) * 0.6;
                target.y += (p.owner.y - target.y) * 0.6;
            }

            target.hp -= p.dmg; 
            if (!p.homing && !p.fireLine && !p.isPortal) p.life = 0;
        }
        if (p.life <= 0 || p.x < -200 || p.x > 1200) projectiles.splice(i, 1);
    }

    document.getElementById('p1-hp').innerText = Math.max(0, Math.ceil(p1.hp));
    document.getElementById('p2-hp').innerText = Math.max(0, Math.ceil(p2.hp));
    if (p1.hp <= 0 || p2.hp <= 0) { gameRunning = false; alert("¡VICTORIA!"); location.reload(); }
    requestAnimationFrame(loop);
}