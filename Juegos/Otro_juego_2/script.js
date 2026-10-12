const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 1000;
canvas.height = 500;

let p1, p2, projectiles = [], particles = [];
let gameRunning = false;
let selectionStep = 1; 
let p1Choice = null, p2Choice = null;

const keys = {};
const COOLDOWNS = { s1: 400, s2: 2500, s3: 5000 };

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
        this.frozenUntil = 0; // Para el Hielo (Movimiento)
        this.invisibleUntil = 0;
        this.extraDmgUntil = 0;
        this.isCharging = false;
        this.chargeDir = 0;
    }
    draw() {
        const now = Date.now();
        if (now < this.invisibleUntil) ctx.globalAlpha = 0.1;

        // Efecto visual de Congelado (Hielo)
        if (now < this.frozenUntil) {
            ctx.fillStyle = "rgba(173, 216, 230, 0.5)";
            ctx.fillRect(this.x-10, this.y-10, this.w+20, this.h+20);
        }

        // Barrera de Hielo (Ataque 3)
        if (this.type === 'hielo' && now - this.lastAttack.s3 < 3000) {
            ctx.strokeStyle = "#00d2ff";
            ctx.lineWidth = 8;
            ctx.strokeRect(this.x - 20, this.y - 20, this.w + 40, this.h + 40);
        }

        // Efecto visual de daño extra (Hada)
        if (now < this.extraDmgUntil) {
            ctx.shadowBlur = 15;
            ctx.shadowColor = "pink";
        }

        // Efecto visual de silencio (Veneno)
        if (now < this.silencedUntil) {
            ctx.strokeStyle = "purple";
            ctx.lineWidth = 5;
            ctx.strokeRect(this.x-5, this.y-5, this.w+10, this.h+10);
        }

        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.w, this.h);
        
        if (this.isCharging) {
            ctx.font = "30px Arial";
            ctx.fillText("🦄", this.x + (this.chargeDir > 0 ? 40 : -30), this.y + 35);
        }

        ctx.fillStyle = "white";
        let target = this.isP1 ? p2 : p1;
        let lookRight = target ? target.x > this.x : this.isP1;
        ctx.fillRect(lookRight ? this.x + 35 : this.x + 5, this.y + 10, 10, 10);
        
        ctx.globalAlpha = 1.0;
        ctx.shadowBlur = 0;

        // Escudo Viento
        if (this.type === 'viento' && now - this.lastAttack.s3 < 3000) {
            this.angle += 0.15;
            let cx = this.x + 25 + Math.cos(this.angle) * 70;
            let cy = this.y + 25 + Math.sin(this.angle) * 70;
            ctx.fillStyle = "#7f8c8d";
            ctx.fillRect(cx - 10, cy - 10, 20, 20);
            if (cx > target.x && cx < target.x + 50 && cy > target.y && cy < target.y + 50) target.hp -= 0.6;
        }
    }
}

function selectCharacter(choice) {
    if (selectionStep === 1) {
        p1Choice = choice;
        selectionStep = 2;
        document.getElementById('turn-indicator').innerText = "Jugador 2: Elige tu personaje";
    } else {
        p2Choice = choice;
        startBattle();
    }
}

function startBattle() {
    p1 = new Entity(150, 250, getColor(p1Choice), p1Choice, true);
    p2 = new Entity(800, 250, getColor(p2Choice), p2Choice, false);
    document.getElementById('selection-screen').style.display = 'none';
    document.getElementById('game-ui').style.display = 'block';
    canvas.style.display = 'block';
    gameRunning = true;
    loop();
}

function getColor(type) {
    const colors = { agua: '#3498db', fuego: '#e67e22', planta: '#27ae60', viento: '#95a5a6', veneno: '#9b59b6', oscuridad: '#555', hada: '#ff9ff3', hielo: '#00d2ff' };
    return colors[type];
}

window.addEventListener('keydown', e => keys[e.code] = true);
window.addEventListener('keyup', e => keys[e.code] = false);

window.addEventListener('keydown', e => {
    if (!gameRunning) return;
    const now = Date.now();
    if (now < p1.silencedUntil && (e.code === 'Digit1' || e.code === 'Digit2' || e.code === 'Digit3')) return;
    if (now < p2.silencedUntil && (e.code === 'KeyJ' || e.code === 'KeyK' || e.code === 'KeyL')) return;

    if (e.code === 'Digit1') tryAttack(p1, 's1');
    if (e.code === 'Digit2') tryAttack(p1, 's2');
    if (e.code === 'Digit3') tryAttack(p1, 's3');
    if (e.code === 'KeyJ') tryAttack(p2, 's1');
    if (e.code === 'KeyK') tryAttack(p2, 's2');
    if (e.code === 'KeyL') tryAttack(p2, 's3');
});

function tryAttack(char, skillSlot) {
    const now = Date.now();
    if (now - char.lastAttack[skillSlot] >= COOLDOWNS[skillSlot]) {
        executeAttack(char, skillSlot);
        char.lastAttack[skillSlot] = now;
    }
}

function executeAttack(char, skillSlot) {
    const enemy = char.isP1 ? p2 : p1;
    const dir = (enemy.x > char.x) ? 1 : -1;
    const spawnX = char.x + (dir === 1 ? 65 : -45);
    const now = Date.now();

    if (char.type === 'hielo') {
        if (skillSlot === 's1') projectiles.push({ x: spawnX, y: char.y, vx: 12 * dir, vy: 0, img: '❄️', dmg: 10, life: 100, owner: char });
        if (skillSlot === 's2') projectiles.push({ x: spawnX, y: char.y, vx: 14 * dir, vy: 0, img: '🧊', dmg: 5, life: 100, owner: char, freeze: true });
        // Ataque 3 es la barrera, visualizada en draw()
    } else if (char.type === 'hada') {
        let extra = (now < char.extraDmgUntil) ? 4 : 0;
        if (skillSlot === 's1') projectiles.push({ x: spawnX, y: char.y, vx: 13 * dir, vy: 0, img: '🌺', dmg: 12 + extra, life: 100, owner: char });
        if (skillSlot === 's2') char.extraDmgUntil = now + 4000;
        if (skillSlot === 's3') { char.isCharging = true; char.chargeDir = dir; }
    } else if (char.type === 'oscuridad') {
        if (skillSlot === 's1') projectiles.push({ x: spawnX, y: char.y, vx: 12 * dir, vy: 0, img: '🌑', dmg: 14, life: 100, owner: char });
        if (skillSlot === 's2') { char.invisibleUntil = now + 2000; setTimeout(() => { char.x = Math.random() * 900; char.y = Math.random() * 400; }, 1900); }
        if (skillSlot === 's3') projectiles.push({ x: spawnX, y: char.y, vx: 15 * dir, vy: 0, img: '🍳', dmg: 5, life: 100, owner: char, swap: true });
    } else if (char.type === 'veneno') {
        if (skillSlot === 's1') projectiles.push({ x: spawnX, y: char.y, vx: 14 * dir, vy: 0, img: '🟣', dmg: 12, life: 100, owner: char });
        if (skillSlot === 's2') projectiles.push({ x: spawnX, y: char.y, vx: 16 * dir, vy: 0, img: '💜', dmg: 5, life: 100, owner: char, silence: true });
        if (skillSlot === 's3') projectiles.push({ x: char.x, y: char.y, vx: 0, vy: 0, img: '🟪', dmg: 30, life: 500, owner: char, mine: true });
    } else if (char.type === 'viento') {
        if (skillSlot === 's1') projectiles.push({ x: spawnX, y: char.y, vx: 16 * dir, vy: 0, img: '🌫️', dmg: 10, life: 100, owner: char });
        if (skillSlot === 's2') projectiles.push({ x: spawnX, y: char.y - 10, vx: 7 * dir, vy: 0, img: '🌪️', dmg: 2, life: 100, owner: char, push: true });
    } else if (char.type === 'planta') {
        if (skillSlot === 's1') projectiles.push({ x: spawnX, y: char.y, vx: 12 * dir, vy: 0, img: '☘️', dmg: 15, life: 100, owner: char });
        if (skillSlot === 's2') projectiles.push({ x: spawnX, y: char.y, vx: 18 * dir, vy: 0, img: '🌿', dmg: 2, life: 30, owner: char, pull: true });
        if (skillSlot === 's3') projectiles.push({ x: spawnX, y: char.y, vx: 0, vy: 0, img: '🌸', dmg: 35, life: 15, owner: char });
    } else if (char.type === 'agua') {
        if (skillSlot === 's1') projectiles.push({ x: spawnX, y: char.y, vx: 15 * dir, vy: 0, img: '💦', dmg: 12, life: 100, owner: char });
        if (skillSlot === 's2') { char.x += 180 * dir; projectiles.push({ x: char.x - (90 * dir), y: char.y, vx: 0, vy: 0, img: '🌊', dmg: 15, life: 12, owner: char }); }
        if (skillSlot === 's3') {
            let tx = char.x + 280 * dir, ty = char.y;
            setTimeout(() => {
                for(let i=0; i<30; i++) particles.push({x: tx + 20, y: ty + 20, vx: Math.random()*10-5, vy: Math.random()*10-5, life: 30, color: '#3498db'});
                if (Math.hypot(tx - enemy.x, ty - enemy.y) < 100) enemy.hp -= 35;
            }, 1500);
        }
    } else if (char.type === 'fuego') {
        if (skillSlot === 's1') projectiles.push({ x: spawnX, y: char.y, vx: 15 * dir, vy: 0, img: '🔥', dmg: 12, life: 100, owner: char });
        if (skillSlot === 's2') projectiles.push({ x: spawnX, y: char.y, vx: 0, vy: 0, img: '🟧', dmg: 25, life: 10, owner: char });
        if (skillSlot === 's3') projectiles.push({ x: enemy.x, y: -60, vx: 0, vy: 8, img: '☄️', dmg: 40, life: 200, owner: char });
    }
}

function drawCooldowns(char, x, y) {
    const now = Date.now();
    const icons = { agua:['💦','🌊','⛲'], fuego:['🔥','🟧','☄️'], planta:['☘️','🌿','🌸'], viento:['🌫️','🌪️','⬛'], veneno:['🟣','💜','🟪'], oscuridad:['🌑','👥','🍳'], hada:['🌺','🍄','🦄'], hielo:['❄️','🧊','🟦'] };
    const set = icons[char.type];
    [0,1,2].forEach(i => {
        const bx = x + (i * 75), sid = 's' + (i+1);
        const progress = Math.min(1, (now - char.lastAttack[sid]) / COOLDOWNS[sid]);
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

    // Lógica Movimiento P1
    if (now > p1.frozenUntil && !p1.isCharging) {
        if (keys['KeyW'] && p1.y > 0) p1.y -= 6;
        if (keys['KeyS'] && p1.y < 450) p1.y += 6;
        if (keys['KeyA'] && p1.x > 0) p1.x -= 6;
        if (keys['KeyD'] && p1.x < 950) p1.x += 6;
    } else if (p1.isCharging) {
        p1.x += 8 * p1.chargeDir;
        if (p1.x < 0 || p1.x > 950) p1.isCharging = false;
    }

    // Lógica Movimiento P2
    if (now > p2.frozenUntil && !p2.isCharging) {
        if (keys['ArrowUp'] && p2.y > 0) p2.y -= 6;
        if (keys['ArrowDown'] && p2.y < 450) p2.y += 6;
        if (keys['ArrowLeft'] && p2.x > 0) p2.x -= 6;
        if (keys['ArrowRight'] && p2.x < 950) p2.x += 6;
    } else if (p2.isCharging) {
        p2.x += 8 * p2.chargeDir;
        if (p2.x < 0 || p2.x > 950) p2.isCharging = false;
    }

    p1.draw(); p2.draw();
    drawCooldowns(p1, 50, 450);
    drawCooldowns(p2, 730, 450);

    ctx.font = "40px Arial";
    for (let i = projectiles.length - 1; i >= 0; i--) {
        let p = projectiles[i];
        p.x += p.vx; p.y += p.vy; p.life--;
        ctx.fillText(p.img, p.x, p.y + 40);
        
        let target = (p.owner === p1) ? p2 : p1;
        let owner = p.owner;

        // Barrera de Hielo Bloquea Proyectiles
        if (target.type === 'hielo' && now - target.lastAttack.s3 < 3000) {
            if (p.x < target.x + 90 && p.x + 40 > target.x - 40 && p.y < target.y + 90 && p.y + 40 > target.y - 40) {
                p.life = 0; continue;
            }
        }

        // Colisión Proyectil vs Jugador
        if (p.x < target.x + 50 && p.x + 40 > target.x && p.y < target.y + 50 && p.y + 40 > target.y) {
            if (p.freeze) target.frozenUntil = Date.now() + 3000;
            if (p.push) target.x += p.vx * 1.3;
            if (p.pull) { target.x += (owner.x - target.x) * 0.15; target.y += (owner.y - target.y) * 0.15; }
            if (p.silence) target.silencedUntil = Date.now() + 3000;
            if (p.swap) { let tx=owner.x, ty=owner.y; owner.x=target.x; owner.y=target.y; target.x=tx; target.y=ty; }
            
            target.hp -= (p.img === '🌊' || p.img === '🟧' || p.img === '🌸' || p.img === '🌪️' || p.mine) ? 1.5 : p.dmg;
            if (!p.pull && !p.push && !p.mine && !p.freeze && p.img !== '🌊' && p.img !== '🟧' && p.img !== '🌸' && p.img !== '🌪️') p.life = 0;
            if (p.mine || p.swap || p.freeze) p.life = 0;
        }

        if (p.life <= 0 || p.x < -100 || p.x > 1100 || p.y > 600) projectiles.splice(i, 1);
    }

    // Colisión entre jugadores
    if (Math.abs(p1.x - p2.x) < 50 && Math.abs(p1.y - p2.y) < 50) {
        if (p1.isCharging) { p1.isCharging = false; p2.hp -= 20; }
        if (p2.isCharging) { p2.isCharging = false; p1.hp -= 20; }
    }

    document.getElementById('p1-hp').innerText = Math.max(0, Math.ceil(p1.hp));
    document.getElementById('p2-hp').innerText = Math.max(0, Math.ceil(p2.hp));

    if (p1.hp <= 0 || p2.hp <= 0) {
        gameRunning = false;
        alert(p1.hp <= 0 ? "¡VICTORIA PARA P2!" : "¡VICTORIA PARA P1!");
        location.reload();
    }
    requestAnimationFrame(loop);
}